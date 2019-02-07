from django import forms
from django.utils.translation import ugettext_lazy as _
from .models import *


class UserPreferencesForm(forms.ModelForm):
    autosave = forms.IntegerField(initial=1)
    warn_before_leaving_page = forms.IntegerField(initial=0)
    new_comment_nofity = forms.IntegerField(initial=0)
    sitemap_label_regular_case = forms.IntegerField(initial=1)
    cells_numbering = forms.IntegerField(initial=0, required=False)
    show_company_header = forms.IntegerField(initial=False)
    basecamp_enabled = forms.IntegerField(initial=0)
    basecamp_version = forms.IntegerField(initial=0, required=False)

    class Meta:
        model = UserSlick
        fields = ("autosave",
                  "warn_before_leaving_page",
                  "new_comment_nofity",
                  "sitemap_label_regular_case",
                  "cells_numbering",
                  "show_company_header",
                  "basecamp_enabled",
                  "basecamp_version",
                  "basecamp_auth_key",
                  "basecamp_domain",)
        # exclude = ()


class UserCompanyForm(forms.ModelForm):
    company_logo_type = forms.IntegerField(initial=0)
    # dark_font = forms.IntegerField(initial=0)

    class Meta:
        model = UserSlick
        fields = ("company_name",
                  "company_name_2",
                  "subdomain",
                  "billing_address",
                  "site_color",
                  "company_logo_type",
                  "dark_font")
        # exclude = ()


class UserMessagesForm(forms.ModelForm):
    # new_comment = forms.Textarea()
    # dark_font = forms.IntegerField(initial=0)

    class Meta:
        model = UserSlick
        fields = ("new_comment",
                  "user_invitation",
                  "user_invitation_role",
                  "user_invitation_permission",
                  "user_invitation_role_permission",
                  "approved_sitemap",
                  "request_unlock",
                  "sitemap_unlocked")
        # exclude = ()


class FeedbackForm(forms.ModelForm):
    class Meta:
        model = Feedback
        fields = ("feedback",
                  "owner")
        # exclude = ()
