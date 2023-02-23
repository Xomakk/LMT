from django.urls import path

from lesson.views import LessonCreateView, LessonDetailView

urlpatterns = [
    path('api/v1/lessons/', LessonCreateView.as_view()),
    path('api/v1/lessons/<int:pk>/', LessonDetailView.as_view())
]