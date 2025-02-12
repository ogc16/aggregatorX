import React from 'react';
import { X, Facebook, Twitter, Linkedin, Link } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    url: string;
  };
}

export function ShareModal({ isOpen, onClose, article }: ShareModalProps) {
  if (!isOpen) return null;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(article.url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Share Article</h2>

        <div className="grid grid-cols-2 gap-4">
          <a
            href={shareUrls.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Facebook className="w-5 h-5" />
            Facebook
          </a>

          <a
            href={shareUrls.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-md bg-sky-500 text-white hover:bg-sky-600 transition-colors"
          >
            <Twitter className="w-5 h-5" />
            Twitter
          </a>

          <a
            href={shareUrls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
            LinkedIn
          </a>

          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 p-3 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            <Link className="w-5 h-5" />
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}