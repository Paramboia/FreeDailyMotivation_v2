import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import ThemeWrapper from "@/components/ThemeWrapper";
import { Quote } from '@/types';
import { Metadata } from 'next';
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
import { currentUser } from "@clerk/nextjs/server";

const QuoteBox = dynamic(() => import("@/components/quote-box"), { ssr: false });

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

async function getFavoriteQuotes(clerkUserId: string): Promise<Quote[]> {
  try {
    const supabase = createServerComponentClient({ cookies });
    console.log('1. Looking up user with Clerk ID:', clerkUserId);

    // Step 1: Get the Supabase user ID using the Clerk user ID
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')  // Select all columns to see full user data
      .eq('clerk_user_id', clerkUserId)
      .single();

    console.log('2. Full user data:', users);

    if (userError) {
      console.error('Error finding user:', userError);
      throw userError;
    }

    if (!users) {
      console.log('No user found for Clerk ID:', clerkUserId);
      return [];
    }

    const supabaseUserId = users.id;
    console.log('3. Found Supabase user ID:', supabaseUserId);

    // Step 2: Get favorite quote IDs for the user
    const { data: favoritesData, error: favoritesError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', supabaseUserId);

    console.log('4. Full favorites data:', JSON.stringify(favoritesData, null, 2));

    if (favoritesError) {
      console.error('Error fetching favorites:', favoritesError);
      throw favoritesError;
    }

    if (!favoritesData || favoritesData.length === 0) {
      console.log('No favorites found for user ID:', supabaseUserId);
      return [];
    }

    const quoteIds = favoritesData.map(fav => fav.quote_id);
    console.log('5. Found favorite quote IDs:', quoteIds);

    // Step 3: Get the actual quotes and their authors
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select(`
        *,
        authors (
          *
        )
      `)
      .in('id', quoteIds);

    console.log('6. Full quotes data:', JSON.stringify(quotes, null, 2));

    if (quotesError) {
      console.error('Error fetching quotes:', quotesError);
      throw quotesError;
    }

    if (!quotes) {
      console.log('No quotes found');
      return [];
    }

    // Map the data to Quote format
    return quotes.map(quote => ({
      id: quote.id,
      text: quote.quote_text,
      author: quote.authors?.[0]?.author_name || 'Unknown Author',
      likes: 0,
      category: '',
      dislikes: 0
    }));

  } catch (error) {
    console.error('Error in getFavoriteQuotes:', error);
    throw error;
  }
}

export default async function FavoriteQuotes() {
  const user = await currentUser();
  
  // Handle unauthenticated users
  if (!user) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className={`${poppins.className} text-4xl mb-4 text-gray-800 dark:text-white`}>
              Please sign in to view your favorite quotes
            </h1>
            <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Go back home
            </Link>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  try {
    console.log('User signed in:', user);
    const quotes = await getFavoriteQuotes(user.id);
    console.log('Final quotes:', quotes);

    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
          <div className="container mx-auto px-4 py-8">
            <h1 className={`${poppins.className} text-4xl mb-8 text-center text-gray-800 dark:text-white`}>
              Your Favorite Quotes
            </h1>
            <div className="max-w-6xl mx-auto">
              {quotes.length === 0 ? (
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You haven't favorited any quotes yet.
                  </p>
                  <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Discover quotes to favorite
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {quotes.map((quote) => (
                    <QuoteBox key={quote.id} quote={quote} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  } catch (error) {
    console.error('Error in FavoriteQuotes page:', error);
    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className={`${poppins.className} text-4xl mb-4 text-gray-800 dark:text-white`}>
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We're having trouble loading your favorite quotes.
            </p>
            <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Go back home
            </Link>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }
}

export const metadata: Metadata = {
  title: 'Your Favorite Quotes - Free Daily Motivation',
  description: 'View your collection of favorite motivational quotes.',
};
