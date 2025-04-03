// app/reset-password/Navbar.js
import React from "react";
import styles from "./ResetPasswordEmail.module.css";

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div className={styles.logoWrapper}>
                    <h1 className={styles.logo}>Trackify</h1>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;