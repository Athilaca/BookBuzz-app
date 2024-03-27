import React, { useState, useEffect } from 'react';
import './Details.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';

const Detail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [comment, setComment] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/books/${bookId}/`);
        console.log(response.data);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [bookId]);

  function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

  //   useEffect(() => {
  //   fetchCsrfToken();
  // }, []);

  // const fetchCsrfToken = async () => {
  //   try {
  //     const response = await axios.get('http://127.0.0.1:8000/csrf_cookie/');
  //     setCsrfToken(response.data.csrfToken);
  //   } catch (error) {
  //     console.error('Failed to fetch CSRF token:', error);
  //   }
  // };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.post(`http://127.0.0.1:8000/books/${bookId}/reviews/`, { comment }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      console.log('Review submitted successfully:', response.data);
      // Add any success handling logic here
    } catch (error) {
      console.error('Error submitting review:', error);
      // Add error handling logic here
    }

  
  };

  return (
    <>
      <div className="container">
        <div className="row">

          <div className='row'>
            <div className="col-md-3">
              <img src={`http://127.0.0.1:8000${book?.book.book_image}`} alt="Book" className="book-image" />
            </div>
            <div className="col-md-6">
              <h2>Book: {book?.book.book_name}</h2>
              <h6>Author: {book?.book.book_author}</h6>
              <br></br>
              <p>Description Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque metus nec fermentum consectetur.
                Description Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque metus nec fermentum consectetur.
              </p>
            </div>
          </div>

          <div>
            {book && (
              <div className="review-details">
                <h3 className='review-title'>Reviews</h3>
                <div className="review-scroll">
                  <div className="review-item">
                     <ul className="review-list">
                    {book.reviews.map((review, index) => (
                      <li key={index}>
                        <p> <FaUser className="me-2" />User: {review.reviewed_by}</p>
                        <p>Date: {review.date_of_review}</p>
                        <p>Review: {review.book_review}</p>
                        <hr />
                      </li>
                    ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label htmlFor="comment">Comment review:</label>
              <textarea id="comment" name="comment" value={comment} onChange={handleCommentChange}></textarea>
            </div>
            <button className="mb-5" type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Detail;
