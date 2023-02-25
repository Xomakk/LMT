# Create your views here.
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from learningDirections.models import learningDirection, timeTable, lesson
from learningDirections.serializers import learningDirectionSerializer, timeTableSerializer, lessonSerializer


# LEARNING DIRECTION
class LearningDirectionCreateView(ListCreateAPIView):
    queryset = learningDirection.objects.all()
    serializer_class = learningDirectionSerializer
    permission_classes = [IsAuthenticated]


class LearningDirectionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = learningDirection.objects.all()
    serializer_class = learningDirectionSerializer
    permission_classes = [IsAuthenticated]


# TIME TABLE
class TimetableCreateView(ListCreateAPIView):
    queryset = timeTable.objects.all()
    serializer_class = timeTableSerializer
    permission_classes = [IsAuthenticated]


class TimetableDetailView(RetrieveUpdateDestroyAPIView):
    queryset = timeTable.objects.all()
    serializer_class = timeTableSerializer
    permission_classes = [IsAuthenticated]


# LESSON
class LessonCreateView(ListCreateAPIView):
    queryset = lesson.objects.all()
    serializer_class = lessonSerializer
    permission_classes = [IsAuthenticated]


class LessonDetailView(RetrieveUpdateDestroyAPIView):
    queryset = lesson.objects.all()
    serializer_class = lessonSerializer
    permission_classes = [IsAuthenticated]
