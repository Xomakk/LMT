from django.urls import path

from user.views import UserRegistrView, UserDetailView, CurrentUserView, UsersListView

urlpatterns = [
    # retrieves profile details of the currently logged in user
    path("api/v1/profiles/registr", UserRegistrView.as_view(),  name='registr'),
    path("api/v1/profiles/", UsersListView.as_view()),
    path("api/v1/profiles/<int:pk>/", UserDetailView.as_view()),
    path("api/v1/me/", CurrentUserView.as_view()),
]
