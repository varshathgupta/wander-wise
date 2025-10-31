"use client";

import { TravelOptimizerForm } from "@/components/travel-optimizer-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-headline">
                <Search className="h-6 w-6 text-primary" />
                Find Your Perfect Trip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Tell us your dream destination and travel dates, and our AI will create a detailed itinerary for you.
              </p>
              <TravelOptimizerForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
