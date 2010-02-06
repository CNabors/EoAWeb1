from django.db import models
from django.contrib.auth.models import *

class Character(models.Model):
    name = models.CharField(max_length=200)
    
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)
    
    account = models.ForeignKey(User)