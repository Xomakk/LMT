# Create your views here.
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from learningDirections.models import learningDirection
from learningDirections.serializers import learningDirectionSerializer


class LearningDirectionCreateView(ListCreateAPIView):
    queryset = learningDirection.objects.all()
    serializer_class = learningDirectionSerializer
    permission_classes = [IsAuthenticated]


class LearningDirectionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = learningDirection.objects.all()
    serializer_class = learningDirectionSerializer
    permission_classes = [IsAuthenticated]