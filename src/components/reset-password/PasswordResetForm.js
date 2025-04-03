// app/reset-password/PasswordResetForm.js
"use client";
import React, { useState } from "react";
import styles from "./ResetPasswordEmail.module.css";

function PasswordResetForm() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log("Reset password for:", email);
    };

    return (
        <section className={styles.passwordBox}>
            <h2 className={styles.resetPasswordTitle}>Reset Password</h2>
            <p className={styles.resetPasswordDescription}>
                Please enter the e-mail address you used to create your account
            </p>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.inputContainer}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            className={styles.inputBox}
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Email address"
                        />
                    </div>
                </div>
                <button type="submit" className={styles.sendEmailButton}>
                    Send E-Mail
                </button>
            </form>
        </section>
    );
}

export default PasswordResetForm;