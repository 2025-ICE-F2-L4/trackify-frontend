import './App.css';
import {BrowserRouter, useLocation} from "react-router-dom";
import AppRoutes from "./navigation/AppRoutes";
import Navbar from "./assets/Navbar";
import {UserProvider} from "./context/UserContext";
import LandingNavbar from "./assets/LandingNavbar";

function AppContent() {
    const location = useLocation();

    const landingRoutes = ['/', '/login', '/register'];
    const isLandingNavbarRoute = landingRoutes.includes(location.pathname);

    return (
        <>
            {isLandingNavbarRoute ? <LandingNavbar /> : <Navbar />}
            <AppRoutes />
        </>
    );
}

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <UserProvider>
                    <AppContent />
                </UserProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;