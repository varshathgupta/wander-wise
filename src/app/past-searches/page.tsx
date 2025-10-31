'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  getUserSearches, 
  getUserItineraries, 
  deleteItineraryAction, 
  toggleItineraryFavorite 
} from '@/app/actions';
import type { UserSearch, SavedItinerary } from '@/types/firestore';
import { Calendar, MapPin, Heart, Trash2, Eye, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTravelStore } from '@/store/travel-hooks';

export default function PastSearchesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searches, setSearches] = useState<UserSearch[]>([]);
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    async function loadData() {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const [searchesData, itinerariesData] = await Promise.all([
            getUserSearches(),
            getUserItineraries(),
          ]);
          // Convert date strings back to Date objects
          setSearches(searchesData.map((s: any) => ({
            ...s,
            searchDate: new Date(s.searchDate),
          })));
          setItineraries(itinerariesData.map((i: any) => ({
            ...i,
            createdAt: new Date(i.createdAt),
          })));
        } catch (err) {
          console.error('Error loading data:', err);
          setError('Failed to load your past searches. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }

    loadData();
  }, [session?.user?.id]);

  const handleViewItinerary = (itinerary: SavedItinerary) => {
    const store = useTravelStore.getState();
    store.setOptimizationResult(itinerary.optimizationResult);
    store.setTripMetadata(itinerary.source, itinerary.destination);
    router.push('/itinerary');
  };

  const handleToggleFavorite = async (itineraryId: string, currentStatus: boolean) => {
    try {
      await toggleItineraryFavorite(itineraryId, !currentStatus);
      setItineraries(prev =>
        prev.map(item =>
          item.id === itineraryId ? { ...item, isFavorite: !currentStatus } : item
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleDeleteItinerary = async (itineraryId: string) => {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      try {
        await deleteItineraryAction(itineraryId);
        setItineraries(prev => prev.filter(item => item.id !== itineraryId));
      } catch (err) {
        console.error('Error deleting itinerary:', err);
      }
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Your Travel History</h2>
          <p className="text-muted-foreground">
            View your past searches and saved itineraries
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="itineraries" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 justify-center">
            <TabsTrigger value="itineraries">Saved Itineraries</TabsTrigger>
            <TabsTrigger value="searches">Search History</TabsTrigger>
          </TabsList>

          <TabsContent value="itineraries" className="mt-6">
            {itineraries.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground text-center">
                    No saved itineraries yet. Start planning your next adventure!
                  </p>
                  <Link href="/">
                    <Button className="mt-4">Create New Itinerary</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {itineraries.map((itinerary) => (
                  <Card key={itinerary.id} className="relative hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {itinerary.destination}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            From {itinerary.source}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleFavorite(itinerary.id!, itinerary.isFavorite || false)}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              itinerary.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                            }`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(itinerary.createdAt).toLocaleDateString()}
                        </div>
                        
                        {itinerary.optimizationResult.totalEstimatedCostPerPerson && (
                          <Badge variant="secondary">
                            &#x20b9; {itinerary.optimizationResult.totalEstimatedCostPerPerson.toLocaleString()} / person
                          </Badge>
                        )}

                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => handleViewItinerary(itinerary)}
                            className="flex-1"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            onClick={() => handleDeleteItinerary(itinerary.id!)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="searches" className="mt-6">
            {searches.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground text-center">
                    No search history yet. Start searching for your next trip!
                  </p>
                  <Link href="/">
                    <Button className="mt-4">Start Searching</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {searches.map((search) => (
                  <Card key={search.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {search.source} → {search.destination}
                          </CardTitle>
                          <CardDescription>
                            Searched on {new Date(search.searchDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {search.formData.dates && (
                          <Badge variant="outline">
                            {new Date(search.formData.dates.startDate).toLocaleDateString()} - {new Date(search.formData.dates.endDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
