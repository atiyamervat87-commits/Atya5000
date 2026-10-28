import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Scale,
  Calendar,
  Clock,
  FileText,
  CheckSquare,
  DollarSign,
  Search,
  Sparkles,
  Printer,
  HardDrive,
  Settings,
  Shield,
  Plus,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  FileCheck,
  ChevronLeft,
  BookOpen,
} from 'lucide-react';
import { LegalIndexDisplay } from './LegalIndexDisplay';
import { EgyptianLawsIndex } from './EgyptianLawsIndex';
import {
  Client,
  LegalCase,
  Hearing,
  DocumentItem,
  TaskItem,
  FinancialTransaction,
  OfficeSettings,
  UserRole,
  AuditLog,
} from '../../types/office';

interface OfficeManagementPlatformProps {
  userRole: UserRole;
  onOpenConsultation: () => void;
}

export const OfficeManagementPlatform: React.FC<OfficeManagementPlatformProps> = ({
  userRole,
  onOpenConsultation,
}) => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  // Office Data State
  const [stats, setStats] = useState<any>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [settings, setSettings] = useState<OfficeSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCaseStatus, setFilterCaseStatus] = useState('all');

  // Smart Report State
  const [reportQueryInput, setReportQueryInput] = useState('تقرير الأتعاب والمصروفات والتحصيل');
  const [smartReportResult, setSmartReportResult] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Modals & Forms
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientType, setNewClientType] = useState<'فرد' | 'شركة' | 'جهة حكومية'>('فرد');
  const [newClientNotes, setNewClientNotes] = useState('');

  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCaseYear, setNewCaseYear] = useState('2024');
  const [newCaseCourt, setNewCaseCourt] = useState('محكمة جنوب القاهرة الابتدائية');
  const [newCaseType, setNewCaseType] = useState('مدني كلي');
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseClientId, setNewCaseClientId] = useState('');
  const [newCaseOpponent, setNewCaseOpponent] = useState('');
  const [newCaseAmount, setNewCaseAmount] = useState('');

  const [showAddHearingModal, setShowAddHearingModal] = useState(false);
  const [newHearingCaseNumber, setNewHearingCaseNumber] = useState('');
  const [newHearingCourt, setNewHearingCourt] = useState('محكمة جنوب القاهرة');
  const [newHearingDate, setNewHearingDate] = useState('2026-11-20');
  const [newHearingDecision, setNewHearingDecision] = useState('');
  const [newHearingReq, setNewHearingReq] = useState('');

  const [showAddTrxModal, setShowAddTrxModal] = useState(false);
  const [newTrxType, setNewTrxType] = useState<any>('أتعاب متفق عليها');
  const [newTrxClientId, setNewTrxClientId] = useState('');
  const [newTrxAmount, setNewTrxAmount] = useState('');
  const [newTrxMethod, setNewTrxMethod] = useState<any>('نقدي');
  const [newTrxNotes, setNewTrxNotes] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchAllData = async () => {
    try {
      const [sRes, cRes, csRes, hRes, dRes, tRes, trRes, stgRes, aRes] = await Promise.all([
        fetch('/api/office/stats').then((r) => r.json()),
        fetch('/api/office/clients').then((r) => r.json()),
        fetch('/api/office/cases').then((r) => r.json()),
        fetch('/api/office/hearings').then((r) => r.json()),
        fetch('/api/office/documents').then((r) => r.json()),
        fetch('/api/office/tasks').then((r) => r.json()),
        fetch('/api/office/finances').then((r) => r.json()),
        fetch('/api/office/settings').then((r) => r.json()),
        fetch('/api/office/audit-logs').then((r) => r.json()),
      ]);

      setStats(sRes);
      setClients(cRes || []);
      setCases(csRes || []);
      setHearings(hRes || []);
      setDocuments(dRes || []);
      setTasks(tRes || []);
      setTransactions(trRes || []);
      setSettings(stgRes);
      setAuditLogs(aRes || []);
    } catch (err) {
      console.error('Failed to load office data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- Handlers ---
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) return;

    try {
      const res = await fetch('/api/office/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-name': userRole === 'owner' ? 'المستشار عطيه الهلباوي (المالك)' : 'موظف المكتب',
        },
        body: JSON.stringify({
          name: newClientName,
          phone: newClientPhone,
          type: newClientType,
          notes: newClientNotes,
        }),
      });

      if (res.ok) {
        showToast('تمت إضافة الموكل بنجاح');
        setShowAddClientModal(false);
        setNewClientName('');
        setNewClientPhone('');
        setNewClientNotes('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف الموكل: ${name}؟`)) return;
    try {
      const res = await fetch(`/api/office/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-name': userRole === 'owner' ? 'المستشار عطيه الهلباوي' : 'موظف المكتب',
        },
      });
      if (res.ok) {
        showToast('تم حذف الموكل بنجاح');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseNumber || !newCaseYear || !newCaseCourt || !newCaseClientId) return;

    const selectedCli = clients.find((c) => c.id === newCaseClientId);

    try {
      const res = await fetch('/api/office/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-name': userRole === 'owner' ? 'المستشار عطيه الهلباوي' : 'موظف المكتب',
        },
        body: JSON.stringify({
          caseNumber: newCaseNumber,
          year: newCaseYear,
          court: newCaseCourt,
          type: newCaseType,
          title: newCaseTitle || `دعوى رقم ${newCaseNumber} لسنة ${newCaseYear}`,
          clientId: newCaseClientId,
          clientName: selectedCli ? selectedCli.name : 'موكل مسجل',
          opponentName: newCaseOpponent || 'الخصم',
          claimAmount: newCaseAmount ? Number(newCaseAmount) : undefined,
        }),
      });

      if (res.ok) {
        showToast('تم تسجيل القضية بنجاح');
        setShowAddCaseModal(false);
        setNewCaseNumber('');
        setNewCaseTitle('');
        setNewCaseOpponent('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCase = async (id: string, caseNum: string) => {
    if (!window.confirm(`تحذير: هل أنت متأكد من حذف القضية رقم: ${caseNum}؟`)) return;
    try {
      const res = await fetch(`/api/office/cases/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-name': userRole === 'owner' ? 'المستشار عطيه الهلباوي' : 'موظف المكتب',
        },
      });
      if (res.ok) {
        showToast('تم حذف القضية بنجاح');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddHearing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHearingCaseNumber || !newHearingDate) return;

    try {
      const res = await fetch('/api/office/hearings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-name': userRole === 'owner' ? 'المستشار عطيه الهلباوي' : 'موظف المكتب',
        },
        body: JSON.stringify({
          caseNumber: newHearingCaseNumber,
          court: newHearingCourt,
          date: newHearingDate,
          decision: newHearingDecision,
          requirements: newHearingReq,
        }),
      });

      if (res.ok) {
        showToast('تم إدراج الجلسة في رول الأجندة');
        setShowAddHearingModal(false);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrxClientId || !newTrxAmount) return;

    const selectedCli = clients.find((c) => c.id === newTrxClientId);

    try {
      const res = await fetch('/api/office/finances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-name': userRole === 'owner' ? 'المستشار عطيه الهلباوي' : 'موظف المكتب',
        },
        body: JSON.stringify({
          type: newTrxType,
          clientId: newTrxClientId,
          clientName: selectedCli ? selectedCli.name : 'موكل',
          amount: Number(newTrxAmount),
          paymentMethod: newTrxMethod,
          notes: newTrxNotes,
        }),
      });

      if (res.ok) {
        showToast('تم تقييد الحركة المالية بالحسابات');
        setShowAddTrxModal(false);
        setNewTrxAmount('');
        setNewTrxNotes('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Smart Query Report Handler
  const handleRunSmartReport = async (customQuery?: string) => {
    const q = (customQuery || reportQueryInput).trim();
    if (!q) return;

    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/office/reports/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setSmartReportResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Backup & Restore
  const handleDownloadBackup = () => {
    window.location.href = '/api/office/backup';
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userRole !== 'owner') {
      alert('استعادة النسخ الاحتياطية مقتصرة على المالك فقط.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const backupData = JSON.parse(reader.result as string);
        if (window.confirm('تأكيد استعادة النسخة الاحتياطية؟ سيتم تحديث الجداول الحالية ببيانات الملف المعتمد.')) {
          const res = await fetch('/api/office/restore', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-role': userRole,
            },
            body: JSON.stringify({ backupData }),
          });
          const resData = await res.json();
          if (res.ok) {
            showToast('تم استعادة النسخة الاحتياطية بنجاح');
            fetchAllData();
          } else {
            alert(resData.error || 'فشلت الاستعادة');
          }
        }
      } catch (err) {
        alert('ملف النسخة الاحتياطية غير صالح.');
      }
    };
    reader.readAsText(file);
  };

  const navSections = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Briefcase },
    { id: 'egyptian_laws', label: 'فهرس القوانين المصرية', icon: BookOpen, badge: 8, highlight: true },
    { id: 'clients', label: 'العملاء والموكلين', icon: Users, badge: clients.length },
    { id: 'cases', label: 'القضايا والدعاوى', icon: Scale, badge: cases.length },
    { id: 'hearings', label: 'الجلسات والأجندة', icon: Calendar, badge: hearings.length },
    { id: 'deadlines', label: 'المواعيد والتنبيهات', icon: Clock },
    { id: 'documents', label: 'المستندات والمذكرات', icon: FileText, badge: documents.length },
    { id: 'tasks', label: 'المهام والإجراءات', icon: CheckSquare, badge: tasks.length },
    { id: 'finances', label: 'الحسابات والأتعاب', icon: DollarSign },
    { id: 'search', label: 'البحث في الملفات', icon: Search },
    { id: 'smart_reports', label: 'التقارير الذكية (NLP)', icon: Sparkles, highlight: true },
    { id: 'print_center', label: 'الطباعة والتصدير', icon: Printer },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: HardDrive },
    { id: 'settings', label: 'إعدادات المكتب', icon: Settings },
    { id: 'users_rbac', label: 'المستخدمون والأمان', icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Luxury Royal Office Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37]/50 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-inner">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-amiri text-[#F5E5BD]">
                برنامج إدارة المحاماة — المستشار عطيه الهلباوي
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#E7C779] border border-[#D4AF37]/40 font-mono font-bold">
                15 قسماً تخصصياً وموسوعة القوانين
              </span>
            </div>
            <p className="text-xs text-[#F5E5BD]/70 mt-0.5">
              إدارة القضايا والعملاء والجلسات والحسابات، وفهرس القوانين المصرية والتقارير الذكية
            </p>
          </div>
        </div>

        {/* Quick Actions in Toolbar */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button
            onClick={() => setActiveSection('egyptian_laws')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold hover:brightness-105 transition cursor-pointer shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>فهرس القوانين المصرية</span>
          </button>

          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/40 font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>إضافة موكل</span>
          </button>

          <button
            onClick={() => setShowAddCaseModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/40 font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>تسجيل قضية</span>
          </button>

          <button
            onClick={() => setShowAddHearingModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/40 font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>تسجيل جلسة</span>
          </button>

          <button
            onClick={() => setShowAddTrxModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/40 font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>قيد أتعاب / مصروفات</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Tabs Navigation + Right Content View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-1.5 p-3 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-lg">
          <span className="text-[11px] font-bold text-[#D4AF37] px-2 block mb-2 font-mono">
            أقسام إدارة المكتب:
          </span>

          {navSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-right ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] shadow-md shadow-black/30'
                    : sec.highlight
                    ? 'bg-[#D4AF37]/10 text-[#E7C779] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30'
                    : 'text-[#F5E5BD]/75 hover:bg-[#2B1914] hover:text-[#F5E5BD]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2B1914]' : 'text-[#D4AF37]'}`} />
                  <span className="truncate">{sec.label}</span>
                </div>
                {sec.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-[#2B1914] text-[#D4AF37]' : 'bg-[#2B1914] text-[#F5E5BD]/70 border border-[#D4AF37]/20'
                    }`}
                  >
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content View Area (9 cols) */}
        <div className="lg:col-span-9 p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-xl space-y-6">
          {/* SECTION 1: DASHBOARD */}
          {activeSection === 'dashboard' && stats && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#D4AF37]" />
                  <span>لوحة التحكم والمؤشرات الشاملة</span>
                </h3>
                <span className="text-xs text-[#D4AF37] font-semibold">مكتب المستشار عطيه الهلباوي</span>
              </div>

              {/* 6 Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-1">
                  <span className="text-xs text-[#F5E5BD]/60">القضايا المتداولة بالمحاكم</span>
                  <div className="text-2xl font-bold font-mono text-[#D4AF37]">{stats.activeCases}</div>
                  <span className="text-[10px] text-[#F5E5BD]/50">من إجمالي {stats.totalCases} قضايا</span>
                </div>

                <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-1">
                  <span className="text-xs text-[#F5E5BD]/60">الموكلين المسجلين</span>
                  <div className="text-2xl font-bold font-mono text-[#E7C779]">{stats.totalClients}</div>
                  <span className="text-[10px] text-[#F5E5BD]/50">شركات وأفراد</span>
                </div>

                <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-1">
                  <span className="text-xs text-[#F5E5BD]/60">الجلسات القادمة بالأجندة</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">{stats.upcomingHearings}</div>
                  <span className="text-[10px] text-emerald-300">محددة المواعيد والطلبات</span>
                </div>

                <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-1">
                  <span className="text-xs text-[#F5E5BD]/60">إجمالي الأتعاب المحصلة</span>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {stats.totalCollected.toLocaleString()} ج.م
                  </div>
                  <span className="text-[10px] text-[#F5E5BD]/50">من {stats.totalAgreedFees.toLocaleString()} ج.م</span>
                </div>

                <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-1">
                  <span className="text-xs text-[#F5E5BD]/60">المتبقي للتحصيل</span>
                  <div className="text-xl font-bold font-mono text-amber-300">
                    {stats.uncollectedFees.toLocaleString()} ج.م
                  </div>
                  <span className="text-[10px] text-amber-400">مستحقات قيد المتابعة</span>
                </div>

                <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-1">
                  <span className="text-xs text-[#F5E5BD]/60">صافي رصيد المكتب</span>
                  <div className="text-xl font-bold font-mono text-[#D4AF37]">
                    {stats.netBalance.toLocaleString()} ج.م
                  </div>
                  <span className="text-[10px] text-[#F5E5BD]/50">بعد خصم المصروفات</span>
                </div>
              </div>

              {/* Upcoming Hearings Preview */}
              <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20 space-y-3">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-2">
                  <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>أقرب الجلسات القادمة بالأجندة:</span>
                  </span>
                  <button
                    onClick={() => setActiveSection('hearings')}
                    className="text-[11px] text-[#E7C779] hover:underline cursor-pointer"
                  >
                    عرض كامل الأجندة ←
                  </button>
                </div>

                <div className="space-y-2">
                  {hearings.slice(0, 3).map((h) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#F5E5BD]">
                          {h.court} • القضية: {h.caseNumber}
                        </div>
                        <div className="text-[11px] text-[#D4AF37] mt-0.5">{h.requirements}</div>
                      </div>
                      <div className="text-left font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#3A241B] text-[#E7C779] font-bold block">
                          {h.date}
                        </span>
                        <span className="text-[10px] text-[#F5E5BD]/50">{h.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Egyptian Laws Encyclopedia Quick Entry Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#2B1914] border border-[#D4AF37]/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold font-amiri text-base text-[#F5E5BD]">
                      الموسوعة التشريعية وفهرس القوانين المصرية
                    </h4>
                    <p className="text-xs text-[#F5E5BD]/70 mt-0.5">
                      فهرس القوانين الكبرى (المدني، الإجراءات الجنائية، العقوبات، المرافعات، الإثبات، العمل) مع محرك بحث فوري في النصوص ومبادئ محكمة النقض.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSection('egyptian_laws')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E7C779] text-[#2B1914] font-bold text-xs transition cursor-pointer shadow-sm shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>تصفح وبحث في القوانين ←</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: CLIENTS */}
          {activeSection === 'clients' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                  <span>دليل العملاء والموكلين ({clients.length})</span>
                </h3>
                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#2B1914] font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>موكل جديد</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/30">
                <table className="w-full text-right text-xs text-[#F5E5BD]">
                  <thead className="bg-[#2B1914] text-[#D4AF37] border-b border-[#D4AF37]/30">
                    <tr>
                      <th className="p-3">اسم الموكل</th>
                      <th className="p-3">الهاتف</th>
                      <th className="p-3">النوع</th>
                      <th className="p-3">العنوان / الرقم القومي</th>
                      <th className="p-3">الملاحظات</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4AF37]/15">
                    {clients.map((cli) => (
                      <tr key={cli.id} className="hover:bg-[#2B1914]/50">
                        <td className="p-3 font-bold text-white">{cli.name}</td>
                        <td className="p-3 font-mono dir-ltr text-right">{cli.phone}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/30 text-[10px]">
                            {cli.type}
                          </span>
                        </td>
                        <td className="p-3 text-[#F5E5BD]/70 text-[11px]">{cli.address || cli.nationalId || '-'}</td>
                        <td className="p-3 text-[#F5E5BD]/70 text-[11px]">{cli.notes || '-'}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteClient(cli.id, cli.name)}
                            className="p-1.5 rounded hover:bg-rose-950 text-rose-400 cursor-pointer"
                            title="حذف الموكل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: CASES */}
          {activeSection === 'cases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#D4AF37]" />
                  <span>سجل القضايا والدعاوى ({cases.length})</span>
                </h3>
                <button
                  onClick={() => setShowAddCaseModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#2B1914] font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>تسجيل قضية جديدة</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/30">
                <table className="w-full text-right text-xs text-[#F5E5BD]">
                  <thead className="bg-[#2B1914] text-[#D4AF37] border-b border-[#D4AF37]/30">
                    <tr>
                      <th className="p-3">رقم الدعوى والسنة</th>
                      <th className="p-3">المحكمة والدائرة</th>
                      <th className="p-3">الموكل</th>
                      <th className="p-3">الخصم</th>
                      <th className="p-3">النوع والموضوع</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3">الجلسة القادمة</th>
                      <th className="p-3 text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4AF37]/15">
                    {cases.map((cs) => (
                      <tr key={cs.id} className="hover:bg-[#2B1914]/50">
                        <td className="p-3 font-bold text-white font-mono">
                          {cs.caseNumber} / {cs.year}
                        </td>
                        <td className="p-3 text-[11px] text-[#F5E5BD]/80">
                          {cs.court} - {cs.circuit}
                        </td>
                        <td className="p-3 font-semibold text-[#D4AF37]">{cs.clientName}</td>
                        <td className="p-3 text-[11px]">{cs.opponentName}</td>
                        <td className="p-3 text-[11px]">{cs.type}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              cs.status === 'متداولة'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : cs.status === 'محكوم فيها'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {cs.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-[#E7C779]">
                          {cs.nextHearingDate || '-'}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteCase(cs.id, cs.caseNumber)}
                            className="p-1.5 rounded hover:bg-rose-950 text-rose-400 cursor-pointer"
                            title="حذف القضية"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 4: HEARINGS */}
          {activeSection === 'hearings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  <span>أجندة رول الجلسات القضائية ({hearings.length})</span>
                </h3>
                <button
                  onClick={() => setShowAddHearingModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#2B1914] font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إدراج جلسة</span>
                </button>
              </div>

              <div className="space-y-3">
                {hearings.map((h) => (
                  <div
                    key={h.id}
                    className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/15 pb-2">
                      <div className="font-bold text-base font-amiri text-[#F5E5BD]">
                        {h.court} • القضية: <span className="font-mono text-[#D4AF37]">{h.caseNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="px-2.5 py-1 rounded bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/30 font-bold">
                          {h.date} - {h.time}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
                      <div>
                        <span className="text-[#D4AF37] font-semibold block">المطلوب بالجلسة:</span>
                        <p className="text-[#F5E5BD]/80">{h.requirements || '-'}</p>
                      </div>
                      <div>
                        <span className="text-emerald-400 font-semibold block">قرار المحكمة / النتيجة:</span>
                        <p className="text-[#F5E5BD]/80">{h.decision || 'بانتظار انعقاد الجلسة'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: DEADLINES & ALERTS */}
          {activeSection === 'deadlines' && (
            <div className="space-y-4">
              <div className="border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                  <span>حاسبة المواعيد الإجرائية وسقوط الحقوق القضائية</span>
                </h3>
                <p className="text-xs text-[#F5E5BD]/70">
                  حساب مواعيد الطعن بالاستئناف والنقض والمعارضة وتقادم الدعاوى طبقاً لقوانين المرافعات والإجراءات الجنائية المصرية
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-1">
                  <span className="font-bold text-[#D4AF37] block">ميعاد الطعن بالاستئناف المدني والتجاري:</span>
                  <div className="text-xl font-bold font-mono text-white">40 يوماً</div>
                  <span className="text-[10px] text-[#F5E5BD]/60">المادة 227 مرافعات • سقوط الحق بقوة القانون</span>
                </div>

                <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-1">
                  <span className="font-bold text-[#D4AF37] block">ميعاد الطعن بالنقض المدني والجنائي:</span>
                  <div className="text-xl font-bold font-mono text-white">60 يوماً</div>
                  <span className="text-[10px] text-[#F5E5BD]/60">المادة 252 مرافعات والقانون 57 لسنة 1959</span>
                </div>

                <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-1">
                  <span className="font-bold text-[#D4AF37] block">ميعاد استئناف الأحكام المستعجلة:</span>
                  <div className="text-xl font-bold font-mono text-white">15 يوماً</div>
                  <span className="text-[10px] text-[#F5E5BD]/60">المادة 227 فقرة 2 مرافعات ومنازعات التنفيذ الوقتية</span>
                </div>

                <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-1">
                  <span className="font-bold text-[#D4AF37] block">تقادم دعوى التعويض عن العمل غير المشروع:</span>
                  <div className="text-xl font-bold font-mono text-white">3 سنوات</div>
                  <span className="text-[10px] text-[#F5E5BD]/60">المادة 377 مدني من تاريخ العلم بالضرر والمسؤول</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: DOCUMENTS */}
          {activeSection === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                  <span>أرشيف المستندات والمذكرات القضائية ({documents.length})</span>
                </h3>
              </div>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                        <span>{doc.title}</span>
                      </div>
                      <div className="text-[11px] text-[#F5E5BD]/60">
                        القضية: {doc.caseNumber || 'عام'} | الموكل: {doc.clientName || 'مكتب'} | الملف: {doc.fileName} ({doc.fileSize})
                      </div>
                      <p className="text-[11px] text-[#D4AF37]">{doc.notes}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/30 text-[10px]">
                        {doc.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: TASKS */}
          {activeSection === 'tasks' && (
            <div className="space-y-4">
              <div className="border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#D4AF37]" />
                  <span>المهام والإجراءات التنفيذية للمكتب ({tasks.length})</span>
                </h3>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{task.title}</div>
                      <div className="text-[11px] text-[#F5E5BD]/60 mt-0.5">
                        المسؤول: {task.assignee} | الموعد: {task.dueDate} | القضية: {task.caseNumber}
                      </div>
                      <p className="text-[11px] text-[#D4AF37] mt-1">{task.description}</p>
                    </div>
                    <div className="text-left space-y-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold block ${
                          task.priority === 'عاجل'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-[#3A241B] text-[#D4AF37]'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-emerald-400 block">{task.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: FINANCES */}
          {activeSection === 'finances' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                  <span>دفتر الحسابات والأتعاب والمصروفات ({transactions.length})</span>
                </h3>
                <button
                  onClick={() => setShowAddTrxModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#2B1914] font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>قيد حركة جديدة</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/30">
                <table className="w-full text-right text-xs text-[#F5E5BD]">
                  <thead className="bg-[#2B1914] text-[#D4AF37] border-b border-[#D4AF37]/30">
                    <tr>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3">نوع الحركة</th>
                      <th className="p-3">الموكل</th>
                      <th className="p-3">القضية</th>
                      <th className="p-3">المبلغ</th>
                      <th className="p-3">طريقة السداد</th>
                      <th className="p-3">البيان</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4AF37]/15">
                    {transactions.map((trx) => (
                      <tr key={trx.id} className="hover:bg-[#2B1914]/50">
                        <td className="p-3 font-mono text-[11px]">{trx.date}</td>
                        <td className="p-3 font-semibold text-white">{trx.type}</td>
                        <td className="p-3 text-[#D4AF37]">{trx.clientName}</td>
                        <td className="p-3 font-mono text-[11px]">{trx.caseNumber || '-'}</td>
                        <td className="p-3 font-bold font-mono text-emerald-400">
                          {trx.amount.toLocaleString()} ج.م
                        </td>
                        <td className="p-3 text-[11px]">{trx.paymentMethod}</td>
                        <td className="p-3 text-[11px] text-[#F5E5BD]/70">{trx.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 9: SEARCH */}
          {activeSection === 'search' && (
            <div className="space-y-4">
              <div className="border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#D4AF37]" />
                  <span>محرك البحث الشامل في ملفات المكتب وسجلاته</span>
                </h3>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-[#D4AF37] absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم الموكل، رقم القضية، المحكمة، أو الكلمات المفتاحية..."
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {searchQuery && (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-[#D4AF37]">نتائج البحث المطابقة:</span>
                  <div className="space-y-2">
                    {cases
                      .filter((c) => c.caseNumber.includes(searchQuery) || c.clientName.includes(searchQuery) || c.court.includes(searchQuery))
                      .map((c) => (
                        <div key={c.id} className="p-3 rounded-lg bg-[#2B1914] border border-[#D4AF37]/20 text-xs">
                          <span className="font-bold text-white">قضية {c.caseNumber} / {c.year}</span> - {c.court} (الموكل: {c.clientName})
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 10: SMART REPORTS (MANDATORY REQUIREMENT) */}
          {activeSection === 'smart_reports' && (
            <div className="space-y-6">
              <div className="border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <span>وحدة التقارير الذكية حسب طلب المستخدم (باللغة العربية)</span>
                </h3>
                <p className="text-xs text-[#F5E5BD]/70 mt-1">
                  اكتب طلب التقرير بالعربية كما يخطر ببالك، وسيقوم المحرك الذكي بتحليل الطلب واستخراج البيانات المعتمدة من السجلات الفعلية وحساب الإجماليات بدقة.
                </p>
              </div>

              {/* Sample Queries Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#D4AF37]">نماذج استعلامات جاهزة للتجربة:</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    'تقرير الأتعاب والمصروفات والتحصيل',
                    'تقرير الجلسات القادمة بالأجندة',
                    'تقرير القضايا المتداولة بمحكمة جنوب القاهرة',
                    'تقرير شامل للموكل شركة النيل',
                    'تقرير المهام العاجلة والتنفيذية',
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setReportQueryInput(preset);
                        handleRunSmartReport(preset);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#2B1914] hover:bg-[#3A241B] text-[#F5E5BD]/80 hover:text-white border border-[#D4AF37]/30 text-[11px] transition cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Query Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={reportQueryInput}
                  onChange={(e) => setReportQueryInput(e.target.value)}
                  placeholder="مثال: تقرير القضايا المتداولة، تقرير الأتعاب والمصروفات خلال شهر، تقرير جلسات الموكل..."
                  className="flex-1 px-4 py-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/40 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  onClick={() => handleRunSmartReport()}
                  disabled={isGeneratingReport || !reportQueryInput.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:from-[#E7C779] hover:to-[#D4AF37] disabled:opacity-40 text-[#2B1914] font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  {isGeneratingReport ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#2B1914] border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري التحليل...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>توليد التقرير الذكي</span>
                    </>
                  )}
                </button>
              </div>

              {/* Render Generated Report */}
              {smartReportResult && (
                <div className="p-6 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37]/40 space-y-5 shadow-2xl printable-area">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/30 pb-3">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold font-amiri text-[#F5E5BD]">
                        {smartReportResult.title}
                      </h4>
                      <div className="text-[11px] text-[#D4AF37] mt-0.5">
                        الطلب: "{smartReportResult.queryPrompt}"
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs no-print">
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-lg bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD] border border-[#D4AF37]/30 text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>طباعة التقرير</span>
                      </button>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#F5E5BD]/90 leading-relaxed font-sans">
                    <strong className="text-[#D4AF37] block mb-1">الموجز التنفيذي للتقرير:</strong>
                    {smartReportResult.executiveSummary}
                  </div>

                  {/* Metrics Badges */}
                  {smartReportResult.metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      {Object.entries(smartReportResult.metrics).map(([k, v]: [string, any], idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20">
                          <span className="text-[10px] text-[#F5E5BD]/60 block">{k}</span>
                          <span className="text-sm font-bold font-mono text-[#D4AF37]">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Report Table */}
                  <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/30">
                    <table className="w-full text-right text-xs text-[#F5E5BD]">
                      <thead className="bg-[#1f120e] text-[#D4AF37] border-b border-[#D4AF37]/30">
                        <tr>
                          {smartReportResult.tableHeaders.map((th: string, i: number) => (
                            <th key={i} className="p-3">{th}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4AF37]/15">
                        {smartReportResult.tableRows.map((row: any[], rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-[#1f120e]/60">
                            {row.map((cell: any, cIdx: number) => (
                              <td key={cIdx} className="p-3">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 11: PRINT CENTER */}
          {activeSection === 'print_center' && (
            <div className="space-y-4">
              <div className="border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <Printer className="w-5 h-5 text-[#D4AF37]" />
                  <span>مركز الطباعة والتصدير القضائي الملكي</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-3">
                  <h4 className="font-bold text-white text-sm">طباعة كشف الجلسات الأسبوعي</h4>
                  <p className="text-[11px] text-[#F5E5BD]/70">
                    توليد جدول الأجندة القضائية للمحاكم موجه للسكرتارية والمحامين للحضور والمرافعة.
                  </p>
                  <button
                    onClick={() => {
                      setActiveSection('hearings');
                      setTimeout(() => window.print(), 300);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#2B1914] font-bold cursor-pointer"
                  >
                    معاينة وطباعة الأجندة
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-3">
                  <h4 className="font-bold text-white text-sm">طباعة التقرير المالي الشامل</h4>
                  <p className="text-[11px] text-[#F5E5BD]/70">
                    كشف حساب مفصل للأتعاب المحصلة والمتبقية والمصروفات القضائية.
                  </p>
                  <button
                    onClick={() => {
                      setActiveSection('finances');
                      setTimeout(() => window.print(), 300);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#2B1914] font-bold cursor-pointer"
                  >
                    معاينة وطباعة الحسابات
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 12: BACKUP & RESTORE */}
          {activeSection === 'backup' && (
            <div className="space-y-6">
              <div className="border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-[#D4AF37]" />
                  <span>إدارة النسخ الاحتياطي واستعادة البيانات</span>
                </h3>
                <p className="text-xs text-[#F5E5BD]/70 mt-1">
                  حفظ نسخة كاملة من سجلات القضايا والعملاء والجلسات والماليات في ملف آمن، مع إمكانية الاستعادة الموثقة.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#D4AF37]" />
                    <span>تصدير نسخة احتياطية كاملة (JSON)</span>
                  </h4>
                  <p className="text-xs text-[#F5E5BD]/70">
                    تنزيل ملف النسخة الاحتياطية المعتمدة لحفظها خارجياً أو نقلها لجهاز آخر.
                  </p>
                  <button
                    onClick={handleDownloadBackup}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#2B1914] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل النسخة الاحتياطية الآن</span>
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>استعادة البيانات من نسخة احتياطية</span>
                  </h4>
                  <p className="text-xs text-[#F5E5BD]/70">
                    متاح للمالك فقط. يرجى اختيار ملف النسخة الاحتياطية (.json) المعتمد.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/40 font-bold text-xs cursor-pointer shadow-md">
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>اختيار ملف والاستعادة</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileRestore}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 13: SETTINGS */}
          {activeSection === 'settings' && settings && (
            <div className="space-y-6">
              <div className="border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#D4AF37]" />
                  <span>إعدادات وبيانات مكتب المستشار عطيه الهلباوي</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#F5E5BD]/70 mb-1">اسم المنشأة والمكتب:</label>
                  <input
                    type="text"
                    disabled={userRole !== 'owner'}
                    value={settings.officeName}
                    className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#F5E5BD]/70 mb-1">المستشار المسؤول:</label>
                  <input
                    type="text"
                    disabled={userRole !== 'owner'}
                    value={settings.counselorName}
                    className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#F5E5BD]/70 mb-1">رقم المحفظة المعتمد للتحويلات:</label>
                  <input
                    type="text"
                    disabled
                    value={settings.walletNumber}
                    className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-emerald-500/40 text-emerald-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#F5E5BD]/70 mb-1">رسوم الاستشارة الخاصة المعتمدة:</label>
                  <input
                    type="text"
                    disabled
                    value={`${settings.consultationFee} جنيه مصري`}
                    className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#F5E5BD]/70 mb-1">رقم الهاتف الأساسي:</label>
                  <input
                    type="text"
                    disabled={userRole !== 'owner'}
                    value={settings.phone}
                    className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#F5E5BD]/70 mb-1">رقم القيد بنقابة المحامين:</label>
                  <input
                    type="text"
                    disabled={userRole !== 'owner'}
                    value={settings.licenseNumber}
                    className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 14: USERS & RBAC & AUDIT LOGS */}
          {activeSection === 'users_rbac' && (
            <div className="space-y-6">
              <div className="border-b border-[#D4AF37]/20 pb-3">
                <h3 className="font-bold text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#D4AF37]" />
                  <span>المستخدمون ومصفوفة الصلاحيات وسجل التدقيق الأمني</span>
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#F5E5BD]/70">المستخدم النشط حالياً:</span>
                  <span className="font-bold text-white">
                    {userRole === 'owner' ? 'المستشار عطيه الهلباوي (المالك)' : 'الموظف / المعاون الإداري'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5E5BD]/70">الصلاحيات الممنوحة:</span>
                  <span className="font-mono text-[#D4AF37] font-bold">
                    {userRole === 'owner' ? 'كامل الصلاحيات الإدارية والمالية' : 'إدخال ومتابعة القضايا والجلسات فقط'}
                  </span>
                </div>
              </div>

              {/* Audit Logs */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#D4AF37]">سجل التدقيق والعمليات الحساسة:</span>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg bg-[#2B1914] border border-[#D4AF37]/15 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{log.action}: </span>
                        <span className="text-[#F5E5BD]/80">{log.details}</span>
                      </div>
                      <div className="text-left font-mono text-[10px] text-[#F5E5BD]/50 shrink-0">
                        <div>{log.performedBy}</div>
                        <div>{new Date(log.timestamp).toLocaleTimeString('ar-EG')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: EGYPTIAN LAWS INDEX & SEARCH (LegalIndexDisplay) */}
          {activeSection === 'egyptian_laws' && (
            <LegalIndexDisplay />
          )}
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddClient}
            className="w-full max-w-md p-6 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37] space-y-4 text-xs"
          >
            <h3 className="font-bold font-amiri text-base text-white border-b border-[#D4AF37]/30 pb-2">
              إضافة موكل جديد
            </h3>
            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">اسم الموكل بالكامل *</label>
              <input
                type="text"
                required
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">رقم الهاتف *</label>
              <input
                type="text"
                required
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">نوع الموكل</label>
              <select
                value={newClientType}
                onChange={(e) => setNewClientType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              >
                <option value="فرد">فرد</option>
                <option value="شركة">شركة</option>
                <option value="جهة حكومية">جهة حكومية</option>
              </select>
            </div>
            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">ملاحظات</label>
              <input
                type="text"
                value={newClientNotes}
                onChange={(e) => setNewClientNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddClientModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1f120e] text-slate-300 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#2B1914] font-bold cursor-pointer"
              >
                حفظ الموكل
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Add Case Modal */}
      {showAddCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddCase}
            className="w-full max-w-lg p-6 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37] space-y-4 text-xs"
          >
            <h3 className="font-bold font-amiri text-base text-white border-b border-[#D4AF37]/30 pb-2">
              تسجيل قضية جديدة
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#F5E5BD]/70 mb-1">رقم القضية *</label>
                <input
                  type="text"
                  required
                  value={newCaseNumber}
                  onChange={(e) => setNewCaseNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
                />
              </div>
              <div>
                <label className="block text-[#F5E5BD]/70 mb-1">السنة القضائية *</label>
                <input
                  type="text"
                  required
                  value={newCaseYear}
                  onChange={(e) => setNewCaseYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">المحكمة المختصة *</label>
              <input
                type="text"
                required
                value={newCaseCourt}
                onChange={(e) => setNewCaseCourt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              />
            </div>

            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">الموكل المرتبط *</label>
              <select
                required
                value={newCaseClientId}
                onChange={(e) => setNewCaseClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              >
                <option value="">-- اختر الموكل --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">اسم الخصم</label>
              <input
                type="text"
                value={newCaseOpponent}
                onChange={(e) => setNewCaseOpponent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCaseModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1f120e] text-slate-300 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#2B1914] font-bold cursor-pointer"
              >
                تسجيل القضية
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Add Hearing Modal */}
      {showAddHearingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddHearing}
            className="w-full max-w-md p-6 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37] space-y-4 text-xs"
          >
            <h3 className="font-bold font-amiri text-base text-white border-b border-[#D4AF37]/30 pb-2">
              إدراج جلسة في الأجندة
            </h3>
            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">رقم القضية *</label>
              <input
                type="text"
                required
                value={newHearingCaseNumber}
                onChange={(e) => setNewHearingCaseNumber(e.target.value)}
                placeholder="مثال: 1420 / 2024"
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">المحكمة *</label>
              <input
                type="text"
                required
                value={newHearingCourt}
                onChange={(e) => setNewHearingCourt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">تاريخ الجلسة *</label>
              <input
                type="date"
                required
                value={newHearingDate}
                onChange={(e) => setNewHearingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">المطلوب بالجلسة</label>
              <input
                type="text"
                value={newHearingReq}
                onChange={(e) => setNewHearingReq(e.target.value)}
                placeholder="مثال: تقديم مستندات، سماع شهود، مرافعة"
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddHearingModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1f120e] text-slate-300 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#2B1914] font-bold cursor-pointer"
              >
                إدراج الجلسة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Add Financial Transaction Modal */}
      {showAddTrxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddTransaction}
            className="w-full max-w-md p-6 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37] space-y-4 text-xs"
          >
            <h3 className="font-bold font-amiri text-base text-white border-b border-[#D4AF37]/30 pb-2">
              قيد حركة مالية جديدة
            </h3>
            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">نوع الحركة *</label>
              <select
                value={newTrxType}
                onChange={(e) => setNewTrxType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              >
                <option value="أتعاب متفق عليها">أتعاب متفق عليها</option>
                <option value="دفعة محصلة">دفعة محصلة</option>
                <option value="مصروفات قضائية">مصروفات قضائية</option>
                <option value="رسوم إعلان وخبرة">رسوم إعلان وخبرة</option>
              </select>
            </div>

            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">الموكل *</label>
              <select
                required
                value={newTrxClientId}
                onChange={(e) => setNewTrxClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              >
                <option value="">-- اختر الموكل --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">المبلغ (بالجنيه المصري) *</label>
              <input
                type="number"
                required
                value={newTrxAmount}
                onChange={(e) => setNewTrxAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">طريقة السداد</label>
              <select
                value={newTrxMethod}
                onChange={(e) => setNewTrxMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              >
                <option value="نقدي">نقدي</option>
                <option value="فودافون كاش">فودافون كاش (01153747612)</option>
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="إنستاباي">إنستاباي</option>
                <option value="شيك">شيك</option>
              </select>
            </div>

            <div>
              <label className="block text-[#F5E5BD]/70 mb-1">البيان والملاحظات</label>
              <input
                type="text"
                value={newTrxNotes}
                onChange={(e) => setNewTrxNotes(e.target.value)}
                placeholder="تفاصيل الحركة ورقم الإيصال"
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTrxModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1f120e] text-slate-300 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#2B1914] font-bold cursor-pointer"
              >
                تقييد الحركة
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
