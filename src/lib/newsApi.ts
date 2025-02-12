import { NewsArticle } from '../types';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export async function fetchNews(category: string = ''): Promise<NewsArticle[]> {
  try {
    const query = category === 'All' ? 'sports' : `${category} sports`;
    const response = await fetch(
      `${BASE_URL}/everything?q=${query}&apiKey=${API_KEY}&pageSize=30`
    );
    const data = await response.json();

    return data.articles.map((article: any) => ({
      id: article.url,
      title: article.title,
      description: article.description || '',
      category: category === 'All' ? 'General' : category,
      imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1200',
      date: new Date(article.publishedAt).toLocaleDateString(),
      source: article.source.name,
      url: article.url
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}