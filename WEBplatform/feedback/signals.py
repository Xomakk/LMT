import math
import datetime

from django.db.models.signals import post_save
from django.dispatch import receiver

from feedback.models import FeedbackList, FeedbackGroupList, Feedback, FeedbackStudentList, GeneratedReport
from groups.models import Lesson, Student, StudentLessonStatus, LearningGroup


@receiver(post_save, sender=FeedbackList)
def post_save_FeedbackList(created, instance, **kwargs):
    if created:
        groups = LearningGroup.objects.all()

        for group in groups:
            if group.students:
                FeedbackGroupList.objects.create(
                    learning_group=group,
                    feedback_list=instance
                )


@receiver(post_save, sender=FeedbackGroupList)
def post_save_FeedbackGroupList(created, instance, **kwargs):
    if created:
        students = instance.learning_group.students.all()
        learning_direction = instance.learning_group.learning_direction
        if learning_direction and students:
            for student in students:
                FeedbackStudentList.objects.create(
                    feedback_group_list=instance,
                    student=student
                )


@receiver(post_save, sender=FeedbackStudentList)
def post_save_FeedbackStudentList(created, instance, **kwargs):
    if created:
        learning_direction = instance.feedback_group_list.learning_group.learning_direction
        if learning_direction:
            parametrs = learning_direction.feedback_params.all()
            if parametrs:
                for param in parametrs:
                    Feedback.objects.create(
                        parameter=param,
                        feedback_student_list=instance
                    )


@receiver(post_save, sender=FeedbackStudentList)
def post_save_FeedbackStudentList(created, instance, **kwargs):
    if created:
        GeneratedReport.objects.create(
            feedback_student_list=instance
        )
