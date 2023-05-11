# Generated by Django 4.1.1 on 2023-04-17 06:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("groups", "0011_learninggroup_group_status"),
    ]

    operations = [
        migrations.CreateModel(
            name="StudentComments",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "text",
                    models.CharField(
                        blank=True,
                        max_length=512,
                        null=True,
                        verbose_name="Комментарий",
                    ),
                ),
                ("date", models.DateField(auto_now_add=True, verbose_name="Дата")),
                (
                    "sender",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Отправитель",
                    ),
                ),
            ],
        ),
    ]
