import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth.page';
import { HomePage } from './pages/Home.page';

export function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<Auth />} />
            </Routes>
        </Router>
    );
}