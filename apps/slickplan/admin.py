from django.contrib import admin

from .models import *


@admin.register(UserSlick)
class UserSlickAdmin(admin.ModelAdmin):
    pass


@admin.register(Userlist)
class UserlistAdmin(admin.ModelAdmin):
     list_display = (
        'host',
        'guest',
    )


@admin.register(SiteMap)
class SiteMapAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'owner',
        'name'
    )

    list_filter = list_display


@admin.register(SiteMapVersion)
class SiteMapVersionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'sitemap',
        'name',
    )

    list_filter = list_display


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'owner',
        'sitemap_version',
        'reply',
    )

    list_filter = list_display


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'owner',
        'feedback',
    )

    list_filter = list_display