import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { getAdminDb } from './firebase-admin';

// Lazy function to get auth options - only initializes Firebase when actually needed
export const getAuthOptions = (): NextAuthOptions => {
  let adapter;
  
  try {
    const db = getAdminDb();
    adapter = FirestoreAdapter(db);
  } catch (error) {
    console.warn('FirestoreAdapter initialization failed, running without adapter:', error);
    adapter = undefined;
  }

  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    adapter,
    callbacks: {
      async jwt({ token, user, account }) {
        // Initial sign in
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user && token) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
          session.user.name = token.name as string;
          session.user.image = token.picture as string;
        }
        return session;
      },
    },
    pages: {
      signIn: '/',
    },
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
    },
  };
};

// Export for backward compatibility, but will throw at build time if env vars not available
export const authOptions: NextAuthOptions = getAuthOptions();
