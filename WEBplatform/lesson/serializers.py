from rest_framework import serializers
from lesson.models import lesson


class lessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = lesson
        fields = '__all__'
