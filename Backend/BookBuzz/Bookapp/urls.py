from django.urls import path
from django.conf import settings

from .views import *

urlpatterns = [
    path('books/create/', create_book, name='create_book'),
    path('books/<book_id>/reviews/', create_review, name='create_review'),
    path('books/', books, name='books'),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('books/<int:pk>/', book_detail, name='book_detail'),
    path('books/search/', search_books, name='search_books'),
]

            