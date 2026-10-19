import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GymContext } from '../context/GymContext';
import logo from '../assets/logoGYM.jpg';
import '../App.css';

const Navbar = () => {
    // 1. Extraemos "socios" del contexto junto con la información del usuario
    const { user, setUser, socios } = useContext(GymContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate('/login');
    };

    if (!user) return null;

    // 2. LÓGICA DE LOS CONTADORES
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const totalClientes = socios.length;

    // Filtramos a los que tienen estatus 'Activo' Y su fecha no ha expirado
    const activos = socios.filter(socio => {
        if (socio.estatus !== 'Activo') return false;
        
        const vencimiento = new Date(socio.vencimiento + 'T00:00:00');
        return hoy <= vencimiento;
    }).length;

    // Los inactivos son la resta del total menos los activos (incluye registros nuevos y vencidos)
    const noActivos = totalClientes - activos;

    return (
        <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', padding: '10px 20px' }}>
            
            <div className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                SACG - Gym Sports Centre
                <img 
                    src={logo} 
                    alt="Logo del Gimnasio" 
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                />
            </div>

            {/* 3. SECCIÓN VISUAL DE LOS CONTADORES */}
            <div className="navbar-stats" style={{ display: 'flex', gap: '20px', background: '#f8f9fa', padding: '8px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>
                <span style={{ color: '#28a745', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    🟢 Activos: {activos}
                </span>
                <span style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    🔴 Inactivos: {noActivos}
                </span>
                <span style={{ color: '#0056b3', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    👥 Total: {totalClientes}
                </span>
            </div>
            
            <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link to="/recepcion" className="nav-link">Control de Acceso</Link>
                <Link to="/registrar-socio" className="nav-link">Registrar Socio</Link>
                <Link to="/cobros-renovaciones" className="nav-link">Cobros</Link>

                {user.rol === 'admin' && (
                    <Link to="/gestion-membresias" className="nav-link" style={{ color: '#ffc107' }}>
                        Panel Admin
                    </Link>
                )}

                <button onClick={handleLogout} className="btn-login" style={{ padding: '5px 15px', backgroundColor: '#dc3545', width: 'auto', marginLeft: '10px' }}>
                    Salir
                </button>
            </div>
        </nav>
    );
};

export default Navbar;