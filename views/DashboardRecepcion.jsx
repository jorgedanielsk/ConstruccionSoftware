import { useState, useContext } from 'react';
import { GymContext } from '../context/GymContext';
import '../App.css';

const DashboardRecepcion = () => {
    const { socios } = useContext(GymContext);
    const [busqueda, setBusqueda] = useState('');
    const [resultado, setResultado] = useState(null);

    const validarAcceso = (e) => {
        e.preventDefault();

        const socioEncontrado = socios.find(s =>
            s.id === busqueda.trim() ||
            s.nombre.toLowerCase() === busqueda.trim().toLowerCase()
        );

        if (!socioEncontrado) {
            setResultado({ tipo: 'error', mensaje: 'Socio no encontrado para validar acceso.' });
            return;
        }

        if (socioEncontrado.estatus !== 'Active' && socioEncontrado.estatus !== 'Activo') {
            setResultado({
                tipo: 'rojo',
                mensaje: 'ACCESO DENEGADO - SOCIO INACTIVO (FALTA PAGO)',
                socio: socioEncontrado
            });
            return;
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaVencimiento = new Date(socioEncontrado.vencimiento + 'T00:00:00');

        if (hoy > fechaVencimiento) {
            setResultado({
                tipo: 'rojo',
                mensaje: 'ACCESO DENEGADO - MEMBRESÍA VENCIDA',
                socio: socioEncontrado
            });
            return;
        }

        if ((socioEncontrado.edad === 16 || socioEncontrado.edad === 17) && !socioEncontrado.tieneResponsiva) {
            setResultado({
                tipo: 'amarillo',
                mensaje: 'ALERTA - FALTA CARTA RESPONSIVA',
                socio: socioEncontrado
            });
            return;
        }

        setResultado({
            tipo: 'verde',
            mensaje: 'ACCESO CONCEDIDO',
            socio: socioEncontrado
        });
    };

    const sociosFiltrados = socios.filter(socio =>
        socio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        socio.id.includes(busqueda)
    );

    return (
        <div className="dashboard-container">
            <div className="search-box">
                <h2>Control de Acceso</h2>
                <form onSubmit={validarAcceso}>
                    <div className="input-group">
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                if (e.target.value === '') setResultado(null);
                            }}
                            placeholder="Buscar por ID, Nombre o Apellido..."
                            required
                        />
                    </div>
                    <button type="submit" className="btn-login">Validar Entrada</button>
                </form>
            </div>

            {resultado && (
                <div className={`alerta-gigante alerta-${resultado.tipo}`} style={{ marginBottom: '30px' }}>
                    <h1>{resultado.mensaje}</h1>
                    {resultado.socio && (
                        <div className="info-socio">
                            <p><strong>Socio:</strong> {resultado.socio.nombre}</p>
                            <p>
                                <strong>Vencimiento:</strong> {
                                    `${resultado.socio.vencimiento.split('-')[2]}/${resultado.socio.vencimiento.split('-')[1]}/${resultado.socio.vencimiento.split('-')[0]}`
                                }
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="lista-socios-seccion">
                <h3>Socios en el Sistema ({sociosFiltrados.length})</h3>
                <div className="socios-grid">
                    {sociosFiltrados.map(socio => {
                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);
                        const vencimiento = new Date(socio.vencimiento + 'T00:00:00');
                        const diffTime = vencimiento - hoy;
                        const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        const esUrgente = socio.estatus === 'Activo' && diasRestantes <= 5;

                        // Si no tiene fecha de cobro aún (registro nuevo), usamos la fecha de registro guardada en vencimiento
                        const fCobro = socio.fechaCobro || socio.vencimiento;

                        return (
                            <div key={socio.id} className={`tarjeta-socio-mini estatus-${socio.estatus.toLowerCase()} ${esUrgente ? 'tarjeta-urgente' : ''}`}>
                                <h4>{socio.nombre}</h4>
                                <p><strong>ID:</strong> {socio.id}</p>
                                <p><strong>Estatus Actual:</strong> {socio.estatus}</p>

                                {/* NUEVO: Ícono SVG Verde para la fecha de actualización/cobro */}
                                <p style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#28a745" style={{ width: '20px', height: '20px' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                                    </svg>
                                    <strong>{fCobro.split('-')[2]}/{fCobro.split('-')[1]}/{fCobro.split('-')[0]}</strong>
                                </p>

                                {/* NUEVO: Ícono SVG Rojo para la fecha de expiración */}
                                <p style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#dc3545" style={{ width: '20px', height: '20px' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                                    </svg>
                                    <strong>{socio.vencimiento.split('-')[2]}/{socio.vencimiento.split('-')[1]}/{socio.vencimiento.split('-')[0]}</strong>
                                </p>

                                <p style={{ marginTop: '4px' }}><strong>Plan:</strong> {socio.estatus === 'Activo' ? (socio.plan || 'Mensual General') : 'sin plan'}</p>
                                <p><strong>Cantidad:</strong> {socio.estatus === 'Activo' ? `$${socio.monto || 350} MXN` : '$0 MXN'}</p>

                                {socio.estatus === 'Activo' && (
                                    <p className={esUrgente ? 'dias-urgentes' : 'dias-normales'}>
                                        <strong>Días restantes:</strong> {diasRestantes >= 0 ? diasRestantes : 0}
                                    </p>
                                )}

                                <div className="historial-pagos-contenedor">
                                    <h5>Mensualidades Cobradas:</h5>
                                    {socio.historialPagos && socio.historialPagos.length > 0 ? (
                                        <div className="historial-scroll">
                                            {socio.historialPagos.map((pago, index) => {
                                                const [anioP, mesP, diaP] = pago.fechaPago.split('-');
                                                return (
                                                    <div key={index} className="item-pago">
                                                        <span>🗓️ {diaP}/{mesP}/{anioP}</span>
                                                        <span>{pago.plan} (${pago.monto})</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="sin-historial">Ningún pago registrado aún.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {sociosFiltrados.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>No hay coincidencias con la búsqueda.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardRecepcion;