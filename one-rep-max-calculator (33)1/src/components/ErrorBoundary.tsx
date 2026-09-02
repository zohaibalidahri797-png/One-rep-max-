import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0b0d] text-[#f7f7f8] flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-[#111317] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading font-extrabold text-2xl uppercase tracking-tight text-white">
                Application Reload Needed
              </h1>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                An unexpected interface state occurred. Click below to reload the One Rep Max Calculator.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-xs bg-[#22c55e] text-[#0a0b0d] hover:bg-[#4ade80] active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(34,197,94,0.35)] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

