# Create your views here.
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from learningDirections.models import LearningDirection, Syllabus, Topic
from learningDirections.serializers import learningDirectionSerializer, timeTableSerializer, lessonSerializer


# LEARNING DIRECTION
class LearningDirectionCreateView(ListCreateAPIView):
    queryset = LearningDirection.objects.all()
    serializer_class = learningDirectionSerializer
    permission_classes = [IsAuthenticated]


class LearningDirectionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = LearningDirection.objects.all()
    serializer_class = learningDirectionSerializer
    permission_classes = [IsAuthenticated]


# TIME TABLE
class TimetableCreateView(ListCreateAPIView):
    queryset = Syllabus.objects.all()
    serializer_class = timeTableSerializer
    permission_classes = [IsAuthenticated]


class TimetableDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Syllabus.objects.all()
    serializer_class = timeTableSerializer
    permission_classes = [IsAuthenticated]


# LESSON
class LessonCreateView(ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = lessonSerializer
    permission_classes = [IsAuthenticated]


class LessonDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = lessonSerializer
    permission_classes = [IsAuthenticated]
