from django.contrib import admin

from groups.models import learningGroup, LessonDays, Attendance, LessonAttendance, StudentAttendanceStatus, \
    CommentStatus

admin.site.register(learningGroup)
admin.site.register(LessonDays)
admin.site.register(Attendance)
admin.site.register(LessonAttendance)
admin.site.register(StudentAttendanceStatus)
admin.site.register(CommentStatus)
