window.onerror = function (d, b, a, c) {
    a = parseInt(a, 10);
    if (!d || a <= 0) {
        return false
    }
    if (window.XMLHttpRequest) {
        var f = new XMLHttpRequest();
        if (c) {
            d += ", column " + c
        }
        var e = "jserror=1&jsmessage=" + escape(d) + "&jsurl=" + escape(b) + "&jsline=" + escape(a) + "&jsua=" + escape(window.navigator.userAgent);
        f.open("POST", window.location.href, true);
        f.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        f.send(e)
    }
    return false
};
window.Modernizr = function (al, ak, aj) {
    function H(b) {
        ac.cssText = b
    }

    function G(d, c) {
        return H(Z.join(d + ";") + (c || ""))
    }

    function W(d, c) {
        return typeof d === c
    }

    function U(d, c) {
        return !!~("" + d).indexOf(c)
    }

    function S(f, c) {
        for (var h in f) {
            var g = f[h];
            if (!U(g, "-") && ac[g] !== aj) {
                return c == "pfx" ? g : !0
            }
        }
        return !1
    }

    function Q(g, c, j) {
        for (var i in g) {
            var h = c[g[i]];
            if (h !== aj) {
                return j === !1 ? g[i] : W(h, "function") ? h.bind(j || c) : h
            }
        }
        return !1
    }

    function O(g, f, j) {
        var i = g.charAt(0).toUpperCase() + g.slice(1), h = (g + " " + X.join(i + " ") + i).split(" ");
        return W(f, "string") || W(f, "undefined") ? S(h, f) : (h = (g + " " + V.join(i + " ") + i).split(" "), Q(h, f, j))
    }

    var ai = "2.8.3", ah = {}, ag = !0, af = ak.documentElement, ae = "modernizr", ad = ak.createElement(ae), ac = ad.style, ab, aa = {}.toString, Z = " -webkit- -moz- -o- -ms- ".split(" "), Y = "Webkit Moz O ms", X = Y.split(" "), V = Y.toLowerCase().split(" "), T = {}, R = {}, P = {}, N = [], M = N.slice, K, J = {}.hasOwnProperty, I;
    !W(J, "undefined") && !W(J.call, "undefined") ? I = function (d, c) {
        return J.call(d, c)
    } : I = function (d, c) {
        return c in d && W(d.constructor.prototype[c], "undefined")
    }, Function.prototype.bind || (Function.prototype.bind = function (a) {
        var h = this;
        if (typeof h != "function") {
            throw new TypeError
        }
        var g = M.call(arguments, 1), f = function () {
            if (this instanceof f) {
                var b = function () {
                };
                b.prototype = h.prototype;
                var d = new b, c = h.apply(d, g.concat(M.call(arguments)));
                return Object(c) === c ? c : d
            }
            return h.apply(a, g.concat(M.call(arguments)))
        };
        return f
    }), T.multiplebgs = function () {
        return H("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(ac.background)
    }, T.cssgradients = function () {
        var e = "background-image:", d = "gradient(linear,left top,right bottom,from(#9f9),to(white));", f = "linear-gradient(left top,#9f9, white);";
        return H((e + "-webkit- ".split(" ").join(d + e) + Z.join(f + e)).slice(0, -e.length)), U(ac.backgroundImage, "gradient")
    }, T.csstransitions = function () {
        return O("transition")
    }, T.sessionstorage = function () {
        try {
            return sessionStorage.setItem(ae, ae), sessionStorage.removeItem(ae), !0
        } catch (b) {
            return !1
        }
    };
    for (var L in T) {
        I(T, L) && (K = L.toLowerCase(), ah[K] = T[L](), N.push((ah[K] ? "" : "no-") + K))
    }
    return ah.addTest = function (e, c) {
        if (typeof e == "object") {
            for (var f in e) {
                I(e, f) && ah.addTest(f, e[f])
            }
        } else {
            e = e.toLowerCase();
            if (ah[e] !== aj) {
                return ah
            }
            c = typeof c == "function" ? c() : c, typeof ag != "undefined" && ag && (af.className += " " + (c ? "" : "no-") + e), ah[e] = c
        }
        return ah
    }, H(""), ad = ab = null, ah._version = ai, ah._prefixes = Z, ah._domPrefixes = V, ah._cssomPrefixes = X, ah.testProp = function (b) {
        return S([b])
    }, ah.testAllProps = O, af.className = af.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (ag ? " js " + N.join(" ") : ""), ah
}(this, this.document);
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
;
if ("document" in self && !("classList" in document.createElement("_") && "classList" in document.createElementNS("http://www.w3.org/2000/svg", "svg"))) {
    (function (j) {
        if (!("Element" in j)) {
            return
        }
        var a = "classList", f = "prototype", m = j.Element[f], b = Object, k = String[f].trim || function () {
                return this.replace(/^\s+|\s+$/g, "")
            }, c = Array[f].indexOf || function (q) {
                var p = 0, o = this.length;
                for (; p < o; p++) {
                    if (p in this && this[p] === q) {
                        return p
                    }
                }
                return -1
            }, n = function (o, p) {
            this.name = o;
            this.code = DOMException[o];
            this.message = p
        }, g = function (p, o) {
            if (o === "") {
                throw new n("SYNTAX_ERR", "An invalid or illegal string was specified")
            }
            if (/\s/.test(o)) {
                throw new n("INVALID_CHARACTER_ERR", "String contains an invalid character")
            }
            return c.call(p, o)
        }, d = function (s) {
            var r = k.call(s.getAttribute("class") || ""), q = r ? r.split(/\s+/) : [], p = 0, o = q.length;
            for (; p < o; p++) {
                this.push(q[p])
            }
            this._updateClassName = function () {
                s.setAttribute("class", this.toString())
            }
        }, e = d[f] = [], i = function () {
            return new d(this)
        };
        n[f] = Error[f];
        e.item = function (o) {
            return this[o] || null
        };
        e.contains = function (o) {
            o += "";
            return g(this, o) !== -1
        };
        e.add = function () {
            var s = arguments, r = 0, p = s.length, q, o = false;
            do {
                q = s[r] + "";
                if (g(this, q) === -1) {
                    this.push(q);
                    o = true
                }
            } while (++r < p);
            if (o) {
                this._updateClassName()
            }
        };
        e.remove = function () {
            var t = arguments, s = 0, p = t.length, r, o = false;
            do {
                r = t[s] + "";
                var q = g(this, r);
                if (q !== -1) {
                    this.splice(q, 1);
                    o = true
                }
            } while (++s < p);
            if (o) {
                this._updateClassName()
            }
        };
        e.toggle = function (p, q) {
            p += "";
            var o = this.contains(p), r = o ? q !== true && "remove" : q !== false && "add";
            if (r) {
                this[r](p)
            }
            return !o
        };
        e.toString = function () {
            return this.join(" ")
        };
        if (b.defineProperty) {
            var l = {get: i, enumerable: true, configurable: true};
            try {
                b.defineProperty(m, a, l)
            } catch (h) {
                if (h.number === -2146823252) {
                    l.enumerable = false;
                    b.defineProperty(m, a, l)
                }
            }
        } else {
            if (b[f].__defineGetter__) {
                m.__defineGetter__(a, i)
            }
        }
    }(self))
}
/*! jQuery v2.1.3 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
;
!function (d, c) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = d.document ? c(d, !0) : function (b) {
        if (!b.document) {
            throw new Error("jQuery requires a window with a document")
        }
        return c(b)
    } : c(d)
}("undefined" != typeof window ? window : this, function (a, b) {
    var c = [], d = c.slice, e = c.concat, f = c.push, g = c.indexOf, h = {}, i = h.toString, j = h.hasOwnProperty, k = {}, l = a.document, m = "2.1.3", n = function (a, b) {
        return new n.fn.init(a, b)
    }, o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, p = /^-ms-/, q = /-([\da-z])/gi, r = function (a, b) {
        return b.toUpperCase()
    };
    n.fn = n.prototype = {
        jquery: m, constructor: n, selector: "", length: 0, toArray: function () {
            return d.call(this)
        }, get: function (a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
        }, pushStack: function (a) {
            var b = n.merge(this.constructor(), a);
            return b.prevObject = this, b.context = this.context, b
        }, each: function (a, b) {
            return n.each(this, a, b)
        }, map: function (a) {
            return this.pushStack(n.map(this, function (b, c) {
                return a.call(b, c, b)
            }))
        }, slice: function () {
            return this.pushStack(d.apply(this, arguments))
        }, first: function () {
            return this.eq(0)
        }, last: function () {
            return this.eq(-1)
        }, eq: function (a) {
            var b = this.length, c = +a + (0 > a ? b : 0);
            return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
        }, end: function () {
            return this.prevObject || this.constructor(null)
        }, push: f, sort: c.sort, splice: c.splice
    }, n.extend = n.fn.extend = function () {
        var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
        for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || n.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++) {
            if (null != (a = arguments[h])) {
                for (b in a) {
                    c = g[b], d = a[b], g !== d && (j && d && (n.isPlainObject(d) || (e = n.isArray(d))) ? (e ? (e = !1, f = c && n.isArray(c) ? c : []) : f = c && n.isPlainObject(c) ? c : {}, g[b] = n.extend(j, f, d)) : void 0 !== d && (g[b] = d))
                }
            }
        }
        return g
    }, n.extend({
        expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""), isReady: !0, error: function (a) {
            throw new Error(a)
        }, noop: function () {
        }, isFunction: function (a) {
            return "function" === n.type(a)
        }, isArray: Array.isArray, isWindow: function (a) {
            return null != a && a === a.window
        }, isNumeric: function (a) {
            return !n.isArray(a) && a - parseFloat(a) + 1 >= 0
        }, isPlainObject: function (a) {
            return "object" !== n.type(a) || a.nodeType || n.isWindow(a) ? !1 : a.constructor && !j.call(a.constructor.prototype, "isPrototypeOf") ? !1 : !0
        }, isEmptyObject: function (a) {
            var b;
            for (b in a) {
                return !1
            }
            return !0
        }, type: function (a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
        }, globalEval: function (a) {
            var b, c = eval;
            a = n.trim(a), a && (1 === a.indexOf("use strict") ? (b = l.createElement("script"), b.text = a, l.head.appendChild(b).parentNode.removeChild(b)) : c(a))
        }, camelCase: function (a) {
            return a.replace(p, "ms-").replace(q, r)
        }, nodeName: function (a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        }, each: function (a, b, c) {
            var d, e = 0, f = a.length, g = s(a);
            if (c) {
                if (g) {
                    for (; f > e; e++) {
                        if (d = b.apply(a[e], c), d === !1) {
                            break
                        }
                    }
                } else {
                    for (e in a) {
                        if (d = b.apply(a[e], c), d === !1) {
                            break
                        }
                    }
                }
            } else {
                if (g) {
                    for (; f > e; e++) {
                        if (d = b.call(a[e], e, a[e]), d === !1) {
                            break
                        }
                    }
                } else {
                    for (e in a) {
                        if (d = b.call(a[e], e, a[e]), d === !1) {
                            break
                        }
                    }
                }
            }
            return a
        }, trim: function (a) {
            return null == a ? "" : (a + "").replace(o, "")
        }, makeArray: function (a, b) {
            var c = b || [];
            return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c
        }, inArray: function (a, b, c) {
            return null == b ? -1 : g.call(b, a, c)
        }, merge: function (a, b) {
            for (var c = +b.length, d = 0, e = a.length; c > d; d++) {
                a[e++] = b[d]
            }
            return a.length = e, a
        }, grep: function (a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) {
                d = !b(a[f], f), d !== h && e.push(a[f])
            }
            return e
        }, map: function (a, b, c) {
            var d, f = 0, g = a.length, h = s(a), i = [];
            if (h) {
                for (; g > f; f++) {
                    d = b(a[f], f, c), null != d && i.push(d)
                }
            } else {
                for (f in a) {
                    d = b(a[f], f, c), null != d && i.push(d)
                }
            }
            return e.apply([], i)
        }, guid: 1, proxy: function (a, b) {
            var c, e, f;
            return "string" == typeof b && (c = a[b], b = a, a = c), n.isFunction(a) ? (e = d.call(arguments, 2), f = function () {
                return a.apply(b || this, e.concat(d.call(arguments)))
            }, f.guid = a.guid = a.guid || n.guid++, f) : void 0
        }, now: Date.now, support: k
    }), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) {
        h["[object " + b + "]"] = b.toLowerCase()
    });
    function s(a) {
        var b = a.length, c = n.type(a);
        return "function" === c || n.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
    }

    var t = function (a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + 1 * new Date, v = a.document, w = 0, x = 0, y = hb(), z = hb(), A = hb(), B = function (a, b) {
            return a === b && (l = !0), 0
        }, C = 1 << 31, D = {}.hasOwnProperty, E = [], F = E.pop, G = E.push, H = E.push, I = E.slice, J = function (a, b) {
            for (var c = 0, d = a.length; d > c; c++) {
                if (a[c] === b) {
                    return c
                }
            }
            return -1
        }, K = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", L = "[\\x20\\t\\r\\n\\f]", M = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", N = M.replace("w", "w#"), O = "\\[" + L + "*(" + M + ")(?:" + L + "*([*^$|!~]?=)" + L + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + N + "))|)" + L + "*\\]", P = ":(" + M + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + O + ")*)|.*)\\)|)", Q = new RegExp(L + "+", "g"), R = new RegExp("^" + L + "+|((?:^|[^\\\\])(?:\\\\.)*)" + L + "+$", "g"), S = new RegExp("^" + L + "*," + L + "*"), T = new RegExp("^" + L + "*([>+~]|" + L + ")" + L + "*"), U = new RegExp("=" + L + "*([^\\]'\"]*?)" + L + "*\\]", "g"), V = new RegExp(P), W = new RegExp("^" + N + "$"), X = {
            ID: new RegExp("^#(" + M + ")"),
            CLASS: new RegExp("^\\.(" + M + ")"),
            TAG: new RegExp("^(" + M.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + O),
            PSEUDO: new RegExp("^" + P),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + L + "*(even|odd|(([+-]|)(\\d*)n|)" + L + "*(?:([+-]|)" + L + "*(\\d+)|))" + L + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + K + ")$", "i"),
            needsContext: new RegExp("^" + L + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + L + "*((?:-\\d)?\\d*)" + L + "*\\)|)(?=[^-]|$)", "i")
        }, Y = /^(?:input|select|textarea|button)$/i, Z = /^h\d$/i, $ = /^[^{]+\{\s*\[native \w/, _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ab = /[+~]/, bb = /'|\\/g, cb = new RegExp("\\\\([\\da-f]{1,6}" + L + "?|(" + L + ")|.)", "ig"), db = function (a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
        }, eb = function () {
            m()
        };
        try {
            H.apply(E = I.call(v.childNodes), v.childNodes), E[v.childNodes.length].nodeType
        } catch (fb) {
            H = {
                apply: E.length ? function (a, b) {
                    G.apply(a, I.call(b))
                } : function (a, b) {
                    var c = a.length, d = 0;
                    while (a[c++] = b[d++]) {
                    }
                    a.length = c - 1
                }
            }
        }
        function gb(a, b, d, e) {
            var f, h, j, k, l, o, r, s, w, x;
            if ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, d = d || [], k = b.nodeType, "string" != typeof a || !a || 1 !== k && 9 !== k && 11 !== k) {
                return d
            }
            if (!e && p) {
                if (11 !== k && (f = _.exec(a))) {
                    if (j = f[1]) {
                        if (9 === k) {
                            if (h = b.getElementById(j), !h || !h.parentNode) {
                                return d
                            }
                            if (h.id === j) {
                                return d.push(h), d
                            }
                        } else {
                            if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j) {
                                return d.push(h), d
                            }
                        }
                    } else {
                        if (f[2]) {
                            return H.apply(d, b.getElementsByTagName(a)), d
                        }
                        if ((j = f[3]) && c.getElementsByClassName) {
                            return H.apply(d, b.getElementsByClassName(j)), d
                        }
                    }
                }
                if (c.qsa && (!q || !q.test(a))) {
                    if (s = r = u, w = b, x = 1 !== k && a, 1 === k && "object" !== b.nodeName.toLowerCase()) {
                        o = g(a), (r = b.getAttribute("id")) ? s = r.replace(bb, "\\$&") : b.setAttribute("id", s), s = "[id='" + s + "'] ", l = o.length;
                        while (l--) {
                            o[l] = s + rb(o[l])
                        }
                        w = ab.test(a) && pb(b.parentNode) || b, x = o.join(",")
                    }
                    if (x) {
                        try {
                            return H.apply(d, w.querySelectorAll(x)), d
                        } catch (y) {
                        } finally {
                            r || b.removeAttribute("id")
                        }
                    }
                }
            }
            return i(a.replace(R, "$1"), b, d, e)
        }

        function hb() {
            var a = [];

            function b(c, e) {
                return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e
            }

            return b
        }

        function ib(a) {
            return a[u] = !0, a
        }

        function jb(a) {
            var b = n.createElement("div");
            try {
                return !!a(b)
            } catch (c) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b), b = null
            }
        }

        function kb(a, b) {
            var c = a.split("|"), e = a.length;
            while (e--) {
                d.attrHandle[c[e]] = b
            }
        }

        function lb(a, b) {
            var c = b && a, d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || C) - (~a.sourceIndex || C);
            if (d) {
                return d
            }
            if (c) {
                while (c = c.nextSibling) {
                    if (c === b) {
                        return -1
                    }
                }
            }
            return a ? 1 : -1
        }

        function mb(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }

        function nb(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }

        function ob(a) {
            return ib(function (b) {
                return b = +b, ib(function (c, d) {
                    var e, f = a([], c.length, b), g = f.length;
                    while (g--) {
                        c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                    }
                })
            })
        }

        function pb(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }

        c = gb.support = {}, f = gb.isXML = function (a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return b ? "HTML" !== b.nodeName : !1
        }, m = gb.setDocument = function (a) {
            var b, e, g = a ? a.ownerDocument || a : v;
            return g !== n && 9 === g.nodeType && g.documentElement ? (n = g, o = g.documentElement, e = g.defaultView, e && e !== e.top && (e.addEventListener ? e.addEventListener("unload", eb, !1) : e.attachEvent && e.attachEvent("onunload", eb)), p = !f(g), c.attributes = jb(function (a) {
                return a.className = "i", !a.getAttribute("className")
            }), c.getElementsByTagName = jb(function (a) {
                return a.appendChild(g.createComment("")), !a.getElementsByTagName("*").length
            }), c.getElementsByClassName = $.test(g.getElementsByClassName), c.getById = jb(function (a) {
                return o.appendChild(a).id = u, !g.getElementsByName || !g.getElementsByName(u).length
            }), c.getById ? (d.find.ID = function (a, b) {
                if ("undefined" != typeof b.getElementById && p) {
                    var c = b.getElementById(a);
                    return c && c.parentNode ? [c] : []
                }
            }, d.filter.ID = function (a) {
                var b = a.replace(cb, db);
                return function (a) {
                    return a.getAttribute("id") === b
                }
            }) : (delete d.find.ID, d.filter.ID = function (a) {
                var b = a.replace(cb, db);
                return function (a) {
                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b
                }
            }), d.find.TAG = c.getElementsByTagName ? function (a, b) {
                return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0
            } : function (a, b) {
                var c, d = [], e = 0, f = b.getElementsByTagName(a);
                if ("*" === a) {
                    while (c = f[e++]) {
                        1 === c.nodeType && d.push(c)
                    }
                    return d
                }
                return f
            }, d.find.CLASS = c.getElementsByClassName && function (a, b) {
                    return p ? b.getElementsByClassName(a) : void 0
                }, r = [], q = [], (c.qsa = $.test(g.querySelectorAll)) && (jb(function (a) {
                o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\f]' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + L + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + L + "*(?:value|" + K + ")"), a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="), a.querySelectorAll(":checked").length || q.push(":checked"), a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]")
            }), jb(function (a) {
                var b = g.createElement("input");
                b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + L + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:")
            })), (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && jb(function (a) {
                c.disconnectedMatch = s.call(a, "div"), s.call(a, "[s!='']:x"), r.push("!=", P)
            }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = $.test(o.compareDocumentPosition), t = b || $.test(o.contains) ? function (a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            } : function (a, b) {
                if (b) {
                    while (b = b.parentNode) {
                        if (b === a) {
                            return !0
                        }
                    }
                }
                return !1
            }, B = b ? function (a, b) {
                if (a === b) {
                    return l = !0, 0
                }
                var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === g || a.ownerDocument === v && t(v, a) ? -1 : b === g || b.ownerDocument === v && t(v, b) ? 1 : k ? J(k, a) - J(k, b) : 0 : 4 & d ? -1 : 1)
            } : function (a, b) {
                if (a === b) {
                    return l = !0, 0
                }
                var c, d = 0, e = a.parentNode, f = b.parentNode, h = [a], i = [b];
                if (!e || !f) {
                    return a === g ? -1 : b === g ? 1 : e ? -1 : f ? 1 : k ? J(k, a) - J(k, b) : 0
                }
                if (e === f) {
                    return lb(a, b)
                }
                c = a;
                while (c = c.parentNode) {
                    h.unshift(c)
                }
                c = b;
                while (c = c.parentNode) {
                    i.unshift(c)
                }
                while (h[d] === i[d]) {
                    d++
                }
                return d ? lb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0
            }, g) : n
        }, gb.matches = function (a, b) {
            return gb(a, null, null, b)
        }, gb.matchesSelector = function (a, b) {
            if ((a.ownerDocument || a) !== n && m(a), b = b.replace(U, "='$1']"), !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b))) {
                try {
                    var d = s.call(a, b);
                    if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) {
                        return d
                    }
                } catch (e) {
                }
            }
            return gb(b, n, null, [a]).length > 0
        }, gb.contains = function (a, b) {
            return (a.ownerDocument || a) !== n && m(a), t(a, b)
        }, gb.attr = function (a, b) {
            (a.ownerDocument || a) !== n && m(a);
            var e = d.attrHandle[b.toLowerCase()], f = e && D.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
            return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
        }, gb.error = function (a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }, gb.uniqueSort = function (a) {
            var b, d = [], e = 0, f = 0;
            if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) {
                while (b = a[f++]) {
                    b === a[f] && (e = d.push(f))
                }
                while (e--) {
                    a.splice(d[e], 1)
                }
            }
            return k = null, a
        }, e = gb.getText = function (a) {
            var b, c = "", d = 0, f = a.nodeType;
            if (f) {
                if (1 === f || 9 === f || 11 === f) {
                    if ("string" == typeof a.textContent) {
                        return a.textContent
                    }
                    for (a = a.firstChild; a; a = a.nextSibling) {
                        c += e(a)
                    }
                } else {
                    if (3 === f || 4 === f) {
                        return a.nodeValue
                    }
                }
            } else {
                while (b = a[d++]) {
                    c += e(b)
                }
            }
            return c
        }, d = gb.selectors = {
            cacheLength: 50,
            createPseudo: ib,
            match: X,
            attrHandle: {},
            find: {},
            relative: {
                ">": {dir: "parentNode", first: !0},
                " ": {dir: "parentNode"},
                "+": {dir: "previousSibling", first: !0},
                "~": {dir: "previousSibling"}
            },
            preFilter: {
                ATTR: function (a) {
                    return a[1] = a[1].replace(cb, db), a[3] = (a[3] || a[4] || a[5] || "").replace(cb, db), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                }, CHILD: function (a) {
                    return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || gb.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && gb.error(a[0]), a
                }, PSEUDO: function (a) {
                    var b, c = !a[6] && a[2];
                    return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
                }
            },
            filter: {
                TAG: function (a) {
                    var b = a.replace(cb, db).toLowerCase();
                    return "*" === a ? function () {
                        return !0
                    } : function (a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b
                    }
                }, CLASS: function (a) {
                    var b = y[a + " "];
                    return b || (b = new RegExp("(^|" + L + ")" + a + "(" + L + "|$)")) && y(a, function (a) {
                            return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                        })
                }, ATTR: function (a, b, c) {
                    return function (d) {
                        var e = gb.attr(d, a);
                        return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(Q, " ") + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
                    }
                }, CHILD: function (a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3), g = "last" !== a.slice(-4), h = "of-type" === b;
                    return 1 === d && 0 === e ? function (a) {
                        return !!a.parentNode
                    } : function (b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h;
                        if (q) {
                            if (f) {
                                while (p) {
                                    l = b;
                                    while (l = l[p]) {
                                        if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) {
                                            return !1
                                        }
                                    }
                                    o = p = "only" === a && !o && "nextSibling"
                                }
                                return !0
                            }
                            if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                k = q[u] || (q[u] = {}), j = k[a] || [], n = j[0] === w && j[1], m = j[0] === w && j[2], l = n && q.childNodes[n];
                                while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) {
                                    if (1 === l.nodeType && ++m && l === b) {
                                        k[a] = [w, n, m];
                                        break
                                    }
                                }
                            } else {
                                if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w) {
                                    m = j[1]
                                } else {
                                    while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) {
                                        if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]), l === b)) {
                                            break
                                        }
                                    }
                                }
                            }
                            return m -= e, m === d || m % d === 0 && m / d >= 0
                        }
                    }
                }, PSEUDO: function (a, b) {
                    var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || gb.error("unsupported pseudo: " + a);
                    return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? ib(function (a, c) {
                        var d, f = e(a, b), g = f.length;
                        while (g--) {
                            d = J(a, f[g]), a[d] = !(c[d] = f[g])
                        }
                    }) : function (a) {
                        return e(a, 0, c)
                    }) : e
                }
            },
            pseudos: {
                not: ib(function (a) {
                    var b = [], c = [], d = h(a.replace(R, "$1"));
                    return d[u] ? ib(function (a, b, c, e) {
                        var f, g = d(a, null, e, []), h = a.length;
                        while (h--) {
                            (f = g[h]) && (a[h] = !(b[h] = f))
                        }
                    }) : function (a, e, f) {
                        return b[0] = a, d(b, null, f, c), b[0] = null, !c.pop()
                    }
                }), has: ib(function (a) {
                    return function (b) {
                        return gb(a, b).length > 0
                    }
                }), contains: ib(function (a) {
                    return a = a.replace(cb, db), function (b) {
                        return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
                    }
                }), lang: ib(function (a) {
                    return W.test(a || "") || gb.error("unsupported lang: " + a), a = a.replace(cb, db).toLowerCase(), function (b) {
                        var c;
                        do {
                            if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) {
                                return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-")
                            }
                        } while ((b = b.parentNode) && 1 === b.nodeType);
                        return !1
                    }
                }), target: function (b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id
                }, root: function (a) {
                    return a === o
                }, focus: function (a) {
                    return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                }, enabled: function (a) {
                    return a.disabled === !1
                }, disabled: function (a) {
                    return a.disabled === !0
                }, checked: function (a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected
                }, selected: function (a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                }, empty: function (a) {
                    for (a = a.firstChild; a; a = a.nextSibling) {
                        if (a.nodeType < 6) {
                            return !1
                        }
                    }
                    return !0
                }, parent: function (a) {
                    return !d.pseudos.empty(a)
                }, header: function (a) {
                    return Z.test(a.nodeName)
                }, input: function (a) {
                    return Y.test(a.nodeName)
                }, button: function (a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                }, text: function (a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                }, first: ob(function () {
                    return [0]
                }), last: ob(function (a, b) {
                    return [b - 1]
                }), eq: ob(function (a, b, c) {
                    return [0 > c ? c + b : c]
                }), even: ob(function (a, b) {
                    for (var c = 0; b > c; c += 2) {
                        a.push(c)
                    }
                    return a
                }), odd: ob(function (a, b) {
                    for (var c = 1; b > c; c += 2) {
                        a.push(c)
                    }
                    return a
                }), lt: ob(function (a, b, c) {
                    for (var d = 0 > c ? c + b : c; --d >= 0;) {
                        a.push(d)
                    }
                    return a
                }), gt: ob(function (a, b, c) {
                    for (var d = 0 > c ? c + b : c; ++d < b;) {
                        a.push(d)
                    }
                    return a
                })
            }
        }, d.pseudos.nth = d.pseudos.eq;
        for (b in {radio: !0, checkbox: !0, file: !0, password: !0, image: !0}) {
            d.pseudos[b] = mb(b)
        }
        for (b in {submit: !0, reset: !0}) {
            d.pseudos[b] = nb(b)
        }
        function qb() {
        }

        qb.prototype = d.filters = d.pseudos, d.setFilters = new qb, g = gb.tokenize = function (a, b) {
            var c, e, f, g, h, i, j, k = z[a + " "];
            if (k) {
                return b ? 0 : k.slice(0)
            }
            h = a, i = [], j = d.preFilter;
            while (h) {
                (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = T.exec(h)) && (c = e.shift(), f.push({
                    value: c,
                    type: e[0].replace(R, " ")
                }), h = h.slice(c.length));
                for (g in d.filter) {
                    !(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({
                        value: c,
                        type: g,
                        matches: e
                    }), h = h.slice(c.length))
                }
                if (!c) {
                    break
                }
            }
            return b ? h.length : h ? gb.error(a) : z(a, i).slice(0)
        };
        function rb(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++) {
                d += a[b].value
            }
            return d
        }

        function sb(a, b, c) {
            var d = b.dir, e = c && "parentNode" === d, f = x++;
            return b.first ? function (b, c, f) {
                while (b = b[d]) {
                    if (1 === b.nodeType || e) {
                        return a(b, c, f)
                    }
                }
            } : function (b, c, g) {
                var h, i, j = [w, f];
                if (g) {
                    while (b = b[d]) {
                        if ((1 === b.nodeType || e) && a(b, c, g)) {
                            return !0
                        }
                    }
                } else {
                    while (b = b[d]) {
                        if (1 === b.nodeType || e) {
                            if (i = b[u] || (b[u] = {}), (h = i[d]) && h[0] === w && h[1] === f) {
                                return j[2] = h[2]
                            }
                            if (i[d] = j, j[2] = a(b, c, g)) {
                                return !0
                            }
                        }
                    }
                }
            }
        }

        function tb(a) {
            return a.length > 1 ? function (b, c, d) {
                var e = a.length;
                while (e--) {
                    if (!a[e](b, c, d)) {
                        return !1
                    }
                }
                return !0
            } : a[0]
        }

        function ub(a, b, c) {
            for (var d = 0, e = b.length; e > d; d++) {
                gb(a, b[d], c)
            }
            return c
        }

        function vb(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++) {
                (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h))
            }
            return g
        }

        function wb(a, b, c, d, e, f) {
            return d && !d[u] && (d = wb(d)), e && !e[u] && (e = wb(e, f)), ib(function (f, g, h, i) {
                var j, k, l, m = [], n = [], o = g.length, p = f || ub(b || "*", h.nodeType ? [h] : h, []), q = !a || !f && b ? p : vb(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q;
                if (c && c(q, r, h, i), d) {
                    j = vb(r, n), d(j, [], h, i), k = j.length;
                    while (k--) {
                        (l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
                    }
                }
                if (f) {
                    if (e || a) {
                        if (e) {
                            j = [], k = r.length;
                            while (k--) {
                                (l = r[k]) && j.push(q[k] = l)
                            }
                            e(null, r = [], j, i)
                        }
                        k = r.length;
                        while (k--) {
                            (l = r[k]) && (j = e ? J(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                        }
                    }
                } else {
                    r = vb(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : H.apply(g, r)
                }
            })
        }

        function xb(a) {
            for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = sb(function (a) {
                return a === b
            }, h, !0), l = sb(function (a) {
                return J(b, a) > -1
            }, h, !0), m = [function (a, c, d) {
                var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
                return b = null, e
            }]; f > i; i++) {
                if (c = d.relative[a[i].type]) {
                    m = [sb(tb(m), c)]
                } else {
                    if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) {
                        for (e = ++i; f > e; e++) {
                            if (d.relative[a[e].type]) {
                                break
                            }
                        }
                        return wb(i > 1 && tb(m), i > 1 && rb(a.slice(0, i - 1).concat({value: " " === a[i - 2].type ? "*" : ""})).replace(R, "$1"), c, e > i && xb(a.slice(i, e)), f > e && xb(a = a.slice(e)), f > e && rb(a))
                    }
                    m.push(c)
                }
            }
            return tb(m)
        }

        function yb(a, b) {
            var c = b.length > 0, e = a.length > 0, f = function (f, g, h, i, k) {
                var l, m, o, p = 0, q = "0", r = f && [], s = [], t = j, u = f || e && d.find.TAG("*", k), v = w += null == t ? 1 : Math.random() || 0.1, x = u.length;
                for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) {
                    if (e && l) {
                        m = 0;
                        while (o = a[m++]) {
                            if (o(l, g, h)) {
                                i.push(l);
                                break
                            }
                        }
                        k && (w = v)
                    }
                    c && ((l = !o && l) && p--, f && r.push(l))
                }
                if (p += q, c && q !== p) {
                    m = 0;
                    while (o = b[m++]) {
                        o(r, s, g, h)
                    }
                    if (f) {
                        if (p > 0) {
                            while (q--) {
                                r[q] || s[q] || (s[q] = F.call(i))
                            }
                        }
                        s = vb(s)
                    }
                    H.apply(i, s), k && !f && s.length > 0 && p + b.length > 1 && gb.uniqueSort(i)
                }
                return k && (w = v, j = t), r
            };
            return c ? ib(f) : f
        }

        return h = gb.compile = function (a, b) {
            var c, d = [], e = [], f = A[a + " "];
            if (!f) {
                b || (b = g(a)), c = b.length;
                while (c--) {
                    f = xb(b[c]), f[u] ? d.push(f) : e.push(f)
                }
                f = A(a, yb(e, d)), f.selector = a
            }
            return f
        }, i = gb.select = function (a, b, e, f) {
            var i, j, k, l, m, n = "function" == typeof a && a, o = !f && g(a = n.selector || a);
            if (e = e || [], 1 === o.length) {
                if (j = o[0] = o[0].slice(0), j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) {
                    if (b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0], !b) {
                        return e
                    }
                    n && (b = b.parentNode), a = a.slice(j.shift().value.length)
                }
                i = X.needsContext.test(a) ? 0 : j.length;
                while (i--) {
                    if (k = j[i], d.relative[l = k.type]) {
                        break
                    }
                    if ((m = d.find[l]) && (f = m(k.matches[0].replace(cb, db), ab.test(j[0].type) && pb(b.parentNode) || b))) {
                        if (j.splice(i, 1), a = f.length && rb(j), !a) {
                            return H.apply(e, f), e
                        }
                        break
                    }
                }
            }
            return (n || h(a, o))(f, b, !p, e, ab.test(a) && pb(b.parentNode) || b), e
        }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = jb(function (a) {
            return 1 & a.compareDocumentPosition(n.createElement("div"))
        }), jb(function (a) {
            return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
        }) || kb("type|href|height|width", function (a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }), c.attributes && jb(function (a) {
            return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
        }) || kb("value", function (a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
        }), jb(function (a) {
            return null == a.getAttribute("disabled")
        }) || kb(K, function (a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }), gb
    }(a);
    n.find = t, n.expr = t.selectors, n.expr[":"] = n.expr.pseudos, n.unique = t.uniqueSort, n.text = t.getText, n.isXMLDoc = t.isXML, n.contains = t.contains;
    var u = n.expr.match.needsContext, v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, w = /^.[^:#\[\.,]*$/;

    function x(a, b, c) {
        if (n.isFunction(b)) {
            return n.grep(a, function (a, d) {
                return !!b.call(a, d, a) !== c
            })
        }
        if (b.nodeType) {
            return n.grep(a, function (a) {
                return a === b !== c
            })
        }
        if ("string" == typeof b) {
            if (w.test(b)) {
                return n.filter(b, a, c)
            }
            b = n.filter(b, a)
        }
        return n.grep(a, function (a) {
            return g.call(b, a) >= 0 !== c
        })
    }

    n.filter = function (a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [d] : [] : n.find.matches(a, n.grep(b, function (a) {
            return 1 === a.nodeType
        }))
    }, n.fn.extend({
        find: function (a) {
            var b, c = this.length, d = [], e = this;
            if ("string" != typeof a) {
                return this.pushStack(n(a).filter(function () {
                    for (b = 0; c > b; b++) {
                        if (n.contains(e[b], this)) {
                            return !0
                        }
                    }
                }))
            }
            for (b = 0; c > b; b++) {
                n.find(a, e[b], d)
            }
            return d = this.pushStack(c > 1 ? n.unique(d) : d), d.selector = this.selector ? this.selector + " " + a : a, d
        }, filter: function (a) {
            return this.pushStack(x(this, a || [], !1))
        }, not: function (a) {
            return this.pushStack(x(this, a || [], !0))
        }, is: function (a) {
            return !!x(this, "string" == typeof a && u.test(a) ? n(a) : a || [], !1).length
        }
    });
    var y, z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, A = n.fn.init = function (a, b) {
        var c, d;
        if (!a) {
            return this
        }
        if ("string" == typeof a) {
            if (c = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : z.exec(a), !c || !c[1] && b) {
                return !b || b.jquery ? (b || y).find(a) : this.constructor(b).find(a)
            }
            if (c[1]) {
                if (b = b instanceof n ? b[0] : b, n.merge(this, n.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : l, !0)), v.test(c[1]) && n.isPlainObject(b)) {
                    for (c in b) {
                        n.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c])
                    }
                }
                return this
            }
            return d = l.getElementById(c[2]), d && d.parentNode && (this.length = 1, this[0] = d), this.context = l, this.selector = a, this
        }
        return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : n.isFunction(a) ? "undefined" != typeof y.ready ? y.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), n.makeArray(a, this))
    };
    A.prototype = n.fn, y = n(l);
    var B = /^(?:parents|prev(?:Until|All))/, C = {children: !0, contents: !0, next: !0, prev: !0};
    n.extend({
        dir: function (a, b, c) {
            var d = [], e = void 0 !== c;
            while ((a = a[b]) && 9 !== a.nodeType) {
                if (1 === a.nodeType) {
                    if (e && n(a).is(c)) {
                        break
                    }
                    d.push(a)
                }
            }
            return d
        }, sibling: function (a, b) {
            for (var c = []; a; a = a.nextSibling) {
                1 === a.nodeType && a !== b && c.push(a)
            }
            return c
        }
    }), n.fn.extend({
        has: function (a) {
            var b = n(a, this), c = b.length;
            return this.filter(function () {
                for (var a = 0; c > a; a++) {
                    if (n.contains(this, b[a])) {
                        return !0
                    }
                }
            })
        }, closest: function (a, b) {
            for (var c, d = 0, e = this.length, f = [], g = u.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++) {
                for (c = this[d]; c && c !== b; c = c.parentNode) {
                    if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) {
                        f.push(c);
                        break
                    }
                }
            }
            return this.pushStack(f.length > 1 ? n.unique(f) : f)
        }, index: function (a) {
            return a ? "string" == typeof a ? g.call(n(a), this[0]) : g.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        }, add: function (a, b) {
            return this.pushStack(n.unique(n.merge(this.get(), n(a, b))))
        }, addBack: function (a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    });
    function D(a, b) {
        while ((a = a[b]) && 1 !== a.nodeType) {
        }
        return a
    }

    n.each({
        parent: function (a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        }, parents: function (a) {
            return n.dir(a, "parentNode")
        }, parentsUntil: function (a, b, c) {
            return n.dir(a, "parentNode", c)
        }, next: function (a) {
            return D(a, "nextSibling")
        }, prev: function (a) {
            return D(a, "previousSibling")
        }, nextAll: function (a) {
            return n.dir(a, "nextSibling")
        }, prevAll: function (a) {
            return n.dir(a, "previousSibling")
        }, nextUntil: function (a, b, c) {
            return n.dir(a, "nextSibling", c)
        }, prevUntil: function (a, b, c) {
            return n.dir(a, "previousSibling", c)
        }, siblings: function (a) {
            return n.sibling((a.parentNode || {}).firstChild, a)
        }, children: function (a) {
            return n.sibling(a.firstChild)
        }, contents: function (a) {
            return a.contentDocument || n.merge([], a.childNodes)
        }
    }, function (a, b) {
        n.fn[a] = function (c, d) {
            var e = n.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = n.filter(d, e)), this.length > 1 && (C[a] || n.unique(e), B.test(a) && e.reverse()), this.pushStack(e)
        }
    });
    var E = /\S+/g, F = {};

    function G(a) {
        var b = F[a] = {};
        return n.each(a.match(E) || [], function (a, c) {
            b[c] = !0
        }), b
    }

    n.Callbacks = function (a) {
        a = "string" == typeof a ? F[a] || G(a) : n.extend({}, a);
        var b, c, d, e, f, g, h = [], i = !a.once && [], j = function (l) {
            for (b = a.memory && l, c = !0, g = e || 0, e = 0, f = h.length, d = !0; h && f > g; g++) {
                if (h[g].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
                    b = !1;
                    break
                }
            }
            d = !1, h && (i ? i.length && j(i.shift()) : b ? h = [] : k.disable())
        }, k = {
            add: function () {
                if (h) {
                    var c = h.length;
                    !function g(b) {
                        n.each(b, function (b, c) {
                            var d = n.type(c);
                            "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && g(c)
                        })
                    }(arguments), d ? f = h.length : b && (e = c, j(b))
                }
                return this
            }, remove: function () {
                return h && n.each(arguments, function (a, b) {
                    var c;
                    while ((c = n.inArray(b, h, c)) > -1) {
                        h.splice(c, 1), d && (f >= c && f--, g >= c && g--)
                    }
                }), this
            }, has: function (a) {
                return a ? n.inArray(a, h) > -1 : !(!h || !h.length)
            }, empty: function () {
                return h = [], f = 0, this
            }, disable: function () {
                return h = i = b = void 0, this
            }, disabled: function () {
                return !h
            }, lock: function () {
                return i = void 0, b || k.disable(), this
            }, locked: function () {
                return !i
            }, fireWith: function (a, b) {
                return !h || c && !i || (b = b || [], b = [a, b.slice ? b.slice() : b], d ? i.push(b) : j(b)), this
            }, fire: function () {
                return k.fireWith(this, arguments), this
            }, fired: function () {
                return !!c
            }
        };
        return k
    }, n.extend({
        Deferred: function (a) {
            var b = [["resolve", "done", n.Callbacks("once memory"), "resolved"], ["reject", "fail", n.Callbacks("once memory"), "rejected"], ["notify", "progress", n.Callbacks("memory")]], c = "pending", d = {
                state: function () {
                    return c
                }, always: function () {
                    return e.done(arguments).fail(arguments), this
                }, then: function () {
                    var a = arguments;
                    return n.Deferred(function (c) {
                        n.each(b, function (b, f) {
                            var g = n.isFunction(a[b]) && a[b];
                            e[f[1]](function () {
                                var a = g && g.apply(this, arguments);
                                a && n.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                            })
                        }), a = null
                    }).promise()
                }, promise: function (a) {
                    return null != a ? n.extend(a, d) : d
                }
            }, e = {};
            return d.pipe = d.then, n.each(b, function (a, f) {
                var g = f[2], h = f[3];
                d[f[1]] = g.add, h && g.add(function () {
                    c = h
                }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function () {
                    return e[f[0] + "With"](this === e ? d : this, arguments), this
                }, e[f[0] + "With"] = g.fireWith
            }), d.promise(e), a && a.call(e, e), e
        }, when: function (a) {
            var b = 0, c = d.call(arguments), e = c.length, f = 1 !== e || a && n.isFunction(a.promise) ? e : 0, g = 1 === f ? a : n.Deferred(), h = function (a, b, c) {
                return function (e) {
                    b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
                }
            }, i, j, k;
            if (e > 1) {
                for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++) {
                    c[b] && n.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f
                }
            }
            return f || g.resolveWith(k, c), g.promise()
        }
    });
    var H;
    n.fn.ready = function (a) {
        return n.ready.promise().done(a), this
    }, n.extend({
        isReady: !1, readyWait: 1, holdReady: function (a) {
            a ? n.readyWait++ : n.ready(!0)
        }, ready: function (a) {
            (a === !0 ? --n.readyWait : n.isReady) || (n.isReady = !0, a !== !0 && --n.readyWait > 0 || (H.resolveWith(l, [n]), n.fn.triggerHandler && (n(l).triggerHandler("ready"), n(l).off("ready"))))
        }
    });
    function I() {
        l.removeEventListener("DOMContentLoaded", I, !1), a.removeEventListener("load", I, !1), n.ready()
    }

    n.ready.promise = function (b) {
        return H || (H = n.Deferred(), "complete" === l.readyState ? setTimeout(n.ready) : (l.addEventListener("DOMContentLoaded", I, !1), a.addEventListener("load", I, !1))), H.promise(b)
    }, n.ready.promise();
    var J = n.access = function (a, b, c, d, e, f, g) {
        var h = 0, i = a.length, j = null == c;
        if ("object" === n.type(c)) {
            e = !0;
            for (h in c) {
                n.access(a, b, h, c[h], !0, f, g)
            }
        } else {
            if (void 0 !== d && (e = !0, n.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function (a, b, c) {
                    return j.call(n(a), c)
                })), b)) {
                for (; i > h; h++) {
                    b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)))
                }
            }
        }
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
    };
    n.acceptData = function (a) {
        return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType
    };
    function K() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function () {
                return {}
            }
        }), this.expando = n.expando + K.uid++
    }

    K.uid = 1, K.accepts = n.acceptData, K.prototype = {
        key: function (a) {
            if (!K.accepts(a)) {
                return 0
            }
            var b = {}, c = a[this.expando];
            if (!c) {
                c = K.uid++;
                try {
                    b[this.expando] = {value: c}, Object.defineProperties(a, b)
                } catch (d) {
                    b[this.expando] = c, n.extend(a, b)
                }
            }
            return this.cache[c] || (this.cache[c] = {}), c
        }, set: function (a, b, c) {
            var d, e = this.key(a), f = this.cache[e];
            if ("string" == typeof b) {
                f[b] = c
            } else {
                if (n.isEmptyObject(f)) {
                    n.extend(this.cache[e], b)
                } else {
                    for (d in b) {
                        f[d] = b[d]
                    }
                }
            }
            return f
        }, get: function (a, b) {
            var c = this.cache[this.key(a)];
            return void 0 === b ? c : c[b]
        }, access: function (a, b, c) {
            var d;
            return void 0 === b || b && "string" == typeof b && void 0 === c ? (d = this.get(a, b), void 0 !== d ? d : this.get(a, n.camelCase(b))) : (this.set(a, b, c), void 0 !== c ? c : b)
        }, remove: function (a, b) {
            var c, d, e, f = this.key(a), g = this.cache[f];
            if (void 0 === b) {
                this.cache[f] = {}
            } else {
                n.isArray(b) ? d = b.concat(b.map(n.camelCase)) : (e = n.camelCase(b), b in g ? d = [b, e] : (d = e, d = d in g ? [d] : d.match(E) || [])), c = d.length;
                while (c--) {
                    delete g[d[c]]
                }
            }
        }, hasData: function (a) {
            return !n.isEmptyObject(this.cache[a[this.expando]] || {})
        }, discard: function (a) {
            a[this.expando] && delete this.cache[a[this.expando]]
        }
    };
    var L = new K, M = new K, N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, O = /([A-Z])/g;

    function P(a, b, c) {
        var d;
        if (void 0 === c && 1 === a.nodeType) {
            if (d = "data-" + b.replace(O, "-$1").toLowerCase(), c = a.getAttribute(d), "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c
                } catch (e) {
                }
                M.set(a, b, c)
            } else {
                c = void 0
            }
        }
        return c
    }

    n.extend({
        hasData: function (a) {
            return M.hasData(a) || L.hasData(a)
        }, data: function (a, b, c) {
            return M.access(a, b, c)
        }, removeData: function (a, b) {
            M.remove(a, b)
        }, _data: function (a, b, c) {
            return L.access(a, b, c)
        }, _removeData: function (a, b) {
            L.remove(a, b)
        }
    }), n.fn.extend({
        data: function (a, b) {
            var c, d, e, f = this[0], g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = M.get(f), 1 === f.nodeType && !L.get(f, "hasDataAttrs"))) {
                    c = g.length;
                    while (c--) {
                        g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)), P(f, d, e[d])))
                    }
                    L.set(f, "hasDataAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function () {
                M.set(this, a)
            }) : J(this, function (b) {
                var c, d = n.camelCase(a);
                if (f && void 0 === b) {
                    if (c = M.get(f, a), void 0 !== c) {
                        return c
                    }
                    if (c = M.get(f, d), void 0 !== c) {
                        return c
                    }
                    if (c = P(f, d, void 0), void 0 !== c) {
                        return c
                    }
                } else {
                    this.each(function () {
                        var c = M.get(this, d);
                        M.set(this, d, b), -1 !== a.indexOf("-") && void 0 !== c && M.set(this, a, b)
                    })
                }
            }, null, b, arguments.length > 1, null, !0)
        }, removeData: function (a) {
            return this.each(function () {
                M.remove(this, a)
            })
        }
    }), n.extend({
        queue: function (a, b, c) {
            var d;
            return a ? (b = (b || "fx") + "queue", d = L.get(a, b), c && (!d || n.isArray(c) ? d = L.access(a, b, n.makeArray(c)) : d.push(c)), d || []) : void 0
        }, dequeue: function (a, b) {
            b = b || "fx";
            var c = n.queue(a, b), d = c.length, e = c.shift(), f = n._queueHooks(a, b), g = function () {
                n.dequeue(a, b)
            };
            "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
        }, _queueHooks: function (a, b) {
            var c = b + "queueHooks";
            return L.get(a, c) || L.access(a, c, {
                    empty: n.Callbacks("once memory").add(function () {
                        L.remove(a, [b + "queue", c])
                    })
                })
        }
    }), n.fn.extend({
        queue: function (a, b) {
            var c = 2;
            return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function () {
                var c = n.queue(this, a, b);
                n._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && n.dequeue(this, a)
            })
        }, dequeue: function (a) {
            return this.each(function () {
                n.dequeue(this, a)
            })
        }, clearQueue: function (a) {
            return this.queue(a || "fx", [])
        }, promise: function (a, b) {
            var c, d = 1, e = n.Deferred(), f = this, g = this.length, h = function () {
                --d || e.resolveWith(f, [f])
            };
            "string" != typeof a && (b = a, a = void 0), a = a || "fx";
            while (g--) {
                c = L.get(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h))
            }
            return h(), e.promise(b)
        }
    });
    var Q = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, R = ["Top", "Right", "Bottom", "Left"], S = function (a, b) {
        return a = b || a, "none" === n.css(a, "display") || !n.contains(a.ownerDocument, a)
    }, T = /^(?:checkbox|radio)$/i;
    !function () {
        var a = l.createDocumentFragment(), b = a.appendChild(l.createElement("div")), c = l.createElement("input");
        c.setAttribute("type", "radio"), c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), b.appendChild(c), k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, b.innerHTML = "<textarea>x</textarea>", k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue
    }();
    var U = "undefined";
    k.focusinBubbles = "onfocusin" in a;
    var V = /^key/, W = /^(?:mouse|pointer|contextmenu)|click/, X = /^(?:focusinfocus|focusoutblur)$/, Y = /^([^.]*)(?:\.(.+)|)$/;

    function Z() {
        return !0
    }

    function $() {
        return !1
    }

    function _() {
        try {
            return l.activeElement
        } catch (a) {
        }
    }

    n.event = {
        global: {},
        add: function (a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, o, p, q, r = L.get(a);
            if (r) {
                c.handler && (f = c, c = f.handler, e = f.selector), c.guid || (c.guid = n.guid++), (i = r.events) || (i = r.events = {}), (g = r.handle) || (g = r.handle = function (b) {
                    return typeof n !== U && n.event.triggered !== b.type ? n.event.dispatch.apply(a, arguments) : void 0
                }), b = (b || "").match(E) || [""], j = b.length;
                while (j--) {
                    h = Y.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o && (l = n.event.special[o] || {}, o = (e ? l.delegateType : l.bindType) || o, l = n.event.special[o] || {}, k = n.extend({
                        type: o,
                        origType: q,
                        data: d,
                        handler: c,
                        guid: c.guid,
                        selector: e,
                        needsContext: e && n.expr.match.needsContext.test(e),
                        namespace: p.join(".")
                    }, f), (m = i[o]) || (m = i[o] = [], m.delegateCount = 0, l.setup && l.setup.call(a, d, p, g) !== !1 || a.addEventListener && a.addEventListener(o, g, !1)), l.add && (l.add.call(a, k), k.handler.guid || (k.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, k) : m.push(k), n.event.global[o] = !0)
                }
            }
        },
        remove: function (a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, o, p, q, r = L.hasData(a) && L.get(a);
            if (r && (i = r.events)) {
                b = (b || "").match(E) || [""], j = b.length;
                while (j--) {
                    if (h = Y.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
                        l = n.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, m = i[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length;
                        while (f--) {
                            k = m[f], !e && q !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k))
                        }
                        g && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle), delete i[o])
                    } else {
                        for (o in i) {
                            n.event.remove(a, o + b[j], c, d, !0)
                        }
                    }
                }
                n.isEmptyObject(i) && (delete r.handle, L.remove(a, "events"))
            }
        },
        trigger: function (b, c, d, e) {
            var f, g, h, i, k, m, o, p = [d || l], q = j.call(b, "type") ? b.type : b, r = j.call(b, "namespace") ? b.namespace.split(".") : [];
            if (g = h = d = d || l, 3 !== d.nodeType && 8 !== d.nodeType && !X.test(q + n.event.triggered) && (q.indexOf(".") >= 0 && (r = q.split("."), q = r.shift(), r.sort()), k = q.indexOf(":") < 0 && "on" + q, b = b[n.expando] ? b : new n.Event(q, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = r.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + r.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : n.makeArray(c, [b]), o = n.event.special[q] || {}, e || !o.trigger || o.trigger.apply(d, c) !== !1)) {
                if (!e && !o.noBubble && !n.isWindow(d)) {
                    for (i = o.delegateType || q, X.test(i + q) || (g = g.parentNode); g; g = g.parentNode) {
                        p.push(g), h = g
                    }
                    h === (d.ownerDocument || l) && p.push(h.defaultView || h.parentWindow || a)
                }
                f = 0;
                while ((g = p[f++]) && !b.isPropagationStopped()) {
                    b.type = f > 1 ? i : o.bindType || q, m = (L.get(g, "events") || {})[b.type] && L.get(g, "handle"), m && m.apply(g, c), m = k && g[k], m && m.apply && n.acceptData(g) && (b.result = m.apply(g, c), b.result === !1 && b.preventDefault())
                }
                return b.type = q, e || b.isDefaultPrevented() || o._default && o._default.apply(p.pop(), c) !== !1 || !n.acceptData(d) || k && n.isFunction(d[q]) && !n.isWindow(d) && (h = d[k], h && (d[k] = null), n.event.triggered = q, d[q](), n.event.triggered = void 0, h && (d[k] = h)), b.result
            }
        },
        dispatch: function (a) {
            a = n.event.fix(a);
            var b, c, e, f, g, h = [], i = d.call(arguments), j = (L.get(this, "events") || {})[a.type] || [], k = n.event.special[a.type] || {};
            if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
                h = n.event.handlers.call(this, a, j), b = 0;
                while ((f = h[b++]) && !a.isPropagationStopped()) {
                    a.currentTarget = f.elem, c = 0;
                    while ((g = f.handlers[c++]) && !a.isImmediatePropagationStopped()) {
                        (!a.namespace_re || a.namespace_re.test(g.namespace)) && (a.handleObj = g, a.data = g.data, e = ((n.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i), void 0 !== e && (a.result = e) === !1 && (a.preventDefault(), a.stopPropagation()))
                    }
                }
                return k.postDispatch && k.postDispatch.call(this, a), a.result
            }
        },
        handlers: function (a, b) {
            var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
            if (h && i.nodeType && (!a.button || "click" !== a.type)) {
                for (; i !== this; i = i.parentNode || this) {
                    if (i.disabled !== !0 || "click" !== a.type) {
                        for (d = [], c = 0; h > c; c++) {
                            f = b[c], e = f.selector + " ", void 0 === d[e] && (d[e] = f.needsContext ? n(e, this).index(i) >= 0 : n.find(e, this, null, [i]).length), d[e] && d.push(f)
                        }
                        d.length && g.push({elem: i, handlers: d})
                    }
                }
            }
            return h < b.length && g.push({elem: this, handlers: b.slice(h)}), g
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "), filter: function (a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (a, b) {
                var c, d, e, f = b.button;
                return null == a.pageX && null != b.clientX && (c = a.target.ownerDocument || l, d = c.documentElement, e = c.body, a.pageX = b.clientX + (d && d.scrollLeft || e && e.scrollLeft || 0) - (d && d.clientLeft || e && e.clientLeft || 0), a.pageY = b.clientY + (d && d.scrollTop || e && e.scrollTop || 0) - (d && d.clientTop || e && e.clientTop || 0)), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
            }
        },
        fix: function (a) {
            if (a[n.expando]) {
                return a
            }
            var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
            g || (this.fixHooks[e] = g = W.test(e) ? this.mouseHooks : V.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new n.Event(f), b = d.length;
            while (b--) {
                c = d[b], a[c] = f[c]
            }
            return a.target || (a.target = l), 3 === a.target.nodeType && (a.target = a.target.parentNode), g.filter ? g.filter(a, f) : a
        },
        special: {
            load: {noBubble: !0}, focus: {
                trigger: function () {
                    return this !== _() && this.focus ? (this.focus(), !1) : void 0
                }, delegateType: "focusin"
            }, blur: {
                trigger: function () {
                    return this === _() && this.blur ? (this.blur(), !1) : void 0
                }, delegateType: "focusout"
            }, click: {
                trigger: function () {
                    return "checkbox" === this.type && this.click && n.nodeName(this, "input") ? (this.click(), !1) : void 0
                }, _default: function (a) {
                    return n.nodeName(a.target, "a")
                }
            }, beforeunload: {
                postDispatch: function (a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function (a, b, c, d) {
            var e = n.extend(new n.Event, c, {type: a, isSimulated: !0, originalEvent: {}});
            d ? n.event.trigger(e, null, b) : n.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
        }
    }, n.removeEvent = function (a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    }, n.Event = function (a, b) {
        return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? Z : $) : this.type = a, b && n.extend(this, b), this.timeStamp = a && a.timeStamp || n.now(), void (this[n.expando] = !0)) : new n.Event(a, b)
    }, n.Event.prototype = {
        isDefaultPrevented: $,
        isPropagationStopped: $,
        isImmediatePropagationStopped: $,
        preventDefault: function () {
            var a = this.originalEvent;
            this.isDefaultPrevented = Z, a && a.preventDefault && a.preventDefault()
        },
        stopPropagation: function () {
            var a = this.originalEvent;
            this.isPropagationStopped = Z, a && a.stopPropagation && a.stopPropagation()
        },
        stopImmediatePropagation: function () {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = Z, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
        }
    }, n.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (a, b) {
        n.event.special[a] = {
            delegateType: b, bindType: b, handle: function (a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj;
                return (!e || e !== d && !n.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
            }
        }
    }), k.focusinBubbles || n.each({focus: "focusin", blur: "focusout"}, function (a, b) {
        var c = function (a) {
            n.event.simulate(b, a.target, n.event.fix(a), !0)
        };
        n.event.special[b] = {
            setup: function () {
                var d = this.ownerDocument || this, e = L.access(d, b);
                e || d.addEventListener(a, c, !0), L.access(d, b, (e || 0) + 1)
            }, teardown: function () {
                var d = this.ownerDocument || this, e = L.access(d, b) - 1;
                e ? L.access(d, b, e) : (d.removeEventListener(a, c, !0), L.remove(d, b))
            }
        }
    }), n.fn.extend({
        on: function (a, b, c, d, e) {
            var f, g;
            if ("object" == typeof a) {
                "string" != typeof b && (c = c || b, b = void 0);
                for (g in a) {
                    this.on(g, b, c, a[g], e)
                }
                return this
            }
            if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) {
                d = $
            } else {
                if (!d) {
                    return this
                }
            }
            return 1 === e && (f = d, d = function (a) {
                return n().off(a), f.apply(this, arguments)
            }, d.guid = f.guid || (f.guid = n.guid++)), this.each(function () {
                n.event.add(this, a, d, c, b)
            })
        }, one: function (a, b, c, d) {
            return this.on(a, b, c, d, 1)
        }, off: function (a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj) {
                return d = a.handleObj, n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this
            }
            if ("object" == typeof a) {
                for (e in a) {
                    this.off(e, b, a[e])
                }
                return this
            }
            return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = $), this.each(function () {
                n.event.remove(this, a, c, b)
            })
        }, trigger: function (a, b) {
            return this.each(function () {
                n.event.trigger(a, b, this)
            })
        }, triggerHandler: function (a, b) {
            var c = this[0];
            return c ? n.event.trigger(a, b, c, !0) : void 0
        }
    });
    var ab = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bb = /<([\w:]+)/, cb = /<|&#?\w+;/, db = /<(?:script|style|link)/i, eb = /checked\s*(?:[^=]|=\s*.checked.)/i, fb = /^$|\/(?:java|ecma)script/i, gb = /^true\/(.*)/, hb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, ib = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    ib.optgroup = ib.option, ib.tbody = ib.tfoot = ib.colgroup = ib.caption = ib.thead, ib.th = ib.td;
    function jb(a, b) {
        return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function kb(a) {
        return a.type = (null !== a.getAttribute("type")) + "/" + a.type, a
    }

    function lb(a) {
        var b = gb.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a
    }

    function mb(a, b) {
        for (var c = 0, d = a.length; d > c; c++) {
            L.set(a[c], "globalEval", !b || L.get(b[c], "globalEval"))
        }
    }

    function nb(a, b) {
        var c, d, e, f, g, h, i, j;
        if (1 === b.nodeType) {
            if (L.hasData(a) && (f = L.access(a), g = L.set(b, f), j = f.events)) {
                delete g.handle, g.events = {};
                for (e in j) {
                    for (c = 0, d = j[e].length; d > c; c++) {
                        n.event.add(b, e, j[e][c])
                    }
                }
            }
            M.hasData(a) && (h = M.access(a), i = n.extend({}, h), M.set(b, i))
        }
    }

    function ob(a, b) {
        var c = a.getElementsByTagName ? a.getElementsByTagName(b || "*") : a.querySelectorAll ? a.querySelectorAll(b || "*") : [];
        return void 0 === b || b && n.nodeName(a, b) ? n.merge([a], c) : c
    }

    function pb(a, b) {
        var c = b.nodeName.toLowerCase();
        "input" === c && T.test(a.type) ? b.checked = a.checked : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
    }

    n.extend({
        clone: function (a, b, c) {
            var d, e, f, g, h = a.cloneNode(!0), i = n.contains(a.ownerDocument, a);
            if (!(k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a))) {
                for (g = ob(h), f = ob(a), d = 0, e = f.length; e > d; d++) {
                    pb(f[d], g[d])
                }
            }
            if (b) {
                if (c) {
                    for (f = f || ob(a), g = g || ob(h), d = 0, e = f.length; e > d; d++) {
                        nb(f[d], g[d])
                    }
                } else {
                    nb(a, h)
                }
            }
            return g = ob(h, "script"), g.length > 0 && mb(g, !i && ob(a, "script")), h
        }, buildFragment: function (a, b, c, d) {
            for (var e, f, g, h, i, j, k = b.createDocumentFragment(), l = [], m = 0, o = a.length; o > m; m++) {
                if (e = a[m], e || 0 === e) {
                    if ("object" === n.type(e)) {
                        n.merge(l, e.nodeType ? [e] : e)
                    } else {
                        if (cb.test(e)) {
                            f = f || k.appendChild(b.createElement("div")), g = (bb.exec(e) || ["", ""])[1].toLowerCase(), h = ib[g] || ib._default, f.innerHTML = h[1] + e.replace(ab, "<$1></$2>") + h[2], j = h[0];
                            while (j--) {
                                f = f.lastChild
                            }
                            n.merge(l, f.childNodes), f = k.firstChild, f.textContent = ""
                        } else {
                            l.push(b.createTextNode(e))
                        }
                    }
                }
            }
            k.textContent = "", m = 0;
            while (e = l[m++]) {
                if ((!d || -1 === n.inArray(e, d)) && (i = n.contains(e.ownerDocument, e), f = ob(k.appendChild(e), "script"), i && mb(f), c)) {
                    j = 0;
                    while (e = f[j++]) {
                        fb.test(e.type || "") && c.push(e)
                    }
                }
            }
            return k
        }, cleanData: function (a) {
            for (var b, c, d, e, f = n.event.special, g = 0; void 0 !== (c = a[g]); g++) {
                if (n.acceptData(c) && (e = c[L.expando], e && (b = L.cache[e]))) {
                    if (b.events) {
                        for (d in b.events) {
                            f[d] ? n.event.remove(c, d) : n.removeEvent(c, d, b.handle)
                        }
                    }
                    L.cache[e] && delete L.cache[e]
                }
                delete M.cache[c[M.expando]]
            }
        }
    }), n.fn.extend({
        text: function (a) {
            return J(this, function (a) {
                return void 0 === a ? n.text(this) : this.empty().each(function () {
                    (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = a)
                })
            }, null, a, arguments.length)
        }, append: function () {
            return this.domManip(arguments, function (a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = jb(this, a);
                    b.appendChild(a)
                }
            })
        }, prepend: function () {
            return this.domManip(arguments, function (a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = jb(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        }, before: function () {
            return this.domManip(arguments, function (a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        }, after: function () {
            return this.domManip(arguments, function (a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        }, remove: function (a, b) {
            for (var c, d = a ? n.filter(a, this) : this, e = 0; null != (c = d[e]); e++) {
                b || 1 !== c.nodeType || n.cleanData(ob(c)), c.parentNode && (b && n.contains(c.ownerDocument, c) && mb(ob(c, "script")), c.parentNode.removeChild(c))
            }
            return this
        }, empty: function () {
            for (var a, b = 0; null != (a = this[b]); b++) {
                1 === a.nodeType && (n.cleanData(ob(a, !1)), a.textContent = "")
            }
            return this
        }, clone: function (a, b) {
            return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function () {
                return n.clone(this, a, b)
            })
        }, html: function (a) {
            return J(this, function (a) {
                var b = this[0] || {}, c = 0, d = this.length;
                if (void 0 === a && 1 === b.nodeType) {
                    return b.innerHTML
                }
                if ("string" == typeof a && !db.test(a) && !ib[(bb.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = a.replace(ab, "<$1></$2>");
                    try {
                        for (; d > c; c++) {
                            b = this[c] || {}, 1 === b.nodeType && (n.cleanData(ob(b, !1)), b.innerHTML = a)
                        }
                        b = 0
                    } catch (e) {
                    }
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        }, replaceWith: function () {
            var a = arguments[0];
            return this.domManip(arguments, function (b) {
                a = this.parentNode, n.cleanData(ob(this)), a && a.replaceChild(b, this)
            }), a && (a.length || a.nodeType) ? this : this.remove()
        }, detach: function (a) {
            return this.remove(a, !0)
        }, domManip: function (a, b) {
            a = e.apply([], a);
            var c, d, f, g, h, i, j = 0, l = this.length, m = this, o = l - 1, p = a[0], q = n.isFunction(p);
            if (q || l > 1 && "string" == typeof p && !k.checkClone && eb.test(p)) {
                return this.each(function (c) {
                    var d = m.eq(c);
                    q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b)
                })
            }
            if (l && (c = n.buildFragment(a, this[0].ownerDocument, !1, this), d = c.firstChild, 1 === c.childNodes.length && (c = d), d)) {
                for (f = n.map(ob(c, "script"), kb), g = f.length; l > j; j++) {
                    h = c, j !== o && (h = n.clone(h, !0, !0), g && n.merge(f, ob(h, "script"))), b.call(this[j], h, j)
                }
                if (g) {
                    for (i = f[f.length - 1].ownerDocument, n.map(f, lb), j = 0; g > j; j++) {
                        h = f[j], fb.test(h.type || "") && !L.access(h, "globalEval") && n.contains(i, h) && (h.src ? n._evalUrl && n._evalUrl(h.src) : n.globalEval(h.textContent.replace(hb, "")))
                    }
                }
            }
            return this
        }
    }), n.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (a, b) {
        n.fn[a] = function (a) {
            for (var c, d = [], e = n(a), g = e.length - 1, h = 0; g >= h; h++) {
                c = h === g ? this : this.clone(!0), n(e[h])[b](c), f.apply(d, c.get())
            }
            return this.pushStack(d)
        }
    });
    var qb, rb = {};

    function sb(b, c) {
        var d, e = n(c.createElement(b)).appendTo(c.body), f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : n.css(e[0], "display");
        return e.detach(), f
    }

    function tb(a) {
        var b = l, c = rb[a];
        return c || (c = sb(a, b), "none" !== c && c || (qb = (qb || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = qb[0].contentDocument, b.write(), b.close(), c = sb(a, b), qb.detach()), rb[a] = c), c
    }

    var ub = /^margin/, vb = new RegExp("^(" + Q + ")(?!px)[a-z%]+$", "i"), wb = function (b) {
        return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null)
    };

    function xb(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || wb(a), c && (g = c.getPropertyValue(b) || c[b]), c && ("" !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)), vb.test(g) && ub.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 !== g ? g + "" : g
    }

    function yb(a, b) {
        return {
            get: function () {
                return a() ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }

    !function () {
        var b, c, d = l.documentElement, e = l.createElement("div"), f = l.createElement("div");
        if (f.style) {
            f.style.backgroundClip = "content-box", f.cloneNode(!0).style.backgroundClip = "", k.clearCloneStyle = "content-box" === f.style.backgroundClip, e.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", e.appendChild(f);
            function g() {
                f.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", f.innerHTML = "", d.appendChild(e);
                var g = a.getComputedStyle(f, null);
                b = "1%" !== g.top, c = "4px" === g.width, d.removeChild(e)
            }

            a.getComputedStyle && n.extend(k, {
                pixelPosition: function () {
                    return g(), b
                }, boxSizingReliable: function () {
                    return null == c && g(), c
                }, reliableMarginRight: function () {
                    var b, c = f.appendChild(l.createElement("div"));
                    return c.style.cssText = f.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", c.style.marginRight = c.style.width = "0", f.style.width = "1px", d.appendChild(e), b = !parseFloat(a.getComputedStyle(c, null).marginRight), d.removeChild(e), f.removeChild(c), b
                }
            })
        }
    }(), n.swap = function (a, b, c, d) {
        var e, f, g = {};
        for (f in b) {
            g[f] = a.style[f], a.style[f] = b[f]
        }
        e = c.apply(a, d || []);
        for (f in b) {
            a.style[f] = g[f]
        }
        return e
    };
    var zb = /^(none|table(?!-c[ea]).+)/, Ab = new RegExp("^(" + Q + ")(.*)$", "i"), Bb = new RegExp("^([+-])=(" + Q + ")", "i"), Cb = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, Db = {letterSpacing: "0", fontWeight: "400"}, Eb = ["Webkit", "O", "Moz", "ms"];

    function Fb(a, b) {
        if (b in a) {
            return b
        }
        var c = b[0].toUpperCase() + b.slice(1), d = b, e = Eb.length;
        while (e--) {
            if (b = Eb[e] + c, b in a) {
                return b
            }
        }
        return d
    }

    function Gb(a, b, c) {
        var d = Ab.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }

    function Hb(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) {
            "margin" === c && (g += n.css(a, c + R[f], !0, e)), d ? ("content" === c && (g -= n.css(a, "padding" + R[f], !0, e)), "margin" !== c && (g -= n.css(a, "border" + R[f] + "Width", !0, e))) : (g += n.css(a, "padding" + R[f], !0, e), "padding" !== c && (g += n.css(a, "border" + R[f] + "Width", !0, e)))
        }
        return g
    }

    function Ib(a, b, c) {
        var d = !0, e = "width" === b ? a.offsetWidth : a.offsetHeight, f = wb(a), g = "border-box" === n.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = xb(a, b, f), (0 > e || null == e) && (e = a.style[b]), vb.test(e)) {
                return e
            }
            d = g && (k.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
        }
        return e + Hb(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }

    function Jb(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) {
            d = a[g], d.style && (f[g] = L.get(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && S(d) && (f[g] = L.access(d, "olddisplay", tb(d.nodeName)))) : (e = S(d), "none" === c && e || L.set(d, "olddisplay", e ? c : n.css(d, "display"))))
        }
        for (g = 0; h > g; g++) {
            d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"))
        }
        return a
    }

    n.extend({
        cssHooks: {
            opacity: {
                get: function (a, b) {
                    if (b) {
                        var c = xb(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {"float": "cssFloat"},
        style: function (a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = n.camelCase(b), i = a.style;
                return b = n.cssProps[h] || (n.cssProps[h] = Fb(i, h)), g = n.cssHooks[b] || n.cssHooks[h], void 0 === c ? g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b] : (f = typeof c, "string" === f && (e = Bb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(n.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || n.cssNumber[h] || (c += "px"), k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), g && "set" in g && void 0 === (c = g.set(a, c, d)) || (i[b] = c)), void 0)
            }
        },
        css: function (a, b, c, d) {
            var e, f, g, h = n.camelCase(b);
            return b = n.cssProps[h] || (n.cssProps[h] = Fb(a.style, h)), g = n.cssHooks[b] || n.cssHooks[h], g && "get" in g && (e = g.get(a, !0, c)), void 0 === e && (e = xb(a, b, d)), "normal" === e && b in Db && (e = Db[b]), "" === c || c ? (f = parseFloat(e), c === !0 || n.isNumeric(f) ? f || 0 : e) : e
        }
    }), n.each(["height", "width"], function (a, b) {
        n.cssHooks[b] = {
            get: function (a, c, d) {
                return c ? zb.test(n.css(a, "display")) && 0 === a.offsetWidth ? n.swap(a, Cb, function () {
                    return Ib(a, b, d)
                }) : Ib(a, b, d) : void 0
            }, set: function (a, c, d) {
                var e = d && wb(a);
                return Gb(a, c, d ? Hb(a, b, d, "border-box" === n.css(a, "boxSizing", !1, e), e) : 0)
            }
        }
    }), n.cssHooks.marginRight = yb(k.reliableMarginRight, function (a, b) {
        return b ? n.swap(a, {display: "inline-block"}, xb, [a, "marginRight"]) : void 0
    }), n.each({margin: "", padding: "", border: "Width"}, function (a, b) {
        n.cssHooks[a + b] = {
            expand: function (c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) {
                    e[a + R[d] + b] = f[d] || f[d - 2] || f[0]
                }
                return e
            }
        }, ub.test(a) || (n.cssHooks[a + b].set = Gb)
    }), n.fn.extend({
        css: function (a, b) {
            return J(this, function (a, b, c) {
                var d, e, f = {}, g = 0;
                if (n.isArray(b)) {
                    for (d = wb(a), e = b.length; e > g; g++) {
                        f[b[g]] = n.css(a, b[g], !1, d)
                    }
                    return f
                }
                return void 0 !== c ? n.style(a, b, c) : n.css(a, b)
            }, a, b, arguments.length > 1)
        }, show: function () {
            return Jb(this, !0)
        }, hide: function () {
            return Jb(this)
        }, toggle: function (a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
                S(this) ? n(this).show() : n(this).hide()
            })
        }
    });
    function Kb(a, b, c, d, e) {
        return new Kb.prototype.init(a, b, c, d, e)
    }

    n.Tween = Kb, Kb.prototype = {
        constructor: Kb, init: function (a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (n.cssNumber[c] ? "" : "px")
        }, cur: function () {
            var a = Kb.propHooks[this.prop];
            return a && a.get ? a.get(this) : Kb.propHooks._default.get(this)
        }, run: function (a) {
            var b, c = Kb.propHooks[this.prop];
            return this.pos = b = this.options.duration ? n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : Kb.propHooks._default.set(this), this
        }
    }, Kb.prototype.init.prototype = Kb.prototype, Kb.propHooks = {
        _default: {
            get: function (a) {
                var b;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = n.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
            }, set: function (a) {
                n.fx.step[a.prop] ? n.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[n.cssProps[a.prop]] || n.cssHooks[a.prop]) ? n.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
            }
        }
    }, Kb.propHooks.scrollTop = Kb.propHooks.scrollLeft = {
        set: function (a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    }, n.easing = {
        linear: function (a) {
            return a
        }, swing: function (a) {
            return 0.5 - Math.cos(a * Math.PI) / 2
        }
    }, n.fx = Kb.prototype.init, n.fx.step = {};
    var Lb, Mb, Nb = /^(?:toggle|show|hide)$/, Ob = new RegExp("^(?:([+-])=|)(" + Q + ")([a-z%]*)$", "i"), Pb = /queueHooks$/, Qb = [Vb], Rb = {
        "*": [function (a, b) {
            var c = this.createTween(a, b), d = c.cur(), e = Ob.exec(b), f = e && e[3] || (n.cssNumber[a] ? "" : "px"), g = (n.cssNumber[a] || "px" !== f && +d) && Ob.exec(n.css(c.elem, a)), h = 1, i = 20;
            if (g && g[3] !== f) {
                f = f || g[3], e = e || [], g = +d || 1;
                do {
                    h = h || ".5", g /= h, n.style(c.elem, a, g + f)
                } while (h !== (h = c.cur() / d) && 1 !== h && --i)
            }
            return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
        }]
    };

    function Sb() {
        return setTimeout(function () {
            Lb = void 0
        }), Lb = n.now()
    }

    function Tb(a, b) {
        var c, d = 0, e = {height: a};
        for (b = b ? 1 : 0; 4 > d; d += 2 - b) {
            c = R[d], e["margin" + c] = e["padding" + c] = a
        }
        return b && (e.opacity = e.width = a), e
    }

    function Ub(a, b, c) {
        for (var d, e = (Rb[b] || []).concat(Rb["*"]), f = 0, g = e.length; g > f; f++) {
            if (d = e[f].call(c, b, a)) {
                return d
            }
        }
    }

    function Vb(a, b, c) {
        var d, e, f, g, h, i, j, k, l = this, m = {}, o = a.style, p = a.nodeType && S(a), q = L.get(a, "fxshow");
        c.queue || (h = n._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function () {
            h.unqueued || i()
        }), h.unqueued++, l.always(function () {
            l.always(function () {
                h.unqueued--, n.queue(a, "fx").length || h.empty.fire()
            })
        })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [o.overflow, o.overflowX, o.overflowY], j = n.css(a, "display"), k = "none" === j ? L.get(a, "olddisplay") || tb(a.nodeName) : j, "inline" === k && "none" === n.css(a, "float") && (o.display = "inline-block")), c.overflow && (o.overflow = "hidden", l.always(function () {
            o.overflow = c.overflow[0], o.overflowX = c.overflow[1], o.overflowY = c.overflow[2]
        }));
        for (d in b) {
            if (e = b[d], Nb.exec(e)) {
                if (delete b[d], f = f || "toggle" === e, e === (p ? "hide" : "show")) {
                    if ("show" !== e || !q || void 0 === q[d]) {
                        continue
                    }
                    p = !0
                }
                m[d] = q && q[d] || n.style(a, d)
            } else {
                j = void 0
            }
        }
        if (n.isEmptyObject(m)) {
            "inline" === ("none" === j ? tb(a.nodeName) : j) && (o.display = j)
        } else {
            q ? "hidden" in q && (p = q.hidden) : q = L.access(a, "fxshow", {}), f && (q.hidden = !p), p ? n(a).show() : l.done(function () {
                n(a).hide()
            }), l.done(function () {
                var b;
                L.remove(a, "fxshow");
                for (b in m) {
                    n.style(a, b, m[b])
                }
            });
            for (d in m) {
                g = Ub(p ? q[d] : 0, d, l), d in q || (q[d] = g.start, p && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
            }
        }
    }

    function Wb(a, b) {
        var c, d, e, f, g;
        for (c in a) {
            if (d = n.camelCase(c), e = b[d], f = a[c], n.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = n.cssHooks[d], g && "expand" in g) {
                f = g.expand(f), delete a[d];
                for (c in f) {
                    c in a || (a[c] = f[c], b[c] = e)
                }
            } else {
                b[d] = e
            }
        }
    }

    function Xb(a, b, c) {
        var d, e, f = 0, g = Qb.length, h = n.Deferred().always(function () {
            delete i.elem
        }), i = function () {
            if (e) {
                return !1
            }
            for (var b = Lb || Sb(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) {
                j.tweens[g].run(f)
            }
            return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
        }, j = h.promise({
            elem: a,
            props: n.extend({}, b),
            opts: n.extend(!0, {specialEasing: {}}, c),
            originalProperties: b,
            originalOptions: c,
            startTime: Lb || Sb(),
            duration: c.duration,
            tweens: [],
            createTween: function (b, c) {
                var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d), d
            },
            stop: function (b) {
                var c = 0, d = b ? j.tweens.length : 0;
                if (e) {
                    return this
                }
                for (e = !0; d > c; c++) {
                    j.tweens[c].run(1)
                }
                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
            }
        }), k = j.props;
        for (Wb(k, j.opts.specialEasing); g > f; f++) {
            if (d = Qb[f].call(j, a, k, j.opts)) {
                return d
            }
        }
        return n.map(k, Ub, j), n.isFunction(j.opts.start) && j.opts.start.call(a, j), n.fx.timer(n.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }

    n.Animation = n.extend(Xb, {
        tweener: function (a, b) {
            n.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++) {
                c = a[d], Rb[c] = Rb[c] || [], Rb[c].unshift(b)
            }
        }, prefilter: function (a, b) {
            b ? Qb.unshift(a) : Qb.push(a)
        }
    }), n.speed = function (a, b, c) {
        var d = a && "object" == typeof a ? n.extend({}, a) : {
            complete: c || !c && b || n.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !n.isFunction(b) && b
        };
        return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function () {
            n.isFunction(d.old) && d.old.call(this), d.queue && n.dequeue(this, d.queue)
        }, d
    }, n.fn.extend({
        fadeTo: function (a, b, c, d) {
            return this.filter(S).css("opacity", 0).show().end().animate({opacity: b}, a, c, d)
        }, animate: function (a, b, c, d) {
            var e = n.isEmptyObject(a), f = n.speed(b, c, d), g = function () {
                var b = Xb(this, n.extend({}, a), f);
                (e || L.get(this, "finish")) && b.stop(!0)
            };
            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        }, stop: function (a, b, c) {
            var d = function (a) {
                var b = a.stop;
                delete a.stop, b(c)
            };
            return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () {
                var b = !0, e = null != a && a + "queueHooks", f = n.timers, g = L.get(this);
                if (e) {
                    g[e] && g[e].stop && d(g[e])
                } else {
                    for (e in g) {
                        g[e] && g[e].stop && Pb.test(e) && d(g[e])
                    }
                }
                for (e = f.length; e--;) {
                    f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1))
                }
                (b || !c) && n.dequeue(this, a)
            })
        }, finish: function (a) {
            return a !== !1 && (a = a || "fx"), this.each(function () {
                var b, c = L.get(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = n.timers, g = d ? d.length : 0;
                for (c.finish = !0, n.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) {
                    f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1))
                }
                for (b = 0; g > b; b++) {
                    d[b] && d[b].finish && d[b].finish.call(this)
                }
                delete c.finish
            })
        }
    }), n.each(["toggle", "show", "hide"], function (a, b) {
        var c = n.fn[b];
        n.fn[b] = function (a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(Tb(b, !0), a, d, e)
        }
    }), n.each({
        slideDown: Tb("show"),
        slideUp: Tb("hide"),
        slideToggle: Tb("toggle"),
        fadeIn: {opacity: "show"},
        fadeOut: {opacity: "hide"},
        fadeToggle: {opacity: "toggle"}
    }, function (a, b) {
        n.fn[a] = function (a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), n.timers = [], n.fx.tick = function () {
        var a, b = 0, c = n.timers;
        for (Lb = n.now(); b < c.length; b++) {
            a = c[b], a() || c[b] !== a || c.splice(b--, 1)
        }
        c.length || n.fx.stop(), Lb = void 0
    }, n.fx.timer = function (a) {
        n.timers.push(a), a() ? n.fx.start() : n.timers.pop()
    }, n.fx.interval = 13, n.fx.start = function () {
        Mb || (Mb = setInterval(n.fx.tick, n.fx.interval))
    }, n.fx.stop = function () {
        clearInterval(Mb), Mb = null
    }, n.fx.speeds = {slow: 600, fast: 200, _default: 400}, n.fn.delay = function (a, b) {
        return a = n.fx ? n.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) {
            var d = setTimeout(b, a);
            c.stop = function () {
                clearTimeout(d)
            }
        })
    }, function () {
        var a = l.createElement("input"), b = l.createElement("select"), c = b.appendChild(l.createElement("option"));
        a.type = "checkbox", k.checkOn = "" !== a.value, k.optSelected = c.selected, b.disabled = !0, k.optDisabled = !c.disabled, a = l.createElement("input"), a.value = "t", a.type = "radio", k.radioValue = "t" === a.value
    }();
    var Yb, Zb, $b = n.expr.attrHandle;
    n.fn.extend({
        attr: function (a, b) {
            return J(this, n.attr, a, b, arguments.length > 1)
        }, removeAttr: function (a) {
            return this.each(function () {
                n.removeAttr(this, a)
            })
        }
    }), n.extend({
        attr: function (a, b, c) {
            var d, e, f = a.nodeType;
            if (a && 3 !== f && 8 !== f && 2 !== f) {
                return typeof a.getAttribute === U ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(), d = n.attrHooks[b] || (n.expr.match.bool.test(b) ? Zb : Yb)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = n.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void n.removeAttr(a, b))
            }
        }, removeAttr: function (a, b) {
            var c, d, e = 0, f = b && b.match(E);
            if (f && 1 === a.nodeType) {
                while (c = f[e++]) {
                    d = n.propFix[c] || c, n.expr.match.bool.test(c) && (a[d] = !1), a.removeAttribute(c)
                }
            }
        }, attrHooks: {
            type: {
                set: function (a, b) {
                    if (!k.radioValue && "radio" === b && n.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }
            }
        }
    }), Zb = {
        set: function (a, b, c) {
            return b === !1 ? n.removeAttr(a, c) : a.setAttribute(c, c), c
        }
    }, n.each(n.expr.match.bool.source.match(/\w+/g), function (a, b) {
        var c = $b[b] || n.find.attr;
        $b[b] = function (a, b, d) {
            var e, f;
            return d || (f = $b[b], $b[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, $b[b] = f), e
        }
    });
    var _b = /^(?:input|select|textarea|button)$/i;
    n.fn.extend({
        prop: function (a, b) {
            return J(this, n.prop, a, b, arguments.length > 1)
        }, removeProp: function (a) {
            return this.each(function () {
                delete this[n.propFix[a] || a]
            })
        }
    }), n.extend({
        propFix: {"for": "htmlFor", "class": "className"}, prop: function (a, b, c) {
            var d, e, f, g = a.nodeType;
            if (a && 3 !== g && 8 !== g && 2 !== g) {
                return f = 1 !== g || !n.isXMLDoc(a), f && (b = n.propFix[b] || b, e = n.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
            }
        }, propHooks: {
            tabIndex: {
                get: function (a) {
                    return a.hasAttribute("tabindex") || _b.test(a.nodeName) || a.href ? a.tabIndex : -1
                }
            }
        }
    }), k.optSelected || (n.propHooks.selected = {
        get: function (a) {
            var b = a.parentNode;
            return b && b.parentNode && b.parentNode.selectedIndex, null
        }
    }), n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        n.propFix[this.toLowerCase()] = this
    });
    var ac = /[\t\r\n\f]/g;
    n.fn.extend({
        addClass: function (a) {
            var b, c, d, e, f, g, h = "string" == typeof a && a, i = 0, j = this.length;
            if (n.isFunction(a)) {
                return this.each(function (b) {
                    n(this).addClass(a.call(this, b, this.className))
                })
            }
            if (h) {
                for (b = (a || "").match(E) || []; j > i; i++) {
                    if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ac, " ") : " ")) {
                        f = 0;
                        while (e = b[f++]) {
                            d.indexOf(" " + e + " ") < 0 && (d += e + " ")
                        }
                        g = n.trim(d), c.className !== g && (c.className = g)
                    }
                }
            }
            return this
        }, removeClass: function (a) {
            var b, c, d, e, f, g, h = 0 === arguments.length || "string" == typeof a && a, i = 0, j = this.length;
            if (n.isFunction(a)) {
                return this.each(function (b) {
                    n(this).removeClass(a.call(this, b, this.className))
                })
            }
            if (h) {
                for (b = (a || "").match(E) || []; j > i; i++) {
                    if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ac, " ") : "")) {
                        f = 0;
                        while (e = b[f++]) {
                            while (d.indexOf(" " + e + " ") >= 0) {
                                d = d.replace(" " + e + " ", " ")
                            }
                        }
                        g = a ? n.trim(d) : "", c.className !== g && (c.className = g)
                    }
                }
            }
            return this
        }, toggleClass: function (a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(n.isFunction(a) ? function (c) {
                n(this).toggleClass(a.call(this, c, this.className, b), b)
            } : function () {
                if ("string" === c) {
                    var b, d = 0, e = n(this), f = a.match(E) || [];
                    while (b = f[d++]) {
                        e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
                    }
                } else {
                    (c === U || "boolean" === c) && (this.className && L.set(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : L.get(this, "__className__") || "")
                }
            })
        }, hasClass: function (a) {
            for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++) {
                if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(ac, " ").indexOf(b) >= 0) {
                    return !0
                }
            }
            return !1
        }
    });
    var bc = /\r/g;
    n.fn.extend({
        val: function (a) {
            var b, c, d, e = this[0];
            if (arguments.length) {
                return d = n.isFunction(a), this.each(function (c) {
                    var e;
                    1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function (a) {
                        return null == a ? "" : a + ""
                    })), b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                })
            }
            if (e) {
                return b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(bc, "") : null == c ? "" : c)
            }
        }
    }), n.extend({
        valHooks: {
            option: {
                get: function (a) {
                    var b = n.find.attr(a, "value");
                    return null != b ? b : n.trim(n.text(a))
                }
            }, select: {
                get: function (a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++) {
                        if (c = d[i], !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && n.nodeName(c.parentNode, "optgroup"))) {
                            if (b = n(c).val(), f) {
                                return b
                            }
                            g.push(b)
                        }
                    }
                    return g
                }, set: function (a, b) {
                    var c, d, e = a.options, f = n.makeArray(b), g = e.length;
                    while (g--) {
                        d = e[g], (d.selected = n.inArray(d.value, f) >= 0) && (c = !0)
                    }
                    return c || (a.selectedIndex = -1), f
                }
            }
        }
    }), n.each(["radio", "checkbox"], function () {
        n.valHooks[this] = {
            set: function (a, b) {
                return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) >= 0 : void 0
            }
        }, k.checkOn || (n.valHooks[this].get = function (a) {
            return null === a.getAttribute("value") ? "on" : a.value
        })
    }), n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
        n.fn[b] = function (a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }), n.fn.extend({
        hover: function (a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        }, bind: function (a, b, c) {
            return this.on(a, null, b, c)
        }, unbind: function (a, b) {
            return this.off(a, null, b)
        }, delegate: function (a, b, c, d) {
            return this.on(b, a, c, d)
        }, undelegate: function (a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }
    });
    var cc = n.now(), dc = /\?/;
    n.parseJSON = function (a) {
        return JSON.parse(a + "")
    }, n.parseXML = function (a) {
        var b, c;
        if (!a || "string" != typeof a) {
            return null
        }
        try {
            c = new DOMParser, b = c.parseFromString(a, "text/xml")
        } catch (d) {
            b = void 0
        }
        return (!b || b.getElementsByTagName("parsererror").length) && n.error("Invalid XML: " + a), b
    };
    var ec = /#.*$/, fc = /([?&])_=[^&]*/, gc = /^(.*?):[ \t]*([^\r\n]*)$/gm, hc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, ic = /^(?:GET|HEAD)$/, jc = /^\/\//, kc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, lc = {}, mc = {}, nc = "*/".concat("*"), oc = a.location.href, pc = kc.exec(oc.toLowerCase()) || [];

    function qc(a) {
        return function (b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d, e = 0, f = b.toLowerCase().match(E) || [];
            if (n.isFunction(c)) {
                while (d = f[e++]) {
                    "+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
                }
            }
        }
    }

    function rc(a, b, c, d) {
        var e = {}, f = a === mc;

        function g(h) {
            var i;
            return e[h] = !0, n.each(a[h] || [], function (a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1)
            }), i
        }

        return g(b.dataTypes[0]) || !e["*"] && g("*")
    }

    function sc(a, b) {
        var c, d, e = n.ajaxSettings.flatOptions || {};
        for (c in b) {
            void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c])
        }
        return d && n.extend(!0, a, d), a
    }

    function tc(a, b, c) {
        var d, e, f, g, h = a.contents, i = a.dataTypes;
        while ("*" === i[0]) {
            i.shift(), void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type"))
        }
        if (d) {
            for (e in h) {
                if (h[e] && h[e].test(d)) {
                    i.unshift(e);
                    break
                }
            }
        }
        if (i[0] in c) {
            f = i[0]
        } else {
            for (e in c) {
                if (!i[0] || a.converters[e + " " + i[0]]) {
                    f = e;
                    break
                }
                g || (g = e)
            }
            f = f || g
        }
        return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
    }

    function uc(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1]) {
            for (g in a.converters) {
                j[g.toLowerCase()] = a.converters[g]
            }
        }
        f = k.shift();
        while (f) {
            if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift()) {
                if ("*" === f) {
                    f = i
                } else {
                    if ("*" !== i && i !== f) {
                        if (g = j[i + " " + f] || j["* " + f], !g) {
                            for (e in j) {
                                if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                    g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                                    break
                                }
                            }
                        }
                        if (g !== !0) {
                            if (g && a["throws"]) {
                                b = g(b)
                            } else {
                                try {
                                    b = g(b)
                                } catch (l) {
                                    return {state: "parsererror", error: g ? l : "No conversion from " + i + " to " + f}
                                }
                            }
                        }
                    }
                }
            }
        }
        return {state: "success", data: b}
    }

    n.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: oc,
            type: "GET",
            isLocal: hc.test(pc[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": nc,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {xml: /xml/, html: /html/, json: /json/},
            responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"},
            converters: {"* text": String, "text html": !0, "text json": n.parseJSON, "text xml": n.parseXML},
            flatOptions: {url: !0, context: !0}
        },
        ajaxSetup: function (a, b) {
            return b ? sc(sc(a, n.ajaxSettings), b) : sc(n.ajaxSettings, a)
        },
        ajaxPrefilter: qc(lc),
        ajaxTransport: qc(mc),
        ajax: function (a, b) {
            "object" == typeof a && (b = a, a = void 0), b = b || {};
            var c, d, e, f, g, h, i, j, k = n.ajaxSetup({}, b), l = k.context || k, m = k.context && (l.nodeType || l.jquery) ? n(l) : n.event, o = n.Deferred(), p = n.Callbacks("once memory"), q = k.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {
                readyState: 0,
                getResponseHeader: function (a) {
                    var b;
                    if (2 === t) {
                        if (!f) {
                            f = {};
                            while (b = gc.exec(e)) {
                                f[b[1].toLowerCase()] = b[2]
                            }
                        }
                        b = f[a.toLowerCase()]
                    }
                    return null == b ? null : b
                },
                getAllResponseHeaders: function () {
                    return 2 === t ? e : null
                },
                setRequestHeader: function (a, b) {
                    var c = a.toLowerCase();
                    return t || (a = s[c] = s[c] || a, r[a] = b), this
                },
                overrideMimeType: function (a) {
                    return t || (k.mimeType = a), this
                },
                statusCode: function (a) {
                    var b;
                    if (a) {
                        if (2 > t) {
                            for (b in a) {
                                q[b] = [q[b], a[b]]
                            }
                        } else {
                            v.always(a[v.status])
                        }
                    }
                    return this
                },
                abort: function (a) {
                    var b = a || u;
                    return c && c.abort(b), x(0, b), this
                }
            };
            if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || oc) + "").replace(ec, "").replace(jc, pc[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = n.trim(k.dataType || "*").toLowerCase().match(E) || [""], null == k.crossDomain && (h = kc.exec(k.url.toLowerCase()), k.crossDomain = !(!h || h[1] === pc[1] && h[2] === pc[2] && (h[3] || ("http:" === h[1] ? "80" : "443")) === (pc[3] || ("http:" === pc[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = n.param(k.data, k.traditional)), rc(lc, k, b, v), 2 === t) {
                return v
            }
            i = n.event && k.global, i && 0 === n.active++ && n.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !ic.test(k.type), d = k.url, k.hasContent || (k.data && (d = k.url += (dc.test(d) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = fc.test(d) ? d.replace(fc, "$1_=" + cc++) : d + (dc.test(d) ? "&" : "?") + "_=" + cc++)), k.ifModified && (n.lastModified[d] && v.setRequestHeader("If-Modified-Since", n.lastModified[d]), n.etag[d] && v.setRequestHeader("If-None-Match", n.etag[d])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + nc + "; q=0.01" : "") : k.accepts["*"]);
            for (j in k.headers) {
                v.setRequestHeader(j, k.headers[j])
            }
            if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) {
                return v.abort()
            }
            u = "abort";
            for (j in {success: 1, error: 1, complete: 1}) {
                v[j](k[j])
            }
            if (c = rc(mc, k, b, v)) {
                v.readyState = 1, i && m.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function () {
                    v.abort("timeout")
                }, k.timeout));
                try {
                    t = 1, c.send(r, x)
                } catch (w) {
                    if (!(2 > t)) {
                        throw w
                    }
                    x(-1, w)
                }
            } else {
                x(-1, "No Transport")
            }
            function x(a, b, f, h) {
                var j, r, s, u, w, x = b;
                2 !== t && (t = 2, g && clearTimeout(g), c = void 0, e = h || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, f && (u = tc(k, v, f)), u = uc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (n.lastModified[d] = w), w = v.getResponseHeader("etag"), w && (n.etag[d] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, i && m.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), i && (m.trigger("ajaxComplete", [v, k]), --n.active || n.event.trigger("ajaxStop")))
            }

            return v
        },
        getJSON: function (a, b, c) {
            return n.get(a, b, c, "json")
        },
        getScript: function (a, b) {
            return n.get(a, void 0, b, "script")
        }
    }), n.each(["get", "post"], function (a, b) {
        n[b] = function (a, c, d, e) {
            return n.isFunction(c) && (e = e || d, d = c, c = void 0), n.ajax({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            })
        }
    }), n._evalUrl = function (a) {
        return n.ajax({url: a, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0})
    }, n.fn.extend({
        wrapAll: function (a) {
            var b;
            return n.isFunction(a) ? this.each(function (b) {
                n(this).wrapAll(a.call(this, b))
            }) : (this[0] && (b = n(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
                var a = this;
                while (a.firstElementChild) {
                    a = a.firstElementChild
                }
                return a
            }).append(this)), this)
        }, wrapInner: function (a) {
            return this.each(n.isFunction(a) ? function (b) {
                n(this).wrapInner(a.call(this, b))
            } : function () {
                var b = n(this), c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        }, wrap: function (a) {
            var b = n.isFunction(a);
            return this.each(function (c) {
                n(this).wrapAll(b ? a.call(this, c) : a)
            })
        }, unwrap: function () {
            return this.parent().each(function () {
                n.nodeName(this, "body") || n(this).replaceWith(this.childNodes)
            }).end()
        }
    }), n.expr.filters.hidden = function (a) {
        return a.offsetWidth <= 0 && a.offsetHeight <= 0
    }, n.expr.filters.visible = function (a) {
        return !n.expr.filters.hidden(a)
    };
    var vc = /%20/g, wc = /\[\]$/, xc = /\r?\n/g, yc = /^(?:submit|button|image|reset|file)$/i, zc = /^(?:input|select|textarea|keygen)/i;

    function Ac(a, b, c, d) {
        var e;
        if (n.isArray(b)) {
            n.each(b, function (b, e) {
                c || wc.test(a) ? d(a, e) : Ac(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
            })
        } else {
            if (c || "object" !== n.type(b)) {
                d(a, b)
            } else {
                for (e in b) {
                    Ac(a + "[" + e + "]", b[e], c, d)
                }
            }
        }
    }

    n.param = function (a, b) {
        var c, d = [], e = function (a, b) {
            b = n.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
        if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional), n.isArray(a) || a.jquery && !n.isPlainObject(a)) {
            n.each(a, function () {
                e(this.name, this.value)
            })
        } else {
            for (c in a) {
                Ac(c, a[c], b, e)
            }
        }
        return d.join("&").replace(vc, "+")
    }, n.fn.extend({
        serialize: function () {
            return n.param(this.serializeArray())
        }, serializeArray: function () {
            return this.map(function () {
                var a = n.prop(this, "elements");
                return a ? n.makeArray(a) : this
            }).filter(function () {
                var a = this.type;
                return this.name && !n(this).is(":disabled") && zc.test(this.nodeName) && !yc.test(a) && (this.checked || !T.test(a))
            }).map(function (a, b) {
                var c = n(this).val();
                return null == c ? null : n.isArray(c) ? n.map(c, function (a) {
                    return {name: b.name, value: a.replace(xc, "\r\n")}
                }) : {name: b.name, value: c.replace(xc, "\r\n")}
            }).get()
        }
    }), n.ajaxSettings.xhr = function () {
        try {
            return new XMLHttpRequest
        } catch (a) {
        }
    };
    var Bc = 0, Cc = {}, Dc = {0: 200, 1223: 204}, Ec = n.ajaxSettings.xhr();
    a.attachEvent && a.attachEvent("onunload", function () {
        for (var a in Cc) {
            Cc[a]()
        }
    }), k.cors = !!Ec && "withCredentials" in Ec, k.ajax = Ec = !!Ec, n.ajaxTransport(function (a) {
        var b;
        return k.cors || Ec && !a.crossDomain ? {
            send: function (c, d) {
                var e, f = a.xhr(), g = ++Bc;
                if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields) {
                    for (e in a.xhrFields) {
                        f[e] = a.xhrFields[e]
                    }
                }
                a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                for (e in c) {
                    f.setRequestHeader(e, c[e])
                }
                b = function (a) {
                    return function () {
                        b && (delete Cc[g], b = f.onload = f.onerror = null, "abort" === a ? f.abort() : "error" === a ? d(f.status, f.statusText) : d(Dc[f.status] || f.status, f.statusText, "string" == typeof f.responseText ? {text: f.responseText} : void 0, f.getAllResponseHeaders()))
                    }
                }, f.onload = b(), f.onerror = b("error"), b = Cc[g] = b("abort");
                try {
                    f.send(a.hasContent && a.data || null)
                } catch (h) {
                    if (b) {
                        throw h
                    }
                }
            }, abort: function () {
                b && b()
            }
        } : void 0
    }), n.ajaxSetup({
        accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
        contents: {script: /(?:java|ecma)script/},
        converters: {
            "text script": function (a) {
                return n.globalEval(a), a
            }
        }
    }), n.ajaxPrefilter("script", function (a) {
        void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET")
    }), n.ajaxTransport("script", function (a) {
        if (a.crossDomain) {
            var b, c;
            return {
                send: function (d, e) {
                    b = n("<script>").prop({
                        async: !0,
                        charset: a.scriptCharset,
                        src: a.url
                    }).on("load error", c = function (a) {
                        b.remove(), c = null, a && e("error" === a.type ? 404 : 200, a.type)
                    }), l.head.appendChild(b[0])
                }, abort: function () {
                    c && c()
                }
            }
        }
    });
    var Fc = [], Gc = /(=)\?(?=&|$)|\?\?/;
    n.ajaxSetup({
        jsonp: "callback", jsonpCallback: function () {
            var a = Fc.pop() || n.expando + "_" + cc++;
            return this[a] = !0, a
        }
    }), n.ajaxPrefilter("json jsonp", function (b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (Gc.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && Gc.test(b.data) && "data");
        return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(Gc, "$1" + e) : b.jsonp !== !1 && (b.url += (dc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () {
            return g || n.error(e + " was not called"), g[0]
        }, b.dataTypes[0] = "json", f = a[e], a[e] = function () {
            g = arguments
        }, d.always(function () {
            a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, Fc.push(e)), g && n.isFunction(f) && f(g[0]), g = f = void 0
        }), "script") : void 0
    }), n.parseHTML = function (a, b, c) {
        if (!a || "string" != typeof a) {
            return null
        }
        "boolean" == typeof b && (c = b, b = !1), b = b || l;
        var d = v.exec(a), e = !c && [];
        return d ? [b.createElement(d[1])] : (d = n.buildFragment([a], b, e), e && e.length && n(e).remove(), n.merge([], d.childNodes))
    };
    var Hc = n.fn.load;
    n.fn.load = function (a, b, c) {
        if ("string" != typeof a && Hc) {
            return Hc.apply(this, arguments)
        }
        var d, e, f, g = this, h = a.indexOf(" ");
        return h >= 0 && (d = n.trim(a.slice(h)), a = a.slice(0, h)), n.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (e = "POST"), g.length > 0 && n.ajax({
            url: a,
            type: e,
            dataType: "html",
            data: b
        }).done(function (a) {
            f = arguments, g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a)
        }).complete(c && function (a, b) {
                g.each(c, f || [a.responseText, b, a])
            }), this
    }, n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
        n.fn[b] = function (a) {
            return this.on(b, a)
        }
    }), n.expr.filters.animated = function (a) {
        return n.grep(n.timers, function (b) {
            return a === b.elem
        }).length
    };
    var Ic = a.document.documentElement;

    function Jc(a) {
        return n.isWindow(a) ? a : 9 === a.nodeType && a.defaultView
    }

    n.offset = {
        setOffset: function (a, b, c) {
            var d, e, f, g, h, i, j, k = n.css(a, "position"), l = n(a), m = {};
            "static" === k && (a.style.position = "relative"), h = l.offset(), f = n.css(a, "top"), i = n.css(a, "left"), j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), n.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
        }
    }, n.fn.extend({
        offset: function (a) {
            if (arguments.length) {
                return void 0 === a ? this : this.each(function (b) {
                    n.offset.setOffset(this, a, b)
                })
            }
            var b, c, d = this[0], e = {top: 0, left: 0}, f = d && d.ownerDocument;
            if (f) {
                return b = f.documentElement, n.contains(b, d) ? (typeof d.getBoundingClientRect !== U && (e = d.getBoundingClientRect()), c = Jc(f), {
                    top: e.top + c.pageYOffset - b.clientTop,
                    left: e.left + c.pageXOffset - b.clientLeft
                }) : e
            }
        }, position: function () {
            if (this[0]) {
                var a, b, c = this[0], d = {top: 0, left: 0};
                return "fixed" === n.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), n.nodeName(a[0], "html") || (d = a.offset()), d.top += n.css(a[0], "borderTopWidth", !0), d.left += n.css(a[0], "borderLeftWidth", !0)), {
                    top: b.top - d.top - n.css(c, "marginTop", !0),
                    left: b.left - d.left - n.css(c, "marginLeft", !0)
                }
            }
        }, offsetParent: function () {
            return this.map(function () {
                var a = this.offsetParent || Ic;
                while (a && !n.nodeName(a, "html") && "static" === n.css(a, "position")) {
                    a = a.offsetParent
                }
                return a || Ic
            })
        }
    }), n.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (b, c) {
        var d = "pageYOffset" === c;
        n.fn[b] = function (e) {
            return J(this, function (b, e, f) {
                var g = Jc(b);
                return void 0 === f ? g ? g[c] : b[e] : void (g ? g.scrollTo(d ? a.pageXOffset : f, d ? f : a.pageYOffset) : b[e] = f)
            }, b, e, arguments.length, null)
        }
    }), n.each(["top", "left"], function (a, b) {
        n.cssHooks[b] = yb(k.pixelPosition, function (a, c) {
            return c ? (c = xb(a, b), vb.test(c) ? n(a).position()[b] + "px" : c) : void 0
        })
    }), n.each({Height: "height", Width: "width"}, function (a, b) {
        n.each({padding: "inner" + a, content: b, "": "outer" + a}, function (c, d) {
            n.fn[d] = function (d, e) {
                var f = arguments.length && (c || "boolean" != typeof d), g = c || (d === !0 || e === !0 ? "margin" : "border");
                return J(this, function (b, c, d) {
                    var e;
                    return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g)
                }, b, f ? d : void 0, f, null)
            }
        })
    }), n.fn.size = function () {
        return this.length
    }, n.fn.andSelf = n.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
        return n
    });
    var Kc = a.jQuery, Lc = a.$;
    return n.noConflict = function (b) {
        return a.$ === n && (a.$ = Lc), b && a.jQuery === n && (a.jQuery = Kc), n
    }, typeof b === U && (a.jQuery = a.$ = n), n
});
/*! jQuery UI - v1.9.2 - 2013-09-04
 * http://jqueryui.com
 * Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.sortable.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.dialog.js, jquery.ui.menu.js, jquery.ui.tabs.js, jquery.ui.effect.js, jquery.ui.effect-fade.js
 * Copyright 2013 jQuery Foundation and other contributors Licensed MIT */
(function (f, b) {
    function a(j, m) {
        var k, h, l, e = j.nodeName.toLowerCase();
        return "area" === e ? (k = j.parentNode, h = k.name, !j.href || !h || k.nodeName.toLowerCase() !== "map" ? !1 : (l = f("img[usemap=#" + h + "]")[0], !!l && c(l))) : (/input|select|textarea|button|object/.test(e) ? !j.disabled : "a" === e ? j.href || m : m) && c(j)
    }

    function c(e) {
        return f.expr.filters.visible(e) && !f(e).parents().andSelf().filter(function () {
                return f.css(this, "visibility") === "hidden"
            }).length
    }

    var g = 0, d = /^ui-id-\d+$/;
    f.ui = f.ui || {};
    if (f.ui.version) {
        return
    }
    f.extend(f.ui, {
        version: "1.9.2",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    }), f.fn.extend({
        _focus: f.fn.focus, focus: function (e, h) {
            return typeof e == "number" ? this.each(function () {
                var i = this;
                setTimeout(function () {
                    f(i).focus(), h && h.call(i)
                }, e)
            }) : this._focus.apply(this, arguments)
        }, scrollParent: function () {
            var e;
            return f.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? e = this.parents().filter(function () {
                return /(relative|absolute|fixed)/.test(f.css(this, "position")) && /(auto|scroll)/.test(f.css(this, "overflow") + f.css(this, "overflow-y") + f.css(this, "overflow-x"))
            }).eq(0) : e = this.parents().filter(function () {
                return /(auto|scroll)/.test(f.css(this, "overflow") + f.css(this, "overflow-y") + f.css(this, "overflow-x"))
            }).eq(0), /fixed/.test(this.css("position")) || !e.length ? f(document) : e
        }, zIndex: function (k) {
            if (k !== b) {
                return this.css("zIndex", k)
            }
            if (this.length) {
                var j = f(this[0]), e, h;
                while (j.length && j[0] !== document) {
                    e = j.css("position");
                    if (e === "absolute" || e === "relative" || e === "fixed") {
                        h = parseInt(j.css("zIndex"), 10);
                        if (!isNaN(h) && h !== 0) {
                            return h
                        }
                    }
                    j = j.parent()
                }
            }
            return 0
        }, uniqueId: function () {
            return this.each(function () {
                this.id || (this.id = "ui-id-" + ++g)
            })
        }, removeUniqueId: function () {
            return this.each(function () {
                d.test(this.id) && f(this).removeAttr("id")
            })
        }
    }), f.extend(f.expr[":"], {
        data: f.expr.createPseudo ? f.expr.createPseudo(function (e) {
            return function (h) {
                return !!f.data(h, e)
            }
        }) : function (e, i, h) {
            return !!f.data(e, h[3])
        }, focusable: function (e) {
            return a(e, !isNaN(f.attr(e, "tabindex")))
        }, tabbable: function (e) {
            var i = f.attr(e, "tabindex"), h = isNaN(i);
            return (h || i >= 0) && a(e, !h)
        }
    }), f(function () {
        var e = document.body, h = e.appendChild(h = document.createElement("div"));
        h.offsetHeight, f.extend(h.style, {
            minHeight: "100px",
            height: "auto",
            padding: 0,
            borderWidth: 0
        }), f.support.minHeight = h.offsetHeight === 100, f.support.selectstart = "onselectstart" in h, e.removeChild(h).style.display = "none"
    }), f("<a>").outerWidth(1).jquery || f.each(["Width", "Height"], function (m, k) {
        function e(i, q, p, o) {
            return f.each(h, function () {
                q -= parseFloat(f.css(i, "padding" + this)) || 0, p && (q -= parseFloat(f.css(i, "border" + this + "Width")) || 0), o && (q -= parseFloat(f.css(i, "margin" + this)) || 0)
            }), q
        }

        var h = k === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], j = k.toLowerCase(), l = {
            innerWidth: f.fn.innerWidth,
            innerHeight: f.fn.innerHeight,
            outerWidth: f.fn.outerWidth,
            outerHeight: f.fn.outerHeight
        };
        f.fn["inner" + k] = function (i) {
            return i === b ? l["inner" + k].call(this) : this.each(function () {
                f(this).css(j, e(this, i) + "px")
            })
        }, f.fn["outer" + k] = function (i, o) {
            return typeof i != "number" ? l["outer" + k].call(this, i) : this.each(function () {
                f(this).css(j, e(this, i, !0, o) + "px")
            })
        }
    }), f("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (f.fn.removeData = function (e) {
        return function (h) {
            return arguments.length ? e.call(this, f.camelCase(h)) : e.call(this)
        }
    }(f.fn.removeData)), function () {
        var e = /msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || [];
        f.ui.ie = e.length ? !0 : !1, f.ui.ie6 = parseFloat(e[1], 10) === 6
    }(), f.fn.extend({
        disableSelection: function () {
            return this.bind((f.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (h) {
                h.preventDefault()
            })
        }, enableSelection: function () {
            return this.unbind(".ui-disableSelection")
        }
    }), f.extend(f.ui, {
        plugin: {
            add: function (h, l, k) {
                var e, j = f.ui[h].prototype;
                for (e in k) {
                    j.plugins[e] = j.plugins[e] || [], j.plugins[e].push([l, k[e]])
                }
            }, call: function (l, j, m) {
                var k, h = l.plugins[j];
                if (!h || !l.element[0].parentNode || l.element[0].parentNode.nodeType === 11) {
                    return
                }
                for (k = 0; k < h.length; k++) {
                    l.options[h[k][0]] && h[k][1].apply(l.element, m)
                }
            }
        }, contains: f.contains, hasScroll: function (h, k) {
            if (f(h).css("overflow") === "hidden") {
                return !1
            }
            var j = k && k === "left" ? "scrollLeft" : "scrollTop", e = !1;
            return h[j] > 0 ? !0 : (h[j] = 1, e = h[j] > 0, h[j] = 0, e)
        }, isOverAxis: function (i, h, j) {
            return i > h && i < h + j
        }, isOver: function (h, m, k, e, j, l) {
            return f.ui.isOverAxis(h, k, j) && f.ui.isOverAxis(m, e, l)
        }
    })
})(jQuery);
(function (d, b) {
    var f = 0, c = Array.prototype.slice, a = d.cleanData;
    d.cleanData = function (e) {
        for (var i = 0, h; (h = e[i]) != null; i++) {
            try {
                d(h).triggerHandler("remove")
            } catch (g) {
            }
        }
        a(e)
    }, d.widget = function (j, p, l) {
        var h, k, m, g, e = j.split(".")[0];
        j = j.split(".")[1], h = e + "-" + j, l || (l = p, p = d.Widget), d.expr[":"][h.toLowerCase()] = function (i) {
            return !!d.data(i, h)
        }, d[e] = d[e] || {}, k = d[e][j], m = d[e][j] = function (n, i) {
            if (!this._createWidget) {
                return new m(n, i)
            }
            arguments.length && this._createWidget(n, i)
        }, d.extend(m, k, {
            version: l.version,
            _proto: d.extend({}, l),
            _childConstructors: []
        }), g = new p, g.options = d.widget.extend({}, g.options), d.each(l, function (o, n) {
            d.isFunction(n) && (l[o] = function () {
                var q = function () {
                    return p.prototype[o].apply(this, arguments)
                }, i = function (r) {
                    return p.prototype[o].apply(this, r)
                };
                return function () {
                    var r = this._super, v = this._superApply, u;
                    return this._super = q, this._superApply = i, u = n.apply(this, arguments), this._super = r, this._superApply = v, u
                }
            }())
        }), m.prototype = d.widget.extend(g, {widgetEventPrefix: k ? g.widgetEventPrefix : j}, l, {
            constructor: m,
            namespace: e,
            widgetName: j,
            widgetBaseClass: h,
            widgetFullName: h
        }), k ? (d.each(k._childConstructors, function (i, q) {
            var o = q.prototype;
            d.widget(o.namespace + "." + o.widgetName, m, q._proto)
        }), delete k._childConstructors) : p._childConstructors.push(m), d.widget.bridge(j, m)
    }, d.widget.extend = function (l) {
        var h = c.call(arguments, 1), j = 0, k = h.length, g, e;
        for (; j < k; j++) {
            for (g in h[j]) {
                e = h[j][g], h[j].hasOwnProperty(g) && e !== b && (d.isPlainObject(e) ? l[g] = d.isPlainObject(l[g]) ? d.widget.extend({}, l[g], e) : d.widget.extend({}, e) : l[g] = e)
            }
        }
        return l
    }, d.widget.bridge = function (h, e) {
        var g = e.prototype.widgetFullName || h;
        d.fn[h] = function (l) {
            var j = typeof l == "string", i = c.call(arguments, 1), k = this;
            return l = !j && i.length ? d.widget.extend.apply(null, [l].concat(i)) : l, j ? this.each(function () {
                var n, m = d.data(this, g);
                if (!m) {
                    return d.error("cannot call methods on " + h + " prior to initialization; attempted to call method '" + l + "'")
                }
                if (!d.isFunction(m[l]) || l.charAt(0) === "_") {
                    return d.error("no such method '" + l + "' for " + h + " widget instance")
                }
                n = m[l].apply(m, i);
                if (n !== m && n !== b) {
                    return k = n && n.jquery ? k.pushStack(n.get()) : n, !1
                }
            }) : this.each(function () {
                var m = d.data(this, g);
                m ? m.option(l || {})._init() : d.data(this, g, new e(l, this))
            }), k
        }
    }, d.Widget = function () {
    }, d.Widget._childConstructors = [], d.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {disabled: !1, create: null},
        _createWidget: function (e, g) {
            g = d(g || this.defaultElement || this)[0], this.element = d(g), this.uuid = f++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = d.widget.extend({}, this.options, this._getCreateOptions(), e), this.bindings = d(), this.hoverable = d(), this.focusable = d(), g !== this && (d.data(g, this.widgetName, this), d.data(g, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function (h) {
                    h.target === g && this.destroy()
                }
            }), this.document = d(g.style ? g.ownerDocument : g.document || g), this.window = d(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
        },
        _getCreateOptions: d.noop,
        _getCreateEventData: d.noop,
        _create: d.noop,
        _init: d.noop,
        destroy: function () {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(d.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
        },
        _destroy: d.noop,
        widget: function () {
            return this.element
        },
        option: function (l, j) {
            var g = l, h, k, e;
            if (arguments.length === 0) {
                return d.widget.extend({}, this.options)
            }
            if (typeof l == "string") {
                g = {}, h = l.split("."), l = h.shift();
                if (h.length) {
                    k = g[l] = d.widget.extend({}, this.options[l]);
                    for (e = 0; e < h.length - 1; e++) {
                        k[h[e]] = k[h[e]] || {}, k = k[h[e]]
                    }
                    l = h.pop();
                    if (j === b) {
                        return k[l] === b ? null : k[l]
                    }
                    k[l] = j
                } else {
                    if (j === b) {
                        return this.options[l] === b ? null : this.options[l]
                    }
                    g[l] = j
                }
            }
            return this._setOptions(g), this
        },
        _setOptions: function (h) {
            var g;
            for (g in h) {
                this._setOption(g, h[g])
            }
            return this
        },
        _setOption: function (h, g) {
            return this.options[h] = g, h === "disabled" && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!g).attr("aria-disabled", g), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
        },
        enable: function () {
            return this._setOption("disabled", !1)
        },
        disable: function () {
            return this._setOption("disabled", !0)
        },
        _on: function (g, k, j) {
            var e, h = this;
            typeof g != "boolean" && (j = k, k = g, g = !1), j ? (k = e = d(k), this.bindings = this.bindings.add(k)) : (j = k, k = this.element, e = this.widget()), d.each(j, function (p, s) {
                function n() {
                    if (!g && (h.options.disabled === !0 || d(this).hasClass("ui-state-disabled"))) {
                        return
                    }
                    return (typeof s == "string" ? h[s] : s).apply(h, arguments)
                }

                typeof s != "string" && (n.guid = s.guid = s.guid || n.guid || d.guid++);
                var m = p.match(/^(\w+)\s*(.*)$/), q = m[1] + h.eventNamespace, i = m[2];
                i ? e.delegate(i, q, n) : k.bind(q, n)
            })
        },
        _off: function (h, g) {
            g = (g || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, h.unbind(g).undelegate(g)
        },
        _delay: function (i, g) {
            function j() {
                return (typeof i == "string" ? h[i] : i).apply(h, arguments)
            }

            var h = this;
            return setTimeout(j, g || 0)
        },
        _hoverable: function (e) {
            this.hoverable = this.hoverable.add(e), this._on(e, {
                mouseenter: function (g) {
                    d(g.currentTarget).addClass("ui-state-hover")
                }, mouseleave: function (g) {
                    d(g.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function (e) {
            this.focusable = this.focusable.add(e), this._on(e, {
                focusin: function (g) {
                    d(g.currentTarget).addClass("ui-state-focus")
                }, focusout: function (g) {
                    d(g.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function (g, l, j) {
            var e, h, k = this.options[g];
            j = j || {}, l = d.Event(l), l.type = (g === this.widgetEventPrefix ? g : this.widgetEventPrefix + g).toLowerCase(), l.target = this.element[0], h = l.originalEvent;
            if (h) {
                for (e in h) {
                    e in l || (l[e] = h[e])
                }
            }
            return this.element.trigger(l, j), !(d.isFunction(k) && k.apply(this.element[0], [l].concat(j)) === !1 || l.isDefaultPrevented())
        }
    }, d.each({show: "fadeIn", hide: "fadeOut"}, function (e, g) {
        d.Widget.prototype["_" + e] = function (l, j, k) {
            typeof j == "string" && (j = {effect: j});
            var m, h = j ? j === !0 || typeof j == "number" ? g : j.effect || g : e;
            j = j || {}, typeof j == "number" && (j = {duration: j}), m = !d.isEmptyObject(j), j.complete = k, j.delay && l.delay(j.delay), m && d.effects && (d.effects.effect[h] || d.uiBackCompat !== !1 && d.effects[h]) ? l[e](j) : h !== e && l[h] ? l[h](j.duration, j.easing, k) : l.queue(function (i) {
                d(this)[e](), k && k.call(l[0]), i()
            })
        }
    }), d.uiBackCompat !== !1 && (d.Widget.prototype._getCreateOptions = function () {
        return d.metadata && d.metadata.get(this.element[0])[this.widgetName]
    })
})(jQuery);
(function (b, a) {
    var c = !1;
    b(document).mouseup(function (d) {
        c = !1
    }), b.widget("ui.mouse", {
        version: "1.9.2",
        options: {cancel: "input,textarea,button,select,option", distance: 1, delay: 0},
        _mouseInit: function () {
            var d = this;
            this.element.bind("mousedown." + this.widgetName, function (f) {
                return d._mouseDown(f)
            }).bind("click." + this.widgetName, function (e) {
                if (!0 === b.data(e.target, d.widgetName + ".preventClickEvent")) {
                    return b.removeData(e.target, d.widgetName + ".preventClickEvent"), e.stopImmediatePropagation(), !1
                }
            }), this.started = !1
        },
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && b(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function (e) {
            if (c) {
                return
            }
            this._mouseStarted && this._mouseUp(e), this._mouseDownEvent = e;
            var g = this, d = e.which === 1, f = typeof this.options.cancel == "string" && e.target.nodeName ? b(e.target).closest(this.options.cancel).length : !1;
            if (!d || f || !this._mouseCapture(e)) {
                return !0
            }
            this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
                g.mouseDelayMet = !0
            }, this.options.delay));
            if (this._mouseDistanceMet(e) && this._mouseDelayMet(e)) {
                this._mouseStarted = this._mouseStart(e) !== !1;
                if (!this._mouseStarted) {
                    return e.preventDefault(), !0
                }
            }
            return !0 === b.data(e.target, this.widgetName + ".preventClickEvent") && b.removeData(e.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (h) {
                return g._mouseMove(h)
            }, this._mouseUpDelegate = function (h) {
                return g._mouseUp(h)
            }, b(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), e.preventDefault(), c = !0, !0
        },
        _mouseMove: function (d) {
            return !b.ui.ie || document.documentMode >= 9 || !!d.button ? this._mouseStarted ? (this._mouseDrag(d), d.preventDefault()) : (this._mouseDistanceMet(d) && this._mouseDelayMet(d) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, d) !== !1, this._mouseStarted ? this._mouseDrag(d) : this._mouseUp(d)), !this._mouseStarted) : this._mouseUp(d)
        },
        _mouseUp: function (d) {
            return b(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, d.target === this._mouseDownEvent.target && b.data(d.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(d)), !1
        },
        _mouseDistanceMet: function (d) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - d.pageX), Math.abs(this._mouseDownEvent.pageY - d.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function (d) {
            return this.mouseDelayMet
        },
        _mouseStart: function (d) {
        },
        _mouseDrag: function (d) {
        },
        _mouseStop: function (d) {
        },
        _mouseCapture: function (d) {
            return !0
        }
    })
})(jQuery);
(function (w, A) {
    function q(c, a, f) {
        return [parseInt(c[0], 10) * (k.test(c[0]) ? a / 100 : 1), parseInt(c[1], 10) * (k.test(c[1]) ? f / 100 : 1)]
    }

    function d(a, c) {
        return parseInt(w.css(a, c), 10) || 0
    }

    w.ui = w.ui || {};
    var j, b = Math.max, m = Math.abs, B = Math.round, g = /left|center|right/, z = /top|center|bottom/, y = /[\+\-]\d+%?/, v = /^\w+/, k = /%$/, x = w.fn.position;
    w.position = {
        scrollbarWidth: function () {
            if (j !== A) {
                return j
            }
            var e, a, c = w("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"), f = c.children()[0];
            return w("body").append(c), e = f.offsetWidth, c.css("overflow", "scroll"), a = f.offsetWidth, e === a && (a = c[0].clientWidth), c.remove(), j = e - a
        }, getScrollInfo: function (c) {
            var h = c.isWindow ? "" : c.element.css("overflow-x"), f = c.isWindow ? "" : c.element.css("overflow-y"), a = h === "scroll" || h === "auto" && c.width < c.element[0].scrollWidth, e = f === "scroll" || f === "auto" && c.height < c.element[0].scrollHeight;
            return {width: a ? w.position.scrollbarWidth() : 0, height: e ? w.position.scrollbarWidth() : 0}
        }, getWithinInfo: function (a) {
            var e = w(a || window), c = w.isWindow(e[0]);
            return {
                element: e,
                isWindow: c,
                offset: e.offset() || {left: 0, top: 0},
                scrollLeft: e.scrollLeft(),
                scrollTop: e.scrollTop(),
                width: c ? e.width() : e.outerWidth(),
                height: c ? e.height() : e.outerHeight()
            }
        }
    }, w.fn.position = function (u) {
        if (!u || !u.of) {
            return x.apply(this, arguments)
        }
        u = w.extend({}, u);
        var a, e, i, s, c, h = w(u.of), p = w.position.getWithinInfo(u.within), o = w.position.getScrollInfo(p), r = h[0], C = (u.collision || "flip").split(" "), f = {};
        return r.nodeType === 9 ? (e = h.width(), i = h.height(), s = {
            top: 0,
            left: 0
        }) : w.isWindow(r) ? (e = h.width(), i = h.height(), s = {
            top: h.scrollTop(),
            left: h.scrollLeft()
        }) : r.preventDefault ? (u.at = "left top", e = i = 0, s = {
            top: r.pageY,
            left: r.pageX
        }) : (e = h.outerWidth(), i = h.outerHeight(), s = h.offset()), c = w.extend({}, s), w.each(["my", "at"], function () {
            var t = (u[this] || "").split(" "), D, l;
            t.length === 1 && (t = g.test(t[0]) ? t.concat(["center"]) : z.test(t[0]) ? ["center"].concat(t) : ["center", "center"]), t[0] = g.test(t[0]) ? t[0] : "center", t[1] = z.test(t[1]) ? t[1] : "center", D = y.exec(t[0]), l = y.exec(t[1]), f[this] = [D ? D[0] : 0, l ? l[0] : 0], u[this] = [v.exec(t[0])[0], v.exec(t[1])[0]]
        }), C.length === 1 && (C[1] = C[0]), u.at[0] === "right" ? c.left += e : u.at[0] === "center" && (c.left += e / 2), u.at[1] === "bottom" ? c.top += i : u.at[1] === "center" && (c.top += i / 2), a = q(f.at, e, i), c.left += a[0], c.top += a[1], this.each(function () {
            var n, K, H = w(this), E = H.outerWidth(), G = H.outerHeight(), J = d(this, "marginLeft"), I = d(this, "marginTop"), D = E + J + d(this, "marginRight") + o.width, F = G + I + d(this, "marginBottom") + o.height, l = w.extend({}, c), t = q(f.my, H.outerWidth(), H.outerHeight());
            u.my[0] === "right" ? l.left -= E : u.my[0] === "center" && (l.left -= E / 2), u.my[1] === "bottom" ? l.top -= G : u.my[1] === "center" && (l.top -= G / 2), l.left += t[0], l.top += t[1], w.support.offsetFractions || (l.left = B(l.left), l.top = B(l.top)), n = {
                marginLeft: J,
                marginTop: I
            }, w.each(["left", "top"], function (M, L) {
                w.ui.position[C[M]] && w.ui.position[C[M]][L](l, {
                    targetWidth: e,
                    targetHeight: i,
                    elemWidth: E,
                    elemHeight: G,
                    collisionPosition: n,
                    collisionWidth: D,
                    collisionHeight: F,
                    offset: [a[0] + t[0], a[1] + t[1]],
                    my: u.my,
                    at: u.at,
                    within: p,
                    elem: H
                })
            }), w.fn.bgiframe && H.bgiframe(), u.using && (K = function (O) {
                var Q = s.left - l.left, N = Q + e - E, P = s.top - l.top, L = P + i - G, M = {
                    target: {
                        element: h,
                        left: s.left,
                        top: s.top,
                        width: e,
                        height: i
                    },
                    element: {element: H, left: l.left, top: l.top, width: E, height: G},
                    horizontal: N < 0 ? "left" : Q > 0 ? "right" : "center",
                    vertical: L < 0 ? "top" : P > 0 ? "bottom" : "middle"
                };
                e < E && m(Q + N) < e && (M.horizontal = "center"), i < G && m(P + L) < i && (M.vertical = "middle"), b(m(Q), m(N)) > b(m(P), m(L)) ? M.important = "horizontal" : M.important = "vertical", u.using.call(this, O, M)
            }), H.offset(w.extend(l, {using: K}))
        })
    }, w.ui.position = {
        fit: {
            left: function (r, E) {
                var h = E.within, l = h.isWindow ? h.scrollLeft : h.offset.left, F = h.width, c = r.left - E.collisionPosition.marginLeft, D = l - c, C = c + E.collisionWidth - F - l, p;
                E.collisionWidth > F ? D > 0 && C <= 0 ? (p = r.left + D + E.collisionWidth - F - l, r.left += D - p) : C > 0 && D <= 0 ? r.left = l : D > C ? r.left = l + F - E.collisionWidth : r.left = l : D > 0 ? r.left += D : C > 0 ? r.left -= C : r.left = b(r.left - c, r.left)
            }, top: function (r, E) {
                var h = E.within, l = h.isWindow ? h.scrollTop : h.offset.top, F = E.within.height, c = r.top - E.collisionPosition.marginTop, D = l - c, C = c + E.collisionHeight - F - l, p;
                E.collisionHeight > F ? D > 0 && C <= 0 ? (p = r.top + D + E.collisionHeight - F - l, r.top += D - p) : C > 0 && D <= 0 ? r.top = l : D > C ? r.top = l + F - E.collisionHeight : r.top = l : D > 0 ? r.top += D : C > 0 ? r.top -= C : r.top = b(r.top - c, r.top)
            }
        }, flip: {
            left: function (I, N) {
                var E = N.within, i = E.offset.left + E.scrollLeft, O = E.width, D = E.isWindow ? E.scrollLeft : E.offset.left, M = I.left - N.collisionPosition.marginLeft, L = M - D, H = M + N.collisionWidth - O - D, F = N.my[0] === "left" ? -N.elemWidth : N.my[0] === "right" ? N.elemWidth : 0, K = N.at[0] === "left" ? N.targetWidth : N.at[0] === "right" ? -N.targetWidth : 0, G = -2 * N.offset[0], C, J;
                if (L < 0) {
                    C = I.left + F + K + G + N.collisionWidth - O - i;
                    if (C < 0 || C < m(L)) {
                        I.left += F + K + G
                    }
                } else {
                    if (H > 0) {
                        J = I.left - N.collisionPosition.marginLeft + F + K + G - D;
                        if (J > 0 || m(J) < H) {
                            I.left += F + K + G
                        }
                    }
                }
            }, top: function (I, O) {
                var E = O.within, i = E.offset.top + E.scrollTop, P = E.height, D = E.isWindow ? E.scrollTop : E.offset.top, N = I.top - O.collisionPosition.marginTop, L = N - D, H = N + O.collisionHeight - P - D, F = O.my[1] === "top", K = F ? -O.elemHeight : O.my[1] === "bottom" ? O.elemHeight : 0, G = O.at[1] === "top" ? O.targetHeight : O.at[1] === "bottom" ? -O.targetHeight : 0, C = -2 * O.offset[1], J, M;
                L < 0 ? (M = I.top + K + G + C + O.collisionHeight - P - i, I.top + K + G + C > L && (M < 0 || M < m(L)) && (I.top += K + G + C)) : H > 0 && (J = I.top - O.collisionPosition.marginTop + K + G + C - D, I.top + K + G + C > H && (J > 0 || m(J) < H) && (I.top += K + G + C))
            }
        }, flipfit: {
            left: function () {
                w.ui.position.flip.left.apply(this, arguments), w.ui.position.fit.left.apply(this, arguments)
            }, top: function () {
                w.ui.position.flip.top.apply(this, arguments), w.ui.position.fit.top.apply(this, arguments)
            }
        }
    }, function () {
        var e, p, h, c, f, l = document.getElementsByTagName("body")[0], a = document.createElement("div");
        e = document.createElement(l ? "div" : "body"), h = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        }, l && w.extend(h, {position: "absolute", left: "-1000px", top: "-1000px"});
        for (f in h) {
            e.style[f] = h[f]
        }
        e.appendChild(a), p = l || document.documentElement, p.insertBefore(e, p.firstChild), a.style.cssText = "position: absolute; left: 10.7432222px;", c = w(a).offset().left, w.support.offsetFractions = c > 10 && c < 11, e.innerHTML = "", p.removeChild(e)
    }(), w.uiBackCompat !== !1 && function (a) {
        var c = a.fn.position;
        a.fn.position = function (h) {
            if (!h || !h.offset) {
                return c.call(this, h)
            }
            var e = h.offset.split(" "), f = h.at.split(" ");
            return e.length === 1 && (e[1] = e[0]), /^\d/.test(e[0]) && (e[0] = "+" + e[0]), /^\d/.test(e[1]) && (e[1] = "+" + e[1]), f.length === 1 && (/left|center|right/.test(f[0]) ? f[1] = "center" : (f[1] = f[0], f[0] = "center")), c.call(this, a.extend(h, {
                at: f[0] + e[0] + " " + f[1] + e[1],
                offset: A
            }))
        }
    }(jQuery)
})(jQuery);
(function (b, a) {
    b.widget("ui.draggable", b.ui.mouse, {
        version: "1.9.2",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1
        },
        _create: function () {
            this.options.helper == "original" && !/^(?:r|a|f)/.test(this.element.css("position")) && (this.element[0].style.position = "relative"), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._mouseInit()
        },
        _destroy: function () {
            this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._mouseDestroy()
        },
        _mouseCapture: function (c) {
            var d = this.options;
            return this.helper || d.disabled || b(c.target).is(".ui-resizable-handle") ? !1 : (this.handle = this._getHandle(c), this.handle ? (b(d.iframeFix === !0 ? "iframe" : d.iframeFix).each(function () {
                b('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
                    width: this.offsetWidth + "px",
                    height: this.offsetHeight + "px",
                    position: "absolute",
                    opacity: "0.001",
                    zIndex: 1000
                }).css(b(this).offset()).appendTo("body")
            }), !0) : !1)
        },
        _mouseStart: function (c) {
            var d = this.options;
            return this.helper = this._createHelper(c), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), b.ui.ddmanager && (b.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offset = this.positionAbs = this.element.offset(), this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            }, b.extend(this.offset, {
                click: {left: c.pageX - this.offset.left, top: c.pageY - this.offset.top},
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }), this.originalPosition = this.position = this._generatePosition(c), this.originalPageX = c.pageX, this.originalPageY = c.pageY, d.cursorAt && this._adjustOffsetFromHelper(d.cursorAt), d.containment && this._setContainment(), this._trigger("start", c) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), b.ui.ddmanager && !d.dropBehaviour && b.ui.ddmanager.prepareOffsets(this, c), this._mouseDrag(c, !0), b.ui.ddmanager && b.ui.ddmanager.dragStart(this, c), !0)
        },
        _mouseDrag: function (c, e) {
            this.position = this._generatePosition(c), this.positionAbs = this._convertPositionTo("absolute");
            if (!e) {
                var d = this._uiHash();
                if (this._trigger("drag", c, d) === !1) {
                    return this._mouseUp({}), !1
                }
                this.position = d.position
            }
            if (!this.options.axis || this.options.axis != "y") {
                this.helper[0].style.left = this.position.left + "px"
            }
            if (!this.options.axis || this.options.axis != "x") {
                this.helper[0].style.top = this.position.top + "px"
            }
            return b.ui.ddmanager && b.ui.ddmanager.drag(this, c), !1
        },
        _mouseStop: function (d) {
            var g = !1;
            b.ui.ddmanager && !this.options.dropBehaviour && (g = b.ui.ddmanager.drop(this, d)), this.dropped && (g = this.dropped, this.dropped = !1);
            var f = this.element[0], c = !1;
            while (f && (f = f.parentNode)) {
                f == document && (c = !0)
            }
            if (!c && this.options.helper === "original") {
                return !1
            }
            if (this.options.revert == "invalid" && !g || this.options.revert == "valid" && g || this.options.revert === !0 || b.isFunction(this.options.revert) && this.options.revert.call(this.element, g)) {
                var e = this;
                b(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                    e._trigger("stop", d) !== !1 && e._clear()
                })
            } else {
                this._trigger("stop", d) !== !1 && this._clear()
            }
            return !1
        },
        _mouseUp: function (c) {
            return b("div.ui-draggable-iframeFix").each(function () {
                this.parentNode.removeChild(this)
            }), b.ui.ddmanager && b.ui.ddmanager.dragStop(this, c), b.ui.mouse.prototype._mouseUp.call(this, c)
        },
        cancel: function () {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this
        },
        _getHandle: function (c) {
            var d = !this.options.handle || !b(this.options.handle, this.element).length ? !0 : !1;
            return b(this.options.handle, this.element).find("*").andSelf().each(function () {
                this == c.target && (d = !0)
            }), d
        },
        _createHelper: function (c) {
            var e = this.options, d = b.isFunction(e.helper) ? b(e.helper.apply(this.element[0], [c])) : e.helper == "clone" ? this.element.clone().removeAttr("id") : this.element;
            return d.parents("body").length || d.appendTo(e.appendTo == "parent" ? this.element[0].parentNode : e.appendTo), d[0] != this.element[0] && !/(fixed|absolute)/.test(d.css("position")) && d.css("position", "absolute"), d
        },
        _adjustOffsetFromHelper: function (c) {
            typeof c == "string" && (c = c.split(" ")), b.isArray(c) && (c = {
                left: +c[0],
                top: +c[1] || 0
            }), "left" in c && (this.offset.click.left = c.left + this.margins.left), "right" in c && (this.offset.click.left = this.helperProportions.width - c.right + this.margins.left), "top" in c && (this.offset.click.top = c.top + this.margins.top), "bottom" in c && (this.offset.click.top = this.helperProportions.height - c.bottom + this.margins.top)
        },
        _getParentOffset: function () {
            this.offsetParent = this.helper.offsetParent();
            var c = this.offsetParent.offset();
            this.cssPosition == "absolute" && this.scrollParent[0] != document && b.contains(this.scrollParent[0], this.offsetParent[0]) && (c.left += this.scrollParent.scrollLeft(), c.top += this.scrollParent.scrollTop());
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && b.ui.ie) {
                c = {top: 0, left: 0}
            }
            return {
                top: c.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: c.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function () {
            if (this.cssPosition == "relative") {
                var c = this.element.position();
                return {
                    top: c.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: c.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            }
            return {top: 0, left: 0}
        },
        _cacheMargins: function () {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
        },
        _setContainment: function () {
            var d = this.options;
            d.containment == "parent" && (d.containment = this.helper[0].parentNode);
            if (d.containment == "document" || d.containment == "window") {
                this.containment = [d.containment == "document" ? 0 : b(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, d.containment == "document" ? 0 : b(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, (d.containment == "document" ? 0 : b(window).scrollLeft()) + b(d.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (d.containment == "document" ? 0 : b(window).scrollTop()) + (b(d.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]
            }
            if (!/^(document|window|parent)$/.test(d.containment) && d.containment.constructor != Array) {
                var g = b(d.containment), f = g[0];
                if (!f) {
                    return
                }
                var c = g.offset(), e = b(f).css("overflow") != "hidden";
                this.containment = [(parseInt(b(f).css("borderLeftWidth"), 10) || 0) + (parseInt(b(f).css("paddingLeft"), 10) || 0), (parseInt(b(f).css("borderTopWidth"), 10) || 0) + (parseInt(b(f).css("paddingTop"), 10) || 0), (e ? Math.max(f.scrollWidth, f.offsetWidth) : f.offsetWidth) - (parseInt(b(f).css("borderLeftWidth"), 10) || 0) - (parseInt(b(f).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (e ? Math.max(f.scrollHeight, f.offsetHeight) : f.offsetHeight) - (parseInt(b(f).css("borderTopWidth"), 10) || 0) - (parseInt(b(f).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = g
            } else {
                d.containment.constructor == Array && (this.containment = d.containment)
            }
        },
        _convertPositionTo: function (d, h) {
            h || (h = this.position);
            var f = d == "absolute" ? 1 : -1, c = this.options, e = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!b.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, g = /(html|body)/i.test(e[0].tagName);
            return {
                top: h.top + this.offset.relative.top * f + this.offset.parent.top * f - (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : g ? 0 : e.scrollTop()) * f,
                left: h.left + this.offset.relative.left * f + this.offset.parent.left * f - (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : g ? 0 : e.scrollLeft()) * f
            }
        },
        _generatePosition: function (p) {
            var e = this.options, c = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!b.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, h = /(html|body)/i.test(c[0].tagName), q = p.pageX, d = p.pageY;
            if (this.originalPosition) {
                var m;
                if (this.containment) {
                    if (this.relative_container) {
                        var k = this.relative_container.offset();
                        m = [this.containment[0] + k.left, this.containment[1] + k.top, this.containment[2] + k.left, this.containment[3] + k.top]
                    } else {
                        m = this.containment
                    }
                    p.pageX - this.offset.click.left < m[0] && (q = m[0] + this.offset.click.left), p.pageY - this.offset.click.top < m[1] && (d = m[1] + this.offset.click.top), p.pageX - this.offset.click.left > m[2] && (q = m[2] + this.offset.click.left), p.pageY - this.offset.click.top > m[3] && (d = m[3] + this.offset.click.top)
                }
                if (e.grid) {
                    var j = e.grid[1] ? this.originalPageY + Math.round((d - this.originalPageY) / e.grid[1]) * e.grid[1] : this.originalPageY;
                    d = m ? j - this.offset.click.top < m[1] || j - this.offset.click.top > m[3] ? j - this.offset.click.top < m[1] ? j + e.grid[1] : j - e.grid[1] : j : j;
                    var g = e.grid[0] ? this.originalPageX + Math.round((q - this.originalPageX) / e.grid[0]) * e.grid[0] : this.originalPageX;
                    q = m ? g - this.offset.click.left < m[0] || g - this.offset.click.left > m[2] ? g - this.offset.click.left < m[0] ? g + e.grid[0] : g - e.grid[0] : g : g
                }
            }
            return {
                top: d - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : h ? 0 : c.scrollTop()),
                left: q - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : h ? 0 : c.scrollLeft())
            }
        },
        _clear: function () {
            this.helper.removeClass("ui-draggable-dragging"), this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1
        },
        _trigger: function (c, e, d) {
            return d = d || this._uiHash(), b.ui.plugin.call(this, c, [e, d]), c == "drag" && (this.positionAbs = this._convertPositionTo("absolute")), b.Widget.prototype._trigger.call(this, c, e, d)
        },
        plugins: {},
        _uiHash: function (c) {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    }), b.ui.plugin.add("draggable", "connectToSortable", {
        start: function (d, g) {
            var f = b(this).data("draggable"), c = f.options, e = b.extend({}, g, {item: f.element});
            f.sortables = [], b(c.connectToSortable).each(function () {
                var h = b.data(this, "sortable");
                h && !h.options.disabled && (f.sortables.push({
                    instance: h,
                    shouldRevert: h.options.revert
                }), h.refreshPositions(), h._trigger("activate", d, e))
            })
        }, stop: function (d, f) {
            var e = b(this).data("draggable"), c = b.extend({}, f, {item: e.element});
            b.each(e.sortables, function () {
                this.instance.isOver ? (this.instance.isOver = 0, e.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = !0), this.instance._mouseStop(d), this.instance.options.helper = this.instance.options._helper, e.options.helper == "original" && this.instance.currentItem.css({
                    top: "auto",
                    left: "auto"
                })) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", d, c))
            })
        }, drag: function (d, g) {
            var f = b(this).data("draggable"), c = this, e = function (v) {
                var k = this.offset.click.top, h = this.offset.click.left, l = this.positionAbs.top, w = this.positionAbs.left, j = v.height, q = v.width, p = v.top, m = v.left;
                return b.ui.isOver(l + k, w + h, p, m, j, q)
            };
            b.each(f.sortables, function (i) {
                var j = !1, h = this;
                this.instance.positionAbs = f.positionAbs, this.instance.helperProportions = f.helperProportions, this.instance.offset.click = f.offset.click, this.instance._intersectsWith(this.instance.containerCache) && (j = !0, b.each(f.sortables, function () {
                    return this.instance.positionAbs = f.positionAbs, this.instance.helperProportions = f.helperProportions, this.instance.offset.click = f.offset.click, this != h && this.instance._intersectsWith(this.instance.containerCache) && b.ui.contains(h.instance.element[0], this.instance.element[0]) && (j = !1), j
                })), j ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = b(c).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function () {
                    return g.helper[0]
                }, d.target = this.instance.currentItem[0], this.instance._mouseCapture(d, !0), this.instance._mouseStart(d, !0, !0), this.instance.offset.click.top = f.offset.click.top, this.instance.offset.click.left = f.offset.click.left, this.instance.offset.parent.left -= f.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= f.offset.parent.top - this.instance.offset.parent.top, f._trigger("toSortable", d), f.dropped = this.instance.element, f.currentItem = f.element, this.instance.fromOutside = f), this.instance.currentItem && this.instance._mouseDrag(d)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", d, this.instance._uiHash(this.instance)), this.instance._mouseStop(d, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), f._trigger("fromSortable", d), f.dropped = !1)
            })
        }
    }), b.ui.plugin.add("draggable", "cursor", {
        start: function (d, f) {
            var e = b("body"), c = b(this).data("draggable").options;
            e.css("cursor") && (c._cursor = e.css("cursor")), e.css("cursor", c.cursor)
        }, stop: function (c, e) {
            var d = b(this).data("draggable").options;
            d._cursor && b("body").css("cursor", d._cursor)
        }
    }), b.ui.plugin.add("draggable", "opacity", {
        start: function (d, f) {
            var e = b(f.helper), c = b(this).data("draggable").options;
            e.css("opacity") && (c._opacity = e.css("opacity")), e.css("opacity", c.opacity)
        }, stop: function (c, e) {
            var d = b(this).data("draggable").options;
            d._opacity && b(e.helper).css("opacity", d._opacity)
        }
    }), b.ui.plugin.add("draggable", "scroll", {
        start: function (c, e) {
            var d = b(this).data("draggable");
            d.scrollParent[0] != document && d.scrollParent[0].tagName != "HTML" && (d.overflowOffset = d.scrollParent.offset())
        }, drag: function (d, g) {
            var f = b(this).data("draggable"), c = f.options, e = !1;
            if (f.scrollParent[0] != document && f.scrollParent[0].tagName != "HTML") {
                if (!c.axis || c.axis != "x") {
                    f.overflowOffset.top + f.scrollParent[0].offsetHeight - d.pageY < c.scrollSensitivity ? f.scrollParent[0].scrollTop = e = f.scrollParent[0].scrollTop + c.scrollSpeed : d.pageY - f.overflowOffset.top < c.scrollSensitivity && (f.scrollParent[0].scrollTop = e = f.scrollParent[0].scrollTop - c.scrollSpeed)
                }
                if (!c.axis || c.axis != "y") {
                    f.overflowOffset.left + f.scrollParent[0].offsetWidth - d.pageX < c.scrollSensitivity ? f.scrollParent[0].scrollLeft = e = f.scrollParent[0].scrollLeft + c.scrollSpeed : d.pageX - f.overflowOffset.left < c.scrollSensitivity && (f.scrollParent[0].scrollLeft = e = f.scrollParent[0].scrollLeft - c.scrollSpeed)
                }
            } else {
                if (!c.axis || c.axis != "x") {
                    d.pageY - b(document).scrollTop() < c.scrollSensitivity ? e = b(document).scrollTop(b(document).scrollTop() - c.scrollSpeed) : b(window).height() - (d.pageY - b(document).scrollTop()) < c.scrollSensitivity && (e = b(document).scrollTop(b(document).scrollTop() + c.scrollSpeed))
                }
                if (!c.axis || c.axis != "y") {
                    d.pageX - b(document).scrollLeft() < c.scrollSensitivity ? e = b(document).scrollLeft(b(document).scrollLeft() - c.scrollSpeed) : b(window).width() - (d.pageX - b(document).scrollLeft()) < c.scrollSensitivity && (e = b(document).scrollLeft(b(document).scrollLeft() + c.scrollSpeed))
                }
            }
            e !== !1 && b.ui.ddmanager && !c.dropBehaviour && b.ui.ddmanager.prepareOffsets(f, d)
        }
    }), b.ui.plugin.add("draggable", "snap", {
        start: function (d, f) {
            var e = b(this).data("draggable"), c = e.options;
            e.snapElements = [], b(c.snap.constructor != String ? c.snap.items || ":data(draggable)" : c.snap).each(function () {
                var g = b(this), h = g.offset();
                this != e.element[0] && e.snapElements.push({
                    item: this,
                    width: g.outerWidth(),
                    height: g.outerHeight(),
                    top: h.top,
                    left: h.left
                })
            })
        }, drag: function (q, B) {
            var x = b(this).data("draggable"), E = x.options, w = E.snapTolerance, A = B.offset.left, k = A + x.helperProportions.width, L = B.offset.top, H = L + x.helperProportions.height;
            for (var D = x.snapElements.length - 1; D >= 0; D--) {
                var J = x.snapElements[D].left, F = J + x.snapElements[D].width, z = x.snapElements[D].top, I = z + x.snapElements[D].height;
                if (!(J - w < A && A < F + w && z - w < L && L < I + w || J - w < A && A < F + w && z - w < H && H < I + w || J - w < k && k < F + w && z - w < L && L < I + w || J - w < k && k < F + w && z - w < H && H < I + w)) {
                    x.snapElements[D].snapping && x.options.snap.release && x.options.snap.release.call(x.element, q, b.extend(x._uiHash(), {snapItem: x.snapElements[D].item})), x.snapElements[D].snapping = !1;
                    continue
                }
                if (E.snapMode != "inner") {
                    var j = Math.abs(z - H) <= w, C = Math.abs(I - L) <= w, G = Math.abs(J - k) <= w, e = Math.abs(F - A) <= w;
                    j && (B.position.top = x._convertPositionTo("relative", {
                            top: z - x.helperProportions.height,
                            left: 0
                        }).top - x.margins.top), C && (B.position.top = x._convertPositionTo("relative", {
                            top: I,
                            left: 0
                        }).top - x.margins.top), G && (B.position.left = x._convertPositionTo("relative", {
                            top: 0,
                            left: J - x.helperProportions.width
                        }).left - x.margins.left), e && (B.position.left = x._convertPositionTo("relative", {
                            top: 0,
                            left: F
                        }).left - x.margins.left)
                }
                var K = j || C || G || e;
                if (E.snapMode != "outer") {
                    var j = Math.abs(z - L) <= w, C = Math.abs(I - H) <= w, G = Math.abs(J - A) <= w, e = Math.abs(F - k) <= w;
                    j && (B.position.top = x._convertPositionTo("relative", {
                            top: z,
                            left: 0
                        }).top - x.margins.top), C && (B.position.top = x._convertPositionTo("relative", {
                            top: I - x.helperProportions.height,
                            left: 0
                        }).top - x.margins.top), G && (B.position.left = x._convertPositionTo("relative", {
                            top: 0,
                            left: J
                        }).left - x.margins.left), e && (B.position.left = x._convertPositionTo("relative", {
                            top: 0,
                            left: F - x.helperProportions.width
                        }).left - x.margins.left)
                }
                !x.snapElements[D].snapping && (j || C || G || e || K) && x.options.snap.snap && x.options.snap.snap.call(x.element, q, b.extend(x._uiHash(), {snapItem: x.snapElements[D].item})), x.snapElements[D].snapping = j || C || G || e || K
            }
        }
    }), b.ui.plugin.add("draggable", "stack", {
        start: function (d, g) {
            var f = b(this).data("draggable").options, c = b.makeArray(b(f.stack)).sort(function (h, i) {
                return (parseInt(b(h).css("zIndex"), 10) || 0) - (parseInt(b(i).css("zIndex"), 10) || 0)
            });
            if (!c.length) {
                return
            }
            var e = parseInt(c[0].style.zIndex) || 0;
            b(c).each(function (h) {
                this.style.zIndex = e + h
            }), this[0].style.zIndex = e + c.length
        }
    }), b.ui.plugin.add("draggable", "zIndex", {
        start: function (d, f) {
            var e = b(f.helper), c = b(this).data("draggable").options;
            e.css("zIndex") && (c._zIndex = e.css("zIndex")), e.css("zIndex", c.zIndex)
        }, stop: function (c, e) {
            var d = b(this).data("draggable").options;
            d._zIndex && b(e.helper).css("zIndex", d._zIndex)
        }
    })
})(jQuery);
(function (b, a) {
    b.widget("ui.droppable", {
        version: "1.9.2",
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: !1,
            addClasses: !0,
            greedy: !1,
            hoverClass: !1,
            scope: "default",
            tolerance: "intersect"
        },
        _create: function () {
            var c = this.options, d = c.accept;
            this.isover = 0, this.isout = 1, this.accept = b.isFunction(d) ? d : function (f) {
                return f.is(d)
            }, this.proportions = {
                width: this.element[0].offsetWidth,
                height: this.element[0].offsetHeight
            }, b.ui.ddmanager.droppables[c.scope] = b.ui.ddmanager.droppables[c.scope] || [], b.ui.ddmanager.droppables[c.scope].push(this), c.addClasses && this.element.addClass("ui-droppable")
        },
        _destroy: function () {
            var c = b.ui.ddmanager.droppables[this.options.scope];
            for (var d = 0; d < c.length; d++) {
                c[d] == this && c.splice(d, 1)
            }
            this.element.removeClass("ui-droppable ui-droppable-disabled")
        },
        _setOption: function (c, d) {
            c == "accept" && (this.accept = b.isFunction(d) ? d : function (f) {
                return f.is(d)
            }), b.Widget.prototype._setOption.apply(this, arguments)
        },
        _activate: function (c) {
            var d = b.ui.ddmanager.current;
            this.options.activeClass && this.element.addClass(this.options.activeClass), d && this._trigger("activate", c, this.ui(d))
        },
        _deactivate: function (c) {
            var d = b.ui.ddmanager.current;
            this.options.activeClass && this.element.removeClass(this.options.activeClass), d && this._trigger("deactivate", c, this.ui(d))
        },
        _over: function (c) {
            var d = b.ui.ddmanager.current;
            if (!d || (d.currentItem || d.element)[0] == this.element[0]) {
                return
            }
            this.accept.call(this.element[0], d.currentItem || d.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass), this._trigger("over", c, this.ui(d)))
        },
        _out: function (c) {
            var d = b.ui.ddmanager.current;
            if (!d || (d.currentItem || d.element)[0] == this.element[0]) {
                return
            }
            this.accept.call(this.element[0], d.currentItem || d.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", c, this.ui(d)))
        },
        _drop: function (d, f) {
            var e = f || b.ui.ddmanager.current;
            if (!e || (e.currentItem || e.element)[0] == this.element[0]) {
                return !1
            }
            var c = !1;
            return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function () {
                var g = b.data(this, "droppable");
                if (g.options.greedy && !g.options.disabled && g.options.scope == e.options.scope && g.accept.call(g.element[0], e.currentItem || e.element) && b.ui.intersect(e, b.extend(g, {offset: g.element.offset()}), g.options.tolerance)) {
                    return c = !0, !1
                }
            }), c ? !1 : this.accept.call(this.element[0], e.currentItem || e.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", d, this.ui(e)), this.element) : !1
        },
        ui: function (c) {
            return {
                draggable: c.currentItem || c.element,
                helper: c.helper,
                position: c.position,
                offset: c.positionAbs
            }
        }
    }), b.ui.intersect = function (B, k, e) {
        if (!k.offset) {
            return !1
        }
        var q = (B.positionAbs || B.position.absolute).left, C = q + B.helperProportions.width, j = (B.positionAbs || B.position.absolute).top, A = j + B.helperProportions.height, z = k.offset.left, w = z + k.proportions.width, m = k.offset.top, y = m + k.proportions.height;
        switch (e) {
            case"fit":
                return z <= q && C <= w && m <= j && A <= y;
            case"intersect":
                return z < q + B.helperProportions.width / 2 && C - B.helperProportions.width / 2 < w && m < j + B.helperProportions.height / 2 && A - B.helperProportions.height / 2 < y;
            case"pointer":
                var v = (B.positionAbs || B.position.absolute).left + (B.clickOffset || B.offset.click).left, g = (B.positionAbs || B.position.absolute).top + (B.clickOffset || B.offset.click).top, x = b.ui.isOver(g, v, m, z, k.proportions.height, k.proportions.width);
                return x;
            case"touch":
                return (j >= m && j <= y || A >= m && A <= y || j < m && A > y) && (q >= z && q <= w || C >= z && C <= w || q < z && C > w);
            default:
                return !1
        }
    }, b.ui.ddmanager = {
        current: null, droppables: {"default": []}, prepareOffsets: function (e, j) {
            var g = b.ui.ddmanager.droppables[e.options.scope] || [], d = j ? j.type : null, f = (e.currentItem || e.element).find(":data(droppable)").andSelf();
            b:for (var h = 0; h < g.length; h++) {
                if (g[h].options.disabled || e && !g[h].accept.call(g[h].element[0], e.currentItem || e.element)) {
                    continue
                }
                for (var c = 0; c < f.length; c++) {
                    if (f[c] == g[h].element[0]) {
                        g[h].proportions.height = 0;
                        continue b
                    }
                }
                g[h].visible = g[h].element.css("display") != "none";
                if (!g[h].visible) {
                    continue
                }
                d == "mousedown" && g[h]._activate.call(g[h], j), g[h].offset = g[h].element.offset(), g[h].proportions = {
                    width: g[h].element[0].offsetWidth,
                    height: g[h].element[0].offsetHeight
                }
            }
        }, drop: function (c, e) {
            var d = !1;
            return b.each(b.ui.ddmanager.droppables[c.options.scope] || [], function () {
                if (!this.options) {
                    return
                }
                !this.options.disabled && this.visible && b.ui.intersect(c, this, this.options.tolerance) && (d = this._drop.call(this, e) || d), !this.options.disabled && this.visible && this.accept.call(this.element[0], c.currentItem || c.element) && (this.isout = 1, this.isover = 0, this._deactivate.call(this, e))
            }), d
        }, dragStart: function (c, d) {
            c.element.parentsUntil("body").bind("scroll.droppable", function () {
                c.options.refreshPositions || b.ui.ddmanager.prepareOffsets(c, d)
            })
        }, drag: function (c, d) {
            c.options.refreshPositions && b.ui.ddmanager.prepareOffsets(c, d), b.each(b.ui.ddmanager.droppables[c.options.scope] || [], function () {
                if (this.options.disabled || this.greedyChild || !this.visible) {
                    return
                }
                var h = b.ui.intersect(c, this, this.options.tolerance), f = !h && this.isover == 1 ? "isout" : h && this.isover == 0 ? "isover" : null;
                if (!f) {
                    return
                }
                var g;
                if (this.options.greedy) {
                    var j = this.options.scope, e = this.element.parents(":data(droppable)").filter(function () {
                        return b.data(this, "droppable").options.scope === j
                    });
                    e.length && (g = b.data(e[0], "droppable"), g.greedyChild = f == "isover" ? 1 : 0)
                }
                g && f == "isover" && (g.isover = 0, g.isout = 1, g._out.call(g, d)), this[f] = 1, this[f == "isout" ? "isover" : "isout"] = 0, this[f == "isover" ? "_over" : "_out"].call(this, d), g && f == "isout" && (g.isout = 0, g.isover = 1, g._over.call(g, d))
            })
        }, dragStop: function (c, d) {
            c.element.parentsUntil("body").unbind("scroll.droppable"), c.options.refreshPositions || b.ui.ddmanager.prepareOffsets(c, d)
        }
    }
})(jQuery);
(function (c, a) {
    c.widget("ui.resizable", c.ui.mouse, {
        version: "1.9.2",
        widgetEventPrefix: "resize",
        options: {
            alsoResize: !1,
            animate: !1,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: !1,
            autoHide: !1,
            containment: !1,
            ghost: !1,
            grid: !1,
            handles: "e,s,se",
            helper: !1,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            zIndex: 1000
        },
        _create: function () {
            var g = this, l = this.options;
            this.element.addClass("ui-resizable"), c.extend(this, {
                _aspectRatio: !!l.aspectRatio,
                aspectRatio: l.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: l.helper || l.ghost || l.animate ? l.helper || "ui-resizable-helper" : null
            }), this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i) && (this.element.wrap(c('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
                position: this.element.css("position"),
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                top: this.element.css("top"),
                left: this.element.css("left")
            })), this.element = this.element.parent().data("resizable", this.element.data("resizable")), this.elementIsWrapper = !0, this.element.css({
                marginLeft: this.originalElement.css("marginLeft"),
                marginTop: this.originalElement.css("marginTop"),
                marginRight: this.originalElement.css("marginRight"),
                marginBottom: this.originalElement.css("marginBottom")
            }), this.originalElement.css({
                marginLeft: 0,
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0
            }), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({
                position: "static",
                zoom: 1,
                display: "block"
            })), this.originalElement.css({margin: this.originalElement.css("margin")}), this._proportionallyResize()), this.handles = l.handles || (c(".ui-resizable-handle", this.element).length ? {
                    n: ".ui-resizable-n",
                    e: ".ui-resizable-e",
                    s: ".ui-resizable-s",
                    w: ".ui-resizable-w",
                    se: ".ui-resizable-se",
                    sw: ".ui-resizable-sw",
                    ne: ".ui-resizable-ne",
                    nw: ".ui-resizable-nw"
                } : "e,s,se");
            if (this.handles.constructor == String) {
                this.handles == "all" && (this.handles = "n,e,s,w,se,sw,ne,nw");
                var j = this.handles.split(",");
                this.handles = {};
                for (var f = 0; f < j.length; f++) {
                    var h = c.trim(j[f]), k = "ui-resizable-" + h, e = c('<div class="ui-resizable-handle ' + k + '"></div>');
                    e.css({zIndex: l.zIndex}), "se" == h && e.addClass("ui-icon ui-icon-gripsmall-diagonal-se"), this.handles[h] = ".ui-resizable-" + h, this.element.append(e)
                }
            }
            this._renderAxis = function (o) {
                o = o || this.element;
                for (var u in this.handles) {
                    this.handles[u].constructor == String && (this.handles[u] = c(this.handles[u], this.element).show());
                    if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
                        var q = c(this.handles[u], this.element), m = 0;
                        m = /sw|ne|nw|se|n|s/.test(u) ? q.outerHeight() : q.outerWidth();
                        var p = ["padding", /ne|nw|n/.test(u) ? "Top" : /se|sw|s/.test(u) ? "Bottom" : /^e$/.test(u) ? "Right" : "Left"].join("");
                        o.css(p, m), this._proportionallyResize()
                    }
                    if (!c(this.handles[u]).length) {
                        continue
                    }
                }
            }, this._renderAxis(this.element), this._handles = c(".ui-resizable-handle", this.element).disableSelection(), this._handles.mouseover(function () {
                if (!g.resizing) {
                    if (this.className) {
                        var i = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)
                    }
                    g.axis = i && i[1] ? i[1] : "se"
                }
            }), l.autoHide && (this._handles.hide(), c(this.element).addClass("ui-resizable-autohide").mouseenter(function () {
                if (l.disabled) {
                    return
                }
                c(this).removeClass("ui-resizable-autohide"), g._handles.show()
            }).mouseleave(function () {
                if (l.disabled) {
                    return
                }
                g.resizing || (c(this).addClass("ui-resizable-autohide"), g._handles.hide())
            })), this._mouseInit()
        },
        _destroy: function () {
            this._mouseDestroy();
            var e = function (g) {
                c(g).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
            };
            if (this.elementIsWrapper) {
                e(this.element);
                var f = this.element;
                this.originalElement.css({
                    position: f.css("position"),
                    width: f.outerWidth(),
                    height: f.outerHeight(),
                    top: f.css("top"),
                    left: f.css("left")
                }).insertAfter(f), f.remove()
            }
            return this.originalElement.css("resize", this.originalResizeStyle), e(this.originalElement), this
        },
        _mouseCapture: function (e) {
            var g = !1;
            for (var f in this.handles) {
                c(this.handles[f])[0] == e.target && (g = !0)
            }
            return !this.options.disabled && g
        },
        _mouseStart: function (h) {
            var k = this.options, g = this.element.position(), j = this.element;
            this.resizing = !0, this.documentScroll = {
                top: c(document).scrollTop(),
                left: c(document).scrollLeft()
            }, (j.is(".ui-draggable") || /absolute/.test(j.css("position"))) && j.css({
                position: "absolute",
                top: g.top,
                left: g.left
            }), this._renderProxy();
            var l = d(this.helper.css("left")), f = d(this.helper.css("top"));
            k.containment && (l += c(k.containment).scrollLeft() || 0, f += c(k.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = {
                left: l,
                top: f
            }, this.size = this._helper ? {width: j.outerWidth(), height: j.outerHeight()} : {
                width: j.width(),
                height: j.height()
            }, this.originalSize = this._helper ? {width: j.outerWidth(), height: j.outerHeight()} : {
                width: j.width(),
                height: j.height()
            }, this.originalPosition = {left: l, top: f}, this.sizeDiff = {
                width: j.outerWidth() - j.width(),
                height: j.outerHeight() - j.height()
            }, this.originalMousePosition = {
                left: h.pageX,
                top: h.pageY
            }, this.aspectRatio = typeof k.aspectRatio == "number" ? k.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
            var e = c(".ui-resizable-" + this.axis).css("cursor");
            return c("body").css("cursor", e == "auto" ? this.axis + "-resize" : e), j.addClass("ui-resizable-resizing"), this._propagate("start", h), !0
        },
        _mouseDrag: function (q) {
            var x = this.helper, j = this.options, g = {}, m = this, y = this.originalMousePosition, h = this.axis, w = q.pageX - y.left || 0, v = q.pageY - y.top || 0, p = this._change[h];
            if (!p) {
                return !1
            }
            var k = p.apply(this, [q, w, v]);
            this._updateVirtualBoundaries(q.shiftKey);
            if (this._aspectRatio || q.shiftKey) {
                k = this._updateRatio(k, q)
            }
            return k = this._respectSize(k, q), this._propagate("resize", q), x.css({
                top: this.position.top + "px",
                left: this.position.left + "px",
                width: this.size.width + "px",
                height: this.size.height + "px"
            }), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), this._updateCache(k), this._trigger("resize", q, this.ui()), !1
        },
        _mouseStop: function (v) {
            this.resizing = !1;
            var h = this.options, e = this;
            if (this._helper) {
                var k = this._proportionallyResizeElements, w = k.length && /textarea/i.test(k[0].nodeName), g = w && c.ui.hasScroll(k[0], "left") ? 0 : e.sizeDiff.height, q = w ? 0 : e.sizeDiff.width, p = {
                    width: e.helper.width() - q,
                    height: e.helper.height() - g
                }, m = parseInt(e.element.css("left"), 10) + (e.position.left - e.originalPosition.left) || null, j = parseInt(e.element.css("top"), 10) + (e.position.top - e.originalPosition.top) || null;
                h.animate || this.element.css(c.extend(p, {
                    top: j,
                    left: m
                })), e.helper.height(e.size.height), e.helper.width(e.size.width), this._helper && !h.animate && this._proportionallyResize()
            }
            return c("body").css("cursor", "auto"), this.element.removeClass("ui-resizable-resizing"), this._propagate("stop", v), this._helper && this.helper.remove(), !1
        },
        _updateVirtualBoundaries: function (k) {
            var h = this.options, m, g, j, l, f;
            f = {
                minWidth: b(h.minWidth) ? h.minWidth : 0,
                maxWidth: b(h.maxWidth) ? h.maxWidth : Infinity,
                minHeight: b(h.minHeight) ? h.minHeight : 0,
                maxHeight: b(h.maxHeight) ? h.maxHeight : Infinity
            };
            if (this._aspectRatio || k) {
                m = f.minHeight * this.aspectRatio, j = f.minWidth / this.aspectRatio, g = f.maxHeight * this.aspectRatio, l = f.maxWidth / this.aspectRatio, m > f.minWidth && (f.minWidth = m), j > f.minHeight && (f.minHeight = j), g < f.maxWidth && (f.maxWidth = g), l < f.maxHeight && (f.maxHeight = l)
            }
            this._vBoundaries = f
        },
        _updateCache: function (g) {
            var f = this.options;
            this.offset = this.helper.offset(), b(g.left) && (this.position.left = g.left), b(g.top) && (this.position.top = g.top), b(g.height) && (this.size.height = g.height), b(g.width) && (this.size.width = g.width)
        },
        _updateRatio: function (j, g) {
            var l = this.options, f = this.position, h = this.size, k = this.axis;
            return b(j.height) ? j.width = j.height * this.aspectRatio : b(j.width) && (j.height = j.width / this.aspectRatio), k == "sw" && (j.left = f.left + (h.width - j.width), j.top = null), k == "nw" && (j.top = f.top + (h.height - j.height), j.left = f.left + (h.width - j.width)), j
        },
        _respectSize: function (x, D) {
            var k = this.helper, q = this._vBoundaries, E = this._aspectRatio || D.shiftKey, j = this.axis, C = b(x.width) && q.maxWidth && q.maxWidth < x.width, A = b(x.height) && q.maxHeight && q.maxHeight < x.height, w = b(x.width) && q.minWidth && q.minWidth > x.width, m = b(x.height) && q.minHeight && q.minHeight > x.height;
            w && (x.width = q.minWidth), m && (x.height = q.minHeight), C && (x.width = q.maxWidth), A && (x.height = q.maxHeight);
            var z = this.originalPosition.left + this.originalSize.width, r = this.position.top + this.size.height, g = /sw|nw|w/.test(j), y = /nw|ne|n/.test(j);
            w && g && (x.left = z - q.minWidth), C && g && (x.left = z - q.maxWidth), m && y && (x.top = r - q.minHeight), A && y && (x.top = r - q.maxHeight);
            var B = !x.width && !x.height;
            return B && !x.left && x.top ? x.top = null : B && !x.top && x.left && (x.left = null), x
        },
        _proportionallyResize: function () {
            var f = this.options;
            if (!this._proportionallyResizeElements.length) {
                return
            }
            var k = this.helper || this.element;
            for (var h = 0; h < this._proportionallyResizeElements.length; h++) {
                var e = this._proportionallyResizeElements[h];
                if (!this.borderDif) {
                    var g = [e.css("borderTopWidth"), e.css("borderRightWidth"), e.css("borderBottomWidth"), e.css("borderLeftWidth")], j = [e.css("paddingTop"), e.css("paddingRight"), e.css("paddingBottom"), e.css("paddingLeft")];
                    this.borderDif = c.map(g, function (m, i) {
                        var o = parseInt(m, 10) || 0, l = parseInt(j[i], 10) || 0;
                        return o + l
                    })
                }
                e.css({
                    height: k.height() - this.borderDif[0] - this.borderDif[2] || 0,
                    width: k.width() - this.borderDif[1] - this.borderDif[3] || 0
                })
            }
        },
        _renderProxy: function () {
            var f = this.element, h = this.options;
            this.elementOffset = f.offset();
            if (this._helper) {
                this.helper = this.helper || c('<div style="overflow:hidden;"></div>');
                var g = c.ui.ie6 ? 1 : 0, e = c.ui.ie6 ? 2 : -1;
                this.helper.addClass(this._helper).css({
                    width: this.element.outerWidth() + e,
                    height: this.element.outerHeight() + e,
                    position: "absolute",
                    left: this.elementOffset.left - g + "px",
                    top: this.elementOffset.top - g + "px",
                    zIndex: ++h.zIndex
                }), this.helper.appendTo("body").disableSelection()
            } else {
                this.helper = this.element
            }
        },
        _change: {
            e: function (g, f, h) {
                return {width: this.originalSize.width + f}
            }, w: function (k, g, l) {
                var j = this.options, f = this.originalSize, h = this.originalPosition;
                return {left: h.left + g, width: f.width - g}
            }, n: function (k, g, l) {
                var j = this.options, f = this.originalSize, h = this.originalPosition;
                return {top: h.top + l, height: f.height - l}
            }, s: function (g, f, h) {
                return {height: this.originalSize.height + h}
            }, se: function (e, g, f) {
                return c.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [e, g, f]))
            }, sw: function (e, g, f) {
                return c.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [e, g, f]))
            }, ne: function (e, g, f) {
                return c.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [e, g, f]))
            }, nw: function (e, g, f) {
                return c.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [e, g, f]))
            }
        },
        _propagate: function (e, f) {
            c.ui.plugin.call(this, e, [f, this.ui()]), e != "resize" && this._trigger(e, f, this.ui())
        },
        plugins: {},
        ui: function () {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            }
        }
    }), c.ui.plugin.add("resizable", "alsoResize", {
        start: function (f, j) {
            var h = c(this).data("resizable"), e = h.options, g = function (i) {
                c(i).each(function () {
                    var k = c(this);
                    k.data("resizable-alsoresize", {
                        width: parseInt(k.width(), 10),
                        height: parseInt(k.height(), 10),
                        left: parseInt(k.css("left"), 10),
                        top: parseInt(k.css("top"), 10)
                    })
                })
            };
            typeof e.alsoResize == "object" && !e.alsoResize.parentNode ? e.alsoResize.length ? (e.alsoResize = e.alsoResize[0], g(e.alsoResize)) : c.each(e.alsoResize, function (i) {
                g(i)
            }) : g(e.alsoResize)
        }, resize: function (h, m) {
            var k = c(this).data("resizable"), g = k.options, j = k.originalSize, l = k.originalPosition, f = {
                height: k.size.height - j.height || 0,
                width: k.size.width - j.width || 0,
                top: k.position.top - l.top || 0,
                left: k.position.left - l.left || 0
            }, e = function (i, n) {
                c(i).each(function () {
                    var q = c(this), p = c(this).data("resizable-alsoresize"), r = {}, u = n && n.length ? n : q.parents(m.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                    c.each(u, function (s, o) {
                        var v = (p[o] || 0) + (f[o] || 0);
                        v && v >= 0 && (r[o] = v || null)
                    }), q.css(r)
                })
            };
            typeof g.alsoResize == "object" && !g.alsoResize.nodeType ? c.each(g.alsoResize, function (n, i) {
                e(n, i)
            }) : e(g.alsoResize)
        }, stop: function (e, f) {
            c(this).removeData("resizable-alsoresize")
        }
    }), c.ui.plugin.add("resizable", "animate", {
        stop: function (w, h) {
            var e = c(this).data("resizable"), k = e.options, x = e._proportionallyResizeElements, g = x.length && /textarea/i.test(x[0].nodeName), v = g && c.ui.hasScroll(x[0], "left") ? 0 : e.sizeDiff.height, q = g ? 0 : e.sizeDiff.width, m = {
                width: e.size.width - q,
                height: e.size.height - v
            }, j = parseInt(e.element.css("left"), 10) + (e.position.left - e.originalPosition.left) || null, p = parseInt(e.element.css("top"), 10) + (e.position.top - e.originalPosition.top) || null;
            e.element.animate(c.extend(m, p && j ? {top: p, left: j} : {}), {
                duration: k.animateDuration,
                easing: k.animateEasing,
                step: function () {
                    var f = {
                        width: parseInt(e.element.css("width"), 10),
                        height: parseInt(e.element.css("height"), 10),
                        top: parseInt(e.element.css("top"), 10),
                        left: parseInt(e.element.css("left"), 10)
                    };
                    x && x.length && c(x[0]).css({
                        width: f.width,
                        height: f.height
                    }), e._updateCache(f), e._propagate("resize", w)
                }
            })
        }
    }), c.ui.plugin.add("resizable", "containment", {
        start: function (B, e) {
            var m = c(this).data("resizable"), C = m.options, j = m.element, A = C.containment, y = A instanceof c ? A.get(0) : /parent/.test(A) ? j.parent().get(0) : A;
            if (!y) {
                return
            }
            m.containerElement = c(y);
            if (/document/.test(A) || A == document) {
                m.containerOffset = {left: 0, top: 0}, m.containerPosition = {
                    left: 0,
                    top: 0
                }, m.parentData = {
                    element: c(document),
                    left: 0,
                    top: 0,
                    width: c(document).width(),
                    height: c(document).height() || document.body.parentNode.scrollHeight
                }
            } else {
                var q = c(y), k = [];
                c(["Top", "Right", "Left", "Bottom"]).each(function (h, f) {
                    k[h] = d(q.css("padding" + f))
                }), m.containerOffset = q.offset(), m.containerPosition = q.position(), m.containerSize = {
                    height: q.innerHeight() - k[3],
                    width: q.innerWidth() - k[1]
                };
                var x = m.containerOffset, n = m.containerSize.height, g = m.containerSize.width, w = c.ui.hasScroll(y, "left") ? y.scrollWidth : g, z = c.ui.hasScroll(y) ? y.scrollHeight : n;
                m.parentData = {element: y, left: x.left, top: x.top, width: w, height: z}
            }
        }, resize: function (D, k) {
            var e = c(this).data("resizable"), q = e.options, E = e.containerSize, j = e.containerOffset, C = e.size, A = e.position, x = e._aspectRatio || D.shiftKey, m = {
                top: 0,
                left: 0
            }, z = e.containerElement;
            z[0] != document && /static/.test(z.css("position")) && (m = j), A.left < (e._helper ? j.left : 0) && (e.size.width = e.size.width + (e._helper ? e.position.left - j.left : e.position.left - m.left), x && (e.size.height = e.size.width / e.aspectRatio), e.position.left = q.helper ? j.left : 0), A.top < (e._helper ? j.top : 0) && (e.size.height = e.size.height + (e._helper ? e.position.top - j.top : e.position.top), x && (e.size.width = e.size.height * e.aspectRatio), e.position.top = e._helper ? j.top : 0), e.offset.left = e.parentData.left + e.position.left, e.offset.top = e.parentData.top + e.position.top;
            var w = Math.abs((e._helper ? e.offset.left - m.left : e.offset.left - m.left) + e.sizeDiff.width), g = Math.abs((e._helper ? e.offset.top - m.top : e.offset.top - j.top) + e.sizeDiff.height), y = e.containerElement.get(0) == e.element.parent().get(0), B = /relative|absolute/.test(e.containerElement.css("position"));
            y && B && (w -= e.parentData.left), w + e.size.width >= e.parentData.width && (e.size.width = e.parentData.width - w, x && (e.size.height = e.size.width / e.aspectRatio)), g + e.size.height >= e.parentData.height && (e.size.height = e.parentData.height - g, x && (e.size.width = e.size.height * e.aspectRatio))
        }, stop: function (y, j) {
            var e = c(this).data("resizable"), m = e.options, z = e.position, g = e.containerOffset, x = e.containerPosition, w = e.containerElement, q = c(e.helper), k = q.offset(), v = q.outerWidth() - e.sizeDiff.width, p = q.outerHeight() - e.sizeDiff.height;
            e._helper && !m.animate && /relative/.test(w.css("position")) && c(this).css({
                left: k.left - x.left - g.left,
                width: v,
                height: p
            }), e._helper && !m.animate && /static/.test(w.css("position")) && c(this).css({
                left: k.left - x.left - g.left,
                width: v,
                height: p
            })
        }
    }), c.ui.plugin.add("resizable", "ghost", {
        start: function (f, j) {
            var h = c(this).data("resizable"), e = h.options, g = h.size;
            h.ghost = h.originalElement.clone(), h.ghost.css({
                opacity: 0.25,
                display: "block",
                position: "relative",
                height: g.height,
                width: g.width,
                margin: 0,
                left: 0,
                top: 0
            }).addClass("ui-resizable-ghost").addClass(typeof e.ghost == "string" ? e.ghost : ""), h.ghost.appendTo(h.helper)
        }, resize: function (f, h) {
            var g = c(this).data("resizable"), e = g.options;
            g.ghost && g.ghost.css({position: "relative", height: g.size.height, width: g.size.width})
        }, stop: function (f, h) {
            var g = c(this).data("resizable"), e = g.options;
            g.ghost && g.helper && g.helper.get(0).removeChild(g.ghost.get(0))
        }
    }), c.ui.plugin.add("resizable", "grid", {
        resize: function (w, h) {
            var e = c(this).data("resizable"), k = e.options, x = e.size, g = e.originalSize, v = e.originalPosition, q = e.axis, m = k._aspectRatio || w.shiftKey;
            k.grid = typeof k.grid == "number" ? [k.grid, k.grid] : k.grid;
            var j = Math.round((x.width - g.width) / (k.grid[0] || 1)) * (k.grid[0] || 1), p = Math.round((x.height - g.height) / (k.grid[1] || 1)) * (k.grid[1] || 1);
            /^(se|s|e)$/.test(q) ? (e.size.width = g.width + j, e.size.height = g.height + p) : /^(ne)$/.test(q) ? (e.size.width = g.width + j, e.size.height = g.height + p, e.position.top = v.top - p) : /^(sw)$/.test(q) ? (e.size.width = g.width + j, e.size.height = g.height + p, e.position.left = v.left - j) : (e.size.width = g.width + j, e.size.height = g.height + p, e.position.top = v.top - p, e.position.left = v.left - j)
        }
    });
    var d = function (f) {
        return parseInt(f, 10) || 0
    }, b = function (f) {
        return !isNaN(parseInt(f, 10))
    }
})(jQuery);
(function (b, a) {
    b.widget("ui.sortable", b.ui.mouse, {
        version: "1.9.2",
        widgetEventPrefix: "sort",
        ready: !1,
        options: {
            appendTo: "parent",
            axis: !1,
            connectWith: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            dropOnEmpty: !0,
            forcePlaceholderSize: !1,
            forceHelperSize: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            items: "> *",
            opacity: !1,
            placeholder: !1,
            revert: !1,
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1000
        },
        _create: function () {
            var c = this.options;
            this.containerCache = {}, this.element.addClass("ui-sortable"), this.refresh(), this.floating = this.items.length ? c.axis === "x" || /left|right/.test(this.items[0].item.css("float")) || /inline|table-cell/.test(this.items[0].item.css("display")) : !1, this.offset = this.element.offset(), this._mouseInit(), this.ready = !0
        },
        _destroy: function () {
            this.element.removeClass("ui-sortable ui-sortable-disabled"), this._mouseDestroy();
            for (var c = this.items.length - 1; c >= 0; c--) {
                this.items[c].item.removeData(this.widgetName + "-item")
            }
            return this
        },
        _setOption: function (c, d) {
            c === "disabled" ? (this.options[c] = d, this.widget().toggleClass("ui-sortable-disabled", !!d)) : b.Widget.prototype._setOption.apply(this, arguments)
        },
        _mouseCapture: function (d, h) {
            var f = this;
            if (this.reverting) {
                return !1
            }
            if (this.options.disabled || this.options.type == "static") {
                return !1
            }
            this._refreshItems(d);
            var c = null, e = b(d.target).parents().each(function () {
                if (b.data(this, f.widgetName + "-item") == f) {
                    return c = b(this), !1
                }
            });
            b.data(d.target, f.widgetName + "-item") == f && (c = b(d.target));
            if (!c) {
                return !1
            }
            if (this.options.handle && !h) {
                var g = !1;
                b(this.options.handle, c).find("*").andSelf().each(function () {
                    this == d.target && (g = !0)
                });
                if (!g) {
                    return !1
                }
            }
            return this.currentItem = c, this._removeCurrentsFromItems(), !0
        },
        _mouseStart: function (d, g, f) {
            var c = this.options;
            this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(d), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            }, b.extend(this.offset, {
                click: {left: d.pageX - this.offset.left, top: d.pageY - this.offset.top},
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(d), this.originalPageX = d.pageX, this.originalPageY = d.pageY, c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt), this.domPosition = {
                prev: this.currentItem.prev()[0],
                parent: this.currentItem.parent()[0]
            }, this.helper[0] != this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), c.containment && this._setContainment(), c.cursor && (b("body").css("cursor") && (this._storedCursor = b("body").css("cursor")), b("body").css("cursor", c.cursor)), c.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", c.opacity)), c.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", c.zIndex)), this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML" && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", d, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions();
            if (!f) {
                for (var e = this.containers.length - 1; e >= 0; e--) {
                    this.containers[e]._trigger("activate", d, this._uiHash(this))
                }
            }
            return b.ui.ddmanager && (b.ui.ddmanager.current = this), b.ui.ddmanager && !c.dropBehaviour && b.ui.ddmanager.prepareOffsets(this, d), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(d), !0
        },
        _mouseDrag: function (e) {
            this.position = this._generatePosition(e), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs);
            if (this.options.scroll) {
                var j = this.options, g = !1;
                this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML" ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - e.pageY < j.scrollSensitivity ? this.scrollParent[0].scrollTop = g = this.scrollParent[0].scrollTop + j.scrollSpeed : e.pageY - this.overflowOffset.top < j.scrollSensitivity && (this.scrollParent[0].scrollTop = g = this.scrollParent[0].scrollTop - j.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - e.pageX < j.scrollSensitivity ? this.scrollParent[0].scrollLeft = g = this.scrollParent[0].scrollLeft + j.scrollSpeed : e.pageX - this.overflowOffset.left < j.scrollSensitivity && (this.scrollParent[0].scrollLeft = g = this.scrollParent[0].scrollLeft - j.scrollSpeed)) : (e.pageY - b(document).scrollTop() < j.scrollSensitivity ? g = b(document).scrollTop(b(document).scrollTop() - j.scrollSpeed) : b(window).height() - (e.pageY - b(document).scrollTop()) < j.scrollSensitivity && (g = b(document).scrollTop(b(document).scrollTop() + j.scrollSpeed)), e.pageX - b(document).scrollLeft() < j.scrollSensitivity ? g = b(document).scrollLeft(b(document).scrollLeft() - j.scrollSpeed) : b(window).width() - (e.pageX - b(document).scrollLeft()) < j.scrollSensitivity && (g = b(document).scrollLeft(b(document).scrollLeft() + j.scrollSpeed))), g !== !1 && b.ui.ddmanager && !j.dropBehaviour && b.ui.ddmanager.prepareOffsets(this, e)
            }
            this.positionAbs = this._convertPositionTo("absolute");
            if (!this.options.axis || this.options.axis != "y") {
                this.helper[0].style.left = this.position.left + "px"
            }
            if (!this.options.axis || this.options.axis != "x") {
                this.helper[0].style.top = this.position.top + "px"
            }
            for (var d = this.items.length - 1; d >= 0; d--) {
                var f = this.items[d], h = f.item[0], c = this._intersectsWithPointer(f);
                if (!c) {
                    continue
                }
                if (f.instance !== this.currentContainer) {
                    continue
                }
                if (h != this.currentItem[0] && this.placeholder[c == 1 ? "next" : "prev"]()[0] != h && !b.contains(this.placeholder[0], h) && (this.options.type == "semi-dynamic" ? !b.contains(this.element[0], h) : !0)) {
                    this.direction = c == 1 ? "down" : "up";
                    if (this.options.tolerance != "pointer" && !this._intersectsWithSides(f)) {
                        break
                    }
                    this._rearrange(e, f), this._trigger("change", e, this._uiHash());
                    break
                }
            }
            return this._contactContainers(e), b.ui.ddmanager && b.ui.ddmanager.drag(this, e), this._trigger("sort", e, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1
        },
        _mouseStop: function (d, f) {
            if (!d) {
                return
            }
            b.ui.ddmanager && !this.options.dropBehaviour && b.ui.ddmanager.drop(this, d);
            if (this.options.revert) {
                var e = this, c = this.placeholder.offset();
                this.reverting = !0, b(this.helper).animate({
                    left: c.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
                    top: c.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
                }, parseInt(this.options.revert, 10) || 500, function () {
                    e._clear(d)
                })
            } else {
                this._clear(d, f)
            }
            return !1
        },
        cancel: function () {
            if (this.dragging) {
                this._mouseUp({target: null}), this.options.helper == "original" ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
                for (var c = this.containers.length - 1; c >= 0; c--) {
                    this.containers[c]._trigger("deactivate", null, this._uiHash(this)), this.containers[c].containerCache.over && (this.containers[c]._trigger("out", null, this._uiHash(this)), this.containers[c].containerCache.over = 0)
                }
            }
            return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.options.helper != "original" && this.helper && this.helper[0].parentNode && this.helper.remove(), b.extend(this, {
                helper: null,
                dragging: !1,
                reverting: !1,
                _noFinalSort: null
            }), this.domPosition.prev ? b(this.domPosition.prev).after(this.currentItem) : b(this.domPosition.parent).prepend(this.currentItem)), this
        },
        serialize: function (c) {
            var e = this._getItemsAsjQuery(c && c.connected), d = [];
            return c = c || {}, b(e).each(function () {
                var f = (b(c.item || this).attr(c.attribute || "id") || "").match(c.expression || /(.+)[-=_](.+)/);
                f && d.push((c.key || f[1] + "[]") + "=" + (c.key && c.expression ? f[1] : f[2]))
            }), !d.length && c.key && d.push(c.key + "="), d.join("&")
        },
        toArray: function (c) {
            var e = this._getItemsAsjQuery(c && c.connected), d = [];
            return c = c || {}, e.each(function () {
                d.push(b(c.item || this).attr(c.attribute || "id") || "")
            }), d
        },
        _intersectsWith: function (p) {
            var x = this.positionAbs.left, h = x + this.helperProportions.width, d = this.positionAbs.top, k = d + this.helperProportions.height, y = p.left, g = y + p.width, w = p.top, v = w + p.height, m = this.offset.click.top, j = this.offset.click.left, q = d + m > w && d + m < v && x + j > y && x + j < g;
            return this.options.tolerance == "pointer" || this.options.forcePointerForContainers || this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > p[this.floating ? "width" : "height"] ? q : y < x + this.helperProportions.width / 2 && h - this.helperProportions.width / 2 < g && w < d + this.helperProportions.height / 2 && k - this.helperProportions.height / 2 < v
        },
        _intersectsWithPointer: function (d) {
            var h = this.options.axis === "x" || b.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, d.top, d.height), f = this.options.axis === "y" || b.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, d.left, d.width), c = h && f, e = this._getDragVerticalDirection(), g = this._getDragHorizontalDirection();
            return c ? this.floating ? g && g == "right" || e == "down" ? 2 : 1 : e && (e == "down" ? 2 : 1) : !1
        },
        _intersectsWithSides: function (d) {
            var g = b.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, d.top + d.height / 2, d.height), f = b.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, d.left + d.width / 2, d.width), c = this._getDragVerticalDirection(), e = this._getDragHorizontalDirection();
            return this.floating && e ? e == "right" && f || e == "left" && !f : c && (c == "down" && g || c == "up" && !g)
        },
        _getDragVerticalDirection: function () {
            var c = this.positionAbs.top - this.lastPositionAbs.top;
            return c != 0 && (c > 0 ? "down" : "up")
        },
        _getDragHorizontalDirection: function () {
            var c = this.positionAbs.left - this.lastPositionAbs.left;
            return c != 0 && (c > 0 ? "right" : "left")
        },
        refresh: function (c) {
            return this._refreshItems(c), this.refreshPositions(), this
        },
        _connectWith: function () {
            var c = this.options;
            return c.connectWith.constructor == String ? [c.connectWith] : c.connectWith
        },
        _getItemsAsjQuery: function (f) {
            var k = [], h = [], e = this._connectWith();
            if (e && f) {
                for (var g = e.length - 1; g >= 0; g--) {
                    var j = b(e[g]);
                    for (var d = j.length - 1; d >= 0; d--) {
                        var c = b.data(j[d], this.widgetName);
                        c && c != this && !c.options.disabled && h.push([b.isFunction(c.options.items) ? c.options.items.call(c.element) : b(c.options.items, c.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), c])
                    }
                }
            }
            h.push([b.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : b(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
            for (var g = h.length - 1; g >= 0; g--) {
                h[g][0].each(function () {
                    k.push(this)
                })
            }
            return b(k)
        },
        _removeCurrentsFromItems: function () {
            var c = this.currentItem.find(":data(" + this.widgetName + "-item)");
            this.items = b.grep(this.items, function (d) {
                for (var f = 0; f < c.length; f++) {
                    if (c[f] == d.item[0]) {
                        return !1
                    }
                }
                return !0
            })
        },
        _refreshItems: function (x) {
            this.items = [], this.containers = [this];
            var g = this.items, d = [[b.isFunction(this.options.items) ? this.options.items.call(this.element[0], x, {item: this.currentItem}) : b(this.options.items, this.element), this]], k = this._connectWith();
            if (k && this.ready) {
                for (var y = k.length - 1; y >= 0; y--) {
                    var e = b(k[y]);
                    for (var w = e.length - 1; w >= 0; w--) {
                        var v = b.data(e[w], this.widgetName);
                        v && v != this && !v.options.disabled && (d.push([b.isFunction(v.options.items) ? v.options.items.call(v.element[0], x, {item: this.currentItem}) : b(v.options.items, v.element), v]), this.containers.push(v))
                    }
                }
            }
            for (var y = d.length - 1; y >= 0; y--) {
                var p = d[y][1], j = d[y][0];
                for (var w = 0, q = j.length; w < q; w++) {
                    var m = b(j[w]);
                    m.data(this.widgetName + "-item", p), g.push({
                        item: m,
                        instance: p,
                        width: 0,
                        height: 0,
                        left: 0,
                        top: 0
                    })
                }
            }
        },
        refreshPositions: function (d) {
            this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
            for (var g = this.items.length - 1; g >= 0; g--) {
                var f = this.items[g];
                if (f.instance != this.currentContainer && this.currentContainer && f.item[0] != this.currentItem[0]) {
                    continue
                }
                var c = this.options.toleranceElement ? b(this.options.toleranceElement, f.item) : f.item;
                d || (f.width = c.outerWidth(), f.height = c.outerHeight());
                var e = c.offset();
                f.left = e.left, f.top = e.top
            }
            if (this.options.custom && this.options.custom.refreshContainers) {
                this.options.custom.refreshContainers.call(this)
            } else {
                for (var g = this.containers.length - 1; g >= 0; g--) {
                    var e = this.containers[g].element.offset();
                    this.containers[g].containerCache.left = e.left, this.containers[g].containerCache.top = e.top, this.containers[g].containerCache.width = this.containers[g].element.outerWidth(), this.containers[g].containerCache.height = this.containers[g].element.outerHeight()
                }
            }
            return this
        },
        _createPlaceholder: function (c) {
            c = c || this;
            var e = c.options;
            if (!e.placeholder || e.placeholder.constructor == String) {
                var d = e.placeholder;
                e.placeholder = {
                    element: function () {
                        var f = b(document.createElement(c.currentItem[0].nodeName)).addClass(d || c.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
                        return d || (f.style.visibility = "hidden"), f
                    }, update: function (g, f) {
                        if (d && !e.forcePlaceholderSize) {
                            return
                        }
                        f.height() || f.height(c.currentItem.innerHeight() - parseInt(c.currentItem.css("paddingTop") || 0, 10) - parseInt(c.currentItem.css("paddingBottom") || 0, 10)), f.width() || f.width(c.currentItem.innerWidth() - parseInt(c.currentItem.css("paddingLeft") || 0, 10) - parseInt(c.currentItem.css("paddingRight") || 0, 10))
                    }
                }
            }
            c.placeholder = b(e.placeholder.element.call(c.element, c.currentItem)), c.currentItem.after(c.placeholder), e.placeholder.update(c, c.placeholder)
        },
        _contactContainers: function (x) {
            var g = null, d = null;
            for (var k = this.containers.length - 1; k >= 0; k--) {
                if (b.contains(this.currentItem[0], this.containers[k].element[0])) {
                    continue
                }
                if (this._intersectsWith(this.containers[k].containerCache)) {
                    if (g && b.contains(this.containers[k].element[0], g.element[0])) {
                        continue
                    }
                    g = this.containers[k], d = k
                } else {
                    this.containers[k].containerCache.over && (this.containers[k]._trigger("out", x, this._uiHash(this)), this.containers[k].containerCache.over = 0)
                }
            }
            if (!g) {
                return
            }
            if (this.containers.length === 1) {
                this.containers[d]._trigger("over", x, this._uiHash(this)), this.containers[d].containerCache.over = 1
            } else {
                var y = 10000, e = null, w = this.containers[d].floating ? "left" : "top", v = this.containers[d].floating ? "width" : "height", p = this.positionAbs[w] + this.offset.click[w];
                for (var j = this.items.length - 1; j >= 0; j--) {
                    if (!b.contains(this.containers[d].element[0], this.items[j].item[0])) {
                        continue
                    }
                    if (this.items[j].item[0] == this.currentItem[0]) {
                        continue
                    }
                    var q = this.items[j].item.offset()[w], m = !1;
                    Math.abs(q - p) > Math.abs(q + this.items[j][v] - p) && (m = !0, q += this.items[j][v]), Math.abs(q - p) < y && (y = Math.abs(q - p), e = this.items[j], this.direction = m ? "up" : "down")
                }
                if (!e && !this.options.dropOnEmpty) {
                    return
                }
                this.currentContainer = this.containers[d], e ? this._rearrange(x, e, null, !0) : this._rearrange(x, null, this.containers[d].element, !0), this._trigger("change", x, this._uiHash()), this.containers[d]._trigger("change", x, this._uiHash(this)), this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[d]._trigger("over", x, this._uiHash(this)), this.containers[d].containerCache.over = 1
            }
        },
        _createHelper: function (c) {
            var e = this.options, d = b.isFunction(e.helper) ? b(e.helper.apply(this.element[0], [c, this.currentItem])) : e.helper == "clone" ? this.currentItem.clone() : this.currentItem;
            return d.parents("body").length || b(e.appendTo != "parent" ? e.appendTo : this.currentItem[0].parentNode)[0].appendChild(d[0]), d[0] == this.currentItem[0] && (this._storedCSS = {
                width: this.currentItem[0].style.width,
                height: this.currentItem[0].style.height,
                position: this.currentItem.css("position"),
                top: this.currentItem.css("top"),
                left: this.currentItem.css("left")
            }), (d[0].style.width == "" || e.forceHelperSize) && d.width(this.currentItem.width()), (d[0].style.height == "" || e.forceHelperSize) && d.height(this.currentItem.height()), d
        },
        _adjustOffsetFromHelper: function (c) {
            typeof c == "string" && (c = c.split(" ")), b.isArray(c) && (c = {
                left: +c[0],
                top: +c[1] || 0
            }), "left" in c && (this.offset.click.left = c.left + this.margins.left), "right" in c && (this.offset.click.left = this.helperProportions.width - c.right + this.margins.left), "top" in c && (this.offset.click.top = c.top + this.margins.top), "bottom" in c && (this.offset.click.top = this.helperProportions.height - c.bottom + this.margins.top)
        },
        _getParentOffset: function () {
            this.offsetParent = this.helper.offsetParent();
            var c = this.offsetParent.offset();
            this.cssPosition == "absolute" && this.scrollParent[0] != document && b.contains(this.scrollParent[0], this.offsetParent[0]) && (c.left += this.scrollParent.scrollLeft(), c.top += this.scrollParent.scrollTop());
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && b.ui.ie) {
                c = {top: 0, left: 0}
            }
            return {
                top: c.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: c.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function () {
            if (this.cssPosition == "relative") {
                var c = this.currentItem.position();
                return {
                    top: c.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: c.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            }
            return {top: 0, left: 0}
        },
        _cacheMargins: function () {
            this.margins = {
                left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
                top: parseInt(this.currentItem.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
        },
        _setContainment: function () {
            var d = this.options;
            d.containment == "parent" && (d.containment = this.helper[0].parentNode);
            if (d.containment == "document" || d.containment == "window") {
                this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, b(d.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (b(d.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]
            }
            if (!/^(document|window|parent)$/.test(d.containment)) {
                var f = b(d.containment)[0], e = b(d.containment).offset(), c = b(f).css("overflow") != "hidden";
                this.containment = [e.left + (parseInt(b(f).css("borderLeftWidth"), 10) || 0) + (parseInt(b(f).css("paddingLeft"), 10) || 0) - this.margins.left, e.top + (parseInt(b(f).css("borderTopWidth"), 10) || 0) + (parseInt(b(f).css("paddingTop"), 10) || 0) - this.margins.top, e.left + (c ? Math.max(f.scrollWidth, f.offsetWidth) : f.offsetWidth) - (parseInt(b(f).css("borderLeftWidth"), 10) || 0) - (parseInt(b(f).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, e.top + (c ? Math.max(f.scrollHeight, f.offsetHeight) : f.offsetHeight) - (parseInt(b(f).css("borderTopWidth"), 10) || 0) - (parseInt(b(f).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
            }
        },
        _convertPositionTo: function (d, h) {
            h || (h = this.position);
            var f = d == "absolute" ? 1 : -1, c = this.options, e = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!b.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, g = /(html|body)/i.test(e[0].tagName);
            return {
                top: h.top + this.offset.relative.top * f + this.offset.parent.top * f - (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : g ? 0 : e.scrollTop()) * f,
                left: h.left + this.offset.relative.left * f + this.offset.parent.left * f - (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : g ? 0 : e.scrollLeft()) * f
            }
        },
        _generatePosition: function (f) {
            var k = this.options, h = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!b.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, e = /(html|body)/i.test(h[0].tagName);
            this.cssPosition == "relative" && (this.scrollParent[0] == document || this.scrollParent[0] == this.offsetParent[0]) && (this.offset.relative = this._getRelativeOffset());
            var g = f.pageX, j = f.pageY;
            if (this.originalPosition) {
                this.containment && (f.pageX - this.offset.click.left < this.containment[0] && (g = this.containment[0] + this.offset.click.left), f.pageY - this.offset.click.top < this.containment[1] && (j = this.containment[1] + this.offset.click.top), f.pageX - this.offset.click.left > this.containment[2] && (g = this.containment[2] + this.offset.click.left), f.pageY - this.offset.click.top > this.containment[3] && (j = this.containment[3] + this.offset.click.top));
                if (k.grid) {
                    var d = this.originalPageY + Math.round((j - this.originalPageY) / k.grid[1]) * k.grid[1];
                    j = this.containment ? d - this.offset.click.top < this.containment[1] || d - this.offset.click.top > this.containment[3] ? d - this.offset.click.top < this.containment[1] ? d + k.grid[1] : d - k.grid[1] : d : d;
                    var c = this.originalPageX + Math.round((g - this.originalPageX) / k.grid[0]) * k.grid[0];
                    g = this.containment ? c - this.offset.click.left < this.containment[0] || c - this.offset.click.left > this.containment[2] ? c - this.offset.click.left < this.containment[0] ? c + k.grid[0] : c - k.grid[0] : c : c
                }
            }
            return {
                top: j - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : h.scrollTop()),
                left: g - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : h.scrollLeft())
            }
        },
        _rearrange: function (g, d, h, f) {
            h ? h[0].appendChild(this.placeholder[0]) : d.item[0].parentNode.insertBefore(this.placeholder[0], this.direction == "down" ? d.item[0] : d.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1;
            var c = this.counter;
            this._delay(function () {
                c == this.counter && this.refreshPositions(!f)
            })
        },
        _clear: function (d, f) {
            this.reverting = !1;
            var e = [];
            !this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null;
            if (this.helper[0] == this.currentItem[0]) {
                for (var c in this._storedCSS) {
                    if (this._storedCSS[c] == "auto" || this._storedCSS[c] == "static") {
                        this._storedCSS[c] = ""
                    }
                }
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else {
                this.currentItem.show()
            }
            this.fromOutside && !f && e.push(function (g) {
                this._trigger("receive", g, this._uiHash(this.fromOutside))
            }), (this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !f && e.push(function (g) {
                this._trigger("update", g, this._uiHash())
            }), this !== this.currentContainer && (f || (e.push(function (g) {
                this._trigger("remove", g, this._uiHash())
            }), e.push(function (g) {
                return function (h) {
                    g._trigger("receive", h, this._uiHash(this))
                }
            }.call(this, this.currentContainer)), e.push(function (g) {
                return function (h) {
                    g._trigger("update", h, this._uiHash(this))
                }
            }.call(this, this.currentContainer))));
            for (var c = this.containers.length - 1; c >= 0; c--) {
                f || e.push(function (g) {
                    return function (h) {
                        g._trigger("deactivate", h, this._uiHash(this))
                    }
                }.call(this, this.containers[c])), this.containers[c].containerCache.over && (e.push(function (g) {
                    return function (h) {
                        g._trigger("out", h, this._uiHash(this))
                    }
                }.call(this, this.containers[c])), this.containers[c].containerCache.over = 0)
            }
            this._storedCursor && b("body").css("cursor", this._storedCursor), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex), this.dragging = !1;
            if (this.cancelHelperRemoval) {
                if (!f) {
                    this._trigger("beforeStop", d, this._uiHash());
                    for (var c = 0; c < e.length; c++) {
                        e[c].call(this, d)
                    }
                    this._trigger("stop", d, this._uiHash())
                }
                return this.fromOutside = !1, !1
            }
            f || this._trigger("beforeStop", d, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] != this.currentItem[0] && this.helper.remove(), this.helper = null;
            if (!f) {
                for (var c = 0; c < e.length; c++) {
                    e[c].call(this, d)
                }
                this._trigger("stop", d, this._uiHash())
            }
            return this.fromOutside = !1, !0
        },
        _trigger: function () {
            b.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel()
        },
        _uiHash: function (c) {
            var d = c || this;
            return {
                helper: d.helper,
                placeholder: d.placeholder || b([]),
                position: d.position,
                originalPosition: d.originalPosition,
                offset: d.positionAbs,
                item: d.currentItem,
                sender: c ? c.element : null
            }
        }
    })
})(jQuery);
(function (b, a) {
    var c = 0;
    b.widget("ui.autocomplete", {
        version: "1.9.2",
        defaultElement: "<input>",
        options: {
            appendTo: "body",
            autoFocus: !1,
            delay: 300,
            minLength: 1,
            position: {my: "left top", at: "left bottom", collision: "none"},
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        pending: 0,
        _create: function () {
            var d, f, e;
            this.isMultiLine = this._isMultiLine(), this.valueMethod = this.element[this.element.is("input,textarea") ? "val" : "text"], this.isNewMenu = !0, this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off"), this._on(this.element, {
                keydown: function (g) {
                    if (this.element.prop("readOnly")) {
                        d = !0, e = !0, f = !0;
                        return
                    }
                    d = !1, e = !1, f = !1;
                    var h = b.ui.keyCode;
                    switch (g.keyCode) {
                        case h.PAGE_UP:
                            d = !0, this._move("previousPage", g);
                            break;
                        case h.PAGE_DOWN:
                            d = !0, this._move("nextPage", g);
                            break;
                        case h.UP:
                            d = !0, this._keyEvent("previous", g);
                            break;
                        case h.DOWN:
                            d = !0, this._keyEvent("next", g);
                            break;
                        case h.ENTER:
                        case h.NUMPAD_ENTER:
                            this.menu.active && (d = !0, g.preventDefault(), this.menu.select(g));
                            break;
                        case h.TAB:
                            this.menu.active && this.menu.select(g);
                            break;
                        case h.ESCAPE:
                            this.menu.element.is(":visible") && (this._value(this.term), this.close(g), g.preventDefault());
                            break;
                        default:
                            f = !0, this._searchTimeout(g)
                    }
                }, keypress: function (h) {
                    if (d) {
                        d = !1, h.preventDefault();
                        return
                    }
                    if (f) {
                        return
                    }
                    var g = b.ui.keyCode;
                    switch (h.keyCode) {
                        case g.PAGE_UP:
                            this._move("previousPage", h);
                            break;
                        case g.PAGE_DOWN:
                            this._move("nextPage", h);
                            break;
                        case g.UP:
                            this._keyEvent("previous", h);
                            break;
                        case g.DOWN:
                            this._keyEvent("next", h)
                    }
                }, input: function (g) {
                    if (e) {
                        e = !1, g.preventDefault();
                        return
                    }
                    this._searchTimeout(g)
                }, focus: function () {
                    this.selectedItem = null, this.previous = this._value()
                }, blur: function (g) {
                    if (this.cancelBlur) {
                        delete this.cancelBlur;
                        return
                    }
                    clearTimeout(this.searching), this.close(g), this._change(g)
                }
            }), this._initSource(), this.menu = b("<ul>").addClass("ui-autocomplete").appendTo(this.document.find(this.options.appendTo || "body")[0]).menu({
                input: b(),
                role: null
            }).zIndex(this.element.zIndex() + 1).hide().data("menu"), this._on(this.menu.element, {
                mousedown: function (g) {
                    g.preventDefault(), this.cancelBlur = !0, this._delay(function () {
                        delete this.cancelBlur
                    });
                    var h = this.menu.element[0];
                    b(g.target).closest(".ui-menu-item").length || this._delay(function () {
                        var i = this;
                        this.document.one("mousedown", function (j) {
                            j.target !== i.element[0] && j.target !== h && !b.contains(h, j.target) && i.close()
                        })
                    })
                }, menufocus: function (g, i) {
                    if (this.isNewMenu) {
                        this.isNewMenu = !1;
                        if (g.originalEvent && /^mouse/.test(g.originalEvent.type)) {
                            this.menu.blur(), this.document.one("mousemove", function () {
                                b(g.target).trigger(g.originalEvent)
                            });
                            return
                        }
                    }
                    var h = i.item.data("ui-autocomplete-item") || i.item.data("item.autocomplete");
                    !1 !== this._trigger("focus", g, {item: h}) ? g.originalEvent && /^key/.test(g.originalEvent.type) && this._value(h.value) : this.liveRegion.text(h.value)
                }, menuselect: function (i, g) {
                    var j = g.item.data("ui-autocomplete-item") || g.item.data("item.autocomplete"), h = this.previous;
                    this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = h, this._delay(function () {
                        this.previous = h, this.selectedItem = j
                    })), !1 !== this._trigger("select", i, {item: j}) && this._value(j.value), this.term = this._value(), this.close(i), this.selectedItem = j
                }
            }), this.liveRegion = b("<span>", {
                role: "status",
                "aria-live": "polite"
            }).addClass("ui-helper-hidden-accessible").insertAfter(this.element), b.fn.bgiframe && this.menu.element.bgiframe(), this._on(this.window, {
                beforeunload: function () {
                    this.element.removeAttr("autocomplete")
                }
            })
        },
        _destroy: function () {
            clearTimeout(this.searching), this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove()
        },
        _setOption: function (f, d) {
            this._super(f, d), f === "source" && this._initSource(), f === "appendTo" && this.menu.element.appendTo(this.document.find(d || "body")[0]), f === "disabled" && d && this.xhr && this.xhr.abort()
        },
        _isMultiLine: function () {
            return this.element.is("textarea") ? !0 : this.element.is("input") ? !1 : this.element.prop("isContentEditable")
        },
        _initSource: function () {
            var d, f, e = this;
            b.isArray(this.options.source) ? (d = this.options.source, this.source = function (h, g) {
                g(b.ui.autocomplete.filter(d, h.term))
            }) : typeof this.options.source == "string" ? (f = this.options.source, this.source = function (h, g) {
                e.xhr && e.xhr.abort(), e.xhr = b.ajax({
                    url: f, data: h, dataType: "json", success: function (i) {
                        g(i)
                    }, error: function () {
                        g([])
                    }
                })
            }) : this.source = this.options.source
        },
        _searchTimeout: function (d) {
            clearTimeout(this.searching), this.searching = this._delay(function () {
                this.term !== this._value() && (this.selectedItem = null, this.search(null, d))
            }, this.options.delay)
        },
        search: function (f, d) {
            f = f != null ? f : this._value(), this.term = this._value();
            if (f.length < this.options.minLength) {
                return this.close(d)
            }
            if (this._trigger("search", d) === !1) {
                return
            }
            return this._search(f)
        },
        _search: function (d) {
            this.pending++, this.element.addClass("ui-autocomplete-loading"), this.cancelSearch = !1, this.source({term: d}, this._response())
        },
        _response: function () {
            var f = this, d = ++c;
            return function (e) {
                d === c && f.__response(e), f.pending--, f.pending || f.element.removeClass("ui-autocomplete-loading")
            }
        },
        __response: function (d) {
            d && (d = this._normalize(d)), this._trigger("response", null, {content: d}), !this.options.disabled && d && d.length && !this.cancelSearch ? (this._suggest(d), this._trigger("open")) : this._close()
        },
        close: function (d) {
            this.cancelSearch = !0, this._close(d)
        },
        _close: function (d) {
            this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", d))
        },
        _change: function (d) {
            this.previous !== this._value() && this._trigger("change", d, {item: this.selectedItem})
        },
        _normalize: function (d) {
            return d.length && d[0].label && d[0].value ? d : b.map(d, function (e) {
                return typeof e == "string" ? {label: e, value: e} : b.extend({
                    label: e.label || e.value,
                    value: e.value || e.label
                }, e)
            })
        },
        _suggest: function (d) {
            var e = this.menu.element.empty().zIndex(this.element.zIndex() + 1);
            this._renderMenu(e, d), this.menu.refresh(), e.show(), this._resizeMenu(), e.position(b.extend({of: this.element}, this.options.position)), this.options.autoFocus && this.menu.next()
        },
        _resizeMenu: function () {
            var d = this.menu.element;
            d.outerWidth(Math.max(d.width("").outerWidth() + 1, this.element.outerWidth()))
        },
        _renderMenu: function (d, f) {
            var e = this;
            b.each(f, function (g, h) {
                e._renderItemData(d, h)
            })
        },
        _renderItemData: function (f, d) {
            return this._renderItem(f, d).data("ui-autocomplete-item", d)
        },
        _renderItem: function (d, e) {
            return b("<li>").append(b("<a>").text(e.label)).appendTo(d)
        },
        _move: function (f, d) {
            if (!this.menu.element.is(":visible")) {
                this.search(null, d);
                return
            }
            if (this.menu.isFirstItem() && /^previous/.test(f) || this.menu.isLastItem() && /^next/.test(f)) {
                this._value(this.term), this.menu.blur();
                return
            }
            this.menu[f](d)
        },
        widget: function () {
            return this.menu.element
        },
        _value: function () {
            return this.valueMethod.apply(this.element, arguments)
        },
        _keyEvent: function (f, d) {
            if (!this.isMultiLine || this.menu.element.is(":visible")) {
                this._move(f, d), d.preventDefault()
            }
        }
    }), b.extend(b.ui.autocomplete, {
        escapeRegex: function (d) {
            return d.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        }, filter: function (d, f) {
            var e = new RegExp(b.ui.autocomplete.escapeRegex(f), "i");
            return b.grep(d, function (g) {
                return e.test(g.label || g.value || g)
            })
        }
    }), b.widget("ui.autocomplete", b.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function (d) {
                    return d + (d > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                }
            }
        }, __response: function (f) {
            var d;
            this._superApply(arguments);
            if (this.options.disabled || this.cancelSearch) {
                return
            }
            f && f.length ? d = this.options.messages.results(f.length) : d = this.options.messages.noResults, this.liveRegion.text(d)
        }
    })
})(jQuery);
(function (k, q) {
    var d, b, h, v, c = "ui-button ui-widget ui-state-default ui-corner-all", p = "ui-state-hover ui-state-active ", m = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only", j = function () {
        var a = k(this).find(":ui-button");
        setTimeout(function () {
            a.button("refresh")
        }, 1)
    }, g = function (e) {
        var l = e.name, f = e.form, a = k([]);
        return l && (f ? a = k(f).find("[name='" + l + "']") : a = k("[name='" + l + "']", e.ownerDocument).filter(function () {
            return !this.form
        })), a
    };
    k.widget("ui.button", {
        version: "1.9.2",
        defaultElement: "<button>",
        options: {disabled: null, text: !0, label: null, icons: {primary: null, secondary: null}},
        _create: function () {
            this.element.closest("form").unbind("reset" + this.eventNamespace).bind("reset" + this.eventNamespace, j), typeof this.options.disabled != "boolean" ? this.options.disabled = !!this.element.prop("disabled") : this.element.prop("disabled", this.options.disabled), this._determineButtonType(), this.hasTitle = !!this.buttonElement.attr("title");
            var i = this, f = this.options, e = this.type === "checkbox" || this.type === "radio", n = e ? "" : "ui-state-active", l = "ui-state-focus";
            f.label === null && (f.label = this.type === "input" ? this.buttonElement.val() : this.buttonElement.html()), this._hoverable(this.buttonElement), this.buttonElement.addClass(c).attr("role", "button").bind("mouseenter" + this.eventNamespace, function () {
                if (f.disabled) {
                    return
                }
                this === d && k(this).addClass("ui-state-active")
            }).bind("mouseleave" + this.eventNamespace, function () {
                if (f.disabled) {
                    return
                }
                k(this).removeClass(n)
            }).bind("click" + this.eventNamespace, function (a) {
                f.disabled && (a.preventDefault(), a.stopImmediatePropagation())
            }), this.element.bind("focus" + this.eventNamespace, function () {
                i.buttonElement.addClass(l)
            }).bind("blur" + this.eventNamespace, function () {
                i.buttonElement.removeClass(l)
            }), e && (this.element.bind("change" + this.eventNamespace, function () {
                if (v) {
                    return
                }
                i.refresh()
            }), this.buttonElement.bind("mousedown" + this.eventNamespace, function (a) {
                if (f.disabled) {
                    return
                }
                v = !1, b = a.pageX, h = a.pageY
            }).bind("mouseup" + this.eventNamespace, function (a) {
                if (f.disabled) {
                    return
                }
                if (b !== a.pageX || h !== a.pageY) {
                    v = !0
                }
            })), this.type === "checkbox" ? this.buttonElement.bind("click" + this.eventNamespace, function () {
                if (f.disabled || v) {
                    return !1
                }
                k(this).toggleClass("ui-state-active"), i.buttonElement.attr("aria-pressed", i.element[0].checked)
            }) : this.type === "radio" ? this.buttonElement.bind("click" + this.eventNamespace, function () {
                if (f.disabled || v) {
                    return !1
                }
                k(this).addClass("ui-state-active"), i.buttonElement.attr("aria-pressed", "true");
                var a = i.element[0];
                g(a).not(a).map(function () {
                    return k(this).button("widget")[0]
                }).removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : (this.buttonElement.bind("mousedown" + this.eventNamespace, function () {
                if (f.disabled) {
                    return !1
                }
                k(this).addClass("ui-state-active"), d = this, i.document.one("mouseup", function () {
                    d = null
                })
            }).bind("mouseup" + this.eventNamespace, function () {
                if (f.disabled) {
                    return !1
                }
                k(this).removeClass("ui-state-active")
            }).bind("keydown" + this.eventNamespace, function (a) {
                if (f.disabled) {
                    return !1
                }
                (a.keyCode === k.ui.keyCode.SPACE || a.keyCode === k.ui.keyCode.ENTER) && k(this).addClass("ui-state-active")
            }).bind("keyup" + this.eventNamespace, function () {
                k(this).removeClass("ui-state-active")
            }), this.buttonElement.is("a") && this.buttonElement.keyup(function (a) {
                a.keyCode === k.ui.keyCode.SPACE && k(this).click()
            })), this._setOption("disabled", f.disabled), this._resetButton()
        },
        _determineButtonType: function () {
            var f, a, i;
            this.element.is("[type=checkbox]") ? this.type = "checkbox" : this.element.is("[type=radio]") ? this.type = "radio" : this.element.is("input") ? this.type = "input" : this.type = "button", this.type === "checkbox" || this.type === "radio" ? (f = this.element.parents().last(), a = "label[for='" + this.element.attr("id") + "']", this.buttonElement = f.find(a), this.buttonElement.length || (f = f.length ? f.siblings() : this.element.siblings(), this.buttonElement = f.filter(a), this.buttonElement.length || (this.buttonElement = f.find(a))), this.element.addClass("ui-helper-hidden-accessible"), i = this.element.is(":checked"), i && this.buttonElement.addClass("ui-state-active"), this.buttonElement.prop("aria-pressed", i)) : this.buttonElement = this.element
        },
        widget: function () {
            return this.buttonElement
        },
        _destroy: function () {
            this.element.removeClass("ui-helper-hidden-accessible"), this.buttonElement.removeClass(c + " " + p + " " + m).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()), this.hasTitle || this.buttonElement.removeAttr("title")
        },
        _setOption: function (f, a) {
            this._super(f, a);
            if (f === "disabled") {
                a ? this.element.prop("disabled", !0) : this.element.prop("disabled", !1);
                return
            }
            this._resetButton()
        },
        refresh: function () {
            var a = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled");
            a !== this.options.disabled && this._setOption("disabled", a), this.type === "radio" ? g(this.element[0]).each(function () {
                k(this).is(":checked") ? k(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : k(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : this.type === "checkbox" && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false"))
        },
        _resetButton: function () {
            if (this.type === "input") {
                this.options.label && this.element.val(this.options.label);
                return
            }
            var e = this.buttonElement.removeClass(m), o = k("<span></span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(e.empty()).text(), l = this.options.icons, a = l.primary && l.secondary, f = [];
            l.primary || l.secondary ? (this.options.text && f.push("ui-button-text-icon" + (a ? "s" : l.primary ? "-primary" : "-secondary")), l.primary && e.prepend("<span class='ui-button-icon-primary ui-icon " + l.primary + "'></span>"), l.secondary && e.append("<span class='ui-button-icon-secondary ui-icon " + l.secondary + "'></span>"), this.options.text || (f.push(a ? "ui-button-icons-only" : "ui-button-icon-only"), this.hasTitle || e.attr("title", k.trim(o)))) : f.push("ui-button-text-only"), e.addClass(f.join(" "))
        }
    }), k.widget("ui.buttonset", {
        version: "1.9.2",
        options: {items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(button)"},
        _create: function () {
            this.element.addClass("ui-buttonset")
        },
        _init: function () {
            this.refresh()
        },
        _setOption: function (f, a) {
            f === "disabled" && this.buttons.button("option", f, a), this._super(f, a)
        },
        refresh: function () {
            var a = this.element.css("direction") === "rtl";
            this.buttons = this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function () {
                return k(this).button("widget")[0]
            }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(a ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(a ? "ui-corner-left" : "ui-corner-right").end().end()
        },
        _destroy: function () {
            this.element.removeClass("ui-buttonset"), this.buttons.map(function () {
                return k(this).button("widget")[0]
            }).removeClass("ui-corner-left ui-corner-right").end().button("destroy")
        }
    })
})(jQuery);
(function (d, b) {
    var f = "ui-dialog ui-widget ui-widget-content ui-corner-all ", c = {
        buttons: !0,
        height: !0,
        maxHeight: !0,
        maxWidth: !0,
        minHeight: !0,
        minWidth: !0,
        width: !0
    }, a = {maxHeight: !0, maxWidth: !0, minHeight: !0, minWidth: !0};
    d.widget("ui.dialog", {
        version: "1.9.2",
        options: {
            autoOpen: !0,
            buttons: {},
            closeOnEscape: !0,
            closeText: "close",
            dialogClass: "",
            draggable: !0,
            hide: null,
            height: "auto",
            maxHeight: !1,
            maxWidth: !1,
            minHeight: 150,
            minWidth: 150,
            modal: !1,
            position: {
                my: "center", at: "center", of: window, collision: "fit", using: function (e) {
                    var g = d(this).css(e).offset().top;
                    g < 0 && d(this).css("top", e.top - g)
                }
            },
            resizable: !0,
            show: null,
            stack: !0,
            title: "",
            width: 300,
            zIndex: 1000
        },
        _create: function () {
            this.originalTitle = this.element.attr("title"), typeof this.originalTitle != "string" && (this.originalTitle = ""), this.oldPosition = {
                parent: this.element.parent(),
                index: this.element.parent().children().index(this.element)
            }, this.options.title = this.options.title || this.originalTitle;
            var j = this, l = this.options, h = l.title || "&#160;", k, n, g, e, m;
            k = (this.uiDialog = d("<div>")).addClass(f + l.dialogClass).css({
                display: "none",
                outline: 0,
                zIndex: l.zIndex
            }).attr("tabIndex", -1).keydown(function (i) {
                l.closeOnEscape && !i.isDefaultPrevented() && i.keyCode && i.keyCode === d.ui.keyCode.ESCAPE && (j.close(i), i.preventDefault())
            }).mousedown(function (i) {
                j.moveToTop(!1, i)
            }).appendTo("body"), this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(k), n = (this.uiDialogTitlebar = d("<div>")).addClass("ui-dialog-titlebar  ui-widget-header  ui-corner-all  ui-helper-clearfix").bind("mousedown", function () {
                k.focus()
            }).prependTo(k), g = d("<a href='#'></a>").addClass("ui-dialog-titlebar-close  ui-corner-all").attr("role", "button").click(function (i) {
                i.preventDefault(), j.close(i)
            }).appendTo(n), (this.uiDialogTitlebarCloseText = d("<span>")).addClass("ui-icon ui-icon-closethick").text(l.closeText).appendTo(g), e = d("<span>").uniqueId().addClass("ui-dialog-title").html(h).prependTo(n), m = (this.uiDialogButtonPane = d("<div>")).addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"), (this.uiButtonSet = d("<div>")).addClass("ui-dialog-buttonset").appendTo(m), k.attr({
                role: "dialog",
                "aria-labelledby": e.attr("id")
            }), n.find("*").add(n).disableSelection(), this._hoverable(g), this._focusable(g), l.draggable && d.fn.draggable && this._makeDraggable(), l.resizable && d.fn.resizable && this._makeResizable(), this._createButtons(l.buttons), this._isOpen = !1, d.fn.bgiframe && k.bgiframe(), this._on(k, {
                keydown: function (q) {
                    if (!l.modal || q.keyCode !== d.ui.keyCode.TAB) {
                        return
                    }
                    var s = d(":tabbable", k), p = s.filter(":first"), r = s.filter(":last");
                    if (q.target === r[0] && !q.shiftKey) {
                        return p.focus(1), !1
                    }
                    if (q.target === p[0] && q.shiftKey) {
                        return r.focus(1), !1
                    }
                }
            })
        },
        _init: function () {
            this.options.autoOpen && this.open()
        },
        _destroy: function () {
            var h, g = this.oldPosition;
            this.overlay && this.overlay.destroy(), this.uiDialog.hide(), this.element.removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"), this.uiDialog.remove(), this.originalTitle && this.element.attr("title", this.originalTitle), h = g.parent.children().eq(g.index), h.length && h[0] !== this.element[0] ? h.before(this.element) : g.parent.append(this.element)
        },
        widget: function () {
            return this.uiDialog
        },
        close: function (g) {
            var j = this, h, e;
            if (!this._isOpen) {
                return
            }
            if (!1 === this._trigger("beforeClose", g)) {
                return
            }
            return this._isOpen = !1, this.overlay && this.overlay.destroy(), this.options.hide ? this._hide(this.uiDialog, this.options.hide, function () {
                j._trigger("close", g)
            }) : (this.uiDialog.hide(), this._trigger("close", g)), d.ui.dialog.overlay.resize(), this.options.modal && (h = 0, d(".ui-dialog").each(function () {
                this !== j.uiDialog[0] && (e = d(this).css("z-index"), isNaN(e) || (h = Math.max(h, e)))
            }), d.ui.dialog.maxZ = h), this
        },
        isOpen: function () {
            return this._isOpen
        },
        moveToTop: function (g, j) {
            var h = this.options, e;
            return h.modal && !g || !h.stack && !h.modal ? this._trigger("focus", j) : (h.zIndex > d.ui.dialog.maxZ && (d.ui.dialog.maxZ = h.zIndex), this.overlay && (d.ui.dialog.maxZ += 1, d.ui.dialog.overlay.maxZ = d.ui.dialog.maxZ, this.overlay.$el.css("z-index", d.ui.dialog.overlay.maxZ)), e = {
                scrollTop: this.element.scrollTop(),
                scrollLeft: this.element.scrollLeft()
            }, d.ui.dialog.maxZ += 1, this.uiDialog.css("z-index", d.ui.dialog.maxZ), this.element.attr(e), this._trigger("focus", j), this)
        },
        open: function () {
            if (this._isOpen) {
                return
            }
            var e, h = this.options, g = this.uiDialog;
            return this._size(), this._position(h.position), g.show(h.show), this.overlay = h.modal ? new d.ui.dialog.overlay(this) : null, this.moveToTop(!0), e = this.element.find(":tabbable"), e.length || (e = this.uiDialogButtonPane.find(":tabbable"), e.length || (e = g)), e.eq(0).focus(), this._isOpen = !0, this._trigger("open"), this
        },
        _createButtons: function (e) {
            var h = this, g = !1;
            this.uiDialogButtonPane.remove(), this.uiButtonSet.empty(), typeof e == "object" && e !== null && d.each(e, function () {
                return !(g = !0)
            }), g ? (d.each(e, function (k, m) {
                var j, l;
                m = d.isFunction(m) ? {
                    click: m,
                    text: k
                } : m, m = d.extend({type: "button"}, m), l = m.click, m.click = function () {
                    l.apply(h.element[0], arguments)
                }, j = d("<button></button>", m).appendTo(h.uiButtonSet), d.fn.button && j.button()
            }), this.uiDialog.addClass("ui-dialog-buttons"), this.uiDialogButtonPane.appendTo(this.uiDialog)) : this.uiDialog.removeClass("ui-dialog-buttons")
        },
        _makeDraggable: function () {
            function g(i) {
                return {position: i.position, offset: i.offset}
            }

            var e = this, h = this.options;
            this.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar",
                containment: "document",
                start: function (k, j) {
                    d(this).addClass("ui-dialog-dragging"), e._trigger("dragStart", k, g(j))
                },
                drag: function (i, j) {
                    e._trigger("drag", i, g(j))
                },
                stop: function (j, k) {
                    h.position = [k.position.left - e.document.scrollLeft(), k.position.top - e.document.scrollTop()], d(this).removeClass("ui-dialog-dragging"), e._trigger("dragStop", j, g(k)), d.ui.dialog.overlay.resize()
                }
            })
        },
        _makeResizable: function (l) {
            function e(i) {
                return {
                    originalPosition: i.originalPosition,
                    originalSize: i.originalSize,
                    position: i.position,
                    size: i.size
                }
            }

            l = l === b ? this.options.resizable : l;
            var j = this, g = this.options, h = this.uiDialog.css("position"), k = typeof l == "string" ? l : "n,e,s,w,se,sw,ne,nw";
            this.uiDialog.resizable({
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: this.element,
                maxWidth: g.maxWidth,
                maxHeight: g.maxHeight,
                minWidth: g.minWidth,
                minHeight: this._minHeight(),
                handles: k,
                start: function (i, m) {
                    d(this).addClass("ui-dialog-resizing"), j._trigger("resizeStart", i, e(m))
                },
                resize: function (m, i) {
                    j._trigger("resize", m, e(i))
                },
                stop: function (i, m) {
                    d(this).removeClass("ui-dialog-resizing"), g.height = d(this).height(), g.width = d(this).width(), j._trigger("resizeStop", i, e(m)), d.ui.dialog.overlay.resize()
                }
            }).css("position", h).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")
        },
        _minHeight: function () {
            var g = this.options;
            return g.height === "auto" ? g.minHeight : Math.min(g.minHeight, g.height)
        },
        _position: function (g) {
            var j = [], h = [0, 0], e;
            if (g) {
                if (typeof g == "string" || typeof g == "object" && "0" in g) {
                    j = g.split ? g.split(" ") : [g[0], g[1]], j.length === 1 && (j[1] = j[0]), d.each(["left", "top"], function (k, i) {
                        +j[k] === j[k] && (h[k] = j[k], j[k] = i)
                    }), g = {
                        my: j[0] + (h[0] < 0 ? h[0] : "+" + h[0]) + " " + j[1] + (h[1] < 0 ? h[1] : "+" + h[1]),
                        at: j.join(" ")
                    }
                }
                g = d.extend({}, d.ui.dialog.prototype.options.position, g)
            } else {
                g = d.ui.dialog.prototype.options.position
            }
            e = this.uiDialog.is(":visible"), e || this.uiDialog.show(), this.uiDialog.position(g), e || this.uiDialog.hide()
        },
        _setOptions: function (e) {
            var i = this, g = {}, h = !1;
            d.each(e, function (k, j) {
                i._setOption(k, j), k in c && (h = !0), k in a && (g[k] = j)
            }), h && this._size(), this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", g)
        },
        _setOption: function (g, j) {
            var e, h, k = this.uiDialog;
            switch (g) {
                case"buttons":
                    this._createButtons(j);
                    break;
                case"closeText":
                    this.uiDialogTitlebarCloseText.text("" + j);
                    break;
                case"dialogClass":
                    k.removeClass(this.options.dialogClass).addClass(f + j);
                    break;
                case"disabled":
                    j ? k.addClass("ui-dialog-disabled") : k.removeClass("ui-dialog-disabled");
                    break;
                case"draggable":
                    e = k.is(":data(draggable)"), e && !j && k.draggable("destroy"), !e && j && this._makeDraggable();
                    break;
                case"position":
                    this._position(j);
                    break;
                case"resizable":
                    h = k.is(":data(resizable)"), h && !j && k.resizable("destroy"), h && typeof j == "string" && k.resizable("option", "handles", j), !h && j !== !1 && this._makeResizable(j);
                    break;
                case"title":
                    d(".ui-dialog-title", this.uiDialogTitlebar).html("" + (j || "&#160;"))
            }
            this._super(g, j)
        },
        _size: function () {
            var g, k, j, e = this.options, h = this.uiDialog.is(":visible");
            this.element.show().css({
                width: "auto",
                minHeight: 0,
                height: 0
            }), e.minWidth > e.width && (e.width = e.minWidth), g = this.uiDialog.css({
                height: "auto",
                width: e.width
            }).outerHeight(), k = Math.max(0, e.minHeight - g), e.height === "auto" ? d.support.minHeight ? this.element.css({
                minHeight: k,
                height: "auto"
            }) : (this.uiDialog.show(), j = this.element.css("height", "auto").height(), h || this.uiDialog.hide(), this.element.height(Math.max(j, k))) : this.element.height(Math.max(e.height - g, 0)), this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
        }
    }), d.extend(d.ui.dialog, {
        uuid: 0, maxZ: 0, getTitleId: function (h) {
            var g = h.attr("id");
            return g || (this.uuid += 1, g = this.uuid), "ui-dialog-title-" + g
        }, overlay: function (e) {
            this.$el = d.ui.dialog.overlay.create(e)
        }
    }), d.extend(d.ui.dialog.overlay, {
        instances: [],
        oldInstances: [],
        maxZ: 0,
        events: d.map("focus,mousedown,mouseup,keydown,keypress,click".split(","), function (g) {
            return g + ".dialog-overlay"
        }).join(" "),
        create: function (e) {
            this.instances.length === 0 && (setTimeout(function () {
                d.ui.dialog.overlay.instances.length && d(document).bind(d.ui.dialog.overlay.events, function (h) {
                    if (d(h.target).zIndex() < d.ui.dialog.overlay.maxZ) {
                        return !1
                    }
                })
            }, 1), d(window).bind("resize.dialog-overlay", d.ui.dialog.overlay.resize));
            var g = this.oldInstances.pop() || d("<div>").addClass("ui-widget-overlay");
            return d(document).bind("keydown.dialog-overlay", function (j) {
                var h = d.ui.dialog.overlay.instances;
                h.length !== 0 && h[h.length - 1] === g && e.options.closeOnEscape && !j.isDefaultPrevented() && j.keyCode && j.keyCode === d.ui.keyCode.ESCAPE && (e.close(j), j.preventDefault())
            }), g.appendTo(document.body).css({
                width: this.width(),
                height: this.height()
            }), d.fn.bgiframe && g.bgiframe(), this.instances.push(g), g
        },
        destroy: function (e) {
            var h = d.inArray(e, this.instances), g = 0;
            h !== -1 && this.oldInstances.push(this.instances.splice(h, 1)[0]), this.instances.length === 0 && d([document, window]).unbind(".dialog-overlay"), e.height(0).width(0).remove(), d.each(this.instances, function () {
                g = Math.max(g, this.css("z-index"))
            }), this.maxZ = g
        },
        height: function () {
            var e, g;
            return d.ui.ie ? (e = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), g = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight), e < g ? d(window).height() + "px" : e + "px") : d(document).height() + "px"
        },
        width: function () {
            var e, g;
            return d.ui.ie ? (e = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), g = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth), e < g ? d(window).width() + "px" : e + "px") : d(document).width() + "px"
        },
        resize: function () {
            var e = d([]);
            d.each(d.ui.dialog.overlay.instances, function () {
                e = e.add(this)
            }), e.css({width: 0, height: 0}).css({
                width: d.ui.dialog.overlay.width(),
                height: d.ui.dialog.overlay.height()
            })
        }
    }), d.extend(d.ui.dialog.overlay.prototype, {
        destroy: function () {
            d.ui.dialog.overlay.destroy(this.$el)
        }
    })
})(jQuery);
(function (b, a) {
    var c = !1;
    b.widget("ui.menu", {
        version: "1.9.2",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: {submenu: "ui-icon-carat-1-e"},
            menus: "ul",
            position: {my: "left top", at: "right top"},
            role: "menu",
            blur: null,
            focus: null,
            select: null
        },
        _create: function () {
            this.activeMenu = this.element, this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
                role: this.options.role,
                tabIndex: 0
            }).bind("click" + this.eventNamespace, b.proxy(function (d) {
                this.options.disabled && d.preventDefault()
            }, this)), this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true"), this._on({
                "mousedown .ui-menu-item > a": function (d) {
                    d.preventDefault()
                }, "click .ui-state-disabled > a": function (d) {
                    d.preventDefault()
                }, "click .ui-menu-item:has(a)": function (d) {
                    var e = b(d.target).closest(".ui-menu-item");
                    !c && e.not(".ui-state-disabled").length && (c = !0, this.select(d), e.has(".ui-menu").length ? this.expand(d) : this.element.is(":focus") || (this.element.trigger("focus", [!0]), this.active && this.active.parents(".ui-menu").length === 1 && clearTimeout(this.timer)))
                }, "mouseenter .ui-menu-item": function (d) {
                    var e = b(d.currentTarget);
                    e.siblings().children(".ui-state-active").removeClass("ui-state-active"), this.focus(d, e)
                }, mouseleave: "collapseAll", "mouseleave .ui-menu": "collapseAll", focus: function (f, d) {
                    var g = this.active || this.element.children(".ui-menu-item").eq(0);
                    d || this.focus(f, g)
                }, blur: function (d) {
                    this._delay(function () {
                        b.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(d)
                    })
                }, keydown: "_keydown"
            }), this.refresh(), this._on(this.document, {
                click: function (d) {
                    b(d.target).closest(".ui-menu").length || this.collapseAll(d), c = !1
                }
            })
        },
        _destroy: function () {
            this.element.removeAttr("aria-activedescendant").find(".ui-menu").andSelf().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(), this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function () {
                var d = b(this);
                d.data("ui-menu-submenu-carat") && d.remove()
            }), this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")
        },
        _keydown: function (g) {
            function d(i) {
                return i.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
            }

            var l, j, f, h, k, e = !0;
            switch (g.keyCode) {
                case b.ui.keyCode.PAGE_UP:
                    this.previousPage(g);
                    break;
                case b.ui.keyCode.PAGE_DOWN:
                    this.nextPage(g);
                    break;
                case b.ui.keyCode.HOME:
                    this._move("first", "first", g);
                    break;
                case b.ui.keyCode.END:
                    this._move("last", "last", g);
                    break;
                case b.ui.keyCode.UP:
                    this.previous(g);
                    break;
                case b.ui.keyCode.DOWN:
                    this.next(g);
                    break;
                case b.ui.keyCode.LEFT:
                    this.collapse(g);
                    break;
                case b.ui.keyCode.RIGHT:
                    this.active && !this.active.is(".ui-state-disabled") && this.expand(g);
                    break;
                case b.ui.keyCode.ENTER:
                case b.ui.keyCode.SPACE:
                    this._activate(g);
                    break;
                case b.ui.keyCode.ESCAPE:
                    this.collapse(g);
                    break;
                default:
                    e = !1, j = this.previousFilter || "", f = String.fromCharCode(g.keyCode), h = !1, clearTimeout(this.filterTimer), f === j ? h = !0 : f = j + f, k = new RegExp("^" + d(f), "i"), l = this.activeMenu.children(".ui-menu-item").filter(function () {
                        return k.test(b(this).children("a").text())
                    }), l = h && l.index(this.active.next()) !== -1 ? this.active.nextAll(".ui-menu-item") : l, l.length || (f = String.fromCharCode(g.keyCode), k = new RegExp("^" + d(f), "i"), l = this.activeMenu.children(".ui-menu-item").filter(function () {
                        return k.test(b(this).children("a").text())
                    })), l.length ? (this.focus(g, l), l.length > 1 ? (this.previousFilter = f, this.filterTimer = this._delay(function () {
                        delete this.previousFilter
                    }, 1000)) : delete this.previousFilter) : delete this.previousFilter
            }
            e && g.preventDefault()
        },
        _activate: function (d) {
            this.active.is(".ui-state-disabled") || (this.active.children("a[aria-haspopup='true']").length ? this.expand(d) : this.select(d))
        },
        refresh: function () {
            var d, f = this.options.icons.submenu, e = this.element.find(this.options.menus);
            e.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({
                role: this.options.role,
                "aria-hidden": "true",
                "aria-expanded": "false"
            }).each(function () {
                var h = b(this), j = h.prev("a"), g = b("<span>").addClass("ui-menu-icon ui-icon " + f).data("ui-menu-submenu-carat", !0);
                j.attr("aria-haspopup", "true").prepend(g), h.attr("aria-labelledby", j.attr("id"))
            }), d = e.add(this.element), d.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({
                tabIndex: -1,
                role: this._itemRole()
            }), d.children(":not(.ui-menu-item)").each(function () {
                var g = b(this);
                /[^\-—–\s]/.test(g.text()) || g.addClass("ui-widget-content ui-menu-divider")
            }), d.children(".ui-state-disabled").attr("aria-disabled", "true"), this.active && !b.contains(this.element[0], this.active[0]) && this.blur()
        },
        _itemRole: function () {
            return {menu: "menuitem", listbox: "option"}[this.options.role]
        },
        focus: function (g, d) {
            var h, f;
            this.blur(g, g && g.type === "focus"), this._scrollIntoView(d), this.active = d.first(), f = this.active.children("a").addClass("ui-state-focus"), this.options.role && this.element.attr("aria-activedescendant", f.attr("id")), this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"), g && g.type === "keydown" ? this._close() : this.timer = this._delay(function () {
                this._close()
            }, this.delay), h = d.children(".ui-menu"), h.length && /^mouse/.test(g.type) && this._startOpening(h), this.activeMenu = d.parent(), this._trigger("focus", g, {item: d})
        },
        _scrollIntoView: function (f) {
            var k, h, e, g, j, d;
            this._hasScroll() && (k = parseFloat(b.css(this.activeMenu[0], "borderTopWidth")) || 0, h = parseFloat(b.css(this.activeMenu[0], "paddingTop")) || 0, e = f.offset().top - this.activeMenu.offset().top - k - h, g = this.activeMenu.scrollTop(), j = this.activeMenu.height(), d = f.height(), e < 0 ? this.activeMenu.scrollTop(g + e) : e + d > j && this.activeMenu.scrollTop(g + e - j + d))
        },
        blur: function (f, d) {
            d || clearTimeout(this.timer);
            if (!this.active) {
                return
            }
            this.active.children("a").removeClass("ui-state-focus"), this.active = null, this._trigger("blur", f, {item: this.active})
        },
        _startOpening: function (d) {
            clearTimeout(this.timer);
            if (d.attr("aria-hidden") !== "true") {
                return
            }
            this.timer = this._delay(function () {
                this._close(), this._open(d)
            }, this.delay)
        },
        _open: function (d) {
            var e = b.extend({of: this.active}, this.options.position);
            clearTimeout(this.timer), this.element.find(".ui-menu").not(d.parents(".ui-menu")).hide().attr("aria-hidden", "true"), d.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(e)
        },
        collapseAll: function (d, e) {
            clearTimeout(this.timer), this.timer = this._delay(function () {
                var f = e ? this.element : b(d && d.target).closest(this.element.find(".ui-menu"));
                f.length || (f = this.element), this._close(f), this.blur(d), this.activeMenu = f
            }, this.delay)
        },
        _close: function (d) {
            d || (d = this.active ? this.active.parent() : this.element), d.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active")
        },
        collapse: function (f) {
            var d = this.active && this.active.parent().closest(".ui-menu-item", this.element);
            d && d.length && (this._close(), this.focus(f, d))
        },
        expand: function (f) {
            var d = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first();
            d && d.length && (this._open(d.parent()), this._delay(function () {
                this.focus(f, d)
            }))
        },
        next: function (d) {
            this._move("next", "first", d)
        },
        previous: function (d) {
            this._move("prev", "last", d)
        },
        isFirstItem: function () {
            return this.active && !this.active.prevAll(".ui-menu-item").length
        },
        isLastItem: function () {
            return this.active && !this.active.nextAll(".ui-menu-item").length
        },
        _move: function (g, d, h) {
            var f;
            this.active && (g === "first" || g === "last" ? f = this.active[g === "first" ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : f = this.active[g + "All"](".ui-menu-item").eq(0));
            if (!f || !f.length || !this.active) {
                f = this.activeMenu.children(".ui-menu-item")[d]()
            }
            this.focus(h, f)
        },
        nextPage: function (e) {
            var g, f, d;
            if (!this.active) {
                this.next(e);
                return
            }
            if (this.isLastItem()) {
                return
            }
            this._hasScroll() ? (f = this.active.offset().top, d = this.element.height(), this.active.nextAll(".ui-menu-item").each(function () {
                return g = b(this), g.offset().top - f - d < 0
            }), this.focus(e, g)) : this.focus(e, this.activeMenu.children(".ui-menu-item")[this.active ? "last" : "first"]())
        },
        previousPage: function (e) {
            var g, f, d;
            if (!this.active) {
                this.next(e);
                return
            }
            if (this.isFirstItem()) {
                return
            }
            this._hasScroll() ? (f = this.active.offset().top, d = this.element.height(), this.active.prevAll(".ui-menu-item").each(function () {
                return g = b(this), g.offset().top - f + d > 0
            }), this.focus(e, g)) : this.focus(e, this.activeMenu.children(".ui-menu-item").first())
        },
        _hasScroll: function () {
            return this.element.outerHeight() < this.element.prop("scrollHeight")
        },
        select: function (d) {
            this.active = this.active || b(d.target).closest(".ui-menu-item");
            var e = {item: this.active};
            this.active.has(".ui-menu").length || this.collapseAll(d, !0), this._trigger("select", d, e)
        }
    })
})(jQuery);
(function (f, b) {
    function a() {
        return ++g
    }

    function c(h) {
        return h.hash.length > 1 && h.href.replace(d, "") === location.href.replace(d, "").replace(/\s/g, "%20")
    }

    var g = 0, d = /#.*$/;
    f.widget("ui.tabs", {
        version: "1.9.2",
        delay: 300,
        options: {
            active: null,
            collapsible: !1,
            event: "click",
            heightStyle: "content",
            hide: null,
            show: null,
            activate: null,
            beforeActivate: null,
            beforeLoad: null,
            load: null
        },
        _create: function () {
            var h = this, k = this.options, j = k.active, e = location.hash.substring(1);
            this.running = !1, this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", k.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function (i) {
                f(this).is(".ui-state-disabled") && i.preventDefault()
            }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function () {
                f(this).closest("li").is(".ui-state-disabled") && this.blur()
            }), this._processTabs();
            if (j === null) {
                e && this.tabs.each(function (i, l) {
                    if (f(l).attr("aria-controls") === e) {
                        return j = i, !1
                    }
                }), j === null && (j = this.tabs.index(this.tabs.filter(".ui-tabs-active")));
                if (j === null || j === -1) {
                    j = this.tabs.length ? 0 : !1
                }
            }
            j !== !1 && (j = this.tabs.index(this.tabs.eq(j)), j === -1 && (j = k.collapsible ? !1 : 0)), k.active = j, !k.collapsible && k.active === !1 && this.anchors.length && (k.active = 0), f.isArray(k.disabled) && (k.disabled = f.unique(k.disabled.concat(f.map(this.tabs.filter(".ui-state-disabled"), function (i) {
                return h.tabs.index(i)
            }))).sort()), this.options.active !== !1 && this.anchors.length ? this.active = this._findActive(this.options.active) : this.active = f(), this._refresh(), this.active.length && this.load(k.active)
        },
        _getCreateEventData: function () {
            return {tab: this.active, panel: this.active.length ? this._getPanelForTab(this.active) : f()}
        },
        _tabKeydown: function (h) {
            var k = f(this.document[0].activeElement).closest("li"), j = this.tabs.index(k), e = !0;
            if (this._handlePageNav(h)) {
                return
            }
            switch (h.keyCode) {
                case f.ui.keyCode.RIGHT:
                case f.ui.keyCode.DOWN:
                    j++;
                    break;
                case f.ui.keyCode.UP:
                case f.ui.keyCode.LEFT:
                    e = !1, j--;
                    break;
                case f.ui.keyCode.END:
                    j = this.anchors.length - 1;
                    break;
                case f.ui.keyCode.HOME:
                    j = 0;
                    break;
                case f.ui.keyCode.SPACE:
                    h.preventDefault(), clearTimeout(this.activating), this._activate(j);
                    return;
                case f.ui.keyCode.ENTER:
                    h.preventDefault(), clearTimeout(this.activating), this._activate(j === this.options.active ? !1 : j);
                    return;
                default:
                    return
            }
            h.preventDefault(), clearTimeout(this.activating), j = this._focusNextTab(j, e), h.ctrlKey || (k.attr("aria-selected", "false"), this.tabs.eq(j).attr("aria-selected", "true"), this.activating = this._delay(function () {
                this.option("active", j)
            }, this.delay))
        },
        _panelKeydown: function (e) {
            if (this._handlePageNav(e)) {
                return
            }
            e.ctrlKey && e.keyCode === f.ui.keyCode.UP && (e.preventDefault(), this.active.focus())
        },
        _handlePageNav: function (e) {
            if (e.altKey && e.keyCode === f.ui.keyCode.PAGE_UP) {
                return this._activate(this._focusNextTab(this.options.active - 1, !1)), !0
            }
            if (e.altKey && e.keyCode === f.ui.keyCode.PAGE_DOWN) {
                return this._activate(this._focusNextTab(this.options.active + 1, !0)), !0
            }
        },
        _findNextTab: function (h, k) {
            function e() {
                return h > j && (h = 0), h < 0 && (h = j), h
            }

            var j = this.tabs.length - 1;
            while (f.inArray(e(), this.options.disabled) !== -1) {
                h = k ? h + 1 : h - 1
            }
            return h
        },
        _focusNextTab: function (i, h) {
            return i = this._findNextTab(i, h), this.tabs.eq(i).focus(), i
        },
        _setOption: function (i, h) {
            if (i === "active") {
                this._activate(h);
                return
            }
            if (i === "disabled") {
                this._setupDisabled(h);
                return
            }
            this._super(i, h), i === "collapsible" && (this.element.toggleClass("ui-tabs-collapsible", h), !h && this.options.active === !1 && this._activate(0)), i === "event" && this._setupEvents(h), i === "heightStyle" && this._setupHeightStyle(h)
        },
        _tabId: function (h) {
            return h.attr("aria-controls") || "ui-tabs-" + a()
        },
        _sanitizeSelector: function (h) {
            return h ? h.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : ""
        },
        refresh: function () {
            var e = this.options, h = this.tablist.children(":has(a[href])");
            e.disabled = f.map(h.filter(".ui-state-disabled"), function (i) {
                return h.index(i)
            }), this._processTabs(), e.active === !1 || !this.anchors.length ? (e.active = !1, this.active = f()) : this.active.length && !f.contains(this.tablist[0], this.active[0]) ? this.tabs.length === e.disabled.length ? (e.active = !1, this.active = f()) : this._activate(this._findNextTab(Math.max(0, e.active - 1), !1)) : e.active = this.tabs.index(this.active), this._refresh()
        },
        _refresh: function () {
            this._setupDisabled(this.options.disabled), this._setupEvents(this.options.event), this._setupHeightStyle(this.options.heightStyle), this.tabs.not(this.active).attr({
                "aria-selected": "false",
                tabIndex: -1
            }), this.panels.not(this._getPanelForTab(this.active)).hide().attr({
                "aria-expanded": "false",
                "aria-hidden": "true"
            }), this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({
                "aria-selected": "true",
                tabIndex: 0
            }), this._getPanelForTab(this.active).show().attr({
                "aria-expanded": "true",
                "aria-hidden": "false"
            })) : this.tabs.eq(0).attr("tabIndex", 0)
        },
        _processTabs: function () {
            var e = this;
            this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist"), this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
                role: "tab",
                tabIndex: -1
            }), this.anchors = this.tabs.map(function () {
                return f("a", this)[0]
            }).addClass("ui-tabs-anchor").attr({
                role: "presentation",
                tabIndex: -1
            }), this.panels = f(), this.anchors.each(function (t, p) {
                var m, s, k, j = f(p).uniqueId().attr("id"), q = f(p).closest("li"), h = q.attr("aria-controls");
                c(p) ? (m = p.hash, s = e.element.find(e._sanitizeSelector(m))) : (k = e._tabId(q), m = "#" + k, s = e.element.find(m), s.length || (s = e._createPanel(k), s.insertAfter(e.panels[t - 1] || e.tablist)), s.attr("aria-live", "polite")), s.length && (e.panels = e.panels.add(s)), h && q.data("ui-tabs-aria-controls", h), q.attr({
                    "aria-controls": m.substring(1),
                    "aria-labelledby": j
                }), s.attr("aria-labelledby", j)
            }), this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel")
        },
        _getList: function () {
            return this.element.find("ol,ul").eq(0)
        },
        _createPanel: function (e) {
            return f("<div>").attr("id", e).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
        },
        _setupDisabled: function (e) {
            f.isArray(e) && (e.length ? e.length === this.anchors.length && (e = !0) : e = !1);
            for (var i = 0, h; h = this.tabs[i]; i++) {
                e === !0 || f.inArray(i, e) !== -1 ? f(h).addClass("ui-state-disabled").attr("aria-disabled", "true") : f(h).removeClass("ui-state-disabled").removeAttr("aria-disabled")
            }
            this.options.disabled = e
        },
        _setupEvents: function (e) {
            var h = {
                click: function (i) {
                    i.preventDefault()
                }
            };
            e && f.each(e.split(" "), function (j, i) {
                h[i] = "_eventHandler"
            }), this._off(this.anchors.add(this.tabs).add(this.panels)), this._on(this.anchors, h), this._on(this.tabs, {keydown: "_tabKeydown"}), this._on(this.panels, {keydown: "_panelKeydown"}), this._focusable(this.tabs), this._hoverable(this.tabs)
        },
        _setupHeightStyle: function (h) {
            var k, j, e = this.element.parent();
            h === "fill" ? (f.support.minHeight || (j = e.css("overflow"), e.css("overflow", "hidden")), k = e.height(), this.element.siblings(":visible").each(function () {
                var i = f(this), l = i.css("position");
                if (l === "absolute" || l === "fixed") {
                    return
                }
                k -= i.outerHeight(!0)
            }), j && e.css("overflow", j), this.element.children().not(this.panels).each(function () {
                k -= f(this).outerHeight(!0)
            }), this.panels.each(function () {
                f(this).height(Math.max(0, k - f(this).innerHeight() + f(this).height()))
            }).css("overflow", "auto")) : h === "auto" && (k = 0, this.panels.each(function () {
                k = Math.max(k, f(this).height("").height())
            }).height(k))
        },
        _eventHandler: function (w) {
            var j = this.options, e = this.active, m = f(w.currentTarget), x = m.closest("li"), h = x[0] === e[0], v = h && j.collapsible, q = v ? f() : this._getPanelForTab(x), p = e.length ? this._getPanelForTab(e) : f(), k = {
                oldTab: e,
                oldPanel: p,
                newTab: v ? f() : x,
                newPanel: q
            };
            w.preventDefault();
            if (x.hasClass("ui-state-disabled") || x.hasClass("ui-tabs-loading") || this.running || h && !j.collapsible || this._trigger("beforeActivate", w, k) === !1) {
                return
            }
            j.active = v ? !1 : this.tabs.index(x), this.active = h ? f() : x, this.xhr && this.xhr.abort(), !p.length && !q.length && f.error("jQuery UI Tabs: Mismatching fragment identifier."), q.length && this.load(this.tabs.index(x), w), this._toggle(w, k)
        },
        _toggle: function (j, p) {
            function m() {
                l.running = !1, l._trigger("activate", j, p)
            }

            function e() {
                p.newTab.closest("li").addClass("ui-tabs-active ui-state-active"), h.length && l.options.show ? l._show(h, l.options.show, m) : (h.show(), m())
            }

            var l = this, h = p.newPanel, k = p.oldPanel;
            this.running = !0, k.length && this.options.hide ? this._hide(k, this.options.hide, function () {
                p.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), e()
            }) : (p.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), k.hide(), e()), k.attr({
                "aria-expanded": "false",
                "aria-hidden": "true"
            }), p.oldTab.attr("aria-selected", "false"), h.length && k.length ? p.oldTab.attr("tabIndex", -1) : h.length && this.tabs.filter(function () {
                return f(this).attr("tabIndex") === 0
            }).attr("tabIndex", -1), h.attr({
                "aria-expanded": "true",
                "aria-hidden": "false"
            }), p.newTab.attr({"aria-selected": "true", tabIndex: 0})
        },
        _activate: function (e) {
            var i, h = this._findActive(e);
            if (h[0] === this.active[0]) {
                return
            }
            h.length || (h = this.active), i = h.find(".ui-tabs-anchor")[0], this._eventHandler({
                target: i,
                currentTarget: i,
                preventDefault: f.noop
            })
        },
        _findActive: function (e) {
            return e === !1 ? f() : this.tabs.eq(e)
        },
        _getIndex: function (h) {
            return typeof h == "string" && (h = this.anchors.index(this.anchors.filter("[href$='" + h + "']"))), h
        },
        _destroy: function () {
            this.xhr && this.xhr.abort(), this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"), this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"), this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeData("href.tabs").removeData("load.tabs").removeUniqueId(), this.tabs.add(this.panels).each(function () {
                f.data(this, "ui-tabs-destroy") ? f(this).remove() : f(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")
            }), this.tabs.each(function () {
                var e = f(this), h = e.data("ui-tabs-aria-controls");
                h ? e.attr("aria-controls", h) : e.removeAttr("aria-controls")
            }), this.panels.show(), this.options.heightStyle !== "content" && this.panels.css("height", "")
        },
        enable: function (h) {
            var e = this.options.disabled;
            if (e === !1) {
                return
            }
            h === b ? e = !1 : (h = this._getIndex(h), f.isArray(e) ? e = f.map(e, function (i) {
                return i !== h ? i : null
            }) : e = f.map(this.tabs, function (j, i) {
                return i !== h ? i : null
            })), this._setupDisabled(e)
        },
        disable: function (h) {
            var e = this.options.disabled;
            if (e === !0) {
                return
            }
            if (h === b) {
                e = !0
            } else {
                h = this._getIndex(h);
                if (f.inArray(h, e) !== -1) {
                    return
                }
                f.isArray(e) ? e = f.merge([h], e).sort() : e = [h]
            }
            this._setupDisabled(e)
        },
        load: function (k, p) {
            k = this._getIndex(k);
            var l = this, j = this.tabs.eq(k), m = j.find(".ui-tabs-anchor"), h = this._getPanelForTab(j), e = {
                tab: j,
                panel: h
            };
            if (c(m[0])) {
                return
            }
            this.xhr = f.ajax(this._ajaxSettings(m, p, e)), this.xhr && this.xhr.statusText !== "canceled" && (j.addClass("ui-tabs-loading"), h.attr("aria-busy", "true"), this.xhr.success(function (i) {
                setTimeout(function () {
                    h.html(i), l._trigger("load", p, e)
                }, 1)
            }).complete(function (n, i) {
                setTimeout(function () {
                    i === "abort" && l.panels.stop(!1, !0), j.removeClass("ui-tabs-loading"), h.removeAttr("aria-busy"), n === l.xhr && delete l.xhr
                }, 1)
            }))
        },
        _ajaxSettings: function (h, k, j) {
            var e = this;
            return {
                url: h.attr("href"), beforeSend: function (i, l) {
                    return e._trigger("beforeLoad", k, f.extend({jqXHR: i, ajaxSettings: l}, j))
                }
            }
        },
        _getPanelForTab: function (e) {
            var h = f(e).attr("aria-controls");
            return this.element.find(this._sanitizeSelector("#" + h))
        }
    }), f.uiBackCompat !== !1 && (f.ui.tabs.prototype._ui = function (i, h) {
        return {tab: i, panel: h, index: this.anchors.index(i)}
    }, f.widget("ui.tabs", f.ui.tabs, {
        url: function (i, h) {
            this.anchors.eq(i).attr("href", h)
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        options: {ajaxOptions: null, cache: !1}, _create: function () {
            this._super();
            var e = this;
            this._on({
                tabsbeforeload: function (i, h) {
                    if (f.data(h.tab[0], "cache.tabs")) {
                        i.preventDefault();
                        return
                    }
                    h.jqXHR.success(function () {
                        e.options.cache && f.data(h.tab[0], "cache.tabs", !0)
                    })
                }
            })
        }, _ajaxSettings: function (h, k, j) {
            var e = this.options.ajaxOptions;
            return f.extend({}, e, {
                error: function (l, i) {
                    try {
                        e.error(l, i, j.tab.closest("li").index(), j.tab[0])
                    } catch (m) {
                    }
                }
            }, this._superApply(arguments))
        }, _setOption: function (i, h) {
            i === "cache" && h === !1 && this.anchors.removeData("cache.tabs"), this._super(i, h)
        }, _destroy: function () {
            this.anchors.removeData("cache.tabs"), this._super()
        }, url: function (h) {
            this.anchors.eq(h).removeData("cache.tabs"), this._superApply(arguments)
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        abort: function () {
            this.xhr && this.xhr.abort()
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        options: {spinner: "<em>Loading&#8230;</em>"}, _create: function () {
            this._super(), this._on({
                tabsbeforeload: function (j, h) {
                    if (j.target !== this.element[0] || !this.options.spinner) {
                        return
                    }
                    var k = h.tab.find("span"), i = k.html();
                    k.html(this.options.spinner), h.jqXHR.complete(function () {
                        k.html(i)
                    })
                }
            })
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        options: {enable: null, disable: null}, enable: function (e) {
            var i = this.options, h;
            if (e && i.disabled === !0 || f.isArray(i.disabled) && f.inArray(e, i.disabled) !== -1) {
                h = !0
            }
            this._superApply(arguments), h && this._trigger("enable", null, this._ui(this.anchors[e], this.panels[e]))
        }, disable: function (e) {
            var i = this.options, h;
            if (e && i.disabled === !1 || f.isArray(i.disabled) && f.inArray(e, i.disabled) === -1) {
                h = !0
            }
            this._superApply(arguments), h && this._trigger("disable", null, this._ui(this.anchors[e], this.panels[e]))
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        options: {
            add: null,
            remove: null,
            tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
        }, add: function (q, l, j) {
            j === b && (j = this.anchors.length);
            var k, p, h = this.options, e = f(h.tabTemplate.replace(/#\{href\}/g, q).replace(/#\{label\}/g, l)), m = q.indexOf("#") ? this._tabId(e) : q.replace("#", "");
            return e.addClass("ui-state-default ui-corner-top").data("ui-tabs-destroy", !0), e.attr("aria-controls", m), k = j >= this.tabs.length, p = this.element.find("#" + m), p.length || (p = this._createPanel(m), k ? j > 0 ? p.insertAfter(this.panels.eq(-1)) : p.appendTo(this.element) : p.insertBefore(this.panels[j])), p.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").hide(), k ? e.appendTo(this.tablist) : e.insertBefore(this.tabs[j]), h.disabled = f.map(h.disabled, function (i) {
                return i >= j ? ++i : i
            }), this.refresh(), this.tabs.length === 1 && h.active === !1 && this.option("active", 0), this._trigger("add", null, this._ui(this.anchors[j], this.panels[j])), this
        }, remove: function (h) {
            h = this._getIndex(h);
            var k = this.options, j = this.tabs.eq(h).remove(), e = this._getPanelForTab(j).remove();
            return j.hasClass("ui-tabs-active") && this.anchors.length > 2 && this._activate(h + (h + 1 < this.anchors.length ? 1 : -1)), k.disabled = f.map(f.grep(k.disabled, function (i) {
                return i !== h
            }), function (i) {
                return i >= h ? --i : i
            }), this.refresh(), this._trigger("remove", null, this._ui(j.find("a")[0], e[0])), this
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        length: function () {
            return this.anchors.length
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        options: {idPrefix: "ui-tabs-"}, _tabId: function (e) {
            var h = e.is("li") ? e.find("a[href]") : e;
            return h = h[0], f(h).closest("li").attr("aria-controls") || h.title && h.title.replace(/\s/g, "_").replace(/[^\w\u00c0-\uFFFF\-]/g, "") || this.options.idPrefix + a()
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        options: {panelTemplate: "<div></div>"}, _createPanel: function (e) {
            return f(this.options.panelTemplate).attr("id", e).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        _create: function () {
            var h = this.options;
            h.active === null && h.selected !== b && (h.active = h.selected === -1 ? !1 : h.selected), this._super(), h.selected = h.active, h.selected === !1 && (h.selected = -1)
        }, _setOption: function (i, h) {
            if (i !== "selected") {
                return this._super(i, h)
            }
            var j = this.options;
            this._super("active", h === -1 ? !1 : h), j.selected = j.active, j.selected === !1 && (j.selected = -1)
        }, _eventHandler: function () {
            this._superApply(arguments), this.options.selected = this.options.active, this.options.selected === !1 && (this.options.selected = -1)
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        options: {show: null, select: null}, _create: function () {
            this._super(), this.options.active !== !1 && this._trigger("show", null, this._ui(this.active.find(".ui-tabs-anchor")[0], this._getPanelForTab(this.active)[0]))
        }, _trigger: function (m, j, o) {
            var l, h, k = this._superApply(arguments);
            return k ? (m === "beforeActivate" ? (l = o.newTab.length ? o.newTab : o.oldTab, h = o.newPanel.length ? o.newPanel : o.oldPanel, k = this._super("select", j, {
                tab: l.find(".ui-tabs-anchor")[0],
                panel: h[0],
                index: l.closest("li").index()
            })) : m === "activate" && o.newTab.length && (k = this._super("show", j, {
                tab: o.newTab.find(".ui-tabs-anchor")[0],
                panel: o.newPanel[0],
                index: o.newTab.closest("li").index()
            })), k) : !1
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        select: function (h) {
            h = this._getIndex(h);
            if (h === -1) {
                if (!this.options.collapsible || this.options.selected === -1) {
                    return
                }
                h = this.options.selected
            }
            this.anchors.eq(h).trigger(this.options.event + this.eventNamespace)
        }
    }), function () {
        var e = 0;
        f.widget("ui.tabs", f.ui.tabs, {
            options: {cookie: null}, _create: function () {
                var i = this.options, h;
                i.active == null && i.cookie && (h = parseInt(this._cookie(), 10), h === -1 && (h = !1), i.active = h), this._super()
            }, _cookie: function (i) {
                var h = [this.cookie || (this.cookie = this.options.cookie.name || "ui-tabs-" + ++e)];
                return arguments.length && (h.push(i === !1 ? -1 : i), h.push(this.options.cookie)), f.cookie.apply(null, h)
            }, _refresh: function () {
                this._super(), this.options.cookie && this._cookie(this.options.active, this.options.cookie)
            }, _eventHandler: function () {
                this._superApply(arguments), this.options.cookie && this._cookie(this.options.active, this.options.cookie)
            }, _destroy: function () {
                this._super(), this.options.cookie && this._cookie(null, this.options.cookie)
            }
        })
    }(), f.widget("ui.tabs", f.ui.tabs, {
        _trigger: function (h, k, j) {
            var e = f.extend({}, j);
            return h === "load" && (e.panel = e.panel[0], e.tab = e.tab.find(".ui-tabs-anchor")[0]), this._super(h, k, e)
        }
    }), f.widget("ui.tabs", f.ui.tabs, {
        options: {fx: null}, _getFx: function () {
            var e, i, h = this.options.fx;
            return h && (f.isArray(h) ? (e = h[0], i = h[1]) : e = i = h), h ? {show: i, hide: e} : null
        }, _toggle: function (p, k) {
            function q() {
                v.running = !1, v._trigger("activate", p, k)
            }

            function h() {
                k.newTab.closest("li").addClass("ui-tabs-active ui-state-active"), m.length && l.show ? m.animate(l.show, l.show.duration, function () {
                    q()
                }) : (m.show(), q())
            }

            var v = this, m = k.newPanel, j = k.oldPanel, l = this._getFx();
            if (!l) {
                return this._super(p, k)
            }
            v.running = !0, j.length && l.hide ? j.animate(l.hide, l.hide.duration, function () {
                k.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), h()
            }) : (k.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), j.hide(), h())
        }
    }))
})(jQuery);
jQuery.effects || function (c, a) {
    var d = c.uiBackCompat !== !1, b = "ui-effects-";
    c.effects = {effect: {}}, function (D, k) {
        function g(i, f, l) {
            var h = A[f.type] || {};
            return i == null ? l || !f.def ? null : f.def : (i = h.floor ? ~~i : parseFloat(i), isNaN(i) ? f.def : h.mod ? (i + h.mod) % h.mod : 0 > i ? 0 : h.max < i ? h.max : i)
        }

        function y(h) {
            var i = j(), f = i._rgba = [];
            return h = h.toLowerCase(), w(E, function (p, n) {
                var r, v = n.re.exec(h), l = v && n.parse(v), u = n.space || "rgba";
                if (l) {
                    return r = i[u](l), i[C[u].cache] = r[C[u].cache], f = i._rgba = r._rgba, !1
                }
            }), f.length ? (f.join() === "0,0,0,0" && D.extend(f, z.transparent), i) : z[h]
        }

        function B(h, f, i) {
            return i = (i + 1) % 1, i * 6 < 1 ? h + (f - h) * i * 6 : i * 2 < 1 ? f : i * 3 < 2 ? h + (f - h) * (2 / 3 - i) * 6 : h
        }

        var e = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "), q = /^([\-+])=\s*(\d+\.?\d*)/, E = [{
            re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            parse: function (f) {
                return [f[1], f[2], f[3], f[4]]
            }
        }, {
            re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            parse: function (f) {
                return [f[1] * 2.55, f[2] * 2.55, f[3] * 2.55, f[4]]
            }
        }, {
            re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, parse: function (f) {
                return [parseInt(f[1], 16), parseInt(f[2], 16), parseInt(f[3], 16)]
            }
        }, {
            re: /#([a-f0-9])([a-f0-9])([a-f0-9])/, parse: function (f) {
                return [parseInt(f[1] + f[1], 16), parseInt(f[2] + f[2], 16), parseInt(f[3] + f[3], 16)]
            }
        }, {
            re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            space: "hsla",
            parse: function (f) {
                return [f[1], f[2] / 100, f[3] / 100, f[4]]
            }
        }], j = D.Color = function (l, o, h, f) {
            return new D.Color.fn.parse(l, o, h, f)
        }, C = {
            rgba: {
                props: {
                    red: {idx: 0, type: "byte"},
                    green: {idx: 1, type: "byte"},
                    blue: {idx: 2, type: "byte"}
                }
            },
            hsla: {
                props: {
                    hue: {idx: 0, type: "degrees"},
                    saturation: {idx: 1, type: "percent"},
                    lightness: {idx: 2, type: "percent"}
                }
            }
        }, A = {
            "byte": {floor: !0, max: 255},
            percent: {max: 1},
            degrees: {mod: 360, floor: !0}
        }, x = j.support = {}, m = D("<p>")[0], z, w = D.each;
        m.style.cssText = "background-color:rgba(1,1,1,.5)", x.rgba = m.style.backgroundColor.indexOf("rgba") > -1, w(C, function (h, f) {
            f.cache = "_" + h, f.props.alpha = {idx: 3, type: "percent", def: 1}
        }), j.fn = D.extend(j.prototype, {
            parse: function (u, p, t, n) {
                if (u === k) {
                    return this._rgba = [null, null, null, null], this
                }
                if (u.jquery || u.nodeType) {
                    u = D(u).css(p), p = k
                }
                var F = this, h = D.type(u), o = this._rgba = [];
                p !== k && (u = [u, p, t, n], h = "array");
                if (h === "string") {
                    return this.parse(y(u) || z._default)
                }
                if (h === "array") {
                    return w(C.rgba.props, function (i, f) {
                        o[f.idx] = g(u[f.idx], f)
                    }), this
                }
                if (h === "object") {
                    return u instanceof j ? w(C, function (i, f) {
                        u[f.cache] && (F[f.cache] = u[f.cache].slice())
                    }) : w(C, function (l, r) {
                        var f = r.cache;
                        w(r.props, function (s, i) {
                            if (!F[f] && r.to) {
                                if (s === "alpha" || u[s] == null) {
                                    return
                                }
                                F[f] = r.to(F._rgba)
                            }
                            F[f][i.idx] = g(u[s], i, !0)
                        }), F[f] && c.inArray(null, F[f].slice(0, 3)) < 0 && (F[f][3] = 1, r.from && (F._rgba = r.from(F[f])))
                    }), this
                }
            }, is: function (i) {
                var f = j(i), l = !0, h = this;
                return w(C, function (r, n) {
                    var p, t = f[n.cache];
                    return t && (p = h[n.cache] || n.to && n.to(h._rgba) || [], w(n.props, function (s, o) {
                        if (t[o.idx] != null) {
                            return l = t[o.idx] === p[o.idx], l
                        }
                    })), l
                }), l
            }, _space: function () {
                var h = [], f = this;
                return w(C, function (l, i) {
                    f[i.cache] && h.push(l)
                }), h.pop()
            }, transition: function (G, p) {
                var H = j(G), v = H._space(), o = C[v], u = this.alpha() === 0 ? j("transparent") : this, F = u[o.cache] || o.to(u._rgba), h = F.slice();
                return H = H[o.cache], w(o.props, function (I, t) {
                    var l = t.idx, n = F[l], J = H[l], f = A[t.type] || {};
                    if (J === null) {
                        return
                    }
                    n === null ? h[l] = J : (f.mod && (J - n > f.mod / 2 ? n += f.mod : n - J > f.mod / 2 && (n -= f.mod)), h[l] = g((J - n) * p + n, t))
                }), this[v](h)
            }, blend: function (l) {
                if (this._rgba[3] === 1) {
                    return this
                }
                var o = this._rgba.slice(), h = o.pop(), f = j(l)._rgba;
                return j(D.map(o, function (n, i) {
                    return (1 - h) * f[i] + h * n
                }))
            }, toRgbaString: function () {
                var f = "rgba(", h = D.map(this._rgba, function (l, i) {
                    return l == null ? i > 2 ? 1 : 0 : l
                });
                return h[3] === 1 && (h.pop(), f = "rgb("), f + h.join() + ")"
            }, toHslaString: function () {
                var f = "hsla(", h = D.map(this.hsla(), function (l, i) {
                    return l == null && (l = i > 2 ? 1 : 0), i && i < 3 && (l = Math.round(l * 100) + "%"), l
                });
                return h[3] === 1 && (h.pop(), f = "hsl("), f + h.join() + ")"
            }, toHexString: function (h) {
                var i = this._rgba.slice(), f = i.pop();
                return h && i.push(~~(f * 255)), "#" + D.map(i, function (l) {
                    return l = (l || 0).toString(16), l.length === 1 ? "0" + l : l
                }).join("")
            }, toString: function () {
                return this._rgba[3] === 0 ? "transparent" : this.toRgbaString()
            }
        }), j.fn.parse.prototype = j.fn, C.hsla.to = function (I) {
            if (I[0] == null || I[1] == null || I[2] == null) {
                return [null, null, null, I[3]]
            }
            var M = I[0] / 255, v = I[1] / 255, h = I[2] / 255, G = I[3], N = Math.max(M, v, h), p = Math.min(M, v, h), L = N - p, K = N + p, H = K * 0.5, F, J;
            return p === N ? F = 0 : M === N ? F = 60 * (v - h) / L + 360 : v === N ? F = 60 * (h - M) / L + 120 : F = 60 * (M - v) / L + 240, H === 0 || H === 1 ? J = H : H <= 0.5 ? J = L / K : J = L / (2 - K), [Math.round(F) % 360, J, H, G == null ? 1 : G]
        }, C.hsla.from = function (u) {
            if (u[0] == null || u[1] == null || u[2] == null) {
                return [null, null, null, u[3]]
            }
            var h = u[0] / 360, F = u[1], p = u[2], f = u[3], l = p <= 0.5 ? p * (1 + F) : p + F - p * F, v = 2 * p - l;
            return [Math.round(B(v, l, h + 1 / 3) * 255), Math.round(B(v, l, h) * 255), Math.round(B(v, l, h - 1 / 3) * 255), f]
        }, w(C, function (p, n) {
            var l = n.props, i = n.cache, h = n.to, o = n.from;
            j.fn[p] = function (u) {
                h && !this[i] && (this[i] = h(this._rgba));
                if (u === k) {
                    return this[i].slice()
                }
                var t, s = D.type(u), f = s === "array" || s === "object" ? u : arguments, v = this[i].slice();
                return w(l, function (F, r) {
                    var G = f[s === "object" ? F : r.idx];
                    G == null && (G = v[r.idx]), v[r.idx] = g(G, r)
                }), o ? (t = j(o(v)), t[i] = v, t) : j(v)
            }, w(l, function (s, f) {
                if (j.fn[s]) {
                    return
                }
                j.fn[s] = function (F) {
                    var H = D.type(F), v = s === "alpha" ? this._hsla ? "hsla" : "rgba" : p, t = this[v](), G = t[f.idx], r;
                    return H === "undefined" ? G : (H === "function" && (F = F.call(this, G), H = D.type(F)), F == null && f.empty ? this : (H === "string" && (r = q.exec(F), r && (F = G + parseFloat(r[2]) * (r[1] === "+" ? 1 : -1))), t[f.idx] = F, this[v](t)))
                }
            })
        }), w(e, function (f, h) {
            D.cssHooks[h] = {
                set: function (G, F) {
                    var t, v, p = "";
                    if (D.type(F) !== "string" || (t = y(F))) {
                        F = j(t || F);
                        if (!x.rgba && F._rgba[3] !== 1) {
                            v = h === "backgroundColor" ? G.parentNode : G;
                            while ((p === "" || p === "transparent") && v && v.style) {
                                try {
                                    p = D.css(v, "backgroundColor"), v = v.parentNode
                                } catch (o) {
                                }
                            }
                            F = F.blend(p && p !== "transparent" ? p : "_default")
                        }
                        F = F.toRgbaString()
                    }
                    try {
                        G.style[h] = F
                    } catch (n) {
                    }
                }
            }, D.fx.step[h] = function (i) {
                i.colorInit || (i.start = j(i.elem, h), i.end = j(i.end), i.colorInit = !0), D.cssHooks[h].set(i.elem, i.start.transition(i.end, i.pos))
            }
        }), D.cssHooks.borderColor = {
            expand: function (h) {
                var f = {};
                return w(["Top", "Right", "Bottom", "Left"], function (l, i) {
                    f["border" + i + "Color"] = h
                }), f
            }
        }, z = D.Color.names = {
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            transparent: [null, null, null, 0],
            _default: "#ffffff"
        }
    }(jQuery), function () {
        function e() {
            var k = this.ownerDocument.defaultView ? this.ownerDocument.defaultView.getComputedStyle(this, null) : this.currentStyle, m = {}, l, j;
            if (k && k.length && k[0] && k[k[0]]) {
                j = k.length;
                while (j--) {
                    l = k[j], typeof k[l] == "string" && (m[c.camelCase(l)] = k[l])
                }
            } else {
                for (l in k) {
                    typeof k[l] == "string" && (m[l] = k[l])
                }
            }
            return m
        }

        function f(k, p) {
            var j = {}, l, m;
            for (l in p) {
                m = p[l], k[l] !== m && !g[l] && (c.fx.step[l] || !isNaN(parseFloat(m))) && (j[l] = m)
            }
            return j
        }

        var h = ["add", "remove", "toggle"], g = {
            border: 1,
            borderBottom: 1,
            borderColor: 1,
            borderLeft: 1,
            borderRight: 1,
            borderTop: 1,
            borderWidth: 1,
            margin: 1,
            padding: 1
        };
        c.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (i, j) {
            c.fx.step[j] = function (k) {
                if (k.end !== "none" && !k.setAttr || k.pos === 1 && !k.setAttr) {
                    jQuery.style(k.elem, j, k.end), k.setAttr = !0
                }
            }
        }), c.effects.animateClass = function (k, l, m, j) {
            var i = c.speed(l, m, j);
            return this.queue(function () {
                var p = c(this), s = p.attr("class") || "", n, q = i.children ? p.find("*").andSelf() : p;
                q = q.map(function () {
                    var o = c(this);
                    return {el: o, start: e.call(this)}
                }), n = function () {
                    c.each(h, function (o, r) {
                        k[r] && p[r + "Class"](k[r])
                    })
                }, n(), q = q.map(function () {
                    return this.end = e.call(this.el[0]), this.diff = f(this.start, this.end), this
                }), p.attr("class", s), q = q.map(function () {
                    var o = this, v = c.Deferred(), u = jQuery.extend({}, i, {
                        queue: !1, complete: function () {
                            v.resolve(o)
                        }
                    });
                    return this.el.animate(this.diff, u), v.promise()
                }), c.when.apply(c, q.get()).done(function () {
                    n(), c.each(arguments, function () {
                        var o = this.el;
                        c.each(this.diff, function (r) {
                            o.css(r, "")
                        })
                    }), i.complete.call(p[0])
                })
            })
        }, c.fn.extend({
            _addClass: c.fn.addClass, addClass: function (k, m, l, j) {
                return m ? c.effects.animateClass.call(this, {add: k}, m, l, j) : this._addClass(k)
            }, _removeClass: c.fn.removeClass, removeClass: function (k, m, l, j) {
                return m ? c.effects.animateClass.call(this, {remove: k}, m, l, j) : this._removeClass(k)
            }, _toggleClass: c.fn.toggleClass, toggleClass: function (p, l, j, k, m) {
                return typeof l == "boolean" || l === a ? j ? c.effects.animateClass.call(this, l ? {add: p} : {remove: p}, j, k, m) : this._toggleClass(p, l) : c.effects.animateClass.call(this, {toggle: p}, l, j, k)
            }, switchClass: function (k, o, m, j, l) {
                return c.effects.animateClass.call(this, {add: o, remove: k}, m, j, l)
            }
        })
    }(), function () {
        function e(h, k, j, g) {
            c.isPlainObject(h) && (k = h, h = h.effect), h = {effect: h}, k == null && (k = {}), c.isFunction(k) && (g = k, j = null, k = {});
            if (typeof k == "number" || c.fx.speeds[k]) {
                g = j, j = k, k = {}
            }
            return c.isFunction(j) && (g = j, j = null), k && c.extend(h, k), j = j || k.duration, h.duration = c.fx.off ? 0 : typeof j == "number" ? j : j in c.fx.speeds ? c.fx.speeds[j] : c.fx.speeds._default, h.complete = g || k.complete, h
        }

        function f(g) {
            return !g || typeof g == "number" || c.fx.speeds[g] ? !0 : typeof g == "string" && !c.effects.effect[g] ? d && c.effects[g] ? !1 : !0 : !1
        }

        c.extend(c.effects, {
            version: "1.9.2", save: function (h, g) {
                for (var i = 0; i < g.length; i++) {
                    g[i] !== null && h.data(b + g[i], h[0].style[g[i]])
                }
            }, restore: function (j, k) {
                var g, h;
                for (h = 0; h < k.length; h++) {
                    k[h] !== null && (g = j.data(b + k[h]), g === a && (g = ""), j.css(k[h], g))
                }
            }, setMode: function (h, g) {
                return g === "toggle" && (g = h.is(":hidden") ? "show" : "hide"), g
            }, getBaseline: function (i, g) {
                var j, h;
                switch (i[0]) {
                    case"top":
                        j = 0;
                        break;
                    case"middle":
                        j = 0.5;
                        break;
                    case"bottom":
                        j = 1;
                        break;
                    default:
                        j = i[0] / g.height
                }
                switch (i[1]) {
                    case"left":
                        h = 0;
                        break;
                    case"center":
                        h = 0.5;
                        break;
                    case"right":
                        h = 1;
                        break;
                    default:
                        h = i[1] / g.width
                }
                return {x: h, y: j}
            }, createWrapper: function (h) {
                if (h.parent().is(".ui-effects-wrapper")) {
                    return h.parent()
                }
                var m = {
                    width: h.outerWidth(!0),
                    height: h.outerHeight(!0),
                    "float": h.css("float")
                }, k = c("<div></div>").addClass("ui-effects-wrapper").css({
                    fontSize: "100%",
                    background: "transparent",
                    border: "none",
                    margin: 0,
                    padding: 0
                }), g = {width: h.width(), height: h.height()}, j = document.activeElement;
                try {
                    j.id
                } catch (l) {
                    j = document.body
                }
                return h.wrap(k), (h[0] === j || c.contains(h[0], j)) && c(j).focus(), k = h.parent(), h.css("position") === "static" ? (k.css({position: "relative"}), h.css({position: "relative"})) : (c.extend(m, {
                    position: h.css("position"),
                    zIndex: h.css("z-index")
                }), c.each(["top", "left", "bottom", "right"], function (n, i) {
                    m[i] = h.css(i), isNaN(parseInt(m[i], 10)) && (m[i] = "auto")
                }), h.css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    right: "auto",
                    bottom: "auto"
                })), h.css(g), k.css(m).show()
            }, removeWrapper: function (g) {
                var h = document.activeElement;
                return g.parent().is(".ui-effects-wrapper") && (g.parent().replaceWith(g), (g[0] === h || c.contains(g[0], h)) && c(h).focus()), g
            }, setTransition: function (h, k, j, g) {
                return g = g || {}, c.each(k, function (l, m) {
                    var i = h.cssUnit(m);
                    i[0] > 0 && (g[m] = i[0] * j + i[1])
                }), g
            }
        }), c.fn.extend({
            effect: function () {
                function g(t) {
                    function m() {
                        c.isFunction(o) && o.call(q[0]), c.isFunction(t) && t()
                    }

                    var q = c(this), o = i.complete, p = i.mode;
                    (q.is(":hidden") ? p === "hide" : p === "show") ? m() : l.call(q[0], i, m)
                }

                var i = e.apply(this, arguments), k = i.mode, j = i.queue, l = c.effects.effect[i.effect], h = !l && d && c.effects[i.effect];
                return c.fx.off || !l && !h ? k ? this[k](i.duration, i.complete) : this.each(function () {
                    i.complete && i.complete.call(this)
                }) : l ? j === !1 ? this.each(g) : this.queue(j || "fx", g) : h.call(this, {
                    options: i,
                    duration: i.duration,
                    callback: i.complete,
                    mode: i.mode
                })
            }, _show: c.fn.show, show: function (h) {
                if (f(h)) {
                    return this._show.apply(this, arguments)
                }
                var g = e.apply(this, arguments);
                return g.mode = "show", this.effect.call(this, g)
            }, _hide: c.fn.hide, hide: function (h) {
                if (f(h)) {
                    return this._hide.apply(this, arguments)
                }
                var g = e.apply(this, arguments);
                return g.mode = "hide", this.effect.call(this, g)
            }, __toggle: c.fn.toggle, toggle: function (g) {
                if (f(g) || typeof g == "boolean" || c.isFunction(g)) {
                    return this.__toggle.apply(this, arguments)
                }
                var h = e.apply(this, arguments);
                return h.mode = "toggle", this.effect.call(this, h)
            }, cssUnit: function (g) {
                var i = this.css(g), h = [];
                return c.each(["em", "px", "%", "pt"], function (k, j) {
                    i.indexOf(j) > 0 && (h = [parseFloat(i), j])
                }), h
            }
        })
    }(), function () {
        var e = {};
        c.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (f, g) {
            e[g] = function (h) {
                return Math.pow(h, f + 2)
            }
        }), c.extend(e, {
            Sine: function (f) {
                return 1 - Math.cos(f * Math.PI / 2)
            }, Circ: function (f) {
                return 1 - Math.sqrt(1 - f * f)
            }, Elastic: function (f) {
                return f === 0 || f === 1 ? f : -Math.pow(2, 8 * (f - 1)) * Math.sin(((f - 1) * 80 - 7.5) * Math.PI / 15)
            }, Back: function (f) {
                return f * f * (3 * f - 2)
            }, Bounce: function (g) {
                var f, h = 4;
                while (g < ((f = Math.pow(2, --h)) - 1) / 11) {
                }
                return 1 / Math.pow(4, 3 - h) - 7.5625 * Math.pow((f * 3 - 2) / 22 - g, 2)
            }
        }), c.each(e, function (f, g) {
            c.easing["easeIn" + f] = g, c.easing["easeOut" + f] = function (h) {
                return 1 - g(1 - h)
            }, c.easing["easeInOut" + f] = function (h) {
                return h < 0.5 ? g(h * 2) / 2 : 1 - g(h * -2 + 2) / 2
            }
        })
    }()
}(jQuery);
(function (b, a) {
    b.effects.effect.fade = function (d, f) {
        var e = b(this), c = b.effects.setMode(e, d.mode || "toggle");
        e.animate({opacity: c}, {queue: !1, duration: d.duration, easing: d.easing, complete: f})
    }
})(jQuery);
jQuery.fn.quickOuterHeight = function (b) {
    var c = this.get(0);
    if (true !== b) {
        return c.offsetHeight
    }
    if (window.getComputedStyle) {
        var a = window.getComputedStyle(c, null);
        return c.offsetHeight + (parseInt(a.getPropertyValue("margin-top"), 10) || 0) + (parseInt(a.getPropertyValue("margin-bottom"), 10) || 0)
    } else {
        return c.offsetHeight + (parseInt(c.currentStyle.marginTop, 10) || 0) + (parseInt(c.currentStyle.marginBottom, 10) || 0)
    }
};
jQuery.fn.putCursorAtEnd = function () {
    return this.each(function () {
        this.focus();
        if (this.setSelectionRange) {
            var a = this.value.length * 2;
            this.setSelectionRange(a, a)
        } else {
            this.value = this.value
        }
        this.scrollTop = 999999
    })
};
jQuery.fn.reverse = [].reverse;
if (typeof(String.prototype.localeCompare) === "undefined") {
    String.prototype.localeCompare = function (c, a, b) {
        return ((this == c) ? 0 : ((this > c) ? 1 : -1))
    }
}
(function (a) {
    a.belowthefold = function (c, d) {
        var b = a(window).height() + a(window).scrollTop();
        if (!d.threshold) {
            d.threshold = -46
        }
        return b <= a(c).offset().top - d.threshold
    };
    a.abovethetop = function (b, c) {
        var d = a(window).scrollTop();
        return d >= a(b).offset().top + a(b).height() - c.threshold
    };
    a.rightofscreen = function (c, d) {
        var b = a(window).width() + a(window).scrollLeft();
        return b <= a(c).offset().left - d.threshold
    };
    a.leftofscreen = function (b, c) {
        var d = a(window).scrollLeft();
        return d >= a(b).offset().left + a(b).width() - c.threshold
    };
    a.inviewport = function (b, c) {
        return !a.rightofscreen(b, c) && !a.leftofscreen(b, c) && !a.belowthefold(b, c) && !a.abovethetop(b, c)
    };
    a.extend(a.expr[":"], {
        "below-the-fold": function (c, d, b) {
            return a.belowthefold(c, {threshold: 0})
        }, "above-the-top": function (c, d, b) {
            return a.abovethetop(c, {threshold: 0})
        }, "left-of-screen": function (c, d, b) {
            return a.leftofscreen(c, {threshold: 0})
        }, "right-of-screen": function (c, d, b) {
            return a.rightofscreen(c, {threshold: 0})
        }, "in-viewport": function (c, d, b) {
            return a.inviewport(c, {threshold: 0})
        }
    })
})(jQuery);
(function (a, b) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "exports"], function (e, d) {
            b(a, d, e)
        })
    } else {
        if (typeof exports !== "undefined") {
            var c = require("jquery");
            b(a, exports, c)
        } else {
            a.FormSerializer = b(a, {}, (a.jQuery || a.Zepto || a.ender || a.$))
        }
    }
}(this, function (a, b, d) {
    var c = b.FormSerializer = function c(g) {
        var j = {}, l = {};

        function n(s, q, r) {
            s[q] = r;
            return s
        }

        function o(r, u) {
            var t = r.match(c.patterns.key), s;
            while ((s = t.pop()) !== undefined) {
                if (c.patterns.push.test(s)) {
                    var q = h(r.replace(/\[\]$/, ""));
                    u = n([], q, u)
                } else {
                    if (c.patterns.fixed.test(s)) {
                        u = n([], s, u)
                    } else {
                        if (c.patterns.named.test(s)) {
                            u = n({}, s, u)
                        }
                    }
                }
            }
            return u
        }

        function h(q) {
            if (l[q] === undefined) {
                l[q] = 0
            }
            return l[q]++
        }

        function i(r) {
            if (!c.patterns.validate.test(r.name)) {
                return this
            }
            var q = o(r.name, r.value);
            j = g.extend(true, j, q);
            return this
        }

        function k(s) {
            if (!g.isArray(s)) {
                throw new Error("formSerializer.addPairs expects an Array")
            }
            for (var r = 0, q = s.length; r < q; r++) {
                this.addPair(s[r])
            }
            return this
        }

        function p() {
            return j
        }

        function m() {
            return JSON.stringify(p())
        }

        this.addPair = i;
        this.addPairs = k;
        this.serialize = p;
        this.serializeJSON = m
    };
    c.patterns = {
        validate: /^[a-z][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
        key: /[a-z0-9_]+|(?=\[\])/gi,
        push: /^$/,
        fixed: /^\d+$/,
        named: /^[a-z0-9_]+$/i
    };
    c.serializeObject = function f(h) {
        if (this.length > 1) {
            return new Error("jquery-serialize-object can only serialize one form at a time")
        }
        var g = this.serializeArray();
        if (h && d.isArray(h) && h.length) {
            g = g.concat(h)
        }
        return new c(d).addPairs(g).serialize()
    };
    c.serializeJSON = function e(h) {
        if (this.length > 1) {
            return new Error("jquery-serialize-object can only serialize one form at a time")
        }
        var g = this.serializeArray();
        if (h && d.isArray(h) && h.length) {
            g = g.concat(h)
        }
        return new c(d).addPairs(g).serializeJSON()
    };
    if (typeof d.fn !== "undefined") {
        d.fn.serializeObject = c.serializeObject;
        d.fn.serializeJSON = c.serializeJSON
    }
    return c
}));
(function (b) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], b)
    } else {
        b(jQuery)
    }
}(function (c) {
    var a = c.scrollTo = function (e, d, f) {
        return c(window).scrollTo(e, d, f)
    };
    a.defaults = {axis: "xy", duration: parseFloat(c.fn.jquery) >= 1.3 ? 0 : 1, limit: true};
    a.window = function (d) {
        return c(window)._scrollable()
    };
    c.fn._scrollable = function () {
        return this.map(function () {
            var e = this, f = !e.nodeName || c.inArray(e.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"]) != -1;
            if (!f) {
                return e
            }
            var d = (e.contentWindow || e).document || e.ownerDocument || e;
            return /webkit/i.test(navigator.userAgent) || d.compatMode == "BackCompat" ? d.body : d.documentElement
        })
    };
    c.fn.scrollTo = function (i, e, d) {
        if (typeof e == "object") {
            d = e;
            e = 0
        }
        if (typeof d == "function") {
            d = {onAfter: d}
        }
        if (i == "max") {
            i = 9000000000
        }
        d = c.extend({}, a.defaults, d);
        e = e || d.duration;
        d.queue = d.queue && d.axis.length > 1;
        if (d.queue) {
            e /= 2
        }
        d.offset = b(d.offset);
        d.over = b(d.over);
        return this._scrollable().each(function () {
            if (i == null) {
                return
            }
            var n = this, j = c(n), k = i, h, f = {}, m = j.is("html,body");
            switch (typeof k) {
                case"number":
                case"string":
                    if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(k)) {
                        k = b(k);
                        break
                    }
                    k = m ? c(k) : c(k, this);
                    if (!k.length) {
                        return
                    }
                case"object":
                    if (k.is || k.style) {
                        h = (k = c(k)).offset()
                    }
            }
            var l = c.isFunction(d.offset) && d.offset(n, k) || d.offset;
            c.each(d.axis.split(""), function (t, r) {
                var p = r == "x" ? "Left" : "Top", v = p.toLowerCase(), s = "scroll" + p, q = n[s], o = a.max(n, r);
                if (h) {
                    f[s] = h[v] + (m ? 0 : q - j.offset()[v]);
                    if (d.margin) {
                        f[s] -= parseInt(k.css("margin" + p)) || 0;
                        f[s] -= parseInt(k.css("border" + p + "Width")) || 0
                    }
                    f[s] += l[v] || 0;
                    if (d.over[v]) {
                        f[s] += k[r == "x" ? "width" : "height"]() * d.over[v]
                    }
                } else {
                    var u = k[v];
                    f[s] = u.slice && u.slice(-1) == "%" ? parseFloat(u) / 100 * o : u
                }
                if (d.limit && /^\d+$/.test(f[s])) {
                    f[s] = f[s] <= 0 ? 0 : Math.min(f[s], o)
                }
                if (!t && d.queue) {
                    if (q != f[s]) {
                        g(d.onAfterFirst)
                    }
                    delete f[s]
                }
            });
            g(d.onAfter);
            function g(o) {
                j.animate(f, e, d.easing, o && function () {
                        o.call(this, k, d)
                    })
            }
        }).end()
    };
    a.max = function (h, g) {
        var k = g == "x" ? "Width" : "Height", f = "scroll" + k;
        if (!c(h).is("html,body")) {
            return h[f] - c(h)[k.toLowerCase()]()
        }
        var j = "client" + k, i = h.ownerDocument.documentElement, e = h.ownerDocument.body;
        return Math.max(i[f], e[f]) - Math.min(i[j], e[j])
    };
    function b(d) {
        return c.isFunction(d) || typeof d == "object" ? d : {top: d, left: d}
    }

    return a
}));
/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.11
 *
 * Requires: jQuery 1.2.2+
 */
;
!function (b) {
    "function" == typeof define && define.amd ? define(["jquery"], b) : "object" == typeof exports ? module.exports = b : b(jQuery)
}(function (v) {
    function u(z) {
        var y = z || window.event, x = n.call(arguments, 1), w = 0, k = 0, i = 0, f = 0, e = 0, d = 0;
        if (z = v.event.fix(y), z.type = "mousewheel", "detail" in y && (i = -1 * y.detail), "wheelDelta" in y && (i = y.wheelDelta), "wheelDeltaY" in y && (i = y.wheelDeltaY), "wheelDeltaX" in y && (k = -1 * y.wheelDeltaX), "axis" in y && y.axis === y.HORIZONTAL_AXIS && (k = -1 * i, i = 0), w = 0 === i ? k : i, "deltaY" in y && (i = -1 * y.deltaY, w = i), "deltaX" in y && (k = y.deltaX, 0 === i && (w = -1 * k)), 0 !== i || 0 !== k) {
            if (1 === y.deltaMode) {
                var c = v.data(this, "mousewheel-line-height");
                w *= c, i *= c, k *= c
            } else {
                if (2 === y.deltaMode) {
                    var a = v.data(this, "mousewheel-page-height");
                    w *= a, i *= a, k *= a
                }
            }
            if (f = Math.max(Math.abs(i), Math.abs(k)), (!q || q > f) && (q = f, s(y, f) && (q /= 40)), s(y, f) && (w /= 40, k /= 40, i /= 40), w = Math[w >= 1 ? "floor" : "ceil"](w / q), k = Math[k >= 1 ? "floor" : "ceil"](k / q), i = Math[i >= 1 ? "floor" : "ceil"](i / q), l.settings.normalizeOffset && this.getBoundingClientRect) {
                var A = this.getBoundingClientRect();
                e = z.clientX - A.left, d = z.clientY - A.top
            }
            return z.deltaX = k, z.deltaY = i, z.deltaFactor = q, z.offsetX = e, z.offsetY = d, z.deltaMode = 0, x.unshift(z, w, k, i), r && clearTimeout(r), r = setTimeout(t, 200), (v.event.dispatch || v.event.handle).apply(this, x)
        }
    }

    function t() {
        q = null
    }

    function s(d, c) {
        return l.settings.adjustOldDeltas && "mousewheel" === d.type && c % 120 === 0
    }

    var r, q, p = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], o = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], n = Array.prototype.slice;
    if (v.event.fixHooks) {
        for (var m = p.length; m;) {
            v.event.fixHooks[p[--m]] = v.event.mouseHooks
        }
    }
    var l = v.event.special.mousewheel = {
        version: "3.1.11", setup: function () {
            if (this.addEventListener) {
                for (var a = o.length; a;) {
                    this.addEventListener(o[--a], u, !1)
                }
            } else {
                this.onmousewheel = u
            }
            v.data(this, "mousewheel-line-height", l.getLineHeight(this)), v.data(this, "mousewheel-page-height", l.getPageHeight(this))
        }, teardown: function () {
            if (this.removeEventListener) {
                for (var a = o.length; a;) {
                    this.removeEventListener(o[--a], u, !1)
                }
            } else {
                this.onmousewheel = null
            }
            v.removeData(this, "mousewheel-line-height"), v.removeData(this, "mousewheel-page-height")
        }, getLineHeight: function (a) {
            var d = v(a)["offsetParent" in v.fn ? "offsetParent" : "parent"]();
            return d.length || (d = v("body")), parseInt(d.css("fontSize"), 10)
        }, getPageHeight: function (a) {
            return v(a).height()
        }, settings: {adjustOldDeltas: !0, normalizeOffset: !0}
    };
    v.fn.extend({
        mousewheel: function (b) {
            return b ? this.bind("mousewheel", b) : this.trigger("mousewheel")
        }, unmousewheel: function (b) {
            return this.unbind("mousewheel", b)
        }
    })
});
(function (d) {
    var b = d.event, a, c;
    a = b.special.debouncedresize = {
        setup: function () {
            d(this).on("resize", a.handler)
        }, teardown: function () {
            d(this).off("resize", a.handler)
        }, handler: function (i, e) {
            var h = this, g = arguments, f = function () {
                i.type = "debouncedresize";
                b.dispatch.apply(h, g)
            };
            if (c) {
                clearTimeout(c)
            }
            e ? f() : c = setTimeout(f, a.threshold)
        }, threshold: 100
    }
})(jQuery);
/*! tinyscrollbar - v2.2.1 - 2014-12-16

 ATOMIC MODIFIED

 * http://www.baijs.com/tinyscrollbar
 *
 * Copyright (c) 2014 Maarten Baijs <wieringen@gmail.com>;
 * Licensed under the MIT license */
;
(function (a) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], a)
    } else {
        if (typeof exports === "object") {
            a(require("jquery"))
        } else {
            a(jQuery)
        }
    }
}(function (c) {
    var b = "tinyscrollbar", d = {
        axis: "y",
        wheel: true,
        wheelSpeed: 20,
        wheelLock: true,
        scrollInvert: false,
        trackSize: false,
        thumbSize: false,
        updateOnResize: true
    };

    function a(q, h) {
        this.options = c.extend({}, d, h);
        this._defaults = d;
        this._name = b;
        var p = this, f = q.find(".viewport"), u = q.find(".overview"), t = q.find(".scrollbar"), j = t.find(".track"), n = t.find(".thumb"), y = ("ontouchstart" in document.documentElement), w = "onwheel" in document.createElement("div") ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll", k = this.options.axis === "x", l = k ? "width" : "height", m = k ? "left" : "top", x = 0;
        this.contentPosition = 0;
        this.viewportSize = 0;
        this.contentSize = 0;
        this.contentRatio = 0;
        this.trackSize = 0;
        this.trackRatio = 0;
        this.thumbSize = 0;
        this.thumbPosition = 0;
        function e() {
            p.update();
            r();
            return p
        }

        this.update = function (z) {
            var A = l.charAt(0).toUpperCase() + l.slice(1).toLowerCase();
            this.viewportSize = f[0]["offset" + A];
            this.contentSize = u[0]["scroll" + A];
            this.contentRatio = this.viewportSize / this.contentSize;
            this.trackSize = this.options.trackSize || this.viewportSize;
            this.thumbSize = Math.min(this.trackSize, Math.max(0, (this.options.thumbSize || (this.trackSize * this.contentRatio))));
            this.trackRatio = this.options.thumbSize ? (this.contentSize - this.viewportSize) / (this.trackSize - this.thumbSize) : (this.contentSize / this.trackSize);
            this.thumbPosition = this.contentPosition / this.trackRatio;
            t.toggleClass("disable", this.contentRatio >= 1);
            switch (z) {
                case"bottom":
                    this.contentPosition = Math.max(this.contentSize - this.viewportSize, 0);
                    break;
                case"relative":
                    this.contentPosition = Math.min(Math.max(this.contentSize - this.viewportSize, 0), Math.max(0, this.contentPosition));
                    break;
                default:
                    this.contentPosition = parseInt(z, 10) || 0
            }
            o();
            return p
        };
        function o() {
            n.css(m, p.thumbPosition);
            u.css(m, -p.contentPosition);
            t.css(l, p.trackSize);
            j.css(l, p.trackSize);
            n.css(l, p.thumbSize)
        }

        function r() {
            if (y) {
                f[0].ontouchstart = function (z) {
                    if (1 === z.touches.length) {
                        z.stopPropagation();
                        i(z.touches[0])
                    }
                }
            } else {
                n.bind("mousedown", function (z) {
                    z.stopPropagation();
                    i(z)
                });
                j.bind("mousedown", function (z) {
                    i(z, true)
                })
            }
            if (p.options.updateOnResize) {
                c(window).resize(function () {
                    p.update("relative")
                })
            }
            if (p.options.wheel && window.addEventListener) {
                q[0].addEventListener(w, v, false)
            } else {
                if (p.options.wheel) {
                    q[0].onmousewheel = v
                }
            }
        }

        function i(A, z) {
            c("body").addClass("noSelect");
            x = z ? n.offset()[m] : (k ? A.pageX : A.pageY);
            if (y) {
                document.ontouchmove = function (B) {
                    B.preventDefault();
                    s(B.touches[0])
                };
                document.ontouchend = g
            } else {
                c(document).bind("mousemove", s);
                c(document).bind("mouseup", g);
                n.bind("mouseup", g);
                j.bind("mouseup", g)
            }
            s(A)
        }

        function v(C) {
            if (p.contentRatio < 1) {
                var B = C || window.event, A = -(B.deltaY || B.detail || (-1 / 3 * B.wheelDelta)) / 40, z = (B.deltaMode === 1) ? p.options.wheelSpeed : 1;
                p.contentPosition -= A * z * p.options.wheelSpeed;
                p.contentPosition = Math.min((p.contentSize - p.viewportSize), Math.max(0, p.contentPosition));
                p.thumbPosition = p.contentPosition / p.trackRatio;
                q.trigger("move");
                n.css(m, p.thumbPosition);
                u.css(m, -p.contentPosition);
                if (p.options.wheelLock || (p.contentPosition !== (p.contentSize - p.viewportSize) && p.contentPosition !== 0)) {
                    B = c.event.fix(B);
                    B.preventDefault()
                }
            }
        }

        function s(B) {
            if (p.contentRatio < 1) {
                var z = k ? B.pageX : B.pageY, C = z - x;
                if (p.options.scrollInvert && y) {
                    C = x - z
                }
                var A = Math.min((p.trackSize - p.thumbSize), Math.max(0, p.thumbPosition + C));
                p.contentPosition = A * p.trackRatio;
                q.trigger("move");
                n.css(m, A);
                u.css(m, -p.contentPosition)
            }
        }

        function g() {
            p.thumbPosition = parseInt(n.css(m), 10) || 0;
            c("body").removeClass("noSelect");
            c(document).unbind("mousemove", s);
            c(document).unbind("mouseup", g);
            n.unbind("mouseup", g);
            j.unbind("mouseup", g);
            document.ontouchmove = document.ontouchend = null
        }

        return e()
    }

    c.fn[b] = function (e) {
        return this.each(function () {
            if (!c.data(this, "plugin_" + b)) {
                c.data(this, "plugin_" + b, new a(c(this), e))
            }
        })
    }
}));
jQuery.easing.jswing = jQuery.easing.swing;
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad", swing: function (j, i, b, c, d) {
        return jQuery.easing[jQuery.easing.def](j, i, b, c, d)
    }, easeInQuad: function (j, i, b, c, d) {
        return c * (i /= d) * i + b
    }, easeOutQuad: function (j, i, b, c, d) {
        return -c * (i /= d) * (i - 2) + b
    }, easeInOutQuad: function (j, i, b, c, d) {
        if ((i /= d / 2) < 1) {
            return c / 2 * i * i + b
        }
        return -c / 2 * ((--i) * (i - 2) - 1) + b
    }, easeInCubic: function (j, i, b, c, d) {
        return c * (i /= d) * i * i + b
    }, easeOutCubic: function (j, i, b, c, d) {
        return c * ((i = i / d - 1) * i * i + 1) + b
    }, easeInOutCubic: function (j, i, b, c, d) {
        if ((i /= d / 2) < 1) {
            return c / 2 * i * i * i + b
        }
        return c / 2 * ((i -= 2) * i * i + 2) + b
    }, easeInQuart: function (j, i, b, c, d) {
        return c * (i /= d) * i * i * i + b
    }, easeOutQuart: function (j, i, b, c, d) {
        return -c * ((i = i / d - 1) * i * i * i - 1) + b
    }, easeInOutQuart: function (j, i, b, c, d) {
        if ((i /= d / 2) < 1) {
            return c / 2 * i * i * i * i + b
        }
        return -c / 2 * ((i -= 2) * i * i * i - 2) + b
    }, easeInQuint: function (j, i, b, c, d) {
        return c * (i /= d) * i * i * i * i + b
    }, easeOutQuint: function (j, i, b, c, d) {
        return c * ((i = i / d - 1) * i * i * i * i + 1) + b
    }, easeInOutQuint: function (j, i, b, c, d) {
        if ((i /= d / 2) < 1) {
            return c / 2 * i * i * i * i * i + b
        }
        return c / 2 * ((i -= 2) * i * i * i * i + 2) + b
    }, easeInSine: function (j, i, b, c, d) {
        return -c * Math.cos(i / d * (Math.PI / 2)) + c + b
    }, easeOutSine: function (j, i, b, c, d) {
        return c * Math.sin(i / d * (Math.PI / 2)) + b
    }, easeInOutSine: function (j, i, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * i / d) - 1) + b
    }, easeInExpo: function (j, i, b, c, d) {
        return (i == 0) ? b : c * Math.pow(2, 10 * (i / d - 1)) + b
    }, easeOutExpo: function (j, i, b, c, d) {
        return (i == d) ? b + c : c * (-Math.pow(2, -10 * i / d) + 1) + b
    }, easeInOutExpo: function (j, i, b, c, d) {
        if (i == 0) {
            return b
        }
        if (i == d) {
            return b + c
        }
        if ((i /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (i - 1)) + b
        }
        return c / 2 * (-Math.pow(2, -10 * --i) + 2) + b
    }, easeInCirc: function (j, i, b, c, d) {
        return -c * (Math.sqrt(1 - (i /= d) * i) - 1) + b
    }, easeOutCirc: function (j, i, b, c, d) {
        return c * Math.sqrt(1 - (i = i / d - 1) * i) + b
    }, easeInOutCirc: function (j, i, b, c, d) {
        if ((i /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - i * i) - 1) + b
        }
        return c / 2 * (Math.sqrt(1 - (i -= 2) * i) + 1) + b
    }, easeInElastic: function (o, m, p, a, b) {
        var d = 1.70158;
        var c = 0;
        var n = a;
        if (m == 0) {
            return p
        }
        if ((m /= b) == 1) {
            return p + a
        }
        if (!c) {
            c = b * 0.3
        }
        if (n < Math.abs(a)) {
            n = a;
            var d = c / 4
        } else {
            var d = c / (2 * Math.PI) * Math.asin(a / n)
        }
        return -(n * Math.pow(2, 10 * (m -= 1)) * Math.sin((m * b - d) * (2 * Math.PI) / c)) + p
    }, easeOutElastic: function (o, m, p, a, b) {
        var d = 1.70158;
        var c = 0;
        var n = a;
        if (m == 0) {
            return p
        }
        if ((m /= b) == 1) {
            return p + a
        }
        if (!c) {
            c = b * 0.3
        }
        if (n < Math.abs(a)) {
            n = a;
            var d = c / 4
        } else {
            var d = c / (2 * Math.PI) * Math.asin(a / n)
        }
        return n * Math.pow(2, -10 * m) * Math.sin((m * b - d) * (2 * Math.PI) / c) + a + p
    }, easeInOutElastic: function (o, m, p, a, b) {
        var d = 1.70158;
        var c = 0;
        var n = a;
        if (m == 0) {
            return p
        }
        if ((m /= b / 2) == 2) {
            return p + a
        }
        if (!c) {
            c = b * (0.3 * 1.5)
        }
        if (n < Math.abs(a)) {
            n = a;
            var d = c / 4
        } else {
            var d = c / (2 * Math.PI) * Math.asin(a / n)
        }
        if (m < 1) {
            return -0.5 * (n * Math.pow(2, 10 * (m -= 1)) * Math.sin((m * b - d) * (2 * Math.PI) / c)) + p
        }
        return n * Math.pow(2, -10 * (m -= 1)) * Math.sin((m * b - d) * (2 * Math.PI) / c) * 0.5 + a + p
    }, easeInBack: function (l, k, b, c, d, j) {
        if (j == undefined) {
            j = 1.70158
        }
        return c * (k /= d) * k * ((j + 1) * k - j) + b
    }, easeOutBack: function (l, k, b, c, d, j) {
        if (j == undefined) {
            j = 1.70158
        }
        return c * ((k = k / d - 1) * k * ((j + 1) * k + j) + 1) + b
    }, easeInOutBack: function (l, k, b, c, d, j) {
        if (j == undefined) {
            j = 1.70158
        }
        if ((k /= d / 2) < 1) {
            return c / 2 * (k * k * (((j *= (1.525)) + 1) * k - j)) + b
        }
        return c / 2 * ((k -= 2) * k * (((j *= (1.525)) + 1) * k + j) + 2) + b
    }, easeInBounce: function (j, i, b, c, d) {
        return c - jQuery.easing.easeOutBounce(j, d - i, 0, c, d) + b
    }, easeOutBounce: function (j, i, b, c, d) {
        if ((i /= d) < (1 / 2.75)) {
            return c * (7.5625 * i * i) + b
        } else {
            if (i < (2 / 2.75)) {
                return c * (7.5625 * (i -= (1.5 / 2.75)) * i + 0.75) + b
            } else {
                if (i < (2.5 / 2.75)) {
                    return c * (7.5625 * (i -= (2.25 / 2.75)) * i + 0.9375) + b
                } else {
                    return c * (7.5625 * (i -= (2.625 / 2.75)) * i + 0.984375) + b
                }
            }
        }
    }, easeInOutBounce: function (j, i, b, c, d) {
        if (i < d / 2) {
            return jQuery.easing.easeInBounce(j, i * 2, 0, c, d) * 0.5 + b
        }
        return jQuery.easing.easeOutBounce(j, i * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
    }
});