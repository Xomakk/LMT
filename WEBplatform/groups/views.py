import datetime

from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import bad_request

from groups.models import LearningGroup, Student, Lesson, StudentLessonStatus
from learningDirections.models import Topic
from user.permissions import IsAdminOrReadOnly
from groups.serializers import LearningGroupDemoSerializer, LearningGroupSerializer, StudentSerializer, \
    StudentsDemoSerializer, LessonSerializer


class GroupListView(ListAPIView):
    queryset = LearningGroup.objects.all()
    serializer_class = LearningGroupDemoSerializer


class GroupCreateView(CreateAPIView):
    queryset = LearningGroup.objects.all()
    serializer_class = LearningGroupSerializer


class GroupDetailView(RetrieveUpdateDestroyAPIView):
    queryset = LearningGroup.objects.all()
    serializer_class = LearningGroupSerializer
    # permission_classes = [IsAdminOrReadOnly, IsAuthenticated]


class StudentListCreateView(ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    # permission_classes = [IsAdminOrReadOnly, IsAuthenticated]


class StudentAddGroupView(APIView):
    def put(self, request, *args, **kwargs):
        group_id = kwargs.get('group_id', None)
        try:
            if not group_id:
                raise Exception('Group ID is not defined')
            new_group = LearningGroup.objects.get(pk=group_id)
            for student_id in request.data['students']:
                student = Student.objects.get(pk=student_id)
                if new_group not in student.learning_group.all():
                    student.learning_group.add(new_group)
        except Exception as error:
            return Response(bad_request(request, error))
        else:
            return Response(status=status.HTTP_200_OK)


class StudentShortListView(ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentsDemoSerializer
    # permission_classes = [IsAdminOrReadOnly, IsAuthenticated]


class StudentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    # permission_classes = [IsAdminOrReadOnly, IsAuthenticated]


class LessonListView(ListAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    # permission_classes = [IsAdminOrReadOnly, IsAuthenticated]


class CurrentLessonListView(APIView):
    def get(self, request, *args, **kwargs):
        queryset = Lesson.objects.filter(learning_group=kwargs['group_id']).all()
        return Response([LessonSerializer(lesson).data for lesson in queryset], status=status.HTTP_200_OK)


class LessonDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    # permission_classes = [IsAdminOrReadOnly, IsAuthenticated]


class LessonAttendenseView(APIView):
    @staticmethod
    def __add_student_status(lesson, student_id, status, comment):
        student_status = StudentLessonStatus(
            lesson=lesson,
            student=Student.objects.get(pk=student_id),
        )
        if status:
            student_status.status = int(status)
        if comment:
            student_status.comment = comment
        student_status.save()

    @staticmethod
    def __change_student_status(lesson, student_id, status, comment):
        student_status = lesson.student_lesson_status.get(student=student_id)
        if status:
            student_status.status = int(status)
        if comment:
            student_status.comment = comment
        student_status.save()

    def post(self, request, *args, **kwargs):
        student_id = request.data.get('student_id', None)
        topic_id = request.data.get('topic_id', None)
        group_id = request.data.get('group_id', None)
        attendense_status = request.data.get('status', None)
        comment = request.data.get('comment', None)
        if all([student_id, topic_id, group_id]):
            try:
                lesson = Lesson.objects.filter(topic=topic_id, learning_group=group_id).first()
                if lesson:
                    student_status = StudentLessonStatus.objects.filter(lesson=lesson.id, student=student_id).first()
                    if student_status:
                        self.__change_student_status(lesson, student_id, attendense_status, comment)
                    else:
                        self.__add_student_status(lesson, student_id, status, comment)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(status=status.HTTP_200_OK)
