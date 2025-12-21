import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    marginTop: '50px',
                    color: '#333',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    <h1>Something went wrong.</h1>
                    <p>The application encountered an unexpected error.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px'
                        }}
                    >
                        Reload Page
                    </button>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', textAlign: 'left', backgroundColor: '#f8f9fa', padding: '15px' }}>
                            <summary>Error Details</summary>
                            <br />
                            <strong>{this.state.error.toString()}</strong>
                            <br />
                            {this.state.errorInfo.componentStack}
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
