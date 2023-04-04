from rest_framework import serializers

from groups.models import LearningGroup, LessonDays, Student, Lesson, StudentLessonStatus
from user.serializers import UserSerializer


class StudentLessonStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLessonStatus
        exclude = ['lesson']


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
        depth = 2


class LessonDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonDays
        fields = '__all__'


class StudentsFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'lastname', 'patronymic', 'avatar', 'feedback']


class LearningGroupSerializer(serializers.ModelSerializer):
    students = StudentsFieldSerializer(many=True, required=False)
    teacher = UserSerializer(required=False, read_only=True)

    class Meta:
        model = LearningGroup
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    student_lesson_status = StudentLessonStatusSerializer(many=True, required=False, read_only=True)
    learning_group = LearningGroupSerializer(required=False, read_only=True)

    class Meta:
        model = Lesson
        fields = '__all__'
        depth = 1
