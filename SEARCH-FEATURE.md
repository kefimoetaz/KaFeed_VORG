# Search Feature Documentation 🔍

## Overview

The search bar in the navbar now has **real-time user search** functionality with autocomplete dropdown.

## Features

✅ **Real-time Search**: Results appear as you type
✅ **Debounced**: 300ms delay to reduce API calls
✅ **Autocomplete Dropdown**: Shows results below search bar
✅ **User Profiles**: Click to navigate to user profile
✅ **Clear Button**: X icon to clear search
✅ **Click Outside**: Closes dropdown when clicking elsewhere
✅ **Loading State**: Shows spinner while searching
✅ **Empty State**: Shows message when no results found
✅ **Mobile Responsive**: Works on all screen sizes

## How It Works

### User Experience

1. **Type in search bar**: Minimum 2 characters required
2. **See results**: Dropdown appears with matching users
3. **Click user**: Navigate to their profile
4. **Clear search**: Click X button or click outside

### Technical Implementation

#### Frontend (`Navbar.jsx`)

```javascript
// State management
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [isSearching, setIsSearching] = useState(false);
const [showResults, setShowResults] = useState(false);

// Debounced search (300ms delay)
useEffect(() => {
  const searchUsers = async () => {
    if (searchQuery.trim().length < 2) return;
    
    setIsSearching(true);
    const { data } = await userAPI.search(searchQuery);
    setSearchResults(data);
    setShowResults(true);
    setIsSearching(false);
  };

  const debounceTimer = setTimeout(searchUsers, 300);
  return () => clearTimeout(debounceTimer);
}, [searchQuery]);
```

#### Backend (`userController.js`)

```javascript
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      username: { $regex: q, $options: 'i' } // Case-insensitive
    })
    .select('-passwordHash') // Exclude password
    .limit(20); // Max 20 results
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### API Endpoint

```
GET /api/users/search?q=searchterm
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "user123",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Software developer",
    "profilePictureURL": "https://...",
    "followers": [],
    "following": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## UI States

### 1. Default State
- Search bar with placeholder "Search users..."
- Search icon on left
- No dropdown visible

### 2. Typing State (< 2 characters)
- Input shows typed text
- No dropdown
- Clear (X) button appears

### 3. Searching State
- Dropdown appears
- Loading spinner
- "Searching..." text

### 4. Results State
- Dropdown shows user list
- Each result shows:
  - Profile picture (or initial)
  - Username
  - Bio (if available)
  - User icon on right
- Hover effect on results

### 5. No Results State
- Dropdown shows empty state
- User icon (gray)
- "No users found" message
- Suggestion text

### 6. Closed State
- Click outside or on result
- Dropdown disappears
- Search query cleared (on result click)

## Styling

### Desktop
- Max width: 600px
- Full rounded corners
- Smooth transitions
- Shadow on dropdown

### Mobile
- Full width (minus logo/buttons)
- Compact padding
- Touch-friendly results
- Scrollable dropdown

## Performance Optimizations

### 1. Debouncing
```javascript
// Wait 300ms after user stops typing
const debounceTimer = setTimeout(searchUsers, 300);
```

### 2. Minimum Characters
```javascript
// Only search if 2+ characters
if (searchQuery.trim().length < 2) return;
```

### 3. Result Limit
```javascript
// Backend limits to 20 results
.limit(20)
```

### 4. Click Outside Handler
```javascript
// Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

## Future Enhancements

### 1. Search Posts (Not Just Users)
```javascript
// Add post search
export const searchPosts = async (req, res) => {
  const { q } = req.query;
  const posts = await Post.find({
    text: { $regex: q, $options: 'i' }
  }).populate('userId').limit(20);
  res.json(posts);
};
```

### 2. Search by Hashtags
```javascript
// Search posts with hashtags
const posts = await Post.find({
  text: { $regex: `#${q}`, $options: 'i' }
});
```

### 3. Recent Searches
```javascript
// Store in localStorage
const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
```

### 4. Search Filters
```javascript
// Filter by: Users, Posts, Hashtags
const [searchType, setSearchType] = useState('users');
```

### 5. Keyboard Navigation
```javascript
// Arrow keys to navigate results
// Enter to select
// Escape to close
```

### 6. Search History
```javascript
// Show previous searches when clicking search bar
const [searchHistory, setSearchHistory] = useState([]);
```

## Testing

### Manual Testing

1. **Basic Search**
   - Type "john" → Should show users with "john" in username
   - Type "JOHN" → Should work (case-insensitive)

2. **Debouncing**
   - Type quickly → Should only search after 300ms pause
   - Check network tab → Should see fewer API calls

3. **Navigation**
   - Click user result → Should go to profile
   - Search should clear after clicking

4. **Edge Cases**
   - Type 1 character → No search
   - Type special characters → Should handle gracefully
   - No results → Should show empty state

5. **Mobile**
   - Test on small screen
   - Dropdown should be full width
   - Results should be touch-friendly

### API Testing

```bash
# Test search endpoint
curl -X GET "http://localhost:5000/api/users/search?q=john" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Issue: Search not working
**Check:**
- Backend is running
- User is authenticated (token exists)
- Network tab shows API calls
- Console for errors

### Issue: Dropdown not appearing
**Check:**
- `showResults` state is true
- `searchResults` has data
- CSS z-index is high enough
- No parent overflow:hidden

### Issue: Too many API calls
**Check:**
- Debounce is working (300ms)
- Minimum character check (2+)
- No infinite loops in useEffect

### Issue: Results not clickable
**Check:**
- Link component is used
- onClick handler is attached
- No overlapping elements

## Code Location

```
frontend/
  src/
    components/
      Navbar.jsx          # Search implementation
    services/
      api.js              # API calls

backend/
  src/
    controllers/
      userController.js   # Search logic
    routes/
      userRoutes.js       # Search endpoint
```

---

**Search is now fully functional!** 🎉

Try it out:
1. Start your dev server
2. Type in the search bar
3. See real-time results
4. Click to visit profiles
