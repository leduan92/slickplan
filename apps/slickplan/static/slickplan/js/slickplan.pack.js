window.Slickplan = Slickplan = (function (i, f) {
    var k = {};

    function q(t, u, s) {
        k[t] = [u, !!s]
    }

    function b(t, s, v, u) {
        if (t !== f && k[t] !== f) {
            if (typeof k[t] !== "function" && typeof k[t][0] === "function") {
                k[t] = k[t][0](i, window.Slickplan)
            }
            if (typeof v === "string" && typeof k[t][v] === "function") {
                if (u === f) {
                    u = [s]
                }
                return k[t][v].apply(k[t][v], u)
            }
            return k[t]
        } else {
            if (s === f) {
                j("Require: not found", "error", arguments);
                return false
            } else {
                j("Require: not found, default value returned", "warn", arguments);
                return s
            }
        }
    }

    var h = i({});

    function d(s) {
        j("Subscribe:", "info", arguments);
        return h.on.apply(h, arguments)
    }

    function o(s) {
        j("Unsubscribe:", "info", arguments);
        return h.off.apply(h, arguments)
    }

    function a(s) {
        j("Publish:", "info", arguments);
        return h.trigger.apply(h, arguments)
    }

    var c = [];

    function m(s) {
        c.push(s)
    }

    function n() {
        var s = b("config", [], "get", ["route"]);
        if (!s || !s.length) {
            s = document.location.pathname.replace(/(^\/+|\/+$)/g, "").replace(/[\/]{2,}/g, "/").split("/");
            if (!s.length) {
                s = ["dashboard", "index"]
            } else {
                if (s.length === 1) {
                    s[1] = "index"
                }
            }
            if (!s[0]) {
                s[0] = "index"
            }
        }
        if (s.length === 1) {
            s[1] = "index"
        }
        i.each(k, function (w, v) {
            if (typeof v !== "function" && typeof v[1] === "boolean" && v[1] === true) {
                b(w)
            }
        });
        i.each(c, function (v, w) {
            if (typeof w === "function") {
                w(i, window.Slickplan)
            }
        });
        b("websocket", null, "setSession", [s]);
        a("before_init");
        a("before_init/" + s[0]);
        var u = "route";
        for (var t = 0; t < s.length; ++t) {
            u += "/" + s[t];
            a(u)
        }
        a("after_init");
        a("after_init/" + s[0])
    }

    function e(s, t) {
        var u = b("config", false, "get", ["permissions"]);
        if (u && u[s] !== f) {
            return t ? u[s] : true
        }
        return false
    }

    function p(t) {
        var s = b("locale");
        if (s && typeof s.get === "function") {
            return s.get.apply(s.get, arguments)
        }
        return t
    }

    var r = false;
    i(window).on("beforeunload", function () {
        a("onunload", [r])
    });
    function j(v, u) {
        var s = b("config", false, "get", ["debug"]);
        if (!s) {
            return
        }
        u = (u && u !== "info" && typeof console[u] === "function") ? u : "log";
        if (typeof console[u] === "function") {
            var t = Array.prototype.slice.call(arguments);
            t = t.slice(2);
            if (typeof t !== "object") {
                t = [t]
            }
            if (t.length < 2 && typeof t[0] !== "object") {
                t[0] = [t[0]]
            }
            t.unshift(v);
            console[u].apply(console, t)
        }
    }

    var g = i('input[type="hidden"][name="_nonce"]:first').val();
    return {
        define: q, require: b, subscribe: d, unsubscribe: o, publish: a, module: m, appInit: function (s) {
            if (s) {
                b("config", null, "set", [s])
            }
            n()
        }, init: n, log: j, __: p, websocket: function () {
            return b("websocket", null, "getSession")
        }, currentUserCan: e, noPermissions: function (s) {
            if (!s) {
                s = p('<a href="{1}">Upgrade</a> your account to use this feature', b("config", false, "get", ["payment_url", "#"]))
            }
            b("notification").error(s);
            return false
        }, updateNonce: function (s) {
            if (g !== s) {
                i('input[type="hidden"][name="_nonce"]').val(s);
                g = s
            }
        }, ignoreUnload: function (s) {
            r = !!s
        }, $window: i(window), $body: i(document.body), $main: i("#main")
    }
})(jQuery);
Slickplan.define("ajax", function (f, b, a) {
    var m = b.require("config");
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

    function d(p, n) {
        var o = {};
        f.extend(o, i);
        if (j.isObject(p)) {
            f.extend(o, p)
        } else {
            if (typeof p === "string") {
                //arieskienmendoza call ajax/ping
                o.url = k.url("/app/ajax/" + p)
            }
        }
        if (j.isObject(n)) {
            f.extend(o, n)
        }
        if (o.clear) {
            g()
        }
        var q = null;
        if (typeof o.complete === "function") {
            q = o.complete
        }
        o.complete = function (r, s) {
            if (!o.silent) {
                switch (s) {
                    case"timeout":
                        h.error(b.__("Cannot connect to Slickplan. Please check your Internet connection and try again."));
                        break;
                    case"error":
                    case"parsererror":
                        h.error(b.__("An error occured. Please try again later."));
                        break
                }
                if (typeof o.$loading === "object" && o.$loading instanceof f) {
                    o.$loading.css({visibility: "hidden"})
                }
            }
            if (typeof q === "function") {
                q(o.silent)
            }
        };
        if (!o.data._nonce) {
            o.data._nonce = f('meta[name="csrf-token"]').attr("content")
        }
        if (!o.data._v) {
            o.data._v = m.get("app_version", "")
        }
        if (!o.data._url) {
            o.data._url = window.location.href
        }
        if (!(typeof p === "string" && p === "ping")) {
            h.clearAll(true)
        }
        //arieskien
        //console.info(JSON.stringify( o.data ));
        e.push(f.ajax({
            url: o.url,
            //data: o.data,//Original Arieskien
            data: JSON.stringify( o.data ),
            dataType: o.dataType,
            type: o.type,
            success: o.success,
            error: o.error,
            complete: o.complete,
            timeout: o.timeout
        }))
    }

    function g() {
        for (var n = 0; n < e.length; ++n) {
            e[n].abort()
        }
        e = []
    }

    function c() {
        for (var n = 0; n < e.length; ++n) {
            if (e[n].status !== 200) {
                return true
            }
        }
        e = [];
        return false
    }

    return {request: d, clearAll: g, exists: c}
});
Slickplan.define("color", function (e, b, a) {
    function g(j) {
        return ("0" + parseInt(j).toString(16)).slice(-2)
    }

    function c(j) {
        if (typeof j === "string") {
            if (j.indexOf("#") >= 0) {
                j = h(j, true)
            } else {
                j = j.replace(/[^\d,]/g, "").split(",")
            }
        }
        return [parseInt(j[0], 10), parseInt(j[1], 10), parseInt(j[2], 10)]
    }

    function d(j) {
        if (typeof j === "string") {
            if (j.indexOf("#") >= 0) {
                return j
            }
            j = c(j)
        }
        if (typeof j !== "string") {
            j = "#" + g(j[0]) + g(j[1]) + g(j[2])
        }
        return j.toLowerCase()
    }

    function h(j, k) {
        if (typeof j === "string") {
            if (j.indexOf("#") >= 0) {
                j = j.replace("#", "")
            }
            j = j.split("");
            if (j.length === 3) {
                j = [parseInt(j[0] + j[0], 16), parseInt(j[1] + j[1], 16), parseInt(j[2] + j[2], 16)]
            } else {
                j = [parseInt(j[0] + j[1], 16), parseInt(j[2] + j[3], 16), parseInt(j[4] + j[5], 16)]
            }
        }
        if (k) {
            return j
        }
        return "rgb(" + j[0] + ", " + j[1] + ", " + j[2] + ")"
    }

    function i(j, n, p, m) {
        var k = 245;
        if (n > 1 && n < 100) {
            n /= 10
        }
        if (typeof n !== "number" || n < 0 || n > 1) {
            n = 0.5
        }
        j = h(j, true);
        var o = Math.round(n * (k + 1)) * (p ? -1 : 1);
        j[0] = Math[p ? "max" : "min"](parseInt(j[0], 10) + o, p ? 0 : k);
        j[1] = Math[p ? "max" : "min"](parseInt(j[1], 10) + o, p ? 0 : k);
        j[2] = Math[p ? "max" : "min"](parseInt(j[2], 10) + o, p ? 0 : k);
        if (m) {
            return h(j, false)
        } else {
            return d(j)
        }
    }

    function f(j) {
        j = color2array(j);
        var k = (j[0] * 299 + j[1] * 587 + j[2] * 114) / 255000;
        return k
    }

    return {
        toArray: c, toHex: d, toRgb: h, toRgbDarker: function (j, k) {
            return i(j, k, true, true)
        }, toRgbLighter: function (j, k) {
            return i(j, k, false, true)
        }, toHexDarker: function (j, k) {
            return i(j, k, true, false)
        }, toHexLighter: function (j, k) {
            return i(j, k, false, false)
        }, detectColorContrast: f
    }
});
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
Slickplan.define("form", function (d, c, b) {
    function f(m) {
        if (typeof m === "object" && m instanceof d) {
            var k = m[0].querySelectorAll(".tip-error")
        } else {
            if (m === true) {
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

    function g(p, n, m, k, o, j) {
        p.closest("div.modal, div.top-modal").css({overflow: "visible"}).parent().css({overflow: "visible"});
        p = d('<div class="tip-error">' + n + "</div>").appendTo(p);
        if (typeof m === "object") {
            p.css(m)
        }
        if (o) {
            o = p.width() + 7 + (typeof o === "number" ? o : 0);
            p.css({left: -o}).addClass("align-left")
        }
        if (j) {
            j = p.height() + 7 + (typeof j === "number" ? j : 0);
            p.css({left: 0, bottom: -j}).addClass("align-bottom")
        }
        if (k) {
            p.addClass(k)
        }
        return p
    }

    function i(k) {
        var m = true;
        for (var o = 0, n = k.length; o < n; ++o) {
            if (k[o] === b) {
                continue
            }
            d.each(k[o].rules, function (q, j) {
                var p = false;
                switch (q) {
                    case"empty":
                        p = (k[o].value == "");
                        break;
                    case"checked":
                        p = !((k[o].input instanceof d) ? k[o].input.is(":checked") : k[o].input.checked);
                        break;
                    case"email":
                        p = !/^([A-Za-z0-9_\-\.\+])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,64})$/.test(k[o].value);
                        break;
                    case"alnum":
                        p = !/^[a-z0-9]+$/.test(k[o].value);
                        break;
                    case"is":
                        if (k[o].value == j[0]) {
                            p = true;
                            j = j[1]
                        }
                        break;
                    case"zipcode":
                        p = !/^[0-9]{5}(\-[0-9]+)?$/.test(k[o].value);
                        break;
                    case"callback":
                        p = !j[0](k[o].value);
                        j = j[1];
                        break;
                    case"regexp":
                        p = !j[0].test(k[o].value);
                        j = j[1];
                        break;
                    case"length":
                        p = (k[o].value.length < j[0]);
                        j = j[1];
                        break
                }
                if (p) {
                    m = false;
                    g(k[o].tiperror, j, k[o].css, false, k[o].left, k[o].bottom);
                    return false
                }
            })
        }
        return m
    }

    function h(k, j) {
        return k.serializeObject(j)
    }

    function a(o) {
        var k = false;
        o = o.replace(/[^0-9]/g, "");
        if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(o)) {
            k = 1
        } else {
            if (/^5[1-5][0-9]{14}$/.test(o)) {
                k = 3
            } else {
                if (/^3[47][0-9]{13}$/.test(o)) {
                    k = 2
                } else {
                    if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(o)) {
                        k = 4
                    }
                }
            }
        }
        if (k) {
            var m = 0;
            for (var j = (2 - (o.length % 2)); j <= o.length; j += 2) {
                m += parseInt(o.charAt(j - 1))
            }
            for (var j = (o.length % 2) + 1; j < o.length; j += 2) {
                var n = parseInt(o.charAt(j - 1)) * 2;
                m += (n < 10) ? n : (n - 9)
            }
            if ((m % 10) !== 0) {
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
    var n = false;
    var b = false;
    var k = false;
    var g = h(document.body);
    var c = h("#main");

    function q() {
        var s = document.querySelectorAll(".row-shadow");
        for (var r = 0; r < s.length; ++r) {
            if (s[r].parentNode) {
                s[r].parentNode.removeChild(s[r])
            }
        }
        h("#main.dashboard tr > td:first-child div.checkbox + a, #main.dashboard tr > td:first-child a.delete + a, .modal .sitemaps.table tr > td:first-child span, #main.dashboard .userrow, #main.dashboard .dashrow > a").append('<div class="row-shadow" />')
    }

    function j(r) {
        n = (r ? true : e.require("config", false, "get", ["warn_before_leave"])) && c.hasClass("sitemap");
        e.$window.on("beforeunload", function () {
            if (n) {
                b = true;
                return e.__("Are you sure you want to leave?")
            }
        })
    }

    function i() {
        var s = window, v = document, u = v.documentElement, t = g[0], r = s.innerWidth || u.clientWidth || t.clientWidth, z = s.innerHeight || u.clientHeight || t.clientHeight;
        return {width: r, height: z}
    }

    function p(t) {
        t = h.extend({
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
        }, t);
        if (t.checkbox && t.id) {
            var x = e.require("http");
            var w = "slickplan_" + t.id;
            if (x.getCookie(w) === "yes") {
                if (typeof t.on_yes === "function") {
                    t.on_yes()
                }
                return true
            }
        }
        var r = h("#modal-confirm");
        r.find("form")[0].reset();
        r.find("h1 + p, div.confirm-checkbox, div.checkboxes, .close").hide();
        r.find("h1").removeClass("has-close").addClass("clearfix").children("span").html(t.title);
        if (t.text) {
            r.find("h1 + p").show().html(t.text)
        }
        if (t.checkbox) {
            r.find("div.confirm-checkbox").show()
        }
        if (t.checkboxes && t.checkboxes.length > 0) {
            var v = "";
            for (var u = 0, s = t.checkboxes.length; u < s; ++u) {
                if (t.checkboxes[u] && t.checkboxes[u].id && t.checkboxes[u].label) {
                    var y = e.require("string").random(16);
                    v += '<div class="checkbox">                        <input type="checkbox" id="' + y + '" value="' + t.checkboxes[u].id + '">                        <label for="' + y + '">' + t.checkboxes[u].label + "</label>                        </div>"
                }
            }
            if (v) {
                r.find("div.checkboxes").show().html(v)
            }
        }
        if (t.close) {
            r.find(".close").show().closest("h1").addClass("has-close")
        }
        r.find('input[type="reset"]').val(t.no_label);
        r.find('input[type="submit"]').val(t.yes_label);
        r.find(".submit > input").off().on("click", function (A) {
            A.preventDefault();
            var z = {};
            r.find("div.checkboxes input").each(function () {
                z[this.value] = this.checked
            });
            if (h(this).attr("type") === "submit") {
                if (t.checkbox && t.id) {
                    if (h("#modal-confirm-checkbox").is(":checked")) {
                        x.setCookie(w, "yes", 365)
                    }
                }
                if (typeof t.on_yes === "function") {
                    t.on_yes(r, z)
                }
            } else {
                if (typeof t.on_no === "function") {
                    t.on_no(r, z)
                }
            }
            r.dialog("close")
        });
        r.dialog("open")
    }

    function f(r, t) {
        var s = e.require("sitemap");
        t = h.extend({
            on_update: null,
            on_unlink: null,
            on_before: null,
            on_after: null,
            on_group: null,
            on_single: null
        }, t);
        var v = s.isCellInCellsGroup(r);
        if (!v) {
            if (typeof t.on_before === "function") {
                t.on_before(r)
            }
            if (typeof t.on_single === "function") {
                t.on_single(r)
            }
            if (typeof t.on_after === "function") {
                t.on_after(r)
            }
            return true
        }
        var u = h("#modal-group-warning");
        u.find("#groups-update-cell").off().on("click", function (w) {
            w.preventDefault();
            u.dialog("close");
            h("#batch-groups-scroll .group.group-" + v + " > span").trigger("click", [true]);
            if (typeof t.on_before === "function") {
                t.on_before(r)
            }
            if (typeof t.on_update === "function") {
                t.on_update(r, u)
            }
            if (typeof t.on_group === "function") {
                t.on_group(r)
            }
            if (typeof t.on_after === "function") {
                t.on_after(r)
            }
        });
        u.find("#groups-unlink-cell").off().on("click", function (x) {
            x.preventDefault();
            u.dialog("close");
            var w = (typeof r !== "string" && r.id) ? r.id : r;
            s.removeCellFromGroup(w);
            if (typeof t.on_before === "function") {
                t.on_before(r)
            }
            if (typeof t.on_unlink === "function") {
                t.on_unlink(r, u)
            }
            if (typeof t.on_group === "function") {
                t.on_group(r)
            }
            if (typeof t.on_after === "function") {
                t.on_after(r)
            }
        });
        u.dialog("open")
    }

    function a(r, s) {
        return ((r !== null) && (typeof r === "object") && (s || (Object.prototype.toString.call(r) !== "[object Array]")))
    }

    function o(t) {
        var r = t.getHours();
        var u = t.getMinutes();
        var s = (r >= 12) ? "pm" : "am";
        r = r % 12;
        r = r ? r : 12;
        u = (u < 10) ? "0" + u : u;
        return r + ":" + u + " " + s
    }

    function m(r, v, u) {
        if (!k) {
            var t = document.createElement("style");
            t.appendChild(document.createTextNode(""));
            document.head.appendChild(t);
            k = t.sheet
        }
        if ("insertRule" in k) {
            if (u) {
                for (var s = k.cssRules.length; s > 0; --s) {
                    if (k.cssRules[s] && k.cssRules[s].selectorText === r) {
                        k.deleteRule(s)
                    }
                }
            }
            k.insertRule(r + "{" + v + "}", k.cssRules.length)
        } else {
            if ("addRule" in k) {
                k.addRule(r, v)
            }
        }
    }

    return {
        rowShadow: q,
        warnBeforeLeave: j,
        viewport: i,
        confirmDialog: p,
        cellGroupWarningDialog: f,
        isObject: a,
        formatTime: o,
        addCssRule: m
    }
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

    function i(k, n, j) {
        var m = {path: "/"};
        if (j && typeof j === "number") {
            m.expires = j
        }
        return c.cookie(k, n, m)
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
Slickplan.define("notification", function (f, d, c) {
    var a = f("#main").prev();
    var k;
    var j;
    var e;
    var b = 0;

    function o(t, s, r) {
        s = (typeof s === "object") ? s : {};
        s.type = "error";
        g(t, s, r)
    }

    function n(s, r) {
        r = (typeof r === "object") ? r : {};
        r.type = "success";
        g(s, r)
    }

    function p(s, r) {
        r = (typeof r === "object") ? r : {};
        r.type = "system";
        g(s, r)
    }

    function g(y, t, r) {
        var w = {type: "system", persistent: null, dataId: null, time: 5555, scroll: true, icon: true, css: false};
        if (typeof t === "object") {
            f.extend(w, t)
        }
        if (w.dataId && b && b === w.dataId) {
            return
        }
        b = w.dataId ? w.dataId : null;
        var u = {opacity: 0, height: 0, display: "block"};
        if (a.length) {
            u.top = a.offset().top + a.outerHeight()
        }
        if (typeof w.css === "object") {
            f.extend(u, w.css)
        }
        if (/<\/a>/i.test(y)) {
            var x = t.html;
            if (x !== false && x !== true) {
                var v = d.require("config", false, "get", ["account"]);
                x = !(v.type_id < 1 || v.type_id > 4)
            }
            if (!x) {
                y = y.replace(/(<([^>]+)>)/ig, "")
            }
        }
        if (w.type === "system" || w.type === "error") {
            if (w.persistent === null) {
                w.persistent = true
            }
            if (w.icon) {
                if (w.icon === true) {
                    w.icon = "fa-exclamation"
                }
                y = '<i class="fa ' + w.icon + '"></i> ' + y
            }
        } else {
            if (w.type === "success") {
                if (w.icon) {
                    if (w.icon === true) {
                        w.icon = "fa-check"
                    }
                    y = '<i class="fa ' + w.icon + '"></i> ' + y
                }
            }
        }
        if (!r) {
            if (!k || !k.length) {
                h()
            }
            r = k;
            r.attr("class", w.type)
        }
        r.css(u).find("span").html(y).end();
        if (w.dataId) {
            r.children("a.close").data("id", w.dataId)
        } else {
            r.children("a.close").removeData("id")
        }
        clearTimeout(j);
        if (!u.top) {
            u.top = r.offset();
            if (u.top && u.top.top) {
                u.top = u.top.top
            } else {
                u.top = 0
            }
        }
        if (w.dataId) {
            r.children("a.close").data("id", w.dataId)
        } else {
            r.children("a.close").removeData("id")
        }
        if (y) {
            var s = 0;
            if (w.scroll && f(window).scrollTop() > u.top) {
                s = 300;
                f("html, body").stop().animate({scrollTop: u.top}, s)
            }
            r.css({marginLeft: -(r.outerWidth() / 2)}).stop().delay(s).animate({
                opacity: 1,
                height: r.children("span").height() + 7
            }, 400, function () {
                r.addClass("opened");
                if (w.persistent !== true) {
                    j = setTimeout(function () {
                        r.children("a.close").trigger("click")
                    }, w.time)
                }
            })
        }
    }

    function i(s) {
        if (k && k.length) {
            var r = s ? ".opened" : ".error.opened";
            k.filter(r).children("a.close").trigger("click")
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
        k.off("click").on("click", "a.close", function (t) {
            t.preventDefault();
            var s = f(this);
            var r = 0;
            if (s.hasClass("close")) {
                t.preventDefault();
                r = parseInt(s.data("id"), 10);
                s.removeData("id")
            }
            f(this).parent().stop().animate({opacity: 0, height: 0}, 400, function () {
                f(this).hide();
                b = null;
                if (r && !isNaN(r) && r > 0) {
                    var u = d.require("websocket");
                    u.request("system_notification", {
                        data: {id: r}, silent: true, success: function (v) {
                            if (v._notify && typeof v._notify === "object" && v._notify.message && v._notify.options) {
                                g(v._notify.message, v._notify.options)
                            }
                        }
                    })
                }
                d.publish("notification_closed", [r])
            })
        })
    }

    function q() {
        return (k && k.length && k.is(":visible") && k.find(".close").length)
    }

    h();
    var m = d.require("config", false, "get", ["notify"]);
    if (typeof m === "string" && m !== "") {
        g(m)
    } else {
        if (typeof m === "object") {
            g(m.message, m)
        }
    }
    return {clearAll: i, info: g, display: g, success: n, info: p, error: o, isActive: q}
}, true);
Slickplan.define("scrollbar", function (b, a, c) {
    return {
        init: function (d, e) {
            if (typeof d === "string") {
                d = b(d)
            }
            if (d instanceof b) {
                if (!d.hasClass("tinyscrollbar-enabled")) {
                    var f = b.extend({thumbSize: 60}, e);
                    d.addClass("tinyscrollbar-enabled").wrapInner('<div class="overview"></div>').wrapInner('<div class="viewport"></div>').prepend('<div class="scrollbar"><div class="track"><div class="thumb"></div></div></div>').tinyscrollbar(f)
                } else {
                    this.update(d)
                }
            }
            return this
        }, update: function (d, f) {
            if (typeof d === "string") {
                d = b(d)
            }
            if (d instanceof b && d.hasClass("tinyscrollbar-enabled")) {
                var e = d.data("plugin_tinyscrollbar");
                if (typeof e === "object" && e && typeof e.update === "function") {
                    e.update(f)
                }
            }
            return this
        }, updateContent: function (d, e) {
            if (typeof d === "string") {
                d = b(d)
            }
            if (d instanceof b) {
                if (d.hasClass("tinyscrollbar-enabled")) {
                    d.find(".overview").html(e)
                } else {
                    d.html(e)
                }
            }
            return this
        }
    }
});
Slickplan.define("session", function (f, e, d) {
    var g = i();
    if (!g) {
        e.log("No sessionStorage support!", "error")
    }
    function i() {
        try {
            window.sessionStorage.setItem("slickplan", 1);
            window.sessionStorage.removeItem("slickplan");
            return window.sessionStorage
        } catch (o) {
            return false
        }
    }

    function h(o) {
        if (!g) {
            return
        }
        var p = g.getItem(o);
        if (p !== null) {
            p = f.parseJSON(p)
        }
        return p
    }

    function b(p, r, o) {
        if (!g) {
            return
        }
        try {
            val_str = JSON.stringify(r);
            g.setItem(p, val_str)
        } catch (q) {
            e.log("sessionStorage error " + q.code + ": " + q.message, "warn");
            if (!o && f.isArray(r) && r.length > 2) {
                r = r.slice(2);
                b(p, r, true)
            }
        }
        return k(p)
    }

    function m(p) {
        if (!g) {
            return
        }
        if (p instanceof RegExp) {
            for (var r = 0, o = g.length - 1; o >= r; --o) {
                var q = g.key(o);
                if (p.test(q)) {
                    g.removeItem(q)
                }
            }
        } else {
            g.removeItem(p);
            return k(p)
        }
    }

    function a(o, p) {
        if (!g) {
            return
        }
        var q = h(o);
        if (q !== null && q !== d) {
            if (f.isArray(q)) {
                if (typeof p !== "number") {
                    p = q.length - 1
                }
                return q[p] ? q[p] : null
            }
        }
        return q
    }

    function n(o, q) {
        if (!g) {
            return
        }
        var p = h(o);
        if (p !== null && p !== d) {
            if (f.isArray(p)) {
                p.push(q);
                q = p
            } else {
                q = [p, q]
            }
        } else {
            q = [q]
        }
        return b(o, q)
    }

    function c(p, r) {
        if (!g) {
            return
        }
        var s = h(p);
        if (s !== null && s !== d) {
            if (f.isArray(s)) {
                if (typeof r !== "number") {
                    var o = s.slice(0, -1)
                } else {
                    var o = [];
                    for (var q = 0; q < s.length; ++q) {
                        if (q !== r) {
                            o.push(s[q])
                        }
                    }
                }
                return b(p, o)
            }
        }
    }

    function k(o) {
        if (!g) {
            return
        }
        var p = h(o);
        if (p !== null && p !== d) {
            if (f.isArray(p)) {
                return p.length
            }
            return 1
        }
        return 0
    }

    function j(o) {
        if (!g) {
            return
        }
        g.clear()
    }

    return {getData: h, setData: b, removeData: m, getItem: a, addItem: n, removeItem: c, countItems: k, clear: j}
});
Slickplan.define("sitemap", function (c3, bV, bh) {
    var bb = bV.require("svg");
    var dc = bV.require("config");
    var ay = bV.require("color");
    var bF = bV.require("string");
    var cH = bV.require("helper");
    var aT = dc.get("statics_path");
    var cJ = window.document;
    var bn = null;
    var cV = c3(window);
    var cm = cJ.documentElement;
    var J = ("WebkitAppearance" in cm.style);
    var bS = (!J && (/(msie|trident)/i.test(navigator.userAgent)));
    var a4 = (navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    var aG = {};
    var bk = null;
    var an = null;
    var aD = {};
    var b2 = {};
    var e = {};
    var Z = {
        container: null,
        edit: true,
        preview: false,
        allow_collapsing: false,
        autosave: false,
        scale: 1,
        min_width: 1000,
        data_section: "section",
        data_parent: "parent",
        data_childs: "childs",
        data_text: "text",
        data_color: "color",
        data_text_color: "textcolor",
        data_level: "level",
        data_order: "order",
        data_desc: "desc",
        data_desc_width: "descwidth",
        data_url: "url",
        data_file: "file",
        data_archetype: "archetype",
        data_cell_ref: "cell",
        data_helper_type: "type",
        data_old_text: "backup",
        id_main_section: "svgmainsection",
        action_button_width: 23,
        cell_padding: {font_11: [8, 0, 8, 0], "default": [9, 5, 9, 5]},
        min_height: 36,
        section_toolbar_height: 47,
        disable_hover: false,
        contributors_colors: ["#d0000f", "#2292c1", "#5eca3c", "#cd5a1d", "#5a3aa2"]
    };
    var bf = {template: "horizontal", design: "flat", color_scheme: "default", text_shadow: false};
    var cS = {};
    var cg = {};
    var bN = {};
    var cA = {};
    var am = null;
    var cv = {};
    var c = {
        horizontal: {
            paper_padding: [35, 45, 150, 45],
            align: "center",
            levels_global: {
                top: "auto",
                left: "auto",
                floating: "none",
                margin_top: 2,
                margin_top_section: 0,
                margin_right: 9,
                margin_bottom: 0,
                margin_left: 0,
                margin_below_childs: 10,
                area_margin_top: 0,
                max_width: 300,
                min_width: 200,
                editing_min_width: 150,
                hover_margin_left: 0,
                hover_margin_right: 10,
                hover_margin_top: 4,
                hover_margin_bottom: 3,
                child_margin_top: 10,
                child_margin_left: 0,
                child_margin_right: 0,
                child_min_width: 75,
                child_max_width: 300
            },
            levels: {
                home: {
                    min_width: 220,
                    max_width: 300,
                    top: 0,
                    left: "center",
                    margin_top: 0,
                    margin_left: 0,
                    margin_right: 0
                },
                util: {
                    margin_left: 6,
                    margin_right: 0,
                    margin_top: 0,
                    margin_bottom: 10,
                    hover_margin_left: 3,
                    hover_margin_right: 3,
                    hover_margin_top: 0,
                    hover_margin_bottom: 0,
                    min_width: 55,
                    max_width: 200
                },
                foot: {
                    max_width: 400,
                    min_width: 50,
                    area_margin_top: 100,
                    margin_top: 6,
                    margin_left: 3,
                    margin_right: 3,
                    hover_margin_left: 3,
                    hover_margin_right: 3,
                    hover_margin_top: 0,
                    hover_margin_bottom: 0
                },
                level1: {
                    margin_top: 32,
                    margin_left: 3,
                    margin_right: 2,
                    area_margin_top: 50,
                    hover_margin_left: 3,
                    hover_margin_right: 2,
                    hover_margin_top: 35,
                    hover_margin_bottom: 3,
                    floating: "left"
                },
                level2: {margin_left: 6, margin_right: 16},
                level3: {margin_right: 12},
                level4: {margin_right: 11}
            }
        },
        vertical: {
            paper_padding: [35, 55, 35, 55],
            align: "left",
            levels_global: {
                top: "auto",
                left: "auto",
                floating: "none",
                margin_top: 4,
                margin_top_section: 0,
                margin_right: 0,
                margin_bottom: 0,
                margin_left: 0,
                margin_below_childs: 10,
                area_margin_top: 0,
                max_width: 300,
                min_width: 300,
                editing_min_width: 300,
                hover_margin_left: 3,
                hover_margin_right: 2,
                hover_margin_top: 2,
                hover_margin_bottom: 3,
                child_margin_top: 10,
                child_margin_left: 39,
                child_margin_right: 0,
                child_min_width: 300,
                child_max_width: 300
            },
            levels: {
                home: {margin_top: 90, margin_top_section: -90},
                util: {
                    margin_left: 6,
                    margin_right: 0,
                    margin_top: 0,
                    margin_bottom: 10,
                    hover_margin_left: 3,
                    hover_margin_right: 3,
                    hover_margin_top: 0,
                    hover_margin_bottom: 0,
                    min_width: 50,
                    max_width: 200
                },
                foot: {
                    max_width: 400,
                    min_width: 50,
                    area_margin_top: 100,
                    margin_top: 6,
                    margin_left: 3,
                    margin_right: 3,
                    hover_margin_left: 3,
                    hover_margin_right: 3,
                    hover_margin_top: 0,
                    hover_margin_bottom: 0
                }
            }
        }
    };
    var bH = {"default": {default_color: "#d5d5d5", lines_color: "#e5e5e5", text_color: "#595959"}};
    var a5 = {};
    var cQ = {};
    var dm = {};
    var aN = {};
    var L = {};
    var cR = {};
    var x = {};
    var O = {};
    var r = {
        "move-top-left": {width: 82, height: 32, background: "#f2f4f6", text: bV.__("MOVE PAGE")},
        "move-top-right": {width: 82, height: 32, background: "#f2f4f6", text: bV.__("MOVE PAGE")},
        "move-top": {width: 86, height: 30, background: "#f2f4f6", text: bV.__("MOVE PAGE"), arrow: "left"},
        "move-bottom": {width: 86, height: 30, background: "#f2f4f6", text: bV.__("MOVE PAGE"), arrow: "left"},
        "move-middle": {width: 116, height: 30, background: "#f2f4f6", text: bV.__("MAKE SUB PAGE"), arrow: "left"},
        "add-top-left": {width: 82, height: 32, background: "#fff", text: "+ " + bV.__("ADD PAGE")},
        "add-top-right": {width: 82, height: 32, background: "#fff", text: "+ " + bV.__("ADD PAGE")},
        "add-top": {width: 86, height: 30, background: "#fff", text: "+ " + bV.__("ADD PAGE"), arrow: "left"},
        "add-bottom": {width: 86, height: 30, background: "#fff", text: "+ " + bV.__("ADD PAGE"), arrow: "left"},
        "add-middle": {width: 116, height: 30, background: "#fff", text: "+ " + bV.__("ADD SUB PAGE"), arrow: "left"},
        "hover-home": {width: 159, height: 36, text: bV.__("ADD HOME CELL")},
        "hover-util": {width: 108, height: 33, text: bV.__("ADD PAGE")},
        "hover-foot": {width: 153, height: 33, text: bV.__("ADD FOOTER CELL")}
    };
    var dj = {
        selected_cells: {},
        selected_cells_count: 0,
        selected_cells_data: {},
        changes: {},
        backup: null,
        data_backups: {},
        autosave: dc.get("auto_save", false),
        single_edit: false
    };
    var ao = false;
    var b1;

    function df(dp, dn) {
        return (Z[dp] !== bh) ? Z[dp] : dn
    }

    function cs() {
        return Z
    }

    function cO(dn, dp) {
        if (cH.isObject(dn)) {
            dd(dn)
        } else {
            Z[dn] = dp;
            if (dn === "allow_collapsing") {
                c.horizontal.levels_global.child_margin_top = dp ? 20 : 10
            }
        }
    }

    function dd(dn) {
        c3.each(dn, function (dp, dq) {
            cO(dp, dq)
        })
    }

    function bp() {
        if (Z.min_height <= 0) {
            Z.min_height = cU("MW", 200);
            Z.min_height = Z.min_height.cell_height
        }
        if (cg.svg !== bh && cg.defs !== bh) {
            return
        }
        cg.svg = bb.createElementNs("svg", {width: 1000, height: 400, id: "slickplan"}, Z.container);
        cg.defs = bb.createElementNs("defs", null, cg.svg);
        bb.createElementNs("rect", {
            width: 24,
            height: 24,
            fill: "#282828",
            "shape-rendering": "crispEdges",
            id: "svg-bar-archetype"
        }, cg.defs);
        var dq = bb.createElementNs("svg", {id: "svg-bar-section", width: 24, height: 24}, cg.defs);
        bb.createElementNs("rect", {
            x: 0,
            y: 0,
            rx: 2,
            ry: 2,
            width: "100%",
            height: "100%",
            fill: "#006699",
            "shape-rendering": "auto"
        }, dq);
        bb.embedImage(aT + "img/icon-section.png", {x: 5, y: 7, width: 13, height: 11, "pointer-events": "none"}, dq);
        bb.embedImage(aT + "img/collapse-plus.png", {id: "svg-collapse-plus-icon", width: 13, height: 13}, cg.defs);
        bb.embedImage(aT + "img/collapse-minus.png", {id: "svg-collapse-minus-icon", width: 13, height: 13}, cg.defs);
        bb.createElementNs("path", {
            stroke: "#000",
            "stroke-width": 2,
            opacity: 0.2,
            d: "M -3 -6 h2 M 1 -6 h2 M -3 -2 h2 M 1 -2 h2 M -3 2 h2 M 1 2 h2 M -3 6 h2 M 1 6 h2",
            "shape-rendering": "crispEdges",
            id: "svg-move-button-icon"
        }, cg.defs);
        bb.createElementNs("path", {
            fill: "#000",
            opacity: 0.2,
            d: "M -4 -2 L 4 -2 L 0 2 L -4 -2",
            "shape-rendering": "crispEdges",
            id: "svg-menu-button-icon"
        }, cg.defs);
        var dp = bb.createElementNs("text", {
            x: 0,
            y: 0,
            dy: "1.3em",
            fill: "#fff",
            stroke: "#000",
            "stroke-opacity": 0.17,
            "font-size": 12,
            "font-family": "fontawesome",
            "font-weight": "normal",
            space: "preserve",
            "text-anchor": "middle",
            id: "svg-icon-note"
        }, cg.defs);
        dp.appendChild(cJ.createTextNode(bF.getFontAwesomeUnicode("fa-file")));
        var dr = bb.createElementNs("text", {
            x: 0,
            y: 0,
            dy: "1.28em",
            fill: "#fff",
            stroke: "#000",
            "stroke-opacity": 0.17,
            "font-size": 13,
            "font-family": "fontawesome",
            "font-weight": J ? "normal" : "bold",
            space: "preserve",
            "text-anchor": "middle",
            id: "svg-icon-url"
        }, cg.defs);
        dr.appendChild(cJ.createTextNode(bF.getFontAwesomeUnicode("fa-link")));
        var dn = bb.createElementNs("text", {
            x: 0,
            y: 0,
            dy: "1.28em",
            fill: "#fff",
            stroke: "#000",
            "stroke-opacity": 0.17,
            "font-size": 13,
            "font-family": "fontawesome",
            "font-weight": J ? "normal" : "bold",
            space: "preserve",
            "text-anchor": "middle",
            id: "svg-icon-file"
        }, cg.defs);
        dn.appendChild(cJ.createTextNode(bF.getFontAwesomeUnicode("fa-picture-o")));
        bb.createElementNs("circle", {
            cx: 1.5,
            cy: -0.5,
            r: 4,
            fill: "#fff",
            "stroke-width": 1,
            "shape-rendering": "geometricPrecision",
            id: "svg-connection-hook"
        }, cg.defs, false, true);
        cY("svg-gradient-cell-foreground", [{step: 0, color: "#fff", opacity: 0.6}, {
            step: 100,
            color: "#fff",
            opacity: 0
        }]);
        bR();
        bb.createElementNs("rect", {
            width: "1000%",
            height: "1000%",
            fill: "#fff",
            "shape-rendering": "crispEdges",
            id: "svg-section-bg"
        }, cg.defs);
        if (dc.get("cells_uppercase", false)) {
            Z.container.classList.add("uppercase")
        }
        bb.createElementNs("rect", {
            rx: 6,
            ry: 6,
            "stroke-width": 1.5,
            "stroke-linecap": "round",
            width: "100%",
            height: "100%",
            "shape-rendering": "auto",
            id: "svg-cell-foreground"
        }, cg.defs);
        bb.createElementNs("rect", {
            id: "svg-cell-disabled-mask",
            fill: "#fff",
            opacity: 0.5,
            width: "100%",
            height: "100%"
        }, cg.defs);
        bb.createElementNs("rect", {
            id: "svg-cell-enabled-mask",
            fill: "#fff",
            opacity: 0.001,
            width: "100%",
            height: "100%"
        }, cg.defs)
    }

    function bR() {
        bb.forEach(r, function (dp, dn) {
            if (dp.substring(0, 6) === "hover-") {
                return
            }
            var ds = bb.createElementNs("svg", {id: "svg-hover-helper-" + dp, width: dn.width, height: dn.height});
            bb.createElementNs("rect", {
                x: 0,
                y: 0,
                "stroke-width": 0,
                fill: "rgba(255, 255, 255, 0)",
                width: dn.width,
                height: dn.height
            }, ds);
            if (dn.arrow === "left") {
                dn.width -= 4;
                dn.height -= 4;
                var du = dn.height / 2;
                var dq = 4;
                bb.createElementNs("rect", {
                    x: 4,
                    y: 0,
                    "stroke-width": 0,
                    fill: "#bdc7d5",
                    width: dn.width,
                    height: dn.height
                }, ds);
                bb.createElementNs("rect", {
                    x: 6,
                    y: 2,
                    "stroke-width": 0,
                    width: dn.width - 4,
                    height: dn.height - 4,
                    fill: dn.background
                }, ds);
                bb.createElementNs("polygon", {
                    points: "6," + (du - 6) + " 6," + (du + 6) + " 0," + du,
                    fill: "#bdc7d5",
                    "shape-rendering": "crispEdges"
                }, ds);
                bb.createElementNs("polygon", {
                    points: "7," + (du - 4) + " 7," + (du + 4) + " 2," + du,
                    fill: dn.background,
                    "shape-rendering": "crispEdges"
                }, ds)
            } else {
                dn.height -= 6;
                var du = Math.round(dn.width / 2);
                var dq = 0;
                bb.createElementNs("rect", {
                    x: 0,
                    y: 0,
                    "stroke-width": 0,
                    fill: "#bdc7d5",
                    width: dn.width,
                    height: dn.height
                }, ds);
                bb.createElementNs("rect", {
                    x: 2,
                    y: 2,
                    "stroke-width": 0,
                    width: dn.width - 4,
                    height: dn.height - 4,
                    fill: dn.background
                }, ds);
                bb.createElementNs("polygon", {
                    points: (du - 6) + "," + (dn.height - 2) + " " + (du + 6) + "," + (dn.height - 2) + " " + (du) + "," + (dn.height + 5),
                    fill: "#bdc7d5",
                    "shape-rendering": "crispEdges"
                }, ds);
                bb.createElementNs("polygon", {
                    points: (du - 3) + "," + (dn.height - 2) + " " + (du + 4) + "," + (dn.height - 2) + " " + (du) + "," + (dn.height + 2),
                    fill: dn.background,
                    "shape-rendering": "crispEdges"
                }, ds)
            }
            for (var dv = 6; dv <= 18; dv += 6) {
                bb.createElementNs("rect", {
                    x: 0 + dq,
                    y: dv,
                    width: dn.width,
                    height: 2,
                    "stroke-width": 0,
                    fill: dn.background
                }, ds)
            }
            for (var dw = 4; dw <= dn.width - 6; dw += 6) {
                bb.createElementNs("rect", {
                    x: dw + dq,
                    y: 0,
                    width: 2,
                    height: dn.height,
                    "stroke-width": 0,
                    fill: dn.background
                }, ds)
            }
            var dt = bb.createElementNs("text", {
                x: 0,
                y: 0,
                "font-size": "11",
                "font-family": "Arial, Helvetica, sans-serif",
                "font-weight": "700",
                "text-anchor": "middle",
                "text-rendering": "optimizeLegibility"
            });
            var dr = bb.createElementNs("tspan", {
                fill: "#b4bfce",
                dy: ".38em",
                x: (dn.width + dq) / 2,
                y: dn.height / 2
            }, dt);
            dr.appendChild(cJ.createTextNode(dn.text));
            ds.appendChild(dt);
            cg.defs.appendChild(ds)
        }, true)
    }

    function V(dt, dp, dr) {
        if (!dr || !dr.type) {
            return false
        }
        var ds = "svg-bar-archetype-" + dt;
        if (e[ds]) {
            return ds
        }
        var dn = bb.createElementNs("svg", {id: ds, width: 24, height: 24});
        bb.createElementNs("rect", {
            x: 0,
            y: 0,
            rx: 2,
            ry: 2,
            width: "100%",
            height: "100%",
            fill: "#282828",
            "shape-rendering": "auto"
        }, dn);
        if (dr.type === "letter") {
            var dq = bb.createElementNs("text", {
                x: "50%",
                y: 0,
                dy: "1.44em",
                fill: "#fff",
                "font-size": 12,
                space: "preserve",
                "font-weight": "bold",
                "text-anchor": "middle",
                "class": "icon",
                "pointer-events": "none"
            }, dn);
            dq.appendChild(cJ.createTextNode(dr.letter))
        } else {
            if (dr.type === "fa") {
                var dq = bb.createElementNs("text", {
                    x: "50%",
                    y: 0,
                    dy: "1.28em",
                    fill: "#fff",
                    "font-size": 13,
                    "font-family": "fontawesome",
                    "font-weight": "normal",
                    space: "preserve",
                    "text-anchor": "middle",
                    "class": "icon",
                    "pointer-events": "none"
                }, dn);
                dq.appendChild(cJ.createTextNode(bF.getFontAwesomeUnicode(dr.fa)))
            } else {
                if (dr.type === "image") {
                    bb.embedImage(dr.image, {
                        x: 4,
                        y: 4,
                        width: 16,
                        height: 16,
                        "class": "icon",
                        "pointer-events": "none"
                    }, dn)
                }
            }
        }
        cg.defs.appendChild(dn);
        e[ds] = true;
        return ds
    }

    function M(dt, dn, dq) {
        var ds = "svg-bar-archetype-" + dt;
        if (e[ds]) {
            var dr = cJ.getElementById(ds);
            dr.removeChild(dr.querySelector(".icon"));
            if (dq.type === "letter") {
                var dp = bb.createElementNs("text", {
                    x: "50%",
                    y: 0,
                    dy: "1.44em",
                    fill: "#fff",
                    "font-size": 12,
                    space: "preserve",
                    "font-weight": "bold",
                    "text-anchor": "middle",
                    "class": "icon",
                    "pointer-events": "none"
                }, dr);
                dp.appendChild(cJ.createTextNode(dq.letter))
            } else {
                if (dq.type === "fa") {
                    var dp = bb.createElementNs("text", {
                        x: "50%",
                        y: 0,
                        dy: "1.28em",
                        fill: "#fff",
                        "font-size": 13,
                        "font-family": "fontawesome",
                        "font-weight": "normal",
                        space: "preserve",
                        "text-anchor": "middle",
                        "class": "icon",
                        "pointer-events": "none"
                    }, dr);
                    dp.appendChild(cJ.createTextNode(bF.getFontAwesomeUnicode(dq.fa)))
                } else {
                    if (dq.type === "image") {
                        bb.embedImage(dq.image, {
                            x: 4,
                            y: 4,
                            width: 16,
                            height: 16,
                            "class": "icon",
                            "pointer-events": "none"
                        }, dr)
                    }
                }
            }
        } else {
            V(dt, dn, dq)
        }
    }

    function aI(dt, dr) {
        var ds = "svg-bar-archetype-" + dt;
        var dq = false;
        if (dr) {
            var dn = bb.getElementsByClassName(cg.svg, "has-archetype-" + dt);
            if (dn && dn.length) {
                for (var dp = dn.length - 1; dp >= 0; --dp) {
                    ae(dn[dp], true);
                    dq = true
                }
            }
        }
        bb.removeElement(ds);
        if (dq) {
            d()
        }
    }

    function a9(dq, dn, dr) {
        dq = dq || {};
        if (dq.id !== bh) {
            var dp = dq.id
        } else {
            if (cg[Z.id_main_section] === bh) {
                var dp = Z.id_main_section
            } else {
                var dp = bb.generateUniqueId()
            }
        }
        if (cg[dp] !== bh) {
            return false
        }
        cg[dp] = {};
        if (dk(dp) && !dr) {
            bp()
        }
        cg[dp].group = bb.createElementNs("g", {id: dp, "class": dk(dp) ? "" : "sitemap-section"}, cg.svg);
        bb.setMatrix(cg[dp].group, [Z.scale, 0, 0, Z.scale, 0, (dk(dp) ? 0 : 10000)]);
        W(dp);
        cg[dp].options = c3.extend({}, bf);
        if (cH.isObject(dq)) {
            c3.extend(cg[dp].options, dq)
        }
        cg[dp].options.text_shadow = !(!cg[dp].options.text_shadow || cg[dp].options.text_shadow === "false");
        bb.setData(cg[dp].group, Z.data_section, dp);
        bV.publish("sitemap/section_create", [dp, dn]);
        if (!dn) {
            b9(dp)
        }
        return dp
    }

    function W(dn) {
        if (!cg[dn]) {
            return false
        }
        if (cg[dn].group_util) {
            bb.removeElement(cg[dn].group_util)
        }
        cg[dn].group_util = bb.createElementNs("g", {
            id: dn + "-group-util",
            "class": "sitemap-group sitemap-group-util",
            transform: "matrix(1, 0, 0, 1, 0, 0)"
        }, cg[dn].group);
        if (cg[dn].group_foot) {
            bb.removeElement(cg[dn].group_foot)
        }
        cg[dn].group_foot = bb.createElementNs("g", {
            id: dn + "-group-foot",
            "class": "sitemap-group sitemap-group-foot",
            transform: "matrix(1, 0, 0, 1, 0, 0)"
        }, cg[dn].group);
        if (cg[dn].group_main) {
            bb.removeElement(cg[dn].group_main)
        }
        cg[dn].group_main = bb.createElementNs("g", {
            id: dn + "-group-main",
            "class": "sitemap-group sitemap-group-main",
            transform: "matrix(1, 0, 0, 1, 0, 0)"
        }, cg[dn].group)
    }

    function bC() {
        if (bb.getElement(am) || (cH.isObject(cg[am]) && cg[am].group) || cH.isObject(bN[am])) {
            return am
        }
        return Z.id_main_section
    }

    function b9(dn) {
        if (!dn) {
            dn = Z.id_main_section
        }
        am = dn
    }

    function dk(dn) {
        if (!dn) {
            dn = bC()
        }
        return (dn === Z.id_main_section)
    }

    function az(dp) {
        var dq = a6(dp);
        if (dq.group) {
            var dn = bb.getMatrix(dq.group);
            return (dn[5] < 10000)
        }
        return false
    }

    function cI(dt) {
        var dw = a6();
        if (!dw.group || Z.preview || !Z.edit) {
            return
        }
        if (typeof dt === "string") {
            dt = [dt]
        }
        if (!dt || !dt.length) {
            return
        }
        for (var dq = 0; dq < dt.length; ++dq) {
            var dy = "PAGE";
            var dp = 12;
            switch (dt[dq]) {
                case"home":
                    dy = "HOME CELL";
                    break;
                case"util":
                    dp = 11;
                    break;
                case"foot":
                    dy = "FOOTER CELL";
                    dp = 11;
                    break;
                default:
                    dt[dq] = "cell"
            }
            dy = bV.__("ADD " + dy);
            var dr = {font_size: dp, type: "button"};
            if (r["hover-" + dt[dq]] === bh) {
                var dz = cU(dy, bh, dr);
                r["hover-" + dt[dq]] = {width: dz.box_width, height: dz.box_height, text: dy}
            }
            var dx = bb.getElementsByClassName(dw.group, "add-button-" + dt[dq]);
            if (!dx.length) {
                var dv = (dt[dq] === "home" || dt[dq] === "cell") ? "main" : dt[dq];
                var dn = dw.group.querySelector(".sitemap-group-" + dv);
                if (!dn) {
                    dn = dw.group
                }
                var ds = bb.createElementNs("g", {
                    "class": "sitemap-group sitemap-group-add-button-" + dt[dq],
                    transform: "matrix(1, 0, 0, 1, 0, 0)"
                }, dn);
                dx = bb.createElementNs("svg", {
                    width: r["hover-" + dt[dq]].width,
                    height: r["hover-" + dt[dq]].height,
                    "class": "add-button add-button-" + dt[dq]
                }, ds);
                bb.createElementNs("rect", {
                    x: 2,
                    y: 2,
                    width: r["hover-" + dt[dq]].width - 4,
                    height: r["hover-" + dt[dq]].height - 4,
                    fill: "#fff",
                    stroke: "#BDC7D5",
                    "stroke-width": 2,
                    "stroke-dasharray": "5,5",
                    "shape-rendering": "crispEdges"
                }, dx, true);
                var du = bb.createElementNs("tspan", {
                    x: (r["hover-" + dt[dq]].width / 2) + 1,
                    y: 0,
                    dy: "1.8em",
                    fill: "#B4BFCE"
                }, bb.createElementNs("text", dr, dx));
                aX(dx.id, {width: r["hover-" + dt[dq]].width, height: r["hover-" + dt[dq]].height});
                du.appendChild(cJ.createTextNode("+ " + r["hover-" + dt[dq]].text))
            }
        }
    }

    function a2() {
        if (Z.preview) {
            return
        }
        bV.log("_insertAddPageButtons()", "time");
        var dp = a6();
        if (dp.group) {
            var dn = [];
            if (!dp.group.querySelector(".add-button-home, .cell.level-home")) {
                dn.push("home")
            }
            if (!dp.group.querySelector(".add-button-cell, .cell.level-1")) {
                dn.push("cell")
            }
            if (dk()) {
                if (!dp.group.querySelector(".add-button-foot, .cell.level-foot")) {
                    dn.push("foot")
                }
                if (!dp.group.querySelector(".add-button-util, .cell.level-util")) {
                    dn.push("util")
                }
            }
            if (dn.length) {
                cI(dn)
            }
        }
        bV.log("_insertAddPageButtons()", "timeEnd")
    }

    function cb(dz, dp, dn, dF) {
        var du = a6(dF);
        if (du.group) {
            dz = dz || {};
            var dB = dz.id || bb.generateUniqueId();
            var dr = du.group.querySelector(".sitemap-group-main");
            if (dz.text === bh || dz.text === false || dz.text === null) {
                dz.text = ""
            }
            dz.text = "" + dz.text;
            var dC = dz.order || 999999;
            if (dz.parent !== bh || dz.before !== bh || dz.after !== bh) {
                if (dz.order === bh) {
                    if (dz.parent !== bh) {
                        var dx = bb.getElement(dz.parent);
                        var dt = bY(dx);
                        if (dt.length) {
                            dC = 999999
                        }
                    } else {
                        if (dz.before !== bh) {
                            var dq = bb.getElement(dz.before);
                            dC = parseInt(bb.getData(dq, Z.data_order), 10) - 1
                        } else {
                            var dq = bb.getElement(dz.after);
                            dC = parseInt(bb.getData(dq, Z.data_order), 10) + 1
                        }
                        var dx = bb.getData(dq, Z.data_parent);
                        if (dx) {
                            dz.parent = dx
                        }
                    }
                }
                if (dz.parent) {
                    dl(dz.parent, dB);
                    dp = aH(dz.parent);
                    var dx = bb.getElement(dz.parent);
                    if (dx && dx.id) {
                        var ds = du.group.querySelector(".sitemap-group-" + dx.id);
                        if (!ds) {
                            ds = bb.createElementNs("g", {
                                "class": "sitemap-group sitemap-group-" + dx.id,
                                transform: "matrix(1, 0, 0, 1, 0, 0)"
                            }, y(dx))
                        }
                        dr = ds
                    }
                }
            }
            if (!dp) {
                dp = dz.level ? dz.level : 1
            }
            if (dp === "home") {
                dC = 1
            } else {
                if (dp !== "util" && dp !== "foot") {
                    dp = parseInt(dp, 10)
                }
            }
            var dy = du.group.querySelector(".sitemap-group-" + dB);
            if (!dy) {
                if (dp === "util" || dp === "foot") {
                    var dD = du.group.querySelector(".sitemap-group-" + dp)
                } else {
                    if (dp === "home") {
                        var dD = du.group.querySelector(".sitemap-group-main")
                    } else {
                        if (typeof dp === "number") {
                            var dD = y(dr, true);
                            if (!dD) {
                                var dD = bb.createElementNs("g", {
                                    "class": "sitemap-group sitemap-group-childrens",
                                    transform: "matrix(1, 0, 0, 1, 0, 0)"
                                }, dr)
                            }
                        } else {
                            var dD = dr
                        }
                    }
                }
                dy = bb.createElementNs("g", {
                    "class": "sitemap-group sitemap-group-" + dB,
                    transform: "matrix(1, 0, 0, 1, 0, 0)"
                }, dD, (dp === "home"))
            }
            var dE = c[du.options.template];
            var dw = bb.createElementNs("svg", {
                "class": "cell",
                id: dB,
                width: 0,
                height: 0,
                x: dE.paper_padding[0],
                y: dE.paper_padding[3]
            });
            bb.clearCache(true, dB);
            bb.clearDatas(dB);
            cQ[dB] = {};
            if (typeof dp === "number" && dp > 1 && dz.parent) {
                bb.setData(dw, Z.data_parent, dz.parent)
            }
            if (dz[Z.data_color]) {
                bb.setData(dw, Z.data_color, ay.toHex(dz[Z.data_color]))
            }
            if (dz[Z.data_text_color]) {
                bb.setData(dw, Z.data_text_color, ay.toHex(dz[Z.data_text_color]))
            }
            if (dz[Z.data_desc]) {
                bb.setData(dw, Z.data_desc, dz[Z.data_desc]);
                if (dz.descwidth && (dz.descwidth = parseInt(dz.descwidth, 10)) > 260) {
                    bb.setData(dw, Z.data_desc_width, dz.descwidth)
                }
            }
            if (dz[Z.data_url]) {
                bb.setData(dw, Z.data_url, dz[Z.data_url])
            }
            if (dz[Z.data_file]) {
                bb.setData(dw, Z.data_file, dz[Z.data_file])
            }
            if (dz[Z.data_archetype]) {
                bb.setData(dw, Z.data_archetype, dz[Z.data_archetype])
            }
            if (dz[Z.data_section]) {
                bb.setData(dw, Z.data_section, dz[Z.data_section])
            }
            bb.addClass(dw, "level-" + dp);
            var dv = 2;
            cQ[dB][".foreground"] = bb.use("svg-cell-foreground", {"class": "foreground"}, dw);
            cQ[dB][".highlight"] = bb.createElementNs("rect", {
                "class": "highlight",
                rx: 5,
                ry: 5,
                x: 1,
                y: 1,
                "stroke-width": 0
            }, dw);
            if (typeof dz.text !== "string") {
                if (typeof dz.text.join === "function") {
                    dz.text = dz.text.join(" ")
                } else {
                    dz.text = ""
                }
            }
            dz.text = c3.trim(dz.text);
            bb.setData(dw, Z.data_level, dp);
            bb.setData(dw, Z.data_text, dz.text);
            bb.setData(dw, Z.data_order, dC);
            if (Z.edit) {
                var dA = bb.createElementNs("svg", {
                    "class": "action move",
                    width: Z.action_button_width - 4,
                    height: "100%"
                }, dw);
                cQ[dB][".action.move"] = dA;
                cQ[dA.id] = {};
                cQ[dA.id][".bg"] = bb.createElementNs("rect", {
                    "class": "bg",
                    rx: 6,
                    ry: 6,
                    x: 1,
                    width: Z.action_button_width + 2,
                    height: "100%",
                    opacity: 0
                }, dA);
                bb.use("svg-move-button-icon", {x: "50%", y: "50%"}, dA);
                cQ[dA.id][".line"] = bb.createElementNs("rect", {"class": "line", width: 1, x: 18, height: "100%"}, dA);
                var dG = bb.createElementNs("svg", {
                    "class": "action menu",
                    width: Z.action_button_width - 4,
                    height: "100%",
                    x: "100%"
                }, dw);
                cQ[dB][".action.menu"] = dG;
                cQ[dG.id] = {};
                cQ[dG.id][".bg"] = bb.createElementNs("rect", {
                    "class": "bg",
                    rx: 6,
                    ry: 6,
                    x: -6,
                    width: Z.action_button_width + 2,
                    height: "100%",
                    opacity: 0
                }, dG);
                bb.use("svg-menu-button-icon", {x: "50%", y: "50%"}, dG);
                cQ[dG.id][".line"] = bb.createElementNs("rect", {"class": "line", width: 1, height: "100%"}, dG)
            }
            if (dy) {
                dy.appendChild(dw)
            } else {
                if (du["group_" + dp] !== bh && du["group_" + dp]) {
                    du["group_" + dp].appendChild(dw)
                } else {
                    du.group.appendChild(dw)
                }
            }
            return dw
        } else {
            if (du) {
                du.cells.push(dz)
            }
        }
    }

    function ct(dq, dp, dn) {
        if (!dq || !dq.id) {
            return false
        }
        if (cQ[dq.id] && cQ[dq.id][dp] && (dn || (typeof dq.contains === "function" && dq.contains(cQ[dq.id][dp])))) {
            return cQ[dq.id][dp]
        } else {
            if (!cH.isObject(cQ[dq.id])) {
                cQ[dq.id] = {}
            }
            cQ[dq.id][dp] = dn ? dq.querySelectorAll(dp) : dq.querySelector(dp);
            return cQ[dq.id][dp]
        }
    }

    function bG(dy, dq) {
        var dx = a6();
        if (!dx.group || bb.hasClass(dy, "hidden")) {
            return
        }
        dy = bb.getElement(dy);
        var dt = ct(dy, ".foreground");
        var dn = bb.getData(dy, Z.data_color) || S(dy);
        var dz = bb.getAttr(dt, "fill");
        if (dz === dn && !dq) {
            return
        }
        var dp = ay.toHexDarker(dn, 0.185);
        if (dx.options.design === "gradient") {
            var ds = "svg-border-gradient-" + dn.replace("#", "");
            cY(ds, [{step: 0, color: ay.toHexLighter(dn, 0.03)}, {step: 100, color: dp}])
        }
        if (Z.edit) {
            var dw = ct(dy, ".action.move");
            var dv = ct(dy, ".action.menu")
        }
        var dr = ds ? "url(#" + ds + ")" : dp;
        bb.setAttr(dt, "fill", dn);
        bb.setAttr(dt, "stroke", dr);
        bb.setAttr(ct(dy, ".highlight"), "fill", (ds ? "url(#svg-gradient-cell-foreground)" : "transparent"));
        if (Z.edit) {
            bb.setAttr(ct(dw, ".bg"), "fill", dr);
            bb.setAttr(ct(dv, ".bg"), "fill", dr);
            bb.setAttr(ct(dw, ".line"), "fill", dr);
            bb.setAttr(ct(dv, ".line"), "fill", dr)
        }
        var du = bb.getElementsByClassName(dy, "hook");
        if (du.length) {
            bb.setAttr(du[0], "stroke", dp)
        }
    }

    function c4(dq) {
        var dr = a6();
        if (dr.group) {
            var dn = bb.getElementsByClassName(dr.group, "cell");
            for (var dp = dn.length - 1; dp >= 0; --dp) {
                bG(dn[dp], dq)
            }
        }
    }

    function cK(dn, ds) {
        var dt = a6();
        if (!dt.group || bb.hasClass(dn, "hidden")) {
            return
        }
        dn = bb.getElement(dn);
        var dp = dn.querySelectorAll(".text");
        var dq = bb.getData(dn, Z.data_text_color) || S("text_color");
        for (var dr = dp.length; dr >= 0; dr--) {
            var du = bb.getAttr(dp[dr], "fill");
            bb.setAttr(dp[dr], "fill", dq)
        }
    }

    function aC(dq) {
        var dr = a6();
        if (dr.group) {
            var dn = bb.getElementsByClassName(dr.group, "cell");
            for (var dp = dn.length - 1; dp >= 0; --dp) {
                cK(dn[dp], dq)
            }
        }
    }

    function cB(dP, dn, dB, dS) {
        if (dB && dn === dB) {
            dB = bh
        }
        if (typeof dP === "object" && dP.id === bh && dP.length) {
            for (var d1 = 0, d0 = dP.length; d1 < d0; ++d1) {
                cB(dP[d1], dn, dB)
            }
            return
        }
        if (bb.hasClass(dP, "hidden")) {
            return false
        }
        dP = bb.getElement(dP);
        if (!dP || !dP.id) {
            return false
        }
        var dz = ct(dP, ".foreground");
        var dp = ct(dP, ".highlight");
        var du = bb.getData(dP) || {};
        var dO = du[Z.data_text] || "";
        var dD = du[Z.data_desc] || false;
        var ds = du[Z.data_url] || false;
        var dE = du[Z.data_file] || false;
        var dM = du[Z.data_archetype] || false;
        var dC = du[Z.data_section] || false;
        var dI = (dM ? 1 : 0) + (dC ? 1 : 0);
        var dK = (dD ? 1 : 0) + (ds ? 1 : 0) + (dE ? 1 : 0);
        if (dc.get("cells_uppercase", false)) {
            dO = dO.toUpperCase()
        }
        if (dS !== bh && dc.get("cells_numbering", false)) {
            dO = dS + ". " + dO
        }
        if (dB) {
            if (dO === "") {
                var dt = cL(du[Z.data_level]);
                dn = dt.editing_min_width
            } else {
                var dY = cU(dO, null, {max_width: dB, archetype: dM, section: dC, icons_left: dI, icons_right: dK});
                dn = Math.min(dB, Math.max(dY.box_width, dn))
            }
        }
        if (Z.edit) {
            var dQ = ct(dP, ".action.menu");
            bb.setAttr(dQ, "x", dn - Z.action_button_width + 4)
        }
        var dA = dP.getElementById("bar-archetype-" + dP.id);
        var dX = dP.getElementById("bar-section-" + dP.id);
        if (dM && typeof dM === "string") {
            var dR = dc.get("archetypes", {});
            if (dM.charAt(0) === "_" && dR[dM] && dR[dM].name) {
                var dq = dR[dM].name;
                var d2 = {type: "image", image: aT + "img/icon-archetype-" + dM.replace(/^_/, "") + ".png"}
            } else {
                if (dR._custom && dR._custom[dM] && dR._custom[dM].name) {
                    var dq = dR._custom[dM].name;
                    if (dR._custom[dM].icon.substring(0, 3) === "fa-") {
                        var d2 = {type: "fa", fa: dR._custom[dM].icon}
                    } else {
                        if (dR._custom[dM].icon.length === 1) {
                            var d2 = {type: "letter", letter: dR._custom[dM].icon}
                        } else {
                            var d2 = {type: "letter", letter: bF.sanitize(dq).charAt(0).toUpperCase()}
                        }
                    }
                } else {
                    dM = false;
                    du[Z.data_archetype] = bh;
                    bb.removeData(dP, Z.data_archetype)
                }
            }
        }
        if (dM && typeof dM === "string") {
            var dT = V(dM, dq, d2);
            if (dA) {
                bb.setAttr(dA, "href", "#" + dT, false, "xlink")
            } else {
                var dL = ["bar-archetype", "bar-archetype-" + dM, "cell-icon-left"];
                if (dM.charAt(0) === "_" || (dR._custom[dM] && dR._custom[dM].desc)) {
                    dL.push("has-desc")
                }
                dA = bb.use(dT, {id: "bar-archetype-" + dP.id, "class": dL.join(" ")}, dP)
            }
        } else {
            if (dA) {
                bb.removeElement(dA)
            }
        }
        if (dC) {
            if (!dX) {
                dX = bb.use("svg-bar-section", {
                    id: "bar-section-" + dP.id,
                    "class": "bar-section cell-icon-left",
                    x: 4
                }, dP)
            }
        } else {
            if (dX) {
                bb.removeElement(dX)
            }
        }
        var dY = cU(dO, dn, {archetype: dM, section: dC, icons_left: dI, icons_right: dK});
        var dr = Math.max(dY.cell_height || dY.box_height, Z.min_height);
        var dV = false;
        var dx = (dr / 2) - 12;
        if (dI > 1 || dK > 1) {
            dV = true;
            dx = dr;
            dr += 31
        }
        if (dC) {
            bb.setAttr(dX, "y", dx)
        }
        if (dM) {
            bb.setAttr(dA, "x", (dC ? 31 : 4));
            bb.setAttr(dA, "y", dx)
        }
        bb.setAttr(dP, "width", dn);
        bb.setAttr(dP, "height", dr);
        var dH = bC();
        if (dH) {
            aX(dP, {width: dn, height: dr})
        }
        if (dp) {
            bb.setAttr(dp, "width", dn - 2);
            bb.setAttr(dp, "height", dr - 2)
        }
        var dU = ct(dP, ".celltext");
        if (!dU) {
            dU = bb.createElementNs("text", {"class": "celltext"}, dP)
        } else {
            while (dU.firstChild) {
                dU.removeChild(dU.firstChild)
            }
        }
        if (dY.text_multiline !== bh && dY.text_multiline.join("")) {
            var dG;
            for (var d1 = 0; d1 < dY.text_multiline.length; d1++) {
                dG = bb.createElementNs("tspan", {
                    fill: "rgba(255, 255, 255, .5)",
                    x: (dn / 2) + 1,
                    y: 22 + (d1 * 18) + 1,
                    "class": "shadow"
                }, dU);
                dG.appendChild(cJ.createTextNode(dY.text_multiline[d1]));
                dG = bb.createElementNs("tspan", {
                    fill: S("text_color"),
                    x: (dn / 2),
                    y: 22 + (d1 * 18),
                    "class": "text"
                }, dU);
                dG.appendChild(cJ.createTextNode(dY.text_multiline[d1]))
            }
        }
        var dW = dP.getElementById("bar-icons-wrapper-" + dP.id);
        if (!dW && (dV || dK > 0)) {
            dW = bb.createElementNs("rect", {
                rx: 2,
                ry: 2,
                height: 24,
                fill: "#000",
                opacity: 0.3,
                "shape-rendering": "crispEdges",
                id: "bar-icons-wrapper-" + dP.id,
                "class": "bar-icons-wrapper",
                "pointer-events": "none"
            }, dP)
        }
        if (dW) {
            var dJ = {width: 24, x: dn - 4 - 24, y: dx};
            if (dV) {
                dJ.x = (dI > 1) ? 58 : ((dI > 0) ? 31 : 4);
                dJ.width = dn - dJ.x - 4
            }
            bb.setAttr(dW, dJ)
        }
        var dN = dn - 16 - (dV ? 4 : 0);
        var dw = dP.getElementById("icon-note-" + dP.id);
        var dF = dP.getElementById("icon-url-" + dP.id);
        var dy = dP.getElementById("icon-file-" + dP.id);
        if (dD) {
            if (!dw) {
                dw = bb.use("svg-icon-note", {"class": "icon-note cell-icon-right", id: "icon-note-" + dP.id}, dP)
            }
            bb.setAttr(dw, "x", dN);
            bb.setAttr(dw, "y", dx)
        } else {
            if (dw) {
                bb.removeElement(dw)
            }
        }
        if (ds) {
            if (!dF) {
                dF = bb.use("svg-icon-url", {"class": "icon-url cell-icon-right", id: "icon-url-" + dP.id}, dP)
            }
            bb.setAttr(dF, "x", dN - (dD ? 22 : 0));
            bb.setAttr(dF, "y", dx)
        } else {
            if (dF) {
                bb.removeElement(dF)
            }
        }
        if (dE) {
            if (!dy) {
                dy = bb.use("svg-icon-file", {"class": "icon-file cell-icon-right", id: "icon-file-" + dP.id}, dP)
            }
            bb.setAttr(dy, "x", dN - ((dD && ds) ? 44 : ((dD || ds) ? 22 : 0)));
            bb.setAttr(dy, "y", dx)
        } else {
            if (dy) {
                bb.removeElement(dy)
            }
        }
        if (dW && !dV && !dD && !ds && !dE) {
            bb.removeElement(dW)
        }
        bG(dP, true);
        cK(dP, true);
        var dv = ["cell"];
        if (bb.hasClass(dP, "hidden")) {
            dv.push("hidden")
        }
        if (bb.hasClass(dP, "hidden-but-refresh")) {
            dv.push("hidden-but-refresh")
        }
        if (bb.hasClass(dP, "collapsed")) {
            dv.push("collapsed")
        }
        if (bb.hasClass(dP, "highlighted")) {
            dv.push("highlighted")
        }
        bb.forEach(du, function (d3, d4) {
            if (d4 !== bh) {
                dv.push("has-" + d3);
                if (d3 === "archetype" && dT) {
                    dv.push("has-" + d3 + "-" + dT.replace("svg-bar-archetype-", ""))
                } else {
                    if (d3 === "level") {
                        dv.push("level-" + d4)
                    }
                }
            }
        });
        bb.setAttr(dP, "class", dv.join(" "));
        var dZ = dP.querySelector(".cellmask");
        if (dZ) {
            bb.bringToFront(dZ)
        }
    }

    function cz(dv, dp, dq, du) {
        var ds = a6(du);
        if (ds.group) {
            dv = bb.getElement(dv);
            if (!dp) {
                var dt = bb.getData(dv.id, Z.data_parent);
                if (dt) {
                    b6(dt, dv.id)
                }
            }
            var dn = bb.removeElement(y(dv));
            aU(dv)
        } else {
            if (dv && ds.cells) {
                if (typeof dv !== "string") {
                    dv = dv.id
                }
                var dw = [];
                for (var dr = 0; dr < ds.cells.length; ++dr) {
                    if (ds.cells[dr].id !== dv) {
                        dw.push(ds.cells[dr])
                    }
                }
                ds.cells = dw
            }
        }
        if (dq !== true) {
            an = bh;
            bV.publish("sitemap/cell_removed");
            bV.publish("sitemap/sitemap_modified", ["cell_remove", bC()])
        }
        return true
    }

    function y(dn, dt) {
        dn = bb.getElement(dn);
        if (dn) {
            if (cD(dn, "g", "sitemap-group")) {
                if (dt) {
                    if (!cD(dn, "g", "sitemap-group-childrens")) {
                        var du = dn.childNodes;
                        for (var ds = 0, dr = du.length; ds < dr; ++ds) {
                            if (cD(du[ds], "g", "sitemap-group-childrens")) {
                                return du[ds]
                            }
                        }
                    }
                    return false
                } else {
                    if (cD(dn, "g", "sitemap-group-childrens")) {
                        return dn.parentNode
                    }
                }
                return dn
            }
            if (dn.id) {
                var dq = dn.id;
                var dp = 10;
                while (--dp) {
                    if (dn && dn.parentNode) {
                        dn = dn.parentNode;
                        if (dn && cD(dn, "g", "sitemap-group-" + dq)) {
                            if (dt) {
                                var du = dn.childNodes;
                                for (var ds = 0, dr = du.length; ds < dr; ++ds) {
                                    if (cD(du[ds], "g", "sitemap-group-childrens")) {
                                        return du[ds]
                                    }
                                }
                                return false
                            }
                            return dn
                        }
                    }
                }
            }
        }
        return false
    }

    function bQ(dr) {
        dr = bb.getElement(dr);
        if (dr) {
            if (cD(dr, "svg", "cell")) {
                return dr
            }
            if (cD(dr, "g", "sitemap-group-childrens")) {
                dr = dr.parentNode
            }
            if (cD(dr, "g", "sitemap-group")) {
                var dq = dr.childNodes;
                for (var dp = 0, dn = dq.length; dp < dn; ++dp) {
                    if (cD(dq[dp], "svg", "cell")) {
                        return dq[dp]
                    }
                }
            }
        }
        return false
    }

    function cD(dp, dn, dq) {
        dp = bb.getElement(dp);
        return !!(dp && typeof dn === "string" && dp.tagName && dp.tagName.toLowerCase() === dn.toLowerCase() && (!dq || bb.hasClass(dp, dq)))
    }

    var cG = null;
    var b3 = {};

    function cU(dv, dA, dw) {
        if (!dw || !cH.isObject(dw)) {
            dw = {}
        }
        var ds = (dw.font_size !== bh) ? dw.font_size : 12;
        if (Z.cell_padding["font_" + ds]) {
            var dx = c3.extend([], Z.cell_padding["font_" + ds])
        } else {
            var dx = c3.extend([], Z.cell_padding["default"])
        }
        if ((dw.icons_left && dw.icons_left > 1) || (dw.icons_right && dw.icons_right > 1)) {
            dx[1] += 12;
            dx[3] += 12
        } else {
            if ((dw.icons_left && dw.icons_left > 0) || (dw.icons_right && dw.icons_right > 0)) {
                dx[1] += 24;
                dx[3] += 24
            }
        }
        dv = c3.trim("" + dv);
        if (dv) {
            dv = dv.replace(/\s\s+/g, " ")
        }
        if (!cG) {
            cG = {};
            cG.svg = bb.createElementNs("svg", {
                "class": "cell",
                id: "text-test-box",
                width: 0,
                height: 0,
                x: "50%",
                y: "50%"
            }, cg.svg, true);
            cG.text = bb.createElementNs("text", {
                "class": "celltext",
                x: 0,
                y: 0,
                "font-size": ds,
                "font-family": "Arial, Helvetica, sans-serif",
                "font-weight": "700",
                "text-anchor": "middle",
                "text-rendering": "optimizeLegibility"
            }, cG.svg);
            cG.tspan = bb.createElementNs("tspan", {dy: ".38em", x: 0, y: 0}, cG.text)
        } else {
            bb.removeClass(cG.svg, "hidden")
        }
        if (typeof b3[ds] !== "object") {
            b3[ds] = {}
        }
        var dF = dx[1] + dx[3] + (Z.preview ? 0 : Z.action_button_width * 2);
        if (dA || dw.max_width) {
            var dt = dw.max_width || dA;
            dt -= dF;
            var dn = 1;
            var dy = dv.split(/\s/);
            var dq = "";
            var dD = "";
            var dE = [];
            var dr = dr;
            var dp = 0;
            for (var dC = 0, dB = dy.length; dC < dB; ++dC) {
                if (dy[dC]) {
                    if (dD) {
                        dD += " "
                    }
                    dD += dy[dC];
                    if (b3[ds][dD] === bh) {
                        cG.tspan.textContent = dD;
                        b3[ds][dD] = cG.text.getBBox()
                    }
                    if (b3[ds][dD].width > dt) {
                        if (dq) {
                            dE.push(dq)
                        }
                        dq = dy[dC];
                        dD = dy[dC]
                    } else {
                        dq = dD;
                        dp = Math.max(dp, b3[ds][dD].width)
                    }
                }
            }
            if (dq) {
                dE.push(dq)
            }
            var du = ds * dE.length + (dE.length - 1) * 6.1 + 5;
            var dz = {
                box_width: dp + dF,
                cell_height: du + dx[0] + dx[2],
                box_height: du + dx[0] + dx[2],
                text_multiline: dE
            }
        } else {
            if (b3[ds][dv] === bh) {
                cG.tspan.textContent = dv;
                b3[ds][dv] = cG.text.getBBox()
            }
            var dz = {box_width: b3[ds][dv].width + dF, box_height: ds + 5 + dx[0] + dx[2]}
        }
        bb.addClass(cG.svg, "hidden");
        return dz
    }

    var aA = 0;
    var bD = 0;
    var q = 0;
    var o = 0;
    var aE = {};
    var Q = {};

    function cP(dv, dy, dt, dz) {
        var ds = bY(dv, true);
        if (ds.length) {
            dv = bb.getElement(dv);
            var dG = false;
            var dC = (aD[dv.id] && aD[dv.id].width) ? aD[dv.id].width : bb.getFloat(dv, "width");
            var dB = (aD[dv.id] && aD[dv.id].height) ? aD[dv.id].height : bb.getFloat(dv, "height");
            var dx = (aD[dv.id] && aD[dv.id].x) ? aD[dv.id].x : bb.getFloat(dv, "x");
            var dw = (aD[dv.id] && aD[dv.id].y) ? aD[dv.id].y : bb.getFloat(dv, "y");
            var dI = bW(ds[0]);
            var dp = cL(dI);
            var dn = dw + dB;
            q = dn;
            var dA = bb.hasClass(dv, "collapsed");
            if (dA) {
                aE["l" + dI] = q
            }
            for (var dD = 0; dD < ds.length; ++dD) {
                var dq = bb.getElement(ds[dD]);
                if (bb.hasClass(dq, "hidden")) {
                    continue
                }
                var dH = dt + "." + (dD + 1);
                var dF = Math.min(dp.child_max_width, Math.max(dp.child_min_width, dC - dp.margin_left - dp.margin_right));
                if (typeof dy === "number" && dy) {
                    dF = Math.max(dF, dy)
                }
                var dE = (!cH.isObject(dz) || !dz.ids || c3.inArray(dq.id, dz.ids) >= 0);
                if ((!cH.isObject(dz) || dz.type.width || dz.type.height) && dE) {
                    cB(dq, dF, bh, dH)
                }
                var dw = q + dp.margin_top;
                if (dD === 0) {
                    dw += dp.child_margin_top
                }
                if (dG) {
                    dw += dp.margin_below_childs;
                    dG = false
                }
                if ((!cH.isObject(dz) || dz.type.x) && dE) {
                    if (!aD[dq.id]) {
                        aD[dq.id] = {}
                    }
                    aD[dq.id].x = dx + dp.margin_left
                }
                if ((!cH.isObject(dz) || dz.type.y) && dE) {
                    if (!aD[dq.id]) {
                        aD[dq.id] = {}
                    }
                    aD[dq.id].y = dw
                }
                dn = dw + bb.getFloat(dq, "height");
                q = Math.max(q, dn);
                aA = Math.max(aA, dn);
                if ((!cH.isObject(dz) || dz.type.data_order) && dE) {
                    bb.setData(dq, Z.data_order, (dD + 1) * 1000)
                }
                if (cP(dq, dy, dH, dz)) {
                    dG = true
                }
            }
            var du = a6();
            b2[du.group.id] = Math.max(b2[du.group.id], aA);
            if (dA) {
                var dr = q - aE["l" + dI];
                aA -= dr;
                q = aE["l" + dI];
                aE["l" + dI] = q;
                dG = false
            }
            return true
        }
        return false
    }

    function C(dx, dp, du) {
        dx = db(dx);
        var dq = false;
        if (dx && dx.length) {
            var dv = a6();
            var dn = cL(dp);
            du += dn.margin_left + dn.child_margin_left;
            for (var dr = 0; dr < dx.length; ++dr) {
                var dw = bb.getElement(dx[dr]);
                if (bb.hasClass(dw, "hidden")) {
                    continue
                }
                cB(dw, dn.min_width, dn.max_width);
                if (dr === 0) {
                    aA += dn.child_margin_top
                } else {
                    aA += dn.margin_top
                }
                if (dq) {
                    aA += dn.margin_below_childs;
                    dq = false
                }
                bb.setAttr(dw, "x", du);
                bb.setAttr(dw, "y", aA);
                aX(dw, {x: du, y: aA});
                aA += bb.getFloat(dw, "height");
                bb.setData(dw, Z.data_order, (dr + 1) * 1000);
                var dt = bb.hasClass(dw, "collapsed");
                if (dt) {
                    Q["l" + dp] = aA
                }
                var ds = bY(dw);
                if (ds.length && C(ds, dp + 1, du)) {
                    dq = true
                }
                b2[dv.group.id] = Math.max(b2[dv.group.id], aA);
                if (dt && Q["l" + dp]) {
                    aA = Q["l" + dp];
                    Q["l" + dp] = aA
                }
            }
            return true
        }
        return false
    }

    function cC(dE) {
        var dB = a6();
        if (!dB.group) {
            return
        }
        bV.log("_refreshPaper()", "time");
        aD = {};
        dE = c3.extend({home: true, util: true, foot: true, cells: true}, dE);
        var dP = c[dB.options.template];
        var dv = Math.max(Z.min_width, Math.min(Z.container.offsetWidth, cJ.documentElement.clientWidth));
        var dM = dv;
        var dt = dv - dP.paper_padding[1] - dP.paper_padding[3];
        var du = bb.getElementsByClassName(dB.group, "svg-section-background");
        if (du.length) {
            bb.removeElement(du[0])
        }
        var dF = 0;
        o = 0;
        aA = 0;
        q = 0;
        b2[dB.group.id] = 0;
        if (dP.align === "center") {
            var dx = bb.getElementsByClassName(dB.group, "level-1").length;
            if (dx) {
                var dq = cL(1);
                dF = (dt / dx) - dq.margin_left - dq.margin_right;
                if (dF > dq.max_width) {
                    dF = dq.max_width
                } else {
                    if (dF < dq.min_width) {
                        dF = dq.min_width
                    }
                }
                dM = (dF + dq.margin_left + dq.margin_right) * dx;
                dM = Math.max(dM + dP.paper_padding[1] + dP.paper_padding[3], dv)
            }
        }
        if (dE.home) {
            var dq = cL("home");
            var ds = bb.getElementsByClassName(dB.group, "level-home");
            ds = ds.length ? ds[0] : false;
            var dD = dq.margin_left + dP.paper_padding[3];
            var dC = dq.margin_top + dP.paper_padding[0];
            var dO = false;
            if (!dk() || (Z.preview && !cJ.getElementById("sitemap-logo"))) {
                dC += dq.margin_top_section
            }
            if (ds) {
                var dp = bb.getElementsByClassName(dB.group, "add-button-home");
                if (dp.length) {
                    bb.removeElement(y(dp[0]));
                    aU(dp[0])
                }
                cB(ds, dq.min_width, dq.max_width);
                var dN = false
            } else {
                ds = bb.getElementsByClassName(dB.group, "add-button-home");
                ds = ds.length ? ds[0] : false;
                var dN = true
            }
            if (ds) {
                var dL = (dN && r["hover-home"] && r["hover-home"].width) ? r["hover-home"].width : (aD[ds.id] && aD[ds.id].width ? aD[ds.id].width : bb.getFloat(ds, "width"));
                var dz = (dN && r["hover-home"] && r["hover-home"].height) ? r["hover-home"].height : (aD[ds.id] && aD[ds.id].height ? aD[ds.id].height : bb.getFloat(ds, "height"));
                if (dP.align === "center") {
                    dD = Math.floor((dM - dL) / 2)
                }
                if (!aD[ds.id]) {
                    aD[ds.id] = {}
                }
                aD[ds.id].x = dD;
                aD[ds.id].y = dC;
                o = dD + dL;
                aA = dC + dz;
                dO = true
            }
        } else {
            var ds = bb.getElementsByClassName(dB.group, "level-home");
            ds = ds.length ? ds[0] : false;
            if (!ds) {
                ds = bb.getElementsByClassName(dB.group, "add-button-home");
                ds = ds.length ? ds[0] : false
            }
            if (ds) {
                o = bb.getFloat(ds, "x") + bb.getFloat(ds, "width");
                aA = bb.getFloat(ds, "y") + bb.getFloat(ds, "height");
                dO = true
            }
        }
        b2[dB.group.id] = Math.max(b2[dB.group.id], aA);
        dg(dM, !dE.util, true);
        if (typeof dE.cells === "object") {
            var dK = {width: true, height: true, x: true, y: true, data_order: true};
            if (cH.isObject(dE.cells.type)) {
                dK = c3.extend(dK, dE.cells.type)
            }
            dE.cells = {ids: (cH.isObject(dE.cells.ids)) ? dE.cells.ids : false, type: dK}
        }
        if (dE.cells) {
            var dx = bb.getElementsByClassName(dB.group, "level-1");
            var dq = cL(1);
            if (dx.length) {
                var dp = bb.getElementsByClassName(dB.group, "add-button-cell");
                if (dp.length) {
                    bb.removeElement(y(dp[0]));
                    aU(dp[0])
                }
                if (dP.align === "center") {
                    var dw = db(dx);
                    if (!cH.isObject(dE.cells) || dE.cells.type.width || dE.cells.type.height) {
                        for (var dI = 0; dI < dw.length; ++dI) {
                            if (!dE.cells.ids || c3.inArray(bb.getAttr(dw[dI], "id"), dE.cells.ids) >= 0) {
                                cB(dw[dI], dF, bh, dI + 1)
                            }
                        }
                    }
                    var dt = (dF + dq.margin_left + dq.margin_right) * dx.length;
                    var dG = dM - dP.paper_padding[1] - dP.paper_padding[3] - dt;
                    var dr = 0;
                    var dn = aA + (dO ? dq.area_margin_top : 0);
                    if (dn <= 0) {
                        var dQ = cL("home");
                        dn = dQ.margin_top + dP.paper_padding[0]
                    }
                    for (var dI = 0; dI < dw.length; ++dI) {
                        var ds = bb.getElement(dw[dI]);
                        var dz = bb.getFloat(ds, "height");
                        if (dq.floating === "left") {
                            if (dI === 0) {
                                dr = (dG / 2) + dP.paper_padding[3]
                            }
                            var dJ = (!cH.isObject(dE.cells) || !dE.cells.ids || c3.inArray(ds.id, dE.cells.ids) >= 0);
                            if ((!cH.isObject(dE.cells) || dE.cells.type.x) && dJ) {
                                if (!aD[ds.id]) {
                                    aD[ds.id] = {}
                                }
                                aD[ds.id].x = dr
                            }
                            if ((!cH.isObject(dE.cells) || dE.cells.type.y) && dJ) {
                                if (!aD[ds.id]) {
                                    aD[ds.id] = {}
                                }
                                aD[ds.id].y = dn
                            }
                            dr += dF + dq.margin_left + dq.margin_right
                        }
                        aA = Math.max(aA, dn + dz);
                        b2[dB.group.id] = Math.max(b2[dB.group.id], aA);
                        if (!cH.isObject(dE.cells) || dE.cells.type.data_order) {
                            bb.setData(ds, Z.data_order, (dI + 1) * 1000)
                        }
                        cP(ds, (dF / 2) + 3, (dI + 1), dE.cells)
                    }
                } else {
                    C(dx, 1, dP.paper_padding[3])
                }
            } else {
                var dp = bb.getElementsByClassName(dB.group, "add-button-cell");
                if (dp.length) {
                    dp = dp[0];
                    var dL = (r["hover-cell"] && r["hover-cell"].width) ? r["hover-cell"].width : bb.getFloat(dp, "width");
                    var dz = (r["hover-cell"] && r["hover-cell"].height) ? r["hover-cell"].height : bb.getFloat(dp, "height");
                    var dD = 0;
                    var dC = aA + dq.area_margin_top;
                    if (dP.align === "center") {
                        dD = Math.floor((dM - dL) / 2)
                    } else {
                        dD = dP.paper_padding[3] + dq.margin_left + dq.child_margin_left;
                        dC += dq.child_margin_top
                    }
                    if (!aD[dp.id]) {
                        aD[dp.id] = {}
                    }
                    aD[dp.id].x = dD;
                    aD[dp.id].y = dC;
                    aA = Math.max(aA, dC + dz);
                    b2[dB.group.id] = Math.max(b2[dB.group.id], aA)
                }
            }
        } else {
            if (dE.foot) {
                var dx = bb.getElementsByClassName(dB.group, "cell");
                if (dx.length) {
                    for (var dI = 0; dI < dx.length; ++dI) {
                        if (typeof bW(dx[dI]) === "number") {
                            aA = bb.getFloat(dx[dI], "y") + bb.getFloat(dx[dI], "height")
                        }
                    }
                    b2[dB.group.id] = Math.max(b2[dB.group.id], aA)
                }
            }
        }
        bb.forEach(aD, function (dS, dR) {
            bb.forEach(dR, function (dT, dU) {
                bb.setAttr(dS, dT, dU);
                if (dT === "x") {
                    aX(dS, {x: dU})
                } else {
                    if (dT === "y") {
                        aX(dS, {y: dU})
                    }
                }
            })
        }, true);
        aD = {};
        if (dE.foot) {
            bD = 0;
            var dA = bb.getElement(dB.group.id + "-group-main");
            var dy = dA.childNodes;
            var dx = null;
            for (var dI = 0, dH = dy.length; dI < dH; ++dI) {
                if (cD(dy[dI], "g", "sitemap-group-childrens")) {
                    dx = dy[dI].querySelectorAll("svg.cell");
                    break
                }
            }
            if (dx) {
                for (var dI = 0, dH = dx.length; dI < dH; ++dI) {
                    if (bb.hasClass(dx[dI], "hidden") || bb.hasClass(dx[dI], "hidden-but-refresh")) {
                        continue
                    }
                    bD = Math.max(bD, bb.getAttr(dx[dI], "y") + bb.getAttr(dx[dI], "height"))
                }
            }
            if (bD > 0) {
                aA = bD
            } else {
                bD = aA
            }
            b2[dB.group.id] = Math.max(b2[dB.group.id], aA);
            c7(dM, dE.foot, true)
        }
        bb.forEach(aD, function (dS, dR) {
            bb.forEach(dR, function (dT, dU) {
                bb.setAttr(dS, dT, dU);
                if (dT === "x") {
                    aX(dS, {x: dU})
                } else {
                    if (dT === "y") {
                        aX(dS, {y: dU})
                    }
                }
            })
        }, true);
        aD = {};
        bV.log("_refreshPaper()", "timeEnd")
    }

    function Y(dq) {
        if (typeof dq === "string") {
            dq = a6(dq)
        }
        if (dq && dq.group) {
            var dn = bb.getElementsByClassName(dq.group, "svg-section-background");
            var dp = bb.getElementsByClassName(dq.group, "svg-blocked-background");
            if (dn.length) {
                bb.addClass(dn[0], "hidden")
            }
            if (dp.length) {
                bb.addClass(dp[0], "hidden")
            }
            var dr = dq.group.getBBox();
            if (dn.length) {
                bb.removeClass(dn[0], "hidden")
            }
            if (dp.length) {
                bb.removeClass(dp[0], "hidden")
            }
            return dr
        }
        return false
    }

    function a3(dn) {
        setTimeout(function () {
            var dv = a6(Z.id_main_section);
            if (!dv.group) {
                return
            }
            bV.log("_refreshContainerSize()", "time");
            at(false);
            var dz = Y(dv);
            if (!dn) {
                dn = Z.scale
            }
            var dx = c[dv.options.template];
            var dq = cV.width();
            var dA = cV.height() - c3("#slickplan-sitemap").offset().top - 50;
            var dy = cg.svg.childNodes;
            if (dy) {
                for (var ds = 0, dr = dy.length; ds < dr; ++ds) {
                    var dp = dk(dy[ds].id);
                    if (cD(dy[ds], "g", "section-visible") || dp) {
                        var dt = a6(dy[ds].id);
                        if (dt && dt.group) {
                            var du = dt.group.id;
                            if (L[du]) {
                                for (var dw in L[du]) {
                                    if (dw !== bh && L[du].hasOwnProperty(dw) && L[du][dw] && L[du][dw].x2) {
                                        dq = Math.max(dq, dn * (L[du][dw].x2 + dx.paper_padding[1]));
                                        dA = Math.max(dA, dn * (L[du][dw].y2 + dx.paper_padding[2] + (dp ? 0 : Z.section_toolbar_height)))
                                    }
                                }
                            }
                            if (cR[dt.group.id]) {
                                for (var dw in cR[du]) {
                                    if (dw !== bh && cR[du].hasOwnProperty(dw) && cR[du][dw] && cR[du][dw].x2) {
                                        dq = Math.max(dq, dn * (cR[du][dw].x2 + dx.paper_padding[1]));
                                        dA = Math.max(dA, dn * (cR[du][dw].y2 + dx.paper_padding[2] + (dp ? 0 : Z.section_toolbar_height)))
                                    }
                                }
                            }
                        }
                    }
                }
            }
            bb.setAttr(cg.svg, "width", dq);
            bb.setAttr(cg.svg, "height", dA);
            bV.log("_refreshContainerSize()", "timeEnd");
            bV.publish("sitemap/container_refreshed")
        }, 2)
    }

    function bU() {
        bV.log("_drawConnectionsLines()", "time");
        var dw = a6();
        if (!dw.group) {
            return
        }
        var dz = 3;
        var dJ = c[dw.options.template];
        var dp = dw.group.querySelectorAll(".connection");
        var dH = dp.length;
        if (dH > 0) {
            while (--dH >= 0) {
                bb.removeElement(dp[dH])
            }
        }
        var dC = 0;
        if (dJ.align === "center") {
            var dB = 0;
            var du = bb.getElementsByClassName(dw.group, "level-home");
            if (!du.length) {
                du = bb.getElementsByClassName(dw.group, "add-button-home")
            }
            var dx = bb.getElementsByClassName(dw.group, "level-1");
            if (!dx.length) {
                dx = bb.getElementsByClassName(dw.group, "add-button-cell")
            }
            if (du.length && dx.length) {
                du = du[0];
                var dy = dJ.paper_padding[0] + 5;
                if (dx.length > 1) {
                    dx = db(dx);
                    if (dx.length % 2 === 0) {
                        var dF = (dx.length / 2) - 1;
                        dB = bb.getFloat(dx[dF], "x") + bb.getFloat(dx[dF], "width") + 1
                    } else {
                        var dF = Math.floor(dx.length / 2);
                        dB = bb.getFloat(dx[dF], "x") + (bb.getFloat(dx[dF], "width") / 2)
                    }
                } else {
                    dB = cV.width() / 2
                }
                dC = bb.getFloat(dx[0], "y") + 18;
                bt(dB, dy, dC - dy, true, du, dw.group)
            }
            var dr = bb.getElementsByClassName(dw.group, "level-1");
            if (dr.length) {
                if (!dC) {
                    dC = bb.getFloat(dr[0], "y") + 18
                }
                var dA = 999999;
                var dD = 0;
                for (var dH = 0, dG = dr.length; dH < dG; ++dH) {
                    var dn = bb.getFloat(dr[dH], "x") + (bb.getFloat(dr[dH], "width") / 2);
                    dA = Math.min(dA, dn);
                    dD = Math.max(dD, dn);
                    aj(dr[dH], dn - 5)
                }
                if (dr.length > 1) {
                    b7(dA, dC - 1, dD - dA, bh, bh, dw.group)
                }
            }
        } else {
            var dr = bb.getElementsByClassName(dw.group, "level-1");
            dr = db(dr);
            var dv = dr.length;
            if (dr && dv) {
                for (var dH = 0; dH < dv; ++dH) {
                    var dK = bb.getFloat(dr[dH], "y");
                    var dt = bb.getFloat(dr[dH], "height");
                    if (dH >= dv - 1) {
                        var dI = bb.getElementsByClassName(dw.group, "level-home");
                        if (!dI.length) {
                            dI = bb.getElementsByClassName(dw.group, "add-button-home")
                        }
                        if (dI.length) {
                            c1(dI[0], dK + dt / 2, true)
                        }
                    }
                }
            } else {
                var dq = bb.getElementsByClassName(dw.group, "add-button-cell");
                if (dq.length) {
                    dq = dq[0];
                    var dK = bb.getFloat(dq, "y");
                    var dt = bb.getFloat(dq, "height");
                    var dI = bb.getElementsByClassName(dw.group, "level-home");
                    if (!dI.length) {
                        dI = bb.getElementsByClassName(dw.group, "add-button-home")
                    }
                    if (dI.length) {
                        c1(dI[0], dK + dt / 2, true)
                    }
                }
            }
            dr = bb.getElementsByClassName(dw.group, "cell");
            for (var dE = 0; dE < dr.length; ++dE) {
                if (bb.hasClass(dr[dE], "level-home") || bb.hasClass(dr[dE], "level-util") || bb.hasClass(dr[dE], "level-foot") || bb.hasClass(dr[dE], "hidden")) {
                    continue
                }
                var ds = bY(dr[dE], true);
                var dv = ds.length;
                if (dv) {
                    c1(dr[dE])
                }
            }
        }
        if (!dk()) {
            bb.use("svg-section-bg", {"class": "svg-section-background"}, dw.group, true)
        }
        bV.log("_drawConnectionsLines()", "timeEnd")
    }

    function aj(dw, dp) {
        dw = bb.getElement(dw);
        var ds = bY(dw, true);
        if (ds.length) {
            var dq = bb.hasClass(dw, "collapsed");
            var du = false;
            var dC = bb.getFloat(dw, "width");
            var dB = bb.getFloat(dw, "height");
            var dx = bb.getFloat(dw, "y");
            var dr = dp || (dC / 2);
            dr = Math.floor(dr);
            var dy = bb.getFloat(dw, "x");
            var dA = dx + dB + 5;
            var dv = 0;
            var dz = 0;
            for (var dD = 0; dD < ds.length; ++dD) {
                cell = bb.getElement(ds[dD]);
                if (!du) {
                    du = ""
                }
                var dn = bb.getFloat(cell, "x");
                var dG = bb.getFloat(cell, "y");
                var dE = bb.getFloat(cell, "width");
                var dt = bb.getFloat(cell, "height");
                dv = Math.max(dv, dn + dE - dr);
                dz = Math.max(dz, dG + dt / 2);
                du += " " + (dr + 5 + dv + 1.5) + "," + ((dG + dt / 2) + 0.5) + " " + (dr + 5 + dv - 5) + "," + ((dG + dt / 2) + 0.5) + " " + (dr + 5 + dv + 1.5) + "," + ((dG + dt / 2) + 0.5);
                aj(cell, dp)
            }
            if (du) {
                var dF = bb.getData(dw, Z.data_color) || S(dw);
                dF = ay.toHexDarker(dF, 0.185);
                if (Z.allow_collapsing) {
                    br(dw, dF, dr + 5, dx + dB)
                } else {
                    ab(dr, dF, dw)
                }
                aK(dr + 5, dA - 7, dr + 5 + dv, dz, du, dw)
            }
        }
    }

    function c1(ds, dw, dr) {
        if (ds) {
            ds = bb.getElement(ds);
            var dB = bb.getFloat(ds, "width");
            var dz = bb.getFloat(ds, "height");
            var dv = bb.getFloat(ds, "x");
            var dt = bb.getFloat(ds, "y");
            var dq = false;
            if (bb.hasClass(ds, "cell")) {
                var dG = bb.getData(ds, Z.data_color) || S(ds);
                dG = ay.toHexDarker(dG, 0.185);
                if (Z.allow_collapsing && !dr) {
                    br(ds, dG, dv + 23, dt + dz)
                } else {
                    ab(23, dG, ds)
                }
                var du = y(ds, !dr);
                if (dr && du && du.parentNode) {
                    var dn = du.parentNode.childNodes;
                    for (var dF = 0, dE = dn.length; dF < dE; ++dF) {
                        if (cD(dn[dF], "g", "sitemap-group-childrens")) {
                            du = dn[dF];
                            break
                        }
                    }
                }
                if (du) {
                    child_nodes = du.childNodes;
                    if (child_nodes && child_nodes.length) {
                        dq = "";
                        var dy = dv + 23 + 1.5;
                        for (var dF = 0, dE = child_nodes.length; dF < dE; ++dF) {
                            if (cD(child_nodes[dF], "g", "sitemap-group")) {
                                var dD = child_nodes[dF].childNodes;
                                for (var dC = 0, dA = dD.length; dC < dA; ++dC) {
                                    if (cD(dD[dC], "svg", "cell")) {
                                        var dp = bb.getFloat(dD[dC], "height");
                                        var dH = bb.getFloat(dD[dC], "y");
                                        var dx = dH + (dp / 2) + 1.5;
                                        dq += " " + dy + "," + dx + " " + (dy + 23) + "," + dx + " " + dy + "," + dx;
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            }
            aK(dv + 23, dt + dz - 2, dv + 23, dw, dq, ds, dr)
        }
    }

    function p(ds) {
        var dp = bC();
        var dr = a6();
        if (!ds) {
            ds = S("lines_color")
        } else {
            if (dr && dr.options) {
                dr.options.color_scheme = c3.extend({}, bs(), {lines_color: ds})
            }
        }
        if (dr && dr.group) {
            var dn = bb.getElementsByClassName(dr.group, "connection");
            for (var dq = 0; dq < dn.length; ++dq) {
                if (bb.hasClass(dn[dq], "hook") || bb.hasClass(dn[dq], "collapse")) {
                    continue
                }
                if (cD(dn[dq], "polyline")) {
                    bb.setAttr(dn[dq], "stroke", ds)
                } else {
                    bb.setAttr(dn[dq], "fill", ds)
                }
            }
        }
    }

    function c6(dt) {
        var ds = a6();
        if (!dt) {
            dt = S("text_color")
        } else {
            if (ds && ds.options) {
                ds.options.color_scheme = c3.extend({}, bs(), {text_color: dt})
            }
        }
        if (ds && ds.group) {
            var dp = bb.getElementsByClassName(ds.group, "cell");
            for (var dq = 0; dq < dp.length; ++dq) {
                if (!bb.getData(dp[dq], Z.data_text_color)) {
                    var dr = dp[dq].querySelectorAll(".text");
                    if (dr) {
                        for (var dn = dr.length; dn >= 0; --dn) {
                            bb.setAttr(dr[dn], "fill", dt)
                        }
                    }
                }
            }
        }
    }

    function b7(dp, du, dr, dq, dn, dt) {
        if (!dt && dn) {
            dt = y(dn, true)
        }
        if (!dt && dn) {
            dt = y(dn)
        }
        if (!dt) {
            var ds = a6();
            dt = ds.group
        }
        if (dt) {
            dq = !(false === dq);
            bb.createElementNs("rect", {
                x: dp,
                y: du,
                width: dr,
                height: 3,
                "stroke-width": 0,
                "class": "connection" + (dq ? "" : " front"),
                "shape-rendering": "crispEdges",
                fill: S("lines_color")
            }, dt, dq)
        }
    }

    function bt(dq, du, dp, dr, dn, dt) {
        if (!dt && dn) {
            dt = y(dn, true)
        }
        if (!dt && dn) {
            dt = y(dn)
        }
        if (!dt) {
            var ds = a6();
            dt = ds.group
        }
        if (dt) {
            dr = !(false === dr);
            bb.createElementNs("rect", {
                x: dq,
                y: du,
                width: 3,
                height: dp,
                fill: S("lines_color"),
                "stroke-width": 0,
                "class": "connection" + (dr ? "" : " front"),
                "shape-rendering": "crispEdges"
            }, dt, dr)
        }
    }

    function aK(dr, dv, dq, du, dt, dy, ds) {
        var dw = a6();
        if (!dw.group) {
            return
        }
        var dp;
        if (!dp && dy) {
            dp = y(dy, true)
        }
        if (!dp && dy) {
            dp = y(dy)
        }
        if (!dp) {
            dp = dw.group
        }
        var dn = Z.allow_collapsing ? 7.5 : 0;
        if (c[dw.options.template].align === "center") {
            dr += 1.5;
            dq += 1.5;
            var dx = dr + "," + dv + " " + dr + "," + (dv + 8.5 + dn) + " " + dq + "," + (dv + 8.5 + dn);
            if (dt && typeof dt === "string") {
                dx += dt
            }
        } else {
            dr += 1.5;
            dq += 1.5;
            var dx = dr + "," + dv;
            if (dt && typeof dt === "string") {
                dx += dt
            } else {
            }
        }
        bb.createElementNs("polyline", {
            points: dx,
            fill: "none",
            stroke: S("lines_color"),
            "stroke-width": 3,
            "class": "connection",
            "shape-rendering": "crispEdges"
        }, dp, true)
    }

    function ab(dn, dp, dq) {
        var ds = a6();
        if (!ds.group) {
            return
        }
        var dr = bb.getElementsByClassName(dq, "hook");
        if (c[ds.options.template].align === "center") {
            dn = dn + 5 - bb.getFloat(dq, "x")
        }
        if (dr.length) {
            bb.setAttr(dr[0], "x", dn);
            bb.setAttr(dr[0], "y", bb.getFloat(dq, "height"));
            bb.setAttr(dr[0], "stroke", dp)
        } else {
            bb.use("svg-connection-hook", {
                x: dn,
                y: bb.getFloat(dq, "height"),
                stroke: dp,
                "class": "connection hook"
            }, dq)
        }
    }

    function br(dp, dq, dn, du) {
        var ds = a6();
        if (!ds.group) {
            return
        }
        if (!dn) {
            dn = bb.getFloat(dp, "x") + (bb.getFloat(dp, "width") / 2)
        }
        if (!du) {
            du = bb.getFloat(dp, "y") + bb.getFloat(dp, "height")
        }
        var dt;
        if (dp) {
            dt = y(dp)
        }
        if (!dt) {
            dt = ds.group
        }
        if (bb.hasClass(dp, "collapsed")) {
            var dr = "svg-collapse-plus-icon"
        } else {
            var dr = "svg-collapse-minus-icon"
        }
        var dr = bb.use(dr, {
            "shape-rendering": "geometricPrecision",
            "class": "connection collapse " + bb.getAttr(dp, "id")
        }, dt);
        bb.setAttr(dr, "x", dn - 5, true);
        bb.setAttr(dr, "y", du - 5, true)
    }

    function cY(ds, dq) {
        if (!bb.getElement(ds)) {
            dq = dq || {};
            var dr = bb.createElementNs("linearGradient", {id: ds, "class": "def-gradient"}, cg.defs);
            for (var dp = 0; dp < dq.length; ++dp) {
                var dn = dq[dp] || {};
                if (dn.step === bh) {
                    dn.step = 100
                }
                if (dn.color === bh) {
                    dn.color = "#fff"
                }
                if (dn.opacity === bh) {
                    dn.opacity = 1
                }
                bb.createElementNs("stop", {
                    offset: dn.step + "%",
                    "stop-color": dn.color,
                    "stop-opacity": dn.opacity
                }, dr)
            }
        }
    }

    function cx(dp, dt, dq) {
        dp = bb.getElement(dp);
        var dn = bb.getElement(dp, true);
        if (!dq && dn.is(":in-viewport")) {
            if (typeof dt === "function") {
                dt()
            }
        } else {
            if (dn.is("div")) {
                var ds = dn.height() / 2;
                var dr = dn.width() / 2
            } else {
                var ds = bb.getFloat(dp, "height") / 2;
                var dr = bb.getFloat(dp, "width") / 2
            }
            c3(cJ.body).scrollTo(dp, 350, {
                offset: {
                    top: -(cJ.documentElement.clientHeight / 2) + ds,
                    left: -(cJ.documentElement.clientWidth / 2) + dr
                }, onAfter: dt
            })
        }
    }

    function cu(dn) {
        if (aR()) {
            return
        }
        at(false);
        Z.disable_hover = true;
        dn = bb.getElement(dn);
        var dt = bb.getData(dn, Z.data_text) || "";
        if (dt) {
            dt = ("" + dt).replace(/\s\s+/g, " ")
        }
        var dq = bb.getData(dn, Z.data_desc) || bb.getData(dn, Z.data_url);
        var du = bW(dn);
        var dp = cJ.getElementById("svg-text-edit");
        if (!dp) {
            dp = cJ.createElement("textarea");
            dp.setAttribute("id", "svg-text-edit");
            Z.container.appendChild(dp)
        }
        if (typeof du !== "number" && du !== "home") {
            var ds = dq ? "4px 28px 0" : "4px 12px 0"
        } else {
            var ds = dq ? "4px 29px 0" : "4px 17px 0"
        }
        var dr = c2(dn);
        bb.setData(dp, Z.data_cell_ref, bb.getAttr(dn, "id"));
        bb.setData(dp, Z.data_old_text, dt);
        dp.value = dt;
        dp.style.display = "block";
        dp.style.top = (dr.top + 4) + "px";
        dp.style.left = (dr.left + 4) + "px";
        dp.style.width = (dr.width - 8) + "px";
        dp.style.height = (dr.height - 8) + "px";
        dp.style.padding = ds;
        bb.addClass(dn, "editing");
        cx(dn, function () {
            dp.focus();
            if (dp.setSelectionRange) {
                var dv = dp.value.length * 2;
                dp.setSelectionRange(dv, dv)
            } else {
                dp.value = dp.value
            }
            dp.scrollTop = 999999
        });
        bV.publish("sitemap/cell_text_edit_open", [dn])
    }

    function ah(dv, dx) {
        if (aR()) {
            return
        }
        var dt = a6();
        if (!dt.group) {
            return
        }
        var du = cJ.getElementById("svg-text-edit");
        if (!du || du.style.display === "none") {
            return false
        }
        if (!dv) {
            dv = bb.getData(du, Z.data_cell_ref)
        }
        if (dv) {
            dv = bb.getElement(dv);
            var dn = bW(dv);
            var dw = c3.trim(du.value);
            var dp = bb.getData(du, Z.data_old_text);
            if (typeof dn === "number") {
                var dy = bT(dv);
                var ds = dy.length ? dy[dy.length - 1] : false
            } else {
                if (dw && dn === "home") {
                    var dq = bw(dv);
                    if (!dk(dq)) {
                        var dr = bb.getData(dq, Z.data_parent);
                        if (dr) {
                            bb.setData(dr, Z.data_text, dw)
                        }
                    }
                }
            }
            if (!dw && !dp) {
                cz(dv, bh, true);
                if (!bb.getElementsByClassName(dt.group, "level-" + dn).length) {
                    cI(dn)
                }
                dv = false
            } else {
                bb.setData(dv, Z.data_text, dw || dp);
                bb.removeClass(dv, "editing")
            }
            if (!dx) {
                if (ds) {
                    bx(ds)
                } else {
                    d()
                }
            }
        }
        Z.disable_hover = false;
        du.style.display = "none";
        bb.setData(du, Z.data_cell_ref, "");
        if (dv && dw) {
            if (!dp) {
                if (bk) {
                    cX(bk);
                    bk = null
                }
                bV.publish("sitemap/cell_added", [dv]);
                bV.publish("sitemap/sitemap_modified", ["cell_add", bC(), cZ(dv)]);
                bV.publish("sitemap/cell_text_edit_close", [dv, true]);
                return dw || dp
            } else {
                if (dp && dp !== dw) {
                    if (bk) {
                        cX(bk);
                        bk = null
                    }
                    bV.publish("sitemap/cell_modified", [dv]);
                    bV.publish("sitemap/sitemap_modified", ["cell_add", bC(), cZ(dv)]);
                    bV.publish("sitemap/cell_text_edit_close", [dv, true]);
                    return dw || dp
                }
            }
        }
        bV.publish("sitemap/cell_text_edit_close", [dv, false]);
        return false
    }

    function bI(du) {
        if (aR()) {
            return
        }
        var dt = cJ.getElementById("svg-text-edit");
        if (!dt) {
            return false
        }
        if (!du) {
            du = bb.getData(dt, Z.data_cell_ref)
        }
        if (du) {
            du = bb.getElement(du);
            var dv = c3.trim(dt.value);
            bb.setData(du, Z.data_text, dv);
            var dp = bW(du);
            var dq = bb.getFloat(du, "width");
            var dw = bb.getFloat(du, "height");
            if (typeof dp === "number" || dp === "home") {
                cB(du, dq)
            } else {
                dp = cL(dp);
                cB(du, dp.min_width, dp.max_width)
            }
            var dr = bb.getFloat(du, "width");
            var dn = bb.getFloat(du, "height");
            if (dw !== dn || dq !== dr) {
                bx(du, true, true);
                var ds = c2(du);
                dt.style.top = (ds.top + 4) + "px";
                dt.style.left = (ds.left + 4) + "px";
                dt.style.width = (ds.width - 8) + "px";
                dt.style.height = (ds.height - 8) + "px"
            }
        }
        dt.scrollTop = 0
    }

    function c2(dn) {
        var dp = 0;
        if (!dk(bw(dn))) {
            dp = Z.section_toolbar_height
        }
        return {
            left: bb.getFloat(dn, "x") * Z.scale,
            top: (bb.getFloat(dn, "y") * Z.scale) + dp,
            width: bb.getFloat(dn, "width") * Z.scale,
            height: bb.getFloat(dn, "height") * Z.scale,
            scale: Z.scale
        }
    }

    function bw(dr) {
        var dp = bb.getElement(dr);
        var dq = bh;
        if (dp) {
            var dn = 100;
            while (!dq) {
                dp = dp.parentNode;
                if (!dp) {
                    break
                }
                dq = bb.getData(dp, Z.data_section);
                if (--dn < 0) {
                    break
                }
            }
        } else {
            bb.forEach(bN, function (ds, du) {
                if (du.cells) {
                    var dt = false;
                    bb.forEach(du.cells, function (dw, dv) {
                        if (dv && dv.id && dv.id === dr) {
                            dq = ds;
                            dt = true;
                            return false
                        }
                    });
                    if (dt) {
                        return false
                    }
                }
            }, true)
        }
        return dq
    }

    function aQ(dq, dr) {
        var dp = bb.getElement(dq);
        if (dp) {
            return bb.getData(dp, dr)
        }
        var dn = false;
        dq = (typeof dq === "object" && dq.id) ? dq.id : dq;
        if (typeof dq === "string") {
            bb.forEach(bN, function (ds, dt) {
                if (dt.cells) {
                    bb.forEach(dt.cells, function (dv, du) {
                        if (du && du.id && du.id === dq) {
                            dn = (dr === true) ? c3.extend({}, du) : du[dr];
                            return false
                        }
                    });
                    if (dn) {
                        return false
                    }
                }
            }, true)
        }
        return dn
    }

    var H;

    function T(dp, dn) {
        if (Z.disable_hover || aR()) {
            return
        }
        if (H) {
            clearTimeout(H)
        }
        H = setTimeout(function () {
            var dv = cJ.getElementById("svg-hover-button");
            if (dv && bb.hasClass(dv, "freeze")) {
                return false
            }
            var dz = a6();
            if (!dz.group) {
                return
            }
            var dC = h(dp, dn);
            if (dC && dC.id) {
                if (dC.id === "cell-placeholder") {
                    if (!dn) {
                        return false
                    }
                    var dw = "add-top-left"
                } else {
                    if (bb.hasClass(dC, "add-button")) {
                        var dw = "add-top-left"
                    } else {
                        var dy = bW(dC);
                        if (dy === "home" || bb.hasClass(dC, "dragging") || bb.hasClass(dC, "blocked") || bb.hasClass(dC, "hidden") || bb.hasClass(dC, "hidden-but-refresh")) {
                            return
                        }
                        var dB = bb.getFloat(dC, "x");
                        var dA = bb.getFloat(dC, "y");
                        var dq = bb.getFloat(dC, "width");
                        var dr = bb.getFloat(dC, "height");
                        var dE = bb.getCursorPoint(dp, Z.scale, bn.offset());
                        dE.x = Math.round(dE.x);
                        dE.y = Math.round(dE.y);
                        if (!dk()) {
                            dE.y -= Z.section_toolbar_height
                        }
                        switch (dy) {
                            case"util":
                            case"foot":
                                var du = dB + (dq / 2);
                                var dw = (dE.x > du) ? "add-top-right" : "add-top-left";
                                break;
                            case"1":
                            case 1:
                                if (c[dz.options.template].align === "center") {
                                    var du = dB + (dq / 2);
                                    var ds = dA + (dr / 3);
                                    if (dE.y > ds && !bb.hasClass(dC, "collapsed")) {
                                        var dw = "add-middle"
                                    } else {
                                        if (dE.x > du) {
                                            var dw = "add-top-right"
                                        } else {
                                            var dw = "add-top-left"
                                        }
                                    }
                                    break
                                }
                            default:
                                var dx = bb.hasClass(dC, "collapsed");
                                if (dx) {
                                    var dt = dA + (dr / 2)
                                } else {
                                    var dt = dA + ((dr / 4) * 3);
                                    var dD = dA + (dr / 4)
                                }
                                if (dE.y >= dt) {
                                    var dw = "add-bottom"
                                } else {
                                    if (dx || dE.y <= dD) {
                                        var dw = "add-top"
                                    } else {
                                        var dw = "add-middle"
                                    }
                                }
                        }
                    }
                }
                if (dw) {
                    if (dn) {
                        dw = dw.replace("add-", "move-")
                    }
                    return bz(dC, dw)
                }
            } else {
                at()
            }
        }, 1)
    }

    function bz(dr, dt) {
        if (aR()) {
            return
        }
        var dy = a6();
        if (!dy.group) {
            return
        }
        if (K(dr, dt)) {
            var dp = cJ.getElementById("svg-hover-button");
            if (dp) {
                R();
                bb.removeClass(dp, "removing")
            }
            return true
        }
        at(false);
        var dq = bb.getAttr(dr, "id");
        var ds = (dq === "cell-placeholder");
        var dv = (!ds && bb.hasClass(dr, "add-button"));
        switch (dt) {
            case"move-top-left":
            case"move-top-right":
            case"add-top-left":
            case"add-top-right":
                if (ds) {
                    var dx = bb.getFloat(dr, "x") + (bb.getFloat(dr, "width") / 2) - (r[dt]["width"] / 2)
                } else {
                    if (dv) {
                        if (bb.hasClass(dr, "add-button-foot")) {
                            var dw = "foot"
                        } else {
                            if (bb.hasClass(dr, "add-button-home")) {
                                var dw = "home"
                            } else {
                                var dw = "util"
                            }
                        }
                        var dx = bb.getFloat(dr, "x") + (r["hover-" + dw].width / 2) - (r[dt]["width"] / 2)
                    } else {
                        var dn = cL(dr);
                        var dx = bb.getFloat(dr, "x") - (r[dt]["width"] / 2);
                        if (dt === "move-top-right" || dt === "add-top-right") {
                            dx += bb.getFloat(dr, "width");
                            dx += dn.hover_margin_right
                        } else {
                            dx -= dn.hover_margin_left
                        }
                    }
                }
                var du = Math.round(bb.getFloat(dr, "y") - r[dt]["height"] - 4);
                dx = Math.round(dx);
                break;
            default:
                var dx = bb.getFloat(dr, "x") + bb.getFloat(dr, "width");
                if (dt === "move-bottom" || dt === "add-bottom") {
                    var du = bb.getFloat(dr, "y") + bb.getFloat(dr, "height") - (r[dt]["height"] / 2)
                } else {
                    if (dt === "move-middle" || dt === "add-middle") {
                        var du = bb.getFloat(dr, "y") + (bb.getFloat(dr, "height") / 2) - (r[dt]["height"] / 2)
                    } else {
                        var du = bb.getFloat(dr, "y") - (r[dt]["height"] / 2)
                    }
                }
                dx = Math.round(dx);
                du = Math.round(du);
                break
        }
        var dz = bb.use("svg-hover-helper-" + dt, {
            id: "svg-hover-button",
            x: dx,
            y: du,
            "class": "hover-helper " + dq + " " + dt + " type-" + dt.split("-")[0]
        }, dy.group);
        bb.setData(dz, Z.data_cell_ref, dq);
        bb.setData(dz, Z.data_helper_type, dt)
    }

    var b;

    function at(dp) {
        var dn = cJ.getElementById("svg-hover-button");
        if (!dn) {
            return false
        }
        if (dp === false) {
            R();
            bb.removeElement(dn)
        } else {
            if (bb.hasClass(dn, "type-move")) {
                return
            } else {
                if (!bb.hasClass(dn, "removing") && !bb.hasClass(dn, "freeze")) {
                    if (dp === bh) {
                        dp = 1111
                    }
                    bb.addClass(dn, "removing");
                    R();
                    b = setTimeout(function () {
                        c3(dn).fadeOut(150, function () {
                            bb.removeElement(this)
                        })
                    }, dp)
                }
            }
        }
    }

    function R(dn) {
        clearTimeout(b)
    }

    function K(dn, dp) {
        var dq = cJ.getElementById("svg-hover-button");
        if (dq && bb.hasClass(dq, bb.getAttr(dn, "id")) && bb.hasClass(dq, dp)) {
            return true
        }
        return false
    }

    function aJ(dn, ds, dp) {
        dn = bb.getElement(dn);
        bb.removeClass(dn, "level-" + bW(dn));
        bb.addClass(dn, "level-" + ds);
        bb.setData(dn, Z.data_level, ds);
        if (dp) {
            var dr = bZ(dn);
            if (typeof ds === "number") {
                ds += 1
            }
            for (var dq = 0; dq < dr.length; ++dq) {
                aJ(dr[dq], ds, dp)
            }
        }
    }

    function cL(dp) {
        var dr = a6();
        if (dr) {
            var dn = bC();
            var dq = c[dr.options.template];
            if (typeof dp === "number" || (typeof dp === "string" && dp.length <= 4)) {
                var ds = dp
            } else {
                var ds = bW(dp)
            }
            if (a5[dn] === bh) {
                a5[dn] = {}
            }
            if (a5[dn].levels === bh) {
                a5[dn].levels = {}
            }
            if (a5[dn].levels[ds] === bh) {
                a5[dn].levels[ds] = c3.extend({}, dq.levels_global);
                if (dq.levels["level" + ds] !== bh) {
                    c3.extend(a5[dn].levels[ds], dq.levels["level" + ds])
                } else {
                    if (dq.levels[ds] !== bh) {
                        c3.extend(a5[dn].levels[ds], dq.levels[ds])
                    }
                }
            }
            return a5[dn].levels[ds]
        }
    }

    function cT(dp, dn) {
        var ds = a6();
        if (!ds.group) {
            return
        }
        var dq = {min: 0.5, max: 2};
        dq.zoom = Math.min(dq.max, Math.max(dq.min, dp));
        Z.scale = dq.zoom;
        bb.animateScale(ds.group, dq, 200, bh, function (dt) {
            a3(dt)
        });
        var dr = cJ.getElementById("image-form-newlogo");
        if (dr) {
            dr.style.width = (100 * Z.scale) + "%"
        }
        return Z.scale
    }

    var g = 100000;

    function bu(dB, dy, du, dx, dC, dz, dr) {
        var dq = cZ(dB);
        var dv = [];
        if (du == 2) {
            if (dq[Z.data_childs]) {
                for (var dt = 0, ds = dq[Z.data_childs].length; dt < ds; ++dt) {
                    dv = dv.concat(bu(dq[Z.data_childs][dt], dy, true, dx, false, dz, dr))
                }
            }
        } else {
            var dA = {id: dr ? dq.id : bb.generateUniqueId(), text: dq[Z.data_text] || "", level: 1, order: ++g};
            if (dy) {
                if (cH.isObject(dy)) {
                    if (dq[Z.data_url] && dy[Z.data_url]) {
                        dA[Z.data_url] = dq[Z.data_url]
                    }
                    if (dq[Z.data_desc] && dy[Z.data_desc]) {
                        dA[Z.data_desc] = dq[Z.data_desc]
                    }
                    if (dq[Z.data_archetype] && dy[Z.data_archetype]) {
                        dA[Z.data_archetype] = dq[Z.data_archetype]
                    }
                    if (dq[Z.data_color] && dy[Z.data_color]) {
                        dA[Z.data_color] = dq[Z.data_color]
                    }
                    if (dq[Z.data_text_color] && dy[Z.data_text_color]) {
                        dA[Z.data_text_color] = dq[Z.data_text_color]
                    }
                    if (dr && dq[Z.data_file] && dy[Z.data_file]) {
                        dA[Z.data_file] = dq[Z.data_file]
                    }
                    if (dr && dq[Z.data_section] && dy[Z.data_section]) {
                        dA[Z.data_section] = dq[Z.data_section]
                    }
                } else {
                    if (dq[Z.data_url]) {
                        dA[Z.data_url] = dq[Z.data_url]
                    }
                    if (dq[Z.data_desc]) {
                        dA[Z.data_desc] = dq[Z.data_desc]
                    }
                    if (dq[Z.data_archetype]) {
                        dA[Z.data_archetype] = dq[Z.data_archetype]
                    }
                    if (dq[Z.data_color]) {
                        dA[Z.data_color] = dq[Z.data_color]
                    }
                    if (dq[Z.data_text_color]) {
                        dA[Z.data_text_color] = dq[Z.data_text_color]
                    }
                    if (dr && dq[Z.data_file]) {
                        dA[Z.data_file] = dq[Z.data_file]
                    }
                    if (dr && dq[Z.data_section]) {
                        dA[Z.data_section] = dq[Z.data_section]
                    }
                }
            }
            if (dx) {
                if (typeof dx === "string") {
                    if (cJ.getElementById(dx)) {
                        var dp = bW(dx);
                        if (typeof dp === "number") {
                            dA.level = dp + 1;
                            dA.parent = dx
                        } else {
                            if (dp !== "home") {
                                dA.level = dp;
                                dA.after = dx
                            }
                        }
                    } else {
                        if (dz) {
                            var dw = a6(dz);
                            if (dw && dw.cells && dw.cells.length) {
                                for (var dt = 0; dt < dw.cells.length; ++dt) {
                                    if (dw.cells[dt] && dw.cells[dt].id === dx) {
                                        var dp = bW(dw.cells[dt]);
                                        if (typeof dp === "number") {
                                            dA.level = dp + 1;
                                            dA.parent = dw.cells[dt].id
                                        } else {
                                            if (dp !== "home") {
                                                dA.level = dp;
                                                dA.after = dw.cells[dt].id
                                            }
                                        }
                                        break
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (cH.isObject(dx)) {
                        var dp = bW(dx);
                        if (typeof dp === "number") {
                            dA.level = dp + 1;
                            dA.parent = dx.id
                        } else {
                            if (dp !== "home") {
                                dA.level = dp;
                                dA.after = dx.id
                            }
                        }
                    }
                }
            } else {
                dA.level = 1
            }
            if (du === "section_home") {
                return dA
            }
            dv = [dA];
            if (du === true || du === 1) {
                if (dq[Z.data_childs]) {
                    for (var dt = 0, ds = dq[Z.data_childs].length; dt < ds; ++dt) {
                        dv = dv.concat(bu(dq[Z.data_childs][dt], dy, du, dA, false, dz, dr))
                    }
                }
            }
        }
        if (dC) {
            if (dz) {
                var dn = bC();
                b9(dz)
            }
            for (var dt = 0, ds = dv.length; dt < ds; ++dt) {
                cb(dv[dt], bh, bh, dz)
            }
            if (dz) {
                b9(dn)
            }
        }
        return dv
    }

    function bj(dy, dw, dq, dt, dr, dz) {
        var du = [];
        var dx = "";
        var dn = bC();
        if (dz) {
            b9(dz)
        }
        if (dt) {
            var dv = bb.getElement(dt);
            var dx = bb.getData(dt, Z.data_section);
            if (!dv || !dx) {
                dx = bb.generateUniqueId();
                var ds = bu(dt, dw, "section_home");
                ds[Z.data_level] = "home";
                delete ds[Z.data_parent];
                delete ds[Z.data_childs];
                bN[dx] = {options: c3.extend({}, bf), cells: [ds]};
                if (!ak(dt, dx, true, false) && dz && bN[dz] && bN[dz].cells) {
                    for (var dp = 0; dp < bN[dz].cells.length; dp++) {
                        if (bN[dz].cells[dp].id === dt) {
                            bN[dz].cells[dp][Z.data_section] = dx;
                            break
                        }
                    }
                }
                dt = ds.id
            } else {
                b9(dx)
            }
            du = bu(dy, dw, dq, dt, true, dx)
        }
        b9(dn);
        return {cells: du, section_id: dx}
    }

    function cZ(dn) {
        var dr = bb.getData(dn) || {};
        dr.id = bb.getAttr(dn, "id");
        dr.level = bW(dn);
        if (dr.order) {
            dr.order = parseInt(dr.order, 10)
        }
        if (typeof dr[Z.data_childs] === "string" && dr[Z.data_childs]) {
            dr[Z.data_childs] = dr[Z.data_childs].split(",")
        }
        if (c3.isArray(dr[Z.data_childs])) {
            for (var dq = 0, dp = dr[Z.data_childs].length; dq < dp; ++dq) {
                if (typeof dr[Z.data_childs][dq] !== "string" && dr[Z.data_childs][dq] && dr[Z.data_childs][dq].id) {
                    dr[Z.data_childs][dq] = dr[Z.data_childs][dq].id
                }
            }
        }
        if (dr[Z.data_childs] !== bh && (!c3.isArray(dr[Z.data_childs]) || !dr[Z.data_childs].length)) {
            delete dr[Z.data_childs]
        }
        return dr
    }

    function s(dr, dn) {
        var dv = a6(dr);
        var du = [];
        if (dv.group) {
            if (!dn) {
                var dq = bb.getElementsByClassName(dv.group, "cell");
                for (var ds = 0, dp = dq.length; ds < dp; ++ds) {
                    du.push(cZ(dq[ds]))
                }
                du.sort(function (dx, dw) {
                    var dy, dz;
                    switch (dx.level) {
                        case"home":
                            dy = 1;
                            break;
                        case"util":
                            dy = 2;
                            break;
                        case"foot":
                            dy = 99999;
                            break;
                        default:
                            dy = parseInt(dx.level, 10) + 5
                    }
                    switch (dw.level) {
                        case"home":
                            dz = 1;
                            break;
                        case"util":
                            dz = 2;
                            break;
                        case"foot":
                            dz = 99999;
                            break;
                        default:
                            dz = parseInt(dw.level, 10) + 5
                    }
                    dy = parseInt(dy, 10);
                    dz = parseInt(dz, 10);
                    if (dy === dz) {
                        return parseInt(dx.order, 10) - parseInt(dw.order, 10)
                    } else {
                        return dy - dz
                    }
                })
            } else {
                var dq = bb.getElementsByClassName(dv.group, "level-util");
                var dt = [];
                if (dq) {
                    for (var ds = 0, dp = dq.length; ds < dp; ++ds) {
                        dt.push(dq[ds].id)
                    }
                }
                dq = bb.getElementsByClassName(dv.group, "level-foot");
                if (dq) {
                    for (var ds = 0, dp = dq.length; ds < dp; ++ds) {
                        dt.push(dq[ds].id)
                    }
                }
                dq = bb.getElementsByClassName(dv.group, "level-home");
                if (dq) {
                    for (var ds = 0, dp = dq.length; ds < dp; ++ds) {
                        dt.push(dq[ds].id)
                    }
                }
                du = av(dt);
                dq = bb.getElementsByClassName(dv.group, "level-1");
                dt = [];
                if (dq) {
                    for (var ds = 0, dp = dq.length; ds < dp; ++ds) {
                        dt.push(dq[ds].id)
                    }
                }
                du = du.concat(av(dt, true))
            }
        } else {
            if (dv.cells) {
                return dv.cells
            }
        }
        return du
    }

    function av(dr, dp) {
        var ds = [];
        if (c3.isArray(dr) && dr.length) {
            dr = db(dr);
            for (var dq = 0; dq < dr.length; ++dq) {
                var dn = cZ(dr[dq]);
                ds.push(dn);
                if (dp && dn[Z.data_childs]) {
                    ds = ds.concat(av(dn[Z.data_childs], dp))
                }
            }
        }
        return ds
    }

    function F(dp, dn) {
        var dq = c3.extend({}, bN);
        bb.forEach(cg, function (dr, ds) {
            if (dn && dn !== dr) {
                return true
            }
            if (typeof dr === "string" && dr.length > 10 && ds && ds.group !== bh) {
                dq[dr] = {options: ds.options, data: bb.getData(ds.group, bh, [Z.data_file]), cells: []};
                dq[dr].cells = s(dr)
            }
        }, true);
        if (dn) {
            if (dq[dn]) {
                return dp ? dq[dn] : JSON.stringify(dq[dn])
            }
            return false
        }
        return dp ? dq : JSON.stringify(dq)
    }

    function m(dp, dn) {
        an = F(true);
        if (dn) {
            if (an[dn]) {
                return dp ? an[dn] : JSON.stringify(an[dn])
            }
            return false
        }
        return dp ? an : JSON.stringify(an)
    }

    function bq(dn) {
        dn.sort(function (ds, dr) {
            var du = bW(ds);
            var dt = bW(dr);
            if (typeof du === "number" && typeof dt === "number") {
                return (du > dt) ? 1 : -1
            }
            if (typeof dt === "number") {
                return -1
            }
            if (typeof du === "number" || du === "home" || (du === "foot" && dt === "util")) {
                return 1
            }
            var dq = ds.order ? parseFloat(ds.order) : 1;
            var dp = dr.order ? parseFloat(dr.order) : 1;
            return (dq > dp) ? 1 : -1
        });
        return dn
    }

    function cw(dn) {
        bb.forEach(dn, function (dp, dt) {
            var ds = [];
            if (dt && dt.cells) {
                dt.cells = bq(dt.cells);
                var dr = dt.cells.length;
                for (var dq = 0; dq < dr; ++dq) {
                    if (dt.cells[dq] && dt.cells[dq].parent) {
                        var du = bW(dt.cells[dq]);
                        if (du === 1 || typeof du !== "number") {
                            delete dt.cells[dq].parent
                        }
                    }
                }
            }
        }, true);
        return dn
    }

    function de(dp, dn, dq) {
        if (!dq) {
            aF(true)
        }
        if (typeof dp === "string") {
            dp = c3.parseJSON(dp)
        }
        if (dp) {
            bN = cw(dp);
            if (dq) {
                return true
            }
            bb.forEach(bN, function (ds, dv) {
                var du = false;
                if (!dn || dn === ds) {
                    dv.options.id = ds;
                    a9(dv.options);
                    if ((!dn && dk(ds)) || dk(dn)) {
                        aL(dv, false);
                        du = true
                    }
                }
                if (!du && dv.cells) {
                    for (var dt = 0, dr = dv.cells.length; dt < dr; ++dt) {
                        if (dv.cells[dt].level === "home") {
                            cv[ds] = dv.cells[dt].text
                        }
                    }
                }
            }, true)
        }
    }

    function aL(dt, ds, dn) {
        if (dt === bh || dt.cells === bh) {
            var dp = bC();
            dt = m(true, dp);
            B(dp)
        }
        dt.cells = bq(dt.cells);
        for (var dr = 0, dq = dt.cells.length; dr < dq; ++dr) {
            if (dt.cells[dr].level === "home" && dt.options && dt.options.id) {
                cv[dt.options.id] = dt.cells[dr].text
            }
            cb(dt.cells[dr], dt.cells[dr].level, ds)
        }
        if (dn !== true) {
            d()
        }
        bV.publish("sitemap/json_loaded", [dt])
    }

    function bo(dr, dt, dn) {
        if (!cH.isObject(dt)) {
            return false
        }
        var dp = bC();
        if (!dr) {
            dr = dp
        }
        if (!dt[dr]) {
            return false
        }
        bb.forEach(dt, function (dw, dv) {
            if (!bN[dw]) {
                bN[dw] = dv
            }
        });
        b9(dr);
        var du = a6(dr);
        if (du.group) {
            B(dr);
            if (cH.isObject(dt[dr].options)) {
                du.options = c3.extend({}, bf, dt[dr].options);
                du.options.text_shadow = !(!du.options.text_shadow || du.options.text_shadow === "false")
            }
            for (var ds = 0, dq = dt[dr].cells.length; ds < dq; ++ds) {
                cb(dt[dr].cells[ds], dt[dr].cells[ds].level)
            }
        } else {
            if (du.cells && dt[dr].cells) {
                du.cells = dt[dr].cells
            }
        }
        if (du.group && dn !== true) {
            d()
        }
        b9(dp)
    }

    function B(dn) {
        var dp = a6(dn);
        if (dp.group) {
            while (dp.group.firstChild) {
                dp.group.removeChild(dp.group.firstChild)
            }
            da(dn);
            bb.clearCache(true);
            W(dn);
            da(dn);
            bb.clearCache(true)
        }
    }

    _breadcrumbs_zindex = 50;
    function k(dC, dy, dr) {
        if (!dy) {
            dy = ce()
        }
        var dn = bC();
        if (dC === bh && dy) {
            dC = bb.getData(dy, Z.data_section)
        }
        bV.publish("sitemap/section_before_open", [dC]);
        if (dy && bb.getElement(dy)) {
            var dz = bu(dy, bh, "section_home")
        } else {
            var dz = aQ(dy, true)
        }
        dz[Z.data_level] = "home";
        dz.id = bb.generateUniqueId();
        delete dz[Z.data_parent];
        delete dz[Z.data_childs];
        delete dz[Z.data_section];
        if (!dC || cg[dC] === bh) {
            if (bN[dC] !== bh) {
                bN[dC].options.id = dC;
                a9(bN[dC].options);
                var dx = false;
                for (var dw = 0, du = bN[dC].cells.length; dw < du; ++dw) {
                    if (bN[dC].cells[dw].level === "home") {
                        bN[dC].cells[dw] = dz;
                        dx = true;
                        break
                    }
                }
                if (!dx) {
                    bN[dC].cells.push(dz)
                }
                aL(bN[dC], bh, true)
            } else {
                a9({id: dC});
                aL({cells: [dz]}, bh, true);
                bV.publish("sitemap/section_created", [dC]);
                var dt = ["section_created", dn, bb.getAttr(dy, "id"), dr]
            }
        } else {
            var dA = bb.getElementsByClassName(cg[dC].group, "level-home");
            if (dA.length) {
                bb.forEach(dz, function (dD, dE) {
                    if (dD !== Z.data_order) {
                        bb.setData(dA[0], dD, dE)
                    }
                }, true)
            }
            if (bC() !== dC) {
                b9(dC)
            }
        }
        var dC = bC();
        var dp = bw(dy);
        bb.setData(dy, Z.data_section, dC);
        if (dr) {
            bb.removeClass(dy, "collapsed");
            var dB = y(dy, true);
            if (dB) {
                bu(dy, true, 2, bh, true, dC, true);
                bb.removeElement(dB);
                bV.publish("sitemap/trigger_add_history", [null, dp])
            }
            b6(dy)
        }
        var dv = bb.getElementsByClassName(cg[dC].group, "svg-section-background");
        if (dv.length) {
            dv[0].parentNode.removeChild(dv[0])
        }
        var ds = bb.getFloat(cg.svg, "height") + 1;
        bb.setMatrix(cg[dC].group, [Z.scale, 0, 0, Z.scale, 0, ds]);
        bb.setData(dC, Z.data_parent, bb.getAttr(dy, "id"));
        bb.bringToFront(cg[dC].group);
        bb.removeClass(cg[dC].group, "section-hidden");
        bb.addClass(cg[dC].group, "section-visible");
        d({container: false});
        var dq = c3(a1(bh, dy));
        dq.stop().css({top: ds, zIndex: ++_breadcrumbs_zindex}).show();
        c3("#sitemap-logo").stop().animate({opacity: 0}, 300, function () {
            c3(this).css({zIndex: -1})
        });
        bb.animateMove(cg[dC].group, 0, Z.section_toolbar_height, 500, "easeOutQuad", "matrix", function () {
            a3();
            dq.css("top", 0)
        }, function (dE, dD, dF) {
            dq.css("top", dF - Z.section_toolbar_height)
        });
        if (dz.text) {
            cv[dC] = dz.text
        }
        bV.publish("sitemap/section_opened", [dC, dp, dr, !!dt]);
        if (dt) {
            bV.publish("sitemap/sitemap_modified", dt)
        }
    }

    function i(dq, dn, dr) {
        if (dq === bh) {
            dq = bC()
        }
        var ds = a6(dq);
        bV.publish("sitemap/section_before_close", [dq]);
        var dp = bb.getFloat(cg.svg, "height") + 1;
        var dt = c3("#section-breadcrumbs-" + dq).css({top: 0});
        b9(dn);
        if (aR(dn, "colors")) {
            c9(dn, "colors")
        }
        if (dk(dn)) {
            _breadcrumbs_zindex = 50;
            if (!dr) {
                c3("#sitemap-logo").stop().css({opacity: 0, zIndex: 50}).delay(150).animate({opacity: 1}, 150)
            }
        }
        d({container: false});
        if (ds.group) {
            bb.animateMove(ds.group, 0, dp, 300, "easeInCubic", "matrix", function (dx) {
                var dw = bb.getAttr(dx, "id");
                var dv = bb.getData(dx, Z.data_parent);
                cX(dv);
                if (dx.querySelector(".cell:not(.level-home)")) {
                    var du = bb.getMatrix(dx);
                    du[5] = 10000;
                    bb.setMatrix(dx, du);
                    ak(dv, dw, bh, false)
                } else {
                    aS(dv, false)
                }
                bb.removeClass(dx, "section-visible");
                bb.addClass(dx, "section-hidden");
                a3();
                dt.css("top", dp).hide()
            }, function (dv, du, dw) {
                dt.css("top", dw - Z.section_toolbar_height)
            })
        }
        bV.publish("sitemap/section_closed", [dq])
    }

    function a8() {
        return c3.extend({}, cv)
    }

    function a1(dw, dr) {
        if (!dw) {
            dw = bC()
        }
        if (!dr) {
            dr = ce(dw)
        }
        var dp = aQ(dr, Z.data_section);
        var dy = aQ(dr, Z.data_text);
        var dq = '<span class="crumb last" data-section="' + dp + '">' + bF.limitLength(dy, 25, "&hellip;") + '</span><a href="#" class="close">close</a>';
        var dv = bw(dr);
        var dt = 50;
        while (dv) {
            var ds = bb.getData(dv, Z.data_parent);
            var du = bb.getElement(ds);
            if (du) {
                dq = '<a href="#" class="crumb" data-section="' + bb.getData(du, Z.data_section) + '">' + bF.limitLength(bb.getData(du, Z.data_text), 25, "&hellip;") + "</a>" + dq
            }
            dv = bw(du);
            if (--dt < 0) {
                break
            }
        }
        dq = '<a href="#" class="crumb main" data-section="' + Z.id_main_section + '">Main</a>' + dq;
        var dn = cJ.getElementById("section-breadcrumbs-" + dw);
        if (!dn) {
            dn = cJ.createElement("div");
            dn.setAttribute("id", "section-breadcrumbs-" + dw);
            dn.setAttribute("class", "section-breadcrumbs");
            var dx = cJ.createElement("div");
            dx.setAttribute("class", "row");
            dx.innerHTML = dq;
            dn.appendChild(dx);
            Z.container.appendChild(dn)
        } else {
            dn.querySelector(".row").innerHTML = dq
        }
        return dn
    }

    function aF(dp, dn) {
        cg = {};
        b9();
        while (Z.container.firstChild) {
            Z.container.removeChild(Z.container.firstChild)
        }
        bn = c3(Z.container);
        if (!dp) {
            if (dn === bh) {
                dn = {}
            }
            a9(dn);
            d()
        }
    }

    function cn(dr, dp, dn) {
        if (!dp) {
            bb.forEach(cg, function (ds, dt) {
                if (ds === Z.id_main_section && dt.group) {
                    while (dt.group.firstChild) {
                        dt.group.removeChild(dt.group.firstChild)
                    }
                } else {
                    if (ds !== "svg" && ds !== "defs" && dt.group) {
                        dt.group.parentNode.removeChild(dt.group);
                        delete cg[ds]
                    }
                }
            }, true);
            da();
            bb.clearCache(true)
        }
        if (typeof dr === "string") {
            dr = c3.parseJSON(dr)
        }
        var dq = bC();
        b9(dp);
        if (dr) {
            if (dp) {
                bN[dp] = dr[dp];
                bo(dp, dr[dp], dn)
            } else {
                bN = dr;
                dr[Z.id_main_section].options.id = Z.id_main_section;
                aL(dr[Z.id_main_section], false, dn)
            }
        }
        b9(dq)
    }

    function da(dp, dn) {
        if (dp) {
            a5[dp] = bh;
            L[dp] = bh
        } else {
            if (dp !== false) {
                a5 = {};
                L = {}
            }
        }
        if (dn) {
            cQ[dn] = {}
        } else {
            if (dn !== false) {
                cQ = {}
            }
        }
    }

    function aH(dp) {
        var dq = 1;
        var dn = 50;
        while (dp) {
            ++dq;
            dp = bb.getElement(dp);
            if (dp) {
                dp = bb.getData(dp, Z.data_parent)
            }
            if (--dn < 0) {
                break
            }
        }
        return dq
    }

    function db(dr) {
        if (typeof dr === "string") {
            dr = [dr]
        }
        if (cH.isObject(dr, true)) {
            var dt = {};
            for (var ds = 0, dq = dr.length; ds < dq; ++ds) {
                var dp = bb.getElement(dr[ds]);
                if (dp) {
                    var dn = parseInt(bb.getData(dp, Z.data_order), 10);
                    dt[dn] = dp.id
                }
            }
            return A(dt)
        }
        return []
    }

    function dl(dn, dq) {
        if (typeof dq !== "string" && dq && dq.id) {
            dq = dq.id
        }
        var dp = bY(dn);
        if (c3.inArray(dq, dp) < 0) {
            dp.push(dq)
        }
        bb.setData(dn, Z.data_childs, dp)
    }

    function b6(dp, ds) {
        var dr = [];
        if (ds) {
            if (typeof ds !== "string" && ds && ds.id) {
                ds = ds.id
            }
            var dq = bY(dp);
            if (dq.length) {
                for (var dn = 0; dn < dq.length; ++dn) {
                    if (dq[dn] !== ds) {
                        dr.push(dq[dn])
                    }
                }
            }
        }
        bb.setData(dp, Z.data_childs, dr)
    }

    function bZ(ds, dp) {
        ds = bb.getElement(ds);
        var dt = bY(ds);
        var dq = [];
        if (dt.length) {
            for (var dr = 0; dr < dt.length; dr++) {
                if (dt[dr]) {
                    if (c3.inArray(dt[dr], dq) < 0) {
                        dq.push(dt[dr])
                    }
                    if (dp) {
                        var dn = bZ(dt[dr], true);
                        if (dn) {
                            dq = dq.concat(dn)
                        }
                    }
                }
            }
            return dq
        }
        return []
    }

    function bY(dn, dp) {
        var dq = bb.getData(dn, Z.data_childs);
        if (dq) {
            if (typeof dq === "string") {
                dq = dq.split(",")
            }
            if (dq.length && dp) {
                dq = db(dq)
            }
            return dq
        }
        return []
    }

    function bT(dp) {
        dp = bb.getElement(dp);
        var dq = [];
        var dr = bb.getData(dp, Z.data_parent);
        var dn = 50;
        while (dr) {
            dq.push(dr);
            dr = bb.getData(dr, Z.data_parent);
            if (--dn < 0) {
                break
            }
        }
        return dq
    }

    function cl(dp, dr) {
        if (!dp || !dr) {
            return false
        }
        if (bW(dp) === dr) {
            return dp
        }
        var dq = bb.getData(dp, Z.data_parent);
        var dn = 50;
        while (dq) {
            if (bW(dq) === dr) {
                return dq
            }
            dq = bb.getData(dq, Z.data_parent);
            if (--dn < 0) {
                break
            }
        }
        return false
    }

    function A(dr) {
        var dq = [];
        bb.forEach(dr, function (ds, dt) {
            dq.push(ds)
        });
        dq.sort(function (dt, ds) {
            return parseFloat(dt) > parseFloat(ds) ? 1 : -1
        });
        var dn = [];
        for (var dp = 0; dp < dq.length; dp++) {
            dn.push(dr[dq[dp]])
        }
        return dn
    }

    function S(dn, dp) {
        var dq;
        if (!dp) {
            var dr = a6();
            if (dr && dr.options) {
                if (dr.options.color_scheme && cH.isObject(dr.options.color_scheme)) {
                    dq = c3.extend({}, bH["default"], dr.options.color_scheme)
                } else {
                    if (dr.options.color_scheme && typeof dr.options.color_scheme === "string" && bH[dr.options.color_scheme] !== bh) {
                        if (dr.options.color_scheme === "default") {
                            dq = c3.extend({}, bH[dr.options.color_scheme])
                        } else {
                            dq = c3.extend({}, bH["default"], bH[dr.options.color_scheme])
                        }
                    }
                }
            }
        }
        if (!cH.isObject(dq)) {
            dq = c3.extend({}, bH["default"])
        }
        if (dn === true) {
            return dq
        }
        var ds = (typeof dn === "number") ? false : bb.getData(dn, Z.data_archetype);
        if (ds) {
            if (dq["archetype-" + ds] !== bh) {
                return dq["archetype-" + ds]
            }
            ds = "custom" + bF.sanitize(ds);
            if (dq["archetype-" + ds] !== bh) {
                return dq["archetype-" + ds]
            }
        }
        var dt = (typeof dn === "object") ? bW(dn) : dn;
        if (typeof dt === "number") {
            return (dq["level" + dt] === bh) ? dq.default_color : dq["level" + dt]
        } else {
            if (dt === "lines_color" && dq[dt] === bh) {
                return bH["default"].lines_color
            } else {
                if (dt === "text_color" && dq[dt] === bh) {
                    return bH["default"].text_color
                } else {
                    return (dq[dt] === bh) ? dq.default_color : dq[dt]
                }
            }
        }
    }

    function c0(dn, dp) {
        if (dp) {
            f()
        }
        var dq = a6();
        if (dq && cH.isObject(dn)) {
            dq.options.color_scheme = c3.extend({}, dn);
            if (dq.group) {
                c4();
                aC();
                p();
                c6()
            }
        }
    }

    function bs() {
        return S(true)
    }

    function a6(dp, dn) {
        if (!dp) {
            dp = bC()
        }
        if (cH.isObject(cg[dp]) && cg[dp].group) {
            return cg[dp]
        }
        if (dn !== true && cH.isObject(bN[dp]) && cH.isObject(bN[dp].options)) {
            return bN[dp]
        }
        return false
    }

    function f() {
        var dn = a6();
        if (dn && dn.options) {
            if (cH.isObject(dn.options.color_scheme)) {
                dm.color_scheme = c3.extend({}, dn.options.color_scheme)
            } else {
                dm.color_scheme = c3.extend({}, bH["default"])
            }
            dm.options_design = dn.options.design;
            dm.options_text_shadow = dn.options.text_shadow
        } else {
            dm.color_scheme = c3.extend({}, bH["default"]);
            dm.options_design = bf.design
        }
    }

    function bK() {
        var dn = a6();
        if (!dn) {
            return false
        }
        var dp = false;
        if (dm.color_scheme !== bh) {
            if (cH.isObject(dm.color_scheme)) {
                dn.options.color_scheme = c3.extend({}, dm.color_scheme)
            } else {
                dn.options.color_scheme = dm.color_scheme
            }
            dp = true
        }
        if (dm.options_design !== bh && dm.options_design !== dn.options.design) {
            dp = !U(dm.options_design) || dp
        }
        if (dm.options_text_shadow !== bh && dm.options_text_shadow !== dn.options.text_shadow) {
            bi(dm.options_text_shadow)
        }
        if (dp && dn.group) {
            c4();
            aC();
            p();
            c6()
        }
    }

    function U(dn, dq) {
        if (!dn || (dn !== "flat" && dn !== "gradient") || cf() === dn) {
            return false
        }
        var dp = a6();
        dp.options.design = dn;
        if (dp.group && !dq) {
            c4(true);
            aC(true)
        }
        return true
    }

    function bi(dp, dn) {
        var dq = a6(dn);
        if (dq && dq.group) {
            dq.options.text_shadow = !!dp;
            if (dq.options.text_shadow) {
                bb.removeClass(dq.group, "noshadow")
            } else {
                bb.addClass(dq.group, "noshadow")
            }
        }
        return true
    }

    function cN(dn) {
        var dp = a6(dn);
        if (dp && dp.options) {
            return !!dp.options.text_shadow
        }
        return false
    }

    function cf() {
        var dn = a6();
        if (dn) {
            return dn.options.design
        }
        return false
    }

    function N(dn) {
        var dp = a6();
        if (c8(dn) && dp) {
            dp.options.template = dn;
            if (dp.group) {
                da(dp.options.id)
            }
            return true
        }
        return false
    }

    function al() {
        var dn = a6();
        if (dn) {
            return dn.options.template
        }
    }

    function c8(dn) {
        return cH.isObject(c[dn])
    }

    function dh(ds) {
        var dn = bC();
        var dr = bb.getElement(dn);
        if (!dr) {
            return
        }
        if (ds === "all") {
            Z.container.classList.add("highlighted")
        } else {
            if (typeof ds === "string") {
                ds = ds.replace("level", "")
            }
            Z.container.classList.remove("highlighted");
            var dp = bb.getElementsByClassName(dr, "highlighted");
            for (var dq = dp.length - 1; dq >= 0; --dq) {
                bb.removeClass(dp[dq], "highlighted")
            }
            if (ds) {
                if (ds.slice(0, 10) === "archetype-") {
                    var dp = bb.getElementsByClassName(dr, "has-" + ds);
                    for (var dq = dp.length - 1; dq >= 0; --dq) {
                        bb.addClass(dp[dq], "highlighted")
                    }
                } else {
                    var dp = bb.getElementsByClassName(dr, "level-" + ds);
                    for (var dq = dp.length - 1; dq >= 0; --dq) {
                        bb.addClass(dp[dq], "highlighted")
                    }
                }
            }
        }
    }

    function c5(du, dn) {
        dn = bb.getElement(dn);
        if (dn && dn.id) {
            var dt = a6();
            if (dt && dt.group) {
                at(false);
                ag(dn);
                var ds = y(dn);
                var dq = ds.querySelectorAll("svg.cell");
                x = {
                    cursor: bb.getCursorPoint(du),
                    group: ds,
                    cell: dn,
                    parent: ds.parentNode,
                    prev: ds.previousElementSibling,
                    next: ds.nextElementSibling,
                    window: {width: cV.width(), height: cV.height()},
                    cells: dq
                };
                bb.addClass(x.group, "dragging");
                for (var dr = 0, dp = dq.length; dr < dp; ++dr) {
                    bb.addClass(dq[dr], "dragging")
                }
                Z.container.classList.add("dragging");
                dt.group.appendChild(x.group);
                bV.publish("sitemap/drag_start", [du, bC(), x])
            }
        }
    }

    function cE(dz) {
        if (x) {
            var dt = cJ.getElementById("svg-hover-button");
            var dx = false;
            var dp = bC();
            if (dt) {
                bb.removeClass(dt, "freeze");
                var dB = "" + bb.getData(x.cell, Z.data_parent);
                var dE = "" + bb.getData(dt, Z.data_cell_ref);
                var dC = bb.getData(dt, Z.data_helper_type);
                if (dE === "cell-placeholder") {
                } else {
                    if ((dC === "move-middle" && dB !== dE) || (dC !== "move-middle" && dB === dE) || (dB !== dE)) {
                        var dD = bb.hasClass(dE, "add-button");
                        b6(dB, x.cell);
                        if (dD) {
                            if (bb.hasClass(dE, "add-button-foot")) {
                                var dq = "foot"
                            } else {
                                if (bb.hasClass(dE, "add-button-home")) {
                                    var dq = "home"
                                } else {
                                    if (bb.hasClass(dE, "add-button-util")) {
                                        var dq = "util"
                                    } else {
                                        var dq = 1
                                    }
                                }
                            }
                        } else {
                            var dq = bW(dE)
                        }
                        if (dC === "move-middle") {
                            ++dq;
                            dl(dE, x.cell);
                            bb.setData(x.cell, Z.data_parent, dE);
                            aJ(x.cell, dq, true);
                            bb.setData(x.cell, Z.data_order, 999999);
                            ad(x.cell, dE)
                        } else {
                            var du = dD ? 1000 : parseInt(bb.getData(dE, Z.data_order), 10);
                            var dA = "";
                            var dn = dE;
                            if (typeof dq === "number") {
                                if (dD) {
                                    dA = "to";
                                    var dy = bb.getElement(dE).parentNode;
                                    dn = dy.parentNode
                                } else {
                                    if (dC === "move-top" || dC === "move-top-left") {
                                        --du;
                                        dA = "before"
                                    } else {
                                        ++du;
                                        dA = "after"
                                    }
                                }
                                if (dq > 1 && !dD) {
                                    var ds = bb.getData(dE, Z.data_parent);
                                    bb.setData(x.cell, Z.data_parent, ds);
                                    dl(ds, x.cell)
                                } else {
                                    bb.removeData(x.cell, Z.data_parent)
                                }
                                bb.setData(x.cell, Z.data_order, du);
                                aJ(x.cell, dq, true);
                                ad(x.cell, dn, dA);
                                if (dD && dy) {
                                    bb.removeElement(dy);
                                    aU(dy)
                                }
                            } else {
                                var dr = c3.extend([x.cell], x.cells);
                                for (var dw = 0, dv = dr.length; dw < dv; ++dw) {
                                    if (dD && dw === 0) {
                                        dA = "to";
                                        var dy = bb.getElement(dE).parentNode;
                                        dn = dy.parentNode
                                    } else {
                                        if (dC === "move-top" || dC === "move-top-left") {
                                            --du;
                                            dA = "before"
                                        } else {
                                            ++du;
                                            dA = "after"
                                        }
                                    }
                                    bb.setData(x.cells[dw], Z.data_order, du);
                                    bb.removeData(x.cells[dw], Z.data_parent);
                                    bb.removeData(x.cells[dw], Z.data_childs);
                                    aJ(x.cells[dw], dq);
                                    ad(x.cells[dw], dn, dA);
                                    if (dD && dw === 0 && dy) {
                                        bb.removeElement(dy);
                                        aU(dy)
                                    }
                                    dn = x.cells[dw]
                                }
                            }
                        }
                        dx = true
                    }
                }
                at(false)
            }
            if (!dx) {
                if (x.next) {
                    x.parent.insertBefore(x.group, x.next)
                } else {
                    x.parent.appendChild(x.group)
                }
            }
            bb.setMatrix(x.group, [1, 0, 0, 1, 0, 0]);
            bb.removeClass(x.group, "dragging");
            if (x.cells) {
                for (var dw = 0, dv = x.cells.length; dw < dv; ++dw) {
                    bb.removeClass(x.cells[dw], "dragging")
                }
            }
            Z.container.classList.remove("dragging");
            bP();
            if (dx) {
                bV.publish("sitemap/sitemap_modified", ["drag_stop", dp]);
                d()
            }
            bV.publish("sitemap/drag_stop", [dz, dp, x]);
            x = bh
        }
    }

    function bg(dq) {
        if (dq.clientY && dq.clientX) {
            var dp = 0;
            var dt = 0;
            var ds = 50;
            var du = 75;
            var dn = 6;
            if (dq.clientY <= ds + 42) {
                dp -= dn
            } else {
                if (dq.clientY >= x.window.height - 46 - ds) {
                    dp += dn
                }
            }
            if (dq.clientX <= du) {
                dt -= dn
            } else {
                if (dq.clientX >= x.window.width - du) {
                    dt += dn
                }
            }
            if (dp) {
                cV.scrollTop(cV.scrollTop() + dp)
            }
            if (dt) {
                cV.scrollLeft(cV.scrollLeft() + dt)
            }
        }
        var dr = bb.getCursorPoint(dq);
        bb.setMatrix(x.group, [1, 0, 0, 1, dr.x - x.cursor.x, dr.y - x.cursor.y])
    }

    function ag(dn) {
        dn = bb.getElement(dn);
        var dp = y(dn).getBBox();
        if (dp.x) {
            bP();
            bb.createElementNs("rect", {
                id: "cell-placeholder",
                rx: 5,
                ry: 5,
                x: dp.x,
                y: dp.y,
                width: dp.width,
                height: dp.height,
                fill: "#F1F3F6",
                stroke: "#DDE2E9",
                "stroke-width": 2,
                "stroke-dasharray": "5,5"
            }, cg[bC()].group)
        }
    }

    function bP() {
        bb.removeElement("cell-placeholder")
    }

    function ad(dq, dr, ds) {
        if (!dq) {
            dq = x.cell
        }
        dq = y(dq);
        dr = y(dr);
        if (dq && dr) {
            if (dq) {
                switch (ds) {
                    case"before":
                        var dp = dr.parentNode;
                        dp.insertBefore(dq, dr);
                        break;
                    case"after":
                        var dp = dr.parentNode;
                        if (dr.nextSibling) {
                            dp.insertBefore(dq, dr.nextSibling)
                        } else {
                            dp.appendChild(dq)
                        }
                        break;
                    case"to":
                        dr.appendChild(dq);
                        break;
                    default:
                        var dt = dr.childNodes;
                        var du = null;
                        if (dt) {
                            for (var dn = 0, dv = dt.length; dn < dv; ++dn) {
                                if (cD(dt[dn], "g", "sitemap-group-childrens")) {
                                    du = dt[dn];
                                    break
                                }
                            }
                        }
                        if (!du) {
                            du = bb.createElementNs("g", {
                                "class": "sitemap-group sitemap-group-childrens",
                                transform: "matrix(1, 0, 0, 1, 0, 0)"
                            }, dr)
                        }
                        du.appendChild(dq)
                }
            }
        }
    }

    function ce(dp, dq) {
        if (!dp) {
            dp = bC()
        }
        if (aG[dp] === bh) {
            aG[dp] = null
        }
        if (dq) {
            if (cH.isObject(aG[dp])) {
                return bb.getAttr(aG[dp], "id")
            }
            return null
        } else {
            var dn = bb.getElement(aG[dp]);
            return dn
        }
    }

    function cX(dn, dp) {
        dn = bb.getElement(dn);
        if (dn) {
            if (!dp) {
                dp = bC()
            }
            aG[dp] = dn
        }
    }

    function be(dp) {
        if (!dp) {
            dp = bC()
        }
        var dq = a6(dp);
        if (dq.group) {
            var dn = bb.getElementsByClassName(dq.group, "level-home");
            if (!dn.length) {
                dn = bb.getElementsByClassName(dq.group, "level-1")
            }
            if (!dn.length) {
                dn = bb.getElementsByClassName(dq.group, "cell")
            }
            if (dn.length) {
                aG[dp] = dn[0]
            }
        }
    }

    function bW(dn) {
        if (dn && dn.level) {
            var dp = dn.level
        } else {
            var dp = bb.getData(dn, Z.data_level)
        }
        if (dp !== bh && dp !== "util" && dp !== "foot" && dp !== "home") {
            dp = parseInt(dp, 10)
        }
        return dp
    }

    function cd(dn, dr, dq, dp) {
        if (dn === bh) {
            dn = ce()
        } else {
            dn = bb.getElement(dn)
        }
        if (dn) {
            if (dq === bh) {
                dq = ""
            }
            if (dq !== bh && dq !== "" && dq !== null && bb.getData(dn, dr) !== dq) {
                bb.setData(dn, dr, dq);
                if (!dp) {
                    clearTimeout(b1);
                    b1 = setTimeout(function () {
                        d();
                        bV.publish("sitemap/cell_data_added", [dn, dr, dq]);
                        bV.publish("sitemap/sitemap_modified", ["cell_data_add", bC(), cZ(dn), dr])
                    }, 10)
                }
                return true
            }
        }
        return false
    }

    function z(dn, dq, dp) {
        if (dn === bh) {
            dn = ce()
        } else {
            dn = bb.getElement(dn)
        }
        if (dn && bb.getData(dn, dq) !== bh) {
            bb.removeData(dn, dq);
            if (!dp) {
                clearTimeout(b1);
                b1 = setTimeout(function () {
                    d();
                    bV.publish("sitemap/cell_data_removed", [dn, dq]);
                    bV.publish("sitemap/sitemap_modified", ["cell_data_remove", bC(), cZ(dn), dq])
                }, 10)
            }
            return true
        }
        return false
    }

    function ck(dn, dq, dp) {
        if (cd(dn, Z.data_desc, dq, dp)) {
            bV.publish("sitemap/cell_data_added/desc", [dn, dq])
        }
    }

    function E(dn, dp) {
        if (z(dn, Z.data_desc, dp)) {
            bV.publish("sitemap/cell_data_removed/desc", [dn])
        }
    }

    function aY(dn, dp) {
        if (typeof dp === "number" && (dp = parseInt(dp, 10)) > 260) {
            cd(dn, Z.data_desc_width, dp, true)
        } else {
            aV(dn)
        }
    }

    function aV(dn) {
        z(dn, Z.data_desc_width, true)
    }

    function au(dn, dq, dp) {
        if (cd(dn, Z.data_url, dq, dp)) {
            bV.publish("sitemap/cell_data_added/url", [dn, dq])
        }
    }

    function bA(dn, dp) {
        if (z(dn, Z.data_url, dp)) {
            bV.publish("sitemap/cell_data_removed/url", [dn])
        }
    }

    function af(dn, dq, dp) {
        if (cd(dn, Z.data_archetype, dq, dp)) {
            bV.publish("sitemap/cell_data_added/archetype", [dn, dq])
        }
    }

    function ae(dn, dp) {
        if (z(dn, Z.data_archetype, dp)) {
            bV.publish("sitemap/cell_data_removed/archetype", [dn])
        }
    }

    function ak(dn, dq, dp, dr) {
        if (dn === bh) {
            dn = ce()
        } else {
            dn = bb.getElement(dn)
        }
        if (dn) {
            if (dr) {
                var dt = bC();
                var ds = {};
                var du = bb.getElement(dq);
                if (dq) {
                    if (bN[dq] !== bh && !du) {
                        a9(bN[dq].options);
                        ds = bN[dq]
                    } else {
                        a9({id: dq})
                    }
                } else {
                    dq = a9()
                }
                aL(ds, bh, true);
                b9(dt);
                bb.setData(dq, Z.data_parent, bb.getAttr(dn, "id"))
            }
            if (cd(dn, Z.data_section, dq, dp)) {
                bV.publish("sitemap/cell_data_added/section", [dn, dq])
            }
            return dq
        }
        return false
    }

    function aS(dx, dy, dt) {
        if (dx === bh) {
            dx = ce()
        } else {
            dx = bb.getElement(dx)
        }
        if (dx) {
            var dw = bb.getData(dx, Z.data_section);
            var dv = a6(dw);
            if (dt) {
                bb.removeClass(dx, "collapsed");
                if (dv.group && !dv.cells) {
                    dv.cells = s(dw)
                }
                bb.removeElement(dw);
                if (dv.cells) {
                    var du = bW(dx);
                    if (typeof du === "number") {
                        var dp = 99999;
                        ++du;
                        for (var ds = 0, dr = dv.cells.length; ds < dr; ++ds) {
                            if (dv.cells[ds].id) {
                                bb.clearCache(true, dv.cells[ds].id);
                                da(false, dv.cells[ds].id)
                            }
                            var dq = bW(dv.cells[ds]);
                            if (dq === "home") {
                                continue
                            } else {
                                if (typeof dq !== "number" || dq === 1) {
                                    dv.cells[ds].level = du;
                                    dv.cells[ds].order = ++dp;
                                    dv.cells[ds].parent = dx.id;
                                    dl(dx, dv.cells[ds].id)
                                } else {
                                    dv.cells[ds].level = (dq - 1) + du
                                }
                            }
                            var dn = cb(dv.cells[ds], dv.cells[ds].level)
                        }
                    } else {
                        var dp = bb.getData(dx, Z.data_order) || 99999;
                        for (var ds = 0, dr = dv.cells.length; ds < dr; ++ds) {
                            if (dv.cells[ds].id) {
                                bb.clearCache(true, dv.cells[ds].id);
                                da(false, dv.cells[ds].id)
                            }
                            if (dv.cells[ds].level !== "home") {
                                dv.cells[ds].level = du;
                                dv.cells[ds].order = ++dp;
                                delete dv.cells[ds].parent;
                                delete dv.cells[ds].childs;
                                cb(dv.cells[ds], dv.cells[ds].level)
                            }
                        }
                    }
                }
            }
            if (cv[dw]) {
                cv[dw] = bh;
                delete cv[dw]
            }
            if (z(dx, Z.data_section, dy)) {
                bV.publish("sitemap/cell_data_removed/section", [dx, dw])
            }
        }
    }

    function cr(dn, dp) {
        bN[dn] = dp
    }

    function bd(dn) {
        if (dn && !dk(dn)) {
            if (cg[dn] !== bh) {
                bB(cg[dn].group.id, true, true)
            }
            bV.publish("sitemap/section_removed", [dn])
        }
    }

    function cF(dn) {
        var dr = bb.getElementsByClassName(cg.svg, "sitemap-section");
        for (var dq = dr.length - 1; dq >= 0; --dq) {
            var dp = dr[dq].id;
            if (!dk(dp) && !az(dp)) {
                bb.removeElement(dp, dn);
                cg[dp] = bh;
                delete cg[dp]
            }
        }
    }

    function bB(dp, dn, dq) {
        bb.removeElement(dp, dn);
        cg[dp] = bh;
        delete cg[dp];
        if (dq && bN[dp] !== bh) {
            bN[dp] = bh;
            delete bN[dp]
        }
    }

    function aM(dn, dp, dt) {
        if (!c3.isArray(dn)) {
            dn = dn ? [dn] : []
        }
        dn.push(Z.id_main_section);
        var ds = bb.getElementsByClassName(cg.svg, "sitemap-section");
        for (var dr = ds.length - 1; dr >= 0; --dr) {
            var dq = ds[dr].id;
            if (c3.inArray(dq, dn) < 0 && (!dt || !az(dq))) {
                bB(dq, dp)
            }
        }
    }

    function ai(dn, dq, dp) {
        if (dn === bh) {
            dn = ce()
        }
        if (typeof dq === "string" && dq.length > 3 && dq !== S(dn) && dq !== S(dn, true)) {
            cd(dn, Z.data_color, dq.toLowerCase(), true)
        } else {
            z(dn, Z.data_color, true)
        }
        bG(dn);
        if (!dp) {
            d();
            bV.publish("sitemap/cell_color_changed", [dn, dq]);
            bV.publish("sitemap/sitemap_modified", ["cell_color", bC(), cZ(dn)])
        }
    }

    function b5(dn, dq, dp) {
        if (dn === bh) {
            dn = ce()
        }
        if (typeof dq === "string" && dq.length > 3 && dq !== S("text_color")) {
            cd(dn, Z.data_text_color, dq.toLowerCase(), true)
        } else {
            z(dn, Z.data_text_color, true)
        }
        cK(dn);
        if (!dp) {
            d();
            bV.publish("sitemap/cell_text_color_changed", [dn, dq]);
            bV.publish("sitemap/sitemap_modified", ["cell_text_color", bC(), cZ(dn)])
        }
    }

    function aO(dn) {
        var dp = a6(dn);
        return dp ? dp.options : {}
    }

    function d(dp) {
        var dr = a6();
        if (dr && dr.group) {
            bV.log("Full Refresh (" + dr.group.id + ")", "time");
            if (!cH.isObject(dp)) {
                if (dp === true) {
                    dp = {text_edit: true}
                } else {
                    dp = {}
                }
            }
            dp = c3.extend({
                text_edit: false,
                buttons: true,
                paper: true,
                lines: true,
                container: true,
                logo: true,
                bg: true
            }, dp);
            bi(dr.options.text_shadow);
            if (!dp.text_edit) {
                ah(bh, true)
            }
            if (dp.buttons) {
                a2()
            }
            var dq = true;
            if (dp.paper) {
                if (cH.isObject(dp.paper)) {
                    cC(dp.paper);
                    dq = false
                } else {
                    cC()
                }
            }
            if (dp.lines) {
                bU()
            }
            if (dp.container) {
                a3()
            }
            if (dp.bg) {
                var dn = bb.getElementsByClassName(dr.group, "svg-blocked-background");
                if (dn.length) {
                    bb.bringToFront(dn[0])
                }
            }
            bV.log("Full Refresh (" + dr.group.id + ")", "timeEnd");
            bV.publish("sitemap/full_refresh", [dq, dr.group.id])
        }
    }

    function bx(dn, dq, dp) {
        dn = bb.getElement(dn);
        var dr = bW(dn);
        if (dn && dr === "util") {
            dg()
        } else {
            if (dn && dr === "foot") {
                c7()
            } else {
                d(dp)
            }
        }
    }

    function cj(dx, dt, dn) {
        var dv = a6();
        if (dv && dv.group) {
            bV.log("Column Refresh (" + dv.group.id + ")", "time");
            if (!dn) {
                ah(bh, true)
            }
            var dA = [dx];
            if (dt) {
                dA = bT(dx)
            }
            dx = dA.length ? dA[dA.length - 1] : dx;
            bV.log("_columnRefresh()", "time");
            var dw = c[dv.options.template];
            var dq = Math.min(Z.container.offsetWidth, cJ.documentElement.clientWidth);
            var dz = dq;
            var du = dq - dw.paper_padding[1] - dw.paper_padding[3];
            var dp = bb.getFloat(dx, "width");
            cB(dx, dp, bh, 1);
            var dy = bb.getFloat(dx, "y");
            var dr = bb.getFloat(dx, "height");
            aA = Math.max(aA, dy + dr);
            b2[dv.group.id] = Math.max(b2[dv.group.id], aA);
            cP(dx, (dp / 2) + 3, 1);
            bV.log("_columnRefresh()", "timeEnd");
            bU();
            a3();
            var ds = bb.getElementsByClassName(dv.group, "svg-blocked-background");
            if (ds.length) {
                bb.bringToFront(ds[0])
            }
        }
        if (dv && dv.group) {
            bV.log("Column Refresh (" + dv.group.id + ")", "timeEnd")
        }
    }

    function dg(dK, dG, dJ) {
        var dz = a6();
        if (dz && dz.group) {
            bV.log("_utilCellsRefresh()", "time");
            var du = bb.getElementsByClassName(dz.group, "level-util");
            var dq = cL("util");
            var dL = c[dz.options.template];
            if (!dK) {
                dK = Math.max(Z.container.offsetWidth, cJ.documentElement.clientWidth)
            }
            if (du.length) {
                if (dG) {
                    for (var dH = 0; dH < du.length; ++dH) {
                        var dA = (aD[du[dH].id] && aD[du[dH].id].y) ? aD[du[dH].id].y : bb.getFloat(du[dH], "y");
                        var dD = (aD[du[dH].id] && aD[du[dH].id].height) ? aD[du[dH].id].height : bb.getFloat(du[dH], "height");
                        aA = Math.max(aA, dA + dD)
                    }
                } else {
                    var dp = bb.getElementsByClassName(dz.group, "add-button-util");
                    if (dp.length) {
                        bb.removeElement(y(dp[0]));
                        aU(dp[0])
                    }
                    cB(du, dq.min_width, dq.max_width);
                    var dv = db(du);
                    var dt = dK - o - dL.paper_padding[1];
                    var dy = 0;
                    var dM = [];
                    var dN = [];
                    var dC = 1;
                    var dx = dv.length - 1;
                    for (var dH = 0; dH <= dx; ++dH) {
                        var dF = ((aD[dv[dH].id] && aD[dv[dH].id].width) ? aD[dv[dH].id].width : bb.getFloat(dv[dH], "width")) + dq.margin_left + dq.margin_right;
                        dy += dF;
                        if (dy > dt) {
                            dy -= dF;
                            dN[dC] = o + (dt - dy);
                            dM.push(dH);
                            ++dC;
                            dy = dF
                        }
                        if (dH >= dx) {
                            dN[dC] = o + (dt - dy)
                        }
                    }
                    dC = 1;
                    var dr = 0;
                    var dn = dL.paper_padding[0] + dq.margin_top;
                    var dE = 0;
                    for (var dH = 0; dH <= dx; ++dH) {
                        var ds = bb.getElement(dv[dH]);
                        if (dH === 0 || c3.inArray(dH, dM) >= 0) {
                            if (dH > 0) {
                                ++dC
                            }
                            dr = (typeof dN[dC] === "number") ? dN[dC] : 0;
                            if (dH > 0) {
                                dn = Math.max(dn, dE);
                                dE = 0
                            }
                        }
                        var dw = (aD[ds.id] && aD[ds.id].height) ? aD[ds.id].height : bb.getFloat(ds, "height");
                        if (!aD[ds.id]) {
                            aD[ds.id] = {}
                        }
                        aD[ds.id].x = dr + dq.margin_left;
                        aD[ds.id].y = dn;
                        dr += bb.getFloat(ds, "width") + dq.margin_left + dq.margin_right;
                        dE = Math.max(dE, dn + dw + dq.margin_bottom);
                        aA = Math.max(aA, dn + dw);
                        bb.setData(ds, Z.data_order, (dH + 1) * 1000)
                    }
                }
            } else {
                if (!dG) {
                    var dp = bb.getElementsByClassName(dz.group, "add-button-util");
                    if (dp.length) {
                        dp = dp[0];
                        var dI = (aD[dp.id] && aD[dp.id].width) ? aD[dp.id].width : ((r["hover-util"] && r["hover-util"].width) ? r["hover-util"].width : bb.getFloat(dp, "width"));
                        var dw = (aD[dp.id] && aD[dp.id].height) ? aD[dp.id].height : ((r["hover-util"] && r["hover-util"].height) ? r["hover-util"].height : bb.getFloat(dp, "height"));
                        var dB = dK - dI - dL.paper_padding[1];
                        var dA = dL.paper_padding[0] + 1.5;
                        if (!aD[dp.id]) {
                            aD[dp.id] = {}
                        }
                        aD[dp.id].x = dB;
                        aD[dp.id].y = dA;
                        aA = Math.max(aA, dA + dw)
                    }
                }
            }
            if (!dJ) {
                bb.forEach(aD, function (dP, dO) {
                    bb.forEach(dO, function (dQ, dR) {
                        bb.setAttr(dP, dQ, dR)
                    })
                }, true);
                aD = {}
            }
            bV.log("_utilCellsRefresh()", "timeEnd");
            b2[dz.group.id] = Math.max(b2[dz.group.id], aA)
        }
    }

    function c7(dL, dF, dK) {
        var dB = a6();
        if (dB && dB.group) {
            bV.log("_footCellsRefresh()", "time");
            var dv = bb.getElementsByClassName(dB.group, "level-foot");
            var dq = cL("foot");
            var dM = c[dB.options.template];
            if (!dL) {
                dL = Math.max(Z.container.offsetWidth, cJ.documentElement.clientWidth)
            }
            if (dv.length) {
                var dp = bb.getElementsByClassName(dB.group, "add-button-foot");
                if (dp.length) {
                    bb.removeElement(y(dp[0]));
                    aU(dp[0])
                }
                cB(dv, dq.min_width, dq.max_width);
                var dw = db(dv);
                var du = dL - dM.paper_padding[1] - dM.paper_padding[3];
                var dA = 0;
                var dN = [];
                var dO = [];
                var dG = 1;
                var dz = dv.length - 1;
                for (var dJ = 0; dJ < dw.length; ++dJ) {
                    var dI = ((aD[dw[dJ].id] && aD[dw[dJ].id].width) ? aD[dw[dJ].id].width : bb.getFloat(dw[dJ], "width")) + dq.margin_left + dq.margin_right;
                    dA += dI;
                    if (dA > du) {
                        dA -= dI;
                        if (dM.align === "center") {
                            dO[dG] = (dL - dA) / 2
                        } else {
                            if (dM.align === "right") {
                                dO[dG] = du - dA
                            } else {
                                dO[dG] = dM.paper_padding[3]
                            }
                        }
                        dN.push(dJ);
                        ++dG;
                        dA = dI
                    }
                    if (dJ >= dz) {
                        if (dM.align === "center") {
                            dO[dG] = (dL - dA) / 2
                        } else {
                            if (dM.align === "right") {
                                dO[dG] = du - dA
                            } else {
                                dO[dG] = dM.paper_padding[3]
                            }
                        }
                    }
                }
                dG = 1;
                var dr = 0;
                var dn = bD + dq.area_margin_top;
                var dH = 0;
                var dE = 0;
                for (var dJ = 0; dJ < dw.length; ++dJ) {
                    var dt = bb.getElement(dw[dJ]);
                    if (dJ === 0 || c3.inArray(dJ, dN) >= 0) {
                        if (dJ > 0) {
                            ++dG
                        }
                        dr = (typeof dO[dG] === "number") ? dO[dG] : 0;
                        if (dJ > 0) {
                            dn = Math.max(dn, dH);
                            dn += dq.margin_top;
                            dH = 0
                        }
                    }
                    var dy = (aD[dt.id] && aD[dt.id].height) ? aD[dt.id].height : bb.getFloat(dt, "height");
                    dE += dy;
                    if (!aD[dt.id]) {
                        aD[dt.id] = {}
                    }
                    aD[dt.id].x = dr + dq.margin_left;
                    aD[dt.id].y = dn;
                    dr += ((aD[dt.id] && aD[dt.id].width) ? aD[dt.id].width : bb.getFloat(dt, "width")) + dq.margin_left + dq.margin_right;
                    dH = Math.max(dH, dn + dy + dq.margin_bottom);
                    aA = Math.max(aA, dn + dy);
                    bb.setData(dt, Z.data_order, (dJ + 1) * 1000)
                }
                b2[dB.group.id] += dq.area_margin_top + dq.margin_bottom + dE + dM.paper_padding[2]
            } else {
                var dp = bb.getElementsByClassName(dB.group, "add-button-foot");
                if (dp.length) {
                    dp = dp[0];
                    if (dM.align === "center") {
                        var ds = (aD[dp.id] && aD[dp.id].width) ? aD[dp.id].width : ((r["hover-foot"] && r["hover-foot"].width) ? r["hover-foot"].width : bb.getFloat(dp, "width"));
                        var dx = (dL - ds) / 2
                    } else {
                        var dx = dM.paper_padding[3]
                    }
                    var dD = bD + dq.area_margin_top + 1.5;
                    if (!aD[dp.id]) {
                        aD[dp.id] = {}
                    }
                    aD[dp.id].x = dx;
                    aD[dp.id].y = dD;
                    var dC = (aD[dp.id] && aD[dp.id].height) ? aD[dp.id].height : ((r["hover-foot"] && r["hover-foot"].height) ? r["hover-foot"].height : bb.getFloat(dp, "height"));
                    aA = Math.max(bD, dD + dC);
                    b2[dB.group.id] += dD + dC
                }
            }
            if (!dK) {
                bb.forEach(aD, function (dQ, dP) {
                    bb.forEach(dP, function (dR, dS) {
                        bb.setAttr(dQ, dR, dS)
                    })
                }, true);
                aD = {}
            }
            b2[dB.group.id] = Math.max(b2[dB.group.id], aA);
            bV.log("_footCellsRefresh()", "timeEnd")
        }
    }

    function aR(dn, dp) {
        if (!Z.edit) {
            return true
        }
        if (!dn) {
            dn = bC()
        }
        if (!dp) {
            dp = "sitemap"
        }
        return (cH.isObject(O[dn]) && O[dn][dp] === false)
    }

    function b4(dn, dp) {
        dn.querySelector(".text").style.boxShadow = "0 0 10px " + cS[dp].color + " inset";
        var dq = dn.querySelector(".editing");
        if (dq) {
            return
        }
        var dq = cJ.createElement("span");
        dq.innerHTML = bV.__("{1} editing", cS[dp].first_name);
        dq.classList.add("editing");
        dq.style.backgroundColor = cS[dp].color;
        dn.appendChild(dq)
    }

    function co(dn) {
        var dr = dn.querySelector(".text");
        if (dr) {
            dr.style.boxShadow = ""
        }
        var dq = dn.querySelectorAll(".editing");
        if (dq && dq.length) {
            for (var dp = dq.length; dp > 0; --dp) {
                if (dq[dp] && dq[dp].parentNode) {
                    dq[dp].parentNode.removeChild(dq[dp])
                }
            }
        }
    }

    function c9(dx, dt, dA) {
        if (!Z.edit) {
            return
        }
        var dn = bC();
        if (!dx) {
            dx = dn
        }
        if (O[dx] === bh) {
            O[dx] = {}
        }
        if (!dt) {
            dt = "sitemap"
        }
        var dB = dt;
        if (dt === "batchedit") {
            dB = "sitemap"
        }
        O[dx][dB] = false;
        var dC = cJ.getElementById("map-dropdown");
        if (dC) {
            dC.style.display = "none"
        }
        var ds = cJ.getElementById("action-undo");
        if (ds) {
            ds.parentNode.classList.add("blocked")
        }
        switch (dt) {
            case"batchedit":
                var dy = cJ.getElementById("sitemap-menu").querySelector("li.batch");
                if (dy && dA) {
                    b4(dy, dA)
                }
            case"sitemap":
                var dw = a6(dx);
                if (dw.group) {
                    dw.group.classList.add("blocked");
                    if (dA && cS[dA] !== bh) {
                        var dz = Y(dw);
                        var dp = bb.getElementsByClassName(dw.group, "svg-blocked-background");
                        if (!dp.length) {
                            dp = bb.createElementNs("rect", {
                                width: "110%",
                                height: Math.ceil(dz.height + dz.y + 15) + 0.5,
                                x: -5,
                                y: 0,
                                fill: "rgba(" + ay.toArray(cS[dA].color).join(",") + ", .15)",
                                stroke: cS[dA].color,
                                "class": "svg-blocked-background"
                            }, dw.group, false, true)
                        } else {
                            dp = dp[0];
                            bb.setAttr(dp, "height", dz.height);
                            bb.setAttr(dp, "y", dz.y);
                            bb.setAttr(dp, "fill", "rgba(" + ay.toArray(cS[dA].color).join(",") + ", .15)");
                            bb.setAttr(dp, "stroke", cS[dA].color)
                        }
                        if (dx === bC()) {
                            co(Z.container);
                            var dr = c2(dp);
                            var dv = cJ.createElement("span");
                            dv.innerHTML = bV.__("{1} editing", cS[dA].first_name);
                            dv.classList.add("editing");
                            dv.style.backgroundColor = cS[dA].color;
                            dv.style.top = dr.top + "px";
                            dv.style.left = c3("#sitemap-menu").offset().left + "px";
                            var du = dk(dx) ? 50 : cJ.getElementById("section-breadcrumbs-" + dx).style.zIndex;
                            if (du) {
                                dv.style.zIndex = du
                            }
                            Z.container.appendChild(dv)
                        }
                        var dq = cJ.getElementById("sitemap-logo");
                        dq.classList.add("blocked");
                        dq.style.opacity = 0.5
                    }
                }
                var dy = cJ.getElementById("sitemap-menu").querySelector("li.orientation");
                if (dy) {
                    dy.classList.add("blocked")
                }
                break;
            case"colors":
                if (dx === dn) {
                    var dy = cJ.getElementById("sitemap-menu").querySelector("li.colors");
                    dy.classList.add("blocked");
                    if (dA && cS[dA] !== bh) {
                        b4(dy, dA)
                    }
                }
                break
        }
        var dy = cJ.getElementById("sitemap-menu");
        if (dy) {
            dy.classList.add("fullblock")
        }
    }

    function v(dv, ds) {
        if (!Z.edit) {
            return
        }
        var dn = bC();
        if (!dv) {
            dv = dn
        }
        if (O[dv] === bh) {
            O[dv] = {}
        }
        if (!ds) {
            ds = "sitemap"
        }
        var dx = ds;
        if (ds === "batchedit") {
            dx = "sitemap"
        }
        var dr = cJ.getElementById("action-undo");
        if (dr) {
            dr.parentNode.classList.remove("blocked")
        }
        O[dv][dx] = true;
        switch (ds) {
            case"batchedit":
                var dw = cJ.getElementById("sitemap-menu").querySelector("li.batch");
                if (dw) {
                    co(dw)
                }
            case"sitemap":
                var du = a6(dv);
                if (du.group) {
                    du.group.classList.remove("blocked");
                    var dq = bb.getElementsByClassName(du.group, "svg-blocked-background");
                    if (dq.length) {
                        dq[0].parentNode.removeChild(dq[0])
                    }
                    var dt = Z.container.querySelector("span.editing");
                    if (dt) {
                        dt.parentNode.removeChild(dt)
                    }
                }
                var dw = cJ.getElementById("sitemap-menu").querySelector("li.orientation");
                if (dw) {
                    dw.classList.remove("blocked")
                }
                var dp = cJ.getElementById("sitemap-logo");
                dp.classList.remove("blocked");
                dp.style.opacity = 1;
                break;
            case"colors":
                if (dv === dn) {
                    var dw = cJ.getElementById("sitemap-menu").querySelector("li.colors");
                    dw.classList.remove("blocked");
                    co(dw)
                }
                break
        }
        var dw = cJ.getElementById("sitemap-menu");
        if (dw) {
            dw.classList.remove("fullblock")
        }
    }

    function a() {
        var dn = 0;
        bb.forEach(cS, function (dp, dq) {
            if (dq && dq.user_name) {
                ++dn
            }
        }, true);
        return dn
    }

    function by() {
        return c3.extend({}, cS)
    }

    function aB(dn) {
        if (dn.user_id && cS[dn.user_id] === bh) {
            var dp = dn.user_name.split(" ");
            cS[dn.user_id] = c3.extend({}, dn, {
                color: Z.contributors_colors.shift(),
                first_name: dp.shift(),
                last_name: dp.join(" "),
                initials: dn.user_initials,
                avatar: dn.user_avatar
            });
            var dr = "";
            bb.forEach(cS, function (ds, dt) {
                if (dt && dt.user_initials) {
                    dr += '<div id="users-list-' + ds + '" class="single-user real-user ';
                    if (dt.user_avatar) {
                        dr += 'has-avatar"><img src="' + bF.charsEncode(dt.user_avatar) + '">'
                    } else {
                        dr += 'has-text" style="background-color: ' + dt.color + '">' + dt.user_initials
                    }
                    dr += '<div class="tooltip">' + bF.charsEncode(dt.user_name) + "</div></div>"
                }
            }, true);
            if (dr) {
                dr += '<div id="action-chat" class="single-user chat"><i class="fa fa-comments"></i><div class="tooltip">' + bV.__("Show Chat") + "</div></div>"
            }
            var dq = cJ.getElementById("users-list");
            dq.innerHTML = dr ? "<p>" + bV.__("Active Users") + ":</p>" + dr : "";
            if (dr) {
                c3(dq).find(".tooltip").each(function () {
                    c3(this).css("margin-left", -1 * (c3(this).outerWidth() / 2))
                }).end().find("#action-chat").on("click", function () {
                    b8();
                    ac(dc.get("me"))
                })
            }
            return cS[dn.user_id]
        }
    }

    function t(dn) {
        if (cH.isObject(cS[dn])) {
            Z.contributors_colors.unshift(cS[dn].color);
            cS[dn] = bh;
            delete cS[dn];
            var dp = cJ.getElementById("users-list-" + dn);
            if (dp) {
                dp.parentNode.removeChild(dp)
            }
            if (!cJ.getElementById("users-list").querySelector("div.real-user")) {
                c3("#users-list").empty()
            }
        }
    }

    function b8() {
        var dn = cJ.getElementById("chat");
        if (!dn) {
            c3(cJ.body).append('                <div id="chat" class="opened">                    <div class="header clearfix">                        <div id="chat-users"><span class="count"></span></div>                        <div class="close"><i class="fa fa-times"></i></div>                        <div class="hide"><i class="fa fa-minus"></i></div>                    </div>                    <div id="chat-content"></div>                    <div class="editor"><textarea id="chat-message"></textarea></div>                </div>            ').find("#chat .hide").on("click", function () {
                var dp = cJ.getElementById("chat");
                if (dp && dp.classList.contains("opened")) {
                    bm()
                } else {
                    b8()
                }
            }).end().find("#chat .close").on("click", function () {
                I()
            }).end().find("textarea").on("keypress", function (dr) {
                if (dr.which == 13) {
                    var dq = this;
                    var dp = dq.value;
                    bV.publish("sitemap/chat_message", [dp]);
                    cW(dc.get("me"), dp);
                    setTimeout(function () {
                        dq.value = "";
                        dq.focus()
                    }, 5)
                }
            }).focus();
            bV.publish("sitemap/chat_open")
        } else {
            dn.classList.add("opened")
        }
    }

    function bm() {
        var dn = cJ.getElementById("chat");
        if (dn) {
            dn.classList.remove("opened")
        }
    }

    function I(dq) {
        try {
            var dn = !!new window.Blob
        } catch (dr) {
        }
        if (!dq && dn && c3("#chat-content .message").length) {
            cH.confirmDialog({
                close: true,
                title: bV.__("Would you like to export the chat for your records?"),
                text: bV.__("Closing the chat window will clear the chat log."),
                on_yes: function () {
                    var ds = '<!DOCTYPE html><html><head>    <meta charset="utf-8">    <title>' + c3("title").text().replace("Slickplan", "Chat") + '</title>    <style type="text/css">        * { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }        body { font-family: sans-serif; color: #000; clear: both; font-weight: 400; line-height: 1.4; height: 194px; overflow-x: hidden; overflow-y: auto; }        body .info { font-size: 11px; color: #777; clear: both; padding: 5px 10px; }        body .message { padding: 5px; margin: 0 5px; border-bottom: 1px solid #cbcbcb; color: #222; font-size: 13px; }        body .info + .message { border-top: 1px solid #cbcbcb; }        body .message:last-child { border-bottom: 0; }        body .name { font-weight: 700; float: left; display: block; width: calc(100% - 60px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }        body .time { font-size: 11px; color: #777; float: right; width: 60px; text-align: right; text-transform: uppercase; line-height: 1.7; }        body .text { clear: both; padding: 3px 0 4px; }    </style></head><body>    ' + c3("#chat-content").html() + "</body></html>";
                    window.saveAs(new window.Blob([ds], {type: "application/xhtml+xml;charset=" + document.characterSet}), "chat.html");
                    I(true)
                },
                on_no: function () {
                    I(true)
                }
            })
        } else {
            var dp = cJ.getElementById("chat");
            if (dp) {
                dp.parentNode.removeChild(dp);
                bV.publish("sitemap/chat_close")
            }
        }
    }

    function cW(dn, dr) {
        if (!dn.full_name) {
            dn.full_name = dn.first_name + " " + dn.last_name;
            if (dn.full_name === " ") {
                dn.full_name = dn.username
            }
        }
        ac(dn);
        var dt = c3.trim(bF.charsEncode(dn.full_name));
        var ds = c3.trim(cH.formatTime(new Date()));
        dr = bF.charsEncode(dr);
        var dp = c3("#chat-content");
        var dq = dp.children("div:last");
        if (dq.is(".message") && c3.trim(dq.find(".name").text()) === dt && c3.trim(dq.find(".time").text()) === ds) {
            dq.children(".text").append("<br>" + dr)
        } else {
            dp.append('                <div class="message clearfix">                    <div class="name">' + dt + '</div>                    <div class="time">' + ds + '</div>                    <div class="text">' + dr + "</div>                </div>            ")
        }
        dp.scrollTop(9999999)
    }

    function ac(dp, dn) {
        if (dp.id == dc.get("me").id) {
            dn = true
        }
        var dr = c3("#chat-users > .user-" + dp.id);
        if (!dr.length) {
            if (!dp.full_name) {
                dp.full_name = dp.first_name + " " + dp.last_name;
                if (dp.full_name === " ") {
                    dp.full_name = dp.username
                }
            }
            var dq = bF.charsEncode(dp.full_name);
            if (!dn) {
                c3("#chat-content").append('<div class="info">' + bV.__("{1} joined group chat.", [dq]) + "</div>").scrollTop(9999999)
            }
            c3("#chat-users").append('<span class="user user-' + dp.id + '">' + dq + "</span>");
            c3("#chat-users .count").text("(" + c3("#chat-users > .user").length + ")")
        }
    }

    function a7(dp, dn) {
        if (dp.id == dc.get("me").id) {
            dn = true
        }
        var dr = c3("#chat-users > .user-" + dp.id);
        if (dr.length) {
            if (!dp.full_name) {
                dp.full_name = dp.first_name + " " + dp.last_name;
                if (dp.full_name === " ") {
                    dp.full_name = dp.username
                }
            }
            var dq = bF.charsEncode(dp.full_name);
            if (!dn) {
                c3("#chat-content").append('<div class="info">' + bV.__("{1} left group chat.", [dq]) + "</div>").scrollTop(9999999)
            }
            dr.remove();
            c3("#chat-users .count").text("(" + c3("#chat-users > .user").length + ")")
        }
    }

    function ca(dn) {
        var dr = bY(dn, true);
        if (dr.length) {
            for (var dq = 0, dp = dr.length; dq < dp; ++dq) {
                bb.removeClass(dr[dq], "hidden-but-refresh");
                if (!bb.hasClass(dr[dq], "collapsed")) {
                    ca(dr[dq])
                }
            }
        }
    }

    var di = false;

    function bO(dP, dA, eb) {
        if (!eb && aR()) {
            return false
        }
        var dP = bb.getElement(dP);
        if (!dP || di) {
            return false
        }
        di = true;
        var dG = a6();
        if (!(dG && dG.group && dG.options)) {
            return false
        }
        var dr = c[dG.options.template];
        var dN = bb.hasClass(dP, "collapsed");
        var dT = y(dP, true);
        if (!dT || typeof dT.getBBox !== "function") {
            return false
        }
        if (dN) {
            bb.removeClass(dP, "collapsed");
            ca(dP)
        } else {
            bb.addClass(dP, "collapsed")
        }
        var dv = 99999999;
        var dH = bZ(dP);
        for (var d5 = 0, d4 = dH.length; d5 < d4; ++d5) {
            dv = Math.min(dv, bb.getFloat(dH[d5], "y"))
        }
        dv -= 10 * Z.scale;
        var dM = bW(dP);
        var d0 = [];
        var dx = 999999;
        var dO = dT.getBBox().y;
        if (!dN) {
            var dS = bb.getFloat(dP, "y") + bb.getFloat(dP, "height")
        }
        if (typeof dM === "number") {
            var dF = bb.getElement(cl(dP, 1));
            var d7 = y(dF);
            if (dr.align === "left" || (dM > 1 && d7)) {
                var dE = {};
                if (dr.align === "left") {
                    var dB = dG.group.querySelectorAll("svg.cell:not(.hidden):not(.hidden-but-refresh)")
                } else {
                    var dB = d7.querySelectorAll("svg.cell:not(.hidden):not(.hidden-but-refresh)")
                }
                for (var d5 = 0, d4 = dB.length; d5 < d4; ++d5) {
                    var dy = dB[d5].parentNode;
                    if (!dy || dE[dy.id]) {
                        continue
                    }
                    var du = dy.getBBox().y;
                    if (bW(dB[d5]) <= dM && du > dO && !bb.hasClass(dy, "sitemap-group-" + dP.id) && !bb.hasClass(dy, "sitemap-group-childrens") && !bb.hasClass(dy, "sitemap-group-foot") && !bb.hasClass(dy, "sitemap-group-util")) {
                        var dQ = dy.querySelectorAll("g.sitemap-group");
                        for (var d3 = 0, d1 = dQ.length; d3 < d1; ++d3) {
                            dE[dQ[d3].id] = true
                        }
                        if (dS) {
                            dx = Math.min(dx, du - dS)
                        }
                        d0.push(dB[d5])
                    }
                }
            }
        }
        if (dx <= 0 || dx > 999998) {
            if (dT && typeof dT.getBBox === "function") {
                dx = dT.getBBox().height
            }
        }
        var dq = {};
        var dX = [];
        var dt = true;
        var dp = y(dP);
        var dW;
        var dU = 50;
        var dY = false;
        while (dU) {
            if (cD(dp, "g", "sitemap-group")) {
                var d6 = {el: null, points: 0};
                if (dr.align === "left" && dp.id === "svgmainsection-group-main") {
                    var d9 = dp.querySelector("svg.cell.level-home");
                    if (d9) {
                        d6.el = y(d9).querySelector("polyline.connection");
                        if (d6.el) {
                            var dD = dp.childNodes;
                            for (var d5 = 0, d4 = dD.length; d5 < d4; ++d5) {
                                if (cD(dD[d5], "g", "sitemap-group-childrens")) {
                                    dD = dD[d5].childNodes;
                                    for (var d5 = 0, d4 = dD.length; d5 < d4; ++d5) {
                                        if (cD(dD[d5], "g", "sitemap-group") && dD[d5].getBBox().y <= dO) {
                                            ++d6.points
                                        }
                                    }
                                    if (d6.points >= 0) {
                                        dX.push(d6)
                                    }
                                    break
                                }
                            }
                        }
                    }
                    break
                } else {
                    dD = dp.childNodes;
                    for (var d5 = 0, d4 = dD.length; d5 < d4; ++d5) {
                        if (cD(dD[d5], "polyline", "connection")) {
                            d6.el = dD[d5]
                        } else {
                            if (cD(dD[d5], "g", "sitemap-group") && dD[d5].getBBox().y <= dO) {
                                ++d6.points
                            }
                        }
                    }
                    if (d6.el && d6.points >= 0) {
                        dX.push(d6)
                    }
                    dp = dp.parentNode
                }
            } else {
                break
            }
            --dU
        }
        var d2 = null;
        if (dG && dG.group) {
            d2 = dG.group.querySelector(".sitemap-group-foot")
        }
        if (dr.align === "left" && d2) {
            d0.push(d2)
        }
        if (dN) {
            if (dT) {
                if (dr.align === "center" && d2) {
                    var ds = cL("foot");
                    var dV = d2.getBBox().y - ds.area_margin_top;
                    if (d7) {
                        var dK = d7.getBBox();
                        var dz = dK.y + dK.height;
                        var ea = dV - dz
                    }
                }
                var dw = dT.childNodes;
                var dL = [0, 0];
                for (var d5 = 0, d4 = dw.length; d5 < d4; ++d5) {
                    if (cD(dw[d5], "g", "sitemap-group")) {
                        var dn = dw[d5].getBBox();
                        if (dL[0] <= 0) {
                            dL[0] = dn.y
                        }
                        dL[1] = Math.max(dL[1], dn.y + dn.height)
                    }
                }
                dx = dL[1] - dL[0];
                if (!dx && dT && typeof dT.getBBox === "function") {
                    dx = dT.getBBox().height - 14
                }
                var dJ = dx;
                var ds = cL(dP);
                if (dr.align == "center") {
                    dx += 5 + ds.margin_below_childs
                } else {
                    dx += ds.margin_below_childs
                }
                dJ += ds.margin_below_childs;
                var dC = [null, 0];
                var dB = dT.querySelectorAll("svg.cell:not(.hidden-but-refresh)");
                if (dB && dB.length) {
                    for (var d5 = 0, d4 = dB.length; d5 < d4; ++d5) {
                        var d8 = bb.getFloat(dB[d5], "y");
                        if (d8 > dC[1]) {
                            dC = [dB[d5], d8]
                        }
                    }
                    if (dC[0]) {
                        if (!bb.hasClass(dC[0], "collapsed")) {
                            dx += 7;
                            if (dr.align === "center" && dM !== 1 && dM !== "1") {
                                dJ += 12
                            }
                        } else {
                            dJ += 4
                        }
                    }
                }
                bb.animateExpand(dT, {top: dv}, 500, "easeInOutCubic", function (ec) {
                    if (!dA) {
                        aP(dP)
                    }
                    if (d0.length) {
                        for (var ee = 0, ed = d0.length; ee < ed; ++ee) {
                            var ef = y(d0[ee]);
                            bb.setMatrix(ef, [1, 0, 0, 1, 0, 0])
                        }
                    }
                    if (dr.align === "center" && d2) {
                        bb.setMatrix(d2, [1, 0, 0, 1, 0, 0])
                    }
                    di = false
                }, function (eh) {
                    if (dx) {
                        var ei = dx * eh;
                        if (ei < 0) {
                            ei = 0
                        }
                        if (d0.length) {
                            for (var ee = 0, ed = d0.length; ee < ed; ++ee) {
                                var eg = y(d0[ee]);
                                bb.setMatrix(eg, [1, 0, 0, 1, 0, ei])
                            }
                        }
                        var ej = Math.max(0, dJ * eh);
                        if (dr.align === "center" && d2 && ej > ea) {
                            bb.setMatrix(d2, [1, 0, 0, 1, 0, ej - ea])
                        }
                        if (dX.length) {
                            for (var ee = 0, ed = dX.length; ee < ed; ++ee) {
                                if (!dq[dX[ee].el.id]) {
                                    dq[dX[ee].el.id] = bb.getAttr(dX[ee].el, "points").toString().split(" ")
                                }
                                var ef = c3.extend([], dq[dX[ee].el.id]);
                                if (dr.align === "center") {
                                    var ec = dX[ee].points * 3 + 3
                                } else {
                                    var ec = dX[ee].points * 3 + 1
                                }
                                for (ec; ec < ef.length; ec += 3) {
                                    ef[ec] = ef[ec].toString().split(",");
                                    ef[ec + 1] = ef[ec + 1].toString().split(",");
                                    ef[ec + 2] = ef[ec + 2].toString().split(",");
                                    ef[ec][1] = parseFloat(ef[ec][1]) + ei;
                                    ef[ec + 1][1] = parseFloat(ef[ec + 1][1]) + ei;
                                    ef[ec + 2][1] = parseFloat(ef[ec + 2][1]) + ei;
                                    ef[ec] = ef[ec].join(",");
                                    ef[ec + 1] = ef[ec + 1].join(",");
                                    ef[ec + 2] = ef[ec + 2].join(",")
                                }
                                bb.setAttr(dX[ee].el, "points", ef.join(" "))
                            }
                        }
                    }
                })
            }
        } else {
            if (dT) {
                if (dr.align === "center" && d2) {
                    var dV = 0;
                    var dZ = bb.getElementsByClassName(dG.group, "level-1");
                    if (dZ) {
                        for (var d5 = 0; d5 < dZ.length; ++d5) {
                            if ((dF && dF.id === dZ[d5].id) || bb.hasClass(dZ[d5], "collapsed")) {
                                dV = Math.max(dV, bb.getFloat(dF, "y") + bb.getFloat(dF, "height"))
                            } else {
                                var dI = y(dZ[d5]).getBBox();
                                dV = Math.max(dV, dI.y + dI.height)
                            }
                        }
                    }
                    var ds = cL("foot");
                    var dR = -(d2.getBBox().y - dV) + ds.area_margin_top
                }
                bb.animateCollapse(dT, {top: dv}, 500, "easeInOutCubic", function (ec) {
                    var eg = bZ(dP, true);
                    if (eg.length) {
                        for (var ee = 0, ed = eg.length; ee < ed; ++ee) {
                            bb.addClass(eg[ee], "hidden-but-refresh")
                        }
                    }
                    if (d0.length) {
                        for (var ee = 0, ed = d0.length; ee < ed; ++ee) {
                            var ef = y(d0[ee]);
                            bb.setMatrix(ef, [1, 0, 0, 1, 0, 0])
                        }
                    }
                    if (dr.align === "center" && d2) {
                        bb.setMatrix(d2, [1, 0, 0, 1, 0, 0])
                    }
                    if (!dA) {
                        aP(dP)
                    }
                    di = false
                }, function (ei) {
                    if (dx) {
                        if (dr.align == "center") {
                            var ec = ((dx - 12) * ei) * -1;
                            var ee = ec;
                            if (dM === 1 || dM === "1") {
                                ee = Math.min(0, (dx * ei) * -1)
                            }
                        } else {
                            var ec = ((dx - 14) * ei) * -1
                        }
                        if (ec > 0) {
                            ec = 0
                        }
                        if (d0.length) {
                            for (var eg = 0, ef = d0.length; eg < ef; ++eg) {
                                var eh = y(d0[eg]);
                                bb.setMatrix(eh, [1, 0, 0, 1, 0, ec])
                            }
                        }
                        if (dr.align === "center" && d2) {
                            var ej = ee;
                            if (ej < dR) {
                                ej = dR
                            }
                            bb.setMatrix(d2, [1, 0, 0, 1, 0, ej])
                        }
                        if (dX.length) {
                            for (var eg = 0, ef = dX.length; eg < ef; ++eg) {
                                if (!dq[dX[eg].el.id]) {
                                    dq[dX[eg].el.id] = bb.getAttr(dX[eg].el, "points").toString().split(" ")
                                }
                                var ek = c3.extend([], dq[dX[eg].el.id]);
                                if (dr.align === "center") {
                                    var ed = dX[eg].points * 3 + 3
                                } else {
                                    var ed = dX[eg].points * 3 + 1
                                }
                                for (ed; ed < ek.length; ed += 3) {
                                    ek[ed] = ek[ed].toString().split(",");
                                    ek[ed + 1] = ek[ed + 1].toString().split(",");
                                    ek[ed + 2] = ek[ed + 2].toString().split(",");
                                    ek[ed][1] = parseFloat(ek[ed][1]) + ec;
                                    ek[ed + 1][1] = parseFloat(ek[ed + 1][1]) + ec;
                                    ek[ed + 2][1] = parseFloat(ek[ed + 2][1]) + ec;
                                    ek[ed] = ek[ed].join(",");
                                    ek[ed + 1] = ek[ed + 1].join(",");
                                    ek[ed + 2] = ek[ed + 2].join(",")
                                }
                                bb.setAttr(dX[eg].el, "points", ek.join(" "))
                            }
                        }
                    }
                })
            }
        }
    }

    function aP(dn) {
        var dp = cl(dn, 1);
        d({
            text_edit: false,
            buttons: false,
            paper: {
                cells: {ids: bZ(dp, true), type: {width: false, height: false, x: false, data_order: false}},
                util: false,
                foot: {type: {width: false, height: false, x: false, data_order: false}}
            },
            lines: true,
            container: true,
            logo: false,
            bg: false
        })
    }

    function cp() {
        return !!ao
    }

    function ba() {
        var dq = a6();
        if (!dq || !dq.group) {
            return false
        }
        ao = true;
        dj.backup = F(true);
        bV.publish("sitemap/batch_edit_open", [dq.group.id, "batch_edit"]);
        dj.selected_cells = {};
        dj.selected_cells_count = 0;
        dj.selected_cells_data = {};
        dj.changes = {};
        dj.data_backups = {};
        dj.single_edit = false;
        var dn = bb.getElementsByClassName(dq.group, "cell");
        for (var dp = dn.length - 1; dp >= 0; --dp) {
            bb.use("svg-cell-disabled-mask", {"class": "cellmask disabled"}, dn[dp])
        }
        Z.disable_hover = true;
        dc.set("auto_save", false)
    }

    function ar(dr) {
        var dq = a6();
        if (!dq || !dq.group) {
            return false
        }
        ao = false;
        dj.selected_cells = {};
        dj.selected_cells_count = 0;
        dj.selected_cells_data = {};
        dj.changes = {};
        dj.data_backups = {};
        dj.single_edit = false;
        bV.publish("sitemap/batch_edit_close", [dq.group.id, "batch_edit"]);
        var dn = bb.getElementsByClassName(dq.group, "cellmask");
        for (var dp = dn.length - 1; dp >= 0; --dp) {
            bb.removeClass(dn[dp].parentNode, "highlighted");
            bb.removeElement(dn[dp])
        }
        Z.disable_hover = false;
        dc.set("auto_save", dj.autosave);
        if (dr) {
            bV.publish("sitemap/sitemap_modified", ["batch_edit", dq.group.id])
        } else {
            if (dj.backup) {
                bo(dq.group.id, dj.backup)
            }
        }
        dj.backup = null
    }

    function b0(ds) {
        dj.single_edit = ds;
        var dq = j(ds);
        if (dq && dq.cells) {
            for (var dr = 0, dp = dq.cells.length; dr < dp; ++dr) {
                var dn = bb.getElement(dq.cells[dr]);
                if (dn && dn.id) {
                    dj.selected_cells[dn.id] = dn;
                    P(dn)
                }
                ++dj.selected_cells_count
            }
        }
    }

    function cc() {
        return !!dj.single_edit
    }

    function cy(dp) {
        if (dj.single_edit) {
            if (typeof dp === "function") {
                var dn = j(dj.single_edit);
                dp(dn)
            }
            c3("#batch-groups-scroll .group.group-" + dj.single_edit + " .fa-check").trigger("click", [true]);
            dj.selected_cells = {};
            dj.selected_cells_count = 0;
            dj.selected_cells_data = {};
            dj.changes = {};
            dj.data_backups = {};
            dj.single_edit = false
        }
    }

    function u(dn, dr, ds) {
        dn = bb.getElement(dn);
        if (dn) {
            var dp = dn.querySelector(".cellmask");
            if (dp) {
                if (!ds && dj.selected_cells_data[dn.id]) {
                    bb.removeData(dn);
                    bb.forEach(dj.selected_cells_data[dn.id], function (dt, du) {
                        bb.setData(dn, dt, du)
                    })
                }
                var dq = (dr === "enable" || bb.hasClass(dp, "disabled"));
                if (dq) {
                    bb.removeClass(dp, "disabled");
                    bb.setAttr(dp, "href", "#svg-cell-enabled-mask", bh, "xlink");
                    bb.addClass(dn, "highlighted");
                    if (!ds) {
                        dj.selected_cells[dn.id] = dn;
                        ++dj.selected_cells_count;
                        P(dn);
                        bb.forEach(dj.changes, function (dt, du) {
                            bb.setData(dn, dt, du)
                        }, true)
                    }
                } else {
                    bb.addClass(dp, "disabled");
                    bb.setAttr(dp, "href", "#svg-cell-disabled-mask", bh, "xlink");
                    bb.removeClass(dn, "highlighted");
                    if (!ds) {
                        if (dj.selected_cells_data[dn.id]) {
                            delete dj.selected_cells_data[dn.id]
                        }
                        if (dj.selected_cells[dn.id]) {
                            delete dj.selected_cells[dn.id];
                            --dj.selected_cells_count
                        }
                    }
                }
                if (!ds) {
                    bb.forEach(dj.changes, function (dt, du) {
                        if (du !== bh) {
                            d();
                            return false
                        }
                    }, true)
                }
            }
        }
    }

    function P(dn) {
        dn = bb.getElement(dn);
        if (dn) {
            dj.selected_cells_data[dn.id] = cZ(dn)
        }
    }

    function X(dq, dn) {
        var dp = false;
        dj.changes[Z.data_archetype] = dq;
        bb.forEach(dj.selected_cells, function (ds, dr) {
            af(dr, dq, true);
            dp = true
        }, true);
        if (!dn && dp) {
            d({text_edit: false, buttons: false, paper: true, lines: true, container: true, logo: false, bg: false})
        }
        return dp
    }

    function a0(dn) {
        var dp = false;
        delete dj.changes[Z.data_archetype];
        bb.forEach(dj.selected_cells, function (dr, dq) {
            ae(dq, true);
            dp = true
        }, true);
        if (!dn && dp) {
            d({text_edit: false, buttons: false, paper: true, lines: true, container: true, logo: false, bg: false})
        }
        return dp
    }

    function aw(dq, dn) {
        var dp = false;
        dj.changes[Z.data_text] = dq;
        bb.forEach(dj.selected_cells, function (ds, dr) {
            bb.setData(dr, Z.data_text, dq);
            dp = true
        }, true);
        if (!dn && dp) {
            d({text_edit: false, buttons: false, paper: true, lines: true, container: true, logo: false, bg: false})
        }
        return dp
    }

    function bX(dp, dn) {
        var dq = false;
        if (dp === "transparent") {
            dp = bh
        } else {
            if (dp) {
                dp = ay.toHex(dp)
            }
        }
        dj.changes[Z.data_color] = dp;
        bb.forEach(dj.selected_cells, function (ds, dr) {
            ai(dr, dp, true);
            dq = true
        }, true);
        return dq
    }

    function bL(dn) {
        var dp = false;
        delete dj.changes[Z.data_color];
        bb.forEach(dj.selected_cells, function (dr, dq) {
            if (dj.selected_cells_data && dj.selected_cells_data[dr] && dj.selected_cells_data[dr][Z.data_color]) {
                ai(dq, dj.selected_cells_data[dr][Z.data_color], true)
            } else {
                z(dq, Z.data_color, true)
            }
            dp = true
        }, true);
        return dp
    }

    function cM(dp, dn) {
        var dq = false;
        if (dp === "transparent") {
            dp = bh
        } else {
            dp = ay.toHex(dp)
        }
        dj.changes[Z.data_text_color] = dp;
        bb.forEach(dj.selected_cells, function (ds, dr) {
            b5(dr, dp, true);
            dq = true
        }, true);
        return dq
    }

    function bl(dn) {
        var dp = false;
        delete dj.changes[Z.data_text_color];
        bb.forEach(dj.selected_cells, function (dr, dq) {
            if (dj.selected_cells_data && dj.selected_cells_data[dr] && dj.selected_cells_data[dr][Z.data_text_color]) {
                b5(dq, dj.selected_cells_data[dr][Z.data_text_color], true)
            } else {
                z(dq, Z.data_text_color, true)
            }
            dp = true
        }, true);
        return dp
    }

    function cq(dp, dn) {
        var dq = false;
        dj.changes[Z.data_url] = dp;
        bb.forEach(dj.selected_cells, function (ds, dr) {
            au(dr, dp, true);
            dq = true
        }, true);
        if (!dn && dq) {
            d({text_edit: false, buttons: false, paper: true, lines: true, container: true, logo: false, bg: false})
        }
        return dq
    }

    function aq(dn) {
        var dp = false;
        delete dj.changes[Z.data_url];
        bb.forEach(dj.selected_cells, function (dr, dq) {
            bA(dq, true);
            dp = true
        }, true);
        if (!dn && dp) {
            d({text_edit: false, buttons: false, paper: true, lines: true, container: true, logo: false, bg: false})
        }
        return dp
    }

    function aa(dq, dn) {
        var dp = false;
        dj.changes[Z.data_desc] = dq;
        bb.forEach(dj.selected_cells, function (ds, dr) {
            ck(dr, dq, true);
            dp = true
        }, true);
        if (!dn && dp) {
            d({text_edit: false, buttons: false, paper: true, lines: true, container: true, logo: false, bg: false})
        }
        return dp
    }

    function ci(dn) {
        var dp = false;
        delete dj.changes[Z.data_desc];
        bb.forEach(dj.selected_cells, function (dr, dq) {
            E(dq, true);
            dp = true
        }, true);
        if (!dn && dp) {
            d({text_edit: false, buttons: false, paper: true, lines: true, container: true, logo: false, bg: false})
        }
        return dp
    }

    function ap(dn) {
        var dp = false;
        bb.forEach(dj.selected_cells, function (dr, dq) {
            cz(dq, true, true);
            dp = true
        }, true);
        dj.selected_cells = {};
        dj.selected_cells_count = 0;
        if (!dn && dp) {
            d({text_edit: false, buttons: true, paper: true, lines: true, container: true, logo: false, bg: false})
        }
        return dp
    }

    function bJ(dn) {
        if (dn) {
            dj.data_backups[dn] = {};
            bb.forEach(dj.selected_cells, function (dq, dp) {
                var dr = bb.getData(dp, dn);
                if (dr === bh || dr === false || dr === null || dr === "") {
                    dr = false
                }
                dj.data_backups[dn][dq] = dr
            }, true)
        }
    }

    function aZ(dn) {
        if (dn && dj.data_backups[dn]) {
            var dp = false;
            bb.forEach(dj.selected_cells, function (dr, dq) {
                if (dj.data_backups[dn][dr] === false) {
                    bb.removeData(dq, dn);
                    dp = true
                } else {
                    if (dj.data_backups[dn][dr] || dj.data_backups[dn][dr] === 0 || dj.data_backups[dn][dr] === "0") {
                        bb.setData(dq, dn, dj.data_backups[dn][dr]);
                        dp = true
                    }
                }
            }, true);
            if (dp) {
                d()
            }
            return dp
        }
    }

    function n() {
        return c3.extend({}, dj)
    }

    function bM(dn, dp) {
        if (!dp) {
            dj.selected_cells = {};
            dj.selected_cells_count = 0
        }
        if (!dn) {
            dn = {}
        }
        dj.changes = c3.extend({}, dn)
    }

    function ch(dn) {
        cA = dn
    }

    function aW(dq, dn) {
        if (dj.selected_cells_count) {
            var dp = bb.generateUniqueId(true, null, 8);
            cA[dp] = {name: dq, cells: [], data: cH.isObject(dn) ? c3.extend({}, dn) : {}};
            bb.forEach(dj.selected_cells, function (ds, dr) {
                cA[dp]["cells"].push(ds)
            }, true);
            bV.publish("sitemap/cells_group_add", [dp, cA]);
            return dp
        }
        return false
    }

    function bv(dn, dq, ds, dp) {
        if (cA[dn]) {
            if (dq) {
                cA[dn]["name"] = dq
            }
            if (ds) {
                cA[dn]["data"] = c3.extend({}, ds)
            }
            if (dp) {
                var dw = [];
                var du = a6();
                if (du.group && cA[dn]["cells"]) {
                    for (var dt = 0, dr = cA[dn]["cells"].length; dt < dr; ++dt) {
                        if (!du.group.querySelector("#" + cA[dn]["cells"][dt])) {
                            dw.push(cA[dn]["cells"][dt]);
                            var dv = cJ.getElementById(cA[dn]["cells"][dt]);
                            if (dv) {
                                bb.forEach(cA[dn]["data"], function (dx, dy) {
                                    bb.setData(dv, dx, dy)
                                })
                            } else {
                                bb.forEach(bN, function (dy, dz) {
                                    if (dz.cells) {
                                        var dx = false;
                                        bb.forEach(dz.cells, function (dB, dA) {
                                            if (dA && dA.id && dA.id === cA[dn]["cells"][dt]) {
                                                bN[dy]["cells"][dB] = c3.extend({}, dA, cA[dn]["data"]);
                                                dx = true;
                                                return false
                                            }
                                        });
                                        if (dx) {
                                            return false
                                        }
                                    }
                                }, true)
                            }
                        }
                    }
                }
                if (dj.selected_cells_count > 0) {
                    bb.forEach(dj.selected_cells, function (dy, dx) {
                        dw.push(dy)
                    }, true)
                }
                cA[dn]["cells"] = dw
            }
            bV.publish("sitemap/cells_group_update", [dn, cA]);
            return dn
        }
        return false
    }

    function bE(dn) {
        var dp = (dn && dn.id) ? dn.id : dn;
        var dq = false;
        bb.forEach(cA, function (du, dv) {
            if (dv && dv.cells && dv.cells.length) {
                var dr = [];
                for (var dt = 0, ds = dv.cells.length; dt < ds; ++dt) {
                    if (dv.cells[dt] === dp) {
                        dq = du;
                        continue
                    }
                    dr.push(dv.cells[dt])
                }
                if (dq) {
                    cA[du]["cells"] = dr;
                    return false
                }
            }
        }, true);
        if (dq) {
            bV.publish("sitemap/cells_group_update", [dq, cA])
        }
        return !!dq
    }

    function bc(dn) {
        if (cA[dn]) {
            delete cA[dn];
            bV.publish("sitemap/cells_group_remove", [dn, cA]);
            return dn
        }
        return false
    }

    function ax(dn) {
        return dn ? c3.extend({}, cA) : JSON.stringify(cA)
    }

    function G(dp) {
        var dn = [];
        if (dp) {
            if (cA[dp] && cA[dp]["cells"]) {
                return cA[dp]["cells"]
            }
        } else {
            bb.forEach(cA, function (dq, dr) {
                if (dr && dr.cells && dr.cells.length) {
                    dn = dn.concat(dr.cells)
                }
            }, true)
        }
        return dn
    }

    function j(dn) {
        if (cA[dn]) {
            return c3.extend({}, cA[dn])
        }
        return false
    }

    function D(dn) {
        var dp = (dn && dn.id) ? dn.id : dn;
        var dq = false;
        bb.forEach(cA, function (dr, ds) {
            if (ds && ds.cells && ds.cells.length && c3.inArray(dp, ds.cells) >= 0) {
                dq = dr;
                return false
            }
        }, true);
        return dq
    }

    function h(du, dw) {
        var dn = bC();
        if (dn && L[dn]) {
            var dy = bb.getCursorPoint(du, Z.scale, bn.offset());
            dy.x = Math.round(dy.x);
            dy.y = Math.round(dy.y);
            if (!dk()) {
                dy.y -= Z.section_toolbar_height
            }
            for (var dx in L[dn]) {
                if (dx !== bh && L[dn].hasOwnProperty(dx) && L[dn][dx]) {
                    if (dy.x >= L[dn][dx].x1 && dy.x <= L[dn][dx].x2 && dy.y >= L[dn][dx].y1 && dy.y <= L[dn][dx].y2 && cJ.getElementById(dx) && !bb.hasClass(dx, "dragging") && !bb.hasClass(dx, "blocked") && !bb.hasClass(dx, "hidden") && !bb.hasClass(dx, "hidden-but-refresh")) {
                        return bb.getElement(dx)
                    }
                }
            }
            if (dw) {
                for (var dt in cR[dn]) {
                    if (dt !== bh && cR[dn].hasOwnProperty(dt) && cR[dn][dt]) {
                        if (dy.x >= cR[dn][dt].x1 && dy.x <= cR[dn][dt].x2 && dy.y >= cR[dn][dt].y1 && dy.y <= cR[dn][dt].y2 && cJ.getElementById(dt)) {
                            return bb.getElement(dt)
                        }
                    }
                }
                var dv = cJ.getElementById("cell-placeholder");
                if (dv) {
                    var dr = bb.getFloat(dv, "x");
                    var dp = bb.getFloat(dv, "y");
                    var dq = bb.getFloat(dv, "width");
                    var ds = bb.getFloat(dv, "height");
                    if (dy.x >= dr && dy.x <= dr + dq && dy.y >= dp && dy.y <= dp + ds) {
                        return dv
                    }
                }
            }
        }
        return false
    }

    function aX(dr, ds) {
        var dn = (dr && dr.id) ? dr.id : dr;
        if (dn) {
            var dp = bC();
            if (bb.hasClass(dn, "cell")) {
                if (dn && dp) {
                    if (L[dp] === bh) {
                        L[dp] = {}
                    }
                    if (L[dp][dn] === bh) {
                        L[dp][dn] = {}
                    }
                    for (var dq in ds) {
                        if (dq !== bh && ds.hasOwnProperty(dq)) {
                            ds[dq] = parseFloat(ds[dq]);
                            if (isNaN(ds[dq])) {
                                ds[dq] = 0
                            }
                            if (dq === "x" && L[dp][dn]["width"]) {
                                L[dp][dn]["x1"] = ds[dq];
                                L[dp][dn]["x2"] = ds[dq] + L[dp][dn]["width"]
                            } else {
                                if (dq === "y" && L[dp][dn]["height"]) {
                                    L[dp][dn]["y1"] = ds[dq];
                                    L[dp][dn]["y2"] = ds[dq] + L[dp][dn]["height"]
                                }
                            }
                            L[dp][dn][dq] = ds[dq]
                        }
                    }
                }
            } else {
                if (dn && dp) {
                    if (cR[dp] === bh) {
                        cR[dp] = {}
                    }
                    if (cR[dp][dn] === bh) {
                        cR[dp][dn] = {}
                    }
                    for (var dq in ds) {
                        if (dq !== bh && ds.hasOwnProperty(dq)) {
                            ds[dq] = parseFloat(ds[dq]);
                            if (isNaN(ds[dq])) {
                                ds[dq] = 0
                            }
                            if (dq === "x" && cR[dp][dn]["width"]) {
                                cR[dp][dn]["x1"] = ds[dq];
                                cR[dp][dn]["x2"] = ds[dq] + cR[dp][dn]["width"]
                            } else {
                                if (dq === "y" && cR[dp][dn]["height"]) {
                                    cR[dp][dn]["y1"] = ds[dq];
                                    cR[dp][dn]["y2"] = ds[dq] + cR[dp][dn]["height"]
                                }
                            }
                            cR[dp][dn][dq] = ds[dq]
                        }
                    }
                }
            }
        }
    }

    function aU(dr) {
        var dn = (dr && dr.id) ? dr.id : dr;
        if (dn) {
            var dp = bC();
            if (bb.hasClass(dn, "cell")) {
                if (dp && L[dp]) {
                    for (var dq in L[dp]) {
                        if (dq !== bh && L[dp].hasOwnProperty(dq)) {
                            if (dq === dn) {
                                L[dp][dq] = bh;
                                delete L[dp][dq];
                                return
                            }
                        }
                    }
                }
            } else {
                if (dp && cR[dp]) {
                    for (var dq in cR[dp]) {
                        if (dq !== bh && cR[dp].hasOwnProperty(dq)) {
                            if (dq === dn) {
                                cR[dp][dq] = bh;
                                delete cR[dp][dq];
                                return
                            }
                        }
                    }
                }
            }
        }
    }

    function w(dn) {
        var dr = [];
        var ds = cg.svg.childNodes;
        if (ds) {
            for (var dq = 0, dp = ds.length; dq < dp; ++dq) {
                if (ds[dq] && cD(ds[dq], "g")) {
                    if (dn && dk(ds[dq].id)) {
                        continue
                    }
                    dr.push(ds[dq].id)
                }
            }
        }
        return dr
    }

    return {
        getOption: df,
        getOptions: cs,
        setOption: cO,
        setOptions: dd,
        getSectionOptions: aO,
        createSection: a9,
        getSectionIfExists: a6,
        getCurrentSection: bC,
        setCurrentSection: b9,
        isMainSection: dk,
        isSectionVisible: az,
        insertAddPageButtons: a2,
        insertCell: cb,
        updateCell: cB,
        updateCellColor: bG,
        updateCellTextColor: cK,
        updateCellColors: c4,
        updateCellTextColors: aC,
        insertNewCell: function (dn, dq) {
            dn = dn || {};
            var dp = cb(dn, dq);
            bk = dp;
            if (dp) {
                bx(dp, true);
                if (!dn || !dn.text || dn.text === bh) {
                    cu(dp)
                }
            }
            return dp
        },
        removeCell: cz,
        refreshSitemap: cC,
        updateConnections: bU,
        scrollToView: cx,
        showTextEdit: cu,
        finishTextEdit: ah,
        autosizeTextEdit: bI,
        getOffsets: c2,
        calculateCellHoverHelpers: T,
        showAddHelperPlaceholder: bz,
        hideAddHelperPlaceholder: at,
        clearAddHelperTimer: R,
        zoomIn: function () {
            return cT(Z.scale + 0.1, true)
        },
        zoomOut: function () {
            return cT(Z.scale - 0.1, true)
        },
        zoomReset: function () {
            return cT(1, true)
        },
        setCellLevel: aJ,
        cloneCell: bu,
        cloneCellAsSection: bj,
        serialize: F,
        getSerialized: m,
        serializeCells: s,
        getPapers: function () {
            return cg
        },
        getJSON: function () {
            return c3.extend({}, bN)
        },
        loadJSON: de,
        loadSection: aL,
        loadSectionFromJSON: bo,
        loadFromWebsocket: function (dp, dn) {
            B(dn);
            bo(dn, dp, true)
        },
        clearSection: B,
        openSection: k,
        closeSection: i,
        getListOfSections: a8,
        cleanLoad: cn,
        clear: aF,
        clearCache: da,
        setTempScheme: c0,
        getCurrentColorScheme: bs,
        backupColors: f,
        revertColors: bK,
        getStyle: cf,
        changeStyle: U,
        setTextShadow: bi,
        getTextShadow: cN,
        changeTemplate: N,
        templateExists: c8,
        getTemplate: al,
        highlightLevel: dh,
        dndStart: c5,
        dndStop: cE,
        dndMove: bg,
        getAllParents: bT,
        getCurrentCell: ce,
        setCurrentCell: cX,
        resetCurrentCell: be,
        getCellLevel: bW,
        addCellData: cd,
        removeCellData: z,
        addCellNote: ck,
        removeCellNote: E,
        addCellNoteWidth: aY,
        removeCellNoteWidth: aV,
        addCellUrl: au,
        removeCellUrl: bA,
        addCellArchetype: af,
        removeCellArchetype: ae,
        addCellSection: ak,
        removeCellSection: aS,
        addSectionJSON: cr,
        removeSection: bd,
        removeSectionDOM: bB,
        removeSectionsDOM: aM,
        removeDataChild: b6,
        addDataChild: dl,
        changeCellColor: ai,
        changeCellTextColor: b5,
        fullRefresh: d,
        refreshContainerSize: a3,
        maybePartialRefresh: bx,
        getColorSchemeItem: S,
        updateLinesColor: p,
        updateTextColor: c6,
        isEditBlocked: aR,
        blockEdit: c9,
        unblockEdit: v,
        getUsersCount: a,
        getUsers: by,
        addUser: aB,
        removeUser: t,
        toggleChildren: bO,
        updateArchetypeDef: M,
        removeArchetypeDef: aI,
        checkTag: cD,
        batchEditStart: ba,
        batchEditStop: ar,
        isBatchEdit: cp,
        toggleCellMaskHighlight: u,
        batchAddCellArchetype: X,
        batchRemoveCellArchetype: a0,
        batchTextEdit: aw,
        batchChangeCellColor: bX,
        batchRemoveCellColor: bL,
        batchChangeCellTextColor: cM,
        batchRemoveCellTextColor: bl,
        batchAddCellUrl: cq,
        batchRemoveCellUrl: aq,
        batchAddCellNote: aa,
        batchRemoveCellNote: ci,
        batchRemoveCell: ap,
        batchSaveAllCellDatas: P,
        batchBackupCellDatas: bJ,
        batchRestoreCellDatas: aZ,
        getBatchData: n,
        resetBatchData: bM,
        loadCellsGroupsJSON: ch,
        addCellsGroup: aW,
        updateCellsGroup: bv,
        removeCellFromGroup: bE,
        cellEditGroupStart: b0,
        cellEditGroupIsSingle: cc,
        cellEditGroupStop: cy,
        removeCellsGroup: bc,
        getSerializedCellsGroups: ax,
        getCellGroupCells: G,
        getCellsGroupData: j,
        isCellInCellsGroup: D,
        getCellSection: bw,
        getCellByCoords: h,
        showChat: b8,
        hideChat: bm,
        closeChat: I,
        addMessageToChat: cW,
        addUserToChat: ac,
        removeUserFromChat: a7,
        getDomSectionsIds: w,
        modified: false,
        crawler: false,
        has_unsaved_changes: false,
        last_mouse_event: null
    }
});
Slickplan.define("string", function (e, c, a) {
    var n = [{
        base: "A",
        letters: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
    }, {base: "AA", letters: /[\uA732]/g}, {base: "AE", letters: /[\u00C6\u01FC\u01E2]/g}, {
        base: "AO",
        letters: /[\uA734]/g
    }, {base: "AU", letters: /[\uA736]/g}, {base: "AV", letters: /[\uA738\uA73A]/g}, {
        base: "AY",
        letters: /[\uA73C]/g
    }, {base: "B", letters: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g}, {
        base: "C",
        letters: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g
    }, {
        base: "D",
        letters: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
    }, {base: "DZ", letters: /[\u01F1\u01C4]/g}, {base: "Dz", letters: /[\u01F2\u01C5]/g}, {
        base: "E",
        letters: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
    }, {base: "F", letters: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g}, {
        base: "G",
        letters: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
    }, {
        base: "H",
        letters: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
    }, {
        base: "I",
        letters: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
    }, {base: "J", letters: /[\u004A\u24BF\uFF2A\u0134\u0248]/g}, {
        base: "K",
        letters: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
    }, {
        base: "L",
        letters: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
    }, {base: "LJ", letters: /[\u01C7]/g}, {base: "Lj", letters: /[\u01C8]/g}, {
        base: "M",
        letters: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g
    }, {
        base: "N",
        letters: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
    }, {base: "NJ", letters: /[\u01CA]/g}, {base: "Nj", letters: /[\u01CB]/g}, {
        base: "O",
        letters: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
    }, {base: "OI", letters: /[\u01A2]/g}, {base: "OO", letters: /[\uA74E]/g}, {
        base: "OU",
        letters: /[\u0222]/g
    }, {base: "P", letters: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g}, {
        base: "Q",
        letters: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g
    }, {
        base: "R",
        letters: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
    }, {
        base: "S",
        letters: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
    }, {
        base: "T",
        letters: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
    }, {base: "TZ", letters: /[\uA728]/g}, {
        base: "U",
        letters: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
    }, {base: "V", letters: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g}, {
        base: "VY",
        letters: /[\uA760]/g
    }, {base: "W", letters: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g}, {
        base: "X",
        letters: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g
    }, {
        base: "Y",
        letters: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
    }, {
        base: "Z",
        letters: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
    }, {
        base: "a",
        letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
    }, {base: "aa", letters: /[\uA733]/g}, {base: "ae", letters: /[\u00E6\u01FD\u01E3]/g}, {
        base: "ao",
        letters: /[\uA735]/g
    }, {base: "au", letters: /[\uA737]/g}, {base: "av", letters: /[\uA739\uA73B]/g}, {
        base: "ay",
        letters: /[\uA73D]/g
    }, {base: "b", letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g}, {
        base: "c",
        letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
    }, {
        base: "d",
        letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
    }, {base: "dz", letters: /[\u01F3\u01C6]/g}, {
        base: "e",
        letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
    }, {base: "f", letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g}, {
        base: "g",
        letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
    }, {
        base: "h",
        letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
    }, {base: "hv", letters: /[\u0195]/g}, {
        base: "i",
        letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
    }, {base: "j", letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g}, {
        base: "k",
        letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
    }, {
        base: "l",
        letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
    }, {base: "lj", letters: /[\u01C9]/g}, {
        base: "m",
        letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g
    }, {
        base: "n",
        letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
    }, {base: "nj", letters: /[\u01CC]/g}, {
        base: "o",
        letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
    }, {base: "oi", letters: /[\u01A3]/g}, {base: "ou", letters: /[\u0223]/g}, {
        base: "oo",
        letters: /[\uA74F]/g
    }, {base: "p", letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g}, {
        base: "q",
        letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g
    }, {
        base: "r",
        letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
    }, {
        base: "s",
        letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
    }, {
        base: "t",
        letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
    }, {base: "tz", letters: /[\uA729]/g}, {
        base: "u",
        letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
    }, {base: "v", letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g}, {
        base: "vy",
        letters: /[\uA761]/g
    }, {base: "w", letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g}, {
        base: "x",
        letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g
    }, {
        base: "y",
        letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
    }, {base: "z", letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}];
    var m = false;

    function b(p) {
        if (!p) {
            return ""
        }
        return p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
    }

    function o(p) {
        if (!p) {
            return ""
        }
        return p.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    }

    function k(r) {
        r = r || 8;
        var s = "";
        var p = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var q = 0; q < r; ++q) {
            s += p.charAt(Math.floor(Math.random() * (q > 0 ? 36 : 26)))
        }
        return s
    }

    function j(r) {
        var w = r.innerHTML.split(" ");
        r.innerHTML = "<span>" + w.join("</span> <span>") + "</span>";
        var v = [];
        var t = r.querySelectorAll("span");
        var x = w[0];
        var u;
        var q = t[0].offsetTop;
        for (var s = 1, p = t.length; s < p; ++s) {
            u = t[s].offsetTop;
            if (u > q) {
                q = u;
                v.push(o(x));
                x = w[s]
            } else {
                x += " " + w[s]
            }
        }
        v.push(o(x));
        return v
    }

    function d(q) {
        if (typeof q !== "string") {
            q = "" + q
        }
        for (var p = 0; p < n.length; p++) {
            q = q.replace(n[p].letters, n[p].base)
        }
        return q.toLowerCase().replace(/[^a-z0-9]/g, "")
    }

    function i(s) {
        var q = 0, p, r;
        if (s.length == 0) {
            return q
        }
        for (p = 0, l = s.length; p < l; p++) {
            r = s.charCodeAt(p);
            q = ((q << 5) - q) + r;
            q |= 0
        }
        return q
    }

    function h(p) {
        p = p.replace(/^fa\-/, "");
        if (!m) {
            m = c.require("config").get("fontawesome")
        }
        return (m && typeof m[p] === "string") ? m[p] : ""
    }

    function g(p, r, q) {
        p = p.toString();
        if (p.length > r) {
            return p.substring(0, r) + q
        }
        return p
    }

    var f = function (q) {
        if (q <= 0) {
            return 0
        }
        var p = Math.floor(Math.log(q) / Math.log(1024));
        return (q / Math.pow(1024, p)).toFixed(2) * 1 + " " + ["B", "KB", "MB", "GB", "TB"][p]
    };
    return {
        charsEncode: b,
        charsDecode: o,
        getLinesArray: j,
        random: k,
        sanitize: d,
        hashCode: i,
        getFontAwesomeUnicode: h,
        limitLength: g,
        humanReadableFileSize: f
    }
});
Slickplan.define("svg", function (G, D, o) {
    var X = D.require("helper");
    var t = {
        svg: "http://www.w3.org/2000/svg",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace"
    };
    var U = {};
    var h = {};
    var K = true;
    var w = {};
    var H = {};
    var N = {};
    var A = D.require("config").get("debug");
    var g = window.document;

    function Z(ab) {
        return (U[ab] !== o) ? U[ab] : o
    }

    function v() {
        return U
    }

    function e(ab, ac) {
        if (X.isObject(ab, true)) {
            R(ab)
        } else {
            U[ab] = ac
        }
    }

    function R(ab) {
        y(ab, function (ac, ad) {
            U[ac] = ad
        })
    }

    function x(ai, ad, ah, ac, ab, af) {
        var ae = g.createElementNS(t.svg, ai);
        ad = ad || {};
        var ag = ai.toLowerCase();
        if (af !== true) {
            switch (ag) {
                case"svg":
                    if (ad.x === o) {
                        ad.x = 0
                    }
                    if (ad.y === o) {
                        ad.y = 0
                    }
                    if (ad.version === o) {
                        ad.version = "1.1"
                    }
                    if (ad.id === o) {
                        ad.id = k()
                    }
                    break;
                case"text":
                    if (ad.font_size === o && ad["font-size"] === o) {
                        ad["font-size"] = 12
                    }
                    if (ad.font_family === o && ad["font-family"] === o) {
                        ad["font-family"] = "Arial, Helvetica, sans-serif"
                    }
                    if (ad.font_weight === o && ad["font-weight"] === o) {
                        ad["font-weight"] = "bold"
                    }
                    if (ad.text_anchor === o && ad["text-anchor"] === o) {
                        ad["text-anchor"] = "middle"
                    }
                    break;
                case"lineargradient":
                    if (ad.x1 === o) {
                        ad.x1 = 0
                    }
                    if (ad.y1 === o) {
                        ad.y1 = 0
                    }
                    if (ad.x2 === o) {
                        ad.x2 = 0
                    }
                    if (ad.y2 === o) {
                        ad.y2 = "100%"
                    }
                    break;
                case"rect":
                    if (ad.x === o) {
                        ad.x = 0
                    }
                    if (ad.y === o) {
                        ad.y = 0
                    }
                    break;
                case"polyline":
                    if (ad["stroke-linecap"] === o) {
                        ad["stroke-linecap"] = "butt"
                    }
                    if (ad["stroke-linejoin"] === o) {
                        ad["stroke-linejoin"] = "miter"
                    }
                    break
            }
        }
        if (ad.id === o) {
            ad.id = k("svg" + ag)
        }
        if (K) {
            H[ad.id] = ae
        }
        r(ae, ad, null, ab);
        if (ag === "text" && ad.space !== o) {
            ae.setAttributeNS(t.xml, "space", ad.space)
        }
        if (ah) {
            if (ac) {
                ah.insertBefore(ae, ah.firstChild)
            } else {
                ah.appendChild(ae)
            }
        }
        return ae
    }

    function q(ac, ad, af, ab) {
        var ae = x("image", ad, af, ab);
        ae.setAttributeNS(t.xlink, "href", ac);
        return ae
    }

    function P(ac, ad, af, ab) {
        var ae = x("use", ad, af, ab);
        r(ae, "href", "#" + ac, o, "xlink");
        return ae
    }

    function W(ae, ad) {
        var ac = p(ae, "class");
        if (typeof ac !== "string") {
            ac = ""
        } else {
            ac = G.trim(ac)
        }
        if (ac) {
            ac = ac.split(" ");
            for (var ab = 0; ab < ac.length; ++ab) {
                if (ac[ab] == ad) {
                    ad = "";
                    break
                }
            }
            ac.push(ad);
            ac = ac.join(" ")
        } else {
            ac = ad
        }
        r(ae, "class", ac)
    }

    function B(ae, ab) {
        var ad = p(ae, "class");
        if (!ad) {
            return
        }
        if (typeof ad !== "string") {
            ad = ""
        } else {
            ad = G.trim(ad)
        }
        ad = ad.toLowerCase().split(" ");
        var af = [];
        if (!(ab instanceof RegExp)) {
            ab = G.trim(ab.toLowerCase())
        }
        for (var ac = 0; ac < ad.length; ++ac) {
            ad[ac] = G.trim(ad[ac]);
            if (ab instanceof RegExp) {
                if (!ab.test(ad[ac])) {
                    af.push(ad[ac])
                }
            } else {
                if (ad[ac] !== ab) {
                    af.push(ad[ac])
                }
            }
        }
        r(ae, "class", af.join(" "))
    }

    function m(ac, ad) {
        var ab = (" " + p(ac, "class") + " ").toLowerCase();
        return (ab && ab.indexOf(" " + G.trim(ad.toLowerCase()) + " ") >= 0)
    }

    function s(ae, ak, ai, ad, ah, ab, ap, an) {
        if (ab === "matrix") {
            var aj = S(ae)
        }
        if (G.isArray(ak) && ak.length === 2) {
            var am = ak[0];
            ak = ak[1]
        } else {
            if (ab === "matrix") {
                var am = aj[4]
            } else {
                var am = d(ae, "x")
            }
        }
        if (G.isArray(ai) && ai.length === 2) {
            var al = ai[0];
            ai = ai[1]
        } else {
            if (ab === "matrix") {
                var al = aj[5]
            } else {
                var al = d(ae, "y")
            }
        }
        var af = (new Date()).getTime();
        var aq = ak - am;
        var ao = ai - al;
        var ag = 0;
        ad = ad || 100;
        ah = (ah === o) ? "swing" : ah;
        var ac = setInterval(function () {
            var ar = (new Date()).getTime() - af;
            if (ar < ad) {
                ag = ar / ad;
                if (ah) {
                    ag = G.easing[ah](ag, ad * ag, 0, 1, ad)
                }
                if (ab === "matrix") {
                    aj[4] = am + ag * aq;
                    aj[5] = al + ag * ao;
                    aa(ae, aj)
                } else {
                    r(ae, "x", am + ag * aq);
                    r(ae, "y", al + ag * ao)
                }
                if (typeof an === "function") {
                    an(ag, am + ag * aq, al + ag * ao)
                }
            } else {
                if (ab === "matrix") {
                    aj[4] = ak;
                    aj[5] = ai;
                    aa(ae, aj)
                } else {
                    r(ae, "x", ak);
                    r(ae, "y", ai)
                }
                clearInterval(ac);
                if (typeof ap === "function") {
                    ap(ae)
                }
            }
        }, 13)
    }

    function L(ab) {
        ab = parseFloat(ab);
        if (ab === o || ab === null || isNaN(ab)) {
            return 0
        }
        return ab
    }

    function u(ab) {
        ab = parseInt(ab, 10);
        if (ab === o || ab === null || isNaN(ab)) {
            return 0
        }
        return ab
    }

    function S(ad) {
        ad = i(ad);
        if (ad) {
            var ac = p(ad, "transform", true);
            var ab = ac.match(/matrix\(([0-9\.,\s]+)\)/);
            if (ab && ab.length > 1) {
                ab = G.trim(ab[1]).replace(/[^0-9\.]+/g, ",").replace(/[,]{2,}/g, ",").split(",");
                if (ab && ab.length >= 6) {
                    return [L(ab[0]), L(ab[1]), L(ab[2]), L(ab[3]), L(ab[4]), L(ab[5])]
                }
            }
        }
        return [1, 0, 0, 1, 0, 0]
    }

    function aa(ad, ac) {
        ad = i(ad);
        if (ad && ad.ownerSVGElement) {
            var ab = ad.ownerSVGElement.createSVGMatrix();
            if (ab && ab.a) {
                if (!ac || ac.length !== 6) {
                    ac = [1, 0, 0, 1, 0, 0]
                }
                ab.a = L(ac[0]);
                ab.b = L(ac[1]);
                ab.c = L(ac[2]);
                ab.d = L(ac[3]);
                ab.e = L(ac[4]);
                ab.f = L(ac[5]);
                ad.transform.baseVal.initialize(ad.transform.baseVal.createSVGTransformFromMatrix(ab))
            }
        }
    }

    function C(ak, ai, ad, ag, al) {
        var aj = S(ak);
        var am = 0.1;
        var ah = 3;
        if (X.isObject(ai)) {
            if (typeof ai.min === "number") {
                am = ai.min
            }
            if (typeof ai.min === "number") {
                ah = ai.max
            }
            if (typeof ai.diff === "number") {
                ai = aj[0] + ai.diff
            } else {
                if (typeof ai.zoom === "number") {
                    ai = ai.zoom
                }
            }
        } else {
            ai = aj[0] + ai
        }
        var ac = Math.min(ah, Math.max(am, ai));
        var ae = (new Date()).getTime();
        var af = 0;
        ad = ad || 100;
        ag = (ag === o) ? "swing" : ag;
        var ab = setInterval(function () {
            var ao = (new Date()).getTime() - ae;
            if (ao < ad) {
                af = ao / ad;
                if (ag) {
                    af = G.easing[ag](af, ad * af, 0, 1, ad)
                }
                var an = aj;
                an[0] += af * (ac - aj[0]);
                an[3] += af * (ac - aj[0]);
                an[0] = Math.round(an[0] * 100) / 100;
                an[3] = Math.round(an[0] * 100) / 100;
                aa(ak, an)
            } else {
                aj[0] = Math.round(ac * 100) / 100;
                aj[3] = Math.round(ac * 100) / 100;
                aa(ak, aj);
                clearInterval(ab);
                if (typeof al === "function") {
                    al(ac)
                }
            }
        }, 13);
        return ac
    }

    function F(ai, ag, ac, af, ak, aj) {
        var ah = S(ai);
        var ae = 0;
        ac = ac || 100;
        af = (af === o) ? "swing" : af;
        var ad = (new Date()).getTime();
        var ab = setInterval(function () {
            var al = (new Date()).getTime() - ad;
            if (al < ac) {
                ae = al / ac;
                if (af) {
                    ae = G.easing[af](ae, ac * ae, 0, 1, ac)
                }
                ah[3] = 1 - ae;
                ah[5] = ag.top * ae;
                aa(ai, ah);
                r(ai, "opacity", 1 - ae);
                if (typeof aj === "function") {
                    aj(ae)
                }
            } else {
                ah[3] = 0;
                aa(ai, ah);
                clearInterval(ab);
                r(ai, "opacity", 0);
                if (typeof ak === "function") {
                    ak(ai)
                }
            }
        }, 13);
        return ai
    }

    function n(ai, ag, ac, af, ak, aj) {
        var ah = S(ai);
        var ae = 0;
        ac = ac || 100;
        af = (af === o) ? "swing" : af;
        var ad = (new Date()).getTime();
        var ab = setInterval(function () {
            var al = (new Date()).getTime() - ad;
            if (al < ac) {
                ae = al / ac;
                if (af) {
                    ae = G.easing[af](ae, ac * ae, 0, 1, ac)
                }
                ah[3] = ae;
                ah[5] = ag.top * (1 - ae);
                aa(ai, ah);
                r(ai, "opacity", ae);
                if (typeof aj === "function") {
                    aj(ae)
                }
            } else {
                ah[3] = 1;
                ah[5] = 0;
                aa(ai, ah);
                clearInterval(ab);
                r(ai, "opacity", 1);
                if (typeof ak === "function") {
                    ak(ai)
                }
            }
        }, 13);
        return ai
    }

    function d(ad, af, ae) {
        if (K && !ae) {
            var ac = p(ad, "id");
            if (w[ac] === o) {
                w[ac] = {}
            }
            if (w[ac][af] === o) {
                var ab = p(ad, af);
                w[ac][af] = L(0)
            }
            return w[ac][af]
        } else {
            var ab = p(ad, af, ae);
            return L(ab)
        }
    }

    function O(ad, af, ae) {
        if (K && !ae) {
            var ac = p(ad, "id");
            if (w[ac] === o) {
                w[ac] = {}
            }
            if (w[ac][af] === o) {
                var ab = p(ad, af);
                w[ac][af] = u(ab)
            }
            return w[ac][af]
        } else {
            var ab = p(ad, af);
            return u(ab)
        }
    }

    function p(ab, ad, ac) {
        if (ab) {
            if (ad === "id") {
                if (typeof ab === "string") {
                    return ab
                } else {
                    if (ab instanceof G && typeof ab[0].id === "string") {
                        return ab[0].id
                    } else {
                        if (typeof ab === "object" && typeof ab.id === "string") {
                            return ab.id
                        }
                    }
                }
            }
            ab = i(ab);
            if (ab && typeof ab.getAttributeNS === "function") {
                ad = ad.replace("_", "-");
                if (!ac && K) {
                    if (w[ab.id] === o) {
                        w[ab.id] = {}
                    }
                    if (w[ab.id][ad] === o) {
                        w[ab.id][ad] = ab.getAttributeNS(null, ad)
                    }
                    return w[ab.id][ad]
                } else {
                    return ab.getAttributeNS(null, ad)
                }
            }
        }
        return false
    }

    function r(ad, af, ag, ab, ae) {
        if (typeof ad === "object" && ad instanceof G) {
            for (var ac = 0; ac < ad.length; ++ac) {
                M(ad[ac], af, ag, ab, ae)
            }
            return
        }
        ad = i(ad);
        if (ad) {
            if (X.isObject(af, true)) {
                y(af, function (ah, ai) {
                    M(ad, ah, ai, ab, ae)
                }, true)
            } else {
                M(ad, af, ag, ab, ae)
            }
        }
    }

    function M(ac, ae, af, ab, ad) {
        if (K && ac.id && w[ac.id] !== o && w[ac.id][ae] !== o && w[ac.id][ae] === af) {
            return
        }
        if (!ab && typeof af === "number" && (ae === "width" || ae === "height" || ae === "x" || ae === "y" || ae === "r" || (ae.length <= 3 && (ae.charAt(1) === "x" || ae.charAt(1) === "y" || ae.charAt(0) === "x" || ae.charAt(0) === "y")))) {
            af = Math.floor(af);
            ab = "changed"
        }
        if (K && ac.id && w[ac.id] !== o && w[ac.id][ae] !== o && w[ac.id][ae] === af) {
            return
        }
        if (af !== o) {
            if (ab !== "changed") {
                ae = ae.replace("_", "-")
            }
            if (ad && t[ad]) {
                ac.setAttributeNS(t[ad], ae, af)
            } else {
                ac.setAttributeNS(null, ae, af)
            }
            if (K && ac.id) {
                if (w[ac.id] === o) {
                    w[ac.id] = {}
                }
                w[ac.id][ae] = af
            }
        }
    }

    function z(ae, ac) {
        ae = i(ae);
        var ab = ae.getAttributeNS(null, "id");
        if (!X.isObject(ac, true)) {
            ac = [ac]
        }
        for (var ad = 0; ad < ac.length; ++ad) {
            if (typeof ac[ad] === "string") {
                ae.removeAttributeNS(null, ac[ad]);
                if (K && w[ab] !== o && w[ab][ac[ad]] !== o) {
                    w[ab][ac[ad]] = o
                }
            }
        }
    }

    function i(ac, ad) {
        if (!ad && ac && ac.id) {
            return ac
        }
        if (K) {
            if (typeof ac === "string") {
                if (ad) {
                    if (N[ac]) {
                        return N[ac]
                    }
                    if (H[ac]) {
                        N[ac] = G(H[ac]);
                        return N[ac]
                    }
                } else {
                    if (H[ac]) {
                        return H[ac]
                    }
                }
                H[ac] = g.getElementById(ac);
                if (ad) {
                    N[ac] = G(H[ac]);
                    return N[ac]
                }
                return H[ac]
            } else {
                if (ac instanceof G) {
                    var ab = ac[0].id;
                    if (ad) {
                        if (N[ab]) {
                            return N[ab]
                        }
                        N[ab] = ac;
                        if (!H[ab]) {
                            H[ab] = ac[0]
                        }
                    } else {
                        ac = ac[0];
                        if (!H[ab]) {
                            H[ab] = ac
                        }
                    }
                } else {
                    if (ad && ac && ac.tagName) {
                        var ab = ac.id;
                        if (N[ab]) {
                            return N[ab]
                        }
                        ac = G(ac);
                        N[ab] = ac
                    }
                }
            }
        } else {
            if (typeof ac === "string") {
                if (ad) {
                    return G("#" + ac)
                }
                return g.getElementById(ac)
            } else {
                if (ac instanceof G) {
                    if (!ad) {
                        return ac[0]
                    }
                    return ac
                } else {
                    if (ad && ac && ac.tagName) {
                        return G(ac)
                    }
                }
            }
        }
        if (ad) {
            return (ac instanceof G) ? ac : false
        }
        return (ac && ac.tagName) ? ac : false
    }

    function J(ad, ag) {
        ad = i(ad);
        var ae = [];
        if (ad) {
            if (K && ad.id) {
                var af = ad.querySelectorAll("[id]");
                if (af) {
                    for (var ac = 0, ab = af.length; ac < ab; ++ac) {
                        if (af[ac] && af[ac].id) {
                            var ah = af[ac].id;
                            ae.push(ah);
                            w[ah] = o;
                            H[ah] = o;
                            N[ah] = o;
                            if (ag) {
                                b(ah)
                            }
                        }
                    }
                }
                var ah = ad.id;
                ae.push(ah);
                w[ah] = o;
                H[ah] = o;
                N[ah] = o;
                if (ag) {
                    b(ah)
                }
            }
            if (ad.parentNode) {
                ad.parentNode.removeChild(ad)
            }
        }
        return ae
    }

    function k(ac, ad, ab) {
        if (!ac || typeof ac !== "string") {
            ac = (ac === true) ? "" : "svg"
        }
        if (!ad || typeof ad !== "string") {
            ad = ""
        }
        return ac + D.require("string").random((ab || 16)) + ad
    }

    function f(ab, ad, ac) {
        if (typeof ad !== "number") {
            ad = 1
        }
        return {
            x: (ab.clientX + D.$window.scrollLeft() - ((ac && ac.left) ? ac.left : 0)) / ad,
            y: (ab.clientY + D.$window.scrollTop() - ((ac && ac.top) ? ac.top : 0)) / ad
        }
    }

    function Q(ad) {
        var ac = d(ad, "x");
        var ae = d(ad, "width");
        var af = d(ad, "y");
        var ab = d(ad, "height");
        return {x1: ac, y1: af, x2: ac + ae, y2: af + ab}
    }

    function c(ab) {
        ab = i(ab);
        if (ab && ab.parentNode) {
            ab.parentNode.appendChild(ab)
        }
    }

    function I(ab, ac) {
        ab = i(ab);
        if (ab && ab.parentNode) {
            ab.parentNode.insertBefore(ab, ac)
        }
    }

    function j(ae, ac, af, ad) {
        ae = i(ae);
        if (ae && X.isObject(ac)) {
            var ab = ac.at.split(" ") || [];
            var ai = ac.my.split(" ") || [];
            var ah = ac.of.offset().top;
            var ag = ac.of.offset().left;
            if (ab.length > 1) {
                if (ab[1] === "bottom") {
                    ah += ad ? ac.of.outerHeight() : d(ac.of[0], "height")
                } else {
                    if (ab[1] === "middle" || ab[1] === "center") {
                        ah += (ad ? ac.of.outerHeight() : d(ac.of[0], "height")) / 2
                    }
                }
            }
            if (ab.length > 0) {
                if (ab[0] === "right") {
                    ag += ad ? ac.of.outerWidth() : d(ac.of[0], "width")
                } else {
                    if (ab[0] === "middle" || ab[0] === "center") {
                        ag += (ad ? ac.of.outerWidth() : d(ac.of[0], "width")) / 2
                    }
                }
            }
            if (ai.length > 1) {
                if (ai[1] === "middle" || ai[1] === "center") {
                    ah -= ae.offsetHeight / 2
                } else {
                    if (ai[1] === "right") {
                        ah -= ae.offsetHeight
                    }
                }
            }
            if (ai.length > 0) {
                if (ai[0] === "middle" || ai[0] === "center") {
                    ag -= ae.offsetWidth / 2
                } else {
                    if (ai[0] === "right") {
                        ag -= ae.offsetWidth
                    }
                }
            }
            if (ag < 0 && ai[0] === "right" && ab[0] === "left") {
                ac.my = "left " + ai[1];
                ac.at = "right " + ab[1];
                j(ae, ac)
            } else {
                if (ac.top_offset) {
                    ah += ac.top_offset
                }
                if (ac.left_offset) {
                    ag += ac.left_offset
                }
                if (X.isObject(af)) {
                    if (af.left || af.top) {
                        af = G.extend({}, {min: af})
                    }
                    if (typeof af.min === "object") {
                        if (typeof af.min.top === "number" && ah < af.min.top) {
                            ah = af.min.top
                        }
                        if (typeof af.min.left === "number" && ag < af.min.left) {
                            ag = af.min.left
                        }
                    }
                    if (typeof af.max === "object") {
                        if (typeof af.max.top === "number" && ah > af.max.top) {
                            ah = af.max.top
                        }
                        if (typeof af.max.left === "number" && ag > af.max.left) {
                            ag = af.max.left
                        }
                    }
                }
                ae.style.top = ah + "px";
                ae.style.left = ag + "px"
            }
        }
    }

    function E(ah) {
        ah = i(ah);
        var ab = {};
        if (ah) {
            if (ah.dataset) {
                y(ah.dataset, function (ai, aj) {
                    if (aj !== o) {
                        ab[ai] = aj;
                        if (A) {
                            G(ah).data(ai, aj)
                        }
                    }
                })
            } else {
                var ae = ah.attributes;
                var ac = ae ? ae.length : 0;
                if (ac) {
                    var ad, ag;
                    for (var af = 0; af < ac; ++af) {
                        ad = ae[af]["name"].split("-");
                        if (ad[0] === "data" && ae[af]["value"]) {
                            ag = ae[af]["name"].replace(/^data-/, "");
                            ab[ag] = ae[af]["value"];
                            if (A) {
                                G(ah).data(ag, ae[af]["value"])
                            }
                        }
                    }
                }
            }
        }
        return G.extend({}, ab)
    }

    function T(ad, ae, ac) {
        if (typeof ad !== "string") {
            ad = i(ad);
            ad = (ad && ad.id) ? ad.id : false
        }
        if (ad) {
            if (!X.isObject(h[ad])) {
                h[ad] = E(ad)
            }
            var ab = {};
            y(h[ad], function (af, ag) {
                if (ag !== o && (!ac || G.inArray(af, ac) < 0)) {
                    ab[af] = ag
                }
            });
            if (ae) {
                return ab[ae]
            }
            return ab
        }
        return o
    }

    function V(ab, ad, ac) {
        if (typeof ab !== "string") {
            ab = i(ab);
            ab = (ab && ab.id) ? ab.id : false
        }
        if (ab) {
            if (!X.isObject(h[ab])) {
                h[ab] = E(ab)
            }
            h[ab][ad] = ac;
            if (A) {
                G("#" + ab).data(ad, ac)
            }
        }
    }

    function b(ab, ac) {
        if (typeof ab !== "string") {
            ab = i(ab);
            ab = (ab && ab.id) ? ab.id : false
        }
        if (ab && typeof ab === "string") {
            if (ac === o) {
                h[ab] = o;
                if (A) {
                    G("#" + ab).removeData()
                }
            } else {
                if (X.isObject(h[ab]) && h[ab][ac] !== o) {
                    h[ab][ac] = o;
                    if (A) {
                        G("#" + ab).removeData(ac)
                    }
                }
            }
        }
    }

    function a(ab, ac) {
        if (ab) {
            if (typeof ab.getElementsByClassName === "function") {
                return ab.getElementsByClassName(ac)
            } else {
                if (typeof ab.querySelectorAll === "function") {
                    return ab.querySelectorAll("." + ac)
                }
            }
        }
        return []
    }

    function Y(ad, ac) {
        ad = ad || window.event;
        if (ac) {
            var ab = ad.relatedTarget || ad.toElement
        } else {
            var ab = ad.target || ad.srcElement
        }
        if (ab && ab.correspondingUseElement) {
            ab = ab.correspondingUseElement
        }
        return ab
    }

    function y(ad, ae, ab) {
        if (ab || (X.isObject(ad, true) && typeof ae === "function")) {
            for (var ac in ad) {
                if (ac !== o && ad.hasOwnProperty(ac)) {
                    if (ae(ac, ad[ac]) === false) {
                        break
                    }
                }
            }
        }
    }

    return {
        getOption: Z,
        getOptions: v,
        setOption: e,
        setOptions: R,
        createElementNs: x,
        embedImage: q,
        use: P,
        addClass: W,
        removeClass: B,
        hasClass: m,
        animateMove: s,
        animateScale: C,
        animateCollapse: F,
        animateExpand: n,
        getMatrix: S,
        setMatrix: aa,
        getFloat: d,
        getInt: O,
        getAttr: p,
        setAttr: r,
        removeAttr: z,
        getElement: i,
        removeElement: J,
        generateUniqueId: k,
        getCursorPoint: f,
        getCellPositions: Q,
        bringToFront: c,
        sendToBack: I,
        position: j,
        clearCache: function (ab, ac) {
            if (!K) {
                return
            }
            if (ac) {
                if (w[ac]) {
                    w[ac] = o
                }
                if (ab) {
                    if (H[ac]) {
                        H[ac] = o
                    }
                    if (N[ac]) {
                        N[ac] = o
                    }
                }
            } else {
                w = {};
                if (ab) {
                    H = {};
                    N = {}
                }
            }
        },
        clearDatas: function (ab) {
            if (ab) {
                b(ab)
            } else {
                h = {}
            }
        },
        enableCache: function () {
            K = true
        },
        disableCache: function () {
            K = false
        },
        getData: T,
        setData: V,
        removeData: b,
        getElementsByClassName: a,
        getRealTarget: Y,
        forEach: y
    }
});
Slickplan.define("websocket", function (c, f, e) {
    var v = null;
    var o = (location.protocol === "https:");
    var t = (true && window.LZString);
    var k = f.require("ajax");
    var n = f.require("http");
    var b = f.require("config");
    var h = f.require("helper");
    var r = f.require("notification");
    f.subscribe("onunload", function (y, x) {
        s(x)
    });
    var i = {
        subscribe: function (x, y) {
            if (!p(true)) {
                return
            }
            f.log("WebSocket Subscribe:", "info", [x, y]);
            return v.on(x, function (z, A) {
                f.log("WebSocket Subscribe Callback:", "info", [z, A]);
                if (typeof y === "function") {
                    if (!h.isObject(A)) {
                        A = c.parseJSON(A)
                    }
                    if (t && h.isObject(A) && A.compressed && A.data) {
                        if (A.html) {
                            A = LZString.decompressFromBase64(A.data)
                        } else {
                            A = c.parseJSON(LZString.decompressFromBase64(A.data))
                        }
                    }
                    return y(z, A)
                }
            })
        }, publish: function (x, y) {
            if (!p(true)) {
                return
            }
            f.log("WebSocket Publish:", "info", [x, y]);
            y.sessionid = p(true);
            if (t) {
                y = {compressed: true, data: LZString.compressToBase64(JSON.stringify(y))}
            }
            return v.send("ws", x, y)
        }, call: function (y, z, A, x) {
            if (!p(true)) {
                return
            }
            z.sessionid = p(true);
            f.log("WebSocket Call:", "info", [y, z, A, x]);
            if (t && typeof z.data !== "string") {
                z.compressed = true;
                z.data = LZString.compressToBase64(JSON.stringify(z.data))
            }
            return v.send("ajax", y, z, function (C, B, D) {
                if (typeof B === "string" && (B.charAt(0) === "{" || B.charAt(0) === "[")) {
                    B = c.parseJSON(B)
                }
                if (t && h.isObject(B) && B.compressed && B.data) {
                    if (B.html) {
                        B = LZString.decompressFromBase64(B.data)
                    } else {
                        B = c.parseJSON(LZString.decompressFromBase64(B.data))
                    }
                }
                if (C) {
                    if (typeof A === "function") {
                        A(B)
                    }
                    if (D) {
                        f.log("WebSocket Call (result):", "info", D)
                    }
                } else {
                    if (typeof x === "function") {
                        x(B)
                    }
                    if (D) {
                        f.log("WebSocket Call (result):", "warn", D)
                    }
                }
            })
        }, sessionid: p(true)
    };

    function p(x) {
        if (v && v.socket && v.socket.id) {
            if (x) {
                return v.socket.id
            }
            return i
        }
        return false
    }

    function a(x) {
        if (o || !window.Primus) {
            return
        }
        var y = function () {
            v = window.Primus.connect("http://" + b.get("websocket_addr"), {
                reconnect: {
                    retries: 100,
                    maxDelay: 10000,
                    minDelay: 100
                }
            });
            v.on("open", function () {
                f.log("WebSocket:", "info", "Connected");
                setTimeout(function () {
                    var z = "websocket";
                    c.each(x, function (A, B) {
                        z += "/" + B;
                        f.publish(z, i)
                    })
                }, 10)
            });
            v.on("close", function () {
                f.log("WebSocket:", "info", "Disconnected")
            });
            v.on("error", function (z) {
                f.log("WebSocket:", "warn", "Disconnected (reason: " + z + ")")
            })
        };
        if (!p(true)) {
            y()
        }
    }

    function s(x) {
        if (p(true)) {
            f.publish("websocket/disconnect", [p()]);
            v.end();
            if (x) {
                v = e;
                setTimeout(function () {
                    a(b.get("route", []))
                }, 10)
            }
        }
    }

    var m = false;
    var u = {
        url: n.url(),
        data: {},
        dataType: "json",
        type: "POST",
        success: null,
        error: null,
        complete: null,
        silent: false,
        clear: false,
        timeout: 30000,
        $loading: null
    };

    function g(A, y) {
        if (!p(true)) {
            return k.request(A, y)
        }
        var z = {};
        c.extend(z, u);
        if (h.isObject(A)) {
            c.extend(z, A)
        } else {
            if (typeof A === "string") {
                z.url = n.url("/ajax/" + A)
            }
        }
        if (h.isObject(y)) {
            c.extend(z, y)
        }
        if (z.clear) {
            w()
        }
        if (!z.silent && !z.complete) {
            z.complete = function (B, C) {
                if (typeof z.$loading === "object" && z.$loading instanceof c) {
                    z.$loading.css({visibility: "hidden"})
                }
            }
        }
        var x = f.require("notification", {});
        m = true;
        if (z.data && !h.isObject(z.data)) {
            z.data = d(z.data)
        }
        if (!z.data._nonce) {
            z.data._nonce = c('meta[name="csrf-token"]').attr("content")
        }
        if (!z.data._v) {
            z.data._v = b.get("app_version", "")
        }
        if (!z.data._url) {
            z.data._url = window.location.href
        }
        f.log("Websocket (Ajax Send):", "info", [z.url, z.data]);
        if (!(typeof A === "string" && A === "ping")) {
            r.clearAll(true)
        }
        p().call("ajax_" + b.get("user_id"), {
            url: z.url,
            data: z.data,
            data_type: z.dataType,
            type: z.type,
            http_session_id: n.getCookie("session"),
            http_user_agent: n.getUserAgent()
        }, function (B) {
            f.log("WebSocket (Ajax Result):", "info", B);
            if (typeof z.success === "function") {
                B = q(B, z.dataType);
                z.success(B)
            }
            if (typeof x.clearAll === "function") {
                x.clearAll()
            }
            if (typeof z.complete === "function") {
                z.complete()
            }
            m = false
        }, function (B) {
            f.log("WebSocket (Ajax Error):", "warn", B);
            if (typeof z.error === "function") {
                B = q(B, z.dataType);
                z.error(B)
            }
            if (!z.silent) {
                if (typeof x.error === "function") {
                    if (B === 302 || B === "302") {
                        x.error(f.__('Session expired, your changes are not saving, <a href="{1}">please log in</a>.', "/login"))
                    } else {
                        x.error(f.__("An error occured. Please try again later."))
                    }
                }
            }
            if (typeof z.complete === "function") {
                z.complete()
            }
            m = false
        })
    }

    function w() {
        if (!p(true)) {
            return k.clearAll()
        }
        m = false
    }

    function j() {
        if (!p(true)) {
            return k.exists()
        }
        return m
    }

    function q(x, y) {
        if (c.isArray(x)) {
            x = x[0]
        }
        if (y === "json") {
            if (typeof x === "string" && (x[0] === "{" || x[0] === "[")) {
                x = c.parseJSON(x)
            } else {
                if (!h.isObject(x)) {
                    x = {result: x}
                }
            }
        }
        return x
    }

    function d(z) {
        z = decodeURIComponent(z.replace(/\+/g, " "));
        var D = z.replace(/(.*?\?)/, "");
        var E = D.split("&");
        var x = {};
        for (var B in E) {
            var y = E[B].split("=");
            var A = y[0], C = isNaN(y[1]) ? y[1] : parseFloat(y[1]);
            if (A.match(/(.*?)\[(.*?)]/)) {
                A = RegExp.$1;
                name2 = RegExp.$2;
                if (name2) {
                    if (!(A in x)) {
                        x[A] = {}
                    }
                    x[A][name2] = C
                } else {
                    if (!(A in x)) {
                        x[A] = []
                    }
                    x[A].push(C)
                }
            } else {
                x[A] = C
            }
        }
        return x
    }

    return {getSession: p, setSession: a, disconnect: s, request: g, clearAll: w, exists: j}
});
Slickplan.module(function (b, a, c) {
    a.subscribe("/app/settings/company", function () {
        var e = a.require("config");
        if (a.currentUserCan("account_branding")) {
            var f;
            a.$main.on("change", "#colorinput", function () {
                var g = this.value || false;
                if (g) {
                    g = "#" + g.replace("#", "");
                    b("#header-wrapper").attr("style", "background-color: " + g + " !important");
                    b("#header > .logo + div + ul").attr("style", "background-color: " + g + " !important; box-shadow: -20px 12px 10px " + g + " !important")
                }
            //}).on("change", 'input:radio[name="form[company_logo_type]"]', function () {
                //arieskienmendoza
            }).on("change", 'input:radio[data-id="logo_type"]', function () {
                var i = parseInt(b(this).val(), 10);
                var g = b("#header div.logo");
                if (i === 1) {
                    g.removeClass("logo-text").addClass("logo-img").find("img").attr("src", b(this).data("value"))
                } else {
                    var h = a.require("string");
                    var j = "logo-text";
                    i = b("#form-name2").val();
                    if (i.length) {
                        i = "<span>" + h.charsEncode(i) + "</span>";
                        j += " second"
                    }
                    g.removeClass("logo-img second").addClass(j).children("a:last").html("<span>" + h.charsEncode(b("#form-name1").val()) + "</span>" + i)
                }
            }).on("change", "#form-name1, #form-name2", function () {
                if (b("#form-uselogo1").is(":checked")) {
                    b("#form-uselogo1").change()
                }
            }).on("change", "#form-darkfont", function () {
                if (b(this).is(":checked")) {
                    a.$body.addClass("darkFont")
                } else {
                    a.$body.removeClass("darkFont")
                }
            }).on("focus", "#form-subdomain", function () {
                this.value = b.trim(this.value).replace(".slickplan.com", "")
            }).on("blur", "#form-subdomain", function () {
                this.value = b.trim(this.value).toLowerCase().replace(".slickplan.com", "") + ".slickplan.com"
            });
            a.subscribe("upload/files_added_pluploadbtn", function (m, k, i, h) {
                var g = a.require("form");
                var j = a.require("notification");
                g.clearErrors();
                j.clearAll();
                if (b("#custom-right > .input > .loading").length) {
                    b("#custom-right > .input > .loading").css({visibility: "visible"})
                } else {
                    b(".input.logochang > .loading").css({visibility: "visible"})
                }
                f = k;
                f.start()
            });
            a.subscribe("upload/file_uploaded_pluploadbtn", function (m, k, i, g, h) {
                if (g._nonce) {
                    a.updateNonce(g._nonce)
                }
                if (g.success) {
                    b("#header .logo.logo-img a img").attr("src", g.file_path).removeClass("isloading");
                    if (b("#custom-right > .input > .loading").length) {
                        b("#custom-right > .input > .loading").css({visibility: "hidden"})
                    } else {
                        b(".input.logochang > .loading").css({visibility: "hidden"})
                    }
                    if (g.success.length > 1) {
                        var j = a.require("notification");
                        j.success(g.success)
                    }
                } else {
                    if (g.error) {
                        j.error(g.error)
                    }
                }
                f = k;
                f.refresh()
            });
            a.subscribe("upload/error_pluploadbtn", function (m, k, i, h) {
                var g = a.require("form");
                var j = a.require("notification");
                j.error(a.__("An error occurred"));
                g.error(a.$main.find(".input.logochang"), i.message, c, c, -270);
                f = k;
                f.refresh()
            })
        } else {
            var d = a.__('<a href="{1}">Upgrade</a> to brand your account with custom colors and logo', e.get("payment_url", "#"));
            a.$main.on("click", 'label[for="form-darkfont"], label[for="form-uselogo1"], label[for="form-uselogo2"], #uploadblocked, #colordefault, #colorinput, #colorpicker.disabled', function (h) {
                if (h && typeof h.preventDefault === "function") {
                    h.preventDefault()
                }
                var g = a.require("notification");
                g.error(d);
                return false
            })
        }
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("settings/users/new/", function () {
        var d = a.require("form");
        var e = a.require("websocket");
        var k = a.require("notification");
        var i = a.require("config");
        var h = a.require("string");
        var j = i.get("account");
        var g = [];
        var f = function (o, n) {
            for (var m = 0; m < o.length; m++) {
                if (o[m] === n) {
                    return true
                }
            }
            return false
        };
        a.$main.on("click", "#letters a", function (r) {
            r.preventDefault();
            var q = b(this);
            var o = q.text().toUpperCase();
            if (o === "ALL") {
                g = []
            } else {
                if (q.parent().hasClass("inactive") || g.length == 0) {
                    q.addClass("filter").parent().removeClass("inactive");
                    g.push(o)
                } else {
                    q.removeClass("filter");
                    var m = [];
                    for (var n = 0; n < g.length; n++) {
                        if (typeof g[n] === "string" && g[n] !== o) {
                            m.push(g[n])
                        }
                    }
                    g = m
                }
            }
            var p = b("#letters");
            if (g.length) {
                p.find("li.all").addClass("active").end().find("a").not(".filter").parent().not(".all").addClass("inactive");
                b("#usersbox > *").not(":last").each(function () {
                    var s = b(this);
                    if (f(g, b.trim(s.children("span:first").text()).charAt(0).toUpperCase()) || f(g, b.trim(s.children("span:last").text()).charAt(0).toUpperCase())) {
                        s.show()
                    } else {
                        s.hide()
                    }
                })
            } else {
                p.find("li.all").removeClass("active").end().find("a").removeClass("filter").parent().removeClass("inactive");
                b("#usersbox > *").not(":last").show()
            }
        });
        a.$body.on("click", "#usersbox a.delete", function (o) {
            o.preventDefault();
            if (!confirm("Are you sure you want to delete this user?")) {
                return false
            }
            var m = b(this).parent("div");
            var n = !m.hasClass("notactive");
            e.request({
                data: {"delete": m.data("id")}, success: function (p) {
                    if (p._nonce) {
                        a.updateNonce(p._nonce)
                    }
                    if (p.error) {
                        k.error(p.error)
                    } else {
                        m.animate({opacity: 0}, 400, function () {
                            b(this).animate({width: 0, padding: 0}, 250, function () {
                                b(this).remove()
                            })
                        });
                        --j.contributors;
                        if (n) {
                            --j.active_contributors
                        }
                        i.set("account", j)
                    }
                }
            })
        }).on("submit", "#modal-add-user form", function (q) {
            q.preventDefault();
            e.clearAll();
            var u = b(this);
            var n = b("#mform-add-first-name");
            var p = b("#mform-add-last-name");
            var r = b("#mform-add-email");
            var o = b("#mform-add-password");
            d.clearErrors(u);
            var s = [{
                value: n.val(),
                tiperror: n.parent(),
                rules: {empty: "First Name must not be empty"},
                css: {bottom: 5},
                left: 11
            }, {
                value: p.val(),
                tiperror: p.parent(),
                rules: {empty: "Last Name must not be empty"},
                css: {bottom: 5}
            }, {
                value: r.val(),
                tiperror: r.parent(),
                rules: {empty: "Email must not be empty", email: "Email is not valid"},
                css: {bottom: 5},
                left: 11
            }];
            if (o.val()) {
                s.push({
                    value: o.val(),
                    tiperror: o.parent(),
                    rules: {length: [6, "Password must be at least 6 characters"]},
                    css: {bottom: 5}
                })
            }
            var t = d.validate(s);
            if (t) {
                var m = d.serializeObject(u);
                m.modal = 1;
                e.request({
                    data: m, $loading: u.find(".loading").css({visibility: "visible"}), success: function (v) {
                        if (v._nonce) {
                            a.updateNonce(v._nonce)
                        }
                        if (v.errors) {
                            if (v.errors.first_name) {
                                d.error(n.parent(), v.errors.first_name, {bottom: 5})
                            }
                            if (v.errors.last_name) {
                                d.error(p.parent(), v.errors.last_name, {bottom: 5})
                            }
                            if (v.errors.email) {
                                d.error(r.parent(), v.errors.email, {bottom: 5})
                            }
                        } else {
                            var w = b("<div />").data("id", v.id).data("email", v.email).html("<span>" + h.charsEncode(n.val()) + "</span> <span>" + h.charsEncode(p.val()) + '</span><a href="#" class="delete">Delete</a><a href="#" class="edit">Edit</a>');
                            if (!!v.admin) {
                                w.addClass("admin")
                            }
                            w.addClass("new-user").prependTo("#usersbox");
                            setTimeout(function () {
                                w.removeClass("new-user")
                            }, 5000);
                            u.closest(".modal").dialog("close");
                            k.success(a.__("New user created. Login credentials have been sent to their email"));
                            ++j.contributors;
                            ++j.active_contributors;
                            i.set("account", j)
                        }
                    }, error: function (v, x, w) {
                        u.closest(".modal").dialog("close")
                    }
                })
            }
        }).on("click", "a.edit", function (o) {
            o.preventDefault();
            var m = b(this).parent("div");
            var n = b("#modal-edit-user.modal").find("#mform-edit-first-name").val(m.children("span:first").text()).end().find("#mform-edit-last-name").val(m.children("span:last").text()).end().find("#mform-edit-email").val(m.data("email")).end().find("#mform-edit-user-id").val(m.data("id")).end().find("#mform-edit-password").val("").end().find("#mform-edit-user-type").prop("checked", m.hasClass("admin")).change().end().find("#mform-edit-active").prop("checked", !m.hasClass("notactive")).change().end().dialog("open").find("input:first").focus()
        }).on("submit", "#modal-edit-user form", function (q) {
            q.preventDefault();
            e.clearAll();
            var v = b(this);
            var n = b("#mform-edit-first-name");
            var p = b("#mform-edit-last-name");
            var r = b("#mform-edit-email");
            var o = b("#mform-edit-password");
            var s = b("#mform-edit-active");
            d.clearErrors(v);
            var t = [{
                value: n.val(),
                tiperror: n.parent(),
                rules: {empty: "First Name must not be empty"},
                css: {bottom: 5},
                left: 11
            }, {
                value: p.val(),
                tiperror: p.parent(),
                rules: {empty: "Last Name must not be empty"},
                css: {bottom: 5}
            }, {
                value: r.val(),
                tiperror: r.parent(),
                rules: {empty: "Email must not be empty", email: "Email is not valid"},
                css: {bottom: 5},
                left: 11
            }];
            if (o.val()) {
                t.push({
                    value: o.val(),
                    tiperror: o.parent(),
                    rules: {length: [6, "Password must be at least 6 characters"]},
                    css: {bottom: 5}
                })
            }
            var u = d.validate(t);
            if (u) {
                var m = d.serializeObject(v);
                m.modal = 1;
                e.request({
                    data: m, $loading: v.find(".loading").css({visibility: "visible"}), success: function (x) {
                        if (x._nonce) {
                            a.updateNonce(x._nonce)
                        }
                        if (x.error) {
                            v.closest(".modal").dialog("close");
                            k.error(x.error)
                        } else {
                            if (x.errors) {
                                if (x.errors.first_name) {
                                    d.error(n.parent(), x.errors.first_name, {bottom: 5})
                                }
                                if (x.errors.last_name) {
                                    d.error(p.parent(), x.errors.last_name, {bottom: 5})
                                }
                                if (x.errors.email) {
                                    d.error(r.parent(), x.errors.email, {bottom: 5})
                                }
                                if (x.errors.active) {
                                    d.error(s.parent(), x.errors.active, {bottom: 110}, null, -18)
                                }
                            } else {
                                var w = b("#usersbox div#userb-" + b("#mform-edit-user-id").val());
                                w.data("email", r.val()).children("span:first").text(n.val()).end().children("span:last").text(p.val()).end().addClass("new-user");
                                setTimeout(function () {
                                    w.removeClass("new-user")
                                }, 5000);
                                if (v.find("#mform-edit-user-type").prop("checked")) {
                                    w.addClass("admin")
                                } else {
                                    w.removeClass("admin")
                                }
                                if (s.prop("checked")) {
                                    w.removeClass("notactive")
                                } else {
                                    w.addClass("notactive")
                                }
                                v.closest(".modal").dialog("close");
                                k.success(a.__("User updated"))
                            }
                        }
                    }, error: function (w, y, x) {
                        v.closest(".modal").dialog("close")
                    }
                })
            }
        }).on("click", '#usersbox > a, #main button[data-modal="add-user"]', function (n) {
            var m = parseInt(a.currentUserCan("contributors", true), 10);
            if (m === 0 || (m > 0 && j.active_contributors >= m)) {
                n.preventDefault();
                n.stopPropagation();
                k.error(a.__('<a href="{1}">Upgrade</a> your account to add ' + (m === 0 ? "" : "more ") + "users", i.get("payment_url", "#")));
                return false
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("settings/ settings/preferences settings/company settings/messages", function (i) {
        a.$main.find("input[data-loading]").each(function () {
            var e = new Image();
            e.src = b(this).data("loading")
        });
        var d = a.require("form");
        var j = a.require("http");
        var h = a.require("notification");
        var g = a.require("websocket");
        var f = i.type;
        a.$main.find(".submit").append('<div class="loading" />').end().on("submit", "form", function (o) {
            o.preventDefault();
            g.clearAll();
            var n = b(this);
            d.clearErrors(n);
            var k = [];
            n.find('.switch > input[type="checkbox"]:not(:checked)').each(function () {
                k.push({name: b(this).attr("name"), value: 0})
            });
            var m = d.serializeObject(n, k);
            m.ajax = 1;
            g.request({
                url: j.url(n.attr("action")),
                data: m,
                $loading: n.find(".submit > .loading").css({visibility: "visible"}),
                success: function (e) {
                    n.find('.submit input[type="submit"]').show();
                    if (e._nonce) {
                        a.updateNonce(e._nonce)
                    }
                    if (e.redirect) {
                        j.redirect(e.redirect)
                    } else {
                        if (e.errors) {
                            b.each(e.errors, function (p, q) {
                                d.error(n.find('input[name="form[' + p + ']"]').parent("div"), q)
                            });
                            h.error(a.__("An error occured"))
                        } else {
                            if (e.error) {
                                h.error(e.error)
                            } else {
                                if (a.$main.hasClass("account-settings") && b("#form-firstname").length) {
                                    b("#user-box").children("p:first-child").text(b("#form-firstname").val() + " " + b("#form-lastname").val()).end().find("img").attr("src", b("#image-form-avatar").attr("src"))
                                }
                                h.success((e.success.length > 5) ? e.success : a.__("New settings saved"));
                                a.publish("account/settings_saved", [f, m])
                            }
                        }
                    }
                },
                error: function () {
                    n.find('.submit input[type="submit"]').show()
                }
            })
        }).on("change", "input, select", function () {
            d.clearErrors(b(this).parent())
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/account/messages", function () {
        if (typeof b.ui !== "undefined" && typeof b.ui.tabs !== "undefined") {
            function d(e) {
                var g = e.find("textarea").data("formatting").toString().split(" ");
                b("#modal-formatting table tr + tr").hide();
                for (var f = 0; f < g.length; ++f) {
                    b("#modal-formatting table tr." + g[f]).show()
                }
            }

            b("#manage-messages").tabs({
                activate: function (g, f) {
                    d(f.newPanel)
                }, create: function (g, f) {
                    d(f.panel)
                }
            })
        }
        a.$main.on("click", "#manage-messages button.todefault", function (f) {
            f.preventDefault();
            b(this).closest("div").find("textarea[data-default]").each(function () {
                b(this).val(b(this).data("default"))
            })
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/account/payment", function (i) {
        var k = i.type;
        var o = a.require("http");
        var j = a.require("notification");
        var p = a.require("config");
        var m = a.require("ajax");
        var g = a.require("string");
        var f = a.require("form");
        var d = a.require("scrollbar");
        var n = a.require("helper");
        var h = p.get("account");
        a.$main.find(".submit").append('<div class="loading" />').end().on("submit", "form", function (x) {
            x.preventDefault();
            m.clearAll();
            var z = b(this);
            f.clearErrors(z);
            var C = true;
            var u = z.find('input[name="form[type]"]:checked');
            if (!u.length) {
                j.error(a.__("Select a plan"));
                return false
            }
            var D = parseInt(u.data("storage"), 10);
            if (D > -1 && h.storage_used > D) {
                b(".modal").dialog("close");
                if (D > 0) {
                    var w = h.storage_used - D;
                    b("#modal-archive-files.modal").data("limit", w).dialog("open");
                    b("#modal-archive-files h1").show().find("span").text(g.humanReadableFileSize(w));
                    var r = b("#modal-archive-files .files-scroll").show();
                    r.removeData("plugin_tinyscrollbar").removeClass("tinyscrollbar-enabled").empty();
                    m.request({
                        data: {get_cell_files_library: "library", include_sizes: 1}, success: function (e) {
                            html = '<div class="clearfix">';
                            if (e && e.success && e.files) {
                                for (var F = 0, E = e.files.length; F < E; ++F) {
                                    if (e.files[F] && e.files[F].alias) {
                                        html += '<div class="single-file single-file-' + e.files[F].alias + '" data-file="' + e.files[F].alias + '" data-size="' + e.files[F].size + '"><img src="' + e.files[F].url_thumb + '"><div class="filesize">' + g.humanReadableFileSize(e.files[F].size) + '</div><div class="selected"><i class="fa fa-check"></i></div></div>'
                                    }
                                }
                            }
                            html += "</div>";
                            r.html(html);
                            d.init(r);
                            d.update(r);
                            setTimeout(function () {
                                d.update(r)
                            }, 50)
                        }
                    })
                } else {
                    n.confirmDialog({
                        close: true,
                        title: a.__("You need to delete all your files to continue"),
                        yes_label: "Yes, Delete",
                        no_label: "Cancel",
                        on_yes: function () {
                            m.request({
                                data: {delete_files_permanently: "all"}, success: function (e) {
                                    if (typeof e.storage_used !== "undefined") {
                                        h.storage_used = e.storage_used;
                                        p.set("account", h);
                                        b('#main form input[type="submit"]').trigger("click");
                                        b('#squeeze #ccard > form input[type="submit"]').trigger("click")
                                    }
                                }
                            })
                        }
                    })
                }
                return false
            }
            var q = parseInt(u.data("limit"), 10);
            if (q > -1 && h.sitemaps_count > q) {
                q = h.sitemaps_count - q;
                b(".modal").dialog("close");
                b("#modal-archive.modal form").each(function () {
                    this.reset()
                });
                b("#modal-archive.modal").data("limit", q).dialog("open");
                b("#modal-archive h1 span").text(q);
                n.rowShadow();
                return false
            }
            var t = parseInt(u.data("contributors"), 10);
            if (t > -1 && h.active_contributors > t) {
                t = h.active_contributors - t;
                b(".modal").dialog("close");
                b("#modal-archive-contributors.modal form").each(function () {
                    this.reset()
                });
                b("#modal-archive-contributors.modal").data("limit", t).dialog("open");
                b("#modal-archive-contributors h1 span").text(t);
                n.rowShadow();
                return false
            }
            if (!b("#form-type-1").length && b("fieldset.payment-method.payment-premium").length) {
                var B = b("#form-ccnumber");
                var A = b("#form-cvv");
                var y = b("#form-zip");
                C = f.validate([{
                    value: B.val(),
                    tiperror: B.parent(),
                    rules: {
                        empty: "Credit Card number must not be empty",
                        callback: [f.ccValidationDots, "Invalid credit card number"]
                    },
                    css: {bottom: 5},
                    left: 12
                }, {
                    value: A.val(),
                    tiperror: A.parent(),
                    rules: {
                        empty: "Security Code must not be empty",
                        regexp: [/^[0-9]{3,4}$/, "Invalid Security Code"]
                    },
                    css: {bottom: 5, left: 70}
                }, {
                    value: y.val(),
                    tiperror: y.parent(),
                    rules: {empty: "Zip/Postal Code must not be empty"},
                    css: {bottom: 5, left: 120}
                }]);
                if (b("#form-expyear").val() == 0 || b("#form-expmonth").val() == 0) {
                    f.error(b("#form-expdate"), "You must select an expiration date", {
                        bottom: 3,
                        left: 205
                    }, false, 20);
                    C = false
                }
            }
            if (C) {
                z.find('.submit input[type="submit"]').hide();
                var v = [];
                z.find('.switch > input[type="checkbox"]:not(:checked)').each(function () {
                    v.push({name: b(this).attr("name"), value: 0})
                });
                var s = f.serializeObject(z, v);
                s.ajax = 1;
                m.request({
                    url: o.url(z.attr("action")),
                    data: s,
                    $loading: z.find(".submit > .loading").css({visibility: "visible"}),
                    success: function (E) {
                        z.find('.submit input[type="submit"]').show();
                        if (E._nonce) {
                            a.updateNonce(E._nonce)
                        }
                        if (E.redirect) {
                            o.redirect(E.redirect)
                        } else {
                            if (E.errors) {
                                b.each(E.errors, function (G, H) {
                                    f.error(z.find('input[name="form[' + G + ']"]').parent("div"), H)
                                });
                                j.error(a.__("An error occured"))
                            } else {
                                if (E.error) {
                                    j.error(E.error)
                                } else {
                                    var F = parseInt(z.find('input[name="form[type]"]:checked').val(), 10);
                                    a.$main.data("current", F);
                                    if (F === 1) {
                                        var e = b("fieldset.payment-premium").show();
                                        e.find("input").val("");
                                        e.find("select").val("0");
                                        e.find('input[type="radio"]').prop("checked", false);
                                        e.hide();
                                        b("fieldset.payment-method").hide().filter(".payment-free").show()
                                    }
                                    if (F === 1 || b("#form-ccnumber").val() != "") {
                                        b("#header .trial").remove()
                                    }
                                    j.success((E.success.length > 5) ? E.success : a.__("New settings saved"));
                                    a.publish("account/settings_saved", [k, s])
                                }
                            }
                        }
                    },
                    error: function () {
                        z.find('.submit input[type="submit"]').show()
                    }
                })
            } else {
                j.error(a.__("An error occured"))
            }
        }).on("change", "input, select", function () {
            f.clearErrors(b(this).parent())
        }).on("change", 'input[name="form[type]"]', function () {
            var r = parseInt(b(this).val(), 10);
            var s = parseInt(a.$main.data("current"), 10);
            var e = b("fieldset.payment-method").hide();
            if (e.length > 1) {
                if (r === 1 && s > 1) {
                    e.filter(".payment-downgrade").show()
                } else {
                    if (r === 1 && s === 1) {
                        e.filter(".payment-free").show()
                    } else {
                        e.filter(".payment-premium").show();
                        var q = b("select");
                        q.selectmenu("destroy");
                        q.selectmenu({
                            style: "popup", format: function (t) {
                                return a.require("string").charsEncode(t)
                            }
                        })
                    }
                }
            } else {
                e.show()
            }
        })
    });
    a.subscribe("route/account/payment route/squeeze", function (d) {
        a.$body.on("click", "#ccard-chooser > input + label", function (f) {
            f.preventDefault()
        });
        if (b("#form-yearly").length) {
            b("#form-yearly").on("change", function (h, i) {
                var g = this.checked;
                var f = parseInt(this.value, 10);
                if (g) {
                    b("#main, #squeeze").addClass("yearly")
                } else {
                    b("#main, #squeeze").removeClass("yearly")
                }
            }).trigger("change", [true])
        }
        a.$window.on("load", function () {
            b("#main, #squeeze").find('input[name="form[type]"]:checked').trigger("change")
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/account/preferences", function () {
        if (typeof b.ui !== "undefined" && typeof b.ui.draggable !== "undefined") {
            b(".switch > input + label").append("<div />").children("div").draggable({
                containment: "parent",
                axis: "x",
                grid: [41, 41],
                drag: function (f, d) {
                    d.helper.parent("label").prev("input").prop("checked", (d.position.left > 20) ? true : false)
                }
            })
        }
        a.$main.on("change", 'fieldset.basecamp input[name="form[basecamp_version]"]', function () {
            if (parseInt(this.value, 10) === 0) {
                b(this).closest("fieldset").addClass("classic")
            } else {
                b(this).closest("fieldset").removeClass("classic")
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/account/settings", function () {
        var f = a.require("config");
        var e = f.get("statics_path");
        var g;
        var h;
        var d = b("#main.account-settings select");
        d.selectmenu("destroy");
        d.selectmenu({
            style: "popup", maxHeight: 400, format: function (i) {
                return a.require("string").charsEncode(i)
            }
        });
        a.$main.on("click", "#deleteavatar", function (i) {
            i.preventDefault();
            if (g) {
                b("#image-form-avatar").attr("src", g).removeClass("isloading")
            }
            b(this).hide();
            b("#new-avatar").val("0");
            if (h) {
                h.refresh()
            }
        });
        a.subscribe("upload/files_added_pluploadbtn", function (o, n, k, j) {
            var i = a.require("form");
            var m = a.require("notification");
            i.clearErrors();
            m.clearAll();
            g = b("#user-box img").attr("src");
            b("#image-form-avatar").attr("src", e + "img/loading_small.gif").addClass("isloading");
            h = n;
            h.start()
        });
        a.subscribe("upload/file_uploaded_pluploadbtn", function (o, n, k, i, j) {
            if (i._nonce) {
                a.updateNonce(i._nonce)
            }
            if (i.success) {
                b("#new-avatar").val(i.file_id);
                b("#image-form-avatar").attr("src", i.file_path).removeClass("isloading");
                b("#deleteavatar").show();
                if (i.success.length > 1) {
                    var m = a.require("notification");
                    m.success(i.success)
                }
            }
            h = n;
            h.refresh()
        });
        a.subscribe("upload/error_pluploadbtn", function (o, n, k, j) {
            var i = a.require("form");
            var m = a.require("notification");
            if (g) {
                b("#image-form-avatar").attr("src", g).removeClass("isloading")
            }
            m.error(a.__("An error occurred"));
            i.error(b(j).closest(".input"), k.message);
            h = n;
            h.refresh()
        });
        a.subscribe("account/settings_saved", function (o, k, m) {
            if (k && k[1] && k[1] === "settings" && m && m.form) {
                var j = a.require("websocket");
                var n = f.get("account")["subdomain"];
                if (typeof j.getSession === "function" && n) {
                    var i = j.getSession();
                    if (i && typeof i === "object" && typeof i.publish !== "undefined") {
                        i.publish("account_data_changed_" + n, {
                            user_id: f.get("user_id"),
                            first_name: m.form.first_name,
                            last_name: m.form.last_name,
                            username: m.form.username,
                            email: m.form.email,
                            avatar: m.form.avatar,
                            subdomain: n
                        })
                    }
                }
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/api", function () {
        var e = a.require("config");
        var d = e.get("statics_path");
        var f;
        b("#apiupdate").on("click", function () {
            var g = b("#updateapp");
            if (g.length && !g.is(":visible")) {
                b(this).val("Save changes");
                g.slideDown();
                return false
            }
            return true
        });
        a.subscribe("upload/files_added_pluploadbtn", function (m, k, i, h) {
            var g = a.require("form");
            var j = a.require("notification");
            g.clearErrors();
            j.clearAll();
            b("#image-form-avatar").attr("src", d + "loading_small.gif").addClass("isloading");
            f = k;
            f.start()
        });
        a.subscribe("upload/file_uploaded_pluploadbtn", function (m, k, i, g, h) {
            if (g._nonce) {
                a.updateNonce(g._nonce)
            }
            if (g.success) {
                b("#new-avatar").val(g.file_id);
                b("#image-form-avatar").attr("src", g.file_path).removeClass("isloading");
                b("#deleteavatar").show();
                if (g.success.length > 1) {
                    var j = a.require("notification");
                    j.success(g.success)
                }
            }
            f = k;
            f.refresh()
        });
        a.subscribe("upload/error_pluploadbtn", function (m, k, i, h) {
            var g = a.require("form");
            var j = a.require("notification");
            j.error(a.__("An error occurred"));
            g.error(b(h).closest(".input"), i.message);
            f = k;
            f.refresh()
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/configure", function () {
        var e = a.require("form");
        var f = a.require("websocket");
        var j = a.require("http");
        var h = a.require("notification");
        var k = a.require("scrollbar");
        var g = b("#customize-wrapper");
        var d = g.height();
        b("#customize").show();
        g.hide();
        b("#customize").on("click", function (m) {
            m.preventDefault();
            b(this).hide();
            g.show().css({opacity: 0, height: 0}).animate({opacity: 1, height: d}, 400);
            b("html, body").animate({scrollTop: 1100}, 400)
        });
        a.$main.on("submit", "form", function (q) {
            q.preventDefault();
            f.clearAll();
            var r = b(this);
            e.clearErrors(r);
            var o = b("#form-first-name");
            var p = b("#form-last-name");
            var n = b("#form-username");
            var s = b("#form-company-name");
            var u = b("#form-subdomain");
            u.val(b.trim(u.val().toLowerCase().replace(".slickplan.com", "")));
            var v = e.validate([{
                value: p.val(),
                tiperror: p.parent(),
                rules: {empty: a.__("First/Last Name must not be empty")}
            }, {
                value: o.val(),
                tiperror: p.parent(),
                rules: {empty: a.__("First/Last Name must not be empty")}
            }, {
                value: n.val(),
                tiperror: n.parent(),
                rules: {empty: a.__("Username must not be empty")}
            }, {
                value: s.val(),
                tiperror: s.parent(),
                rules: {empty: a.__("Company Name must not be empty")},
                css: {bottom: 56}
            }, {
                value: u.val(),
                tiperror: u.parent(),
                rules: {
                    empty: a.__("URL must not be empty"),
                    alnum: a.__("URL can contain only letters and/or numbers"),
                    is: ["www", a.__('URL must not contain "{1}"', "www")],
                    is: ["help", a.__('URL must not contain "{1}"', "help")],
                    is: ["campusuite", a.__('URL must not contain "{1}"', "campusuite")]
                },
                css: {left: "59%"}
            }]);
            if (v && b("fieldset.existing").length) {
                var t = parseInt(b("fieldset.existing").data("sitemaps"), 10);
                var m = parseInt(b('input[name="form[account_type]"]:checked').data("sitemaps"), 10);
                if (t > m) {
                    m = t - m;
                    b(".modal").dialog("close");
                    b("#modal-archive.modal form").each(function () {
                        this.reset()
                    });
                    b("#modal-archive.modal").data("limit", m).dialog("open");
                    b("#modal-archive h1 span").html(m);
                    k.init(b("#modal-archive.sitemaps-scroll .table-scroll"), {thumbSize: 64});
                    rowShadow();
                    return false
                }
            }
            if (v) {
                f.request({
                    data: e.serializeObject(r),
                    $loading: r.find(".submit .loading").css({visibility: "visible"}),
                    success: function (w) {
                        if (w._nonce) {
                            a.updateNonce(w._nonce)
                        }
                        if (w.errors) {
                            if (w.errors.first_name) {
                                e.error(o.parent(), w.errors.first_name, {left: "49%"})
                            }
                            if (w.errors.last_name) {
                                e.error(p.parent(), w.errors.last_name)
                            }
                            if (w.errors.username) {
                                e.error(n.parent(), w.errors.username)
                            }
                            if (w.errors.company_name) {
                                e.error(s.parent(), w.errors.company_name, {bottom: 56})
                            }
                            if (w.errors.coupon) {
                                e.error(b("#form-coupon").parent(), w.errors.coupon, {bottom: 30})
                            }
                            if (w.errors.subdomain) {
                                e.error(u.parent(), w.errors.subdomain, {left: "59%"})
                            }
                            h.error("Errors occurred. Fill in all fields marked below.")
                        } else {
                            if (w.redirect) {
                                j.redirect(w.redirect)
                            }
                        }
                    }
                })
            } else {
                h.error(a.__("Errors occurred. Fill in all fields marked below."))
            }
        }).on("focus", "input, button", function () {
            var m = b(this).closest(".input").data("fieldset");
            m = m ? m : "default";
            var n = b("fieldset.info." + m);
            if (n.length) {
                n.show().siblings(".info").hide()
            }
        }).on("click", "fieldset.existing > div", function () {
            b("fieldset.existing > div").removeClass("checked");
            var m = b(this).addClass("checked").find("input").prop("checked", true).val();
            if (m <= 2) {
                b("fieldset.footer").hide()
            } else {
                b("fieldset.footer").show()
            }
        }).on("click", "#pluploadbtn2", function (m) {
            b("#pluploadbtn").parent().find('input[type="file"]').trigger("click")
        });
        var i;
        a.subscribe("upload/files_added_pluploadbtn", function (r, q, o, n) {
            var m = a.require("form");
            var p = a.require("notification");
            m.clearErrors();
            p.clearAll();
            if (b("#custom-right > .input > .loading").length) {
                b("#custom-right > .input > .loading").css({visibility: "visible"})
            } else {
                b(".input.logochang > .loading").css({visibility: "visible"})
            }
            i = q;
            i.start()
        });
        a.subscribe("upload/file_uploaded_pluploadbtn", function (r, q, o, m, n) {
            if (m._nonce) {
                a.updateNonce(m._nonce)
            }
            if (m.success) {
                b("#hidden-upload-input").val(m.file_id);
                b("#image-form-companylogo").attr("src", m.file_path).removeClass("isloading");
                if (b("#custom-right > .input > .loading").length) {
                    b("#custom-right > .input > .loading").css({visibility: "hidden"})
                } else {
                    b(".input.logochang > .loading").css({visibility: "hidden"})
                }
                if (m.success.length > 1) {
                    var p = a.require("notification");
                    p.success(m.success)
                }
            }
            i = q;
            i.refresh()
        });
        a.subscribe("upload/error_pluploadbtn", function (r, q, o, n) {
            var m = a.require("form");
            var p = a.require("notification");
            p.error(a.__("An error occurred"));
            m.error(b("#custom-right > .input"), o.message, c, c, -270);
            i = q;
            i.refresh()
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap route/dashboard", function () {
        var e = a.require("form");
        var m = a.require("websocket");
        var o = a.require("http");
        var k = a.require("notification");
        var p = a.require("config");
        var g = a.require("string");
        var j = "viewer";
        var q = 0;
        var n = [];

        function h(r) {
            var t = j + "s";
            var u = b(".usersbox." + t);
            var s = b('<div class="' + (r.approval ? "approval" : "") + (r.locking ? " admin" : "") + (r.admin ? " admintype" : "") + ' new-user" id="box-contributor-' + r.value + '" data-first="' + g.charsEncode(r.first_name) + '" data-last="' + g.charsEncode(r.last_name) + '" data-email="' + g.charsEncode(r.email) + '" title="' + g.charsEncode(r.email) + '">                <span>' + r.first_name + " " + r.last_name + '</span>                <a href="#" class="delete">delete</a>                <a href="#" class="edit" data-topmodal="edit-contributor" data-id="' + r.value + '">edit</a>                <input type="hidden" name="form[' + t + '][]" value="' + r.value + '">                <input type="hidden" name="form[admin][]" value="' + (r.locking ? r.value : 0) + '">                <input type="hidden" name="form[approval][]" value="' + (r.approval ? r.value : 0) + '">                </div>');
            u.prepend(s);
            setTimeout(function () {
                s.removeClass("new-user")
            }, 3600);
            f();
            d()
        }

        function i() {
            var u = b(this);
            var s = u.closest("form");
            var t = u.closest(".top-modal");
            var r = u.closest("form").find(".autocomplete-placeholder");
            u.autocomplete({
                source: function (z, x) {
                    var w = p.get("users_list", []);
                    var C = j + "s";
                    var D = b.ui.autocomplete.filter(w, z.term);
                    var B = [];
                    var v = b("#modal-create-sitemap, #modal-contributors").find('input[name^="form[editors]"], input[name^="form[viewers]"]');
                    for (var A = 0, y = D.length; A < y; ++A) {
                        if (!v.filter('[value="' + D[A].value + '"]').length) {
                            B.push(D[A])
                        }
                    }
                    x(B)
                }, delay: 0, cancelBlur: true, appendTo: r, open: function (y, x) {
                    u.off("blur");
                    var v = r.find(".ui-autocomplete:visible").css({left: 0, top: "+=10px"}).quickOuterHeight() || 0;
                    r.css({height: v}).addClass("opened");
                    var w = p.get("users_list", []);
                    r.find(".tip-error").remove();
                    r.find("a").each(function () {
                        var B = b(this);
                        var A = b.trim(B.text());
                        A = A.replace(/\s([^\s]+@[^\s]+)$/, " <span>$1</span>");
                        var C = B.html(A).parent().removeClass("admin");
                        var z = C.data("ui-autocomplete-item");
                        if (j === "viewer" && z && z.type && parseInt(z.type, 10) === 9) {
                            C.removeClass("ui-menu-item").addClass("ui-menu-item-disabled admin");
                            C.off().on("click", function (D) {
                                r.find(".tip-error").remove();
                                e.error(C.closest(".autocomplete-placeholder"), a.__("Admins can be added as editors only"), {top: C.position().top + C.quickOuterHeight() - 30}, c, 10)
                            })
                        }
                    })
                }, close: function (w, v) {
                    r.find(".tip-error").remove();
                    r.css({height: 0}).removeClass("opened")
                }, select: function (w, v) {
                    if (j === "viewer" && parseInt(v.item.type, 10) === 9) {
                        return false
                    }
                    h({
                        first_name: v.item.first_name,
                        last_name: v.item.last_name,
                        email: v.item.email,
                        value: v.item.value,
                        locking: s.find("#tm-sitemap-admin-check").is(":checked"),
                        approval: s.find("#tm-sitemap-approval-check").is(":checked"),
                        admin: (parseInt(v.item.type, 10) === 9)
                    });
                    t.dialog("close")
                }
            })
        }

        function f(s) {
            s = s || [".usersbox.viewers", ".usersbox.editors"];
            for (var r = 0; r < s.length; r++) {
                b(s[r]).html(b(s[r] + " > div").get().sort(function (u, t) {
                    u = b(u).find("span").text().toLowerCase();
                    t = b(t).find("span").text().toLowerCase();
                    return (u < t) ? -1 : ((u > t) ? 1 : 0)
                }))
            }
        }

        function d() {
            b(".usersbox > div").filter(":not(.notactive)").draggable({revert: "invalid"}).end().find("a.delete").off("click").on("click", function (s) {
                s.preventDefault();
                var r = b(this).closest("div");
                if (r.hasClass("notactive")) {
                    r.css({opacity: 0.5}).removeClass("notactive").animate({opacity: 0}, 400, function () {
                        b(this).remove()
                    })
                } else {
                    r.animate({opacity: 0}, 400, function () {
                        b(this).remove()
                    })
                }
            })
        }

        d();
        b(".usersbox").each(function () {
            var r = b(this);
            r.droppable({
                activeClass: "drop-active",
                accept: r.hasClass("viewers") ? ".usersbox.editors > div:not(.admintype)" : ".usersbox.viewers > div",
                drop: function (w, u) {
                    var v = b(this);
                    if (v.find('input[value="' + u.draggable.find('input[name^="form[editors]"], input[name^="form[viewers]"]').filter(":first").val() + '"]').length) {
                        u.draggable.removeClass("ui-draggable-dragging new-user").css("left", "").css("top", "");
                        return false
                    }
                    var t = v.hasClass("viewers") ? "viewers" : "editors";
                    var s = u.draggable.clone().removeClass("ui-draggable-dragging new-user").css("left", "").css("top", "").find('input[name^="form[editors]"], input[name^="form[viewers]"]').attr("name", "form[" + t + "][]").end();
                    if (t === "viewers") {
                        s.removeClass("admin").find('input[name^="form[admin]"]').val(0)
                    }
                    u.draggable.remove();
                    v.append(s);
                    f();
                    d()
                }
            })
        });
        b('#topmodal-add-contributor input[type="text"]').each(i);
        a.$body.on("submit", "#topmodal-add-contributor form", function (r) {
            r.preventDefault()
        }).on("submit", "#topmodal-add-new-contributor form, #topmodal-edit-contributor form", function (u) {
            u.preventDefault();
            m.clearAll();
            var z = b(this);
            e.clearErrors(z);
            var s = z.find('input[name*="[first_name]"]');
            var t = z.find('input[name*="[last_name]"]');
            var v = z.find('input[name*="[email]"]');
            var y = e.validate([{
                value: s.val(),
                tiperror: s.parent(),
                rules: {empty: "First Name must not be empty"}
            }, {value: t.val(), tiperror: t.parent(), rules: {empty: "Last Name must not be empty"}}, {
                value: v.val(),
                tiperror: v.parent(),
                rules: {empty: "Email must not be empty", email: "Email is not valid"}
            }]);
            if (y) {
                var x = z.closest(".top-modal");
                var r = e.serializeObject(z);
                var w = false;
                r.modal = 1;
                if (a.$main.hasClass("dashboard") || a.$main.hasClass("sitemap")) {
                    r.dash = 1
                }
                if (r.add) {
                    r.add.type = j;
                    r.add.user_id = q
                } else {
                    if (r.edit) {
                        w = true;
                        r.edit.type = j;
                        r.edit.user_id = q
                    }
                }
                m.request({
                    url: o.url(z.attr("action")),
                    data: r,
                    $loading: z.find(".loading").css({visibility: "visible"}),
                    success: function (A) {
                        if (A._nonce) {
                            a.updateNonce(A._nonce)
                        }
                        if (A.errors) {
                            if (A.errors.first_name) {
                                e.error(s.parent(), A.errors.first_name)
                            }
                            if (A.errors.last_name) {
                                e.error(t.parent(), A.errors.last_name)
                            }
                            if (A.errors.email) {
                                e.error(v.parent(), A.errors.email)
                            }
                        } else {
                            if (A.id) {
                                var C = s.val() + " " + t.val();
                                if (w) {
                                    b("#box-contributor-" + A.id).remove()
                                }
                                h({
                                    first_name: s.val(),
                                    last_name: t.val(),
                                    email: v.val(),
                                    value: A.id,
                                    admin: w ? z.find("#tme-sitemap-admin-check").is(":checked") : z.find("#tmn-sitemap-admin-check").is(":checked"),
                                    approval: w ? z.find("#tme-sitemap-approval-check").is(":checked") : z.find("#tmn-sitemap-approval-check").is(":checked")
                                });
                                x.dialog("close");
                                var F = p.get("users_list", []);
                                var E = false;
                                if (w) {
                                    for (var D = 0, B = F.length; D < B; ++D) {
                                        if (A.id == F[D].value) {
                                            F[D] = {
                                                first_name: s.val(),
                                                last_name: t.val(),
                                                email: v.val(),
                                                name: C,
                                                label: C + " " + v.val(),
                                                value: A.id
                                            };
                                            E = true;
                                            break
                                        }
                                    }
                                }
                                if (!E) {
                                    F.push({
                                        first_name: s.val(),
                                        last_name: t.val(),
                                        email: v.val(),
                                        name: C,
                                        label: C + " " + v.val(),
                                        value: A.id
                                    })
                                }
                                p.set("users_list", F);
                                b('#topmodal-add-contributor input[type="text"]').each(i);
                                q = 0;
                                b("#share-email .recipients").append('                                    <div class="checkbox border">                                        <input type="checkbox" id="form-recipient-' + A.id + '" name="recipients[]" value="' + g.charsEncode(v.val()) + '">                                        <label for="form-recipient-' + A.id + '">' + g.charsEncode(C) + "</label>                                    </div>                                ");
                                b("#share-email .recipients > .checkbox").removeClass("first").filter(":nth-child(3n)").addClass("first")
                            }
                        }
                    },
                    error: function (A, C, B) {
                        x.dialog("close")
                    }
                })
            }
        }).on("submit", "#modal-contributors > form", function (u) {
            u.preventDefault();
            m.clearAll();
            var r = b(this);
            var s = r.closest(".modal");
            var t = e.serializeObject(r);
            m.request({
                data: t, $loading: r.find(".loading").css({visibility: "visible"}), success: function (v) {
                    s.dialog("close");
                    k.success(a.__("Contributors updated successfully"));
                    if (p.get("all_privileges", false)) {
                        b("#sitemap-menu #action-approve").remove();
                        if (!b("#modal-contributors .usersbox > .approval").length) {
                            b("#sitemap-menu a.text.close").closest("li").before('<li><a href="#" class="text icon approve" id="action-approve">Approve Sitemap</a></li>')
                        }
                    }
                    if (v && v.contributors && v.contributors.length) {
                        a.publish("sitemap/contributors_changed", [v.contributors])
                    }
                }, error: function (v, x, w) {
                    s.dialog("close")
                }
            })
        });
        a.subscribe("top_modal/open/topmodal-add-contributor", function (s, r) {
            r.find(".autocomplete-placeholder").css({height: 0}).removeClass("opened").find("ul").empty();
            if (b("#modal-create-sitemap, #modal-contributors").find("div.approval").length) {
                r.addClass("no-approval")
            } else {
                r.removeClass("no-approval")
            }
        });
        a.subscribe("top_modal/open/topmodal-add-new-contributor", function (s, r) {
            if (b("#modal-create-sitemap, #modal-contributors").find("div.approval").length) {
                r.addClass("no-approval")
            } else {
                r.removeClass("no-approval")
            }
        });
        a.subscribe("top_modal/after_open/topmodal-add-contributor", function (t, s, r) {
            j = r.data("type");
            if (j !== "editor" && j !== "viewer") {
                j = "viewer"
            }
            b("#topmodal-add-contributor, #topmodal-add-new-contributor").removeClass("type-editor type-viewer").addClass("type-" + j)
        });
        a.subscribe("top_modal/after_open/topmodal-edit-contributor", function (w, t, r) {
            var s = r.closest("div");
            q = parseInt(r.data("id"), 10);
            j = r.closest(".usersbox").hasClass("editors") ? "editor" : "viewer";
            b("#topmodal-edit-contributor").removeClass("type-editor type-viewer").addClass("type-" + j);
            b("#form-econtributor-firstname").val(s.data("first"));
            b("#form-econtributor-lastname").val(s.data("last"));
            b("#form-econtributor-email").val(s.data("email"));
            b("#tme-sitemap-admin-check").prop("checked", (s.find('input[type="hidden"][name^="form[admin]"]').val() * 10 > 0)).trigger("change");
            b("#tme-sitemap-approval-check").prop("checked", (s.find('input[type="hidden"][name^="form[approval]"]').val() * 10 > 0)).trigger("change");
            var u = b("#modal-create-sitemap, #modal-contributors").find("div.approval");
            var v = parseInt(u.find(".edit").data("id"), 10);
            if (!u.length || q === v) {
                t.removeClass("no-approval")
            } else {
                t.addClass("no-approval")
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/dashboard", function () {
        var f = a.require("form");
        var k = a.require("websocket");
        var m = a.require("http");
        var j = a.require("notification");
        var n = a.require("helper");
        var p = a.require("config");
        var e = b("#modal-create-sitemap");
        var o = b("#sitemaps-table");
        n.rowShadow();
        e.find("div.plainupload > a.button").show();
        e.on("click", "div.plainupload > a.button", function (q) {
            q.preventDefault();
            f.clearErrors(b(this).parent());
            b(this).next("input:file").show().focus().trigger("click")
        }).on("submit", "form", function (u) {
            u.preventDefault();
            k.clearAll();
            var r = b(this);
            f.clearErrors(r);
            r.find(".input").removeClass("error");
            var w = b("#form-name");
            var v = b("#form-version");
            if (!w.val().length) {
                f.error(w.parent(), a.__("Sitemap name must not be empty"), {bottom: 5})
            } else {
                var q = parseFloat(v.val());
                var s = r.closest(".modal");
                var t = f.serializeObject(r);
                t.modal = 1;
                k.request({
                    data: t, $loading: r.find(".loading").css({visibility: "visible"}), success: function (x) {
                        if (x._nonce) {
                            a.updateNonce(x._nonce)
                        }
                        if (x.success && x.redirect) {
                            if (r.find("input:file").length && r.find("input:file").val()) {
                                r.find('input[type="text"]').removeAttr("name");
                                r.attr("action", x.redirect);
                                r.find(".usersbox").empty();
                                r.off("submit");
                                s.off("submit", "form");
                                r.trigger("submit");
                                return
                            } else {
                                m.redirect(x.redirect)
                            }
                        } else {
                            if (x.error) {
                                j.error(x.error)
                            }
                        }
                        s.dialog("close")
                    }, error: function (x, z, y) {
                        s.dialog("close")
                    }
                })
            }
        });
        function d() {
            a.$main.find("input:checkbox").each(function () {
                var q = b(this);

                if (q.is(":checked")) {
                    q.closest("tr").addClass("active")
                }
                q.change(function () {
                    a.$main.find("tr").removeClass("active").end().find("input:checkbox:checked").closest("tr").addClass("active")
                })
            })
        }

        d();
        function i() {
            a.$body.children(".loading").remove();
            var q = a.$main.find("tbody");
            b('<div class="loading" />').css({
                width: q.width(),
                height: q.height(),
                top: q.offset().top,
                left: q.offset().left
            }).appendTo(a.$body)
        }

        function g(s, q) {
            k.clearAll();
            i();
            var r = a.$main.find('.top input[name="search"]').val();
            k.request({
                data: {
                    AJAX: 1,
                    page: s,
                    order: [o.data("orderby"), o.data("orderdir")],
                    search: (r === "SEARCH SITEMAPS" ? "" : r)
                }, dataType: "html", success: q, error: function (t, v, u) {
                    a.$body.children(".loading").remove()
                }
            })
        }

        a.$main.on("click", "thead th:not(.right) > a", function (r) {
            r.preventDefault();
            var q = b(this).attr("href").split("/");
            q = q[q.length - 1].split("-");
            o.data("orderby", q[0]).data("orderdir", q[1]);
            g(1, function (s) {
                s = jQuery("<div />").append(s);
                a.$body.children(".loading").remove();
                a.$main.find(".pagination li").removeClass("current").filter("li.first").next("li").addClass("current");
                o.html(s.find("#sitemaps-table").html());
                b("ul.pagination").replaceWith(s.find("ul.pagination"));
                var t = s.find('input[type="hidden"][name="_nonce"]:first');
                if (t.length) {
                    a.updateNonce(t.val())
                }
                s = null;
                b("select").selectmenu({
                    style: "popup", format: function (u) {
                        return a.require("string").charsEncode(u)
                    }
                });
                d();
                a.$main.find("tbody tr:not(.no-sitemaps)").each(h);
                a.$main.find("tbody select").change(h)
            })
        }).on("click", ".pagination a", function (r) {
            var q = b(this).parent("li");
            if (q.hasClass("archive")) {
                return true
            }
            if (q.hasClass("current")) {
                return false
            } else {
                if (q.hasClass("first")) {
                    a.$main.find(".pagination li.current").prev("li").not(".first").children("a").trigger("click");
                    return false
                } else {
                    if (q.hasClass("last")) {
                        a.$main.find(".pagination li.current").next("li").not(".last").children("a").trigger("click");
                        return false
                    }
                }
            }
            r.preventDefault();
            g(parseInt(b(this).html(), 10), function (s) {
                s = b("<div />").html(s);
                a.$body.children(".loading").remove();
                q.siblings().removeClass("current").end().addClass("current");
                o.html(s.find("#sitemaps-table").html());
                q.closest("ul").replaceWith(s.find("ul.pagination"));
                var t = s.find('input[type="hidden"][name="_nonce"]:first');
                if (t.length) {
                    a.updateNonce(t.val())
                }
                s = null;
                b("select").selectmenu({
                    style: "popup", format: function (u) {
                        return a.require("string").charsEncode(u)
                    }
                });
                d();
                a.$main.find("tbody tr:not(.no-sitemaps)").each(h);
                a.$main.find("tbody select").change(h);
                n.rowShadow()
            })
        }).on("click", "#delete, #archive, #unarchive", function (v) {
            v.preventDefault();
            k.clearAll();
            var q = [];
            var t = p.get("account");
            a.$main.find("input:checkbox:checked").each(function () {
                q.push(b(this).val())
            });
            var s = b(this).attr("id");
            if (!q.length) {
                j.error(a.__("Select sitemap/s to " + s));
                return false
            }
            if (s === "unarchive") {
                if (t.sitemaps_limit > -1 && t.sitemaps_count + q.length > t.sitemaps_limit) {
                    j.error(a.__('Your {1} account needs to be <a href="{2}">upgraded</a> before you can unarchive this sitemap', t.name, p.get("payment_url", "#")));
                    return false
                }
            } else {
                if (s === "delete") {
                    var u = false;
                    a.$main.find("input:checkbox:checked").each(function () {
                        if (b(this).closest("tr").find('select[name="version"] > option').length > 1) {
                            u = true;
                            return false
                        }
                    });
                    if (!u && !confirm(a.__("Are you sure you want to delete selected sitemaps?"))) {
                        return false
                    }
                }
            }
            var r = {AJAX: 1};
            r[s] = q;
            i();
            k.request({
                data: r, success: function (w) {
                    if (w._nonce) {
                        a.updateNonce(w._nonce)
                    }
                    a.$body.children(".loading").remove();
                    if (s === "delete" && w.versions) {
                        var x = b("#modal-delete");
                        var z = b("#deletemtbl > tr:first").clone();
                        b("#deletemtbl > tr").remove();
                        for (var y = 0; y < w.versions.length; y++) {
                            var B = z.clone();
                            B.find("input").attr("id", "formdel-ids-" + w.versions[y].id).val(w.versions[y].id).next("label").attr("for", "formdel-ids-" + w.versions[y].id).text(w.versions[y].title);
                            B.find("td:first").next("td").text(w.versions[y].version).next("td").children("div").text(w.versions[y].author);
                            b("#deletemtbl").append(B)
                        }
                        x.dialog("open");
                        x.height(x.children("form").outerHeight());
                        var A = b(window).height() - x.outerHeight();
                        x.parent().css({top: ((A > 0) ? A / 2 : 0)});
                        return
                    }
                    if (w.success) {
                        b('#dashboard-autocomplete input[type="reset"]').trigger("click");
                        if (s === "unarchive") {
                            t.sitemaps_count += q.length
                        } else {
                            t.sitemaps_count -= q.length;
                            if (t.sitemaps_count < 0) {
                                t.sitemaps_count = 0
                            }
                        }
                        p.set("account", t);
                        j.success(a.__("Sitemap" + (q.length > 1 ? "s" : "") + " successfully " + s + "d"))
                    } else {
                        if (w.error) {
                            alert(w.error)
                        }
                    }
                }, error: function (w, y, x) {
                    a.$body.children(".loading").remove()
                }
            })
        });
        b("#modal-delete").on("submit", "form", function (r) {
            r.preventDefault();
            k.clearAll();
            var q = b(this).closest(".modal");
            if (b(this).find(":checkbox:checked").length < 1) {
                q.dialog("close");
                j.error(a.__("No sitemaps selected to delete."));
                return false
            }
            k.request({
                data: f.serializeObject(b(this)),
                $loading: b(this).find(".loading").css({visibility: "visible"}),
                success: function (s) {
                    if (s._nonce) {
                        a.updateNonce(s._nonce)
                    }
                    q.dialog("close");
                    if (s.success) {
                        b('#dashboard-autocomplete input[type="reset"]').trigger("click");
                        j.success(a.__("Sitemaps successfully deleted"))
                    } else {
                        j.error(a.__("An error occured. Please try again later."))
                    }
                },
                error: function (s, u, t) {
                    q.dialog("close")
                }
            })
        }).on("change", "#form-select-all", function () {
            b("#modal-delete td input").prop("checked", this.checked).change()
        });
        function h() {
            var v = b(this).hasClass("ui-version") ? b(this).closest("tr") : b(this);
            var w = v.find("select").val();
            if (v.find("td.dashrow").length) {
                var r = v.find("td.dashrow > a").attr("href").split("/")
            } else {
                var r = v.find(".checkbox + a").attr("href").split("/")
            }
            r[r.length - 1] = w;
            v.find(":checkbox").val(w).end().find(".checkbox + a, td.last > a, td.dashrow > a").attr("href", r.join("/")).end().find("span.verspan").hide().end().find("span.verspan-" + w).show();
            if (this.tagName.toLowerCase() === "select") {
                var s = v.find(".approved");
                if (s.length) {
                    var t = s.data("version");
                    var u = parseFloat(t);
                    var q = parseFloat(b(this).find("option:selected").text());
                    if (q === u) {
                        j.clearAll(true)
                    } else {
                        j.info(a.__("Version {1} is approved. For assistance contact your sitemap admin.", t))
                    }
                }
            }
        }

        a.$main.find("tbody tr:not(.no-sitemaps)").each(h);
        a.$main.on("change", "tbody select", h).on("submit", "#dashboard-autocomplete", function (r) {
            r.preventDefault();
            k.clearAll();
            var s = b(this).find('input[name="search"]');
            i();
            s.autocomplete("close");
            var q = f.serializeObject(b(this));
            k.request({
                data: q, dataType: "html", success: function (t) {
                    t = jQuery("<div />").append(t);
                    b(".pagination").html(t.find(".pagination").html());
                    a.$body.children(".loading").remove();
                    o.html(t.find("#sitemaps-table").html());
                    var u = t.find('input[type="hidden"][name="_nonce"]:first');
                    if (u.length) {
                        a.updateNonce(u.val())
                    }
                    t = null;
                    //b("select").selectmenu({
                    //    style: "popup", format: function (v) {
                    //        return a.require("string").charsEncode(v)
                    //    }
                    //});
                    d();
                    a.$main.find("tbody tr:not(.no-sitemaps)").each(h);
                    a.$main.find("tbody select").change(h);
                    b("#dashboard-autocomplete").find('input[type!="text"]').hide().end().find('input[type="' + (q.search ? "reset" : "submit") + '"]').css({display: "block"})
                }
            })
        }).on("click", '#dashboard-autocomplete input[type="reset"]', function (r) {
            r.preventDefault();
            var q = b("#dashboard-autocomplete");
            q[0].reset();
            q.trigger("submit")
        });
        o.on("click", "a.archived", function (q) {
            q.preventDefault();
            j.error(a.__("Unarchive this sitemap to view or make edits"))
        });
        a.$main.find('.top input[name="search"]').focus(function () {
            b(this).parent("form").addClass("focus")
        }).blur(function () {
            b(this).parent("form").removeClass("focus")
        }).autocomplete({
            delay: 0, source: p.get("autocomplete", []), position: {offset: "-4 0"}, select: function () {
                setTimeout(function () {
                    b("#dashboard-autocomplete").trigger("submit")
                }, 100)
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/deal", function () {
        var d = a.require("form");
        var f = a.require("ajax");
        var g = a.require("http");
        var e = b("#dealpage > form").on("submit", function (i) {
            i.preventDefault();
            return false
        });
        var h = e.find('input[name="coupon_code"]');
        b("#new-user, #existing-user").on("click", function (j) {
            j.preventDefault();
            if (b(this).closest(".submit").hasClass("loading")) {
                return false
            }
            f.clearAll();
            d.clearErrors(e);
            var i = d.validate([{
                value: h.val(),
                tiperror: h.parent(),
                rules: {empty: a.__("Offer Code must not be empty")},
                css: {bottom: 30},
                left: 13
            }]);
            if (i) {
                var k = this.id.replace("-user", "");
                if (k === "new" && b('input[name="coupon_code"]').attr("type") === "hidden") {
                    b("#registerbox").data("planid", k).stop().css({opacity: 0}).show().animate({opacity: 1}, 444);
                    b("#overlay").stop().css({opacity: 0}).show().animate({opacity: 1}, 333)
                } else {
                    e.children(".submit").addClass("loading");
                    f.request({
                        data: {coupon_code: h.val(), user_type: k}, success: function (m) {
                            if (m.redirect) {
                                window.location = m.redirect
                            } else {
                                if (m.success) {
                                    b("#registerbox").data("planid", k).stop().css({opacity: 0}).show().animate({opacity: 1}, 444);
                                    b("#overlay").stop().css({opacity: 0}).show().animate({opacity: 1}, 333)
                                } else {
                                    if (m.error) {
                                        d.error(h.parent("div"), m.error, {bottom: 30}, false, 13);
                                        e.children(".submit").removeClass("loading")
                                    }
                                }
                            }
                            if (m._nonce) {
                                a.updateNonce(m._nonce)
                            }
                        }, error: function () {
                            e.children(".submit").removeClass("loading")
                        }
                    })
                }
            }
        });
        a.$body.on("click", "#registerbox .close", function (i) {
            i.preventDefault();
            b("#registerbox").animate({opacity: 0}, 333);
            b("#overlay").animate({opacity: 0}, 444, function () {
                b("#overlay, #registerbox").hide()
            });
            e.children(".submit").removeClass("loading")
        });
        a.$body.on("submit", "#registerbox > form", function (q) {
            q.preventDefault();
            var p = b(this);
            f.clearAll();
            d.clearErrors(p);
            var i = p.find('input[name="email"]');
            var j = p.find('input[name="password"]');
            var m = p.find('input[name="password2"]');
            var k = p.find('input[name="terms"]');
            var n = i.parent();
            var o = d.validate([{
                value: i.val(),
                tiperror: n,
                rules: {empty: a.__("Email must not be empty"), email: a.__("Email is not valid")},
                css: {bottom: 114},
                left: 13
            }, {
                value: j.val(),
                tiperror: n,
                rules: {
                    empty: a.__("Password must not be empty"),
                    length: [6, a.__("Password must be at least 6 characters")]
                },
                css: {bottom: 60},
                left: 13
            }, {
                value: m.val(), tiperror: n, rules: {
                    empty: a.__("Password must not be empty"), callback: [function () {
                        return (m.val() === j.val())
                    }, a.__("Passwords do not match")]
                }, css: {bottom: 6}, left: 13
            }, {
                input: k,
                tiperror: n,
                rules: {checked: a.__("You must accept the terms & conditions to continue")},
                css: {bottom: -38},
                left: 18
            }]);
            if (o) {
                f.request({
                    data: d.serializeObject(p),
                    $loading: p.find(".submit .loading").css({visibility: "visible"}),
                    success: function (r) {
                        if (r.redirect) {
                            g.redirect(r.redirect)
                        } else {
                            if (r.errors) {
                                b.each(r.errors, function (t, u) {
                                    var s = false;
                                    var v = 13;
                                    switch (t) {
                                        case"email":
                                            s = {bottom: 114};
                                            break;
                                        case"password":
                                            s = {bottom: 60};
                                            break;
                                        case"password2":
                                            s = {bottom: 6};
                                            break;
                                        case"terms":
                                            s = {bottom: -38};
                                            v = 18;
                                            break
                                    }
                                    d.error(n, u, s, false, v)
                                })
                            }
                        }
                        if (r._nonce) {
                            a.updateNonce(r._nonce)
                        }
                    }
                })
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/error", function () {
        var d = a.require("form");
        var e = a.require("ajax");
        var g = a.require("http");
        var f = a.require("notification");
        a.$body.on("submit", "#errorpage > form", function (j) {
            j.preventDefault();
            e.clearAll();
            var h = b(this).find("textarea")[0];
            b("html, body").animate({scrollTop: 0}, 300);
            if (h.value == h.defaultValue || h == "") {
                f.error(h.defaultValue)
            } else {
                f.success("Your message has been sent. You will be redirected in a few seconds.");
                setTimeout(function () {
                    window.location = b('#errorpage input[name="error[redirect]"]').val()
                }, 4000);
                var i = d.serializeObject(b(this));
                i.ajax = 1;
                e.request({url: g.url(b(this).attr("action")), data: i})
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("after_init", function () {
        var t = a.require("config");
        var f = a.require("form");
        var r = a.require("http");
        var n = a.require("notification");
        var s = a.require("helper");
        var o = a.require("ajax");
        var m;
        var p = false;
        var u = [];
        var d = new nicEditor();
        if (window.document.getElementById("form-feedback")) {
            d.panelInstance("form-feedback")
        }
        a.$window.on("load debouncedresize", function () {
            if (a.$body.height() > a.$window.height() && !b("#main").hasClass("payment-info")) {
                a.$main.find("form").addClass("fixed")
            } else {
                a.$main.find("form").removeClass("fixed")
            }
        });
        var h = 60000;
        var k = function (v) {
            if (!v) {
                o.request("ping", {
                    silent: true, success: function (w) {
                        if (w) {
                            if (w._modal && typeof w._modal === "object" && w._modal.modal && w._modal.notification_id) {
                                if (w._modal.script_src || w._modal.script_tpl) {
                                    var A = "modal-dynamic-notification-" + w._modal.notification_id;
                                    var x = "tpl-" + A;
                                    var z = "script-" + A;
                                    var y = function () {
                                        if (w._modal.script_src && !window.document.getElementById(z)) {
                                            a.$body.append('<script src="' + w._modal.script_src + '" id="' + z + '" type="text/javascript"><\/script>')
                                        }
                                    };
                                    if (w._modal.html_tpl && !window.document.getElementById(x)) {
                                        a.$body.append('<div id="' + x + '"></div>');
                                        b("#" + x).load(w._modal.html_tpl, function () {
                                            y()
                                        })
                                    } else {
                                        if (w._modal.script_tpl && !window.document.getElementById(x)) {
                                            a.$body.append('<script id="' + x + '" type="text/template"><\/script>');
                                            b("#" + x).load(w._modal.script_tpl, function () {
                                                y()
                                            })
                                        } else {
                                            y()
                                        }
                                    }
                                    o.request("system_notification", {
                                        data: {id: w._modal.notification_id},
                                        silent: true
                                    })
                                }
                            } else {
                                if (w._notify && typeof w._notify === "object" && w._notify.message && w._notify.options && !n.isActive()) {
                                    n.display(w._notify.message, w._notify.options)
                                }
                            }
                        }
                    }
                })
            }
            setTimeout(k, h)
        };
        a.$window.on("load", function () {
            k(true)
        });
        var j = b("#back-to-top");
        if (j.length) {
            j.on("click", function () {
                b("html, body").animate({scrollTop: 0}, 333)
            });
            a.$window.scroll(function () {
                if (a.$window.scrollTop() > 10) {
                    j.addClass("show")
                } else {
                    j.removeClass("show")
                }
            })
        }
        if (b("#modal-old-browser").length) {
            b("#modal-old-browser").dialog("open");
            b("#upgrade-info").remove()
        }
        function e(w) {
            var v = f.serializeObject(w);
            v.ajax = 1;
            o.request({
                url: r.url(w.attr("action")),
                data: v,
                $loading: w.find(".loading").css({visibility: "visible"}),
                clear: true,
                success: function (x) {
                    if (x._nonce) {
                        a.updateNonce(x._nonce)
                    }
                    if (x.success) {
                        var y = w.closest(".modal");
                        if (d && d.nicInstances && d.nicInstances.length) {
                            d.instanceById("form-feedback").setContent("");
                            d.instanceById("form-feedback").saveContent()
                        }
                        y.dialog("close");
                        n.success(a.__("Feedback sent"))
                    } else {
                        if (x.error) {
                            n.error(x.error)
                        }
                    }
                },
                error: function () {
                    w.closest(".modal").dialog("close")
                }
            })
        }

        function q(z, x, y, w) {
            var v = '<div class="item item' + z + " " + (w ? w : "") + '">';
            if (z) {
                v += '<a href="#" class="delete" data-id="' + z + '"><i class="fa fa-times"></i></a>'
            }
            v += '<span class="filename">' + x.name + "</span>";
            if (y) {
                v += '<span class="message"> - ' + y + "</span>"
            }
            v += '<span class="progress"></span></div>';
            b("#pluploadfileslist").show().append(v)
        }

        function g() {
            b("#pluploadfileslist").empty().hide();
            u = []
        }

        a.$body.on("submit", "#modal-feedback > form", function (y) {
            y.preventDefault();
            var x = b(this);
            f.clearErrors();
            var v = b.trim(b("#form-feedback").val().replace(/(<([^>]+)>)/ig, ""));
            var w = f.validate([{
                value: v,
                tiperror: b("#form-feedback").parent(),
                rules: {empty: "Feedback must not be empty"},
                css: {top: 91, bottom: "auto"},
                left: -19
            }]);

            if (w) {
                if (m) {
                    x.find(".loading").css({visibility: "visible"});
                    p = false;
                    m.start()
                } else {
                    e(x)
                }
            }
        });
        b("#pluploadfileslist").on("click", ".delete", function (v) {
            v.preventDefault();
            var w = b(this).data("id");
            if (m) {
                m.removeFile(w)
            }
            b(this).closest(".item").remove();
            if (!b("#pluploadfileslist .item").length) {
                g()
            }
        });
        a.subscribe("upload/files_added_pluploadbtndrop", function (A, z, x, w) {
            var v = a.require("form");
            var y = a.require("notification");
            v.clearErrors();
            y.clearAll();
            plupload.each(x, function (B) {
                q(B.id, B, "(" + plupload.formatSize(B.size) + ")")
            });
            m = z
        });
        a.subscribe("upload/file_uploaded_pluploadbtndrop", function (z, y, x, v, w) {
            if (v && v.success && v.file_id) {
                u.push(v.file_id)
            }
        });
        a.subscribe("upload/uploads_complete_pluploadbtndrop", function (w, v) {
            b("#pluploadfileslist .item").remove();
            b("#feedback_files").val(u.join(","));
            g();
            m = v;
            m.refresh();
            b("#modal-feedback > form .loading").css({visibility: "visible"});
            if (!p) {
                e(b("#modal-feedback > form"))
            }
        });
        a.subscribe("upload/error_pluploadbtndrop", function (y, x, w, v) {
            q(false, w.file, w.message, "error");
            p = true;
            m = x;
            m.stop();
            m.refresh()
        });
        a.subscribe("upload/uploads_progress_pluploadbtndrop", function (z, y, x, w) {
            var v = b("#pluploadfileslist");
            v.find(".delete").hide();
            v.find(".item" + x.id + " .progress").html(" - " + x.percent + "%")
        });
        a.subscribe("modal/open/modal-feedback", function () {
            if (m) {
                m.refresh()
            }
        });
        var i = 0;
        a.$window.on("load", function () {
            b("#sitemap-top").scrollTo(0, 0)
        }).on("load scroll resize", function () {
            var v = Math.max(0, a.$window.scrollLeft());
            if (i !== v) {
                i = v;
                s.addCssRule("#header-wrapper, #sitemap-top, #main.sitemap", "margin-left: " + v + "px");
                s.addCssRule(".section-breadcrumbs", "left: " + v + "px")
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("before_init", function () {
        var n = a.require("config");
        var e = a.require("form");
        var j = a.require("sitemap");
        var h = a.require("notification");
        var m = a.require("helper");
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
                var o = b(this).attr("placeholder");
                b(this).val(o).focus(function () {
                    if (this.value == o) {
                        this.value = ""
                    }
                }).blur(function () {
                    if (this.value == "") {
                        this.value = o
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
                    return this.on((b.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (o) {
                        o.preventDefault()
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
            a.$body.on("click", "#colordefault", function (o) {
                o.preventDefault();
                b.farbtastic("#colorpicker").setColor("#008DF5")
            })
        }
        if (typeof b.ui !== "undefined") {
            if (typeof b.ui.selectmenu !== "undefined") {
                b("select:not(.plain)").selectmenu({
                    style: "popup", format: function (o) {
                        return f.charsEncode(o)
                    }
                })
            }
            if (b.ui.dialog !== c) {
                b("div.modal").each(function () {
                    var o = b(this);
                    var p = o.attr("id");
                    a.publish("modal/before_init/" + p, [o]);
                    o.dialog({
                        autoOpen: false,
                        modal: true,
                        show: {effect: "fade", duration: 250},
                        hide: {effect: "fade", duration: 300},
                        open: function () {
                            if (p === "modal-export") {
                                b('#modal-export input[type="radio"]:first').prop("checked", true).change()
                            } else {
                                if (p === "modal-open") {
                                    var u = o.find("select");
                                    u.selectmenu("destroy");
                                    u.selectmenu({
                                        style: "popup", format: function (v) {
                                            return f.charsEncode(v)
                                        }
                                    })
                                }
                            }
                            b(".ui-widget-overlay:last").attr("class", "ui-widget-overlay modal-hooked modal-overlay modalid-" + p).hide().fadeIn(250, function () {
                                o.parent().addClass("anim")
                            });
                            o.find(".loading").css({visibility: "hidden"});
                            a.publish("modal/open/" + p, [o]);
                            var t = o.find(".table-scroll");
                            var s = t.find("tr");
                            var r = t.data("how-many") || 4;
                            if (t.length && p !== "modal-color-load" && s.length > r) {
                                var q = s.filter(":last").outerHeight() * r;
                                t.height(q);
                                if (d) {
                                    d.init(t, {thumbSize: 64, trackSize: q})
                                }
                            }
                        },
                        beforeClose: function () {
                            if (!o.is(":visible")) {
                                return
                            }
                            var q = b(".ui-widget-overlay.modalid-" + p).clone();
                            b(".ui-widget-overlay.modalid-" + p).remove();
                            e.clearErrors(o);
                            q.appendTo(a.$body).fadeOut(300, function () {
                                b(this).remove()
                            });
                            o.css({overflow: "hidden"}).parent().css({overflow: "hidden"});
                            a.publish("modal/before_close/" + p, [o])
                        },
                        close: function () {
                            o.parent().removeClass("anim");
                            b.ui.dialog.overlay.instances = [];
                            b.ui.dialog.overlay.oldInstances = [];
                            a.publish("modal/close/" + p, [o])
                        },
                        resizable: false,
                        draggable: false,
                        zIndex: (p === "modal-confirm") ? 9001 : 2001,
                        width: o.width(),
                        height: o.height()
                    })
                });
                b("div.top-modal").each(function () {
                    var o = b(this);
                    var p = o.hasClass("tooltip-modal") ? "ui-tooltip-modal" + (o.hasClass("tooltip-modal-left") ? " tooltip-modal-left" : "") : "ui-top-modal";
                    p += o.hasClass("resizeable") ? " sl-resizeable" : "";
                    p += o.hasClass("resizeable-x") ? " sl-resizeable-x" : "";
                    p += o.hasClass("resizeable-y") ? " sl-resizeable-y" : "";
                    var q = o.attr("id");
                    a.publish("top_modal/before_init/" + q, [o]);
                    o.dialog({
                        autoOpen: false,
                        modal: true,
                        stack: true,
                        dialogClass: p,
                        show: {effect: "fade", duration: 250},
                        hide: {effect: "fade", duration: 300},
                        open: function () {
                            o.parent(".ui-dialog").addClass(q);
                            e.clearErrors(true);
                            j.hideAddHelperPlaceholder(false);
                            b(".ui-widget-overlay:not(.modal-hooked)").attr("class", "ui-widget-overlay modal-hooked topmodal-overlay modalid-" + q);
                            a.publish("top_modal/open/" + q, [o])
                        },
                        beforeClose: function () {
                            if (!o.is(":visible")) {
                                return
                            }
                            var r = j.getOptions();
                            b(".ui-widget-overlay.modalid-" + q).remove();
                            e.clearErrors(true);
                            e.clearErrors(o.css({overflow: "hidden"}).parent().css({overflow: "hidden"}));
                            a.publish("top_modal/before_close/" + q, [o])
                        },
                        close: function () {
                            b.ui.dialog.overlay.instances = [];
                            b.ui.dialog.overlay.oldInstances = [];
                            a.publish("top_modal/close/" + q, [o])
                        },
                        resizable: o.hasClass("resizeable"),
                        resize: function (s) {
                            var r = o.find("#form-cell-note");
                            if (r.length) {
                                r.trigger("keyup", [true]);
                                j.addCellNoteWidth(c, r.parent().width())
                            }
                        },
                        draggable: false,
                        zIndex: 3001,
                        width: o.width(),
                        height: o.height(),
                        minWidth: o.width(),
                        maxWidth: Math.max(o.width(), b(window).width() - 100)
                    });
                    o.on("click", ".tooltip-modal-titlebar .close", function (r) {
                        r.preventDefault();
                        var s = o.find(".buttons button.cancel");
                        if (s.length) {
                            s.trigger("click")
                        } else {
                            o.dialog("close")
                        }
                    })
                });
                a.$body.on("click", "[data-modal]", function (r) {
                    r.preventDefault();
                    var q = n.get("account");
                    var p = b(this).data("modal");
                    if ((p === "create-sitemap" || p === "save-as") && q.sitemaps_limit > -1 && q.sitemaps_count >= q.sitemaps_limit) {
                        h.error(a.__('Your {1} account needs to be <a href="{2}">upgraded</a> to create a new sitemap', q.name, n.get("payment_url", "#")));
                        return false
                    }
                    var o = b("#modal-" + p + ".modal");
                    if (!o.length) {
                        return a.noPermissions()
                    }
                    b(".modal").dialog("close");
                    o.find("form").each(function () {
                        if (b(this).attr("id") !== "export-tab") {
                            this.reset()
                        }
                    }).end().dialog("open").find(":text:first").focus()
                }).on("click", "[data-topmodal]", function (C) {
                    C.preventDefault();
                    var t = b(this);
                    var x = t.data("topmodal");
                    var y = b("#topmodal-" + x + ".top-modal");
                    if (!y.length) {
                        return a.noPermissions()
                    }
                    var D = y.parent();
                    var w = j.getCurrentCell();
                    var z = i.getElement(w, true);
                    var q = j.getOptions();
                    var p = false;
                    var v = false;
                    var u = b(".top-modal");
                    if (u.length) {
                        u.dialog("close")
                    }
                    D.removeClass("topFive linetext cell_color cell_text_color batchediting");
                    var F = {my: "center", at: "center", of: t};
                    if (t.hasClass("cellmodal")) {
                        F = {my: "right center", at: "left center", of: z, left_offset: -2};
                        if (t.hasClass("desc")) {
                            F = {my: "right top", at: "right bottom", of: z, top_offset: 3, left_offset: 10}
                        } else {
                            if (t.hasClass("url")) {
                                F = {my: "right top", at: "right bottom", of: z, top_offset: 3, left_offset: 10}
                            } else {
                                if (t.hasClass("archetype")) {
                                    F = {my: "left top", at: "left bottom", of: z, left_offset: -8, top_offset: 3}
                                }
                            }
                        }
                    } else {
                        if (t.hasClass("batchediting")) {
                            F = {my: "right top", at: "right bottom", of: t, left_offset: 20, top_offset: 10};
                            p = true;
                            D.addClass("batchediting");
                            v = true
                        } else {
                            if (t.parent().hasClass("batchediting")) {
                                F = {
                                    my: "right center",
                                    at: "left center",
                                    of: t.parent().find(".color-box").parent(),
                                    left_offset: -2
                                };
                                p = true;
                                D.addClass("batchediting");
                                v = true
                            }
                        }
                    }
                    var E = b(window).scrollTop();
                    D.removeData("li").removeData("type");
                    y.find("form").each(function () {
                        this.reset()
                    }).end().dialog("open");
                    var r = t.data("type") || false;
                    if (r) {
                        D.data("type", r)
                    }
                    if (!v) {
                        if (t.hasClass("linetext") && x === "farbtastic") {
                            D.addClass("topFive");
                            var A = t.data("color") || t.next("li").data("color");
                            if (A) {
                                A = A.replace(/[^0-9a-f]/gi, "");
                                if (A.length === 3 || A.length === 6) {
                                    b.farbtastic("#colorpicker").setColor("#" + A);
                                    b("#colorinput").val(A)
                                }
                            }
                        } else {
                            if (t.hasClass("custom") && x === "farbtastic") {
                                D.addClass("topFive").data("type", "custom");
                                var o = b("#sitemap-top form select").val();
                                if (o !== "all" && o) {
                                    var A = defaultColors[currentSection][o].replace(/[^0-9a-f]/gi, "");
                                    if (A.length === 3 || A.length === 6) {
                                        b.farbtastic("#colorpicker").setColor("#" + A);
                                        b("#colorinput").val(A)
                                    }
                                }
                            } else {
                                if (z && typeof z === "object" && z.length) {
                                    if (t.hasClass("color")) {
                                        D.addClass("cell_color");
                                        var A = i.getData(w, q.data_color) || j.getColorSchemeItem(w);
                                        if (A) {
                                            b.farbtastic("#colorpicker").setColor(g.toHex(A));
                                            b("#colorinput").val(A)
                                        }
                                        b('#topmodal-farbtastic input[type="reset"]').data("oldcolor", (A || ""));
                                        b("#topmodal-farbtastic").find("h1 > span").html(t.text())
                                    } else {
                                        if (t.hasClass("textcolor")) {
                                            D.addClass("cell_text_color");
                                            var A = i.getData(w, q.data_text_color) || j.getColorSchemeItem("text_color");
                                            if (A) {
                                                b.farbtastic("#colorpicker").setColor(g.toHex(A));
                                                b("#colorinput").val(A)
                                            }
                                            b('#topmodal-farbtastic input[type="reset"]').data("oldcolor", (A || ""));
                                            b("#topmodal-farbtastic").find("h1 > span").html(t.text())
                                        } else {
                                            if (t.hasClass("desc")) {
                                                var B = i.getData(w, q.data_desc) || "";
                                                b("#topmodal-cell-note").css({height: ""}).find(".note-text").html(B ? f.charsDecode(B) : "&nbsp;").show().end().find("textarea").val(B).height(b("#topmodal-cell-note .note-text").height()).hide().end().height(b("#topmodal-cell-note > div").outerHeight()).parent(".ui-tooltip-modal").css({
                                                    top: "+=13px",
                                                    left: "+=10px"
                                                });
                                                j.addCellNote(w, B);
                                                b("#note-edit").trigger("click")
                                            } else {
                                                if (t.hasClass("archetype")) {
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
                        if (t.hasClass("desc")) {
                            var B = b("#sitemap-batch-edit .ui-selectmenu.batchediting.desc").data("batchdata") || "";
                            b("#topmodal-cell-note").css({height: ""}).find(".note-text").html((B ? B : "&nbsp;")).show().end().find("textarea").val(B).height(b("#topmodal-cell-note .note-text").height()).hide().end().height(b("#topmodal-cell-note > div").outerHeight()).parent(".ui-tooltip-modal").css({
                                top: "+=13px",
                                left: "+=10px"
                            });
                            b("#note-edit").trigger("click")
                        } else {
                            if (t.hasClass("url")) {
                                var s = b("#sitemap-batch-edit .ui-selectmenu.batchediting.url").data("batchdata") || "http://";
                                b("#topmodal-cell-url").find("#form-cell-url").val(s).end().height(b("#topmodal-cell-url > div").outerHeight()).parent(".ui-tooltip-modal").css({
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
                            var G = t.removeClass("topFive").position();
                            t.data("lastLeft", G.left).data("lastTop", G.top)
                        },
                        drag: function (H, G) {
                            b(".top-modal-tip-error").css({
                                left: "+=" + (G.position.left - t.data("lastLeft")) + "px",
                                top: "+=" + (G.position.top - t.data("lastTop")) + "px"
                            });
                            t.data("lastLeft", G.position.left).data("lastTop", G.position.top)
                        }
                    });
                    if (r || D.hasClass("topFive")) {
                        y.find(".breset").val(a.__("Cancel"))
                    } else {
                        y.find(".breset").val(a.__("Reset"))
                    }
                    i.position(D[0], F, {
                        min: {top: 0, left: 0},
                        max: {left: a.$window.scrollLeft() + a.$window.width() - D.width() - 5}
                    }, p);
                    b(window).scrollTop(E);
                    y.find("input:visible:first").blur();
                    a.publish("top_modal/after_open/topmodal-" + x, [y, t])
                }).on("click", ".top-modal .close, .modal .close", function (p) {
                    p.preventDefault();
                    var o = b(this).closest(".top-modal, .modal");
                    if (o.attr("id") === "topmodal-farbtastic") {
                        return
                    }
                    o.dialog("close")
                }).on("click", ".modal-overlay", function () {
                    b(".modal").dialog("close")
                }).on("click", ".topmodal-overlay", function () {
                    return false
                })
            }
        }
        a.$main.on("submit", "form", function (o) {
            h.clearAll()
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/auth/login route/auth/index route/login route/forgot", function () {
        var e = a.require("form");
        var k = a.require("ajax");
        var n = a.require("http");
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
        var m;
        d.on("click", ".forgot", function (p) {
            p.preventDefault();
            var o = b(this);
            m = /username/i.test(o.html()) ? "username" : "password";
            o.closest("fieldset").fadeOut(400, function () {
                d.find("form").animate({height: "-=80", marginTop: "+=40"}, 400);
                b(this).next("fieldset").fadeIn(400);
                e.clearErrors()
            }).siblings("h1").find("span").fadeOut(400, function () {
                b(this).html(o.html()).fadeIn(400)
            })
        });
        a.$body.on("click", "#login-box:not(.close-form) .button", function (p) {
            p.preventDefault();
            b("#form-notify > a").trigger("click");
            var o = b(this);
            o.closest("fieldset").fadeOut(400, function () {
                d.find("form").animate({height: "+=80", marginTop: "-=40"}, 400);
                b(this).prev("fieldset").fadeIn(400);
                b("#forgot-form .input").find("input").val("").end().find("p").remove()
            }).siblings().prev("h1").find("span").fadeOut(400, function () {
                b(this).html(f).fadeIn(400)
            })
        });
        b("#forgot-form").on("click", 'input[type="submit"]', function (p) {
            p.preventDefault();
            k.clearAll();
            e.clearErrors();
            var o = b("#forgot-form > div.input > p");
            if (!o.length) {
                o = b("<p></p>").appendTo("#forgot-form > div.input")
            }
            o.hide();
            var q = b("#form-forgot").val();
            if (!q) {
                e.error(b("#form-forgot").parent("div"), a.__("Email must not be empty"))
            } else {
                k.request({
                    url: n.url(b("#forgot-form").data("action")),
                    $loading: b("#forgot-form .loading").css({visibility: "visible"}),
                    //data: {forgot: q, type: m},
                    //arieskienmendoza
                    data: {email: q, type: m},
                    //arieskienmendoza FIN
                    success: function (r) {
                        if (r.error) {
                            e.error(b("#form-forgot").parent("div"), a.__("No user found"))
                        } else {
                            b("#form-forgot").val("");
                            h.success(a.__("An email with instructions has been sent"))
                        }
                        if (r._nonce) {
                            a.updateNonce(r._nonce)
                        }
                    }
                })
            }
        });
        d.on("click", 'fieldset:first input[type="submit"]', function (s) {
            e.clearErrors();
            var q = b(this).next(".loading").css({visibility: "visible"});
            var r = b("#form-username");
            var p = b("#form-password");
            var o = e.validate([{
                value: r.val(),
                tiperror: r.parent(),
                rules: {empty: a.__("Username must not be empty")}
            }, {value: p.val(), tiperror: p.parent(), rules: {empty: a.__("Password must not be empty")}}]);
            if (!o) {
                q.css({visibility: "hidden"});
                return false
            }
            return true
        });
        d.on("keydown", "fieldset input", function (o) {
            if (o.keyCode && o.keyCode == 13) {
                o.preventDefault();
                b(this).closest("fieldset").find('input[type="submit"]').trigger("click")
            }
        });
        b("#form-notify").css({top: "+=2"});
        b('#login-box.forgot-form input[type="submit"]').on("click", function (q) {
            e.clearErrors();
            var p = b(this).next(".loading").css({visibility: "visible"});
            var s = b("#forgotpassword0");
            var r = b("#forgotpassword1");
            var o = e.validate([{
                value: s.val(),
                tiperror: s.parent(),
                rules: {empty: a.__("Password must not be empty")}
            }, {value: r.val(), tiperror: r.parent(), rules: {empty: a.__("Password must not be empty")}}]);
            if (o && s.val().length < 6) {
                e.error(s.parent(), a.__("Password must be at least 6 characters"));
                o = false
            }
            if (o && s.val() !== r.val()) {
                e.error(r.parent(), a.__("Passwords do not match"));
                o = false
            }
            if (!o) {
                p.css({visibility: "hidden"})
            }
            return o
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
Slickplan.module(function (b, a, c) {
    a.subscribe("route/account/payment route/squeeze", function () {
        var d = a.require("form");
        var e = a.require("websocket");
        var k = a.require("http");
        var h = a.require("config");
        var g = a.require("string");
        var j = b("#modal-archive");
        var f = b("#modal-archive-contributors");
        var i = b("#modal-archive-files");
        j.find(".table-scroll tr").css({cursor: "pointer"}).on("click", function () {
            var m = b(this).find(":checkbox");
            m.prop("checked", !m.is(":checked")).change()
        });
        f.find(".table-scroll tr").css({cursor: "pointer"}).on("click", function () {
            var m = b(this).find(":checkbox");
            m.prop("checked", !m.is(":checked")).change()
        });
        j.on("change", ":checkbox", function () {
            var m = j.data("limit") - j.find(":checkbox:checked").length;
            if (m <= 0) {
                j.data("submit", 1).find("h1 em").html(a.__("Done. Click Archive to continue."))
            } else {
                j.removeData("submit").find("h1 em").html(a.__("You need to archive <span>{1}</span> sitemaps to continue", m))
            }
        });
        f.on("change", ":checkbox", function () {
            var m = f.data("limit") - f.find(":checkbox:checked").length;
            if (m <= 0) {
                f.data("submit", 1).find("h1 em").html(a.__("Done. Click Deactivate to continue."))
            } else {
                f.removeData("submit").find("h1 em").html(a.__("You need to deactivate <span>{1}</span> users to continue", m))
            }
        });
        i.on("click", ".single-file", function (n) {
            b(this).toggleClass("selected");
            var m = i.data("limit");
            i.find(".single-file.selected").each(function () {
                var o = b(this).data("size");
                if (o) {
                    m -= parseInt(o, 10)
                }
            });
            if (m > 0) {
                i.removeData("submit").find("h1 em").html(a.__("You need to delete <span>{1}</span> of files to continue", g.humanReadableFileSize(m)))
            } else {
                i.data("submit", 1).find("h1 em").html(a.__("Done. Click Delete to continue."))
            }
        });
        j.on("submit", "form", function (o) {
            o.preventDefault();
            e.clearAll();
            if (j.data("submit") !== 1) {
                return false
            }
            var n = b(this);
            var m = d.serializeObject(n, [{name: "ajax", value: 1}]);
            e.request({
                url: k.url(n.attr("action")),
                data: m,
                $loading: n.find(".submit > .loading").css({visibility: "visible"}),
                success: function (p) {
                    if (p._nonce) {
                        a.updateNonce(p._nonce)
                    }
                    if (p.success && p.sitemaps !== c) {
                        j.removeData("submit").removeData("limit").dialog("close");
                        var q = h.get("account");
                        q.sitemaps_count = p.sitemaps;
                        h.set("account", q);
                        if (b("fieldset.existing").length) {
                            b("fieldset.existing").data("sitemaps", p.sitemaps)
                        }
                        b('#main form input[type="submit"]').trigger("click");
                        b('#squeeze #ccard > form input[type="submit"]').trigger("click")
                    } else {
                        if (p.error) {
                            _notify.error(p.error)
                        }
                    }
                }
            })
        });
        f.on("submit", "form", function (o) {
            o.preventDefault();
            e.clearAll();
            if (f.data("submit") !== 1) {
                return false
            }
            var n = b(this);
            var m = d.serializeObject(n, [{name: "ajax", value: 1}]);
            e.request({
                url: k.url(n.attr("action")),
                data: m,
                $loading: n.find(".submit > .loading").css({visibility: "visible"}),
                success: function (p) {
                    if (p._nonce) {
                        a.updateNonce(p._nonce)
                    }
                    if (p.success && p.contributors !== c) {
                        f.removeData("submit").removeData("limit").dialog("close");
                        var q = h.get("account");
                        q.contributors = p.contributors;
                        if (p.active_contributors !== c) {
                            q.active_contributors = p.active_contributors
                        }
                        h.set("account", q);
                        if (b("fieldset.existing").length) {
                            b("fieldset.existing").data("contributors", p.contributors)
                        }
                        b('#main form input[type="submit"]').trigger("click");
                        b('#squeeze #ccard > form input[type="submit"]').trigger("click")
                    } else {
                        if (p.error) {
                            _notify.error(p.error)
                        }
                    }
                }
            })
        });
        i.on("submit", "form", function (n) {
            n.preventDefault();
            e.clearAll();
            if (i.data("submit") !== 1) {
                return false
            }
            var m = [];
            i.find(".single-file.selected").each(function () {
                var o = b(this).data("file");
                if (o) {
                    m.push(o)
                }
            });
            if (m.length) {
                e.request({
                    data: {delete_files_permanently: m},
                    $loading: i.find(".submit > .loading").css({visibility: "visible"}),
                    success: function (o) {
                        if (typeof o.storage_used !== "undefined") {
                            i.removeData("submit").removeData("limit").dialog("close");
                            var p = h.get("account");
                            p.storage_used = o.storage_used;
                            h.set("account", p);
                            b('#main form input[type="submit"]').trigger("click");
                            b('#squeeze #ccard > form input[type="submit"]').trigger("click")
                        }
                    }
                })
            } else {
                b('#main form input[type="submit"]').trigger("click");
                b('#squeeze #ccard > form input[type="submit"]').trigger("click")
            }
        });
        j.on("click", "thead a[data-sort]", function (r) {
            r.preventDefault();
            var s = b(this).data("sort");
            var p = b(this).parent().hasClass("desc") ? "asc" : "desc";
            j.find("thead th").removeClass("desc asc");
            b(this).parent().addClass(p);
            var n = [];
            var q = [];
            j.find("tbody tr").each(function () {
                var t = b(this).data("time");
                if (s === "name") {
                    t = b(this).children("td:first").children("span").text().toLowerCase() + t
                }
                t += "" + Math.random();
                n[t] = b(this);
                q.push(t)
            });
            q.sort();
            if (p === "desc") {
                q.reverse()
            }
            var m = b("<tbody>");
            for (var o = 0; o < q.length; ++o) {
                m.append(n[q[o]].clone(true));
                n[q[o]].remove()
            }
            j.find("tbody").replaceWith(m)
        });
        f.on("click", "thead a[data-sort]", function (r) {
            r.preventDefault();
            var s = b(this).data("sort");
            var p = b(this).parent().hasClass("desc") ? "asc" : "desc";
            f.find("thead th").removeClass("desc asc");
            b(this).parent().addClass(p);
            var n = [];
            var q = [];
            f.find("tbody tr").each(function () {
                key = b(this).children("td:first").children("span").text().toLowerCase();
                key += "" + Math.random();
                n[key] = b(this);
                q.push(key)
            });
            q.sort();
            if (p === "desc") {
                q.reverse()
            }
            var m = b("<tbody>");
            for (var o = 0; o < q.length; ++o) {
                m.append(n[q[o]].clone(true));
                n[q[o]].remove()
            }
            f.find("tbody").replaceWith(m)
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        b("#modal-open").on("submit", "form", function (g) {
            g.preventDefault();
            var d = b(this);
            var f = d.attr("action");
            var h = d.find('select[name="version"]').val();
            if (h) {
                f = f.split("/");
                f[f.length - 1] = h;
                f = f.join("/")
            }
            a.require("http").redirect(f)
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var d = a.require("form");
        var e = a.require("websocket");
        b("#modal-save-as").on("submit", "form", function (h) {
            h.preventDefault();
            e.clearAll();
            d.clearErrors();
            var f = b(this);
            f.find(".input.error").removeClass("error");
            var j = f.find('input[name="clone[name]"]');
            var i = f.find('input[name="clone[version]"]');
            if (!j.val().length) {
                d.error(j.parent(), a.__("Sitemap name must not be empty"), {bottom: 6})
            } else {
                var g = f.closest(".modal");
                e.request({
                    data: {
                        clone: {
                            name: j.val(),
                            version: i.val(),
                            structure: a.require("sitemap").serialize()
                        }
                    }, "$loading": f.find(".loading").css({visibility: "visible"}), success: function (k) {
                        if (k.success && k.redirect) {
                            a.require("http").redirect(k.redirect)
                        } else {
                            if (k.error) {
                                a.require("notification").error(k.error)
                            }
                        }
                        g.dialog("close");
                        if (k._nonce) {
                            a.updateNonce(k._nonce)
                        }
                    }, error: function () {
                        g.dialog("close")
                    }
                })
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var d = a.require("form");
        var e = a.require("websocket");
        var f = a.require("notification");
        b("#modal-change-name, #modal-save-version").on("submit", "form", function (k) {
            k.preventDefault();
            e.clearAll();
            var g = b(this);
            var n = g.find('input[name="change[name]"]');
            var m = g.find('input[name="change[version]"]');
            d.clearErrors(g);
            var j = d.validate([{
                value: n.val(),
                tiperror: n.parent(),
                rules: {empty: a.__("Name must not be empty")},
                css: {bottom: 5}
            }, {
                value: m.val(),
                tiperror: m.parent(),
                rules: {
                    empty: a.__("Version must not be empty"),
                    regexp: [/^[0-9]+(\.[0-9]+)?$/, a.__("Invalid version number")]
                },
                css: {bottom: 5}
            }]);
            if (j) {
                var h = g.closest(".modal");
                var i = d.serializeObject(g);
                if (g.parent("#modal-save-version").length) {
                    i.change["structure"] = a.require("sitemap").serialize()
                }
                e.request({
                    data: i, $loading: g.find(".loading").css({visibility: "visible"}), success: function (o) {
                        if (o.success) {
                            if (o.redirect) {
                                a.require("http").redirect(o.redirect);
                                return
                            }
                            var p = "";
                            if (o.title !== c) {
                                b("#sitemap-name h1 > span, #sitemap-comments-top h1").text(o.title);
                                document.getElementById("form-change-name").defaultValue = o.title;
                                b("#form-saveversion-name").val(o.title);
                                p = "name"
                            }
                            if (o.version !== c) {
                                b("#sitemap-name h2, #sitemap-comments-top h2").text("Version " + o.version);
                                document.getElementById("form-change-version").defaultValue = o.version;
                                p = "version"
                            }
                            if (o.title !== c && o.version !== c) {
                                p = "name and version"
                            }
                            if (p) {
                                f.success(a.__("New sitemap " + p + " saved"))
                            }
                        } else {
                            if (o.error) {
                                f.error(o.error)
                            }
                        }
                        if (o._nonce) {
                            a.updateNonce(o._nonce)
                        }
                        h.dialog("close")
                    }, error: function () {
                        h.dialog("close")
                    }
                })
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var o = a.require("sitemap");
        var n = a.require("svg");
        var m = a.require("notification");
        var t = a.require("config");
        var f = a.require("scrollbar");
        var i = a.require("string");
        var r = a.require("helper");
        var s = b("#sitemap-batch-edit");
        var h = b("#batch-groups-new .new");
        var k = !(a.currentUserCan("batch_editing") && s.length);
        var d = "";
        var p = "";
        var q = {};

        function j() {
            f.init("#batch-groups-scroll", {trackSize: 207, updateOnResize: false})
        }

        function e(w) {
            if (!w || !r.isObject(w)) {
                w = {data: {}}
            } else {
                if (!w.data) {
                    w.data = {}
                }
            }
            var z = o.getBatchData();
            n.forEach(z.selected_cells, function (B, A) {
                o.toggleCellMaskHighlight(A, "disable", true)
            });
            o.resetBatchData(w.data);
            var v = o.getOptions();
            b("#batch-cell-names").val(w.data[v.data_text] ? w.data[v.data_text] : "");
            if (w.data[v.data_color]) {
                b("#sitemap-batch-edit .colors.batch-cell .color-box").css({
                    backgroundColor: w.data[v.data_color],
                    borderWidth: 0
                });
                o.batchChangeCellColor(w.data[v.data_color])
            } else {
                b("#action-batch-cell-color-reset").trigger("click")
            }
            if (w.data[v.data_text_color]) {
                b("#sitemap-batch-edit .colors.batch-text .color-box").css({
                    backgroundColor: w.data[v.data_text_color],
                    borderWidth: 0
                });
                o.batchChangeCellTextColor(w.data[v.data_text_color])
            } else {
                b("#action-batch-text-color-reset").trigger("click")
            }
            if (w.data[v.data_archetype]) {
                var y = w.data[v.data_archetype].replace(/^_/, "");
                b("#topmodal-cell-archetype").parent().addClass("batchediting").find(".types div.archetype.archetype-" + y).trigger("click")
            } else {
                s.find(".ui-selectmenu.batchediting.archetype > .ui-selectmenu-status").html(a.__("Add Page Type"));
                s.find(".icon.border").html("")
            }
            if (w.data[v.data_desc]) {
                s.find(".ui-selectmenu.batchediting.desc").data("batchdata", w.data[v.data_desc]).children(".ui-selectmenu-status").html(a.__("Edit Note"))
            } else {
                s.find(".ui-selectmenu.batchediting.desc").data("batchdata", "").children(".ui-selectmenu-status").html(a.__("Add Note"))
            }
            if (w.data[v.data_url]) {
                s.find(".ui-selectmenu.batchediting.url").data("batchdata", w.data[v.data_url]).children(".ui-selectmenu-status").html(a.__("Edit Link"))
            } else {
                s.find(".ui-selectmenu.batchediting.url").data("batchdata", "").children(".ui-selectmenu-status").html(a.__("Add Link"))
            }
            if (w.cells) {
                for (var x = 0, u = w.cells.length; x < u; ++x) {
                    o.toggleCellMaskHighlight(w.cells[x], "enable")
                }
            }
        }

        function g() {
            var u = o.getSerializedCellsGroups(true);
            var v = [];
            n.forEach(u, function (B, A) {
                A.id = B;
                v.push(A)
            });
            v.sort(function (B, A) {
                if (B && B.name && A && A.name) {
                    return ("" + B.name).localeCompare("" + A.name)
                }
            });
            var x = "";
            var y = v.length;
            if (y) {
                for (var w = 0; w < y; ++w) {
                    x += '<div data-id="' + v[w].id + '" class="group group-' + v[w].id + '">                        <i class="fa fa-trash-o" title="' + a.__("Delete") + '"></i>                        <i class="fa fa-pencil" title="' + a.__("Edit Name") + '"></i>                        <i class="fa fa-times"></i>                        <i class="fa fa-check"></i>                        <span>' + i.charsEncode(v[w].name) + "</span>                        </div>"
                }
            } else {
                x = "<p>" + a.__("No groups have been created.") + "</p>"
            }
            var z = b("#batch-groups-scroll .overview");
            if (!z.length) {
                z = b("#batch-groups-scroll")
            }
            z.html(x)
        }

        a.$window.on("load", function () {
            g()
        });
        b("#action-batch").on("click", function (u) {
            u.preventDefault();
            if (k) {
                return a.noPermissions()
            }
            if (o.isEditBlocked(c, "sitemap")) {
                return false
            }
            g();
            e();
            b("#sitemap-comments-top").addClass("isbatch");
            b("#sitemap-top").addClass("expanded-batch");
            b("#sitemap-wrapper").addClass("batchedit");
            b("#batch-groups-scroll, #batch-groups-scroll .overview, #batch-groups-scroll .group").removeClass("selected");
            b("#sitemaptop-wrapper-helper").removeClass("comments-open batch-open").addClass("batch-open");
            o.batchEditStart();
            j()
        });
        b("#sitemap-comments-top").on("click", "button.submit", function (v) {
            v.preventDefault();
            if (k) {
                return a.noPermissions()
            }
            if (o.isEditBlocked(c, "sitemap")) {
                return false
            }
            if (b(this).hasClass("isbatch") || b("#sitemap-wrapper").hasClass("batchedit")) {
                if (h.is(":visible") || h.hasClass("edit")) {
                    h.find('button[type="submit"]').trigger("click")
                }
                var u = b("#batch-groups-scroll .group.selected");
                if (u.length) {
                    u.find(".fa-check").trigger("click")
                }
            }
            b("#sitemap-wrapper").removeClass("batchedit");
            b("#sitemap-top").removeClass("expanded expanded-batch");
            b("#sitemaptop-wrapper-helper").removeClass("batch-open");
            o.batchEditStop(true)
        }).on("click", "button.reset", function (w) {
            w.preventDefault();
            if (b(this).hasClass("isbatch") || b("#sitemap-wrapper").hasClass("batchedit")) {
                var v = b("#batch-groups-scroll .group.selected");
                var x = o.getBatchData();
                var u = false;
                if (x && x.changes) {
                    n.forEach(x.changes, function () {
                        u = true;
                        return false
                    })
                }
                if (v.length && u) {
                    r.confirmDialog({
                        close: true,
                        title: a.__("One question before you go."),
                        text: a.__("You have made some saved changes to a group. Would you like to save them?"),
                        on_yes: function () {
                            if (h.is(":visible") || h.hasClass("edit")) {
                                h.find('button[type="reset"]').trigger("click")
                            }
                            if (v.length) {
                                v.find(".fa-check").trigger("click")
                            }
                            b("#sitemap-wrapper").removeClass("batchedit");
                            b("#sitemap-top").removeClass("expanded expanded-batch");
                            b("#sitemaptop-wrapper-helper").removeClass("batch-open");
                            o.batchEditStop()
                        },
                        on_no: function () {
                            if (h.is(":visible") || h.hasClass("edit")) {
                                h.find('button[type="reset"]').trigger("click")
                            }
                            if (v.length) {
                                v.find(".fa-times").trigger("click")
                            }
                            b("#sitemap-wrapper").removeClass("batchedit");
                            b("#sitemap-top").removeClass("expanded expanded-batch");
                            b("#sitemaptop-wrapper-helper").removeClass("batch-open");
                            o.batchEditStop()
                        }
                    })
                } else {
                    if (u) {
                        r.confirmDialog({
                            id: "batch_button_reset",
                            checkbox: true,
                            title: a.__("You have changes pending! Are you sure you want to cancel?"),
                            text: a.__("Your changes will be lost."),
                            on_yes: function () {
                                if (h.is(":visible") || h.hasClass("edit")) {
                                    h.find('button[type="reset"]').trigger("click")
                                }
                                b("#sitemap-wrapper").removeClass("batchedit");
                                b("#sitemap-top").removeClass("expanded expanded-batch");
                                b("#sitemaptop-wrapper-helper").removeClass("batch-open");
                                o.batchEditStop()
                            }
                        })
                    } else {
                        b("#sitemap-wrapper").removeClass("batchedit");
                        b("#sitemap-top").removeClass("expanded expanded-batch");
                        b("#sitemaptop-wrapper-helper").removeClass("batch-open");
                        o.batchEditStop()
                    }
                }
            }
        });
        s.on("focus", "#batch-cell-names", function (u) {
            d = b.trim(this.value)
        }).on("blur", "#batch-cell-names", function (v) {
            var u = b.trim(this.value);
            if (u !== d && u !== "") {
                o.batchTextEdit(u)
            }
        }).on("keydown.return", "#batch-cell-names", function (v) {
            var u = b.trim(this.value);
            if (u !== "") {
                o.batchTextEdit(u)
            }
        }).on("click", "#batch-delete-all", function (u) {
            var v = o.getBatchData();
            if (v.selected_cells_count > 0) {
                r.confirmDialog({
                    id: "batch_delete_cells",
                    checkbox: true,
                    title: a.__("Would you like to delete selected pages?"),
                    on_yes: function () {
                        o.batchRemoveCell()
                    }
                })
            } else {
                m.error(__("Select pages to delete"), {persistent: false})
            }
        }).on("click", "#action-batch-cell-color-reset", function (u) {
            b("#sitemap-batch-edit .colors.batch-cell .color-box").css({
                backgroundColor: "transparent",
                borderWidth: "1px"
            });
            o.batchRemoveCellColor()
        }).on("click", "#action-batch-text-color-reset", function (u) {
            b("#sitemap-batch-edit .colors.batch-text .color-box").css({
                backgroundColor: "transparent",
                borderWidth: "1px"
            });
            o.batchRemoveCellTextColor()
        }).on("click", "#batch-groups-new > button", function (w) {
            w.preventDefault();
            var x = o.getBatchData();
            if (x.selected_cells_count > 1) {
                var u = o.getCellGroupCells();
                var v = false;
                if (u.length) {
                    u = u.join(" ");
                    n.forEach(x.selected_cells, function (y) {
                        if (u.indexOf(y) >= 0) {
                            v = true;
                            return false
                        }
                    })
                }
                if (v) {
                    m.error(__("Some of the selected pages are already in a group"), {persistent: false})
                } else {
                    h.removeClass("edit editing").show().find("#form-cells_group_name").val("")[0].focus()
                }
            } else {
                m.error(__("Select at least two pages to create a group"), {persistent: false})
            }
        }).on("click", '#batch-groups-new button.circle[type="reset"]', function (u) {
            u.preventDefault();
            h.removeClass("edit editing").hide();
            b("#batch-delete-all").show()
        }).on("click", '#batch-groups-new button.circle[type="submit"]', function (u) {
            u.stopPropagation();
            u.preventDefault();
            var x = b.trim(b("#form-cells_group_name").val());
            if (x) {
                if (h.hasClass("edit")) {
                    o.updateCellsGroup(p, x);
                    g();
                    j()
                } else {
                    var v = o.getBatchData();
                    var w = o.addCellsGroup(x, v.changes);
                    g();
                    j();
                    b("#batch-groups-scroll .group.group-" + w).children("span").trigger("click")
                }
                h.hide()
            }
            b("#batch-delete-all").show()
        }).on("click", "#batch-groups-scroll .group .fa-times", function (y) {
            y.preventDefault();
            var x = b(this).closest(".group");
            if (!x.hasClass("selected")) {
                return false
            }
            var v = o.getCellsGroupData(x.data("id"));
            if (v && v.cells) {
                for (var w = 0, u = v.cells.length; w < u; ++w) {
                    o.toggleCellMaskHighlight(v.cells[w], "disable")
                }
            }
            x.removeClass("selected").parent().removeClass("selected");
            e();
            h.hide();
            b("#batch-delete-all").show();
            q = {};
            x.trigger("mouseenter")
        }).on("click", "#batch-groups-scroll .group .fa-check", function (w, u) {
            w.preventDefault();
            var v = b(this).closest(".group");
            if (!v.hasClass("selected")) {
                return false
            }
            var x = o.getBatchData();
            if (x) {
                if (x.selected_cells_count > 0) {
                    n.forEach(x.selected_cells, function (z, y) {
                        o.batchSaveAllCellDatas(y)
                    })
                }
                if (x.changes) {
                    o.updateCellsGroup(p, c, x.changes, true)
                }
            }
            v.removeClass("selected").parent().removeClass("selected");
            e();
            h.hide();
            if (!u) {
                v.trigger("mouseenter")
            }
        }).on("click", "#batch-groups-scroll .group .fa-pencil", function (v) {
            v.preventDefault();
            var u = b(this).closest(".group");
            p = u.data("id");
            h.removeClass("editing").addClass("edit").show().find("#form-cells_group_name").val(u.children("span").text()).putCursorAtEnd()
        }).on("click", "#batch-groups-scroll .fa-trash-o", function (v, x) {
            v.stopPropagation();
            v.preventDefault();
            var u = b(this).closest(".group");
            var w = u.data("id");
            if (x === "yes") {
                o.removeCellsGroup(w);
                u.remove();
                g();
                j()
            } else {
                r.confirmDialog({
                    id: "batch_delete_group",
                    checkbox: true,
                    title: a.__("Would you like to delete the selected group?"),
                    text: a.__("This will not remove the pages from your sitemap. This action can not be undone."),
                    on_yes: function () {
                        if (w) {
                            b("#batch-groups-scroll .group.group-" + w + " .fa-trash-o").trigger("click", ["yes"])
                        }
                    }
                })
            }
        }).on("mouseenter", "#batch-groups-scroll .group", function (y) {
            var x = b(this);
            if (x.hasClass("selected") || x.parent().hasClass("selected")) {
                return false
            }
            var A = x.data("id");
            var z = o.getBatchData();
            if (z.selected_cells_count > 0) {
                n.forEach(z.selected_cells, function (C, B) {
                    o.toggleCellMaskHighlight(B, "disable", true)
                })
            }
            var v = o.getCellsGroupData(A);
            if (v && v.cells) {
                for (var w = 0, u = v.cells.length; w < u; ++w) {
                    o.toggleCellMaskHighlight(v.cells[w], "enable", true)
                }
            }
        }).on("mouseleave", "#batch-groups-scroll .group", function (y) {
            var x = b(this);
            if (x.hasClass("selected") || x.parent().hasClass("selected")) {
                return false
            }
            var A = x.data("id");
            var v = o.getCellsGroupData(A);
            if (v && v.cells) {
                for (var w = 0, u = v.cells.length; w < u; ++w) {
                    o.toggleCellMaskHighlight(v.cells[w], "disable", true)
                }
            }
            var z = o.getBatchData();
            if (z.selected_cells_count > 0) {
                n.forEach(z.selected_cells, function (C, B) {
                    o.toggleCellMaskHighlight(B, "enable", true)
                })
            }
        }).on("click", "#batch-groups-scroll .group > span", function (x, u) {
            x.stopPropagation();
            x.preventDefault();
            var w = b(this).closest(".group");
            if (w.hasClass("selected") || w.parent().hasClass("selected")) {
                return false
            }
            var y = w.data("id");
            var v = o.getCellsGroupData(y);
            if (y && v) {
                w.addClass("selected").parent().addClass("selected");
                b("#batch-delete-all").hide();
                p = y;
                q = b.extend({}, v);
                h.removeClass("edit").addClass("editing").show().find(".name").text(b(this).text());
                if (u) {
                    if (!r.isObject(v)) {
                        v = {data: {}}
                    } else {
                        if (!v.data) {
                            v.data = {}
                        }
                    }
                    o.resetBatchData(v.data);
                    o.cellEditGroupStart(y)
                } else {
                    e(v)
                }
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap route/plainsitemap", function (N) {
        if (N.type === "route/sitemap") {
            var v = a.require("websocket")
        } else {
            var v = a.require("ajax")
        }
        var h = a.require("http");
        var r = a.require("config");
        var S = a.require("string");
        var G = a.require("svg");
        var g = a.require("sitemap");
        var P = a.require("helper");
        var R = a.require("scrollbar");
        var d = a.require("notification");
        var j = r.get("allow_edit", false);
        var m;
        var p;
        var z = {};
        var A = 0;
        var O = 0;
        var s = 0;
        var M = 0;
        var q = null;
        var H = false;
        var f = {extension: [], size: [], other: []};
        var E = !(N.type === "route/sitemap" && j);
        var t = (N.type === "route/plainsitemap");
        if (!t) {
            var x = new nicEditor();
            if (window.document.getElementById("form-lightbox-comment")) {
                x.panelInstance("form-lightbox-comment")
            }
        }
        var Q = b("#lightbox-cell-files");
        var C = Q.find(".files-thumbs > .thumbs");
        var L = Q.find("#lightbox-scroll-area");
        var k = function () {
            Q.find(".toolbar").css({visibility: "hidden"}).end().find(".file-preview .wrapper").empty().end().find(".files-thumbs .thumb").remove().end().find(".error a.close").trigger("click")
        };
        var I = function (U) {
            var e = b("<div />").attr("class", "thumb");
            if (U && U.alias) {
                var T = U.url_thumb ? U.url_thumb : U.url_preview;
                e.attr("id", "thumb-" + U.alias).data("file", U.alias).html(b("<img/>").attr("src", T)).append('<div class="delete"><i class="fa fa-times"></i></div>')
            } else {
                e.attr("id", "thumb-" + U.id).data("file", U.id).addClass("loads").html('<div class="progress"></div><i class="fa fa-refresh fa-spin"></i>')
            }
            C.find(".container").append(e);
            F(true)
        };
        var B = function (e) {
            if (e === "empty" || e === "loads" || e === "files" || e === "library") {
                Q.removeClass("empty loads files library").addClass(e)
            }
        };
        var w = function (V, W) {
            B("files");
            s = 0;
            A = 0;
            z = {};
            for (var U = 0, T = V.length; U < T; ++U) {
                z[V[U].alias] = V[U];
                ++A;
                I(V[U])
            }
            if (A > 0) {
                Q.find(".toolbar").css({visibility: "visible"});
                var e = [];
                if (W) {
                    e = C.find("#thumb-" + W + ":not(.loads)")
                }
                if (!e.length) {
                    e = C.find(".thumb:not(.loads):first")
                }
                e.trigger("click")
            }
        };
        var i = function (e) {
            var T = Q.find("#lightbox-scroll-files").empty();
            if (!e) {
                e = []
            }
            v.request({
                data: {get_cell_files_library: "library", cell_id: m}, success: function (V) {
                    html = '<div class="clearfix">';
                    if (V && V.success && V.files) {
                        for (var X = 0, W = V.files.length; X < W; ++X) {
                            if (V.files[X] && V.files[X].alias && b.inArray(V.files[X].alias, e) < 0) {
                                var U = V.files[X].url_thumb ? V.files[X].url_thumb : V.files[X].url_preview;
                                html += '<div class="single-file single-file-' + V.files[X].alias + '" data-file="' + V.files[X].alias + '"><img src="' + U + '"><div class="selected"><i class="fa fa-check"></i></div></div>'
                            }
                        }
                    }
                    html += "</div>";
                    T.html(html);
                    D(T)
                }
            })
        };
        var n = function () {
            var e = Math.max(Q.height(), a.$window.height());
            var V = Q.find(".title").outerHeight(true) + Q.find(".toolbar").outerHeight(true) + Q.find(".files-thumbs").outerHeight(true) + 21;
            P.addCssRule("#lightbox-cell-files .file-preview img", "max-height: " + Math.floor(e - V) + "px !important", true);
            var W = ["wrapper", "viewport"];
            for (var U = 0, T = W.length; U < T; ++U) {
                P.addCssRule("#lightbox-cell-files .commentsarea ." + W[U], "height: " + Math.floor(e - 345) + "px !important", true);
                P.addCssRule("#lightbox-cell-files .library ." + W[U], "height: " + Math.floor(e - 196) + "px !important", true)
            }
            F()
        };
        var F = function (V) {
            var T = C.parent();
            var e = C.find(".thumb:visible").length * 69;
            if (e > T.width() - (t ? 0 : 69)) {
                T.addClass("withnav");
                if (V) {
                    var U = (C.find(".thumb:visible").length * 69) - C.find(".container-wrapper").width();
                    U = Math.ceil(U / 69) * 69;
                    O = U;
                    C.find(".container").css("margin-left", -U)
                }
            } else {
                T.removeClass("withnav");
                C.find(".container").css("margin-left", "")
            }
        };
        var D = function (e, T) {
            e.removeData("plugin_tinyscrollbar").removeClass("tinyscrollbar-enabled");
            R.init(e);
            if (!T) {
                T = "top"
            }
            R.update(e, T);
            setTimeout(function () {
                R.update(e, T)
            }, 50)
        };
        var u = function (T, e, W) {
            s = 0;
            if (!T || !e) {
                var U = []
            } else {
                var U = b("#sitemap-comments .item.hasfile.hasfile-" + T + ".hasfile-cell-" + e);
                if (U.length) {
                    s = U.data("id");
                    if (s) {
                        U = U.siblings(".group-" + s)
                    }
                }
            }
            if (U && U.length) {
                var V = "";
                U.each(function () {
                    V += b(this).html()
                });
                Q.find(".nocomments").hide();
                Q.find(".commentsarea").css("display", "table");
                L.html(V);
                D(L, W)
            } else {
                s = 0;
                Q.find(".nocomments").css("display", "table");
                Q.find(".commentsarea").hide()
            }
        };
        var K = function (e) {
            d.error(e, {scroll: false, css: {top: 0}, icon: false, html: true}, Q.find(".error:first"))
        };
        var J = null;
        var o = function () {
            var W = [];
            if (f.extension.length) {
                var V = "";
                for (var T = 0, e = f.extension.length; T < e; ++T) {
                    if (T === 0) {
                        V += f.extension[T]
                    } else {
                        if (T + 1 === e) {
                            V += " or " + f.extension[T]
                        } else {
                            V += ", " + f.extension[T]
                        }
                    }
                }
                W.push(a.__("Can't upload {1}. Image (JPG, PNG, GIF) files only", V))
            }
            if (f.size.length) {
                var V = "";
                for (var T = 0, e = f.size.length; T < e; ++T) {
                    if (T === 0) {
                        V += f.size[T]
                    } else {
                        if (T + 1 === e) {
                            V += " or " + f.size[T]
                        } else {
                            V += ", " + f.size[T]
                        }
                    }
                }
                var U = S.humanReadableFileSize(r.get("cell_file_maxsize", 5242880));
                W.push(a.__("Can't upload {1}. Maximum file size: {2}", V, U))
            }
            if (f.other.length) {
                for (var T = 0, e = f.other.length; T < e; ++T) {
                    W.push(f.other[T])
                }
            }
            f = {extension: [], size: [], other: []};
            if (W.length) {
                K(W.join("<br>"))
            }
        };
        var y = function () {
            var T = r.get("account");
            if (T.type_id == 4) {
                var e = a.__('File storage limit exceeded. <a href="{1}" target="_blank">Contact support</a> for additional options', "http://slickplan.cu:8000/contact")
            } else {
                var e = a.__('File storage limit exceeded. <a href="{1}">Upgrade</a> your plan for additional space', r.get("payment_url", "#"))
            }
            K(e)
        };
        Q.on("click", "button.circle.reset", function (T) {
            T.preventDefault();
            a.publish("sitemap/lightbox_cell_files/close")
        }).on("click", ".files-thumbs .thumb:not(.current)", function (T) {
            T.preventDefault();
            var V = b(this);
            var U = V.data("file");
            if (U && typeof z[U] === "object" && typeof z[U].date === "string") {
                M = U;
                V.addClass("current").siblings(".thumb").removeClass("current");
                b("#lightbox-uploaded-date").text(z[U].date);
                b("#lightbox-uploaded-time").text(z[U].time);
                b("#lightbox-uploaded-by").text(z[U].user);
                b("#lightbox-file-name").text(z[U].name);
                b("#lightbox-file-size").text(S.humanReadableFileSize(z[U].size));
                Q.find(".file-preview .wrapper").html(b("<img/>").attr("src", z[U].url_preview));
                if (!t) {
                    b("#form-lightbox-comment-cell-id").val(m);
                    b("#form-lightbox-comment-file-id").val(U);
                    u(U, m)
                }
            }
        }).on("click", "button.download, button.viewfull", function (V) {
            V.preventDefault();
            var U = C.find(".current").data("file");
            if (U && typeof z[U] === "object" && z[U]) {
                var T = null;
                if (b(this).hasClass("download")) {
                    T = z[U].url_download
                } else {
                    T = z[U].url_full
                }
                if (T) {
                    window.open(T)
                }
            }
        }).on("click", ".files-thumbs .thumb .delete", function (T) {
            T.preventDefault();
            var V = b(this).closest(".thumb");
            var U = V.data("file") || V.attr("id").replace("thumb-", "");
            if (U && typeof z[U] === "object" && typeof z[U].data_id === "number") {
                P.confirmDialog({
                    close: true,
                    title: a.__("Are you sure you want to delete?"),
                    yes_label: a.__("Yes, delete"),
                    checkboxes: [{id: "save_image", label: a.__("Save files for later use?")}, {
                        id: "save_comments",
                        label: a.__("Save comments?")
                    }],
                    on_yes: function (e, W) {
                        V.hide();
                        F();
                        v.request({
                            data: {
                                remove_cell_file: z[U].data_id,
                                remove_permanently: W.save_image ? 0 : 1,
                                remove_comments: W.save_comments ? 0 : 1
                            }, success: function (X) {
                                z[U] = c;
                                delete z[U];
                                --A;
                                V.remove();
                                var Y = C.find(".thumb:not(.loads):first");
                                if (Y.length) {
                                    Y.trigger("click")
                                } else {
                                    B("empty");
                                    k()
                                }
                                if (!W.save_comments) {
                                    b("#sitemap-comments .item.hasfile-" + U + ".hasfile-cell-" + m + " .foot a[data-delete]").trigger("click")
                                }
                            }, error: function () {
                                V.show();
                                F()
                            }
                        })
                    }
                })
            }
        }).on("click", ".thumbs .prev, .thumbs .next", function (W) {
            var T = (C.find(".thumb:visible").length * 69) - C.find(".container-wrapper").width();
            T = Math.ceil(T / 69) * 69;
            var U = b(this).hasClass("next") ? 69 : -69;
            U *= 4;
            var V = Math.max(0, Math.min(T, O + U));
            O = V;
            C.find(".container").css("margin-left", -V)
        }).on("submit", "#lightbox-post-comment", function (V) {
            V.preventDefault();
            if (M && z && z[M]) {
                var T = b("#post-comment");
                var X = b("#form-comment");
                X.val(b("#form-lightbox-comment").val());
                var W = T.find('input[name="cell_data_id"]');
                if (!W.length) {
                    W = b('<input type="hidden" name="cell_data_id">').appendTo(T)
                }
                W.val(z[M].data_id);
                var U = b("#lightbox-post-comment .submit .loading").css("visibility", "visible");
                T.trigger("submit", [function () {
                    W.remove();
                    X.val();
                    x.instanceById("form-lightbox-comment").setContent("");
                    x.instanceById("form-lightbox-comment").saveContent();
                    U.css("visibility", "hidden");
                    u(M, m, "bottom")
                }])
            }
        }).on("click", ".commentsarea .foot a", function (T) {
            T.preventDefault();
            if (M) {
                var U = b(this).data("delete");
                b("#scroll-area #comment-item-" + U + " .foot a[data-delete]").trigger("click", [function () {
                    u(M, m, "relative")
                }])
            }
        }).on("click", ".error a.close", function (T) {
            T.preventDefault();
            b(this).parent().stop().animate({opacity: 0, height: 0}, 400, function () {
                b(this).hide()
            })
        }).on("click", "#lightbox-scroll-files .single-file", function (T) {
            T.preventDefault();
            b(this).toggleClass("selected")
        }).on("click", ".openlibrary", function (U) {
            U.preventDefault();
            q = Q.hasClass("files") ? "files" : "empty";
            B("library");
            var T = [];
            if (q === "files") {
                C.find(".thumb").each(function () {
                    var e = b(this).data("file") || $thumb.attr("id").replace("thumb-", "");
                    if (e) {
                        T.push(e)
                    }
                })
            }
            i(T)
        }).on("click", ".library button.cancel", function (T) {
            T.preventDefault();
            if (!q) {
                q = "empty"
            }
            Q.find(".library .single-file").remove();
            B(q);
            q = null
        }).on("click", ".library button.add", function (U) {
            U.preventDefault();
            var T = [];
            Q.find(".library .single-file.selected").each(function () {
                var e = b(this).data("file");
                if (e) {
                    T.push(e)
                }
            });
            if (T.length) {
                v.request({
                    data: {assign_cell_files: T, cell_id: m}, success: function (V) {
                        if (V && V.files && V.files.length > 0) {
                            var e = null;
                            for (var X = 0, W = V.files.length; X < W; ++X) {
                                z[V.files[X].alias] = V.files[X];
                                if (X === 0) {
                                    e = V.files[X].alias
                                }
                            }
                            var Y = [];
                            b.each(z, function (Z, aa) {
                                Y.push(aa)
                            });
                            k();
                            q = null;
                            Q.find(".library .single-file").remove();
                            w(Y, e)
                        } else {
                            Q.find(".library button.cancel").trigger("click")
                        }
                    }
                })
            } else {
                Q.find(".library button.cancel").trigger("click")
            }
        }).on("click", ".library button.remove", function (U) {
            U.preventDefault();
            var T = [];
            Q.find(".library .single-file.selected").each(function () {
                var e = b(this).data("file");
                if (e) {
                    T.push(e);
                    b("#thumb-" + e).remove()
                }
                b(this).remove()
            });
            if (T.length) {
                v.request({data: {delete_files_permanently: T}});
                D(Q.find("#lightbox-scroll-files"))
            } else {
                Q.find(".library button.cancel").trigger("click")
            }
        }).on("click", ".upload-button", function (U) {
            U.preventDefault();
            var T = r.get("account");
            if (T.storage_limit <= T.storage_used) {
                y()
            } else {
                H = true;
                P.confirmDialog({
                    close: true,
                    title: a.__("Add new file/s"),
                    yes_label: "Upload New",
                    no_label: "From Library",
                    on_no: function () {
                        Q.find(".openlibrary").trigger("click")
                    }
                })
            }
        });
        b("#sitemap-comments").on("click", ".item.hasfile .comment img", function () {
            var e = b(this).closest(".item");
            a.publish("sitemap/lightbox_cell_files/open", [e.data("cell-id"), e.data("file-id")])
        });
        a.subscribe("modal/open/modal-confirm", function (V, T) {
            a.publish("upload/dynamic_uploader/destroy", ["library_upload_new"]);
            T.find("#modal-confirm-submit").removeData();
            if (H) {
                var W = T.find("#modal-confirm-submit").removeData();
                var U = b("#pluploadcellfile").data();
                b.each(U, function (e, X) {
                    W.attr("data-" + e, X)
                });
                a.publish("upload/dynamic_uploader/init", [W.get(0), "pluploadcellfile", "library_upload_new"])
            }
        });
        a.subscribe("modal/close/modal-confirm", function (U, T) {
            if (H) {
                H = false
            }
        });
        a.subscribe("sitemap/lightbox_cell_files/open", function (V, T, U) {
            m = (T && T.id) ? T.id : T;
            A = 0;
            s = 0;
            M = 0;
            /*xx =a.require("config");
            sitemap_id = xx.get("route")[2];*/
            z = {};
            if (m) {
                var W = G.getData(m, g.getOption("data_text"));
                if (W) {
                    k();
                    b("#lightbox-cell-name").text(W);
                    u(false);
                    n();
                    v.request({
                        data: {get_cell_files:1 , cell_id: m}, success: function (e) { //osvaldo
                            Q.attr("class", "show loads " + m).stop().css({top: a.$window.height()}).animate({top: 0}, 500, "easeOutQuad");
                            if (Q.hasClass(m)) {
                                Q.removeClass(m);
                                if (e && e.files && e.files.length) {
                                    w(e.files, U)
                                } else {
                                    if (E) {
                                        a.publish("sitemap/lightbox_cell_files/close")
                                    } else {
                                        B("empty")
                                    }
                                }
                            }
                        }, error: function () {
                            a.publish("sitemap/lightbox_cell_files/close")
                        }
                    })
                }
            }
        });
        a.subscribe("sitemap/lightbox_cell_files/close", function (T) {
            Q.stop().css({top: 0}).animate({top: a.$window.height()}, 300, "easeInCubic", function () {
                Q.removeAttr("class");
                k();
                if (!E) {
                    if (A > 0) {
                        g.addCellData(m, g.getOption("data_file"), 1)
                    } else {
                        g.removeCellData(m, g.getOption("data_file"))
                    }
                }
                M = 0;
                m = null;
                z = {};
                u(false)
            })
        });
        a.subscribe("upload/post_init_pluploadcellfile", function (W, V, U, T) {
            p = V
        });
        a.subscribe("upload/files_added_pluploadcellfile upload/files_added_pluploadcellfile2", function (W, V, U, T) {
            if (!Q.hasClass("files")) {
                w([])
            }
            v.request({
                data: {get_cell_files_storage_left: 1}, success: function (X) {
                    var e = 0;
                    if (X && typeof X.free_space === "number") {
                        e = X.free_space
                    }
                    for (var Z = 0, Y = U.length; Z < Y; ++Z) {
                        e -= U[Z].size
                    }
                    if (e > 0) {
                        for (var Z = 0, Y = U.length; Z < Y; ++Z) {
                            I(U[Z])
                        }
                        V.start()
                    } else {
                        y()
                    }
                }
            })
        });
        a.subscribe("upload/file_before_upload_pluploadcellfile upload/file_before_upload_pluploadcellfile2", function (W, V, T) {
            var X = r.get("s3");
            if (X && X.folder) {
                var U = ".";
                if (T.type) {
                    if (/^image\/(png|gif|jpe?g)$/i.test(T.type)) {
                        V.settings.multipart_params["Content-Type"] = T.type;
                        U += T.type.split("/").pop().toLowerCase()
                    }
                }
                if (U === ".") {
                    U += T.name.split(".").pop().toLowerCase()
                }
                V.settings.multipart_params.key = X.folder + "/" + S.random(32) + "_" + Math.floor(Date.now() / 1000) + U;
                V.settings.multipart_params.Filename = V.settings.multipart_params.key
            }
        });
        a.subscribe("upload/file_uploaded_pluploadcellfile upload/file_uploaded_pluploadcellfile2", function (W, V, U, X, T) {
            if (X) {
                V.stop();
                setTimeout(function () {
                    v.request({
                        data: {
                            cell_file_details: {name: U.name, size: U.size, type: U.type},
                            cell_file_s3: X,
                            cell_id: m
                        }, success: function (Y) {
                            if (typeof Y === "object") {
                                if (Y.success && Y.file && Y.file.alias) {
                                    var e = Y.file.url_thumb ? Y.file.url_thumb : Y.file.url_preview;
                                    C.find("#thumb-" + U.id).attr("id", "thumb-" + Y.file.alias).data("file", Y.file.alias).removeClass("loads").html(b("<img />").attr("src", e)).append('<div class="delete"><i class="fa fa-times"></i></div>');
                                    z[Y.file.alias] = Y.file;
                                    ++A;
                                    if (Q.find(".toolbar").css("visibility") === "hidden") {
                                        Q.find(".toolbar").css({visibility: "visible"});
                                        b("#thumb-" + Y.file.alias).trigger("click")
                                    }
                                    V.start()
                                } else {
                                    if (Y.error && Y.free_space <= 0) {
                                        y();
                                        C.find("#thumb-" + U.id).remove()
                                    }
                                }
                            }
                        }, error: function () {
                            f.other.push("Error creating a thumbnail of " + U.name);
                            v.request({
                                data: {remove_cell_file: U.id, remove_permanently: 1, remove_comments: 0},
                                success: function () {
                                    V.start()
                                },
                                error: function () {
                                    V.start()
                                }
                            });
                            C.find("#thumb-" + U.id).remove();
                            clearTimeout(J);
                            J = setTimeout(function () {
                                o()
                            }, 100)
                        }
                    })
                }, 100)
            }
            V.refresh()
        });
        a.subscribe("upload/error_pluploadcellfile upload/error_pluploadcellfile2", function (W, V, U, T) {
            switch (U.message) {
                case"File extension error.":
                    f.extension.push(U.file.name);
                    break;
                case"File size error.":
                    f.size.push(U.file.name);
                    break;
                default:
                    f.other.push(U.file.name + ": " + U.message)
            }
            clearTimeout(J);
            J = setTimeout(function () {
                o()
            }, 100)
        });
        a.subscribe("upload/uploads_progress_pluploadcellfile upload/uploads_progress_pluploadcellfile2", function (W, V, U, T) {
            C.find("#thumb-" + U.id + " .progress").css("width", U.percent + "%")
        });
        a.subscribe("sitemap/container_refreshed", function () {
            if (Q.is(":visible")) {
                n()
            }
        });
        a.$window.on("resize", function () {
            if (Q.is(":visible")) {
                n()
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var e = a.require("sitemap");
        var d = a.require("form");
        var f = a.require("string");
        b("#modal-cells-clone").on("click", ".submit > input", function (p) {
            p.preventDefault();
            var i = b(this).closest("form").parent("div");
            d.clearErrors(i.find("form"));
            if (!b(this).hasClass("cancel")) {
                var o = b("#clone-section-id");
                var m = o[0].value;
                if (!m) {
                    d.error(o.parent(), a.__("Please select destination section"), {bottom: 5});
                    return false
                }
                var g = b("#clone-parent-page");
                var s = g[0].value;
                if (!s) {
                    d.error(g.parent(), a.__("Please select parent page"), {bottom: 5});
                    return false
                }
                var n = b("#clone-assection").is(":checked");
                var h = e.getCurrentCell();
                var j = null;
                var k = parseInt(i.find('input[name="clone[childcells]"]:checked').val(), 10);
                var q = {};
                var t = e.getOptions();
                q[t.data_url] = b("#clone-includelinks").is(":checked");
                q[t.data_desc] = b("#clone-includenotes").is(":checked");
                q[t.data_archetype] = b("#clone-includearchetypes").is(":checked");
                q[t.data_color] = true;
                q[t.data_text_color] = true;
                if (n) {
                    var r = e.cloneCellAsSection(h, q, k, s, false, m);
                    j = r.section_id;
                    r = r.cells
                } else {
                    var r = e.cloneCell(h, q, k, s, true, m)
                }
                if ((typeof r === "object" && typeof r.id === "string") || (b.isArray(r) && r.length && typeof r[0].id === "string")) {
                    e.fullRefresh();
                    a.publish("sitemap/sitemap_modified", ["cells_clone", m, n, j])
                }
            }
            i.dialog("close")
        }).on("change", "#clone-section-id", function (n) {
            var o = b("#clone-parent-page");
            var k = o.closest(".select");
            d.clearErrors(b(this).closest("form"));
            if (this.value) {
                var m = '<option value="">' + a.__("Select Parent Page") + "</option>";
                k.show();
                o.html(m);
                var h = e.serializeCells(this.value, true);
                for (var j = 0; j < h.length; ++j) {
                    var p = e.getCellLevel(h[j]);
                    var g = (typeof p === "number") ? p : 0;
                    b('<option value="' + h[j].id + '">' + f.charsEncode(h[j].text) + (p === "home" ? " (" + a.__("Home") + ")" : "") + "</option>").data("indent", g).appendTo(o)
                }
                o.selectmenu("destroy");
                o.selectmenu({
                    style: "popup", maxHeight: 300, format: function (i) {
                        return a.require("string").charsEncode(i)
                    }
                })
            } else {
                k.hide()
            }
        });
        a.subscribe("modal/open/modal-cells-clone", function () {
            var h = e.getListOfSections();
            var o = "";
            var j = 0;
            var n = b("#clone-section-id");
            var m = b("#clone-parent-page");
            var k = n.closest(".select");
            var i = m.closest(".select");
            var g = '<option value="">' + a.__("Select Section") + "</option>";
            b.each(h, function (q, p) {
                if (e.isMainSection(q)) {
                    p = a.__("Main Section")
                }
                o += '<option value="' + q + '">' + f.charsEncode(p) + "</option>";
                ++j
            });
            if (j > 1) {
                n.html(g + o);
                n.selectmenu("destroy");
                n.selectmenu({
                    style: "popup", maxHeight: 300, format: function (p) {
                        return a.require("string").charsEncode(p)
                    }
                });
                k.show();
                i.hide()
            } else {
                n.html(g + o).val(e.getOption("id_main_section")).trigger("change");
                k.hide();
                i.show()
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var d = a.require("sitemap");
        var g = a.require("notification");
        var f = a.require("config");
        var i = b("#sitemap-themes");
        var e = !(a.currentUserCan("sitemap_color_themes") && i.length);
        b("#action-color-themes").on("click", function (j) {
            j.preventDefault();
            if (e) {
                return a.noPermissions()
            }
            a.publish("sitemap/color_edit_open", [d.getCurrentSection(), "themes"]);
            i.siblings("form.show").find("button.reset").trigger("click", [true]);
            d.backupColors();
            document.getElementById("themes-wrapper").style.marginLeft = "0px";
            if (b(window).scrollTop() > 84) {
                b("html, body").stop().animate({scrollTop: 84}, 200, "easeOutCubic", function () {
                    i[0].classList.add("show")
                })
            } else {
                i[0].classList.add("show")
            }
            d.modified = false
        });
        if (!e) {
            var h = 1;
            i.on("click", "a.prev, a.next", function (m) {
                m.preventDefault();
                var k = 777;
                var j = Math.ceil(b("#themes .theme").length / 3);
                if (b(this).hasClass("next")) {
                    if (h < j) {
                        ++h
                    }
                } else {
                    if (h > 1) {
                        --h
                    }
                }
                document.getElementById("themes-wrapper").style.marginLeft = ((h - 1) * k * -1) + "px"
            }).on("click", "ul[data-theme]", function () {
                var j = {};
                b(this).children("li").each(function (m) {
                    var k = b(this).data("color");
                    if (m === 0) {
                        j.home = k
                    } else {
                        if (m === 5) {
                            j.util = k;
                            j.foot = k
                        } else {
                            j["level" + m] = k
                        }
                    }
                });
                d.setTempScheme(j);
                d.modified = true
            }).on("click", "button.reset", function (j, k) {
                j.preventDefault();
                d.revertColors();
                i[0].classList.remove("show");
                d.modified = false;
                if (k !== true) {
                    a.publish("sitemap/color_edit_close", [d.getCurrentSection(), "themes"])
                }
            }).on("click", "button.submit", function (j) {
                j.preventDefault();
                d.backupColors();
                i[0].classList.remove("show");
                if (d.modified) {
                    a.publish("sitemap/sitemap_modified", ["color_scheme", d.getCurrentSection(), d.getCurrentColorScheme(), {
                        style: d.getStyle(),
                        textShadow: d.getTextShadow()
                    }]);
                    d.modified = false
                }
                a.publish("sitemap/color_edit_close", [d.getCurrentSection(), "themes"])
            })
        }
    })
});
Slickplan.module(function (c, b, d) {
    var a = !(b.currentUserCan("sitemap_custom_color") && c("#sitemap-custom").length);
    b.subscribe("route/sitemap", function () {
        var k = b.require("sitemap");
        var e = b.require("form");
        var n = b.require("websocket");
        var j = b.require("notification");
        var q = b.require("config");
        var p = b.require("helper");
        var f;
        var h = false;
        var g = c("#sitemap-top");
        var o = c("#sitemap-custom");
        var i = c("#modal-color-save");
        var m = c("#modal-color-load");
        b.$main.on("click", "#action-custom-color", function (r) {
            r.preventDefault();
            if (a) {
                return b.noPermissions()
            }
            o.siblings("form.show").find("button.reset").trigger("click", [true]);
            b.publish("sitemap/color_edit_open", [k.getCurrentSection(), "custom_color"]);
            k.backupColors();
            f = k.getCurrentColorScheme();
            if (c(window).scrollTop() > 84) {
                c("html, body").stop().animate({scrollTop: 84}, 200, "easeOutCubic", function () {
                    o[0].classList.add("show")
                })
            } else {
                o[0].classList.add("show")
            }
            k.modified = false
        });
        if (!a) {
            o.on("mouseenter", "li.color", function () {
                if (!c(this).data("color")) {
                    c(this).addClass("hover")
                }
            }).on("mouseleave", "li.color", function () {
                c(this).removeClass("hover")
            }).on("click", "li.color", function () {
                var t = c(this);
                var r = t.data("color");
                if (!r) {
                    c(".top-modal").dialog("close");
                    c("#topmodal-farbtastic.top-modal").parent().addClass("topFive").data("li", t).end().find("form").each(function () {
                        this.reset()
                    }).end().find(".breset").val(b.__("Cancel")).end().dialog("open").parent().find("input:first").blur()
                } else {
                    var s = document.getElementById("level-custom").value;
                    if (s === "all") {
                        f = {default_color: r, text_color: f.text_color, lines_color: f.lines_color}
                    } else {
                        f[s] = r
                    }
                    k.setTempScheme(f);
                    k.modified = true
                }
            }).on("click", "#palette-save", function (s) {
                s.preventDefault();
                var r = true;
                o.find("li.color").each(function () {
                    if (c(this).data("color")) {
                        r = false;
                        return false
                    }
                });
                if (r) {
                    j.error(b.__("Select at least one swatch"))
                } else {
                    c(".modal").dialog("close");
                    i.find("form").each(function () {
                        this.reset()
                    }).end().dialog("open").find("input:first").focus()
                }
            }).on("click", "#palette-load", function (r) {
                r.preventDefault();
                if (!m.find("label[data-palette]").length) {
                    j.error(b.__("No saved palettes exist"))
                } else {
                    c(".modal").dialog("close");
                    m.find("form").each(function () {
                        this.reset()
                    }).end().dialog("open").find("input:first").focus()
                }
            }).on("click", "#palette-new", function (r) {
                r.preventDefault();
                if (h) {
                    p.confirmDialog({
                        close: false,
                        title: b.__("Save palette."),
                        text: b.__("Would you like to save the current palette before creating new one?"),
                        on_yes: function () {
                            c("#palette-save").trigger("click");
                            h = false;
                            c("#palette-new").trigger("click")
                        },
                        on_no: function () {
                            h = false;
                            c("#palette-new").trigger("click")
                        }
                    })
                } else {
                    o.find("li.color").data("color", "").children("p").css({backgroundColor: "#fff"})
                }
            }).on("click", "button.reset", function (r, s) {
                r.preventDefault();
                k.revertColors();
                o[0].classList.remove("show");
                k.modified = false;
                if (s !== true) {
                    b.publish("sitemap/color_edit_close", [k.getCurrentSection(), "custom_color"])
                }
            }).on("click", "button.submit", function (r) {
                r.preventDefault();
                k.backupColors();
                o[0].classList.remove("show");
                if (k.modified) {
                    b.publish("sitemap/sitemap_modified", ["color_scheme", k.getCurrentSection(), f, {
                        style: k.getStyle(),
                        textShadow: k.getTextShadow()
                    }]);
                    k.modified = false
                }
                b.publish("sitemap/color_edit_close", [k.getCurrentSection(), "custom_color"])
            });
            i.on("submit", "form", function (v) {
                v.preventDefault();
                n.clearAll();
                j.clearAll();
                var r = c(this);
                var w = r.find('input[name="palette[name]"]');
                e.clearErrors(r);
                var u = e.validate([{
                    value: w.val(),
                    tiperror: w.parent(),
                    rules: {empty: b.__("Name must not be empty")},
                    css: {bottom: 5}
                }]);
                if (u) {
                    var s = r.closest(".modal");
                    var t = e.serializeObject(r);
                    n.request({
                        data: t,
                        $loading: r.find(".loading").css({visibility: "visible"}),
                        success: function (x) {
                            if (x._nonce) {
                                b.updateNonce(x._nonce)
                            }
                            if (x.error) {
                                e.error(i.find("div.input"), x.error, {bottom: 5})
                            } else {
                                if (x.success) {
                                    s.dialog("close");
                                    j.success(b.__("New palette saved"));
                                    if (typeof x.table === "string") {
                                        c("#custom-palette-table").replaceWith(c(x.table).find("#custom-palette-table"));
                                        if (c("#custom-palette-table .table-scroll tr").length > 4) {
                                            b.require("scrollbar").init(c("#custom-palette-table .table-scroll"), {thumbSize: 64})
                                        }
                                    }
                                    h = false
                                }
                            }
                        },
                        error: function () {
                            s.dialog("close")
                        }
                    })
                }
            });
            m.on("submit", "form", function (v) {
                v.preventDefault();
                var s = c(this);
                e.clearErrors(s);
                var u = s.find('input[type="checkbox"]:checked');
                var t = null;
                if (u.length > 1) {
                    t = b.__("You can only load one palette at once")
                } else {
                    if (u.length === 1) {
                        var r = u.siblings("label").data("palette");
                        if (typeof r === "object") {
                            o.find("ul.palette li.color").each(function (w) {
                                if (typeof r[w] === "string" && r[w]) {
                                    c(this).data("color", r[w]).children("p").css({backgroundColor: r[w]})
                                } else {
                                    c(this).data("color", "").children("p").css({backgroundColor: "#fff"})
                                }
                            });
                            h = false
                        }
                        s.closest(".modal").dialog("close")
                    } else {
                        t = b.__("Select palette to load")
                    }
                }
                if (t) {
                    e.error(s.find(".submit"), t, {bottom: 33, left: "95%"})
                }
            }).on("click", "#delete-palettes", function (w) {
                w.preventDefault();
                j.clearAll();
                var r = c(this).closest("form");
                e.clearErrors(r);
                var u = r.find('input[type="checkbox"]:checked');
                var t = r.closest(".modal");
                var s = null;
                if (u.length > 0) {
                    var v = e.serializeObject(r);
                    n.request({
                        data: v,
                        $loading: r.find(".loading").css({visibility: "visible"}),
                        success: function (x) {
                            if (x.error) {
                                e.error(r.find(".submit"), x.error, {bottom: 33}, "", true)
                            } else {
                                if (x.success) {
                                    t.dialog("close");
                                    j.success(b.__("Palettes deleted"));
                                    if (typeof x.table === "string") {
                                        c("#custom-palette-table").replaceWith(c(x.table).find("#custom-palette-table"));
                                        if (c("#custom-palette-table .table-scroll tr").length > 4) {
                                            b.require("scrollbar").init(c("#custom-palette-table .table-scroll"), {thumbSize: 64})
                                        }
                                    }
                                }
                            }
                            if (x._nonce) {
                                b.updateNonce(x._nonce)
                            }
                        },
                        error: function () {
                            t.dialog("close")
                        }
                    })
                } else {
                    e.error(r.find(".submit"), b.__("Select palettes to delete"), {bottom: 33}, false, -15)
                }
            });
            b.subscribe("modal/farbtastic_swatch_saved", function (s, t, r) {
                h = true
            });
            b.$body.on("mouseenter", "#level-custom-menu li", function (r) {
                var s = c("#level-custom option:eq(" + c(this).data("index") + ")").val();
                k.highlightLevel(s)
            }).on("mouseleave", "#level-custom-menu li", function (r) {
                k.highlightLevel(false)
            })
        }
    });
    if (!a) {
        b.subscribe("modal/open/modal-color-save", function (j, g) {
            var f = g.find("ul.palette").empty();
            var h = 0;
            c("#sitemap-custom li.color").each(function () {
                var e = c(this).data("color");
                if (e) {
                    f.append('<li class="color"><p style="background: ' + e + '"></p><input type="hidden" name="new_palette[colors][' + (h++) + ']" value="' + e + '"></li>')
                }
            })
        })
    }
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var i = a.require("websocket");
        var n = a.require("config");
        var h = a.require("sitemap");
        var g = a.require("svg");
        var f = a.require("notification");
        var j = a.require("helper");
        var k = b("#slickplan-sitemap");
        var m = "";

        function d(o, q, p, r) {
            m += '<li><a href="#" class="' + q + '"';
            if (r) {
                m += " " + r
            }
            m += ">";
            if (p) {
                p = p.split(",");
                if (p.length > 1) {
                    if (p[0].length === 1) {
                        p[0] = '<span class="letter">' + p[0] + "</span>"
                    } else {
                        p[0] = '<i class="fa fa-' + p[0] + '"></i>'
                    }
                    if (p[1].length === 1) {
                        p[1] = '<span class="letter">' + p[1] + "</span>"
                    } else {
                        p[1] = '<i class="fa fa-' + p[1] + '"></i>'
                    }
                    p = '<span class="icon">' + p[0] + p[1] + "</span>"
                } else {
                    p = '<i class="icon fa fa-' + p[0] + '"></i>'
                }
                m += p + " "
            }
            m += '<span class="name">' + a.__(o) + "</span></a></li>"
        }

        d("Delete", "delete", "times");
        d("Edit Name", "dblclick", "T,pencil");
        if (a.currentUserCan("cell_color") && b("#topmodal-farbtastic").length) {
            d("Edit Page Color", "cellmodal color ecolor", "square-o,eyedropper", 'data-modalid="farbtastic"')
        } else {
            d("Edit Page Color", "disabled ecolor", "square-o,eyedropper")
        }
        if (a.currentUserCan("cell_text_color") && b("#topmodal-farbtastic").length) {
            d("Edit Text Color", "cellmodal textcolor tcolor", "T,eyedropper", 'data-modalid="farbtastic"')
        } else {
            d("Edit Text Color", "disabled tcolor", "T,eyedropper")
        }
        if (a.currentUserCan("cell_cloning") && b("#modal-cells-clone").length) {
            d("Clone", "cellmodal cellclone", "files-o")
        } else {
            d("Clone", "disabled", "files-o")
        }
        if (a.currentUserCan("sitemap_sections")) {
            d("Add Section", "cellmodal cellsection", "slickplansection");
            d("Remove Section", "cellmodal cellsectionremove", "slickplansection")
        } else {
            d("Add Section", "disabled", "slickplansection")
        }
        if (a.currentUserCan("cell_note")) {
            d("Add Note", "cellmodal desc", "file-o", 'data-modalid="cell-note"')
        } else {
            d("Add Note", "disabled", "file-o")
        }
        if (a.currentUserCan("cell_url")) {
            d("Add Link", "cellmodal url", "link", 'data-modalid="cell-url"')
        } else {
            d("Add Link", "disabled", "link")
        }
        if (a.currentUserCan("cell_archetype") && b("#topmodal-cell-archetype").length) {
            d("Page Type", "cellmodal archetype", "flag", 'data-modalid="cell-archetype"')
        } else {
            d("Page Type", "disabled", "flag")
        }
        if (a.currentUserCan("cell_files")) {
            d("Design Mockups", "xcellfile", "picture-o")
        } else {
            d("Design Mockups", "disabled", "picture-o")
        }
        d("Hide Children", "expandcollapse collapse", "eye-slash");
        d("Show Children", "expandcollapse expand", "eye");
        var e = b('<div id="map-dropdown"><ul>' + m + "</ul></div>").appendTo(a.$body);
        b("html").on("mouseup.dropdown", function (o) {
            h.last_mouse_event = o;
            if (e.is(":visible")) {
                e.hide();
                b("#map-dropdown-overlay").remove();
                k.find("svg.force-hover").each(function () {
                    g.removeClass(this, "force-hover")
                });
                a.publish("sitemap/dropdown_close", [o, e])
            }
        });
        k.on("click", ".action.menu", function (q) {
            q.preventDefault();
            h.hideAddHelperPlaceholder(false);
            var s = b(this).closest("svg.cell");
            var u = s[0];
            h.setCurrentCell(u);
            var w = h.getOptions();
            var o = h.getCellLevel(u);
            k.find("svg.cell.force-hover").each(function () {
                g.removeClass(this, "force-hover")
            });
            g.addClass(u, "force-hover");
            e.find("li").css("display", "inline-block");
            if (g.getData(u, w.data_level) === "home") {
                e.find(".cellsection").closest("li").hide()
            }
            if (g.getData(u, w.data_desc) !== c && g.getData(u, w.data_desc) !== "") {
                e.find(".desc .name").text(a.__("Edit Note"))
            } else {
                e.find(".desc .name").text(a.__("Add Note"))
            }
            if (g.getData(u, w.data_url) !== c && g.getData(u, w.data_url) !== "") {
                e.find(".url .name").text(a.__("Edit Link"))
            } else {
                e.find(".url .name").text(a.__("Add Link"))
            }
            if (g.getData(u, w.data_section)) {
                e.find(".cellsection .name").text(a.__("View Section"))
            } else {
                e.find(".cellsection .name").text(a.__("Add Section"));
                e.find(".cellsectionremove").closest("li").hide()
            }
            if (g.hasClass(u, "has-childs") && typeof o === "number") {
                if (g.hasClass(u, "collapsed")) {
                    e.find(".expandcollapse.collapse").closest("li").hide()
                } else {
                    e.find(".expandcollapse.expand").closest("li").hide()
                }
            } else {
                e.find(".expandcollapse").closest("li").hide()
            }
            var p = g.getFloat(u, "width") - 2;
            var r = g.getFloat(u, "height");
            var v = a.$window.width() + a.$window.scrollLeft() - 362;
            var t = Math.max(5, Math.min(s.offset().left + p - (e.outerWidth() / 2), v));
            e.css({top: s.offset().top + r - 5, left: t});
            e.show().before('<div id="map-dropdown-overlay" />');
            b("#map-dropdown-overlay").show()
        });
        e.on("click", ".disabled", function (o) {
            o.preventDefault();
            o.stopPropagation();
            return a.noPermissions()
        }).on("click", ".delete", function (q) {
            q.preventDefault();
            var o = h.getCurrentCell(c, true);
            if (o) {
                if (g.hasClass(o, "has-file")) {
                    var p = g.getAttr(o, "id");
                    j.confirmDialog({
                        close: true,
                        title: a.__("This page has file/s and comments"),
                        yes_label: a.__("Delete"),
                        no_label: a.__("Cancel"),
                        checkboxes: [{id: "save_image", label: a.__("Save files for later use?")}, {
                            id: "save_comments",
                            label: a.__("Save comments?")
                        }],
                        on_yes: function (r, s) {
                            i.request({
                                data: {
                                    remove_cell_file: p,
                                    remove_permanently: s.save_image ? 0 : 1,
                                    remove_comments: s.save_comments ? 0 : 1
                                }, success: function (t) {
                                    if (!s.save_comments) {
                                        b("#sitemap-comments .item.hasfile-cell-" + p + " .foot a[data-delete]").each(function () {
                                            b(this).trigger("click")
                                        })
                                    }
                                }
                            });
                            h.removeCell(o);
                            h.fullRefresh()
                        }
                    })
                } else {
                    h.removeCell(o);
                    h.fullRefresh()
                }
            }
        }).on("click", ".dblclick", function (p) {
            p.preventDefault();
            if (h.isEditBlocked()) {
                return false
            }
            var o = h.getCurrentCell();
            j.cellGroupWarningDialog(o, {
                on_after: function (q) {
                    h.showTextEdit(q)
                }
            })
        }).on("click", ".cellsection", function (p) {
            p.preventDefault();
            var o = h.getCurrentCell();
            if (!g.getData(o, h.getOption("data_section")) && g.getData(o, h.getOption("data_childs"))) {
                j.confirmDialog({
                    title: a.__("Would you like to move child pages to this section?"),
                    on_yes: function () {
                        var q = h.getCurrentCell();
                        h.openSection(c, q, true)
                    },
                    on_no: function () {
                        var q = h.getCurrentCell();
                        h.openSection(c, q)
                    },
                    close: true
                });
                return false
            }
            h.openSection(c, o)
        }).on("click", ".cellsectionremove", function (o) {
            o.preventDefault();
            j.confirmDialog({
                title: a.__("Would you like to move section pages to main sitemap?"), on_yes: function () {
                    var p = h.getCurrentCell();
                    h.removeCellSection(p, c, true)
                }, on_no: function () {
                    var p = h.getCurrentCell();
                    h.removeCellSection(p, c)
                }, close: true
            })
        }).on("click", ".cellclone", function (o) {
            o.preventDefault();
            b("#modal-cells-clone").dialog("open")
        }).on("click", ".expandcollapse", function (p) {
            p.preventDefault();
            if (b("#sitemap-wrapper").hasClass("batchedit")) {
                return false
            }
            var o = h.getCurrentCell();
            if (o) {
                h.toggleChildren(o)
            }
        }).on("click", "[data-modalid]", function (s, q) {
            s.preventDefault();
            if (!q) {
                var p = h.getCurrentCell();
                var r = b(this);
                var o = r.data("modalid");
                j.cellGroupWarningDialog(p, {
                    on_single: function (t) {
                        r.attr("data-topmodal", o).data("topmodal", o);
                        r.trigger("click", [true]);
                        r.removeAttr("data-topmodal").removeData("topmodal")
                    }, on_group: function (t) {
                        setTimeout(function () {
                            r.attr("data-topmodal", o).data("topmodal", o);
                            r.trigger("click", [true]);
                            r.removeAttr("data-topmodal").removeData("topmodal")
                        }, 310)
                    }
                })
            }
        }).on("click", ".xcellfile", function (o) {
            console.log('line 14145');//linea que se activa cuando se presiona el boton del mockups
            o.preventDefault();
            a.publish("sitemap/lightbox_cell_files/open", [h.getCurrentCell()])
        })
    })
});
Slickplan.module(function (f, b, g) {
    var e = {};
    var c = "history_" + b.require("config").get("route").join("_") + "_";
    var a = false;
    var d = true;
    b.subscribe("route/sitemap", function () {
        var i = b.require("sitemap");
        var j = b.require("session");
        var h = b.require("notification");
        var k = b.require("svg");
        b.$main.on("click", "#action-undo, #action-redo", function (r) {
            r.preventDefault();
            if (i.isEditBlocked()) {
                return false
            }
            a = true;
            var s = (this.id === "action-undo");
            var v = i.getCurrentSection();
            var t = c + v;
            if (s) {
                var o = (e[t] > 0)
            } else {
                var u = j.countItems(t) - 1;
                var o = (u > e[t])
            }
            if (o) {
                e[t] += s ? -1 : 1;
                var m = j.getItem(t, e[t]);
                if (m && m.serialized) {
                    if (m.sections && m.sections.length) {
                        var w = i.getDomSectionsIds(true);
                        if (w.length) {
                            for (var q = 0, p = w.length; q < p; ++q) {
                                if (f.inArray(w[q], m.sections) < 0) {
                                    i.removeSectionDOM(w[q], true, true)
                                }
                            }
                        }
                        for (var q = 0, p = m.sections.length; q < p; ++q) {
                            if (f.inArray(m.sections[q], w) < 0 && m.serialized[m.sections[q]]) {
                                i.addSectionJSON(m.sections[q], m.serialized[m.sections[q]])
                            }
                        }
                    }
                    i.clearCache(v);
                    k.clearCache(true, v);
                    i.loadSectionFromJSON(v, m.serialized);
                    b.publish("sitemap/history_" + (s ? "undo" : "redo"), [v, m])
                }
            } else {
                if (i.isMainSection(v)) {
                    var n = b.__("No more history states for main section")
                } else {
                    var n = b.__("No more history states for this section")
                }
                h.error(n, {persistent: false})
            }
            a = false
        })
    });
    b.subscribe("sitemap/full_refresh", function (j, i, h) {
        if (a) {
            return
        }
        setTimeout(function () {
            var o = b.require("sitemap");
            var p = b.require("session");
            var q = b.require("string");
            var s = o.getSerialized(true);
            h = h ? h : o.getCurrentSection();
            var m = c + h;
            if (d) {
                p.removeData(new RegExp("^" + c + ".+$"));
                d = false
            } else {
                if (e[m] !== g && e[m] >= 0) {
                    while ((p.countItems(m) - 1) > e[m]) {
                        p.removeItem(m)
                    }
                }
            }
            var r = {serialized: s};
            var k = JSON.stringify((s[h] ? s[h] : s));
            r.string = k;
            r.sections = o.getDomSectionsIds();
            r.hash = q.hashCode(k);
            var n = p.getItem(m, e[m]);
            if (!n || n.hash !== r.hash) {
                p.addItem(m, r);
                e[m] = p.countItems(m) - 1;
                b.log("History: added", "debug", m, r, e[m])
            }
        }, 1)
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var n = a.require("config");
        var i = a.require("notification");
        var f = a.require("form");
        var k = a.require("helper");
        var m = a.require("http");
        var e = b("#modal-export");
        var g;

        function d(p, o) {
            p.preventDefault();
            p.stopPropagation();
            e.dialog("close");
            i.error(a.__('<a href="{1}">Upgrade</a> your account' + (o ? " to Unlimited" : "") + " to use this feature", n.get("payment_url", "#")));
            return false
        }

        e.on("change", '#export-tab input[name="export[type]"], #import-tab input[name="import[type]"]', function () {
            var r = b(this);
            f.clearErrors(r.closest("fieldset"));
            var q = (/^export/.test(this.name));
            var o = q ? "#exportopts" : "#importopts";
            var p = this.value;
            if (r.parent().hasClass("disabled")) {
                p += " disabled"
            }
            b(o).removeAttr("class").addClass(p).insertAfter(r.closest(".radio"));
            b("#form-xnote").off("change").on("change", function () {
                var s = b(this).parent().next(".notestype");
                if (s.length) {
                    if (this.checked) {
                        s.show()
                    } else {
                        s.hide()
                    }
                }
            }).trigger("change");
            if (!q) {
                b("#import-tab input.filename").val("");
                b("#form-import-limit, #form-import-exclude").prop("checked", false).trigger("change")
            }
        }).on("change", "#form-landscape", function () {
            e.find(".paper").removeClass("landscape");
            if (b(this).is(":checked")) {
                e.find(".paper").addClass("landscape")
            }
        }).on("submit", "#export-tab", function (q) {
            clearTimeout(g);
            a.ignoreUnload(true);
            var o = b(this).find('input[type="radio"][name="export[type]"]:checked').val();
            if (o !== "ppd" && !a.currentUserCan("sitemap_export_" + o)) {
                return d(q)
            }
            var p = b(this).find(".loading").css({visibility: "visible"});
            g = setTimeout(function () {
                p.css({visibility: "hidden"});
                a.ignoreUnload(false)
            }, 5000)
        }).on("submit", "#import-tab", function (r) {
            f.clearErrors(b(this));
            var p = b(this).find('input[type="radio"][name="import[type]"]:checked').val();
            if ((p === "xml" && !a.currentUserCan("sitemap_import_google")) || (p === "crawler" && !a.currentUserCan("sitemap_import_crawler"))) {
                return d(r, true)
            } else {
                if ((p === "slickplan" && !a.currentUserCan("sitemap_import_slickplan")) || (p === "wordpress" && !a.currentUserCan("sitemap_import_wordpress")) || (p === "dash" && !a.currentUserCan("sitemap_import_dash_hierarchy"))) {
                    return d(r)
                }
            }
            if (p === "crawler" && b("#form-import-limit").is(":checked")) {
                var s = b("#form-import-pages_limit");
                var o = s.val();
                if (!/^[0-9]+$/.test(o) || o < s.attr("min") || o > s.attr("max")) {
                    f.error(s.parent(), a.__("Limit must be a number between {1} and {2}", s.attr("min"), s.attr("max")), {
                        bottom: 10,
                        left: 178
                    });
                    return false
                }
            }
            var q = b(this).find(".loading").css({visibility: "visible"});
            setTimeout(function () {
                q.css({visibility: "hidden"})
            }, 5000)
        }).on("click", "#ontimepay-step2, #ontimepay-upgrade", function (q) {
            q.preventDefault();
            if (this.id === "ontimepay-step2") {
                var p = b('#import-tab input[type="radio"][name="import[type]"]:checked').val();
                var o = n.get("https_uri", "") + n.get("route", []).join("/") + "/onetime" + p
            } else {
                var o = n.get("payment_url", "#")
            }
            if (a.has_unsaved_changes) {
                e.dialog("close");
                k.confirmDialog({
                    close: true,
                    title: a.__("Save changes."),
                    text: a.__("Would you like to save changes before redirecting?"),
                    on_yes: function () {
                        b("#action-save").trigger("click", [function () {
                            console.info(o);
                            m.redirect(o)
                        }])
                    },
                    on_no: function () {
                        m.redirect(o)
                    }
                })
            } else {
                m.redirect(o)
            }
        }).on("click", "#ontimepay-step3", function (o) {
            o.preventDefault();
            b("#onetimepay").remove();
            b("#importopts").find(".crawler-hidden").removeClass("crawler-hidden").addClass("crawler").end().find(".xml-hidden").removeClass("xml-hidden").addClass("xml")
        }).on("click", "#ccard-submit button", function (q) {
            q.preventDefault();
            var s = b(this);
            var w = s.closest("form");
            var v = a.require("ajax");
            v.clearAll();
            f.clearErrors(w);
            var t = b("#form-ccnumber");
            var u = b("#form-cvv");
            var r = b("#form-zip");
            isValid = f.validate([{
                value: t.val(),
                tiperror: t.parent(),
                rules: {
                    empty: "Credit Card number must not be empty",
                    callback: [f.ccValidationDots, "Invalid credit card number"]
                },
                css: {bottom: 5},
                left: 12
            }, {
                value: u.val(),
                tiperror: u.parent(),
                rules: {empty: "Security Code must not be empty", regexp: [/^[0-9]{3,4}$/, "Invalid Security Code"]},
                css: {bottom: 5, left: 70}
            }, {
                value: r.val(),
                tiperror: r.parent(),
                rules: {empty: "Zip/Postal Code must not be empty"},
                css: {bottom: 5, left: 120}
            }]);
            if (b("#form-expyear").val() == 0 || b("#form-expmonth").val() == 0) {
                f.error(b("#form-expdate"), "You must select an expiration date", {bottom: 3, left: 205}, false, 20);
                isValid = false
            }
            if (isValid) {
                s.hide();
                var o = n.get("payment_url", "#");
                var p = f.serializeObject(w);
                p.ajax = 1;
                v.request({
                    url: m.url(o),
                    data: p,
                    $loading: s.parent().find(".loading").css({visibility: "visible"}),
                    success: function (x) {
                        s.show();
                        if (x._nonce) {
                            a.updateNonce(x._nonce)
                        }
                        if (x.redirect) {
                            m.redirect(x.redirect)
                        } else {
                            if (x.errors) {
                                b.each(x.errors, function (y, z) {
                                    f.error(w.find('input[name="form[' + y + ']"]').parent("div"), z)
                                })
                            } else {
                                if (x.error) {
                                    f.error(b("#ccard-submit"), x.error, {bottom: 7, left: 0}, false, -340)
                                }
                            }
                        }
                    }
                })
            }
        }).on("change", "#form-import-limit", function () {
            var o = b(this).parent().siblings(".page-limit");
            if (this.checked) {
                o.show();
                o.find("input:first").putCursorAtEnd()
            } else {
                o.hide()
            }
        }).on("change", "#form-import-exclude", function () {
            var o = b(this).parent().siblings(".exclude-field");
            if (this.checked) {
                o.show();
                o.find("input:first").putCursorAtEnd()
            } else {
                o.hide()
            }
        }).on("click", ".import-new-field", function (o) {
            o.preventDefault();
            b(this).before('<input type="text" name="import[exceptions][]" value="">');
            b(this).prev("input").putCursorAtEnd()
        });
        function h(o) {
            a.subscribe("modal/open/modal-export", function (q, p) {
                p.find('.ui-tabs-nav a[href="#import-tab"]').trigger("click");
                p.find('#import-tab input[type="radio"][name="import[type]"][value="' + o + '"]').prop("checked", true).trigger("change")
            });
            e.dialog("open")
        }

        a.$body.on("click", "#action-onetime-approve", function (p) {
            p.preventDefault();
            var o = a.require("websocket");
            o.clearAll();
            o.request({
                data: {one_time_crawler_approve: 1}, success: function (q) {
                    if (q._nonce) {
                        a.updateNonce(q._nonce)
                    }
                    if (q.redirect) {
                        m.redirect(q.redirect)
                    }
                }
            })
        }).on("click", "#action-onetime-retry", function (o) {
            o.preventDefault();
            h("crawler")
        });
        e.filter(".importenabled").parent("div").addClass("ui-modal-export").end().tabs({hide: false, show: false});
        var j = n.get("route", []);
        if (j.length && typeof j[j.length - 1] === "string" && j[j.length - 1] === "onetimecrawler" || j[j.length - 1] === "onetimexml") {
            h(j[j.length - 1].replace("onetime", ""))
        }
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var H = a.require("form");
        var E = a.require("websocket");
        var i = a.require("http");
        var e = a.require("notification");
        var ac = a.require("helper");
        var C = a.require("config");
        var ah = a.require("string");
        var ag = a.require("scrollbar");
        var o = window.document;
        var P = b("#slickplan-sitemap").data("id") || 0;
        var L = b("html").hasClass("flash");
        var S = a.require("svg");
        var h = a.require("sitemap");
        var q = C.get("allow_edit", false);
        var I = C.get("all_privileges", false);
        var O;
        var p = /(msie|trident)/i.test(navigator.userAgent);
        var Q = (typeof SVGElementInstance !== "undefined");
        var F = false;
        var K = false;
        var aa = ((parseInt(a.currentUserCan("contributors", true), 10) === 0) || parseInt(C.get("account", {active_contributors: 0}).active_contributors, 10) === 0);
        var N = o.getElementById("crawlerpage");
        if (N) {
            if (q) {
                var v = b(N).data("url");
                var A;
                a.require("ajax", null, "request", [{url: v, data: {ajax: 1}}]);
                function t() {
                    E.request({
                        data: {crawler: 1}, success: function (ai) {
                            if (ai._nonce) {
                                a.updateNonce(ai._nonce)
                            }
                            if (ai.status) {
                                if (!/^[0-9]+%$/.test(ai.status)) {
                                    ai.status = "<span>" + ai.status + "</span>"
                                }
                                b("#crawlerpage h2").html(ai.status)
                            }
                            if (ai.redirect) {
                                clearTimeout(A);
                                i.redirect(ai.redirect);
                                b("#crawler-cancel").hide();
                                b("#crawler-stopsave").hide()
                            } else {
                                A = setTimeout(t, 2000)
                            }
                        }, error: function () {
                            A = setTimeout(t, 2000)
                        }
                    })
                }

                A = setTimeout(t, 2000);
                h.crawler = true;
                b("#crawler-cancel").on("click", function (ai) {
                    ai.preventDefault();
                    clearTimeout(A);
                    b("#crawler-cancel").hide();
                    b("#crawler-stopsave").hide();
                    a.require("ajax", null, "request", [{
                        url: v, data: {ajax: 1, cancel: 1}, success: function (aj) {
                            if (aj.success) {
                                i.refresh()
                            }
                        }
                    }])
                });
                b("#crawler-stopsave").on("click", function (ai) {
                    ai.preventDefault();
                    clearTimeout(A);
                    b("#crawler-cancel").hide();
                    b("#crawler-stopsave").hide();
                    a.require("ajax", null, "request", [{
                        url: v, data: {ajax: 1, stop_save: 1}, success: function (aj) {
                            if (aj.success) {
                                i.refresh()
                            }
                        }
                    }])
                })
            } else {
                o.getElementById("crawler-cancel").style.display = "none";
                o.getElementById("crawler-stopsave").style.display = "none"
            }
            return false
        }
        ac.warnBeforeLeave();
        var m = b("#slickplan-sitemap");
        h.setOptions({container: m[0], edit: q, allow_collapsing: true});
        _SLICKPLAN_JSON = (_SLICKPLAN_JSON && ac.isObject(_SLICKPLAN_JSON)) ? _SLICKPLAN_JSON : {};
        _SLICKPLAN_GROUPS = (_SLICKPLAN_GROUPS && ac.isObject(_SLICKPLAN_GROUPS)) ? _SLICKPLAN_GROUPS : {};
        h.loadCellsGroupsJSON(_SLICKPLAN_GROUPS);
        m.empty();
        if (!q) {
            a.$body.addClass("sitemappreview")
        }
        a.$window.on("load", function () {
            if (!F) {
                F = true;
                if (ac.isObject(_SLICKPLAN_JSON)) {
                    h.loadJSON(_SLICKPLAN_JSON, h.getOption("id_main_section"))
                } else {
                    h.clear(false, {template: "horizontal", design: "gradient"})
                }
                var ai = b("#svgmainsection svg.cell.level-home");
                if (!ai.length) {
                    ai = b("#svgmainsection svg.cell:first");
                    if (ai.length) {
                        h.setCurrentCell(ai[0])
                    }
                }
            }
            a.publish("sitemap/after_load")
        });
        var af = b("#cell-info-tooltip");

        function j(an, ap) {
            var ao = S.getRealTarget(an);
            if (ao) {
                var am = S.hasClass(ao, "bar-section");
                var at = (!am && S.hasClass(ao, "bar-archetype"));
                if (am || at) {
                    var av = ao.parentNode;
                    if (S.hasClass(av, "cell")) {
                        if (am) {
                            af.addClass("section").children("span").html(a.__("View Section").replace(" ", "&nbsp;"))
                        } else {
                            var ai = ao.href.baseVal.toString().replace("#svg-bar-archetype-", "");
                            var ak = C.get("archetypes");
                            if (ai.charAt(0) === "_" && ak[ai] !== c && ak[ai].name !== c) {
                                ai = ak[ai].name
                            } else {
                                if (ak._custom !== c && ak._custom[ai] !== c && ak._custom[ai].name !== c) {
                                    ai = ak._custom[ai].name
                                } else {
                                    ai = a.__("Page Type")
                                }
                            }
                            ai.replace(" ", "&nbsp;");
                            af.removeClass("section").children("span").text(ai)
                        }
                        var al = S.hasClass(av, "has-section");
                        var ar = S.hasClass(av, "has-archetype");
                        var au = h.getOffsets(av);
                        var aq = au.top;
                        var aj = au.left;
                        if ((al && ar) || (S.hasClass(av, "has-desc") && S.hasClass(av, "has-url"))) {
                            aq += au.height - 19 * au.scale
                        } else {
                            aq += au.height / 2
                        }
                        if (at && al && ar) {
                            aj += 27 * au.scale
                        }
                        ap = (typeof ap === "number") ? ap : 0;
                        aq -= (38 + 13) * au.scale;
                        aj += (24 + 17 + ap) * au.scale;
                        af.css({top: aq, left: aj, transform: "scale(" + au.scale + ")"})
                    }
                }
            }
        }

        if (q) {
            b("#sitemap-top h1 > span").on("dblclick", function () {
                b(this).siblings("a").trigger("click")
            });
            m.on("click", ".add-button", function (ai) {
                if (h.isEditBlocked() || b("#sitemap-wrapper").hasClass("batchedit")) {
                    return false
                }
                if (S.hasClass(this, "add-button-cell")) {
                    h.insertNewCell()
                } else {
                    if (S.hasClass(this, "add-button-home")) {
                        h.insertNewCell(null, "home")
                    } else {
                        if (S.hasClass(this, "add-button-util")) {
                            h.insertNewCell(null, "util")
                        } else {
                            if (S.hasClass(this, "add-button-foot")) {
                                h.insertNewCell(null, "foot")
                            }
                        }
                    }
                }
                b(this).remove()
            });
            m.on("blur keydown.return keydown.shift_return keydown.ctrl_return keydown.meta_return keydown.alt_return", "#svg-text-edit", function (am) {
                var aj = o.getElementById("svg-text-edit");
                var ai = S.getData(aj, h.getOption("data_cell_ref"));
                ai = S.getElement(ai);
                var an = h.getCellLevel(ai);
                if (ai && typeof an === "number") {
                    var al = h.getAllParents(ai);
                    ai = al.length ? al[al.length - 1] : ai;
                    ai = S.getElement(ai)
                }
                var ak = h.finishTextEdit(c, !C.get("cells_numbering", false));
                if (ak) {
                    h.cellEditGroupStop(function () {
                        b("#batch-cell-names").val(ak).trigger("blur")
                    })
                } else {
                    if (an !== "util") {
                        h.maybePartialRefresh(ai, false)
                    }
                }
                if (an === "util") {
                    h.fullRefresh()
                }
                if (am.type === "keydown") {
                    am.preventDefault()
                }
            }).on("keyup", "#svg-text-edit", function () {
                h.autosizeTextEdit()
            });
            m[0].addEventListener("dblclick", function (ak) {
                var aj = S.getRealTarget(ak);
                if (aj && S.hasClass(aj, "foreground")) {
                    var ai = b(aj).closest("svg.cell");
                    if (ai.length) {
                        h.setCurrentCell(ai[0]);
                        b("#map-dropdown .dblclick").trigger("click")
                    }
                }
            });
            var r = false;
            m.on("mousemove", function (ai) {
                if (r) {
                    h.dndMove(ai)
                }
                h.calculateCellHoverHelpers(ai, r)
            }).on("mousedown", ".action.move", function (ai) {
                ai.preventDefault();
                h.dndStart(ai, this.parentNode);
                r = true
            }).on("mouseup", function (ai) {
                if (r) {
                    h.dndStop(ai);
                    r = false
                }
            });
            var k = b("#main .top-nav");
            a.$window.scroll(function () {
                if (a.$window.scrollTop() > k.offset().top) {
                    k.addClass("floating")
                } else {
                    k.removeClass("floating")
                }
            });
            var z = false;
            var R = {};
            var W = {};
            var d = {};

            function x(aj, av, aq) {
                if (m.hasClass("dragging") || !aj || z) {
                    return
                }
                var aj = S.getElement(aj);
                if (!aj || !aj.id) {
                    return
                }
                var at = aj.getElementById("bar-icons-wrapper-" + aj.id);
                var am = aj.getElementById("bar-section-" + aj.id);
                var an = aj.getElementById("bar-archetype-" + aj.id);
                var aB = aj.getElementById("icon-note-" + aj.id);
                var ar = aj.getElementById("icon-url-" + aj.id);
                var ax = aj.getElementById("icon-file-" + aj.id);
                if (!at && !am && !an && !aB && !ar && !ax) {
                    return
                }
                var az = S.getFloat(aj, "width", true);
                var ao = (am ? 1 : 0) + (an ? 1 : 0);
                var ak = (aB ? 1 : 0) + (ar ? 1 : 0) + (ax ? 1 : 0);
                var ai = !!(Boolean(ao > 1) || Boolean(ak > 1));
                var au = [];
                if (am) {
                    au.push({element: am, anim: {x: {from: 4, to: 22}}})
                }
                if (an) {
                    au.push({element: an, anim: {x: {from: am ? 31 : 4, to: am ? 49 : 22}}})
                }
                var ap = 0;
                if (aB) {
                    au.push({
                        element: aB,
                        anim: {x: {from: az - 16 - (ai ? 4 : 0) - ap, to: az - 16 - (ai ? 4 : 0) - ap - 18}}
                    });
                    ap += 22
                }
                if (ar) {
                    au.push({
                        element: ar,
                        anim: {x: {from: az - 16 - (ai ? 4 : 0) - ap, to: az - 16 - (ai ? 4 : 0) - ap - 18}}
                    });
                    ap += 22
                }
                if (ax) {
                    au.push({
                        element: ax,
                        anim: {x: {from: az - 16 - (ai ? 4 : 0) - ap, to: az - 16 - (ai ? 4 : 0) - ap - 18}}
                    });
                    ap += 22
                }
                if (at) {
                    if (ai) {
                        var al = (am && an) ? 58 : ((am || an) ? 31 : 4);
                        au.push({
                            element: at,
                            anim: {x: {from: al, to: al + 18}, width: {from: az - al - 4, to: az - al - 18 - 18 - 4}}
                        })
                    } else {
                        au.push({element: at, anim: {x: {from: az - 4 - 24, to: az - 4 - 24 - 18}}})
                    }
                }
                R[aj.id] = {
                    timeout: false,
                    is_changed: false,
                    is_changed_recalculated: false,
                    start_time: (new Date()).getTime(),
                    current_time: 0,
                    percent: 0,
                    duration: 120,
                    from: av ? "to" : "from",
                    to: av ? "from" : "to"
                };
                if (aq) {
                    if (W[aj.id]) {
                        clearInterval(W[aj.id]);
                        W[aj.id] = c
                    }
                    for (var ay = 0, aw = au.length; ay < aw; ++ay) {
                        for (var aA in au[ay].anim) {
                            if (au[ay].anim.hasOwnProperty(aA) && au[ay].anim[aA]) {
                                S.setAttr(au[ay].element, aA, au[ay].anim[aA][R[aj.id].to], true)
                            }
                        }
                    }
                    R[aj.id] = c;
                    return true
                }
                if (W[aj.id]) {
                    clearInterval(W[aj.id])
                }
                W[aj.id] = setInterval(function () {
                    if (!R || !R[aj.id]) {
                        return
                    }
                    R[aj.id].current_time = (new Date()).getTime() - R[aj.id].start_time;
                    if (R[aj.id].is_changed && !R[aj.id].is_changed_recalculated) {
                        var aG = R[aj.id].duration * R[aj.id].percent;
                        R[aj.id].start_time -= (R[aj.id].duration - aG) - aG;
                        R[aj.id].current_time = (new Date()).getTime() - R[aj.id].start_time;
                        R[aj.id].from = (R[aj.id].from === "from") ? "to" : "from";
                        R[aj.id].to = (R[aj.id].to === "to") ? "from" : "to";
                        R[aj.id].is_changed_recalculated = true
                    }
                    if (R[aj.id].current_time < R[aj.id].duration) {
                        R[aj.id].percent = R[aj.id].current_time / R[aj.id].duration;
                        for (var aF = 0, aD = au.length; aF < aD; ++aF) {
                            for (var aE in au[aF].anim) {
                                if (au[aF].anim.hasOwnProperty(aE)) {
                                    var aC = (au[aF].anim[aE][R[aj.id].to] - au[aF].anim[aE][R[aj.id].from]) * R[aj.id].percent;
                                    S.setAttr(au[aF].element, aE, au[aF].anim[aE][R[aj.id].from] + aC, true)
                                }
                            }
                        }
                    } else {
                        for (var aF = 0, aD = au.length; aF < aD; ++aF) {
                            for (var aE in au[aF].anim) {
                                if (au[aF].anim.hasOwnProperty(aE)) {
                                    S.setAttr(au[aF].element, aE, au[aF].anim[aE][R[aj.id].to], true)
                                }
                            }
                        }
                        if (W[aj.id]) {
                            clearInterval(W[aj.id]);
                            W[aj.id] = c
                        }
                        R[aj.id] = c
                    }
                }, 13)
            }

            function J(ai, aj) {
                if (!d[ai.id]) {
                    d[ai.id] = ai;
                    x(ai, false, aj)
                }
            }

            function n(ai, ak) {
                if (d) {
                    for (var aj in d) {
                        if (d.hasOwnProperty(aj) && d[aj] && (!ai || d[aj].id !== ai.id)) {
                            d[aj] = c;
                            delete d[aj];
                            x(aj, true, ak)
                        }
                    }
                }
            }

            a.subscribe("sitemap/dropdown_close", function (ak, aj) {
                h.last_mouse_event = aj;
                var ai = h.getCellByCoords(aj);
                n(ai)
            });
            a.subscribe("sitemap/full_refresh", function (al, ak, aj) {
                d = {};
                if (!h.isEditBlocked() && h.last_mouse_event) {
                    var ai = h.getCellByCoords(h.last_mouse_event);
                    if (ai) {
                        J(ai, true)
                    }
                }
            });
            var g = false;
            a.subscribe("sitemap/drag_stop", function (al, ai, ap, ak) {
                if (h.isEditBlocked()) {
                    return false
                }
                if (ak && ak.cell) {
                    var ar = S.getCursorPoint(ai, h.getOption("scale"), m.offset());
                    ar.x = Math.round(ar.x);
                    ar.y = Math.round(ar.y);
                    if (!h.isMainSection()) {
                        ar.y -= h.getOption("section_toolbar_height")
                    }
                    var an = S.getFloat(ak.cell, "x");
                    var am = S.getFloat(ak.cell, "y");
                    var aj = S.getFloat(ak.cell, "width");
                    var aq = S.getFloat(ak.cell, "height");
                    var ao = !((ar.x >= an) && (ar.x <= an + aj) && (ar.y >= am) && (ar.y <= am + aq));
                    g = !ao;
                    x(ak.cell, ao, true)
                }
            });
            m[0].addEventListener("mouseover", function (aj) {
                if (h.isEditBlocked()) {
                    return false
                }
                if (g) {
                    g = false;
                    return
                }
                aj = aj || window.event;
                var ai = S.getRealTarget(aj);
                if (ai.id === "svg-hover-button") {
                    var ak = aj.relatedTarget || aj.fromElement;
                    if (ak) {
                        if (Q && ak.correspondingUseElement) {
                            ak = ak.correspondingUseElement
                        }
                        if (ak.parentNode) {
                            while (ak.parentNode) {
                                if (ak == ai) {
                                    return
                                }
                                ak = ak.parentNode;
                                if (Q && ak && ak.correspondingUseElement) {
                                    ak = ak.correspondingUseElement
                                }
                            }
                        }
                        if (ak.offsetParent) {
                            while (ak.offsetParent) {
                                if (ak == ai) {
                                    return
                                }
                                ak = ak.offsetParent;
                                if (Q && ak && ak.correspondingUseElement) {
                                    ak = ak.correspondingUseElement
                                }
                            }
                        }
                    }
                    S.removeClass(ai, "removing");
                    S.addClass(ai, "freeze");
                    h.clearAddHelperTimer()
                } else {
                    if (ai.id === "slickplan") {
                        h.hideAddHelperPlaceholder()
                    } else {
                        if (!S.hasClass(ai, "cellmask")) {
                            j(aj)
                        }
                    }
                }
            });
            m[0].addEventListener("mouseout", function (aj) {
                if (h.isEditBlocked()) {
                    return false
                }
                aj = aj || window.event;
                var ai = S.getRealTarget(aj);
                if (ai.id === "svg-hover-button") {
                    var ak = aj.relatedTarget || aj.toElement;
                    if (ak) {
                        if (Q && ak.correspondingUseElement) {
                            ak = ak.correspondingUseElement
                        }
                        if (ak.parentNode) {
                            while (ak.parentNode) {
                                if (ak == ai) {
                                    return
                                }
                                ak = ak.parentNode;
                                if (Q && ak && ak.correspondingUseElement) {
                                    ak = ak.correspondingUseElement
                                }
                            }
                        }
                        if (ak.offsetParent) {
                            while (ak.offsetParent) {
                                if (ak == ai) {
                                    return
                                }
                                ak = ak.offsetParent;
                                if (Q && ak && ak.correspondingUseElement) {
                                    ak = ak.correspondingUseElement
                                }
                            }
                        }
                    }
                    S.removeClass(ai, "freeze");
                    h.hideAddHelperPlaceholder();
                    n()
                } else {
                    if (!S.hasClass(ai, "cellmask")) {
                        af.css({left: -99999, top: -99999})
                    }
                }
            });
            m[0].addEventListener("click", function (al) {
                al = al || window.event;
                h.last_mouse_event = al;
                var am = S.getRealTarget(al);
                if (h.checkTag(am, "use")) {
                    var ak = h.isEditBlocked();
                    if (!ak && am.className.baseVal.indexOf("bar-section") >= 0) {
                        if (a.currentUserCan("sitemap_sections")) {
                            z = true;
                            var ap = b(am).closest(".cell");
                            h.setCurrentCell(ap[0]);
                            h.openSection(c, ap[0]);
                            setTimeout(function () {
                                z = false;
                                n(c, true)
                            }, 500)
                        } else {
                            a.noPermissions()
                        }
                    } else {
                        if (!ak && (am.className.baseVal.indexOf("bar-archetype") >= 0 || am.className.baseVal.indexOf("icon-") >= 0)) {
                            if (a.currentUserCan("cell_archetype") && b("#topmodal-cell-archetype").length) {
                                var ap = b(am).closest(".cell");
                                h.setCurrentCell(ap[0]);
                                var an = (" " + S.getAttr(am, "class") + " ").match(/\s(?:icon|bar)\-([a-z]+)\s/);
                                if (an && an.length > 1) {
                                    var aq = false;
                                    var aj = b('#map-dropdown [data-modalid="cell-' + an[1] + '"]');
                                    if (!aj.length) {
                                        aj = b("#map-dropdown .xcell" + an[1]);
                                        aq = true
                                    }
                                    if (aj.length) {
                                        aj.trigger("click");
                                        if (aq) {
                                            z = true;
                                            setTimeout(function () {
                                                z = false;
                                                n(c, true)
                                            }, 500)
                                        }
                                    }
                                }
                            } else {
                                a.noPermissions()
                            }
                        } else {
                            if (!ak && am.id === "svg-hover-button") {
                                var at = S.getData(am, h.getOption("data_cell_ref"));
                                var ao = S.getData(am, h.getOption("data_helper_type"));
                                var ar = S.getElement(at);
                                var ai = {};
                                switch (ao) {
                                    case"move-middle":
                                    case"add-middle":
                                        ai.parent = at;
                                        break;
                                    case"move-top":
                                    case"add-top":
                                    case"move-top-left":
                                    case"add-top-left":
                                        ai.before = at;
                                        break;
                                    case"move-bottom":
                                    case"add-bottom":
                                    case"move-top-right":
                                    case"add-top-right":
                                        ai.after = at;
                                        break
                                }
                                if (S.hasClass(ar, "level-util") || S.hasClass(ar, "level-foot")) {
                                    if (S.hasClass(ar, "level-util")) {
                                        h.insertNewCell(ai, "util")
                                    } else {
                                        h.insertNewCell(ai, "foot")
                                    }
                                } else {
                                    if (!S.hasClass(ar, "level-home")) {
                                        h.insertNewCell(ai)
                                    }
                                }
                            } else {
                                if (am.className.baseVal.indexOf("collapse") >= 0) {
                                    var at = b.trim(am.className.baseVal.replace(/(connection|collapse)/g, ""));
                                    h.setCurrentCell(at);
                                    var aj = b("#map-dropdown .expandcollapse");
                                    if (aj.length) {
                                        aj.trigger("click")
                                    }
                                } else {
                                    if (am.className.baseVal.indexOf("cellmask") >= 0) {
                                        var ap = b(am).closest(".cell");
                                        h.toggleCellMaskHighlight(ap[0])
                                    }
                                }
                            }
                        }
                    }
                }
            });
            m[0].addEventListener("mousemove", function (aj) {
                h.last_mouse_event = aj;
                if (!h.isEditBlocked() && !h.isBatchEdit()) {
                    var ai = h.getCellByCoords(aj);
                    if (ai) {
                        J(ai);
                        n(ai)
                    } else {
                        n()
                    }
                }
            });
            function s(ai, al, ak, aj) {
                if (aj) {
                    ak = {groups: h.getSerializedCellsGroups(true)}
                } else {
                    ak = {sitemap: ak || h.getSerialized(true), groups: h.getSerializedCellsGroups(true)}
                }
                E.request({
                    data: ak, success: function (am) {
                        a.has_unsaved_changes = false;
                        if (typeof al === "function") {
                            al()
                        }
                        if (am._nonce) {
                            a.updateNonce(am._nonce)
                        }
                        if (am.success) {
                            if (am.last_saved) {
                                b("#lastsaved").html(am.last_saved)
                            }
                            if (am.pages_count) {
                                b("#pagecount").html(am.pages_count)
                            }
                        }
                        if (am.error) {
                            e.error(am.error)
                        }
                        if (ai === true) {
                            return
                        }
                        if (am.success) {
                            e.success(a.__("Sitemap saved"))
                        } else {
                            if (am.redirect) {
                                i.redirect(am.redirect)
                            }
                        }
                    }
                })
            }

            a.subscribe("sitemap/sitemap_modified sitemap/history_undo sitemap/history_redo", function () {
                a.has_unsaved_changes = true;
                if (C.get("auto_save", false)) {
                    s(true)
                }
            });
            if (C.get("auto_save", false)) {
                a.subscribe("sitemap/cells_group_add sitemap/cells_group_update sitemap/cells_group_remove", function () {
                    a.has_unsaved_changes = true;
                    s(true, c, c, true)
                })
            }
        } else {
            a.$body.on("click", ".ui-widget-overlay", function () {
                b(".top-modal").dialog("close")
            });
            m[0].addEventListener("mouseover", function (ai) {
                ai = ai || window.event;
                j(ai, -17)
            });
            m[0].addEventListener("mouseout", function (ai) {
                af.css({left: -99999, top: -99999})
            });
            function ab(al, an, ap) {
                b(".top-modal").dialog("close");
                var am = b(this);
                var ai = {my: "right top", at: "right center", of: al};
                var ak = a.$window.scrollTop();
                var ao = b("#topmodal-cell-note.top-modal").parent().end();
                ao.find("form").each(function () {
                    this.reset()
                }).end().dialog("open");
                S.position(ao.parent()[0], ai, {top: 0, left: 0});
                a.$window.scrollTop(ak);
                if (typeof al === "object" && al.length) {
                    an = ah.charsDecode(an);
                    var aj = b("#topmodal-cell-note");
                    aj.css({height: ""}).find(".note-text").show().html(an).end().height(b("#topmodal-cell-note .note-text").outerHeight(true)).parent(".ui-tooltip-modal").css({
                        top: "+=13px",
                        left: "+=10px"
                    }).find(".note-text a").attr("target", "_blank");
                    if (ap && al.find(".icon-note").length) {
                        ao.parent().addClass("arrow-second")
                    } else {
                        ao.parent().removeClass("arrow-second")
                    }
                    if (aj.hasClass("tinyscrollbar-enabled")) {
                        ag.update(aj)
                    } else {
                        ag.init(aj)
                    }
                }
            }

            var u = false;
            a.$window.on("click", function () {
                if (u) {
                    S.removeClass(u, "highlighted");
                    var ak = h.getPapers();
                    if (ak && ak.svg) {
                        var ai = ak.svg.querySelectorAll(".cellmask");
                        for (var aj = ai.length; aj >= 0; --aj) {
                            S.removeElement(ai[aj])
                        }
                    }
                    u = false
                }
            });
            m[0].addEventListener("click", function (aG) {
                var aL = S.getRealTarget(aG);
                if (h.checkTag(aL, "use")) {
                    if (aL.className.baseVal.indexOf("icon-note") >= 0) {
                        var aq = b(aL).closest(".cell");
                        if (typeof aq === "object" && aq.length) {
                            var aE = S.getData(aq[0], h.getOption("data_desc")) || "";
                            ab(aq, aE)
                        }
                    } else {
                        if (aL.className.baseVal.indexOf("icon-file") >= 0) {
                            var aq = b(aL).closest(".cell");
                            a.publish("sitemap/lightbox_cell_files/open", [aq.get(0)])
                        } else {
                            if (aL.className.baseVal.indexOf("icon-url") >= 0) {
                                var aD = S.getData(b(aL).closest(".cell")[0], h.getOption("data_url"));
                                if (typeof aD === "string") {
                                    window.open(aD)
                                } else {
                                    if (aD && b.isArray(aD)) {
                                        if (aD.length === 1 && aD[0].type === "internal") {
                                            var aJ = h.getCellSection(aD[0].page);
                                            var aC = h.getCurrentSection();
                                            if (aJ !== aC) {
                                                var au = h.getSectionIfExists(aJ);
                                                if (au && (au.group || au.data)) {
                                                    var at = null;
                                                    if (au.data && au.data.parent) {
                                                        at = au.data.parent
                                                    } else {
                                                        if (au.group) {
                                                            at = S.getData(au.group, "parent")
                                                        }
                                                    }
                                                }
                                                if (at) {
                                                    h.openSection(aJ, at)
                                                }
                                            }
                                            if (aD[0].page) {
                                                var au = h.getSectionIfExists(aJ);
                                                if (au && au.group) {
                                                    var ao = au.group.querySelectorAll(".cell");
                                                    S.addClass(aD[0].page, "highlighted");
                                                    for (var aB = 0, az = ao.length; aB < az; ++aB) {
                                                        S.use("svg-cell-disabled-mask", {"class": "cellmask " + ((ao[aB].id === aD[0].page) ? "enabled" : "disabled")}, ao[aB])
                                                    }
                                                    setTimeout(function () {
                                                        u = aD[0].page
                                                    }, 50)
                                                }
                                            }
                                        } else {
                                            if (aD.length === 1 && aD[0].type === "external" && aD[0].label === "") {
                                                if (aD[0].url) {
                                                    window.open(aD[0].url)
                                                }
                                            } else {
                                                var am = "";
                                                for (var aB = 0, az = aD.length; aB < az; ++aB) {
                                                    if (typeof aD[aB] === "object" && aD[aB].type && aD[aB].url) {
                                                        if (aD[aB].type === "external") {
                                                            var av = aD[aB].label;
                                                            if (!av) {
                                                                av = aD[aB].url
                                                            }
                                                            am += '<li class="cell-url-preview"><a href="' + aD[aB].url.replace(/"/g, '\\"') + '" target="_blank"><span>' + ah.charsEncode(av);
                                                            am += '</span> <i class="fa fa-external-link"></i>';
                                                            am += "</a></li>"
                                                        }
                                                    }
                                                }
                                                if (am) {
                                                    am = "<ul>" + am + "</ul>";
                                                    var aq = b(aL).closest(".cell");
                                                    ab(aq, am, true)
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (aL.className.baseVal.indexOf("bar-section") >= 0) {
                                    var aq = b(aL).closest(".cell");
                                    h.setCurrentCell(aq[0]);
                                    h.openSection(c, aq[0])
                                } else {
                                    if (aL.className.baseVal.indexOf("bar-archetype") >= 0) {
                                        var aq = b(aL).closest(".cell");
                                        var al = aq[0];
                                        var aH = S.getData(al, h.getOption("data_archetype"));
                                        if (aH && typeof aH === "string") {
                                            var aI = C.get("archetypes");
                                            var aE = false;
                                            var aN = false;
                                            var aF = false;
                                            if (aH.charAt(0) === "_" && aI[aH] && aI[aH].desc) {
                                                aE = aI[aH].desc;
                                                aE = "<p>" + ah.charsEncode(aE) + "</p>";
                                                aN = ah.charsEncode(aI[aH].name)
                                            } else {
                                                if (aI._custom[aH] && aI._custom[aH].desc) {
                                                    aE = aI._custom[aH].desc;
                                                    aN = ah.charsEncode(aI._custom[aH].name);
                                                    if (aI._custom[aH].icon.substring(0, 3) === "fa-") {
                                                        aN = '<i class="fa ' + aI._custom[aH].icon + '"></i>' + aN
                                                    } else {
                                                        if (aI._custom[aH].icon !== "" && aI._custom[aH].icon.length === 1) {
                                                            aN = '<span class="letter">' + ah.charsEncode(aI._custom[aH].icon) + "</span>" + aN
                                                        }
                                                    }
                                                    aF = true
                                                }
                                            }
                                            if (aE && aN) {
                                                var ai = "black-arrow";
                                                b(".top-modal").dialog("close");
                                                var aK = {
                                                    my: "left top",
                                                    at: "left center",
                                                    of: aq,
                                                    top_offset: 20,
                                                    left_offset: -8
                                                };
                                                var an = al.getElementById("bar-section-" + al.id);
                                                var ap = al.getElementById("bar-archetype-" + al.id);
                                                var aM = al.getElementById("icon-note-" + al.id);
                                                var aw = al.getElementById("icon-url-" + al.id);
                                                var aA = al.getElementById("icon-file-" + al.id);
                                                var ar = (an ? 1 : 0) + (ap ? 1 : 0);
                                                var ak = (aM ? 1 : 0) + (aw ? 1 : 0) + (aA ? 1 : 0);
                                                var aj = !!(Boolean(ar > 1) || Boolean(ak > 1));
                                                if (aj) {
                                                    aK.at = "left bottom";
                                                    aK.top_offset = 1;
                                                    ai += " arrow-second"
                                                }
                                                var ax = b("#topmodal-cell-archetype");
                                                ax.dialog("open");
                                                ax.parent().removeClass("black-arrow arrow-second").addClass(ai);
                                                S.position(ax.parent()[0], aK, {top: 0, left: 0});
                                                if (typeof aq === "object" && aq.length) {
                                                    b("#archetype-desc .title > h4").html(aN).attr("class", "archetype-" + (aF ? "custom" : aH));
                                                    var ay = b("#archetype-desc").show().find(".text");
                                                    if (ay.hasClass("tinyscrollbar-enabled")) {
                                                        ag.updateContent(ay, aE);
                                                        ag.update(ay)
                                                    } else {
                                                        ay.html(aE);
                                                        ag.init(ay)
                                                    }
                                                    ay.find("a").attr("target", "_blank")
                                                }
                                            }
                                        }
                                    } else {
                                        if (aL.className.baseVal.indexOf("collapse") >= 0) {
                                            var at = b.trim(aL.className.baseVal.replace(/(connection|collapse)/g, ""));
                                            if (at) {
                                                h.toggleChildren(at, c, !q)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
        if (b("#modal-share").length) {
            var X = function () {
                var ai = b("#modal-share > form:visible").height() + (b("#modal-share").outerHeight(true) - b("#modal-share").height());
                ai = Math.max(ai, 410);
                var aj = a.$window.height() - ai;
                aj = (aj > 0) ? Math.max(aj / 2, 0) : 0;
                b("#modal-share").parent("div").css({top: aj, height: ai})
            };
            b("#modal-share").parent("div").addClass("ui-modal-share").end().tabs({
                hide: false,
                show: false,
                activate: function () {
                    X()
                }
            });
            var Z = b("#share-basecamp .select.baccount select");
            Z.selectmenu("destroy");
            Z.selectmenu({
                style: "popup", maxHeight: 400, format: function (ai) {
                    return ah.charsEncode(ai)
                }
            });
            Z.change(function () {
                E.clearAll();
                H.clearErrors(b(this).closest(".select"));
                var aj = b(this).val();
                b("#share-basecamp .recipients > div").remove();
                b("#share-basecamp .select.bproject").hide();
                var ai = b('<div id="basecamp-project-' + aj + '" class="loading" />').appendTo("#share-basecamp .recipients");
                E.request({
                    data: {basecamp_share_account: aj}, success: function (ak) {
                        if (ak._nonce) {
                            a.updateNonce(ak._nonce)
                        }
                        if (ak.projects) {
                            b("#share-basecamp .select.bproject select").html('<option value="">Select Project</option>');
                            for (var am = 0; am < ak.projects.length; ++am) {
                                b("#share-basecamp .select.bproject select").append('<option value="' + ak.projects[am]["id"] + '">' + ak.projects[am]["full_name"] + "</option>")
                            }
                        }
                        var al = b("#share-basecamp .select.bproject").show().find("select");
                        al.selectmenu("destroy");
                        al.selectmenu({
                            style: "popup", maxHeight: 400, format: function (an) {
                                return ah.charsEncode(an)
                            }
                        });
                        ai.remove();
                        X()
                    }
                })
            });
            var U = new nicEditor();
            Z = b("#share-basecamp .select.bproject select");
            Z.selectmenu("destroy");
            Z.selectmenu({
                style: "popup", maxHeight: 400, format: function (ai) {
                    return ah.charsEncode(ai)
                }
            });
            Z.change(function () {
                E.clearAll();
                H.clearErrors(b(this).closest(".select"));
                var al = b(this).val();
                var ak = b(this).find("option:selected").text();
                b("#share-basecamp .recipients > div").remove();
                var ai = b('<div id="basecamp-project-' + al + '" class="loading" />').appendTo("#share-basecamp .recipients");
                var aj = 0;
                if (b("#share-basecamp .select.baccount select").length) {
                    aj = b("#share-basecamp .select.baccount select").val()
                }
                E.request({
                    data: {basecamp_account: aj, basecamp_share: al}, success: function (an) {
                        if (an._nonce) {
                            a.updateNonce(an._nonce)
                        }
                        b(".basecamp-hide").show();
                        ai.removeClass("loading").append("<h2>" + ak + "</h2>");
                        if (an.recipients) {
                            for (var ap = 0; ap < an.recipients.length; ++ap) {
                                var aq = (ap === 0 || ap % 3 === 0) ? " first" : "";
                                ai.append('<div class="checkbox border' + aq + '"><input type="checkbox" id="form-brecipient-' + al + "-" + an.recipients[ap]["id"] + '" name="recipient[]" value="' + an.recipients[ap]["id"] + '"><label for="form-brecipient-' + al + "-" + an.recipients[ap]["id"] + '">' + an.recipients[ap]["first_name"] + " " + an.recipients[ap]["last_name"] + "</label></div>")
                            }
                        }
                        ai.show();
                        var am = U.instanceById("share-basecamp-message");
                        if (!am) {
                            U.panelInstance("share-basecamp-message")
                        }
                        if (an.categories) {
                            var ao = b("#share-basecamp #basecampcat");
                            ao.selectmenu("destroy");
                            ao.html('<option value="0">Category</option>');
                            for (var ap = 0; ap < an.categories.length; ++ap) {
                                ao.append('<option value="' + an.categories[ap]["id"] + '">' + an.categories[ap]["name"] + "</option>")
                            }
                            ao.val("0").selectmenu({
                                style: "popup", maxHeight: 200, format: function (ar) {
                                    return ah.charsEncode(ar)
                                }
                            })
                        }
                        X()
                    }
                })
            });
            b("#share-basecamp").on("submit", function (ao) {
                ao.preventDefault();
                E.clearAll();
                H.clearErrors(b(this));
                var ai = b("#share-basecamp-subject");
                var ak = b("#share-basecamp-message");
                var an = b("#basecampproject");
                var am = H.validate([{
                    value: ai.val(),
                    tiperror: ai.parent(),
                    rules: {empty: "Subject must not be empty"},
                    css: {left: 666, bottom: 5}
                }, {
                    value: ak.val(),
                    tiperror: ak.parent(),
                    rules: {empty: "Message must not be empty"},
                    css: {left: 666, bottom: 170}
                }, {
                    value: an.val(),
                    tiperror: an.parent(),
                    rules: {empty: "Select a project"},
                    css: {left: 666, bottom: 20}
                }]);
                if (am) {
                    var aj = b(this).closest(".modal");
                    var al = H.serializeObject(b(this));
                    E.request({
                        data: al,
                        $loading: b(this).find(".loading").css({visibility: "visible"}),
                        success: function (ap) {
                            if (ap._nonce) {
                                a.updateNonce(ap._nonce)
                            }
                            var aq = b("#share-basecamp select");
                            aq.selectmenu("destroy");
                            aq.filter(":not(#basecampcat)").val("").selectmenu({
                                style: "popup",
                                maxHeight: 400,
                                format: function (ar) {
                                    return ah.charsEncode(ar)
                                }
                            });
                            b("#share-basecamp #basecampcat").selectmenu({
                                style: "popup",
                                maxHeight: 200,
                                format: function (ar) {
                                    return ah.charsEncode(ar)
                                }
                            });
                            b("#share-basecamp .recipients > div").remove();
                            b(".basecamp-hide").hide();
                            aj.dialog("close");
                            if (ap.error) {
                                e.error(a.__("An error occured"))
                            } else {
                                e.success(a.__("Posted to Basecamp successfully"))
                            }
                        },
                        error: function (aq, at, ar) {
                            var ap = b("#share-basecamp select");
                            ap.selectmenu("destroy");
                            ap.filter(":not(#basecampcat)").val("").selectmenu({
                                style: "popup",
                                maxHeight: 400,
                                format: function (au) {
                                    return ah.charsEncode(au)
                                }
                            });
                            b("#share-basecamp #basecampcat").selectmenu({
                                style: "popup",
                                maxHeight: 200,
                                format: function (au) {
                                    return ah.charsEncode(au)
                                }
                            });
                            b("#share-basecamp .recipients > div").remove();
                            b(".basecamp-hide").hide();
                            aj.dialog("close")
                        }
                    })
                }
            });
            a.$body.on("click", "#add-recipient button", function (al) {
                al.preventDefault();
                H.clearErrors(b("#share-email"));
                var am = b("#add-recipient input:last");
                var an = b("#add-recipient input:first");
                var ak = H.validate([{
                    value: am.val(),
                    tiperror: am.parent(),
                    rules: {empty: a.__("Email must not be empty"), email: a.__("Invalid Email")},
                    bottom: 10
                }, {
                    value: an.val(),
                    tiperror: an.parent(),
                    rules: {empty: a.__("Name must not be empty")},
                    bottom: 10
                }]);
                if (!ak) {
                    return false
                }
                var aj = b("#share-email .recipients input").length;
                var ai = b("<div />").addClass("checkbox border");
                if (aj % 3 === 0) {
                    ai.addClass("first")
                }
                ai.html('<input type="checkbox" id="form-recipient-' + (++aj) + '" name="recipients[]" value="' + ah.charsEncode(am.val()) + '" checked><label for="form-recipient-' + aj + '">' + ah.charsEncode(an.val()) + "</label>");
                ai.appendTo("#share-email .recipients");
                b("#add-recipient input").val("").blur();
                X()
            });
            b("#share-email").on("submit", function (an) {
                an.preventDefault();
                E.clearAll();
                H.clearErrors(b(this));
                var ai = b("#share-mail-subject");
                var ak = b("#share-mail-message");
                var am = H.validate([{
                    value: ai.val(),
                    tiperror: ai.parent(),
                    rules: {empty: a.__("Subject must not be empty")},
                    css: {left: 666, bottom: 5}
                }, {
                    value: ak.val(),
                    tiperror: ak.parent(),
                    rules: {empty: a.__("Message must not be empty")},
                    css: {left: 666, bottom: 170}
                }]);
                if (!b("#share-email .recipients input:checked").length) {
                    H.error(b("#add-recipient > .input:first-child"), a.__("Select at least one recipient"), {
                        left: 426,
                        bottom: 5
                    }, c, c, 10)
                } else {
                    if (am) {
                        var aj = b(this).closest(".modal");
                        var al = H.serializeObject(b(this));
                        E.request({
                            data: al,
                            $loading: b(this).find(".loading").css({visibility: "visible"}),
                            success: function (ao) {
                                if (ao._nonce) {
                                    a.updateNonce(ao._nonce)
                                }
                                aj.dialog("close");
                                e.success(a.__("Email sent successfully"))
                            },
                            error: function (ao, aq, ap) {
                                aj.dialog("close")
                            }
                        })
                    }
                }
            });
            a.$body.on("change", "#share-mail-subject, #share-mail-message", function () {
                b("#share-email .error").removeClass("error");
                var aj = b("#share-mail-subject").val();
                var ak = b("#share-mail-message").val();
                var ai = b("#share-email .recipients input:checked").length;
                if (ai) {
                    b("#add-recipient > div.input").removeClass("error")
                }
                if (aj) {
                    b("#share-mail-subject").parent("div").removeClass("error")
                }
                if (ak) {
                    b("#share-mail-message").parent("div").removeClass("error")
                }
            });
            a.$body.on("change", "#share-email .recipients input", function () {
                b("#add-recipient .error").removeClass("error");
                var ai = b("#share-email .recipients input:checked").length;
                if (!ai) {
                    b("#add-recipient > div.input").addClass("error")
                }
            });
            a.$body.on("click", '#share-social input[type="submit"]', function (am) {
                am.preventDefault();
                var al = b(this).closest("fieldset");
                var aj = b('head > link[rel="canonical"]').attr("href");
                var an = b.trim(al.find('input[type="text"]').val().replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, ""));
                var ak = 550;
                var ai = 300;
                if (al.attr("id") === "share-social-facebook") {
                    aj = "https://www.facebook.com/sharer.php?u=" + escape(aj) + "&t=" + escape(an)
                } else {
                    if (al.attr("id") === "share-social-linkedin") {
                        ak = 580;
                        ai = 350;
                        aj = "http://www.linkedin.com/shareArticle?mini=true&ro=false&trk=bookmarklet&title=" + escape(an) + "&url=" + escape(aj)
                    } else {
                        aj = "https://twitter.com/intent/tweet?url=" + escape(aj) + "&text=" + escape(an)
                    }
                }
                window.open(aj, "intent", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=" + ak + ",height=" + ai + ",left=" + (a.$window.width() / 2 - ak / 2) + ",top=" + (a.$window.height() / 2 - ai / 2));
                E.request({
                    data: {sitemap_shared: "social"}, success: function (ao) {
                        if (ao._nonce) {
                            a.updateNonce(ao._nonce)
                        }
                    }
                })
            });
            b("#share-password").on("submit", function (ao) {
                ao.preventDefault();
                E.clearAll();
                H.clearErrors(b(this));
                var an = H.serializeObject(b(this));
                var aj = b(this).closest(".modal");
                var ai = b("#form-share-password");
                var al = b("#form-enablepass");
                var ak = b.trim(ai.val());
                var am = ak.replace(/\*/g, "");
                if (am) {
                    E.request({
                        data: an,
                        $loading: b(this).find(".loading").css({visibility: "visible"}),
                        success: function (ap) {
                            if (ap._nonce) {
                                a.updateNonce(ap._nonce)
                            }
                            aj.dialog("close");
                            e.success(a.__("Password changed"));
                            ai.replaceWith('<input type="password" id="form-share-password" name="password_protect" value="********">');
                            al.replaceWith('<input type="checkbox" id="form-enablepass" name="password_protect_enabled" value="1" checked>');
                            b("#share-password").data("haspasswd", "1")
                        },
                        error: function (ap, ar, aq) {
                            aj.dialog("close")
                        }
                    })
                } else {
                    if (ak) {
                        aj.dialog("close");
                        e.success(a.__("Password not changed"));
                        al.replaceWith('<input type="checkbox" id="form-enablepass" name="password_protect_enabled" value="1" checked>');
                        b("#share-password").data("haspasswd", "1")
                    } else {
                        H.error(ai.parent(), a.__("Password must not be empty"), c, c, c, 10)
                    }
                }
            });
            a.$body.on("change", "#form-enablepass", function () {
                var aj = b(this);
                var ak = aj.parent().next(".input");
                if (this.checked) {
                    b("#form-share-password").replaceWith('<input type="password" id="form-share-password" name="password_protect" value="">');
                    ak.show()
                } else {
                    ak.hide();
                    var ai = parseInt(b("#share-password").data("haspasswd"), 10);
                    if (ai) {
                        E.request({
                            data: this.name + "=0", success: function (al) {
                                if (al._nonce) {
                                    a.updateNonce(al._nonce)
                                }
                            }
                        });
                        aj.replaceWith('<input type="checkbox" id="form-enablepass" name="password_protect_enabled" value="1">');
                        b("#share-password").data("haspasswd", "0");
                        e.success(a.__("Password removed"))
                    }
                }
            }).on("click", "#share-clipboard", function (ai) {
                ai.preventDefault()
            });
            a.subscribe("modal/open/modal-share", function V(aj, ai) {
                if (ai.length) {
                    var ak = ai.find("#form-enablepass");
                    if (ak.length && ak.is(":checked")) {
                        ak.parent().next(".input").show()
                    } else {
                        ak.parent().next(".input").hide()
                    }
                    X()
                }
            });
            ZeroClipboard.config({
                trustedDomains: [window.location.hostname.replace(/^\/|\/$/g, ""), C.get("statics_path").replace(/^https?:\/\//, "").replace(/\/static\/?$/, "")],
                allowScriptAccess: "always",
                swfPath: C.get("statics_path") + "js/ZeroClipboard/ZeroClipboard.swf",
                forceHandCursor: true
            });
            var T = new ZeroClipboard(o.getElementById("share-clipboard"));
            T.on("ready", function (ai) {
                T.on("aftercopy", function (aj) {
                    E.request({
                        data: {sitemap_shared: "url"}, success: function (ak) {
                            if (ak._nonce) {
                                a.updateNonce(ak._nonce)
                            }
                        }
                    })
                })
            })
        }
        b("#sitemap-top").on("click", "#comments.button", function (ai) {
            ai.preventDefault();
            if (!b("#sitemap-comments").length) {
                return a.noPermissions()
            }
            b("#sitemap-comments-top").removeClass("isbatch");
            b("#sitemap-top").removeClass("expanded-batch").addClass("expanded");
            b("#sitemaptop-wrapper-helper").removeClass("comments-open batch-open").addClass("comments-open");
            b(this).children("span").removeClass("new");
            E.request({
                data: {commentview: 1}, dataType: "html", success: function (aj) {
                    aj = b("<div />").append(aj);
                    var ak = aj.find('input[type="hidden"][name="_nonce"]:first');
                    if (ak.length) {
                        a.updateNonce(ak.val())
                    }
                }
            })
        });
        b("#sitemap-comments-top").on("click", "button.reset", function (ai) {
            ai.preventDefault();
            b("#sitemap-top").removeClass("expanded");
            b("#sitemaptop-wrapper-helper").removeClass("comments-open batch-open").removeClass("comments-open")
        });
        var G = new nicEditor();
        if (o.getElementById("form-comment")) {
            G.panelInstance("form-comment")
        }
        var D = false;
        var B = false;
        b("#post-comment").on("submit", function (aj, al) {
            aj.preventDefault();
            if (B) {
                return false
            }
            E.clearAll();
            H.clearErrors(b(this));
            var ak = b.trim(b("#form-comment").val().replace("<br>", "").replace("<p></p>", ""));
            if (!ak) {
                H.error(b("#post-comment .submit"), a.__("Comments must not be empty"), {bottom: 6}, false, -165)
            } else {
                B = true;
                var ai = H.serializeObject(b(this));
                E.request({
                    data: ai,
                    dataType: "html",
                    $loading: b(this).find(".loading").css({visibility: "visible"}),
                    success: function (an) {
                        if (an) {
                            var ap = b("<div />").append(an);
                            an = ap.find("#scroll-area").html();
                            a.require("scrollbar").updateContent("#scroll-area", an).update("#scroll-area", (b("#post-comment .reply").is(":visible") ? "relative" : "bottom"));
                            b("#comments > span").text(parseInt(b("#comments > span").html(), 10) + 1);
                            if (!aa && typeof E.getSession === "function") {
                                var am = E.getSession();
                                if (am && h.getUsersCount() > 0) {
                                    am.publish("sitemap_comment_" + P, {
                                        added: an,
                                        count: o.getElementById("comments").querySelector("span").innerHTML,
                                        sitemap_id: P
                                    })
                                }
                            }
                            var ao = ap.find('input[type="hidden"][name="_nonce"]:first');
                            if (ao.length) {
                                a.updateNonce(ao.val())
                            }
                            an = null;
                            if (al && typeof al === "function") {
                                al()
                            }
                        } else {
                            alert("Unknown error")
                        }
                        G.instanceById("form-comment").setContent("");
                        G.instanceById("form-comment").saveContent();
                        b("#post-comment textarea").val("");
                        b("#post-comment .reply > a").trigger("click");
                        B = false
                    },
                    error: function (am, ao, an) {
                        B = false
                    }
                })
            }
        });
        b("#scroll-area").on("click", "a.reply", function (aj) {
            aj.preventDefault();
            var ai = b('#post-comment input[name="reply"]');
            if (!ai.length) {
                ai = b('<input type="hidden" name="reply">').appendTo(b("#post-comment"))
            }
            ai.val(b(this).data("id"));
            if (!D) {
                b("#post-comment .wysiwyg > .nicEdit-mainwrap").css({height: "-=24px"});
                b("#post-comment .wysiwyg > .nicEdit-mainwrap > .nicEdit-main").css({minHeight: "-=24px"});
                D = true
            }
            console.info(b(this));
            b("#post-comment .reply").show().find("span").html(b(this).siblings("span").html())
        });
        b("#sitemap-top").on("click", "#post-comment .reply > a", function (ai) {
            ai.preventDefault();
            b('#post-comment input[name="reply"]').remove();
            b(this).parent().hide();
            if (D) {
                b("#post-comment .wysiwyg > .nicEdit-mainwrap").css({height: "+=24px"});
                b("#post-comment .wysiwyg > .nicEdit-mainwrap > .nicEdit-main").css({minHeight: "+=24px"})
            }
            D = false
        });
        b("#sitemap-comments .item a").attr("target", "_blank");
        b("#sitemap-comments").on("click", "a[data-delete]", function (al, am) {
            al.preventDefault();
            var ak = b(this);
            $items = b("#sitemap-comments .group-" + ak.closest(".item").data("id"));
            $items.animate({height: 0, opacity: 0}, 300, function () {
                b(this).hide()
            });
            var ai = ak.data("delete");
            var aj = H.serializeObject(b(this));
            E.request({
                data: {deletecomment: ai}, success: function (ao) {
                    if (ao._nonce) {
                        a.updateNonce(ao._nonce)
                    }
                    if (ao.success) {
                        $items.remove();
                        b("#comments > span").text(b("#sitemap-comments div.item").length);
                        a.require("scrollbar").update("#scroll-area", "relative");
                        if (typeof am === "function") {
                            am()
                        }
                        if (!aa && typeof E.getSession === "function") {
                            var an = E.getSession();
                            if (an && h.getUsersCount() > 0) {
                                an.publish("sitemap_comment_" + P, {
                                    deleted: ai,
                                    count: o.getElementById("comments").querySelector("span").innerHTML,
                                    sitemap_id: P
                                })
                            }
                        }
                    } else {
                        if (ao.error) {
                            $items.stop().show().css({opacity: 1, height: ""});
                            notify(ao.error)
                        }
                    }
                }, error: function (an, ap, ao) {
                    $items.stop().show().css({opacity: 1, height: ""})
                }
            })
        });
        if (!!(o.createElement("audio").canPlayType)) {
            var ae = o.createElement("audio");
            var ad = (!!ae.canPlayType && "" != ae.canPlayType('audio/ogg; codecs="vorbis"')) ? "ogg" : ((!!ae.canPlayType && "" != ae.canPlayType("audio/mpeg")) ? "mp3" : "");
            if (ad.length) {
                ae.setAttribute("src", C.get("statics_path") + "commentsnd." + ad);
                ae.load()
            } else {
                ae = null
            }
        }
        b("#sitemap-name").on("change", "select.change_sitemap", function () {
            if (this.value) {
                var ai = o.location.href.split("/");
                ai[ai.length - 1] = this.value;
                i.redirect(ai.join("/"))
            }
        });
        a.$body.on("click", "#action-lock, #action-unlock, #action-approve", function (ak) {
            ak.preventDefault();
            var aj = this.id.replace("action-", "");
            K = true;
            e.clearAll(true);
            var ai = {};
            ai["sitemap_" + aj] = 1;
            E.request({
                data: ai, success: function (al) {
                    if (al._nonce) {
                        a.updateNonce(al._nonce)
                    }
                    if (al.redirect) {
                        a.publish("sitemap/status_changed/" + aj);
                        i.redirect(al.redirect)
                    } else {
                        if (!al.error) {
                            al.error = a.__("An error occured")
                        }
                        e.error(al.error);
                        K = false
                    }
                }, error: function () {
                    e.error(a.__("An error occured"));
                    K = false
                }
            })
        }).on("click", "#action-request-unlock", function (ai) {
            ai.preventDefault();
            K = true;
            e.clearAll(true);
            E.request({
                data: {sitemap_request_unlock: 1}, success: function (aj) {
                    if (aj._nonce) {
                        a.updateNonce(aj._nonce)
                    }
                    if (aj.success) {
                        e.success(aj.success)
                    } else {
                        if (!aj.error) {
                            aj.error = a.__("An error occured")
                        }
                        e.error(aj.error);
                        K = false
                    }
                }, error: function () {
                    e.error(a.__("An error occured"));
                    K = false
                }
            })
        });
        a.subscribe("sitemap/after_load notification_closed", function () {
            if (K) {
                return
            }
            if (typeof _SLICKPLAN_LOCK === "object" && _SLICKPLAN_LOCK.type && _SLICKPLAN_LOCK.message && typeof e[_SLICKPLAN_LOCK.type] === "function") {
                e[_SLICKPLAN_LOCK.type](_SLICKPLAN_LOCK.message, {persistent: true, html: true})
            }
        });
        b("#action-print").on("click", function (ai) {
            ai.preventDefault();
            if (window.print !== c) {
                window.print()
            }
        });
        b("#action-zoom-in").on("click", function (aj) {
            aj.preventDefault();
            var ai = h.zoomIn();
            e.info(a.__("Zoom: {1}%", Math.round(ai * 100)), {icon: false, persistent: false})
        });
        b("#action-zoom-out").on("click", function (aj) {
            aj.preventDefault();
            var ai = h.zoomOut();
            e.info(a.__("Zoom: {1}%", Math.round(ai * 100)), {icon: false, persistent: false})
        });
        b(".editdisabled").on("click", function (ai) {
            ai.preventDefault();
            ai.stopPropagation();
            a.publish("notification_closed")
        });
        if (q) {
            b("#action-save").on("click", function (ai, aj) {
                ai.preventDefault();
                s(false, aj)
            });
            b("#action-orientation").on("click", function (aj) {
                aj.preventDefault();
                if (!a.currentUserCan("sitemap_vertical_design")) {
                    return a.noPermissions()
                }
                if (h.isEditBlocked(c, "sitemap")) {
                    return false
                }
                var ai = (h.getTemplate() === "horizontal") ? "vertical" : "horizontal";
                b(this).removeClass("vertical horizontal").addClass(ai);
                S.clearCache();
                h.clearCache();
                h.changeTemplate(ai);
                h.fullRefresh();
                a.publish("sitemap/sitemap_modified", ["template", h.getCurrentSection(), ai])
            })
        }
        var Y = a.$window.width();
        var f = a.$window.height();
        a.$window.on("debouncedresize", function (al, ak) {
            if (typeof ak === "object" && ak.element && ak.position) {
                return false
            }
            var ai = a.$window.width();
            var aj = a.$window.height();
            if (Y != ai) {
                h.fullRefresh();
                Y = ai
            }
            if (f != aj) {
                h.refreshContainerSize();
                f = aj
            }
        });
        var y = C.get("me");
        var M = false;
        var w = false;
        a.subscribe("websocket/sitemap/edit/" + P, function (al, ai) {
            if (aa) {
                return
            }
            a.$body.addClass("canwebsocket");
            ai.subscribe("account_data_changed_" + C.get("account")["subdomain"], function (ao, an) {
                if (an.user_id) {
                    var am = an.user_id;
                    var ap = b("#box-contributor-" + am);
                    if (ap.length) {
                        ap.attr("title", an.email).data("email", an.email).data("first", an.first_name).data("last", an.last_name).children("span").text(an.first_name + " " + an.last_name)
                    }
                }
            });
            ai.subscribe("sitemap_comment_" + P, function (ap, ao) {
                var aq = o.getElementById("comments").querySelector("span");
                if (aq && ao.added && ao.count !== c) {
                    var an = parseInt(aq.innerHTML, 10);
                    ao.count = parseInt(ao.count, 10);
                    if (ao.count !== an) {
                        a.require("scrollbar").updateContent("#scroll-area", ao.added).update("#scroll-area");
                        aq.classList.add("new");
                        aq.innerHTML = ao.count;
                        if (typeof ae === "object") {
                            ae.play()
                        }
                        b("#scroll-area a[data-delete]").remove();
                        if (I) {
                            var am = a.__("Delete");
                            b("#scroll-area .reply").each(function () {
                                var ar = b(this).closest(".item").data("id");
                                b(this).before('<a data-delete="' + ar + '" href="#">' + am + "</a>")
                            })
                        }
                    }
                }
                if (aq && ao.deleted && ao.count !== c) {
                    ao.count = parseInt(ao.count, 10);
                    aq.innerHTML = ao.count;
                    b("#comment-item-" + ao.deleted).remove()
                }
                ao = c
            });
            ai.subscribe("sitemap_" + P + "_cells_group_change", function (an, am) {
                if (am.user_id && am.user_id !== y.id && ac.isObject(am.groups)) {
                    h.loadCellsGroupsJSON(am.groups)
                }
            });
            ai.subscribe("sitemap_" + P + "_user_" + y.id + "_onconnect_callback", function (ap, ao) {
                if (ao.user && ao.user.user_id !== y.id) {
                    h.addUser(ao.user)
                }
                var am = h.getOption("id_main_section");
                if (!M && ao.sitemap && ao.sitemap[am] && ao.sitemap[am].cells && ao.sitemap[am].cells.length) {
                    F = true;
                    M = true;
                    h.blockEdit(am, "sitemap", ao.user.user_id);
                    h.loadFromWebsocket(ao.sitemap);
                    var aq = o.getElementById(am);
                    if (aq) {
                        var an = aq.querySelector("svg.cell.level-home");
                        if (!an) {
                            an = aq.querySelector("svg.cell")
                        }
                        if (an) {
                            h.setCurrentCell(an)
                        }
                    }
                    h.unblockEdit(am, "sitemap", ao.user.user_id);
                    h.fullRefresh()
                }
                if (ao.editing && ao.editing.sitemap_id === P && ao.editing.section_id === am) {
                    switch (ao.editing.type) {
                        case"color":
                            h.blockEdit(am, "colors", ao.user.user_id);
                            break;
                        default:
                            h.blockEdit(am, "sitemap", ao.user.user_id);
                            break
                    }
                }
                M = true
            });
            ai.subscribe("sitemap_" + P + "_user_connected", function (an, am) {
                if (am.user_id && am.user_id !== y.id) {
                    var ao;
                    ai.publish("sitemap_" + P + "_user_" + am.user_id + "_onconnect_callback", {
                        user: {
                            user_id: y.id,
                            user_name: y.full_name,
                            user_initials: y.initials,
                            user_avatar: b("#user-box img").data("blank") ? false : b("#user-box img").attr("src")
                        },
                        sitemap: (q && (ao = b("#sitemap-menu .orientation")).length && !ao.hasClass("editdisabled")) ? h.getSerialized(true) : null,
                        editing: w,
                        sitemap_id: P
                    });
                    h.addUser(am)
                }
            });
            ai.subscribe("sitemap_" + P + "_user_disconnected", function (an, am) {
                if (am.user && am.user.id && am.user.id !== y.id) {
                    h.unblockEdit(am.section_id, "sitemap", am.user.id);
                    h.removeUser(am.user.id);
                    h.removeUserFromChat(am.user)
                }
            });
            ai.subscribe("sitemap_" + P + "_changed", function (ao, an) {
                if (!an.action || !an.section_id || an.user_id === y.id) {
                    return
                }
                var aq = false;
                var ap = true;
                var am = h.getCurrentSection();
                if (an.sitemap && an.action !== "color_scheme") {
                    if (an.sitemap[an.section_id] && an.sitemap[an.section_id].cells && an.sitemap[an.section_id].cells.length) {
                        h.loadFromWebsocket(an.sitemap, an.section_id)
                    }
                    ap = (an.section_id === am);
                    aq = true
                } else {
                    h.setCurrentSection(an.section_id);
                    if (an.action === "color_scheme") {
                        if (an.data && typeof an.data.default_color !== c) {
                            if (typeof an.additional_data === "string") {
                                h.changeStyle(an.additional_data, true)
                            } else {
                                if (an.additional_data) {
                                    if (typeof an.additional_data.style === "string") {
                                        h.changeStyle(an.additional_data.style, true)
                                    }
                                    if (an.additional_data.textShadow !== c) {
                                        h.setTextShadow(!!an.additional_data.textShadow, an.section_id)
                                    }
                                }
                            }
                            h.setTempScheme(an.data);
                            aq = true;
                            if (w) {
                                ap = false
                            }
                        }
                    }
                }
                if (ap) {
                    h.fullRefresh()
                }
                if (aq && q) {
                    a.publish("sitemap/sitemap_modified_via_websocket", [null, an.section_id])
                }
                if (am) {
                    h.setCurrentSection(am)
                }
            });
            ai.subscribe("sitemap_" + P + "_logo_changed", function (an, am) {
                if (am.new_logo === c || am.user_id === y.id) {
                    return
                }
                var ao = b("#sitemap-logo");
                if (typeof am.new_logo === "string" && am.new_logo.length > 0) {
                    ao.find(".loading-logo").hide().end().find(".add-logo").hide().end().find(".sitemap-logo").addClass("visible").show().find("img").attr("src", am.file_path)
                } else {
                    ao.find(".sitemap-logo").removeClass("visible");
                    ao.find(".loading-logo").hide();
                    b("#pluploadbtn").show()
                }
                a.publish("upload/refresh")
            });
            ai.subscribe("sitemap_" + P + "_custom_archetype_saved", function (ao, an) {
                if (!an.archetype_id || !an.archetype_name || !an.archetype_icon || an.user_id === y.id) {
                    return
                }
                var aq = C.get("archetypes", {});
                if (aq._custom[an.archetype_id] === c) {
                    if (an.archetype_icon.substring(0, 3) === "fa-") {
                        var ap = '<i class="fa ' + an.archetype_icon + '"></i>';
                        var ar = {type: "fa", fa: an.archetype_icon}
                    } else {
                        var ap = an.archetype_icon;
                        var ar = {type: "letter", letter: an.archetype_icon}
                    }
                    aq._custom[an.archetype_id] = {name: an.archetype_name, icon: an.archetype_icon};
                    C.set("archetypes", aq);
                    h.updateArchetypeDef(an.archetype_id, an.archetype_name, ar);
                    var am = b('<div data-archetype="' + an.archetype_id + '" class="archetype archetype-' + an.archetype_id + '" title="' + an.archetype_name.replace(/"/g, "&quot;") + '"><span>' + an.archetype_name + '</span><div class="icon">' + ap + '</div><a href="#" class="edit"><i class="fa fa-pencil"></i></a></div>');
                    b("#topmodal-cell-archetype #archetype-desc").before(am);
                    if (an.cell_id !== c) {
                        h.addCellArchetype(an.cell_id, an.archetype_id, true)
                    }
                }
            });
            ai.subscribe("sitemap_" + P + "_custom_archetype_removed", function (an, am) {
                if (!am.archetype_id || am.user_id === y.id) {
                    return
                }
                var ao = C.get("archetypes", {});
                if (ao._custom[am.archetype_id] !== c) {
                    ao._custom[am.archetype_id] = c;
                    delete ao._custom[am.archetype_id];
                    C.set("archetypes", ao);
                    b("#topmodal-cell-archetype div.archetype-" + am.archetype_id).remove();
                    h.removeArchetypeDef(am.archetype_id, true)
                }
            });
            ai.subscribe("sitemap_" + P + "_history_change", function (an, am) {
                if (!am.section_id || !am.sitemap || am.user_id === y.id) {
                    return
                }
                if (am.sitemap[am.section_id] && am.sitemap[am.section_id].cells && am.sitemap[am.section_id].cells.length) {
                    h.loadFromWebsocket(am.sitemap, am.section_id);
                    h.fullRefresh();
                    if (q) {
                        a.publish("sitemap/sitemap_modified_via_websocket", [null, am.section_id])
                    }
                }
            });
            ai.subscribe("sitemap_" + P + "_refresh", function (an, am) {
                if (am.user_id === y.id) {
                    return
                }
                C.set("warn_before_leave", false);
                i.refresh()
            });
            ai.subscribe("sitemap_" + P + "_contributor_" + y.id, function (aq, ap) {
                if (ap.user_id === y.id || ap.sitemap_id !== P) {
                    return
                }

                if (ap.contributor_data) {
                    var am = b("#sitemap-wrapper").data("role");
                    var ao = !!b("#sitemap-wrapper").data("locked");
                    var an = !!b("#sitemap-wrapper").data("approved");

                    if (!ap.contributor_data.role || am != ap.contributor_data.role) {
                        return i.refresh()
                    }
                    b("#action-approve, #action-unlock, #action-lock").remove();
                    if (ap.contributor_data.can_lock) {
                        if (ao) {
                            b("#sitemap-menu a.text.close").closest("li").before('<li><a href="#" class="text icon lock" id="action-unlock">Unlock Sitemap</a></li>')
                        } else {
                            b("#sitemap-menu a.text.close").closest("li").before('<li><a href="#" class="text icon lock" id="action-lock">Lock Sitemap</a></li>')
                        }
                    }
                    if (ap.contributor_data && ap.contributor_data.can_approve && !an) {
                        b("#sitemap-menu a.text.close").closest("li").before('<li><a href="#" class="text icon approve" id="action-approve">Approve Sitemap</a></li>')
                    }
                    K = true;
                    window._SLICKPLAN_LOCK = {};
                    if (an) {
                        window._SLICKPLAN_LOCK.type = "success";
                        window._SLICKPLAN_LOCK.message = a.__("This sitemap has been approved");
                        if (ap.contributor_data.can_lock) {
                            window._SLICKPLAN_LOCK.message += ' <a href="#" id="action-unlock"><i class="fa fa-unlock"></i> ' + a.__("Unlock") + "</a>"
                        } else {
                            window._SLICKPLAN_LOCK.message += ' <a href="#" id="action-request-unlock"><i class="fa fa-unlock"></i> ' + a.__("Request Unlock") + "</a>"
                        }
                        K = false
                    } else {
                        if (ap.contributor_data.can_approve && !ao) {
                            window._SLICKPLAN_LOCK.type = "info";
                            window._SLICKPLAN_LOCK.message = a.__("You have been assigned to approve this sitemap. ") + ' <a href="#" id="action-approve"><i class="fa fa-check"></i> ' + a.__("Approve Sitemap") + "</a>";
                            K = false
                        } else {
                            if (ao) {
                                window._SLICKPLAN_LOCK.type = "error";
                                window._SLICKPLAN_LOCK.message = a.__("This sitemap has been locked");
                                if (ap.contributor_data.can_lock) {
                                    window._SLICKPLAN_LOCK.message += ' <a href="#" id="action-unlock"><i class="fa fa-unlock"></i> ' + a.__("Unlock") + "</a>"
                                } else {
                                    window._SLICKPLAN_LOCK.message += ' <a href="#" id="action-request-unlock"><i class="fa fa-unlock"></i> ' + a.__("Request Unlock") + "</a>"
                                }
                                K = false
                            }
                        }
                    }
                    e.clearAll(true);
                    a.publish("notification_closed")
                }
            });
            ai.subscribe("sitemap_" + P + "_chat", function (an, am) {
                if (am.user_id === y.id) {
                    return
                }
                if (am.action === "chat_message") {
                    h.showChat()
                }
                if (am.user) {
                    h.addUserToChat(am.user);
                    if (am.message) {
                        h.addMessageToChat(am.user, am.message)
                    }
                } else {
                    if (am.user_left) {
                        h.removeUserFromChat(am.user_left)
                    }
                }
            });
            if (q) {
                var aj = function (an, am) {
                    if (!am.section_id || !am.user_id || am.user_id === y.id) {
                        return
                    }
                    h.blockEdit(am.section_id, "sitemap", am.user_id)
                };
                var ak = function (an, am) {
                    if (!am.section_id || !am.user_id || am.user_id === y.id) {
                        return
                    }
                    h.unblockEdit(am.section_id, "sitemap", am.user_id)
                };
                ai.subscribe("sitemap_" + P + "_drag_start", aj);
                ai.subscribe("sitemap_" + P + "_cell_note_edit_open", aj);
                ai.subscribe("sitemap_" + P + "_cell_url_edit_open", aj);
                ai.subscribe("sitemap_" + P + "_cell_archetype_edit_open", aj);
                ai.subscribe("sitemap_" + P + "_cell_color_edit_open", aj);
                ai.subscribe("sitemap_" + P + "_cell_text_color_edit_open", aj);
                ai.subscribe("sitemap_" + P + "_cell_text_edit_open", aj);
                ai.subscribe("sitemap_" + P + "_drag_stop", ak);
                ai.subscribe("sitemap_" + P + "_cell_note_edit_close", ak);
                ai.subscribe("sitemap_" + P + "_cell_url_edit_close", ak);
                ai.subscribe("sitemap_" + P + "_cell_archetype_edit_close", ak);
                ai.subscribe("sitemap_" + P + "_cell_color_edit_close", ak);
                ai.subscribe("sitemap_" + P + "_cell_text_color_edit_close", ak);
                ai.subscribe("sitemap_" + P + "_cell_text_edit_close", ak);
                ai.subscribe("sitemap_" + P + "_batch_edit_open", function (an, am) {
                    if (!am.user_id || am.user_id === y.id) {
                        return
                    }
                    h.blockEdit(c, "batchedit", am.user_id)
                });
                ai.subscribe("sitemap_" + P + "_batch_edit_close", function (an, am) {
                    if (!am.user_id || am.user_id === y.id) {
                        return
                    }
                    h.unblockEdit(c, "batchedit", am.user_id)
                });
                ai.subscribe("sitemap_" + P + "_color_edit_open", function (an, am) {
                    if (!am.type || !am.section_id || !am.user_id) {
                        return
                    }
                    if (am.user_id === y.id) {
                        if (O && (new Date()).getTime() - O < 750) {
                            h.unblockEdit(am.section_id, "colors", am.user_id);
                            var ao = am.type;
                            switch (am.type) {
                                case"swatch_presets":
                                    ao = "color";
                                    break;
                                case"lines_text":
                                    ao = "lines-text-colors";
                                    break;
                                case"custom_color":
                                    ao = "custom";
                                    break;
                                case"shadows_gradients":
                                    ao = "shadows-gradients";
                                    break;
                                case"themes":
                                    ao = "color-themes";
                                    break
                            }
                            b("#sitemap-top > #sitemap-" + ao).addClass("show")
                        }
                        return
                    }
                    section_id = h.getCurrentSection();
                    if (section_id === am.section_id) {
                        b("#sitemap-top form.show").find("button.reset").trigger("click", [true])
                    }
                    h.blockEdit(am.section_id, "colors", am.user_id);
                    O = (new Date()).getTime()
                });
                ai.subscribe("sitemap_" + P + "_color_edit_close", function (an, am) {
                    if (!am.type || !am.section_id || am.user_id === y.id) {
                        return
                    }
                    h.unblockEdit(am.section_id, "colors", am.user_id)
                });
                a.subscribe("sitemap/cells_group_add sitemap/cells_group_update sitemap/cells_group_remove", function (an, ao, am) {
                    if (h.getUsersCount() <= 0 || !am) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_cells_group_change", {
                        user_id: y.id,
                        user_name: y.full_name,
                        groups: am
                    })
                });
                a.subscribe("sitemap/history_undo sitemap/history_redo", function (ao, am, an) {
                    if (h.getUsersCount() <= 0 || !an || !an.serialized || !an.hash) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_history_change", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: am,
                        sitemap: an.serialized,
                        hash: an.hash,
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/custom_archetype_saved", function (ao, ap, am, an) {
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_custom_archetype_saved", {
                        user_id: y.id,
                        user_name: y.full_name,
                        archetype_id: ap,
                        archetype_icon: an,
                        archetype_name: am,
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/custom_archetype_removed", function (am, an) {
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_custom_archetype_removed", {
                        user_id: y.id,
                        user_name: y.full_name,
                        archetype_id: an,
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/logo_changed", function (an, am) {
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_logo_changed", {
                        user_id: y.id,
                        user_name: y.full_name,
                        new_logo: am,
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/sitemap_modified", function (aq, ap, am, ao, an) {
                    if (!ap || h.getUsersCount() <= 0) {
                        return
                    }
                    if (!am) {
                        am = h.getCurrentSection()
                    }
                    ai.publish("sitemap_" + P + "_changed", {
                        user_id: y.id,
                        user_name: y.full_name,
                        action: ap,
                        section_id: am,
                        data: ao,
                        additional_data: an,
                        sitemap: h.getSerialized(true),
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/section_opened", function (aq, an, ap, ao, am) {
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    if (!am) {
                        ai.publish("sitemap_" + P + "_changed", {
                            user_id: y.id,
                            user_name: y.full_name,
                            action: "section_open",
                            section_id: an,
                            data: ap,
                            additional_data: ao,
                            sitemap: h.getSerialized(true),
                            sitemap_id: P
                        })
                    }
                });
                a.subscribe("sitemap/drag_start", function (ao, an, am) {
                    w = {sitemap_id: P, section_id: am, type: "drag"};
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_drag_start", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: am,
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/drag_stop", function (ao, an, am) {
                    w = false;
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_drag_stop", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: am,
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/color_edit_open", function (ao, am, an) {
                    w = {sitemap_id: P, section_id: am, type: an};
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_color_edit_open", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: am,
                        type: an,
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/color_edit_close", function (ao, am, an) {
                    w = false;
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_color_edit_close", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: am,
                        type: an,
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/batch_edit_open", function (ao, am, an) {
                    w = {sitemap_id: P, section_id: am, type: an};
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_batch_edit_open", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: am,
                        type: an,
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/batch_edit_close", function (ao, am, an) {
                    w = false;
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_batch_edit_close", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: am,
                        type: an,
                        sitemap_id: P
                    })
                });
                a.subscribe("top_modal/open/topmodal-cell-note", function (am) {
                    w = {sitemap_id: P, section_id: h.getCurrentSection(), type: "cell_note"};
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_cell_note_edit_open", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: h.getCurrentSection(),
                        sitemap_id: P
                    })
                });
                a.subscribe("top_modal/close/topmodal-cell-note", function (am) {
                    w = false;
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_cell_note_edit_close", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: h.getCurrentSection(),
                        sitemap_id: P
                    })
                });
                a.subscribe("top_modal/open/topmodal-cell-url", function (am) {
                    w = {sitemap_id: P, section_id: h.getCurrentSection(), type: "cell_url"};
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_cell_url_edit_open", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: h.getCurrentSection(),
                        sitemap_id: P
                    })
                });
                a.subscribe("top_modal/close/topmodal-cell-url", function (am) {
                    w = false;
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_cell_url_edit_close", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: h.getCurrentSection(),
                        sitemap_id: P
                    })
                });
                a.subscribe("top_modal/open/topmodal-cell-archetype", function (am) {
                    w = {sitemap_id: P, section_id: h.getCurrentSection(), type: "cell_archetype"};
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_cell_archetype_edit_open", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: h.getCurrentSection(),
                        sitemap_id: P
                    })
                });
                a.subscribe("top_modal/close/topmodal-cell-archetype", function (am) {
                    w = false;
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_cell_archetype_edit_close", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: h.getCurrentSection(),
                        sitemap_id: P
                    })
                });
                a.subscribe("top_modal/after_open/topmodal-farbtastic", function (ao, am) {
                    var an = am.parent().hasClass("cell_color") ? "cell_color" : (am.parent().hasClass("cell_text_color") ? "cell_text_color" : false);
                    if (an) {
                        w = {sitemap_id: P, section_id: h.getCurrentSection(), type: an};
                        if (h.getUsersCount() <= 0) {
                            return
                        }
                        ai.publish("sitemap_" + P + "_" + an + "_edit_open", {
                            user_id: y.id,
                            user_name: y.full_name,
                            section_id: h.getCurrentSection(),
                            sitemap_id: P
                        })
                    }
                });
                a.subscribe("top_modal/close/topmodal-farbtastic", function (ao, am) {
                    var an = am.parent().hasClass("cell_color") ? "cell_color" : (am.parent().hasClass("cell_text_color") ? "cell_text_color" : false);
                    if (an) {
                        w = false;
                        if (h.getUsersCount() <= 0) {
                            return
                        }
                        ai.publish("sitemap_" + P + "_" + an + "_edit_close", {
                            user_id: y.id,
                            user_name: y.full_name,
                            section_id: h.getCurrentSection(),
                            sitemap_id: P
                        })
                    }
                });
                a.subscribe("sitemap/cell_text_edit_open", function (am) {
                    w = {sitemap_id: P, section_id: h.getCurrentSection(), type: "cell_text"};
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_cell_text_edit_open", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: h.getCurrentSection(),
                        sitemap_id: P
                    })
                });
                a.subscribe("sitemap/cell_text_edit_close", function (am) {
                    w = false;
                    if (h.getUsersCount() <= 0) {
                        return
                    }
                    ai.publish("sitemap_" + P + "_cell_text_edit_close", {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: h.getCurrentSection(),
                        sitemap_id: P
                    })
                })
            }
            a.subscribe("sitemap/contributors_changed", function (an, ao) {
                for (var am = 0; am < ao.length; am++) {
                    if (!ao[am].user_id) {
                        continue
                    }
                    ai.publish("sitemap_" + P + "_contributor_" + ao[am].user_id, {
                        user_id: y.id,
                        user_name: y.full_name,
                        section_id: h.getCurrentSection(),
                        sitemap_id: P,
                        contributor_data: ao[am]
                    })
                }
            });
            a.subscribe("sitemap/status_changed/lock sitemap/status_changed/unlock sitemap/status_changed/approve", function (am) {
                ai.publish("sitemap_" + P + "_refresh", {
                    user_id: y.id,
                    user_name: y.full_name,
                    section_id: h.getCurrentSection(),
                    sitemap_id: P
                })
            });
            a.subscribe("sitemap/chat_open", function (am) {
                ai.publish("sitemap_" + P + "_chat", {
                    action: "chat_open",
                    user: y,
                    message: false,
                    section_id: h.getCurrentSection(),
                    sitemap_id: P
                })
            });
            a.subscribe("sitemap/chat_close", function (am) {
                ai.publish("sitemap_" + P + "_chat", {
                    action: "chat_close",
                    user_left: y,
                    message: false,
                    section_id: h.getCurrentSection(),
                    sitemap_id: P
                })
            });
            a.subscribe("sitemap/chat_message", function (an, am) {
                ai.publish("sitemap_" + P + "_chat", {
                    action: "chat_message",
                    user: y,
                    message: am,
                    section_id: h.getCurrentSection(),
                    sitemap_id: P
                })
            });
            ai.publish("sitemap_" + P + "_user_connected", {
                user_id: y.id,
                user_name: y.full_name,
                user_initials: y.initials,
                user_avatar: b("#user-box img").data("blank") ? false : b("#user-box img").attr("src"),
                allow_edit: q,
                sitemap_id: P,
                subdomain: C.get("account")["subdomain"]
            })
        });
        a.subscribe("websocket/disconnect", function (ak, ai) {
            if (aa || h.getUsersCount() <= 0) {
                return
            }
            var aj = h.getCurrentSection();
            ai.publish("sitemap_" + P + "_user_disconnected", {
                user: y,
                allow_edit: q,
                sitemap_id: P,
                subdomain: C.get("account")["subdomain"]
            })
        });
        b("#headercollapse").on("click", function (aj) {
            aj.preventDefault();
            e.clearAll();
            var ai = b(this).toggleClass("collapsed");
            if (ai.hasClass("collapsed")) {
                b("#header-wrapper, #header-wrapper-helper").css({overflow: "hidden"}).animate({height: 0}, 333, function () {
                    b(this).hide()
                });
                b("#sitemaptop-wrapper-helper").animate({top: 0}, 333)
            } else {
                b("#header-wrapper, #header-wrapper-helper").show().animate({height: 84}, 333, function () {
                    b(this).css({overflow: "visible"})
                });
                b("#sitemaptop-wrapper-helper").animate({top: 84}, 333)
            }
        })
    });
    a.subscribe("sitemap/json_loaded sitemap/section_opened sitemap/section_closed", function () {
        var d = a.require("sitemap");
        var e = d.getTemplate();
        if (e) {
            b("#action-orientation").removeClass("vertical horizontal").addClass(e)
        }
    });
    a.subscribe("sitemap/sitemap_modified sitemap/history_undo sitemap/history_redo sitemap/sitemap_modified_via_websocket", function () {
        var d = a.require("sitemap");
        var e = d.getSectionIfExists();
        if (e && e.group) {
            b("#pagecount").text(e.group.querySelectorAll("svg.cell").length)
        }
    });
    a.subscribe("sitemap/section_before_open sitemap/section_before_close", function () {
        b("#sitemap-top > form.show").find("button.reset").trigger("click")
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var d = a.require("sitemap");
        var g = a.require("notification");
        var f = a.require("config");
        var h = b("#sitemap-lines-text-colors");
        var e = !(a.currentUserCan("sitemap_text_line_color") && h.length);
        a.$main.on("click", "#action-lines-text-color", function (j) {
            j.preventDefault();
            if (e) {
                return a.noPermissions()
            }
            b("#sitemap-lines-text-colors").siblings("form.show").find("button.reset").trigger("click", [true]);
            a.publish("sitemap/color_edit_open", [d.getCurrentSection(), "lines_text"]);
            d.backupColors();
            var k = d.getColorSchemeItem("text_color");
            var i = d.getColorSchemeItem("lines_color");
            b("#custom-text-color").data("color", k).children("p").css({backgroundColor: k});
            b("#custom-lines-color").data("color", i).children("p").css({backgroundColor: i});
            if (b(window).scrollTop() > 84) {
                b("html, body").stop().animate({scrollTop: 84}, 200, "easeOutCubic", function () {
                    b("#sitemap-lines-text-colors").addClass("show")
                })
            } else {
                b("#sitemap-lines-text-colors").addClass("show")
            }
            d.modified = false
        });
        if (!e) {
            h.on("click", "button.reset", function (i, j) {
                i.preventDefault();
                d.revertColors();
                b("#sitemap-lines-text-colors").removeClass("show");
                d.modified = false;
                if (j !== true) {
                    a.publish("sitemap/color_edit_close", [d.getCurrentSection(), "lines_text"])
                }
            }).on("click", "button.submit", function (i) {
                i.preventDefault();
                d.backupColors();
                b("#sitemap-lines-text-colors").removeClass("show");
                if (d.modified) {
                    a.publish("sitemap/sitemap_modified", ["color_scheme", d.getCurrentSection(), d.getCurrentColorScheme(), {
                        style: d.getStyle(),
                        textShadow: d.getTextShadow()
                    }]);
                    d.modified = false
                }
                a.publish("sitemap/color_edit_close", [d.getCurrentSection(), "lines_text"])
            }).on("click", "#action-text-color-reset", function (j) {
                j.preventDefault();
                var i = d.getColorSchemeItem("text_color", true);
                b("#custom-text-color").data("color", i).children("p").css({backgroundColor: i});
                d.updateTextColor(i);
                d.modified = true
            }).on("click", "#action-line-color-reset", function (j) {
                j.preventDefault();
                var i = d.getColorSchemeItem("lines_color", true);
                b("#custom-lines-color").data("color", i).children("p").css({backgroundColor: i});
                d.updateLinesColor(i);
                d.modified = true
            })
        }
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/plainsitemap", function () {
        var k = a.require("svg");
        var m = a.require("sitemap");
        var g = a.require("string");
        var q = a.require("config");
        var o = a.require("helper");
        var d = a.require("scrollbar");
        b("html").removeClass("no-js").addClass("js");
        var f = b("#slickplan-sitemap").data("id") || 0;
        var p = b("#slickplan-sitemap");
        var e = b("#cell-info-tooltip");
        var r = false;
        m.setOptions({container: p[0], edit: false, preview: true, allow_collapsing: true});
        var n = o.isObject(_SLICKPLAN_JSON) ? _SLICKPLAN_JSON : {};
        if (o.isObject(n)) {
            m.loadJSON(n, m.getOption("id_main_section"))
        }
        a.$window.on("debouncedresize", function (t, s) {
            if (typeof s === "object" && s.element && s.position) {
                return false
            }
            m.fullRefresh()
        });
        function j() {
            b("#action-orientation").removeClass("vertical horizontal").addClass(m.getTemplate());
            var s = m.getSectionIfExists();
            if (s && s.group) {
                b("#pagecount").text(s.group.querySelectorAll("svg.cell").length)
            }
        }

        b("div.top-modal").each(function () {
            var s = b(this);
            var t = s.hasClass("tooltip-modal") ? "ui-tooltip-modal" + (s.hasClass("tooltip-modal-left") ? " tooltip-modal-left" : "") : "ui-top-modal";
            t += s.hasClass("resizeable") ? " sl-resizeable" : "";
            t += s.hasClass("resizeable-x") ? " sl-resizeable-x" : "";
            t += s.hasClass("resizeable-y") ? " sl-resizeable-y" : "";
            var u = s.attr("id");
            s.dialog({
                autoOpen: false,
                modal: true,
                stack: true,
                dialogClass: t,
                show: {effect: "fade", duration: 250},
                hide: {effect: "fade", duration: 300},
                open: function () {
                    s.parent(".ui-dialog").addClass(u);
                    b(".ui-widget-overlay:not(.modal-hooked)").attr("class", "ui-widget-overlay modal-hooked topmodal-overlay modalid-" + u);
                    a.publish("top_modal/open/" + u, [s])
                },
                beforeClose: function () {
                    if (!s.is(":visible")) {
                        return
                    }
                    b(".ui-widget-overlay.modalid-" + u).remove();
                    a.publish("top_modal/before_close/" + u, [s])
                },
                close: function () {
                    b.ui.dialog.overlay.instances = [];
                    b.ui.dialog.overlay.oldInstances = [];
                    a.publish("top_modal/close/" + u, [s])
                },
                resizable: s.hasClass("resizeable"),
                resize: function (w) {
                    var v = s.children("div").height();
                    s.height(v).parent().height(v)
                },
                draggable: false,
                zIndex: 3001,
                width: s.width(),
                height: s.height(),
                minWidth: s.width(),
                maxWidth: Math.max(s.width(), a.$window.width() - 100)
            })
        });
        a.$body.on("click", ".ui-widget-overlay", function () {
            b(".top-modal").dialog("close")
        });
        p[0].addEventListener("mouseover", function (x) {
            var y = k.getRealTarget(x);
            var w = k.hasClass(y, "bar-section");
            var B = (!w && k.hasClass(y, "bar-archetype"));
            if (w || B) {
                var D = y.parentNode;
                if (k.hasClass(D, "cell")) {
                    if (w) {
                        e.addClass("section").children("span").html(a.__("View Section").replace(" ", "&nbsp;"))
                    } else {
                        var s = y.href.baseVal.toString().replace("#svg-bar-archetype-", "");
                        var u = q.get("archetypes");
                        if (s.charAt(0) === "_" && u[s] !== c && u[s].name !== c) {
                            s = u[s].name
                        } else {
                            if (u._custom !== c && u._custom[s] !== c && u._custom[s].name !== c) {
                                s = u._custom[s].name
                            } else {
                                s = a.__("Page Type")
                            }
                        }
                        s.replace(" ", "&nbsp;");
                        e.removeClass("section").children("span").text(s)
                    }
                    var v = k.hasClass(D, "has-section");
                    var A = k.hasClass(D, "has-archetype");
                    var C = m.getOffsets(D);
                    var z = C.top;
                    var t = C.left;
                    if ((v && A) || (k.hasClass(D, "has-desc") && k.hasClass(D, "has-url"))) {
                        z += C.height - 19
                    } else {
                        z += C.height / 2
                    }
                    if (B && v && A) {
                        t += 27 * C.scale
                    }
                    z -= 38 + 13;
                    t += 24;
                    e.css({top: z, left: t})
                }
            }
        });
        function h(v, w, y) {
            b(".top-modal").dialog("close");
            var s = {my: "right top", at: "right bottom", of: v, top_offset: -17, left_offset: -4};
            var u = a.$window.scrollTop();
            var x = b("#topmodal-cell-note").find("form").each(function () {
                this.reset()
            }).end();
            x.dialog("open");
            k.position(x.parent()[0], s, {top: 0, left: 0});
            a.$window.scrollTop(u);
            w = g.charsDecode(w);
            var t = b("#topmodal-cell-note");
            t.css({height: ""}).find(".note-text").show().html(w).end().height(b("#topmodal-cell-note .note-text").outerHeight(true)).parent(".ui-tooltip-modal").css({
                top: "+=13px",
                left: "+=10px"
            }).find(".note-text a").attr("target", "_blank");
            if (y && v.find(".icon-note").length) {
                x.parent().addClass("arrow-second")
            } else {
                x.parent().removeClass("arrow-second")
            }
            if (t.hasClass("tinyscrollbar-enabled")) {
                d.update(t)
            } else {
                d.init(t)
            }
        }

        p[0].addEventListener("mouseout", function (s) {
            e.css({left: -99999, top: -99999})
        });
        a.$window.on("click", function () {
            if (r) {
                k.removeClass(r, "highlighted");
                var u = m.getPapers();
                if (u && u.svg) {
                    var s = u.svg.querySelectorAll(".cellmask");
                    for (var t = s.length; t >= 0; --t) {
                        k.removeElement(s[t])
                    }
                }
                r = false
            }
        });
        p[0].addEventListener("click", function (G) {
            G = G || window.event;
            var L = G.target || G.srcElement;
            if (L && L.correspondingUseElement) {
                L = L.correspondingUseElement
            }
            if (m.checkTag(L, "use")) {
                if (L.className.baseVal.indexOf("icon-note") >= 0) {
                    var u = b(L).closest(".cell");
                    if (typeof u === "object" && u.length) {
                        var E = k.getData(u[0], m.getOption("data_desc")) || "";
                        h(u, E)
                    }
                } else {
                    if (L.className.baseVal.indexOf("icon-file") >= 0) {
                        var u = b(L).closest(".cell");
                        a.publish("sitemap/lightbox_cell_files/open", [u.get(0)])
                    } else {
                        if (L.className.baseVal.indexOf("icon-url") >= 0) {
                            var D = k.getData(b(L).closest(".cell")[0], m.getOption("data_url"));
                            if (typeof D === "string") {
                                window.open(D)
                            } else {
                                if (D && b.isArray(D)) {
                                    if (D.length === 1 && D[0].type === "internal") {
                                        var J = m.getCellSection(D[0].page);
                                        var C = m.getCurrentSection();
                                        if (J !== C) {
                                            var w = m.getSectionIfExists(J);
                                            if (w && (w.group || w.data)) {
                                                var v = null;
                                                if (w.data && w.data.parent) {
                                                    v = w.data.parent
                                                } else {
                                                    if (w.group) {
                                                        v = k.getData(w.group, "parent")
                                                    }
                                                }
                                            }
                                            if (v) {
                                                m.openSection(J, v);
                                                j()
                                            }
                                        }
                                        if (D[0].page) {
                                            var w = m.getSectionIfExists(J);
                                            if (w && w.group) {
                                                var t = w.group.querySelectorAll(".cell");
                                                k.addClass(D[0].page, "highlighted");
                                                for (var B = 0, A = t.length; B < A; ++B) {
                                                    k.use("svg-cell-disabled-mask", {"class": "cellmask " + ((t[B].id === D[0].page) ? "enabled" : "disabled")}, t[B])
                                                }
                                                setTimeout(function () {
                                                    r = D[0].page
                                                }, 50)
                                            }
                                        }
                                    } else {
                                        if (D.length === 1 && D[0].type === "external" && D[0].label === "") {
                                            if (D[0].url) {
                                                window.open(D[0].url)
                                            }
                                        } else {
                                            var s = "";
                                            for (var B = 0, A = D.length; B < A; ++B) {
                                                if (typeof D[B] === "object" && D[B].type && D[B].url) {
                                                    if (D[B].type === "external") {
                                                        var x = D[B].label;
                                                        if (!x) {
                                                            x = D[B].url
                                                        }
                                                        s += '<li class="cell-url-preview"><a href="' + D[B].url.replace(/"/g, '\\"') + '" target="_blank"><span>' + g.charsEncode(x);
                                                        s += '</span> <i class="fa fa-external-link"></i>';
                                                        s += "</a></li>"
                                                    }
                                                }
                                            }
                                            if (s) {
                                                s = "<ul>" + s + "</ul>";
                                                var u = b(L).closest(".cell");
                                                h(u, s, true)
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            if (L.className.baseVal.indexOf("bar-section") >= 0) {
                                var u = b(L).closest(".cell");
                                m.setCurrentCell(u[0]);
                                m.openSection(c, u[0]);
                                j()
                            } else {
                                if (L.className.baseVal.indexOf("bar-archetype") >= 0) {
                                    var u = b(L).closest(".cell");
                                    var H = k.getData(u[0], m.getOption("data_archetype"));
                                    if (H && typeof H === "string") {
                                        var I = q.get("archetypes");
                                        var E = false;
                                        var M = false;
                                        var F = false;
                                        if (H.charAt(0) === "_" && I[H] && I[H].desc) {
                                            E = I[H].desc;
                                            E = "<p>" + g.charsEncode(E) + "</p>";
                                            M = g.charsEncode(I[H].name)
                                        } else {
                                            if (I._custom[H] && I._custom[H].desc) {
                                                E = I._custom[H].desc;
                                                M = g.charsEncode(I._custom[H].name);
                                                if (I._custom[H].icon.substring(0, 3) === "fa-") {
                                                    M = '<i class="fa ' + I._custom[H].icon + '"></i>' + M
                                                } else {
                                                    if (I._custom[H].icon !== "" && I._custom[H].icon.length === 1) {
                                                        M = '<span class="letter">' + g.charsEncode(I._custom[H].icon) + "</span>" + M
                                                    }
                                                }
                                                F = true
                                            }
                                        }
                                        if (E && M) {
                                            b(".top-modal").dialog("close");
                                            var K = {
                                                my: "left top",
                                                at: "left center",
                                                of: u,
                                                top_offset: 20,
                                                left_offset: -8
                                            };
                                            var y = b("#topmodal-cell-archetype");
                                            y.dialog("open");
                                            y.parent().addClass("black-arrow");
                                            k.position(y.parent()[0], K, {top: 0, left: 0});
                                            if (typeof u === "object" && u.length) {
                                                b("#archetype-desc .title > h4").html(M).attr("class", "archetype-" + (F ? "custom" : H));
                                                var z = b("#archetype-desc").show().find(".text");
                                                if (z.hasClass("tinyscrollbar-enabled")) {
                                                    d.updateContent(z, E);
                                                    d.update(z)
                                                } else {
                                                    z.html(E);
                                                    d.init(z)
                                                }
                                                z.find("a").attr("target", "_blank")
                                            }
                                        }
                                    }
                                } else {
                                    if (L.className.baseVal.indexOf("collapse") >= 0) {
                                        var v = b.trim(L.className.baseVal.replace(/(connection|collapse)/g, ""));
                                        if (v) {
                                            m.toggleChildren(v, c, true)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        a.$body.on("click", ".section-breadcrumbs .close", function (s) {
            s.preventDefault();
            b(this).siblings(".crumb.last").prev(".crumb").trigger("click");
            j()
        }).on("click", ".section-breadcrumbs a.crumb", function (t) {
            t.preventDefault();
            var s = b(this).data("section");
            b(this).nextAll(".crumb[data-section]").reverse().each(function () {
                m.closeSection(b(this).data("section"), s)
            });
            j()
        }).on("click", "#archetype-desc .title > a", function (s) {
            s.preventDefault();
            b("#topmodal-cell-archetype").dialog("close")
        }).on("click", "#action-orientation", function (t) {
            t.preventDefault();
            var s = (m.getTemplate() === "horizontal") ? "vertical" : "horizontal";
            b(this).removeClass("vertical horizontal").addClass(s);
            k.clearCache();
            m.clearCache();
            m.changeTemplate(s);
            m.fullRefresh()
        });
        var i = 0;
        a.$window.on("load scroll resize", function () {
            var s = Math.max(0, a.$window.scrollLeft());
            if (i !== s) {
                i = s;
                o.addCssRule("#preview-head-fixed, .section-breadcrumbs", "left: " + s + "px")
            }
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var d = a.require("sitemap");
        var e = b("#slickplan-sitemap");
        e.on("click", ".section-breadcrumbs .close", function (f) {
            f.preventDefault();
            b(this).siblings(".crumb.last").prev(".crumb").trigger("click")
        }).on("click", ".section-breadcrumbs a.crumb", function (i) {
            i.preventDefault();
            var f = b(this).data("section");
            var h = b(this).nextAll(".crumb[data-section]").reverse();
            var g = h.length - 1;
            h.each(function (j) {
                d.closeSection(b(this).data("section"), f, (g > j))
            })
        })
    });
    a.subscribe("sitemap/cell_data_removed/section", function (h, g, f) {
        var d = a.require("sitemap");
        if (!d.isEditBlocked() && !d.isMainSection(f)) {
            d.removeSection(f);
            if (d.getCurrentSection() === f) {
                d.setCurrentSection(g[0].parentNode.id)
            }
        }
    })
});
Slickplan.module(function (c, b, d) {
    var a = !(b.currentUserCan("sitemap_shadows_gradients") && c("#sitemap-shadows-gradients").length);
    b.subscribe("route/sitemap", function () {
        var e = b.require("sitemap");
        var h = c("#sitemap-shadows-gradients");
        var f = null;
        var g = null;
        b.$main.on("click", "#action-shadows-gradients", function (i) {
            i.preventDefault();
            if (a) {
                return b.noPermissions()
            }
            b.publish("sitemap/color_edit_open", [e.getCurrentSection(), "shadows_gradients"]);
            h.siblings("form.show").find("button.reset").trigger("click", [true]);
            if (c(window).scrollTop() > 84) {
                c("html, body").stop().animate({scrollTop: 84}, 200, "easeOutCubic", function () {
                    h[0].classList.add("show")
                })
            } else {
                h[0].classList.add("show")
            }
            f = e.getStyle();
            g = e.getTextShadow();
            c("#form-cell-gradient").prop("checked", (f === "gradient"));
            c("#form-text-shadow").prop("checked", g);
            e.modified = false
        });
        h.on("click", "button.reset", function (i, j) {
            i.preventDefault();
            if (f) {
                e.changeStyle(f)
            }
            if (g) {
                e.setTextShadow(g)
            }
            h[0].classList.remove("show");
            e.modified = false;
            if (j !== true) {
                b.publish("sitemap/color_edit_close", [e.getCurrentSection(), "shadows_gradients"])
            }
        }).on("click", "button.submit", function (i) {
            i.preventDefault();
            e.changeStyle(e.getStyle());
            e.setTextShadow(e.getTextShadow());
            h[0].classList.remove("show");
            if (e.modified) {
                b.publish("sitemap/sitemap_modified", ["color_scheme", e.getCurrentSection(), e.getCurrentColorScheme(), {
                    style: e.getStyle(),
                    textShadow: e.getTextShadow()
                }]);
                e.modified = false
            }
            b.publish("sitemap/color_edit_close", [e.getCurrentSection(), "shadows_gradients"])
        }).on("change", "#form-cell-gradient", function (i) {
            if (this.checked) {
                e.changeStyle("gradient")
            } else {
                e.changeStyle("flat")
            }
            e.modified = true
        }).on("change", "#form-text-shadow", function (i) {
            if (this.checked) {
                e.setTextShadow(true)
            } else {
                e.setTextShadow(false)
            }
            e.modified = true
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var d = a.require("sitemap");
        var e = a.require("svg");
        b(document).on("keydown.shift_return", function (h) {
            h.preventDefault();
            if (d.isEditBlocked()) {
                return
            }
            var f = d.getCurrentCell();
            var g = {};
            var i = c;
            if (f) {
                g.after = e.getAttr(f, "id");
                i = e.getData(f, d.getOption("data_level"));
                if (i !== "util" && i !== "foot") {
                    i = c
                }
            }
            d.insertNewCell(g, i)
        }).on("keydown.ctrl_return keydown.meta_return", function (h) {
            h.preventDefault();
            if (d.isEditBlocked()) {
                return
            }
            var f = d.getCurrentCell();
            var g = {};
            var i = c;
            if (f) {
                i = e.getData(f, d.getOption("data_level"));
                if (i !== "util" && i !== "foot") {
                    g.parent = e.getAttr(f, "id");
                    i = c
                } else {
                    g.after = e.getAttr(f, "id")
                }
            }
            d.insertNewCell(g, i)
        }).on("keydown.ctrl_e keydown.meta_e", function (f) {
            f.preventDefault();
            if (d.isEditBlocked()) {
                return
            }
            d.insertNewCell({}, 1)
        }).on("keydown.ctrl_z keydown.meta_z", function (f) {
            f.preventDefault();
            if (d.isEditBlocked()) {
                return
            }
            b("#action-undo").trigger("click")
        }).on("keydown.ctrl_y keydown.meta_y", function (f) {
            f.preventDefault();
            if (d.isEditBlocked()) {
                return
            }
            b("#action-redo").trigger("click")
        }).on("keydown.ctrl_+ keydown.meta_+ keydown.ctrl_plus keydown.meta_plus", function (f) {
            f.preventDefault();
            f.stopPropagation();
            b("#action-zoom-in").trigger("click")
        }).on("keydown.ctrl_- keydown.meta_- keydown.ctrl_minus keydown.meta_minus", function (f) {
            f.preventDefault();
            f.stopPropagation();
            b("#action-zoom-out").trigger("click")
        }).on("keydown.ctrl_0 keydown.meta_0", function (f) {
            f.preventDefault();
            f.stopPropagation();
            d.zoomReset()
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/sitemap", function () {
        var d = a.require("sitemap");
        var i = a.require("notification");
        var f = a.require("config");
        var h;
        var g = b("#sitemap-top");
        var j = b("#sitemap-color");
        var e = !(a.currentUserCan("sitemap_swatch_presets") && j.length);
        a.$main.on("click", "#action-swatch-presets", function (k) {
            k.preventDefault();
            if (e) {
                return a.noPermissions()
            }
            j.siblings("form.show").find("button.reset").trigger("click", [true]);
            a.publish("sitemap/color_edit_open", [d.getCurrentSection(), "swatch_presets"]);
            d.backupColors();
            h = d.getCurrentColorScheme();
            if (b(window).scrollTop() > 84) {
                b("html, body").stop().animate({scrollTop: 84}, 200, "easeOutCubic", function () {
                    j[0].classList.add("show")
                })
            } else {
                j[0].classList.add("show")
            }
            d.modified = false
        });
        if (!e) {
            j.on("click", "li.color", function () {
                var k = document.getElementById("level").value;
                if (k === "all") {
                    h = {default_color: b(this).data("color"), text_color: h.text_color, lines_color: h.lines_color}
                } else {
                    h[k] = b(this).data("color")
                }
                d.setTempScheme(h);
                d.modified = true
            }).on("click", "button.reset", function (k, m) {
                k.preventDefault();
                d.revertColors();
                j[0].classList.remove("show");
                d.modified = false;
                if (m !== true) {
                    a.publish("sitemap/color_edit_close", [d.getCurrentSection(), "swatch_presets"])
                }
            }).on("click", "button.submit", function (k) {
                k.preventDefault();
                d.backupColors();
                j[0].classList.remove("show");
                if (d.modified) {
                    a.publish("sitemap/sitemap_modified", ["color_scheme", d.getCurrentSection(), h, {
                        style: d.getStyle(),
                        textShadow: d.getTextShadow()
                    }]);
                    d.modified = false
                }
                a.publish("sitemap/color_edit_close", [d.getCurrentSection(), "swatch_presets"])
            });
            a.$body.on("mouseenter", "#level-menu li", function (k) {
                var m = b("#level option:eq(" + b(this).data("index") + ")").val();
                d.highlightLevel(m)
            }).on("mouseleave", "#level-menu li", function (k) {
                d.highlightLevel(false)
            })
        }
    });
    a.subscribe("sitemap/after_load", function () {
        if (!((a.currentUserCan("sitemap_swatch_presets") && b("#sitemap-color").length) || (a.currentUserCan("sitemap_custom_color") && b("#sitemap-custom").length))) {
            return
        }
        var e = a.require("sitemap");
        if (e.crawler) {
            return false
        }
        var k = a.require("svg");
        var g = a.require("config");
        var i = a.require("helper");
        var j = false;
        var h = g.get("archetypes");
        var d = [a.__("First"), a.__("Second"), a.__("Third"), a.__("Fourth"), a.__("Fifth"), a.__("Sixth"), a.__("Seventh"), a.__("Eighth"), a.__("Ninth"), a.__("Tenth"), a.__("Eleventh"), a.__("Twelfth"), a.__("Thirteenth"), a.__("Fourteenth"), a.__("Fifteenth"), a.__("Sixteenth"), a.__("Seventeenth"), a.__("Eighteenth"), a.__("Nineteenth"), a.__("Twentieth")];

        function f() {
            if (j) {
                return
            }
            j = true;
            var z = '<option value="all" selected>' + a.__("Level") + '</option><option value="all">' + a.__("All") + "</option>";
            var r = false;
            var v = false;
            var s = false;
            var x = 0;
            var y = {};
            var p = [];
            var t = e.getSectionIfExists();
            if (t && t.group) {
                var w = t.group.querySelectorAll("svg.cell");
                for (var q = 0; q < w.length; ++q) {
                    var u = k.getElement(w[q]);
                    var n = k.getData(u, e.getOption("data_level"));
                    if (n === "util") {
                        r = true
                    } else {
                        if (n === "foot") {
                            v = true
                        } else {
                            if (n === "home") {
                                s = true
                            } else {
                                if (n) {
                                    n = parseInt(n, 10);
                                    if (n && !isNaN(n)) {
                                        x = Math.max(x, n)
                                    }
                                }
                            }
                        }
                    }
                    var m = k.getData(u, e.getOption("data_archetype"));
                    if (m && typeof m === "string") {
                        if (m.charAt(0) === "_" && i.isObject(h[m])) {
                            if (y[m] === c) {
                                y[m] = 1;
                                p.push({key: m, val: h[m].name})
                            }
                        } else {
                            if (i.isObject(h._custom[m])) {
                                if (y[m] === c) {
                                    y[m] = 1;
                                    p.push({key: m, val: h._custom[m].name})
                                }
                            }
                        }
                    }
                }
            }
            if (r) {
                z += '<option value="util">' + a.__("Utilities") + "</option>"
            }
            if (v) {
                z += '<option value="foot">' + a.__("Footer") + "</option>"
            }
            if (s) {
                z += '<option value="home">' + a.__("Home") + "</option>"
            }
            for (var q = 1; q <= x; ++q) {
                z += '<option value="level' + q + '">' + ((q <= 20) ? d[q - 1] : q) + " " + a.__("Level") + "</option>"
            }
            p = p.sort(function (B, A) {
                return B.val.localeCompare(A.val)
            });
            for (var q = 0; q < p.length; ++q) {
                z += '<option value="archetype-' + p[q].key + '">' + p[q].val + "</option>"
            }
            var o = b("#level, #level-custom").html(z);
            o.selectmenu("destroy");
            o.selectmenu({
                style: "popup", format: function (A) {
                    return a.require("string").charsEncode(A)
                }
            });
            setInterval(function () {
                j = false
            }, 200)
        }

        f();
        a.subscribe("sitemap/cell_data_added/archetype sitemap/cell_data_removed/archetype sitemap/custom_archetype_saved sitemap/section_opened sitemap/section_closed sitemap/sitemap_modified sitemap/sitemap_modified_via_websocket", f)
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("modal/open/modal-sitemap-logo", function (j, d) {
        var f = a.require("config");
        var g = b("#sitemap-logo .sitemap-logo");
        d.find("#form-logo-client-name").val(b("#text-logo .text").text());
        var i = f.get("statics_path") + "img/default-logo.png";
        var h = b("#image-form-newlogo").attr("src");
        if (h) {
            i = h
        }
        d.find("#image-form-companylogo").attr("src", i);
        if (g.hasClass("visible") && g.hasClass("textlogo")) {
            d.find("#form-uselogo1").prop("checked", true).trigger("change")
        } else {
            d.find("#form-uselogo2").prop("checked", true).trigger("change")
        }
    });
    a.subscribe("route/sitemap", function () {
        var e = a.require("form");
        var f = a.require("websocket");
        var h = a.require("notification");
        var d = a.require("sitemap");
        var i;
        var g = b("#sitemap-logo");
        g.on("click", ".delete", function (j) {
            j.preventDefault();
            if (d.isEditBlocked(c, "sitemap")) {
                return false
            }
            f.request({
                data: {deletelogo: 1}, success: function (k) {
                    if (k._nonce) {
                        a.updateNonce(k._nonce)
                    }
                    a.publish("sitemap/logo_changed", [""]);
                    g.find(".sitemap-logo").removeClass("visible textlogo");
                    g.find(".loading-logo").hide();
                    b("#text-logo .text").text("");
                    if (i) {
                        i.refresh()
                    }
                }
            })
        });
        b("#modal-sitemap-logo").on("change", 'input[name="sitemap_logo[type]"]', function () {
            var j = b(this).val();
            if (j === "text") {
                b("#modal-sitemap-logo .logoplace, #modal-sitemap-logo .upload").hide();
                b("#modal-sitemap-logo .logoplacetext").show()
            } else {
                b("#modal-sitemap-logo .logoplace, #modal-sitemap-logo .upload").show();
                b("#modal-sitemap-logo .logoplacetext").hide();
                if (i) {
                    i.refresh()
                }
            }
        }).on("submit", "form", function (q) {
            q.preventDefault();
            var j = b(this);
            var m = j.closest(".modal");
            e.clearErrors(j);
            var o = j.find('input[name="sitemap_logo[type]"]:checked').val();
            if (o === "text") {
                var k = j.find("#form-logo-client-name").val();
                if (k === "" || k === c) {
                    e.error(j.find("#form-logo-client-name").parent(), a.__("Enter client name"), {bottom: 3})
                } else {
                    k = k.replace(/(\w{25})(\w)/g, "$1 $2");
                    var p = e.serializeObject(j);
                    p.sitemap_logo.text = k;
                    f.request({
                        data: p, success: function (r) {
                            if (r._nonce) {
                                a.updateNonce(r._nonce)
                            }
                            if (r.success) {
                                a.publish("sitemap/logo_changed", [""]);
                                g.find(".sitemap-logo").addClass("visible textlogo");
                                g.find(".loading-logo").hide();
                                b("#text-logo .text").text(k);
                                if (i) {
                                    i.refresh()
                                }
                                m.dialog("close")
                            }
                        }
                    })
                }
            } else {
                var n = b("#image-form-companylogo").attr("src");
                if (!/default-logo\.png$/.test(n)) {
                    g.find(".loading-logo").hide().end().find(".add-logo").hide().end().find(".sitemap-logo").addClass("visible").removeClass("textlogo").show().find("img").attr("src", n);
                    a.publish("sitemap/logo_changed", [n])
                }
                m.dialog("close")
            }
        });
        a.subscribe("upload/files_added_pluploaddroplogo", function (n, m, k, j) {
            e.clearErrors(b("#modal-sitemap-logo form"));
            i = m;
            i.start()
        });
        a.subscribe("upload/file_uploaded_pluploaddroplogo", function (o, n, m, j, k) {
            if (j._nonce) {
                a.updateNonce(j._nonce)
            }
            if (j.success && j.file_path) {
                b("#image-form-companylogo").attr("src", j.file_path)
            }
            i = n;
            i.refresh()
        });
        a.subscribe("upload/error_pluploaddroplogo", function (n, m, k, j) {
            e.error(b("#modal-sitemap-logo .upload"), k.message, {bottom: 30});
            i = m;
            i.refresh()
        })
    })
});
Slickplan.module(function (b, a, c) {
    a.subscribe("route/squeeze", function () {
        var e = a.require("form");
        var k = a.require("ajax");
        var m = a.require("http");
        var o = a.require("config");
        var j = a.require("notification");
        var d = a.require("scrollbar");
        var n = a.require("helper");
        var f = a.require("string");
        var h = o.get("account");
        var g = b("#pricing");
        var i = b("#ccard");
        g.on("click", "div > a", function (t) {
            t.preventDefault();
            var s = b(this).parent("div");
            var r = s.data("id");
            if (r === 1 || r === "1") {
                i.find("#free").val(1);
                i.children("div").data("limit", s.data("limit")).data("storage", s.data("storage")).data("contributors", s.data("contributors"));
                i.children("form").trigger("submit")
            } else {
                i.children("form").find("input#free").val(0);
                var u = b(this).siblings("h2");
                var q = u.next("ul");
                var p = q.siblings(".prices");
                b("html, body").stop().animate({scrollTop: 150}, 300, "easeOutCubic", function () {
                    i.children("div").stop().animate({opacity: 0}, 150, function () {
                        b(this).data("id", s.data("id")).data("limit", s.data("limit")).data("storage", s.data("storage")).data("contributors", s.data("contributors")).children("h2").html(u.html()).next("ul").html(q.html()).siblings(".prices").html(p.html());
                        b(this).stop().animate({opacity: 1}, 150)
                    });
                    g.children("div").show().filter('[data-id="' + s.data("id") + '"]').hide()
                });
                e.clearErrors(i.children("form"))
            }
        });
        i.on("submit", "form", function (w) {
            w.preventDefault();
            j.clearAll();
            k.clearAll();
            var z = b(this);
            var y = (parseInt(z.find("input#free").val(), 10) === 1);
            e.clearErrors(z);
            var C = true;
            var D = parseInt(i.children("div").data("storage"), 10);
            console.warn(D);
            if (D > -1 && h.storage_used > D) {
                b(".modal").dialog("close");
                if (D > 0) {
                    var v = h.storage_used - D;
                    b("#modal-archive-files.modal").data("limit", v).dialog("open");
                    b("#modal-archive-files h1").show().find("span").text(f.humanReadableFileSize(v));
                    var q = b("#modal-archive-files .files-scroll").show();
                    q.removeData("plugin_tinyscrollbar").removeClass("tinyscrollbar-enabled").empty();
                    k.request({
                        data: {get_cell_files_library: "library", include_sizes: 1}, success: function (E) {
                            html = '<div class="clearfix">';
                            if (E && E.success && E.files) {
                                for (var G = 0, F = E.files.length; G < F; ++G) {
                                    if (E.files[G] && E.files[G].alias) {
                                        html += '<div class="single-file single-file-' + E.files[G].alias + '" data-file="' + E.files[G].alias + '" data-size="' + E.files[G].size + '"><img src="' + E.files[G].url_thumb + '"><div class="filesize">' + f.humanReadableFileSize(E.files[G].size) + '</div><div class="selected"><i class="fa fa-check"></i></div></div>'
                                    }
                                }
                            }
                            html += "</div>";
                            q.html(html);
                            d.init(q);
                            d.update(q);
                            setTimeout(function () {
                                d.update(q)
                            }, 50)
                        }
                    })
                } else {
                    n.confirmDialog({
                        close: true,
                        title: a.__("You need to delete all your files to continue"),
                        yes_label: "Yes, Delete",
                        no_label: "Cancel",
                        on_yes: function () {
                            k.request({
                                data: {delete_files_permanently: "all"}, success: function (E) {
                                    if (typeof E.storage_used !== "undefined") {
                                        h.storage_used = E.storage_used;
                                        o.set("account", h);
                                        b('#main form input[type="submit"]').trigger("click");
                                        b('#squeeze #ccard > form input[type="submit"]').trigger("click")
                                    }
                                }
                            })
                        }
                    })
                }
                return false
            }
            var p = parseInt(i.children("div").data("limit"), 10);
            if (p > -1 && h.sitemaps_count > p) {
                p = h.sitemaps_count - p;
                b(".modal").dialog("close");
                b("#modal-archive.modal form").each(function () {
                    this.reset()
                });
                b("#modal-archive.modal").data("limit", p).dialog("open");
                b("#modal-archive h1 span").html(p);
                n.rowShadow();
                return false
            }
            var s = parseInt(i.children("div").data("contributors"), 10);
            if (s > -1 && h.active_contributors > s) {
                s = h.active_contributors - s;
                b(".modal").dialog("close");
                b("#modal-archive-contributors.modal form").each(function () {
                    this.reset()
                });
                b("#modal-archive-contributors.modal").data("limit", s).dialog("open");
                b("#modal-archive-contributors h1 span").html(s);
                n.rowShadow();
                return false
            }
            if (!y) {
                var t = b("#form-ccname");
                var B = b("#form-ccnumber");
                var A = b("#form-cvv");
                var x = b("#form-zip");
                C = e.validate([{
                    value: t.val(),
                    tiperror: t.parent(),
                    rules: {empty: "Name on Card must not be empty"},
                    css: {bottom: 7},
                    left: 12
                }, {
                    value: B.val(),
                    tiperror: B.parent(),
                    rules: {
                        empty: "Credit Card number must not be empty",
                        callback: [e.ccValidation, "Invalid credit card number"]
                    },
                    css: {bottom: 7},
                    left: 12
                }, {
                    value: A.val(),
                    tiperror: A.parent(),
                    rules: {
                        empty: "Security Code must not be empty",
                        regexp: [/^[0-9]{3,4}$/, "Invalid Security Code"]
                    },
                    css: {bottom: 7, left: 190}
                }, {
                    value: x.val(),
                    tiperror: x.parent(),
                    rules: {empty: "Zip/Postal Code must not be empty"},
                    css: {bottom: -29},
                    bottom: 10
                }]);
                if (b("#form-expyear").val() == 0 || b("#form-expmonth").val() == 0) {
                    e.error(b("#form-expdate"), "You must select an expiration date", {
                        bottom: 9,
                        left: 235
                    }, false, 12);
                    C = false
                }
            }
            if (C) {
                z.find(".submit").addClass("loading");
                var u = [{name: "form[squeeze]", value: 1}, {
                    name: "form[type]",
                    value: i.children("div").data("id")
                }, {name: "ajax", value: 1}];
                var r = e.serializeObject(z, u);
                k.request({
                    url: m.url(z.attr("action")),
                    data: r,
                    $loading: z.find(".submit > .loading").css({visibility: "visible"}),
                    success: function (E) {
                        if (E.redirect) {
                            window.location = E.redirect
                        }
                        if (E.success) {
                            window.location = "/dashboard"
                        } else {
                            if (E.errors) {
                                b.each(E.errors, function (F, G) {
                                    e.error(z.find('input[name="form[' + F + ']"]').parent("div"), G)
                                })
                            } else {
                                if (E.error) {
                                    j.error(E.error)
                                }
                            }
                        }
                        z.find(".submit").removeClass("loading");
                        if (E._nonce) {
                            a.updateNonce(E._nonce)
                        }
                    },
                    error: function () {
                        z.find(".submit").removeClass("loading")
                    }
                })
            } else {
                j.error("An error occurred")
            }
        })
    })
});
Slickplan.module(function (e, c, g) {
    var f = false;
    var a = false;

    function b(j) {
        if (!a) {
            a = new nicEditor()
        }
        if (!window.document.getElementById("form-cell-archetype-desc")) {
            return
        }
        if (j) {
            e("#archetype-custom-description").hide();
            e("#archetype-custom-wysiwyg").show();
            a.panelInstance("form-cell-archetype-desc").addEvent("keyup", function () {
                if (a && a.nicInstances && a.nicInstances.length) {
                    a.instanceById("form-cell-archetype-desc").saveContent()
                }
            })
        } else {
            var i = a.instanceById("form-cell-archetype-desc");
            if (i) {
                i.setContent("");
                i.saveContent();
                a.removeInstance("form-cell-archetype-desc")
            } else {
                e("#form-cell-archetype-desc").val("")
            }
            e("#archetype-custom-description").show();
            e("#archetype-custom-wysiwyg").hide()
        }
    }

    function d(j) {
        if (j) {
            e("#topmodal-cell-archetype .types").removeAttr("style")
        } else {
            var k = e("#archetype-custom-add");
            var i = k.children(".title").outerHeight(true) + k.children(".text").outerHeight(true);
            k.closest(".types").attr("style", "min-height: " + i + "px !important")
        }
    }

    function h(i) {
        if (i.substring(0, 3) === "fa-") {
            return '<i class="fa ' + i + '"></i>'
        } else {
            if (i !== "" && i.length === 1) {
                return '<span class="letter">' + c.require("string").charsEncode(i) + "</span>"
            }
        }
        return false
    }

    c.subscribe("route/sitemap", function () {
        var i = c.require("sitemap");
        var o = c.require("config");
        var n = c.require("string");
        var j = c.require("websocket");
        var q = c.require("scrollbar");
        var m = o.get("archetypes");
        var k = o.get("statics_path");
        var p = e("#topmodal-cell-archetype");
        p.on("click", ".types div[data-archetype]", function (u) {
            u.preventDefault();
            var v = e(this).data("archetype");
            var t = i.cellEditGroupStop(function () {
                i.batchAddCellArchetype(v)
            });
            if (!t) {
                if (p.parent().hasClass("batchediting")) {
                    i.batchAddCellArchetype(v);
                    var s = m[v] || m._custom[v];
                    if (s && s.icon !== g) {
                        var r = h(s.icon);
                        if (!r) {
                            r = '<img src="' + k + "img/icon-archetype-" + v.replace(/^_/, "") + '.png">'
                        }
                        e("#sitemap-batch-edit .icon.border").html(r);
                        e("#sitemap-batch-edit .ui-selectmenu.batchediting.archetype > .ui-selectmenu-status").text(s.name)
                    }
                } else {
                    i.addCellArchetype(g, v)
                }
            }
            p.dialog("close")
        }).on("mouseenter", ".types div[data-archetype]", function () {
            e(this).addClass("hover")
        }).on("mouseleave", ".types div[data-archetype]", function () {
            e(this).removeClass("hover")
        }).on("click", ".types div[data-archetype] .help", function (w) {
            w.stopPropagation();
            w.preventDefault();
            f = false;
            var r = e(this).closest("div[data-archetype]");
            var s = r.data("archetype");
            p.parent().addClass("black-arrow");
            var x = false;
            var v = false;
            if (s.charAt(0) === "_") {
                x = e.extend({}, m[s]);
                x.desc = "<p>" + n.charsEncode(x.desc) + "</p>"
            } else {
                if (m._custom && m._custom[s]) {
                    x = e.extend({}, m._custom[s]);
                    x.name = n.charsEncode(x.name);
                    var u = h(x.icon);
                    if (u) {
                        x.name = u + x.name
                    }
                    v = true
                }
            }
            if (x && x.name && x.desc) {
                e("#archetype-desc .title > h4").html(x.name).attr("class", "archetype-" + (v ? "custom" : s));
                var t = e("#archetype-desc .text");
                e("#archetype-desc").stop().css({opacity: 0}).show().animate({
                    top: -p.find(".tooltip-modal-titlebar").height(),
                    opacity: 1
                }, 200);
                if (t.hasClass("tinyscrollbar-enabled")) {
                    q.updateContent(t, x.desc);
                    q.update(t)
                } else {
                    t.html(x.desc);
                    q.init(t)
                }
                t.find("a").attr("target", "_blank");
                e(this).parent().addClass("selected").siblings(".archetype").removeClass("selected")
            }
        }).on("click", "#archetype-desc .title > a", function (r) {
            r.stopPropagation();
            r.preventDefault();
            if (c.$body.hasClass("sitemappreview")) {
                p.dialog("close")
            } else {
                f = false;
                e("#archetype-desc").stop().animate({top: "-100%", opacity: 0}, 200, function () {
                    e(this).hide()
                });
                p.parent().removeClass("black-arrow");
                p.find(".selected").removeClass("selected");
                d(true)
            }
        }).on("click", ".types div[data-archetype] .edit", function (u) {
            u.stopPropagation();
            u.preventDefault();
            f = true;
            var r = e(this).closest("div[data-archetype]");
            var v = r.data("archetype");
            if (m._custom && m._custom[v]) {
                var t = m._custom[v]["icon"];
                if (t.substring(0, 3) !== "fa-") {
                    t = ""
                }
                p.parent().addClass("black-arrow");
                e("#form-page_type_name").val(m._custom[v]["name"]).trigger("keyup");
                e("#form-page_type_icon").val(t);
                if (t) {
                    e("#archetype-custom-icon a span").html(c.__("Edit icon")).closest(".cbuttons").addClass("edit saved");
                    e("#archetype-custom-icon-wrapper").html('<i class="fa ' + t + '"></i>')
                } else {
                    e("#archetype-custom-icon a span").html(c.__("Add custom icon")).closest(".cbuttons").addClass("saved").removeClass("edit")
                }
                var s = e("#archetype-custom-add").data("edit", r).stop().css({opacity: 0}).show();
                if (m._custom[v].desc) {
                    e("#archetype-custom-wysiwyg textarea").val(m._custom[v].desc);
                    e("#archetype-custom-description a").trigger("click")
                }
                s.animate({top: 0, opacity: 1}, 200, function () {
                    e("#form-page_type_name").trigger("keyup").putCursorAtEnd()
                })
            }
        }).on("click", "#archetype-custom-add .title > a", function (r) {
            r.stopPropagation();
            r.preventDefault();
            f = false;
            b(false);
            e("#archetype-custom-add").removeData("edit").stop().animate({top: "-100%", opacity: 0}, 200, function () {
                e(this).hide()
            });
            p.parent().removeClass("black-arrow");
            d(true)
        }).on("click", "#archetype-delete", function (s) {
            s.preventDefault();
            if (e(this).closest(".cbuttons").hasClass("blocked")) {
                return false
            }
            var r = i.cellEditGroupStop(function () {
                i.batchRemoveCellArchetype()
            });
            if (!r) {
                if (p.parent().hasClass("batchediting")) {
                    i.batchRemoveCellArchetype();
                    e("#sitemap-batch-edit .icon.border").html("");
                    e("#sitemap-batch-edit .ui-selectmenu.batchediting.archetype > .ui-selectmenu-status").html(c.__("Add Page Type"))
                } else {
                    i.removeCellArchetype()
                }
            }
            p.dialog("close")
        }).on("click", "#archetype-custom-delete a", function (s) {
            s.stopPropagation();
            s.preventDefault();
            if (e(this).closest(".cbuttons").hasClass("blocked")) {
                return false
            }
            var r = e("#archetype-custom-add").data("edit");
            if (typeof r === "object") {
                var t = r.data("archetype");
                if (t) {
                    j.request({
                        data: {delete_custom_archetype: t}, success: function (u) {
                            if (u._nonce) {
                                c.updateNonce(u._nonce)
                            }
                            r.remove();
                            if (!e("#custom-archetypes-list > .archetype").length) {
                                e("#custom-archetypes-list").empty()
                            }
                            e("#archetype-custom-add .title > a").trigger("click");
                            f = false;
                            i.removeArchetypeDef(t, true);
                            c.publish("sitemap/custom_archetype_removed", [t]);
                            b(false)
                        }
                    })
                }
            }
        }).on("click", "#archetype-custom-icon a", function (r) {
            if (e(this).closest(".cbuttons").hasClass("blocked")) {
                r.stopPropagation();
                r.preventDefault();
                return false
            }
        }).on("click", "#archetype-custom-icon-remove a", function (r) {
            r.stopPropagation();
            r.preventDefault();
            if (e(this).closest(".cbuttons").hasClass("blocked")) {
                return false
            }
            e("#form-page_type_icon").val("");
            e("#archetype-custom-icon-remove").closest(".cbuttons").addClass("edit");
            e("#archetype-custom-icon a span").html("Add custom icon").closest(".cbuttons").removeClass("edit")
        }).on("click", "#archetype-cancel", function (r) {
            r.preventDefault();
            p.dialog("close")
        }).on("click", "#archetype-save", function (v) {
            v.preventDefault();
            if (f) {
                var u = e.trim(e("#form-page_type_name").val());
                if (u) {
                    var s = e("#archetype-custom-add").data("edit");
                    var t = null;
                    if (s && s.length && s.data("archetype")) {
                        t = s.data("archetype")
                    }
                    if (a && a.nicInstances && a.nicInstances.length) {
                        a.instanceById("form-cell-archetype-desc").saveContent()
                    }
                    var w = e.trim(e("#form-cell-archetype-desc").val());
                    if (w) {
                        w = w.replace(/\<br\>\s*$/, "").replace(/\n/g, "")
                    }
                    j.request({
                        data: {
                            custom_archetype_id: t,
                            custom_archetype: u,
                            custom_archetype_desc: w,
                            custom_icon: e("#form-page_type_icon").val()
                        }, success: function (y) {
                            if (y._nonce) {
                                c.updateNonce(y._nonce)
                            }
                            var x = p.find(".archetype-" + y.id);
                            if (y.icon.substring(0, 3) === "fa-") {
                                var B = '<i class="fa ' + y.icon + '"></i>';
                                var D = {type: "fa", fa: y.icon}
                            } else {
                                var B = y.icon;
                                var D = {type: "letter", letter: y.icon}
                            }
                            if (x.length) {
                                x.attr("title", y.name).children("span").text(y.name).siblings(".icon").html(B);
                                var E = x.find(".help");
                                if (y.desc) {
                                    if (!E.length) {
                                        x.find(".icon").after('<a href="#" class="help"><i class="fa fa-question"></i></a>')
                                    }
                                } else {
                                    if (E.length) {
                                        E.remove()
                                    }
                                }
                            } else {
                                var C = e("#custom-archetypes-list");
                                if (!C.length) {
                                    C = e("<div>").attr("id", "custom-archetypes-list");
                                    var z = e("#archetype-custom");
                                    if (z.length) {
                                        z.before(C)
                                    } else {
                                        e("#archetypes-list").append(C)
                                    }
                                }
                                var A = "";
                                if (!C.children("hr").length) {
                                    A += "<hr />"
                                }
                                A += '<div data-archetype="' + y.id + '" class="archetype archetype-custom-item archetype-' + y.id + '" title="' + y.name.replace(/"/g, "&quot;") + '"><span>' + y.name + '</span><div class="icon">' + B + "</div>";
                                if (y.desc) {
                                    A += '<a href="#" class="help"><i class="fa fa-question"></i></a>'
                                }
                                A += '<a href="#" class="edit"><i class="fa fa-pencil"></i></a></div>';
                                C.append(A);
                                x = C.children(".archetype-" + y.id);
                                x.data("archetype", y.id)
                            }
                            m._custom[y.id] = {name: y.name, desc: y.desc, icon: y.icon};
                            o.set("archetypes", m);
                            c.publish("sitemap/custom_archetype_saved", [y.id, y.name, y.icon]);
                            i.updateArchetypeDef(y.id, y.name, D);
                            x.trigger("click")
                        }
                    })
                } else {
                    p.dialog("close")
                }
                f = false
            } else {
                var r = p.find(".types div.selected");
                if (r.length) {
                    r.trigger("click")
                } else {
                    p.dialog("close")
                }
            }
        }).on("click", "#archetype-custom a", function (r) {
            r.preventDefault();
            f = true;
            p.parent().addClass("black-arrow");
            e("#form-page_type_name, #form-page_type_icon").val("").trigger("keyup");
            e("#archetype-custom-icon a span").html("Add custom icon").closest(".cbuttons").removeClass("edit saved");
            e("#archetype-custom-add").removeData("edit").stop().css({opacity: 0}).show().animate({
                top: 0,
                opacity: 1
            }, 200, function () {
                e("#form-page_type_name").trigger("keyup").putCursorAtEnd()
            })
        }).on("click", "#archetype-custom-description a", function (r) {
            r.preventDefault();
            if (e(this).closest(".cbuttons").hasClass("blocked")) {
                return false
            }
            b(true);
            e("#archetype-custom-wysiwyg .nicEdit-main").focus();
            d()
        }).on("keyup", "#form-page_type_name", function (r) {
            var s = e.trim(this.value);
            if (s) {
                e("#archetype-custom-add .cbuttons").removeClass("blocked")
            } else {
                e("#archetype-custom-add .cbuttons").addClass("blocked")
            }
        });
        e("#modal-font-awesome").on("click", ".icons-list i", function (s) {
            s.preventDefault();
            var r = e.trim(e(this).attr("class").replace("fa", ""));
            e("#form-page_type_icon").val(r);
            e("#archetype-custom-icon-wrapper").html(e(this).clone());
            e("#archetype-custom-icon a span").html("Edit icon").closest(".cbuttons").addClass("edit");
            e(this).closest(".modal").dialog("close")
        })
    });
    c.subscribe("modal/open/modal-font-awesome", function (n, j) {
        var i = j.find(".icons-list").removeData("plugin_tinyscrollbar").removeClass("tinyscrollbar-enabled");
        if (!i.children(".fa:first").length) {
            var o = c.require("config").get("fontawesome");
            var m = "";
            for (var k in o) {
                if (k !== g && o.hasOwnProperty(k)) {
                    m += '<i class="fa fa-' + k + '" title="' + k.replace("-o", " (open)").replace("-square", " (square)").replace(/-/g, " ") + '"></i>'
                }
            }
            i.html(m + '<div class="clear"></div>')
        }
        c.require("scrollbar").init(i, {thumbSize: 64, trackSize: 385})
    });
    c.subscribe("top_modal/before_init/topmodal-cell-archetype", function (j, i) {
        if (c.$body.hasClass("sitemappreview")) {
            return
        }
        if (i.find(".archetype > .icon").length) {
            i.addClass("has-custom")
        } else {
            i.removeClass("has-custom")
        }
    });
    c.subscribe("top_modal/open/topmodal-cell-archetype", function (m, j) {
        if (c.$body.hasClass("sitemappreview")) {
            return
        }
        f = false;
        b(false);
        d(true);
        var i = c.require("sitemap");
        var o = c.require("svg");
        var k = i.getCurrentCell();
        if (k && o.hasClass(k, "has-section")) {
            j.parent().addClass("arrow-second")
        } else {
            j.parent().removeClass("arrow-second")
        }
        var n = o.getData(k, i.getOption("data_archetype"));
        j.find(".archetype.selected").removeClass("selected");
        if (n) {
            n = n.replace(/^_/, "");
            j.find(".archetype.archetype-" + n).addClass("selected")
        }
    });
    c.subscribe("top_modal/close/topmodal-cell-archetype", function (j, i) {
        if (c.$body.hasClass("sitemappreview")) {
            return
        }
        d(true);
        e("#archetype-desc, #archetype-custom-add").removeData("edit").stop().css({opacity: 0, top: "-100%"}).hide();
        i.parent().removeClass("black-arrow").find(".selected").removeClass("selected")
    })
});
Slickplan.module(function (b, a, c) {
    var d = "transparent";
    a.subscribe("route/sitemap", function () {
        var e = a.require("sitemap");
        var g = a.require("helper");
        var f = b("#topmodal-farbtastic");
        f.on("keyup change", "#colorinput", function () {
            var h = this.value.replace(/[^0-9a-f]/gi, "");
            if (h.length === 3 || h.length === 6) {
                h = "#" + h;
                var j = b(this).closest(".ui-dialog");
                var i = j.data("type");
                if (i === "text") {
                    e.updateTextColor(h)
                } else {
                    if (i === "line") {
                        e.updateLinesColor(h)
                    } else {
                        if (i === "batch_cell") {
                            b("#sitemap-batch-edit .colors.batch-cell .color-box").css({
                                backgroundColor: h,
                                borderWidth: 0
                            });
                            e.batchChangeCellColor(h)
                        } else {
                            if (i === "batch_text") {
                                b("#sitemap-batch-edit .colors.batch-text .color-box").css({
                                    backgroundColor: h,
                                    borderWidth: 0
                                });
                                e.batchChangeCellTextColor(h)
                            } else {
                                if (!j.hasClass("topFive")) {
                                    if (j.hasClass("cell_color")) {
                                        e.changeCellColor(c, h, true)
                                    } else {
                                        if (j.hasClass("cell_text_color")) {
                                            e.changeCellTextColor(c, h, true)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }).on("click", ".submit input", function (n) {
            n.preventDefault();
            var i = b(this).closest(".ui-dialog");
            var h = i.hasClass("topFive");
            var p = i.data("type");
            if (b(this).attr("type") === "submit") {
                var k = f.find("#colorinput").val().replace(/[^0-9a-f]/gi, "");
                if (k.length === 3 || k.length === 6) {
                    k = "#" + k;
                    var j = e.cellEditGroupStop(function () {
                        if (p === "text" || p === "batch_text" || i.hasClass("cell_text_color")) {
                            e.batchChangeCellTextColor(k)
                        } else {
                            e.batchChangeCellColor(k)
                        }
                    });
                    if (!j) {
                        if (p === "text") {
                            b("#custom-text-color").data("color", k).children("p").css({backgroundColor: k});
                            e.modified = true
                        } else {
                            if (p === "line") {
                                b("#custom-lines-color").data("color", k).children("p").css({backgroundColor: k});
                                e.modified = true
                            } else {
                                if (p === "batch_cell") {
                                    b("#sitemap-batch-edit .colors.batch-cell .color-box").css({backgroundColor: k});
                                    e.modified = true
                                } else {
                                    if (p === "batch_text") {
                                        b("#sitemap-batch-edit .colors.batch-text .color-box").css({backgroundColor: k});
                                        e.modified = true
                                    } else {
                                        if (h) {
                                            var o = i.data("li");
                                            if (o && o instanceof b) {
                                                o.data("color", k).children("p").css({backgroundColor: k});
                                                a.publish("modal/farbtastic_swatch_saved", [o, k])
                                            }
                                        } else {
                                            if (i.hasClass("cell_color")) {
                                                e.changeCellColor(c, k)
                                            } else {
                                                if (i.hasClass("cell_text_color")) {
                                                    e.changeCellTextColor(c, k)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                var q = e.getCurrentCell();
                var m = i.hasClass("cell_color");
                if (this.value === a.__("Cancel")) {
                    i.find(".close").trigger("click")
                } else {
                    g.cellGroupWarningDialog(q, {
                        on_single: function (r) {
                            if (m) {
                                e.changeCellColor(r)
                            } else {
                                e.changeCellTextColor(r)
                            }
                        }, on_unlink: function (r) {
                            if (m) {
                                e.changeCellColor(r)
                            } else {
                                e.changeCellTextColor(r)
                            }
                        }, on_update: function (r) {
                            e.cellEditGroupStop(function (t) {
                                if (t && t.cells) {
                                    for (var u = 0, s = t.cells.length; u < s; ++u) {
                                        if (m) {
                                            e.changeCellColor(t.cells[u], c, (u < s - 1))
                                        } else {
                                            e.changeCellTextColor(t.cells[u], c, (u < s - 1))
                                        }
                                    }
                                }
                            })
                        }
                    })
                }
            }
            f.dialog("close")
        }).on("click", ".close", function (n) {
            n.preventDefault();
            var k = b(this).closest(".ui-dialog");
            var h = k.hasClass("topFive");
            var j = k.data("type");
            if (j === "text") {
                var i = b("#custom-text-color").data("color");
                e.updateTextColor(i)
            } else {
                if (j === "line") {
                    var i = b("#custom-lines-color").data("color");
                    e.updateLinesColor(i)
                } else {
                    if (j === "batch_cell") {
                        e.batchChangeCellColor(d);
                        e.batchRestoreCellDatas(e.getOption("data_color"));
                        b("#sitemap-batch-edit .colors.batch-cell .color-box").css({
                            backgroundColor: d,
                            borderWidth: (d === "transparent" ? "1px" : 0)
                        })
                    } else {
                        if (j === "batch_text") {
                            e.batchChangeCellTextColor(d);
                            e.batchRestoreCellDatas(e.getOption("data_text_color"));
                            b("#sitemap-batch-edit .colors.batch-text .color-box").css({
                                backgroundColor: d,
                                borderWidth: (d === "transparent" ? "1px" : 0)
                            })
                        } else {
                            if (!h) {
                                var m = k.find(".breset").data("oldcolor");
                                if (k.hasClass("cell_color")) {
                                    e.changeCellColor(c, m, true)
                                } else {
                                    if (k.hasClass("cell_text_color")) {
                                        e.changeCellTextColor(c, m, true)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            b(this).closest(".top-modal").dialog("close")
        })
    });
    a.subscribe("top_modal/after_open/topmodal-farbtastic", function (i, g) {
        var f = a.require("sitemap");
        var h = g.parent().data("type");
        if (h === "batch_cell") {
            f.batchBackupCellDatas(f.getOption("data_color"));
            d = b("#sitemap-batch-edit .colors.batch-cell .color-box").css("background-color")
        } else {
            if (h === "batch_text") {
                f.batchBackupCellDatas(f.getOption("data_text_color"));
                d = b("#sitemap-batch-edit .colors.batch-text .color-box").css("background-color")
            }
        }
        if ((d.indexOf("#") < 0 && d.indexOf("rgb") < 0) || /rgba\(\s*[0-9]+[\s,]+[0-9]+[\s,]+[0-9]+[\s,]+0\s*\)/.test(d)) {
            d = "transparent"
        }
    });
    a.subscribe("top_modal/close/topmodal-farbtastic", function (g, f) {
        f.parent().removeClass("linetext").removeData("type")
    })
});
Slickplan.module(function (f, d, g) {
    var b = false;
    var a;

    function c(h) {
        if (!b) {
            b = new nicEditor()
        }
        if (!window.document.getElementById("form-cell-note")) {
            return
        }
        if (h) {
            b.panelInstance("form-cell-note").addEvent("keyup", function () {
                if (b && b.nicInstances && b.nicInstances.length) {
                    b.instanceById("form-cell-note").saveContent()
                }
                clearTimeout(a);
                a = setTimeout(function () {
                    e()
                }, 5)
            })
        } else {
            b.removeInstance("form-cell-note")
        }
    }

    function e(o, m) {
        var k = f("#topmodal-cell-note");
        var h = k.find(".nicEdit-main");
        if (h.length) {
            var j = h.outerHeight(true);
            var n = j + 26 + 31 + 8;
            h.parent().height(j);
            k.height(n).parent().height(n)
        } else {
            var i = f(o).siblings(".note-text").show().css({position: "absolute", zIndex: "-1"});
            if (m !== true) {
                var p = k.find("textarea").val();
                i.html(p)
            }
            var j = i.outerHeight();
            f(o).css("height", j);
            var n = i.parent().outerHeight();
            k.height(n).parent().height(n).find(".nicEdit-editArea").height(j);
            i.css({position: "static", zIndex: 1}).hide()
        }
    }

    d.subscribe("route/sitemap", function () {
        var j = d.require("string");
        var h = d.require("sitemap");
        var i = f("#topmodal-cell-note");
        i.on("click", "#note-edit", function (n) {
            n.preventDefault();
            if (b && b.nicInstances && b.nicInstances.length) {
                if (!i.parent().hasClass("batchediting")) {
                    var k = h.getCurrentCell();
                    var m = d.require("svg");
                    var o = m.getData(k, h.getOption("data_desc"));
                    if (!o) {
                        h.removeCellNote()
                    }
                }
                i.dialog("close")
            } else {
                i.find(".note-text").hide().siblings("textarea").show();
                f(this).children("span").html(d.__("Cancel"));
                c(true)
            }
        }).on("click", "#note-save", function (n) {
            n.preventDefault();
            if (b && b.nicInstances && b.nicInstances.length) {
                b.instanceById("form-cell-note").saveContent()
            }
            var o = f.trim(i.find("textarea").val());
            if (o) {
                o = o.replace(/\<br\>\s*$/, "").replace(/\n/g, "");
                var m = h.cellEditGroupStop(function () {
                    h.batchAddCellNote(o)
                });
                if (!m) {
                    if (i.parent().hasClass("batchediting")) {
                        h.batchAddCellNote(o);
                        var k = f("#sitemap-batch-edit .ui-selectmenu.batchediting.desc");
                        k.data("batchdata", o);
                        k.children(".ui-selectmenu-status").html(d.__("Edit Note"))
                    } else {
                        h.addCellNote(g, o)
                    }
                }
                i.dialog("close")
            } else {
                f("#note-delete").trigger("click")
            }
        }).on("click", "#note-delete", function (n) {
            n.preventDefault();
            var m = h.cellEditGroupStop(function () {
                h.batchRemoveCellNote()
            });
            if (!m) {
                i.find(".note-text").html(" ").show().siblings("textarea").hide();
                if (i.parent().hasClass("batchediting")) {
                    h.batchRemoveCellNote();
                    var k = f("#sitemap-batch-edit .ui-selectmenu.batchediting.desc");
                    k.data("batchdata", "");
                    k.children(".ui-selectmenu-status").html(d.__("Add Note"))
                } else {
                    h.removeCellNote()
                }
            }
            i.dialog("close")
        }).on("keyup", "textarea", function (m, k) {
            e(this, k)
        })
    });
    d.subscribe("top_modal/open/topmodal-cell-note", function (m, j) {
        var i = d.require("sitemap");
        var n = d.require("svg");
        var h = i.getCurrentCell();
        var k = n.getData(h, i.getOption("data_desc_width"));
        //arieskienmendoza: Salia con 100 y quedaba pequeño
        j.dialog("option", "width", 260);
        //arieskienmendoza: FIN

        if (k !== g && (k = parseInt(k, 10)) > 260) {
            j.dialog("option", "width", k)
        }
        j.parent().removeClass("arrow-second arrow-first-offset");
        if (h && n.hasClass(h, "has-url")) {
            j.parent().addClass("arrow-first-offset")
        }
    });
    d.subscribe("top_modal/after_open/topmodal-cell-note", function (i, h) {
        h.find("textarea").trigger("keyup");
        h.find(".nicEdit-main").focus()
    });
    d.subscribe("top_modal/close/topmodal-cell-note", function (i, h) {
        c(false);
        h.find(".note-text").show().siblings("textarea").show();
        h.find("#note-edit > span").html(d.__("Edit"));
        h.dialog("option", "width", 260)
    })
});
Slickplan.module(function (e, b, f) {
    function a(g) {
        if (!g) {
            g = e("#cell-new-link-external-links > div")
        }
        if (g.hasClass("tinyscrollbar-enabled")) {
            g.css("height", "");
            g.removeClass("tinyscrollbar-enabled").removeData();
            g.find(".external-link").appendTo(g);
            g.find(".viewport, .scrollbar, .overview").remove()
        }
    }

    function d(g) {
        var i = b.require("scrollbar");
        var h = e("#cell-new-link-external-links > div");
        if (g || h.find(".external-link").length > 2) {
            h.css("height", 320);
            if (h.hasClass("tinyscrollbar-enabled")) {
                i.update(h, "relative")
            } else {
                i.init(h, {})
            }
        } else {
            a(h)
        }
    }

    function c(g) {
        if (g > 1) {
            e("#cell-new-link-external-links .external-link input.url").each(function (h) {
                e(this).prev("label").html("URL #" + (++h) + ":")
            })
        } else {
            e("#cell-new-link-external-links .external-link input.url").prev("label").html("URL:")
        }
    }

    b.subscribe("route/sitemap", function () {
        var h = b.require("sitemap");
        var g = b.require("form");
        var j = b.require("string");
        var i = e("#topmodal-cell-url");
        var k = 10;
        i.on("click", "#url-cancel", function (m) {
            m.preventDefault();
            i.dialog("close")
        }).on("click", "#url-save", function (r) {
            r.preventDefault();
            var q = [];
            var m = e('#topmodal-cell-url input[name="cell_new_link"]:checked').val();
            if (m === "internal") {
                var o = e.trim(e("#cell-link-top-parent-page").val());
                if (o) {
                    q = [{type: m, page: o}]
                }
            } else {
                e("#cell-new-link-external-links .external-link").each(function () {
                    var t = e.trim(e(this).find("input.label").val());
                    var s = e.trim(e(this).find("input.url").val());
                    if (s && s !== "http://" && s !== "https://" && s !== "ftp://") {
                        q.push({type: m, label: t, url: s})
                    }
                });
                if (q.length === 1 && q[0].label === "") {
                    q = q[0].url
                }
            }
            if (q.length) {
                var p = h.cellEditGroupStop(function () {
                    h.batchAddCellUrl(q)
                });
                if (!p) {
                    if (i.parent().hasClass("batchediting")) {
                        h.batchAddCellUrl(q);
                        var n = e("#sitemap-batch-edit .ui-selectmenu.batchediting.url");
                        n.data("batchdata", q);
                        n.children(".ui-selectmenu-status").html(b.__("Edit Link"))
                    } else {
                        h.addCellUrl(f, q)
                    }
                }
            } else {
                e("#url-delete").trigger("click")
            }
            i.dialog("close")
        }).on("click", "#url-delete", function (o) {
            o.preventDefault();
            var n = h.cellEditGroupStop(function () {
                h.batchRemoveCellUrl()
            });
            if (!n) {
                if (i.parent().hasClass("batchediting")) {
                    h.batchRemoveCellUrl();
                    var m = e("#sitemap-batch-edit .ui-selectmenu.batchediting.url");
                    m.data("batchdata", "");
                    m.children(".ui-selectmenu-status").html(b.__("Add Link"))
                } else {
                    h.removeCellUrl()
                }
            }
            i.dialog("close")
        }).on("change", 'input[name="cell_new_link"]', function (o, n) {
            var m = this.id.replace("cell-new-link-", "");
            e("#cell-new-link-internal-links, #cell-new-link-external-links").hide();
            if (m === "internal") {
                e("#cell-new-link-internal-links").show()
            } else {
                e("#cell-new-link-external-links").show().find("input.url").putCursorAtEnd()
            }
            a();
            d(false)
        }).on("click", ".link-fields .new-row", function (p, o) {
            p.preventDefault();
            var n = e("#cell-new-link-external-links .external-link").length;
            if (n >= k) {
                return false
            } else {
                ++n;
                var m = e("#cell-new-link-external-links .external-link:first").clone().insertAfter(e(this).closest(".external-link"));
                m.find("input.label").val((o && o.label) ? o.label : "");
                m.find("input.url").val((o && o.url) ? o.url : "http://").putCursorAtEnd();
                e("#cell-new-link-external-links .remove").show();
                if (n >= k) {
                    e("#cell-new-link-external-links .new-row").hide()
                }
                if (!o) {
                    d((n >= k));
                    m.stop().hide().slideDown(250, function () {
                        d()
                    })
                }
            }
            c(n)
        }).on("click", ".link-fields .remove", function (m) {
            m.preventDefault();
            e(this).closest(".link-fields").slideUp(250, function () {
                e(this).remove();
                var n = e("#cell-new-link-external-links .external-link").length;
                e("#cell-new-link-external-links .new-row").show();
                if (n <= 1) {
                    e("#cell-new-link-external-links .remove").hide()
                }
                d();
                c(n)
            })
        }).on("change", "#cell-link-top-section-id", function (t, q) {
            var o = e("#cell-link-top-parent-page");
            var u = o.closest(".select");
            g.clearErrors(e("#cell-urls"));
            if (this.value) {
                var s = '<option value="">' + b.__("Select Page") + "</option>";
                o.html(s);
                var v = h.serializeCells(this.value, true);
                for (var r = 0; r < v.length; ++r) {
                    var n = h.getCellLevel(v[r]);
                    var p = (typeof n === "number") ? n : 0;
                    var m = e('<option value="' + v[r].id + '">' + v[r].text + (n === "home" ? " (" + b.__("Home") + ")" : "") + "</option>").data("indent", p).appendTo(o);
                    if (v[r].id === q) {
                        m.prop("selected", true)
                    }
                }
                o.selectmenu("destroy");
                o.selectmenu({
                    style: "popup", maxHeight: 300, format: function (w) {
                        return j.charsEncode(w)
                    }
                })
            }
        })
    });
    b.subscribe("top_modal/open/topmodal-cell-url", function (A, p) {
        var s = b.require("sitemap");
        var g = b.require("svg");
        var n = b.require("string");
        p.parent().removeClass("arrow-second arrow-first-offset");
        if (s.isBatchEdit()) {
            var o = e("#sitemap-batch-edit .ui-selectmenu.batchediting.url");
            var y = o.data("batchdata")
        } else {
            var h = s.isBatchEdit() ? f : s.getCurrentCell();
            var y = g.getData(h, s.getOption("data_url"));
            if (h && g.hasClass(h, "has-desc")) {
                p.parent().addClass("arrow-second")
            }
        }
        p.find("#cell-new-link-external-links .external-link + .external-link").remove();
        p.find("input.label").val("");
        p.find("input.url").val("http://");
        if (y && typeof y === "string") {
            y = [{type: "external", label: "", url: y}]
        }
        var C = s.getCurrentSection();
        var q = false;
        if (y && e.isArray(y) && y[0] && typeof y[0].type === "string" && y[0].type === "internal" && y[0].page) {
            var C = s.getCellSection(y[0].page);
            var q = y[0].page
        }
        var z = s.getJSON();
        var t = "";
        var m = 0;
        var k = e("#cell-link-top-section-id");
        var u = e("#cell-link-top-parent-page");
        var B = k.closest(".select");
        var v = u.closest(".select");
        var r = '<option value="">' + b.__("Select Section") + "</option>";
        e.each(z, function (i, j) {
            if (s.isMainSection(i)) {
                t += '<option value="' + i + '"' + (C === i ? " selected" : "") + ">" + b.__("Main Section") + "</option>";
                ++m
            } else {
                if (j.cells) {
                    e.each(j.cells, function (E, D) {
                        if (D.level && D.level === "home") {
                            t += '<option value="' + i + '"' + (C === i ? " selected" : "") + ">" + D.text + "</option>";
                            ++m;
                            return false
                        }
                    })
                }
            }
        });
        k.html(r + t);
        if (m > 1) {
            k.selectmenu("destroy");
            k.selectmenu({
                style: "popup", maxHeight: 300, format: function (i) {
                    return n.charsEncode(i)
                }
            })
        }
        k.trigger("change", [q]);
        if (y && e.isArray(y)) {
            if (y[0] && typeof y[0].type === "string" && y[0].type === "internal") {
                e("#cell-new-link-" + (q ? "internal" : "external")).prop("checked", true).trigger("change")
            } else {
                for (var x = 0, w = y.length; x < w; ++x) {
                    if (y[x] && y[x].type && y[x].type === "external") {
                        if (x === 0) {
                            e("#cell-new-link-external-links .external-link:first").find("input.label").val(y[x].label).end().find("input.url").val(y[x].url)
                        } else {
                            e("#cell-new-link-external-links .link-fields .new-row:last").trigger("click", [y[x], true])
                        }
                        if (x + 1 === w) {
                            e("#cell-new-link-" + y[x].type).prop("checked", true).trigger("change")
                        }
                    }
                }
            }
        } else {
            e("#cell-new-link-external").prop("checked", true).trigger("change")
        }
    })
});
Slickplan.module(function (f, d, h) {
    var a = function (j) {
        var i = {};
        var n = /<([a-z0-9_]+)>([^<]+)<\/\1>/gi;
        var m = null;
        while (m = n.exec(j)) {
            var o = m[1].toLowerCase();
            var k = m[2];
            i[o] = k
        }
        return i
    };
    var e = function (k, C) {
        var u = d.require("http");
        var o = d.require("config");
        var q = d.require("string");
        var n = f(k);
        var A = n.data("maxsize") || "1mb";
        var y = n.data("multiple") || false;
        var r = n.data("droptarget") || false;
        var m = n.data("mimes");
        var B = n.data("s3");
        if (m) {
            m = m.split(",")
        } else {
            m = ["images"]
        }
        for (var x = 0, w = m.length; x < w; ++x) {
            switch (m[x]) {
                case"images":
                    m[x] = {title: d.__("Image files"), extensions: "jpg,jpeg,gif,png"};
                    break;
                case"videos":
                    m[x] = {title: d.__("Video files"), extensions: "mov,mp4,avi,mpg,m4a"};
                    break;
                default:
                    m[x] = {title: ("" + m[x]).toUpperCase() + d.__(" files"), extensions: m[x]}
            }
        }
        var z = null;
        if (B) {
            var s = o.get("s3");
            if (s) {
                var p = "https://" + s.bucket + ".s3.amazonaws.com:443/";
                z = {
                    acl: s.acl,
                    "Content-Type": "application/octet-stream",
                    AWSAccessKeyId: s.key,
                    policy: s.policy,
                    signature: s.signature,
                    success_action_status: "201"
                }
            } else {
                B = false
            }
        }
        if (!z) {
            var p = u.url(n.closest("form").attr("action") || h);
            z = {
                ajax: 1,
                plupload: 1,
                _nonce: f(document.body).find('input[type="hidden"][name="_nonce"]:first').val(),
                UPLOADIFYSESSION: u.getCookie("session")
            };
            if (n.closest("form").length) {
                var t = n.closest("form").serializeObject();
                z = f.extend(z, t)
            }
        }
        var v = new window.plupload.Uploader({
            runtimes: "html5,flash,silverlight,html4",
            browse_button: k,
            multi_selection: y,
            drop_element: r,
            url: p,
            filters: {prevent_duplicates: false, max_file_size: A, mime_types: m},
            flash_swf_url: "/static/js/plupload/Moxie.swf",
            silverlight_xap_url: "/static/js/plupload/Moxie.xap",
            multipart_params: z,
            init: {
                Init: function () {
                    if (r && this.features.dragdrop) {
                        var j = f("#" + r);
                        if (j.length) {
                            var i;
                            var D = j.get(0);
                            if (D) {
                                D.ondragover = function (E) {
                                    E.dataTransfer.dropEffect = "copy"
                                };
                                D.ondrop = function (E) {
                                    j.removeClass("dragover")
                                }
                            }
                            j.on("dragenter", function (F) {
                                i = F.target;
                                var E = F.originalEvent.dataTransfer;
                                if (E.types != null && (E.types.indexOf ? E.types.indexOf("Files") != -1 : E.types.contains("application/x-moz-file"))) {
                                    j.addClass("dragover")
                                }
                            }).on("dragleave", function (E) {
                                if (!f(this).find(i).size() && !f(this).find(E.target).size()) {
                                    j.removeClass("dragover")
                                }
                            })
                        }
                    }
                }, PostInit: function () {
                    d.publish("upload/post_init_" + C, [v, k])
                }, FilesAdded: function (i, j) {
                    d.publish("upload/files_added_" + C, [i, j, k])
                }, BeforeUpload: function (i, j) {
                    if (B && s) {
                        i.settings.multipart_params.key = s.folder + "/" + j.name;
                        i.settings.multipart_params.Filename = i.settings.multipart_params.key
                    }
                    d.publish("upload/file_before_upload_" + C, [i, j])
                }, UploadFile: function (i, j) {
                    d.publish("upload/file_upload_file_" + C, [i, j])
                }, FileUploaded: function (i, D, j) {
                    j = j.response;
                    if (B) {
                        j = a(j)
                    } else {
                        if (typeof j === "string") {
                            if (j.charAt(0) === "[" || j.charAt(0) === "{") {
                                j = f.parseJSON(j)
                            } else {
                                j = {error: j}
                            }
                        }
                    }
                    d.publish("upload/file_uploaded_" + C, [i, D, j, k])
                }, UploadProgress: function (i, j) {
                    d.publish("upload/uploads_progress_" + C, [i, j, k])
                }, UploadComplete: function (i, j) {
                    d.publish("upload/uploads_complete_" + C, [i, j, k])
                }, Error: function (i, j) {
                    d.publish("upload/error_" + C, [i, j, k])
                }
            }
        });
        v.init();
        return v
    };
    d.$body.find(".uploadbutton").each(function () {
        var i = f(this).data("name") || this.id;
        e(this, i)
    });
    var b = d.require("form");
    var c = (window.File && window.FileReader && window.FileList);
    d.$body.find("input:file.plainupload").each(function () {
        var k = f(this);
        var j = k.attr("name").replace(/[^a-z0-9_-]/g, "");
        var i = k.siblings(".filename");
        k.on("change", function (q) {
            if (c) {
                var n = q.target.files[0].name
            } else {
                var n = k.val().split(/(\\|\/)/g).pop()
            }
            var p = k.closest("#importopts");
            if (c && p.length) {
                b.clearErrors(p.parent());
                var o = (-1 !== (n).indexOf(".")) ? (n).replace(/.*[.]/, "").toLowerCase() : "";
                var m = null;
                if (f('#import-tab input[name="import[type]"]:checked').val() === "dash") {
                    if (o !== "txt") {
                        m = d.__("File has an invalid extension, it should be txt.")
                    }
                } else {
                    if (o !== "xml") {
                        m = d.__("File has an invalid extension, it should be xml.")
                    }
                }
                if (m) {
                    b.error(p.prev(), m, {bottom: -41}, h, -20)
                }
            }
            if (i.length) {
                if (i.is("input")) {
                    i.val(n)
                } else {
                    i.html(escape(n))
                }
            }
        })
    });
    var g = {};
    d.subscribe("upload/dynamic_uploader/init", function (m, i, j, k) {
        if (i && j) {
            i = e(i, j);
            if (k) {
                g[k] = i
            }
        }
    });
    d.subscribe("upload/dynamic_uploader/destroy", function (j, i) {
        if (g && g[i]) {
            g[i].destroy();
            delete g[i];
            g[i] = h
        }
    })
});