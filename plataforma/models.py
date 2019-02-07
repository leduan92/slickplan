from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone

class Cuenta(models.Model):
	nombre  = models.CharField(max_length = 255, default="Nombre Compañía")
	owner   = models.ForeignKey(settings.AUTH_USER_MODEL)
	imagen  = models.CharField("transparent",max_length = 255, null=True)

	def __str__(self):
		return self.nombre
