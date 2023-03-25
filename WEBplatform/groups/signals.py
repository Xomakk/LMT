import math
import datetime

from django.db.models.signals import post_save
from django.dispatch import receiver

from groups.models import Lesson, Student, StudentLessonStatus, LearningGroup
from learningDirections.models import Topic


def get_lesson_date(lesson_number, group):
    first_lesson_date = group.date_first_lesson
    days_of_lessons = list(map(lambda item: item.day_number, group.days_of_lessons.all()))
    first_week_dates = []
    for i in range(7):
        date = first_lesson_date + datetime.timedelta(days=1) * i
        if date.weekday() + 1 in days_of_lessons:
            first_week_dates.append(date)

    dates = []
    week_delta = datetime.timedelta(weeks=1)
    for week_num in range(int(math.ceil(lesson_number / len(days_of_lessons)))):
        for day in first_week_dates:
            dates.append(day + week_delta * week_num)
    return sorted(dates)


def create_lesson(topic, group):
    lesson = Lesson.objects.create(
        topic=topic,
        learning_group=group,
        lesson_date=get_lesson_date(topic.number, group)[topic.number - 1]
    )
    return lesson


# при создании занятия в плане обучения
@receiver(post_save, sender=Topic)
def post_save_topic(created, instance, **kwargs):
    if created:
        syllabus = instance.syllabus
        learning_direction = syllabus.learning_direction
        groups = learning_direction.learning_groups.all()
        for group in groups:
            create_lesson(instance, group)

    # # при создании урока создаются статусы для всех учеников
# @receiver(post_save, sender=Lesson)
# def post_save_lesson(created, instance, **kwargs):
#     if created:
#         for student in instance.learning_group.students.all():
#             student_status = StudentLessonStatus.objects.create(
#                 lesson=instance,
#                 student=student
#             )
