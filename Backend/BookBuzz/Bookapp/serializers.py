from rest_framework import serializers
from .models import Book,Review
from django.contrib.auth.models import User

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['book_id', 'book_name', 'book_image','book_author']

class ReviewSerializer(serializers.ModelSerializer):
    reviewed_by = serializers.ReadOnlyField(source='reviewed_by.username')
    class Meta:
        model = Review
        fields = ['book', 'book_review', 'date_of_review', 'reviewed_by']        

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        