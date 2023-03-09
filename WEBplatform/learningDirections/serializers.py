from rest_framework import serializers

from learningDirections.models import LearningDirection, Syllabus, Topic


class LearningDirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningDirection
        fields = '__all__'


class SyllabusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Syllabus
        fields = '__all__'


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'
