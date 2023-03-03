import datetime

from django.db import models

from groups.models import Student
from learningDirections.models import LearningDirection
from user.models import User


class FeedbackList(models.Model):
    date = models.DateField('Дата', default=datetime.date.today)
    responsible = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='Ответственный')
    template = models.ImageField('Шаблон', null=True, blank=True)

    class Meta:
        verbose_name = 'Лист обратной связи'
        verbose_name_plural = 'Листы обратной связи'
        ordering = ['date', 'responsible']

    def __str__(self):
        return f'Лист ОС от: {self.date}'


class FeedbackParam(models.Model):
    name = models.CharField('Критерий', max_length=200)
    learning_direction = models.ForeignKey(LearningDirection, on_delete=models.SET_NULL,
                                           verbose_name='Направление обучения',
                                           null=True)

    class Meta:
        verbose_name = 'Параметр обратной связи'
        verbose_name_plural = 'Параметры обратной связи'
        ordering = ['learning_direction', 'name']

    def __str__(self):
        return f'{self.learning_direction.name} | {self.name}'


class Feedback(models.Model):
    parameter = models.ForeignKey(FeedbackParam, on_delete=models.CASCADE, verbose_name='Критерий')
    comment = models.TextField('Комментарий')
    send_date = models.DateField('Дата', auto_now_add=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, verbose_name='Ученик')
    feedback_list = models.ForeignKey(FeedbackList, on_delete=models.SET_NULL, null=True,
                                      verbose_name='Лист обратной связи')

    class Meta:
        verbose_name = 'Обратная связь'
        verbose_name_plural = 'Обратная связь'
        ordering = ['student', 'send_date', 'parameter']

    def __str__(self):
        return f'{self.parameter}: | {self.parameter.learning_direction.name}: | {self.comment}'
