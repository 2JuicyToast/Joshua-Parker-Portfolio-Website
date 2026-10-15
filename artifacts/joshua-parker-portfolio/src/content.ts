/**
 * Update portfolio copy and add page entries here. The site layout is shared
 * across the pages; changing this file updates the content without changing it.
 */
export type PortfolioEntry = {
  title: string;
  description: string;
  meta?: string;
  href?: string;
};

export const portfolio = {
  identity: {
    name: 'Joshua Parker',
    location: 'Dover, Delaware',
    classYear: 'Class of 2027',
    headline: 'Dual Enrollment Computer Engineering Student | Builder | Writer | Ethical Innovator.',
    introduction:
      "I’m a Class of 2027 dual-enrollment computer engineering student from Dover, Delaware. I build technology, share my ideas through writing, and explore how innovation can be useful, responsible, and people-focused.",
    portraitLabel: 'Professional photo placeholder',
    portraitNote: 'A portrait can be added here when one is available.',
  },
  navigation: [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'ventures', label: 'Current Ventures', href: '/ventures' },
    { id: 'writing', label: 'Writing', href: '/writing' },
    { id: 'recognition', label: 'Awards & Recognition', href: '/recognition' },
    { id: 'interests', label: 'Activities & Interests', href: '/interests' },
  ],
  actions: {
    projects: 'View Projects',
    writing: 'Read My Writing',
    contact: 'Contact Me',
  },
  social: [
    { label: 'GitHub', url: '' },
    { label: 'LinkedIn', url: '' },
    { label: 'Professional Instagram', url: '' },
  ],
  principle: {
    label: 'A principle I build by',
    quote:
      '“Ethical innovation means taking the time to consider whether an innovation provides a meaningful benefit to society as a whole. Today, it is common to create for the sake of profit, but far less common to create for the sake of people. Many products claim to benefit people, yet use that claim as justification to raise prices and position themselves as the ‘better option.’ As I grow professionally, I will advocate for ethical innovation through my actions, creations, and writing.”',
  },
  skills: {
    eyebrow: 'What I bring to the work',
    title: 'Skills',
    groups: [
      {
        title: 'Programming & Web',
        items: ['Python', 'Java / Java SE', 'HTML', 'CSS', 'Object-oriented programming', 'Git/GitHub', 'Version control'],
      },
      {
        title: 'Engineering & Systems',
        items: ['PC building and hardware', 'Hardware troubleshooting', 'Digital systems', 'Prototype development', 'Systems analysis and workflow design'],
      },
      {
        title: 'Professional Strengths',
        items: ['Technical writing', 'Presentation/media technology', 'Problem-solving', 'Communication', 'Organization', 'Initiative', 'Teamwork', 'Adaptability'],
      },
    ],
  },
  quote: {
    text: '“The scientific man does not aim at an immediate result. His duty is to lay the foundation for those who are to come, and point the way.”',
    attribution: 'Nikola Tesla',
  },
  pages: {
    projects: {
      href: '/projects',
      number: '01',
      eyebrow: 'Selected work',
      title: 'Projects',
      intro: 'Projects and work samples.',
      emptyTitle: 'Project details haven’t been added yet.',
      emptyNote: 'The reference image doesn’t include project entries. Add project names, descriptions, and links here.',
      entries: [] as PortfolioEntry[],
    },
    ventures: {
      href: '/ventures',
      number: '02',
      eyebrow: 'In progress',
      title: 'Current Ventures',
      intro: 'Current work and ventures.',
      emptyTitle: 'Venture details haven’t been added yet.',
      emptyNote: 'The reference image doesn’t include venture entries. Add venture names, roles, and details here.',
      entries: [] as PortfolioEntry[],
    },
    writing: {
      href: '/writing',
      number: '03',
      eyebrow: 'Ideas in words',
      title: 'Writing',
      intro: 'Writing and ideas.',
      emptyTitle: 'Writing samples haven’t been added yet.',
      emptyNote: 'The reference image doesn’t include writing titles or links. Add writing samples and links here.',
      entries: [] as PortfolioEntry[],
    },
    recognition: {
      href: '/recognition',
      number: '04',
      eyebrow: 'Milestones',
      title: 'Awards & Recognition',
      intro: 'Awards, recognition, and milestones.',
      emptyTitle: 'Award details haven’t been added yet.',
      emptyNote: 'The reference image shows this page in the navigation but doesn’t include award details. Add awards, dates, and organizations here.',
      entries: [] as PortfolioEntry[],
    },
    interests: {
      href: '/interests',
      number: '05',
      eyebrow: 'Beyond the screen',
      title: 'Activities & Interests',
      intro: 'Activities, interests, and community involvement.',
      emptyTitle: 'Activity and interest details haven’t been added yet.',
      emptyNote: 'The reference image shows this page in the navigation but doesn’t include its entries. Add activities, roles, and interests here.',
      entries: [] as PortfolioEntry[],
    },
  },
  contact: {
    eyebrow: 'Let’s connect',
    title: 'Have a thoughtful idea in mind?',
    body: 'I’m interested in building useful things and learning from people who care about how technology affects us.',
    placeholder: 'Add a contact email in the portfolio content to make this page actionable.',
    email: '',
  },
  footer: 'A personal portfolio, built around curiosity and care.',
};

export type PortfolioPageKey = keyof typeof portfolio.pages;
