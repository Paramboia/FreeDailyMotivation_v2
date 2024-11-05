"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { getRandomQuote, getAllCategories } from '@/lib/quotes';
import { Quote } from '@/types';
import dynamic from 'next/dynamic';
import CategoryButtons from "@/components/category-buttons";
import SavePagePopup from "@/components/SavePagePopup";
import ThemeWrapper from "@/components/ThemeWrapper";
import { Poppins } from "next/font/google";

const QuoteBox = dynamic(() => import("@/components/quote-box"), { 
  ssr: false,
  loading: () => <div className="flex justify-center items-center">Loading quote...</div>
});

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function initializeQuotes() {
      try {
        const [fetchedCategories, initialQuote] = await Promise.all([
          getAllCategories(),
          getRandomQuote()
        ]);
        setCategories(fetchedCategories);
        setQuote(initialQuote);
      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    }
    initializeQuotes();
  }, []);

  const handleNewQuote = async () => {
    try {
      const newQuote = await getRandomQuote(selectedCategory);
      if (newQuote) {
        setQuote(newQuote);
      }
    } catch (error) {
      console.error('Error fetching new quote:', error);
    }
  };

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="mb-12">
            <h1 className={`${poppins.className} text-2xl md:text-3xl font-bold text-center text-[#333333] dark:text-white whitespace-nowrap overflow-hidden text-ellipsis`}>
              Free Daily Motivation
            </h1>
          </div>
          {quote && (
            <QuoteBox 
              quote={quote}
              onNewQuote={handleNewQuote}
              selectedCategory={selectedCategory}
            />
          )}
          {!quote && (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Loading quote...</p>
            </div>
          )}
          {categories.length > 0 && (
            <div className="mt-8">
              <CategoryButtons 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>
          )}
        </main>
        <footer className="p-4 text-sm text-center text-white dark:text-gray-300">
          © 2024 Free Daily Motivation. All rights reserved.
        </footer>
      </div>
      {showPopup && <SavePagePopup onClose={() => setShowPopup(false)} />}
    </ThemeWrapper>
  );
}
