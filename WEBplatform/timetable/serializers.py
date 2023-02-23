from rest_framework import serializers

from lesson.serializers import lessonSerializer
from timetable.models import timeTable


class timeTableSerializer(serializers.ModelSerializer):
    # lessons = lessonSerializer(many=True)

    class Meta:
        model = timeTable
        fields = '__all__'
