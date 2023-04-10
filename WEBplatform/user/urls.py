from django.urls import path

from user.views import UserRegistrView, UserDetailView, CurrentUserView, UsersListView

urlpatterns = [
    path("api/v1/profiles/registr", UserRegistrView.as_view(),  name='registr'),
    path("api/v1/profiles/", UsersListView.as_view()),
    path("api/v1/profiles/<int:pk>/", UserDetailView.as_view()),
    path("api/v1/current_user/", CurrentUserView.as_view()),
]
