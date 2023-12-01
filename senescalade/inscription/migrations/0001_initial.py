from django.db import migrations, models


class Migration(migrations.Migration):
    """
    Represents a database migration.

    This class is responsible for defining the initial state of the database schema.
    It contains information about the dependencies and operations to be performed during the migration.
    """

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="CustomUser",
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
                ("birth_date", models.DateField()),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("password", models.CharField(max_length=100)),
                ("confirm_password", models.CharField(max_length=100)),
            ],
        ),
    ]
