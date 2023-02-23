from django.urls import path

from learningDirections.views import LearningDirectionCreateView, LearningDirectionDetailView

urlpatterns = [
    path('api/v1/directions/', LearningDirectionCreateView.as_view()),
    path('api/v1/directions/<int:pk>/', LearningDirectionDetailView.as_view())
]