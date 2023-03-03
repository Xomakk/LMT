from django.contrib import admin

from user.models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['lastname', 'name', 'patronymic', 'phone', 'email']
    exclude = ['password', 'last_login']
