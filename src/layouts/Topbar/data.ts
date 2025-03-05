import { ProfileMenu, SearchOptions } from '../types';


// get the profilemenu
const profileMenus: ProfileMenu[] = [
    {
        label: 'My Account',
        icon: 'fe-user',
        redirectTo: '/apps/contacts/profile',
    },
    {
        label: 'Lock Screen',
        icon: 'fe-lock',
        redirectTo: '/auth/lock-screen',
    },
    {
        label: 'Logout',
        icon: 'fe-log-out',
        redirectTo: '/auth/logout',
    },
];

const searchOptions: SearchOptions[] = [
    { value: '1', label: 'Dashboard', icon: 'fe-home', type: 'page' },
    { value: '2', label: 'Users', icon: 'fe-users', type: 'page' },
];

export { profileMenus, searchOptions };
