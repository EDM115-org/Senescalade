from django.db import models

# Create your models here.
class Inscription(models.Model):
    """
    The Inscription model represents an inscription to the SAE.
    """
    #the mail of the user.
    email = models.EmailField(max_length=200)
    # the password of the user.
    password = models.CharField(max_length=50)
    # The date of the inscription.
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Returns the string representation of the inscription.

        Returns:
        - The string representation of the inscription.
        """
        return self.name + " - " + self.email + " - " + self.phone + " - " + self.message + " - " + str(self.date)
