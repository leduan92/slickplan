from django.shortcuts import get_object_or_404, render_to_response, redirect
from django.template import RequestContext
from django.http import HttpResponse, JsonResponse
from django.core.urlresolvers import reverse
from plataforma.forms import LoginForm
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from slickplan.models import UserSlick
from django.contrib.auth.models import User
# from plataforma.forms import MyRegistrationForm
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_protect
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
import pdb


def _is_valid_email(email):
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False


def login_page(request):
    message = None
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = request.POST['username']
            password = request.POST['password']
            if _is_valid_email(username):
                user = User.objects.filter(email=username).first()
                if user:
                    username = user.username
                else:
                    username = None
            # import pdb
            # pdb.set_trace()
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    message = "Se ha loggeado de correctamente"
                    if request.GET.get('next'):
                        return HttpResponseRedirect(request.GET.get('next'))
                    return redirect('slickplan:slickplan_home')
                else:
                    message = "Su usuario esta inactivo"
            else:
                message = "Nombre de usuario y/o contraseña incorrectos. Por favor vuelva a intentarlo"
    else:
        form = LoginForm()
    return render_to_response('login.html', {'message': message, 'form': form},
                              context_instance=RequestContext(request))


@csrf_protect
def registro(request):
    args = {}
    args.update(csrf(request))
    if request.method == 'POST':
        form = MyRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/login')
        else:
            args['form'] = form
    else:
        args['form'] = MyRegistrationForm()

    return render_to_response('registro/index.html', args)


def home(request):
    return render_to_response('frontend/index.html', {})


def logout_view(request):
    logout(request)
    return redirect('slickplan:slickplan_home')
