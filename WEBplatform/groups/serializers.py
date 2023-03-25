from rest_framework import serializers
from groups.models import LearningGroup, LessonDays, Student, Lesson, StudentLessonStatus
from learningDirections.models import Topic


class StudentLessonStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLessonStatus
        exclude = ['lesson', 'id']


class TopicSerializerForListLesson(serializers.ModelSerializer):
    class Meta:
        model = Topic
        exclude = ['id', 'methodical_material', 'syllabus']


class LessonListSerializer(serializers.ModelSerializer):
    topic = TopicSerializerForListLesson(required=False, read_only=True)

    class Meta:
        model = Lesson
        fields = '__all__'


class TopicSerializerForLesson(serializers.ModelSerializer):
    class Meta:
        model = Topic
        exclude = ['syllabus']


class LessonSerializer(serializers.ModelSerializer):
    student_lesson_status = StudentLessonStatusSerializer(many=True, required=False, read_only=True)
    topic = TopicSerializerForLesson(required=False, read_only=True)

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
