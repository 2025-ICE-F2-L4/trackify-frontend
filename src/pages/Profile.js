import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Avatar,
    IconButton
} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function Profile() {
    const { user, setUser } = useUser();
    const [profile, setProfile] = useState({
        name: "Jan Kowalski",
        email: "jan.kowalski@example.com",
        city: "Warszawa",
        phone: "123-456-789",
        profileImage: '/profpic.png' // Ścieżka do pliku w folderze public
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile(prev => ({
                    ...prev,
                    profileImage: event.target.result
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        setUser(profile);
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
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {/* Awatar i przycisk do zmiany zdjęcia */}
                <Box sx={{ position: 'relative', mb: 3 }}>
                    <Avatar
                        src={profile.profileImage}
                        sx={{
                            width: 120,
                            height: 120,
                            border: '3px solid #6D4C41'
                        }}
                    />
                    {isEditing && (
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: '#6D4C41',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#5C4033',
                                },
                            }}
                        >
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <PhotoCamera />
                        </IconButton>
                    )}
                </Box>

                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Mój profil
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {isEditing ? (
                    <Box component="form" sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Imię i nazwisko"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Miasto"
                            name="city"
                            value={profile.city}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Telefon"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                        />

                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            onClick={handleSave}
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#6D4C41',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#5C4033',
                                },
                            }}
                        >
                            Zapisz zmiany
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ mt: 3, width: '100%' }}>
                        <Typography variant="h6" align="center">{profile.name}</Typography>
                        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                            {profile.email}
                        </Typography>



                        <Typography variant="h6" gutterBottom>Dane osobowe</Typography>
                        <Typography variant="body1" gutterBottom>Miasto: {profile.city}</Typography>
                        <Typography variant="body1" gutterBottom>Telefon: {profile.phone}</Typography>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setIsEditing(true)}
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#6D4C41',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#5C4033',
                                },
                            }}
                        >
                            Edytuj profil
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
}