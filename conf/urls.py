from django.conf import settings
from django.conf.urls import patterns, include, url

from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from django.contrib.auth import views

admin.autodiscover()

urlpatterns = [
                  # User management
                  # url(r'^$', 'plataforma.views.login_page', name="homepage_login"),
                  url(r'^$', 'plataforma.views.home', name="homepage"),
                  url(r'^admin/', include(admin.site.urls)),
                  url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
                  url(r'^login/$', 'plataforma.views.login_page', name="login"),
                  url(r'^logout/$', 'plataforma.views.logout_view', name="logout"),
                  url(r'^app/', include('slickplan.urls', namespace="slickplan")),
                  url(r'^password_reset/$', views.password_reset,
                      {'template_name': 'registro/password_reset.html', 'post_reset_redirect': 'login'}, name='password_reset'),
                  # url(r'^password_reset/done/$', views.password_reset_done, name="password_reset_done"),
                  url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
                      views.password_reset_confirm, name='password_reset_confirm'),
                  url(r'^reset/done/$', views.password_reset_complete, name='password_reset_complete'),
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += staticfiles_urlpatterns()

"""
if settings.DEBUG:
   # This allows the error pages to be debugged during development, just visit
   # these url in browser to see how these error pages look like.
   urlpatterns += [
       url(r'^400/$', default_views.bad_request),
       url(r'^403/$', default_views.permission_denied),
       url(r'^404/$', default_views.page_not_found),
       url(r'^500/$', default_views.server_error),
   ]
   """
