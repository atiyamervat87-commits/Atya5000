#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ATTYA LEGAL MIND TOKENIZER
Specialized 545-token Arabic legal tokenizer for ATTYA_LEGAL_MIND
"""

import os
import json
import re
from typing import List, Union, Dict, Any, Optional

class AttyaLegalTokenizer:
    def __init__(self, vocab_path: Optional[str] = None):
        if vocab_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            vocab_path = os.path.join(base_dir, "vocabulary.json")
            
        with open(vocab_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        self.vocab = data["tokens"]
        self.token_to_id = {t: int(idx) for t, idx in data["token_to_id"].items()}
        self.id_to_token = {int(idx): t for idx, t in data["id_to_token"].items()}
        self.vocab_size = len(self.vocab)
        
        # Special tokens
        self.pad_token = "<pad>"
        self.unk_token = "<unk>"
        self.bos_token = "<s>"
        self.eos_token = "</s>"
        self.sep_token = "<sep>"
        
        self.pad_token_id = self.token_to_id.get(self.pad_token, 0)
        self.unk_token_id = self.token_to_id.get(self.unk_token, 1)
        self.bos_token_id = self.token_to_id.get(self.bos_token, 2)
        self.eos_token_id = self.token_to_id.get(self.eos_token, 3)
        self.sep_token_id = self.token_to_id.get(self.sep_token, 4)

    def normalize(self, text: str) -> str:
        """
        تطبيع النصوص العربية وإزالة التشكيل المفرط
        """
        if not text:
            return ""
        # إزالة التشكيل والتطويل
        s = re.sub(r'[\u064B-\u065F\u0670\u0640]', '', text)
        # توحيد المسافات
        s = re.sub(r'\s+', ' ', s).strip()
        return s

    def tokenize(self, text: str) -> List[str]:
        """
        تقسيم النص إلى رموز مفردة وكلمات قانونية
        """
        text = self.normalize(text)
        tokens = []
        words = text.split(" ")
        for i, word in enumerate(words):
            if not word:
                continue
            if i > 0:
                tokens.append(" ")
                
            # فحص ما إذا كانت الكلمة الكاملة في القاموس
            if word in self.token_to_id:
                tokens.append(word)
            else:
                # تقسيم بالحروف والرموز
                j = 0
                while j < len(word):
                    matched = False
                    # تجربة أطول بادئة مطابقة (Greedy matching)
                    for k in range(len(word), j, -1):
                        sub = word[j:k]
                        if sub in self.token_to_id:
                            tokens.append(sub)
                            j = k
                            matched = True
                            break
                    if not matched:
                        char = word[j]
                        if char in self.token_to_id:
                            tokens.append(char)
                        else:
                            tokens.append(self.unk_token)
                        j += 1
        return tokens

    def encode(
        self,
        text: str,
        add_special_tokens: bool = True,
        max_length: int = 128,
        truncation: bool = True,
        padding: str = "max_length"
    ) -> List[int]:
        """
        تحويل النص إلى مصفوفة من أرقام الرموز (token IDs)
        """
        tokens = self.tokenize(text)
        ids = [self.token_to_id.get(t, self.unk_token_id) for t in tokens]
        
        if add_special_tokens:
            ids = [self.bos_token_id] + ids + [self.eos_token_id]
            
        if truncation and len(ids) > max_length:
            ids = ids[:max_length]
            if add_special_tokens and ids[-1] != self.eos_token_id:
                ids[-1] = self.eos_token_id
                
        if padding == "max_length" and len(ids) < max_length:
            ids = ids + [self.pad_token_id] * (max_length - len(ids))
            
        return ids

    def decode(self, token_ids: List[int], skip_special_tokens: bool = True) -> str:
        """
        تحويل أرقام الرموز إلى نص عربي مقروء
        """
        special_ids = {self.pad_token_id, self.unk_token_id, self.bos_token_id, self.eos_token_id, self.sep_token_id}
        parts = []
        for tid in token_ids:
            if skip_special_tokens and tid in special_ids:
                continue
            tok = self.id_to_token.get(tid, "")
            parts.append(tok)
        return "".join(parts).strip()


if __name__ == "__main__":
    tokenizer = AttyaLegalTokenizer()
    sample = "عقد بيع ابتدائي لوحدة سكنية بشارع الجمهورية بالقاهرة"
    encoded = tokenizer.encode(sample, max_length=32)
    decoded = tokenizer.decode(encoded)
    print("Sample:", sample)
    print("Encoded length:", len(encoded))
    print("Encoded IDs:", encoded[:16])
    print("Decoded:", decoded)
