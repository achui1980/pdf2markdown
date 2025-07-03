import React from 'react';
import {
    Paper,
    Stepper,
    Step,
    StepLabel,
    Box
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const steps = ['选择PDF文件', '转换处理', '查看结果'];

const StepIndicator = ({ activeStep }) => {
    return (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel
                            StepIconComponent={({ active, completed }) => (
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: completed ? '#4caf50' : active ? '#2196f3' : '#e0e0e0',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {completed ? <CheckCircle /> : index + 1}
                                </Box>
                            )}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Paper>
    );
};

export default StepIndicator;
