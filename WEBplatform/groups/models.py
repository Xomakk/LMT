from django.db import models

# lesson groups
from user.models import User


# from learningDirections.models import learningDirection


# ----------------------------- AttendanceSheet ----------------------------- #
class LessonDays(models.Model):
    day_number = models.IntegerField()

    def __str__(self):
        return f'{self.day_number}'


# таблица соответствия учник-статус (был \ не был \ не был по уважительной причине) для урока
class CommentStatus(models.Model):
    text = models.CharField(max_length=1000)
    status = models.BooleanField(default=False) # прочитано или нет
    date_create = models.DateTimeField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.text[:20]}...'


# таблица соответствия учник-статус (был \ не был \ не был по уважительной причине) для урока
class StudentAttendanceStatus(models.Model):
    student = models.ForeignKey(User, on_delete=models.PROTECT)
    status = models.CharField(max_length=30, null=True)
    comment = models.ForeignKey(CommentStatus, null=True, on_delete=models.PROTECT)
    date_create = models.DateTimeField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.student} -> {self.status}'


# таблица посещаемости для урока
class LessonAttendance(models.Model):
    lesson_date = models.DateField()
    students_list = models.ManyToManyField(StudentAttendanceStatus)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.lesson_date}'


# таблица посещаемости для каждой группы
class Attendance(models.Model):
    lessons_attendance_sheet = models.ManyToManyField(LessonAttendance)


# ----------------------------- learningGroup ----------------------------- #
class learningGroup(models.Model):
    name = models.CharField(max_length=50)
    dayOfLessons = models.ManyToManyField(LessonDays)
    studyCourse = models.IntegerField(default=1)
    location = models.CharField(max_length=200, blank=True)
    date_update = models.DateTimeField(auto_now=True)
    date_first_lesson = models.DateTimeField()
    teacher = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    students = models.ManyToManyField(User, blank=True, related_name='students')
    attendance_sheet = models.ForeignKey(Attendance, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.name
