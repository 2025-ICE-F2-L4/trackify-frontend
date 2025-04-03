import React from 'react';
import Navbar from '../components/reset-password/Navbar';
import PasswordResetForm from '../components/reset-password/PasswordResetForm';
import styles from '../components/reset-password/ResetPasswordEmail.module.css';

export default function ResetPasswordPage() {
    return (
        <main className={styles.resetPasswordEmail}>
            <Navbar />
            <PasswordResetForm />
        </main>
    );
}