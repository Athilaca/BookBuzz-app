import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import bookImage from '../assets/book.jpg';
import { Form, Button } from 'react-bootstrap';
import { FaBook } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import Detail from './Detail';



const Home = () => {
  const navigate=useNavigate()
  const [books, setBooks] = useState([]);
  const [bookData, setBookData] = useState({
    bookName: '',
    bookAuthor: '',
    bookImage: null,
    // description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');



  const fetchBooks = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/books/');
    setBooks(response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

useEffect(() => {
  fetchBooks();
}, []);


  const handleInputChange = (e) => {
    setBookData({
      ...bookData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setBookData({
      ...bookData,
      bookImage: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const formData = new FormData();
    formData.append('book_name', bookData.bookName);
    formData.append('book_author', bookData.bookAuthor);
    // formData.append('description', bookData.description);
    formData.append('book_image', bookData.bookImage);

    const response = await axios.post('http://127.0.0.1:8000/books/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Clear form fields after successful submission
    setBookData({
      bookName: '',
      bookAuthor: '',
      bookImage: null,
      // description: ''
    });
    setErrorMessage('');
    setSuccessMessage('');
   

    console.log('Book successfully created:', response.data);
    setSuccessMessage(response.data);


    // Fetch updated list of books
    fetchBooks();
  } catch (error) {
    console.error('Error creating book:', error.response.data);
    setErrorMessage(error.response.data)
  }
};

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/books/search/?name=${searchTerm}`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const handleInputsearch = (e) => {
  setSearchTerm(e.target.value); 
};

const handleDetailClick =(bookId) => {
    navigate(`/detail/${bookId}`);
}
  

  return (
    
    <>
    <div className="heading-container d-flex align-items-center">
      <h1 className="heading-text ">BookBuzz<FaBook className="mr-2" /></h1>
      <Form className="d-flex flex-grow-1 " onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <Form.Control
              type="search"
              placeholder="search for a book"
              value={searchTerm}
              onChange={handleInputsearch}
              className="me-2 "
              aria-label="Search"
          />
          <Button variant="outline-success" type="submit">Search</Button>
      </Form>
      <h6 className='ms-5'>Login</h6>
    </div>
        <img  className="bookimg"src={bookImage} alt="Architecture"/>
    <div className="card-container">
        {books.map((book, index) => (
        <div className="card" key={index}>
        <img
          src={`http://127.0.0.1:8000${book.book_image}`}
          className="card-img-top"
          alt=""
          onClick={() => handleDetailClick(book.book_id)}/>
         
            <div className="card-body">
              <h5 className="card-title">{book.book_name}</h5>
              <h6 className="card-text">Author : {book.book_author}</h6>
             
            </div>
        </div>
        ))}
    </div>
       
       <h6 className="add-book-heading">Add a Book</h6>
    <div className="add-book-container">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Book Name" required className="input-field" name="bookName" value={bookData.bookName} onChange={handleInputChange}/>
        <input type="text" placeholder="Book Author" required className="input-field" name="bookAuthor" value={bookData.bookAuthor} onChange={handleInputChange} />
        <input type="file" required className="input-field" name="bookImage" onChange={handleImageChange}/>
        {/* <input type="text" placeholder="Description" required className="input-field" /> */}

        {successMessage && <p style={{ color: 'green' }}>{successMessage.message}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage.message}</p>}
        <button type="submit" className="submit-button">
         SEND 
        </button>
        
      </form>
      
    </div>

    <div >
        <h3 className="add-book-heading">About</h3>
        <p className='m-3'>Welcome to BookBuzz, your go-to destination for discovering, discussing, and sharing your love for books. At BookBuzz,
           we believe in the power of literature to inspire, enlighten, and connect people from all walks of life.
           Whether you're a seasoned bibliophile or just starting your reading journey, BookBuzz is here to enrich your literary experience by sharing the reviews.
           BookBuzz is not just a review site; it's a place for meaningful conversations about books. Engage with fellow readers, share your thoughts, and discover new perspectives.</p>
    </div>
      <hr></hr>
    </>
    
  );
};

export default Home;

