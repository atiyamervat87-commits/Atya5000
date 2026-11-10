import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Scale } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RoyalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RoyalErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-[#1f120e] border-2 border-[#D4AF37]/40 shadow-2xl text-center space-y-4 my-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
            <Scale className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-amiri text-[#F5E5BD]">
            {this.props.fallbackTitle || 'استقرار المحرك القضائي مؤمّن'}
          </h3>
          <p className="text-xs text-[#F5E5BD]/70 max-w-md mx-auto leading-relaxed">
            تم استيعاب الاستثناء بنجاح لضمان عدم توقف واجهة المنصة. يمكنك إعادة تحميل الوحدة أو متابعة الاستشارة مباشرة.
          </p>
          <div className="pt-2">
            <button
              onClick={this.handleReset}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold text-xs cursor-pointer hover:brightness-110 shadow flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة تهيئة الوحدة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
