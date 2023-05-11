from django.db import models
from learningDirections.models import LearningDirection, Topic
from user.models import User


class LessonDays(models.Model):
    class Meta:
        verbose_name = 'Дни занятий'
        verbose_name_plural = 'Дни занятий'
        ordering = ['-day_number']

    DAYS = [
        (1, 'Понедельник'),
        (2, 'Вторник'),
        (3, 'Среда'),
        (4, 'Четверг'),
        (5, 'Пятница'),
        (6, 'Суббота'),
        (7, 'Воскресенье'),
    ]
    day_number = models.IntegerField('День недели', choices=DAYS)

    def __str__(self):
        return f'{self.day_number}'


class LearningGroup(models.Model):
    class Meta:
        verbose_name = 'Учебная группа'
        verbose_name_plural = 'Учебные группы'
        ordering = ['learning_direction', '-study_year', '-name']

    class GroupStatus(models.IntegerChoices):
        ACTIVE = 10, 'Активна'
        COMPLETED = 20, 'Завершена'

    learning_direction = models.ForeignKey(LearningDirection, on_delete=models.CASCADE, null=True,
                                           verbose_name='Направление обучения', related_name='learning_groups')
    name = models.CharField('Название', max_length=50)
    study_year = models.IntegerField('Год обучения', default=1)
    address = models.CharField('Адресс занятий', max_length=200, blank=True)
    date_first_lesson = models.DateTimeField('Дата первого занятия')
    days_of_lessons = models.ManyToManyField(LessonDays, verbose_name='Дни занятий')
    teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='teacher_group',
                                verbose_name='Преподаватель')
    curator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='curator_group',
                                verbose_name='Куратор группы')
    group_status = models.SmallIntegerField('Статус', choices=GroupStatus.choices, default=10)

    def __str__(self):
        return f'{self.name}'

    def display_days_of_lessons(self):
        return ' | '.join([str(day.day_number) for day in self.days_of_lessons.all()])

    display_days_of_lessons.short_description = 'Дни занятий'


def make_path(instance, filename):
    return f'avatars/student_image_{instance.id}/{filename}'


class Student(models.Model):
    class Meta:
        verbose_name = 'Ученик'
        verbose_name_plural = 'Ученики'
        ordering = ['lastname', 'name', 'patronymic']

    name = models.CharField('Имя', max_length=255, default='Не указано', blank=True)
    lastname = models.CharField('Фамилия', max_length=255, default='Не указано', blank=True)
    patronymic = models.CharField('Отчество', max_length=255, default='Не указано', blank=True)
    email = models.EmailField('Email', unique=True, null=True, blank=True)
    phone = models.CharField('Телефон', max_length=15, null=True, blank=True)
    birthday = models.DateField('День рождения', null=True, blank=True)
    learning_group = models.ManyToManyField(LearningGroup, blank=True, verbose_name='Учебные группы',
                                            related_name='students')
    avatar = models.ImageField(upload_to=make_path, null=True, blank=True, verbose_name='Аватар')

    def __str__(self):
        return f'{self.lastname} {self.name} {self.patronymic} ' \
               f'[{" | ".join([group.name for group in self.learning_group.all()])}]'

    def display_learning_group(self):
        return ", ".join([group.name for group in self.learning_group.all()])

    display_learning_group.short_description = 'Учебные группы'


class Lesson(models.Model):
    class Meta:
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'
        ordering = ['-learning_group', 'lesson_date']

    topic = models.ForeignKey(Topic, verbose_name='Тема', on_delete=models.CASCADE, null=True)
    learning_group = models.ForeignKey(LearningGroup, verbose_name='Учебная группа', on_delete=models.CASCADE,
                                       null=True, related_name='lessons')
    lesson_date = models.DateField('Дата урока')

    def __str__(self):
        return f'{self.lesson_date} | {self.learning_group.name} | Урок №{self.topic.number}'


# таблица соответствия учник-статус (был \ не был \ не был по уважительной причине) для урока
class StudentLessonStatus(models.Model):
    class StudentAttendanceStatusValues(models.IntegerChoices):
        MISSED = 10, 'Не был'
        GOODREASON = 11, 'Не был (УП)'
        WAS = 20, 'Был'

    class Meta:
        verbose_name = 'Статус посещения урока'
        verbose_name_plural = 'Статистика посещения уроков'
        ordering = ['lesson']

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, verbose_name='Урок',
                               related_name='student_lesson_status')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, verbose_name='Ученик')
    status = models.SmallIntegerField('Статус', choices=StudentAttendanceStatusValues.choices, default=10)
    comment = models.CharField('Комментарий', blank=True, null=True, max_length=512)

    def __str__(self):
        return f'{self.student} |{self.status}|'


class StudentComments(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, verbose_name='Ученик')
    text = models.CharField('Комментарий', blank=True, null=True, max_length=512)
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='Отправитель')
    date = models.DateField('Дата', auto_now_add=True)

    def __str__(self):
        return f'{self.date} | {self.sender}: {self.text}'
