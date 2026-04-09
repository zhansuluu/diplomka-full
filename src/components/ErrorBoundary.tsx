import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_black] rounded max-w-md w-full">
            <div className="flex gap-4 items-start">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-600 mb-2">
                  Что-то пошло не так
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {this.state.error?.message || 'Неизвестная ошибка'}
                </p>
                <button
                  onClick={this.handleReset}
                  className="w-full flex gap-2 items-center justify-center bg-[#5D0CA0] text-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
                >
                  <RefreshCw size={16} />
                  Перезагрузить страницу
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
