import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GymContext } from '../context/GymContext';
import '../App.css';

const CobrosRenovaciones = () => {
    const { socios, setSocios, tarifas } = useContext(GymContext);
    const navigate = useNavigate();

    // Estados para la búsqueda y selección
    const [busqueda, setBusqueda] = useState('');
    const [socioActual, setSocioActual] = useState(null);

    // Estados para el pago
    const [tipoPlan, setTipoPlan] = useState('general');
    const [reposicion, setReposicion] = useState(false);

    // 1. Filtrado en tiempo real (ID, Nombre o Apellido)
    const sociosFiltrados = socios.filter(socio => 
        socio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        socio.id.includes(busqueda)
    );

    // 2. Seleccionar un socio de la lista para proceder al cobro
    const seleccionarSocio = (socio) => {
        setSocioActual(socio);
        // Preseleccionar plan según el tipo de socio registrado
        setTipoPlan(socio.tipoSocio.toLowerCase() === 'estudiante' ? 'estudiante' : 'general');
        setReposicion(false); // Reiniciar estado del checkbox al cambiar de socio
    };

    // 3. Calcular el total a cobrar
    const calcularTotal = () => {
        let total = tarifas[tipoPlan];
        if (reposicion) {
            total += tarifas.reposicion;
        }
        return total;
    };

    // 4. Procesar el pago, actualizar vigencia e historial
    const procesarPago = (e) => {
        e.preventDefault();

        const diasASumar = tipoPlan === 'grupal' ? 365 : 30;

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const vencimientoActual = new Date(socioActual.vencimiento + 'T00:00:00');

        let fechaBase;
        if (hoy > vencimientoActual) {
            fechaBase = new Date(hoy);
        } else {
            fechaBase = new Date(vencimientoActual);
        }

        // ... (código anterior de procesarPago)
        fechaBase.setDate(fechaBase.getDate() + diasASumar);
        const nuevaFechaVencimiento = fechaBase.toISOString().split('T')[0];
        
        // 1. GENERAMOS LA FECHA DE HOY (El día exacto en que se hace el cobro)
        const fechaCobroActual = new Date().toISOString().split('T')[0]; 

        const nombresPlanes = {
            general: 'Mensual General',
            estudiante: 'Mensual Estudiante',
            estudianteAcompanante: 'Estudiante + Acompañante',
            grupal: 'Anualidad / Grupal'
        };

        const nuevoRegistroPago = {
            fechaPago: fechaCobroActual,
            plan: nombresPlanes[tipoPlan],
            monto: calcularTotal()
        };

        const sociosActualizados = socios.map(s => {
            if (s.id === socioActual.id) {
                const historialExistente = s.historialPagos ? s.historialPagos : [];
                
                return { 
                    ...s, 
                    estatus: 'Activo', 
                    vencimiento: nuevaFechaVencimiento,
                    fechaCobro: fechaCobroActual, // <--- ESTA ES LA LÍNEA MÁGICA QUE FALTABA ACTUALIZAR
                    plan: nombresPlanes[tipoPlan],
                    monto: calcularTotal(),
                    historialPagos: [...historialExistente, nuevoRegistroPago]
                };
            }
            return s;
        });

        setSocios(sociosActualizados);
        // ... (resto del código del alert y navigate)
        
        const [anio, mes, dia] = nuevaFechaVencimiento.split('-');
        const fechaFormateada = `${dia}/${mes}/${anio}`;

        alert(`Pago registrado exitosamente. Total cobrado: $${calcularTotal()} MXN.\nNueva vigencia: ${fechaFormateada}`);
        navigate('/recepcion');
    };

    return (
        <div className="dashboard-container">
            <div className="form-box">
                <h2>Cobros y Renovaciones</h2>

                {/* RENDERIZADO CONDICIONAL: Mostrar buscador si NO hay socio seleccionado */}
                {!socioActual ? (
                    <>
                        <div className="input-group" style={{ marginBottom: '20px' }}>
                            <label>Buscar Socio a Cobrar:</label>
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar por ID, Nombre o Apellido..."
                            />
                        </div>

                        {/* Cuadrícula de resultados filtrados (reutiliza estilos de recepción) */}
                        <div className="lista-resultados">
                            {sociosFiltrados.length > 0 ? (
                                <div className="socios-grid">
                                    {sociosFiltrados.map(socio => (
                                        <div key={socio.id} className={`tarjeta-socio-mini estatus-${socio.estatus.toLowerCase()}`}>
                                            <h4>{socio.nombre}</h4>
                                            <p><strong>ID:</strong> {socio.id}</p>
                                            <p>
                                                <strong>Estatus Actual:</strong> {socio.estatus} (Vence: {
                                                    `${socio.vencimiento.split('-')[2]}/${socio.vencimiento.split('-')[1]}/${socio.vencimiento.split('-')[0]}`
                                                })
                                            </p>
                                            
                                            <button 
                                                className="btn-login" 
                                                style={{ marginTop: '12px', padding: '8px', backgroundColor: '#0056b3', fontSize: '14px' }}
                                                onClick={() => seleccionarSocio(socio)}
                                            >
                                                Seleccionar para Cobro
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>No hay coincidencias con la búsqueda.</p>
                            )}
                        </div>
                    </>
                ) : (
                    /* RENDERIZADO CONDICIONAL: Mostrar Panel de Cobro si SÍ hay socio seleccionado */
                    <div className="info-socio" style={{ width: '100%', color: 'black', background: '#f8f9fa', border: '1px solid #ddd', position: 'relative' }}>
                        
                        {/* Botón para deshacer selección y volver a buscar */}
                        <button 
                            onClick={() => setSocioActual(null)} 
                            style={{ 
                                position: 'absolute', 
                                top: '15px', 
                                right: '15px', 
                                background: '#dc3545', 
                                color: 'white', 
                                border: 'none', 
                                padding: '6px 12px', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            ✖ Cambiar Socio
                        </button>
                        
                        <h3>Datos del Cliente</h3>
                        <p><strong>Nombre:</strong> {socioActual.nombre}</p>
                        <p>
                            <strong>Estatus Actual:</strong> {socioActual.estatus} (Vence: {
                                `${socioActual.vencimiento.split('-')[2]}/${socioActual.vencimiento.split('-')[1]}/${socioActual.vencimiento.split('-')[0]}`
                            })
                        </p>

                        <hr style={{ margin: '15px 0' }} />

                        <form onSubmit={procesarPago}>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Seleccionar Plan:</label>
                                    <select value={tipoPlan} onChange={(e) => setTipoPlan(e.target.value)} className="select-input">
                                        <option value="general">Mensual General (${tarifas.general})</option>
                                        <option value="estudiante">Mensual Estudiante (${tarifas.estudiante})</option>
                                        <option value="estudianteAcompanante">Estudiante + Acompañante (${tarifas.estudianteAcompanante})</option>
                                        <option value="grupal">Anualidad / Grupal (${tarifas.grupal})</option>
                                    </select>
                                </div>

                                <div className="checkbox-group" style={{ marginTop: '0', alignSelf: 'end' }}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={reposicion}
                                            onChange={(e) => setReposicion(e.target.checked)}
                                        />
                                        Reposición de Tarjeta (+${tarifas.reposicion})
                                    </label>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e2e3e5', borderRadius: '4px', textAlign: 'right' }}>
                                <h2 style={{ color: '#0056b3' }}>Total a Cobrar: ${calcularTotal()} MXN</h2>
                            </div>

                            <button type="submit" className="btn-login" style={{ marginTop: '20px', backgroundColor: '#28a745' }}>
                                Confirmar Pago
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CobrosRenovaciones;