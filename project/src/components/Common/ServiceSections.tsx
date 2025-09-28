import { 
  Shield, 
  FileText, 
  CreditCard, 
  Users,
  GraduationCap,
  Building,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    id: 'government-schemes',
    title: 'Government Schemes',
    description: 'Access 500+ government schemes and benefits. Apply online, check eligibility, and track your applications.',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: ['Online Applications', 'Eligibility Checker', 'Status Tracking'],
    cta: 'Explore Schemes'
  },
  {
    id: 'document-services',
    title: 'Document Services',
    description: 'Apply for certificates, licenses, and official documents. Fast processing and digital delivery.',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    features: ['Birth/Death Certificates', 'Marriage Certificates', 'Business Licenses'],
    cta: 'Get Documents'
  },
  {
    id: 'financial-services',
    title: 'Financial Services',
    description: 'Banking, loans, insurance, and financial assistance programs all in one place.',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    features: ['Loan Applications', 'Insurance Claims', 'Financial Aid'],
    cta: 'View Services'
  },
  {
    id: 'citizen-services',
    title: 'Citizen Services',
    description: 'Essential services for citizens including healthcare, education, and civic amenities.',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    features: ['Healthcare Services', 'Education Support', 'Civic Amenities'],
    cta: 'Access Services'
  }
];

const ServiceSections = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">
              Digital Services
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            All Your Essential Services in One Place
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From government schemes to document services, we've streamlined access to all the services you need as a citizen.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            
            return (
              <Card 
                key={service.id}
                className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer border border-border hover:border-primary group"
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 rounded-xl ${service.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${service.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Features */}
                    <div className="mb-6">
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button variant="outline" className="group/btn">
                      {service.cta}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-primary-light rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Need Help Finding the Right Service?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Our support team is here to guide you through any service or help you find exactly what you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Contact Support
            </Button>
            <Button variant="outline" size="lg">
              Browse All Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSections;