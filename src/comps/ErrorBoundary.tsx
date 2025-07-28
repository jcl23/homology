import { Component, ErrorInfo } from "react";

export type ErrorBoundaryProps = {
    children: React.ReactNode;
};
export type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
};
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ hasError: true, error });
    }

    render() {
        if (this.state.hasError) {
            // Below is the old version that gave insufficient info:
            // return <h1>Something went wrong: {this.state.error?.message}</h1>;
            return (
                <div>
                    <h1>Something went wrong: {this.state.error?.message}</h1>
                    <pre>{this.state.error?.stack}</pre>
                </div>
            );
        }

        return this.props.children;
    }
}