# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
from django.conf import settings
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', default=django.utils.timezone.now, editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', default=django.utils.timezone.now, editable=False)),
                ('reply', models.IntegerField(verbose_name='reply', blank=True, null=True, default=None)),
                ('comment', models.TextField(verbose_name='description', blank=True, null=True, default=None)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', default=django.utils.timezone.now, editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', default=django.utils.timezone.now, editable=False)),
                ('feedback', models.TextField(verbose_name='feedback')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='FeedbackFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', default=django.utils.timezone.now, editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', default=django.utils.timezone.now, editable=False)),
                ('file', models.FileField(upload_to='slickplan/feedback')),
                ('feedback', models.ForeignKey(verbose_name='feedback', related_name='feedback_files', to='slickplan.Feedback')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SiteMap',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', default=django.utils.timezone.now, editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', default=django.utils.timezone.now, editable=False)),
                ('name', models.TextField(verbose_name='name')),
                ('status', models.CharField(verbose_name='status', max_length=25, default='ACTIVE', choices=[('ACTIVE', 'Active'), ('APPROVED', 'Approved'), ('LOCKED', 'Locked')])),
                ('archived', models.BooleanField(verbose_name='archived', default=False)),
                ('description', models.TextField(verbose_name='description', blank=True, null=True, default=None)),
            ],
            options={
                'verbose_name': 'SiteMap',
                'verbose_name_plural': 'SiteMaps',
            },
        ),
        migrations.CreateModel(
            name='SiteMapFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', default=django.utils.timezone.now, editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', default=django.utils.timezone.now, editable=False)),
                ('file', models.FileField(upload_to='slickplan/sitemap')),
                ('fa_icon', models.CharField(verbose_name='fa icon', max_length=255, default='')),
                ('file_type', models.CharField(verbose_name='File Type', max_length=255, default='png')),
                ('mime', models.CharField(verbose_name='Mime', max_length=255, default='png')),
                ('url_full', models.URLField()),
                ('data_id', models.CharField(verbose_name='data Id', max_length=255, default='1111')),
                ('etag', models.CharField(verbose_name='Etag', max_length=255, default='')),
                ('key', models.CharField(verbose_name='Key', max_length=255, default='')),
                ('alias', models.CharField(verbose_name='Alias', max_length=255, default='')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SiteMapFileCell',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', default=django.utils.timezone.now, editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', default=django.utils.timezone.now, editable=False)),
                ('cell_id', models.CharField(verbose_name='Cell Id', max_length=255)),
                ('file', models.ForeignKey(verbose_name='sitemap_file', related_name='sitemap_files', to='slickplan.SiteMapFile')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SiteMapVersion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', default=django.utils.timezone.now, editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', default=django.utils.timezone.now, editable=False)),
                ('name', models.FloatField(verbose_name='name', default=1.0)),
                ('logo', models.FileField(blank=True, null=True, default=None, upload_to='slickplan/sitemap_version_logo')),
                ('logo_text', models.TextField(verbose_name='logo text', blank=True, null=True, default=None)),
                ('description', models.TextField(verbose_name='description', blank=True, null=True, default=None)),
                ('groups', models.TextField(verbose_name='groups', blank=True, null=True, default=None)),
                ('sitemap', models.ForeignKey(verbose_name='sitemap', related_name='versions', to='slickplan.SiteMap')),
            ],
            options={
                'verbose_name': 'SiteMapVersion',
                'verbose_name_plural': 'SiteMapVersions',
            },
        ),
        migrations.CreateModel(
            name='SlickFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', default=django.utils.timezone.now, editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', default=django.utils.timezone.now, editable=False)),
                ('name', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to='slickfiles')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Userlist',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', default=django.utils.timezone.now, editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', default=django.utils.timezone.now, editable=False)),
            ],
        ),
        migrations.CreateModel(
            name='UserSlick',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', default=django.utils.timezone.now, editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', default=django.utils.timezone.now, editable=False)),
                ('autosave', models.BooleanField(verbose_name='Auto Save', default=True)),
                ('warn_before_leaving_page', models.BooleanField(verbose_name='Warn Before Leaving Page', default=False)),
                ('new_comment_nofity', models.BooleanField(verbose_name='Email Me When A Comment Is Added', default=False)),
                ('sitemap_label_regular_case', models.BooleanField(verbose_name='Use Regular Case Text on Cells', default=True)),
                ('cells_numbering', models.BooleanField(verbose_name='Automatically Number Cells', default=False)),
                ('show_company_header', models.BooleanField(verbose_name='Show Company Header on Shared Sitemaps', default=False)),
                ('basecamp_enabled', models.BooleanField(verbose_name='basecamp enabled', default=False)),
                ('basecamp_version', models.BooleanField(verbose_name='basecamp version', default=False)),
                ('basecamp_auth_key', models.CharField(verbose_name='basecamp auth key', max_length=40, blank=True)),
                ('basecamp_domain', models.TextField(verbose_name='basecamp domain', blank=True, null=True, default=None)),
                ('company_name', models.TextField(verbose_name='Company Name', default='Slickplan')),
                ('company_name_2', models.TextField(verbose_name='Company Name 2', blank=True, null=True, default=None)),
                ('subdomain', models.TextField(verbose_name='Company URL', blank=True, null=True, default=None)),
                ('billing_address', models.TextField(verbose_name='Billing Address', blank=True, null=True, default=None)),
                ('site_color', models.CharField(verbose_name='Site Color', max_length=6, default='008DF5')),
                ('company_logo_type', models.BooleanField(verbose_name='Use company name', default=False)),
                ('company_logo_img', models.FileField(default='slickplan/company_logo/default-logo.png', upload_to='slickplan/company_logo')),
                ('dark_font', models.BooleanField(verbose_name='Use dark text', default=False)),
                ('new_comment', models.TextField(verbose_name='New Comment Notification', blank=True, null=True, default=None)),
                ('user_invitation', models.TextField(verbose_name='New User Confirmation', blank=True, null=True, default=None)),
                ('user_invitation_role', models.TextField(verbose_name='User Invitation to Sitemap (with role)', blank=True, null=True, default=None)),
                ('user_invitation_permission', models.TextField(verbose_name='User Invitation to Sitemap (with permission)', blank=True, null=True, default=None)),
                ('user_invitation_role_permission', models.TextField(verbose_name='User Invitation to Sitemap (with role and permission)', blank=True, null=True, default=None)),
                ('approved_sitemap', models.TextField(verbose_name='Sitemap Approval', blank=True, null=True, default=None)),
                ('request_unlock', models.TextField(verbose_name='Unlock Sitemap Request', blank=True, null=True, default=None)),
                ('sitemap_unlocked', models.TextField(verbose_name='Unlocked Sitemap Approval', blank=True, null=True, default=None)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
                ('user_list', models.ManyToManyField(to='slickplan.UserSlick', through='slickplan.Userlist')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='userlist',
            name='guest',
            field=models.ForeignKey(related_name='guests', to='slickplan.UserSlick'),
        ),
        migrations.AddField(
            model_name='userlist',
            name='host',
            field=models.ForeignKey(related_name='hosts', to='slickplan.UserSlick'),
        ),
        migrations.AddField(
            model_name='sitemapfilecell',
            name='sitemap_version',
            field=models.ForeignKey(verbose_name='sitemap', related_name='sitemap_cells', to='slickplan.SiteMapVersion'),
        ),
        migrations.AddField(
            model_name='sitemapfile',
            name='user',
            field=models.ForeignKey(verbose_name='user', related_name='sitemap_files', to='slickplan.UserSlick'),
        ),
        migrations.AddField(
            model_name='sitemap',
            name='owner',
            field=models.ForeignKey(verbose_name='profile', related_name='sitemaps', to='slickplan.UserSlick'),
        ),
        migrations.AddField(
            model_name='feedback',
            name='owner',
            field=models.ForeignKey(verbose_name='owner', related_name='feedbacks', to='slickplan.UserSlick'),
        ),
        migrations.AddField(
            model_name='comment',
            name='file_cell',
            field=models.ForeignKey(verbose_name='file_cell', null=True, related_name='file_cells', to='slickplan.SiteMapFileCell'),
        ),
        migrations.AddField(
            model_name='comment',
            name='owner',
            field=models.ForeignKey(verbose_name='owner', related_name='comments', to='slickplan.UserSlick'),
        ),
        migrations.AddField(
            model_name='comment',
            name='sitemap_version',
            field=models.ForeignKey(verbose_name='sitemap', related_name='comments', to='slickplan.SiteMapVersion'),
        ),
        migrations.AlterUniqueTogether(
            name='userlist',
            unique_together=set([('host', 'guest')]),
        ),
    ]
