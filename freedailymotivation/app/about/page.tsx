import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeWrapper from "@/components/ThemeWrapper";
import Head from 'next/head';
import { Facebook } from 'lucide-react';

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About Free Daily Motivation</title>
        <meta name="description" content="Learn about Free Daily Motivation, your source for inspirational quotes and daily wisdom. Discover our mission to inspire and motivate people worldwide." />
      </Head>
      <ThemeWrapper>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-8 dark:text-white">About Us</h1>
            <div className="max-w-2xl text-center">
              <p className="mb-4 dark:text-gray-300">
                Welcome to <Link href="/" className="text-blue-600 hover:underline"> Free Daily Motivation </Link>! Our mission is to be the first to offer an easy and intuitive way to generate multiple inspirational quotes from a wide range of categories, including "business," "sport," "science," and "life."
              </p>
              <p className="mb-4 dark:text-gray-300">
                Whether you're looking to enhance your work presentation or boost your social media content, our website provides a rich resource for finding the perfect quote to inspire and engage your audience.
              </p>
              <p className="mb-8 dark:text-gray-300">
                At Free Daily Motivation, we&apos;re committed to providing you with the best motivational content to help you achieve your goals and dreams.
              </p>
            </div>
            <Link href="/">
              <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">Back to Home Page</Button>
            </Link>
          </main>
          <footer className="flex justify-between items-center p-4 text-sm text-white dark:text-gray-300">
          <div className="flex-1 flex justify-center">
            <span>© 2024 Free Daily Motivation. All rights reserved.</span>
          </div>
          <div className="flex items-center">
            <Link href="https://www.facebook.com/people/Free-Daily-Motivation/61566119962164/" className="flex items-center text-blue-600 hover:underline">
              <Facebook className="h-5 w-5 mr-1" />
              Join the Community
            </Link>
          </div>
        </footer>
        </div>
      </ThemeWrapper>
    </>
  );
}
