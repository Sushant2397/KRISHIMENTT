import { 
  GraduationCap, 
  Heart, 
  Briefcase, 
  Sprout, 
  Home, 
  Users, 
  Accessibility,
  Baby,
  ArrowRight 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: 'education',
    title: 'Education',
    description: 'Scholarships, student loans, and educational support',
    icon: GraduationCap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    schemes: 125
  },
  {
    id: 'health',
    title: 'Healthcare',
    description: 'Medical insurance, health schemes, and wellness programs',
    icon: Heart,
    color: 'text-red-600', 
    bgColor: 'bg-red-50',
    schemes: 98
  },
  {
    id: 'employment',
    title: 'Employment',
    description: 'Job training, skill development, and employment schemes',
    icon: Briefcase,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    schemes: 87
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
    description: 'Farmer support, crop insurance, and agricultural loans',
    icon: Sprout,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    schemes: 73
  },
  {
    id: 'housing',
    title: 'Housing',
    description: 'Housing loans, rural housing, and urban development',
    icon: Home,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    schemes: 56
  },
  {
    id: 'social',
    title: 'Social Welfare',
    description: 'Pension schemes, social security, and welfare programs',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    schemes: 92
  },
  {
    id: 'disability',
    title: 'Disability Support',
    description: 'Support for persons with disabilities and special needs',
    icon: Accessibility,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    schemes: 34
  },
  {
    id: 'women-child',
    title: 'Women & Child',
    description: 'Maternal health, child development, and women empowerment',
    icon: Baby,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    schemes: 67
  }
];

const SchemeCategories = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Browse Schemes by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find government schemes tailored to your needs. Click on any category to explore available programs and benefits.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Card 
                key={category.id}
                className="p-6 hover:shadow-md transition-all duration-300 cursor-pointer border border-border hover:border-primary group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${category.color}`} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="text-sm font-medium text-primary">
                      {category.schemes} schemes available
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8">
            View All Schemes
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SchemeCategories;