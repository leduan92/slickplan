#!/bin/bash

NAME="mosaicbloom"                                  # Name of the application
DJANGODIR=/home/cloudmicry/projects/mosaicbloom             # Django project directory
SOCKFILE=/home/cloudmicry/projects/mosaicbloom/run/gunicorn.sock  # we will communicte using this unix socket
USER=www-data                                        # the user to run as
GROUP=www-data                                     # the group to run as
NUM_WORKERS=2                                     # how many worker processes should Gunicorn spawn
TIMEOUT=120
DJANGO_SETTINGS_MODULE=conf.settings.prod             # which settings file should Django use
DJANGO_WSGI_MODULE=conf.wsgi                     # WSGI module name

echo "Starting $NAME as `whoami`"

# Activate the virtual environment
cd $DJANGODIR
source /home/cloudmicry/.virtualenvs/mosaicbloom/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec /home/cloudmicry/.virtualenvs/mosaicbloom/bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --timeout $TIMEOUT \
  --user=$USER --group=$GROUP \
  --bind=unix:$SOCKFILE \
  --log-level=debug \
  --log-file=-
