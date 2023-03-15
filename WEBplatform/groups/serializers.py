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


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class StudentsDemoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'lastname', 'patronymic']


class LearningGroupDemoSerializer(serializers.ModelSerializer):
    students = StudentsDemoSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = LearningGroup
        exclude = ['learning_direction']


class LearningGroupSerializer(serializers.ModelSerializer):
    students = StudentsDemoSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = LearningGroup
        fields = '__all__'
