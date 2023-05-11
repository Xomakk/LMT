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


def make_path(instance, filename):
    return f'avatars/user_image_{instance.id}/{filename}'


class User(AbstractBaseUser, PermissionsMixin):
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    email = models.EmailField('Email', db_index=True, unique=True, null=True)
    name = models.CharField('Имя', max_length=255, default='Не указано', blank=True)
    lastname = models.CharField('Фамилия', max_length=255, default='Не указано', blank=True)
    patronymic = models.CharField('Отчество', max_length=255, default='Не указано', blank=True)
    phone = models.CharField('Телефон', max_length=15, null=True, blank=True)
    birthday = models.DateField('День рождения', null=True, blank=True)

    avatar = models.ImageField(upload_to=make_path, null=True, blank=True, verbose_name='Аватар')

    USERNAME_FIELD = 'email'
    objects = UserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ('-lastname', '-name', '-patronymic')

    def __str__(self):
        return f"{self.lastname} {self.name} {self.patronymic}"
