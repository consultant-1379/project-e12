const menuList = [
    {
        name: 'Home',
        title: 'Home Last Analyzed Project',
        key: '/home',
        icon: 'home'
    },
    {
        name: 'Projects',
        title: 'Project Management',
        key: '/projects',
        icon: 'project',
        children: [
            {
                name: 'Manage Project',
                title: 'Project Management',
                key: '/project',
                icon: 'bars'
            },
            {
                name: 'Search Project',
                title: 'Project Search',
                key: '/search',
                icon: 'file-search'
            }
        ]
    },
    // {
    //     name: 'Products',
    //     title: 'Product List',
    //     key: '/product',
    //     icon: 'appstore'
    // },
    // {
    //     name: '3PPs',
    //     title: 'Third Party List',
    //     key: '/thirdParty',
    //     icon: 'line-chart'
    // }
]

export default menuList