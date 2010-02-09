from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    #ADMIN
    (r'^eoa/admin/', include(admin.site.urls)),

    #LOGIN
    (r'^eoa/login/', 'eoa.views.login'),
    (r'^eoa/logout/', 'eoa.views.logout'),
    (r'^eoa/register/', 'eoa.views.register'),

    (r'^eoa/move/', 'eoa.views.move'),
    (r'^eoa/index/', 'eoa.views.index'),
    (r'^eoa/', 'eoa.views.index'),
    
)

if settings.DEBUG:
    urlpatterns += patterns('',
    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    )
