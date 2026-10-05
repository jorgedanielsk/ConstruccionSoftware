import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GymContext } from '../context/GymContext';
import '../App.css';

const RegistrarSocio = () => {
    const { socios, setSocios } = useContext(GymContext);
    const navigate = useNavigate();

    // Estados para los campos requeridos en BUC1
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [edad, setEdad] = useState('');
    const [telefono, setTelefono] = useState('');
    const [peso, setPeso] = useState('');
    const [estatura, setEstatura] = useState('');
    const [tipoSocio, setTipoSocio] = useState('General');
    const [tieneResponsiva, setTieneResponsiva] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const edadNum = parseInt(edad);

        // Validación de edad mínima
        if (edadNum < 16) {
            alert('Error: La edad mínima permitida en las instalaciones es de 16 años.');
            return;
        }

        // Validación de carta responsiva (Flujo Alterno BUC1)
        if ((edadNum === 16 || edadNum === 17) && !tieneResponsiva) {
            alert('Alerta: El botón de guardar está bloqueado. Es obligatorio marcar la entrega de la carta responsiva para menores.');
            return;
        }

        // Generar un ID consecutivo simulado
        const nuevoId = (socios.length > 0 ? parseInt(socios[socios.length - 1].id) + 1 : 1001).toString();

        // Obtener solo la fecha de hoy en formato YYYY-MM-DD
        const fechaActual = new Date().toISOString().split('T')[0];

        // Crear el objeto del nuevo cliente
        const nuevoSocio = {
            id: nuevoId,
            nombre: `${nombre} ${apellidos}`,
            edad: edadNum,
            telefono,
            peso,
            estatura,
            tipoSocio,
            tieneResponsiva,
            estatus: 'Inactivo',
            vencimiento: fechaActual,
            fechaCobro: fechaActual
        };

        setSocios([...socios, nuevoSocio]);

        alert(`Registro exitoso. El ID del nuevo socio es: ${nuevoId} \n no se te olvide cobrarle`);
        navigate('/recepcion');
    };

    return (
        <div className="dashboard-container">
            <div className="form-box">
                <h2>Registrar Nuevo Socio</h2>
                <form onSubmit={handleSubmit}>

                    <div className="form-grid">
                        <div className="input-group">
                            <label>Nombre:</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Apellidos:</label>
                            <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Edad:</label>
                            <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Teléfono:</label>
                            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Peso (kg):</label>
                            <input type="number" step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Estatura (m):</label>
                            <input type="number" step="0.01" value={estatura} onChange={(e) => setEstatura(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Tipo de Socio:</label>
                            <select value={tipoSocio} onChange={(e) => setTipoSocio(e.target.value)} className="select-input">
                                <option value="General">General</option>
                                <option value="Estudiante">Estudiante</option>
                            </select>
                        </div>
                    </div>

                    {/* Mostrar checkbox solo si tiene 16 o 17 años */}
                    {(parseInt(edad) === 16 || parseInt(edad) === 17) && (
                        <div className="checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={tieneResponsiva}
                                    onChange={(e) => setTieneResponsiva(e.target.checked)}
                                />
                                Confirmo que el tutor entregó la Carta Responsiva firmada.
                            </label>
                        </div>
                    )}

                    <button type="submit" className="btn-login" style={{ marginTop: '20px' }}>Guardar Socio</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrarSocio;