from django.urls import path

from groups.views import GroupListCreateView, GroupDetailView, StudentListCreateView, StudentDetailView, \
    LessonListCreateView, LessonDetailView

urlpatterns = [
    path('api/v1/groups/', GroupListCreateView.as_view()),
    path('api/v1/groups/<int:pk>/', GroupDetailView.as_view()),
    path('api/v1/students/', StudentListCreateView.as_view()),
    path('api/v1/students/<int:pk>/', StudentDetailView.as_view()),
    path('api/v1/lessons/', LessonListCreateView.as_view()),
    path('api/v1/lessons/<int:pk>/', LessonDetailView.as_view())
]
