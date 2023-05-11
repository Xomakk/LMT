from django.urls import path

from feedback.views import FeedbackCreateView, FeedbackDetailView, FeedbackListDetailView, FeedbackListCreateView, \
    FeedbackGroupListCreateView, FeedbackStudentListDetailView, RegenerateReportView, DownloadStudentReport, \
    DownloadGroupReport

urlpatterns = [
    path('api/v1/feedback/', FeedbackCreateView.as_view()),
    path('api/v1/feedback/<int:pk>/', FeedbackDetailView.as_view()),
    path('api/v1/feedback/list/', FeedbackListCreateView.as_view()),
    path('api/v1/feedback/list/<int:pk>/', FeedbackListDetailView.as_view()),
    path('api/v1/feedback/list/student/<int:pk>/', FeedbackStudentListDetailView.as_view()),
    path('api/v1/feedback/list/student/regenerate_report/', RegenerateReportView.as_view()),
    path('api/v1/feedback/list/current_group/<int:group_id>/', FeedbackGroupListCreateView.as_view()),

    path('api/v1/feedback/report/student/<int:student_id>/', DownloadStudentReport.as_view()),
    path('api/v1/feedback/report/group/<int:group_id>/', DownloadGroupReport.as_view()),
    # path('api/v1/feedback/report/', FeedbackCreateView.as_view()),
]
