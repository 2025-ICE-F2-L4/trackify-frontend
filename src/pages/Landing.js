import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import './Landing.css';
import {useRedirect} from "../navigation/RedirectHandlers";
import '@fontsource/poppins';

export default function Landing() {
    const handleRedirectToRegister = useRedirect("/register");
    return (
        <Box className="trackify-landing">
            <Typography variant="h2" component="h1" className="trackify-title">
                Welcome to Trackify
            </Typography>
            <Typography variant="h5" className="trackify-subtitle">
                Your personal goal-tracking companion
            </Typography>
            <Button
                variant="contained"
                size="large"
                onClick={handleRedirectToRegister}
                sx={{
                    mt: 4,
                    backgroundColor: '#FFB300',
                    color: '#6D4C41',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: '#E0A800',
                    },
                }}
            >
                Get Started
            </Button
            >
        </Box>
    );
}
