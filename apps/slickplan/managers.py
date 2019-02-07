# -*- coding: utf-8 -*-
from django.db import models


class SiteMapManager(models.Manager):

    @staticmethod
    def archive(sitemap_version_id_list):
        from .models import SiteMapVersion
        for sitemap_version_id in sitemap_version_id_list:
            sitemap_version = SiteMapVersion.objects.get(id=sitemap_version_id)
            sitemap = sitemap_version.sitemap
            sitemap.archived = True
            sitemap.save()
        return True

    @staticmethod
    def unarchive(sitemap_version_id_list):
        from .models import SiteMapVersion
        for sitemap_version_id in sitemap_version_id_list:
            sitemap_version = SiteMapVersion.objects.get(id=sitemap_version_id)
            sitemap = sitemap_version.sitemap
            sitemap.archived = False
            sitemap.save()
        return True


class SiteMapVersionManager(models.Manager):
    pass

class UserProfileManager(models.Manager):
    pass