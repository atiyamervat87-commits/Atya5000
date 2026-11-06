#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ATTYA LEGAL MIND — MODEL ARCHITECTURE
Decoder-only Transformer: 552,704 parameters, 2 layers, 4 attention heads, d_model=128, vocab=545, context=128
"""

import math
from typing import Optional, Tuple, Dict, Any

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False


class AttyaLegalMindConfig:
    def __init__(
        self,
        vocab_size: int = 545,
        d_model: int = 128,
        n_layers: int = 2,
        n_heads: int = 4,
        d_ff: int = 512,
        max_seq_len: int = 128,
        dropout: float = 0.1,
        bias: bool = True,
        lm_head_bias: bool = False,
    ):
        self.vocab_size = vocab_size
        self.d_model = d_model
        self.n_layers = n_layers
        self.n_heads = n_heads
        self.d_ff = d_ff
        self.max_seq_len = max_seq_len
        self.dropout = dropout
        self.bias = bias
        self.lm_head_bias = lm_head_bias

    @staticmethod
    def calculate_exact_parameters(
        vocab_size: int = 545,
        d_model: int = 128,
        n_layers: int = 2,
        max_seq_len: int = 128,
        d_ff: int = 512,
        bias: bool = True,
        lm_head_bias: bool = False
    ) -> Dict[str, Any]:
        """
        الاشتقاق الرياضي الدقيق لعدد المعلمات: 552,704 معلمة
        """
        # 1. التضمين
        token_emb = vocab_size * d_model # 545 * 128 = 69,760
        pos_emb = max_seq_len * d_model  # 128 * 128 = 16,384
        emb_total = token_emb + pos_emb  # 86,144

        # 2. طبقة المحول الواحدة (Transformer Block)
        # أ. الانتباه متعدد الرؤوس (Q, K, V + Projection) مع الانحياز
        q_proj = d_model * d_model + (d_model if bias else 0)  # 16,512
        k_proj = d_model * d_model + (d_model if bias else 0)  # 16,512
        v_proj = d_model * d_model + (d_model if bias else 0)  # 16,512
        out_proj = d_model * d_model + (d_model if bias else 0) # 16,512
        attn_total = q_proj + k_proj + v_proj + out_proj       # 66,048

        # ب. معايرة الطبقة الأولى (LayerNorm 1: weight + bias)
        ln1 = 2 * d_model  # 256

        # ج. شبكة التغذية الأمامية (FFN: d_model -> d_ff -> d_model)
        ffn_w1 = d_model * d_ff + (d_ff if bias else 0)    # 128*512 + 512 = 66,048
        ffn_w2 = d_ff * d_model + (d_model if bias else 0) # 512*128 + 128 = 65,664
        ffn_total = ffn_w1 + ffn_w2                        # 131,712

        # د. معايرة الطبقة الثانية (LayerNorm 2)
        ln2 = 2 * d_model  # 256

        single_layer_total = attn_total + ln1 + ffn_total + ln2  # 198,272
        all_layers_total = n_layers * single_layer_total         # 2 * 198,272 = 396,544

        # 3. المعايرة النهائية قبل رأس اللغة (Final LayerNorm)
        final_ln = 2 * d_model  # 256

        # 4. رأس التوقع اللغوي (LM Head: in=128, out=545, no bias)
        lm_head = d_model * vocab_size + (vocab_size if lm_head_bias else 0) # 128 * 545 = 69,760

        grand_total = emb_total + all_layers_total + final_ln + lm_head # 552,704

        return {
            "token_embedding": token_emb,
            "positional_embedding": pos_emb,
            "embedding_subtotal": emb_total,
            "attention_per_layer": attn_total,
            "ffn_per_layer": ffn_total,
            "layer_norms_per_layer": ln1 + ln2,
            "single_layer_total": single_layer_total,
            "all_layers_total": all_layers_total,
            "final_layernorm": final_ln,
            "lm_head": lm_head,
            "grand_total": grand_total,
            "matches_target_552704": grand_total == 552704
        }


if HAS_TORCH:
    class CausalSelfAttention(nn.Module):
        def __init__(self, config: AttyaLegalMindConfig):
            super().__init__()
            assert config.d_model % config.n_heads == 0
            self.n_heads = config.n_heads
            self.d_model = config.d_model
            self.head_dim = config.d_model // config.n_heads

            self.q_proj = nn.Linear(config.d_model, config.d_model, bias=config.bias)
            self.k_proj = nn.Linear(config.d_model, config.d_model, bias=config.bias)
            self.v_proj = nn.Linear(config.d_model, config.d_model, bias=config.bias)
            self.out_proj = nn.Linear(config.d_model, config.d_model, bias=config.bias)
            self.dropout = nn.Dropout(config.dropout)

            # Causal mask to ensure attention is only applied to previous positions
            self.register_buffer(
                "bias_mask",
                torch.tril(torch.ones(config.max_seq_len, config.max_seq_len)).view(
                    1, 1, config.max_seq_len, config.max_seq_len
                ),
            )

        def forward(self, x: torch.Tensor) -> torch.Tensor:
            B, T, C = x.size()
            q = self.q_proj(x).view(B, T, self.n_heads, self.head_dim).transpose(1, 2)
            k = self.k_proj(x).view(B, T, self.n_heads, self.head_dim).transpose(1, 2)
            v = self.v_proj(x).view(B, T, self.n_heads, self.head_dim).transpose(1, 2)

            att = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(self.head_dim))
            att = att.masked_fill(self.bias_mask[:, :, :T, :T] == 0, float("-inf"))
            att = F.softmax(att, dim=-1)
            att = self.dropout(att)

            y = att @ v
            y = y.transpose(1, 2).contiguous().view(B, T, C)
            return self.out_proj(y)

    class FeedForward(nn.Module):
        def __init__(self, config: AttyaLegalMindConfig):
            super().__init__()
            self.fc1 = nn.Linear(config.d_model, config.d_ff, bias=config.bias)
            self.act = nn.GELU()
            self.fc2 = nn.Linear(config.d_ff, config.d_model, bias=config.bias)
            self.dropout = nn.Dropout(config.dropout)

        def forward(self, x: torch.Tensor) -> torch.Tensor:
            return self.dropout(self.fc2(self.act(self.fc1(x))))

    class TransformerBlock(nn.Module):
        def __init__(self, config: AttyaLegalMindConfig):
            super().__init__()
            self.ln1 = nn.LayerNorm(config.d_model)
            self.attn = CausalSelfAttention(config)
            self.ln2 = nn.LayerNorm(config.d_model)
            self.ffn = FeedForward(config)

        def forward(self, x: torch.Tensor) -> torch.Tensor:
            x = x + self.attn(self.ln1(x))
            x = x + self.ffn(self.ln2(x))
            return x

    class AttyaLegalMind(nn.Module):
        def __init__(self, config: Optional[AttyaLegalMindConfig] = None):
            super().__init__()
            if config is None:
                config = AttyaLegalMindConfig()
            self.config = config

            self.tok_emb = nn.Embedding(config.vocab_size, config.d_model)
            self.pos_emb = nn.Embedding(config.max_seq_len, config.d_model)
            self.drop = nn.Dropout(config.dropout)

            self.blocks = nn.ModuleList([TransformerBlock(config) for _ in range(config.n_layers)])
            self.ln_f = nn.LayerNorm(config.d_model)
            self.lm_head = nn.Linear(config.d_model, config.vocab_size, bias=config.lm_head_bias)

        def forward(
            self,
            idx: torch.Tensor,
            targets: Optional[torch.Tensor] = None
        ) -> Tuple[torch.Tensor, Optional[torch.Tensor]]:
            device = idx.device
            b, t = idx.size()
            assert t <= self.config.max_seq_len, f"Sequence length {t} exceeds maximum context {self.config.max_seq_len}"

            pos = torch.arange(0, t, dtype=torch.long, device=device).unsqueeze(0)
            tok_emb = self.tok_emb(idx)
            pos_emb = self.pos_emb(pos)
            x = self.drop(tok_emb + pos_emb)

            for block in self.blocks:
                x = block(x)

            x = self.ln_f(x)
            logits = self.lm_head(x)

            loss = None
            if targets is not None:
                loss = F.cross_entropy(
                    logits.view(-1, logits.size(-1)),
                    targets.view(-1),
                    ignore_index=-100
                )

            return logits, loss

        def count_parameters(self) -> int:
            return sum(p.numel() for p in self.parameters())
else:
    CausalSelfAttention = None
    FeedForward = None
    TransformerBlock = None
    AttyaLegalMind = None


if __name__ == "__main__":
    derivation = AttyaLegalMindConfig.calculate_exact_parameters()
    print("=" * 60)
    print("ATTYA LEGAL MIND — MATHEMATICAL ARCHITECTURE DERIVATION")
    print("=" * 60)
    for k, v in derivation.items():
        print(f"  - {k}: {v}")
    print("=" * 60)
    if HAS_TORCH:
        cfg = AttyaLegalMindConfig()
        model = AttyaLegalMind(cfg)
        count = model.count_parameters()
        print(f"PyTorch Empirically Verified Parameters: {count:,}")
        assert count == 552704, f"Mismatch: expected 552704, got {count}"
    else:
        print(f"Calculated Parameters: {derivation['grand_total']:,} (PyTorch not in current path, verified via derivation)")
    print("=" * 60)
