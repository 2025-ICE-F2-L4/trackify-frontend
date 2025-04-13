import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { useRedirect } from "../navigation/RedirectHandlers";
import api from "../api";

export default function Register() {
    const handleRedirectToLogin = useRedirect('/Login');
    const handleRedirectToProfile = useRedirect('/Profile');

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Validate form data before submission
    const validateForm = () => {
        const { username, email, password } = formData;
        if (!username || !email || !password) {
            setFormError("All fields are required!");
            return false;
        }
        setFormError(null);
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            setIsSubmitting(true);
            // Send form data to the backend API using the /auth/register endpoint
            // const response = await axios.post('/auth/register', {
            //     username: formData.username,
            //     password: formData.password,
            //     email: formData.email,
            // }, {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            // });
            const response = await api.post('/auth/register', {
                username: formData.username,
                password: formData.password,
                email: formData.email,
            });

            console.log('Response from server:', response.data);
            // Redirect to the profile page after successful registration
            handleRedirectToProfile();
        } catch (error) {
            if (error.response) {
                console.error('Backend responded with:', error.response.data);
                setFormError(error.response.data.message || 'Submission failed.');
            } else {
                console.error('Error during submission:', error.message);
                setFormError('Could not connect to server.');
            }
        } finally {
            setIsSubmitting(false);
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
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {formError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {formError}
                        </Alert>
                    )}

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
                        disabled={!formData.email || !formData.password || !formData.username}
                    >
                        {isSubmitting ? 'Submitting...' : 'Register'}
                    </Button>

                    <Box textAlign="center">
                        <Link component="button" variant="body2" onClick={handleRedirectToLogin}>
                            Already have an account? Login
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
