from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(booksList)
class booksListAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'publisher', 'publish_date', 'pages', 'isAvailable', 'thumbnail', 'language')
    
@admin.register(libraryImage)
class libraryImageAdmin(admin.ModelAdmin):
    list_display = ('image',)
    
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'role',  'userUID', 'email', 'first_name', 'last_name', 'country', 'state', 'city', 'pincode', 'address1', 'address2', 'gender', 'cover_pic_url', 'profile_pic_url', 'is_active', 'is_staff', 'is_superuser')
    
@admin.register(userRating)
class userRatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'ratingMessage', 'rating')
    
    
@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = ('token',)
    
@admin.register(CSRFToken)
class CSRFTokenAdmin(admin.ModelAdmin):
    list_display = ('csrf_token',)
    
    
@admin.register(BookBorrow)
class BookBorrowAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'requested_time', 'return_date', 'status', 'isReturned')
    

@admin.register(UserSavedBooks)
class UserSavedBooksAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'book', 'userUID', 'isSaved')

@admin.register(ActivityLog)
class RegisterActivityLog(admin.ModelAdmin):
    list_display = ('timestamp', 'user', 'action')
    
    
    
class NotificationInline(admin.TabularInline):
    model = Notification
    extra = 0

@admin.register(NotificationGroup)
class NotificationGroupAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'created_at')
    search_fields = ('user__username', 'name')
    inlines = [NotificationInline]

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('group', 'notification_from', 'message', 'is_read', 'created_at')
    search_fields = ('group__name', 'message')

@admin.register(MostPopularBooks)
class MostPopularBooksAdmin(admin.ModelAdmin):
    list_display = ('book', 'count')