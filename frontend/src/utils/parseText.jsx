import { Link } from 'react-router-dom';

/**
 * Parse text and make @mentions and #hashtags clickable
 * @param {string} text - The text to parse
 * @returns {JSX.Element[]} - Array of text and link elements
 */
export const parseText = (text) => {
  if (!text) return [];

  const words = text.split(' ');
  
  return words.map((word, index) => {
    // Handle @mentions
    if (word.startsWith('@')) {
      const username = word.slice(1).replace(/[^a-zA-Z0-9_]/g, '');
      return (
        <span key={index}>
          <Link
            to={`/profile/${username}`}
            className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {word}
          </Link>
          {' '}
        </span>
      );
    }
    
    // Handle #hashtags
    if (word.startsWith('#')) {
      const hashtag = word.slice(1).replace(/[^a-zA-Z0-9_]/g, '');
      return (
        <span key={index}>
          <Link
            to={`/explore?hashtag=${hashtag}`}
            className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {word}
          </Link>
          {' '}
        </span>
      );
    }
    
    // Regular text
    return <span key={index}>{word} </span>;
  });
};

/**
 * Extract @mentions from text
 * @param {string} text - The text to parse
 * @returns {string[]} - Array of mentioned usernames
 */
export const extractMentions = (text) => {
  if (!text) return [];
  
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

/**
 * Extract #hashtags from text
 * @param {string} text - The text to parse
 * @returns {string[]} - Array of hashtags
 */
export const extractHashtags = (text) => {
  if (!text) return [];
  
  const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
  const hashtags = [];
  let match;
  
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1]);
  }
  
  return hashtags;
};
