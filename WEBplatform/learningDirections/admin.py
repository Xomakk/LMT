from django.contrib import admin

from learningDirections.models import learningDirection, timeTable, lesson

admin.site.register(learningDirection)
admin.site.register(timeTable)
admin.site.register(lesson)