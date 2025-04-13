import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { useRedirect } from '../navigation/RedirectHandlers';
import { useUser } from '../context/UserContext';
import axios from "axios";
import api from "../api";

export default function Login() {
    const { loginUser } = useUser();
    const handleRedirectToRegister = useRedirect('/register');
    const handleRedirectToProfile = useRedirect('/profile');

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            setError('Both username and password are required.');
            return;
        }

        try {
            const response = await api.post('/auth/login', {
                username: formData.username,
                password: formData.password,
            });

            localStorage.setItem('authToken', response.data.token);
            handleRedirectToProfile();
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again later.');
        }
    };


    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    padding: 4,
                    backgroundColor: 'background.paper',
                    boxShadow: 3,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#6D4C41',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#5C4033',
                            },
                        }}
                        disabled={!formData.username || !formData.password} // Disable button when fields are empty
                    >
                        Login
                    </Button>
                    <Box textAlign="center">
                        <Link component="button" variant="body2" onClick={handleRedirectToRegister}>
                            Don't have an account? Register
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
