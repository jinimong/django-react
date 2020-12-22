from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """ User Model """

    def __str__(self):
        return f"<{self.id}> {self.username}"
