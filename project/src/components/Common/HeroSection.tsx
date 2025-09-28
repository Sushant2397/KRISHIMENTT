import { ArrowRight, FileText, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary-light to-secondary py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Your Digital Gateway to
                <span className="text-primary block">Essential Services</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Access government schemes, apply for documents, manage finances, and more. 
                Everything you need as a citizen, simplified and digitized.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base px-8">
                Explore Services
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8">
                <CheckCircle className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Digital Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5M+</div>
                <div className="text-sm text-muted-foreground">Citizens Served</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="lg:pl-8">
            <Card className="p-8 bg-card border border-border shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Quick Actions
              </h3>
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-4">
                  <div className="flex items-center w-full">
                    <FileText className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-medium">Government Schemes</div>
                      <div className="text-sm text-muted-foreground">Apply for benefits and schemes</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </div>
                </Button>

                <Button variant="outline" className="w-full justify-start text-left h-auto py-4">
                  <div className="flex items-center w-full">
                    <CheckCircle className="w-5 h-5 mr-3 text-success flex-shrink-0" />
                    <div>
                      <div className="font-medium">Document Services</div>
                      <div className="text-sm text-muted-foreground">Apply for certificates & licenses</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </div>
                </Button>

                <Button variant="outline" className="w-full justify-start text-left h-auto py-4">
                  <div className="flex items-center w-full">
                    <Download className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
                    <div>
                      <div className="font-medium">Track Applications</div>
                      <div className="text-sm text-muted-foreground">Check status of all applications</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </div>
                </Button>
              </div>

              <div className="mt-8 p-4 bg-primary-light rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-sm">
                    <p className="font-medium text-primary mb-1">Need Help?</p>
                    <p className="text-muted-foreground">
                      Our support team is available 24/7 to assist you with your applications.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;