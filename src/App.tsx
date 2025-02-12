import React, { useState, useEffect } from 'react';
import { Search, Newspaper, User, Moon, Sun, LogOut } from 'lucide-react';
import { NewsCard } from './components/NewsCard';
import { AuthModal } from './components/AuthModal';
import { Category, NewsArticle } from './types';
import { supabase } from './lib/supabase';
import { fetchNews } from './lib/newsApi';
import toast from 'react-hot-toast';

const categories: Category[] = ['All', 'Football', 'Basketball', 'Baseball', 'Hockey', 'Tennis', 'F1'];

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    async function loadBookmarks() {
      if (user) {
        const { data } = await supabase
          .from('bookmarks')
          .select('article_id')
          .eq('user_id', user.id);

        if (data) {
          setBookmarks(new Set(data.map(b => b.article_id)));
        }
      }
    }

    loadBookmarks();
  }, [user]);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const newsData = await fetchNews(selectedCategory);
        setArticles(newsData);
      } catch (error) {
        toast.error('Failed to load news');
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [selectedCategory]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-blue-600'} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Newspaper className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Sports Central</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-full ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-blue-500 text-white placeholder-blue-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-300`}
                />
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-opacity-20 hover:bg-black rounded-full transition-colors"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-opacity-20 hover:bg-black transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-opacity-20 hover:bg-black transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                selectedCategory === category
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Loading news...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                isBookmarked={bookmarks.has(article.id)}
                userId={user?.id}
              />
            ))}
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              No articles found matching your criteria.
            </p>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default App;