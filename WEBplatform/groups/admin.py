from django.contrib import admin
from django.utils.safestring import mark_safe

from . import models

from groups.models import LearningGroup, LessonDays, Student, Lesson, StudentLessonStatus


class DaysInline(admin.TabularInline):
    model = models.LearningGroup.days_of_lessons.through
    extra = 0


@admin.register(LearningGroup)
class learningGroupAdmin(admin.ModelAdmin):
    inlines = [DaysInline]
    list_display = ['name', 'learning_direction', 'display_days_of_lessons', 'study_year', 'address', 'teacher']
    list_editable = ['study_year', 'address', 'teacher']
    exclude = ['students', 'days_of_lessons']


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['lastname', 'name', 'patronymic', 'display_learning_group', 'birthday', 'phone', 'email',
                    'avatar_preview']
    list_editable = ['birthday', 'phone', 'email']
    readonly_fields = ['avatar_preview']

    def avatar_preview(self, instance):
        if instance.avatar:
            return mark_safe('<img src="%s" style="max-height: 100px"/>' % instance.avatar.url)

    avatar_preview.short_description = u'Превью аватара:'


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['topic', 'lesson_date', 'learning_group']
    list_editable = ['lesson_date', 'learning_group']
    list_filter = ['learning_group', 'lesson_date']


@admin.register(StudentLessonStatus)
class StudentLessonStatusAdmin(admin.ModelAdmin):
    list_display = ['student', 'lesson', 'status', 'comment']
    list_editable = ['lesson', 'status', 'comment']
    list_filter = ['status']


@admin.register(LessonDays)
class LessonDaysAdmin(admin.ModelAdmin):
    list_display = ['id', 'day_number']
    list_editable = ['day_number']
