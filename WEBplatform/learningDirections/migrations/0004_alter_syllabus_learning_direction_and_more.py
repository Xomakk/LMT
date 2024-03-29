# Generated by Django 4.1.1 on 2023-03-24 05:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("learningDirections", "0003_alter_syllabus_learning_direction"),
    ]

    operations = [
        migrations.AlterField(
            model_name="syllabus",
            name="learning_direction",
            field=models.OneToOneField(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="syllabus",
                to="learningDirections.learningdirection",
                verbose_name="Направление обучения",
            ),
        ),
        migrations.AlterField(
            model_name="topic",
            name="syllabus",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="topics",
                to="learningDirections.syllabus",
                verbose_name="Учебный план",
            ),
        ),
    ]
