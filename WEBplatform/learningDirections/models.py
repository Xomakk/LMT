from django.db import models

from groups.models import learningGroup
from timetable.models import timeTable
from user.models import User


class learningDirection(models.Model):
    name = models.CharField(max_length=50, default='Не указано')
    courseDuration = models.IntegerField(default=1)
    teachers = models.ManyToManyField(User, blank=True, related_name='teachers')
    groups = models.ManyToManyField(learningGroup, blank=True, related_name='groups')
    timetable = models.ForeignKey(timeTable, on_delete=models.PROTECT, null=True)
    # userType = models.ForeignKey(UserType, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.name
