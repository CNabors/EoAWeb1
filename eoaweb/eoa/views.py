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

Pages

==========================================================================='''

@render_to('eoa/base.html')
def index(request):
    """Renders the index page if user is logged in, game lives here"""

    #See if user is logged in
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/eoa/login')
   
    return {}

@render_to('eoa/login.html')
def login_page(request):
    """Renders the Login page"""

    return {}


'''========================================================================

Functions

==========================================================================='''
"""-----------------
Information related
--------------------"""

def get_character_info(request):
    """Returns some character information for the logged in character"""
    
    #Set the character's color
    character = Character.objects.get(account=request.user)
    character_color = character.color
    character_pos_x = character.pos_x
    character_pos_y = character.pos_y

    #Build a javascript string with some info
    res = "var character_color = '#" + character_color + "';"
    res += "var character_pos_x = '" + str(character_pos_x) + "px' ;"
    res += "var character_pos_y = '" + str(character_pos_y) + "px' ;"

    return HttpResponse(res)

def heartbeat(request):
    """Returns a list of logged in users"""

    characters = Character.objects.all()

    #Set the current time
    now = datetime.datetime.now()

    #Subtract the delay of the request made to this function
    time_test = now - datetime.timedelta(minutes=2)
    
    messages = ServerLog.objects.filter(message_time__gte=time_test)

    #Create a list of active characters
    active_characters = []

    #Get only active characters - do this better...
    for i in characters:
        if i.last_update > time_test:
            active_characters.append(i)

    res = "var char_array = [];\n"

    for i in active_characters:
        if i.name != request.user.username:
            #Don't count characters attached to the logged in user
            res += "char_array.push(['" + i.name + "', '" + str(i.pos_x) +\
                            "', '" + str(i.pos_y) + "','" + i.color +\
                            "']);\n"

            
        
    return HttpResponse(res)   

"""-----------------
Character functions
--------------------"""
def move(request):
    #Get the direction
    dir = cgi.escape(request.POST['dir'])
    
    #Get the character associated with the user
    char = Character.objects.get(account=request.user)
    
    #move_amount is how much to move the character
    #   this should be calculated based off db (run speed of character)
    move_amount = 5

    #Update the stored position
    #Because our coordinate system starts at 0,0 in the top left, when the 
    #   character presses up they are decreasing their position in the y dir
    if dir == 'up':
        char.pos_y -= move_amount
    elif dir == 'down':
        char.pos_y += move_amount
    elif dir == 'right':
        char.pos_x += move_amount
    elif dir == 'left':
        char.pos_x -= move_amount

    char.connected = True

    #Save the character position
    char.save()
   
    #Return the x or y position based on direction passed in
    #   Used mainly for debugging
    if dir == 'up' or dir == 'down':
        res = "x:%s" % (char.pos_y)

    if dir == 'left' or dir == 'right':
        res = "x:%s" % (char.pos_x)

    return HttpResponse(res)

"""-----------------
Chat related
--------------------"""
def chat_heartbeat(request):
    """Grabs the last message from the server"""

    #Set the current time
    now = datetime.datetime.now()

    #Subtract the delay of the request made to this function
    time_test = now - datetime.timedelta(seconds=.5)
    
    #Get all the messages that haven't been sent
    messages = ServerLog.objects.filter(message_time__gte=time_test)

    #Build response string
    res = "var chat_messages = ''"

    if len(messages) > 0:
        res = "var chat_messages = new Array();\n"

        for i in messages:
            cur_character = Character.objects.get(account=i.author)
            cur_character_color = cur_character.color
            #Loop through all returned messages
            res += "chat_messages.push(['" + i.author.username + "', '" + \
                                        i.message + "', '" + \
                                        cur_character_color + "']);\n"

    res += "//%s" % (time_test)

    return HttpResponse(res)

def chat_send_message(request):
    """Updates the ServerLog"""
    
    #Get the message sent
    sent_message = cgi.escape(request.POST['sent_message'])

    #Create a new ServerLog object
    new_message = ServerLog(author=request.user, message=sent_message)
    new_message.save()

    #setup a respone
    res = 'Success'

    return HttpResponse(res)
    

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
        #return HttpResponseRedirect('/eoa/index')

    #Create an empty response string
    res = 'Success'

    return HttpResponse(res)



def logout(request):
    """Logouts the user by calling django's biult in logout function"""
    
    django_logout(request)
    return HttpResponseRedirect('/eoa/index/')

def register(request):
    """Register a user account"""

    username = cgi.escape(request.POST['username'])
    email = cgi.escape(request.POST['email'])
    password = cgi.escape(request.POST['password'])

    #Get and set the character's color
    character_color = cgi.escape(request.POST['color'])
    character_color = character_color.replace('#','')
    character_color = character_color[0:6]

    res = 'Account created successfully!'
    
    #creates a user
    new_user = User.objects.create_user(username, email, password) 
    new_user.save()

    #creates a character
    new_character = Character(name=username, pos_x=0, pos_y=0, 
                        color=character_color, account=new_user)
    new_character.save()

    return HttpResponse(res)
