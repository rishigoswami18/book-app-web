import React, { useEffect, useState } from "react";
import { database } from "../firebaseConfig";
import { ref, get } from "firebase/database";
import { useParams } from "react-router-dom";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const bookRef = ref(database, `Books/${id}`);
    get(bookRef).then((snapshot) => {
      if (snapshot.exists()) {
        console.log("Book data: ", snapshot.val());
        setBook(snapshot.val());
      } else {
        console.log("No data found");
      }
    }).catch((error) => {
      console.error("Error fetching book:", error);
    });
  }, [id]);

  return (
    <div>
      {book ? (
        <>
          <h1>{book.title}</h1>
          <p>{book.description}</p>
          {book.url ? (  // this line changed from book.pdfUrl to book.url
            <iframe
              src={book.url}
              width="100%"
              height="600px"
              title="PDF Viewer"
            ></iframe>
          ) : (
            <p>No PDF URL available in this book.</p>
          )}
        </>
      ) : (
        <p>Loading book details...</p>
      )}
    </div>
  );
};

export default BookDetail;
