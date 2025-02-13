import React, { useEffect, useState } from 'react';
import axios from 'axios';

const News = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      const url = `https://newsapi.org/v2/everything?q=technology&apiKey=${apiKey}`;

      try {
        const response = await axios.get(url);
        setArticles(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div>
      {articles.map((article, index) => (
        <div key={index}>
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
        </div>
      ))}
    </div>
  );
};

export default News;
    
 /*   In the above code, we are fetching news articles from the News API using the  axios  library. We are using the  useEffect  hook to fetch the news articles when the component mounts. 
    We are using the  import.meta.env.VITE_NEWS_API_KEY  to access the News API key from the environment variables. 
    The  News  component renders the news articles as a list of titles, descriptions, and links to the full articles. 
    Step 6: Create a Layout Component 
    Next, let’s create a layout component that will be used to render the header and footer of the application. 
    Create a new file named  Layout.js  inside the  src/components  directory and add the following code:
*/