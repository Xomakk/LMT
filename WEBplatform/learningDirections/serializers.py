from rest_framework import serializers

from learningDirections.models import learningDirection, timeTable, lesson


class learningDirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = learningDirection
        fields = '__all__'


class timeTableSerializer(serializers.ModelSerializer):
    # lessons = lessonSerializer(many=True)
    class Meta:
        model = timeTable
        fields = '__all__'


class lessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = lesson
        fields = '__all__'
