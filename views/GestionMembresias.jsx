import { useState, useContext } from 'react';
import { GymContext } from '../context/GymContext';
import '../App.css';

const GestionMembresias = () => {
    // Traemos las tarifas actuales y la función para actualizarlas
    const { tarifas, setTarifas, user } = useContext(GymContext);
    
    // Estado local para manejar los inputs del formulario
    const [precios, setPrecios] = useState(tarifas);

    const handleChange = (e) => {
        setPrecios({
            ...precios,
            [e.target.name]: parseInt(e.target.value) || 0
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTarifas(precios); // Actualizamos el contexto global
        alert('Tarifas actualizadas correctamente en el sistema.');
    };

    // Validación extra de seguridad por si alguien fuerza la URL
    if (user?.rol !== 'admin') {
        return (
            <div className="dashboard-container" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1 style={{ color: '#dc3545', fontSize: '3rem' }}>ACCESO DENEGADO</h1>
                <p>No tienes los privilegios necesarios para ver este módulo.</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="form-box">
                <h2 style={{ color: '#333' }}>Gestión de Membresías</h2>
                <h3 style={{ color: '#666', marginBottom: '20px', fontSize: '1rem' }}>Panel Exclusivo de Administrador</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="input-group">
                            <label>Mensual General ($):</label>
                            <input type="number" name="general" value={precios.general} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Mensual Estudiante ($):</label>
                            <input type="number" name="estudiante" value={precios.estudiante} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Estudiante + Acompañante ($):</label>
                            <input type="number" name="estudianteAcompanante" value={precios.estudianteAcompanante} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Anualidad / Grupal ($):</label>
                            <input type="number" name="grupal" value={precios.grupal} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Reposición de Tarjeta ($):</label>
                            <input type="number" name="reposicion" value={precios.reposicion} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn-login" style={{ marginTop: '20px' }}>
                        Guardar Nuevas Tarifas
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GestionMembresias;