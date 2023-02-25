from datetime import datetime

from django.db import models

from groups.models import learningGroup


class lesson(models.Model):
    number = models.IntegerField(default=0)
    topic = models.CharField(max_length=256, default='Тема не задана')
    methodical_material = models.CharField(max_length=512, default='Ссылка не задана')


class timeTable(models.Model):
    year = models.CharField(max_length=10, default=str(datetime.now().year))
    academic_hours = models.IntegerField(default=1)
    lessons = models.ManyToManyField(lesson, blank=True)


class learningDirection(models.Model):
    name = models.CharField(max_length=50, default='Не указано')
    courseDuration = models.IntegerField(default=1)
    groups = models.ManyToManyField(learningGroup, blank=True, related_name='groups')
    timetable = models.ForeignKey(timeTable, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.name
