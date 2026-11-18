import {MenuItemType} from "@/types/layout";

export const menuItems: MenuItemType[] = [
    {key: 'insights', label: 'Insights', isTitle: true},
    {
        key: 'dashboards',
        label: 'Dashboards',
        icon: '/icons/sprite.svg#trello',
        badge: {variant: 'danger', text: 'New'},
        children: [
            {key: 'control-center', label: 'Control Center', url: '/dashboards/control-center'},
            {key: 'subscription', label: 'Subscription & Billing', url: '/dashboards/subscription'},
            {key: 'marketing', label: 'Marketing & Sales', url: '/dashboards/marketing'},
            {key: 'project-management', label: 'Project Management', url: '/dashboards/project-management'},

        ],
    },
    {
        icon: '/icons/sprite.svg#home',
        key: 'blank-page',
        label: 'Blank Page',
        url: '/blank-page'
    },
    {key: 'layouts', label: 'Layouts', isTitle: true},
    {
        icon: '/icons/sprite.svg#slash',
        key: 'authentication-pages',
        label: 'Authentication Pages',
        children: [
            {key: 'login', label: 'Login', url: '/auth/login'},
            {key: 'register', label: 'Register', url: '/auth/register'},
            {key: 'forget-password', label: 'Forget Password', url: '/auth/forgot-password'},
            {key: '2fa', label: '2FA', url: '/auth/two-factor'},
            {key: 'lock-screen', label: 'Lock Screen', url: '/auth/lockscreen'}
        ]
    },

    {
        key: 'error-pages',
        icon: '/icons/sprite.svg#alert-triangle',
        label: 'Error Pages',
        children: [
            {key: '404-1', label: '404 Not Found', url: '/404'},
            {key: '404-2', label: '404 Not Found 2', url: '/error/404-2'},
            {key: '500', label: '500 Internal Server', url: '/error/500'}
        ]
    },
    {
        icon: '/icons/sprite.svg#user',
        key: 'user-profile',
        label: 'User Profile',
        url: '/access-control/user-profile'
    },
    {
        key: 'landing',
        label: 'Landing',
        icon: '/icons/sprite.svg#zap',
        url: '/landing',
        target: '_blank',
    },
    {
        key: 'error-iconography',
        icon: '/icons/sprite.svg#heart',
        label: 'Iconography',
        children: [
            {key: 'system-icon', label: 'System Icons', url: '/icons/system'},
            {key: 'font-awesome', label: 'FontAwesome', url: '/icons/font-awesome'},
            {key: 'smart-icon', label: 'Smart Admin Icons', url: '/icons/smart-admin'}
        ]
    },
    {
        key: 'tables',
        icon: '/icons/sprite.svg#table',
        label: 'Tables',
        children: [
            {key: 'basic-tables', label: 'Basic Tables', url: '/tables/basic'},
            {key: 'table-style-generator', label: 'Table Style Generator', url: '/tables/style-generator'},
        ]
    },
    {key: 'data-visualization', label: 'Layouts', isTitle: true},
    {
        key: 'tanstack-table',
        icon: '/icons/sprite.svg#database',
        label: 'TanStack Table',
        children: [
            {key: 'table-search', label: 'Table With Search', url: '/tanstack-tables/search'},
            {key: 'table-checkbox', label: 'Table With Checkbox', url: '/tanstack-tables/checkbox-select'},
            {key: 'table-delete-button', label: 'Table With Delete Buttons', url: '/tanstack-tables/delete-buttons'},
            {key: 'table-filters', label: 'Table With Filters', url: '/tanstack-tables/filters'},
            {key: 'table-sort', label: 'Table With Sorting', url: '/tanstack-tables/sorting'},
        ]
    },

]