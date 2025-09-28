import { Calendar, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const updates = [
  {
    id: 1,
    type: 'new-scheme',
    title: 'New PM Digital Health Mission Launched',
    description: 'A comprehensive digital health infrastructure for all citizens with unique health IDs and digital health records.',
    date: '2024-09-20',
    status: 'Active',
    category: 'Healthcare',
    urgent: false
  },
  {
    id: 2,
    type: 'deadline',
    title: 'PM-KISAN Scheme Registration Deadline Extended',
    description: 'Last date for PM-KISAN benefit scheme registration extended to October 31, 2024. Don\'t miss out!',
    date: '2024-09-18',
    status: 'Urgent',
    category: 'Agriculture',
    urgent: true
  },
  {
    id: 3,
    type: 'update',
    title: 'Ayushman Bharat Coverage Increased',
    description: 'Health coverage under Ayushman Bharat scheme increased to ₹10 lakhs per family per year.',
    date: '2024-09-15',
    status: 'Updated',
    category: 'Healthcare',
    urgent: false
  },
  {
    id: 4,
    type: 'maintenance',
    title: 'Portal Maintenance Scheduled',
    description: 'The portal will undergo maintenance on September 25, 2024, from 2:00 AM to 6:00 AM IST.',
    date: '2024-09-14',
    status: 'Scheduled',
    category: 'System',
    urgent: false
  },
  {
    id: 5,
    type: 'new-feature',
    title: 'Mobile App Now Available',
    description: 'Download our new mobile application for easier access to all government schemes on the go.',
    date: '2024-09-12',
    status: 'Available',
    category: 'Digital Services',
    urgent: false
  }
];

const getStatusBadge = (status: string, urgent: boolean) => {
  if (urgent) {
    return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
  }
  
  switch (status) {
    case 'Active':
      return <Badge className="bg-success text-success-foreground text-xs">Active</Badge>;
    case 'Updated':
      return <Badge className="bg-primary text-primary-foreground text-xs">Updated</Badge>;
    case 'Scheduled':
      return <Badge className="bg-warning text-warning-foreground text-xs">Scheduled</Badge>;
    case 'Available':
      return <Badge className="bg-success text-success-foreground text-xs">Available</Badge>;
    default:
      return <Badge variant="secondary" className="text-xs">{status}</Badge>;
  }
};

const getIcon = (type: string, urgent: boolean) => {
  if (urgent) {
    return <AlertCircle className="w-5 h-5 text-destructive" />;
  }
  
  switch (type) {
    case 'new-scheme':
    case 'new-feature':
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    default:
      return <Calendar className="w-5 h-5 text-primary" />;
  }
};

const LatestUpdates = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Latest Updates & Announcements
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about new schemes, important deadlines, and system updates. 
            Never miss out on benefits that matter to you.
          </p>
        </div>

        {/* Updates List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {updates.map((update) => (
            <Card 
              key={update.id} 
              className={`p-6 transition-all duration-300 hover:shadow-md ${
                update.urgent ? 'border-destructive/30 bg-destructive/5' : 'border-border'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(update.type, update.urgent)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-foreground leading-tight">
                        {update.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <span>{new Date(update.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        })}</span>
                        <span>•</span>
                        <span>{update.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusBadge(update.status, update.urgent)}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {update.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Button variant="link" className="px-0 text-primary hover:text-primary-hover">
                      Read More
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    
                    {update.urgent && (
                      <span className="text-sm text-destructive font-medium">
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Announcements
            <ExternalLink className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestUpdates;