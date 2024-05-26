from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.dispatch import receiver
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from datetime import datetime, timedelta, timezone
from django.utils import timezone
import hashlib
from django.core.mail import send_mail
from django.conf import settings
from .utils import uidGen
import random
from django.db.models.signals import post_save


class booksList(models.Model):
    id = models.BigAutoField(primary_key=True)
    bookID = models.CharField(max_length=150, blank=True, null=False, unique=True)
    title = models.CharField(max_length=150, blank=False, null=False)
    author = models.CharField(max_length=150, blank=False, null=False)
    publisher = models.CharField(max_length=150, blank=False, null=False)
    publish_date = models.DateField(blank=False, null=False)
    pages = models.IntegerField(blank=False, null=False)
    isAvailable = models.BooleanField(blank=True, null=True, editable=True)
    thumbnail = models.CharField(max_length=150, blank=False, null=False)
    language = models.CharField(max_length=150, blank=False, null=False)
    quantity = models.IntegerField(blank=False, null=False, default=0)
    genre = models.CharField(max_length=150, blank=False, null=False)
    ISBN = models.CharField(max_length=150, blank=False, null=False)
    website = models.CharField(max_length=150, blank=True, null=True)
    description = models.CharField(max_length=1000, blank=True, null=True)
    label_url = models.CharField(max_length=4000, blank=True, null=True)
    created_at = models.DateTimeField(blank=False, null=False, editable=True, default=timezone.now)
    
    def save(self, *args, **kwargs):
        if not self.pk: 
            super().save(*args, **kwargs)
                    
        if not self.bookID:
            if 10 <= self.id < 100:
                self.bookID = f'000{self.id}'
            elif 100 <= self.id < 1000:
                self.bookID = f'00{self.id}'
            elif self.id >= 1000:
                self.bookID = f'0{self.id}'
            else:
                self.bookID = f'0000{self.id}'
        
        if self.quantity == 0:
            self.isAvailable = False
        else:
            self.isAvailable = True

        MostPopularBooks.objects.get_or_create(book=get_object_or_404(booksList, id=self.id))

        super().save(*args, **kwargs)
        
        

class libraryImage(models.Model):
    id = models.BigAutoField(primary_key = True)
    image = models.CharField(max_length= 150, blank = False, null = False)
        

class CustomUser(AbstractUser):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    ROLE_CHOICES = [
        ('Member', 'Member'),
        ('Admin', 'Admin'),
        ('Librarian', 'Librarian'),
        ('Staff', 'Staff'),
        ('Owner', 'Owner'),
        ('VIP', 'VIP'),
    ]
    TYPE_CHOICES = [
        ('classic', 'classic'),
        ('google', 'google'),
    ]

    default_profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, editable=False, null=True,)
    custom_profile_pic = models.ImageField(blank=True, null=True, editable=False, upload_to='profile_pics/')
    profile_pic_url = models.CharField(max_length=500, blank=True, null=True, editable=False)
    
    cover_pic = models.ImageField(upload_to='cover_pics/', blank=True, null=True, editable=True)
    cover_pic_url = models.CharField(max_length=500, blank=True, null=True, editable=True)
    
    country = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    pincode = models.CharField(max_length=6, blank=True, null=True)
    address1 = models.CharField(max_length=100, blank=True, null=True)
    address2 = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=1, null=True, choices=GENDER_CHOICES, default="O")
    userUID = models.CharField(max_length=100, blank=True, null=True, editable=False, unique=True)
    staffID = models.IntegerField(blank=True, null=True, editable=False)
    role = models.CharField(max_length=50, blank=False, null=False, editable=True, default="Member", choices=ROLE_CHOICES)
    account_type = models.CharField(max_length=50, blank=False, null=False, editable=True, default="classic", choices=TYPE_CHOICES)
    third_party_jwt = models.CharField(max_length=3000, blank=True, null=True, editable=True, default="")
    session_code = models.CharField(max_length=3000, blank=True, null=True, editable=True, default="")
    
    def save(self, *args, **kwargs):
        if not self.userUID:
            self.userUID = uidGen(self.username)
        
        if not self.staffID and (self.is_superuser or self.is_staff):
            self.staffID = ''.join(random.choices('0123456789', k=5))
        
        if self.is_superuser:
            self.role = "Admin"
        
        if self.account_type == 'classic':
            if not self.custom_profile_pic:
                if self.gender == "O":
                    self.default_profile_pic = 'profile_pics/d6a9c4f17e8b0d2a1c3f9.jpg'
                elif self.gender == "M":
                    self.default_profile_pic = 'profile_pics/mb31e7d08c2a9f5b384d7.jpeg'
                elif self.gender == "F":
                    self.default_profile_pic = 'profile_pics/f8742f95a8b16c3e975a4.jpeg'
                self.profile_pic_url = f"http://127.0.0.1:8000{self.default_profile_pic.url}"
            else:
                self.default_profile_pic = None
                
        if not self.cover_pic:
            self.cover_pic = 'cover_pics/ZxYb12xXnL_987AaB_456dFgH_789jKlM_123nBvC_876mNqW.jpeg'
            self.cover_pic_url = f"http://127.0.0.1:8000{self.cover_pic.url}"

        super().save(*args, **kwargs)
        
    
class userRating(models.Model):
    id = models.BigAutoField(primary_key = True)
    user = models.ForeignKey(CustomUser, on_delete = models.CASCADE, blank = True, null = True)
    ratingMessage = models.CharField(max_length= 1000, blank = False, null = False)
    rating = models.IntegerField(blank = False, null = False)
    
    

class Token(models.Model):
    id = models.BigAutoField(primary_key = True)
    token = models.CharField(max_length=100, blank=True, null=True, editable=True)
    created_at = models.DateTimeField(blank=True, null=True, editable=True, default=timezone.now)
    expired_at = models.DateTimeField(blank=True, null=True, editable=True, default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.pk: 
            self.expired_at = self.created_at + timedelta(seconds=10)
        elif self.created_at != self.expired_at:  
            self.expired_at = self.created_at + timedelta(seconds=10)

        super().save(*args, **kwargs)
            


class CSRFToken(models.Model):
    id = models.BigAutoField(primary_key=True)
    csrf_token = models.CharField(max_length=100, blank=True, null=True, editable=True)
    created_at = models.DateTimeField(blank=True, null=True, editable=True, default=timezone.now)
    expired_at = models.DateTimeField(blank=True, null=True, editable=True, default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.pk: 
            self.expired_at = self.created_at + timedelta(seconds=10)
        elif self.created_at != self.expired_at:  
            self.expired_at = self.created_at + timedelta(seconds=10)

        super().save(*args, **kwargs)



class BookBorrow(models.Model):
    DAY_CHOICES = [
        ('5', '5'),
        ('7', '7'),
        ('10', '10'),
        ('15', '15'),
        ('20', '20'),
        ('30', '30'),
    ]

    RESPONSE_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Borrowed', 'Borrowed'),
        ('Overdue', 'Overdue'),
        ('Cancelled', 'Cancelled'),
        ('Returned', 'Returned'),
    ]

    id = models.BigAutoField(primary_key=True)
    borrow_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, blank=True, null=True)
    book = models.ForeignKey('booksList', on_delete=models.CASCADE, blank=True, null=True)
    borrowed_for = models.CharField(max_length=2, blank=False, null=False, choices=DAY_CHOICES, default='5')
    requested_time = models.DateTimeField(default=timezone.now, editable=False)
    accepted_time = models.DateTimeField(blank=True, null=True)
    taken_time = models.DateTimeField(blank=True, null=True)
    returned_time = models.DateTimeField(blank=True, null=True)
    return_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=100, blank=False, null=False, choices=RESPONSE_CHOICES, default='Pending')
    message = models.CharField(max_length=250, blank=True, null=True)
    timeUp = models.BooleanField(default=False, editable=False)
    isReturned = models.BooleanField(default=False, editable=False)
    isEmailSend = models.BooleanField(default=False, editable=False)
    request_handled_by = models.ForeignKey('CustomUser', on_delete=models.CASCADE, blank=True, null=True, related_name='request_handled_by')
    late_fine_amount = models.IntegerField(blank=True, null=True, default=0)

    _is_saving = False

    def save(self, *args, **kwargs):
        if self._is_saving:
            return
        self._is_saving = True

        if not self.borrow_id:
            self.borrow_id = hashlib.sha256((self.user.username + self.requested_time.strftime('%Y-%m-%d %H:%M:%S')).encode()).hexdigest()
        if self.status == 'Approved':
            self.book.quantity -= 1
            self.book.save(update_fields=['quantity'])
        super().save(*args, **kwargs)

        self.update_time_up()
        self.calculate_late_fine()

        self._is_saving = False

    def update_time_up(self):
        if self.return_date and timezone.now() >= self.return_date:
            self.timeUp = True
            self.save(update_fields=['timeUp'])

    def send_email(self, subject, message):
        send_mail(subject, message, settings.EMAIL_HOST_USER, [self.user.email], fail_silently=False)

    def send_notification(self, message):
        group, created = NotificationGroup.objects.get_or_create(user=self.user, name=self.user.username)
        Notification.objects.create(group=group, message=message, notification_from=get_object_or_404('CustomUser', userUID="los45-decda-f075f-db7e7-4dbaa-42651-b5eca"))


    def send_email_if_needed(self):
        if self.timeUp and not self.isReturned and not self.isEmailSend:
            self.send_email(
                subject='Library of Congress - Your book borrow period is over',
                message='Your book borrow period is over. Please return the book.'
            )
            self.send_notification('Your book borrow period is over. Please return the book.')
            self.isEmailSend = True
        elif self.return_date and not self.isReturned:
            days_left = (self.return_date - timezone.now()).days
            if days_left <= 3 and not self.isEmailSend:
                self.send_email(
                    subject='Library of Congress - Your book borrow period is about to expire',
                    message=f'Your book borrow period is about to expire. You have {days_left} days left to return the book.'
                )
                self.send_notification(f'Your book borrow period is about to expire. You have {days_left} days left to return the book.')
                self.isEmailSend = True
        self.save(update_fields=['isEmailSend'])

    def clear_isEmailSend(self):
        if self.isEmailSend:
            self.isEmailSend = False
            self.save(update_fields=['isEmailSend'])

    def calculate_late_fine(self):
        if self.timeUp and not self.isReturned:
            day_count = (timezone.now() - self.return_date).days
            self.late_fine_amount = day_count * 5
        else:
            self.late_fine_amount = 0
        self.save(update_fields=['late_fine_amount'])

@receiver(post_save, sender=BookBorrow)
def handle_post_save(sender, instance, **kwargs):
    if not instance._is_saving:  
        instance.send_email_if_needed()


class UserSavedBooks(models.Model):
    id = models.BigAutoField(primary_key=True, auto_created=True, editable=False)
    userUID = models.CharField(max_length=100, blank=True, null=False)
    username = models.CharField(max_length=100, blank=False, null=False)
    email = models.EmailField(max_length=254, blank=False, null=False)
    book = models.ForeignKey(booksList, on_delete=models.CASCADE, blank=True)
    isSaved = models.BooleanField(default=True, blank=True, editable=True)
    saved_time = models.DateTimeField(blank=True, null=True, editable=True, default=timezone.now)
    
    def save(self, *args, **kwargs):
        if not self.userUID:
            self.userUID = CustomUser.objects.filter(email=self.email).first().userUID            
        super().save(*args, **kwargs)
        

class ActivityLog(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now, editable=False)
    action = models.CharField(max_length=100, blank=False, null=False)
    
    
    
class NotificationGroup(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notification_groups')
    name = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.user.username 
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Notification(models.Model):
    group = models.ForeignKey(NotificationGroup, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    subject = models.CharField(max_length=100, blank=True, null=True)
    notification_from = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notification_from', blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message[:50]
    
    

class MostPopularBooks(models.Model):
    book = models.ForeignKey(booksList, on_delete=models.CASCADE, blank=True)
    count = models.IntegerField(default=0)
    