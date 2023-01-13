import { useRoutes } from 'react-router-dom';

// routes
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([UserRoutes, AdminRoutes, LoginRoutes]);
}
