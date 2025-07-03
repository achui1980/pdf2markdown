import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationManager = ({ error, success, onCloseError, onCloseSuccess }) => {
    return (
        <>
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={onCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={onCloseError} severity="error" variant="filled">
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!success} 
                autoHideDuration={4000} 
                onClose={onCloseSuccess}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={onCloseSuccess} severity="success" variant="filled">
                    {success}
                </Alert>
            </Snackbar>
        </>
    );
};

export default NotificationManager;
