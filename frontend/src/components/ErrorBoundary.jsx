import React from "react";

/**
 * ErrorBoundary Component - Crash Handling for React App
 *
 * FEATURES:
 * - Catches JavaScript errors anywhere in the component tree
 * - Displays fallback UI instead of crashing the whole app
 * - Logs errors for debugging
 * - Provides refresh functionality
 *
 * USAGE:
 * Wrap components that might crash:
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * ADVANCED USAGE:
 * Pass custom fallback UI:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("🔥 ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI can be passed as props
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Something went wrong 😢
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;