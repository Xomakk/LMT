from rest_framework import serializers

from learningDirections.models import LearningDirection, Syllabus, Topic


class learningDirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningDirection
        fields = '__all__'


class timeTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Syllabus
        fields = '__all__'


class lessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'
