import datetime

from django.db import models


# Направление обучения
class LearningDirection(models.Model):
    name = models.CharField('Название', max_length=50, default='Не указано')
    course_duration = models.IntegerField('Длительность курса (в годах)', default=1)

    class Meta:
        verbose_name = 'Направление обучения'
        verbose_name_plural = 'Направления обучения'
        ordering = ['-name']

    def __str__(self):
        return f'{self.name} | Продолжительность: {self.course_duration} год(а)'


# программа обучения
class Syllabus(models.Model):
    year = models.IntegerField('Год', default=datetime.date.today().year)
    academic_hours = models.IntegerField(default=1)
    learning_direction = models.ForeignKey(LearningDirection, on_delete=models.SET_NULL, null=True,
                                           verbose_name='Направление обучения', related_name='syllabuses')

    class Meta:
        verbose_name = 'План обучения'
        verbose_name_plural = 'Планы обучения по направлениям'

    def __str__(self):
        return f'{self.year} | {self.learning_direction.name}'


# Тема в программе обучения
class Topic(models.Model):
    number = models.IntegerField('Номер урока', default=0)
    name = models.CharField(max_length=256, default='Тема не задана')
    methodical_material = models.CharField('Ссылка на метод. материал', max_length=1024, default='Ссылка не задана')
    syllabus = models.ForeignKey(Syllabus, on_delete=models.SET_NULL, null=True, verbose_name='Учебный план',
                                 related_name='topics')

    class Meta:
        verbose_name = 'Тема урока'
        verbose_name_plural = 'Темы уроков'
        ordering = ['syllabus', 'number']

    def __str__(self):
        return f'{self.syllabus.year} | {self.syllabus.learning_direction.name} | {self.name}'
