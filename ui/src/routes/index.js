import { useRoutes } from 'react-router-dom';

// routes
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import LoginRoutes from './LoginRoutes';
import LoginPage from '../views/user/authentication/Login';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([{ path: '/', element: <LoginPage /> },UserRoutes, AdminRoutes, LoginRoutes]);
}
