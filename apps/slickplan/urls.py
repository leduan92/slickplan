from django.conf.urls import patterns, url, include
from . import views as slickplan_views
from django.contrib.auth import views as auth_views

urlpatterns = patterns('',
                       # url(r'^$', home, name='slickplan_home'),
                       )

urlpatterns += patterns('',
                        url(r'^$', slickplan_views.dashboard, name='slickplan_home'),
                        url(r'^dashboard/$', slickplan_views.dashboard, name='slickplan_dashboard'),
                        url(r'^dashboard/archived/$', slickplan_views.dashboard_archived, name='slickplan_dashboard_archived'),
                        url(r'^sitemap/edit/(?P<id>\w+)$$', slickplan_views.sitemap_edit, name='slickplan_sitemap_edit'),
                        url(r'^feedback/$', slickplan_views.feedback, name='slickplan_feedback'),
                        url(r'^ajax/ping/$', slickplan_views.ajax_ping, name='slickplan_ajax_ping'),
                        )

urlpatterns += patterns('',
                        url(r'^settings/$', slickplan_views.settings, name='accounts_settings'),
                        url(r'^settings/$', slickplan_views.settings, name='accounts_home'),
                        url(r'^settings/users/$', slickplan_views.users, name='accounts_users'),
                        url(r'^settings/users/new/$', slickplan_views.add_user, name='accounts_add_user'),
                        url(r'^settings/preferences/$', slickplan_views.preferences, name='accounts_preferences'),
                        url(r'^settings/company/$', slickplan_views.company, name='accounts_company'),
                        url(r'^settings/messages/$', slickplan_views.messages, name='accounts_messages'),
                        url('', include('django.contrib.auth.urls')),
                        )

urlpatterns += patterns('',
                        # url(r'^password_reset/$', auth_views.password_reset,
                        #     {'template_name': "registro/password_reset.html",
                        #      'post_reset_redirect': 'slickplan:password_reset_done'}, name='password_reset'),
                        # url(r'^forgot/$', views.forgot_password, name='accounts_forgot_password'),
                        # url(r'^reset_password/$', views.reset_password, name='accounts_reset_password')
                        )