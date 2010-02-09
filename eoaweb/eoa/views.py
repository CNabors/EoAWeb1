"""==========================================================================
views.py

contains all our view functions
============================================================================="""
"""----------------------------------------
Imports

Here we import the majority of modules we'll need for most the views.  Some 
views may have more imports they need specifically, but most views will simply
import this module and have access to all the modules imported below.

It isn't always a good idea to import *, but we want to be sure we catch all
django modules and we can overwrite in individual view files if necessary
-------------------------------------------"""
#Django Imports
from django.shortcuts import *
from django.http import *
from django.template import *

#Django auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login as django_login
from django.contrib.auth import authenticate as django_authenticate
from django.contrib.auth import logout as django_logout
from django.contrib.auth.models import User
from django.contrib.auth.forms import *

from django.forms.models import modelformset_factory
from django.core.mail import EmailMessage, SMTPConnection, send_mail

#Our util imports
from util import *

#Nyimi application imports
from eoaweb.eoa.models import *

#other python imports
import operator, cgi, re, datetime, string, random




'''========================================================================

Functions

==========================================================================='''
def move(request):
    try:
        dir = cgi.escape(request.POST['dir'])
    except:
        res = 'error'

    return HttpResponse(res)
 
@render_to('eoa/base.html')
def index(request):
    return {'account_name':request.user.username}


'''----------------------
AUTH FUNCTIONS
-------------------------'''
def login(request):
    '''Take in a username and password, check it against DB'''

    username = cgi.escape(request.POST['username'])
    password = cgi.escape(request.POST['password'])

    #Return an user object if the username and password match
    user = django_authenticate(username=username, password=password)
    if user is not None:
        django_login(request, user)

    return HttpResponse(user.email)

def logout(request):
    """Logouts the user by calling django's biult in logout function"""
    
    django_logout(request)

    return HttpResponse('Logged out')

def register(request):
    """Register a user account"""

    username = cgi.escape(request.POST['username'])
    email = cgi.escape(request.POST['email'])
    password = cgi.escape(request.POST['password'])
    character_color = cgi.escape(request.POST['color'])

    res = 'Account created successfully!'
    
    #creates a user
    new_user = User.objects.create_user(username, email, password) 
    new_user.save()

    #creates a character
    new_character = Character(name=username, pos_x=0, pos_y=0, 
                        color=character_color, account=new_user)
    new_character.save()

    return HttpResponse(res)
