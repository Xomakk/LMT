from django.urls import path

from learningDirections.views import LearningDirectionCreateView, LearningDirectionDetailView, SyllabusCreateView, \
    SyllabusDetailView, TopicCreateView, TopicDetailView, SyllabusCurrentView, LearningDirectionAttendanceListView, \
    LearningDirectionListView

urlpatterns = [
    # LEARNING DIRECTION
    path('api/v1/directions/', LearningDirectionCreateView.as_view()),
    path('api/v1/directions/list/', LearningDirectionListView.as_view()),
    path('api/v1/directions/attendance/', LearningDirectionAttendanceListView.as_view()),
    path('api/v1/directions/<int:pk>/', LearningDirectionDetailView.as_view()),
    # TIME TABLE
    path('api/v1/syllabuses/', SyllabusCreateView.as_view()),
    path('api/v1/syllabuses/<int:pk>/', SyllabusDetailView.as_view()),
    path('api/v1/syllabuses/current/<int:direction_id>/', SyllabusCurrentView.as_view()),
    # LESSON
    path('api/v1/topics/', TopicCreateView.as_view()),
    path('api/v1/topics/<int:pk>/', TopicDetailView.as_view())
]
