from django.urls import path

from feedback.views import FeedbackCreateView, FeedbackDetailView

urlpatterns = [
    path('api/v1/feedback/', FeedbackCreateView.as_view()),
    path('api/v1/feedback/<int:pk>/', FeedbackDetailView.as_view())
]