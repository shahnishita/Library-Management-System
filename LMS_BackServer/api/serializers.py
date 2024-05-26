from rest_framework import serializers
from .models import *

class bookSerializer(serializers.ModelSerializer):
    class Meta:
        model = booksList
        fields = ['title', 'bookID', 'author', 'publisher', 'publish_date', 'pages', 'isAvailable', 'thumbnail', 'language', 'genre', 'ISBN', 'website', 'description', 'quantity', 'created_at']
        

class libraryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = libraryImage
        fields = ['image']
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'userUID', 'staffID',  'email', 'first_name', 'last_name', 'country', 'state', 'city', 'pincode', 'address1', 'address2', 'gender', 'cover_pic_url', 'profile_pic_url', 'role', 'account_type' ]
        
        
class userRatingSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = userRating
        fields = ['user', 'ratingMessage', 'rating']
        

class UserSavedBooksSerializer(serializers.ModelSerializer):
    book = bookSerializer()  
    class Meta:
        model = UserSavedBooks
        fields = ['username', 'email', 'book', 'userUID', 'isSaved', 'saved_time']

class bookBorrowSerializer(serializers.ModelSerializer):
    book = bookSerializer()
    user = CustomUserSerializer()
    request_handled_by = CustomUserSerializer()

    class Meta:
        model = BookBorrow
        fields = [
            'book', 'user', 'requested_time', 'return_date', 'status', 
            'isReturned', 'accepted_time', 'late_fine_amount', 'timeUp', 
            'borrow_id', 'message', 'borrowed_for', 'isEmailSend', 
            'request_handled_by', 'taken_time', 'returned_time'
        ]
        
        
class RegisterActivityLogSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = ActivityLog
        fields = ['timestamp', 'user', 'action']
        

class NotificationSerializer(serializers.ModelSerializer):
    notification_from = CustomUserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'group', 'message', 'subject', 'notification_from', 'is_read', 'created_at']


class NotificationGroupSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    notifications = serializers.SerializerMethodField()

    class Meta:
        model = NotificationGroup
        fields = ['id', 'user', 'name', 'created_at', 'notifications']

    def get_notifications(self, obj):
        notifications = obj.notifications.order_by('-created_at')[:20]
        return NotificationSerializer(notifications, many=True).data


class MostPopularBooksSerializer(serializers.ModelSerializer):
    book = bookSerializer()
    

    class Meta:
        model = MostPopularBooks
        fields = ['book', 'count']