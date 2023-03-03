from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from groups.models import LearningGroup
from user.permissions import IsAdminOrReadOnly
from groups.serializers import LearningGroupSerializer


class GroupListCreateView(ListCreateAPIView):
    queryset = LearningGroup.objects.all()
    serializer_class = LearningGroupSerializer
    permission_classes = [IsAdminOrReadOnly, IsAuthenticated]

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = LearningGroup.objects.all()
        teacher = self.request.query_params.get('teacher')
        if teacher is not None:
            queryset = queryset.filter(teacher=teacher)
        return queryset


class GroupDetailView(RetrieveUpdateDestroyAPIView):
    queryset = LearningGroup.objects.all()
    serializer_class = LearningGroupSerializer
    permission_classes = [IsAdminOrReadOnly, IsAuthenticated]