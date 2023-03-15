from rest_framework import serializers

from groups.models import LearningGroup
from learningDirections.models import LearningDirection, Syllabus, Topic


class AllLearningDirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningDirection
        fields = '__all__'


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'


class SyllabusSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True)

    class Meta:
        model = Syllabus
        fields = '__all__'


class TopicSmallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        exclude = ['syllabus']


class SyllabusSmallSerializer(serializers.ModelSerializer):
    topics = TopicSmallSerializer(many=True)

    class Meta:
        model = Syllabus
        exclude = ['learning_direction']


class LearningGroupSmallSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningGroup
        fields = ['id', 'name']


class LearningDirectionSerializer(serializers.ModelSerializer):
    learning_groups = LearningGroupSmallSerializer(many=True, required=False)
    syllabuses = SyllabusSmallSerializer(many=True, required=False)

    class Meta:
        model = LearningDirection
        fields = ['name', 'course_duration', 'learning_groups', 'syllabuses']
