from django.urls import path

from groups.views import GroupListView, GroupDetailView, GroupCreateView, StudentListCreateView, StudentDetailView, \
    StudentAddGroupView, LessonDetailView, LessonAttendenseView, \
    LessonListView, CurrentLessonListView, StudentCommentsView

urlpatterns = [
    path('api/v1/groups/', GroupListView.as_view()),
    path('api/v1/groups/create/', GroupCreateView.as_view()),
    path('api/v1/groups/<int:pk>/', GroupDetailView.as_view()),
    path('api/v1/groups/<int:group_id>/lessons/', CurrentLessonListView.as_view()),

    path('api/v1/students/', StudentListCreateView.as_view()),
    path('api/v1/students/<int:pk>/', StudentDetailView.as_view()),
    path('api/v1/students/<int:pk>/comments/', StudentCommentsView.as_view()),
    path('api/v1/students/<int:pk>/comments/<int:id_comment>/', StudentCommentsView.as_view()),
    path('api/v1/students/addGroup/<int:group_id>/', StudentAddGroupView.as_view()),

    path('api/v1/lessons/', LessonListView.as_view()),
    path('api/v1/lessons/attandense/', LessonAttendenseView.as_view()),
    path('api/v1/lessons/<int:pk>/', LessonDetailView.as_view())
]
