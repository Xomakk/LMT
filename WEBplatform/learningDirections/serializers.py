from rest_framework import serializers

from groups.serializers import groupSerializer
from learningDirections.models import learningDirection
from timetable.serializers import timeTableSerializer
from user.serializers import UserSerializer


class learningDirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = learningDirection
        fields = '__all__'
