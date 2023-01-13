import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';

// login option 3 routing
// dashboard routing
const LoginPage = Loadable(lazy(() => import('views/LoginPage')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    children: [
        {
            path: '/',
            element: <LoginPage />
        },
    ]
};

export default LoginRoutes;
