import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ClienteDashboard from './components/Client';
import AdminDashboard from './components/AdminDashboard';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client" element={<ClienteDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
}

export default App;
