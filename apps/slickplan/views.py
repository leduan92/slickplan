# -*- coding: utf-8 -*-
import json
import mimetypes
import random
import socket
import string
from io import StringIO

from allauth.account.forms import ResetPasswordForm
from django.contrib.auth.decorators import login_required
from django.contrib.sites.shortcuts import get_current_site
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.template.context import RequestContext
from django.utils import formats
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import views as auth_views

from .forms import *
from .models import *


@login_required()
@csrf_exempt
def dashboard(request):
    user = request.user
    user_slick = user.userslick
    order = dict()
    order['name'] = {'current': 'asc', 'next': 'desc'}

    sitemaps = SiteMap.objects.filter(owner=user_slick, archived=False)  # owner y userlist

    if request.POST:
        response = dict()
        params = request.POST.copy()
        params_json = {}
        for str in params:
            print()
            io = StringIO(str)
            params_json = json.load(io)

        if 'order' in params_json:
            order_list = params_json['order']
            field = order_list[0]
            direction = order_list[1]
            direction_inverse = {'asc': 'desc', 'desc': 'asc'}
            order[field] = {'current': direction, 'next': direction_inverse[direction]}
            if direction == 'desc':
                field = '-' + field
            sitemaps = sitemaps.order_by(field)

        if 'archive' in params_json:
            sitemap_version_id_list = params_json['archive']
            SiteMapManager.archive(sitemap_version_id_list)
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'delete' in params_json:
            sitemap_version_ids = params_json['delete']
            sitemap_versions = SiteMapVersion.objects.filter(id__in=sitemap_version_ids)
            delete_here = True
            versions = []
            for sitemap_version in sitemap_versions:
                if sitemap_version.has_brothers():
                    delete_here = False

                sitemap_version_all = sitemap_version.get_brothers()
                for sitemap_version_b in sitemap_version_all:
                    version_info = {
                        'id': sitemap_version_b.id,
                        'title': sitemap_version_b.sitemap.name,
                        'version': sitemap_version_b.name.__str__(),
                        'author': sitemap_version_b.sitemap.owner.user.username,
                    }
                    versions.append(version_info)

            if delete_here:
                for sitemap_version in sitemap_versions:
                    sitemap_version.delete()
            else:
                response['versions'] = versions

            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'deleteversion' in params_json:
            sitemap_versions_id = params_json['deleteversion']
            SiteMapVersion.objects.filter(id__in=sitemap_versions_id).delete()
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'search' in params_json:
            sitemaps = sitemaps.filter(name__contains=params_json['search'])

        if 'form' in params_json:
            form_values = params_json['form']
            site_map_params = dict()
            site_map_params['owner'] = user_slick
            site_map_params['name'] = form_values['name']
            site_map = SiteMap.objects.create(**site_map_params)
            site_map.save()

            site_map_version_params = dict()
            site_map_version_params['sitemap'] = site_map
            site_map_version_params['name'] = form_values['version']
            site_map_version = SiteMapVersion.objects.create(**site_map_version_params)
            site_map_version.save()

            response['success'] = 1
            response['redirect'] = reverse('slickplan:slickplan_sitemap_edit', kwargs={'id': site_map_version.id})
            json_data = json.dumps(response)
            return HttpResponse(json_data)

    data = {
        'sitemaps': sitemaps,
        'order': order,
    }
    return render_to_response('slickplan/dashboard.html', data, context_instance=RequestContext(request))


@login_required()
@csrf_exempt
def dashboard_archived(request):
    user = request.user
    user_slick = user.userslick

    sitemaps = SiteMap.objects.filter(owner=user_slick, archived=True)

    if request.POST:
        response = dict()
        params = request.POST.copy()
        params_json = {}
        for str in params:
            print()
            io = StringIO(str)
            params_json = json.load(io)

        if 'unarchive' in params_json:
            sitemap_version_id_list = params_json['unarchive']
            SiteMapManager.unarchive(sitemap_version_id_list)
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'delete' in params_json:
            site_maps = params_json['delete']
            sitemaps.filter(id__in=site_maps).delete()
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'search' in params_json:
            sitemaps = sitemaps.filter(name__contains=params_json['search'])

        if 'form' in params_json:
            form_values = params_json['form']
            site_map_params = dict()
            site_map_params['owner'] = user_slick
            site_map_params['name'] = form_values['name']
            site_map = SiteMap.objects.create(**site_map_params)
            site_map.save()

            site_map_version_params = dict()
            site_map_version_params['sitemap'] = site_map
            site_map_version_params['name'] = form_values['version']
            site_map_version = SiteMapVersion.objects.create(**site_map_version_params)
            site_map_version.save()

            response['success'] = 1
            response['redirect'] = reverse('slickplan:slickplan_sitemap_edit', kwargs={'id': site_map_version.id})
            json_data = json.dumps(response)
            return HttpResponse(json_data)

    data = {
        'sitemaps': sitemaps,
    }
    return render_to_response('slickplan/dashboard_archived.html', data, context_instance=RequestContext(request))


@login_required()
@csrf_exempt
def sitemap_edit(request, id):
    try:
        host = ''.join(['http://', request.META['HTTP_HOST']])
    except:
        host = 'http://localhost'

    print(request.META)
    user = request.user
    user_slick = user.userslick

    sitemap_version = get_object_or_404(SiteMapVersion, id=id,
                                        sitemap__owner=user_slick)  # owner o de la lista de usuarios...verificar eso
    # sitemap_versions = SiteMapVersion.objects.filter(sitemap__owner__username=user.username, archived=False)
    sitemaps = SiteMap.objects.filter(owner=user_slick, archived=False)
    sitemap = sitemap_version.sitemap
    comments = sitemap_version.comments.filter(reply=None)

    slickplan_lock = {}

    # if sitemap.status == SITEMAP_STATUS_CHOICE.LOCKED:
    #     slickplan_lock['type'] = "error"
    #     slickplan_lock['message'] = "This sitemap has been locked <a href=\"#\" id=\"action-unlock\"><i class=\"fa fa-unlock\"><\/i> Unlock<\/a>"
    # if sitemap.status == SITEMAP_STATUS_CHOICE.APPROVED:
    #     slickplan_lock['type'] = "success"
    #     slickplan_lock['message'] = 'This sitemap has been approved <a href=\"#\" id=\"action-unlock\"><i class=\"fa fa-unlock\"><\/i> Unlock<\/a>'


    sitemap_blank = '{\"svgmainsection\":{\"data\":{\"section\": \"svgmainsection\"},\"options\":{},\"cells\":[]}}'
    sitemap_json_params = sitemap_version.description.replace("'", '\"') \
        .replace("False", 'false') \
        .replace("True", 'true') \
        if sitemap_version.description != None else sitemap_blank
    sitemap_json = json.loads(sitemap_json_params)

    sitemap_group_params = sitemap_version.groups.replace("'", '\"') \
        .replace("False", 'false') \
        .replace("True", 'true') \
        if sitemap_version.groups != None else "{}"
    sitemap_json_gruops = json.loads(sitemap_group_params)

    sitemap_data = []
    page_count = len(sitemap_json["svgmainsection"]["cells"])

    for key, value in sitemap_json.items():
        inner_data = {}
        inner_data['sitemap_key'] = key
        inner_data['cells'] = json.dumps(value['cells'] if "cells" in value.keys() else {})
        inner_data['data'] = json.dumps(value['data'] if "data" in value.keys() else {})
        inner_data['options'] = json.dumps(value['options'] if "options" in value.keys() else {})
        sitemap_data.append(inner_data)

    data = {
        'id': id,
        'sitemap_version': sitemap_version,
        'sitemap_data': sitemap_data,
        'sitemap_groups': json.dumps(sitemap_json_gruops),
        'page_count': page_count,
        'sitemaps': sitemaps,
        'sitemap': sitemap,
        'comments': comments,
        'slickplan_lock': slickplan_lock,
        'editdisabled': 'editdisabled' if (sitemap.is_locked()) else '',
    }

    if request.POST:
        response = dict()
        params = request.POST.copy()
        print(params)
        params_json = {}
        if request.FILES:
            if "sitemap_logo[file]" in params.keys() or "sitemap_logo[text]" in params.keys():
                params_json['sitemap_logo'] = {'type': 'file'}
            if not "sitemap_logo[file]" in params.keys() or not "sitemap_logo[text]" in params.keys():
                params_json['save_mockups'] = {'name': params['name']}
        else:
            for str in params:
                io = StringIO(str)
                params_json = json.load(io)

        if 'change' in params_json:
            sitemap.name = params_json['change']['name']
            sitemap.save()

            if 'structure' in params_json['change']:
                site_map_version_params = dict()
                site_map_version_params['sitemap'] = sitemap
                site_map_version_params['description'] = params_json['change']['structure']
                site_map_version_params['name'] = params_json['change']['version']
                site_map_version_params['logo'] = sitemap_version.logo
                site_map_version_params['logo_text'] = sitemap_version.logo_text
                site_map_version = SiteMapVersion.objects.create(**site_map_version_params)
                site_map_version.save()
                response['redirect'] = reverse('slickplan:slickplan_sitemap_edit', kwargs={'id': site_map_version.id})

            response['success'] = 1
            response['title'] = sitemap.name
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'sitemap' in params_json:
            sitemap_version.description = params_json['sitemap']
            sitemap_version.save()
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'groups' in params_json:
            sitemap_version.groups = params_json['groups']
            sitemap_version.save()
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'clone' in params_json:
            site_map_params = dict()
            site_map_params['owner'] = user_slick
            site_map_params['status'] = sitemap.status
            site_map_params['description'] = sitemap.description
            site_map_params['name'] = params_json['clone']['name']
            site_map = SiteMap.objects.create(**site_map_params)
            site_map.save()

            site_map_version_params = dict()
            site_map_version_params['sitemap'] = site_map
            site_map_version_params['description'] = params_json['clone']['structure']
            site_map_version_params['logo'] = sitemap_version.logo
            site_map_version_params['logo_text'] = sitemap_version.logo_text
            site_map_version = SiteMapVersion.objects.create(**site_map_version_params)
            site_map_version.save()

            response['success'] = 1
            response['redirect'] = reverse('slickplan:slickplan_sitemap_edit', kwargs={'id': site_map_version.id})
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'commentview' in params_json:
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'sitemap_unlock' in params_json:
            sitemap.status = SITEMAP_STATUS_CHOICE.ACTIVE
            sitemap.save()

            response['success'] = 1
            response['redirect'] = sitemap_version.id
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'sitemap_approve' in params_json:
            sitemap.status = SITEMAP_STATUS_CHOICE.APPROVED
            sitemap.save()

            response['success'] = 1
            response['redirect'] = sitemap_version.id
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'sitemap_lock' in params_json:
            sitemap.status = SITEMAP_STATUS_CHOICE.LOCKED
            sitemap.save()

            response['success'] = 1
            response['redirect'] = sitemap_version.id
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'comment' in params_json:
            # me falta verificar que devolver cuando se envia un mensaje con file y como cargar los mensaje sde los ficheros del mockups
            comment_params = dict()
            comment_params['owner'] = user_slick
            comment_params['sitemap_version'] = sitemap_version
            if 'reply' in params_json:
                comment_params['reply'] = params_json['reply']
            if 'cell_data_id' in params_json:
                if Comment.objects.filter(file_cell__pk=params_json["cell_data_id"]).count() == 0:
                    comment_params['file_cell'] = get_object_or_404(SiteMapFileCell, pk=params_json["cell_data_id"])
                    comment = Comment.objects.create(**comment_params)
                    comment.save()
                    comment_params['reply'] = comment.pk
                else:
                    comment_params['reply'] = Comment.objects.get(file_cell__pk=params_json["cell_data_id"]).pk

            comment_params['file_cell'] = None
            comment_params['comment'] = params_json['comment']
            comment = Comment.objects.create(**comment_params)
            comment.save()

            return render_to_response('slickplan/comment.html', data, context_instance=RequestContext(request))

        if 'deletecomment' in params_json:
            id_comment = params_json['deletecomment']
            comment = Comment.objects.get(id=id_comment)
            comment.delete()
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'sitemap_logo' in params_json:
            sitemap_logo = params_json['sitemap_logo']
            response['success'] = 1
            if request.FILES:
                sitemap_version.logo = request.FILES['file']
                sitemap_version.logo_text = None
                sitemap_version.save()

                response['file_id'] = sitemap_version.logo.name
                response['file_path'] = sitemap_version.logo.url

            if 'type' in sitemap_logo:
                if sitemap_logo['type'] == 'text':
                    sitemap_version.logo_text = sitemap_logo['text']
                    sitemap_version.logo = None
                    sitemap_version.save()

            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'deletelogo' in params_json:
            sitemap_version.logo = None
            sitemap_version.logo_text = None
            sitemap_version.save()
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'get_cell_files' in params_json:
            sitemap_id = sitemap_version.pk
            cell_id = params_json["cell_id"]

            sitemap_files = SiteMapFileCell.objects.filter(sitemap_version=sitemap_id, cell_id=cell_id)
            files = []
            for cell in sitemap_files:
                file_d = dict()
                date = cell.file.created
                url = cell.file.file.url
                file_d["id"] = cell.file.pk
                file_d["alias"] = cell.file.alias
                file_d["raw_date"] = date.strftime("%Y-%m-%d %H:%M:%S")
                file_d["date"] = date.strftime("%m/%d/%y")
                file_d["time"] = date.strftime("%I:%M %p")
                file_d["name"] = cell.file.file.name
                file_d["size"] = cell.file.file.size
                file_d["fa_icon"] = False
                file_d["file_type"] = cell.file.file_type
                file_d["mime"] = cell.file.mime
                file_d["user"] = cell.file.user.__str__()
                file_d["url_full"] = host + cell.file.file.url
                file_d["url_download"] = host + url
                file_d["url_preview"] = host + url
                file_d["url_thumb"] = host + url
                file_d["data_id"] = get_object_or_404(SiteMapFileCell, sitemap_version=sitemap_version, cell_id=cell_id,
                                                      file__alias=cell.file.alias).pk
                files.append(file_d)

            response['files'] = files
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'get_cell_files_library' in params_json:
            sitemap_id = sitemap_version
            cell_id = params_json["cell_id"]
            sitemap_files = SiteMapFile.objects.filter(sitemap_files__sitemap_version=sitemap_id).distinct()
            files = []
            host = "http://127.0.0.1:8000"
            for file in sitemap_files:
                if SiteMapFileCell.objects.filter(cell_id=cell_id, file=file,
                                                  sitemap_version=sitemap_version).count() > 0:
                    continue
                file_d = dict()
                date = file.created
                url = file.file.url
                file_d["id"] = file.pk
                file_d["alias"] = file.alias
                file_d["raw_date"] = date.strftime("%Y-%m-%d %H:%M:%S")
                file_d["date"] = date.strftime("%m/%d/%y")
                file_d["time"] = date.strftime("%I:%M %p")
                file_d["name"] = file.file.name
                file_d["size"] = file.file.size
                file_d["fa_icon"] = False
                file_d["file_type"] = file.file_type
                file_d["mime"] = file.mime
                file_d["user"] = file.user.__str__()
                file_d["url_full"] = host + file.file.url
                file_d["url_download"] = host + url
                file_d["url_preview"] = host + url
                file_d["url_thumb"] = host + url
                file_d["data_id"] = None
                files.append(file_d)

            response['success'] = 1
            response['files'] = files
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if "cell_file_details" in params_json:
            cell_id = params_json["cell_id"]
            key = params_json["cell_file_s3"]["key"]
            etag = params_json["cell_file_s3"]["etag"]

            sitemap_get_file = get_object_or_404(SiteMapFile, key=key, etag=etag)

            sitemap_cell = dict()
            sitemap_cell['sitemap_version'] = sitemap_version
            sitemap_cell["cell_id"] = cell_id
            sitemap_cell["file"] = sitemap_get_file
            SiteMapFileCell.objects.create(**sitemap_cell)

            host = "http://127.0.0.1:8000"
            file_d = dict()
            file_d["id"] = sitemap_get_file.pk
            file_d["alias"] = sitemap_get_file.alias
            file_d["raw_date"] = formats.date_format(sitemap_get_file.created, 'DATETIME_FORMAT')
            file_d["date"] = formats.date_format(sitemap_get_file.created, 'DATE_FORMAT')
            file_d["time"] = formats.date_format(sitemap_get_file.created, 'TIME_FORMAT')
            file_d["name"] = sitemap_get_file.file.name
            file_d["size"] = sitemap_get_file.file.size
            file_d["fa_icon"] = False
            file_d["file_type"] = sitemap_get_file.file_type
            file_d["mime"] = sitemap_get_file.mime
            file_d["user"] = sitemap_get_file.user.__str__()
            file_d["url_full"] = host + sitemap_get_file.file.url
            file_d["url_download"] = host + sitemap_get_file.file.url
            file_d["url_preview"] = host + sitemap_get_file.file.url
            file_d["url_thumb"] = host + sitemap_get_file.file.url
            file_d["data_id"] = get_object_or_404(SiteMapFileCell, sitemap_version=sitemap_version, cell_id=cell_id,
                                                  file__alias=sitemap_get_file.alias).pk

            response['success'] = 1
            response['file'] = file_d
            response['usage_text'] = "Using 142.16KB of 100MB"
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'get_cell_files_storage_left' in params_json:
            response['success'] = 1
            response['free_space'] = 104760550
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'save_mockups' in params_json:
            file = request.FILES['file']
            mime = mimetypes.MimeTypes().guess_type(params_json['save_mockups']['name'])[0]
            type = params_json['save_mockups']['name'].split(".")[-1]
            sitemap_file = dict()
            sitemap_file['file'] = file
            sitemap_file['file_type'] = type
            sitemap_file['mime'] = mime
            sitemap_file['user'] = user_slick
            sitemap_file["etag"] = ramdom_string()
            sitemap_file["key"] = ramdom_string() + "." + type
            sitemap_file["alias"] = ramdom_string()
            sitemap_file = SiteMapFile.objects.create(**sitemap_file)
            sitemap_file.save()

            response['success'] = 1
            host = "http://127.0.0.1:8000"
            response["etag"] = sitemap_file.etag
            response["key"] = sitemap_file.key
            response["location"] = host + sitemap_file.file.url
            response["Bucket"] = "slickplan"
            response['free_space'] = 104760550
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'assign_cell_files' in params_json:
            files_alias = params_json["assign_cell_files"]

            for a in files_alias:
                file = get_object_or_404(SiteMapFile, alias=a)
                sitemap_cell = dict()
                sitemap_cell["cell_id"] = params_json["cell_id"]
                sitemap_cell["sitemap_version"] = sitemap_version
                sitemap_cell["file"] = file
                SiteMapFileCell.objects.create(**sitemap_cell)

            files = []
            host = "http://127.0.0.1:8000"
            for a in files_alias:
                cell = get_object_or_404(SiteMapFileCell, cell_id=params_json["cell_id"], file__alias=a)
                file_d = dict()
                date = cell.file.created
                url = cell.file.file.url
                file_d["id"] = cell.file.pk
                file_d["alias"] = cell.file.alias
                file_d["raw_date"] = date.strftime("%Y-%m-%d %H:%M:%S")
                file_d["date"] = date.strftime("%m/%d/%y")
                file_d["time"] = date.strftime("%I:%M %p")
                file_d["name"] = cell.file.file.name
                file_d["size"] = cell.file.file.size
                file_d["fa_icon"] = False
                file_d["file_type"] = cell.file.file_type
                file_d["mime"] = cell.file.mime
                file_d["user"] = cell.file.user.__str__()
                file_d["url_full"] = host + cell.file.file.url
                file_d["url_download"] = host + url
                file_d["url_preview"] = host + url
                file_d["url_thumb"] = host + url
                file_d["data_id"] = get_object_or_404(SiteMapFileCell, sitemap_version=sitemap_version,
                                                      cell_id=cell.cell_id, file__alias=cell.file.alias).pk
                files.append(file_d)

            response["success"] = 1
            response['files'] = files
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'remove_cell_file' in params_json:
            cell_id = params_json["remove_cell_file"]
            remove_permanently = params_json["remove_permanently"]
            remove_comments = params_json["remove_comments"]

            file_cell = get_object_or_404(SiteMapFileCell, pk=cell_id)
            cell = file_cell.cell_id
            file_id = file_cell.file
            file_cell.delete()

            if remove_permanently:
                if SiteMapFileCell.objects.filter(file=file_id).count() == 0:
                    pass
                if SiteMapFileCell.objects.filter(cell_id=cell).count() == 0:
                    response["clear_cells"] = [cell]

                if remove_comments:
                    pass
                    """comments_have_file = Comment.objects.filter(file=file_id)
                    comments_have_file.delete()
                    file_id.delete()"""

            response["success"] = 1
            response["usage_text"] = "Using 824.16KB of 100MB"
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        if 'delete_files_permanently' in params_json:
            files_delete = params_json['delete_files_permanently']
            clear_cell = []
            for alias in files_delete:
                files_delete = SiteMapFileCell.objects.filter(file__alias=alias)
                for file_cell in files_delete:
                    cell_v = file_cell.cell_id
                    file_cell.delete()
                    if SiteMapFileCell.objects.filter(cell_id=cell_v).count() == 0:
                        clear_cell.append(cell_v)

            response["clear_cells"] = clear_cell
            response["success"] = 1
            response["usage_text"] = "Using 824.16KB of 100MB"
            json_data = json.dumps(response)
            return HttpResponse(json_data)

    return render_to_response('slickplan/sitemap_edit.html', data, context_instance=RequestContext(request))


@login_required()
@csrf_exempt
def settings(request):
    # response = dict()
    # errors = dict()
    # errors['username']= 'Ya existe'
    # errors['first_name']= 'Ya existe'
    # errors['last_name']= 'Ya existe'
    # errors['email']= 'Ya existe'
    # response['errors'] = errors
    # json_data = json.dumps(response)
    # return HttpResponse(json_data)

    if request.POST:
        if request.FILES:
            # slick_file= SlickFile()
            # slick_file.name= 'test.png'
            # slick_file.image= request.FILES['file']
            # slick_file.save()

            response = dict()
            response['success'] = 1
            response['file_id'] = 'admin.png'
            response['file_path'] = 'http://slickplan.cu:8000/media/company_logo/admin.png'
            json_data = json.dumps(response)
            return HttpResponse(json_data)

    params = request.POST.copy()
    params_json = {}
    for str in params:
        print()
        io = StringIO(str)
        params_json = json.load(io)

    # dicc = params_json['form']
    data = {}
    return render_to_response('slickplan/settings.html', data, context_instance=RequestContext(request))


@login_required()
@csrf_exempt
def users(request):
    # if request.POST:
    #     params = request.POST.copy()
    #     response = dict()
    #

    data = {}
    return render_to_response('slickplan/users.html', data, context_instance=RequestContext(request))


@login_required()
@csrf_exempt
def add_user(request):
    data = {"success":True, "msg": "Hello World"}
    json_data = json.dumps(data)
    return HttpResponse(json_data)


@login_required()
@csrf_exempt
def preferences(request):
    user = request.user
    user_slick = user.userslick

    user_form = UserPreferencesForm(instance=user_slick)
    if request.POST:
        params = request.POST.copy()
        params_json = {}
        for str in params:
            io = StringIO(str)
            params_json = json.load(io)
        user_form = UserPreferencesForm(params_json, instance=user_slick)
        if user_form.is_valid():
            user_form.save()
            response = dict()
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)
        else:
            print(user_form)

    data = {
        'form': user_form
    }
    return render_to_response('slickplan/preferences.html', data, context_instance=RequestContext(request))


@login_required()
@csrf_exempt
def company(request):
    user = request.user
    user_slick = user.userslick

    user_form = UserCompanyForm(instance=user_slick)
    if request.POST:
        if request.FILES:
            # name = request.FILES['file']
            # print(name)
            user_slick.company_logo_img = request.FILES['file']
            user_slick.save()

            response = dict()
            response['success'] = 'Company logo has been changed'
            response['file_id'] = user_slick.id
            response['file_path'] = user_slick.company_logo_img.url
            json_data = json.dumps(response)
            return HttpResponse(json_data)

        params = request.POST.copy()
        params_json = {}
        for str in params:
            print()
            io = StringIO(str)
            params_json = json.load(io)
        form = params_json['form']
        if form:
            user_form = UserCompanyForm(form, instance=user_slick)
            print(form)
            print(request.FILES)
            if user_form.is_valid():
                obj = user_form.save()
                response = dict()
                response['success'] = 1
                json_data = json.dumps(response)
                return HttpResponse(json_data)
            else:
                print(user_form)

    data = {
        'form': user_form
    }
    return render_to_response('slickplan/company.html', data, context_instance=RequestContext(request))


@login_required()
@csrf_exempt
def messages(request):
    user = request.user
    user_slick = user.userslick

    user_form = UserMessagesForm(instance=user_slick)
    if request.POST:
        params = request.POST.copy()
        user_form = UserMessagesForm(params, instance=user_slick)
        if user_form.is_valid():
            obj = user_form.save()
            response = dict()
            response['success'] = 1
            json_data = json.dumps(response)
            return HttpResponse(json_data)
        else:
            print(user_form)

    new_comment = "A new comment has been added to sitemap %sitemap% by %first_name% %last_name%:\n\n__%comment%__\n— **%first_name% %last_name%**\n\n[View this sitemap](%url%)"
    user_invitation = "Hi %first_name%,\n\nYou have been invited to the %company_name%'s Slickplan account. Please [login here](%url%).\n\nYour Username: %username%\nYour Password: %password%\n\nAfter logging in for the first time you can change your login details.\n\nThanks, %owner_name%"
    user_invitation_role = "Hi %first_name%,\n\nYou have been invited to %role% the sitemap %sitemap%. Please [login here](%url%).\n\nThanks, %owner_name%"
    user_invitation_permission = "Hi %first_name%,\n\nYou have been given %permission% permissions to the sitemap %sitemap%. Please [login here](%url%).\n\nThanks, %owner_name%"
    user_invitation_role_permission = "Hi %first_name%,\n\nYou have been invited to %role% the sitemap %sitemap%. You have also been given %permission% permissions. Please [login here](%url%).\n\nThanks, %owner_name%"
    approved_sitemap = "Hi %first_name%,\n\nThe sitemap %sitemap% has been approved by %user%.\n\nPlease [login here](%url%)."
    request_unlock = "Hi %first_name%,\n\nA(n) %role% on your team, %user%, is requesting that the sitemap %sitemap% be unlocked.\n\nThis may affect the sitemap's approval status.\n\nPlease [login here](%url%)."
    sitemap_unlocked = "Hi %first_name%,\n\nThe sitemap %sitemap% you approved has be unlocked by %user%.\n\nThis has affected %sitemap% sitemap's approval status.\n\nPlease consult your team as the sitemap will need to be a approved again.\n\nPlease [login here](%url%)."

    data = {
        'form': user_form,
        'new_comment': new_comment,
        'user_invitation': user_invitation,
        'user_invitation_role': user_invitation_role,
        'user_invitation_permission': user_invitation_permission,
        'user_invitation_role_permission': user_invitation_role_permission,
        'approved_sitemap': approved_sitemap,
        'request_unlock': request_unlock,
        'sitemap_unlocked': sitemap_unlocked,
    }
    return render_to_response('slickplan/messages.html', data, context_instance=RequestContext(request))


# def get_keys(post, key, get_empty_values=False):
#     result = {}
#     if post:
#         import re
#         patt = re.compile('^([a-zA-Z_]\w+)\[([a-zA-Z_\-][\w\-]*)\]$')
#         # patt = re.compile('^([a-zA-Z_]\w+)(\[([a-zA-Z_\-][\w\-]*)\])*$')
#         for post_name, value in post.items():
#             value = post[post_name]
#             match = patt.match(post_name)
#             # if not match or not value:
#             if not match:
#                 continue
#             if not get_empty_values and not value:
#                 continue
#
#             name = match.group(1)
#             if name == key:
#                 k = match.group(2)
#                 result.update({k: value})
#     return result


@login_required()
@csrf_exempt
def feedback(request):
    user = request.user
    user_slick = user.userslick
    if request.POST:
        params = request.POST.copy()
        params['owner'] = user_slick.id
        feedback_form = FeedbackForm(params)
        if feedback_form.is_valid():
            obj = feedback_form.save()
        else:
            print(feedback_form)
    response = dict()
    response['success'] = 1
    json_data = json.dumps(response)
    return HttpResponse(json_data)


@csrf_exempt
def ajax_ping(request):
    if request.POST:
        response = dict()
        params = request.POST.copy()

        response['_nonce'] = 12345678
        response['success'] = 12345678

        json_data = json.dumps(response)
        return HttpResponse(json_data)
    else:
        return HttpResponse()


def help(request):
    return HttpResponse()


def ramdom_string(size=32):
    return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(size))
