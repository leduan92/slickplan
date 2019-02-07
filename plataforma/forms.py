from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from slickplan.models import UserSlick
import uuid, pdb

class LoginForm(forms.Form):
	username = forms.CharField()
	password = forms.CharField(widget=forms.PasswordInput())

# class MyRegistrationForm(UserCreationForm):
#     company = forms.CharField(
#     	required = True,
#     	widget=forms.TextInput(attrs={'class': "form-control"}))
#     username = forms.CharField(
#     	required = True,
#     	widget=forms.TextInput(attrs={'class': "form-control"}))
#     first_name = forms.CharField(
#     	required = True,
#     	widget=forms.TextInput(attrs={'class': "form-control"}))
#     last_name = forms.CharField(
#     	required = True,
#     	widget=forms.TextInput(attrs={'class': "form-control"}))
#     email = forms.CharField(
#     	required = True,
#     	widget=forms.TextInput(attrs={'class': "form-control"}))
#     password1 = forms.CharField(
#     	required = True,
#     	widget=forms.PasswordInput(attrs={'class': "form-control"}))
#     password2 = forms.CharField(
#     	required = True,
#     	widget=forms.PasswordInput(attrs={'class': "form-control"}))

#     class Meta:
#         model = User
#         fields = ('last_name', 'first_name', 'username', 'email', 'password1', 'password2')

#     def save(self, commit = True):
#         user = super(UserCreationForm, self).save(commit = False)
#         user.set_password(self.cleaned_data["password1"])
#         if not self.instance.id:
#             user.save()
#             cuenta = Cuenta(nombre=self.cleaned_data["company"], owner=user)
#             cuenta.save()
#             profile = Perfil(usuario=user, cuenta=cuenta, clave_publica = uuid.uuid4(), rol="A")
#             profile.save()
#             user.cuenta = cuenta
#         else:
#             profile = user.perfil
#             profile.estado = 'A'
#             profile.save()
#             user.is_active = True
#         user.save()
#         return user