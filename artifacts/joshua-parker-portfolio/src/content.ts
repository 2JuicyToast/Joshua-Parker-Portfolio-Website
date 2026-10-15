/**
 * Update portfolio copy and add page entries here. Presentation is shared
 * across routes; editing this file updates the website content.
 */
export type PortfolioEntry = {
  title: string;
  description?: string;
  eyebrow?: string;
  subtitle?: string;
  problem?: string;
  whatItDoes?: string;
  role?: string;
  tools?: string;
  status?: string;
  learning?: string;
};

export type PortfolioPageSection = {
  title?: string;
  entries?: PortfolioEntry[];
  items?: { number: string; label: string }[];
  note?: string;
  copy?: string;
};

const myCom: PortfolioEntry = {
  title: 'MyCom',
  eyebrow: '01 / Community technology',
  description:
    'A community-resource platform designed to help people discover local services, opportunities, groups, and events based on their location and situation.',
  problem: '[Add the specific problem being addressed]',
  whatItDoes: 'Helps people discover relevant local resources.',
  role: '[Add your role and contributions]',
  tools: '[Add tools and skills used]',
  status: 'Active product in development',
  learning: '[Add a key takeaway]',
};

const safeLinkBeacon: PortfolioEntry = {
  title: 'SafeLink Beacon',
  eyebrow: '02 / Safety technology',
  description:
    'A handheld emergency-safety device concept designed to contact trusted contacts and preserve evidence when a phone may not be accessible or reliable.',
  problem: '[Add the specific problem being addressed]',
  whatItDoes: 'Concept for contacting trusted contacts and preserving evidence.',
  role: '[Add your role and contributions]',
  tools: '[Add tools and skills used]',
  status: 'Prototype-stage product',
  learning: '[Add a key takeaway]',
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
    { id: 'contact', label: 'Contact Me', href: '/contact' },
  ],
  actions: {
    projects: 'View Projects',
    writing: 'Read My Writing',
    contact: 'Contact Me',
  },
  social: [
    { label: 'GitHub', url: 'https://github.com/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/joshua-parker-b44275395/' },
    { label: 'Professional Instagram', url: 'https://www.instagram.com/jscholars_academia/' },
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
      intro: 'Two ideas centered on making technology useful when it matters.',
      sections: [
        {
          entries: [myCom, safeLinkBeacon],
        },
      ] as PortfolioPageSection[],
    },
    ventures: {
      href: '/ventures',
      number: '02',
      eyebrow: 'What I’m building toward',
      title: 'Current Ventures',
      intro: '',
      sections: [
        {
          title: 'Current Ventures',
          entries: [
            {
              title: 'P.E.N. Innovation',
              subtitle: 'Purposefully Ethical Network of Innovation',
              description: 'A current venture focused on ethical, people-focused innovation.',
            },
          ],
        },
      ] as PortfolioPageSection[],
    },
    writing: {
      href: '/writing',
      number: '03',
      eyebrow: 'Words & ideas',
      title: 'Writing',
      intro: '',
      sections: [
        {
          title: 'Writing page to be developed',
          copy: 'This section is still in progress.',
        },
      ] as PortfolioPageSection[],
    },
    recognition: {
      href: '/recognition',
      number: '04',
      eyebrow: 'Awards & Recognition',
      title: 'Awards & Recognition',
      intro: '',
      sections: [
        {
          items: [
            { number: '01', label: 'SMASH National Competition Winner' },
            { number: '02', label: 'National Honor Society' },
            { number: '03', label: 'Homecoming Court' },
            { number: '04', label: 'Top 10 Academic Ranking' },
          ],
        },
      ] as PortfolioPageSection[],
    },
    interests: {
      href: '/interests',
      number: '05',
      eyebrow: 'Activities & Interests',
      title: 'Activities & Interests',
      intro: '',
      sections: [
        {
          title: 'Recreational',
          items: [
            { number: '01', label: 'Lacrosse' },
            { number: '02', label: 'Kickboxing' },
            { number: '03', label: 'HEMA' },
            { number: '04', label: 'Gaming' },
          ],
        },
        {
          title: 'Technical',
          items: [
            { number: '05', label: 'Technology Building' },
            { number: '06', label: 'Robotics' },
            { number: '07', label: 'Programming' },
            { number: '08', label: 'Writing / Creative Writing' },
          ],
        },
      ] as PortfolioPageSection[],
    },
  },
  contact: {
    eyebrow: 'Let’s connect',
    title: 'Contact Me',
    body: 'Contact details can be connected here when they’re ready.',
    emailLabel: 'Email · address placeholder',
    phoneLabel: 'Phone · number placeholder',
    email: '',
    phone: '',
  },
};

export type PortfolioPageKey = keyof typeof portfolio.pages;
