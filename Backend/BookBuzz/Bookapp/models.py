from django.db import models
from django.contrib.auth.models import User

# def book_images(instance, filename):
#     return 'images/{}'.format(filename)


class Book(models.Model):
    book_id = models.AutoField(primary_key=True)
    book_name = models.CharField(max_length=100)
    book_image = models.ImageField(upload_to='book_images/', null=True, blank=True)
    book_author=models.CharField(max_length=100)

    
    
    def __str__(self):
        return self.book_name
    
class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    book_review = models.TextField()
    date_of_review = models.DateTimeField()
    reviewed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    
    