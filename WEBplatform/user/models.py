from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from learningDirections.models import learningDirection


class UserManager(BaseUserManager):
    def _create_user(self, email, username, password, **extra_fields):
        if not email:
            raise ValueError("Вы не ввели Email")
        if not username:
            raise ValueError("Вы не ввели Логин")
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, username, password, name, lastname, **kwargs):
        return self._create_user(email, username, password, **kwargs)

    def create_superuser(self, email, username, password, name, lastname, **kwargs):
        return self._create_user(email, username, password, is_staff=True, is_superuser=True, **kwargs)


class UserType(models.Model):
    type = models.CharField(max_length=255)

    def __str__(self):
        return self.type


class User(AbstractBaseUser, PermissionsMixin):
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    username = models.CharField(db_index=True, max_length=255, unique=True)
    email = models.EmailField(db_index=True, unique=True, null=True, blank=True)
    name = models.CharField(max_length=255, default='Не указано', blank=True)
    lastname = models.CharField(max_length=255, default='Не указано', blank=True)
    patronymic = models.CharField(max_length=255, default='Не указано', blank=True)

    # learningDirections = models.ManyToManyField(learningDirection)    # нужно ли?
    userType = models.ForeignKey(UserType, on_delete=models.PROTECT, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return f"{self.username}"
