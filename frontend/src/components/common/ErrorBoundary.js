import React from 'react';
import { Alert, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Alert severity="error" sx={{ m: 2 }}>
                    <Typography variant="h6">渲染错误</Typography>
                    <Typography>页面渲染时发生错误，请刷新页面重试。</Typography>
                </Alert>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
