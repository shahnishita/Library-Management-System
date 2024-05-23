import os
import uuid
import random
import json
import uuid
import random


from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from dotenv import load_dotenv
from django.template.loader import render_to_string
import jwt
from django.core.serializers import serialize
from django.db.models import Q, Case, When
from django.views.decorators.http import require_http_methods
from rest_framework.generics import ListAPIView

from .serializers import *
from .models import *
from .utils import *

load_dotenv()

GEN_CODE = os.environ.get('TOKEN_GENERATOR_CODE')

def get_csrf_token(request, gen_code):
    if request.method == 'GET' and gen_code == GEN_CODE:
        csrf_token = get_token(request)
        CSRFToken.objects.create(csrf_token=csrf_token)
        return JsonResponse({'csrf_token': csrf_token})
    else:
        return JsonResponse({'message': 'Invalid request'})


def get_random_token(request, gen_code):
    if request.method == 'GET' and gen_code == GEN_CODE:
        token = get_random_string(length=32)
        Token.objects.create(token=token)
        return JsonResponse({'token': token})
    else:
        return JsonResponse({'message': 'Invalid request'})


@csrf_exempt
def books(request):
    if request.method == 'GET':
        if request.GET.get('u'):
            uid = request.GET.get('u')
            user_saved_books = UserSavedBooks.objects.filter(userUID=uid)
            user_borrowed_books = BookBorrow.objects.filter(user=get_object_or_404(CustomUser, userUID=uid))
            books = booksList.objects.all().order_by('-created_at')
            serializer = bookSerializer(books, many=True)
            data = serializer.data

            for book in data:
                book_id = book.get('bookID')
                saved_book = user_saved_books.filter(book__bookID=book_id, isSaved=True).first()
                borrowed_book = user_borrowed_books.filter(book__bookID=book_id).first()
                book['is_saved'] = saved_book is not None
                book['borrow_status'] = borrowed_book.status if borrowed_book else False

            # Sorting: saved books first, then the rest ordered by -created_at
            sorted_data = sorted(data, key=lambda x: (not x['is_saved'], -datetime.strptime(x['created_at'], "%Y-%m-%dT%H:%M:%S.%f%z").timestamp()))

            return JsonResponse(sorted_data, safe=False)
        else:
            books = booksList.objects.all().order_by('-created_at')
            serializer = bookSerializer(books, many=True)
            return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)


@require_http_methods(["GET"])
def LibraryImage(request):
    if request.method == 'GET':
        images = libraryImage.objects.all()
        serializer = libraryImageSerializer(images, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)


@require_http_methods(["GET"])
def userRatingView(request):
    if request.method == 'GET':
        ratings = userRating.objects.all()
        serializer = userRatingSerializer(ratings, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)


@require_http_methods(["GET"])
def bookSearch(request):
    if request.method == 'GET':
        author = request.GET.get('a')
        title = str(request.GET.get('t'))
        is_available = request.GET.get('i')

        if not is_available:
            return JsonResponse({'message': 'Parameter "i" is missing'}, status=400)

        exclude_words = ['the', 'a', 'an', 'of', 'in', 'and']
        title_parts = [part for part in title.split() if part.lower() not in exclude_words]
        title_query = Q()
        for part in title_parts:
            title_query |= Q(name__icontains=part)

        if author == 'all':
            author_query = Q()
        elif author:
            author_query = Q(author__icontains=author)
        else:
            author_query = None

        if is_available == 'available':
            find = booksList.objects.filter(title_query, author_query, available=True)
        elif is_available == 'all':
            find = booksList.objects.filter(title_query, author_query)
        else:
            return JsonResponse({'message': 'Invalid value for parameter "i"'}, status=400)

        serializer = bookSerializer(find, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)
    
    
@csrf_exempt
def userSave(request, csrf_token, token):
    if request.method == 'POST':
        print(request.body)
        csrf_token_obj = CSRFToken.objects.filter(csrf_token=csrf_token).first()
        token_obj = Token.objects.filter(token=token).first()
        
        if csrf_token_obj and token_obj:
            csrf_token_obj.delete()
            token_obj.delete()
            action = request.GET.get('a')
            
            if action == 'add':
                data = json.loads(request.body)
                username = data.get('username')
                email = data.get('email')
                bookID = data.get('bookID')
                book = get_object_or_404(booksList, bookID=bookID)
                
                user_saved_book, created = UserSavedBooks.objects.get_or_create(
                    username=username,
                    email=email,
                    book=book,
                    defaults={'isSaved': True}
                )
                
                if not created:
                    user_saved_book.isSaved = True
                    user_saved_book.save()
                    return JsonResponse({'message': 'Book saved successfully'}, status=200)
                else:
                    return JsonResponse({'message': 'Book saved successfully'}, status=200)
            
            elif action == 'remove':
                data = json.loads(request.body)
                username = data.get('username')
                email = data.get('email')
                bookID = data.get('bookID')
                book = get_object_or_404(booksList, bookID=bookID)
                
                UserSavedBooks.objects.filter(username=username, email=email, book=book).update(isSaved=False)
                return JsonResponse({'message': 'Book removed successfully', 'bookID': book.bookID}, status=200)
            
            else:
                return JsonResponse({'message': 'Invalid action parameter'}, status=400)
        
        else:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
    
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)      
        
        
@require_http_methods(["GET"])
def userSaveView(request):
    if 'q' in request.GET:
        username = request.GET.get('q')
        user_borrowed_books = BookBorrow.objects.filter(user__username=username)
        saved_books_queryset = UserSavedBooks.objects.filter(username=username, isSaved=True).order_by('-saved_time')
        serializer = UserSavedBooksSerializer(saved_books_queryset, many=True)

        for book_data in serializer.data:
            book_id = book_data['book']['bookID']
            borrowed_book = user_borrowed_books.filter(book__bookID=book_id).first()
            book_data['borrow_status'] = borrowed_book.status if borrowed_book else False

        return JsonResponse(serializer.data, safe=False, status=200)
    else:
        return JsonResponse({'message': 'Parameter "q" is required'}, status=400)
    
        
@csrf_exempt
def bookBorrow(request, csrf_token, token):
    if request.method == 'POST':
        csrf_token_obj = CSRFToken.objects.filter(csrf_token=csrf_token).first()
        token_obj = Token.objects.filter(token=token).first()
        
        if csrf_token_obj and token_obj:
            csrf_token_obj.delete()
            token_obj.delete()
            
            method = request.GET.get("m")
            if method == "submit":
                data = json.loads(request.body)
                bookID = data.get('bookID')
                userUID = data.get('userUID')
                borrowed_for = data.get('borrowed_for')
                request_message = data.get('request_message')
                
                if BookBorrow.objects.filter(book=get_object_or_404(booksList, bookID=bookID), 
                                              user=get_object_or_404(CustomUser, userUID=userUID), 
                                              status="Pending").exists():
                    return JsonResponse({'message': 'Request already submitted'}, status=200)
                
                book_borrow = BookBorrow.objects.create(book=get_object_or_404(booksList, bookID=bookID), 
                                                         user=get_object_or_404(CustomUser, userUID=userUID), 
                                                         borrowed_for=borrowed_for, 
                                                         message=request_message)
                
                return JsonResponse({'message': 'Book Borrowed request submitted', 'borrow_id': book_borrow.borrow_id}, status=200)
            
            elif method == "cancel":
                data = json.loads(request.body)
                bookID = data.get('bookID')
                userUID = data.get('userUID')
                
                BookBorrow.objects.filter(book=get_object_or_404(booksList, bookID=bookID), 
                                          user=get_object_or_404(CustomUser, userUID=userUID), 
                                          status="Pending").update(status="Cancelled")
                
                return JsonResponse({'message': 'Borrow request successfully canceled'}, status=200)
            
            else:
                return JsonResponse({'message': 'Method not found'}, status=400)
        
        else:
            return JsonResponse({'message': 'Unauthorized request'}, status=401)    
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)

        
@require_http_methods(["GET"])
def userBorrowHistory(request):
    if 'q' in request.GET:
        username = request.GET.get('q')
        status_order = ['Overdue', 'Approved', 'Pending', 'Rejected', 'borrowed', 'Cancelled', 'Returned']
        ordering = Case(*[When(status=status, then=pos) for pos, status in enumerate(status_order)])
        queryset = BookBorrow.objects.filter(user=get_object_or_404(CustomUser, username=username)).order_by(ordering)
        serializer = bookBorrowSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)
    else:
        return JsonResponse({'message': 'Parameter "q" is required'}, status=400)


    
@csrf_exempt
def userPostRating(request, csrf_token, token):
    if request.method == 'POST':
        csrf_token_obj = get_object_or_404(CSRFToken, csrf_token=csrf_token)
        token_obj = get_object_or_404(Token, token=token)
        
        if csrf_token == csrf_token_obj.csrf_token and token_obj:
            data = json.loads(request.body)
            userUID = data.get('userUID')
            ratingMessage = data.get('ratingMessage')
            rating = data.get('rating')
            
            if not ratingMessage:
                return JsonResponse({"message": "Rating message cannot be empty"}, status=400)
            
            user = get_object_or_404(CustomUser, userUID=userUID)
            userRating.objects.create(rating=rating, ratingMessage=ratingMessage, user=user)
            
            csrf_token_obj.delete()
            token_obj.delete()
            
            return JsonResponse({"message": "Rating added successfully", "uid": user.userUID}, status=200)
        else:
            return JsonResponse({"message": "Unauthorized request"}, status=401)
    else:
        return JsonResponse({"message": "Method Not Allowed"}, status=405)
    
    

@csrf_exempt
def LogIn(request, csrf_token, token, w):
    if request.method == 'POST':
        csrf_token_obj = CSRFToken.objects.filter(csrf_token=csrf_token).first()
        token_obj = Token.objects.filter(token=token).first()
        
        if csrf_token_obj and token_obj:
            csrf_token_obj.delete()
            token_obj.delete()
            
            if w == 'google':
                jwt_data = json.loads(request.body)['credential']
                decoded_data = jwt.decode(jwt_data, options={"verify_signature": False})
                user = CustomUser.objects.filter(email=decoded_data['email']).first()
                
                if user:
                    user.last_login = datetime.now()
                    user.session_code = uuid.uuid4().hex
                    user.save()
                    
                    find_reviews = userRating.objects.filter(user=user).values('rating', 'ratingMessage')
                    is_reviewed = find_reviews.exists()
                    reviews = find_reviews.first() if is_reviewed else {}
                    
                    user_data = {
                        'username': user.username,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'email': user.email,
                        'profile_pic': user.profile_pic_url,
                        'cover_pic': user.cover_pic.url,
                        'gender': user.gender,
                        'role': user.role,
                        'is_reviewed': is_reviewed,
                        'reviews': reviews,
                        'uid': user.userUID
                    }
                    
                    encoded_data = jwt.encode(user_data, os.environ.get('JWT_ENCRYPTION_KEY'), algorithm='HS256')
                    return JsonResponse({"status": "success", "message": "Login successful", "session": user.session_code, "data": encoded_data}, status=200)
                else:
                    return JsonResponse({"status": "error", "message": "You are not registered", "subMessage": "Register"}, status=401)
                            
            else:
                data = json.loads(request.body)
                username = data.get("username", "")
                password = data.get("password", "")
                login_time = datetime.now()
                user = None

                if "@" in username:
                    user = CustomUser.objects.filter(email=username).first()
                else:
                    user = CustomUser.objects.filter(username=username).first()
                    
                if user:
                    if user.account_type == "google":
                        return JsonResponse({"status": "errorInfo", "message": "Please login with Google, your account not supported email login"}, status=401)
                    else:
                        User = authenticate(request, username=user, password=password)
                        if User:
                            User.last_login = login_time
                            User.session_code = uuid.uuid4().hex
                            User.save()
                            
                            find_reviews = userRating.objects.filter(user=user).values('rating', 'ratingMessage')
                            is_reviewed = find_reviews.exists()
                            reviews = find_reviews.first() if is_reviewed else {}
                            
                            user_data = {
                                'username': user.username,
                                'first_name': user.first_name,
                                'last_name': user.last_name,
                                'email': user.email,
                                'profile_pic': user.profile_pic_url,
                                'cover_pic': user.cover_pic.url,
                                'gender': user.gender,
                                'role': user.role,
                                'is_reviewed': is_reviewed,
                                'reviews': reviews,
                                'uid': user.userUID
                            }
                            
                            encoded_data = jwt.encode(user_data, os.environ.get('JWT_ENCRYPTION_KEY'), algorithm='HS256')
                            return JsonResponse({"status": "success", "message": "Login successful", "session": User.session_code, "data": encoded_data}, status=200)
                        else:
                            return JsonResponse({"status": "errorInfo", "message": "Wrong username or password", 'subMessage': 'Forget Password'}, status=401)
                else:
                    return JsonResponse({"status": "error", "message": "You are not registered", "subMessage": "Register"}, status=404)
        else:
            return JsonResponse({"status": "error", "message": "Unauthorized request"}, status=403)
    
    else:
        return JsonResponse({"status": "error", "message": "Only POST requests are allowed for login."}, status=405)



@csrf_exempt
def register(request, csrf_token, token, w):
    if request.method == 'POST':
        csrf_token_obj = get_object_or_404(CSRFToken, csrf_token=csrf_token)
        token_obj = get_object_or_404(Token, token=token)
        
        if csrf_token_obj.csrf_token == csrf_token and token_obj:
            csrf_token_obj.delete()
            token_obj.delete()
            
            if w == 'google':
                jwt_data = json.loads(request.body)['credential']
                decoded_data = jwt.decode(jwt_data, options={"verify_signature": False})
                username = (str(decoded_data['name']).replace(" ", "")).lower()
                
                if CustomUser.objects.filter(email=decoded_data['email']).exists():
                    return JsonResponse({"status": "successInfo", "message": "Email already exists", 'subMessage': 'Login'}, status=401)
                elif CustomUser.objects.filter(username=username).exists(): 
                    username = (username + str(random.randint(1000, 9999))).capitalize()
                
                user = CustomUser.objects.create(
                    first_name=decoded_data['given_name'],
                    last_name=decoded_data['family_name'],
                    email=decoded_data['email'],
                    username=username,
                    profile_pic_url=decoded_data['picture'],
                    account_type="google",
                    third_party_jwt=jwt_data
                )
                ActivityLog.objects.create(user=get_object_or_404(CustomUser, userUID=user.userUID), action="Registered by google")
                return JsonResponse({"status": "success", "message": "Registration successful", 'subMessage': 'Login'}, status=201)
            
            else:
                data = json.loads(request.body)
                password = make_password(data['password'])
                
                if CustomUser.objects.filter(email=data['email']).exists():
                    return JsonResponse({"status": "successInfo", "message": "Email already exists", 'subMessage': 'Login'}, status=401)
                elif CustomUser.objects.filter(username=data['username']).exists():
                    return JsonResponse({"status": "errorInfo", "message": "Username not available"}, status=401)
                
                user = CustomUser.objects.create(
                    first_name=data['first_name'],
                    last_name=data['last_name'],
                    gender=data['gender'],
                    email=data['email'],
                    username=data['username'],
                    password=password,
                    account_type="classic"
                )
                ActivityLog.objects.create(user=get_object_or_404(CustomUser, userUID=user.userUID), action="Registered by email")
                return JsonResponse({"status": "success", "message": "Registration successful", 'subMessage': 'Login'}, status=201)
    else:
        return HttpResponseBadRequest("Only POST requests are allowed for registration.")
    


def get_user_info(request, username):
    if request.method == 'GET':
        user = get_object_or_404(CustomUser, username=username)
        
        if user:
            findReviews = userRating.objects.filter(user=user).values('rating', 'ratingMessage')
            
            isReviewed = False
            reviews = {}
            
            if findReviews:
                isReviewed = True
                reviews = findReviews[0]
                
            user_data = {
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'profile_pic': user.profile_pic_url,
                'cover_pic': user.cover_pic_url,
                'gender': user.gender,
                'country': user.country,
                'state': user.state,
                'city': user.city,
                'pincode': user.pincode,
                'address1': user.address1,
                'address2': user.address2,
                'role': user.role,
                'is_reviewed': isReviewed,
                'reviews': reviews,
                'session_code': user.session_code,
                'account_type': user.account_type,
            }
            return JsonResponse(user_data)
        else:
            return JsonResponse({"status": "error", "message": "User not found"}, status=404)
    else:
        return JsonResponse({"status": "error", "message": "Only GET requests are allowed for user info."}, status=405)



@csrf_exempt
def edit_user_profile(request, csrf_token, token):
    if request.method != 'POST':
        return JsonResponse({"message": "Method Not Allowed"}, status=405)

    csrf_token_obj = get_object_or_404(CSRFToken, csrf_token=csrf_token)
    token_obj = get_object_or_404(Token, token=token)
    if not (csrf_token_obj and token_obj):
        return JsonResponse({"message": "Unauthorized request"}, status=401)
    
    csrf_token_obj.delete()
    token_obj.delete()

    data = json.loads(request.body)
    session_code = request.GET.get('q')
    match = get_object_or_404(CustomUser, session_code=session_code)

    profile_fields = ['first_name', 'last_name', 'email', 'city', 'state', 'country',
                      'pincode', 'address1', 'address2', 'gender']
    profile_data = {field: data.get(field) for field in profile_fields}

    profile_pic_data = data.get('profile_pic')
    if profile_pic_data:
        profile_pic_path = save_image(profile_pic_data, match.username, 'profile_pics')
        profile_data['custom_profile_pic'] = profile_pic_path
        profile_data['profile_pic_url'] = f"http://127.0.0.1:8000/{profile_pic_path}"

    cover_pic_data = data.get('cover_pic')
    if cover_pic_data:
        cover_pic_path = save_image(cover_pic_data, match.username, 'cover_pics')
        profile_data['cover_pic'] = cover_pic_path
        profile_data['cover_pic_url'] = f"http://127.0.0.1:8000/{cover_pic_path}"
        
    CustomUser.objects.filter(session_code=session_code).update(**profile_data)
    for user in CustomUser.objects.filter(session_code=session_code):
        for key, value in profile_data.items():
            setattr(user, key, value)
        user.save()    
    return JsonResponse({"message": "Profile updated successfully", "status": "success", "uid": match.userUID}, status=200)


@require_http_methods(["GET"])
def get_user_info_by_uid(request, uid):
    if request.method != 'GET':
        return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)
    
    user = get_object_or_404(CustomUser, userUID=uid)
    find_reviews = userRating.objects.filter(user=user).values('rating', 'ratingMessage')
    
    is_reviewed = False
    reviews = {}
    
    if find_reviews.exists():
        is_reviewed = True
        reviews = find_reviews.first()
        
    user_data = {
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'profile_pic': user.profile_pic_url,
        'cover_pic': user.cover_pic_url,
        'gender': user.gender,
        'role': user.role,
        'is_reviewed': is_reviewed,
        'reviews': reviews,
        'uid': user.userUID
    }
    
    encoded_data = jwt.encode(user_data, os.environ.get('JWT_ENCRYPTION_KEY'), algorithm='HS256')
    return JsonResponse({'data': encoded_data})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def user_notification(request):
    if request.method == 'GET':
        q = request.GET.get('q')
        if q is None:
            return JsonResponse({"error": "Username query parameter 'q' is required"}, status=400)
        
        user = get_object_or_404(CustomUser, username=q)
        
        notifications = NotificationGroup.objects.filter(user=user)
        serialized_data = NotificationGroupSerializer(notifications, many=True)
        
        return JsonResponse(serialized_data.data, safe=False, status=200)
    
    elif request.method == 'POST':
        q = request.GET.get('q')
        if q is None:
            return JsonResponse({"error": "Username query parameter 'q' is required"}, status=400)
        
        user = get_object_or_404(CustomUser, username=q)
        
        if request.GET.get('m') == 'all':
            Notification.objects.filter(group__user=user).update(is_read=True)
            return JsonResponse({"message": "Marked all notifications as read"}, status=200)
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
        

@require_http_methods(["GET"])
def verify_session(request):
    session_code = request.GET.get('q')

    if not session_code:
        return JsonResponse({"status": "error", "message": "Session code is required"}, status=400)

    if CustomUser.objects.filter(session_code=session_code).exists():
        return JsonResponse({"status": "valid"}, status=200)
    else:
        return JsonResponse({"status": "expired", "message": "Invalid session code"}, status=401)


#TODO: AdminActions
#TODO: BookBorrowAdminActions

@require_http_methods(["GET"])
def recentActivity(request):
    if request.method == 'GET':
        log = ActivityLog.objects.all().order_by('-timestamp')[:6]
        serialize = RegisterActivityLogSerializer(log, many=True)
        return JsonResponse(serialize.data, safe=False, status=200)
    
    
@require_http_methods(["GET"])
def get_user_list(request):
    q = request.GET.get('q', None)
    if q:
        users = CustomUser.objects.filter(
            Q(username__icontains=q) | Q(first_name__icontains=q) | Q(last_name__icontains=q)
        )
        serialized_users = CustomUserSerializer(users, many=True)
        return JsonResponse(serialized_users.data, safe=False, status=200)
    else:
        return JsonResponse([], safe=False, status=200)
    

@require_http_methods(["GET"])
def get_staff_by_staffID(request):
    query = request.GET.get('q')
    if not query:
        return JsonResponse({"status": "error", "message": "Missing query parameter 'q'"}, status=400)

    user = CustomUser.objects.filter(Q(staffID__icontains=query)).first()
    serialize = CustomUserSerializer(user)
    if not user:
        return JsonResponse([], status=200, safe=False)
    return JsonResponse(serialize.data, safe=False, status=200)


@require_http_methods(["GET"])
def get_staff_id(request):
    if request.method != 'GET':
        return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)
    if not request.GET.get('q'):
        return JsonResponse([], safe=False, status=200)
    user = get_object_or_404(CustomUser, username=request.GET.get('q'))
    staffID = user.staffID
    return JsonResponse({'staffID': staffID}, safe=False, status=200)


@csrf_exempt
def update_user_role(request, csrf_token, token):
    if request.method == 'POST':
        csrf_token_obj = get_object_or_404(CSRFToken, csrf_token=csrf_token)
        token_obj = get_object_or_404(Token, token=token)
        if csrf_token_obj and token_obj:
            data = json.loads(request.body)
            print(data)
            userUID = data.get('userUID')
            role = data.get('role')
            user = get_object_or_404(CustomUser, userUID=userUID)
            
            if role == 'Member':
                user.is_superuser = False
                user.is_staff = False
            elif role == 'Librarian':
                user.is_superuser = False
                user.is_staff = True
            elif role == 'Admin':
                user.is_superuser = True
                user.is_staff = True
            elif role == 'Staff':
                user.is_superuser = False
                user.is_staff = True
                
            user.role = role
            user.session_code = None
            user.save()
            csrf_token_obj.delete()
            token_obj.delete()
            return JsonResponse({"message": "Role updated successfully", "status": "success", "uid": user.role}, status=200)
        else:
            return JsonResponse({"message": "Unauthorized request"}, status=401)
    else:
        return JsonResponse({"message": "Method Not Allowed"}, status=405)

@require_http_methods(["GET"])
def StaffsInfo(request):
    if request.method == 'GET':
        staffs = CustomUser.objects.filter(role__in=['Admin', 'Librarian', 'Staff', 'Owner']).order_by(
            Case(
                When(role='Owner', then=0),
                When(role='Admin', then=1),
                When(role='Librarian', then=2),
                When(role='Staff', then=3),
            )
        )
        serialize = CustomUserSerializer(staffs, many=True)
        return JsonResponse(serialize.data, safe=False, status=200)
    
def bookBorrowAdmin(request):
    if request.method == 'GET':
        query_param = request.GET.get('q')

        if query_param == 'all':
            book_borrows = BookBorrow.objects.all().order_by('-requested_time')
        else:
            book_borrows = BookBorrow.objects.filter(status=query_param).order_by('-requested_time')

        for book_borrow in book_borrows:
            book_borrow.save()

        serialize = bookBorrowSerializer(book_borrows, many=True)
        return JsonResponse(serialize.data, safe=False, status=200)
    else:
        return JsonResponse({"message": "Method Not Allowed"}, status=405)

@csrf_exempt
def addBook(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        required_fields = ['title', 'author', 'ISBN', 'thumbnail', 'website', 'publisher', 'publishedDate', 'genre', 'language', 'pages', 'description', 'quantity']
        for field in required_fields:
            if field not in data:
                return JsonResponse({"status": "error", "message": f"Missing required field: {field}"}, status=400)
        
        try:
            thumbnail_base64 = data['thumbnail']
            thumbnail_path = save_image(thumbnail_base64, data['title'], 'thumbnails') if thumbnail_base64 else None
        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Failed to save thumbnail: {str(e)}"}, status=500)
        
        thumbnail_url = f"http://localhost:8000/{thumbnail_path}" if thumbnail_path else None
        
        try:
            push = booksList(
                title=data['title'],
                author=data['author'],
                ISBN=data['ISBN'],
                thumbnail=thumbnail_url,
                website=data['website'],
                publisher=data['publisher'],
                publish_date=data['publishedDate'],
                genre=data['genre'],
                language=data['language'],
                pages=data['pages'],
                description=data['description'],
                quantity=data['quantity']
            )

            push.save()
            return JsonResponse({"status": "success", "message": "Book added successfully", "id": push.bookID, "title": push.title}, status=200)
        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Failed to create book: {str(e)}"}, status=500)
    
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def pushLabel(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        label = data['label']
        if label:
            profile_pic_path = save_image(label, "sdf", 'labels')

        return JsonResponse({"message": "success", "id": "014526"}, status=200)


@csrf_exempt
def responseToBorrowRequest(request, csrf_token, token):
    if request.method != 'POST':
        return JsonResponse({"message": "Method Not Allowed", "type": "error"}, status=405)
    
    try:
        csrf_token_obj = CSRFToken.objects.get(csrf_token=csrf_token)
        token_obj = Token.objects.get(token=token)
    except (CSRFToken.DoesNotExist, Token.DoesNotExist):
        csrf_token_obj.delete()  and token_obj.delete()
        return JsonResponse({"message": "Unauthorized", "type": "error"}, status=401)
    
    data = json.loads(request.body)
    borrow_id = data.get('borrow_id')
    status = data.get('status')
    handled_by = data.get('handled_by')
    taken_time = data.get('taken_time')
    returned_time = data.get('returned_time')

    try:
        borrowReq = BookBorrow.objects.get(borrow_id=borrow_id)
    except BookBorrow.DoesNotExist:
        return JsonResponse({"message": "Request not found", "type": "error"}, status=404)

    borrowReq.status = status
    
    if not handled_by:
        borrowReq.request_handled_by = borrowReq.request_handled_by
    else:
        borrowReq.request_handled_by = get_object_or_404(CustomUser, staffID=handled_by)

    if not taken_time:
        borrowReq.taken_time = borrowReq.taken_time
    else:
        borrowReq.taken_time = taken_time

    if not returned_time:
        borrowReq.returned_time = borrowReq.returned_time
    else:
        borrowReq.returned_time = returned_time
    borrowReq.save()
    return JsonResponse({"message": "Process success", "type": "success"}, status=200)


@csrf_exempt
def send_notification(request, csrf_token, token):
    if request.method != 'POST':
        return HttpResponseBadRequest("Only POST requests are allowed for sending notifications.")

    csrf_token_obj = CSRFToken.objects.filter(csrf_token=csrf_token).first()
    if not csrf_token_obj or not Token.objects.filter(token=token).exists():
        return JsonResponse({"type": "error", "message": "Unauthorized request"}, status=401)
    csrf_token_obj.delete()

    try:
        data = json.loads(request.body)
        message = data['message']
        userUID = data['userUID']
        staffID = data['staffID']
        current_hour = data['hour']
        subject = data['subject']
        is_email = data['isEmail']
        is_notification = data['isNotification']
        
        if not message:
            return JsonResponse({"type": "error", "message": "Message cannot be empty"}, status=200)
    except (json.JSONDecodeError, KeyError) as e:
        return JsonResponse({"type": "error", "message": f"Invalid data: {str(e)}"}, status=400)

    staff = CustomUser.objects.filter(staffID=staffID).first()
    if not staff:
        return JsonResponse({"type": "error", "message": "Wrong staff ID"}, status=200)
    
    user = get_object_or_404(CustomUser, userUID=userUID)

    time_of_day = "morning" if current_hour < 12 else "afternoon" if current_hour < 18 else "evening"

    def send_notification_to_user(user, message, staff):
        group, created = NotificationGroup.objects.get_or_create(user=user, name=user.username)
        Notification.objects.create(group=group, message=message, notification_from=staff, subject=subject)

    def send_email_to_user(user, message, staff, time_of_day, subject):
        email_content = render_to_string(
            'notification.html', 
            {
                'notification_body': message,
                'username': user.username,
                'notification_from': staff.username,
                'notification_time': time_of_day
            }
        )
        send_mail(
            subject,
            '', 
            settings.EMAIL_HOST_USER,  # From email
            [user.email],  # To email
            html_message=email_content, 
            fail_silently=False,
        )

    if is_email and not is_notification:
        send_email_to_user(user, message, staff, time_of_day, subject)
        return JsonResponse({"type": "success", "message": "Email sent successfully"}, status=200)
    elif is_notification and not is_email:
        send_notification_to_user(user, message, staff)
        return JsonResponse({"type": "success", "message": "Notification sent successfully"}, status=200)
    elif is_notification and is_email:
        send_email_to_user(user, message, staff, time_of_day, subject)
        send_notification_to_user(user, message, staff)
        return JsonResponse({"type": "success", "message": "Email and notification sent successfully"}, status=200)
    else:
        return JsonResponse({"type": "error", "message": "Please select either email or notification"}, status=200)
    


@csrf_exempt
def staffRegister(request, csrf_token, token):
    if request.method != 'POST':
        return HttpResponseBadRequest("Only POST requests are allowed for registration.")
    
    if csrf_token != CSRFToken.objects.filter(csrf_token=csrf_token).first().csrf_token or not Token.objects.filter(token=token).exists():
        return JsonResponse({"status": "error", "message": "Unauthorized request"}, status=401)
    
    CSRFToken.objects.filter(csrf_token=csrf_token).delete()
    Token.objects.filter(token=token).delete()
    
    data = json.loads(request.body)
    username = data['username']
    email = data['email']
    generated_password = get_random_string(length=10)
    user_uid = uidGen(username)
    gender = data['gender']
    
    if CustomUser.objects.filter(username=username).exists():
        return JsonResponse({"status": "error", "message": f"The username {username} is not available"}, status=409)
    
    if CustomUser.objects.filter(email=email).exists():
        return JsonResponse({"status": "error", "message": f"{email} is already registered"}, status=409)
    
    user = CustomUser.objects.create_user(username=username, gender=gender, email=email, password=generated_password, userUID=user_uid, is_staff=True, is_superuser=True, role="Staff")
    ActivityLog.objects.create(user=user, action="Staff Registered by email")
    
    html_content = render_to_string('email.html', {'username': username, 'password': generated_password})
    
    send_mail(
        'Your Staff Account Details',
        '', 
        settings.EMAIL_HOST_USER,  # From email
        [email],  # To email
        html_message=html_content, 
        fail_silently=False,
    )

    return JsonResponse({"status": "success", "message": "User registered successfully, Please check your email for login credentials"}, status=201)
