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
  items?: { number: string; label: string; description?: string }[];
  note?: string;
  copy?: string;
};

const myCom: PortfolioEntry = {
  title: 'MyCommNet',
  eyebrow: '01 / Community technology',
  description:
    'A community-resource platform designed to help people discover local services, opportunities, groups, and events based on their location and situation.',
  problem: 'People don’t know about beneficial opportunities or resources in their area.',
  whatItDoes: 'Helps people discover relevant local resources.',
  role: 'Sole developer.',
  tools: 'Web development, AI-assisted UI design and website blueprinting, and backend tools.',
  status: 'Active product in development',
  learning: 'Creating profiles and working with backends and keys in web development.',
};

const safeLinkBeacon: PortfolioEntry = {
  title: 'SafeLink Beacon',
  eyebrow: '02 / Safety technology',
  description:
    'A handheld emergency-safety device concept designed to contact trusted contacts and preserve evidence when a phone may not be accessible or reliable.',
  problem: 'Safety technology can be complex to use, and people may lack evidence documenting an incident.',
  whatItDoes: 'Concept for contacting trusted contacts and preserving evidence.',
  role: 'Team manager, developer, and prototype creator.',
  tools: 'PCB creation, electrical engineering knowledge, coding, and online CAD tools.',
  status: 'Prototype-stage product',
  learning: 'Connecting wiring, creating prototypes, using CAD tools, and programming ESP32 devices.',
};

export const portfolio = {
  identity: {
    name: 'Joshua D. Parker',
    location: 'Dover, Delaware',
    classYear: 'Class of 2027',
    headline: 'Dual Enrollment Computer Engineering Student | Robotics & Hardware Builder | Writer | Ethical Innovator.',
    introduction:
      'I’m an early college high school student currently doing dual enrollment at Delaware State University. I build technology, share my ideas through writing, and explore how innovation can be useful, responsible, and people-focused.',
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
      eyebrow: 'Current and previous products/Projects',
      title: 'Projects',
      intro: 'Browse both past projects and those currently in development.',
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
            {
              number: '01',
              label: 'SMASH National Pitch Competition Winner',
              description:
                'Recognized as the first-place winner of the SMASH national pitch competition for demonstrating innovation, problem-solving, and the ability to develop impactful solutions in a competitive environment.',
            },
            {
              number: '02',
              label: 'National Honor Society',
              description:
                'Selected for membership in recognition of academic excellence, leadership, character, and commitment to community service.',
            },
            {
              number: '03',
              label: 'Homecoming Court',
              description:
                'Chosen by peers and the school community for leadership, school involvement, and positive contributions to campus life.',
            },
            {
              number: '04',
              label: 'Top 10 Academic Ranking',
              description:
                'Ranked among the top-performing students in my class throughout all four years of high school, maintaining a strong academic record and demonstrating consistent dedication to educational excellence.',
            },
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
    body: 'Reach me by phone or connect through my professional profiles.',
    emailLabel: 'Email · address placeholder',
    phoneLabel: 'Phone · +1 (347) 902-7157',
    email: '',
    phone: '+13479027157',
  },
};

export type PortfolioPageKey = keyof typeof portfolio.pages;
