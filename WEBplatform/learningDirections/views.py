# Create your views here.
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from learningDirections.models import LearningDirection, Syllabus, Topic
from learningDirections.serializers import LearningDirectionSerializer, SyllabusSerializer, TopicSerializer, \
    AllLearningDirectionSerializer


class LearningDirectionCreateView(ListCreateAPIView):
    queryset = LearningDirection.objects.all()
    serializer_class = AllLearningDirectionSerializer
    # permission_classes = [IsAuthenticated]


class LearningDirectionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = LearningDirection.objects.all()
    serializer_class = LearningDirectionSerializer
    # permission_classes = [IsAuthenticated]


# TIME TABLE
class SyllabusCreateView(ListCreateAPIView):
    queryset = Syllabus.objects.all()
    serializer_class = SyllabusSerializer
    # permission_classes = [IsAuthenticated]


class SyllabusDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Syllabus.objects.all()
    serializer_class = SyllabusSerializer
    # permission_classes = [IsAuthenticated]


class TopicCreateView(ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    # permission_classes = [IsAuthenticated]


class TopicDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    # permission_classes = [IsAuthenticated]
