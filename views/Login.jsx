import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GymContext } from '../context/GymContext';
import '../App.css';
import logo from '../assets/logoGYM.jpg';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(GymContext); // Traemos la función para guardar la sesión
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === 'admin' && password === '123') {
            setUser({ nombre: 'Administrador', rol: 'admin' });
            navigate('/gestion-membresias'); // Redirige al panel de admin
        } else if (username === 'recepcion' && password === '123') {
            setUser({ nombre: 'Encargado de Recepción', rol: 'recepcion' });
            navigate('/recepcion'); // Redirige al dashboard BUC5
        } else {
            alert('Credenciales incorrectas. Intenta con admin/123 o recepcion/123');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                {/* Título Principal arriba */}
                <h2 style={{ marginBottom: '15px' }}>GYM Sports Centre</h2>

                {/* Contenedor Flex para alinear el logo y el subtítulo lado a lado */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <img
                        src={logo}
                        alt="Logo del Gimnasio"
                        style={{ width: '120px', borderRadius: '50%' }}
                    />
                    <h3 style={{ margin: 0, color: '#666', fontWeight: 'normal' }}>Sistema SACG</h3>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Usuario:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ej. admin o recepcion"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="123"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;