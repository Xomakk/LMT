# Create your views here.
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from timetable.models import timeTable
from timetable.models import lesson
from timetable.serializers import timeTableSerializer


class TimetableCreateView(ListCreateAPIView):
    queryset = timeTable.objects.all()
    serializer_class = timeTableSerializer
    permission_classes = [IsAuthenticated]


class TimetableDetailView(RetrieveUpdateDestroyAPIView):
    queryset = timeTable.objects.all()
    serializer_class = timeTableSerializer
    permission_classes = [IsAuthenticated]