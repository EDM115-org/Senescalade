# Generated by Django 4.2.7 on 2023-12-01 15:16

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("inscription", "0006_alter_customuser_table"),
    ]

    operations = [
        migrations.AlterModelTable(
            name="customuser",
            table="inscription_customuser",
        ),
        migrations.AlterModelTable(
            name="datacalendar",
            table="Seance",
        ),
    ]