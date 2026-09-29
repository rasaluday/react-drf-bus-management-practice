from django.db import models


class Bus(models.Model):
    bus_number = models.CharField(max_length=50)
    driver_name = models.CharField(max_length=100)

    def __str__(self):
        return self.bus_number