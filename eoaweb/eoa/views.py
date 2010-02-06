from django.http import *

def move(request):
    try:
        pos_x = request.GET['x']
        pos_y = request.GET['y']
        res = "var x = " + pos_x + "; var y= " + pos_y + ";"
    except:
        res = 'Error'
        
    return HttpResponse(res)