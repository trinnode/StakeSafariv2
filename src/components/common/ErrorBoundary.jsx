// Error boundary component - MANDATORY error handling

import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Log error for debugging
    console.error("Error boundary triggered:", error);
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-6">
          <div className="bg-dark-light border border-red-500 p-8 max-w-2xl">
            {/* Army green and black design only */}
            <div className="text-center space-y-6">
              <h1 className="font-gilbert text-2xl font-bold text-red-400">
                Application Error
              </h1>

              <p className="font-gilbert text-white">
                Something went wrong in the staking application. Please refresh
                the page and try again.
              </p>

              {/* Error details in development */}
              {import.meta.env.DEV && this.state.error && (
                <div className="text-left space-y-4">
                  <div className="bg-dark border border-red-600 p-4">
                    <h3 className="font-gilbert text-red-300 font-bold mb-2">
                      Error Details:
                    </h3>
                    <pre className="font-gilbert text-xs text-red-200 whitespace-pre-wrap overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>

                  {this.state.errorInfo && (
                    <div className="bg-dark border border-red-600 p-4">
                      <h3 className="font-gilbert text-red-300 font-bold mb-2">
                        Stack Trace:
                      </h3>
                      <pre className="font-gilbert text-xs text-red-200 whitespace-pre-wrap overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="font-gilbert px-6 py-3 bg-army-green text-white border border-army-green hover:bg-army-green-light"
                >
                  Reload Application
                </button>

                <button
                  onClick={() =>
                    this.setState({
                      hasError: false,
                      error: null,
                      errorInfo: null,
                    })
                  }
                  className="font-gilbert px-6 py-3 bg-transparent text-army-green-lighter border border-army-green-light hover:bg-army-green-light hover:text-white"
                >
                  Try Again
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
