import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          fontFamily: 'system-ui, sans-serif',
          maxWidth: '600px',
          margin: '2rem auto'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>
            ⚠️ Something went wrong
          </h1>
          <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
            We're sorry, but there was an error loading the application.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Reload Page
          </button>
          <details style={{ marginTop: '2rem', textAlign: 'left' }}>
            <summary>Error Details</summary>
            <pre style={{ 
              background: '#f3f4f6', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;