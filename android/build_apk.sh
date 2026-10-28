#!/bin/bash
# ==============================================================================
# سكربت بناء حزمة Android APK لمنصة المستشار عطيه الهلباوي
# Build script for "المستشار عطيه الهلباوي — إدارة المكتب القانوني" APK
# ==============================================================================

set -e

echo "=========================================================="
echo "  بناء تطبيق Android (APK) - المستشار عطيه الهلباوي"
echo "  Package: com.elhelbawy.law.office"
echo "=========================================================="

if ! command -v gradle &> /dev/null && ! command -v ./gradlew &> /dev/null; then
    echo "[تنبيه بيئي]: Gradle غير مثبت مباشرة في بيئة Linux السحابية الحالية."
    echo "[خطوات البناء على جهاز المطور أو خادم البناء CI/CD]:"
    echo "1. تأكد من تثبيت OpenJDK 17 و Android SDK Build-Tools 34"
    echo "2. الدخول إلى مجلد: cd android"
    echo "3. تنفيذ الأمر: ./gradlew assembleRelease"
    echo "4. ستجد ملف APK النهائي في: android/app/build/outputs/apk/release/app-release.apk"
    exit 0
fi

echo "[1/3] تجميع الكود المصدري..."
gradle assembleRelease

echo "[2/3] التحقق من سلامة الحزمة..."
APK_PATH="app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    echo "[نجاح]: تم إنشاء ملف APK بنجاح في: $APK_PATH"
    ls -lh "$APK_PATH"
else
    echo "[ملاحظة]: يرجى فحص مخرجات التجميع."
fi
