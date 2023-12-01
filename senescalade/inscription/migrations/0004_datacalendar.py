# Generated by Django 4.2.7 on 2023-12-01 15:07

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("inscription", "0003_alter_customuser_table"),
    ]

    operations = [
        migrations.CreateModel(
            name="DataCalendar",
            fields=[
                ("idSeance", models.IntegerField(primary_key=True, serialize=False)),
                ("jour", models.CharField(max_length=50)),
                ("heureSeance", models.TimeField()),
                ("dureeSeance", models.TimeField()),
                ("typeSeance", models.CharField(max_length=100)),
                ("niveau", models.CharField(max_length=100)),
                ("nbPlaces", models.IntegerField()),
                ("nbPlacesRestantes", models.IntegerField()),
                ("professeur", models.CharField(max_length=100)),
            ],
            options={
                "db_table": "inscription_datacalendar",
                "managed": False,
            },
        ),
    ]
