const sidebarSections = [
  {
    title: 'Calculate Support',
    headerIcon: 'calculator',
    links: [
      {
        label: 'Child Support',
        to: '/child-support/',
      },
      {
        label: 'Spousal & Child Support',
        to: '/spousal-support/',
      },
      {
        label: 'Spousal Support',
        to: '/spousal-support/',
      },
    ],
  },
  {
    title: 'Your Organization',
    headerIcon: 'office',
    links: [
      {
        label: 'Add/Remove Users',
        to: '/profile/organization',
      },
      {
        label: 'Edit Organization Profile',
        to: '/profile/organization',
      },
    ],
  },
  {
    title: 'Your Account',
    headerIcon: 'user-circle',
    links: [
      {
        label: 'Profile',
        to: '/profile',
      },
      {
        label: 'Settings',
        to: '/profile/settings',
      },
      {
        hideForMembers: true,
        label: 'Billing',
        to: '/profile/billing',
      },
    ],
  },
  {
    isLast: true,
    title: 'Quick Help',
    headerIcon: 'faq',
    links: [
      {
        label: 'Help Centre',
        href: 'https://www.divorcepath.com/help',
      },
      {
        label: 'Client List Walkthrough',
        href: 'https://app.divorcepath.com/?product_tour_id=135666',
      },
      {
        label: 'Calculator Walkthrough',
        href: '#',
      },
      {
        label: 'Online Support',
        href: '#',
        customId: 'intercom_link',
      },
    ],
  },
];

export default sidebarSections;
