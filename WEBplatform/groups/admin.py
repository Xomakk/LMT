from django.contrib import admin
from . import models

from groups.models import LearningGroup, LessonDays, Student, Lesson, StudentLessonStatus


class DaysInline(admin.TabularInline):
    model = models.LearningGroup.days_of_lessons.through
    extra = 1


@admin.register(LearningGroup)
class learningGroupAdmin(admin.ModelAdmin):
    inlines = [DaysInline]
    list_display = ['name', 'learning_direction', 'display_days_of_lessons', 'study_year', 'address', 'teacher']
    list_editable = ['study_year', 'address', 'teacher']
    exclude = ['students', 'days_of_lessons']


admin.site.register(Student)
admin.site.register(LessonDays)
admin.site.register(Lesson)
admin.site.register(StudentLessonStatus)
