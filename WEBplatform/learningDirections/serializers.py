from rest_framework import serializers

from feedback.serializers import FeedbackParamSerializer
from groups.models import LearningGroup, Lesson
from groups.serializers import LearningGroupSerializer, StudentLessonStatusSerializer, StudentsFieldSerializer
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


class LearningDirectionSerializer(serializers.ModelSerializer):
    learning_groups = LearningGroupSerializer(many=True, required=False, read_only=True)
    syllabus = SyllabusSerializer(required=False, read_only=True)
    feedback_params = FeedbackParamSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = LearningDirection
        fields = '__all__'


# Attendance
class LessonAttendanceSerializer(serializers.ModelSerializer):
    student_lesson_status = StudentLessonStatusSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Lesson
        fields = ['topic', 'lesson_date', 'student_lesson_status']


class GroupAttendanceSerializer(serializers.ModelSerializer):
    lessons = LessonAttendanceSerializer(many=True, required=False, read_only=True)
    students = StudentsFieldSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = LearningGroup
        exclude = ['date_first_lesson', 'learning_direction']
        depth = 1


class LearningDirectionAttendanceSerializer(serializers.ModelSerializer):
    learning_groups = GroupAttendanceSerializer(many=True, required=False,  read_only=True)

    class Meta:
        model = LearningDirection
        exclude = ['course_duration']
