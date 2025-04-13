import './App.css';
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./navigation/AppRoutes";
import Navbar from "./assets/Navbar";
import {UserProvider} from "./context/UserContext";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <UserProvider>
                    <Navbar/>
                    <AppRoutes />
                </UserProvider>
            </BrowserRouter>
        </div>
    );
}

export default App; // TO JEST KLUCZOWA LINIJKA