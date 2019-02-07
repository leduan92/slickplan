window.Slickplan = Slickplan = (function (i, f) {
    var k = {};

    function p(s, t, r) {
        k[s] = [t, !!r]
    }

    function b(s, r, u, t) {
        if (s !== f && k[s] !== f) {
            if (typeof k[s] !== "function" && typeof k[s][0] === "function") {
                k[s] = k[s][0](i, window.Slickplan)
            }
            if (typeof u === "string" && typeof k[s][u] === "function") {
                if (t === f) {
                    t = [r]
                }
                return k[s][u].apply(k[s][u], t)
            }
            return k[s]
        } else {
            if (r === f) {
                j("Require: not found", "error", arguments);
                return false
            } else {
                j("Require: not found, default value returned", "warn", arguments);
                return r
            }
        }
    }

    var h = i({});

    function d(r) {
        j("Subscribe:", "info", arguments);
        return h.on.apply(h, arguments)
    }

    function n(r) {
        j("Unsubscribe:", "info", arguments);
        return h.off.apply(h, arguments)
    }

    function a(r) {
        j("Publish:", "info", arguments);
        return h.trigger.apply(h, arguments)
    }

    var c = [];

    function l(r) {
        c.push(r)
    }

    function m() {
        var r = b("config", [], "get", ["route"]);
        if (!r || !r.length) {
            r = document.location.pathname.replace(/(^\/+|\/+$)/g, "").replace(/[\/]{2,}/g, "/").split("/");
            if (!r.length) {
                r = ["dashboard", "index"]
            } else {
                if (r.length === 1) {
                    r[1] = "index"
                }
            }
            if (!r[0]) {
                r[0] = "index"
            }
        }
        if (r.length === 1) {
            r[1] = "index"
        }
        i.each(k, function (v, u) {
            if (typeof u !== "function" && typeof u[1] === "boolean" && u[1] === true) {
                b(v)
            }
        });
        i.each(c, function (u, v) {
            if (typeof v === "function") {
                v(i, window.Slickplan)
            }
        });
        b("websocket", null, "setSession", [r]);
        a("before_init");
        a("before_init/" + r[0]);
        var t = "route";
        for (var s = 0; s < r.length; ++s) {
            t += "/" + r[s];
            a(t)
        }
        a("after_init");
        a("after_init/" + r[0])
    }

    function e(r, s) {
        var t = b("config", false, "get", ["permissions"]);
        if (t && t[r] !== f) {
            return s ? t[r] : true
        }
        return false
    }

    function o(s) {
        var r = b("locale");
        if (r && typeof r.get === "function") {
            return r.get.apply(r.get, arguments)
        }
        return s
    }

    var q = false;
    i(window).on("beforeunload", function () {
        a("onunload", [q])
    });
    function j(u, t) {
        var r = b("config", false, "get", ["debug"]);
        if (!r) {
            return
        }
        t = (t && t !== "info" && typeof console[t] === "function") ? t : "log";
        if (typeof console[t] === "function") {
            var s = Array.prototype.slice.call(arguments);
            s = s.slice(2);
            if (typeof s !== "object") {
                s = [s]
            }
            if (s.length < 2 && typeof s[0] !== "object") {
                s[0] = [s[0]]
            }
            s.unshift(u);
            console[t].apply(console, s)
        }
    }

    var g = i('input[type="hidden"][name="_nonce"]:first').val();
    return {
        define: p, require: b, subscribe: d, unsubscribe: n, publish: a, module: l, appInit: function (r) {
            if (r) {
                b("config", null, "set", [r])
            }
            m()
        }, init: m, log: j, __: o, websocket: function () {
            return b("websocket", null, "getSession")
        }, currentUserCan: e, noPermissions: function (r) {
            if (!r) {
                r = o('<a href="{1}">Upgrade</a> your account to use this feature', b("config", false, "get", ["payment_url", "#"]))
            }
            b("notification").error(r);
            return false
        }, updateNonce: function (r) {
            if (g !== r) {
                i('input[type="hidden"][name="_nonce"]').val(r);
                g = r
            }
        }, ignoreUnload: function (r) {
            q = !!r
        }, $window: i(window), $body: i(document.body), $main: i("#main")
    }
})(jQuery);
Slickplan.define("config", function (e, c, f) {
    var d = {};

    function b(h, g) {
        if (h === f) {
            return d
        } else {
            if (d[h] !== f) {
                return d[h]
            } else {
                if (g === f) {
                    return false
                } else {
                    return g
                }
            }
        }
    }

    function a(g, h) {
        if (typeof g === "object") {
            d = e.extend(d, g)
        } else {
            d[g] = h
        }
    }

    return {get: b, set: a}
});
Slickplan.define("locale", function (e, d, f) {
    var c = [];

    function b(h) {
        if (c.length) {
            e.each(c, function (j, i) {
                if (i.length === 2 && i[0] === h) {
                    h = i[1];
                    return false
                }
            })
        }
        if (arguments.length > 1) {
            var g = Array.prototype.slice.call(arguments).slice(1);
            h = h.replace(/\{\{|\}\}|\{(\d+)\}/g, function (i, j) {
                if (i == "{{") {
                    return "{"
                }
                if (i == "}}") {
                    return "}"
                }
                return (g[--j] !== f) ? g[j] : ""
            })
        }
        return h
    }

    function a(g) {
        if (typeof g === "object" && g.length) {
            c = g
        }
    }

    return {get: b, set: a}
});
Slickplan.define("form", function (d, c, b) {
    function f(l) {
        if (typeof l === "object" && l instanceof d) {
            var k = l[0].querySelectorAll(".tip-error")
        } else {
            if (l === true) {
                var k = document.querySelectorAll(".top-modal-tip-error")
            } else {
                var k = document.querySelectorAll(".tip-error")
            }
        }
        for (var j = 0; j < k.length; ++j) {
            if (k[j].parentNode) {
                k[j].parentNode.removeChild(k[j])
            }
        }
    }

    function g(o, m, l, k, n, j) {

        o.closest("div.modal, div.top-modal").css({overflow: "visible"}).parent().css({overflow: "visible"});
        o = d('<div class="tip-error">' + m + "</div>").appendTo(o);
        if (typeof l === "object") {
            o.css(l)
        }
        if (n) {
            n = o.width() + 7 + (typeof n === "number" ? n : 0);
            o.css({left: -n}).addClass("align-left")
        }
        if (j) {
            j = o.height() + 7 + (typeof j === "number" ? j : 0);
            o.css({left: 0, bottom: -j}).addClass("align-bottom")
        }
        if (k) {
            o.addClass(k)
        }
        return o
    }

    function i(k) {
        var l = true;
        for (var n = 0, m = k.length; n < m; ++n) {
            if (k[n] === b) {
                continue
            }
            d.each(k[n].rules, function (p, j) {
                var o = false;
                switch (p) {
                    case"empty":
                        o = (k[n].value == "");
                        break;
                    case"checked":
                        o = !((k[n].input instanceof d) ? k[n].input.is(":checked") : k[n].input.checked);
                        break;
                    case"email":
                        o = !/^([A-Za-z0-9_\-\.\+])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,64})$/.test(k[n].value);
                        break;
                    case"alnum":
                        o = !/^[a-z0-9]+$/.test(k[n].value);
                        break;
                    case"is":
                        if (k[n].value == j[0]) {
                            o = true;
                            j = j[1]
                        }
                        break;
                    case"zipcode":
                        o = !/^[0-9]{5}(\-[0-9]+)?$/.test(k[n].value);
                        break;
                    case"callback":
                        o = !j[0](k[n].value);
                        j = j[1];
                        break;
                    case"regexp":
                        o = !j[0].test(k[n].value);
                        j = j[1];
                        break;
                    case"length":
                        o = (k[n].value.length < j[0]);
                        j = j[1];
                        break
                }
                if (o) {
                    l = false;
                    g(k[n].tiperror, j, k[n].css, false, k[n].left, k[n].bottom);
                    return false
                }
            })
        }
        return l
    }

    function h(k, j) {
        return k.serializeObject(j)
    }

    function a(n) {
        var k = false;
        n = n.replace(/[^0-9]/g, "");
        if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(n)) {
            k = 1
        } else {
            if (/^5[1-5][0-9]{14}$/.test(n)) {
                k = 3
            } else {
                if (/^3[47][0-9]{13}$/.test(n)) {
                    k = 2
                } else {
                    if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(n)) {
                        k = 4
                    }
                }
            }
        }
        if (k) {
            var l = 0;
            for (var j = (2 - (n.length % 2)); j <= n.length; j += 2) {
                l += parseInt(n.charAt(j - 1))
            }
            for (var j = (n.length % 2) + 1; j < n.length; j += 2) {
                var m = parseInt(n.charAt(j - 1)) * 2;
                l += (m < 10) ? m : (m - 9)
            }
            if ((l % 10) !== 0) {
                return false
            }
        }
        return k
    }

    function e(j) {
        if (/^[^0-9a-z]{9,12}[0-9]{4}$/.test(j)) {
            return true
        }
        return a(j)
    }

    return {clearErrors: f, error: g, serializeObject: h, validate: i, ccValidation: a, ccValidationDots: e}
});
Slickplan.define("helper", function (h, e, d) {
    var m = false;
    var b = false;
    var k = false;
    var g = h(document.body);
    var c = h("#main");

    function p() {
        var r = document.querySelectorAll(".row-shadow");
        for (var q = 0; q < r.length; ++q) {
            if (r[q].parentNode) {
                r[q].parentNode.removeChild(r[q])
            }
        }
        h("#main.dashboard tr > td:first-child div.checkbox + a, #main.dashboard tr > td:first-child a.delete + a, .modal .sitemaps.table tr > td:first-child span, #main.dashboard .userrow, #main.dashboard .dashrow > a").append('<div class="row-shadow" />')
    }

    function j(q) {
        m = (q ? true : e.require("config", false, "get", ["warn_before_leave"])) && c.hasClass("sitemap");
        e.$window.on("beforeunload", function () {
            if (m) {
                b = true;
                return e.__("Are you sure you want to leave?")
            }
        })
    }

    function i() {
        var r = window, u = document, t = u.documentElement, s = g[0], q = r.innerWidth || t.clientWidth || s.clientWidth, v = r.innerHeight || t.clientHeight || s.clientHeight;
        return {width: q, height: v}
    }

    function o(s) {
        s = h.extend({
            id: null,
            title: "",
            text: false,
            on_yes: null,
            on_no: null,
            checkbox: false,
            checkboxes: [],
            close: false,
            no_label: "No",
            yes_label: "Yes"
        }, s);
        if (s.checkbox && s.id) {
            var w = e.require("http");
            var v = "slickplan_" + s.id;
            if (w.getCookie(v) === "yes") {
                if (typeof s.on_yes === "function") {
                    s.on_yes()
                }
                return true
            }
        }
        var q = h("#modal-confirm");
        q.find("form")[0].reset();
        q.find("h1 + p, div.confirm-checkbox, div.checkboxes, .close").hide();
        q.find("h1").removeClass("has-close").addClass("clearfix").children("span").html(s.title);
        if (s.text) {
            q.find("h1 + p").show().html(s.text)
        }
        if (s.checkbox) {
            q.find("div.confirm-checkbox").show()
        }
        if (s.checkboxes && s.checkboxes.length > 0) {
            var u = "";
            for (var t = 0, r = s.checkboxes.length; t < r; ++t) {
                if (s.checkboxes[t] && s.checkboxes[t].id && s.checkboxes[t].label) {
                    var x = e.require("string").random(16);
                    u += '<div class="checkbox">                        <input type="checkbox" id="' + x + '" value="' + s.checkboxes[t].id + '">                        <label for="' + x + '">' + s.checkboxes[t].label + "</label>                        </div>"
                }
            }
            if (u) {
                q.find("div.checkboxes").show().html(u)
            }
        }
        if (s.close) {
            q.find(".close").show().closest("h1").addClass("has-close")
        }
        q.find('input[type="reset"]').val(s.no_label);
        q.find('input[type="submit"]').val(s.yes_label);
        q.find(".submit > input").off().on("click", function (z) {
            z.preventDefault();
            var y = {};
            q.find("div.checkboxes input").each(function () {
                y[this.value] = this.checked
            });
            if (h(this).attr("type") === "submit") {
                if (s.checkbox && s.id) {
                    if (h("#modal-confirm-checkbox").is(":checked")) {
                        w.setCookie(v, "yes", 365)
                    }
                }
                if (typeof s.on_yes === "function") {
                    s.on_yes(q, y)
                }
            } else {
                if (typeof s.on_no === "function") {
                    s.on_no(q, y)
                }
            }
            q.dialog("close")
        });
        q.dialog("open")
    }

    function f(q, s) {
        var r = e.require("sitemap");
        s = h.extend({
            on_update: null,
            on_unlink: null,
            on_before: null,
            on_after: null,
            on_group: null,
            on_single: null
        }, s);
        var u = r.isCellInCellsGroup(q);
        if (!u) {
            if (typeof s.on_before === "function") {
                s.on_before(q)
            }
            if (typeof s.on_single === "function") {
                s.on_single(q)
            }
            if (typeof s.on_after === "function") {
                s.on_after(q)
            }
            return true
        }
        var t = h("#modal-group-warning");
        t.find("#groups-update-cell").off().on("click", function (v) {
            v.preventDefault();
            t.dialog("close");
            h("#batch-groups-scroll .group.group-" + u + " > span").trigger("click", [true]);
            if (typeof s.on_before === "function") {
                s.on_before(q)
            }
            if (typeof s.on_update === "function") {
                s.on_update(q, t)
            }
            if (typeof s.on_group === "function") {
                s.on_group(q)
            }
            if (typeof s.on_after === "function") {
                s.on_after(q)
            }
        });
        t.find("#groups-unlink-cell").off().on("click", function (w) {
            w.preventDefault();
            t.dialog("close");
            var v = (typeof q !== "string" && q.id) ? q.id : q;
            r.removeCellFromGroup(v);
            if (typeof s.on_before === "function") {
                s.on_before(q)
            }
            if (typeof s.on_unlink === "function") {
                s.on_unlink(q, t)
            }
            if (typeof s.on_group === "function") {
                s.on_group(q)
            }
            if (typeof s.on_after === "function") {
                s.on_after(q)
            }
        });
        t.dialog("open")
    }

    function a(q, r) {
        return ((q !== null) && (typeof q === "object") && (r || (Object.prototype.toString.call(q) !== "[object Array]")))
    }

    function n(s) {
        var q = s.getHours();
        var t = s.getMinutes();
        var r = (q >= 12) ? "pm" : "am";
        q = q % 12;
        q = q ? q : 12;
        t = (t < 10) ? "0" + t : t;
        return q + ":" + t + " " + r
    }

    function l(q, u, t) {
        if (!k) {
            var s = document.createElement("style");
            s.appendChild(document.createTextNode(""));
            document.head.appendChild(s);
            k = s.sheet
        }
        if ("insertRule" in k) {
            if (t) {
                for (var r = k.cssRules.length; r > 0; --r) {
                    if (k.cssRules[r] && k.cssRules[r].selectorText === q) {
                        k.deleteRule(r)
                    }
                }
            }
            k.insertRule(q + "{" + u + "}", k.cssRules.length)
        } else {
            if ("addRule" in k) {
                k.addRule(q, u)
            }
        }
    }

    return {
        rowShadow: p,
        warnBeforeLeave: j,
        viewport: i,
        confirmDialog: o,
        cellGroupWarningDialog: f,
        isObject: a,
        formatTime: n,
        addCssRule: l
    }
});
Slickplan.define("ajax", function (f, b, a) {
    var l = b.require("config");
    var j = b.require("helper");
    var k = b.require("http");
    var h = b.require("notification");
    var e = [];
    var i = {
        url: k.url(),
        data: {},
        dataType: "json",
        type: "POST",
        success: null,
        error: null,
        complete: null,
        silent: false,
        clear: false,
        timeout: 45000,
        $loading: null
    };

    function d(o, m) {
        var n = {};
        f.extend(n, i);
        if (j.isObject(o)) {
            f.extend(n, o)
        } else {
            if (typeof o === "string") {
                n.url = k.url("/ajax/" + o)
            }
        }
        if (j.isObject(m)) {
            f.extend(n, m)
        }
        if (n.clear) {
            g()
        }
        var p = null;
        if (typeof n.complete === "function") {
            p = n.complete
        }
        n.complete = function (q, r) {
            if (!n.silent) {
                switch (r) {
                    case"timeout":
                        h.error(b.__("Cannot connect to Slickplan. Please check your Internet connection and try again."));
                        break;
                    case"error":
                    case"parsererror":
                        h.error(b.__("An error occured. Please try again later."));
                        break
                }
                if (typeof n.$loading === "object" && n.$loading instanceof f) {
                    n.$loading.css({visibility: "hidden"})
                }
            }
            if (typeof p === "function") {
                p(n.silent)
            }
        };
        if (!n.data._nonce) {
            n.data._nonce = f('meta[name="csrf-token"]').attr("content")
        }
        if (!n.data._v) {
            n.data._v = l.get("app_version", "")
        }
        if (!n.data._url) {
            n.data._url = window.location.href
        }
        if (!(typeof o === "string" && o === "ping")) {
            h.clearAll(true)
        }
        e.push(f.ajax({
            url: n.url,
            data: n.data,
            dataType: n.dataType,
            type: n.type,
            success: n.success,
            error: n.error,
            complete: n.complete,
            timeout: n.timeout
        }))
    }

    function g() {
        for (var m = 0; m < e.length; ++m) {
            e[m].abort()
        }
        e = []
    }

    function c() {
        for (var m = 0; m < e.length; ++m) {
            if (e[m].status !== 200) {
                return true
            }
        }
        e = [];
        return false
    }

    return {request: d, clearAll: g, exists: c}
});
Slickplan.define("http", function (c, b, a) {
    function d(k) {
        if (!k || k === "#") {
            return window.location.href.split("#")[0]
        }
        var j = document.createElement("a");
        j.href = k.split("#")[0];
        var url= window.location.protocol + "//" + window.location.hostname.replace(/^\/|\/$/g, "") + "/" + j.pathname.replace(/^\/|\/$/g, "");
        //arieskienmendoza
        if(window.location.hostname!= ''){
            url= window.location.protocol + "//" + window.location.hostname.replace(/^\/|\/$/g, "") + ":" + window.location.port + "/" + j.pathname.replace(/^\/|\/$/g, "") + "/";
        }
        //arieskienmendoza FIN
        return url;
    }

    function f() {
        return navigator.userAgent
    }

    function g(j) {
        return c.cookie(j)
    }

    function i(k, m, j) {
        var l = {path: "/"};
        if (j && typeof j === "number") {
            l.expires = j
        }
        return c.cookie(k, m, l)
    }

    function h(j) {
        b.require("websocket", null, "disconnect");
        window.location = (j && j !== "#") ? j : d()
    }

    function e() {
        h()
    }

    return {url: d, getUserAgent: f, getCookie: g, setCookie: i, redirect: h, refresh: e}
});
Slickplan.define("notification", function (f, d, c) {
    var a = f("#main").prev();
    var k;
    var j;
    var e;
    var b = 0;

    function n(s, r, q) {
        r = (typeof r === "object") ? r : {};
        r.type = "error";
        g(s, r, q)
    }

    function m(r, q) {
        q = (typeof q === "object") ? q : {};
        q.type = "success";
        g(r, q)
    }

    function o(r, q) {
        q = (typeof q === "object") ? q : {};
        q.type = "system";
        g(r, q)
    }

    function g(x, s, q) {
        var v = {type: "system", persistent: null, dataId: null, time: 5555, scroll: true, icon: true, css: false};
        if (typeof s === "object") {
            f.extend(v, s)
        }
        if (v.dataId && b && b === v.dataId) {
            return
        }
        b = v.dataId ? v.dataId : null;
        var t = {opacity: 0, height: 0, display: "block"};
        if (a.length) {
            t.top = a.offset().top + a.outerHeight()
        }
        if (typeof v.css === "object") {
            f.extend(t, v.css)
        }
        if (/<\/a>/i.test(x)) {
            var w = s.html;
            if (w !== false && w !== true) {
                var u = d.require("config", false, "get", ["account"]);
                w = !(u.type_id < 1 || u.type_id > 4)
            }
            if (!w) {
                x = x.replace(/(<([^>]+)>)/ig, "")
            }
        }
        if (v.type === "system" || v.type === "error") {
            if (v.persistent === null) {
                v.persistent = true
            }
            if (v.icon) {
                if (v.icon === true) {
                    v.icon = "fa-exclamation"
                }
                x = '<i class="fa ' + v.icon + '"></i> ' + x
            }
        } else {
            if (v.type === "success") {
                if (v.icon) {
                    if (v.icon === true) {
                        v.icon = "fa-check"
                    }
                    x = '<i class="fa ' + v.icon + '"></i> ' + x
                }
            }
        }
        if (!q) {
            if (!k || !k.length) {
                h()
            }
            q = k;
            q.attr("class", v.type)
        }
        q.css(t).find("span").html(x).end();
        if (v.dataId) {
            q.children("a.close").data("id", v.dataId)
        } else {
            q.children("a.close").removeData("id")
        }
        clearTimeout(j);
        if (!t.top) {
            t.top = q.offset();
            if (t.top && t.top.top) {
                t.top = t.top.top
            } else {
                t.top = 0
            }
        }
        if (v.dataId) {
            q.children("a.close").data("id", v.dataId)
        } else {
            q.children("a.close").removeData("id")
        }
        if (x) {
            var r = 0;
            if (v.scroll && f(window).scrollTop() > t.top) {
                r = 300;
                f("html, body").stop().animate({scrollTop: t.top}, r)
            }
            q.css({marginLeft: -(q.outerWidth() / 2)}).stop().delay(r).animate({
                opacity: 1,
                height: q.children("span").height() + 7
            }, 400, function () {
                q.addClass("opened");
                if (v.persistent !== true) {
                    j = setTimeout(function () {
                        q.children("a.close").trigger("click")
                    }, v.time)
                }
            })
        }
    }

    function i(r) {
        if (k && k.length) {
            var q = r ? ".opened" : ".error.opened";
            k.filter(q).children("a.close").trigger("click")
        }
    }

    function h() {
        if (!k || !k.length) {
            k = f("#form-notify")
        }
        if (!k || !k.length) {
            k = f('<div id="form-notify" />').appendTo(f("#main"))
        }
        if (!k.find("span").length) {
            k.html('<span /><a class="close"><i class="fa fa-times-circle"></i></a>')
        }
        k.off("click").on("click", "a.close", function (s) {
            s.preventDefault();
            var r = f(this);
            var q = 0;
            if (r.hasClass("close")) {
                s.preventDefault();
                q = parseInt(r.data("id"), 10);
                r.removeData("id")
            }
            f(this).parent().stop().animate({opacity: 0, height: 0}, 400, function () {
                f(this).hide();
                b = null;
                if (q && !isNaN(q) && q > 0) {
                    var t = d.require("websocket");
                    t.request("system_notification", {
                        data: {id: q}, silent: true, success: function (u) {
                            if (u._notify && typeof u._notify === "object" && u._notify.message && u._notify.options) {
                                g(u._notify.message, u._notify.options)
                            }
                        }
                    })
                }
                d.publish("notification_closed", [q])
            })
        })
    }

    function p() {
        return (k && k.length && k.is(":visible") && k.find(".close").length)
    }

    h();
    var l = d.require("config", false, "get", ["notify"]);
    if (typeof l === "string" && l !== "") {
        g(l)
    } else {
        if (typeof l === "object") {
            g(l.message, l)
        }
    }
    return {clearAll: i, info: g, display: g, success: m, info: o, error: n, isActive: p}
}, true);
Slickplan.module(function (b, a, c) {
    a.subscribe("before_init", function () {
        var m = a.require("config");
        var e = a.require("form");
        var j = a.require("sitemap");
        var h = a.require("notification");
        var l = a.require("helper");
        var i = a.require("svg");
        var f = a.require("string");
        var g = a.require("color");
        var d = a.require("scrollbar");
        var k = false;
        b("html").removeClass("no-js").addClass("js");
        b('input[type="text"], input[type="password"], textarea').attr("autocomplete", "off").attr("autocapitalize", "off").attr("autocorrect", "off");
        b(":input.autoselect").on("focus dblclick", function () {
            b(this).select()
        });
        (function () {
            if ("placeholder" in document.createElement("textarea")) {
                return
            }
            b("input[placeholder], textarea[placeholder]").each(function () {
                var n = b(this).attr("placeholder");
                b(this).val(n).focus(function () {
                    if (this.value == n) {
                        this.value = ""
                    }
                }).blur(function () {
                    if (this.value == "") {
                        this.value = n
                    }
                }).blur().closest("form").addClass("hasplaceholders")
            });
            b("form.hasplaceholders").on("submit", function () {
                b(this).find("input[placeholder], textarea[placeholder]").each(function () {
                    if (this.value == b(this).attr("placeholder")) {
                        this.value = ""
                    }
                })
            })
        })();
        b('.modal .submit > input[type="submit"]').after('<div class="loading" />');
        if (!b.disableSelection) {
            b.fn.extend({
                disableSelection: function () {
                    return this.on((b.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (n) {
                        n.preventDefault()
                    })
                }
            })
        }
        b("#sitemap-wrapper p, .switch > input + label, .radio > input + label, .checkbox > input + label, body > ul, .usersbox, .disableSelection, #sitemap-top h1 > span").disableSelection();
        if (d) {
            d.init("#scroll-area", {trackSize: 441})
        }
        b("#header li.settings").on("mouseenter", function () {
            b(this).addClass("hover")
        }).on("mouseleave", function () {
            b(this).removeClass("hover")
        });
        b("#header ul ul").each(function () {
            b(this).addClass("items-" + (b(this).children("li").length - 1))
        });
        if (b.farbtastic && b("#colorpicker").length) {
            b("#colorpicker").farbtastic("#colorinput");
            a.$body.on("click", "#colordefault", function (n) {
                n.preventDefault();
                b.farbtastic("#colorpicker").setColor("#008DF5")
            })
        }
        if (typeof b.ui !== "undefined") {
            if (typeof b.ui.selectmenu !== "undefined") {
                b("select:not(.plain)").selectmenu({
                    style: "popup", format: function (n) {
                        return f.charsEncode(n)
                    }
                })
            }
            if (b.ui.dialog !== c) {
                b("div.modal").each(function () {
                    var n = b(this);
                    var o = n.attr("id");
                    a.publish("modal/before_init/" + o, [n]);
                    n.dialog({
                        autoOpen: false,
                        modal: true,
                        show: {effect: "fade", duration: 250},
                        hide: {effect: "fade", duration: 300},
                        open: function () {
                            if (o === "modal-export") {
                                b('#modal-export input[type="radio"]:first').prop("checked", true).change()
                            } else {
                                if (o === "modal-open") {
                                    var t = n.find("select");
                                    t.selectmenu("destroy");
                                    t.selectmenu({
                                        style: "popup", format: function (u) {
                                            return f.charsEncode(u)
                                        }
                                    })
                                }
                            }
                            b(".ui-widget-overlay:last").attr("class", "ui-widget-overlay modal-hooked modal-overlay modalid-" + o).hide().fadeIn(250, function () {
                                n.parent().addClass("anim")
                            });
                            n.find(".loading").css({visibility: "hidden"});
                            a.publish("modal/open/" + o, [n]);
                            var s = n.find(".table-scroll");
                            var r = s.find("tr");
                            var q = s.data("how-many") || 4;
                            if (s.length && o !== "modal-color-load" && r.length > q) {
                                var p = r.filter(":last").outerHeight() * q;
                                s.height(p);
                                if (d) {
                                    d.init(s, {thumbSize: 64, trackSize: p})
                                }
                            }
                        },
                        beforeClose: function () {
                            if (!n.is(":visible")) {
                                return
                            }
                            var p = b(".ui-widget-overlay.modalid-" + o).clone();
                            b(".ui-widget-overlay.modalid-" + o).remove();
                            e.clearErrors(n);
                            p.appendTo(a.$body).fadeOut(300, function () {
                                b(this).remove()
                            });
                            n.css({overflow: "hidden"}).parent().css({overflow: "hidden"});
                            a.publish("modal/before_close/" + o, [n])
                        },
                        close: function () {
                            n.parent().removeClass("anim");
                            b.ui.dialog.overlay.instances = [];
                            b.ui.dialog.overlay.oldInstances = [];
                            a.publish("modal/close/" + o, [n])
                        },
                        resizable: false,
                        draggable: false,
                        zIndex: (o === "modal-confirm") ? 9001 : 2001,
                        width: n.width(),
                        height: n.height()
                    })
                });
                b("div.top-modal").each(function () {
                    var n = b(this);
                    var o = n.hasClass("tooltip-modal") ? "ui-tooltip-modal" + (n.hasClass("tooltip-modal-left") ? " tooltip-modal-left" : "") : "ui-top-modal";
                    o += n.hasClass("resizeable") ? " sl-resizeable" : "";
                    o += n.hasClass("resizeable-x") ? " sl-resizeable-x" : "";
                    o += n.hasClass("resizeable-y") ? " sl-resizeable-y" : "";
                    var p = n.attr("id");
                    a.publish("top_modal/before_init/" + p, [n]);
                    n.dialog({
                        autoOpen: false,
                        modal: true,
                        stack: true,
                        dialogClass: o,
                        show: {effect: "fade", duration: 250},
                        hide: {effect: "fade", duration: 300},
                        open: function () {
                            n.parent(".ui-dialog").addClass(p);
                            e.clearErrors(true);
                            j.hideAddHelperPlaceholder(false);
                            b(".ui-widget-overlay:not(.modal-hooked)").attr("class", "ui-widget-overlay modal-hooked topmodal-overlay modalid-" + p);
                            a.publish("top_modal/open/" + p, [n])
                        },
                        beforeClose: function () {
                            if (!n.is(":visible")) {
                                return
                            }
                            var q = j.getOptions();
                            b(".ui-widget-overlay.modalid-" + p).remove();
                            e.clearErrors(true);
                            e.clearErrors(n.css({overflow: "hidden"}).parent().css({overflow: "hidden"}));
                            a.publish("top_modal/before_close/" + p, [n])
                        },
                        close: function () {
                            b.ui.dialog.overlay.instances = [];
                            b.ui.dialog.overlay.oldInstances = [];
                            a.publish("top_modal/close/" + p, [n])
                        },
                        resizable: n.hasClass("resizeable"),
                        resize: function (r) {
                            var q = n.find("#form-cell-note");
                            if (q.length) {
                                q.trigger("keyup", [true]);
                                j.addCellNoteWidth(c, q.parent().width())
                            }
                        },
                        draggable: false,
                        zIndex: 3001,
                        width: n.width(),
                        height: n.height(),
                        minWidth: n.width(),
                        maxWidth: Math.max(n.width(), b(window).width() - 100)
                    });
                    n.on("click", ".tooltip-modal-titlebar .close", function (q) {
                        q.preventDefault();
                        var r = n.find(".buttons button.cancel");
                        if (r.length) {
                            r.trigger("click")
                        } else {
                            n.dialog("close")
                        }
                    })
                });
                a.$body.on("click", "[data-modal]", function (q) {
                    q.preventDefault();
                    var p = m.get("account");
                    var o = b(this).data("modal");
                    if ((o === "create-sitemap" || o === "save-as") && p.sitemaps_limit > -1 && p.sitemaps_count >= p.sitemaps_limit) {
                        h.error(a.__('Your {1} account needs to be <a href="{2}">upgraded</a> to create a new sitemap', p.name, m.get("payment_url", "#")));
                        return false
                    }
                    var n = b("#modal-" + o + ".modal");
                    if (!n.length) {
                        return a.noPermissions()
                    }
                    b(".modal").dialog("close");
                    n.find("form").each(function () {
                        if (b(this).attr("id") !== "export-tab") {
                            this.reset()
                        }
                    }).end().dialog("open").find(":text:first").focus()
                }).on("click", "[data-topmodal]", function (B) {
                    B.preventDefault();
                    var s = b(this);
                    var w = s.data("topmodal");
                    var x = b("#topmodal-" + w + ".top-modal");
                    if (!x.length) {
                        return a.noPermissions()
                    }
                    var C = x.parent();
                    var v = j.getCurrentCell();
                    var y = i.getElement(v, true);
                    var p = j.getOptions();
                    var o = false;
                    var u = false;
                    var t = b(".top-modal");
                    if (t.length) {
                        t.dialog("close")
                    }
                    C.removeClass("topFive linetext cell_color cell_text_color batchediting");
                    var E = {my: "center", at: "center", of: s};
                    if (s.hasClass("cellmodal")) {
                        E = {my: "right center", at: "left center", of: y, left_offset: -2};
                        if (s.hasClass("desc")) {
                            E = {my: "right top", at: "right bottom", of: y, top_offset: 3, left_offset: 10}
                        } else {
                            if (s.hasClass("url")) {
                                E = {my: "right top", at: "right bottom", of: y, top_offset: 3, left_offset: 10}
                            } else {
                                if (s.hasClass("archetype")) {
                                    E = {my: "left top", at: "left bottom", of: y, left_offset: -8, top_offset: 3}
                                }
                            }
                        }
                    } else {
                        if (s.hasClass("batchediting")) {
                            E = {my: "right top", at: "right bottom", of: s, left_offset: 20, top_offset: 10};
                            o = true;
                            C.addClass("batchediting");
                            u = true
                        } else {
                            if (s.parent().hasClass("batchediting")) {
                                E = {
                                    my: "right center",
                                    at: "left center",
                                    of: s.parent().find(".color-box").parent(),
                                    left_offset: -2
                                };
                                o = true;
                                C.addClass("batchediting");
                                u = true
                            }
                        }
                    }
                    var D = b(window).scrollTop();
                    C.removeData("li").removeData("type");
                    x.find("form").each(function () {
                        this.reset()
                    }).end().dialog("open");
                    var q = s.data("type") || false;
                    if (q) {
                        C.data("type", q)
                    }
                    if (!u) {
                        if (s.hasClass("linetext") && w === "farbtastic") {
                            C.addClass("topFive");
                            var z = s.data("color") || s.next("li").data("color");
                            if (z) {
                                z = z.replace(/[^0-9a-f]/gi, "");
                                if (z.length === 3 || z.length === 6) {
                                    b.farbtastic("#colorpicker").setColor("#" + z);
                                    b("#colorinput").val(z)
                                }
                            }
                        } else {
                            if (s.hasClass("custom") && w === "farbtastic") {
                                C.addClass("topFive").data("type", "custom");
                                var n = b("#sitemap-top form select").val();
                                if (n !== "all" && n) {
                                    var z = defaultColors[currentSection][n].replace(/[^0-9a-f]/gi, "");
                                    if (z.length === 3 || z.length === 6) {
                                        b.farbtastic("#colorpicker").setColor("#" + z);
                                        b("#colorinput").val(z)
                                    }
                                }
                            } else {
                                if (y && typeof y === "object" && y.length) {
                                    if (s.hasClass("color")) {
                                        C.addClass("cell_color");
                                        var z = i.getData(v, p.data_color) || j.getColorSchemeItem(v);
                                        if (z) {
                                            b.farbtastic("#colorpicker").setColor(g.toHex(z));
                                            b("#colorinput").val(z)
                                        }
                                        b('#topmodal-farbtastic input[type="reset"]').data("oldcolor", (z || ""));
                                        b("#topmodal-farbtastic").find("h1 > span").html(s.text())
                                    } else {
                                        if (s.hasClass("textcolor")) {
                                            C.addClass("cell_text_color");
                                            var z = i.getData(v, p.data_text_color) || j.getColorSchemeItem("text_color");
                                            if (z) {
                                                b.farbtastic("#colorpicker").setColor(g.toHex(z));
                                                b("#colorinput").val(z)
                                            }
                                            b('#topmodal-farbtastic input[type="reset"]').data("oldcolor", (z || ""));
                                            b("#topmodal-farbtastic").find("h1 > span").html(s.text())
                                        } else {
                                            if (s.hasClass("desc")) {
                                                var A = i.getData(v, p.data_desc) || "";
                                                b("#topmodal-cell-note").css({height: ""}).find(".note-text").html(A ? f.charsDecode(A) : "&nbsp;").show().end().find("textarea").val(A).height(b("#topmodal-cell-note .note-text").height()).hide().end().height(b("#topmodal-cell-note > div").outerHeight()).parent(".ui-tooltip-modal").css({
                                                    top: "+=13px",
                                                    left: "+=10px"
                                                });
                                                j.addCellNote(v, A);
                                                b("#note-edit").trigger("click")
                                            } else {
                                                if (s.hasClass("archetype")) {
                                                    b("#topmodal-cell-archetype").parent(".ui-tooltip-modal").css({
                                                        top: "+=13px",
                                                        left: "-=1px"
                                                    });
                                                    j.scrollToView(b("#topmodal-cell-archetype")[0])
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (s.hasClass("desc")) {
                            var A = b("#sitemap-batch-edit .ui-selectmenu.batchediting.desc").data("batchdata") || "";
                            b("#topmodal-cell-note").css({height: ""}).find(".note-text").html((A ? A : "&nbsp;")).show().end().find("textarea").val(A).height(b("#topmodal-cell-note .note-text").height()).hide().end().height(b("#topmodal-cell-note > div").outerHeight()).parent(".ui-tooltip-modal").css({
                                top: "+=13px",
                                left: "+=10px"
                            });
                            b("#note-edit").trigger("click")
                        } else {
                            if (s.hasClass("url")) {
                                var r = b("#sitemap-batch-edit .ui-selectmenu.batchediting.url").data("batchdata") || "http://";
                                b("#topmodal-cell-url").find("#form-cell-url").val(r).end().height(b("#topmodal-cell-url > div").outerHeight()).parent(".ui-tooltip-modal").css({
                                    top: "+=13px",
                                    left: "-=10px"
                                });
                                b("#topmodal-cell-url #form-cell-url").putCursorAtEnd()
                            }
                        }
                    }
                    b(".ui-top-modal").css({cursor: "move"}).find("div.ui-dialog-content").css({cursor: "default"}).end().draggable({
                        cancel: "div.ui-dialog-content",
                        containment: "window",
                        scroll: false,
                        start: function () {
                            var F = s.removeClass("topFive").position();
                            s.data("lastLeft", F.left).data("lastTop", F.top)
                        },
                        drag: function (G, F) {
                            b(".top-modal-tip-error").css({
                                left: "+=" + (F.position.left - s.data("lastLeft")) + "px",
                                top: "+=" + (F.position.top - s.data("lastTop")) + "px"
                            });
                            s.data("lastLeft", F.position.left).data("lastTop", F.position.top)
                        }
                    });
                    if (q || C.hasClass("topFive")) {
                        x.find(".breset").val(a.__("Cancel"))
                    } else {
                        x.find(".breset").val(a.__("Reset"))
                    }
                    i.position(C[0], E, {
                        min: {top: 0, left: 0},
                        max: {left: a.$window.scrollLeft() + a.$window.width() - C.width() - 5}
                    }, o);
                    b(window).scrollTop(D);
                    x.find("input:visible:first").blur();
                    a.publish("top_modal/after_open/topmodal-" + w, [x, s])
                }).on("click", ".top-modal .close, .modal .close", function (o) {
                    o.preventDefault();
                    var n = b(this).closest(".top-modal, .modal");
                    if (n.attr("id") === "topmodal-farbtastic") {
                        return
                    }
                    n.dialog("close")
                }).on("click", ".modal-overlay", function () {
                    b(".modal").dialog("close")
                }).on("click", ".topmodal-overlay", function () {
                    return false
                })
            }
        }
        a.$main.on("submit", "form", function (n) {
            h.clearAll()
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/auth/login route/auth/index route/login route/forgot", function () {
        var e = a.require("form");
        var k = a.require("ajax");
        var m = a.require("http");
        var h = a.require("notification");
        var d = b("#login-box");
        if (d.find("h1 strong").length) {
            var j = d.find("h1 strong").width() + d.find("h1 span").width() + 242;
            if (d.find("form").width() < j) {
                d.find("form").css({
                    width: j,
                    marginLeft: -(j / 2)
                }).find("fieldset").css({width: j - 72}).end().find('input[type="text"], input[type="password"]').css({width: j - 82})
            }
        }
        var f = d.find("h1:first > span").html();
        var l;
        d.on("click", ".forgot", function (o) {
            o.preventDefault();
            var n = b(this);
            l = /username/i.test(n.html()) ? "username" : "password";
            n.closest("fieldset").fadeOut(400, function () {
                d.find("form").animate({height: "-=80", marginTop: "+=40"}, 400);
                b(this).next("fieldset").fadeIn(400);
                e.clearErrors()
            }).siblings("h1").find("span").fadeOut(400, function () {
                b(this).html(n.html()).fadeIn(400)
            })
        });
        a.$body.on("click", "#login-box:not(.close-form) .button", function (o) {
            o.preventDefault();
            b("#form-notify > a").trigger("click");
            var n = b(this);
            n.closest("fieldset").fadeOut(400, function () {
                d.find("form").animate({height: "+=80", marginTop: "-=40"}, 400);
                b(this).prev("fieldset").fadeIn(400);
                b("#forgot-form .input").find("input").val("").end().find("p").remove()
            }).siblings().prev("h1").find("span").fadeOut(400, function () {
                b(this).html(f).fadeIn(400)
            })
        });
        b("#forgot-form").on("click", 'input[type="submit"]', function (o) {
            o.preventDefault();
            k.clearAll();
            e.clearErrors();
            var n = b("#forgot-form > div.input > p");
            if (!n.length) {
                n = b("<p></p>").appendTo("#forgot-form > div.input")
            }
            n.hide();
            var p = b("#form-forgot").val();
            if (!p) {
                e.error(b("#form-forgot").parent("div"), a.__("Email must not be empty"))
            } else {
                k.request({
                    url: m.url(b("#forgot-form").data("action")),
                    $loading: b("#forgot-form .loading").css({visibility: "visible"}),
                    //data: {forgot: p, type: l},
                    //arieskienmendoza
                    data: {email: p, type: l},
                    //arieskienmendoza FIN
                    success: function (q) {
                        if (q.error) {
                            e.error(b("#form-forgot").parent("div"), a.__("No user found"))
                        } else {
                            b("#form-forgot").val("");
                            h.success(a.__("An email with instructions has been sent"))
                        }
                        if (q._nonce) {
                            a.updateNonce(q._nonce)
                        }
                    }
                })
            }
        });
        d.on("click", 'fieldset:first input[type="submit"]', function (r) {
            e.clearErrors();
            var p = b(this).next(".loading").css({visibility: "visible"});
            var q = b("#form-username");
            var o = b("#form-password");
            var n = e.validate([{
                value: q.val(),
                tiperror: q.parent(),
                rules: {empty: a.__("Username must not be empty")}
            }, {value: o.val(), tiperror: o.parent(), rules: {empty: a.__("Password must not be empty")}}]);
            if (!n) {
                p.css({visibility: "hidden"});
                return false
            }
            return true
        });
        d.on("keydown", "fieldset input", function (n) {
            if (n.keyCode && n.keyCode == 13) {
                n.preventDefault();
                b(this).closest("fieldset").find('input[type="submit"]').trigger("click")
            }
        });
        b("#form-notify").css({top: "+=2"});
        b('#login-box.forgot-form input[type="submit"]').on("click", function (p) {
            e.clearErrors();
            var o = b(this).next(".loading").css({visibility: "visible"});
            var r = b("#forgotpassword0");
            var q = b("#forgotpassword1");
            var n = e.validate([{
                value: r.val(),
                tiperror: r.parent(),
                rules: {empty: a.__("Password must not be empty")}
            }, {value: q.val(), tiperror: q.parent(), rules: {empty: a.__("Password must not be empty")}}]);
            if (n && r.val().length < 6) {
                e.error(r.parent(), a.__("Password must be at least 6 characters"));
                n = false
            }
            if (n && r.val() !== q.val()) {
                e.error(q.parent(), a.__("Passwords do not match"));
                n = false
            }
            if (!n) {
                o.css({visibility: "hidden"})
            }
            return n
        });
        if (/login\/saved/.test(document.location.href)) {
            h.success(a.__("New password saved. Please login below."))
        }
        if (/password/.test(document.location.hash)) {
            d.find(".forgot:last").trigger("click")
        }
        var g = d.find("fieldset:visible");
        if (g.length) {
            var i = g.children(".input").children(".tip-error").filter(":last").prev("input");
            if (!i.length) {
                i = g.find('input[type="text"]:first')
            }
            i.focus()
        }
    })
});