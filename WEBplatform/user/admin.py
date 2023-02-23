from django.contrib import admin

from user.models import User, UserType

admin.site.register(User)
admin.site.register(UserType)
