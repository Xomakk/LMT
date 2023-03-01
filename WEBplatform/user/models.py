from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Вы не ввели Email")
        user = self.model(
            email=self.normalize_email(email),
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **kwargs):
        username = email
        return self._create_user(email, password, **kwargs)

    def create_superuser(self, email, password, **kwargs):
        return self._create_user(email, password, is_staff=True, is_superuser=True, **kwargs)


# не используется
class UserType(models.Model):
    type = models.CharField(max_length=255)

    def __str__(self):
        return self.type


class User(AbstractBaseUser, PermissionsMixin):
    # is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    email = models.EmailField(db_index=True, unique=True, null=True, blank=True)
    name = models.CharField(max_length=255, default='Не указано', blank=True)
    lastname = models.CharField(max_length=255, default='Не указано', blank=True)
    patronymic = models.CharField(max_length=255, default='Не указано', blank=True)

    is_manager = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'

    objects = UserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ('-is_manager', '-is_teacher', '-is_student', 'lastname')

    def __str__(self):
        positions = []
        if self.is_manager:
            positions.append('Администратор')
        if self.is_teacher:
            positions.append('Преподаватель')
        if self.is_student:
            positions.append('Ученик')

        return f"{self.lastname} {self.name} {self.patronymic} [{', '.join(positions)}]"
