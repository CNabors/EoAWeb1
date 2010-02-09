from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    ###=======================================================================
    ###    Base Pages
    ###=======================================================================
    #ADMIN
    (r'^admin/', include(admin.site.urls)),
    
    #Index Page
    (r'^index/', 'eoa.views.index'),

    #Login Page
    (r'^login/', 'eoa.views.login_page'),
    
    ###=======================================================================
    ###    Account Functions    
    ###=======================================================================
    #-------------------------------------
    #User account functions
    #-------------------------------------
    (r'^account_login/', 'eoa.views.login'),
    (r'^account_logout/', 'eoa.views.logout'),
    (r'^account_register/', 'eoa.views.register'),

    ###=======================================================================
    ###    Game Functions    
    ###=======================================================================
    #-------------------------------------
    #       Movement
    #-------------------------------------
    (r'^move/', 'eoa.views.move'),

    
)

if settings.DEBUG:
    urlpatterns += patterns('',
    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    )
