#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PACKAGING & RELEASE ARCHIVER
Creates both ZIP packages with SHA256 verification:
1. ATTYA_LEGAL_MIND.zip (Standalone 552,704-parameter model package)
2. ATTYA_LEGAL_ADVISOR_MAGIC_MIND.zip (Full upgraded web application)
"""

import os
import zipfile
import hashlib
import json

def compute_sha256(filepath):
    sha = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            sha.update(chunk)
    return sha.hexdigest()

def create_attya_mind_zip(output_zip="ATTYA_LEGAL_MIND.zip", source_dir="ATTYA_LEGAL_MIND"):
    print(f"Creating {output_zip}...")
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            if "__pycache__" in root:
                continue
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, ".")
                zipf.write(full_path, rel_path)
    sha = compute_sha256(output_zip)
    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    print(f"Created {output_zip} ({size_mb:.2f} MB) - SHA256: {sha}")
    return sha, size_mb

def create_advisor_app_zip(output_zip="ATTYA_LEGAL_ADVISOR_MAGIC_MIND.zip"):
    print(f"Creating {output_zip}...")
    exclude_dirs = {"node_modules", ".git", ".aistudio", "dist", "__pycache__"}
    exclude_files = {output_zip, "ATTYA_LEGAL_MIND.zip", "create_archives.py"}

    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("."):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file in exclude_files or file.endswith(".zip"):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, ".")
                zipf.write(full_path, rel_path)

    sha = compute_sha256(output_zip)
    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    print(f"Created {output_zip} ({size_mb:.2f} MB) - SHA256: {sha}")
    return sha, size_mb

if __name__ == "__main__":
    mind_sha, mind_size = create_attya_mind_zip()
    app_sha, app_size = create_advisor_app_zip()

    manifest = {
        "release_title": "ATTYA LEGAL MIND — MAGIC MIND GEN-2 OFFICIAL RELEASE",
        "timestamp": "2026-11-05T22:30:00Z",
        "archives": [
            {
                "name": "ATTYA_LEGAL_MIND.zip",
                "description": "العقل المستقل: الكود والأوزان والبيانات والقاموس وحزمة التقييم المعيارية المستقلة",
                "parameters": 552704,
                "size_mb": round(mind_size, 2),
                "sha256": mind_sha,
                "download_url": "/api/download/attya-legal-mind-zip"
            },
            {
                "name": "ATTYA_LEGAL_ADVISOR_MAGIC_MIND.zip",
                "description": "برنامج المستشار عطيه الهلباوي المطور بعد دمج العقل الجديد وخط المعالجة ثلاثي المراحل",
                "size_mb": round(app_size, 2),
                "sha256": app_sha,
                "download_url": "/api/download/attya-advisor-zip"
            }
        ]
    }

    with open("release_manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    with open("FINAL_SHA256SUMS.txt", "w", encoding="utf-8") as f:
        f.write(f"{mind_sha}  ATTYA_LEGAL_MIND.zip\n")
        f.write(f"{app_sha}  ATTYA_LEGAL_ADVISOR_MAGIC_MIND.zip\n")

    print("\nRelease archives and SHA256 checksums created successfully!")
