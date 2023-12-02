from django.db import migrations, models


class Migration(migrations.Migration):
    """Represents a database migration for altering the options of the CustomUser model."""

    dependencies = [
        ("inscription", "0007_alter_customuser_table_alter_datacalendar_table"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="email",
            field=models.EmailField(max_length=254, unique=False),
        ),
    ]
