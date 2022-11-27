const sidebarSections = [
  {
    title: 'Your Profile',
    headerIcon: 'user-circle',
    links: [
      {
        label: 'Background',
        to: '/profile/background',
        icon: 'address-card',
      },
      {
        label: 'Address',
        to: '/profile/address',
        icon: 'home',
      },
      {
        label: 'Children',
        to: '/profile/children',
        icon: 'child',
      },
      {
        label: 'The Relationship',
        to: '/profile/relationship',
        icon: 'calendar',
      },
      {
        label: "Ex's Background",
        to: '/profile/exBackground',
        icon: 'address-card',
      },
      {
        label: "Ex's Address",
        to: '/profile/exAddress',
        icon: 'home',
      },
    ],
  },
  {
    title: 'Your Account',
    headerIcon: 'settings',
    links: [
      {
        label: 'Billing',
        to: '/profile/billing',
        icon: 'credit-card',
      },
      {
        label: 'Settings',
        to: '/profile/settings',
        icon: 'cog',
      },
    ],
  },
  {
    title: 'Calculations',
    headerIcon: 'calculator',
    links: [
      {
        label: 'Child Support',
        to: '/child-support/',
        icon: 'child',
      },
      {
        label: 'Spousal Support',
        to: '/spousal-support/',
        icon: 'gem',
      },
      {
        label: 'Spousal & Child Support',
        to: '/spousal-support/',
        icon: 'user-plus',
      },
    ],
  },
  {
    title: 'Quick Help',
    headerIcon: 'faq',
    links: [
      {
        label: 'Help Centre',
        href: 'https://www.divorcepath.com/help',
        icon: 'book',
      },
    ],
  },
];

export default sidebarSections;
