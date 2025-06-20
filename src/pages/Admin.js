// src/pages/Admin.js
import React, { useEffect, useState } from "react";
import { database, storage } from "../firebaseConfig";
import { ref as dbRef, onValue, set, remove } from "firebase/database";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './Admin.css';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [categories, setCategories] = useState({});
  const [books, setBooks] = useState([]);
  const [previewCoverImage, setPreviewCoverImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  const [pdfUploadProgress, setPdfUploadProgress] = useState(0);

  useEffect(() => {
    const catRef = dbRef(database, 'Categories/');
    onValue(catRef, snapshot => {
      const data = snapshot.val();
      if (data) setCategories(data);
    });

    const booksRef = dbRef(database, 'Books/');
    onValue(booksRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const loadedBooks = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setBooks(loadedBooks);
      }
    });
  }, []);

  const handleFileChange = (setter, previewSetter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!title || !category || !description) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const timestamp = Date.now();
      let coverPromise = Promise.resolve(null);
      let pdfPromise = Promise.resolve(null);

      if (coverImage) {
        setMessage("Uploading cover...");
        const coverRef = storageRef(storage, `covers/${timestamp}_${coverImage.name}`);
        const uploadTask = uploadBytesResumable(coverRef, coverImage);
        coverPromise = new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setCoverUploadProgress(progress);
            },
            (error) => reject(error),
            async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
          );
        });
      }

      if (pdfFile) {
        setMessage("Uploading PDF...");
        const pdfRef = storageRef(storage, `pdfs/${timestamp}_${pdfFile.name}`);
        const uploadTask = uploadBytesResumable(pdfRef, pdfFile);
        pdfPromise = new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setPdfUploadProgress(progress);
            },
            (error) => reject(error),
            async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
          );
        });
      }

      const [coverURL, pdfURL] = await Promise.all([coverPromise, pdfPromise]);
      await saveBookData(coverURL, pdfURL, timestamp);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload Error: " + error.message);
    }
  };

  const saveBookData = async (coverURL, pdfURL, timestamp) => {
    const bookRef = editId ? dbRef(database, `Books/${editId}`) : dbRef(database, `Books/${timestamp}`);
    await set(bookRef, {
      title,
      description,
      categoryId: category,
      coverImage: coverURL,
      pdfUrl: pdfURL,
      isAvailable: true,
      timestamp
    });
    setMessage(editId ? "Book updated!" : "Book uploaded!");
    resetForm();
    setCoverUploadProgress(0);
    setPdfUploadProgress(0);
  };

  const handleEdit = (book) => {
    setTitle(book.title);
    setDescription(book.description || '');
    setCategory(book.categoryId);
    setPreviewCoverImage(book.coverImage);
    setEditId(book.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this book?")) {
      remove(dbRef(database, `Books/${id}`));
      setMessage("Book deleted!");
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setCoverImage(null);
    setPdfFile(null);
    setPreviewCoverImage(null);
    setEditId(null);
  };

  return (
    <div className="admin-dashboard">
      <h2>📚 Admin Dashboard</h2>
      {message && <p className="message">{message}</p>}

      <div className="progress-bar-container">
        <p>Uploading Cover: {Math.round(coverUploadProgress)}%</p>
        <progress value={coverUploadProgress} max="100"></progress>
      </div>

      <div className="progress-bar-container">
        <p>Uploading PDF: {Math.round(pdfUploadProgress)}%</p>
        <progress value={pdfUploadProgress} max="100"></progress>
      </div>

      <div className="form-section">
        <input type="text" placeholder="Book Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Book Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {Object.keys(categories).map((catId) => (
            <option key={catId} value={catId}>{categories[catId].category}</option>
          ))}
        </select>

        <label>Cover Image:</label>
        <input type="file" accept="image/*" onChange={handleFileChange(setCoverImage, setPreviewCoverImage)} />
        {previewCoverImage && <img src={previewCoverImage} alt="Cover Preview" className="preview-img" />}

        <label>PDF File:</label>
        <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} />

        <button onClick={handleUpload}>{editId ? "Update Book" : "Upload Book"}</button>
      </div>

      <h3>📚 Book List</h3>
      <div className="book-list">
        {books.map(book => (
          <div key={book.id} className="book-item">
            <img src={book.coverImage} alt={book.title} className="book-thumb" />
            <p><strong>{book.title}</strong></p>
            <p>Description: {book.description}</p>
            <p>Category: {categories[book.categoryId]?.category || 'Unknown'}</p>
            <div className="action-buttons">
              <button onClick={() => handleEdit(book)}>✏️ Edit</button>
              <button onClick={() => handleDelete(book.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
