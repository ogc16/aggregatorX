export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  date: string;
  source: string;
  url: string;
}

export type Category = 'All' | 'Football' | 'Basketball' | 'Baseball' | 'Hockey' | 'Tennis' | 'F1';

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Profile;
        Update: Partial<Profile>;
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          article_id: string;
        };
        Update: never;
      };
      news_cache: {
        Row: NewsArticle & { created_at: string };
        Insert: NewsArticle;
        Update: never;
      };
    };
  };
}