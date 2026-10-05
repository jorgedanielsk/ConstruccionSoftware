/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';

export const GymContext = createContext();

export const GymProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [tarifas, setTarifas] = useState({
        general: 350,
        estudiante: 320,
        estudianteAcompanante: 290, // <-- Nueva tarifa agregada
        grupal: 3320,
        reposicion: 30
    });

    const [socios, setSocios] = useState(() => {
        const sociosGuardados = localStorage.getItem('sacg_socios');
        // Si hay datos guardados los carga, si es la primera vez, devuelve un sistema totalmente limpio
        return sociosGuardados ? JSON.parse(sociosGuardados) : [];
    });

    useEffect(() => {
        localStorage.setItem('sacg_socios', JSON.stringify(socios));
    }, [socios]);

    return (
        <GymContext.Provider value={{ user, setUser, tarifas, setTarifas, socios, setSocios }}>
            {children}
        </GymContext.Provider>
    );
};