// Mock data for demonstration
const mockSchemes = [
  {
    id: 1,
    title: 'PM-KISAN Samman Nidhi',
    category: 'Agriculture',
    description: 'Direct income support to farmers with landholding up to 2 hectares. ₹6,000 per year in three installments.',
    eligibility: 'Small & marginal farmers',
    benefits: 'Financial Support',
    amount: '₹6,000/year',
    deadline: '2024-10-31',
    status: 'Active',
    applicants: '12M+',
    icon: 'Sprout',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    tags: ['Financial Aid', 'Farmers', 'Direct Benefit Transfer'],
    applyLink: 'https://pmkisan.gov.in/'
  },
  {
    id: 2,
    title: 'Ayushman Bharat',
    category: 'Healthcare',
    description: 'Health insurance coverage up to ₹10 lakhs per family per year for secondary and tertiary care.',
    eligibility: 'BPL families',
    benefits: 'Health Insurance',
    amount: '₹10 Lakh coverage',
    deadline: '2024-12-31',
    status: 'Active',
    applicants: '50M+',
    icon: 'Heart',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    tags: ['Health', 'Insurance', 'BPL'],
    applyLink: 'https://pmjay.gov.in/'
  },
  {
    id: 3,
    title: 'PM Kaushal Vikas Yojana',
    category: 'Employment',
    description: 'Skill development program providing training in various sectors to enhance employability.',
    eligibility: 'Youth 18-35 years',
    benefits: 'Skill Development',
    amount: 'Free training',
    deadline: '2024-11-30',
    status: 'Active',
    applicants: '8M+',
    icon: 'Briefcase',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    tags: ['Training', 'Youth', 'Employment'],
    applyLink: 'https://www.pmkvyofficial.org/'
  },
  {
    id: 4,
    title: 'National Scholarship Portal',
    category: 'Education',
    description: 'Scholarships for students from pre-matric to post-graduate levels across various categories.',
    eligibility: 'Students from economically weaker sections',
    benefits: 'Education Support',
    amount: 'Up to ₹2 Lakh/year',
    deadline: '2024-11-30',
    status: 'Active',
    applicants: '25M+',
    icon: 'GraduationCap',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    tags: ['Scholarship', 'Students', 'Education'],
    applyLink: 'https://scholarships.gov.in/'
  },
  {
    id: 5,
    title: 'PM Awas Yojana',
    category: 'Housing',
    description: 'Housing for All by 2024 - Affordable housing scheme for urban and rural poor.',
    eligibility: 'Economically Weaker Sections (EWS)',
    benefits: 'Housing',
    amount: 'Up to ₹2.5 Lakh',
    deadline: '2024-12-31',
    status: 'Active',
    applicants: '30M+',
    icon: 'Home',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    tags: ['Housing', 'Subsidy', 'EWS'],
    applyLink: 'https://pmaymis.gov.in/'
  },
  {
    id: 6,
    title: 'Ujjwala Yojana',
    category: 'Social Welfare',
    description: 'Providing free LPG connections to women from below poverty line (BPL) households.',
    eligibility: 'BPL families',
    benefits: 'LPG Connection',
    amount: 'Free connection',
    deadline: '2024-10-15',
    status: 'Active',
    applicants: '90M+',
    icon: 'Flame',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    tags: ['LPG', 'Women', 'BPL'],
    applyLink: 'https://pmuy.gov.in/'
  }
];

// Simulate API call with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Scheme {
  id: number;
  title: string;
  category: string;
  description: string;
  eligibility: string;
  benefits: string;
  amount: string;
  deadline: string;
  status: string;
  applicants: string;
  icon: string;
  color: string;
  bgColor: string;
  tags: string[];
  applyLink: string;
}

export interface ApiResponse {
  data: Scheme[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const fetchSchemes = async ({
  page = 1,
  limit = 6,
  search = '',
  category = 'All',
  sortBy = 'relevance'
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
} = {}): Promise<ApiResponse> => {
  // Simulate network delay
  await delay(800);

  // Filter schemes based on search and category
  let filtered = [...mockSchemes];
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      scheme =>
        scheme.title.toLowerCase().includes(searchLower) ||
        scheme.description.toLowerCase().includes(searchLower) ||
        scheme.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(scheme => scheme.category === category);
  }

  // Sort schemes
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      case 'applicants':
        return parseInt(b.applicants) - parseInt(a.applicants);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Paginate results
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = sorted.slice(0, end);

  return {
    data: paginated,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit)
  };
};
