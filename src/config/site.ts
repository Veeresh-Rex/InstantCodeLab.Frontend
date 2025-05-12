export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'InstantCodeLabe',
  description:
    'Real-time coding sessions with code execution for interviews, lessons, and collaborative development.',
  navItems: [
    {
      label: 'Features',
      href: '/feature',
    },
    {
      label: 'FQA',
      href: '/faq',
    },
    {
      label: 'Editor',
      href: '/editor',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
  navMenuItems: [
    {
      label: 'Features',
      href: '/feature',
    },
    {
      label: 'FQA',
      href: '/faq',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
  links: {
    github: 'https://github.com/frontio-ai/heroui',
  },
};
