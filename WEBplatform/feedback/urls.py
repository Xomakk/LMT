from django.urls import path

from feedback.views import FeedbackCreateView, FeedbackDetailView, FeedbackListDetailView, FeedbackListCreateView, \
    FeedbackParamView, FeedbackParamDetailView, FeedbackGroupListCreateView, FeedbackGroupListDetailView

urlpatterns = [
    path('api/v1/feedback/', FeedbackCreateView.as_view()),
    path('api/v1/feedback/<int:pk>/', FeedbackDetailView.as_view()),
    path('api/v1/feedback/list/', FeedbackListCreateView.as_view()),
    path('api/v1/feedback/list/<int:pk>/', FeedbackListDetailView.as_view()),
    path('api/v1/feedback/params/', FeedbackParamView.as_view()),
    path('api/v1/feedback/params/<int:pk>/', FeedbackParamDetailView.as_view()),
    path('api/v1/feedback/list/group/', FeedbackGroupListCreateView.as_view()),
    path('api/v1/feedback/list/group/<int:pk>/', FeedbackGroupListDetailView.as_view())
]
