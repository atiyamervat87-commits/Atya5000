#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
NG-ILMF v1.0 — مدقق مسار البيانات ومفردات الرموز (Dataset & Tokenizer Validator)
المسار المستهدف في Termux: $HOME/atya/llm_factory/data_validator.py
=============================================================================
الوصف:
1. فحص وجود ملفات التدريب والتحقق وعدم فراغها.
2. فحص سلامة أرقام الرموز ومطابقتها لحجم المفردات (Vocab Size).
3. الكشف الصارم عن تسرب البيانات (Data Leakage) بين التدريب والتحقق.
4. قياس كفاية البيانات لتعليم نموذج عربي مفيد من 918 ألف معلمة.
=============================================================================
"""

import os
import sys
import json
import hashlib
from typing import Dict, List, Set, Any


class DatasetValidator:
    def __init__(self, vocab_size: int = 1024):
        self.vocab_size = vocab_size

    def check_file_exists_and_non_empty(self, filepath: str) -> Dict[str, Any]:
        """فحص وجود الملف وحجمه"""
        if not os.path.exists(filepath):
            return {"exists": False, "size_bytes": 0, "status": "FAIL", "msg": "الملف غير موجود"}
        sz = os.path.getsize(filepath)
        if sz == 0:
            return {"exists": True, "size_bytes": 0, "status": "FAIL", "msg": "الملف فارغ (0 بايت)"}
        return {"exists": True, "size_bytes": sz, "status": "PASS", "msg": "الملف موجود وبحجم سليم"}

    def check_token_bounds(self, token_ids: List[int]) -> Dict[str, Any]:
        """فحص أن جميع أرقام الرموز ضمن [0, vocab_size - 1]"""
        if not token_ids:
            return {"status": "FAIL", "msg": "قائمة الرموز فارغة"}

        min_tok = min(token_ids)
        max_tok = max(token_ids)

        if min_tok < 0:
            return {
                "status": "FAIL",
                "msg": f"يوجد رمز بقيمة سالبة: {min_tok}",
                "min": min_tok,
                "max": max_tok
            }

        if max_tok >= self.vocab_size:
            return {
                "status": "FAIL",
                "msg": f"تجاوز أبعاد المفردات! أقصى رمز هو {max_tok} بينما حجم المفردات {self.vocab_size}",
                "min": min_tok,
                "max": max_tok
            }

        return {
            "status": "PASS",
            "msg": f"جميع الرموز منضبطة تماماً بين 0 و {self.vocab_size - 1}",
            "min": min_tok,
            "max": max_tok,
            "total_tokens": len(token_ids)
        }

    def detect_leakage(self, train_samples: List[str], val_samples: List[str]) -> Dict[str, Any]:
        """الكشف عن تسرب البيانات بين التدريب والتحقق عبر التجزئة الرقمية"""
        train_hashes: Set[str] = set()
        for s in train_samples:
            clean = s.strip().lower()
            if clean:
                train_hashes.add(hashlib.md5(clean.encode('utf-8')).hexdigest())

        leak_count = 0
        leaked_samples = []

        for s in val_samples:
            clean = s.strip().lower()
            if not clean:
                continue
            h = hashlib.md5(clean.encode('utf-8')).hexdigest()
            if h in train_hashes:
                leak_count += 1
                if len(leaked_samples) < 5:
                    leaked_samples.append(clean[:80])

        has_leak = leak_count > 0
        leak_rate = (leak_count / len(val_samples)) * 100 if val_samples else 0.0

        return {
            "status": "FAIL" if has_leak else "PASS",
            "leak_count": leak_count,
            "leak_rate_percent": round(leak_rate, 2),
            "msg": f"تم اكتشاف تسرب بنسبة {round(leak_rate, 2)}% ({leak_count} عينة مكررة)" if has_leak else "لا يوجد أي تسرب بين بيانات التدريب والتحقق (نظيفة 100%)",
            "sample_leaks": leaked_samples
        }

    def evaluate_arabic_adequacy(self, samples_count: int, total_tokens: int) -> Dict[str, Any]:
        """
        تقييم كفاية البيانات لنموذج الوليد (918,656 معلمة)
        وفق معادلات Chinchilla المصغرة:
        النموذج الصغير (918K) يحتاج ما لا يقل عن 20 رمزاً لكل معلمة ليتعلم العربية الأساسية:
        أي حوالي 18 إلى 20 مليون رمز لتدريب كامل، أو 500 ألف إلى 1 مليون رمز للتدريب الأولي الموجه.
        """
        tokens_per_param = total_tokens / 918656 if total_tokens > 0 else 0

        if total_tokens < 50000:
            adequacy = "INSUFFICIENT"
            msg = "حجم البيانات شديد الضآلة (أقل من 50 ألف رمز). لا يمكن للنموذج فهم قواعد وتراكيب العربية بهذا الحجم، مما يفسر الخسارة المرتفعة 4.89."
        elif total_tokens < 500000:
            adequacy = "MINIMAL"
            msg = "بيانات تكفي فقط كاختبار أولي (Fine-Tuning مصغر)، ولكنها تتطلب استهداف الإجابات فقط Masking."
        else:
            adequacy = "SUFFICIENT"
            msg = "حجم البيانات ملائم لبناء معرفة عربية مستقرة لنموذج بحجم 918 ألف معلمة."

        return {
            "adequacy": adequacy,
            "total_tokens": total_tokens,
            "tokens_per_parameter": round(tokens_per_param, 4),
            "analysis": msg
        }


if __name__ == "__main__":
    print("=== اختبار وحدة فحص البيانات (data_validator.py) ===")
    validator = DatasetValidator(vocab_size=1024)

    # 1. اختبار فحص حدود الرموز
    dummy_valid_tokens = [0, 45, 120, 950, 1023]
    dummy_invalid_tokens = [0, 12, 1024, 2500]  # تتجاوز 1024
    print("فحص رموز سليمة:", validator.check_token_bounds(dummy_valid_tokens)["status"])
    print("فحص رموز متجاوزة:", validator.check_token_bounds(dummy_invalid_tokens)["status"], "—", validator.check_token_bounds(dummy_invalid_tokens)["msg"])

    # 2. اختبار كشف التسرب
    train_text = ["ما هي عاصمة مصر؟ القاهرة", "كم عدد الأيام في الأسبوع؟ 7"]
    val_clean = ["من هو أول الخلفاء الراشدين؟ أبو بكر الصديق"]
    val_leaked = ["ما هي عاصمة مصر؟ القاهرة"]
    print("فحص تسرب بيانات نظيفة:", validator.detect_leakage(train_text, val_clean)["msg"])
    print("فحص تسرب بيانات مكررة:", validator.detect_leakage(train_text, val_leaked)["msg"])

    # 3. تقييم كفاية البيانات
    print("\nتقييم حجم البيانات:")
    eval_res = validator.evaluate_arabic_adequacy(samples_count=500, total_tokens=35000)
    print(f"- التصنيف: {eval_res['adequacy']}")
    print(f"- التحليل: {eval_res['analysis']}")
