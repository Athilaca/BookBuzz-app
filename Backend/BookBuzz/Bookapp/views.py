from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from .serializers import BookSerializer
from .serializers import UserSerializer,ReviewSerializer
from .models import Book
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login 
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.utils import timezone
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q


@api_view(['GET'])
def books(request):
    if request.method == 'GET':
        books = Book.objects.all()
        books_serializer = BookSerializer(books, many=True)
        return Response(books_serializer.data)

@api_view(['POST'])
def create_book(request):
    if request.method == 'POST':
         
        existing_books = Book.objects.filter(
            book_name=request.data.get('book_name'),
            book_author=request.data.get('book_author')
        )
        if existing_books.exists():
            return Response(
                {"message": "A book with the same name and author already exists."},
                status=400
            )
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
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'message': 'Both username and password are required'}, status=400)
        
        user =authenticate(username=username, password=password)
        print(user)
        if user is not None:
            auth_login(request, user)
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

        reviews = book.reviews.all()

        # Serialize the reviews
        review_serializer = ReviewSerializer(reviews, many=True)

        response_data = {
            'book': book_serializer.data,
            'reviews': review_serializer.data
        }

        return Response(response_data)

@csrf_exempt
@api_view(['GET'])
def search_books(request):
    if request.method == 'GET':
        book_name = request.GET.get('name')  
        
        if book_name:
            books = Book.objects.filter(
                Q(book_name__icontains=book_name) | Q(book_name__startswith=book_name)
            ) # Perform case-insensitive partial match search
            serializer = BookSerializer(books, many=True)
            return Response(serializer.data)
        else:
            return Response({'message': 'Please provide a book name to search for'}, status=status.HTTP_400_BAD_REQUEST)  
        

@api_view(['POST'])
def create_review(request, book_id):
    if request.method == 'POST':
        # if request.user.is_authenticated:
            # Retrieve the book object
            try:
                book = Book.objects.get(pk=book_id)
            except Book.DoesNotExist:
                return Response({'message': 'Book not found'}, status=404)
            
            # Automatically fill 'reviewed_by' with the current user
            reviewed_by = request.user

            # Create the review with the submitted data
            mutable_data = request.data.copy()

            mutable_data['book'] = book.pk
            # mutable_data['reviewed_by'] = reviewed_by.id
            mutable_data['date_of_review'] = timezone.now()
            serializer = ReviewSerializer(data=mutable_data)
            
            if serializer.is_valid():
                serializer.save(reviewed_by=request.user)
                return Response({
                    "message": "Review created successfully",
                }, status=201)
            return Response(serializer.errors, status=400)
        # else:
        #     return Response({"message": "Please log in to create a review"}, status=401)              
    