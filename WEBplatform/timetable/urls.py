from django.urls import path

from timetable.views import TimetableCreateView, TimetableDetailView

urlpatterns = [
    path('api/v1/timetable/', TimetableCreateView.as_view()),
    path('api/v1/timetable/<int:pk>/', TimetableDetailView.as_view())
]