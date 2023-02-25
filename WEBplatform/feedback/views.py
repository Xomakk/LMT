from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated


class TimetableCreateView(ListCreateAPIView):
    queryset = timeTable.objects.all()
    serializer_class = timeTableSerializer
    permission_classes = [IsAuthenticated]


class TimetableDetailView(RetrieveUpdateDestroyAPIView):
    queryset = timeTable.objects.all()
    serializer_class = timeTableSerializer
    permission_classes = [IsAuthenticated]