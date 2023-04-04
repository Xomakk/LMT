from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from feedback.models import Feedback, FeedbackList, FeedbackParam, FeedbackGroupList
from feedback.serializers import FeedbackSerializer, FeedbackListSerializer, FeedbackParamSerializer, \
    FeedbackGroupListSerializer


class FeedbackCreateView(ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackListCreateView(ListCreateAPIView):
    queryset = FeedbackList.objects.all()
    serializer_class = FeedbackListSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackListDetailView(RetrieveUpdateDestroyAPIView):
    queryset = FeedbackList.objects.all()
    serializer_class = FeedbackListSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackParamView(ListCreateAPIView):
    queryset = FeedbackParam.objects.all()
    serializer_class = FeedbackParamSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackParamDetailView(RetrieveUpdateDestroyAPIView):
    queryset = FeedbackParam.objects.all()
    serializer_class = FeedbackParamSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackGroupListCreateView(ListCreateAPIView):
    queryset = FeedbackGroupList.objects.all()
    serializer_class = FeedbackGroupListSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackGroupListDetailView(RetrieveUpdateDestroyAPIView):
    queryset = FeedbackGroupList.objects.all()
    serializer_class = FeedbackGroupListSerializer
    # permission_classes = [IsAuthenticated]
