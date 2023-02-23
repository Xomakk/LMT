from datetime import datetime

from django.db import models

from lesson.models import lesson


class timeTable(models.Model):
    year = models.CharField(max_length=10, default=str(datetime.now().year))
    academic_hours = models.IntegerField(default=1)
    lessons = models.ManyToManyField(lesson, blank=True)

