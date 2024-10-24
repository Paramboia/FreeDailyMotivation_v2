import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase
    .from('quotes')
    .select('id, quote_text, authors(name), categories(category_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading quotes:', error);
    return NextResponse.json({ error: 'Failed to load quotes' }, { status: 500 });
  }

  const quotes = data.map(item => ({
    id: item.id,
    text: item.quote_text,
    author: item.authors.name,
    category: item.categories.category_name,
    likes: 0,
    dislikes: 0
  }));

  return NextResponse.json(quotes);
}
