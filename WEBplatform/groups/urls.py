from django.urls import path

from groups.views import GroupListCreateView, GroupDetailView

urlpatterns = [
    path('api/v1/groups/', GroupListCreateView.as_view()),
    path('api/v1/groups/<int:pk>/', GroupDetailView.as_view())
]