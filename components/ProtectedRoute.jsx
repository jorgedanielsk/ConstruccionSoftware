import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GymContext } from '../context/GymContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(GymContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.rol)) {
        return <div className="p-8 text-center text-red-600 font-bold text-2xl">Acceso Denegado. Código de error: BUC2-Alterno</div>;
    }

    return children;
};

export default ProtectedRoute;