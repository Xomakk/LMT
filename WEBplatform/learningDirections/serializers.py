from rest_framework import serializers

from groups.serializers import LearningGroupSerializer
from learningDirections.models import LearningDirection, Syllabus, Topic


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'


class SyllabusSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, required=False)

    class Meta:
        model = Syllabus
        fields = '__all__'

    # fields = ['name', 'course_duration', 'learning_groups', 'syllabus']


class LearningDirectionSerializer(serializers.ModelSerializer):
    learning_groups = LearningGroupSerializer(many=True, required=False)
    syllabus = SyllabusSerializer(required=False)

    class Meta:
        model = LearningDirection
        fields = '__all__'
