import React, { useState, useRef, useEffect } from 'react';
import {
  Lock,
  Camera,
  Mic,
  Paperclip,
  Send,
  Copy,
  Check,
  Printer,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Phone,
  ShieldCheck,
  CreditCard,
  StopCircle,
  Play,
  RotateCcw,
  X,
  FileCheck,
  Eye,
  SwitchCamera,
  Trash2,
} from 'lucide-react';
import { ChatMessage, PaymentVerification, UserRole } from '../types/office';

interface PrivateConsultationRoomProps {
  userRole: UserRole;
}

export const PrivateConsultationRoom: React.FC<PrivateConsultationRoomProps> = ({ userRole }) => {
  // Session & payment state
  const userId = 'user-current-session';
  const userName = 'المستشير الخاص';

  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'under_review' | 'approved' | 'rejected'>('approved');
  const [paymentDetails, setPaymentDetails] = useState<PaymentVerification | null>(null);
  const [referenceInput, setReferenceInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('01153747612');
  const [noteInput, setNoteInput] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Owner review list
  const [allPayments, setAllPayments] = useState<PaymentVerification[]>([]);
  const [showAdminReview, setShowAdminReview] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'priv-welcome',
      sender: 'counselor',
      text: `بسم الله الرحمن الرحيم\n\nمرحباً بحضرتكم في غرفة الاستشارة الخاصة والسرية للمستشار عطيه الهلباوي.\n\nتم اعتماد استحقاق الجلسة وسداد الرسوم الرسمية (200 ج.م). هذه الغرفة مشفرة ومخصصة للمسائل المعقدة وعالية الحساسية.\n\nيمكنكم الآن:\n1. إرسال الشرح والوقائع التفصيلية كتابةً.\n2. إرفاق المستندات الرسمية وعقود البيع والإيصالات (PDF / DOCX / صور).\n3. تسجيل رسائل صوتية واضحة عبر الميكروفون المدمج.\n4. استخدام الكاميرا المباشرة لالتقاط وفحص الوثائق فورياً.`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Attachments state
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; type: string; size: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio recording state
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch payment status
  const checkStatus = async () => {
    try {
      const res = await fetch(`/api/payments/status?userId=${userId}`);
      const data = await res.json();
      if (data.status) {
        setPaymentStatus(data.status);
        setPaymentDetails(data.paymentDetails);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllPayments = async () => {
    try {
      const res = await fetch('/api/payments/all');
      const data = await res.json();
      setAllPayments(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkStatus();
    if (userRole === 'owner') {
      fetchAllPayments();
    }
  }, [userRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // --- Payment Gate Actions ---
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceInput.trim()) return;

    setIsSubmittingPayment(true);
    try {
      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          phone: phoneInput,
          referenceNumber: referenceInput,
          proofNote: noteInput,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPaymentStatus('under_review');
        setPaymentDetails(data);
      } else {
        alert(data.error || 'حدث خطأ أثناء إرسال إثبات السداد');
      }
    } catch (err) {
      console.error(err);
      alert('فشل الاتصال بالخادم');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Quick Demo Verification
  const handleQuickVerify = async (approve: boolean) => {
    try {
      await fetch('/api/payments/quick-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          isApproved: approve,
        }),
      });
      setPaymentStatus(approve ? 'approved' : 'unpaid');
      checkStatus();
    } catch (err) {
      console.error(err);
    }
  };

  // Owner review approve / reject
  const handleOwnerVerify = async (paymentId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userRole,
          'x-user-name': 'المستشار عطيه الهلباوي (المالك)',
        },
        body: JSON.stringify({ paymentId, status }),
      });
      if (res.ok) {
        fetchAllPayments();
        checkStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- File Attachment Handler ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 25 * 1024 * 1024) {
      alert('حجم الملف يتجاوز الحد الأقصى المسموح (25 ميغابايت)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setAttachedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          url: base64Url,
          type: file.type || 'application/octet-stream',
          size: `${(file.size / 1024).toFixed(1)} KB`,
        },
      ]);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Voice Recording Handler ---
  const startAudioRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        // stop tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('تعذر الوصول إلى الميكروفون. يرجى التأكد من منح الإذن للمتصفح.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const cancelAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
  };

  // --- Camera Handler ---
  const openCamera = async () => {
    try {
      setCameraError(null);
      setCapturedPhotoUrl(null);
      setIsCameraOpen(true);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error(err);
      setCameraError('تعذر فتح الكاميرا. يرجى التأكد من توصيل الكاميرا ومنح إذن الاستخدام للمتصفح.');
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const closeCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCapturedPhotoUrl(null);
    setCameraError(null);
  };

  const switchCameraFacing = async () => {
    stopCameraStream();
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextMode },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      setCameraError('فشل تبديل الكاميرا على هذا الجهاز.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoData = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhotoUrl(photoData);
      stopCameraStream();
    }
  };

  const retakePhoto = () => {
    setCapturedPhotoUrl(null);
    openCamera();
  };

  const attachCapturedPhoto = () => {
    if (!capturedPhotoUrl) return;
    setAttachedFiles((prev) => [
      ...prev,
      {
        name: `صورة_كاميرا_${Date.now()}.jpg`,
        url: capturedPhotoUrl,
        type: 'image/jpeg',
        size: 'صورة مباشرة',
      },
    ]);
    closeCamera();
  };

  // --- Send Message ---
  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text && !recordedAudioUrl && attachedFiles.length === 0) return;

    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `priv-msg-${Date.now()}`,
      sender: 'user',
      text: text || 'تم إرسال مستندات/تسجيلات مرفقة للاستشارة الخاصة.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
      audioUrl: recordedAudioUrl || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setAttachedFiles([]);
    setRecordedAudioUrl(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/consultation/private', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: text,
          attachments: userMessage.attachments,
          audioUrl: userMessage.audioUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشلت معالجة الاستشارة الخاصة');
      }

      const counselorMessage: ChatMessage = {
        id: `counselor-priv-${Date.now()}`,
        sender: 'counselor',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, counselorMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Render Payment Gate if Not Approved ---
  if (paymentStatus !== 'approved') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="p-8 rounded-3xl bg-[#2B1914] border-2 border-[#D4AF37]/50 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-inner">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase block">
              الوحدة الثانية • حماية وسرية تامة
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#F5E5BD]">
              بوابة الدخول إلى غرفة الاستشارة الخاصة
            </h2>
            <p className="text-sm text-[#F5E5BD]/80 max-w-xl mx-auto">
              تتيح الغرفة الخاصة فحصاً دقيقاً للمستندات والملفات والصوت، وفتح الكاميرا المباشرة، مع المستشار عطيه الهلباوي وفق ميثاق السرية المهنية.
            </p>
          </div>

          {/* Payment Card Specs */}
          <div className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 text-right space-y-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <span className="text-xs text-[#F5E5BD]/70">الرسوم المحددة للجلسة:</span>
              <span className="text-2xl font-bold font-mono text-[#D4AF37]">200 جنيه مصري</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <span className="text-xs text-[#F5E5BD]/70">رقم المحفظة المعتمد:</span>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400 dir-ltr">
                  01153747612
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  فودافون كاش / إنستاباي
                </span>
              </div>
            </div>

            <div className="text-xs text-[#F5E5BD]/80 space-y-1 pt-1">
              <p><strong>تعليمات السداد:</strong></p>
              <p className="text-[11px] text-[#F5E5BD]/60">
                1. قم بتحويل مبلغ 200 ج.م إلى رقم المحفظة (01153747612).<br />
                2. أدخل رقم العملية المرجعي ورقم الهاتف المحول منه أدناه.<br />
                3. سيتم مراجعة العملية وفتح الغرفة الخاصة فور التحقق.
              </p>
            </div>
          </div>

          {/* Status Alert */}
          {paymentStatus === 'under_review' && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
              <span>طلبك قيد التحقق والمراجعة من قبل المستشار. يرجى الانتظار أو التواصل لتسريع الاعتماد.</span>
            </div>
          )}

          {paymentStatus === 'rejected' && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-700 text-rose-200 text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>تم رفض طلب الدفع السابق لعدم تطابق التحويل. يرجى إعادة إرسال الإثبات الصحيح.</span>
            </div>
          )}

          {/* Proof Form */}
          <form onSubmit={handleSubmitProof} className="max-w-lg mx-auto text-right space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F5E5BD]/80 mb-1">
                رقم المعاملة / كود التحويل المرجعي (Reference Number) *
              </label>
              <input
                type="text"
                required
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                placeholder="مثال: VF-98421035 أو رقم إشعار البنك"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5E5BD]/80 mb-1">
                رقم الهاتف المحول منه *
              </label>
              <input
                type="text"
                required
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="رقم المحفظة التي قمت بالتحويل منها"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5E5BD]/80 mb-1">
                ملاحظات إضافية أو موضوع الاستشارة
              </label>
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="مثال: استشارة عاجلة بخصوص عقد بيع وقضية طرد"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingPayment}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:from-[#E7C779] hover:to-[#D4AF37] text-[#2B1914] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-black/40"
            >
              {isSubmittingPayment ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري تسجيل الطلب...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>إرسال إثبات السداد لمراجعة المستشار</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Approval Toggle */}
          <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-[#F5E5BD]/60">لأغراض التقييم والاختبار الفوري:</span>
            <button
              type="button"
              onClick={() => handleQuickVerify(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-semibold cursor-pointer transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>تفعيل تجريبي فوري للجلسة (فتح الغرفة الآن)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Unlocked Private Room ---
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Judicial Banner */}
      <div className="p-5 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37]/50 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/25 border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-amiri text-[#F5E5BD]">
                غرفة الاستشارة الخاصة والمشفرة
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                مفعلة ومعتمدة ✓
              </span>
            </div>
            <p className="text-xs text-[#F5E5BD]/70 mt-0.5">
              جلسة سرية مع المستشار عطيه الهلباوي • دعم الكاميرا المباشرة والصوت والمستندات
            </p>
          </div>
        </div>

        {/* Tools and Lock Status */}
        <div className="flex items-center gap-2 text-xs">
          {userRole === 'owner' && (
            <button
              onClick={() => setShowAdminReview(!showAdminReview)}
              className="px-3 py-1.5 rounded-lg bg-[#1f120e] hover:bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/30 transition cursor-pointer"
            >
              طلبات الدفع ({allPayments.filter((p) => p.status === 'under_review').length})
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD] border border-[#D4AF37]/30 transition cursor-pointer"
            title="طباعة الجلسة بالكامل"
          >
            <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">طباعة</span>
          </button>

          <button
            onClick={() => handleQuickVerify(false)}
            className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-[11px] transition cursor-pointer"
            title="إعادة قفل الغرفة"
          >
            قفل الجلسة
          </button>
        </div>
      </div>

      {/* Owner Review Drawer if opened */}
      {showAdminReview && userRole === 'owner' && (
        <div className="p-4 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/40 space-y-3">
          <h4 className="text-xs font-bold text-[#D4AF37] font-amiri">
            لوحة مراجعة مدفوعات الاستشارات الخاصة (صلاحية المالك):
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {allPayments.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{p.userName} - {p.phone}</div>
                  <div className="text-[11px] text-[#F5E5BD]/60">
                    المرجع: {p.referenceNumber} | الرسوم: {p.amount} ج.م | الحالة: {p.status}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.status !== 'approved' && (
                    <button
                      onClick={() => handleOwnerVerify(p.id, 'approved')}
                      className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] cursor-pointer"
                    >
                      اعتماد
                    </button>
                  )}
                  {p.status !== 'rejected' && (
                    <button
                      onClick={() => handleOwnerVerify(p.id, 'rejected')}
                      className="px-2.5 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white font-bold text-[11px] cursor-pointer"
                    >
                      رفض
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Camera Live Modal Overlay */}
      {isCameraOpen && (
        <div className="p-5 rounded-2xl bg-[#1f120e] border-2 border-[#D4AF37] shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold font-amiri text-base">
              <Camera className="w-5 h-5" />
              <span>كاميرا المعاينة وفحص المستندات القضائية المباشرة</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={switchCameraFacing}
                className="px-2.5 py-1 rounded-lg bg-[#2B1914] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/30 text-xs flex items-center gap-1 cursor-pointer"
                title="تبديل الكاميرا الأمامية / الخلفية"
              >
                <SwitchCamera className="w-3.5 h-3.5" />
                <span>تبديل</span>
              </button>
              <button
                onClick={closeCamera}
                className="p-1 rounded-lg hover:bg-rose-950 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {cameraError ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{cameraError}</span>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-[380px] flex items-center justify-center">
              {!capturedPhotoUrl ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={capturedPhotoUrl}
                  alt="Captured Document"
                  className="w-full h-full object-contain"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />

              {/* Live stream badge */}
              {!capturedPhotoUrl && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-600/80 text-white text-[10px] font-bold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>معاينة حية</span>
                </div>
              )}
            </div>
          )}

          {/* Camera Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!capturedPhotoUrl ? (
              <button
                onClick={capturePhoto}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:from-[#E7C779] hover:to-[#D4AF37] text-[#2B1914] font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-lg shadow-black/40"
              >
                <Camera className="w-4 h-4" />
                <span>التقاط صورة المستند</span>
              </button>
            ) : (
              <>
                <button
                  onClick={retakePhoto}
                  className="px-4 py-2 rounded-xl bg-[#2B1914] hover:bg-[#3A241B] text-[#F5E5BD] border border-[#D4AF37]/40 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>إعادة الالتقاط</span>
                </button>
                <button
                  onClick={attachCapturedPhoto}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>إرفاق الصورة بالمحادثة</span>
                </button>
              </>
            )}
            <button
              onClick={closeCamera}
              className="px-4 py-2 rounded-xl bg-[#1a0e0b] hover:bg-slate-900 text-slate-400 text-xs cursor-pointer"
            >
              إلغاء وإغلاق
            </button>
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#1a0e0b]/90 border border-[#D4AF37]/30 shadow-2xl min-h-[420px] max-h-[580px] overflow-y-auto space-y-4 printable-area">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-start' : 'items-end'} space-y-1.5`}
            >
              <div className="flex items-center gap-2 text-[11px] text-[#F5E5BD]/60 px-1">
                <span className="font-semibold text-[#D4AF37]">
                  {isUser ? 'المستشير' : 'المستشار عطيه الهلباوي'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[90%] sm:max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
                  isUser
                    ? 'bg-[#3A241B] text-[#F5E5BD] border border-[#D4AF37]/30 rounded-tr-none'
                    : 'bg-[#2B1914] text-[#F5E5BD] border-2 border-[#D4AF37]/60 rounded-tl-none font-sans'
                }`}
              >
                {msg.text}

                {/* Render Attachments if any */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#D4AF37]/20 space-y-2">
                    <span className="text-[10px] text-[#D4AF37] block font-semibold">المرفقات:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-[#1f120e] border border-[#D4AF37]/30 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                            <span className="truncate text-[11px]">{att.name}</span>
                          </div>
                          {att.url && (
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-[#D4AF37] hover:underline shrink-0"
                            >
                              عرض
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render Audio Player if any */}
                {msg.audioUrl && (
                  <div className="mt-3 pt-3 border-t border-[#D4AF37]/20 space-y-1">
                    <span className="text-[10px] text-[#D4AF37] block font-semibold">رسالة صوتية مسجلة:</span>
                    <audio controls src={msg.audioUrl} className="w-full h-8" />
                  </div>
                )}

                {/* Response Action Tools */}
                {!isUser && (
                  <div className="pt-3 mt-3 border-t border-[#D4AF37]/20 flex items-center justify-between gap-3 text-xs no-print">
                    <span className="text-[10px] text-[#D4AF37]/80">
                      استشارة قضائية سرية ومحمية
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD]/80 hover:text-[#F5E5BD] border border-[#D4AF37]/30 text-[11px] transition cursor-pointer"
                        title="نسخ رد المستشار"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#D4AF37]" />
                            <span>نسخ الرد</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handlePrint}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD]/80 hover:text-[#F5E5BD] border border-[#D4AF37]/30 text-[11px] transition cursor-pointer"
                        title="طباعة هذا الرد"
                      >
                        <Printer className="w-3 h-3 text-[#D4AF37]" />
                        <span>طباعة</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-end space-y-1">
            <div className="text-[11px] text-[#D4AF37] px-1 font-semibold flex items-center gap-1.5">
              <span>المستشار عطيه الهلباوي يفحص أوراق الجلسة الخاصة...</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/40 text-xs text-[#F5E5BD] flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
              <span>جاري تدقيق الوقائع والأدلة والمستندات وصياغة الرأي القضائي السري...</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview Chips */}
      {attachedFiles.length > 0 && (
        <div className="p-3 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 space-y-2">
          <span className="text-[11px] font-semibold text-[#D4AF37]">الملفات والصور المرفقة الجاهزة للإرسال:</span>
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2B1914] border border-[#D4AF37]/40 text-xs text-[#F5E5BD]"
              >
                <FileCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="max-w-[140px] truncate">{file.name}</span>
                <span className="text-[10px] text-[#F5E5BD]/50 font-mono">({file.size})</span>
                <button
                  onClick={() => removeAttachment(i)}
                  className="p-0.5 rounded hover:bg-rose-900 text-rose-400 cursor-pointer"
                  title="إزالة المرفق"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio Recording Live Preview */}
      {isRecordingAudio && (
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-700/60 flex items-center justify-between text-xs text-rose-200 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-semibold">جاري تسجيل الصوت عبر الميكروفون...</span>
            <span className="font-mono font-bold text-sm text-white">
              {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={stopAudioRecording}
              className="px-3 py-1 rounded bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>إيقاف وحفظ</span>
            </button>
            <button
              onClick={cancelAudioRecording}
              className="px-2.5 py-1 rounded bg-[#1f120e] hover:bg-slate-800 text-slate-300 text-xs cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {recordedAudioUrl && !isRecordingAudio && (
        <div className="p-3 rounded-xl bg-[#1f120e] border border-emerald-600/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-emerald-400 font-semibold">التسجيل الصوتي جاهز:</span>
            <audio controls src={recordedAudioUrl} className="h-8 flex-1 max-w-xs" />
          </div>
          <button
            onClick={() => setRecordedAudioUrl(null)}
            className="p-1.5 rounded hover:bg-rose-950 text-rose-400 cursor-pointer"
            title="حذف التسجيل"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Multi-modal Input Controls (Text + Camera + Mic + Attachments) */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37]/50 shadow-xl space-y-3 no-print">
        <div className="flex items-center gap-2">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Camera Button */}
          <button
            type="button"
            onClick={openCamera}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1f120e] hover:bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-semibold transition cursor-pointer shrink-0"
            title="فتح الكاميرا والتقاط صورة للمستند"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">فتح الكاميرا</span>
          </button>

          {/* Mic Button */}
          <button
            type="button"
            onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer shrink-0 ${
              isRecordingAudio
                ? 'bg-rose-700 text-white border-rose-500 animate-pulse'
                : 'bg-[#1f120e] hover:bg-[#3A241B] text-[#D4AF37] border-[#D4AF37]/40'
            }`}
            title="تسجيل رسالة صوتية عبر الميكروفون"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">{isRecordingAudio ? 'إيقاف التسجيل' : 'تسجيل صوتي'}</span>
          </button>

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1f120e] hover:bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-semibold transition cursor-pointer shrink-0"
            title="إرفاق مستندات PDF أو DOCX أو صور"
          >
            <Paperclip className="w-4 h-4" />
            <span className="hidden sm:inline">إرفاق مستند</span>
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="اكتب تفاصيل الاستشارة الخاصة أو استفسارات المستندات المرفقة..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#F5E5BD] placeholder-[#F5E5BD]/40 focus:outline-none focus:border-[#D4AF37]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={isLoading || (!inputText.trim() && !recordedAudioUrl && attachedFiles.length === 0)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:from-[#E7C779] hover:to-[#D4AF37] disabled:opacity-40 text-[#2B1914] font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md shadow-black/40 shrink-0"
          >
            <span>إرسال</span>
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#F5E5BD]/60 px-1">
          <span>* الغرفة الخاصة تدعم الكاميرا والميكروفون وإرفاق ملفات PDF و DOCX والصور المشفرة.</span>
          <span>رسوم الاستشارة: 200 ج.م معتمدة</span>
        </div>
      </div>
    </div>
  );
};
