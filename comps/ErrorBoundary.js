import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Component } from "react";
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true, error });
    }
    render() {
        if (this.state.hasError) {
            // Below is the old version that gave insufficient info:
            // return <h1>Something went wrong: {this.state.error?.message}</h1>;
            return (_jsxs("div", { children: [_jsxs("h1", { children: ["Something went wrong: ", this.state.error?.message] }), _jsx("pre", { children: this.state.error?.stack })] }));
        }
        return this.props.children;
    }
}
