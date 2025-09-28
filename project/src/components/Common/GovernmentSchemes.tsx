import { useState } from 'react';
import { 
  Search,
  Filter,
  GraduationCap, 
  Heart, 
  Briefcase, 
  Sprout,
  ArrowRight,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const schemes = [
  {
    id: 1,
    title: 'PM-KISAN Samman Nidhi',
    category: 'Agriculture',
    description: 'Direct income support to farmers with landholding up to 2 hectares. ₹6,000 per year in three installments.',
    eligibility: 'Small & marginal farmers',
    benefits: '₹6,000/year',
    deadline: '2024-10-31',
    status: 'Active',
    applicants: '12M+',
    icon: Sprout,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 2,
    title: 'Ayushman Bharat',
    category: 'Healthcare',
    description: 'Health insurance coverage up to ₹10 lakhs per family per year for secondary and tertiary care.',
    eligibility: 'BPL families',
    benefits: '₹10 Lakh coverage',
    deadline: 'Ongoing',
    status: 'Active',
    applicants: '50M+',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 3,
    title: 'PM Kaushal Vikas Yojana',
    category: 'Employment',
    description: 'Skill development program providing training in various sectors to enhance employability.',
    eligibility: 'Youth 18-35 years',
    benefits: 'Free skill training',
    deadline: '2024-12-15',
    status: 'Active',
    applicants: '8M+',
    icon: Briefcase,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 4,
    title: 'National Scholarship Portal',
    category: 'Education',
    description: 'Scholarships for students from pre-matric to post-graduate levels across various categories.',
    eligibility: 'Students from economically weaker sections',
    benefits: 'Up to ₹2 Lakh/year',
    deadline: '2024-11-30',
    status: 'Active',
    applicants: '25M+',
    icon: GraduationCap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

const categories = ['All', 'Agriculture', 'Healthcare', 'Employment', 'Education'];

const GovernmentSchemes = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = schemes.filter(scheme => {
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 bg-muted" id="government-schemes">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Government Schemes & Benefits
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover government schemes designed for your welfare. Apply online, check eligibility, and get the benefits you deserve.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search schemes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filter
            </Button>
          </div>

          {/* Category Filter */}
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
                      <Badge className="ml-2 bg-success text-success-foreground">
                        {scheme.status}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <Badge variant="secondary" className="text-xs">
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
                      <Button size="sm" className="flex-1">
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Check Eligibility
                      </Button>
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