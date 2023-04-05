from django.urls import path

from feedback.views import FeedbackCreateView, FeedbackDetailView, FeedbackListDetailView, FeedbackListCreateView, \
    FeedbackGroupListCreateView, FeedbackStudentListDetailView

urlpatterns = [
    path('api/v1/feedback/', FeedbackCreateView.as_view()),
    path('api/v1/feedback/<int:pk>/', FeedbackDetailView.as_view()),
    path('api/v1/feedback/list/', FeedbackListCreateView.as_view()),
    path('api/v1/feedback/list/<int:pk>/', FeedbackListDetailView.as_view()),
    path('api/v1/feedback/list/student/<int:pk>/', FeedbackStudentListDetailView.as_view()),
    path('api/v1/feedback/list/current_group/<int:group_id>', FeedbackGroupListCreateView.as_view()),  # список для конкретной группы
]
