# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from django.conf import settings
from conf.settings import base as setting
from django.core.urlresolvers import reverse
from .managers import *
from django.contrib.auth.models import User
from .choices import SITEMAP_STATUS_CHOICE


class UserSlick(TimeStampedModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    user_list = models.ManyToManyField('self', through='Userlist', symmetrical=False)

    # user_type=9//Administrator Account

    #region preferences
    autosave = models.BooleanField(_('Auto Save'), default=True)
    warn_before_leaving_page = models.BooleanField(_('Warn Before Leaving Page'), default=False)
    new_comment_nofity = models.BooleanField(_('Email Me When A Comment Is Added'), default=False)
    sitemap_label_regular_case = models.BooleanField(_('Use Regular Case Text on Cells'), default=True)
    cells_numbering = models.BooleanField(_('Automatically Number Cells'), default=False)
    show_company_header = models.BooleanField(_('Show Company Header on Shared Sitemaps'), default=False)
    basecamp_enabled = models.BooleanField(_('basecamp enabled'), default=False)
    basecamp_version = models.BooleanField(_('basecamp version'), default=False)
    basecamp_auth_key = models.CharField(_('basecamp auth key'), max_length=40, blank=True)
    basecamp_domain = models.TextField(_('basecamp domain'), default=None, blank=True, null=True)
    #endregion

    #region company
    company_name = models.TextField(_('Company Name'), default='Slickplan')
    company_name_2 = models.TextField(_('Company Name 2'), default=None, blank=True, null=True)
    subdomain = models.TextField(_('Company URL'), default=None, blank=True, null=True)
    billing_address = models.TextField(_('Billing Address'), default=None, blank=True, null=True)
    site_color = models.CharField(_('Site Color'), max_length=6, default='008DF5')
    company_logo_type = models.BooleanField(_('Use company name'), default=False)
    company_logo_img = models.FileField(upload_to='slickplan/company_logo', default='slickplan/company_logo/default-logo.png')
    dark_font = models.BooleanField(_('Use dark text'), default=False)

    #endregion

    #region messages
    new_comment = models.TextField(_('New Comment Notification'), default=None, blank=True, null=True)
    user_invitation = models.TextField(_('New User Confirmation'), default=None, blank=True, null=True)
    user_invitation_role = models.TextField(_('User Invitation to Sitemap (with role)'), default=None, blank=True, null=True)
    user_invitation_permission = models.TextField(_('User Invitation to Sitemap (with permission)'), default=None, blank=True, null=True)
    user_invitation_role_permission = models.TextField(_('User Invitation to Sitemap (with role and permission)'), default=None, blank=True, null=True)
    approved_sitemap = models.TextField(_('Sitemap Approval'), default=None, blank=True, null=True)
    request_unlock = models.TextField(_('Unlock Sitemap Request'), default=None, blank=True, null=True)
    sitemap_unlocked = models.TextField(_('Unlocked Sitemap Approval'), default=None, blank=True, null=True)
    #endregion

    def __str__(self):
        return self.user.username

    # def get_absolute_url(self):
    #     return reverse('users:detail', kwargs={'username': self.username})

    def get_avatar(self):
        import os.path
        avatar = setting.MEDIA_URL + 'avatars/' + self.user.username + '.png'
        root = setting.SITE_ROOT
        path = root + avatar
        if os.path.exists(path):
            return avatar
        return setting.STATIC_URL + 'slickplan/img/no-image.png'

    def get_company_logo_img(self):
        print('111')
        if self.company_logo_type:
            import os.path
            company_logo = setting.MEDIA_URL + 'company_logo/' + self.user.username + '.png'
            root = setting.SITE_ROOT
            path = root + company_logo
            if os.path.exists(path):
                return company_logo
        return setting.STATIC_URL + 'img/default-logo.png'

    def get_company_logo_img_default(self):
        print('111')
        import os.path
        company_logo = setting.MEDIA_URL + 'company_logo/' + self.user.username + '.png'
        root = setting.SITE_ROOT
        path = root + company_logo
        if os.path.exists(path):
            return company_logo
        return setting.STATIC_URL + 'img/default-logo.png'

    def my_guests(self):
        guests = User.objects.filter(guests__host=self)
        return guests.all()

    def get_label(self):
        return '%s %s' %(self.get_full_name(), self.email)

    def get_initials(self):
        return 'ABCDE'

    # def add_guest(self, guest, status):
    #     relationship, created = Userlist.objects.get_or_create(
    #         host=self,
    #         guest=guest)
    #     return relationship

    def get_company_logo(self):
        if self.company_name:
            return self.company_name
        else:
            return self.username


class Userlist(TimeStampedModel):
    host = models.ForeignKey(UserSlick, related_name='hosts')
    guest = models.ForeignKey(UserSlick, related_name='guests')

    class Meta:
        unique_together = ('host', 'guest')

    def __str__(self):
        return '%s: %s' %(self.host, self.guest )


class SiteMap(TimeStampedModel):
    owner = models.ForeignKey(UserSlick, verbose_name=_('profile'), related_name='sitemaps')
    name = models.TextField(_('name'))
    status = models.CharField(_('status'), choices=SITEMAP_STATUS_CHOICE.CHOICES, max_length=25, default=SITEMAP_STATUS_CHOICE.ACTIVE)
    archived = models.BooleanField(_('archived'), default=False)
    description = models.TextField(_('description'), default=None, blank=True, null=True)

    objects = SiteMapManager()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("SiteMap")
        verbose_name_plural = _("SiteMaps")

    def save(self, *args, **kwargs):
        super(SiteMap, self).save(*args, **kwargs)

    # def count_childs(self):
    #     return self.versions.all().count()
    # count_childs.short_description = _('Childs')
    # count_childs.allow_tags = True

    def get_first_version(self):
        versions = self.versions.all()
        return versions[0]

    def is_locked(self):
        locked = self.is_status_approved() or self.is_status_locked()
        return locked

    def is_status_approved(self):
        flag = self.status == SITEMAP_STATUS_CHOICE.APPROVED
        return flag

    def is_status_locked(self):
        flag = self.status == SITEMAP_STATUS_CHOICE.LOCKED
        return flag


class SiteMapVersion(TimeStampedModel):
    sitemap = models.ForeignKey(SiteMap, verbose_name=_('sitemap'), related_name='versions')
    name = models.FloatField(_('name'), default=1.0)
    logo = models.FileField(upload_to='slickplan/sitemap_version_logo', default=None, blank=True, null=True)
    logo_text = models.TextField(_('logo text'), default=None, blank=True, null=True)
    description = models.TextField(_('description'), default=None, blank=True, null=True)
    groups = models.TextField(_('groups'), default=None, blank=True, null=True)

    objects = SiteMapVersionManager()

    def __str__(self):
        return self.name.__str__()

    class Meta:
        verbose_name = _("SiteMapVersion")
        verbose_name_plural = _("SiteMapVersions")

    def save(self, *args, **kwargs):
        super(SiteMapVersion, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if not self.has_brothers():
            self.sitemap.delete()
        super(SiteMapVersion, self).delete(*args, **kwargs)

    def get_brothers(self):
        return self.sitemap.versions.all()

    def has_brothers(self):
        return self.get_brothers().count() > 1

    def logo_visible(self):
        return self.logo or self.logo_text


class SlickFile(TimeStampedModel):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='slickfiles')


class Feedback(TimeStampedModel):
    owner = models.ForeignKey(UserSlick, verbose_name=_('owner'), related_name='feedbacks')
    feedback = models.TextField(_('feedback'))


class FeedbackFile(TimeStampedModel):
    feedback = models.ForeignKey(Feedback, verbose_name=_('feedback'), related_name='feedback_files')
    file = models.FileField(upload_to='slickplan/feedback')


class SiteMapFile(TimeStampedModel):
    file = models.FileField(upload_to='slickplan/sitemap')
    fa_icon = models.CharField(_("fa icon"), max_length=255, default="")
    file_type = models.CharField(_("File Type"), max_length=255, default="png")
    mime = models.CharField(_("Mime"), max_length=255, default="png")
    user = models.ForeignKey(UserSlick, verbose_name=_('user'), related_name='sitemap_files')
    url_full = models.URLField()
    data_id = models.CharField(_("data Id"), max_length=255, default="1111")
    etag = models.CharField(_("Etag"), max_length=255, default="")
    key = models.CharField(_("Key"), max_length=255, default="")
    alias = models.CharField(_("Alias"), max_length=255, default="")


class SiteMapFileCell(TimeStampedModel):
    cell_id = models.CharField(_("Cell Id"), max_length=255)
    sitemap_version = models.ForeignKey(SiteMapVersion, verbose_name=_('sitemap'), related_name='sitemap_cells')
    file = models.ForeignKey(SiteMapFile, verbose_name=_('sitemap_file'), related_name='sitemap_files')


class Comment(TimeStampedModel):
    owner = models.ForeignKey(UserSlick, verbose_name=_('owner'), related_name='comments')
    file_cell = models.ForeignKey(SiteMapFileCell, verbose_name=_('file_cell'), related_name='file_cells', null=True)
    sitemap_version = models.ForeignKey(SiteMapVersion, verbose_name=_('sitemap'), related_name='comments')
    reply = models.IntegerField(_('reply'), default=None, blank=True, null=True)
    comment = models.TextField(_('description'), default=None, blank=True, null=True)

    def get_childs(self):
        return Comment.objects.filter(reply=self.id)

    def delete(self, *args, **kwargs):
        childs = self.get_childs()
        if childs:
            childs.delete()
        super(Comment, self).delete(*args, **kwargs)

