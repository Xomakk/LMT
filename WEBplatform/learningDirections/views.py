# Create your views here.
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from learningDirections.models import LearningDirection, Syllabus, Topic
from learningDirections.serializers import LearningDirectionDemoSerializer, SyllabusSerializer, TopicSerializer, \
    LearningDirectionSerializer, SyllabusSmallSerializer


class LearningDirectionCreateView(ListCreateAPIView):
    queryset = LearningDirection.objects.all()
    serializer_class = LearningDirectionSerializer
    # permission_classes = [IsAuthenticated]


class LearningDirectionShortListView(ListAPIView):
    queryset = LearningDirection.objects.all()
    serializer_class = LearningDirectionSerializer
    # permission_classes = [IsAuthenticated]


class LearningDirectionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = LearningDirection.objects.all()
    serializer_class = LearningDirectionDemoSerializer
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


class SyllabusCurrentView(APIView):
    def get(self, request, *args, **kwargs):
        direction_id = kwargs.get('direction_id', None)

        if direction_id:
            syllabus = Syllabus.objects.filter(learning_direction=direction_id).first()
            return Response(SyllabusSmallSerializer(syllabus).data, status=status.HTTP_200_OK)

        return Response({'error': 'syllabus not found'}, status=status.HTTP_404_NOT_FOUND)


class TopicCreateView(ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    # permission_classes = [IsAuthenticated]


class TopicDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    # permission_classes = [IsAuthenticated]
