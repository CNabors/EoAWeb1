from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    #ADMIN
    (r'^admin/', include(admin.site.urls)),

    #LOGIN
    (r'^login/', 'eoa.views.login'),
    (r'^logout/', 'eoa.views.logout'),
    (r'^register/', 'eoa.views.register'),

    (r'^move/', 'eoa.views.move'),
    (r'^index/', 'eoa.views.index'),
    
)

if settings.DEBUG:
    urlpatterns += patterns('',
    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    )
