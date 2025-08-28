import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-sentinel-blue-dark text-sentinel-light-gray font-sans flex items-center justify-center">
            <div className="text-center p-8 bg-sentinel-blue-light rounded-lg border border-red-500/50">
                <h1 className="text-2xl font-bold text-red-400">Something went wrong.</h1>
                <p className="text-sentinel-gray mt-2">An unexpected error occurred. Please try refreshing the page.</p>
                 <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-sentinel-cyan text-sentinel-blue-deep font-bold py-2 px-4 rounded-lg hover:bg-opacity-80"
                >
                    Refresh
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
