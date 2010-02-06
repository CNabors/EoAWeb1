from django.http import *
from util import *

def move(request):
    try:
        pos_x = request.GET['x']
        pos_y = request.GET['y']
        res = "var x = " + pos_x + "; var y= " + pos_y + ";"
    except:
        res = 'error'

    return HttpResponse(res)
    
@render_to('eoa/base.html')
def index(request):
    return {}