import { currentUser } from "@clerk/nextjs/server";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import ThemeWrapper from "@/components/ThemeWrapper";
import { Quote } from '@/types';
import { Metadata } from 'next';
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
const QuoteBox = dynamic(() => import("@/components/quote-box"), { ssr: false });

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

async function getFavoriteQuotes(userId: string) {
  const supabase = createServerComponentClient({ cookies });
  console.log('Querying favorites for user ID:', userId);

  // Get quotes that the user has favorited
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      quote_id,
      quotes (
        id,
        quote_text,
        author_id
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log('No favorites found for user');
    return [];
  }

  console.log('Found favorites:', data);

  // Get author names for the quotes
  const quoteIds = data.map(fav => fav.quotes.id);
  const { data: quotesWithAuthors, error: authorError } = await supabase
    .from('quotes')
    .select(`
      id,
      quote_text,
      authors (
        author_name
      )
    `)
    .in('id', quoteIds);

  if (authorError) {
    console.error('Error fetching authors:', authorError);
    return [];
  }

  console.log('Quotes with authors:', quotesWithAuthors);

  return quotesWithAuthors.map(quote => ({
    id: quote.id,
    text: quote.quote_text,
    author: quote.authors?.author_name || 'Unknown Author',
    likes: 0,
    category: '',
    dislikes: 0
  }));
}

export default async function FavoriteQuotes() {
  const user = await currentUser();
  
  if (!user) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow flex flex-col items-center justify-center p-8">
            <h1
              className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}
            >
              My Favorite Quotes
            </h1>
            <div className="max-w-2xl text-center">
              <p className="mb-4 dark:text-gray-300">
                Please sign in to view your favorite quotes from{' '}
                <Link href="/" className="text-blue-600 hover:underline">
                  Free Daily Motivation
                </Link>
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  const userId = user.id;
  console.log('Using Supabase user ID:', userId);

  const quotes = await getFavoriteQuotes(userId);
  console.log('Final quotes array:', quotes);

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <h1
            className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}
          >
            My Favorite Quotes
          </h1>
          <div className="max-w-2xl text-center mb-8">
            <p className="mb-4 dark:text-gray-300">
              Welcome to your personal collection of favorite quotes from{' '}
              <Link href="/" className="text-blue-600 hover:underline">
                Free Daily Motivation
              </Link>
              ! Here are all the inspiring quotes you've liked.
            </p>
          </div>
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
            {quotes.length > 0 ? (
              quotes.map((quote: Quote) => (
                <QuoteBox key={quote.id} quote={quote} />
              ))
            ) : (
              <p className="text-center dark:text-gray-300">
                You haven't liked any quotes yet. Browse through our collection and click the heart icon to add quotes to your favorites!
              </p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeWrapper>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Favorite Quotes | Free Daily Motivation',
    description: 'View your favorite quotes that inspire and motivate you.',
  };
}
