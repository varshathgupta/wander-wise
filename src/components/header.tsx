import Link from 'next/link';
import Image from 'next/image';
import { Plane } from 'lucide-react';
import { AuthButton } from '@/components/auth-button';

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Plane className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">
              WanderWise
            </h1>
            <span className="text-muted-foreground text-sm hidden md:inline mx-2">×</span>
            <Image 
              src="/easemytrip-logo.svg" 
              alt="EaseMyTrip" 
              width={200} 
              height={40}
              className="hidden md:block"
            />
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
