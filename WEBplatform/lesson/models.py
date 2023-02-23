from datetime import datetime
from django.db import models


class lesson(models.Model):
    number = models.IntegerField(default=0)
    topic = models.CharField(max_length=256, default='Тема не задана')
    methodical_material = models.CharField(max_length=512, default='Ссылка не задана')

