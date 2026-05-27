import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ClienteDashboard from './components/Client';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client" element={<ClienteDashboard />} />
        </Routes>
    );
}

export default App;
