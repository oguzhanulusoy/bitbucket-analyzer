// assets
import HomeIcon from '@mui/icons-material/Home';
import ApiIcon from '@mui/icons-material/Api';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        {
            id: 'home',
            title: 'Home Page',
            type: 'item',
            url: '/user/home',
            icon: HomeIcon,
            breadcrumbs: false
        },
        {
            id: 'pull-requests',
            title: 'Pull Requests',
            type: 'item',
            url: '/user/pull-requests',
            icon: ApiIcon,
            breadcrumbs: false
        },
        {
            id: 'authors',
            title: 'Authors',
            type: 'item',
            url: '/user/authors',
            icon: SwitchAccountIcon,
            breadcrumbs: false
        },
        

    ]
};

export default other;
