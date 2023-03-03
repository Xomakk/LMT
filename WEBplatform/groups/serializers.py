from rest_framework import serializers
from groups.models import LearningGroup, LessonDays, Student, Lesson, StudentLessonStatus


class StudentLessonStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLessonStatus
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class LessonDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonDays
        fields = ['day_number']


class LearningGroupSerializer(serializers.ModelSerializer):
    days_of_lessons = LessonDaysSerializer(many=True)

    class Meta:
        model = LearningGroup
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    learning_group = LearningGroupSerializer(many=True)

    class Meta:
        model = Student
        fields = '__all__'
