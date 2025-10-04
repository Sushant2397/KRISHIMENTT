import { useState, useEffect, useCallback } from 'react';
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
import { fetchSchemes } from '@/services/schemeService';
import { Scheme as SchemeType } from '@/services/schemeService';

// Import icon components from lucide-react
const iconComponents: { [key: string]: any } = {
  Sprout,
  Heart,
  Briefcase,
  GraduationCap,
  Home,
  Flame
};

// Define categories for filtering
const categories = ['All', 'Agriculture', 'Healthcare', 'Employment', 'Education', 'Housing', 'Social Welfare'];

// Number of schemes to load per page
const SCHEMES_PER_PAGE = 6;

const GovernmentSchemes = () => {
  // State for filters and search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedScheme, setSelectedScheme] = useState<SchemeType | null>(null);
  const [schemes, setSchemes] = useState<SchemeType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalSchemes, setTotalSchemes] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch schemes from API
  const fetchSchemesData = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      const currentPage = reset ? 1 : page;
      
      const response = await fetchSchemes({
        page: currentPage,
        limit: SCHEMES_PER_PAGE,
        search: searchQuery,
        category: selectedCategory,
        sortBy
      });

      setTotalSchemes(response.total);
      setHasMore(currentPage < response.totalPages);
      
      if (reset) {
        setSchemes(response.data);
      } else {
        setSchemes(prev => [...prev, ...response.data]);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
      // Handle error (e.g., show error message)
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, selectedCategory, sortBy]);

  // Initial load and when filters change
  useEffect(() => {
    setPage(1);
    fetchSchemesData(true);
  }, [searchQuery, selectedCategory, sortBy]);

  // Load more schemes
  useEffect(() => {
    if (page > 1) {
      fetchSchemesData();
    }
  }, [page]);

  // Load more schemes
  const loadMoreSchemes = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

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
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {schemes.map((scheme) => {
            const IconComponent = iconComponents[scheme.icon] || Home;
            
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

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-6">
            <Button 
              size="lg" 
              className="px-8"
              onClick={loadMoreSchemes}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  View More Schemes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {schemes.length} of {totalSchemes} schemes
            </p>
          </div>
        )}
        
        {!hasMore && schemes.length > 0 && (
          <div className="text-center text-muted-foreground text-sm mt-4">
            You've reached the end of the list. {totalSchemes} schemes found.
          </div>
        )}
        
        {!isLoading && schemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No schemes found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSortBy('relevance');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GovernmentSchemes;