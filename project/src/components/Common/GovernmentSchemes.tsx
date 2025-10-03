import { useState } from 'react';
import { 
  Search, 
  Filter,
  Home,
  Flame,
  GraduationCap, 
  Heart, 
  Briefcase, 
  Sprout,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define TypeScript interfaces
interface Scheme {
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
  icon: any;
  color: string;
  bgColor: string;
  tags: string[];
  applyLink: string;
}

const schemes: Scheme[] = [
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
    icon: Sprout,
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
    deadline: 'Ongoing',
    status: 'Active',
    applicants: '50M+',
    icon: Heart,
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
    deadline: '2023-12-15',
    status: 'Inactive',
    applicants: '8M+',
    icon: Briefcase,
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
    icon: GraduationCap,
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
    icon: Home,
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
    deadline: '2023-06-30',
    status: 'Inactive',
    applicants: '90M+',
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    tags: ['LPG', 'Women', 'BPL'],
    applyLink: 'https://pmuy.gov.in/'
  }
];

// Extract unique categories
const categories = ['All', ...new Set(schemes.map(scheme => scheme.category))];

const GovernmentSchemes = () => {
  // State for filters and search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Filter and sort schemes
  const filteredAndSortedSchemes = schemes
    .filter(scheme => {
      const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
                          scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
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

  // Filter schemes based on search and category
  const filteredSchemes = filteredAndSortedSchemes;

  return (
    <section className="py-8 md:py-12 bg-muted min-h-screen" id="government-schemes">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Government Schemes & Benefits
          </h1>
          <p className="text-muted-foreground">Find and apply for government schemes that match your needs</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search schemes..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <span className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="applicants">Most Popular</SelectItem>
              <SelectItem value="title">A to Z</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="md:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {filteredSchemes.map((scheme) => {
            const IconComponent = scheme.icon;
            
            return (
              <Card key={scheme.id} className="p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg ${scheme.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`w-6 h-6 ${scheme.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground text-lg leading-tight">
                        {scheme.title}
                      </h3>
                      <Badge 
                        variant={scheme.status === 'Active' ? 'default' : 'secondary'}
                        className={scheme.status === 'Active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}
                      >
                        {scheme.status}
                        {scheme.status === 'Inactive' && (
                          <span className="ml-1" title="Check back later for updates">ℹ️</span>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs font-medium mr-2 mb-2 hover:bg-secondary/80">
                        {scheme.category}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {scheme.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Benefits:</span>
                        <div className="font-medium text-success">{scheme.benefits}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Applicants:</span>
                        <div className="font-medium text-primary">{scheme.applicants}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        Deadline: {scheme.deadline}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        {scheme.eligibility}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {scheme.status === 'Active' ? (
                        <a 
                          href={scheme.applyLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button size="sm" className="w-full">
                            Apply Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </a>
                      ) : (
                        <Button 
                          size="sm" 
                          className="w-full" 
                          variant="outline"
                          disabled
                          title="This scheme is currently not active"
                        >
                          Applications Closed
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedScheme(scheme)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Check Eligibility
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Eligibility Criteria</DialogTitle>
                            <DialogDescription>
                              Check if you qualify for the {selectedScheme?.title} scheme
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <h4 className="font-medium mb-2">Eligibility:</h4>
                              <p className="text-sm">{selectedScheme?.eligibility}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Benefits:</h4>
                              <p className="text-sm">{selectedScheme?.benefits}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Amount:</h4>
                              <p className="text-sm">{selectedScheme?.amount}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Deadline:</h4>
                              <p className="text-sm">
                                {selectedScheme?.deadline === 'Ongoing' 
                                  ? 'Open for applications' 
                                  : `Until ${selectedScheme?.deadline}`}
                              </p>
                            </div>
                            {selectedScheme?.status === 'Active' ? (
                              <a 
                                href={selectedScheme.applyLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block mt-4"
                              >
                                <Button className="w-full">
                                  Apply Now
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </a>
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                                This scheme is currently not accepting applications. Please check back later for updates.
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8">
            View All 500+ Schemes
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GovernmentSchemes;