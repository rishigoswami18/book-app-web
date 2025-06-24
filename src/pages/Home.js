import React, { useEffect, useState } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import StarBackground from "../components/StarsBackground";
import './Home.css';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch Books
    const booksRef = ref(database, 'Books/');
    onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedBooks = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setBooks(loadedBooks);
      }
    });

    // Fetch Categories
    const categoriesRef = ref(database, 'Categories/');
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCategories(data);
      }
    });
  }, []);

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "Unknown Category";
    return categories[categoryId]?.category || `Unknown (${categoryId})`;
  };

  // Function to get valid cover image or fallback
  const getCoverImage = (book) => {
    return book.coverImage && book.coverImage.trim() !== ""
      ? book.coverImage
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=random`;
  };

  // Filter books based on category and search term
  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.categoryId === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="home-container">
      <StarBackground />
      <h1>Dashboard</h1>
      <div className="content-overlay">
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
    <Link to="/signin">
      <button className="signin-btn">Admin Sign In</button>
    </Link>
    <Link to="https://drive.google.com/file/d/1WaeZpPJs7JNPpCgJqXXy-RzRSBSibi8p/view?fbclid=PAZXh0bgNhZW0CMTEAAadBxc1PeI5hGSMj5hdyV9klnskoDjweqBPX9XRIonrHLvkzahVkg2vRIRrPUg_aem_P-kcALCwxLKFOxmAvueNvw">
      <button className="signin-btn">Download App</button>
    </Link>
  </div>


        

        <h2>Book Categories</h2>
        <div className="category-list">
          <button
            className={selectedCategory === 'All' ? "selected" : ""}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {Object.keys(categories).map((catId) => (
            <button
              key={catId}
              className={selectedCategory === catId ? "selected" : ""}
              onClick={() => setSelectedCategory(catId)}
            >
              {categories[catId].category}
            </button>
          ))}
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search books by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h2>{searchTerm ? "Search Results" : "Trending Books"}</h2>
        <div className="book-list">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <img
                  src={getCoverImage(book)}
                  alt={book.title}
                  className="book-cover"
                />
                <h3>{book.title}</h3>
                <p>Category: {getCategoryName(book.categoryId)}</p>
                <Link to={`/book/${book.id}`}>
                  <button className="action-btn">
                    {book.isAvailable ? "Borrow" : "Read"}
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p>No books found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
