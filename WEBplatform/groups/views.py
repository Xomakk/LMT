from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from groups.models import LearningGroup, Student, Lesson
from user.permissions import IsAdminOrReadOnly
from groups.serializers import LearningGroupSerializer


class GroupListCreateView(ListCreateAPIView):
    queryset = LearningGroup.objects.all()
    serializer_class = LearningGroupSerializer
    permission_classes = [IsAdminOrReadOnly, IsAuthenticated]

    # def get_queryset(self):
    #     queryset = LearningGroup.objects.all()
    #     teacher = self.request.query_params.get('teacher')
    #     if teacher is not None:
    #         queryset = queryset.filter(teacher=teacher)
    #     return queryset


class GroupDetailView(RetrieveUpdateDestroyAPIView):
    queryset = LearningGroup.objects.all()
    serializer_class = LearningGroupSerializer
    permission_classes = [IsAdminOrReadOnly, IsAuthenticated]


class StudentListCreateView(ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = LearningGroupSerializer
    permission_classes = [IsAdminOrReadOnly, IsAuthenticated]


class StudentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = LearningGroupSerializer
    permission_classes = [IsAdminOrReadOnly, IsAuthenticated]


class LessonListCreateView(ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LearningGroupSerializer
    permission_classes = [IsAdminOrReadOnly, IsAuthenticated]


class LessonDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LearningGroupSerializer
    permission_classes = [IsAdminOrReadOnly, IsAuthenticated]
