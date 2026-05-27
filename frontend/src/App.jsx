import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/registro" element={<Register />} />
        </Routes>
    );
}

export default App;
