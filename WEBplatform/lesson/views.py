# Create your views here.
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from lesson.models import lesson
from lesson.serializers import lessonSerializer


class LessonCreateView(ListCreateAPIView):
    queryset = lesson.objects.all()
    serializer_class = lessonSerializer
    permission_classes = [IsAuthenticated]


class LessonDetailView(RetrieveUpdateDestroyAPIView):
    queryset = lesson.objects.all()
    serializer_class = lessonSerializer
    permission_classes = [IsAuthenticated]