#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
عقل المستشار عطية الهلباوي - منظومة الاستدلال والذكاء القانوني المستقل
AQL AL-MUSTASHAR ATIA EL-HELBAWY - Autonomous Legal AI System
=============================================================================
الوحدة: tools/document_reader.py
المرحلة الأولى: اكتشاف الملفات والمجلدات المحلية وتصنيفها وتوثيق مساراتها
Phase 1: Local File Discovery & Legal Document Categorization System
=============================================================================
الوصف:
    نظام اكتشاف الملفات وفحص المكتبة الرقمية المحلية، مع التركيز على:
    1. اكتشاف ملفات PDF وDOCX وسائر الوثائق القانونية بصورة تكرارية.
    2. استخراج البيانات الوصفية (الحجم، تاريخ التعديل، التجزئة SHA-256 لمنع التكرار).
    3. التصنيف الآلي للوثائق وفق الفروع القانونية المصرية.
    4. الكشف عن الملفات المكررة (Deduplication).
    5. إصدار تقارير تدقيق شاملة بصيغة JSON و Markdown.
=============================================================================
"""

import os
import sys
import json
import hashlib
import mimetypes
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple, Any


# قائمة الامتدادات المدعومة مصنفة نوعياً
SUPPORTED_EXTENSIONS = {
    'pdf': {'.pdf'},
    'docx': {'.docx', '.doc'},
    'text': {'.txt', '.rtf', '.md', '.html', '.htm'},
    'data': {'.json', '.jsonl', '.csv'},
    'database': {'.sqlite', '.sqlite3', '.db'},
    'images': {'.png', '.jpg', '.jpeg', '.tiff', '.bmp'}
}

# كلمات مفتاحية للتصنيف الموضوعي الأولي حسب فروع القانون المصري
LEGAL_BRANCH_KEYWORDS = {
    'مدني': [
        'مدني', 'عقد', 'بيع', 'إيجار', 'تعويض', 'التزام', 'مسؤولية تقصيرية',
        'صورية', 'شفعة', 'حيازة', 'تقادم', 'فسخ', 'مقاولة', 'رهن'
    ],
    'مرافعات_وإثبات': [
        'مرافعات', 'إثبات', 'اختصاص', 'بطلان', 'إعلان', 'استئناف', 'معارضة',
        'نقض', 'حكم', 'محضر', 'جلسة', 'شهادة', 'يمين', 'تنفيذ', 'حجز'
    ],
    'جنائي_وإجراءات': [
        'عقوبات', 'جنائي', 'جنحة', 'جناية', 'خيانة أمانة', 'نصب', 'تبديد',
        'شيك', 'نيابة', 'تحقيق', 'براءة', 'حبس', 'إدانة', 'تلبس'
    ],
    'عمل_وتأمينات': [
        'عمل', 'عمال', 'عامل', 'فصل تعسفي', 'تأمينات', 'إصابة عمل',
        'مستحقات', 'مكافأة', 'أجر', 'نقابة'
    ],
    'تجاري_وشركات': [
        'تجاري', 'شركات', 'سجل تجاري', 'إفلاس', 'كمبيالة', 'سند لإذن',
        'شراكة', 'تصفية', 'تحكيم', 'علامة تجارية'
    ],
    'إداري_ومجلس_دولة': [
        'إداري', 'مجلس دولة', 'قضاء إداري', 'طعن إداري', 'ترقية', 'قرار إداري',
        'نزع ملكية', 'عقد إداري', 'تأديبي'
    ],
    'أحوال_شخصية': [
        'أحوال شخصية', 'أسرة', 'نفقة', 'طلاق', 'خلع', 'حضانة', 'إرث',
        'تركة', 'وصية', 'ولاية'
    ],
    'نقض_ودستورية': [
        'محكمة النقض', 'دستورية', 'طعن بالنقض', 'مبدأ قضائي', 'هيئة عامة',
        'دستورية عليا', 'عدم دستورية'
    ],
    'صيغ_ومذكرات': [
        'مذكرة', 'صحيفة دعوى', 'إنذار', 'عريضة', 'تقرير طعن', 'صيغة',
        'نموذج', 'توكيل'
    ]
}


class FileDiscoverySystem:
    """
    نظام اكتشاف وتصنيف الملفات القانونية المحلية
    File Discovery and Categorization Engine for Legal Documents
    """

    def __init__(
        self,
        target_directory: Optional[str] = None,
        max_file_size_mb: float = 250.0,
        compute_hashes: bool = True
    ):
        """
        تهيئة نظام فحص واكتشاف الملفات
        
        Args:
            target_directory: المسار الجذري المراد فحصه، افتراضياً المجلد الحالي
            max_file_size_mb: الحد الأقصى لحجم الملف بالميغابايت للفحص
            compute_hashes: حساب بصمة SHA-256 للملفات لكشف التكرار
        """
        self.root_path = Path(target_directory or os.getcwd()).resolve()
        self.max_file_size_bytes = int(max_file_size_mb * 1024 * 1024)
        self.compute_hashes = compute_hashes

        # سجلات النتائج
        self.discovered_files: List[Dict[str, Any]] = []
        self.duplicates_map: Dict[str, List[str]] = {}
        self.category_counts: Dict[str, int] = {}
        self.extension_counts: Dict[str, int] = {}
        self.errors: List[Dict[str, str]] = []
        self.start_time: Optional[datetime] = None
        self.end_time: Optional[datetime] = None

    @staticmethod
    def calculate_file_hash(file_path: Path, block_size: int = 65536) -> str:
        """حساب البصمة الرقمية SHA-256 للملف لضمان النزاهة وكشف التكرارات"""
        hasher = hashlib.sha256()
        try:
            with open(file_path, 'rb') as f:
                for block in iter(lambda: f.read(block_size), b''):
                    hasher.update(block)
            return hasher.hexdigest()
        except Exception as e:
            return f"HASH_ERROR: {str(e)}"

    @staticmethod
    def classify_legal_branch(file_name: str, relative_path: str) -> str:
        """
        تصنيف مبدئي للفرع القانوني بناءً على اسم الملف ومساره
        """
        text_to_check = (file_name + " " + relative_path).lower()
        
        for branch, keywords in LEGAL_BRANCH_KEYWORDS.items():
            for kw in keywords:
                if kw in text_to_check:
                    return branch
                    
        return 'عام_غير_مصنف'

    def scan(
        self,
        specific_extensions: Optional[Set[str]] = None,
        exclude_dirs: Optional[Set[str]] = None
    ) -> Dict[str, Any]:
        """
        تنفيذ الفحص التكراري للمجلد المحدد
        
        Args:
            specific_extensions: قائمة امتدادات مخصصة (مثال: {'.pdf', '.docx'})
            exclude_dirs: مجلدات مستبعدة (مثل: node_modules, .git, dist, __pycache__)
        """
        self.start_time = datetime.now()
        self.discovered_files.clear()
        self.duplicates_map.clear()
        self.category_counts.clear()
        self.extension_counts.clear()
        self.errors.clear()

        # المجلدات المستبعدة تلقائياً
        default_excludes = {
            'node_modules', '.git', 'dist', 'build', '.aistudio',
            '__pycache__', '.pytest_cache', '.vscode', '.idea'
        }
        active_excludes = default_excludes if exclude_dirs is None else default_excludes.union(exclude_dirs)

        # الامتدادات المستهدفة
        target_exts = set()
        if specific_extensions:
            target_exts = {e.lower() if e.startswith('.') else f'.{e.lower()}' for e in specific_extensions}
        else:
            for group in SUPPORTED_EXTENSIONS.values():
                target_exts.update(group)

        # خريطة لتجميع التجزئات
        hash_to_paths: Dict[str, List[str]] = {}

        for root, dirs, files in os.walk(self.root_path, topdown=True):
            # استبعاد المجلدات غير المرغوبة
            dirs[:] = [d for d in dirs if d not in active_excludes and not d.startswith('.')]

            for file_name in sorted(files):
                ext = Path(file_name).suffix.lower()
                if ext not in target_exts:
                    continue

                full_path = Path(root) / file_name
                try:
                    stat_info = full_path.stat()
                    file_size = stat_info.st_size
                    rel_path = str(full_path.relative_to(self.root_path))

                    # التحقق من سقف الحجم
                    if file_size > self.max_file_size_bytes:
                        self.errors.append({
                            'path': rel_path,
                            'error': f'تجاوز الحجم المسموح ({file_size / (1024*1024):.2f} MB)'
                        })
                        continue

                    # تصنيف نوع المستند
                    mime_type, _ = mimetypes.guess_type(str(full_path))
                    is_pdf = ext == '.pdf'
                    is_docx = ext in {'.docx', '.doc'}
                    legal_branch = self.classify_legal_branch(file_name, rel_path)

                    # حساب البصمة
                    file_hash = ''
                    if self.compute_hashes and file_size > 0:
                        file_hash = self.calculate_file_hash(full_path)
                        hash_to_paths.setdefault(file_hash, []).append(rel_path)

                    record = {
                        'file_name': file_name,
                        'relative_path': rel_path,
                        'absolute_path': str(full_path),
                        'extension': ext,
                        'size_bytes': file_size,
                        'size_kb': round(file_size / 1024, 2),
                        'size_mb': round(file_size / (1024 * 1024), 3),
                        'mime_type': mime_type or 'application/octet-stream',
                        'is_pdf': is_pdf,
                        'is_docx': is_docx,
                        'legal_branch': legal_branch,
                        'sha256': file_hash,
                        'created_at': datetime.fromtimestamp(stat_info.st_ctime).isoformat(),
                        'modified_at': datetime.fromtimestamp(stat_info.st_mtime).isoformat()
                    }

                    self.discovered_files.append(record)

                    # تحديث الإحصائيات
                    self.extension_counts[ext] = self.extension_counts.get(ext, 0) + 1
                    self.category_counts[legal_branch] = self.category_counts.get(legal_branch, 0) + 1

                except (PermissionError, FileNotFoundError, OSError) as e:
                    self.errors.append({
                        'path': str(full_path),
                        'error': str(e)
                    })

        # تحديد المكررات
        for f_hash, paths in hash_to_paths.items():
            if len(paths) > 1 and not f_hash.startswith('HASH_ERROR'):
                self.duplicates_map[f_hash] = paths

        self.end_time = datetime.now()
        return self.get_summary()

    def get_summary(self) -> Dict[str, Any]:
        """إرجاع ملخص إحصائي شامل لنتائج الفحص"""
        total_size = sum(f['size_bytes'] for f in self.discovered_files)
        pdf_count = sum(1 for f in self.discovered_files if f['is_pdf'])
        docx_count = sum(1 for f in self.discovered_files if f['is_docx'])

        duration = (self.end_time - self.start_time).total_seconds() if (self.start_time and self.end_time) else 0.0

        return {
            'system_name': 'عقل المستشار عطية الهلباوي - وحدة فحص واكتشاف الملفات',
            'phase': 'المرحلة 1: اكتشاف الملفات وتصنيفها وتوثيق مساراتها',
            'scanned_root': str(self.root_path),
            'execution_timestamp': datetime.now().isoformat(),
            'duration_seconds': round(duration, 3),
            'metrics': {
                'total_discovered_files': len(self.discovered_files),
                'pdf_files_count': pdf_count,
                'docx_files_count': docx_count,
                'total_size_mb': round(total_size / (1024 * 1024), 2),
                'duplicate_groups_count': len(self.duplicates_map),
                'errors_count': len(self.errors)
            },
            'extension_breakdown': self.extension_counts,
            'legal_branch_breakdown': self.category_counts,
            'duplicates_detected': self.duplicates_map,
            'errors': self.errors
        }

    def export_json(self, output_path: str) -> None:
        """تصدير تقرير الاكتشاف كملف JSON مهيكل"""
        payload = {
            'summary': self.get_summary(),
            'files': self.discovered_files
        }
        out_file = Path(output_path)
        out_file.parent.mkdir(parents=True, exist_ok=True)
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

    def export_markdown_report(self, output_path: str) -> None:
        """توليد تقرير تدقيق قضائي متكامل بصيغة Markdown"""
        summary = self.get_summary()
        metrics = summary['metrics']

        lines = [
            "# تقرير فحص واكتشاف الملفات والمكتبة الرقمية",
            "## عقل المستشار عطية الهلباوي - المرحلة التأسيسية الأولى",
            f"**تاريخ الفحص:** {summary['execution_timestamp']}",
            f"**المسار الجذري المستهدف:** `{summary['scanned_root']}`",
            f"**زمن الفحص:** {summary['duration_seconds']} ثانية",
            "",
            "---",
            "### 1. المؤشرات الإجمالية للاكتشاف:",
            f"- **إجمالي الملفات المكتشفة:** {metrics['total_discovered_files']} ملف",
            f"- **ملفات PDF المستهدفة:** {metrics['pdf_files_count']} ملف",
            f"- **ملفات DOCX / Word المستهدفة:** {metrics['docx_files_count']} ملف",
            f"- **إجمالي الحجم الإجمالي:** {metrics['total_size_mb']} ميغابايت",
            f"- **المجموعات المكررة المكتشفة:** {metrics['duplicate_groups_count']}",
            "",
            "### 2. توزيع الملفات حسب الامتداد:",
        ]

        for ext, count in summary['extension_breakdown'].items():
            lines.append(f"- `{ext}`: {count} ملف")

        lines.extend([
            "",
            "### 3. التوزيع حسب الفروع القانونية المستخلصة:",
        ])
        for branch, count in summary['legal_branch_breakdown'].items():
            lines.append(f"- **{branch}**: {count} وثيقة")

        if self.duplicates_map:
            lines.extend([
                "",
                "### 4. التكرارات المكتشفة (للمعالجة في مرحلة التنظيف):"
            ])
            for f_hash, paths in list(self.duplicates_map.items())[:10]:
                lines.append(f"- **SHA-256 (`{f_hash[:12]}...`):**")
                for p in paths:
                    lines.append(f"  - `{p}`")

        lines.extend([
            "",
            "### 5. عينة من مسارات الملفات المكتشفة الموثقة:",
            "| اسم الملف | الفرع القانوني | النوع | الحجم (KB) | المسار النسبي |",
            "|:---|:---|:---|:---|:---|"
        ])

        for f in self.discovered_files[:50]:
            lines.append(
                f"| `{f['file_name']}` | {f['legal_branch']} | {f['extension']} | {f['size_kb']} | `{f['relative_path']}` |"
            )

        if len(self.discovered_files) > 50:
            lines.append(f"\n*... وهناك {len(self.discovered_files) - 50} ملفاً إضافياً في السجل الكامل.*")

        out_file = Path(output_path)
        out_file.parent.mkdir(parents=True, exist_ok=True)
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines) + "\n")


def main():
    """نقطة الدخول للتشغيل المباشر من سطر الأوامر"""
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    print(f"\n[عقل المستشار عطية الهلباوي] بدء تشغيل وحدة فحص واكتشاف الملفات...")
    print(f"[المسار المستهدف]: {os.path.abspath(target_dir)}")

    # التركيز على PDF و DOCX وكافة الوثائق القانونية
    scanner = FileDiscoverySystem(target_directory=target_dir, compute_hashes=True)
    summary = scanner.scan(specific_extensions={'.pdf', '.docx', '.doc', '.txt', '.json', '.sqlite'})

    metrics = summary['metrics']
    print(f"\n[اكتمل الفحص بنجاح]")
    print(f"• إجمالي الملفات المكتشفة: {metrics['total_discovered_files']}")
    print(f"• ملفات PDF: {metrics['pdf_files_count']}")
    print(f"• ملفات DOCX: {metrics['docx_files_count']}")
    print(f"• إجمالي الحجم: {metrics['total_size_mb']} MB")
    print(f"• مجموعات مكررة: {metrics['duplicate_groups_count']}")

    # تصدير التقرير
    report_json_path = "reports/file_discovery_report.json"
    report_md_path = "reports/file_discovery_report.md"
    scanner.export_json(report_json_path)
    scanner.export_markdown_report(report_md_path)
    print(f"\n[تم توثيق التقارير]")
    print(f"1. التقرير المهيكل: {report_json_path}")
    print(f"2. التقرير القضائي: {report_md_path}\n")


if __name__ == '__main__':
    main()
