import { Component, ErrorInfo, ReactNode } from "react";
import "./GameErrorBoundary.styles.css";

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Game ErrorBoundary caught an error:", error, errorInfo);

    this.setState({ error });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="game-error-boundary">
          <div className="game-error-content">
            <div className="game-error-icon">🎮</div>
            <h2 className="game-error-title">Game Error</h2>
            <p className="game-error-message">
              The game encountered an error. This might be due to a connection
              issue or a temporary problem.
            </p>

            <div className="game-error-actions">
              <button className="game-retry-button" onClick={this.handleRetry}>
                Retry Game
              </button>
              <button className="game-home-button" onClick={this.handleGoHome}>
                Go to Home
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="game-error-details">
                <summary>Error Details</summary>
                <pre className="game-error-stack">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GameErrorBoundary;
