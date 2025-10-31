"use server";

import { optimizeTravelDates, type OptimizeTravelDatesOutput } from "@/ai/flows/optimize-travel-dates";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";

export async function optimizeTravel(input: any): Promise<{ data: OptimizeTravelDatesOutput | null, error: string | null }> {
  try {
    const travelerDetails = JSON.parse(input.travelerDetails);

    const flatInput = {
      ...input,
      ...travelerDetails,
      ...travelerDetails.level2,
      ...travelerDetails.level3,
    };
    
    delete flatInput.travelerDetails;
    delete flatInput.level2;
    delete flatInput.level3;

    const result = await optimizeTravelDates(flatInput);
    
    // Save search and itinerary if user is authenticated
    const session = await getServerSession(authOptions);
    if (session?.user?.id && result) {
      try {
        // Save the search
        const searchRef = await adminDb.collection('searches').add({
          userId: session.user.id,
          source: input.source,
          destination: input.destination,
          searchDate: new Date(),
          formData: {
            dates: {
              startDate: input.startDate,
              endDate: input.endDate,
            },
            travelerDetails: travelerDetails,
          },
        });

        // Save the itinerary
        await adminDb.collection('itineraries').add({
          userId: session.user.id,
          searchId: searchRef.id,
          source: input.source,
          destination: input.destination,
          createdAt: new Date(),
          optimizationResult: result,
          isFavorite: false,
        });
      } catch (saveError) {
        console.error('Error saving to Firestore:', saveError);
        // Don't fail the request if saving fails
      }
    }
    
    return { data: result, error: null };
  } catch (e) {
    console.error("Error in optimizeTravel action:", e);
    
    // Provide specific error messages for rate limiting
    if (e instanceof Error) {
      if (e.message.includes('429') || e.message.includes('Resource exhausted')) {
        return { 
          data: null, 
          error: "We're experiencing high demand right now. Please try again in a few minutes. If the issue persists, check your API quota at https://makersuite.google.com/app/apikey" 
        };
      }
      return { data: null, error: e.message };
    }
    
    return { data: null, error: "An unexpected error occurred while optimizing your trip." };
  }
}

/**
 * Get user's past searches
 */
export async function getUserSearches() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const snapshot = await adminDb
      .collection('searches')
      .where('userId', '==', session.user.id)
      .orderBy('searchDate', 'desc')
      .limit(20)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      searchDate: doc.data().searchDate.toDate().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching searches:', error);
    throw error;
  }
}

/**
 * Get user's saved itineraries
 */
export async function getUserItineraries() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const snapshot = await adminDb
      .collection('itineraries')
      .where('userId', '==', session.user.id)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    throw error;
  }
}

/**
 * Toggle itinerary favorite status
 */
export async function toggleItineraryFavorite(itineraryId: string, isFavorite: boolean) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const docRef = adminDb.collection('itineraries').doc(itineraryId);
    const doc = await docRef.get();
    
    if (!doc.exists || doc.data()?.userId !== session.user.id) {
      throw new Error('Unauthorized or document not found');
    }

    await docRef.update({ isFavorite });
    return { success: true };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

/**
 * Delete an itinerary
 */
export async function deleteItineraryAction(itineraryId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const docRef = adminDb.collection('itineraries').doc(itineraryId);
    const doc = await docRef.get();
    
    if (!doc.exists || doc.data()?.userId !== session.user.id) {
      throw new Error('Unauthorized or document not found');
    }

    await docRef.delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    throw error;
  }
}

