from django.urls import path

from user.views import UserDetailView, UsersListView, CheckAuthenticatedView, SignupView, LoginView, LogoutView, \
    DeleteAccountView, GetCSRFToken, GetCurrentUserView

urlpatterns = [
    # path("api/v1/profiles/registr", UserRegistrView.as_view(), name='registr'),
    path("api/v1/profiles/", UsersListView.as_view()),
    path("api/v1/profiles/<int:pk>/", UserDetailView.as_view()),
    path('api/v1/authenticated/', CheckAuthenticatedView.as_view()),
    path('api/v1/register/', SignupView.as_view()),
    path('api/v1/login/', LoginView.as_view()),
    path('api/v1/logout/', LogoutView.as_view()),
    path('api/v1/delete/', DeleteAccountView.as_view()),
    path('api/v1/csrf_cookie/', GetCSRFToken.as_view()),
    path('api/v1/current_user/', GetCurrentUserView.as_view())
]
