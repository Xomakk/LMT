from django.urls import path

from user.views import UserRegistrView, UserDetailView, CurrentUserView, UsersListView, ManagersListView, \
    StudentsListView, TeachersListView

urlpatterns = [
    path("api/v1/profiles/registr", UserRegistrView.as_view(),  name='registr'),
    path("api/v1/profiles/", UsersListView.as_view()),
    path("api/v1/profiles/students", StudentsListView.as_view()),
    path("api/v1/profiles/teachers", TeachersListView.as_view()),
    path("api/v1/profiles/managers", ManagersListView.as_view()),
    path("api/v1/profiles/<int:pk>/", UserDetailView.as_view()),
    path("api/v1/me/", CurrentUserView.as_view()),
]
