Book Review Site- BOOKBUZZ


This is a web application for reviewing books, built using Django REST Framework for the backend API and React for the frontend.

Features:


Users can view a list of books.
Users can view details of a specific book.
Users can submit reviews for books.
Users can sign up and log in to the site.
Users can search for specific books.

Technologies Used:


Backend--
Django REST Framework
Django ORM for database operations
Posgresql database

Frontend--
React
Axios for making HTTP requests to the backend API
React Router for client-side routing

API Endpoints--
GET /api/books/ - Retrieve list of books
GET /api/books/{id}/ - Retrieve details of a specific book
POST /api/books/{id}/reviews/ - Submit a review for a book
POST /api/signup/ - Sign up a new user
POST /api/login/ - Log in an existing user
