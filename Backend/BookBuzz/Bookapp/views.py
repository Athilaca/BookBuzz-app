from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from .serializers import BookSerializer
from .serializers import UserSerializer,ReviewSerializer
from .models import Book
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login 
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.utils import timezone
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt


@api_view(['GET'])
def books(request):
    if request.method == 'GET':
        books = Book.objects.all()
        books_serializer = BookSerializer(books, many=True)
        return Response(books_serializer.data)

@api_view(['POST'])
def create_book(request):
    if request.method == 'POST':
        # Create the book with the modified data
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Book created successfully",
                "book": serializer.data  # Return the serialized book object
            }, status=201)
        return Response(serializer.errors, status=400)
       


@api_view(['POST'])   
def signup(request):
    if request.method == 'POST':
        email = request.data.get('email')
        username = request.data.get('username')

        if User.objects.filter(email=email).exists():
            return Response({'message': 'A user with this email already exists'}, status=400)
        
        if User.objects.filter(username=username).exists():
            return Response({'message': 'A user with this username already exists'}, status=400)

        
        # Hash the password
        request.data['password'] = make_password(request.data['password'])
        
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'})
        return Response(serializer.errors, status=400)
    return Response({'message': 'Method not allowed'}, status=405)


@csrf_exempt
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        username = request.data.get('username', None)
        password = request.data.get('password', None)

        if not username or not password:
            return Response({'message': 'Both username and password are required'}, status=400)
        
        user =authenticate(username=username, password=password)
        print(user)
        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful'})
        else:
            # Authentication failed
            return Response({'message': 'Invalid username or password'})
    return Response({'message': 'Method not allowed'}, status=405)


@api_view(['GET'])
def book_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'message': 'Book not found'}, status=404)

    if request.method == 'GET':
        
        book_serializer = BookSerializer(book)

        # Get all reviews related to the book
        reviews = book.reviews.all()

        # Serialize the reviews
        review_serializer = ReviewSerializer(reviews, many=True)

        # Combine book data and reviews data
        response_data = {
            'book': book_serializer.data,
            'reviews': review_serializer.data
        }

        return Response(response_data)

def search_books(request):
    if request.method == 'GET':
        book_name = request.GET.get('name')  # Get the value of 'name' parameter from the query string
        
        if book_name:
            books = Book.objects.filter(BookName__icontains=book_name)  # Perform case-insensitive partial match search
            serializer = BookSerializer(books, many=True)
            return Response(serializer.data)
        else:
            return Response({'message': 'Please provide a book name to search for'}, status=status.HTTP_400_BAD_REQUEST)  
        

@api_view(['POST'])
def create_review(request, book_id):
    if request.method == 'POST':
        if request.user.is_authenticated:
            # Retrieve the book object
            try:
                book = Book.objects.get(pk=book_id)
            except Book.DoesNotExist:
                return Response({'message': 'Book not found'}, status=404)
            
            # Automatically fill 'reviewed_by' with the current user
            reviewed_by = request.user

            # Create the review with the submitted data
            request.data['book'] = book.pk
            request.data['reviewed_by'] = reviewed_by.id
            request.data['date_of_review'] = timezone.now()
            serializer = ReviewSerializer(data=request.data)
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Review created successfully",
                }, status=201)
            return Response(serializer.errors, status=400)
        else:
            return Response({"error": "Please log in to create a review"}, status=401)              
    