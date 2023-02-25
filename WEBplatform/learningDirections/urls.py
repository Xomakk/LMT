from django.urls import path

from learningDirections.views import LearningDirectionCreateView, LearningDirectionDetailView, TimetableCreateView, \
    TimetableDetailView, LessonCreateView, LessonDetailView

urlpatterns = [
    # LEARNING DIRECTION
    path('api/v1/directions/', LearningDirectionCreateView.as_view()),
    path('api/v1/directions/<int:pk>/', LearningDirectionDetailView.as_view()),
    # TIME TABLE
    path('api/v1/timetable/', TimetableCreateView.as_view()),
    path('api/v1/timetable/<int:pk>/', TimetableDetailView.as_view()),
    # LESSON
    path('api/v1/lessons/', LessonCreateView.as_view()),
    path('api/v1/lessons/<int:pk>/', LessonDetailView.as_view())
]