"""Development settings and globals."""

from .base import *


########## DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = False

ALLOWED_HOSTS = ['*']
########## END DEBUG CONFIGURATION

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mosaicbloom',
        'USER': 'root',
        'PASSWORD': 'sqlmicry',
        'HOST': '172.31.6.24',
        'PORT': '',
    }
}
########## END DATABASE CONFIGURATION


########## CACHE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
}
########## END CACHE CONFIGURATION

WKHTMLTOPDF_CMD = '/usr/local/bin/wkhtmltopdf'

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'mosaicbloom.mail@gmail.com'
EMAIL_HOST_PASSWORD = 'mosaicbloom.84'
EMAIL_PORT = 587

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
#EMAIL_HOST = '35.164.28.166'
# EMAIL_HOST = 'mail.bitmicry.com'
# EMAIL_HOST = '172.31.9.146'
#EMAIL_PORT = 25
#EMAIL_HOST_USER = 'mosaicbloom@mail.bitmicry.com'
#EMAIL_HOST_PASSWORD = '123456789'
#EMAIL_USE_TLS = False # TLS settings
