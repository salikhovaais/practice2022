from pprint import pprint

from django.shortcuts import render
from .forms import Auth_form
from .clientW import GetWitsml
from django.http import HttpResponse
import json


def  index(request):
    auth_form = Auth_form()
    return render(request, 'index.html', {'form': auth_form})

def get_info(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        witsml = GetWitsml(data['url'], data['login'], data['password'])
        xml_wells = witsml.get_inform()
        for well in xml_wells:
            wellbores = witsml.get_inform(type = 'wellbore', uid_well = well['attr']['uid'])
            if len(wellbores) > 0:
                for wellbore in wellbores:
                    logs = witsml.get_inform(type = 'log', uid_wellbore= wellbore['attr']['uid'])
                    wellbore.update({'logs': logs})
            well.update({"wellbores": wellbores})
        return HttpResponse(json.dumps(xml_wells), content_type="application/json")