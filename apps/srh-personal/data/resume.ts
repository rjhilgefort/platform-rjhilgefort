export type Role = {
  title: string
  startDate: string
  endDate: string
  highlights: Array<string>
}

export type Experience = {
  company: string
  location: string
  totalDuration: string
  logo?: string
  logoInitials: string
  logoColor: string
  roles: Array<Role>
}

export type Education = {
  school: string
  degree: string
  field: string
  startYear: string
  endYear: string
  logo?: string
  logoInitials: string
  logoColor: string
}

export type SkillCategory = {
  name: string
  skills: Array<string>
}

export const profile = {
  name: 'Stephanie Hilgefort',
  credentials: 'MBA',
  title: 'Senior Brand Manager',
  company: 'Procter & Gamble',
  location: 'Cincinnati, OH',
  email: 'srhilgefort@gmail.com',
  phone: '513-926-2894',
  linkedin: 'https://www.linkedin.com/in/stephanie-hilgefort/',
  summary:
    'Strategic brand and media leader with 10+ years of experience driving growth for Fortune 500 brands. Proven track record of developing data-driven marketing strategies, managing multi-million dollar budgets, and delivering measurable business results across CPG, financial services, and agency environments.',
}

export const experience: Array<Experience> = [
  {
    company: 'Procter & Gamble',
    location: 'Cincinnati, OH',
    totalDuration: '4+ years',
    logo: '/logos/pg.svg',
    logoInitials: 'P&G',
    logoColor: '#003DA5',
    roles: [
      {
        title: 'Senior Brand Manager',
        startDate: 'Oct 2024',
        endDate: 'Present',
        highlights: [
          'Lead strategic marketing initiatives for Always Discreet brand, driving consumer preference through data-driven insights',
          'Develop and execute marketing plans to enhance brand awareness and increase market share',
          'Partner with cross-disciplinary teams (Sales, Finance, Product Supply, Advertising, Media Agencies)',
          'Optimize consumer touchpoints from awareness to purchase, improving satisfaction scores',
          'Champion business growth through new product innovations, exceeding brand performance KPIs',
        ],
      },
      {
        title: 'Senior Media Planner',
        startDate: 'Nov 2021',
        endDate: 'Oct 2024',
        highlights: [
          'Led development of comprehensive media plans, achieving 5% increase in campaign ROI',
          'Drove 7% increase in total brand reach YOY through strategic media partnerships',
          'Analyzed performance data to refine strategies, resulting in 3% uplift in sales lift',
          'Fostered relationships with agency partners and vendors for seamless campaign execution',
        ],
      },
    ],
  },
  {
    company: 'Fifth Third Bank',
    location: 'Cincinnati, OH',
    totalDuration: '1 year 11 months',
    logo: '/logos/fifth-third.jpg',
    logoInitials: '5/3',
    logoColor: '#00543C',
    roles: [
      {
        title: 'Brand Media and Digital Marketing Strategy Manager',
        startDate: 'Feb 2020',
        endDate: 'Dec 2021',
        highlights: [
          'Developed B2B and B2C integrated marketing acquisition campaigns driving qualified leads and ROAS',
          'Managed multi-million dollar brand media budget across multiple lines of business',
          'Performed detailed analysis at national and local levels to improve campaign performance',
          'Acted as Marketing department expert, establishing policies and process improvements',
        ],
      },
    ],
  },
  {
    company: 'Quotient Technology',
    location: 'Cincinnati, KY',
    totalDuration: '6 months',
    logo: '/logos/quotient.png',
    logoInitials: 'Q',
    logoColor: '#FF6B00',
    roles: [
      {
        title: 'Senior Media Planner',
        startDate: 'Sep 2019',
        endDate: 'Feb 2020',
        highlights: [
          'Managed $30+ million annual digital advertising budgets for national grocery retailer',
          'Compiled digital campaign recommendations based on media briefs and KPI monitoring',
          'Standardized tracking methods to accurately monitor campaign spend and reduce over delivery',
        ],
      },
    ],
  },
  {
    company: 'Landor',
    location: 'Cincinnati, KY',
    totalDuration: '2 years 1 month',
    logo: '/logos/landor.svg',
    logoInitials: 'L',
    logoColor: '#000000',
    roles: [
      {
        title: 'Client Manager',
        startDate: 'Sep 2017',
        endDate: 'Sep 2019',
        highlights: [
          'Developed brand strategies for global brands including P&G Oral Care and P&G Corporate initiatives',
          'Managed budgets of $4+ million for global brands, maximizing client investment',
          'Provided leadership across projects partnering with clients and cross-functional agency teams',
          'Established creative positioning for new product variants launching in established markets',
        ],
      },
    ],
  },
  {
    company: 'Brandience',
    location: 'Cincinnati, KY',
    totalDuration: '2 years 9 months',
    logo: '/logos/brandience.png',
    logoInitials: 'B',
    logoColor: '#E31837',
    roles: [
      {
        title: 'Account Executive',
        startDate: 'Feb 2017',
        endDate: 'Sep 2017',
        highlights: [
          'Led development and execution for all consumer touchpoints for Skyline Chili (135 locations)',
          'Managed email database of 90,000+ subscribers, growing subscriber base by 5% and increasing CTR by 3%',
          'Trafficked and coordinated delivery across TV, radio, OOH, digital, social, print, and sponsorships',
          'Content development across Facebook, Twitter, Instagram, and Snapchat platforms',
        ],
      },
      {
        title: 'Account Coordinator',
        startDate: 'Jan 2015',
        endDate: 'Feb 2017',
        highlights: [
          'Liaison between clients and internal agency teams, project managing creative needs',
          'Developed and executed email marketing campaign strategy for 7 markets',
          'Supported development and production of marketing materials for Skyline Chili',
        ],
      },
    ],
  },
  {
    company: 'Belltower Advertising',
    location: 'Cincinnati Area',
    totalDuration: '2 years 6 months',
    logo: '/logos/belltower.avif',
    logoInitials: 'BT',
    logoColor: '#1E3A5F',
    roles: [
      {
        title: 'Media Buyer',
        startDate: 'Jul 2012',
        endDate: 'Dec 2014',
        highlights: [
          'Stewarded client media and relations for national accounts to radio station representatives',
          'Compiled Arbitron ranking data for radio stations in 70 markets',
          'Negotiated make goods with station representatives to acquire added value for clients',
        ],
      },
    ],
  },
  {
    company: 'Amazing Green Planet',
    location: 'Louisville, KY',
    totalDuration: '5 months',
    logo: '/logos/amazing-green-planet.jpg',
    logoInitials: 'AGP',
    logoColor: '#2E7D32',
    roles: [
      {
        title: 'Marketing Director',
        startDate: 'Jan 2012',
        endDate: 'May 2012',
        highlights: [
          'Developed strong social media presence through WordPress, Facebook, and Twitter',
          'Built brand awareness and drove traffic to social media pages on a budget',
          'Generated copy for weekly e-newsletters to promote store news and promotions',
          'Orchestrated online marketing campaigns to drive online and in-store traffic',
        ],
      },
    ],
  },
  {
    company: 'The Louisville Cardinal',
    location: 'Louisville, KY',
    totalDuration: '6 months',
    logo: '/logos/louisville-cardinal.png',
    logoInitials: 'LC',
    logoColor: '#C8102E',
    roles: [
      {
        title: 'Advertising Sales Representative',
        startDate: 'Jul 2011',
        endDate: 'Dec 2011',
        highlights: [
          'Carried out all aspects of sales activities including cold calling and lead generation',
          'Enhanced customer relationships using CRM software daily',
          'Developed advertisements and ad packages for new and existing business owners',
        ],
      },
    ],
  },
  {
    company: 'The Courier-Journal',
    location: 'Louisville, KY',
    totalDuration: '4 months',
    logo: '/logos/courier-journal.jpg',
    logoInitials: 'CJ',
    logoColor: '#1A1A1A',
    roles: [
      {
        title: 'Classified Sales Intern',
        startDate: 'May 2011',
        endDate: 'Aug 2011',
        highlights: [
          'Prepared sales reports and tracking spreadsheets for sales teams',
          'Created and ordered advertisements for customers through ad DTI software',
          'Oversaw general office tasks for sales teams and department managers',
        ],
      },
    ],
  },
  {
    company: 'MCS Consulting',
    location: 'Louisville, KY',
    totalDuration: '2 years',
    logo: '/logos/mcs.jpeg',
    logoInitials: 'MCS',
    logoColor: '#5D4E37',
    roles: [
      {
        title: 'Accounting Assistant',
        startDate: 'Sep 2009',
        endDate: 'Aug 2011',
        highlights: [
          'Completed various administrative duties for a small business owner',
          'Assisted with general accounting functions including AR and AP for multiple clients',
          'Reconciled accounts and processed quarterly tax reports for small businesses',
        ],
      },
    ],
  },
]

export const education: Array<Education> = [
  {
    school: 'Northern Kentucky University',
    degree: 'Master of Business Administration',
    field: 'Marketing & Business Analytics',
    startYear: '2021',
    endYear: '2022',
    logo: '/logos/nku.jpg',
    logoInitials: 'NKU',
    logoColor: '#F7B500',
  },
  {
    school: 'University of Louisville',
    degree: 'Bachelor of Science',
    field: 'Business Administration, Marketing',
    startYear: '2008',
    endYear: '2011',
    logo: '/logos/louisville-cardinal.png',
    logoInitials: 'UL',
    logoColor: '#AD0000',
  },
]

export const skillCategories: Array<SkillCategory> = [
  {
    name: 'Marketing & Strategy',
    skills: [
      'Brand Management',
      'Media Planning',
      'Campaign Strategy',
      'Consumer Insights',
      'B2B & B2C Marketing',
      'Product Launch',
    ],
  },
  {
    name: 'Analytics & Tools',
    skills: [
      'ROAS Analysis',
      'KPI Tracking',
      'Budget Management',
      'SPSS',
      'Salesforce',
      'Social Studio',
    ],
  },
  {
    name: 'Digital Marketing',
    skills: [
      'Social Media Marketing',
      'Email Marketing',
      'Digital Advertising',
      'Hootsuite',
      'MailChimp',
      'ExactTarget',
    ],
  },
  {
    name: 'Creative & Design',
    skills: [
      'Adobe Photoshop',
      'Adobe InDesign',
      'WordPress',
      'HTML/CSS',
    ],
  },
]

export type Volunteer = {
  organization: string
  role: string
  startDate: string
  endDate: string
  duration: string
  description: string
  logo?: string
  logoInitials: string
  logoColor: string
}

export const volunteering: Array<Volunteer> = [
  {
    organization: 'Lucky Tales Rescue',
    role: 'Dog Foster Mom',
    startDate: 'Jan 2013',
    endDate: 'Present',
    duration: '13 years',
    description:
      'Take in puppies/dogs for the organization offering a temporary home for the animals. Attend adoption events to encourage all dogs find a loving home.',
    logo: '/logos/lucky-tales-rescue.png',
    logoInitials: 'LT',
    logoColor: '#E91E63',
  },
  {
    organization: 'National Ski Patrol',
    role: 'Senior Alpine Patroller',
    startDate: 'Nov 2013',
    endDate: 'Present',
    duration: '12 years',
    description:
      'Volunteer ski patroller providing emergency medical care and safety services on the mountain.',
    logo: '/logos/national-ski-patrol.jpeg',
    logoInitials: 'NSP',
    logoColor: '#D32F2F',
  },
]

export const keyMetrics = [
  { value: '10+', label: 'Years Experience' },
  { value: '$30M+', label: 'Budgets Managed' },
  { value: '7%', label: 'Brand Reach Growth' },
  { value: '5%', label: 'ROI Improvement' },
]
