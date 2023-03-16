# Generated by Django 4.1.1 on 2023-03-16 07:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("learningDirections", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="LearningGroup",
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
                ("name", models.CharField(max_length=50, verbose_name="Название")),
                (
                    "study_year",
                    models.IntegerField(default=1, verbose_name="Год обучения"),
                ),
                (
                    "address",
                    models.CharField(
                        blank=True, max_length=200, verbose_name="Адресс занятий"
                    ),
                ),
                (
                    "date_first_lesson",
                    models.DateTimeField(verbose_name="Дата первого занятия"),
                ),
            ],
            options={
                "verbose_name": "Учебная группа",
                "verbose_name_plural": "Учебные группы",
                "ordering": ["learning_direction", "-study_year", "-name"],
            },
        ),
        migrations.CreateModel(
            name="Lesson",
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
                ("lesson_date", models.DateField(verbose_name="Дата урока")),
                (
                    "learning_group",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="groups.learninggroup",
                        verbose_name="Учебная группа",
                    ),
                ),
                (
                    "topic",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="learningDirections.topic",
                        verbose_name="Тема",
                    ),
                ),
            ],
            options={
                "verbose_name": "Урок",
                "verbose_name_plural": "Уроки",
                "ordering": ["-learning_group", "lesson_date"],
            },
        ),
        migrations.CreateModel(
            name="LessonDays",
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
                    "day_number",
                    models.IntegerField(
                        choices=[
                            (1, "Понедельник"),
                            (2, "Вторник"),
                            (3, "Среда"),
                            (4, "Четверг"),
                            (5, "Пятница"),
                            (6, "Суббота"),
                            (7, "Воскресенье"),
                        ],
                        verbose_name="День недели",
                    ),
                ),
            ],
            options={
                "verbose_name": "Дни занятий",
                "verbose_name_plural": "Дни занятий",
                "ordering": ["-day_number"],
            },
        ),
        migrations.CreateModel(
            name="Student",
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
                    "name",
                    models.CharField(
                        blank=True,
                        default="Не указано",
                        max_length=255,
                        verbose_name="Имя",
                    ),
                ),
                (
                    "lastname",
                    models.CharField(
                        blank=True,
                        default="Не указано",
                        max_length=255,
                        verbose_name="Фамилия",
                    ),
                ),
                (
                    "patronymic",
                    models.CharField(
                        blank=True,
                        default="Не указано",
                        max_length=255,
                        verbose_name="Отчество",
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        blank=True,
                        max_length=254,
                        null=True,
                        unique=True,
                        verbose_name="Email",
                    ),
                ),
                (
                    "phone",
                    models.CharField(
                        blank=True, max_length=15, null=True, verbose_name="Телефон"
                    ),
                ),
                ("birthday", models.DateField(verbose_name="День рождения")),
                (
                    "learning_group",
                    models.ManyToManyField(
                        related_name="students",
                        to="groups.learninggroup",
                        verbose_name="Учебные группы",
                    ),
                ),
            ],
            options={
                "verbose_name": "Ученик",
                "verbose_name_plural": "Ученики",
                "ordering": ["lastname", "name", "patronymic"],
            },
        ),
        migrations.CreateModel(
            name="StudentLessonStatus",
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
                    "status",
                    models.SmallIntegerField(
                        choices=[(10, "Не был"), (11, "Не был (УП)"), (20, "Был")],
                        default=10,
                        verbose_name="Статус",
                    ),
                ),
                (
                    "comment",
                    models.CharField(
                        blank=True,
                        max_length=512,
                        null=True,
                        verbose_name="Комментарий",
                    ),
                ),
                (
                    "lesson",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="groups.lesson",
                        verbose_name="Урок",
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="groups.student",
                        verbose_name="Ученик",
                    ),
                ),
            ],
            options={
                "verbose_name": "Статус посещения урока",
                "verbose_name_plural": "Статистика посещения уроков",
                "ordering": ["-lesson", "-student", "-status"],
            },
        ),
        migrations.AddField(
            model_name="learninggroup",
            name="days_of_lessons",
            field=models.ManyToManyField(
                to="groups.lessondays", verbose_name="Дни занятий"
            ),
        ),
        migrations.AddField(
            model_name="learninggroup",
            name="learning_direction",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="learning_groups",
                to="learningDirections.learningdirection",
                verbose_name="Направление обучения",
            ),
        ),
    ]