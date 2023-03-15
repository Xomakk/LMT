from django.urls import path

from groups.views import GroupListView, GroupDetailView, GroupCreateView

# StudentListCreateView, StudentDetailView, \
    # LessonListCreateView, LessonDetailView

urlpatterns = [
    path('api/v1/groups/', GroupListView.as_view()),
    path('api/v1/groups/create/', GroupCreateView.as_view()),
    path('api/v1/groups/<int:pk>/', GroupDetailView.as_view()),
    # path('api/v1/students/', StudentListCreateView.as_view()),
    # path('api/v1/students/<int:pk>/', StudentDetailView.as_view()),
    # path('api/v1/lessons/', LessonListCreateView.as_view()),
    # path('api/v1/lessons/<int:pk>/', LessonDetailView.as_view())
]
