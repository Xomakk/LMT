import datetime

from django.db import models

from groups.models import Student, LearningGroup
from learningDirections.models import LearningDirection
from user.models import User


class FeedbackParam(models.Model):
    name = models.CharField('Критерий', max_length=1000)
    learning_direction = models.ForeignKey(LearningDirection, on_delete=models.CASCADE,
                                           verbose_name='Направление обучения', related_name='feedback_params')

    class Meta:
        verbose_name = 'Параметр обратной связи'
        verbose_name_plural = 'Параметры обратной связи'
        ordering = ['learning_direction', 'name']

    def __str__(self):
        stroke = ''
        if self.learning_direction:
            stroke += f'{self.learning_direction.name}'
        else:
            stroke += 'None'
        return f'{stroke} | {self.name}'


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


class FeedbackGroupList(models.Model):
    learning_group = models.ForeignKey(LearningGroup, on_delete=models.CASCADE,
                                       verbose_name='Обратная связь по группе', related_name='feedback_group_list')
    feedback_list = models.ForeignKey(FeedbackList, on_delete=models.CASCADE,
                                      verbose_name='Общий список ОС', related_name='feedback_group_list')

    class Meta:
        verbose_name = 'Список по группе'
        verbose_name_plural = 'Списки по группам'
        ordering = ['learning_group']

    def __str__(self):
        return f'Group: {self.learning_group}, FB list: {self.feedback_list}'


class FeedbackStudentListStatusValues(models.IntegerChoices):
    ACCEPTED = 10, 'Принято'
    CHECKING = 11, 'Требует проверки'
    EMPTY = 20, 'Не заполнено'


class FeedbackStudentList(models.Model):
    feedback_group_list = models.ForeignKey(FeedbackGroupList, on_delete=models.CASCADE,
                                            verbose_name='Лист ОС группы', related_name='feedback_student_list')
    send_date = models.DateField('Дата', auto_now_add=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, verbose_name='Ученик',
                                related_name='feedback_student_list')
    status = models.SmallIntegerField('Статус', choices=FeedbackStudentListStatusValues.choices, default=20)

    class Meta:
        verbose_name = 'Список по ученику'
        verbose_name_plural = 'Список по ученикам'
        ordering = ['student']

    def __str__(self):
        return f'{self.student}: | {self.feedback_group_list}'


class Feedback(models.Model):
    parameter = models.ForeignKey(FeedbackParam, on_delete=models.CASCADE, verbose_name='Критерий')
    comment = models.TextField('Комментарий', blank=True)
    feedback_student_list = models.ForeignKey(FeedbackStudentList, on_delete=models.CASCADE,
                                              verbose_name='Лист ОС ученика', related_name='feedback')

    class Meta:
        verbose_name = 'Обратная связь'
        verbose_name_plural = 'Обратная связь'
        ordering = ['feedback_student_list', 'parameter']

    def __str__(self):
        return f'{self.parameter}: | {self.parameter.learning_direction.name}: | {self.feedback_student_list}'


class GeneratedReport(models.Model):
    feedback_student_list = models.OneToOneField(FeedbackStudentList, on_delete=models.CASCADE,
                                              verbose_name='Лист ОС ученика', related_name='generated_report')
    text = models.TextField('Комментарий', blank=True)

    class Meta:
        verbose_name = 'Генерируемый отчет'
        verbose_name_plural = 'Генерируемые отчеты'
        ordering = ['feedback_student_list']

    def __str__(self):
        return f'Отчет для: {self.feedback_student_list}'
