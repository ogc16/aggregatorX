import { useState } from 'react';
import { NewsArticle } from '../types';
import { Calendar, ExternalLink, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface NewsCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  userId?: string;
}

export function NewsCard({ article, isBookmarked, userId }: NewsCardProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked);

  const handleBookmark = async () => {
    if (!userId) {
      toast.error('Please sign in to bookmark articles');
      return;
    }

    try {
      if (isBookmarkedState) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .match({ user_id: userId, article_id: article.id });

        if (error) throw error;
        setIsBookmarkedState(false);
        toast.success('Article removed from bookmarks');
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert([{ user_id: userId, article_id: article.id }]);

        if (error) throw error;
        setIsBookmarkedState(true);
        toast.success('Article bookmarked');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {article.date}
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">{article.title}</h3>
          <p className="text-gray-600 mb-4">{article.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Source: {article.source}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmark}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title={isBookmarkedState ? 'Remove bookmark' : 'Bookmark article'}
              >
                {isBookmarkedState ? (
                  <BookmarkCheck className="w-5 h-5 text-blue-600" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Share article"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Read more <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        article={article}
      />
    </>
  );
}