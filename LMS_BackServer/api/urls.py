from django.urls import path 
from .views import *


urlpatterns = [
    path('api/books/', name="Books", view=books),
    path('api/popular/books/', name="PopularBooks", view=get_popular_book),
    path('api/book/search/', name="BookSearch", view=bookSearch),
    path('api/library/image/', name="LibraryImage", view=LibraryImage),
    path('api/user/rating/', name="UserRating", view=userRatingView),
    path('api/user/post/rating/<str:csrf_token>/<str:token>/', name="UserPostRating", view=userPostRating),
    path('user/login/<str:csrf_token>/<str:token>/<str:w>/' , name="UserLogin", view=LogIn),
    path('user/signup/<str:csrf_token>/<str:token>/<str:w>/' , name="UserSignup", view=register),
    path('api/user/<str:username>/', name="User", view=get_user_info),
    path('api/user/data/<str:uid>/', name="User", view=get_user_info_by_uid),
    path('api/user/profile/edit/<str:csrf_token>/<str:token>/', name="UserEditProfile", view=edit_user_profile),
    path('api/staff/signup/<str:csrf_token>/<str:token>/', name="StaffRegister", view=staffRegister),
    path('api/book/borrow/<str:csrf_token>/<str:token>/', name="BookBorrow", view=bookBorrow),
    path('api/user/borrow/history/', name="UserBorrowHistory", view=userBorrowHistory),
    path('api/user/saved/books/<str:csrf_token>/<str:token>/', name="UserSavedBooks", view=userSave),
    path('api/user/saved/books/', name="UserSavedBooksView", view=userSaveView),
    path('api/u/notifications/', name="User Notification", view=user_notification),
    path('api/session/verify/', name="Verify Session", view=verify_session),
    
    path('admins/spacial/get/csrf/token/<str:gen_code>/', name="GetCSRFToken", view=get_csrf_token),
    path('admins/spacial/get/token/<str:gen_code>/', name="GetToken", view=get_random_token),
    path('admins/recent/log/', name="Recent Registers", view=recentActivity),
    path('admins/staffs/info/', name="Staff Info", view=StaffsInfo),
    path('admins/user/list/', name="User List", view=get_user_list),
    path('admins/borrow/requests/', name="Borrow Requests", view=bookBorrowAdmin),
    path('admins/borrow/requests/<str:id>/', name="Single Borrow Requests", view=get_borrow_info_by_borrowID),
    path('admins/find/staff/', name="Find Staff", view=get_staff_by_staffID),
    path('admins/get/staff/id/', name="Get Staff ID", view=get_staff_id),
    path('admins/book/info/', name="Get Book Info", view=get_book_info),
    path('admins/book/label/', name="Get Or Create Book Label", view=get_or_create_book_label),
    
    path('admins/send/notification/<str:csrf_token>/<str:token>/', name="SendNotification", view=send_notification),
    path('admins/response/borrow/request/<str:csrf_token>/<str:token>/', name="ResponseBorrowRequest", view=responseToBorrowRequest),
    path('admins/user/role/update/<str:csrf_token>/<str:token>/', name="UpdateUser", view=update_user_role),
    path('admins/book/add/<str:csrf_token>/<str:token>/', name="AddBook", view=addBook),
    path('admins/book/update/<str:csrf_token>/<str:token>/', name="UpdateBook", view=updateBook),
    path('admins/book/label/add/', name="Add Book Label", view=pushLabel),
]

