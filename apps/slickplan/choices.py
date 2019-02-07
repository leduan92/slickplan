# -*- coding: utf-8 -*-

from model_utils import Choices
from django.utils.translation import ugettext_lazy as _


class SITEMAP_STATUS_CHOICE:
    ACTIVE = 'ACTIVE'
    APPROVED = 'APPROVED'
    LOCKED = 'LOCKED'

    CHOICES = Choices(
        (ACTIVE, _('Active')),
        (APPROVED, _('Approved')),
        (LOCKED, _('Locked')),
    )