import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import bookImage from '../assets/book.jpg';
import { Form, Button } from 'react-bootstrap';
import { FaBook } from 'react-icons/fa'; 


const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/books/');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    
    <>
    <div className="heading-container d-flex align-items-center">
      <h1 className="heading-text ">BookBuzz<FaBook className="mr-2" /></h1>
      <Form className="d-flex flex-grow-1 ">
          <Form.Control
              type="search"
              placeholder="search for a book"
              className="me-2 "
              aria-label="Search"
          />
          <Button variant="outline-success">Search</Button>
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
            />
            <div className="card-body">
              <h5 className="card-title">{book.book_name}</h5>
              <p className="card-text">Author: {book.book_author}</p>
              <p className="card-text">Published Year: {book.published_year}</p>
            </div>
        </div>
        ))}
    </div>
       
       <h6 className="add-book-heading">Add a Book</h6>
    <div className="add-book-container">
        <input type="text" placeholder="Book Name" required className="input-field" />
        <input type="text" placeholder="Book Author" required className="input-field" />
        <input type="file" required className="input-field" />
        <input type="text" placeholder="Description" required className="input-field" />
        <button type="submit" className="submit-button">
          SEND 
        </button>
    </div>

    <div >
        <h3 className="add-book-heading">About</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>
      <hr></hr>
    </>
    
  );
};

export default Home;

