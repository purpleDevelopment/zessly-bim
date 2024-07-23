var isRetina = (window.devicePixelRatio >= 2);
var Prototype = {
    Version: "1.6.1",
    Browser: (function() {
        var c = navigator.userAgent;
        var d = Object.prototype.toString.call(window.opera) == "[object Opera]";
        return {
            IE: !!window.attachEvent && !d,
            Opera: d,
            WebKit: c.indexOf("AppleWebKit/") > -1,
            Gecko: c.indexOf("Gecko") > -1 && c.indexOf("KHTML") === -1,
            MobileSafari: /Apple.*Mobile.*Safari/.test(c)
        }
    })(),
    BrowserFeatures: {
        XPath: !!document.evaluate,
        SelectorsAPI: !!document.querySelector,
        ElementExtensions: (function() {
            var b = window.Element || window.HTMLElement;
            return !! (b && b.prototype)
        })(),
        SpecificElementExtensions: (function() {
            if (typeof window.HTMLDivElement !== "undefined") {
                return true
            }
            var f = document.createElement("div");
            var d = document.createElement("form");
            var e = false;
            if (f.__proto__ && (f.__proto__ !== d.__proto__)) {
                e = true
            }
            f = d = null;
            return e
        })()
    },
    ScriptFragment: "<script[^>]*>([\\S\\s]*?)<\/script>",
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    emptyFunction: function() {},
    K: function(b) {
        return b
    }
};
if (Prototype.Browser.MobileSafari) {
    Prototype.BrowserFeatures.SpecificElementExtensions = false
}
var Abstract = {};
var Try = {
    these: function() {
        var j;
        for (var e = 0, i = arguments.length; e < i; e++) {
            var g = arguments[e];
            try {
                j = g();
                break
            } catch(h) {}
        }
        return j
    }
};
var Class = (function() {
    function e() {}
    function d() {
        var a = null,
        b = $A(arguments);
        if (Object.isFunction(b[0])) {
            a = b.shift()
        }
        function h() {
            this.initialize.apply(this, arguments)
        }
        Object.extend(h, Class.Methods);
        h.superclass = a;
        h.subclasses = [];
        if (a) {
            e.prototype = a.prototype;
            h.prototype = new e;
            a.subclasses.push(h)
        }
        for (var c = 0; c < b.length; c++) {
            h.addMethods(b[c])
        }
        if (!h.prototype.initialize) {
            h.prototype.initialize = Prototype.emptyFunction
        }
        h.prototype.constructor = h;
        return h
    }
    function f(b) {
        var n = this.superclass && this.superclass.prototype;
        var o = Object.keys(b);
        if (!Object.keys({
            toString: true
        }).length) {
            if (b.toString != Object.prototype.toString) {
                o.push("toString")
            }
            if (b.valueOf != Object.prototype.valueOf) {
                o.push("valueOf")
            }
        }
        for (var p = 0, m = o.length; p < m; p++) {
            var c = o[p],
            i = b[c];
            if (n && Object.isFunction(i) && i.argumentNames().first() == "$super") {
                var a = i;
                i = (function(g) {
                    return function() {
                        return n[g].apply(this, arguments)
                    }
                })(c).wrap(a);
                i.valueOf = a.valueOf.bind(a);
                i.toString = a.toString.bind(a)
            }
            this.prototype[c] = i
        }
        return this
    }
    return {
        create: d,
        Methods: {
            addMethods: f
        }
    }
})(); (function() {
    var C = Object.prototype.toString;
    function x(c, a) {
        for (var b in a) {
            c[b] = a[b]
        }
        return c
    }
    function u(b) {
        try {
            if (B(b)) {
                return "undefined"
            }
            if (b === null) {
                return "null"
            }
            return b.inspect ? b.inspect() : String(b)
        } catch(a) {
            if (a instanceof RangeError) {
                return "..."
            }
            throw a
        }
    }
    function v(e) {
        var c = typeof e;
        switch (c) {
        case "undefined":
        case "function":
        case "unknown":
            return;
        case "boolean":
            return e.toString()
        }
        if (e === null) {
            return "null"
        }
        if (e.toJSON) {
            return e.toJSON()
        }
        if (y(e)) {
            return
        }
        var d = [];
        for (var a in e) {
            var b = v(e[a]);
            if (!B(b)) {
                d.push(a.toJSON() + ": " + b)
            }
        }
        return "{" + d.join(", ") + "}"
    }
    function D(a) {
        return $H(a).toQueryString()
    }
    function A(a) {
        return a && a.toHTML ? a.toHTML() : String.interpret(a)
    }
    function r(c) {
        var b = [];
        for (var a in c) {
            b.push(a)
        }
        return b
    }
    function t(c) {
        var b = [];
        for (var a in c) {
            b.push(c[a])
        }
        return b
    }
    function w(a) {
        return x({},
        a)
    }
    function y(a) {
        return !! (a && a.nodeType == 1)
    }
    function z(a) {
        return C.call(a) == "[object Array]"
    }
    function q(a) {
        return a instanceof Hash
    }
    function E(a) {
        return typeof a === "function"
    }
    function F(a) {
        return C.call(a) == "[object String]"
    }
    function s(a) {
        return C.call(a) == "[object Number]"
    }
    function B(a) {
        return typeof a === "undefined"
    }
    x(Object, {
        extend: x,
        inspect: u,
        toJSON: v,
        toQueryString: D,
        toHTML: A,
        keys: r,
        values: t,
        clone: w,
        isElement: y,
        isArray: z,
        isHash: q,
        isFunction: E,
        isString: F,
        isNumber: s,
        isUndefined: B
    })
})();
Object.extend(Function.prototype, (function() {
    var l = Array.prototype.slice;
    function s(c, b) {
        var d = c.length,
        a = b.length;
        while (a--) {
            c[d + a] = b[a]
        }
        return c
    }
    function n(a, b) {
        a = l.call(a, 0);
        return s(a, b)
    }
    function p() {
        var a = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, "").replace(/\s+/g, "").split(",");
        return a.length == 1 && !a[0] ? [] : a
    }
    function o(c) {
        if (arguments.length < 2 && Object.isUndefined(arguments[0])) {
            return this
        }
        var b = this,
        a = l.call(arguments, 1);
        return function() {
            var d = n(a, arguments);
            return b.apply(c, d)
        }
    }
    function q(c) {
        var b = this,
        a = l.call(arguments, 1);
        return function(d) {
            var e = s([d || window.event], a);
            return b.apply(c, e)
        }
    }
    function m() {
        if (!arguments.length) {
            return this
        }
        var b = this,
        a = l.call(arguments, 0);
        return function() {
            var c = n(a, arguments);
            return b.apply(this, c)
        }
    }
    function r(c) {
        var b = this,
        a = l.call(arguments, 1);
        c = c * 1000;
        return window.setTimeout(function() {
            return b.apply(b, a)
        },
        c)
    }
    function v() {
        var a = s([0.01], arguments);
        return this.delay.apply(this, a)
    }
    function t(a) {
        var b = this;
        return function() {
            var c = s([b.bind(this)], arguments);
            return a.apply(this, c)
        }
    }
    function u() {
        if (this._methodized) {
            return this._methodized
        }
        var a = this;
        return this._methodized = function() {
            var b = s([this], arguments);
            return a.apply(null, b)
        }
    }
    return {
        argumentNames: p,
        bind: o,
        bindAsEventListener: q,
        curry: m,
        delay: r,
        defer: v,
        wrap: t,
        methodize: u
    }
})());
Date.prototype.toJSON = function() {
    return '"' + this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1).toPaddedString(2) + "-" + this.getUTCDate().toPaddedString(2) + "T" + this.getUTCHours().toPaddedString(2) + ":" + this.getUTCMinutes().toPaddedString(2) + ":" + this.getUTCSeconds().toPaddedString(2) + 'Z"'
};
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function(b) {
    return String(b).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
};
var PeriodicalExecuter = Class.create({
    initialize: function(c, d) {
        this.callback = c;
        this.frequency = d;
        this.currentlyExecuting = false;
        this.registerCallback()
    },
    registerCallback: function() {
        this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000)
    },
    execute: function() {
        this.callback(this)
    },
    stop: function() {
        if (!this.timer) {
            return
        }
        clearInterval(this.timer);
        this.timer = null
    },
    onTimerEvent: function() {
        if (!this.currentlyExecuting) {
            try {
                this.currentlyExecuting = true;
                this.execute();
                this.currentlyExecuting = false
            } catch(b) {
                this.currentlyExecuting = false;
                throw b
            }
        }
    }
});
Object.extend(String, {
    interpret: function(b) {
        return b == null ? "": String(b)
    },
    specialChar: {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\\": "\\\\"
    }
});
Object.extend(String.prototype, (function() {
    function prepareReplacement(replacement) {
        if (Object.isFunction(replacement)) {
            return replacement
        }
        var template = new Template(replacement);
        return function(match) {
            return template.evaluate(match)
        }
    }
    function gsub(pattern, replacement) {
        var result = "",
        source = this,
        match;
        replacement = prepareReplacement(replacement);
        if (Object.isString(pattern)) {
            pattern = RegExp.escape(pattern)
        }
        if (! (pattern.length || pattern.source)) {
            replacement = replacement("");
            return replacement + source.split("").join(replacement) + replacement
        }
        while (source.length > 0) {
            if (match = source.match(pattern)) {
                result += source.slice(0, match.index);
                result += String.interpret(replacement(match));
                source = source.slice(match.index + match[0].length)
            } else {
                result += source,
                source = ""
            }
        }
        return result
    }
    function sub(pattern, replacement, count) {
        replacement = prepareReplacement(replacement);
        count = Object.isUndefined(count) ? 1: count;
        return this.gsub(pattern,
        function(match) {
            if (--count < 0) {
                return match[0]
            }
            return replacement(match)
        })
    }
    function scan(pattern, iterator) {
        this.gsub(pattern, iterator);
        return String(this)
    }
    function truncate(length, truncation) {
        length = length || 30;
        truncation = Object.isUndefined(truncation) ? "...": truncation;
        return this.length > length ? this.slice(0, length - truncation.length) + truncation: String(this)
    }
    function strip() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }
    function stripTags() {
        return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "")
    }
    function stripScripts() {
        return this.replace(new RegExp(Prototype.ScriptFragment, "img"), "")
    }
    function extractScripts() {
        var matchAll = new RegExp(Prototype.ScriptFragment, "img");
        var matchOne = new RegExp(Prototype.ScriptFragment, "im");
        return (this.match(matchAll) || []).map(function(scriptTag) {
            return (scriptTag.match(matchOne) || ["", ""])[1]
        })
    }
    function evalScripts() {
        return this.extractScripts().map(function(script) {
            return eval(script)
        })
    }
    function escapeHTML() {
        return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }
    function unescapeHTML() {
        return this.stripTags().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    }
    function toQueryParams(separator) {
        var match = this.strip().match(/([^?#]*)(#.*)?$/);
        if (!match) {
            return {}
        }
        return match[1].split(separator || "&").inject({},
        function(hash, pair) {
            if ((pair = pair.split("="))[0]) {
                var key = decodeURIComponent(pair.shift());
                var value = pair.length > 1 ? pair.join("=") : pair[0];
                if (value != undefined) {
                    value = decodeURIComponent(value)
                }
                if (key in hash) {
                    if (!Object.isArray(hash[key])) {
                        hash[key] = [hash[key]]
                    }
                    hash[key].push(value)
                } else {
                    hash[key] = value
                }
            }
            return hash
        })
    }
    function toArray() {
        return this.split("")
    }
    function succ() {
        return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
    }
    function times(count) {
        return count < 1 ? "": new Array(count + 1).join(this)
    }
    function camelize() {
        var parts = this.split("-"),
        len = parts.length;
        if (len == 1) {
            return parts[0]
        }
        var camelized = this.charAt(0) == "-" ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1) : parts[0];
        for (var i = 1; i < len; i++) {
            camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1)
        }
        return camelized
    }
    function capitalize() {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
    }
    function underscore() {
        return this.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase()
    }
    function dasherize() {
        return this.replace(/_/g, "-")
    }
    function inspect(useDoubleQuotes) {
        var escapedString = this.replace(/[\x00-\x1f\\]/g,
        function(character) {
            if (character in String.specialChar) {
                return String.specialChar[character]
            }
            return "\\u00" + character.charCodeAt().toPaddedString(2, 16)
        });
        if (useDoubleQuotes) {
            return '"' + escapedString.replace(/"/g, '\\"') + '"'
        }
        return "'" + escapedString.replace(/'/g, "\\'") + "'"
    }
    function toJSON() {
        return this.inspect(true)
    }
    function unfilterJSON(filter) {
        return this.replace(filter || Prototype.JSONFilter, "$1")
    }
    function isJSON() {
        var str = this;
        if (str.blank()) {
            return false
        }
        str = this.replace(/\\./g, "@").replace(/"[^"\\\n\r]*"/g, "");
        return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str)
    }
    function evalJSON(sanitize) {
        var json = this.unfilterJSON();
        try {
            if (!sanitize || json.isJSON()) {
                return eval("(" + json + ")")
            }
        } catch(e) {}
        throw new SyntaxError("Badly formed JSON string: " + this.inspect())
    }
    function include(pattern) {
        return this.indexOf(pattern) > -1
    }
    function startsWith(pattern) {
        return this.indexOf(pattern) === 0
    }
    function endsWith(pattern) {
        var d = this.length - pattern.length;
        return d >= 0 && this.lastIndexOf(pattern) === d
    }
    function empty() {
        return this == ""
    }
    function blank() {
        return /^\s*$/.test(this)
    }
    function interpolate(object, pattern) {
        return new Template(this, pattern).evaluate(object)
    }
    return {
        gsub: gsub,
        sub: sub,
        scan: scan,
        truncate: truncate,
        strip: String.prototype.trim ? String.prototype.trim: strip,
        stripTags: stripTags,
        stripScripts: stripScripts,
        extractScripts: extractScripts,
        evalScripts: evalScripts,
        escapeHTML: escapeHTML,
        unescapeHTML: unescapeHTML,
        toQueryParams: toQueryParams,
        parseQuery: toQueryParams,
        toArray: toArray,
        succ: succ,
        times: times,
        camelize: camelize,
        capitalize: capitalize,
        underscore: underscore,
        dasherize: dasherize,
        inspect: inspect,
        toJSON: toJSON,
        unfilterJSON: unfilterJSON,
        isJSON: isJSON,
        evalJSON: evalJSON,
        include: include,
        startsWith: startsWith,
        endsWith: endsWith,
        empty: empty,
        blank: blank,
        interpolate: interpolate
    }
})());
var Template = Class.create({
    initialize: function(d, c) {
        this.template = d.toString();
        this.pattern = c || Template.Pattern
    },
    evaluate: function(b) {
        if (b && Object.isFunction(b.toTemplateReplacements)) {
            b = b.toTemplateReplacements()
        }
        return this.template.gsub(this.pattern,
        function(k) {
            if (b == null) {
                return (k[1] + "")
            }
            var i = k[1] || "";
            if (i == "\\") {
                return k[2]
            }
            var a = b,
            h = k[3];
            var j = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
            k = j.exec(h);
            if (k == null) {
                return i
            }
            while (k != null) {
                var l = k[1].startsWith("[") ? k[2].replace(/\\\\]/g, "]") : k[1];
                a = a[l];
                if (null == a || "" == k[3]) {
                    break
                }
                h = h.substring("[" == k[3] ? k[1].length: k[0].length);
                k = j.exec(h)
            }
            return i + String.interpret(a)
        })
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = (function() {
    function P(d, a) {
        var b = 0;
        try {
            this._each(function(e) {
                d.call(a, e, b++)
            })
        } catch(c) {
            if (c != $break) {
                throw c
            }
        }
        return this
    }
    function A(d, f, b) {
        var c = -d,
        a = [],
        e = this.toArray();
        if (d < 1) {
            return e
        }
        while ((c += d) < e.length) {
            a.push(e.slice(c, c + d))
        }
        return a.collect(f, b)
    }
    function Q(c, a) {
        c = c || Prototype.K;
        var b = true;
        this.each(function(d, e) {
            b = b && !!c.call(a, d, e);
            if (!b) {
                throw $break
            }
        });
        return b
    }
    function J(c, a) {
        c = c || Prototype.K;
        var b = false;
        this.each(function(d, e) {
            if (b = !!c.call(a, d, e)) {
                throw $break
            }
        });
        return b
    }
    function I(c, a) {
        c = c || Prototype.K;
        var b = [];
        this.each(function(d, e) {
            b.push(c.call(a, d, e))
        });
        return b
    }
    function y(c, a) {
        var b;
        this.each(function(d, e) {
            if (c.call(a, d, e)) {
                b = d;
                throw $break
            }
        });
        return b
    }
    function K(c, a) {
        var b = [];
        this.each(function(d, e) {
            if (c.call(a, d, e)) {
                b.push(d)
            }
        });
        return b
    }
    function L(c, d, a) {
        d = d || Prototype.K;
        var b = [];
        if (Object.isString(c)) {
            c = new RegExp(RegExp.escape(c))
        }
        this.each(function(f, e) {
            if (c.match(f)) {
                b.push(d.call(a, f, e))
            }
        });
        return b
    }
    function R(b) {
        if (Object.isFunction(this.indexOf)) {
            if (this.indexOf(b) != -1) {
                return true
            }
        }
        var a = false;
        this.each(function(c) {
            if (c == b) {
                a = true;
                throw $break
            }
        });
        return a
    }
    function B(a, b) {
        b = Object.isUndefined(b) ? null: b;
        return this.eachSlice(a,
        function(c) {
            while (c.length < a) {
                c.push(b)
            }
            return c
        })
    }
    function G(b, c, a) {
        this.each(function(d, e) {
            b = c.call(a, b, d, e)
        });
        return b
    }
    function w(a) {
        var b = $A(arguments).slice(1);
        return this.map(function(c) {
            return c[a].apply(c, b)
        })
    }
    function C(c, a) {
        c = c || Prototype.K;
        var b;
        this.each(function(d, e) {
            d = c.call(a, d, e);
            if (b == null || d >= b) {
                b = d
            }
        });
        return b
    }
    function E(c, a) {
        c = c || Prototype.K;
        var b;
        this.each(function(d, e) {
            d = c.call(a, d, e);
            if (b == null || d < b) {
                b = d
            }
        });
        return b
    }
    function N(c, a) {
        c = c || Prototype.K;
        var d = [],
        b = [];
        this.each(function(f, e) { (c.call(a, f, e) ? d: b).push(f)
        });
        return [d, b]
    }
    function M(a) {
        var b = [];
        this.each(function(c) {
            b.push(c[a])
        });
        return b
    }
    function O(c, a) {
        var b = [];
        this.each(function(d, e) {
            if (!c.call(a, d, e)) {
                b.push(d)
            }
        });
        return b
    }
    function F(a, b) {
        return this.map(function(c, d) {
            return {
                value: c,
                criteria: a.call(b, c, d)
            }
        }).sort(function(f, c) {
            var d = f.criteria,
            e = c.criteria;
            return d < e ? -1: d > e ? 1: 0
        }).pluck("value")
    }
    function D() {
        return this.map()
    }
    function z() {
        var a = Prototype.K,
        b = $A(arguments);
        if (Object.isFunction(b.last())) {
            a = b.pop()
        }
        var c = [this].concat(b).map($A);
        return this.map(function(d, e) {
            return a(c.pluck(e))
        })
    }
    function H() {
        return this.toArray().length
    }
    function x() {
        return "#<Enumerable:" + this.toArray().inspect() + ">"
    }
    return {
        each: P,
        eachSlice: A,
        all: Q,
        every: Q,
        any: J,
        some: J,
        collect: I,
        map: I,
        detect: y,
        findAll: K,
        select: K,
        filter: K,
        grep: L,
        include: R,
        member: R,
        inGroupsOf: B,
        inject: G,
        invoke: w,
        max: C,
        min: E,
        partition: N,
        pluck: M,
        reject: O,
        sortBy: F,
        toArray: D,
        entries: D,
        zip: z,
        size: H,
        inspect: x,
        find: y
    }
})();
function $A(f) {
    if (!f) {
        return []
    }
    if ("toArray" in Object(f)) {
        return f.toArray()
    }
    var d = f.length || 0,
    e = new Array(d);
    while (d--) {
        e[d] = f[d]
    }
    return e
}
function $w(b) {
    if (!Object.isString(b)) {
        return []
    }
    b = b.strip();
    return b ? b.split(/\s+/) : []
}
Array.from = $A; (function() {
    var x = Array.prototype,
    D = x.slice,
    B = x.forEach;
    function O(b) {
        for (var c = 0, a = this.length; c < a; c++) {
            b(this[c])
        }
    }
    if (!B) {
        B = O
    }
    function E() {
        this.length = 0;
        return this
    }
    function M() {
        return this[0]
    }
    function J() {
        return this[this.length - 1]
    }
    function H() {
        return this.select(function(a) {
            return a != null
        })
    }
    function v() {
        return this.inject([],
        function(a, b) {
            if (Object.isArray(b)) {
                return a.concat(b.flatten())
            }
            a.push(b);
            return a
        })
    }
    function I() {
        var a = D.call(arguments, 0);
        return this.select(function(b) {
            return ! a.include(b)
        })
    }
    function K(a) {
        return (a !== false ? this: this.toArray())._reverse()
    }
    function F(a) {
        return this.inject([],
        function(d, b, c) {
            if (0 == c || (a ? d.last() != b: !d.include(b))) {
                d.push(b)
            }
            return d
        })
    }
    function A(a) {
        return this.uniq().findAll(function(b) {
            return a.detect(function(c) {
                return b === c
            })
        })
    }
    function z() {
        return D.call(this, 0)
    }
    function G() {
        return this.length
    }
    function w() {
        return "[" + this.map(Object.inspect).join(", ") + "]"
    }
    function y() {
        var a = [];
        this.each(function(c) {
            var b = Object.toJSON(c);
            if (!Object.isUndefined(b)) {
                a.push(b)
            }
        });
        return "[" + a.join(", ") + "]"
    }
    function P(a, c) {
        c || (c = 0);
        var b = this.length;
        if (c < 0) {
            c = b + c
        }
        for (; c < b; c++) {
            if (this[c] === a) {
                return c
            }
        }
        return - 1
    }
    function C(b, c) {
        c = isNaN(c) ? this.length: (c < 0 ? this.length + c: c) + 1;
        var a = this.slice(0, c).reverse().indexOf(b);
        return (a < 0) ? a: c - a - 1
    }
    function N() {
        var b = D.call(this, 0),
        f;
        for (var c = 0, a = arguments.length; c < a; c++) {
            f = arguments[c];
            if (Object.isArray(f) && !("callee" in f)) {
                for (var d = 0, e = f.length; d < e; d++) {
                    b.push(f[d])
                }
            } else {
                b.push(f)
            }
        }
        return b
    }
    Object.extend(x, Enumerable);
    if (!x._reverse) {
        x._reverse = x.reverse
    }
    Object.extend(x, {
        _each: B,
        clear: E,
        first: M,
        last: J,
        compact: H,
        flatten: v,
        without: I,
        reverse: K,
        uniq: F,
        intersect: A,
        clone: z,
        toArray: z,
        size: G,
        inspect: w,
        toJSON: y
    });
    var L = (function() {
        return [].concat(arguments)[0][0] !== 1
    })(1, 2);
    if (L) {
        x.concat = N
    }
    if (!x.indexOf) {
        x.indexOf = P
    }
    if (!x.lastIndexOf) {
        x.lastIndexOf = C
    }
})();
function $H(b) {
    return new Hash(b)
}
var Hash = Class.create(Enumerable, (function() {
    function B(a) {
        this._object = Object.isHash(a) ? a.toObject() : Object.clone(a)
    }
    function A(c) {
        for (var d in this._object) {
            var b = this._object[d],
            a = [d, b];
            a.key = d;
            a.value = b;
            c(a)
        }
    }
    function v(b, a) {
        return this._object[b] = a
    }
    function D(a) {
        if (this._object[a] !== Object.prototype[a]) {
            return this._object[a]
        }
    }
    function s(b) {
        var a = this._object[b];
        delete this._object[b];
        return a
    }
    function q() {
        return Object.clone(this._object)
    }
    function r() {
        return this.pluck("key")
    }
    function t() {
        return this.pluck("value")
    }
    function z(a) {
        var b = this.detect(function(c) {
            return c.value === a
        });
        return b && b.key
    }
    function x(a) {
        return this.clone().update(a)
    }
    function C(a) {
        return new Hash(a).inject(this,
        function(c, b) {
            c.set(b.key, b.value);
            return c
        })
    }
    function E(b, a) {
        if (Object.isUndefined(a)) {
            return b
        }
        return b + "=" + encodeURIComponent(String.interpret(a))
    }
    function F() {
        return this.inject([],
        function(b, a) {
            var c = encodeURIComponent(a.key),
            d = a.value;
            if (d && typeof d == "object") {
                if (Object.isArray(d)) {
                    return b.concat(d.map(E.curry(c)))
                }
            } else {
                b.push(E(c, d))
            }
            return b
        }).join("&")
    }
    function u() {
        return "#<Hash:{" + this.map(function(a) {
            return a.map(Object.inspect).join(": ")
        }).join(", ") + "}>"
    }
    function w() {
        return Object.toJSON(this.toObject())
    }
    function y() {
        return new Hash(this)
    }
    return {
        initialize: B,
        _each: A,
        set: v,
        get: D,
        unset: s,
        toObject: q,
        toTemplateReplacements: q,
        keys: r,
        values: t,
        index: z,
        merge: x,
        update: C,
        toQueryString: F,
        inspect: u,
        toJSON: w,
        clone: y
    }
})());
Hash.from = $H;
Object.extend(Number.prototype, (function() {
    function o() {
        return this.toPaddedString(2, 16)
    }
    function n() {
        return this + 1
    }
    function r(a, b) {
        $R(0, this, true).each(a, b);
        return this
    }
    function q(a, b) {
        var c = this.toString(b || 10);
        return "0".times(a - c.length) + c
    }
    function m() {
        return isFinite(this) ? this.toString() : "null"
    }
    function j() {
        return Math.abs(this)
    }
    function k() {
        return Math.round(this)
    }
    function l() {
        return Math.ceil(this)
    }
    function p() {
        return Math.floor(this)
    }
    return {
        toColorPart: o,
        succ: n,
        times: r,
        toPaddedString: q,
        toJSON: m,
        abs: j,
        round: k,
        ceil: l,
        floor: p
    }
})());
function $R(f, e, d) {
    return new ObjectRange(f, e, d)
}
var ObjectRange = Class.create(Enumerable, (function() {
    function d(a, c, b) {
        this.start = a;
        this.end = c;
        this.exclusive = b
    }
    function f(b) {
        var a = this.start;
        while (this.include(a)) {
            b(a);
            a = a.succ()
        }
    }
    function e(a) {
        if (a < this.start) {
            return false
        }
        if (this.exclusive) {
            return a < this.end
        }
        return a <= this.end
    }
    return {
        initialize: d,
        _each: f,
        include: e
    }
})());
var Ajax = {
    getTransport: function() {
        return Try.these(function() {
            return new XMLHttpRequest()
        },
        function() {
            return new ActiveXObject("Msxml2.XMLHTTP")
        },
        function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }) || false
    },
    activeRequestCount: 0
};
Ajax.Responders = {
    responders: [],
    _each: function(b) {
        this.responders._each(b)
    },
    register: function(b) {
        if (!this.include(b)) {
            this.responders.push(b)
        }
    },
    unregister: function(b) {
        this.responders = this.responders.without(b)
    },
    dispatch: function(g, e, h, f) {
        this.each(function(b) {
            if (Object.isFunction(b[g])) {
                try {
                    b[g].apply(b, [e, h, f])
                } catch(a) {}
            }
        })
    }
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
    onCreate: function() {
        Ajax.activeRequestCount++
    },
    onComplete: function() {
        Ajax.activeRequestCount--
    }
});
Ajax.Base = Class.create({
    initialize: function(b) {
        this.options = {
            method: "post",
            asynchronous: true,
            contentType: "application/x-www-form-urlencoded",
            encoding: "UTF-8",
            parameters: "",
            evalJSON: true,
            evalJS: true
        };
        Object.extend(this.options, b || {});
        this.options.method = this.options.method.toLowerCase();
        if (Object.isString(this.options.parameters)) {
            this.options.parameters = this.options.parameters.toQueryParams()
        } else {
            if (Object.isHash(this.options.parameters)) {
                this.options.parameters = this.options.parameters.toObject()
            }
        }
    }
});
Ajax.Request = Class.create(Ajax.Base, {
    _complete: false,
    initialize: function($super, c, d) {
        $super(d);
        this.transport = Ajax.getTransport();
        this.request(c)
    },
    request: function(e) {
        this.url = e;
        this.method = this.options.method;
        var g = Object.clone(this.options.parameters);
        if (! ["get", "post"].include(this.method)) {
            g._method = this.method;
            this.method = "post"
        }
        this.parameters = g;
        if (g = Object.toQueryString(g)) {
            if (this.method == "get") {
                this.url += (this.url.include("?") ? "&": "?") + g
            } else {
                if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
                    g += "&_="
                }
            }
        }
        try {
            var f = new Ajax.Response(this);
            if (this.options.onCreate) {
                this.options.onCreate(f)
            }
            Ajax.Responders.dispatch("onCreate", this, f);
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
            if (this.options.asynchronous) {
                this.respondToReadyState.bind(this).defer(1)
            }
            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();
            this.body = this.method == "post" ? (this.options.postBody || g) : null;
            this.transport.send(this.body);
            if (!this.options.asynchronous && this.transport.overrideMimeType) {
                this.onStateChange()
            }
        } catch(h) {
            this.dispatchException(h)
        }
    },
    onStateChange: function() {
        var b = this.transport.readyState;
        if (b > 1 && !((b == 4) && this._complete)) {
            this.respondToReadyState(this.transport.readyState)
        }
    },
    setRequestHeaders: function() {
        var h = {
            "X-Requested-With": "XMLHttpRequest",
            "X-Prototype-Version": Prototype.Version,
            Accept: "text/javascript, text/html, application/xml, text/xml, */*"
        };
        if (this.method == "post") {
            h["Content-type"] = this.options.contentType + (this.options.encoding ? "; charset=" + this.options.encoding: "");
            if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) {
                h.Connection = "close"
            }
        }
        if (typeof this.options.requestHeaders == "object") {
            var j = this.options.requestHeaders;
            if (Object.isFunction(j.push)) {
                for (var f = 0, i = j.length; f < i; f += 2) {
                    h[j[f]] = j[f + 1]
                }
            } else {
                $H(j).each(function(a) {
                    h[a.key] = a.value
                })
            }
        }
        for (var g in h) {
            this.transport.setRequestHeader(g, h[g])
        }
    },
    success: function() {
        var b = this.getStatus();
        return ! b || (b >= 200 && b < 300)
    },
    getStatus: function() {
        try {
            return this.transport.status || 0
        } catch(b) {
            return 0
        }
    },
    respondToReadyState: function(g) {
        var j = Ajax.Request.Events[g],
        e = new Ajax.Response(this);
        if (j == "Complete") {
            try {
                this._complete = true; (this.options["on" + e.status] || this.options["on" + (this.success() ? "Success": "Failure")] || Prototype.emptyFunction)(e, e.headerJSON)
            } catch(i) {
                this.dispatchException(i)
            }
            var h = e.getHeader("Content-type");
            if (this.options.evalJS == "force" || (this.options.evalJS && this.isSameOrigin() && h && h.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) {
                this.evalResponse()
            }
        }
        try { (this.options["on" + j] || Prototype.emptyFunction)(e, e.headerJSON);
            Ajax.Responders.dispatch("on" + j, this, e, e.headerJSON)
        } catch(i) {
            this.dispatchException(i)
        }
        if (j == "Complete") {
            this.transport.onreadystatechange = Prototype.emptyFunction
        }
    },
    isSameOrigin: function() {
        var b = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return ! b || (b[0] == "#{protocol}//#{domain}#{port}".interpolate({
            protocol: location.protocol,
            domain: document.domain,
            port: location.port ? ":" + location.port: ""
        }))
    },
    getHeader: function(d) {
        try {
            return this.transport.getResponseHeader(d) || null
        } catch(c) {
            return null
        }
    },
    evalResponse: function() {
        try {
            return eval((this.transport.responseText || "").unfilterJSON())
        } catch(e) {
            this.dispatchException(e)
        }
    },
    dispatchException: function(b) { (this.options.onException || Prototype.emptyFunction)(this, b);
        Ajax.Responders.dispatch("onException", this, b)
    }
});
Ajax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"];
Ajax.Response = Class.create({
    initialize: function(h) {
        this.request = h;
        var g = this.transport = h.transport,
        f = this.readyState = g.readyState;
        if ((f > 2 && !Prototype.Browser.IE) || f == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = String.interpret(g.responseText);
            this.headerJSON = this._getHeaderJSON()
        }
        if (f == 4) {
            var e = g.responseXML;
            this.responseXML = Object.isUndefined(e) ? null: e;
            this.responseJSON = this._getResponseJSON()
        }
    },
    status: 0,
    statusText: "",
    getStatus: Ajax.Request.prototype.getStatus,
    getStatusText: function() {
        try {
            return this.transport.statusText || ""
        } catch(b) {
            return ""
        }
    },
    getHeader: Ajax.Request.prototype.getHeader,
    getAllHeaders: function() {
        try {
            return this.getAllResponseHeaders()
        } catch(b) {
            return null
        }
    },
    getResponseHeader: function(b) {
        return this.transport.getResponseHeader(b)
    },
    getAllResponseHeaders: function() {
        return this.transport.getAllResponseHeaders()
    },
    _getHeaderJSON: function() {
        var d = this.getHeader("X-JSON");
        if (!d) {
            return null
        }
        d = decodeURIComponent(escape(d));
        try {
            return d.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin())
        } catch(c) {
            this.request.dispatchException(c)
        }
    },
    _getResponseJSON: function() {
        var d = this.request.options;
        if (!d.evalJSON || (d.evalJSON != "force" && !(this.getHeader("Content-type") || "").include("application/json")) || this.responseText.blank()) {
            return null
        }
        try {
            return this.responseText.evalJSON(d.sanitizeJSON || !this.request.isSameOrigin())
        } catch(c) {
            this.request.dispatchException(c)
        }
    }
});
Ajax.Updater = Class.create(Ajax.Request, {
    initialize: function($super, f, h, e) {
        this.container = {
            success: (f.success || f),
            failure: (f.failure || (f.success ? null: f))
        };
        e = Object.clone(e);
        var g = e.onComplete;
        e.onComplete = (function(b, a) {
            this.updateContent(b.responseText);
            if (Object.isFunction(g)) {
                g(b, a)
            }
        }).bind(this);
        $super(h, e)
    },
    updateContent: function(g) {
        var h = this.container[this.success() ? "success": "failure"],
        f = this.options;
        if (!f.evalScripts) {
            g = g.stripScripts()
        }
        if (h = $(h)) {
            if (f.insertion) {
                if (Object.isString(f.insertion)) {
                    var e = {};
                    e[f.insertion] = g;
                    h.insert(e)
                } else {
                    f.insertion(h, g)
                }
            } else {
                h.update(g)
            }
        }
    }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    initialize: function($super, e, f, d) {
        $super(d);
        this.onComplete = this.options.onComplete;
        this.frequency = (this.options.frequency || 2);
        this.decay = (this.options.decay || 1);
        this.updater = {};
        this.container = e;
        this.url = f;
        this.start()
    },
    start: function() {
        this.options.onComplete = this.updateComplete.bind(this);
        this.onTimerEvent()
    },
    stop: function() {
        this.updater.options.onComplete = undefined;
        clearTimeout(this.timer); (this.onComplete || Prototype.emptyFunction).apply(this, arguments)
    },
    updateComplete: function(b) {
        if (this.options.decay) {
            this.decay = (b.responseText == this.lastText ? this.decay * this.options.decay: 1);
            this.lastText = b.responseText
        }
        this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency)
    },
    onTimerEvent: function() {
        this.updater = new Ajax.Updater(this.container, this.url, this.options)
    }
});
function $(e) {
    if (arguments.length > 1) {
        for (var f = 0, g = [], h = arguments.length; f < h; f++) {
            g.push($(arguments[f]))
        }
        return g
    }
    if (Object.isString(e)) {
        e = document.getElementById(e)
    }
    return Element.extend(e)
}
if (Prototype.BrowserFeatures.XPath) {
    document._getElementsByXPath = function(i, h) {
        var l = [];
        var j = document.evaluate(i, $(h) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var g = 0, k = j.snapshotLength; g < k; g++) {
            l.push(Element.extend(j.snapshotItem(g)))
        }
        return l
    }
}
if (!window.Node) {
    var Node = {}
}
if (!Node.ELEMENT_NODE) {
    Object.extend(Node, {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        ENTITY_REFERENCE_NODE: 5,
        ENTITY_NODE: 6,
        PROCESSING_INSTRUCTION_NODE: 7,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        DOCUMENT_FRAGMENT_NODE: 11,
        NOTATION_NODE: 12
    })
} (function(f) {
    var d = (function() {
        var b = document.createElement("form");
        var c = document.createElement("input");
        var h = document.documentElement;
        c.setAttribute("name", "test");
        b.appendChild(c);
        h.appendChild(b);
        var a = b.elements ? (typeof b.elements.test == "undefined") : null;
        h.removeChild(b);
        b = c = null;
        return a
    })();
    var e = f.Element;
    f.Element = function(a, b) {
        b = b || {};
        a = a.toLowerCase();
        var c = Element.cache;
        if (d && b.name) {
            a = "<" + a + ' name="' + b.name + '">';
            delete b.name;
            return Element.writeAttribute(document.createElement(a), b)
        }
        if (!c[a]) {
            c[a] = Element.extend(document.createElement(a))
        }
        return Element.writeAttribute(c[a].cloneNode(false), b)
    };
    Object.extend(f.Element, e || {});
    if (e) {
        f.Element.prototype = e.prototype
    }
})(this);
Element.cache = {};
Element.idCounter = 1;
Element.Methods = {
    visible: function(b) {
        return $(b).style.display != "none"
    },
    toggle: function(b) {
        b = $(b);
        Element[Element.visible(b) ? "hide": "show"](b);
        return b
    },
    hide: function(b) {
        b = $(b);
        b.style.display = "none";
        return b
    },
    show: function(b) {
        b = $(b);
        b.style.display = "";
        return b
    },
    remove: function(b) {
        b = $(b);
        b.parentNode.removeChild(b);
        return b
    },
    update: (function() {
        var e = (function() {
            var b = document.createElement("select"),
            a = true;
            b.innerHTML = '<option value="test">test</option>';
            if (b.options && b.options[0]) {
                a = b.options[0].nodeName.toUpperCase() !== "OPTION"
            }
            b = null;
            return a
        })();
        var f = (function() {
            try {
                var c = document.createElement("table");
                if (c && c.tBodies) {
                    c.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
                    var a = typeof c.tBodies[0] == "undefined";
                    c = null;
                    return a
                }
            } catch(b) {
                return true
            }
        })();
        var g = (function() {
            var c = document.createElement("script"),
            a = false;
            try {
                c.appendChild(document.createTextNode(""));
                a = !c.firstChild || c.firstChild && c.firstChild.nodeType !== 3
            } catch(b) {
                a = true
            }
            c = null;
            return a
        })();
        function h(b, a) {
            b = $(b);
            if (a && a.toElement) {
                a = a.toElement()
            }
            if (Object.isElement(a)) {
                return b.update().insert(a)
            }
            a = Object.toHTML(a);
            var c = b.tagName.toUpperCase();
            if (c === "SCRIPT" && g) {
                b.text = a;
                return b
            }
            if (e || f) {
                if (c in Element._insertionTranslations.tags) {
                    while (b.firstChild) {
                        b.removeChild(b.firstChild)
                    }
                    Element._getContentFromAnonymousElement(c, a.stripScripts()).each(function(d) {
                        b.appendChild(d)
                    })
                } else {
                    b.innerHTML = a.stripScripts()
                }
            } else {
                b.innerHTML = a.stripScripts()
            }
            a.evalScripts.bind(a).defer();
            return b
        }
        return h
    })(),
    replace: function(d, f) {
        d = $(d);
        if (f && f.toElement) {
            f = f.toElement()
        } else {
            if (!Object.isElement(f)) {
                f = Object.toHTML(f);
                var e = d.ownerDocument.createRange();
                e.selectNode(d);
                f.evalScripts.bind(f).defer();
                f = e.createContextualFragment(f.stripScripts())
            }
        }
        d.parentNode.replaceChild(f, d);
        return d
    },
    insert: function(n, l) {
        n = $(n);
        if (Object.isString(l) || Object.isNumber(l) || Object.isElement(l) || (l && (l.toElement || l.toHTML))) {
            l = {
                bottom: l
            }
        }
        var m,
        k,
        h,
        j;
        for (var i in l) {
            m = l[i];
            i = i.toLowerCase();
            k = Element._insertionTranslations[i];
            if (m && m.toElement) {
                m = m.toElement()
            }
            if (Object.isElement(m)) {
                k(n, m);
                continue
            }
            m = Object.toHTML(m);
            h = ((i == "before" || i == "after") ? n.parentNode: n).tagName.toUpperCase();
            j = Element._getContentFromAnonymousElement(h, m.stripScripts());
            if (i == "top" || i == "after") {
                j.reverse()
            }
            j.each(k.curry(n));
            m.evalScripts.bind(m).defer()
        }
        return n
    },
    wrap: function(d, f, e) {
        d = $(d);
        if (Object.isElement(f)) {
            $(f).writeAttribute(e || {})
        } else {
            if (Object.isString(f)) {
                f = new Element(f, e)
            } else {
                f = new Element("div", f)
            }
        }
        if (d.parentNode) {
            d.parentNode.replaceChild(f, d)
        }
        f.appendChild(d);
        return f
    },
    inspect: function(c) {
        c = $(c);
        var d = "<" + c.tagName.toLowerCase();
        $H({
            id: "id",
            className: "class"
        }).each(function(a) {
            var b = a.first(),
            h = a.last();
            var g = (c[b] || "").toString();
            if (g) {
                d += " " + h + "=" + g.inspect(true)
            }
        });
        return d + ">"
    },
    recursivelyCollect: function(e, f) {
        e = $(e);
        var d = [];
        while (e = e[f]) {
            if (e.nodeType == 1) {
                d.push(Element.extend(e))
            }
        }
        return d
    },
    ancestors: function(b) {
        return Element.recursivelyCollect(b, "parentNode")
    },
    descendants: function(b) {
        return Element.select(b, "*")
    },
    firstDescendant: function(b) {
        b = $(b).firstChild;
        while (b && b.nodeType != 1) {
            b = b.nextSibling
        }
        return $(b)
    },
    immediateDescendants: function(b) {
        if (! (b = $(b).firstChild)) {
            return []
        }
        while (b && b.nodeType != 1) {
            b = b.nextSibling
        }
        if (b) {
            return [b].concat($(b).nextSiblings())
        }
        return []
    },
    previousSiblings: function(b) {
        return Element.recursivelyCollect(b, "previousSibling")
    },
    nextSiblings: function(b) {
        return Element.recursivelyCollect(b, "nextSibling")
    },
    siblings: function(b) {
        b = $(b);
        return Element.previousSiblings(b).reverse().concat(Element.nextSiblings(b))
    },
    match: function(c, d) {
        if (Object.isString(d)) {
            d = new Selector(d)
        }
        return d.match($(c))
    },
    up: function(e, g, f) {
        e = $(e);
        if (arguments.length == 1) {
            return $(e.parentNode)
        }
        var h = Element.ancestors(e);
        return Object.isNumber(g) ? h[g] : Selector.findElement(h, g, f)
    },
    down: function(d, f, e) {
        d = $(d);
        if (arguments.length == 1) {
            return Element.firstDescendant(d)
        }
        return Object.isNumber(f) ? Element.descendants(d)[f] : Element.select(d, f)[e || 0]
    },
    previous: function(e, g, f) {
        e = $(e);
        if (arguments.length == 1) {
            return $(Selector.handlers.previousElementSibling(e))
        }
        var h = Element.previousSiblings(e);
        return Object.isNumber(g) ? h[g] : Selector.findElement(h, g, f)
    },
    next: function(h, g, e) {
        h = $(h);
        if (arguments.length == 1) {
            return $(Selector.handlers.nextElementSibling(h))
        }
        var f = Element.nextSiblings(h);
        return Object.isNumber(g) ? f[g] : Selector.findElement(f, g, e)
    },
    select: function(c) {
        var d = Array.prototype.slice.call(arguments, 1);
        return Selector.findChildElements(c, d)
    },
    adjacent: function(c) {
        var d = Array.prototype.slice.call(arguments, 1);
        return Selector.findChildElements(c.parentNode, d).without(c)
    },
    identify: function(d) {
        d = $(d);
        var c = Element.readAttribute(d, "id");
        if (c) {
            return c
        }
        do {
            c = "anonymous_element_" + Element.idCounter++
        }
        while ($(c));
        Element.writeAttribute(d, "id", c);
        return c
    },
    readAttribute: function(f, e) {
        f = $(f);
        if (Prototype.Browser.IE) {
            var d = Element._attributeTranslations.read;
            if (d.values[e]) {
                return d.values[e](f, e)
            }
            if (d.names[e]) {
                e = d.names[e]
            }
            if (e.include(":")) {
                return (!f.attributes || !f.attributes[e]) ? null: f.attributes[e].value
            }
        }
        return f.getAttribute(e)
    },
    writeAttribute: function(j, l, i) {
        j = $(j);
        var g = {},
        k = Element._attributeTranslations.write;
        if (typeof l == "object") {
            g = l
        } else {
            g[l] = Object.isUndefined(i) ? true: i
        }
        for (var h in g) {
            l = k.names[h] || h;
            i = g[h];
            if (k.values[h]) {
                l = k.values[h](j, i)
            }
            if (i === false || i === null) {
                j.removeAttribute(l)
            } else {
                if (i === true) {
                    j.setAttribute(l, l)
                } else {
                    j.setAttribute(l, i)
                }
            }
        }
        return j
    },
    getHeight: function(b) {
        return Element.getDimensions(b).height
    },
    getWidth: function(b) {
        return Element.getDimensions(b).width
    },
    classNames: function(b) {
        return new Element.ClassNames(b)
    },
    hasClassName: function(e, d) {
        if (! (e = $(e))) {
            return
        }
        var f = e.className;
        return (f.length > 0 && (f == d || new RegExp("(^|\\s)" + d + "(\\s|$)").test(f)))
    },
    addClassName: function(d, c) {
        if (! (d = $(d))) {
            return
        }
        if (!Element.hasClassName(d, c)) {
            d.className += (d.className ? " ": "") + c
        }
        return d
    },
    removeClassName: function(d, c) {
        if (! (d = $(d))) {
            return
        }
        d.className = d.className.replace(new RegExp("(^|\\s+)" + c + "(\\s+|$)"), " ").strip();
        return d
    },
    toggleClassName: function(d, c) {
        if (! (d = $(d))) {
            return
        }
        return Element[Element.hasClassName(d, c) ? "removeClassName": "addClassName"](d, c)
    },
    cleanWhitespace: function(d) {
        d = $(d);
        var f = d.firstChild;
        while (f) {
            var e = f.nextSibling;
            if (f.nodeType == 3 && !/\S/.test(f.nodeValue)) {
                d.removeChild(f)
            }
            f = e
        }
        return d
    },
    empty: function(b) {
        return $(b).innerHTML.blank()
    },
    descendantOf: function(c, d) {
        c = $(c),
        d = $(d);
        if (c.compareDocumentPosition) {
            return (c.compareDocumentPosition(d) & 8) === 8
        }
        if (d.contains) {
            return d.contains(c) && d !== c
        }
        while (c = c.parentNode) {
            if (c == d) {
                return true
            }
        }
        return false
    },
    scrollTo: function(d) {
        d = $(d);
        var c = Element.cumulativeOffset(d);
        window.scrollTo(c[0], c[1]);
        return d
    },
    getStyle: function(e, h) {
        e = $(e);
        h = h == "float" ? "cssFloat": h.camelize();
        var g = e.style[h];
        if (!g || g == "auto") {
            var f = document.defaultView.getComputedStyle(e, null);
            g = f ? f[h] : null
        }
        if (h == "opacity") {
            return g ? parseFloat(g) : 1
        }
        return g == "auto" ? null: g
    },
    getOpacity: function(b) {
        return $(b).getStyle("opacity")
    },
    setStyle: function(f, j) {
        f = $(f);
        var h = f.style,
        g;
        if (Object.isString(j)) {
            f.style.cssText += ";" + j;
            return j.include("opacity") ? f.setOpacity(j.match(/opacity:\s*(\d?\.?\d*)/)[1]) : f
        }
        for (var i in j) {
            if (i == "opacity") {
                f.setOpacity(j[i])
            } else {
                h[(i == "float" || i == "cssFloat") ? (Object.isUndefined(h.styleFloat) ? "cssFloat": "styleFloat") : i] = j[i]
            }
        }
        return f
    },
    setOpacity: function(d, c) {
        d = $(d);
        d.style.opacity = (c == 1 || c === "") ? "": (c < 0.00001) ? 0: c;
        return d
    },
    getDimensions: function(p) {
        p = $(p);
        var l = Element.getStyle(p, "display");
        if (l != "none" && l != null) {
            return {
                width: p.offsetWidth,
                height: p.offsetHeight
            }
        }
        var i = p.style;
        var m = i.visibility;
        var o = i.position;
        var j = i.display;
        i.visibility = "hidden";
        if (o != "fixed") {
            i.position = "absolute"
        }
        i.display = "block";
        var k = p.clientWidth;
        var n = p.clientHeight;
        i.display = j;
        i.position = o;
        i.visibility = m;
        return {
            width: k,
            height: n
        }
    },
    makePositioned: function(d) {
        d = $(d);
        var c = Element.getStyle(d, "position");
        if (c == "static" || !c) {
            d._madePositioned = true;
            d.style.position = "relative";
            if (Prototype.Browser.Opera) {
                d.style.top = 0;
                d.style.left = 0
            }
        }
        return d
    },
    undoPositioned: function(b) {
        b = $(b);
        if (b._madePositioned) {
            b._madePositioned = undefined;
            b.style.position = b.style.top = b.style.left = b.style.bottom = b.style.right = ""
        }
        return b
    },
    makeClipping: function(b) {
        b = $(b);
        if (b._overflow) {
            return b
        }
        b._overflow = Element.getStyle(b, "overflow") || "auto";
        if (b._overflow !== "hidden") {
            b.style.overflow = "hidden"
        }
        return b
    },
    undoClipping: function(b) {
        b = $(b);
        if (!b._overflow) {
            return b
        }
        b.style.overflow = b._overflow == "auto" ? "": b._overflow;
        b._overflow = null;
        return b
    },
    cumulativeOffset: function(d) {
        var e = 0,
        f = 0;
        do {
            e += d.offsetTop || 0;
            f += d.offsetLeft || 0;
            d = d.offsetParent
        }
        while (d);
        return Element._returnOffset(f, e)
    },
    positionedOffset: function(e) {
        var f = 0,
        g = 0;
        do {
            f += e.offsetTop || 0;
            g += e.offsetLeft || 0;
            e = e.offsetParent;
            if (e) {
                if (e.tagName.toUpperCase() == "BODY") {
                    break
                }
                var h = Element.getStyle(e, "position");
                if (h !== "static") {
                    break
                }
            }
        }
        while (e);
        return Element._returnOffset(g, f)
    },
    absolutize: function(g) {
        g = $(g);
        if (Element.getStyle(g, "position") == "absolute") {
            return g
        }
        var k = Element.positionedOffset(g);
        var i = k[1];
        var j = k[0];
        var l = g.clientWidth;
        var h = g.clientHeight;
        g._originalLeft = j - parseFloat(g.style.left || 0);
        g._originalTop = i - parseFloat(g.style.top || 0);
        g._originalWidth = g.style.width;
        g._originalHeight = g.style.height;
        g.style.position = "absolute";
        g.style.top = i + "px";
        g.style.left = j + "px";
        g.style.width = l + "px";
        g.style.height = h + "px";
        return g
    },
    relativize: function(e) {
        e = $(e);
        if (Element.getStyle(e, "position") == "relative") {
            return e
        }
        e.style.position = "relative";
        var f = parseFloat(e.style.top || 0) - (e._originalTop || 0);
        var d = parseFloat(e.style.left || 0) - (e._originalLeft || 0);
        e.style.top = f + "px";
        e.style.left = d + "px";
        e.style.height = e._originalHeight;
        e.style.width = e._originalWidth;
        return e
    },
    cumulativeScrollOffset: function(d) {
        var e = 0,
        f = 0;
        do {
            e += d.scrollTop || 0;
            f += d.scrollLeft || 0;
            d = d.parentNode
        }
        while (d);
        return Element._returnOffset(f, e)
    },
    getOffsetParent: function(b) {
        if (b.offsetParent) {
            return $(b.offsetParent)
        }
        if (b == document.body) {
            return $(b)
        }
        while ((b = b.parentNode) && b != document.body) {
            if (Element.getStyle(b, "position") != "static") {
                return $(b)
            }
        }
        return $(document.body)
    },
    viewportOffset: function(g) {
        var f = 0,
        h = 0;
        var e = g;
        do {
            f += e.offsetTop || 0;
            h += e.offsetLeft || 0;
            if (e.offsetParent == document.body && Element.getStyle(e, "position") == "absolute") {
                break
            }
        }
        while (e = e.offsetParent);
        e = g;
        do {
            if (!Prototype.Browser.Opera || (e.tagName && (e.tagName.toUpperCase() == "BODY"))) {
                f -= e.scrollTop || 0;
                h -= e.scrollLeft || 0
            }
        }
        while (e = e.parentNode);
        return Element._returnOffset(h, f)
    },
    clonePosition: function(g, k) {
        var h = Object.extend({
            setLeft: true,
            setTop: true,
            setWidth: true,
            setHeight: true,
            offsetTop: 0,
            offsetLeft: 0
        },
        arguments[2] || {});
        k = $(k);
        var j = Element.viewportOffset(k);
        g = $(g);
        var i = [0, 0];
        var l = null;
        if (Element.getStyle(g, "position") == "absolute") {
            l = Element.getOffsetParent(g);
            i = Element.viewportOffset(l)
        }
        if (l == document.body) {
            i[0] -= document.body.offsetLeft;
            i[1] -= document.body.offsetTop
        }
        if (h.setLeft) {
            g.style.left = (j[0] - i[0] + h.offsetLeft) + "px"
        }
        if (h.setTop) {
            g.style.top = (j[1] - i[1] + h.offsetTop) + "px"
        }
        if (h.setWidth) {
            g.style.width = k.offsetWidth + "px"
        }
        if (h.setHeight) {
            g.style.height = k.offsetHeight + "px"
        }
        return g
    }
};
Object.extend(Element.Methods, {
    getElementsBySelector: Element.Methods.select,
    childElements: Element.Methods.immediateDescendants
});
Element._attributeTranslations = {
    write: {
        names: {
            className: "class",
            htmlFor: "for"
        },
        values: {}
    }
};
if (Prototype.Browser.Opera) {
    Element.Methods.getStyle = Element.Methods.getStyle.wrap(function(i, f, j) {
        switch (j) {
        case "left":
        case "top":
        case "right":
        case "bottom":
            if (i(f, "position") === "static") {
                return null
            }
        case "height":
        case "width":
            if (!Element.visible(f)) {
                return null
            }
            var h = parseInt(i(f, j), 10);
            if (h !== f["offset" + j.capitalize()]) {
                return h + "px"
            }
            var g;
            if (j === "height") {
                g = ["border-top-width", "padding-top", "padding-bottom", "border-bottom-width"]
            } else {
                g = ["border-left-width", "padding-left", "padding-right", "border-right-width"]
            }
            return g.inject(h,
            function(c, b) {
                var a = i(f, b);
                return a === null ? c: c - parseInt(a, 10)
            }) + "px";
        default:
            return i(f, j)
        }
    });
    Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(function(f, e, d) {
        if (d === "title") {
            return e.title
        }
        return f(e, d)
    })
} else {
    if (Prototype.Browser.IE) {
        Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(function(j, e) {
            e = $(e);
            try {
                e.offsetParent
            } catch(h) {
                return $(document.body)
            }
            var g = e.getStyle("position");
            if (g !== "static") {
                return j(e)
            }
            e.setStyle({
                position: "relative"
            });
            var i = j(e);
            e.setStyle({
                position: g
            });
            return i
        });
        $w("positionedOffset viewportOffset").each(function(b) {
            Element.Methods[b] = Element.Methods[b].wrap(function(j, l) {
                l = $(l);
                try {
                    l.offsetParent
                } catch(e) {
                    return Element._returnOffset(0, 0)
                }
                var a = l.getStyle("position");
                if (a !== "static") {
                    return j(l)
                }
                var k = l.getOffsetParent();
                if (k && k.getStyle("position") === "fixed") {
                    k.setStyle({
                        zoom: 1
                    })
                }
                l.setStyle({
                    position: "relative"
                });
                var i = j(l);
                l.setStyle({
                    position: a
                });
                return i
            })
        });
        Element.Methods.cumulativeOffset = Element.Methods.cumulativeOffset.wrap(function(d, e) {
            try {
                e.offsetParent
            } catch(f) {
                return Element._returnOffset(0, 0)
            }
            return d(e)
        });
        Element.Methods.getStyle = function(e, d) {
            e = $(e);
            d = (d == "float" || d == "cssFloat") ? "styleFloat": d.camelize();
            var f = e.style[d];
            if (!f && e.currentStyle) {
                f = e.currentStyle[d]
            }
            if (d == "opacity") {
                if (f = (e.getStyle("filter") || "").match(/alpha\(opacity=(.*)\)/)) {
                    if (f[1]) {
                        return parseFloat(f[1]) / 100
                    }
                }
                return 1
            }
            if (f == "auto") {
                if ((d == "width" || d == "height") && (e.getStyle("display") != "none")) {
                    return e["offset" + d.capitalize()] + "px"
                }
                return null
            }
            return f
        };
        Element.Methods.setOpacity = function(g, j) {
            function i(a) {
                return a.replace(/alpha\([^\)]*\)/gi, "")
            }
            g = $(g);
            var h = g.currentStyle;
            if ((h && !h.hasLayout) || (!h && g.style.zoom == "normal")) {
                g.style.zoom = 1
            }
            var k = g.getStyle("filter"),
            l = g.style;
            if (j == 1 || j === "") { (k = i(k)) ? l.filter = k: l.removeAttribute("filter");
                return g
            } else {
                if (j < 0.00001) {
                    j = 0
                }
            }
            l.filter = i(k) + "alpha(opacity=" + (j * 100) + ")";
            return g
        };
        Element._attributeTranslations = (function() {
            var d = "className";
            var e = "for";
            var f = document.createElement("div");
            f.setAttribute(d, "x");
            if (f.className !== "x") {
                f.setAttribute("class", "x");
                if (f.className === "x") {
                    d = "class"
                }
            }
            f = null;
            f = document.createElement("label");
            f.setAttribute(e, "x");
            if (f.htmlFor !== "x") {
                f.setAttribute("htmlFor", "x");
                if (f.htmlFor === "x") {
                    e = "htmlFor"
                }
            }
            f = null;
            return {
                read: {
                    names: {
                        "class": d,
                        className: d,
                        "for": e,
                        htmlFor: e
                    },
                    values: {
                        _getAttr: function(b, a) {
                            return b.getAttribute(a)
                        },
                        _getAttr2: function(b, a) {
                            return b.getAttribute(a, 2)
                        },
                        _getAttrNode: function(c, a) {
                            var b = c.getAttributeNode(a);
                            return b ? b.value: ""
                        },
                        _getEv: (function() {
                            var c = document.createElement("div");
                            c.onclick = Prototype.emptyFunction;
                            var a = c.getAttribute("onclick");
                            var b;
                            if (String(a).indexOf("{") > -1) {
                                b = function(i, g) {
                                    g = i.getAttribute(g);
                                    if (!g) {
                                        return null
                                    }
                                    g = g.toString();
                                    g = g.split("{")[1];
                                    g = g.split("}")[0];
                                    return g.strip()
                                }
                            } else {
                                if (a === "") {
                                    b = function(i, g) {
                                        g = i.getAttribute(g);
                                        if (!g) {
                                            return null
                                        }
                                        return g.strip()
                                    }
                                }
                            }
                            c = null;
                            return b
                        })(),
                        _flag: function(b, a) {
                            return $(b).hasAttribute(a) ? a: null
                        },
                        style: function(a) {
                            return a.style.cssText.toLowerCase()
                        },
                        title: function(a) {
                            return a.title
                        }
                    }
                }
            }
        })();
        Element._attributeTranslations.write = {
            names: Object.extend({
                cellpadding: "cellPadding",
                cellspacing: "cellSpacing"
            },
            Element._attributeTranslations.read.names),
            values: {
                checked: function(d, c) {
                    d.checked = !!c
                },
                style: function(d, c) {
                    d.style.cssText = c ? c: ""
                }
            }
        };
        Element._attributeTranslations.has = {};
        $w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc frameBorder").each(function(b) {
            Element._attributeTranslations.write.names[b.toLowerCase()] = b;
            Element._attributeTranslations.has[b.toLowerCase()] = b
        }); (function(b) {
            Object.extend(b, {
                href: b._getAttr2,
                src: b._getAttr2,
                type: b._getAttr,
                action: b._getAttrNode,
                disabled: b._flag,
                checked: b._flag,
                readonly: b._flag,
                multiple: b._flag,
                onload: b._getEv,
                onunload: b._getEv,
                onclick: b._getEv,
                ondblclick: b._getEv,
                onmousedown: b._getEv,
                onmouseup: b._getEv,
                onmouseover: b._getEv,
                onmousemove: b._getEv,
                onmouseout: b._getEv,
                onfocus: b._getEv,
                onblur: b._getEv,
                onkeypress: b._getEv,
                onkeydown: b._getEv,
                onkeyup: b._getEv,
                onsubmit: b._getEv,
                onreset: b._getEv,
                onselect: b._getEv,
                onchange: b._getEv
            })
        })(Element._attributeTranslations.read.values);
        if (Prototype.BrowserFeatures.ElementExtensions) { (function() {
                function b(h) {
                    var a = h.getElementsByTagName("*"),
                    i = [];
                    for (var j = 0, g; g = a[j]; j++) {
                        if (g.tagName !== "!") {
                            i.push(g)
                        }
                    }
                    return i
                }
                Element.Methods.down = function(f, e, a) {
                    f = $(f);
                    if (arguments.length == 1) {
                        return f.firstDescendant()
                    }
                    return Object.isNumber(e) ? b(f)[e] : Element.select(f, e)[a || 0]
                }
            })()
        }
    } else {
        if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
            Element.Methods.setOpacity = function(d, c) {
                d = $(d);
                d.style.opacity = (c == 1) ? 0.999999: (c === "") ? "": (c < 0.00001) ? 0: c;
                return d
            }
        } else {
            if (Prototype.Browser.WebKit) {
                Element.Methods.setOpacity = function(f, e) {
                    f = $(f);
                    f.style.opacity = (e == 1 || e === "") ? "": (e < 0.00001) ? 0: e;
                    if (e == 1) {
                        if (f.tagName.toUpperCase() == "IMG" && f.width) {
                            f.width++;
                            f.width--
                        } else {
                            try {
                                var g = document.createTextNode(" ");
                                f.appendChild(g);
                                f.removeChild(g)
                            } catch(h) {}
                        }
                    }
                    return f
                };
                Element.Methods.cumulativeOffset = function(d) {
                    var e = 0,
                    f = 0;
                    do {
                        e += d.offsetTop || 0;
                        f += d.offsetLeft || 0;
                        if (d.offsetParent == document.body) {
                            if (Element.getStyle(d, "position") == "absolute") {
                                break
                            }
                        }
                        d = d.offsetParent
                    }
                    while (d);
                    return Element._returnOffset(f, e)
                }
            }
        }
    }
}
if ("outerHTML" in document.documentElement) {
    Element.Methods.replace = function(l, j) {
        l = $(l);
        if (j && j.toElement) {
            j = j.toElement()
        }
        if (Object.isElement(j)) {
            l.parentNode.replaceChild(j, l);
            return l
        }
        j = Object.toHTML(j);
        var k = l.parentNode,
        g = k.tagName.toUpperCase();
        if (Element._insertionTranslations.tags[g]) {
            var i = l.next();
            var h = Element._getContentFromAnonymousElement(g, j.stripScripts());
            k.removeChild(l);
            if (i) {
                h.each(function(a) {
                    k.insertBefore(a, i)
                })
            } else {
                h.each(function(a) {
                    k.appendChild(a)
                })
            }
        } else {
            l.outerHTML = j.stripScripts()
        }
        j.evalScripts.bind(j).defer();
        return l
    }
}
Element._returnOffset = function(d, f) {
    var e = [d, f];
    e.left = d;
    e.top = f;
    return e
};
Element._getContentFromAnonymousElement = function(h, e) {
    var g = new Element("div"),
    f = Element._insertionTranslations.tags[h];
    if (f) {
        g.innerHTML = f[0] + e + f[1];
        f[2].times(function() {
            g = g.firstChild
        })
    } else {
        g.innerHTML = e
    }
    return $A(g.childNodes)
};
Element._insertionTranslations = {
    before: function(d, c) {
        d.parentNode.insertBefore(c, d)
    },
    top: function(d, c) {
        d.insertBefore(c, d.firstChild)
    },
    bottom: function(d, c) {
        d.appendChild(c)
    },
    after: function(d, c) {
        d.parentNode.insertBefore(c, d.nextSibling)
    },
    tags: {
        TABLE: ["<table>", "</table>", 1],
        TBODY: ["<table><tbody>", "</tbody></table>", 2],
        TR: ["<table><tbody><tr>", "</tr></tbody></table>", 3],
        TD: ["<table><tbody><tr><td>", "</td></tr></tbody></table>", 4],
        SELECT: ["<select>", "</select>", 1]
    }
}; (function() {
    var b = Element._insertionTranslations.tags;
    Object.extend(b, {
        THEAD: b.TBODY,
        TFOOT: b.TBODY,
        TH: b.TD
    })
})();
Element.Methods.Simulated = {
    hasAttribute: function(e, f) {
        f = Element._attributeTranslations.has[f] || f;
        var d = $(e).getAttributeNode(f);
        return !! (d && d.specified)
    }
};
Element.Methods.ByTag = {};
Object.extend(Element, Element.Methods); (function(b) {
    if (!Prototype.BrowserFeatures.ElementExtensions && b.__proto__) {
        window.HTMLElement = {};
        window.HTMLElement.prototype = b.__proto__;
        Prototype.BrowserFeatures.ElementExtensions = true
    }
    b = null
})(document.createElement("div"));
Element.extend = (function() {
    function l(e) {
        if (typeof window.Element != "undefined") {
            var c = window.Element.prototype;
            if (c) {
                var a = "_" + (Math.random() + "").slice(2);
                var d = document.createElement(e);
                c[a] = "x";
                var b = (d[a] !== "x");
                delete c[a];
                d = null;
                return b
            }
        }
        return false
    }
    function g(c, d) {
        for (var a in d) {
            var b = d[a];
            if (Object.isFunction(b) && !(a in c)) {
                c[a] = b.methodize()
            }
        }
    }
    var k = l("object");
    if (Prototype.BrowserFeatures.SpecificElementExtensions) {
        if (k) {
            return function(a) {
                if (a && typeof a._extendedByPrototype == "undefined") {
                    var b = a.tagName;
                    if (b && (/^(?:object|applet|embed)$/i.test(b))) {
                        g(a, Element.Methods);
                        g(a, Element.Methods.Simulated);
                        g(a, Element.Methods.ByTag[b.toUpperCase()])
                    }
                }
                return a
            }
        }
        return Prototype.K
    }
    var h = {},
    j = Element.Methods.ByTag;
    var i = Object.extend(function(a) {
        if (!a || typeof a._extendedByPrototype != "undefined" || a.nodeType != 1 || a == window) {
            return a
        }
        var c = Object.clone(h),
        b = a.tagName.toUpperCase();
        if (j[b]) {
            Object.extend(c, j[b])
        }
        g(a, c);
        a._extendedByPrototype = Prototype.emptyFunction;
        return a
    },
    {
        refresh: function() {
            if (!Prototype.BrowserFeatures.ElementExtensions) {
                Object.extend(h, Element.Methods);
                Object.extend(h, Element.Methods.Simulated)
            }
        }
    });
    i.refresh();
    return i
})();
Element.hasAttribute = function(d, c) {
    if (d.hasAttribute) {
        return d.hasAttribute(c)
    }
    return Element.Methods.Simulated.hasAttribute(d, c)
};
Element.addMethods = function(r) {
    var l = Prototype.BrowserFeatures,
    q = Element.Methods.ByTag;
    if (!r) {
        Object.extend(Form, Form.Methods);
        Object.extend(Form.Element, Form.Element.Methods);
        Object.extend(Element.Methods.ByTag, {
            FORM: Object.clone(Form.Methods),
            INPUT: Object.clone(Form.Element.Methods),
            SELECT: Object.clone(Form.Element.Methods),
            TEXTAREA: Object.clone(Form.Element.Methods)
        })
    }
    if (arguments.length == 2) {
        var s = r;
        r = arguments[1]
    }
    if (!s) {
        Object.extend(Element.Methods, r || {})
    } else {
        if (Object.isArray(s)) {
            s.each(n)
        } else {
            n(s)
        }
    }
    function n(a) {
        a = a.toUpperCase();
        if (!Element.Methods.ByTag[a]) {
            Element.Methods.ByTag[a] = {}
        }
        Object.extend(Element.Methods.ByTag[a], r)
    }
    function t(a, b, c) {
        c = c || false;
        for (var d in a) {
            var e = a[d];
            if (!Object.isFunction(e)) {
                continue
            }
            if (!c || !(d in b)) {
                b[d] = e.methodize()
            }
        }
    }
    function p(e) {
        var c;
        var a = {
            OPTGROUP: "OptGroup",
            TEXTAREA: "TextArea",
            P: "Paragraph",
            FIELDSET: "FieldSet",
            UL: "UList",
            OL: "OList",
            DL: "DList",
            DIR: "Directory",
            H1: "Heading",
            H2: "Heading",
            H3: "Heading",
            H4: "Heading",
            H5: "Heading",
            H6: "Heading",
            Q: "Quote",
            INS: "Mod",
            DEL: "Mod",
            A: "Anchor",
            IMG: "Image",
            CAPTION: "TableCaption",
            COL: "TableCol",
            COLGROUP: "TableCol",
            THEAD: "TableSection",
            TFOOT: "TableSection",
            TBODY: "TableSection",
            TR: "TableRow",
            TH: "TableCell",
            TD: "TableCell",
            FRAMESET: "FrameSet",
            IFRAME: "IFrame"
        };
        if (a[e]) {
            c = "HTML" + a[e] + "Element"
        }
        if (window[c]) {
            return window[c]
        }
        c = "HTML" + e + "Element";
        if (window[c]) {
            return window[c]
        }
        c = "HTML" + e.capitalize() + "Element";
        if (window[c]) {
            return window[c]
        }
        var b = document.createElement(e);
        var d = b.__proto__ || b.constructor.prototype;
        b = null;
        return d
    }
    var m = window.HTMLElement ? HTMLElement.prototype: Element.prototype;
    if (l.ElementExtensions) {
        t(Element.Methods, m);
        t(Element.Methods.Simulated, m, true)
    }
    if (l.SpecificElementExtensions) {
        for (var k in Element.Methods.ByTag) {
            var o = p(k);
            if (Object.isUndefined(o)) {
                continue
            }
            t(q[k], o.prototype)
        }
    }
    Object.extend(Element, Element.Methods);
    delete Element.ByTag;
    if (Element.extend.refresh) {
        Element.extend.refresh()
    }
    Element.cache = {}
};
document.viewport = {
    getDimensions: function() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        }
    },
    getScrollOffsets: function() {
        return Element._returnOffset(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
    }
}; (function(h) {
    var j = Prototype.Browser,
    l = document,
    n,
    m = {};
    function i() {
        if (j.WebKit && !l.evaluate) {
            return document
        }
        if (j.Opera && window.parseFloat(window.opera.version()) < 9.5) {
            return document.body
        }
        return document.documentElement
    }
    function k(a) {
        if (!n) {
            n = i()
        }
        m[a] = "client" + a;
        h["get" + a] = function() {
            return n[m[a]]
        };
        return h["get" + a]()
    }
    h.getWidth = k.curry("Width");
    h.getHeight = k.curry("Height")
})(document.viewport);
Element.Storage = {
    UID: 1
};
Element.addMethods({
    getStorage: function(c) {
        if (! (c = $(c))) {
            return
        }
        var d;
        if (c === window) {
            d = 0
        } else {
            if (typeof c._prototypeUID === "undefined") {
                c._prototypeUID = [Element.Storage.UID++]
            }
            d = c._prototypeUID[0]
        }
        if (!Element.Storage[d]) {
            Element.Storage[d] = $H()
        }
        return Element.Storage[d]
    },
    store: function(d, e, f) {
        if (! (d = $(d))) {
            return
        }
        if (arguments.length === 2) {
            Element.getStorage(d).update(e)
        } else {
            Element.getStorage(d).set(e, f)
        }
        return d
    },
    retrieve: function(j, f, g) {
        if (! (j = $(j))) {
            return
        }
        var h = Element.getStorage(j),
        i = h.get(f);
        if (Object.isUndefined(i)) {
            h.set(f, g);
            i = g
        }
        return i
    },
    clone: function(j, g) {
        if (! (j = $(j))) {
            return
        }
        var h = j.cloneNode(g);
        h._prototypeUID = void 0;
        if (g) {
            var i = Element.select(h, "*"),
            f = i.length;
            while (f--) {
                i[f]._prototypeUID = void 0
            }
        }
        return Element.extend(h)
    }
});
var Selector = Class.create({
    initialize: function(b) {
        this.expression = b.strip();
        if (this.shouldUseSelectorsAPI()) {
            this.mode = "selectorsAPI"
        } else {
            if (this.shouldUseXPath()) {
                this.mode = "xpath";
                this.compileXPathMatcher()
            } else {
                this.mode = "normal";
                this.compileMatcher()
            }
        }
    },
    shouldUseXPath: (function() {
        var b = (function() {
            var f = false;
            if (document.evaluate && window.XPathResult) {
                var g = document.createElement("div");
                g.innerHTML = "<ul><li></li></ul><div><ul><li></li></ul></div>";
                var h = ".//*[local-name()='ul' or local-name()='UL']//*[local-name()='li' or local-name()='LI']";
                var a = document.evaluate(h, g, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                f = (a.snapshotLength !== 2);
                g = null
            }
            return f
        })();
        return function() {
            if (!Prototype.BrowserFeatures.XPath) {
                return false
            }
            var a = this.expression;
            if (Prototype.Browser.WebKit && (a.include("-of-type") || a.include(":empty"))) {
                return false
            }
            if ((/(\[[\w-]*?:|:checked)/).test(a)) {
                return false
            }
            if (b) {
                return false
            }
            return true
        }
    })(),
    shouldUseSelectorsAPI: function() {
        if (!Prototype.BrowserFeatures.SelectorsAPI) {
            return false
        }
        if (Selector.CASE_INSENSITIVE_CLASS_NAMES) {
            return false
        }
        if (!Selector._div) {
            Selector._div = new Element("div")
        }
        try {
            Selector._div.querySelector(this.expression)
        } catch(b) {
            return false
        }
        return true
    },
    compileMatcher: function() {
        var e = this.expression,
        ps = Selector.patterns,
        h = Selector.handlers,
        c = Selector.criteria,
        le,
        p,
        m,
        len = ps.length,
        name;
        if (Selector._cache[e]) {
            this.matcher = Selector._cache[e];
            return
        }
        this.matcher = ["this.matcher = function(root) {", "var r = root, h = Selector.handlers, c = false, n;"];
        while (e && le != e && (/\S/).test(e)) {
            le = e;
            for (var i = 0; i < len; i++) {
                p = ps[i].re;
                name = ps[i].name;
                if (m = e.match(p)) {
                    this.matcher.push(Object.isFunction(c[name]) ? c[name](m) : new Template(c[name]).evaluate(m));
                    e = e.replace(m[0], "");
                    break
                }
            }
        }
        this.matcher.push("return h.unique(n);\n}");
        eval(this.matcher.join("\n"));
        Selector._cache[this.expression] = this.matcher
    },
    compileXPathMatcher: function() {
        var l = this.expression,
        k = Selector.patterns,
        p = Selector.xpath,
        m,
        e,
        i = k.length,
        o;
        if (Selector._cache[l]) {
            this.xpath = Selector._cache[l];
            return
        }
        this.matcher = [".//*"];
        while (l && m != l && (/\S/).test(l)) {
            m = l;
            for (var n = 0; n < i; n++) {
                o = k[n].name;
                if (e = l.match(k[n].re)) {
                    this.matcher.push(Object.isFunction(p[o]) ? p[o](e) : new Template(p[o]).evaluate(e));
                    l = l.replace(e[0], "");
                    break
                }
            }
        }
        this.xpath = this.matcher.join("");
        Selector._cache[this.expression] = this.xpath
    },
    findElements: function(g) {
        g = g || document;
        var j = this.expression,
        e;
        switch (this.mode) {
        case "selectorsAPI":
            if (g !== document) {
                var i = g.id,
                h = $(g).identify();
                h = h.replace(/([\.:])/g, "\\$1");
                j = "#" + h + " " + j
            }
            e = $A(g.querySelectorAll(j)).map(Element.extend);
            g.id = i;
            return e;
        case "xpath":
            return document._getElementsByXPath(this.xpath, g);
        default:
            return this.matcher(g)
        }
    },
    match: function(r) {
        this.tokens = [];
        var e = this.expression,
        z = Selector.patterns,
        v = Selector.assertions;
        var y,
        w,
        u,
        i = z.length,
        x;
        while (e && y !== e && (/\S/).test(e)) {
            y = e;
            for (var s = 0; s < i; s++) {
                w = z[s].re;
                x = z[s].name;
                if (u = e.match(w)) {
                    if (v[x]) {
                        this.tokens.push([x, Object.clone(u)]);
                        e = e.replace(u[0], "")
                    } else {
                        return this.findElements(document).include(r)
                    }
                }
            }
        }
        var m = true,
        x,
        p;
        for (var s = 0, t; t = this.tokens[s]; s++) {
            x = t[0],
            p = t[1];
            if (!Selector.assertions[x](r, p)) {
                m = false;
                break
            }
        }
        return m
    },
    toString: function() {
        return this.expression
    },
    inspect: function() {
        return "#<Selector:" + this.expression.inspect() + ">"
    }
});
if (Prototype.BrowserFeatures.SelectorsAPI && document.compatMode === "BackCompat") {
    Selector.CASE_INSENSITIVE_CLASS_NAMES = (function() {
        var f = document.createElement("div"),
        e = document.createElement("span");
        f.id = "prototype_test_id";
        e.className = "Test";
        f.appendChild(e);
        var d = (f.querySelector("#prototype_test_id .test") !== null);
        f = e = null;
        return d
    })()
}
Object.extend(Selector, {
    _cache: {},
    xpath: {
        descendant: "//*",
        child: "/*",
        adjacent: "/following-sibling::*[1]",
        laterSibling: "/following-sibling::*",
        tagName: function(b) {
            if (b[1] == "*") {
                return ""
            }
            return "[local-name()='" + b[1].toLowerCase() + "' or local-name()='" + b[1].toUpperCase() + "']"
        },
        className: "[contains(concat(' ', @class, ' '), ' #{1} ')]",
        id: "[@id='#{1}']",
        attrPresence: function(b) {
            b[1] = b[1].toLowerCase();
            return new Template("[@#{1}]").evaluate(b)
        },
        attr: function(b) {
            b[1] = b[1].toLowerCase();
            b[3] = b[5] || b[6];
            return new Template(Selector.xpath.operators[b[2]]).evaluate(b)
        },
        pseudo: function(d) {
            var c = Selector.xpath.pseudos[d[1]];
            if (!c) {
                return ""
            }
            if (Object.isFunction(c)) {
                return c(d)
            }
            return new Template(Selector.xpath.pseudos[d[1]]).evaluate(d)
        },
        operators: {
            "=": "[@#{1}='#{3}']",
            "!=": "[@#{1}!='#{3}']",
            "^=": "[starts-with(@#{1}, '#{3}')]",
            "$=": "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
            "*=": "[contains(@#{1}, '#{3}')]",
            "~=": "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
            "|=": "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
        },
        pseudos: {
            "first-child": "[not(preceding-sibling::*)]",
            "last-child": "[not(following-sibling::*)]",
            "only-child": "[not(preceding-sibling::* or following-sibling::*)]",
            empty: "[count(*) = 0 and (count(text()) = 0)]",
            checked: "[@checked]",
            disabled: "[(@disabled) and (@type!='hidden')]",
            enabled: "[not(@disabled) and (@type!='hidden')]",
            not: function(p) {
                var m = p[6],
                r = Selector.patterns,
                i = Selector.xpath,
                t,
                e,
                n = r.length,
                s;
                var q = [];
                while (m && t != m && (/\S/).test(m)) {
                    t = m;
                    for (var o = 0; o < n; o++) {
                        s = r[o].name;
                        if (p = m.match(r[o].re)) {
                            e = Object.isFunction(i[s]) ? i[s](p) : new Template(i[s]).evaluate(p);
                            q.push("(" + e.substring(1, e.length - 1) + ")");
                            m = m.replace(p[0], "");
                            break
                        }
                    }
                }
                return "[not(" + q.join(" and ") + ")]"
            },
            "nth-child": function(b) {
                return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", b)
            },
            "nth-last-child": function(b) {
                return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", b)
            },
            "nth-of-type": function(b) {
                return Selector.xpath.pseudos.nth("position() ", b)
            },
            "nth-last-of-type": function(b) {
                return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", b)
            },
            "first-of-type": function(b) {
                b[6] = "1";
                return Selector.xpath.pseudos["nth-of-type"](b)
            },
            "last-of-type": function(b) {
                b[6] = "1";
                return Selector.xpath.pseudos["nth-last-of-type"](b)
            },
            "only-of-type": function(d) {
                var c = Selector.xpath.pseudos;
                return c["first-of-type"](d) + c["last-of-type"](d)
            },
            nth: function(j, l) {
                var b,
                a = l[6],
                m;
                if (a == "even") {
                    a = "2n+0"
                }
                if (a == "odd") {
                    a = "2n+1"
                }
                if (b = a.match(/^(\d+)$/)) {
                    return "[" + j + "= " + b[1] + "]"
                }
                if (b = a.match(/^(-?\d*)?n(([+-])(\d+))?/)) {
                    if (b[1] == "-") {
                        b[1] = -1
                    }
                    var k = b[1] ? Number(b[1]) : 1;
                    var n = b[2] ? Number(b[2]) : 0;
                    m = "[((#{fragment} - #{b}) mod #{a} = 0) and ((#{fragment} - #{b}) div #{a} >= 0)]";
                    return new Template(m).evaluate({
                        fragment: j,
                        a: k,
                        b: n
                    })
                }
            }
        }
    },
    criteria: {
        tagName: 'n = h.tagName(n, r, "#{1}", c);      c = false;',
        className: 'n = h.className(n, r, "#{1}", c);    c = false;',
        id: 'n = h.id(n, r, "#{1}", c);           c = false;',
        attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
        attr: function(b) {
            b[3] = (b[5] || b[6]);
            return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(b)
        },
        pseudo: function(b) {
            if (b[6]) {
                b[6] = b[6].replace(/"/g, '\\"')
            }
            return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(b)
        },
        descendant: 'c = "descendant";',
        child: 'c = "child";',
        adjacent: 'c = "adjacent";',
        laterSibling: 'c = "laterSibling";'
    },
    patterns: [{
        name: "laterSibling",
        re: /^\s*~\s*/
    },
    {
        name: "child",
        re: /^\s*>\s*/
    },
    {
        name: "adjacent",
        re: /^\s*\+\s*/
    },
    {
        name: "descendant",
        re: /^\s/
    },
    {
        name: "tagName",
        re: /^\s*(\*|[\w\-]+)(\b|$)?/
    },
    {
        name: "id",
        re: /^#([\w\-\*]+)(\b|$)/
    },
    {
        name: "className",
        re: /^\.([\w\-\*]+)(\b|$)/
    },
    {
        name: "pseudo",
        re: /^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/
    },
    {
        name: "attrPresence",
        re: /^\[((?:[\w-]+:)?[\w-]+)\]/
    },
    {
        name: "attr",
        re: /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/
    }],
    assertions: {
        tagName: function(d, c) {
            return c[1].toUpperCase() == d.tagName.toUpperCase()
        },
        className: function(d, c) {
            return Element.hasClassName(d, c[1])
        },
        id: function(d, c) {
            return d.id === c[1]
        },
        attrPresence: function(d, c) {
            return Element.hasAttribute(d, c[1])
        },
        attr: function(d, f) {
            var e = Element.readAttribute(d, f[1]);
            return e && Selector.operators[f[2]](e, f[5] || f[6])
        }
    },
    handlers: {
        concat: function(g, h) {
            for (var b = 0, a; a = h[b]; b++) {
                g.push(a)
            }
            return g
        },
        mark: function(f) {
            var g = Prototype.emptyFunction;
            for (var e = 0, h; h = f[e]; e++) {
                h._countedByPrototype = g
            }
            return f
        },
        unmark: (function() {
            var b = (function() {
                var a = document.createElement("div"),
                f = false,
                g = "_countedByPrototype",
                h = "x";
                a[g] = h;
                f = (a.getAttribute(g) === h);
                a = null;
                return f
            })();
            return b ?
            function(a) {
                for (var f = 0, e; e = a[f]; f++) {
                    e.removeAttribute("_countedByPrototype")
                }
                return a
            }: function(a) {
                for (var f = 0, e; e = a[f]; f++) {
                    e._countedByPrototype = void 0
                }
                return a
            }
        })(),
        index: function(i, m, j) {
            i._countedByPrototype = Prototype.emptyFunction;
            if (m) {
                for (var h = i.childNodes, l = h.length - 1, n = 1; l >= 0; l--) {
                    var k = h[l];
                    if (k.nodeType == 1 && (!j || k._countedByPrototype)) {
                        k.nodeIndex = n++
                    }
                }
            } else {
                for (var l = 0, n = 1, h = i.childNodes; k = h[l]; l++) {
                    if (k.nodeType == 1 && (!j || k._countedByPrototype)) {
                        k.nodeIndex = n++
                    }
                }
            }
        },
        unique: function(f) {
            if (f.length == 0) {
                return f
            }
            var i = [],
            h;
            for (var j = 0, g = f.length; j < g; j++) {
                if (typeof(h = f[j])._countedByPrototype == "undefined") {
                    h._countedByPrototype = Prototype.emptyFunction;
                    i.push(Element.extend(h))
                }
            }
            return Selector.handlers.unmark(i)
        },
        descendant: function(g) {
            var i = Selector.handlers;
            for (var j = 0, f = [], h; h = g[j]; j++) {
                i.concat(f, h.getElementsByTagName("*"))
            }
            return f
        },
        child: function(i) {
            var l = Selector.handlers;
            for (var m = 0, n = [], k; k = i[m]; m++) {
                for (var h = 0, j; j = k.childNodes[h]; h++) {
                    if (j.nodeType == 1 && j.tagName != "!") {
                        n.push(j)
                    }
                }
            }
            return n
        },
        adjacent: function(g) {
            for (var j = 0, f = [], h; h = g[j]; j++) {
                var i = this.nextElementSibling(h);
                if (i) {
                    f.push(i)
                }
            }
            return f
        },
        laterSibling: function(g) {
            var i = Selector.handlers;
            for (var j = 0, f = [], h; h = g[j]; j++) {
                i.concat(f, Element.nextSiblings(h))
            }
            return f
        },
        nextElementSibling: function(b) {
            while (b = b.nextSibling) {
                if (b.nodeType == 1) {
                    return b
                }
            }
            return null
        },
        previousElementSibling: function(b) {
            while (b = b.previousSibling) {
                if (b.nodeType == 1) {
                    return b
                }
            }
            return null
        },
        tagName: function(r, i, p, q) {
            var h = p.toUpperCase();
            var n = [],
            l = Selector.handlers;
            if (r) {
                if (q) {
                    if (q == "descendant") {
                        for (var m = 0, o; o = r[m]; m++) {
                            l.concat(n, o.getElementsByTagName(p))
                        }
                        return n
                    } else {
                        r = this[q](r)
                    }
                    if (p == "*") {
                        return r
                    }
                }
                for (var m = 0, o; o = r[m]; m++) {
                    if (o.tagName.toUpperCase() === h) {
                        n.push(o)
                    }
                }
                return n
            } else {
                return i.getElementsByTagName(p)
            }
        },
        id: function(r, h, q, p) {
            var i = $(q),
            j = Selector.handlers;
            if (h == document) {
                if (!i) {
                    return []
                }
                if (!r) {
                    return [i]
                }
            } else {
                if (!h.sourceIndex || h.sourceIndex < 1) {
                    var r = h.getElementsByTagName("*");
                    for (var n = 0, o; o = r[n]; n++) {
                        if (o.id === q) {
                            return [o]
                        }
                    }
                }
            }
            if (r) {
                if (p) {
                    if (p == "child") {
                        for (var m = 0, o; o = r[m]; m++) {
                            if (i.parentNode == o) {
                                return [i]
                            }
                        }
                    } else {
                        if (p == "descendant") {
                            for (var m = 0, o; o = r[m]; m++) {
                                if (Element.descendantOf(i, o)) {
                                    return [i]
                                }
                            }
                        } else {
                            if (p == "adjacent") {
                                for (var m = 0, o; o = r[m]; m++) {
                                    if (Selector.handlers.previousElementSibling(i) == o) {
                                        return [i]
                                    }
                                }
                            } else {
                                r = j[p](r)
                            }
                        }
                    }
                }
                for (var m = 0, o; o = r[m]; m++) {
                    if (o == i) {
                        return [i]
                    }
                }
                return []
            }
            return (i && Element.descendantOf(i, h)) ? [i] : []
        },
        className: function(e, f, h, g) {
            if (e && g) {
                e = this[g](e)
            }
            return Selector.handlers.byClassName(e, f, h)
        },
        byClassName: function(p, i, m) {
            if (!p) {
                p = Selector.handlers.descendant([i])
            }
            var k = " " + m + " ";
            for (var n = 0, o = [], l, j; l = p[n]; n++) {
                j = l.className;
                if (j.length == 0) {
                    continue
                }
                if (j == m || (" " + j + " ").include(k)) {
                    o.push(l)
                }
            }
            return o
        },
        attrPresence: function(n, h, i, j) {
            if (!n) {
                n = h.getElementsByTagName("*")
            }
            if (n && j) {
                n = this[j](n)
            }
            var l = [];
            for (var m = 0, k; k = n[m]; m++) {
                if (Element.hasAttribute(k, i)) {
                    l.push(k)
                }
            }
            return l
        },
        attr: function(v, n, o, m, t, u) {
            if (!v) {
                v = n.getElementsByTagName("*")
            }
            if (v && u) {
                v = this[u](v)
            }
            var i = Selector.operators[t],
            q = [];
            for (var r = 0, s; s = v[r]; r++) {
                var p = Element.readAttribute(s, o);
                if (p === null) {
                    continue
                }
                if (i(p, m)) {
                    q.push(s)
                }
            }
            return q
        },
        pseudo: function(f, j, h, g, i) {
            if (f && i) {
                f = this[i](f)
            }
            if (!f) {
                f = g.getElementsByTagName("*")
            }
            return Selector.pseudos[j](f, h, g)
        }
    },
    pseudos: {
        "first-child": function(g, i, h) {
            for (var k = 0, l = [], j; j = g[k]; k++) {
                if (Selector.handlers.previousElementSibling(j)) {
                    continue
                }
                l.push(j)
            }
            return l
        },
        "last-child": function(g, i, h) {
            for (var k = 0, l = [], j; j = g[k]; k++) {
                if (Selector.handlers.nextElementSibling(j)) {
                    continue
                }
                l.push(j)
            }
            return l
        },
        "only-child": function(h, j, i) {
            var l = Selector.handlers;
            for (var m = 0, n = [], k; k = h[m]; m++) {
                if (!l.previousElementSibling(k) && !l.nextElementSibling(k)) {
                    n.push(k)
                }
            }
            return n
        },
        "nth-child": function(d, f, e) {
            return Selector.pseudos.nth(d, f, e)
        },
        "nth-last-child": function(d, f, e) {
            return Selector.pseudos.nth(d, f, e, true)
        },
        "nth-of-type": function(d, f, e) {
            return Selector.pseudos.nth(d, f, e, false, true)
        },
        "nth-last-of-type": function(d, f, e) {
            return Selector.pseudos.nth(d, f, e, true, true)
        },
        "first-of-type": function(d, f, e) {
            return Selector.pseudos.nth(d, "1", e, false, true)
        },
        "last-of-type": function(d, f, e) {
            return Selector.pseudos.nth(d, "1", e, true, true)
        },
        "only-of-type": function(e, g, f) {
            var h = Selector.pseudos;
            return h["last-of-type"](h["first-of-type"](e, g, f), g, f)
        },
        getIndices: function(b, f, a) {
            if (b == 0) {
                return f > 0 ? [f] : []
            }
            return $R(1, a).inject([],
            function(d, c) {
                if (0 == (c - f) % b && (c - f) / b >= 0) {
                    d.push(c)
                }
                return d
            })
        },
        nth: function(A, F, D, a, y) {
            if (A.length == 0) {
                return []
            }
            if (F == "even") {
                F = "2n+0"
            }
            if (F == "odd") {
                F = "2n+1"
            }
            var b = Selector.handlers,
            h = [],
            z = [],
            m;
            b.mark(A);
            for (var i = 0, x; x = A[i]; i++) {
                if (!x.parentNode._countedByPrototype) {
                    b.index(x.parentNode, a, y);
                    z.push(x.parentNode)
                }
            }
            if (F.match(/^\d+$/)) {
                F = Number(F);
                for (var i = 0, x; x = A[i]; i++) {
                    if (x.nodeIndex == F) {
                        h.push(x)
                    }
                }
            } else {
                if (m = F.match(/^(-?\d*)?n(([+-])(\d+))?/)) {
                    if (m[1] == "-") {
                        m[1] = -1
                    }
                    var C = m[1] ? Number(m[1]) : 1;
                    var E = m[2] ? Number(m[2]) : 0;
                    var B = Selector.pseudos.getIndices(C, E, A.length);
                    for (var i = 0, x, l = B.length; x = A[i]; i++) {
                        for (var j = 0; j < l; j++) {
                            if (x.nodeIndex == B[j]) {
                                h.push(x)
                            }
                        }
                    }
                }
            }
            b.unmark(A);
            b.unmark(z);
            return h
        },
        empty: function(g, i, h) {
            for (var k = 0, l = [], j; j = g[k]; k++) {
                if (j.tagName == "!" || j.firstChild) {
                    continue
                }
                l.push(j)
            }
            return l
        },
        not: function(t, q, i) {
            var n = Selector.handlers,
            h,
            r;
            var m = new Selector(q).findElements(i);
            n.mark(m);
            for (var o = 0, p = [], s; s = t[o]; o++) {
                if (!s._countedByPrototype) {
                    p.push(s)
                }
            }
            n.unmark(m);
            return p
        },
        enabled: function(g, i, h) {
            for (var k = 0, l = [], j; j = g[k]; k++) {
                if (!j.disabled && (!j.type || j.type !== "hidden")) {
                    l.push(j)
                }
            }
            return l
        },
        disabled: function(g, i, h) {
            for (var k = 0, l = [], j; j = g[k]; k++) {
                if (j.disabled) {
                    l.push(j)
                }
            }
            return l
        },
        checked: function(g, i, h) {
            for (var k = 0, l = [], j; j = g[k]; k++) {
                if (j.checked) {
                    l.push(j)
                }
            }
            return l
        }
    },
    operators: {
        "=": function(c, d) {
            return c == d
        },
        "!=": function(c, d) {
            return c != d
        },
        "^=": function(c, d) {
            return c == d || c && c.startsWith(d)
        },
        "$=": function(c, d) {
            return c == d || c && c.endsWith(d)
        },
        "*=": function(c, d) {
            return c == d || c && c.include(d)
        },
        "~=": function(c, d) {
            return (" " + c + " ").include(" " + d + " ")
        },
        "|=": function(c, d) {
            return ("-" + (c || "").toUpperCase() + "-").include("-" + (d || "").toUpperCase() + "-")
        }
    },
    split: function(c) {
        var d = [];
        c.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/,
        function(a) {
            d.push(a[1].strip())
        });
        return d
    },
    matchElements: function(k, j) {
        var l = $$(j),
        m = Selector.handlers;
        m.mark(l);
        for (var n = 0, h = [], i; i = k[n]; n++) {
            if (i._countedByPrototype) {
                h.push(i)
            }
        }
        m.unmark(l);
        return h
    },
    findElement: function(d, f, e) {
        if (Object.isNumber(f)) {
            e = f;
            f = false
        }
        return Selector.matchElements(d, f || "*")[e || 0]
    },
    findChildElements: function(l, j) {
        j = Selector.split(j.join(","));
        var m = [],
        k = Selector.handlers;
        for (var n = 0, h = j.length, i; n < h; n++) {
            i = new Selector(j[n].strip());
            k.concat(m, i.findElements(l))
        }
        return (h > 1) ? k.unique(m) : m
    }
});
if (Prototype.Browser.IE) {
    Object.extend(Selector.handlers, {
        concat: function(g, h) {
            for (var b = 0, a; a = h[b]; b++) {
                if (a.tagName !== "!") {
                    g.push(a)
                }
            }
            return g
        }
    })
}
function $$() {
    return Selector.findChildElements(document, $A(arguments))
}
var Form = {
    reset: function(b) {
        b = $(b);
        b.reset();
        return b
    },
    serializeElements: function(j, h) {
        if (typeof h != "object") {
            h = {
                hash: !!h
            }
        } else {
            if (Object.isUndefined(h.hash)) {
                h.hash = true
            }
        }
        var n,
        k,
        i = false,
        l = h.submit;
        var m = j.inject({},
        function(b, a) {
            if (!a.disabled && a.name) {
                n = a.name;
                k = $(a).getValue();
                if (k != null && a.type != "file" && (a.type != "submit" || (!i && l !== false && (!l || n == l) && (i = true)))) {
                    if (n in b) {
                        if (!Object.isArray(b[n])) {
                            b[n] = [b[n]]
                        }
                        b[n].push(k)
                    } else {
                        b[n] = k
                    }
                }
            }
            return b
        });
        return h.hash ? m: Object.toQueryString(m)
    }
};
Form.Methods = {
    serialize: function(c, d) {
        return Form.serializeElements(Form.getElements(c), d)
    },
    getElements: function(j) {
        var i = $(j).getElementsByTagName("*"),
        k,
        h = [],
        l = Form.Element.Serializers;
        for (var g = 0; k = i[g]; g++) {
            h.push(k)
        }
        return h.inject([],
        function(b, a) {
            if (l[a.tagName.toLowerCase()]) {
                b.push(Element.extend(a))
            }
            return b
        })
    },
    getInputs: function(l, p, o) {
        l = $(l);
        var j = l.getElementsByTagName("input");
        if (!p && !o) {
            return $A(j).map(Element.extend)
        }
        for (var n = 0, k = [], m = j.length; n < m; n++) {
            var i = j[n];
            if ((p && i.type != p) || (o && i.name != o)) {
                continue
            }
            k.push(Element.extend(i))
        }
        return k
    },
    disable: function(b) {
        b = $(b);
        Form.getElements(b).invoke("disable");
        return b
    },
    enable: function(b) {
        b = $(b);
        Form.getElements(b).invoke("enable");
        return b
    },
    findFirstElement: function(d) {
        var f = $(d).getElements().findAll(function(a) {
            return "hidden" != a.type && !a.disabled
        });
        var e = f.findAll(function(a) {
            return a.hasAttribute("tabIndex") && a.tabIndex >= 0
        }).sortBy(function(a) {
            return a.tabIndex
        }).first();
        return e ? e: f.find(function(a) {
            return /^(?:input|select|textarea)$/i.test(a.tagName)
        })
    },
    focusFirstElement: function(b) {
        b = $(b);
        b.findFirstElement().activate();
        return b
    },
    request: function(e, f) {
        e = $(e),
        f = Object.clone(f || {});
        var g = f.parameters,
        h = e.readAttribute("action") || "";
        if (h.blank()) {
            h = window.location.href
        }
        f.parameters = e.serialize(true);
        if (g) {
            if (Object.isString(g)) {
                g = g.toQueryParams()
            }
            Object.extend(f.parameters, g)
        }
        if (e.hasAttribute("method") && !f.method) {
            f.method = e.method
        }
        return new Ajax.Request(h, f)
    }
};
Form.Element = {
    focus: function(b) {
        $(b).focus();
        return b
    },
    select: function(b) {
        $(b).select();
        return b
    }
};
Form.Element.Methods = {
    serialize: function(e) {
        e = $(e);
        if (!e.disabled && e.name) {
            var d = e.getValue();
            if (d != undefined) {
                var f = {};
                f[e.name] = d;
                return Object.toQueryString(f)
            }
        }
        return ""
    },
    getValue: function(d) {
        d = $(d);
        var c = d.tagName.toLowerCase();
        return Form.Element.Serializers[c](d)
    },
    setValue: function(e, d) {
        e = $(e);
        var f = e.tagName.toLowerCase();
        Form.Element.Serializers[f](e, d);
        return e
    },
    clear: function(b) {
        $(b).value = "";
        return b
    },
    present: function(b) {
        return $(b).value != ""
    },
    activate: function(d) {
        d = $(d);
        try {
            d.focus();
            if (d.select && (d.tagName.toLowerCase() != "input" || !(/^(?:button|reset|submit)$/i.test(d.type)))) {
                d.select()
            }
        } catch(c) {}
        return d
    },
    disable: function(b) {
        b = $(b);
        b.disabled = true;
        return b
    },
    enable: function(b) {
        b = $(b);
        b.disabled = false;
        return b
    }
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = {
    input: function(d, c) {
        switch (d.type.toLowerCase()) {
        case "checkbox":
        case "radio":
            return Form.Element.Serializers.inputSelector(d, c);
        default:
            return Form.Element.Serializers.textarea(d, c)
        }
    },
    inputSelector: function(d, c) {
        if (Object.isUndefined(c)) {
            return d.checked ? d.value: null
        } else {
            d.checked = !!c
        }
    },
    textarea: function(d, c) {
        if (Object.isUndefined(c)) {
            return d.value
        } else {
            d.value = c
        }
    },
    select: function(n, k) {
        if (Object.isUndefined(k)) {
            return this[n.type == "select-one" ? "selectOne": "selectMany"](n)
        } else {
            var h,
            m,
            j = !Object.isArray(k);
            for (var i = 0, l = n.length; i < l; i++) {
                h = n.options[i];
                m = this.optionValue(h);
                if (j) {
                    if (m == k) {
                        h.selected = true;
                        return
                    }
                } else {
                    h.selected = k.include(m)
                }
            }
        }
    },
    selectOne: function(c) {
        var d = c.selectedIndex;
        return d >= 0 ? this.optionValue(c.options[d]) : null
    },
    selectMany: function(i) {
        var g,
        h = i.length;
        if (!h) {
            return null
        }
        for (var j = 0, g = []; j < h; j++) {
            var f = i.options[j];
            if (f.selected) {
                g.push(this.optionValue(f))
            }
        }
        return g
    },
    optionValue: function(b) {
        return Element.extend(b).hasAttribute("value") ? b.value: b.text
    }
};
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
    initialize: function($super, e, d, f) {
        $super(f, d);
        this.element = $(e);
        this.lastValue = this.getValue()
    },
    execute: function() {
        var b = this.getValue();
        if (Object.isString(this.lastValue) && Object.isString(b) ? this.lastValue != b: String(this.lastValue) != String(b)) {
            this.callback(this.element, b);
            this.lastValue = b
        }
    }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function() {
        return Form.Element.getValue(this.element)
    }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function() {
        return Form.serialize(this.element)
    }
});
Abstract.EventObserver = Class.create({
    initialize: function(d, c) {
        this.element = $(d);
        this.callback = c;
        this.lastValue = this.getValue();
        if (this.element.tagName.toLowerCase() == "form") {
            this.registerFormCallbacks()
        } else {
            this.registerCallback(this.element)
        }
    },
    onElementEvent: function() {
        var b = this.getValue();
        if (this.lastValue != b) {
            this.callback(this.element, b);
            this.lastValue = b
        }
    },
    registerFormCallbacks: function() {
        Form.getElements(this.element).each(this.registerCallback, this)
    },
    registerCallback: function(b) {
        if (b.type) {
            switch (b.type.toLowerCase()) {
            case "checkbox":
            case "radio":
                Event.observe(b, "click", this.onElementEvent.bind(this));
                break;
            default:
                Event.observe(b, "change", this.onElementEvent.bind(this));
                break
            }
        }
    }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function() {
        return Form.Element.getValue(this.element)
    }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function() {
        return Form.serialize(this.element)
    }
}); (function() {
    var y = {
        KEY_BACKSPACE: 8,
        KEY_TAB: 9,
        KEY_RETURN: 13,
        KEY_ESC: 27,
        KEY_LEFT: 37,
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        KEY_DELETE: 46,
        KEY_HOME: 36,
        KEY_END: 35,
        KEY_PAGEUP: 33,
        KEY_PAGEDOWN: 34,
        KEY_INSERT: 45,
        cache: {}
    };
    var P = document.documentElement;
    var x = "onmouseenter" in P && "onmouseleave" in P;
    var F;
    if (Prototype.Browser.IE) {
        var M = {
            0: 1,
            1: 4,
            2: 2
        };
        F = function(b, a) {
            return b.button === M[a]
        }
    } else {
        if (Prototype.Browser.WebKit) {
            F = function(b, a) {
                switch (a) {
                case 0:
                    return b.which == 1 && !b.metaKey;
                case 1:
                    return b.which == 1 && b.metaKey;
                default:
                    return false
                }
            }
        } else {
            F = function(b, a) {
                return b.which ? (b.which === a + 1) : (b.button === a)
            }
        }
    }
    function C(a) {
        return F(a, 0)
    }
    function D(a) {
        return F(a, 1)
    }
    function J(a) {
        return F(a, 2)
    }
    function R(c) {
        c = y.extend(c);
        var d = c.target,
        b = c.type,
        a = c.currentTarget;
        if (a && a.tagName) {
            if (b === "load" || b === "error" || (b === "click" && a.tagName.toLowerCase() === "input" && a.type === "radio")) {
                d = a
            }
        }
        if (d.nodeType == Node.TEXT_NODE) {
            d = d.parentNode
        }
        return Element.extend(d)
    }
    function H(d, b) {
        var a = y.element(d);
        if (!b) {
            return a
        }
        var c = [a].concat(a.ancestors());
        return Selector.findElement(c, b, 0)
    }
    function E(a) {
        return {
            x: S(a),
            y: T(a)
        }
    }
    function S(b) {
        var c = document.documentElement,
        a = document.body || {
            scrollLeft: 0
        };
        return b.pageX || (b.clientX + (c.scrollLeft || a.scrollLeft) - (c.clientLeft || 0))
    }
    function T(b) {
        var c = document.documentElement,
        a = document.body || {
            scrollTop: 0
        };
        return b.pageY || (b.clientY + (c.scrollTop || a.scrollTop) - (c.clientTop || 0))
    }
    function G(a) {
        y.extend(a);
        a.preventDefault();
        a.stopPropagation();
        a.stopped = true
    }
    y.Methods = {
        isLeftClick: C,
        isMiddleClick: D,
        isRightClick: J,
        element: R,
        findElement: H,
        pointer: E,
        pointerX: S,
        pointerY: T,
        stop: G
    };
    var A = Object.keys(y.Methods).inject({},
    function(a, b) {
        a[b] = y.Methods[b].methodize();
        return a
    });
    if (Prototype.Browser.IE) {
        function N(b) {
            var a;
            switch (b.type) {
            case "mouseover":
                a = b.fromElement;
                break;
            case "mouseout":
                a = b.toElement;
                break;
            default:
                return null
            }
            return Element.extend(a)
        }
        Object.extend(A, {
            stopPropagation: function() {
                this.cancelBubble = true
            },
            preventDefault: function() {
                this.returnValue = false
            },
            inspect: function() {
                return "[object Event]"
            }
        });
        y.extend = function(c, a) {
            if (!c) {
                return false
            }
            if (c._extendedByPrototype) {
                return c
            }
            c._extendedByPrototype = Prototype.emptyFunction;
            var b = y.pointer(c);
            Object.extend(c, {
                target: c.srcElement || a,
                relatedTarget: N(c),
                pageX: b.x,
                pageY: b.y
            });
            return Object.extend(c, A)
        }
    } else {
        y.prototype = window.Event.prototype || document.createEvent("HTMLEvents").__proto__;
        Object.extend(y.prototype, A);
        y.extend = Prototype.K
    }
    function I(f, b, d) {
        var c = Element.retrieve(f, "prototype_event_registry");
        if (Object.isUndefined(c)) {
            Q.push(f);
            c = Element.retrieve(f, "prototype_event_registry", $H())
        }
        var a = c.get(b);
        if (Object.isUndefined(a)) {
            a = [];
            c.set(b, a)
        }
        if (a.pluck("handler").include(d)) {
            return false
        }
        var e;
        if (b.include(":")) {
            e = function(g) {
                if (Object.isUndefined(g.eventName)) {
                    return false
                }
                if (g.eventName !== b) {
                    return false
                }
                y.extend(g, f);
                d.call(f, g)
            }
        } else {
            if (!x && (b === "mouseenter" || b === "mouseleave")) {
                if (b === "mouseenter" || b === "mouseleave") {
                    e = function(h) {
                        y.extend(h, f);
                        var i = h.relatedTarget;
                        while (i && i !== f) {
                            try {
                                i = i.parentNode
                            } catch(g) {
                                i = f
                            }
                        }
                        if (i === f) {
                            return
                        }
                        d.call(f, h)
                    }
                }
            } else {
                e = function(g) {
                    y.extend(g, f);
                    d.call(f, g)
                }
            }
        }
        e.handler = d;
        a.push(e);
        return e
    }
    function O() {
        for (var a = 0, b = Q.length; a < b; a++) {
            y.stopObserving(Q[a]);
            Q[a] = null
        }
    }
    var Q = [];
    if (Prototype.Browser.IE) {
        window.attachEvent("onunload", O)
    }
    if (Prototype.Browser.WebKit) {
        window.addEventListener("unload", Prototype.emptyFunction, false)
    }
    var K = Prototype.K;
    if (!x) {
        K = function(b) {
            var a = {
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            };
            return b in a ? a[b] : b
        }
    }
    function B(b, c, e) {
        b = $(b);
        var d = I(b, c, e);
        if (!d) {
            return b
        }
        if (c.include(":")) {
            if (b.addEventListener) {
                b.addEventListener("dataavailable", d, false)
            } else {
                b.attachEvent("ondataavailable", d);
                b.attachEvent("onfilterchange", d)
            }
        } else {
            var a = K(c);
            if (b.addEventListener) {
                b.addEventListener(a, d, false)
            } else {
                b.attachEvent("on" + a, d)
            }
        }
        return b
    }
    function L(e, b, c) {
        e = $(e);
        var d = Element.retrieve(e, "prototype_event_registry");
        if (Object.isUndefined(d)) {
            return e
        }
        if (b && !c) {
            var g = d.get(b);
            if (Object.isUndefined(g)) {
                return e
            }
            g.each(function(h) {
                Element.stopObserving(e, b, h.handler)
            });
            return e
        } else {
            if (!b) {
                d.each(function(h) {
                    var j = h.key,
                    i = h.value;
                    i.each(function(k) {
                        Element.stopObserving(e, j, k.handler)
                    })
                });
                return e
            }
        }
        var g = d.get(b);
        if (!g) {
            return
        }
        var f = g.find(function(h) {
            return h.handler === c
        });
        if (!f) {
            return e
        }
        var a = K(b);
        if (b.include(":")) {
            if (e.removeEventListener) {
                e.removeEventListener("dataavailable", f, false)
            } else {
                e.detachEvent("ondataavailable", f);
                e.detachEvent("onfilterchange", f)
            }
        } else {
            if (e.removeEventListener) {
                e.removeEventListener(a, f, false)
            } else {
                e.detachEvent("on" + a, f)
            }
        }
        d.set(b, g.without(f));
        return e
    }
    function z(b, c, e, a) {
        b = $(b);
        if (Object.isUndefined(a)) {
            a = true
        }
        if (b == document && document.createEvent && !b.dispatchEvent) {
            b = document.documentElement
        }
        var d;
        if (document.createEvent) {
            d = document.createEvent("HTMLEvents");
            d.initEvent("dataavailable", true, true)
        } else {
            d = document.createEventObject();
            d.eventType = a ? "ondataavailable": "onfilterchange"
        }
        d.eventName = c;
        d.memo = e || {};
        if (document.createEvent) {
            b.dispatchEvent(d)
        } else {
            b.fireEvent(d.eventType, d)
        }
        return y.extend(d)
    }
    Object.extend(y, y.Methods);
    Object.extend(y, {
        fire: z,
        observe: B,
        stopObserving: L
    });
    Element.addMethods({
        fire: z,
        observe: B,
        stopObserving: L
    });
    Object.extend(document, {
        fire: z.methodize(),
        observe: B.methodize(),
        stopObserving: L.methodize(),
        loaded: false
    });
    if (window.Event) {
        Object.extend(window.Event, y)
    } else {
        window.Event = y
    }
})(); (function() {
    var g;
    function f() {
        if (document.loaded) {
            return
        }
        if (g) {
            window.clearTimeout(g)
        }
        document.loaded = true;
        document.fire("dom:loaded")
    }
    function h() {
        if (document.readyState === "complete") {
            document.stopObserving("readystatechange", h);
            f()
        }
    }
    function e() {
        try {
            document.documentElement.doScroll("left")
        } catch(a) {
            g = e.defer();
            return
        }
        f()
    }
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", f, false)
    } else {
        document.observe("readystatechange", h);
        if (window == top) {
            g = e.defer()
        }
    }
    Event.observe(window, "load", f)
})();
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
    display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
    Before: function(d, c) {
        return Element.insert(d, {
            before: c
        })
    },
    Top: function(d, c) {
        return Element.insert(d, {
            top: c
        })
    },
    Bottom: function(d, c) {
        return Element.insert(d, {
            bottom: c
        })
    },
    After: function(d, c) {
        return Element.insert(d, {
            after: c
        })
    }
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
    includeScrollOffsets: false,
    prepare: function() {
        this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    },
    within: function(d, e, f) {
        if (this.includeScrollOffsets) {
            return this.withinIncludingScrolloffsets(d, e, f)
        }
        this.xcomp = e;
        this.ycomp = f;
        this.offset = Element.cumulativeOffset(d);
        return (f >= this.offset[1] && f < this.offset[1] + d.offsetHeight && e >= this.offset[0] && e < this.offset[0] + d.offsetWidth)
    },
    withinIncludingScrolloffsets: function(e, f, g) {
        var h = Element.cumulativeScrollOffset(e);
        this.xcomp = f + h[0] - this.deltaX;
        this.ycomp = g + h[1] - this.deltaY;
        this.offset = Element.cumulativeOffset(e);
        return (this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + e.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + e.offsetWidth)
    },
    overlap: function(c, d) {
        if (!c) {
            return 0
        }
        if (c == "vertical") {
            return ((this.offset[1] + d.offsetHeight) - this.ycomp) / d.offsetHeight
        }
        if (c == "horizontal") {
            return ((this.offset[0] + d.offsetWidth) - this.xcomp) / d.offsetWidth
        }
    },
    cumulativeOffset: Element.Methods.cumulativeOffset,
    positionedOffset: Element.Methods.positionedOffset,
    absolutize: function(b) {
        Position.prepare();
        return Element.absolutize(b)
    },
    relativize: function(b) {
        Position.prepare();
        return Element.relativize(b)
    },
    realOffset: Element.Methods.cumulativeScrollOffset,
    offsetParent: Element.Methods.getOffsetParent,
    page: Element.Methods.viewportOffset,
    clone: function(d, f, e) {
        e = e || {};
        return Element.clonePosition(f, d, e)
    }
};
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function(c) {
        function d(a) {
            return a.blank() ? null: "[contains(concat(' ', @class, ' '), ' " + a + " ')]"
        }
        c.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
        function(f, a) {
            a = a.toString().strip();
            var b = /\s/.test(a) ? $w(a).map(d).join("") : d(a);
            return b ? document._getElementsByXPath(".//*" + b, f) : []
        }: function(n, m) {
            m = m.toString().strip();
            var l = [],
            i = (/\s/.test(m) ? $w(m) : null);
            if (!i && !m) {
                return l
            }
            var p = $(n).getElementsByTagName("*");
            m = " " + m + " ";
            for (var o = 0, a, b; a = p[o]; o++) {
                if (a.className && (b = " " + a.className + " ") && (b.include(m) || (i && i.all(function(e) {
                    return ! e.toString().blank() && b.include(" " + e + " ")
                })))) {
                    l.push(Element.extend(a))
                }
            }
            return l
        };
        return function(a, b) {
            return $(b || document.body).getElementsByClassName(a)
        }
    } (Element.Methods)
}
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
    initialize: function(b) {
        this.element = $(b)
    },
    _each: function(b) {
        this.element.className.split(/\s+/).select(function(a) {
            return a.length > 0
        })._each(b)
    },
    set: function(b) {
        this.element.className = b
    },
    add: function(b) {
        if (this.include(b)) {
            return
        }
        this.set($A(this).concat(b).join(" "))
    },
    remove: function(b) {
        if (!this.include(b)) {
            return
        }
        this.set($A(this).without(b).join(" "))
    },
    toString: function() {
        return $A(this).join(" ")
    }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
var gDebug = false;
var gDebugOnMobile = false;
var gNumDebugMessagesSent = 0;
var gNumDebugMessagesQueued = 0;
var gDebugMessageQueue = new Array();
var gDebugMessageRequest = null;
var gDebugLastClassName = "";
var gDebugLastMethodName = "";
var gDebugSimulateSlowTextureDownload = false;
var gDebugSimulateTextureLoadFailure = false;
var gDebugSimulateScriptDownloadFailure = false;
var kDebugFunction = "function";
var kDebugSurpressMessage = "!NoOp_!NoOp";
var kDebugSetupShowController = kDebugFunction + "_setupShowController";
var kDebugShowController = "!ShowController";
var kDebugShowController_AddMovieHyperlink = kDebugShowController + "_!addMovieHyperlink";
var kDebugShowController_AdvanceToNextBuild = kDebugShowController + "_!advanceToNextBuild";
var kDebugShowController_AdvanceToNextSlide = kDebugShowController + "_!advanceToNextSlide";
var kDebugShowController_AnchorPointOffset = kDebugShowController + "_!anchorPointOffset";
var kDebugShowController_ApplyAnimationEndStateValues = kDebugShowController + "_!applyAnimationEndStateValues";
var kDebugShowController_ApplyAnimationsForScene = kDebugShowController + "_!applyAnimationsForScene";
var kDebugShowController_AssignNextSceneIndex = kDebugShowController + "_!assignNextSceneIndex";
var kDebugShowController_CalculateNextSceneIndex = kDebugShowController + "_!calculateNextSceneIndex_internal";
var kDebugShowController_CalculateNextSceneIndex = kDebugShowController + "_!calculateNextSceneIndex";
var kDebugShowController_CalculateOffsetForAnchorPoint = kDebugShowController + "_!calculateOffsetForAnchorPoint";
var kDebugShowController_CalculateOffsetForRotationOrigin = kDebugShowController + "_!calculateOffsetForRotationOrigin";
var kDebugShowController_CalculatePreviousSceneIndex = kDebugShowController + "_!calculatePreviousSceneIndex";
var kDebugShowController_ChangeState = kDebugShowController + "_!changeState";
var kDebugShowController_ClearAllHyperlinks = kDebugShowController + "_!clearAllHyperlinks";
var kDebugShowController_ClearMovieHyperlinks = kDebugShowController + "_!clearMovieHyperlinks";
var kDebugShowController_CreateAnimationsForScene = kDebugShowController + "_!createAnimationsForScene";
var kDebugShowController_CreateAnimationsForScene_Adjustments = kDebugShowController + "_!createAnimationsForScene";
var kDebugShowController_CreateHyperlinks = kDebugShowController + "_!createHyperlinks";
var kDebugShowController_CreateHyperlinksForCurrentState = kDebugShowController + "_!createHyperlinksForCurrentState";
var kDebugShowController_CreateInitialKeyframeValue = kDebugShowController + "_!createInitialKeyframeValue";
var kDebugShowController_CreateTimingFunctionForAction = kDebugShowController + "_!createTimingFunctionForAction";
var kDebugShowController_CurrentSceneDidComplete = kDebugShowController + "_!currentSceneDidComplete";
var kDebugShowController_DisplayScene = kDebugShowController + "_!displayScene";
var kDebugShowController_DoIdleProcessing = kDebugShowController + "_!doIdleProcessing";
var kDebugShowController_DumpPreProcessedEventAnimations = kDebugShowController + "_!debugDumpPreProcessedEventAnimations";
var kDebugShowController_EnsureInitialStateHasEmphasisTransform = kDebugShowController + "_!ensureInitialStateHasEmphasisTransform";
var kDebugShowController_EnteringState = kDebugShowController + "_!enteringState";
var kDebugShowController_ExitShow = kDebugShowController + "_!exitShow";
var kDebugShowController_ExtractDelegateFromUrlParameter = kDebugShowController + "_!extractDelegateFromUrlParameter";
var kDebugShowController_FindHyperlinkAtCoOrds = kDebugShowController + "_!findHyperlinkAtCoOrds";
var kDebugShowController_GetProperty = kDebugShowController + "_!getProperty";
var kDebugShowController_GoBackToPreviousBuild = kDebugShowController + "_!goBackToPreviousBuild";
var kDebugShowController_GoBackToPreviousSlide = kDebugShowController + "_!goBackToPreviousSlide";
var kDebugShowController_GotoSlide = kDebugShowController + "_!gotoSlide";
var kDebugShowController_HandleClickEvent = kDebugShowController + "_!handleClickEvent";
var kDebugShowController_HandleKeyDownEvent = kDebugShowController + "_!handleKeyDownEvent";
var kDebugShowController_HandleMovieDidEnd = kDebugShowController + "_!handleMovieDidEnd";
var kDebugShowController_HandleMovieDidStart = kDebugShowController + "_!handleMovieDidStart";
var kDebugShowController_HandleMovieError = kDebugShowController + "_!handleMovieError";
var kDebugShowController_HandleSceneDidNotLoad = kDebugShowController + "_!handleSceneDidNotLoad";
var kDebugShowController_HandleSceneDidLoad = kDebugShowController + "_!handleSceneDidLoad";
var kDebugShowController_HandleScriptDidDownloadEvent = kDebugShowController + "_!handleScriptDidDownloadEvent";
var kDebugShowController_HandleScriptDidNotDownloadEvent = kDebugShowController + "_!handleScriptDidNotDownloadEvent";
var kDebugShowController_HandleStageIsReadyEvent = kDebugShowController + "_!handleStageIsReadyEvent";
var kDebugShowController_HandleStageSizeDidChangeEvent = kDebugShowController + "_!handleStageSizeDidChangeEvent";
var kDebugShowController_HandleSwipeEvent = kDebugShowController + "_!handleSwipeEvent";
var kDebugShowController_HandleTapEvent = kDebugShowController + "_!handleTapEvent";
var kDebugShowController_HideInfoPanel = kDebugShowController + "_!hideInfoPanel";
var kDebugShowController_IncrementViewCount = kDebugShowController + "_!incrementViewCount";
var kDebugShowController_Initialize = kDebugShowController + "_!initialize";
var kDebugShowController_InitialStateForTexture = kDebugShowController + "_!initialStateForTexture";
var kDebugShowController_IsSceneTransitionDelayOnly = kDebugShowController + "_!isSceneTransitionDelayOnly";
var kDebugShowController_JumpToScene = kDebugShowController + "_!jumpToScene";
var kDebugShowController_JumpToScene_partTwo = kDebugShowController + "_!jumpToScene_partTwo";
var kDebugShowController_JumpToScene_partThree = kDebugShowController + "_!jumpToScene_partThree";
var kDebugShowController_LeavingState = kDebugShowController + "_!leavingState";
var kDebugShowController_OnKeyPress = kDebugShowController + "_!onKeyPress";
var kDebugShowController_OnMouseDown = kDebugShowController + "_!onMouseDown";
var kDebugShowController_Pause = kDebugShowController + "_!pause";
var kDebugShowController_Play = kDebugShowController + "_!play";
var kDebugShowController_PlayCurrentScene = kDebugShowController + "_!playCurrentScene";
var kDebugShowController_PlayNextItemInSoundTrack = kDebugShowController + "_!playNextItemInSoundTrack";
var kDebugShowController_PlayScene = kDebugShowController + "_!playScene";
var kDebugShowController_PollForSceneToLoad = kDebugShowController + "_!pollForSceneToLoad";
var kDebugShowController_PreloadAppropriateScenes = kDebugShowController + "_!preloadAppropriateScenes";
var kDebugShowController_PreProcessSceneAnimations = kDebugShowController + "_!preProcessSceneAnimations";
var kDebugShowController_ProcessClickOrTapAtDisplayCoOrds = kDebugShowController + "_!processClickOrTapAtDisplayCoOrds";
var kDebugShowController_ProcessHyperlinkUrl = kDebugShowController + "_!processHyperlinkUrl";
var kDebugShowController_PromptUserToTryAgain = kDebugShowController + "_!promptUserToTryAgain";
var kDebugShowController_SetCurrentSceneIndexTo = kDebugShowController + "_!setCurrentSceneIndexTo";
var kDebugShowController_SetDelegate = kDebugShowController + "_!setDelegate";
var kDebugShowController_setMuted = kDebugShowController + "_!setMuted";
var kDebugShowController_SetProperty = kDebugShowController + "_!setProperty";
var kDebugShowController_SetupWaitForSceneToLoadPoller = kDebugShowController + "_!setupWaitForSceneToLoadPoller";
var kDebugShowController_ShowInfoPanel = kDebugShowController + "_!showInfoPanel";
var kDebugShowController_ShowWaitingIndicator = kDebugShowController + "_!showWaitingIndicator";
var kDebugShowController_SoundTrackItemDidComplete = kDebugShowController + "_!soundTrackItemDidComplete";
var kDebugShowController_StartMoviePlaying = kDebugShowController + "_!startMoviePlaying";
var kDebugShowController_StartSoundTrack = kDebugShowController + "_!startSoundTrack";
var kDebugShowController_ToggleMute = kDebugShowController + "_!toggleMute";
var kDebugShowController_UpdateNavigationButtons = kDebugShowController + "_!updateNavigationButtons";
var kDebugShowController_UpdateSlideNumber = kDebugShowController + "_!updateSlideNumber";
var kDebugShowController_DiagnosticsDump = kDebugShowController + "_!debugDiagnosticDump";
var kDebugShowController_DiagnosticsDump_Banner = false;
var kDebugShowController_DiagnosticsDump_Header = false;
var kDebugShowController_DiagnosticsDump_Animations = false;
var kDebugShowController_DiagnosticsDump_Textures = false;
var kDebugShowController_DiagnosticsDump_Hyperlinks = false;
var kDebugShowController_DiagnosticsDump_TextureCache = false;
var kDebugStageManager = "!StageManager";
var kDebugStageManager_AddHyperlink = kDebugStageManager + "_!addHyperlink";
var kDebugStageManager_AddPreviousEmphasisTransformDiv = kDebugStageManager + "_!addPreviousEmphasisTransformDiv";
var kDebugStageManager_AddTextureToStage = kDebugStageManager + "_!addTextureToStage";
var kDebugStageManager_AdjustStageToFit = kDebugStageManager + "_!adjustStageToFit";
var kDebugStageManager_ClearAllHyperlinks = kDebugStageManager + "_!clearAllHyperlinks";
var kDebugStageManager_GetImgElementFromPool = kDebugStageManager + "_!getImgElementFromPool";
var kDebugStageManager_HandleShowSizeDidChangeEvent = kDebugStageManager + "_!handleShowSizeDidChangeEvent";
var kDebugStageManager_HandleStageSizeDidChangeEvent = kDebugStageManager + "_!handleStageSizeDidChangeEvent";
var kDebugStageManager_Initialize = kDebugStageManager + "_!initialize";
var kDebugStageManager_ReturnImgElementToPool = kDebugStageManager + "_!returnImgElementToPool";
var kDebugStageManager_DebugRecursivelyWalkDomFrom = kDebugStageManager + "_recursivelyWalkDomFrom";
var kDebugStageManager_SetMutedStateOnAllVideoElements = kDebugStageManager + "_!setMutedStateOnAllVideoElements";
var kDebugTextureManager = "!TextureManager";
var kDebugTextureManager_Initialize = kDebugTextureManager + "_!initialize";
var kDebugTextureManager_CacheEntryForScene = kDebugTextureManager + "_!cacheEntryForScene";
var kDebugTextureManager_DumpCache = kDebugTextureManager + "_!dumpCache";
var kDebugTextureManager_GetCacheStatistics = kDebugTextureManager + "_!getCacheStatistics";
var kDebugTextureManager_GetImageObjectFromPool = kDebugTextureManager + "_!getImageObjectFromPool";
var kDebugTextureManager_HandleScriptDidDownloadEvent = kDebugTextureManager + "_!handleScriptDidDownloadEvent";
var kDebugTextureManager_LoadScene = kDebugTextureManager + "_!loadScene";
var kDebugTextureManager_IsScenePreloaded = kDebugTextureManager + "_!isScenePreloaded";
var kDebugTextureManager_PreloadScenes = kDebugTextureManager + "_!preloadScenes";
var kDebugTextureManager_PreloadTexture = kDebugTextureManager + "_!preloadTexture";
var kDebugTextureManager_PurgeCacheEntry = kDebugTextureManager + "_!purgeCacheEntry";
var kDebugTextureManager_ReturnImageObjectToPool = kDebugTextureManager + "_!returnImageObjectToPool";
var kDebugTextureManager_TextureDidPreload = kDebugTextureManager + "_!textureDidPreload";
var kDebugTextureManager_TextureDidNotPreload = kDebugTextureManager + "_!textureDidNotPreload";
var kDebugTextureManager_TrackTextureLifetime = kDebugTextureManager + "_!trackTextureLifetime";
var kDebugTextureManager_UnloadScene = kDebugTextureManager + "_!unloadScene";
var kDebugTextureManager_UrlForTexture = kDebugTextureManager + "_!urlForTexture";
var kDebugDisplayManager = "!DisplayManager";
var kDebugDisplayManager_ClearLaunchMode = kDebugDisplayManager + "_!clearLaunchMode";
var kDebugDisplayManager_ConvertDisplayCoOrdsToShowCoOrds = kDebugDisplayManager + "_!convertDisplayCoOrdsToShowCoOrds";
var kDebugDisplayManager_DocumentInfoDidLoad = kDebugDisplayManager + "_!documentInfoDidLoad";
var kDebugDisplayManager_DocumentInfoDidNotLoad = kDebugDisplayManager + "_!documentInfoDidNotLoad";
var kDebugDisplayManager_HandleMouseMove = kDebugDisplayManager + "_!handleMouseMove";
var kDebugDisplayManager_HandleMouseOut = kDebugDisplayManager + "_!handleMouseOut";
var kDebugDisplayManager_HandleMouseOutHUD = kDebugDisplayManager + "_!handleMouseOutHUD";
var kDebugDisplayManager_HandleMouseOverHUD = kDebugDisplayManager + "_!handleMouseOverHUD";
var kDebugDisplayManager_HandleOrientationDidChangeEvent = kDebugDisplayManager + "_!handleOrientationDidChangeEvent";
var kDebugDisplayManager_HandleShowSizeDidChangeEvent = kDebugDisplayManager + "_!handleShowSizeDidChangeEvent";
var kDebugDisplayManager_HandleTimeoutForHUD = kDebugDisplayManager + "_!handleTimeoutForHUD";
var kDebugDisplayManager_HideHUD = kDebugDisplayManager + "_!hideHUD";
var kDebugDisplayManager_HideInfoPanel = kDebugDisplayManager + "_!hideInfoPanel";
var kDebugDisplayManager_HideWaitingIndicator = kDebugDisplayManager + "_!hideWaitingIndicator";
var kDebugDisplayManager_Initialize = kDebugDisplayManager + "_!initialize";
var kDebugDisplayManager_LayoutDisplay = kDebugDisplayManager + "_!layoutDisplay";
var kDebugDisplayManager_PositionHUD = kDebugDisplayManager + "_!positionHUD";
var kDebugDisplayManager_PositionWaitingIndicator = kDebugDisplayManager + "_!positionWaitingIndicator";
var kDebugDisplayManager_PreloadImage = kDebugDisplayManager + "_!preloadImage";
var kDebugDisplayManager_SetEmbeddedRestartButtonEnabled = kDebugDisplayManager + "_!setEmbeddedRestartButtonEnabled";
var kDebugDisplayManager_SetHudMuteButtonState = kDebugDisplayManager + "_!setHudMuteButtonState";
var kDebugDisplayManager_SetNextButtonEnabled = kDebugDisplayManager + "_!setNextButtonEnabled";
var kDebugDisplayManager_SetPreviousButtonEnabled = kDebugDisplayManager + "_!setPreviousButtonEnabled";
var kDebugDisplayManager_ShowApplicableControls = kDebugDisplayManager + "_!showApplicableControls";
var kDebugDisplayManager_ShowHUD = kDebugDisplayManager + "_!showHUD";
var kDebugDisplayManager_ShowInfoPanel = kDebugDisplayManager + "_!showInfoPanel";
var kDebugDisplayManager_ShowWaitingIndicator = kDebugDisplayManager + "_!showWaitingIndicator";
var kDebugDisplayManager_UpdateSlideNumber = kDebugDisplayManager + "_!updateSlideNumber";
var kDebugAnimationManager = "!AnimationManager";
var kDebugAnimationManager_CreateAnimation = kDebugAnimationManager + "_!createAnimation";
var kDebugAnimationManager_DeleteAllAnimations = kDebugAnimationManager + "_!deleteAllAnimations";
var kDebugAnimationManager_DeleteAnimation = kDebugAnimationManager + "_!deleteAnimation";
var kDebugAnimationManager_FindAnimation = kDebugAnimationManager + "_!findAnimation";
var kDebugOrientationController = "!OrientationController";
var kDebugOrientationController_ChangeOrientation = kDebugOrientationController + "_!changeOrientation";
var kDebugOrientationController_HandleDeviceOrientationChangeEvent = kDebugOrientationController + "_!handleDeviceOrientationChangeEvent";
var kDebugOrientationController_HandleWindowResizeEvent = kDebugOrientationController + "_!handleWindowResizeEvent";
var kDebugOrientationController_Initialize = kDebugOrientationController + "_!initialize";
var kDebugTouchController = "!TouchController";
var kDebugTouchController_HandleGestureEndEvent = kDebugTouchController + "_!handleGestureEndEvent";
var kDebugTouchController_HandleGestureStartEvent = kDebugTouchController + "_!handleGestureStartEvent";
var kDebugTouchController_HandleTouchCancelEvent = kDebugTouchController + "_!handleTouchCancelEvent";
var kDebugTouchController_HandleTouchCancelEvent = kDebugTouchController + "_!handleTouchMoveEvent";
var kDebugTouchController_HandleTouchEndEvent = kDebugTouchController + "_!handleTouchEndEvent";
var kDebugTouchController_HandleTouchStartEvent = kDebugTouchController + "_!handleTouchStartEvent";
var kDebugTouchController_Initialize = kDebugTouchController + "_!initialize";
var kDebugTouchController_IsTouchWithinTrackArea = kDebugTouchController + "_!isTouchWithinTrackArea";
var kDebugTouchController_SetTrackArea = kDebugTouchController + "_!setTrackArea";
var kDebugScriptMangaer = "!ScriptManager";
var kDebugScriptMangaer_Initialize = kDebugScriptMangaer + "_!initialize";
var kDebugScriptMangaer_DownloadScript = kDebugScriptMangaer + "_!downloadScript";
var kDebugScriptMangaer_ScriptDidDownload = kDebugScriptMangaer + "_!scriptDidDownload";
var kDebugScriptMangaer_ScriptDidNotDownload = kDebugScriptMangaer + "_!scriptDidNotDownload";
var kDebugScriptMangaer_IsOnlyActionInSceneAMovieStart = kDebugScriptMangaer + "_!isOnlyActionInSceneAMovieStart";
var kDebugScriptMangaer_IsMovieInScene = kDebugScriptMangaer + "_!isMovieInScene";
var kDebugScriptMangaer_GetMoviesInScene = kDebugScriptMangaer + "_!getMoviesInScene";
var kDebugScriptMangaer_PreProcessScript = kDebugScriptMangaer + "_!preProcessScript";
var kDebugScriptMangaer_PreProcessScript_Detailed = kDebugScriptMangaer + "_!preProcessScript";
var kDebugScriptMangaer_PreProcessScript_ExtremelyDetailed = kDebugScriptMangaer + "_!preProcessScript";
var kDebugScriptMangaer_SceneIndexFromSlideIndex = kDebugScriptMangaer + "_!sceneIndexFromSlideIndex";
var kDebugScriptMangaer_SlideIndexFromSceneIndex = kDebugScriptMangaer + "_!slideIndexFromSceneIndex";
var kDebugTimer = "DebugTimer";
var kDebugTimer_AdvanceToNextBuild = kDebugTimer + "_!advanceToNextBuild";
var kDebugTimer_CreateAnimationsForScene = kDebugTimer + "_!createAnimationsForScene";
var kDebugTimer_ApplyAnimationsForScene = kDebugTimer + "_!applyAnimationsForScene";
var kDebugTimer_PreProcessSceneAnimations = kDebugTimer + "_!preProcessSceneAnimations";
var kDebugTimer_AdvanceToNextBuild_to_ApplyAnimations = kDebugTimer + "_!preProcessSceneAnimations_to_ApplyAnimations";
var kDebugTimer_JumpToScene = kDebugTimer + "_!jumpToScene";
var kDebugTimer_DisplayScene = kDebugTimer + "_!displayScene";
var kDebugNullDelegate = "!NullDelegate";
var kDebugNullDelegate_initialize = kDebugNullDelegate + "_!initialize";
var kDebugNullDelegate_showDidLoad = kDebugNullDelegate + "_!showDidLoad";
var kDebugNullDelegate_showExited = kDebugNullDelegate + "_!showExited";
var kDebugNullDelegate_propertyChanged = kDebugNullDelegate + "_!propertyChanged";
function debugWarning(d, c) {
    if (gDebug == false) {
        return
    }
    debugSendMessage(d, "WARNING: " + c, true)
}
function debugMessageAlways(d, c) {
    debugSendMessage(d, c, true)
}
function debugMessage(d, c) {
    if (gDebug == false) {
        return
    }
    if ((gDevice == kDeviceMobile) && (gDebugOnMobile == false)) {
        return
    }
    debugSendMessage(d, c, false)
}
function debugSendMessage(q, l, r) {
    var n = q.indexOf("_");
    var o = q.substring(0, n);
    var k = q.substring(n + 1);
    var m = false;
    if (o[0] == "!") {
        o = o.substring(1);
        m = true
    }
    if (k[0] == "!") {
        k = k.substring(1);
        m = true
    }
    if (k[0] == "+") {
        k = k.substring(1);
        r = true
    }
    if ((m == true) && (r == false)) {
        return
    }
    var p = "";
    if (l == null) {
        l = ""
    }
    if (l[0] != "-" || o != gDebugLastClassName || k != gDebugLastMethodName) {
        if (o == kDebugTimer) {
            p = q + ": "
        } else {
            if (o == kDebugFunction) {
                p = k + "() "
            } else {
                p = o + "." + k + "() "
            }
        }
    } else {
        p = ""
    }
    gDebugLastClassName = o;
    gDebugLastMethodName = k;
    if (gDevice == kDeviceMobile) {
        gNumDebugMessagesSent++;
        var j = escape(gNumDebugMessagesSent + ": " + p + l);
        gDebugMessageQueue[gNumDebugMessagesQueued] = j;
        gNumDebugMessagesQueued++;
        if (gNumDebugMessagesQueued == 1) {
            debugCheckMessageQueue()
        }
    } else {}
}
function debugSendNextMessageInQueue() {
    var c = gDebugMessageQueue[0];
    gNumDebugMessagesQueued--;
    gDebugMessageQueue.splice(0, 1);
    var d = '/debugMessage.rhtml?message="' + c + '"';
    new Ajax.Request(d, {
        method: "get",
        onSuccess: function(a) {
            debugMessageWasSent(a)
        },
        onFailure: function(a) {
            debugMessageWasNotSent(a)
        }
    })
}
function debugMessageWasSent(b) {
    debugCheckMessageQueue()
}
function debugMessageWasNotSent(b) {
    debugCheckMessageQueue()
}
function debugCheckMessageQueue() {
    if (gNumDebugMessagesQueued > 0) {
        setTimeout(debugSendNextMessageInQueue, 10)
    }
}
var DebugTimer = Class.create({
    initialize: function(e) {
        var d = e.indexOf("_");
        var f = e.substring(d + 1);
        if (f[0] != "!") {
            this.id = e;
            this.startTime = new Date();
            debugMessageAlways(e, "Start")
        } else {
            this.startTime = null
        }
    },
    stop: function() {
        if (this.startTime != null) {
            var c = new Date();
            var d = c - this.startTime;
            debugMessageAlways(this.id, "Stop - Elapsed Time: " + d)
        }
    }
});
function debugStopTimer(b) {
    if (b) {
        b.stop()
    }
}
var debugDomDumpLineNumber = 0;
function debugDumpDomFrom(f, d) {
    return;
    var e = kDebugFunction + "_debugDumpDomFrom";
    debugDomDumpLineNumber = 0;
    debugMessageAlways(e, "------------------ S T A R T   O F   D O M   D U M P --- Context: " + d);
    debugRecursivelyDumpDomFrom(f, "");
    debugMessageAlways(e, "------------------ E N D   O F   D O M   D U M P")
}
function debugRecursivelyDumpDomFrom(m, j) {
    var l = kDebugFunction + "_recursivelyDumpDomFrom";
    var h = m.id;
    var i = m.nodeName.toLowerCase();
    if (i == "#text") {
        return
    }
    debugMessageAlways(l, "-" + (debugDomDumpLineNumber++) + j + "<" + i + " id='" + h + "'>");
    var n;
    for (n = 0; n < m.childNodes.length; n++) {
        var k = m.childNodes[n];
        recursivelyDumpDomFrom(k, j + "   ")
    }
    if (i == "img") {
        return
    }
    debugMessageAlways(l, "-" + (debugDomDumpLineNumber++) + j + "</" + i + ">")
}
var SC = SC || {},
CoreDocs = CoreDocs || {},
NO = false,
YES = true;
CoreDocs.loc = function(d, c) {
    if (c === undefined) {
        CoreDocs.error('"' + d + '" needs a comment to be picked up for loc.')
    }
    d = d.loc();
    d = d.replace(/@@/g, "%@");
    return d
};
SC.String = {
    fmt: function() {
        var i = this.gsub(/%@([0-9]+)/,
        function(a) {
            return (arguments[parseInt(a[1], 0) - 1] || "").toString()
        });
        var l = [];
        var h = -1;
        var j = 0;
        var g = 0;
        while ((h = i.indexOf("%@", j)) >= 0) {
            l.push(i.slice(j, h));
            j = h + 2;
            var k = arguments[g++];
            if (k && k.toString) {
                k = k.toString()
            }
            l.push(k)
        }
        if (j < i.length) {
            l.push(i.slice(j, i.length))
        }
        return (l.length > 1) ? l.join("") : l[0]
    },
    loc: function() {
		return this;
        var d = String[String.currentLanguage()];
        var c = d[this];
        if (!c) {
            c = String.English[this] || this
        }
        return c.fmt.apply(c, arguments)
    }
};
for (var key in SC.String) {
    String.prototype[key] = SC.String[key]
}
Object.extend(String, {
    browserLanguage: ((navigator.language || navigator.browserLanguage).split("-", 1)[0]),
    useAutodetectedLanguage: NO,
    preferredLanguage: null,
    currentLanguage: function() {
        var b = (this.useAutodetectedLanguage) ? (this.browserLanguage || this.preferredLanguage || "en") : (this.preferredLanguage || this.browserLanguage || "en");
        if (!this[b]) {
            b = this.normalizedLanguage(b)
        }
        return b
    },
    normalizedLanguage: function(b) {
        switch (b) {
        case "fr":
            b = "French";
            break;
        case "de":
            b = "German";
            break;
        case "ja":
        case "jp":
            b = "Japanese";
            break;
        case "en":
            b = "English";
            break;
        case "es":
            b = "Spanish";
            break;
        default:
            b = "English";
            break
        }
        return b
    },
    addStringsFor: function(c, d) {
        c = String.normalizedLanguage(c);
        if (!String[c]) {
            String[c] = {}
        }
        Object.extend(String[c], d || {});
        return this
    }
});
String.English = String.English || {};
String.French = String.French || {};
String.German = String.German || {};
String.Japanese = String.Japanese || {};
function getMobileOSVersionInfo() {
    var d = navigator.userAgent.match(/iPhone OS ([\d_]+)/) || navigator.userAgent.match(/iPad OS ([\d_]+)/) || navigator.userAgent.match(/CPU OS ([\d_]+)/);
    var f = {
        major: 0,
        minor: 0,
        point: 0
    };
    if (d) {
        var e = d[1].split("_");
        f.major = parseInt(e[0]);
        if (e.length > 1) {
            f.minor = parseInt(e[1])
        }
        if (e.length > 2) {
            f.point = parseInt(e[2])
        }
    }
    return f
}
function isMobileSafari() {
    if (navigator.userAgent.indexOf("iPod") != -1) {
        return true
    } else {
        if (navigator.userAgent.indexOf("iPhone") != -1) {
            return true
        } else {
            if (navigator.userAgent.indexOf("iPad") != -1) {
                return true
            } else {
                return false
            }
        }
    }
}
function isiPad() {
    return (navigator.userAgent.indexOf("iPad") != -1)
}
function getUrlParameter(e) {
    e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var f = "[\\?&]" + e + "=([^&#]*)";
    var h = new RegExp(f);
    var g = h.exec(window.location.href);
    if (g == null) {
        return ""
    } else {
        return g[1]
    }
}
function setElementOpaque(b) {
    b.style.opacity = 1
}
function setElementTransparent(b) {
    b.style.opacity = 0
}
function setElementPosition(f, h, i, j, g) {
    if (f == null) {
        window.console.log("null element passed to setElementPosition " + h + ", " + i + ", " + j + ", " + g);
        return
    }
    f.style.top = h;
    f.style.left = i;
    f.style.width = j;
    f.style.height = g
}
function setElementRect(d, c) {
    if (d == null) {
        return
    }
    d.style.top = c.y;
    d.style.left = c.x;
    d.style.width = c.width;
    d.style.height = c.height
}
function centerElementInDiv(n, l, m, i, h) {
    if (n == null) {
        return
    }
    var j = (h - m) / 2;
    var k = (i - l) / 2;
    setElementPosition(n, j, k, l, m)
}
function showElement(b) {
    if (b == null) {
        return
    }
    b.style.visibility = "visible"
}
function hideElement(b) {
    if (b == null) {
        return
    }
    b.style.visibility = "hidden"
}
function runInNextEventLoop(b) {
    setTimeout(b, 100)
}
function ensureScaleFactorNotZero(b) {
    if (b == 0) {
        return 0.000001
    } else {
        return b
    }
}
function scaleSizeWithinSize(n, j, l, m) {
    var k = {};
    var h = n / j;
    var i = l / m;
    if (h > i) {
        k.width = l;
        k.height = j * (l / n)
    } else {
        if (h < i) {
            k.width = n * (m / j);
            k.height = m
        } else {
            k.width = l;
            k.height = m
        }
    }
    return k
}
function parseTransformMatrix(f) {
    var h = {
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0
    };
    if (f.indexOf("matrix(") == 0) {
        var e = f.substring(7, f.length - 1);
        var g = new Array();
        g = e.split(",");
        h.scaleX = g[0];
        h.scaleY = g[3];
        h.x = g[4];
        h.y = g[5]
    } else {}
    return h
}
function escapeTextureId(c) {
    var d = c.replace(/\./g, "-");
    return d
}
function unEscapeTextureId(c) {
    var d = c.replace(/\-/g, ".");
    return d
}
var MONTH_NAMES = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
var DAY_NAMES = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
function LZ(b) {
    return (b < 0 || b > 9 ? "": "0") + b
}
Object.extend(Date.prototype, {
    format: function(P) {
        P = P + "";
        var m = this;
        var Y = "";
        var H = 0;
        var E = "";
        var ac = "";
        var Z = m.getFullYear() + "";
        var ab = m.getMonth() + 1;
        var K = m.getDate();
        var W = m.getDay();
        var X = m.getHours();
        var s = m.getMinutes();
        var T = m.getSeconds();
        var O,
        M,
        ae,
        R,
        k,
        ad,
        Q,
        S,
        h,
        V,
        c,
        X,
        d,
        aa,
        af,
        U;
        var y = new Object();
        if (Z.length < 4) {
            Z = "" + (Z - 0 + 1900)
        }
        y.y = "" + Z;
        y.yyyy = Z;
        y.yy = Z.substring(2, 4);
        y.M = ab;
        y.MM = LZ(ab);
        y.MMM = MONTH_NAMES[ab - 1];
        y.NNN = MONTH_NAMES[ab + 11];
        y.d = K;
        y.dd = LZ(K);
        y.E = DAY_NAMES[W + 7];
        y.EE = DAY_NAMES[W];
        y.H = X;
        y.HH = LZ(X);
        if (X == 0) {
            y.h = 12
        } else {
            if (X > 12) {
                y.h = X - 12
            } else {
                y.h = X
            }
        }
        y.hh = LZ(y.h);
        if (X > 11) {
            y.K = X - 12
        } else {
            y.K = X
        }
        y.k = X + 1;
        y.KK = LZ(y.K);
        y.kk = LZ(y.k);
        if (X > 11) {
            y.a = "PM"
        } else {
            y.a = "AM"
        }
        y.m = s;
        y.mm = LZ(s);
        y.s = T;
        y.ss = LZ(T);
        while (H < P.length) {
            E = P.charAt(H);
            ac = "";
            while ((P.charAt(H) == E) && (H < P.length)) {
                ac += P.charAt(H++)
            }
            if (y[ac] != null) {
                Y = Y + y[ac]
            } else {
                Y = Y + ac
            }
        }
        return Y
    }
});
function getHecklerElementsByTagName(d, c) {
    return getElementsByTagNameNS(d, c, "urn:iwork:property", "X:")
}
function getElementsByTagNameNS(f, j, i, h) {
    var g = null;
    if (f.getElementsByTagNameNS) {
        g = f.getElementsByTagNameNS(i, j)
    } else {
        g = f.getElementsByTagName(h + j)
    }
    return g
}
var kShowControllerState_Stopped = "Stopped";
var initialScene = -1;
var finalScene = -1;
var kShowControllerState_Starting = "Starting";
var kShowControllerState_DownloadingScript = "DownloadingScipt";
var kShowControllerState_SettingUpScene = "SettingUpScene";
var kShowControllerState_IdleAtFinalState = "IdleAtFinalState";
var kShowControllerState_IdleAtInitialState = "IdleAtInitialState";
var kShowControllerState_WaitingToJump = "WaitingToJump";
var kShowControllerState_ReadyToJump = "ReadyToJump";
var kShowControllerState_WaitingToDisplay = "WaitingToDisplay";
var kShowControllerState_ReadyToDisplay = "ReadyToDisplay";
var kShowControllerState_WaitingToPlay = "WaitingToPlay";
var kShowControllerState_ReadyToPlay = "ReadyToPlay";
var kShowControllerState_Playing = "Playing";
var kKeyDownEvent = "keydown";
var kNullActionEmphasis = {
    rotationEmphasis: [0, 0, 0, 0, 0, 0],
    translationEmphasis: [0, 0, 0],
    scaleEmphasis: [0, 0, 0, 0, 0, 0]
};
var ShowController = Class.create({
    initialize: function() {
        this.extractDelegateFromUrlParameter();
        this.delegate.showDidLoad();
        this.showUrl = "assets/";
        debugMessage(kDebugShowController_Initialize, "showUrl: " + this.showUrl);
        this.displayManager = new DisplayManager();
        this.scriptManager = new ScriptManager(this.showUrl);
        this.textureManager = new TextureManager(this.showUrl);
        this.stageManager = new StageManager(this.textureManager, this.scriptManager);
        this.touchController = new TouchController();
        this.animationManager = new AnimationManager();
        this.orientationController = new OrientationController();
        this.activeHyperlinks = new Array();
        this.movieHyperlinks = new Array();
        this.script = null;
        this.currentSceneIndex = -1;
        this.nextSceneIndex = -1;
        this.currentSlideIndex = -1;
        this.previousSlideIndex = -1;
        this.currentSoundTrackIndex = 0;
        this.transformOriginValue = "";
        this.accumulatingDigits = false;
        this.digitAccumulator = 0;
        this.firstSlide = true;
        this.embedMode = kEmbedModeEmbedded;
        this.accountID = "";
        this.guid = "";
        this.locale = "EN";
        this.isNavigationBarVisible = false;
        this.isFullscreen = false;
        this.volume = 3;
        this.muted = false;
        this.soundTrackPlayer = null;
        this.sceneIndexOfPrebuiltAnimations = -1;
        this.queuedUserAction = null;
        this.autoAdvance = false;
        this.autoAdvanceReversed = false;
        this.autoAdvanceCount = 0;
        var b = this;
        document.observe(kStageIsReadyEvent,
        function(a) {
            b.handleStageIsReadyEvent(a)
        },
        false);
        document.observe(kScriptDidDownloadEvent,
        function(a) {
            b.handleScriptDidDownloadEvent(a)
        },
        false);
        document.observe(kScriptDidNotDownloadEvent,
        function(a) {
            b.handleScriptDidNotDownloadEvent(a)
        },
        false);
        document.observe(kSwipeEvent,
        function(a) {
            b.handleSwipeEvent(a)
        },
        false);
        document.observe(kStageSizeDidChangeEvent,
        function(a) {
            b.handleStageSizeDidChangeEvent(a)
        },
        false);
        document.observe(kKeyDownEvent,
        function(a) {
            b.handleKeyDownEvent(a)
        },
        false);
        this.touchController.registerTapEventCallback(function(a) {
            b.handleTapEvent(a)
        });
        this.changeState(kShowControllerState_Stopped)
    },
    extractDelegateFromUrlParameter: function() {
        var f = getUrlParameter("delegate");
        if ((f == "") || (f == null) || (typeof(f) == "undefined")) {
            debugMessage(kDebugShowController_ExtractDelegateFromUrlParameter, "no delegate parameter specified in URL, using null delegate");
            this.delegate = new NullDelegate();
            return
        }
        debugMessage(kDebugShowController_ExtractDelegateFromUrlParameter, "delegate: " + f);
        var d = f.indexOf(".");
        this.delegate = window;
        while (d != -1) {
            var e = f.substring(0, d);
            debugMessage(kDebugShowController_ExtractDelegateFromUrlParameter, "- nextPart: " + e);
            this.delegate = this.delegate[e];
            f = f.substring(d + 1);
            d = f.indexOf(".")
        }
        debugMessage(kDebugShowController_ExtractDelegateFromUrlParameter, "- lasePart: " + f);
        this.delegate = this.delegate[f]
    },
    setDelegate: function(b) {
        debugMessage(kDebugShowController_SetDelegate, "delegate has been set")
    },
    setProperty: function(c, d) {
        debugMessage(kDebugShowController_SetProperty, "setting '" + c + "' to: " + d);
        switch (c) {
        case kPropertyName_embedMode:
            switch (d) {
            case kEmbedModeEmbedded:
                this.embedMode = d;
                break;
            case kEmbedModeNonEmbedded:
                this.embedMode = d;
                break;
            default:
                debugMessage(kDebugShowController_SetProperty, "invalid value specified for " + kPropertyName_embedMode + ": " + d);
                break
            }
            break;
        case kPropertyName_presentationName:
            break;
        case kPropertyName_accountID:
            this.accountID = d;
            break;
        case kPropertyName_guid:
            this.guid = d;
            break;
        case kPropertyName_locale:
            this.locale = d;
            break;
        case kPropertyName_currentSlide:
            this.jumpToSlide(d);
            break;
        case kPropertyName_isNavigationBarVisible:
            this.isNavigationBarVisible = d;
            break;
        case kPropertyName_isFullscreen:
            break;
        case kPropertyName_volume:
            break;
        case kPropertyName_muted:
            this.setMuted(d);
            break;
        default:
            debugMessage(kDebugShowController_SetProperty, "- unknown property name");
            break
        }
    },
    getProperty: function(c) {
        debugMessage(kDebugShowController_GetProperty);
        var d = null;
        switch (c) {
        case kPropertyName_embedMode:
            d = this.embedMode;
            break;
        case kPropertyName_presentationName:
            d = this.showUrl;
            break;
        case kPropertyName_accountID:
            d = null;
            break;
        case kPropertyName_guid:
            d = null;
            break;
        case kPropertyName_locale:
            d = null;
            break;
        case kPropertyName_currentSlide:
            d = this.currentSlideIndex + 1;
            break;
        case kPropertyName_isNavigationBarVisible:
            d = null;
            break;
        case kPropertyName_isFullscreen:
            d = null;
            break;
        case kPropertyName_volume:
            d = null;
            break;
        default:
            debugMessage(kDebugShowController_SetProperty, "unknown property name");
            break
        }
        debugMessage(kDebugShowController_GetProperty, "getting '" + c + "'... returning '" + d + "'");
        return d
    },
    gotoSlide: function(b) {
        debugMessage(kDebugShowController_GotoSlide, "slideNumber: " + b);
        this.jumpToSlide(b)
    },
    pause: function() {
        debugMessage(kDebugShowController_Pause, "currently not implemented!")
    },
    play: function() {
        debugMessage(kDebugShowController_Play, "currently not implemented!")
    },
    debugToggleMobileDebugging: function() {
        if (gDebugOnMobile) {
            debugMessageAlways("ShowController_DebugEnableFullDebugging", "turning mobile debugging off...");
            gDebugOnMobile = false
        } else {
            debugMessageAlways("ShowController_DebugEnableFullDebugging", "turning mobile debugging on...");
            gDebugOnMobile = true
        }
    },
    debugDiagnosticDump: function() {
        if (kDebugShowController_DiagnosticsDump_Banner) {
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "*****************************************************");
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "***  S T A R T   D I A G N O S T I C   D U M P   ****");
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "*****************************************************")
        }
        if (kDebugShowController_DiagnosticsDump_Header) {
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-               state: " + this.state);
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-           numSlides: " + this.script.slideCount);
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-           numScenes: " + this.script.numScenes);
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-   currentSceneIndex: " + this.currentSceneIndex);
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-      nextSceneIndex: " + this.nextSceneIndex);
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-   currentSlideIndex: " + this.currentSlideIndex);
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-  previousSlideIndex: " + this.previousSlideIndex);
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-       loopSlideshow: " + (this.script.loopSlideshow ? "yes": "no"));
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-      hyperlinksOnly: " + (this.script.showMode == kShowModeHyperlinksOnly ? "yes": "no"))
        }
        if (kDebugShowController_DiagnosticsDump_Animations) {
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-");
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "- Pre-Built Texture Animations:");
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "- -----------------------------");
            for (var t in this.textureAnimations) {
                debugMessage(kDebugShowController_DiagnosticsDump, "- " + t)
            }
        }
        if (kDebugShowController_DiagnosticsDump_Textures) {
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-");
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "- Textures In Scene:");
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "- ------------------");
            var n;
            for (n = 0; n < this.stageManager.stage.childNodes.length; n++) {
                var r = this.stageManager.stage.childNodes[n];
                var l = "";
                debugMessageAlways(kDebugShowController_DiagnosticsDump, "- " + n + ": DIV id='" + r.id + "' opacity:" + r.style.opacity);
                var o = false;
                var p = r;
                var m = 1;
                do {
                    l += "      ";
                    if (p.childNodes.length > 0) {
                        p = p.childNodes[0];
                        if (p.hasOwnProperty("opacity")) {
                            m *= p.style.opacity
                        }
                        debugMessageAlways(kDebugShowController_DiagnosticsDump, "- " + l + p.nodeName + " id='" + p.id + "' opacity: " + p.style.opacity + (p.hasOwnProperty("src") ? " src: " + p.src: ""))
                    } else {
                        debugMessageAlways(kDebugShowController_DiagnosticsDump, "- " + l + "net opacity: " + m + " = " + (m > 0 ? "visible": "hidden"));
                        o = true
                    }
                }
                while (!o)
            }
        }
        if (kDebugShowController_DiagnosticsDump_Hyperlinks) {
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-");
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "- Active Hyperlinks:");
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "- ------------------");
            var q = 0;
            var s;
            if (this.activeHyperlinks != null) {
                q = this.activeHyperlinks.length
            }
            if (q == 0) {
                debugMessageAlways(kDebugShowController_DiagnosticsDump, "- no hyperlinks")
            }
            for (s = 0; s < q; s++) {
                var k = this.activeHyperlinks[s];
                debugMessageAlways(kDebugShowController_DiagnosticsDump, "- " + s + "::  x:" + k.targetRectangle.x + " y:" + k.targetRectangle.y + " w:" + k.targetRectangle.width + " h:" + k.targetRectangle.height + " url:" + k.url)
            }
        }
        if (kDebugShowController_DiagnosticsDump_TextureCache) {
            this.textureManager.debugDumpCache()
        }
        if (kDebugShowController_DiagnosticsDump_Banner) {
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "*************************************************");
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "***  E N D   D I A G N O S T I C   D U M P   ****");
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "*************************************************")
        }
    },
    exitShow: function() {
        debugMessage(kDebugShowController_ExitShow, "- exiting show...");
        this.delegate.showExited()
    },
    onMouseDown: function(b) {
        debugMessage(kDebugShowController_OnMouseDown, (b.leftClick ? "Left": b.rightClick ? "Right": b.middleClick ? "Middle": "no") + " button clicked");
        if (b.leftClick) {
            this.advanceToNextBuild("onMouseDown")
        } else {
            if (b.rightClick) {
                this.goBackToPreviousBuild("onMouseDown")
            }
        }
    },
    onKeyPress: function(f, e) {
        debugMessage(kDebugShowController_OnKeyPress, "key: " + f + " modifier(s): " + (e.shiftKey ? "shift ": "") + (e.altKey ? "alt ": "") + (e.ctrlKey ? "ctrl ": "") + (e.metaKey ? "meta": ""));
        if ((f >= kKeyCode_Numeric_0) && (f <= kKeyCode_Numeric_9)) {
            f = kKeyCode_0 + (f - kKeyCode_Numeric_0)
        }
        f += (e.shiftKey ? kKeyModifier_Shift: 0);
        f += (e.altKey ? kKeyModifier_Alt: 0);
        f += (e.ctrlKey ? kKeyModifier_Ctrl: 0);
        f += (e.metaKey ? kKeyModifier_Meta: 0);
        var d = false;
        switch (f) {
        case kKeyCode_Escape:
            this.exitShow();
            break;
        case kKeyCode_Return + kKeyModifier_Ctrl: this.displayManager.showWaitingIndicator();
            break;
        case kKeyCode_Return + kKeyModifier_Alt: this.displayManager.hideWaitingIndicator();
            break;
        case kKeyCode_Return + kKeyModifier_Meta: this.debugDiagnosticDump();
            break;
        case kKeyCode_Return:
            if (this.accumulatingDigits) {
                debugMessage(kDebugShowController_OnKeyPress, "- return pressed while accumulating digits, accumulator is now: " + this.digitAccumulator);
                this.accumulatingDigits = false;
                if (this.script.showMode == kShowModeHyperlinksOnly) {
                    debugMessage(kDebugShowController_OnKeyPress, "- can't do it, we're in hyperlinks only mode")
                } else {
                    if (this.digitAccumulator <= this.script.slideCount) {
                        this.jumpToSlide(this.digitAccumulator)
                    }
                }
                break
            } else {}
        case kKeyCode_N:
        case kKeyCode_Space:
        case kKeyCode_DownArrow:
        case kKeyCode_RightArrow:
        case kKeyCode_PageDown:
            debugMessage(kDebugShowController_OnKeyPress, "- advance to next build...");
            this.advanceToNextBuild("onKeyPress");
            break;
        case kKeyCode_RightArrow + kKeyModifier_Shift: case kKeyCode_DownArrow + kKeyModifier_Shift: case kKeyCode_PageDown + kKeyModifier_Shift: case kKeyCode_CloseBracket:
            debugMessage(kDebugShowController_OnKeyPress, "- advance to next slide...");
            this.advanceToNextSlide("onKeyPress");
            break;
        case kKeyCode_LeftArrow + kKeyModifier_Shift: case kKeyCode_PageUp + kKeyModifier_Shift: case kKeyCode_OpenBracket:
            debugMessage(kDebugShowController_OnKeyPress, "- go back to previous build...");
            this.goBackToPreviousBuild("onKeyPress");
            break;
        case kKeyCode_P:
        case kKeyCode_Delete:
        case kKeyCode_PageUp:
        case kKeyCode_LeftArrow:
        case kKeyCode_UpArrow:
        case kKeyCode_UpArrow + kKeyModifier_Shift: debugMessage(kDebugShowController_OnKeyPress, "- go back to previous slide...");
            this.goBackToPreviousSlide("onKeyPress");
            break;
        case kKeyCode_Home:
            debugMessage(kDebugShowController_OnKeyPress, "- go back to first slide...");
            if (this.script.showMode == kShowModeHyperlinksOnly) {
                debugMessage(kDebugShowController_OnKeyPress, "- can't do it, we're in hyperlinks only mode")
            } else {
                this.jumpToSlide(1)
            }
            break;
        case kKeyCode_End:
            debugMessage(kDebugShowController_OnKeyPress, "- go back to last slide...");
            if (this.script.showMode == kShowModeHyperlinksOnly) {
                debugMessage(kDebugShowController_OnKeyPress, "- can't do it, we're in hyperlinks only mode")
            } else {
                this.jumpToSlide(this.script.slideCount)
            }
            break;
        default:
            if ((f >= kKeyCode_0) && (f <= kKeyCode_9)) {
                d = true;
                if (this.accumulatingDigits == false) {
                    debugMessage(kDebugShowController_OnKeyPress, "- digit entered, start accumulating digits...");
                    this.accumulatingDigits = true;
                    this.digitAccumulator = 0
                }
                debugMessage(kDebugShowController_OnKeyPress, "- accumulator was: " + this.digitAccumulator);
                this.digitAccumulator *= 10;
                this.digitAccumulator += (f - kKeyCode_0);
                debugMessage(kDebugShowController_OnKeyPress, "- accumulator now: " + this.digitAccumulator)
            }
            break
        }
        if (this.accumulatingDigits && (d == false)) {
            debugMessage(kDebugShowController_OnKeyPress, "- non-digit entered, stop accumulating digits...");
            this.accumulatingDigits = false;
            this.digitAccumulator = 0
        }
    },
    handleKeyDownEvent: function(f) {
        var d = f.charCode || f.keyCode;
        var e = {
            altKey: !!f.altKey,
            ctrlKey: !!f.ctrlKey,
            shiftKey: !!f.shiftKey,
            metaKey: !!f.metaKey
        };
        kKeyCode_Return;
        if (e.metaKey) {
            if (d != kKeyCode_Return) {
                return
            }
        }
        debugMessage(kDebugShowController_HandleKeyDownEvent, "keyCode: " + d);
        f.stop();
        this.onKeyPress(d, e)
    },
    handleClickEvent: function(d) {
        debugMessage(kDebugShowController_HandleClickEvent, "location: " + d.x + ", " + d.y);
        var c = {
            pointX: d.x,
            pointY: d.y
        };
        this.processClickOrTapAtDisplayCoOrds(c)
    },
    incrementViewCount: function() {},
    startShow: function() {
        this.changeState(kShowControllerState_DownloadingScript);
        this.scriptManager.downloadScript();
        if (gMode == kModeMobile && gIsPublicViewer) {
            this.incrementViewCount()
        }
    },
    changeState: function(b) {
        if (b != this.state) {
            debugMessage(kDebugShowController_ChangeState, "leaving '" + this.state + "' entering '" + b + "'");
            this.accumulatingDigits = false;
            this.digitAccumulator = 0;
            this.leavingState();
            this.state = b;
            this.enteringState()
        }
    },
    leavingState: function() {
        debugMessage(kDebugShowController_LeavingState, "leaving " + this.state + " currentSceneIndex: " + this.currentSceneIndex);
        switch (this.state) {
        case kShowControllerState_Stopped:
            break;
        case kShowControllerState_Starting:
            break;
        case kShowControllerState_SettingUpScene:
            break;
        case kShowControllerState_IdleAtFinalState:
            break;
        case kShowControllerState_IdleAtInitialState:
            break;
        case kShowControllerState_WaitingToJump:
            break;
        case kShowControllerState_ReadyToJump:
            break;
        case kShowControllerState_WaitingToPlay:
            this.displayManager.hideWaitingIndicator();
            break;
        case kShowControllerState_ReadyToPlay:
            break;
        case kShowControllerState_Playing:
            break
        }
    },
    enteringState: function() {
        debugMessage(kDebugShowController_EnteringState, "entering " + this.state + " state, currentSceneIndex: " + this.currentSceneIndex);
        var b = this;
        switch (this.state) {
        case kShowControllerState_Stopped:
            break;
        case kShowControllerState_Starting:
            this.displayManager.showWaitingIndicator();
            break;
        case kShowControllerState_SettingUpScene:
            break;
        case kShowControllerState_IdleAtFinalState:
        case kShowControllerState_IdleAtInitialState:
            this.updateSlideNumber();
            this.displayManager.hideWaitingIndicator();
            this.createHyperlinksForCurrentState("idle");
            runInNextEventLoop(function() {
               // b.doIdleProcessing()
            });
            break;
        case kShowControllerState_WaitingToJump:
            break;
        case kShowControllerState_ReadyToJump:
            break;
        case kShowControllerState_WaitingToPlay:
            this.displayManager.showWaitingIndicator();
            break;
        case kShowControllerState_ReadyToPlay:
            break;
        case kShowControllerState_Playing:
            break
        }
    },
    doIdleProcessing: function() {
        this.preloadAppropriateScenes();
        if (this.queuedUserAction != null) {
            debugMessageAlways(kDebugShowController_DoIdleProcessing, "executing queued user action...");
            this.queuedUserAction();
            this.queuedUserAction = null
        } else {
            var c = this.stageManager.stage;
            if (c.childNodes.length == 0) {
                debugWarning(kDebugShowController_DoIdleProcessing, "we are idle, and there is nothing on the stage!")
            } else {
                debugMessageAlways(kDebugShowController_DoIdleProcessing, "at the " + (this.state == kShowControllerState_IdleAtFinalState ? "end": "start") + " of scene " + this.currentSceneIndex + " with " + c.childNodes.length + " textures on stage and scenes " + this.textureManager.scenesInCache() + " in the cache.");
                this.displayManager.updateStatisticsDisplay();
                this.updateNavigationButtons()
            }
            if (this.autoAdvance) {
                var d = this;
                setTimeout(function() {
                    d.debugAutoAdvance()
                },
                500)
            }
        }
    },
    debugAutoAdvance: function() {
        this.autoAdvanceCount++;
        debugMessageAlways("ShowController_AutoAdvance", "advancing to next build... (Total Advances: " + this.autoAdvanceCount + ")");
        var d;
        if (this.autoAdvanceReversed) {
            d = this.goBackToPreviousSlide("autoAdvance")
        } else {
            d = this.advanceToNextBuild("autoAdvance")
        }
        if (d == false) {
            debugMessageAlways("ShowController_AutoAdvance", "looks like we've reached the end, reverse direction...");
            this.autoAdvanceReversed = !this.autoAdvanceReversed;
            var c = this;
            setTimeout(function() {
                c.debugAutoAdvance()
            },
            500)
        }
    },
    truncatedSlideIndex: function(b) {
        return this.truncatedIndex(b, this.script.lastSlideIndex, this.script.loopSlideshow)
    },
    truncatedSceneIndex: function(b) {
        return this.truncatedIndex(b, this.script.lastSceneIndex, this.script.loopSlideshow)
    },
    truncatedIndex: function(e, f, d) {
        if (e < 0) {
            if (d) {
                e = e + f + 1
            } else {
                e = -1
            }
        } else {
            if (e > f) {
                if (d) {
                    e = e - f - 1
                } else {
                    e = -1
                }
            }
        }
        return e
    },
    preloadAppropriateScenes: function() {
        debugMessage(kDebugShowController_PreloadAppropriateScenes);
        var C = this.currentSceneIndex;
        if (this.state == kShowControllerState_IdleAtFinalState) {
            C++
        }
        var F = this.scriptManager.slideIndexFromSceneIndex(C);
        var B = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(F - 1));
        var E = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(F - 2));
        var q = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(F - 3));
        var z = this.truncatedSceneIndex(C - 1);
        var A = this.truncatedSceneIndex(C - 2);
        var D = this.truncatedSceneIndex(C - 3);
        var s = this.truncatedSceneIndex(C + 1);
        var t = this.truncatedSceneIndex(C + 2);
        var v = this.truncatedSceneIndex(C + 3);
        var u = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(F + 1));
        var w = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(F + 2));
        var x = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(F + 3));
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-   previousSlideIndex3: " + q);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-   previousSlideIndex2: " + E);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-   previousSlideIndex1: " + B);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-   previousBuildIndex1: " + z);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-   previousBuildIndex2: " + A);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-   previousBuildIndex3: " + D);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-       sceneIndexToUse: " + C);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-       nextBuildIndex1: " + s);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-       nextBuildIndex2: " + t);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-       nextBuildIndex3: " + v);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-       nextSlideIndex1: " + u);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-       nextSlideIndex2: " + w);
        debugMessage(kDebugShowController_PreloadAppropriateScenes, "-       nextSlideIndex3: " + x);
        var r = {};
        var y = (gIpad == true);
        if (!y && q != -1) {
            r[q] = true
        }
        if (!y && E != -1) {
            r[E] = true
        }
        if (!y && B != -1) {
            r[B] = true
        }
        if (!y && D != -1) {
            r[D] = true
        }
        if (!y && A != -1) {
            r[A] = true
        }
        if (!y && z != -1) {
            r[z] = true
        }
        r[this.currentSceneIndex] = true;
        r[C] = true;
        if (s != -1) {
            r[s] = true
        }
        if (!y && t != -1) {
            r[t] = true
        }
        if (!y && v != -1) {
            r[v] = true
        }
        if (!y && u != -1) {
            r[u] = true
        }
        if (!y && w != -1) {
            r[w] = true
        }
        if (!y && x != -1) {
            r[x] = true
        }
        this.textureManager.preloadScenes(r)
    },
    updateSlideNumber: function() {
        var f = this.currentSceneIndex;
        debugMessage(kDebugShowController_UpdateSlideNumber, "this.currentSceneIndex: " + this.currentSceneIndex);
        if (this.state == kShowControllerState_IdleAtFinalState) {
            debugMessage(kDebugShowController_UpdateSlideNumber, "- but because we're waiting at end state, we need to add one...");
            f++
        }
        var d = this.scriptManager.slideIndexFromSceneIndex(f);
        if (this.firstSlide) {
            var e = this;
            runInNextEventLoop(function() {
                e.startSoundTrack();
                e.displayManager.clearLaunchMode()
            });
            this.firstSlide = false
        }
        debugMessage(kDebugShowController_UpdateSlideNumber, "- that makes slide index: " + d);
        if (this.currentSlideIndex != d) {
            debugMessage(kDebugShowController_UpdateSlideNumber, "- this differs from previous index of " + this.currentSlideIndex + ", update display and inform delegate...");
            this.previousSlideIndex = this.currentSlideIndex;
            this.currentSlideIndex = d;
            this.displayManager.updateSlideNumber(this.currentSlideIndex + 1, this.script.slideCount);
            this.delegate.propertyChanged(kPropertyName_currentSlide, this.currentSlideIndex + 1)
        } else {
            debugMessage(kDebugShowController_UpdateSlideNumber, "- this has not changed, nothing to do...")
        }
    },
    showInfoPanel: function() {
        debugMessage(kDebugShowController_ShowInfoPanel);
        this.clearExistingAnimations();
        this.displayManager.showInfoPanel();
        this.touchController.setTouchTrackingEnabled(false)
    },
    hideInfoPanel: function() {
        debugMessage(kDebugShowController_HideInfoPanel, "hide the info panel and re-show the slides");
        this.displayManager.hideInfoPanel();
        debugMessage(kDebugShowController_HideInfoPanel, "re-enable touch tracking");
        this.touchController.setTouchTrackingEnabled(true);
        debugMessage(kDebugShowController_HideInfoPanel, "we're done")
    },
    handleStageSizeDidChangeEvent: function(b) {
        debugMessage(kDebugShowController_HandleStageSizeDidChangeEvent, "need to update TouchController with new track area");
        this.touchController.setTrackArea(b.memo.left, b.memo.top, b.memo.width, b.memo.height)
    },
    handleTapEvent: function(d) {
        debugMessage(kDebugShowController_HandleTapEvent, "fingers: " + d.memo.fingers);
        var c = {
            pointX: d.memo.pointX,
            pointY: d.memo.pointY
        };
        this.processClickOrTapAtDisplayCoOrds(c)
    },
    processClickOrTapAtDisplayCoOrds: function(h) {
        var e = false;
        var g = "";
        if (this.displayManager.isInfoPanelShowing()) {
            debugMessage(kDebugShowController_ProcessClickOrTapAtDisplayCoOrds, "info panel is showing, ignore clicks and taps");
            return
        }
        debugMessage(kDebugShowController_ProcessClickOrTapAtDisplayCoOrds, "display location: (" + h.pointX + "," + h.pointY + ")");
        var f = this.displayManager.convertDisplayCoOrdsToShowCoOrds(h);
        debugMessage(kDebugShowController_ProcessClickOrTapAtDisplayCoOrds, "- show location: (" + f.pointX + "," + f.pointY + ")");
        if (f.pointX == -1) {
            debugMessage(kDebugShowController_ProcessClickOrTapAtDisplayCoOrds, "- outside of show area")
        } else {
            g = this.findHyperlinkAtCoOrds(f);
            e = (g != "")
        }
        if (e) {
            debugMessage(kDebugShowController_ProcessClickOrTapAtDisplayCoOrds, "- hyperlink invokded. url: " + g);
            this.processHyperlinkUrl(g)
        } else {
			if(h.pointX < 50||h.pointX > (1024-50) || h.pointY > 718){
				return;
			}
            this.advanceToNextBuild("processClickOrTapAtDisplayCoOrds")
        }
    },
    processHyperlinkUrl: function(l) {
        debugMessage(kDebugShowController_ProcessHyperlinkUrl, l);
        if (l.indexOf("?slide=") == 0) {
            var m = l.substring(7);
            debugMessage(kDebugShowController_ProcessHyperlinkUrl, "- it's a jump to slide " + m);
            var o = parseInt(m);
            this.jumpToSlide(o)
        } else {
            if (l.indexOf("?action=exitpresentation") == 0) {
                debugMessage(kDebugShowController_ProcessHyperlinkUrl, "- it's a call to exit the presentation");
                this.exitShow()
            } else {
                if (l.indexOf("?action=retreat") == 0) {
                    if (this.previousSlideIndex != -1) {
                        debugMessage(kDebugShowController_ProcessHyperlinkUrl, "- it's a jump to the last viewed slide, which was " + this.previousSlideIndex + 1);
                        this.jumpToSlide(this.previousSlideIndex + 1)
                    } else {
                        debugMessage(kDebugShowController_ProcessHyperlinkUrl, "- it's a jump to the last viewed slide, but this is the first slide we've displayed")
                    }
                } else {
                    if (l.indexOf("?id=") == 0) {
                        var m = l.substring(4);
                        debugMessage(kDebugShowController_ProcessHyperlinkUrl, "- it's a jump to a slide number: " + m)
                    } else {
                        if (l.indexOf("http:") == 0) {
                            debugMessage(kDebugShowController_ProcessHyperlinkUrl, "- it's a jump to a web page: " + l);
                            window.open(l, "_blank", null)
                        } else {
                            if (l.indexOf("mailto:") == 0) {
                                debugMessage(kDebugShowController_ProcessHyperlinkUrl, "- it's an e-mail link: " + l);
                                window.location = l
                            } else {
                                if (l.indexOf("playMovie:") == 0) {
                                    var k = l.indexOf(":");
                                    var n = l.substring(k + 1);
                                    debugMessage(kDebugShowController_ProcessHyperlinkUrl, "- it's a playMovie directive, movieObjectId: '" + n + "'");
                                    if (gMoviesRespectTransforms) {
                                        var p = n.substring(0, n.lastIndexOf("-movieObject")) + "-root"
                                    } else {
                                        var p = n.substring(0, n.lastIndexOf("-movieObjectClone")) + "-root"
                                    }
                                    var j = document.getElementById(p);
                                    var i = j.style.opacity;
                                    if (i == 0) {
                                        this.advanceToNextBuild("invisibleMovie");
                                        return
                                    }
                                    this.startMoviePlaying(n, true)
                                } else {
                                    debugMessage(kDebugShowController_ProcessHyperlinkUrl, "- it's an unknown hyperlink type: " + l)
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    addMovieHyperlink: function(f, e) {
        var d = {
            targetRectangle: f,
            url: e
        };
        this.movieHyperlinks.push(d);
        debugMessage(kDebugShowController_AddMovieHyperlink, "movie hyperlink added, now there are " + this.movieHyperlinks.length)
    },
    clearMovieHyperlinks: function() {
        debugMessage(kDebugShowController_ClearMovieHyperlinks, "deleting old movie hyperlinks array and creating new one...");
        delete this.movieHyperlinks;
        this.movieHyperlinks = new Array()
    },
    clearAllHyperlinks: function() {
        debugMessage(kDebugShowController_ClearAllHyperlinks, "deleting old hyperlinks array and creating new one...");
        this.stageManager.clearAllHyperlinks();
        delete this.activeHyperlinks;
        this.activeHyperlinks = new Array()
    },
    findHyperlinkAtCoOrds: function(f) {
        var g = 0;
        var i;
        if (this.activeHyperlinks != null) {
            g = this.activeHyperlinks.length
        }
        debugMessage(kDebugShowController_FindHyperlinkAtCoOrds, "showCoOrds: (" + f.pointX + "," + f.pointY + ")");
        debugMessage(kDebugShowController_FindHyperlinkAtCoOrds, "- looking through " + g + " hyperlinks...");
        for (i = g; i > 0; i--) {
            var h = this.activeHyperlinks[i - 1];
            var j = h.targetRectangle;
            hyperlinkLeft = Math.floor(j.x);
            hyperlinkTop = Math.floor(j.y);
            hyperlinkRight = hyperlinkLeft + Math.floor(j.width);
            hyperlinkBottom = hyperlinkTop + Math.floor(j.height);
            debugMessage(kDebugShowController_FindHyperlinkAtCoOrds, "- " + i + ": (left: " + hyperlinkLeft + ", top:" + hyperlinkTop + ", right: " + hyperlinkRight + ", bottom: " + hyperlinkBottom + ", width: " + j.width + ", height: " + j.height + ")");
            if ((f.pointX >= hyperlinkLeft) && (f.pointX <= hyperlinkRight) && (f.pointY >= hyperlinkTop) && (f.pointY <= hyperlinkBottom)) {
                debugMessage(kDebugShowController_FindHyperlinkAtCoOrds, "---- found it: url: " + h.url);
                return h.url
            } else {
                debugMessage(kDebugShowController_FindHyperlinkAtCoOrds, "---- not in this one...")
            }
        }
        debugMessage(kDebugShowController_FindHyperlinkAtCoOrds, "- no hyperlink containing this point found.");
        return ""
    },
    handleSwipeEvent: function(b) {
        debugMessage(kDebugShowController_HandleSwipeEvent, "direction: " + b.memo.direction + " fingers: " + b.memo.fingers);
		if(b.memo.fingers==1)
        stepOut(b.memo.direction);
        
        return;
        if (b.memo.direction == "left") {
            switch (b.memo.fingers) {
            case 1:
                this.advanceToNextBuild("handleSwipeEvent");
                break;
            case 2:
                this.advanceToNextSlide("handleSwipeEvent");
                break;
            default:
                break
            }
        } else {
            if (b.memo.direction == "right") {
                switch (b.memo.fingers) {
                case 1:
                    this.goBackToPreviousSlide("handleSwipeEvent");
                    break;
                case 2:
                    this.goBackToPreviousBuild("handleSwipeEvent");
                    break;
                default:
                    break
                }
            } else {
                debugMessage(kDebugShowController_HandleSwipeEvent, "unsupported swipe")
            }
        }
    },
    toggleMute: function() {
        var b;
        if (this.muted) {
            debugMessage(kDebugShowController_ToggleMute, "turn sound on...");
            b = false
        } else {
            debugMessage(kDebugShowController_ToggleMute, "turn sound off...");
            b = true
        }
        this.setMuted(b);
        this.delegate.propertyChanged(kPropertyName_muted, this.muted)
    },
    setMuted: function(b) {
        this.muted = b;
        if (this.soundTrackPlayer) {
            debugMessage(kDebugShowController_setMuted, "- setting mute state of running soundtrack...");
            this.soundTrackPlayer.muted = this.muted
        } else {
            debugMessage(kDebugShowController_setMuted, "- there is no running soundtrack to mute/un-mute")
        }
        debugMessage(kDebugShowController_setMuted, "- check if there are any running videos...");
        this.stageManager.setMutedStateOnAllVideoElements(this.muted);
        this.updateNavigationButtons();
        debugMessage(kDebugShowController_setMuted, "- and we're done!")
    },
    handleLinkControl: function() {
        var b = "http://public.iwork.com/document/?a=" + getUrlParameter("a") + "&d=" + getUrlParameter("d");
        window.open(b, "_top")
    },
    advanceToNextBuild: function(h) {
        if (finalScene == initialScene) {
            stepOut();
            return
        }
        if (this.script.showMode == kShowModeHyperlinksOnly && h != "currentSceneDidComplete") {
            debugMessage(kDebugShowController_AdvanceToNextBuild, "can't do it, we're in hyperlinks only mode");
            return false
        }
        if (this.displayManager.infoPanelIsShowing) {
            debugMessage(kDebugShowController_AdvanceToNextBuild, "can't do it, info panel is showing");
            return false
        }
        debugMessage(kDebugShowController_AdvanceToNextBuild, "================================================================================");
        debugMessage(kDebugShowController_AdvanceToNextBuild, "===                A D V A N C E   T O   N E X T   B U I L D                 ===");
        debugMessage(kDebugShowController_AdvanceToNextBuild, "================================================================================");
        debugMessage(kDebugShowController_AdvanceToNextBuild, "-           context: " + h);
        debugMessage(kDebugShowController_AdvanceToNextBuild, "-             state: " + this.state);
        debugMessage(kDebugShowController_AdvanceToNextBuild, "- currentSceneIndex: " + this.currentSceneIndex);
        debugMessage(kDebugShowController_AdvanceToNextBuild, "-    nextSceneIndex: " + this.nextSceneIndex);
        this.debugTimerAdvanceToBuild = new DebugTimer(kDebugTimer_AdvanceToNextBuild);
        this.debugTimerAdvanceToBuild_to_ApplyAnimations = new DebugTimer(kDebugTimer_AdvanceToNextBuild_to_ApplyAnimations);
        var f = false;
        switch (this.state) {
        case kShowControllerState_IdleAtFinalState:
            if (this.nextSceneIndex == -1) {
                stepOut();
                debugMessage(kDebugShowController_AdvanceToNextBuild, "- this.nextSceneIndex is -1, that's the end!");
                break
            }
            debugMessage(kDebugShowController_AdvanceToNextBuild, "- we're sitting idle on final state of " + this.currentSceneIndex + ", jump to next scene... (" + this.nextSceneIndex + ")");
            var g;
            if (this.nextSceneIndex > this.currentSceneIndex) {
                debugMessage(kDebugShowController_AdvanceToNextBuild, "next > current, we're NOT looping back to the start, so play animations after jump");
                g = true
            } else {
                debugMessage(kDebugShowController_AdvanceToNextBuild, "next <= current, we ARE looping back to the start, so do NOT play animations after jump");
                g = false
            }
            f = true;
            if (this.nextSceneIndex >= finalScene) {

                stepOut();
                return;
                this.jumpToScene(initialScene, false);
                return
            }
            manageBullets(this.nextSceneIndex - initialScene, finalScene - initialScene);
            this.jumpToScene(this.nextSceneIndex, g);
            break;
        case kShowControllerState_IdleAtInitialState:
            if (this.currentSceneIndex >= this.script.numScenes) {
                if (this.script.loopSlideshow == false) {
                    debugMessage(kDebugShowController_AdvanceToNextBuild, "- we're at the end and this is NOT a looping show, can't advance")
                } else {
                    debugMessage(kDebugShowController_AdvanceToNextBuild, "- we're at the end but this IS a looping show, jump to start");
                    f = true;
                    stepOut();
                    return
                }
            } else {
                debugMessage(kDebugShowController_AdvanceToNextBuild, "- we're sitting idle on initial state of " + this.currentSceneIndex + ", preload next scene (" + this.nextSceneIndex + "), and play current scene...");
                f = true;
            	if (this.nextSceneIndex > finalScene) {
					stepOut();
					return;
				}
                manageBullets(this.currentSceneIndex - initialScene, finalScene - initialScene);
                this.playCurrentScene()
            }
            break;
        default:
            debugMessageAlways(kDebugShowController_AdvanceToNextBuild, "nextSceneIndex: " + this.nextSceneIndex + " can't advance now, not in an idle state (currently in '" + this.state + "' state)");
            if (this.queuedUserAction == null) {
                debugMessageAlways(kDebugShowController_AdvanceToNextBuild, "- queue up action to run in next idle time");
                var e = this;
                f = true;
                this.queuedUserAction = function() {
                    e.advanceToNextBuild(h)
                }
            }
            break
        }
        debugMessage(kDebugShowController_AdvanceToNextBuild, "complete, context:" + h);
        return f
    },
    advanceToNextSlide: function(j) {
        if (this.script.showMode == kShowModeHyperlinksOnly) {
            debugMessage(kDebugShowController_AdvanceToNextSlide, "can't do it, we're in hyperlinks only mode");
            return
        }
        if (this.displayManager.infoPanelIsShowing) {
            debugMessage(kDebugShowController_AdvanceToNextBuild, "can't do it, info panel is showing");
            return
        }
        debugMessage(kDebugShowController_AdvanceToNextSlide, "================================================================================");
        debugMessage(kDebugShowController_AdvanceToNextSlide, "===                A D V A N C E   T O   N E X T   S L I D E                 ===");
        debugMessage(kDebugShowController_AdvanceToNextSlide, "================================================================================");
        debugMessage(kDebugShowController_AdvanceToNextSlide, "-           context: " + j);
        debugMessage(kDebugShowController_AdvanceToNextSlide, "-             state: " + this.state);
        debugMessage(kDebugShowController_AdvanceToNextSlide, "- currentSceneIndex: " + this.currentSceneIndex);
        var f = this.currentSceneIndex;
        switch (this.state) {
        case kShowControllerState_IdleAtFinalState:
            f++;
        case kShowControllerState_IdleAtInitialState:
            var h = this.scriptManager.slideIndexFromSceneIndex(f) + 1;
            var i = h + 1;
            debugMessage(kDebugShowController_AdvanceToNextSlide, "-   sceneIndexToUse: " + f);
            debugMessage(kDebugShowController_AdvanceToNextSlide, "-      currentSlide: " + h);
            debugMessage(kDebugShowController_AdvanceToNextSlide, "-         nextSlide: " + i);
            if (i == this.script.slideCount) {
                if (this.script.loopSlideshow) {
                    nextSlideIndex = 0;
                    debugMessage(kDebugShowController_AdvanceToNextSlide, "-         nextSlide: " + i + " (Adjusted for looping)")
                }
            }
            if (i <= this.script.slideCount) {
                debugMessage(kDebugShowController_AdvanceToNextSlide, "- jumping to next slide...");
                this.jumpToSlide(i)
            } else {
                debugMessageAlways(kDebugShowController_AdvanceToNextSlide, "- can't advance, alrady at end of show")
            }
            break;
        default:
            debugMessage(kDebugShowController_AdvanceToNextSlide, "can't advance now, not in an idle state (currently in '" + this.state + "' state)");
            if (this.queuedUserAction == null) {
                var g = this;
                this.queuedUserAction = function() {
                    return g.advanceToNextSlide(j)
                }
            }
            break
        }
    },
    goBackToPreviousSlide: function(p) {
        if (this.script.showMode == kShowModeHyperlinksOnly) {
            debugMessage(kDebugShowController_GoBackToPreviousSlide, "can't do it, we're in hyperlinks only mode");
            return false
        }
        if (this.displayManager.infoPanelIsShowing) {
            debugMessage(kDebugShowController_AdvanceToNextBuild, "can't do it, info panel is showing");
            return false
        }
        debugMessage(kDebugShowController_GoBackToPreviousSlide, "================================================================================");
        debugMessage(kDebugShowController_GoBackToPreviousSlide, "===            G O   B A C K   T O   P R E V I O U S   S L I D E             ===");
        debugMessage(kDebugShowController_GoBackToPreviousSlide, "================================================================================");
        debugMessage(kDebugShowController_GoBackToPreviousSlide, "-                  context: " + p);
        debugMessage(kDebugShowController_GoBackToPreviousSlide, "-                    state: " + this.state);
        debugMessage(kDebugShowController_GoBackToPreviousSlide, "-        currentSceneIndex: " + this.currentSceneIndex);
        var q = this.currentSceneIndex;
        var j = false;
        switch (this.state) {
        case kShowControllerState_IdleAtFinalState:
            q++;
        case kShowControllerState_Playing:
        case kShowControllerState_IdleAtInitialState:
            var r = this.scriptManager.slideIndexFromSceneIndex(q);
            var l = this.scriptManager.sceneIndexFromSlideIndex(r);
            var n = this.script.eventTimelines[l];
            var k = l;
            if (this.isSceneTransitionDelayOnly(l)) {
                k++
            }
            debugMessage(kDebugShowController_GoBackToPreviousSlide, "-          sceneIndexToUse: " + q);
            debugMessage(kDebugShowController_GoBackToPreviousSlide, "-        currentSlideIndex: " + r);
            debugMessage(kDebugShowController_GoBackToPreviousSlide, "- firstSceneOnCurrentSlide: " + l);
            debugMessage(kDebugShowController_GoBackToPreviousSlide, "-     firstSceneIndexToUse: " + k);
            if (k != q) {
                debugMessage(kDebugShowController_GoBackToPreviousSlide, "- we're part-way through the current slide, go back to the beginning of this slide");
                j = true;
                this.jumpToScene(k, false)
            } else {
                if ((r == 0) && (this.script.loopSlideshow == false)) {
                    debugMessage(kDebugShowController_GoBackToPreviousSlide, "- can't go back, already at start of show")
                } else {
                    var o = (r > 0 ? r - 1: this.script.slideCount - 1);
                    debugMessage(kDebugShowController_GoBackToPreviousSlide, "- previousSlideIndex: " + o);
                    j = true;
                    this.jumpToSlide(o + 1)
                }
            }
            break;
        default:
            debugMessage(kDebugShowController_GoBackToPreviousSlide, "can't go back now, not in an idle state (currently in '" + this.state + "' state)");
            if (this.queuedUserAction == null) {
                var m = this;
                j = true;
                this.queuedUserAction = function() {
                    return m.goBackToPreviousSlide(p)
                }
            }
            break
        }
        return j
    },
    isSceneTransitionDelayOnly: function(g) {
        debugMessage(kDebugShowController_IsSceneTransitionDelayOnly, "sceneIndex: " + g);
        var e = this.script.eventTimelines[g];
        if (e.automaticPlay != 1) {
            debugMessage(kDebugShowController_IsSceneTransitionDelayOnly, "- not a transition-delay only scene, because it is NOT autoplay");
            return false
        }
        var h = e.eventAnimations;
        if (h.length != 1) {
            debugMessage(kDebugShowController_IsSceneTransitionDelayOnly, "- not a transition-delay only scene, because there is NOT exactly 1 animation in the scene");
            return false
        }
        var f = h[0];
        if (f.effect != "transition-delay") {
            debugMessage(kDebugShowController_IsSceneTransitionDelayOnly, "- not a transition-delay only scene, because the effect name is NOT 'transition-delay'");
            return false
        }
        debugMessage(kDebugShowController_IsSceneTransitionDelayOnly, "sceneIndex: " + g + " is a transition-delay only scene");
        return true
    },
    calculatePreviousSceneIndex: function(c) {
        debugMessage(kDebugShowController_CalculatePreviousSceneIndex, "sceneIndex: " + c);
        var d = c;
        do {
            d--;
            if (d == -1) {
                d = this.script.lastSceneIndex
            }
        }
        while (this.isSceneTransitionDelayOnly(d));
        debugMessage(kDebugShowController_CalculatePreviousSceneIndex, "previousSceneIndex: " + d);
        return d
    },
    goBackToPreviousBuild: function(g) {
        if (this.script.showMode == kShowModeHyperlinksOnly) {
            debugMessage(kDebugShowController_GoBackToPreviousBuild, "can't do it, we're in hyperlinks only mode");
            return
        }
        if (this.displayManager.infoPanelIsShowing) {
            debugMessage(kDebugShowController_AdvanceToNextBuild, "can't do it, info panel is showing");
            return
        }
        debugMessage(kDebugShowController_GoBackToPreviousBuild, "================================================================================");
        debugMessage(kDebugShowController_GoBackToPreviousBuild, "===            G O   B A C K   T O   P R E V I O U S   B U I L D             ===");
        debugMessage(kDebugShowController_GoBackToPreviousBuild, "================================================================================");
        debugMessage(kDebugShowController_GoBackToPreviousBuild, "-           context: " + g);
        debugMessage(kDebugShowController_GoBackToPreviousBuild, "-             state: " + this.state);
        debugMessage(kDebugShowController_GoBackToPreviousBuild, "- currentSceneIndex: " + this.currentSceneIndex);
        var e = this.currentSceneIndex;
        switch (this.state) {
        case kShowControllerState_IdleAtFinalState:
            e++;
        case kShowControllerState_Playing:
        case kShowControllerState_IdleAtInitialState:
            debugMessage(kDebugShowController_GoBackToPreviousBuild, "-   sceneIndexToUse: " + e);
            if ((e == 0) && (this.script.loopSlideshow == false)) {
                debugMessage(kDebugShowController_GoBackToPreviousSlide, "- can't go back, already at start of show")
            } else {
                var h = this.calculatePreviousSceneIndex(e);
                debugMessage(kDebugShowController_GoBackToPreviousBuild, "-previousSceneIndex: " + h);
                this.jumpToScene(h, false)
            }
            break;
        default:
            debugMessage(kDebugShowController_GoBackToPreviousSlide, "can't go back now, not in an idle state (currently in '" + this.state + "' state)");
            if (this.queuedUserAction == null) {
                var f = this;
                this.queuedUserAction = function() {
                    return f.goBackToPreviousBuild(g)
                }
            }
            break
        }
    },
    handleStageIsReadyEvent: function(b) {
        debugMessage(kDebugShowController_HandleStageIsReadyEvent)
    },
    handleScriptDidDownloadEvent: function(n) {
        debugMessage(kDebugShowController_HandleScriptDidDownloadEvent);
        switch (this.state) {
        case kShowControllerState_DownloadingScript:
            this.script = n.memo.script;
            this.script.numScenes = this.script.eventTimelines.length - 1;
            if (this.script.showMode == kShowModeHyperlinksOnly) {
                this.displayManager.setHyperlinksOnlyMode()
            }
            debugMessage(kDebugShowController_HandleScriptDidDownloadEvent, "- this.script.numScenes: " + this.script.numScenes);
            debugMessage(kDebugShowController_HandleScriptDidDownloadEvent, "- switching to 'starting'...");
            this.changeState(kShowControllerState_Starting);
            debugMessage(kDebugShowController_HandleScriptDidDownloadEvent, "- checking to see if a restarting scene index was specified in url...");
            var k;
            var p = parseInt(getUrlParameter("restartingSceneIndex"));
            var m = document.URL.split("?");
            var j = m[0].split("#");
            if (j[1]) {
                p = parseInt(j[1])
            }
            if (p) {
                debugMessageAlways(kDebugShowController_HandleScriptDidDownloadEvent, "- found a restarting scene index, using that... (" + p + ")");
                k = p
            } else {
                debugMessage(kDebugShowController_HandleScriptDidDownloadEvent, "- checking to see if a starting slide number was specified in url...");
                var o = getUrlParameter("currentSlide");
                var l;
                if (o) {
                    l = parseInt(o)
                } else {
                    debugMessage(kDebugShowController_HandleScriptDidDownloadEvent, "- nope, not there, use 1...");
                    l = 1
                }
                l = parseInt(slideCounter);
                k = this.scriptManager.sceneIndexFromSlideIndex(l);
                slideCounter = o;
                initialScene = this.scriptManager.sceneIndexFromSlideIndex(l);
                finalScene = this.scriptManager.sceneIndexFromSlideIndex(l + 1) - 1;
                if ((l + 1) >= this.scriptManager.script.navigatorEvents.length) {
                    finalScene = this.script.numScenes
                }
                if (finalScene < 0) {
                    finalScene = initialScene
                }
                manageBullets( - 1, finalScene - initialScene)
            }
            var i = this.script.eventTimelines[k];
            this.jumpToScene(k, (i.automaticPlay == 1));
            break;
        default:
            debugMessage(kDebugShowController_HandleScriptDidDownloadEvent, "- hmmm we seem to have arrived here from an unpredicted state");
            break
        }
    },
    handleScriptDidNotDownloadEvent: function(c) {
        debugMessage(kDebugShowController_HandleScriptDidNotDownloadEvent);
        var d = this.promptUserToTryAgain(kUnableToReachiWorkTryAgain);
        if (d) {
            this.scriptManager.downloadScript()
        } else {
            this.displayManager.clearLaunchMode();
            this.displayManager.hideWaitingIndicator();
            window.console.log("exitShow() commented out")
        }
    },
    startSoundTrack: function() {
        if (gMode == kModeMobile) {
            debugMessage(kDebugShowController_StartSoundTrack, "soundTrackMode are currently not supported on the phone...");
            return
        }
        if (this.script.soundTrackMode == kSoundTrackModeOff) {
            debugMessage(kDebugShowController_StartSoundTrack, "soundTrackMode is 'off', nothing to do here...");
            return
        }
        if (this.script.soundTrackMedia == null) {
            debugMessage(kDebugShowController_StartSoundTrack, "soundTrackMedia is null, nothing to do here...");
            return
        }
        debugMessage(kDebugShowController_StartSoundTrack, "soundTrackMedia is present, start it playing... (There are " + this.script.soundTrackMedia.length + " items)");
        this.currentSoundTrackIndex = 0;
        this.playNextItemInSoundTrack();
        this.updateNavigationButtons()
    },
    playNextItemInSoundTrack: function() {
        var f = this.script.soundTrackMedia[this.currentSoundTrackIndex];
        var d = this.textureManager.urlForMovie(f);
        debugMessage(kDebugShowController_PlayNextItemInSoundTrack, "time: " + Date().toString() + ", start item " + this.currentSoundTrackIndex + " playing...");
        this.soundTrackPlayer = new Audio();
        var e = this;
        this.soundTrackPlayer.muted = this.muted;
        this.soundTrackPlayer.style.display = "none";
        this.soundTrackPlayer.src = d;
        this.soundTrackPlayer.observe("ended",
        function(a) {
            e.soundTrackItemDidComplete()
        },
        false);
        this.soundTrackPlayer.load();
        this.soundTrackPlayer.play()
    },
    soundTrackItemDidComplete: function() {
        debugMessage(kDebugShowController_SoundTrackItemDidComplete, "time: " + Date().toString() + ", item " + this.currentSoundTrackIndex + " completed playing, lets see if there's anything else to play...");
        this.currentSoundTrackIndex++;
        if (this.currentSoundTrackIndex < this.script.soundTrackMedia.length) {
            debugMessage(kDebugShowController_SoundTrackItemDidComplete, "- why yes there is...");
            this.playNextItemInSoundTrack()
        } else {
            if (this.script.soundTrackMode == kSoundTrackModePlayOnce) {
                debugMessage(kDebugShowController_SoundTrackItemDidComplete, "- nope, that's it");
                this.soundTrackPlayer = null;
                this.updateNavigationButtons()
            } else {
                if (this.script.soundTrackMode == kSoundTrackModeLooping) {
                    debugMessage(kDebugShowController_SoundTrackItemDidComplete, "- nope, but we're in loop mode so take it from the top...");
                    this.startSoundTrack()
                }
            }
        }
    },
    promptUserToTryAgain: function(c) {
        var d = false;
        if (gMode == kModeMobile) {
            debugMessage(kDebugShowController_PromptUserToTryAgain, "we're in mobile mode, pop up a 'confirm' dialog...");
            d = confirm(c)
        } else {
            debugMessage(kDebugShowController_PromptUserToTryAgain, "we're in desktop mode, pop up a 'confirm' dialog...");
            d = confirm(c)
        }
        return d
    },
    jumpToSlide: function(e) {
        var d = e - 1;
        var f = this.scriptManager.sceneIndexFromSlideIndex(d);
        this.jumpToScene(f, false)
    },
    jumpToScene: function(g, h) {
        this.debugTimerJumpToScene = new DebugTimer(kDebugTimer_JumpToScene);
        debugMessage(kDebugShowController_JumpToScene, "sceneIndex: " + g + " playAnimations: " + (h ? "true": "false") + " state: " + this.state);
        switch (this.state) {
        case kShowControllerState_Starting:
        case kShowControllerState_IdleAtInitialState:
        case kShowControllerState_IdleAtFinalState:
        case kShowControllerState_ReadyToJump:
            break;
        default:
            debugMessageAlways(kDebugShowController_JumpToScene, "can't jump now, currently in '" + this.state + "' state which does not supports jumping...");
            return
        }
        if (this.textureManager.isScenePreloaded(g) == false) {
            debugMessageAlways(kDebugShowController_JumpToScene, "- scene " + g + " is not yet preloaded, issuing request to load it now and waiting...");
            var e = {
                sceneToLoad: g,
                playAnimationsAfterLoading: h
            };
            this.changeState(kShowControllerState_WaitingToJump);
            this.textureManager.unloadScene(g);
            this.textureManager.loadScene(g);
            this.setupWaitForSceneToLoadPoller(e);
            return
        }
        this.changeState(kShowControllerState_SettingUpScene);
        var f = this;
        runInNextEventLoop(function() {
            f.jumpToScene_partThree(g, h)
        })
    },
    jumpToScene_partTwo: function(f, d) {
        this.changeState(kShowControllerState_SettingUpScene);
        debugMessage(kDebugShowController_JumpToScene_partTwo, "- state changed (UI controls should disable), run partThree in next event loop...");
        var e = this;
        runInNextEventLoop(function() {
            e.jumpToScene_partThree(f, d)
        })
    },
    jumpToScene_partThree: function(h, f) {
        debugMessage(kDebugShowController_JumpToScene_partThree, "sceneIndex: " + h + " playAnimations: " + f);
        if (this.sceneIndexOfPrebuiltAnimations != h) {
            this.createAnimationsForScene(h)
        }
        debugStopTimer(this.debugTimerJumpToScene);
        var i = false;
        if (gOS == kOSWindows) {
            var j = this.scriptManager.getMoviesInScene(h);
            if (j && j.length > 0) {
                debugMessageAlways(kDebugShowController_DisplayScene, "we're on Windows, and this scene contains movies, we need to wait for the next event loop to avoid flicker...");
                i = true
            }
        }
        if (i) {
            var g = this;
            runInNextEventLoop(function() {
                g.jumpToScene_partFour(h, f)
            })
        } else {
            this.jumpToScene_partFour(h, f)
        }
    },
    jumpToScene_partFour: function(c, d) {
        this.displayScene(c, d ? 1: 0);
        if (d) {
            debugMessage(kDebugShowController_JumpToScene_partThree, "- playAnimations was set to 'true' so let 'er rip...");
            this.playCurrentScene()
        } else {
            this.changeState(kShowControllerState_IdleAtInitialState)
        }
    },
    calculateNextSceneIndex: function(c) {
        var d = this.calculateNextSceneIndex_internal(c);
        if (gMode == kModeMobile) {
            if (this.scriptManager.isOnlyActionInSceneAMovieStart(d)) {
                debugMessage(kDebugShowController_CalculateNextSceneIndex, "we're on a phone and the next build is only a movie start, go to one after that...");
                d = this.calculateNextSceneIndex_internal(d)
            }
        }
        return d
    },
    calculateNextSceneIndex_internal: function(c) {
        var d = -1;
        debugMessage(kDebugShowController_CalculateNextSceneIndex, "using sceneIndex: " + c);
        debugMessage(kDebugShowController_CalculateNextSceneIndex, "-          state: " + this.state);
        debugMessage(kDebugShowController_CalculateNextSceneIndex, "-      numSlides: " + this.script.slideCount);
        debugMessage(kDebugShowController_CalculateNextSceneIndex, "-      numScenes: " + this.script.numScenes);
        debugMessage(kDebugShowController_CalculateNextSceneIndex, "- lastSceneIndex: " + this.script.lastSceneIndex);
        if (c < this.script.lastSceneIndex) {
            d = c + 1;
            debugMessage(kDebugShowController_CalculateNextSceneIndex, "- we're NOT at the end, so set it to current + 1... (" + c + " + 1 = " + d + ")")
        } else {
            if (this.script.loopSlideshow) {
                d = 0;
                debugMessage(kDebugShowController_CalculateNextSceneIndex, "- we're at the end, and we're looping so set it to 0...")
            } else {
                d = -1;
                debugMessage(kDebugShowController_CalculateNextSceneIndex, "- we're at the end, and we're NOT looping so set it to -1...")
            }
        }
        debugMessage(kDebugShowController_CalculateNextSceneIndex, "---------- for sceneIndex: " + c + " nextSceneIndex is: " + d);
        return d
    },
    assignNextSceneIndex: function() {
        debugMessage(kDebugShowController_AssignNextSceneIndex);
        this.nextSceneIndex = this.calculateNextSceneIndex(this.currentSceneIndex)
    },
    playCurrentScene: function() {
        debugMessage(kDebugShowController_PlayCurrentScene, "this.currentSceneIndex: " + this.currentSceneIndex + " this.overallEndTime: " + this.overallEndTime);
        debugMessage(kDebugShowController_PlayCurrentScene, "- check for special case of zero delay automatic play on the first scene...");
        var d = false;
        var f = 1500;
        if (this.currentSceneIndex == 0) {
            debugMessage(kDebugShowController_PlayCurrentScene, "- it's the first scene...");
            if (this.script.eventTimelines[this.currentSceneIndex].automaticPlay == 1) {
                debugMessage(kDebugShowController_PlayCurrentScene, "- and it's  automatic play...");
                if (this.earliestBeginTime == 0) {
                    debugMessage(kDebugShowController_PlayCurrentScene, "- and it's has no delay...");
                    d = true
                } else {
                    debugMessage(kDebugShowController_PlayCurrentScene, "- nevermind, it's has a delay...")
                }
            } else {
                debugMessage(kDebugShowController_PlayCurrentScene, "- nevermind, it's not automatic play...")
            }
        } else {
            debugMessage(kDebugShowController_PlayCurrentScene, "- nevermind, it's not the first scene...")
        }
        this.clearExistingAnimations();
        var e = this;
        if (d) {
            debugMessage(kDebugShowController_PlayCurrentScene, "- introduce 1.5s delay so the first scene will be visible for a split second...");
            setTimeout(function() {
                e.playCurrentScene_partTwo()
            },
            f)
        } else {
            this.playCurrentScene_partTwo()
        }
    },
    playCurrentScene_partTwo: function() {
        debugMessage(kDebugShowController_PlayCurrentScene, " partTwo: this.currentSceneIndex: " + this.currentSceneIndex + " this.overallEndTime: " + this.overallEndTime);
        this.changeState(kShowControllerState_Playing);
        var h = this.applyAnimationsForScene();
        var e = this.scriptManager.getMoviesInScene(this.currentSceneIndex + 1);
        var g = false;
        if (e && e.length > 0) {
            debugMessage(kDebugShowController_PlayCurrentScene, "- next scene (" + (this.currentScene + 1) + " has some movies, so set anyMoviesInNextScene to true");
            g = true
        }
        var f = this;
        setTimeout(function() {
            f.currentSceneDidComplete(h, g)
        },
        this.overallEndTime * 1000 + 100);
        debugStopTimer(this.debugTimerAdvanceToBuild)
    },
    createHyperlinksForCurrentState: function(d) {
        debugMessage(kDebugShowController_CreateHyperlinksForCurrentState);
        debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "-           context:" + d);
        debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "-             state:" + this.state);
        debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "- currentSceneIndex:" + this.currentSceneIndex);
        debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "-    lastSceneIndex:" + this.script.lastSceneIndex);
        debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "-   hyperlinks only:" + ((this.script.showMode == kShowModeHyperlinksOnly) ? "YES": "NO"));
        debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "-           looping:" + (this.script.loopSlideshow ? "YES": "NO"));
        var c = -1;
        switch (this.state) {
        case kShowControllerState_IdleAtInitialState:
            debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "- we're at initial state, always use current scene index");
            c = this.currentSceneIndex;
            break;
        case kShowControllerState_IdleAtFinalState:
            debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "- we're at final state, check if we're at the end");
            if (this.currentSceneIndex < this.script.lastSceneIndex) {
                debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "- we're not at the end, use next scene");
                c = this.currentSceneIndex + 1
            } else {
                debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "- we're ARE at the end, check if we're in hyperlinks-only mode...");
                if (this.script.showMode == kShowModeHyperlinksOnly) {
                    debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "- we're ARE in hyperlinks-only mode, use current scene");
                    c = this.currentSceneIndex
                } else {
                    debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "- we're are NOT in hyperlinks-only mode, check if we're in looping mode...");
                    if (this.script.loopSlideshow) {
                        debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "- we're ARE in looping mode, use next scene");
                        c = this.currentSceneIndex + 1
                    } else {
                        debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "- we're are NOT in looping mode, use next scene");
                        c = this.currentSceneIndex + 1
                    }
                }
            }
            break;
        default:
            debugMessage(kDebugShowController_CreateHyperlinksForCurrentState, "- we're at not in an idle state, what to do? what to do?");
            break
        }
        if (c != -1) {
            this.clearAllHyperlinks();
            this.createHyperlinks(c)
        }
    },
    currentSceneDidComplete: function(i, h) {
        debugMessage(kDebugShowController_CurrentSceneDidComplete, "this.currentSceneIndex: " + this.currentSceneIndex);
        this.changeState(kShowControllerState_IdleAtFinalState);
        manageBullets(this.currentSceneIndex - initialScene, finalScene - initialScene);
        if (this.nextSceneIndex == -1) {
            debugMessage(kDebugShowController_CurrentSceneDidComplete, "- next scene is -1, nothing to do except update navigation button status");
            this.updateNavigationButtons()
        } else {
            if (this.scriptManager.isOnlyActionInSceneAMovieStart(this.currentSceneIndex) && gMode == kModeMobile) {
                debugMessage(kDebugShowController_CurrentSceneDidComplete, "- current scene is only a movie start and we're on a mobile device, proceed to next scene immediately...");
                this.advanceToNextBuild("currentSceneDidComplete")
            } else {
                if ((this.script.eventTimelines[this.nextSceneIndex].automaticPlay == 1) && (this.currentSceneIndex < this.nextSceneIndex)) {
                    debugMessage(kDebugShowController_CurrentSceneDidComplete, "- next scene (" + this.nextSceneIndex + ") is autoplay");
                    if (this.isSceneTransitionDelayOnly(this.nextSceneIndex)) {
                        var j = this.script.eventTimelines[this.nextSceneIndex].eventAnimations[0].duration;
                        debugMessage(kDebugShowController_CurrentSceneDidComplete, "- but it's only a 'transition-delay', so invoke the scene AFTER it after a delay of " + j + " seconds...");
                        var g = this;
                        setTimeout(function() {
                            g.jumpToScene(g.nextSceneIndex + 1, true)
                        },
                        j * 1000)
                    } else {
                        debugMessage(kDebugShowController_CurrentSceneDidComplete, "- invoking advanceToNextBuild() on next event loop...");
                        var g = this;
                        runInNextEventLoop(function() {
                            g.advanceToNextBuild("currentSceneDidComplete")
                        })
                    }
                } else {
                    if ((gMode == kModeMobile) && (i == false) && (h == true)) {
                        var f = this.currentSceneIndex + 1;
                        debugMessage(kDebugShowController_CurrentSceneDidComplete, "- next scene (" + f + ") has a movie, since we're in mobile mode, advance to it...");
                        var g = this;
                        runInNextEventLoop(function() {
                            g.jumpToScene(f, false)
                        })
                    } else {
                        debugMessage(kDebugShowController_CurrentSceneDidComplete, "- we just finished animating, should be waiting on end state, prebuild animations for next scene and update navigation button status and add hyperlinks of next scene...");
                        this.createAnimationsForScene(this.nextSceneIndex);
                        this.updateNavigationButtons()
                    }
                }
            }
        }
    },
    ensureInitialStateHasEmphasisTransform: function(j, k, n, l, m) {
        var h = false;
        var i = this.initialStateForTexture(j, k);
        switch (n) {
        case "translationEmphasis":
            h = (i.translationEmphasis != null);
            break;
        case "rotationEmphasis":
            h = (i.rotationEmphasis != null);
            break;
        case "opacityMultiplier":
            h = (i.opacityMultiplier != null);
            break;
        case "scaleEmphasis":
            h = (i.scaleEmphasis != null);
            break
        }
        if (h) {
            return
        }
        debugMessage(kDebugShowController_EnsureInitialStateHasEmphasisTransform, "textureId: '" + k + "' has no initial emphasis transform");
        switch (n) {
        case "translationEmphasis":
            debugMessage(kDebugShowController_EnsureInitialStateHasEmphasisTransform, "- using fromValue.translationEmphasis: (" + m.translationEmphasis + ")");
            i.translationEmphasis = m.translationEmphasis;
            debugMessage(kDebugShowController_EnsureInitialStateHasEmphasisTransform, "- translationEmphasis is now: " + i.translationEmphasis);
            break;
        case "rotationEmphasis":
            debugMessage(kDebugShowController_EnsureInitialStateHasEmphasisTransform, "- using fromValue.rotationEmphasis: (" + m.rotationEmphasis + ")");
            i.rotationEmphasis = m.rotationEmphasis;
            debugMessage(kDebugShowController_EnsureInitialStateHasEmphasisTransform, "- rotationEmphasis is now: " + i.rotationEmphasis);
            break;
        case "opacityMultiplier":
            debugMessage(kDebugShowController_EnsureInitialStateHasEmphasisTransform, "- using fromValue.opacityMultiplier: (" + m.opacityMultiplier + ")");
            i.opacityMultiplier = m.opacityMultiplier;
            debugMessage(kDebugShowController_EnsureInitialStateHasEmphasisTransform, "- opacityMultiplier is now: " + i.opacityMultiplier);
            break;
        case "scaleEmphasis":
            debugMessage(kDebugShowController_EnsureInitialStateHasEmphasisTransform, "- using fromValue.scaleEmphasis: (" + m.scaleEmphasis + ")");
            i.scaleEmphasis = m.scaleEmphasis;
            debugMessage(kDebugShowController_EnsureInitialStateHasEmphasisTransform, "- scaleEmphasis is now: " + i.scaleEmphasis);
            break
        }
    },
    preProcessSceneAnimations: function(ae, Z, ao) {
        var Y = this.scriptManager.slideIndexFromSceneIndex(ae);
        var aB = new DebugTimer(kDebugTimer_PreProcessSceneAnimations);
        debugMessage(kDebugShowController_PreProcessSceneAnimations);
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "------------------------------------------------------");
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "- First, calculate overall duration of eventTimeline -");
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "------------------------------------------------------");
        var aG = 0;
        var aq = Z.length;
        this.overallEndTime = 0;
        this.earliestBeginTime = 0;
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "- numEventAnimations: " + aq);
        for (aG = 0; aG < aq; aG++) {
            var aA = Z[aG];
            var ah = aA.beginTime;
            var an = aA.duration;
            var aw = ah + an;
            debugMessage(kDebugShowController_PreProcessSceneAnimations, "- iEventAnimation: " + aG + ": beginTime: " + ah + ": duration: " + an + " endTime: " + aw);
            if (aw > this.overallEndTime) {
                this.overallEndTime = aw;
                debugMessage(kDebugShowController_PreProcessSceneAnimations, "-   that's a new maximum, overallEndTime now " + this.overallEndTime)
            }
        }
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "this.overallEndTime: " + this.overallEndTime);
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "------------------------------------------------------------------------------");
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "- Second, build x-ref table between canvasObjectID and applicable textureIds -");
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "------------------------------------------------------------------------------");
        var aI = {};
        var at = {};
        this.movieCanvasObjectIdToTextureIdTable = {};
        var ai;
        var V = ao.length;
        for (ai = 0; ai < V; ai++) {
            var X = ao[ai];
            var az = X.canvasObjectID;
            var ag = X.texture;
            var aM = ag;
            if (this.isMovie(ag)) {
                ag = "movieCanvasObject." + Y + "." + az;
                this.movieCanvasObjectIdToTextureIdTable[ag] = aM
            }
            debugMessage(kDebugShowController_PreProcessSceneAnimations, "- textureId: " + ag);
            if (az != null) {
                debugMessage(kDebugShowController_PreProcessSceneAnimations, "---- has a canvasObjectID: " + az);
                at[aM] = az;
                var aj = aI[az];
                if (aj == null) {
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "------ this is the first texture with this canvasObjectID, creating entry in table...");
                    aj = new Array();
                    aI[az] = aj
                } else {
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "------ there are already textures with this canvasObjectID...")
                }
                debugMessage(kDebugShowController_PreProcessSceneAnimations, "------ appending textureId to array for  this canvasObjectID...");
                aj.push(ag)
            }
        }
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "- dumping canvasObjectToTextureLookupTable...");
        for (var az in aI) {
            debugMessage(kDebugShowController_PreProcessSceneAnimations, "- canvasObjectID: " + az);
            var aj = aI[az];
            var am;
            var ap = aj.length;
            for (am = 0; am < ap; am++) {
                var ag = aj[am];
                debugMessage(kDebugShowController_PreProcessSceneAnimations, "--- textureId: " + ag)
            }
        }
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "- dumping textureIdToCanvasObjectIdLookupTable...");
        for (var ag in at) {
            debugMessage(kDebugShowController_PreProcessSceneAnimations, "- textureId: " + ag + " => canvasObjectID: " + at[ag])
        }
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "- dumping movieCanvasObjectIdToTextureIdTable...");
        for (var aa in this.movieCanvasObjectIdToTextureIdTable) {
            debugMessage(kDebugShowController_PreProcessSceneAnimations, "- movieCanvasObjectId: " + aa + " => textureId: " + this.movieCanvasObjectIdToTextureIdTable[aa])
        }
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "------------------------------------------------------------------------------");
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "- Third, calculate individual delay and duration of each property animation  -");
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "------------------------------------------------------------------------------");
        this.textureAnimations = {};
        for (aG = 0; aG < aq; aG++) {
            debugMessage(kDebugShowController_PreProcessSceneAnimations, "- iEventAnimation: " + aG);
            var aA = Z[aG];
            if (aA.preprocessed == null || aA.preprocessed == false) {
                aA.preprocessed = true;
                if ((aA.textures != null) && this.isMovie(aA.textures[0]) && (aA.animationType == "buildIn" || aA.animationType == "buildOut")) {
                    if (aA.effect != "apple:movie-start") {
                        var aa = "movieCanvasObject-" + Y + "-" + at[aA.textures[0]];
                        if (this.scriptManager.isMovieInScene(ae, aa, this.textureManager)) {
                            aA.actions = new Array();
                            aA.actions[0] = new Object();
                            var ak = aA.actions[0];
                            ak.action = "hidden";
                            ak.beginTime = aA.beginTime;
                            ak.duration = aA.duration;
                            ak.texture = aA.textures[0];
                            ak.timingFunction = "linear";
                            ak.from = new Object();
                            ak.to = new Object();
                            if (aA.animationType == "buildIn") {
                                ak.from.scalar = 1;
                                ak.to.scalar = 0
                            } else {
                                ak.from.scalar = 0;
                                ak.to.scalar = 1
                            }
                        }
                    }
                }
            }
            var ad = aA.actions;
            if (ad == null) {
                ad = aA.noPluginActions
            }
            var af = false;
            var au = null;
            if ((aA.animationType != null) && (aA.animationType == "actionBuild")) {
                af = true;
                debugMessage(kDebugShowController_PreProcessSceneAnimations, "--- this one is an actionBuild...");
                var U = aA.canvasObjectID;
                au = aI[U];
                if (typeof(au) == "undefined") {
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "- textureArray is undefined, using empty array");
                    au = new Array()
                }
            }
            var W = ad.length;
            var ab;
            for (ab = 0; ab < W; ab++) {
                var aO = ad[ab];
                if (af == false) {
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "--- this one is NOT an actionBuild, create an array with 1 texture in it...");
                    var ag = aO.texture;
                    au = new Array();
                    au[0] = ag
                }
                var am;
                var ap = au.length;
                for (am = 0; am < ap; am++) {
                    var ag = au[am];
                    var aM = ag;
                    if (this.isMovie(ag)) {
                        var az = at[ag];
                        var aJ = "movieCanvasObject." + Y + "." + az;
                        debugMessage(kDebugShowController_PreProcessSceneAnimations, "- it's a movie, hack its id (" + ag + ") to use the canvasObjectID (" + az + ") to yeild: " + aJ);
                        ag = aJ
                    }
                    var ah = aO.beginTime;
                    var an = aO.duration;
                    var aw = ah + an;
                    var ar = aO.action;
                    if (ar == "transform.translation.z") {
                        if (aA.effect != "apple:revolve") {
                            ar = "z.order"
                        }
                    }
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "-   texure: " + ag);
                    var aC = this.textureAnimations[ag];
                    if (aC == null) {
                        debugMessage(kDebugShowController_PreProcessSceneAnimations, "-     - was not in textureAnimations yet, adding now...");
                        var aN = this.isMovie(ag);
                        debugMessage(aN ? kDebugShowController_PreProcessSceneAnimations: kDebugSurpressMessage, "-     - it's a movie, tag it in the 'textureAnimation' data structure...");
                        aC = {
                            numAnimatedKeys: 0,
                            numRequiredDivs: 0,
                            isMovie: aN,
                            originalTextureId: aM,
                            keyAnimations: {}
                        };
                        this.textureAnimations[ag] = aC
                    }
                    if (ar == "rotationEmphasis") {
                        var aF = {
                            x: aO.from.rotationEmphasis[0],
                            y: aO.from.rotationEmphasis[1],
                        };
                        aC.anchorPoint = aF;
                        debugMessage(kDebugShowController, "preProcessSceneAnimations", "- squirreled away anchor point of " + aF.x + "," + aF.y + " for texture " + ag)
                    }
                    var aD = aC.keyAnimations[ar];
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "-     keyName: " + ar);
                    if (aD == null) {
                        debugMessage(kDebugShowController_PreProcessSceneAnimations, "-       - was not in textureAnimation.keyAnimations yet, adding now...");
                        aD = {
                            earliestBeginTime: ah,
                            latestEndTime: -1,
                            keyActions: []
                        };
                        aC.keyAnimations[ar] = aD;
                        aC.numAnimatedKeys++;
                        if ((ar != "isPlaying") && (ar != "opacityMultiplier") && (ar != "zOrderHint") && (ar != "hidden")) {
                            aC.numRequiredDivs++;
                            debugMessage(kDebugShowController_PreProcessSceneAnimations, "-       - '" + ar + "' requires a div, increment count...")
                        } else {
                            debugMessage(kDebugShowController_PreProcessSceneAnimations, "-       - '" + ar + "' does NOT requires a div, don't increment count...")
                        }
                    }
                    if (aw > aD.latestEndTime) {
                        debugMessage(kDebugShowController_PreProcessSceneAnimations, "-       endTime of " + aw + " is a new latest, updating...");
                        aD.latestEndTime = aw
                    }
                }
            }
        }
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "-----------------------------------------------------------------------------------------------------------------------");
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "- Fourth, iterate over all actions in all eventAnimations, converting there begin/duration to % of individual duration -");
        debugMessage(kDebugShowController_PreProcessSceneAnimations, "-----------------------------------------------------------------------------------------------------------------------");
        for (aG = 0; aG < aq; aG++) {
            debugMessage(kDebugShowController_PreProcessSceneAnimations, "- iEventAnimation: " + aG);
            var aA = Z[aG];
            var ad = aA.actions;
            if (ad == null) {
                ad = aA.noPluginActions
            }
            var af = false;
            var au = null;
            if ((aA.animationType != null) && (aA.animationType == "actionBuild")) {
                af = true;
                debugMessage(kDebugShowController_PreProcessSceneAnimations, "--- this one is an actionBuild...");
                var U = aA.canvasObjectID;
                au = aI[U];
                if (typeof(au) == "undefined") {
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "- textureArray is undefined, using empty array");
                    au = new Array()
                }
            }
            var W = ad.length;
            var ab;
            for (ab = 0; ab < W; ab++) {
                var aO = ad[ab];
                var ah = aO.beginTime;
                var an = aO.duration;
                var aw = ah + an;
                var ar = aO.action;
                debugMessage(kDebugShowController_PreProcessSceneAnimations, "--- iAction: " + ab + ", keyName: " + ar);
                if (af == false) {
                    var ag = aO.texture;
                    if (this.isMovie(ag)) {
                        ag = "movieCanvasObject." + Y + "." + at[ag]
                    }
                    au = new Array();
                    au[0] = ag
                }
                var am;
                var ap = au.length;
                for (am = 0; am < ap; am++) {
                    var ag = au[am];
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "------ iTexture: " + am + ", textureId: " + ag);
                    if (ar == "transform.translation.z") {
                        if (aA.effect != "apple:revolve") {
                            ar = "z.order"
                        }
                    }
                    if ((ar == "translationEmphasis") || (ar == "rotationEmphasis") || (ar == "opacityMultiplier") || (ar == "scaleEmphasis")) {
                        this.ensureInitialStateHasEmphasisTransform(ae, ag, ar, ao, aO.from)
                    }
                    var aC = this.textureAnimations[ag];
                    if (aC == null) {
                        continue
                    }
                    var aD = aC.keyAnimations[ar];
                    if (aD == null) {
                        continue
                    }
                    var av = aD.keyActions;
                    var aK = aD.latestEndTime - aD.earliestBeginTime;
                    var aH = 0;
                    var aL = 100;
                    if (aK > 0) {
                        aH = 100 * ah / this.overallEndTime;
                        aL = 100 * aw / this.overallEndTime
                    }
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "-   Action: " + ab);
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "-     textureId: " + ag);
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "-       keyName: " + ar);
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "-    overallEndTime: " + this.overallEndTime);
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "-         beginTime: " + ah + " startKeyframe: " + aH);
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "-           endTime: " + aw + " endKeyframe: " + aL);
                    var ak = {
                        startKeyframe: aH,
                        endKeyframe: aL,
                        from: aO.from,
                        to: aO.to,
                        timingFunction: aO.timingFunction
                    };
                    if (af && aC.isMovie) {
                        debugMessageAlways(kDebugShowController_PreProcessSceneAnimations, "- this is an action build on a movie, we don't do those, set the to/from values to 0...");
                        debugMessageAlways(kDebugShowController_PreProcessSceneAnimations, "- was:  newAction.from: " + ak.from.translationEmphasis[0] + "," + ak.from.translationEmphasis[1] + "," + ak.from.translationEmphasis[2] + " to: " + ak.to.translationEmphasis[0] + "," + ak.from.translationEmphasis[1] + "," + ak.from.translationEmphasis[2]);
                        ak.to = kNullActionEmphasis;
                        ak.from = kNullActionEmphasis;
                        debugMessageAlways(kDebugShowController_PreProcessSceneAnimations, "- noew:  newAction.from: " + ak.from.translationEmphasis[0] + "," + ak.from.translationEmphasis[1] + "," + ak.from.translationEmphasis[2] + " to: " + ak.to.translationEmphasis[0] + "," + ak.from.translationEmphasis[1] + "," + ak.from.translationEmphasis[2])
                    }
                    if (aO.action == "opacityMultiplier") {
                        debugMessage(kDebugShowController_PreProcessSceneAnimations, "- this is an opacityMultiplier, convert to absolute opacity by multiplying it against initial state's opacity...");
                        if (am == 0) {
                            var ac = this.initialStateForTexture(ae, ag);
                            var ax = ac.opacity;
                            var aE = aO.from.scalar * ax;
                            var al = aO.to.scalar * ax;
                            debugMessage(kDebugShowController_PreProcessSceneAnimations, "-      initialOpacity: " + ax);
                            debugMessage(kDebugShowController_PreProcessSceneAnimations, "-                from: " + aO.from.scalar);
                            debugMessage(kDebugShowController_PreProcessSceneAnimations, "-                  to: " + aO.to.scalar);
                            debugMessage(kDebugShowController_PreProcessSceneAnimations, "- absoluteFromOpacity: " + aE);
                            debugMessage(kDebugShowController_PreProcessSceneAnimations, "-   absoluteToOpacity: " + al);
                            ak.from.scalar = aE;
                            ak.to.scalar = al
                        } else {
                            debugMessage(kDebugShowController_PreProcessSceneAnimations, "- but this is not the first texture in this array, so we've already done the multiplying, skip it...")
                        }
                    }
                    var ay = aO.timingFunction;
                    if (aO.timingFunction == "custom") {
                        ak.timingControlPoint1x = aO.timingControlPoint1x;
                        ak.timingControlPoint1y = aO.timingControlPoint1y;
                        ak.timingControlPoint2x = aO.timingControlPoint2x;
                        ak.timingControlPoint2y = aO.timingControlPoint2y;
                        ay = "cubic-bezier(" + ak.timingControlPoint1x + "," + ak.timingControlPoint1y + "," + ak.timingControlPoint2x + "," + ak.timingControlPoint2y + ")"
                    }
                    debugMessage(kDebugShowController_PreProcessSceneAnimations, "-      timingFunction: " + ay);
                    av.push(ak)
                }
            }
        }
        debugStopTimer(aB)
    },
    debugDumpPreProcessedEventAnimations: function() {
        debugMessage(kDebugShowController_DumpPreProcessedEventAnimations);
        debugMessage(kDebugShowController_DumpPreProcessedEventAnimations, "-------------------------------------------------------------------");
        debugMessage(kDebugShowController_DumpPreProcessedEventAnimations, "- D U M P   O F   P R E P R O C E S S S E D   A N I M A T I O N S -");
        debugMessage(kDebugShowController_DumpPreProcessedEventAnimations, "-------------------------------------------------------------------");
        for (var k in this.textureAnimations) {
            var l = this.textureAnimations[k];
            debugMessage(kDebugShowController_DumpPreProcessedEventAnimations, "- texture: " + k + " (" + l.numAnimatedKeys + " animated key(s), Required Divs: " + l.numRequiredDivs + ")");
            var p = 0;
            for (var n in l.keyAnimations) {
                var i = l.keyAnimations[n];
                var j = i.keyActions;
                debugMessage(kDebugShowController_DumpPreProcessedEventAnimations, "-   key " + p + ": " + n + " (from t=" + i.earliestBeginTime + " to t=" + i.latestEndTime + " - " + j.length + " actions)");
                for (var o = 0; o < j.length; o++) {
                    var m = j[o];
                    debugMessage(kDebugShowController_DumpPreProcessedEventAnimations, "-     action: " + o);
                    if (m.timingFunction == "custom") {
                        debugMessage(kDebugShowController_DumpPreProcessedEventAnimations, "-          curve: cubic-bezier(" + m.timingControlPoint1x + "," + m.timingControlPoint1y + "," + m.timingControlPoint2x + "," + m.timingControlPoint2y + ")")
                    } else {
                        debugMessage(kDebugShowController_DumpPreProcessedEventAnimations, "-          curve: " + m.timingFunction)
                    }
                    debugMessage(kDebugShowController_DumpPreProcessedEventAnimations, "-          start: " + m.startKeyframe + "% = " + this.cssPropertyValueForActionValue(n, m.from));
                    debugMessage(kDebugShowController_DumpPreProcessedEventAnimations, "-            end: " + m.endKeyframe + "% = " + this.cssPropertyValueForActionValue(n, m.to))
                }
                p++
            }
        }
    },
    cssPropertyNameForAction: function(b) {
        switch (b) {
        case "hidden":
            return kVisibilityPropertyName;
        case "anchorPoint":
            return kTransformOriginPropertyName;
        case "opacityMultiplier":
            return kOpacityPropertyName;
        case "translationEmphasis":
        case "rotationEmphasis":
        case "scaleEmphasis":
        case "position":
        case "transform":
        case "transform.scale":
        case "transform.scale.x":
        case "transform.scale.y":
        case "transform.rotation.x":
        case "transform.rotation.y":
        case "transform.rotation.z":
        case "transform.translation.x":
        case "transform.translation.y":
        case "transform.translation.z":
            return kTransformPropertyName;
        case "zOrderHint":
            return kZIndexPropertyName;
        default:
            return b
        }
    },
    cssPropertyValueForActionValue: function(d, c) {
        switch (d) {
        case "hidden":
            if (c.scalar == true) {
                return "hidden"
            } else {
                return "visible"
            }
        case "anchorPoint":
            return c.pointX + "% " + c.pointY + "%";
        case "position":
            return "translate(" + c.pointX + "px," + c.pointY + "px)";
        case "translationEmphasis":
            return "translateX(" + c.translationEmphasis[0] + "px) translateY(" + c.translationEmphasis[1] + "px) translateZ(" + c.translationEmphasis[2] + ")";
        case "rotationEmphasis":
            return "rotateZ(" + c.rotationEmphasis[6] + "rad)";
        case "scaleEmphasis":
            return "scale3d(" + ensureScaleFactorNotZero(c.scaleEmphasis[3]) + "," + ensureScaleFactorNotZero(c.scaleEmphasis[4]) + "," + ensureScaleFactorNotZero(c.scaleEmphasis[5]) + ")";
        case "transform.scale":
            return "scale(" + ensureScaleFactorNotZero(c.scalar) + ")";
        case "transform.scale.x":
            return "scaleX(" + ensureScaleFactorNotZero(c.scalar) + ")";
        case "transform.scale.y":
            return "scaleY(" + ensureScaleFactorNotZero(c.scalar) + ")";
        case "transform.rotation.x":
            return "rotateX(" + c.scalar + "rad)";
        case "transform.rotation.y":
            return "rotateY(" + c.scalar + "rad)";
        case "transform.rotation.z":
            return "rotateZ(" + c.scalar + "rad)";
        case "transform.translation.x":
            return "translateX(" + c.scalar + "px)";
        case "transform.translation.y":
            return "translateY(" + c.scalar + "px)";
        case "transform.translation.z":
            return "translateZ(" + c.scalar + "px)";
        case "zOrderHint":
        case "isPlaying":
        case "zPosition":
        case "opacity":
        case "opacityMultiplier":
            return c.scalar + "";
        case "transform":
            return "matrix3d(" + c.transform + ")";
        default:
            return "some value"
        }
    },
    createTimingFunctionForAction: function(c) {
        debugMessage(kDebugShowController_CreateTimingFunctionForAction, "action.timingFunction: " + c.timingFunction);
        var d = "";
        switch (c.timingFunction) {
        case "easeIn":
            d = "ease-in";
            break;
        case "easeOut":
            d = "ease-out";
            break;
        case "easeInOut":
        case "easeInEaseOut":
            d = "ease-in-out";
            break;
        case "custom":
            d = "cubic-bezier(" + c.timingControlPoint1x + "," + c.timingControlPoint1y + "," + c.timingControlPoint2x + "," + c.timingControlPoint2y + ")";
            break;
        case "linear":
            d = "linear";
            break;
        default:
            d = "linear";
            break
        }
        debugMessage(kDebugShowController_CreateTimingFunctionForAction, "- returning: " + d);
        return d
    },
    initialStateForTexture: function(l, t) {
        var m = null;
        if (t.match(/^movieCanvasObject/)) {
            var r = t.split(/\./);
            m = r[2]
        }
        debugMessage(kDebugShowController_InitialStateForTexture, "looking for initial state of texture '" + t + "' in scene " + l);
        var n = this.script.eventTimelines[l];
        var q = n.eventInitialStates;
        var s = q.length;
        var o;
        debugMessage(kDebugShowController_InitialStateForTexture, "- there are " + s + " textures in this scene");
        for (o = 0; o < s; o++) {
            var k = q[o];
            var p = k.texture;
            debugMessage(kDebugShowController_InitialStateForTexture, "- looking at: " + p);
            if (p == t) {
                debugMessage(kDebugShowController_InitialStateForTexture, "- found it!");
                return k
            }
            if (k.canvasObjectID != null && k.canvasObjectID == m) {
                debugMessage(kDebugShowController_InitialStateForTexture, "- found the matching canvasObjectId!");
                return k
            }
        }
        debugMessage(kDebugShowController_InitialStateForTexture, "- not found!");
        return null
    },
    createInitialKeyframeValue: function(i, j, g, k) {
        debugMessage(kDebugShowController_CreateInitialKeyframeValue, "sceneIndex: " + i + " textureId: " + j + " keyName: " + g);
        var l = {};
        var h = this.initialStateForTexture(i, j);
        switch (g) {
        case "opacity":
        case "opacityMultiplier":
            l.scalar = h.opacity;
            break;
        case "hidden":
            l.scalar = h.hidden;
            break;
        case "position":
            l.pointX = k.pointX;
            l.pointY = k.pointY;
            break;
        case "translationEmphasis":
            l.translationEmphasis = h.translationEmphasis;
            debugMessage(kDebugShowController_CreateInitialKeyframeValue, "- got a translationEmphasis, hope this works! actionValue.translationEmphasis: " + l.translationEmphasis);
            break;
        case "rotationEmphasis":
            l.rotationEmphasis = h.rotationEmphasis;
            debugMessage(kDebugShowController_CreateInitialKeyframeValue, "- got a rotationEmphasis, hope this works! actionValue.rotationEmphasis: " + l.rotationEmphasis);
            break;
        case "scaleEmphasis":
            l.scaleEmphasis = h.scaleEmphasis;
            debugMessage(kDebugShowController_CreateInitialKeyframeValue, "- got a scaleEmphasis, hope this works! actionValue.scaleEmphasis: " + l.scaleEmphasis);
            break;
        case "transform.scale":
        case "transform.scale.x":
        case "transform.scale.y":
            l.scalar = h.affineTransform[0];
            debugMessage(kDebugShowController_CreateInitialKeyframeValue, "- got a transform.scale, hope this works! actionValue.scalar: " + l.scalar);
            break;
        case "transform":
            l.transform = k.transform;
            break;
        default:
            l.scalar = 0;
            l.pointX = 0;
            l.pointY = 0;
            break
        }
        return l
    },
    anchorPointOffset: function(i, k) {
        debugMessage(kDebugShowController_AnchorPointOffset);
        debugMessage(kDebugShowController_AnchorPointOffset, "-      textureId: " + i);
        debugMessage(kDebugShowController_AnchorPointOffset, "- newAnchorPoint: " + k.x + ", " + k.y);
        var h = {};
        var g = {};
        var j = {};
        var l = this.script.textures[i];
        h.x = l.width / 2;
        h.y = l.height / 2;
        g.x = k.x * l.width;
        g.y = k.y * l.height;
        debugMessage(kDebugShowController_AnchorPointOffset, "-      newOrigin: " + g.x + ", " + g.y);
        debugMessage(kDebugShowController_AnchorPointOffset, "-  currentOrigin: " + h.x + ", " + h.y);
        j.x = (h.x - g.x);
        j.y = (h.y - g.y);
        debugMessage(kDebugShowController_AnchorPointOffset, "-         offset: " + j.x + ", " + j.y);
        return j
    },
    createAnimationRuleForKeyframe: function(r, l, m, n, k) {
        var q;
        if (m == "hidden") {
            var t = {
                scalar: -1
            };
            if (n.scalar == 0) {
                t.scalar = 1
            } else {
                t.scalar = 0
            }
            m = "opacity";
            q = this.cssPropertyValueForActionValue(m, t)
        } else {
            q = this.cssPropertyValueForActionValue(m, n)
        }
        var s = this.cssPropertyNameForAction(m) + ": " + q + "; " + (l < 100 ? "-webkit-animation-timing-function: " + k + ";": "");
        var p = "";
        if (this.transformOriginValue != "") {
            p = kTransformOriginPropertyName + ": " + this.transformOriginValue + ";"
        } else {
            if (this.emphasisTransformOrigin != "") {
                p = kTransformOriginPropertyName + ": " + this.emphasisTransformOrigin + ";";
                debugMessage(kDebugShowController_CreateAnimationsForScene, "emphasisTransformOrigin: " + this.emphasisTransformOrigin)
            }
        }
        var o = l + "% {" + p + s + "}";
        r.appendRule(o);
        if (p == "") {
            debugMessage(kDebugShowController_CreateAnimationsForScene, "-   " + o)
        } else {
            debugMessage(kDebugShowController_CreateAnimationsForScene, "-   " + l + "%");
            debugMessage(kDebugShowController_CreateAnimationsForScene, "-   {");
            debugMessage(kDebugShowController_CreateAnimationsForScene, "-      " + p);
            debugMessage(kDebugShowController_CreateAnimationsForScene, "-      " + s);
            debugMessage(kDebugShowController_CreateAnimationsForScene, "-   }")
        }
        return q
    },
    createAnimationsForScene: function(G) {
        debugMessage(kDebugShowController_CreateAnimationsForScene);
        debugMessage(kDebugShowController_CreateAnimationsForScene, "---------------------------------------------------");
        debugMessage(kDebugShowController_CreateAnimationsForScene, "- c r e a t e A n i m a t i o n s F o r S c e n e -");
        debugMessage(kDebugShowController_CreateAnimationsForScene, "---------------------------------------------------");
        debugMessage(kDebugShowController_CreateAnimationsForScene, "- sceneIndex: " + G);
        var Q = this.script.eventTimelines[G];
        var D = Q.eventInitialStates;
        var x = Q.eventAnimations;
        if (!Q.automaticPlay) {
            this.animationManager.deleteAllAnimations()
        } else {
            if (this.animationManager.animationsCreated(G)) {
                this.sceneIndexOfPrebuiltAnimations = G;
                this.preProcessSceneAnimations(G, x, D);
                return
            }
        }
        if ((G + 1) < this.script.eventTimelines.length) {
            if (this.script.eventTimelines[G + 1].automaticPlay) {
                this.createAnimationsForScene(G + 1)
            }
        }
        this.animationManager.markAnimationsCreated(G);
        this.preProcessSceneAnimations(G, x, D);
        this.debugDumpPreProcessedEventAnimations();
        var E = new DebugTimer(kDebugTimer_CreateAnimationsForScene);
        var N = 0.001;
        for (var w in this.textureAnimations) {
            var y = this.textureAnimations[w];
            debugMessage(kDebugShowController_CreateAnimationsForScene, "- texture: " + w);
            this.transformOriginValue = "";
            for (var K in y.keyAnimations) {
                if (K == "playing") {
                    debugMessage(kDebugShowController_CreateAnimationsForScene, "- keyName: " + K + " - we don't animate this one...");
                    continue
                }
                var B = y.keyAnimations[K];
                var L = B.keyActions;
                var H = escapeTextureId(w) + "-" + escapeTextureId(K) + "-" + G;
                var z = this.animationManager.createAnimation(H);
                debugMessage(kDebugShowController_CreateAnimationsForScene, "- @keyframe " + H);
                debugMessage(kDebugShowController_CreateAnimationsForScene, "- {");
                if (K == "anchorPoint") {
                    debugMessage(kDebugShowController_CreateAnimationsForScene, "-   this is an anchor point action, need special case");
                    var C = L[0];
                    var P = {};
                    P.x = C.to.pointX;
                    P.y = C.to.pointY;
                    var M = this.anchorPointOffset(y.originalTextureId, P);
                    var F = {
                        pointX: M.x,
                        pointY: M.y
                    };
                    this.emphasisTransformOrigin = "";
                    debugMessage(kDebugShowController_CreateAnimationsForScene, "-     newAnchorPoint: (" + P.x + ", " + P.y + ")");
                    debugMessage(kDebugShowController_CreateAnimationsForScene, "-        offsetValue: (" + F.pointX + ", " + F.pointY + ")");
                    this.createAnimationRuleForKeyframe(z, 0, "position", F, "linear");
                    this.createAnimationRuleForKeyframe(z, 100, "position", F);
                    this.transformOriginValue = (P.x * 100) + "% " + (P.y * 100) + "%"
                } else {
                    var C = L[0];
                    var I = 0;
                    var A = null;
                    if (C == null) {
                        continue
                    }
                    if (C.startKeyframe != 0) {
                        var O = this.createInitialKeyframeValue(G, w, K, C.from);
                        debugMessage(kDebugShowController_CreateAnimationsForScene_Adjustments, "---> insert keyframes at 0 and " + (C.startKeyframe - N) + " because 1st keyframe in list (" + C.startKeyframe + ") is not 0");
                        this.createAnimationRuleForKeyframe(z, 0, K, O, "linear");
                        this.createAnimationRuleForKeyframe(z, C.startKeyframe - N, K, O, "linear");
                        I = C.startKeyframe;
                        A = O;
                        debugMessage(kDebugShowController_CreateAnimationsForScene_Adjustments, "---> end of inserted keyframes")
                    }
                    for (var J = 0; J < L.length; J++) {
                        C = L[J];
                        if (C.startKeyframe != I) {
                            debugMessage(kDebugShowController_CreateAnimationsForScene_Adjustments, "---> insert keyframe at " + (C.startKeyframe - N) + " to close gap between " + I + " and " + C.startKeyframe);
                            this.createAnimationRuleForKeyframe(z, C.startKeyframe - N, K, A, "linear");
                            debugMessage(kDebugShowController_CreateAnimationsForScene_Adjustments, "---> end of inserted keyframe")
                        }
                        if (K == "rotationEmphasis") {
                            this.emphasisTransformOrigin = C.from.rotationEmphasis[0] + "px " + C.from.rotationEmphasis[1] + "px"
                        } else {
                            this.emphasisTransformOrigin = ""
                        }
                        var R = this.createTimingFunctionForAction(C);
                        this.createAnimationRuleForKeyframe(z, C.startKeyframe, K, C.from, R);
                        this.createAnimationRuleForKeyframe(z, C.endKeyframe - (C.endKeyframe == 100 ? 0: N), K, C.to, "linear");
                        A = C.to;
                        I = C.endKeyframe
                    }
                    if (I != 100) {
                        debugMessage(kDebugShowController_CreateAnimationsForScene_Adjustments, "---> inserting keyframes at " + (I) + " and 100 because last keyframe in list (" + I + ") is not 100");
                        this.createAnimationRuleForKeyframe(z, I, K, A, "linear");
                        this.createAnimationRuleForKeyframe(z, 100, K, A, "linear");
                        debugMessage(kDebugShowController_CreateAnimationsForScene_Adjustments, "---> end of inserted keyframes")
                    }
                }
                debugMessage(kDebugShowController_CreateAnimationsForScene, "- }")
            }
        }
        this.sceneIndexOfPrebuiltAnimations = G;
        debugStopTimer(E)
    },
    clearExistingAnimations: function() {
        this.clearExistingAnimationFrom(this.stageManager.stage)
    },
    clearExistingAnimationFrom: function(d) {
        d.style.removeProperty(kAnimationNamePropertyName);
        d.style.removeProperty(kAnimationDurationPropertyName);
        for (var e = 0; e < d.childNodes.length; e++) {
            var f = d.childNodes[e];
            this.clearExistingAnimationFrom(f)
        }
    },
    applyAnimationsForScene: function() {
        debugStopTimer(this.debugTimerAdvanceToBuild_to_ApplyAnimations);
        var H = new DebugTimer(kDebugTimer_ApplyAnimationsForScene);
        debugMessage(kDebugShowController_ApplyAnimationsForScene);
        debugMessage(kDebugShowController_ApplyAnimationsForScene, "-------------------------------------------------");
        debugMessage(kDebugShowController_ApplyAnimationsForScene, "- a p p l y A n i m a t i o n s F o r S c e n e -");
        debugMessage(kDebugShowController_ApplyAnimationsForScene, "-------------------------------------------------");
        var R = false;
        for (var x in this.textureAnimations) {
            var B = this.textureAnimations[x];
            var G = escapeTextureId(x);
            debugMessage(kDebugShowController_ApplyAnimationsForScene, "- texture: " + x + " (escaped: " + G + ")");
            var C = document.getElementById(G + "-root");
            if (C == null) {
                debugWarning(kDebugShowController_ApplyAnimationsForScene, "could not find texture '" + x + "' - ignoring...");
                continue
            }
            C.style.visibility = "visible";
            var M = false;
            for (var N in B.keyAnimations) {
                var E = B.keyAnimations[N];
                var O = E.keyActions;
                var y = O[O.length - 1];
                var L = G + "-" + escapeTextureId(N) + "-" + this.currentSceneIndex;
                var J = this.cssPropertyNameForAction(N);
                var z = this.cssPropertyValueForActionValue(N, y.to);
                var A = E.latestEndTime - E.earliestBeginTime;
                var K = "";
                var D = false;
                switch (N) {
                case "opacityMultiplier":
                    K = G;
                    break;
                case "hidden":
                    J = "opacity";
                    if (z == "hidden") {
                        z = 0
                    } else {
                        z = 1
                    }
                case "zOrderHint":
                case "transform.translation.z":
                    K = G + "-root";
                    break;
                case "isPlaying":
                    K = G + "-movieObject";
                    D = true;
                    R = true;
                    break;
                case "position":
                    M = true;
                case "transform.scale":
                case "transform.scale.x":
                case "transform.scale.y":
                default:
                    K = G + "-" + escapeTextureId(N);
                    break
                }
                debugMessage(kDebugShowController_ApplyAnimationsForScene, "-  keyName: " + N);
                debugMessage(kDebugShowController_ApplyAnimationsForScene, "-     animationName: " + L);
                debugMessage(kDebugShowController_ApplyAnimationsForScene, "-         elementId: " + K);
                debugMessage(kDebugShowController_ApplyAnimationsForScene, "- earliestBeginTime: " + E.earliestBeginTime);
                debugMessage(kDebugShowController_ApplyAnimationsForScene, "-          duration: " + this.overallEndTime);
                debugMessage(kDebugShowController_ApplyAnimationsForScene, "-      propertyName: " + J);
                debugMessage(kDebugShowController_ApplyAnimationsForScene, "-       final value: " + z);
                var S = document.getElementById(K);
                if (S) {
                    if (D && (N == "isPlaying")) {
                        if (gMode == kModeMobile) {
                            debugMessage(kDebugShowController_ApplyAnimationsForScene, "- this animation is an 'isPlaying' one, but we're on the phone so don't start the movie...")
                        } else {
                            if (E.earliestBeginTime > 0) {
                                debugMessage(kDebugShowController_ApplyAnimationsForScene, "- this animation is an 'isPlaying' one, and it has a non-zero begin time, so start the movie after a delay of " + E.earliestBeginTime + "...");
                                var I = this;
                                setTimeout(function() {
                                    I.startMoviePlaying(K, z)
                                },
                                E.earliestBeginTime * 1000)
                            } else {
                                debugMessage(kDebugShowController_ApplyAnimationsForScene, "- this animation is an 'isPlaying' one, start the movie...");
                                this.startMoviePlaying(K, z)
                            }
                            this.updateNavigationButtons()
                        }
                    } else {
                        if (N == "anchorPoint") {
                            var Q = {};
                            Q.x = y.to.pointX;
                            Q.y = y.to.pointY;
                            var P = this.anchorPointOffset(B.originalTextureId, Q);
                            J = kTransformPropertyName;
                            z = "translateX(" + P.x + "px) translateY(" + P.y + "px)";
                            debugMessage(kDebugShowController_ApplyAnimationsForScene, "- this is an anchorPoint, special case, change property name and value to:");
                            debugMessage(kDebugShowController_ApplyAnimationsForScene, "-     propertyName: " + J);
                            debugMessage(kDebugShowController_ApplyAnimationsForScene, "-      final value: " + z)
                        } else {
                            if (N == "rotationEmphasis") {
                                var T = B.anchorPoint;
                                debugMessage(kDebugShowController_ApplyAnimationsForScene, "- applying squirreled away anchor point of " + T.x + "," + T.y + " for texture " + x);
                                S.style.setProperty(kTransformOriginPropertyName, T.x + " " + T.y)
                            }
                        }
                        debugMessage(kDebugShowController_ApplyAnimationsForScene, "- setting " + J + " of " + K + " to " + z);
                        S.style.setProperty(J, z);
                        debugMessage(kDebugShowController_ApplyAnimationsForScene, "-       applying animation " + L + " with duration " + this.overallEndTime + "s");
                        S.style.setProperty(kAnimationNamePropertyName, L);
                        S.style.setProperty(kAnimationDurationPropertyName, this.overallEndTime + "s")
                    }
                }
            }
            if (M) {
                debugMessage(kDebugShowController_ApplyAnimationsForScene, "- clearing out 'initial state' transform");
                var F = document.getElementById(G + "-root");
                F.style.setProperty(kTransformPropertyName, "")
            }
        }
        debugStopTimer(H);
        return R
    },
    startMoviePlaying: function(f, d) {
        if (gMode == kModeDesktop) {
            debugMessage(kDebugShowController_StartMoviePlaying, "escapedTextureId: " + f + " isPlaying: " + d + " - delaying movie start by 1s to allow video element to load...");
            var e = this;
            setTimeout(function() {
                e.startMoviePlaying_partTwo(f, d)
            },
            1000)
        } else {
            this.startMoviePlaying_partTwo(f, d)
        }
    },
    startMoviePlaying_partTwo: function(c, d) {
        if (gIpad) {
            this.startMoviePlaying_iPadVersion(c, d)
        } else {
            this.startMoviePlaying_normalVersion(c, d)
        }
    },
    startMoviePlaying_normalVersion: function(g, h) {
        debugMessage(kDebugShowController_StartMoviePlaying, "escapedTextureId: " + g + " isPlaying: " + h);
        var e = document.getElementById(g);
        if (e) {
            if (h == true) {
                if (e.play) {
                    debugMessage(kDebugShowController_StartMoviePlaying, "- movieObject.play() is valid, invoking...");
                    debugMessage(kDebugShowController_StartMoviePlaying, "- movieObject's src: " + e.src);
                    var f = this;
                    e.addEventListener("play",
                    function(a) {
                        f.handleMovieDidStart(a, g)
                    });
                    e.addEventListener("ended",
                    function(a) {
                        f.handleMovieDidEnd(a, g)
                    });
                    e.addEventListener("error",
                    function(a) {
                        f.handleMovieError(a, g)
                    });
                    e.muted = this.muted;
                    e.play();
                    debugMessage(kDebugShowController_StartMoviePlaying, "- movie should be playing now")
                } else {
                    debugMessage(kDebugShowController_StartMoviePlaying, "- movieObject.play() is null, that can't be good")
                }
            } else {
                if (e.pause) {
                    debugMessage(kDebugShowController_StartMoviePlaying, "- movieObject.pause() is valid, invoking...");
                    var f = this;
                    e.pause();
                    debugMessage(kDebugShowController_StartMoviePlaying, "- movie should be paused now")
                } else {
                    debugMessage(kDebugShowController_StartMoviePlaying, "- movieObject.pause() is null, that can't be good")
                }
            }
        } else {
            debugMessage(kDebugShowController_StartMoviePlaying, "- could not find movie object by ID!")
        }
    },
    startMoviePlaying_iPadVersion: function(l, m) {
        debugMessage(kDebugShowController_StartMoviePlaying, "iPad Version! escapedTextureId: " + l + " isPlaying: " + m);
        var n = l.substring(0, l.length - 5);
        var j = document.getElementById(l);
        var k = j.parentNode;
        debugMessage(kDebugShowController_StartMoviePlaying, "- truncatedId: " + n);
        debugMessage(kDebugShowController_StartMoviePlaying, "- creating new video element...");
        var h = document.createElement("video");
        debugMessage(kDebugShowController_StartMoviePlaying, "- setting properties on new video element...");
        h.id = n;
        h.src = j.src;
        h.muted = this.muted;
        h.poster = j.poster;
        h.controls = true;
        h.style.visibility = "visible";
        h.style.position = kPositionAbsolutePropertyValue;
        h.style.top = "0px";
        h.style.left = "0px";
        h.style.width = j.style.width;
        h.style.height = j.style.height;
        h.style.opacity = j.opacity;
        debugMessage(kDebugShowController_StartMoviePlaying, "- inserting new video element to DOM...");
        k.appendChild(h);
        debugMessage(kDebugShowController_StartMoviePlaying, "- starting movie...");
        var i = this;
        h.addEventListener("play",
        function(a) {
            i.handleMovieDidStart(a, n)
        });
        h.addEventListener("ended",
        function(a) {
            i.handleMovieDidEnd(a, n)
        });
        h.addEventListener("error",
        function(a) {
            i.handleMovieError(a, n)
        });
        h.play()
    },
    removeMovieObjectClone: function(b) {
        debugMessage(kDebugShowController_StartMoviePlaying)
    },
    handleMovieDidStart: function(d, f) {
        debugMessage(kDebugShowController_HandleMovieDidStart, "textureId: " + f);
        if (gMode == kModeDesktop) {
            var e = this;
            this.setMuted(!this.muted);
            this.setMuted(!this.muted);
            setTimeout(function() {
                e.hidePosterFrame(f)
            },
            1)
        }
    },
    hidePosterFrame: function(f) {
        var d = f.substring(0, f.indexOf("-movieObject"));
        debugMessage(kDebugShowController_HandleMovieDidStart, "- posterFrameId: '" + d + "'");
        var e = document.getElementById(d);
        e.style.height = "0px"
    },
    handleMovieDidEnd: function(d, c) {
        debugMessage(kDebugShowController_HandleMovieDidEnd, "textureId: " + c)
    },
    handleMovieError: function(d, c) {
        debugMessage(kDebugShowController_HandleMovieError, "textureId: " + c)
    },
    createHyperlinks: function(K) {
        if (true || K == -1) {
            debugMessage(kDebugShowController_CreateHyperlinks, "hyperlinkSceneIndex is -1, nothing to do");
            return
        }
        debugMessage(kDebugShowController_CreateHyperlinks);
        debugMessage(kDebugShowController_CreateHyperlinks, "-               state: " + this.state);
        debugMessage(kDebugShowController_CreateHyperlinks, "-   currentSceneIndex: " + this.currentSceneIndex);
        debugMessage(kDebugShowController_CreateHyperlinks, "-      nextSceneIndex: " + this.nextSceneIndex);
        debugMessage(kDebugShowController_CreateHyperlinks, "- hyperlinkSceneIndex: " + K);
        var J = this.script.eventTimelines[K];
        if (J == null) {
            debugMessage(kDebugShowController_CreateHyperlinks, "eventTimeLine for the specified scene index is null!");
            return
        }
        var P = J.hyperlinks;
        if (P == null) {
            debugMessage(kDebugShowController_CreateHyperlinks, "hyperlinks property for the specified scene index is null!");
            return
        }
        var G = P.length;
        var M;
        debugMessage(kDebugShowController_CreateHyperlinks, "- iterating over " + G + " hyperlinks...");
        var U = 150;
        var A = 50;
        var S = this.displayManager.showWidth;
        var L = this.displayManager.showHeight;
        for (M = 0; M < G; M++) {
            var Q = P[M];
            var B = Q.targetRectangle;
            var E = {
                targetRectangle: B,
                url: Q.url
            };
            var C = B.x;
            var N = B.y;
            var z = S - (B.x + B.width);
            var H = L - (B.y + B.top);
            debugMessage(kDebugShowController_CreateHyperlinks, "- " + M + ": (x:" + B.x + ", y:" + B.y + ", w:" + B.width + ", h:" + B.height + ")");
            if (gMode == kModeMobile) {
                if (B.width < U) {
                    var F = U - B.width;
                    var T = F / 2;
                    var R = F / 2;
                    debugMessage(kDebugShowController_CreateHyperlinks, "- width too small by: " + F);
                    if (C < T) {
                        T = C
                    } else {
                        if (z < R) {
                            T = T + (R - z)
                        }
                    }
                    E.targetRectangle.x -= T;
                    E.targetRectangle.width += F
                }
                if (B.height < A) {
                    var D = A - B.height;
                    var I = D / 2;
                    var O = D / 2;
                    debugMessage(kDebugShowController_CreateHyperlinks, "- height too small by: " + D);
                    if (N < I) {
                        I = N
                    } else {
                        if (H < O) {
                            I = I + (R - z)
                        }
                    }
                    E.targetRectangle.y -= I;
                    E.targetRectangle.height += D
                }
            }
            debugMessage(kDebugShowController_CreateHyperlinks, "- adding hyperlink to stage...");
            this.stageManager.addHyperlink(E.targetRectangle);
            debugMessage(kDebugShowController_CreateHyperlinks, "- adding hyperlink struct to array...");
            this.activeHyperlinks[M] = E
        }
        if (this.movieHyperlinks.length > 0) {
            debugMessage(kDebugShowController_CreateHyperlinks, "- appending movie hyperlinks...");
            for (var V = 0; V < this.movieHyperlinks.length; V++) {
                var y = this.movieHyperlinks[V];
                debugMessage(kDebugShowController_CreateHyperlinks, "-    " + V + ": " + y.url);
                this.stageManager.addHyperlink(y.targetRectangle);
                this.activeHyperlinks[M++] = y
            }
        } else {
            debugMessage(kDebugShowController_CreateHyperlinks, "- there are no movie hyperlinks...")
        }
        debugMessage(kDebugShowController_CreateHyperlinks, "finished.")
    },
    updateNavigationButtons: function() {
        var m = this.currentSceneIndex;
        if (this.state == kShowControllerState_IdleAtFinalState) {
            m++
        }
        var k = document.URL.split("?");
        var j = k[0].split("#");
        window.history.replaceState(null, "Keynote", j[0] + "#" + m + (k[1] ? "?" + k[1] : ""));
        debugMessage(kDebugShowController_UpdateNavigationButtons);
        debugMessage(kDebugShowController_UpdateNavigationButtons, "-             state: " + this.state);
        debugMessage(kDebugShowController_UpdateNavigationButtons, "-     loopSlideshow: " + this.script.loopSlideshow);
        debugMessage(kDebugShowController_UpdateNavigationButtons, "- currentSceneIndex: " + this.currentSceneIndex);
        debugMessage(kDebugShowController_UpdateNavigationButtons, "-   sceneIndexToUse: " + m);
        debugMessage(kDebugShowController_UpdateNavigationButtons, "-    lastSceneIndex: " + this.script.lastSceneIndex);
        debugMessage(kDebugShowController_UpdateNavigationButtons, "- currentSlideIndex: " + this.currentSlideIndex);
        var i = false;
        var n = false;
        if (this.script.lastSceneIndex == -1) {
            debugMessage(kDebugShowController_UpdateNavigationButtons, "- this slideshow has only 1 slide with no builds, both buttons are disabled");
            n = false;
            i = false
        } else {
            if (this.script.loopSlideshow) {
                debugMessage(kDebugShowController_UpdateNavigationButtons, "- this is a looping slideshow, both buttons are ALWAYS enabled");
                n = true;
                i = true
            } else {
                if (m > 0) {
                    debugMessage(kDebugShowController_UpdateNavigationButtons, "- sceneIndexToUse > 0, so enable backward button");
                    i = true
                }
                if (m == 0 && this.script.lastSceneIndex == 0) {
                    debugMessage(kDebugShowController_UpdateNavigationButtons, "- sceneIndexToUse & lastSceneIndex are both 0 - show with 1 slide with 1 build, so enable forward button");
                    n = true
                } else {
                    if (this.currentSceneIndex < this.script.lastSceneIndex) {
                        debugMessage(kDebugShowController_UpdateNavigationButtons, "- currentSceneIndex < lastSceneIndex, so enable forward button");
                        n = true
                    } else {
                        if (this.currentSceneIndex == this.script.lastSceneIndex) {
                            if (this.state == kShowControllerState_IdleAtInitialState) {
                                debugMessage(kDebugShowController_UpdateNavigationButtons, "- currentSceneIndex == lastSceneIndex, but we're at the intitial state, so enable forward button");
                                n = true
                            } else {
                                debugMessage(kDebugShowController_UpdateNavigationButtons, "- currentSceneIndex == lastSceneIndex, and we're at the final state, so disable forward button");
                                n = false
                            }
                        } else {
                            debugMessage(kDebugShowController_UpdateNavigationButtons, "- currentSceneIndex > lastSceneIndex, show with 1 slide and no builds, so disable forward button");
                            n = false
                        }
                    }
                }
            }
        }
        debugMessage(kDebugShowController_UpdateNavigationButtons, "- backward button should be: " + (i ? "enabled": "disabled"));
        debugMessage(kDebugShowController_UpdateNavigationButtons, "-  forward button should be: " + (n ? "enabled": "disabled"));
        var o = this.stageManager.anyVideoElementsOnStage();
        var p = (this.soundTrackPlayer != null);
        debugMessage(kDebugShowController_UpdateNavigationButtons, "-                 any Video: " + (o ? "yes": "no"));
        debugMessage(kDebugShowController_UpdateNavigationButtons, "-                 any Audio: " + (p ? "yes": "no"));
        var l = ((o || p) ? kMuteButtonState_Enabled: kMuteButtonState_Disabled) | (this.muted ? kMuteButtonState_Muted: kMuteButtonState_NotMuted);
        this.displayManager.setPreviousButtonEnabled(i);
        this.displayManager.setNextButtonEnabled(n);
        this.displayManager.setHudMuteButtonState(l);
        if (gEmbedded) {
            this.displayManager.setEmbeddedRestartButtonEnabled(m != 0)
        }
    },
    setCurrentSceneIndexTo: function(b) {
        debugMessage(kDebugShowController_SetCurrentSceneIndexTo, "changing it from " + this.currentSceneIndex + " to " + b);
        this.currentSceneIndex = b;
        this.assignNextSceneIndex();
        this.updateSlideNumber();
        this.updateNavigationButtons()
    },
    displayScene: function(U, S) {
        debugMessageAlways(kDebugShowController_DisplayScene, "YAHOOO!!!!! sceneIndex: " + U);
        var O = this.scriptManager.slideIndexFromSceneIndex(U);
        var ao = new Array();
        var ak = new DebugTimer(kDebugTimer_DisplayScene);
        var ah = U < this.currentSceneIndex;
        debugMessage(kDebugShowController_DisplayScene, "sceneIndex: " + U + (ah ? " (going backwards)": ""));
        if (U == -1) {
            debugMessageAlways(kDebugShowController_DisplayScene, "- sceneIndex is -1, ignoring...");
            return
        }
        this.setCurrentSceneIndexTo(U);
        var ac = this.script.eventTimelines[U];
        var Y = ac.eventInitialStates;
        var Z = Y.length;
        var ad = 0;
        var X;
        kDebugDisplayScene = "";
        debugMessage(kDebugShowController_DisplayScene, "eventTimeline: " + ac);
        for (var P in ac) {
            debugMessage(kDebugShowController_DisplayScene, "- " + P + ": " + ac[P])
        }
        debugMessage(kDebugShowController_DisplayScene, "precessing hyperlinks...");
        debugMessage(kDebugShowController_DisplayScene, "- hyperlinkSceneOffset: " + S);
        debugMessage(kDebugShowController_DisplayScene, "determing which existig textures to remove from stage... (remove everything but leave movies in place)");
        var am = this.stageManager.stage;
        var at = {};
        for (X = 0; X < am.childNodes.length; X++) {
            var ai = am.childNodes[X];
            var V = ai.id;
            var ap = true;
            var al = "";
            debugMessage(kDebugShowController_DisplayScene, "- " + X + ": " + V);
            if (ai && typeof ai != "undefined" && typeof V != "undefined" && V != "") {
                if (this.isMovie(V) && !ah) {
                    var R = V.substring(0, V.indexOf("-root"));
                    debugMessage(kDebugShowController_DisplayScene, "-    this one's a movie, id: " + R + " -- check if it's in this scene...");
                    if (this.scriptManager.isMovieInScene(U, R, this.textureManager)) {
                        debugMessage(kDebugShowController_DisplayScene, "-    it is! leave it in...");
                        var aq = unEscapeTextureId(R);
                        debugMessage(kDebugShowController_DisplayScene, "-      unEscapedMovieId: " + aq);
                        var ar = this.movieCanvasObjectIdToTextureIdTable[aq];
                        debugMessage(kDebugShowController_DisplayScene, "-      originalTextureId: " + ar);
                        if (ar) {
                            al = this.textureManager.urlForMovie(unEscapeTextureId(ar));
                            debugMessage(kDebugShowController_DisplayScene, "-      movieUrl: " + al);
                            ap = false
                        } else {
                            debugMessageAlways(kDebugShowController_DisplayScene, "- not really in next scene, skip it")
                        }
                    }
                }
            }
            if (ap) {
                debugMessage(kDebugShowController_DisplayScene, "- add it to list of textures to remove");
                ao.push(ai)
            } else {
                debugMessage(kDebugShowController_DisplayScene, "- add it to list of movies left in scene");
                at[al] = true
            }
        }
        debugMessage(kDebugShowController_DisplayScene, "- iterating over list of movies we're keeping...");
        for (movieTextureId in at) {
            debugMessage(kDebugShowController_DisplayScene, "- " + movieTextureId)
        }
        debugMessage(kDebugShowController_DisplayScene, "- iterating over list of textures to remove...");
        for (X = 0; X < ao.length; X++) {
            var ai = ao[X];
            var V = ai.id;
            debugMessage(kDebugShowController_DisplayScene, "- " + X + ": " + V);
            this.stageManager.removeTexture(ai)
        }
        this.clearMovieHyperlinks();
        debugMessage(kDebugShowController_DisplayScene, "- processing " + Z + " textures...");
        this.stageManager.resetMovieCount();
        for (X = 0; X < Z; X++) {
            var aj = Y[X];
            var V = aj.texture;
            var ar = V;
            if (this.isMovie(V)) {
                V = "movieCanvasObject." + O + "." + aj.canvasObjectID
            }
            var an = this.textureAnimations[V];
            debugMessage(kDebugShowController_DisplayScene, "- textureAnimation: " + an);
            var N = escapeTextureId(V) + "-root";
            debugMessage(kDebugShowController_DisplayScene, "- " + X + ": " + V + " (" + N + ")");
            var au = false;
            if (this.isMovie(V)) {
                debugMessage(kDebugShowController_DisplayScene, "- it's a movie, check to see if it's already on the stage...");
                var al = this.textureManager.urlForMovie(ar);
                debugMessage(kDebugShowController_DisplayScene, "-   url: " + al);
                if (at[al]) {
                    debugMessage(kDebugShowController_DisplayScene, "- this movie was in the last scene, no need to add it again");
                    au = true
                } else {
                    debugMessage(kDebugShowController_DisplayScene, "- no it isn't, add it now")
                }
            }
            var L = 0;
            if (an != null) {
                L = an.numRequiredDivs
            }
            var af = (aj.hidden == 0 ? "visible": "hidden");
            var M = aj.opacity;
            var T = aj.opacityMultiplier;
            var Q = "";
            var ae = this.script.textures[ar];
            var K = ae.width;
            var aa = ae.height;
            var ag = true;
            ad = aj.zIndex;
            if ((ag == true) && (typeof aj.transform != "undefined")) {
                Q = "matrix3D(" + aj.transform + ")"
            } else {
                Q = "matrix(" + aj.affineTransform + ")"
            }
            debugMessage(kDebugShowController_DisplayScene, "-           opacity: " + M);
            debugMessage(kDebugShowController_DisplayScene, "- opacityMultiplier: " + T);
            debugMessage(kDebugShowController_DisplayScene, "-        visibility: " + af);
            debugMessage(kDebugShowController_DisplayScene, "-       nativeWidth: " + K);
            debugMessage(kDebugShowController_DisplayScene, "-      nativeHeight: " + aa);
            debugMessage(kDebugShowController_DisplayScene, "-         transform: " + Q);
            debugMessage(kDebugShowController_DisplayScene, "-            zOrder: " + ad);
            debugMessage(kDebugShowController_DisplayScene, "-          num Divs: " + L);
            if (T > 0) {
                M *= T;
                debugMessage(kDebugShowController_DisplayScene, "- opacityMultiplier specified, changing opacity to " + M)
            }
            var W = new Array();
            if (an) {
                debugMessage(kDebugShowController_DisplayScene, "- adding keyNames to divNames...");
                for (var ab in an.keyAnimations) {
                    if ((ab != "isPlaying") && (ab != "opacityMultiplier") && (ab != "zOrderHint") && (ab != "hidden")) {
                        debugMessage(kDebugShowController_DisplayScene, "-  " + ab);
                        W.push(ab)
                    } else {
                        debugMessage(kDebugShowController_DisplayScene, "-  " + ab + " (no div required for this key)")
                    }
                }
            }
            this.stageManager.addTextureToStage(U, V, K, aa, af, M, ad, Q, W, aj, au)
        }
        this.updateNavigationButtons();
        if (gEmbedded == true) {
        }
        debugMessage(kDebugShowController_DisplayScene, "complete.");
        debugStopTimer(ak)
    },
    isMovie: function(b) {
        return (b.indexOf("movie") != -1)
    },
    setupWaitForSceneToLoadPoller: function(c) {
        debugMessage(kDebugShowController_SetupWaitForSceneToLoadPoller, "sceneIndex: " + c.sceneToLoad + " setting up timeout function to poll...");
        this.waitForSceneToLoadPollCount = 0;
        this.pollingSpinnerVisiblie = false;
        var d = this;
        setTimeout(function() {
            d.pollForSceneToLoad(c)
        },
        kSceneLoadPollInterval)
    },
    pollForSceneToLoad: function(c) {
        this.waitForSceneToLoadPollCount++;
        debugMessageAlways(kDebugShowController_PollForSceneToLoad, "sceneIndex: " + c.sceneToLoad + " querying TextureManager to see if scene is loaded yet... poll count: " + this.waitForSceneToLoadPollCount);
        if (this.textureManager.isScenePreloaded(c.sceneToLoad)) {
            debugMessageAlways(kDebugShowController_PollForSceneToLoad, "scene " + c.sceneToLoad + " is now loaded, stop polling");
            this.handleSceneDidLoad(c)
        } else {
            if (this.waitForSceneToLoadPollCount > kSceneLoadGiveUpPollCount) {
                debugMessageAlways(kDebugShowController_PollForSceneToLoad, "scene " + c.sceneToLoad + " has taken too long to load, give up");
                this.handleSceneDidNotLoad(c)
            } else {
                if (this.waitForSceneToLoadPollCount > kSceneLoadDisplaySpinnerPollCount) {
                    if (this.pollingSpinnerVisiblie == false) {
                        debugMessageAlways(kDebugShowController_PollForSceneToLoad, "scene " + c.sceneToLoad + " is taking a long time to load, display spinner...")
                    }
                }
                var d = this;
                setTimeout(function() {
                    d.pollForSceneToLoad(c)
                },
                kSceneLoadPollInterval)
            }
        }
    },
    handleSceneDidLoad: function(b) {
        debugMessage(kDebugShowController_HandleSceneDidLoad, "sceneIndex: " + b.sceneToLoad + " took " + this.waitForSceneToLoadPollCount + " polls");
        this.displayManager.setNextButtonEnabled(this.currentSceneIndex < (this.script.pageCount - 1));
        switch (this.state) {
        case kShowControllerState_WaitingToJump:
            debugMessage(kDebugShowController_HandleSceneDidLoad, "- we were waiting to jump, jumping to it now...");
            this.changeState(kShowControllerState_ReadyToJump);
            this.jumpToScene_partTwo(b.sceneToLoad, b.playAnimationsAfterLoading);
            break;
        default:
            debugWarning(kDebugShowController_HandleSceneDidLoad, "we were NOT waiting for a scene to load, how did we get here? hmmm... what to do?");
            break
        }
    },
    handleSceneDidNotLoad: function(h) {
        debugMessageAlways(kDebugShowController_HandleSceneDidNotLoad, "sceneIndex: " + h.sceneToLoad + " - purging cache...");
        this.queuedUserAction = null;
        var g = false;//this.promptUserToTryAgain(kUnableToReachiWorkTryAgain);
        if (g) {
            kDebugTextureManager_LoadScene = "TextureManager_LoadScene";
            gDebugOnMobile = true;
            debugMessageAlways(kDebugShowController_HandleSceneDidNotLoad, "- restarting player with sceneIndex: " + h.sceneToLoad);
            var k = window.location.href;
            var i;
            debugMessage(kDebugShowController_HandleSceneDidNotLoad, "- currentUrl: " + k);
            var j = k.indexOf("&restartingSceneIndex");
            if (j == -1) {
                i = k
            } else {
                i = k.substring(0, j);
                debugMessage(kDebugShowController_HandleSceneDidNotLoad, "- croppedUrl: " + i)
            }
            var l = i + "&restartingSceneIndex=" + h.sceneToLoad;
            debugMessage(kDebugShowController_HandleSceneDidNotLoad, "- new URL: " + l);
            window.location.replace(l)
        } else {
            debugMessageAlways(kDebugShowController_HandleSceneDidNotLoad, "- user elected to NOT try again");
            this.changeState(kShowControllerState_IdleAtFinalState);
            this.autoAdvance = false
        }
    }
});
var kTouchStartEventName = "touchstart";
var kTouchMoveEventName = "touchmove";
var kTouchEndEventName = "touchend";
var kTouchCancelEventName = "touchcancel";
var kGestureStartEventName = "gesturestart";
var kGestureEndEventName = "gestureend";
var kSwipeEvent = "TouchController:SwipeEvent";
var kTapEvent = "TouchController:TapeEvent";
var TouchController = Class.create({
    initialize: function() {
        debugMessage(kDebugTouchController_Initialize, "initializing...");
        var b = this;
		document.getElementById("stageArea").addEventListener("click",
        function(a) {
			b.handleClickEvent(a);
        });
        document.addEventListener(kTouchStartEventName,
        function(a) {
            b.handleTouchStartEvent(a)
        },
        false);
        document.addEventListener(kTouchMoveEventName,
        function(a) {
            b.handleTouchMoveEvent(a)
        },
        false);
        document.addEventListener(kTouchEndEventName,
        function(a) {
            b.handleTouchEndEvent(a)
        },
        false);
        document.addEventListener(kTouchCancelEventName,
        function(a) {
            b.handleTouchCancelEvent(a)
        },
        false);
        document.addEventListener(kGestureStartEventName,
        function(a) {
            b.handleGestureStartEvent(a)
        },
        false);
        document.addEventListener(kGestureEndEventName,
        function(a) {
            b.handleGestureEndEvent(a)
        },
        false);
        this.swipeInProgress = false;
        this.swipeFingerCount = 0;
        this.swipeStartTime = 0;
        this.swipeStartX = 0;
        this.swipeStartY = 0;
		
        this.preventDefault = isPreventDefault;
        this.tapEventCallback = null;
        this.setTrackArea(0, 0, 0, 0);
        this.enableTouchTracking = true
    },
    setTouchTrackingEnabled: function(b) {
        this.enableTouchTracking = b
    },
    setTrackArea: function(g, h, e, f) {
        debugMessage(kDebugTouchController_SetTrackArea, "left: " + g + " top: " + h + " width: " + e + " height: " + f);
        this.trackAreaLeft = g;
        this.trackAreaTop = h;
        this.trackAreaRight = g + e;
        this.trackAreaBottom = h + f
    },
    registerTapEventCallback: function(b) {
        this.tapEventCallback = b
    },
    isTouchWithinTrackArea: function(b) {
        debugMessage(kDebugTouchController_IsTouchWithinTrackArea, "checking...");
        if (this.enableTouchTracking == false) {
            debugMessage(kDebugTouchController_IsTouchWithinTrackArea, "- nope, tracking is disabled");
            return false
        }
        if (b.clientX < this.trackAreaLeft) {
            debugMessage(kDebugTouchController_IsTouchWithinTrackArea, "- nope, x < left");
            return false
        }
        if (b.clientX > this.trackAreaRight) {
            debugMessage(kDebugTouchController_IsTouchWithinTrackArea, "- nope, x > right");
            return false
        }
        if (b.clientY < this.trackAreaTop) {
            debugMessage(kDebugTouchController_IsTouchWithinTrackArea, "- nope, y < top");
            return false
        }
        if (b.clientY > this.trackAreaBottom) {
            debugMessage(kDebugTouchController_IsTouchWithinTrackArea, "- nope, y > bottom");
            return false
        }
        debugMessage(kDebugTouchController_IsTouchWithinTrackArea, "- yes it is!");
        return true
    },
    handleTouchStartEvent: function(c) {
        debugMessage(kDebugTouchController_HandleTouchStartEvent, "touch event has " + c.touches.length + " fingers...");
        if (this.swipeInProgress == false) {
            debugMessage(kDebugTouchController_HandleTouchStartEvent, "- this is the first finger down event...");
            var d = c.touches[0];
            if (this.isTouchWithinTrackArea(d)) {
                debugMessage(kDebugTouchController_HandleTouchStartEvent, "- start tracking a swipt event...");
                if (this.preventDefault) {
                    c.preventDefault()
                }
                this.swipeInProgress = true;
                this.swipeFingerCount = c.touches.length;
                this.swipeStartTime = new Date();
                this.swipeStartX = d.clientX;
                this.swipeStartY = d.clientY
            } else {
                debugMessage(kDebugTouchController_HandleTouchStartEvent, "- but it is outside of the track area")
            }
        } else {
            debugMessage(kDebugTouchController_HandleTouchStartEvent, "- this is a subsequent finger down event. update finger count...");
            if (c.touches.length > this.swipeFingerCount) {
                this.swipeFingerCount = c.touches.length;
                debugMessage(kDebugTouchController_HandleTouchStartEvent, "- this.swipeFingerCount:" + this.swipeFingerCount)
            }
        }
    },
    handleTouchMoveEvent: function(b) {
        if (this.preventDefault) {
            b.preventDefault()
        }
        debugMessage(kDebugTouchController_HandleTouchCancelEvent, "")
    },
	handleClickEvent:function(A){
		debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  it's a " + this.swipeFingerCount + " finger tap");
        if (this.tapEventCallback) {
            var H = {};
            H.memo = {};
            H.memo.fingers = this.swipeFingerCount;
            H.memo.pointX = A.clientX;
            H.memo.pointY = A.clientY;
            debugMessage(kDebugTouchController_HandleTouchEndEvent, "- invoking callback with pointX: " + A.clientX + " pointY: " + A.clientY + "...");
            this.tapEventCallback(H);
            debugMessage(kDebugTouchController_HandleTouchEndEvent, "- back from callback")
        }
	},
    handleTouchEndEvent: function(H) {
        debugMessage(kDebugTouchController_HandleTouchEndEvent, "touch event has " + H.touches.length + " fingers...");
        if (this.swipeInProgress) {
            if (this.preventDefault) {
                H.preventDefault()
            }
            if (H.touches.length == 0) {
                debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  " + this.swipeFingerCount + " finger swipe is complete.");
                var A = H.changedTouches[0];
                var v = document.viewport.getDimensions();
                var D = v.width / 3;
                var E = v.height / 2;
                var B = v.width / 2;
                var x = A.clientX - this.swipeStartX;
                var z = A.clientY - this.swipeStartY;
                var F = Math.abs(x);
                var G = Math.abs(z);
                var t = new Date();
                var r = t - this.swipeStartTime;
                var w = false;
                var s = false;
                var C = 400;
                var y = 20;
                if (r < C) {
                    debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  elapsed time was short enough to be a tap, check its magnitude...");
                    if ((F < y) && (G < y)) {
                        w = true
                    } else {
                        debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  magnitude time too big to be a tap, check if it's a swipe...")
                    }
                } else {
                    debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  elapsed time too long to be a tap, check if it's a swipe...")
                }
                if (r > 800) {
                    debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  elapsed time too long to be a swipe, ignoring...")
                } else {
                    if (F > G) {
                        if (G > E) {
                            debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  vertical magnitude too high, ignoring...")
                        } else {
                            if (F > 130) {
                                s = true
                            }
                        }
                    } else {
                        if (F > B) {
                            debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  horizontal magnitude too high, ignoring...")
                        } else {
                            if (G > 130) {
                                s = true
                            }
                        }
                    }
                }
				w = false;
                if (w) {
                    debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  it's a " + this.swipeFingerCount + " finger tap");
                    if (this.tapEventCallback) {
                        var H = {};
                        H.memo = {};
                        H.memo.fingers = this.swipeFingerCount;
                        H.memo.pointX = A.clientX;
                        H.memo.pointY = A.clientY;
                        debugMessage(kDebugTouchController_HandleTouchEndEvent, "- invoking callback with pointX: " + A.clientX + " pointY: " + A.clientY + "...");
                        this.tapEventCallback(H);
                        debugMessage(kDebugTouchController_HandleTouchEndEvent, "- back from callback")
                    } else {
                        debugMessage(kDebugTouchController_HandleTouchEndEvent, "- firing TapEvent...");
                        document.fire(kTapEvent, {
                            fingers: this.swipeFingerCount,
                            pointX: A.clientX,
                            pointY: A.clientY
                        })
                    }
                } else {
                    if (s) {
                        var u;
                        if (F > G) {
                            u = (x < 0 ? "left": "right")
                        } else {
                            u = (z < 0 ? "up": "down")
                        }
                        debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  it's a " + this.swipeFingerCount + " finger swipe in the " + u + " direction");
                        document.fire(kSwipeEvent, {
                            direction: u,
                            fingers: this.swipeFingerCount
                        })
                    }
                }
                this.swipeInProgress = false;
                this.swipeFingerCount = 0
            }
        } else {
            debugMessage(kDebugTouchController_HandleTouchEndEvent, "-  false alarm. swipe has already ended.")
        }
    },
    handleTouchCancelEvent: function(b) {
        debugMessage(kDebugTouchController_HandleTouchCancelEvent, "");
        this.swipeInProgress = false
    },
    handleGestureStartEvent: function(b) {
        debugMessage(kDebugTouchController_HandleGestureStartEvent, "");
        if (this.preventDefault) {
            b.preventDefault()
        }
    },
    handleGestureEndEvent: function(b) {
        debugMessage(kDebugTouchController_HandleGestureEndEvent, "");
        if (this.preventDefault) {
            b.preventDefault()
        }
    }
});
var kStageSizeDidChangeEvent = "DisplayManager:StageSizeDidChangeEvent";
var kWidthOfHUD = 420;
var kHeightOfHUD = 59;
var kMinGapBetweenStageAndHUD = 8;
var kTimeoutValueForHUD = 2000;
var kMobilePortraitModeHorizontalMargin = 8;
var kMobilePortraitModeTopMargin = 47;
var kMobilePortraitModeVerticalCenterLine = 161;
var kMobilePortraitModeMaxStageHeight = 228;
var kMobilePortraitMaxStageHeight = 0;
var kMobilePortraitMaxStageWidth = 0;
var kMobileLandscapeModeVerticalMargin = 7;
var kMobileLandscapeModeHorizontallMargin = 15;
var kBottomButtonHeight = 50;
var kNavigationArrowSize = 27;
var kInfoPanelIconSize = 16;
var kNavigationAreaHeight = kNavigationArrowSize;
var kHelpAreaHeight = 16;
var kMobilePortraitModeVerticalCenterLineToNavigationAreaGap = 148;
var kStageToNavigationAreaGap = 31;
var kNavigationAreaToHelpAreaGap = 52;
var kHelpAreaToBottomGap = 12;
var kMobilePortraitModeNavigationAreaSideMargin = 32;
var kMobilePortraitModeHelpAreaSideMargin = 16;
var kMobileLandscapeModeMinSideSpacerWidth = kNavigationArrowSize + 10;
var kInfoPanelIconSize = 17;
var kInfoPanelIconToSideGap = 16;
var kInfoPanelButtonWidth = kInfoPanelIconSize + 2 * kInfoPanelIconToSideGap;
var kInfoPanelButtonHeight = kInfoPanelIconSize + 2 * kHelpAreaToBottomGap;
var kInfoPanelWidth = 304;
var kInfoPanelHeight = 228;
var kEmbeddedShow_BorderWidth = 0;
var kEmbeddeControlBar_EndCapWidth = 10;
var kEmbeddeControlBar_GapBelowShow = 0;
var kEmbeddedControlBar_Height = 0;
var kEmbeddedControlBar_ButtonWidth = 35;
var kEmbeddedControlBar_iWorkLogoWidth = 95;
var kEmbeddedControlBar_LinkToPresentationWidth = 250;
var kEmbeddedControlBar_SlideCounterWidth = 80;
var kPadPortraitModeHorizontalMargin = 8;
var kPadPortraitModeMaxStageHeight = 540;
var kPadPortraitModeVerticalCenterLine = 400;
var kPadLandscapeModeHorizontallMargin = 15;
var kPadLandscapeModeVerticalMargin = 7;
var kMuteButtonState_Disabled = 1;
var kMuteButtonState_Enabled = 2;
var kMuteButtonState_Muted = 4;
var kMuteButtonState_NotMuted = 8;
var DisplayManager = Class.create({
    initialize: function() {
        debugMessage(kDebugDisplayManager_Initialize, "adding event listener for orientation change events...");
        var b = this;
        document.observe(kShowSizeDidChangeEvent,
        function(a) {
            b.handleShowSizeDidChangeEvent(a)
        },
        false);
        document.observe(kOrientationChangedEvent,
        function(a) {
            b.handleOrientationDidChangeEvent(a)
        },
        false);
        this.body = document.getElementById("body");
        this.stageArea = document.getElementById("stageArea");
        this.stage = document.getElementById("stage");
        this.hyperlinkPlane = document.getElementById("hyperlinkPlane");
        this.waitingIndicator = document.getElementById("waitingIndicator");
        this.helpText = document.getElementById("helpText");
        this.previousButton = document.getElementById("previousButton");
        this.nextButton = document.getElementById("nextButton");
        this.slideCounter = document.getElementById("slideCounter");
        this.hudSlideCounter = document.getElementById("hudSlideCounter");
        this.waitingIndicatorTimeout = null;
        this.orientation = kOrientationUnknown;
        this.showWidth = 0;
        this.showHeight = 0;
        this.stageAreaWidth = 0;
        this.stageAreaHeight = 0;
        this.stageAreaTop = 0;
        this.stageAreaLeft = 0;
        this.usableDisplayWidth = 0;
        this.usableDisplayHeight = 0;
        this.inLaunchMode = true;
        this.initialAddressBarScrollPerformed = false;
        this.updateUsableDisplayArea();
        this.positionWaitingIndicator();
        this.showWaitingIndicator();
        this.infoPanelIsShowing = false;
        this.hyperlinksOnly = false;
        this.showStatisticsDisplay = gIpad && getUrlParameter("statistics") == "1";
        this.hasCacheEverGoneOverPixelLimit = false;
        this.hhasStageEverGoneOverPixelLimit = false;
        this.cacheHighWaterMark = 0;
        this.stageHighWaterMark = 0;
        if (gMode == kModeMobile) {
            this.infoPanel = document.getElementById("infoPanel");
            this.infoPanelIcon = document.getElementById("infoPanelIcon");
            this.infoPanelButton = document.getElementById("infoPanelButton");
            this.avatar = document.getElementById("avatar");
            if (window.devicePixelRatio >= 2) {
                this.infoPanel.style.backgroundSize = "304px 228px";
                this.infoPanel.style.backgroundImage = "url(" + static_url("bg_info_panel-hd.png") + ")"
            } else {
                this.infoPanel.style.backgroundImage = "url(" + static_url("doc_info_mobile_bg.png") + ")"
            }
            this.stageArea.style.backgroundColor = "black";
            this.helpText.innerHTML = kTapOrSwipeToAdvance;
            this.helpText.onclick = function() {
                gShowController.debugToggleMobileDebugging()
            };
            this.slideCounter.onclick = function() {
                gShowController.debugDiagnosticDump()
            };
            document.getElementById("documentPublisherLabel").innerHTML = kDocumentPublisherLabel;
            document.getElementById("documentNameLabel").innerHTML = kDocumentNameLabel;
            document.getElementById("publishDateLabel").innerHTML = kLastPublishedLabel;
            document.getElementById("termsOfServiceLinkText").innerHTML = "&nbsp&nbsp&nbsp&nbsp " + kTermsOfServiceLinkLabel + " &nbsp ";
            document.getElementById("privacyLinkText").innerHTML = "&nbsp&nbsp " + kPrivacyLinkLabel + " &nbsp ";
            document.getElementById("feedbackLinkText").innerHTML = "&nbsp&nbsp " + kFeedbackLinkLabel;
            document.getElementById("closeInfoPanelButton").innerHTML = kCloseInfoPanelButtonText;
            this.preloadImage(static_url("left_arrow_mobile_d.png"));
            this.preloadImage(static_url("left_arrow_mobile_n.png"));
            this.preloadImage(static_url("right_arrow_mobile_d.png"));
            this.preloadImage(static_url("right_arrow_mobile_n.png"))
        } else {
            $(this.body).observe("click",
            function(a) {
				if(a!=null && a.target!=null && a.target.getAttribute("skipClick")!=null && a.target.getAttribute("skipClick")=="true"){
					
				}
				else{
                gShowController.handleClickEvent(a)
				}
            });
            if (gEmbedded) {
                this.embeddedControlBar = document.getElementById("embeddedControlBar");
                this.embeddedControlBarBezel_LeftEndCap = document.getElementById("embeddedControlBarBezel_LeftEndCap");
                this.embeddedControlBarBezel_Filler = document.getElementById("embeddedControlBarBezel_Filler");
                this.embeddedControlBarBezel_RightEndCap = document.getElementById("embeddedControlBarBezel_RightEndCap");
                this.embeddedRestartButton = document.getElementById("embeddedControls_Restart");
                this.embeddedPreviousButton = document.getElementById("embeddedControls_Previous");
                this.embeddedNextButton = document.getElementById("embeddedControls_Next");
                this.embeddedMuteButton = document.getElementById("embeddedControls_Mute");
                this.embeddedLinkButton = document.getElementById("dummy");
                this.embeddedSlideCounter = document.getElementById("embeddedSlideCounter");
                this.embeddedSlideCounterSection = document.getElementById("embeddedSlideCounterSection");
                $(this.embeddedRestartButton).observe("click",
                function(a) {
                    debugMessage("embeddedRestartButton_onClick", "we've been pressed");
                    gShowController.gotoSlide(1);
                    a.stop()
                });
                $(this.embeddedNextButton).observe("click",
                function(a) {
                    debugMessage("embeddedNextButton_onClick", "we've been pressed");
                    gShowController.advanceToNextBuild("hud");
                    a.stop()
                });
                $(this.embeddedPreviousButton).observe("click",
                function(a) {
                    debugMessage("embeddedPreviousButton_onClick", "we've been pressed");
                    gShowController.goBackToPreviousSlide("hud");
                    a.stop()
                });
                $(this.embeddedMuteButton).observe("click",
                function(a) {
                    debugMessage("embeddedMuteButton_onClick", "we've been pressed");
                    gShowController.toggleMute();
                    a.stop()
                });
                $(this.embeddedLinkButton).observe("click",
                function(a) {
                    debugMessage("embeddedLinkButton_onClick", "we've been pressed");
                    gShowController.handleLinkControl();
                    a.stop()
                })
            } else {
                this.hud = document.getElementById("hud");
                this.hudMuteButton = document.getElementById("hudMuteButton");
                this.hudPreviousButton = document.getElementById("hudPreviousButton");
                this.hudNextButton = document.getElementById("hudNextButton");
                $(this.hud).observe("click",
                function(a) {
                    debugMessage("hud_on!Click", "we've been pressed");
                    gShowController.textureManager.debugDumpCache();
                    a.stop()
                });
                $(this.hudNextButton).observe("click",
                function(a) {
                    debugMessage("hudNextButton_!onClick", "we've been pressed");
                    gShowController.advanceToNextBuild("hud");
                    a.stop()
                });
                $(this.hudPreviousButton).observe("click",
                function(a) {
                    debugMessage("hudPreviousButton_!onClick", "we've been pressed");
                    gShowController.goBackToPreviousSlide("hud");
                    a.stop()
                });
                $(this.hudMuteButton).observe("click",
                function(a) {
                    debugMessage("hudMuteButton_!onClick", "we've been pressed");
                    gShowController.toggleMute();
                    a.stop()
                });
                var b = this;
                this.body.onmousemove = function(a) {
                    b.handleMouseMove(a)
                };
                $(this.body).observe("mouseleave",
                function(a) {
                    b.handleMouseOut(a)
                });
                this.hud.onmouseover = function(a) {
                    b.handleMouseOverHUD(a)
                };
                $(this.hud).observe("mouseleave",
                function(a) {
                    b.handleMouseOutHUD(a)
                });
                this.hudIsShowing = false;
                this.mouseIsOverHUD = false;
                this.hudTimeout = null;
                this.lastMouseX = -1;
                this.lastMouseY = -1;
                this.preloadImage(static_url("snd_on_d.png"));
                this.preloadImage(static_url("snd_on_n.png"));
                this.preloadImage(static_url("snd_on_p.png"));
                this.preloadImage(static_url("snd_off_d.png"));
                this.preloadImage(static_url("snd_off_n.png"));
                this.preloadImage(static_url("snd_off_p.png"));
                this.preloadImage(static_url("left_arrow_d.png"));
                this.preloadImage(static_url("left_arrow_n.png"));
                this.preloadImage(static_url("left_arrow_p.png"));
                this.preloadImage(static_url("right_arrow_d.png"));
                this.preloadImage(static_url("right_arrow_n.png"));
                this.preloadImage(static_url("right_arrow_p.png"));
                this.preloadImage(static_url("close_d.png"));
                this.preloadImage(static_url("close_n.png"));
                this.preloadImage(static_url("close_p.png"))
            }
        }
    },
    updateStatisticsDisplay: function() {
        if (this.showStatisticsDisplay == false) {
            return
        }
        var l = document.getElementById("statisticsDisplay");
        var m = gShowController.textureManager.getCacheStatistics();
        var v = gShowController.scriptManager.degradeStatistics;
        var o = gShowController.stageManager.debugGetStageStatistics();
        var s = gShowController.textureManager.numLoadFailures;
        var t = gShowController.textureManager.numOutstandingLoadRequests;
        var n = 1024 * 1024;
        var u = gSafeMaxPixelCount / n;
        u = Math.floor(u * 100) / 100;
        m.numPixels /= n;
        o.numPixels /= n;
        m.numPixels = Math.floor(m.numPixels * 100) / 100;
        o.numPixels = Math.floor(o.numPixels * 100) / 100;
        var r = false;
        var p = false;
        if (m.numPixels > u) {
            r = true;
            this.hasCacheEverGoneOverPixelLimit = true
        }
        if (o.numPixels > u) {
            p = true;
            this.hasStageEverGoneOverPixelLimit = true
        }
        if (m.numPixels > this.cacheHighWaterMark) {
            this.cacheHighWaterMark = m.numPixels
        }
        if (o.numPixels > this.stageHighWaterMark) {
            this.stageHighWaterMark = o.numPixels
        }
        var q = "<div style='position: absolute; left: 0px;'><b>Cache Statistics:</b><br>- Scenes: <b>" + m.numScenes + "</b><br>- Textures: <b>" + m.numTextures + "</b><br>- Pixels: <b>" + m.numPixels + " MP</b><br>- Peak Pixels: <b>" + this.cacheHighWaterMark + " MP</b><br>%nbsp<br><b>Limits:</b><br>- Max Pixels: <b>" + u + " MP</b><br></div><div style='position: absolute; left: 175px;'><b>Scene Statistics:</b><br>- Scene Index: <b>" + gShowController.currentSceneIndex + "</b><br>- Textures: <b>" + o.numTextures + "</b><br>- Total Pixels: <b>" + o.numPixels + " MP</b><br>- Peak Pixels: <b>" + this.stageHighWaterMark + " MP</b><br><b>Texture Loader:</b><br>- Num Load Requests: <b>" + (t > 0 ? ("<span style='color:yellow;'>" + t + "</span>") : "0") + "</b><br>- Num Load Failures: <b>" + (s > 0 ? ("<span style='color:red;'>" + s + "</span>") : "0") + "</b><br></div><div style='position: absolute; left: 350px;'><b>Degrade Statistics:</b><br>- Scenes w/Degrades: <b>" + v.numDegradedSlides + "</b><br>- Total Textures Degraded: <b>" + v.numDegradedTextures + "</b><br>- Max Textures/Scene: <b>" + v.maxNumDegradedTexturesPerSlide + "</b><br>- Textures in Current: <b>" + (o.numDegraded > 0 ? ("<span style='color:yellow;'>" + o.numDegraded + "</span>") : "0") + "</b><br></div><div style='position: absolute; left: 550px;'><b>Summary:</b><br>- Cache: <br>- Over Pixel Limit Now: <b>" + (r ? "<span style='color:red;'>YES</span>": "NO") + "</b><br>- Ever Over Pixel Limit: <b>" + (this.hasCacheEverGoneOverPixelLimit ? "<span style='color:red;'>YES</span>": "NO") + "</b><br>- Stage: <br>- Over Pixel Limit Now: <b>" + (p ? "<span style='color:red;'>YES</span>": "NO") + "</b><br>- Ever Over Pixel Limit: <b>" + (this.hasStageEverGoneOverPixelLimit ? "<span style='color:red;'>YES</span>": "NO") + "</b><br></div>";
        l.innerHTML = q
    },
    preloadImage: function(c) {
        debugMessage(kDebugDisplayManager_PreloadImage, "fileName: " + c);
        var d = new Image();
        d.src = c
    },
    setHyperlinksOnlyMode: function() {
        this.hyperlinksOnly = true;
        this.setPreviousButtonEnabled(false);
        this.setNextButtonEnabled(false);
        this.helpText.style.display = "none"
    },
    handleMouseOverHUD: function(b) {
        debugMessage(kDebugDisplayManager_HandleMouseOverHUD, " mouse is now over HUD");
        this.mouseIsOverHUD = true
    },
    handleMouseOutHUD: function(b) {
        debugMessage(kDebugDisplayManager_HandleMouseOutHUD, " mouse is no longer over HUD");
        this.mouseIsOverHUD = false
    },
    handleMouseMove: function(d) {
        if (gEmbedded) {
            return
        }
        var c = Math.abs(this.lastMouseX - d.clientX) + Math.abs(this.lastMouseY - d.clientY);
        if (c > 10) {
            debugMessage(kDebugDisplayManager_HandleMouseMove, "mousemove event received, check to see if the HUD showing...");
            if (this.hudIsShowing == false) {
                this.showHUD()
            } else {
                this.setTimeoutForHUD()
            }
        } else {
            debugMessage(kDebugDisplayManager_HandleMouseMove, "mousemove event received, but mouse hasn't moved far enough, ignoring...")
        }
        this.lastMouseX = d.clientX;
        this.lastMouseY = d.clientY
    },
    handleMouseOut: function(b) {
        debugMessage(kDebugDisplayManager_HandleMouseOut, "mouse has left the building, hide the HUD...");
        this.hideHUD()
    },
    updateSlideNumber: function(e, f) {
        var g = "";
        var h = null;
        if (gMode == kModeDesktop) {
            if (gEmbedded) {
                g = e + " / " + f;
                h = this.embeddedSlideCounter
            } else {
                g = "<font color='#FFFFFF'>" + kSlideLabel + " " + e + " / " + f + "</font>";
                h = this.hudSlideCounter
            }
        } else {
            g = kSlideLabel + " " + e + "/" + f;
            h = this.slideCounter
        }
        debugMessage(kDebugDisplayManager_UpdateSlideNumber, "updating slide number text to: " + g);
        h.innerHTML = g
    },
    setEmbeddedRestartButtonEnabled: function(d) {
        if (gEmbedded == false) {
            return
        }
        var c = "";
        if (d) {
            debugMessage(kDebugDisplayManager_SetEmbeddedRestartButtonEnabled, "enabling restart button...");
            c = "embeddedControls_Restart_Enabled"
        } else {
            debugMessage(kDebugDisplayManager_SetEmbeddedRestartButtonEnabled, "disabling restart button...");
            c = "embeddedControls_Restart_Disabled"
        }
        this.embeddedRestartButton.setAttribute("class", c)
    },
    setHudMuteButtonState: function(g) {
        if (gMode == kModeMobile) {
            return
        }
        debugMessage(kDebugDisplayManager_SetHudMuteButtonState, "determining cursor and icon based on state...");
        var h = "";
        var f = "";
        if (g & kMuteButtonState_Muted) {
            if (gEmbedded) {
                h = static_url("assets/player/control_sound-off_N.png")
            } else {
                h = static_url("snd_off_n.png")
            }
        } else {
            if (gEmbedded) {
                h = static_url("assets/player/control_sound-on_N.png")
            } else {
                h = static_url("snd_on_n.png")
            }
        }
        f = "pointer";
        debugMessage(kDebugDisplayManager_SetHudMuteButtonState, "cursorStyle: " + f + " iconUrl: " + h);
        var e = (gEmbedded ? this.embeddedMuteButton: this.hudMuteButton);
        e.style.cursor = f;
        e.style.backgroundImage = "url(" + h + ")"
    },
    isInfoPanelShowing: function() {
        return this.infoPanelIsShowing
    },
    handleShowSizeDidChangeEvent: function(b) {
        this.showWidth = b.memo.width;
        this.showHeight = b.memo.height;
        debugMessage(kDebugDisplayManager_HandleShowSizeDidChangeEvent, "width: " + this.showWidth + " height: " + this.showHeight);
        this.layoutDisplay()
    },
    handleOrientationDidChangeEvent: function(c) {
        debugMessage(kDebugDisplayManager_HandleOrientationDidChangeEvent, "now: " + c.memo.orientation);
        this.orientation = c.memo.orientation;
        if (this.infoPanelIsShowing && this.orientation == kOrientationLandscape) {
            this.hideInfoPanel()
        }
        var d = this;
        setTimeout(function() {
            d.handleOrientationDidChangeEvent_partTwo()
        },
        300)
    },
    handleOrientationDidChangeEvent_partTwo: function() {
        this.layoutDisplay();
        if (this.inLaunchMode == false) {
            debugMessage(kDebugDisplayManager_LayoutDisplay, "- now that all controls are in position, show applicable ones...");
            this.showApplicableControls()
        } else {
            debugMessage(kDebugDisplayManager_LayoutDisplay, "- all controls are in position, but we're still starting up, so keep them hidden")
        }
        if (gMode == kModeDesktop) {
            this.positionHUD()
        }
    },
    positionHUD: function() {
        if (gEmbedded) {
            return
        }
        var g = (this.usableDisplayWidth - kWidthOfHUD) / 2;
        var f = this.usableDisplayHeight - this.stageAreaHeight - this.stageAreaTop;
        var e = (f - kHeightOfHUD) / 2;
        var h = this.stageAreaTop + this.stageAreaHeight + e;
        debugMessage(kDebugDisplayManager_PositionHUD, "left: " + g + " top: " + h);
        this.hud.style.left = g + "px";
        this.hud.style.top = h + "px"
    },
    setTimeoutForHUD: function() {
        if (this.hudTimeout) {
            clearTimeout(this.hudTimeout)
        }
        var b = this;
        this.hudTimeout = setTimeout(function() {
            b.handleTimeoutForHUD()
        },
        kTimeoutValueForHUD)
    },
    handleTimeoutForHUD: function() {
        if (this.mouseIsOverHUD) {
            debugMessage(kDebugDisplayManager_HandleTimeoutForHUD, "no mouse movement, but mouse is over HUD, so don't hide it...")
        } else {
            debugMessage(kDebugDisplayManager_HandleTimeoutForHUD, "no mouse movement, hiding HUD...");
            this.hideHUD()
        }
    },
    showHUD: function() {
        if (gEmbedded) {
            debugMessage(kDebugDisplayManager_ShowHUD, "in embedded mode, do NOT display HUD...");
            return
        }
        if (this.inLaunchMode) {
            debugMessage(kDebugDisplayManager_ShowHUD, "in launch mode, do NOT display HUD...");
            return
        }
        debugMessage(kDebugDisplayManager_ShowHUD);
        this.positionHUD();
        this.hud.style.setProperty(kTransitionPropertyName, kOpacityPropertyName);
        this.hud.style.setProperty(kTransitionDurationName, "500ms");
        this.hud.style.opacity = "1";
        this.hudIsShowing = true;
        this.setTimeoutForHUD()
    },
    hideHUD: function() {
        debugMessage(kDebugDisplayManager_HideHUD);
        this.hud.style.opacity = "0";
        this.hudIsShowing = false
    },
    updateUsableDisplayArea: function() {
        if (gMode == kModeMobile) {
            var b = gIpad;
            if (this.orientation == kOrientationLandscape) {
                this.usableDisplayWidth = (b ? kiPadDeviceHeight: kiPhoneDeviceHeight);
                this.usableDisplayHeight = (b ? kiPadDeviceWidth: kiPhoneDeviceWidth) - kiPhoneStatusBarHeight - kiPhoneLandscapeButtonBarHeight - (b ? (kiPadAddressBarHeight + kiPadBookmarksBarHeight) : 0)
            } else {
                this.usableDisplayWidth = (b ? kiPadDeviceWidth: kiPhoneDeviceWidth);
                this.usableDisplayHeight = (b ? kiPadDeviceHeight: kiPhoneDeviceHeight) - kiPhoneStatusBarHeight - kiPhonePortraitButtonBarHeight - (b ? kiPadBookmarksBarHeight + 10: 0)
            }
        } else {
            this.usableDisplayWidth = window.innerWidth;
            this.usableDisplayHeight = window.innerHeight
        }
    },
    clearLaunchMode: function() {
        debugMessage(kDebugDisplayManager_ClearLaunchMode);
        this.inLaunchMode = false;
        debugMessage(kDebugDisplayManager_ClearLaunchMode, "- Add/remove border and shadow on stage area based on platform");
        var b = this;
        runInNextEventLoop(function() {
            b.showAll()
        })
    },
    positionWaitingIndicator: function() {
        var h = 110;
        var e = 32;
        var f;
        var g;
        if (gMode == kModeMobile && this.orientation == kOrientationUnknown) {
            debugMessage(kDebugDisplayManager_PositionWaitingIndicator, "we're in unknown orientation mode, hiding waiting bezel...");
            f = 1000;
            g = 1000
        } else {
            if (gMode == kModeMobile && this.orientation == kOrientationPortrait) {
                debugMessage(kDebugDisplayManager_PositionWaitingIndicator, "we're in portrait mode, centering waiting bezel over vertical center line...");
                f = (this.usableDisplayWidth - h) / 2;
                if (gIpad == false) {
                    g = kMobilePortraitModeVerticalCenterLine - (h / 2)
                } else {
                    g = kPadPortraitModeVerticalCenterLine - (h / 2)
                }
            } else {
                debugMessage(kDebugDisplayManager_PositionWaitingIndicator, "we're in landscape mode, centering waiting bezel over display...");
                f = (this.usableDisplayWidth - h) / 2;
                g = (this.usableDisplayHeight - h) / 2
            }
        }
        debugMessage(kDebugDisplayManager_PositionWaitingIndicator, "y = " + g);
        setElementPosition(this.waitingIndicator, g, f, h, h)
    },
    hideWaitingIndicator: function() {
        debugMessage(kDebugDisplayManager_HideWaitingIndicator);
        this.waitingIndicator.style.display = "none"
    },
    showWaitingIndicator: function() {},
    showInfoPanel: function() {
        debugMessage(kDebugDisplayManager_ShowInfoPanel, "url: " + window.location.href);
        var l = getUrlParameter("a");
        var k = decodeURIComponent(getUrlParameter("d"));
        var j = getUrlParameter("u");
        var m = getUrlParameter("p");
        debugMessage(kDebugDisplayManager_ShowInfoPanel, "authorId: '" + l + "', documentName: " + k + "', username: '" + j + "', password: '" + m + "'");
        debugMessage(kDebugDisplayManager_ShowInfoPanel, "issuing aync request for document info...");
        var i = this;
        var n = new DocumentInfo(l, k, j, m);
        var h = {
            onSuccess: function(a) {
                i.documentInfoDidLoad(a)
            },
            onError: function(a) {
                i.documentInfoDidNotLoad(a)
            }
        };
        n.getInfo(h)
    },
    documentInfoDidLoad: function(b) {
        debugMessage(kDebugDisplayManager_DocumentInfoDidLoad);
        debugMessage(kDebugDisplayManager_DocumentInfoDidLoad, "-     authorImage: " + b.authorImage);
        debugMessage(kDebugDisplayManager_DocumentInfoDidLoad, "- authorFirstName: " + b.authorFirstName);
        debugMessage(kDebugDisplayManager_DocumentInfoDidLoad, "-  authorLastName: " + b.authorLastName);
        debugMessage(kDebugDisplayManager_DocumentInfoDidLoad, "-    documentName: " + b.documentTitle);
        debugMessage(kDebugDisplayManager_DocumentInfoDidLoad, "-     publishDate: " + b.date);
        this.showInfoPanel_partTwo(b)
    },
    documentInfoDidNotLoad: function(b) {
        debugWarning(kDebugDisplayManager_DocumentInfoDidNotLoad)
    },
    showInfoPanel_partTwo: function(h) {
        if (this.infoPanelIsShowing) {
            debugMessage(kDebugDisplayManager_ShowInfoPanel, "already showing, nothing to do");
            return
        }
        if (kIsPublicViewer) {
            debugMessage(kDebugDisplayManager_ShowInfoPanel, "kIsPublicViewer is true")
        } else {
            debugMessage(kDebugDisplayManager_ShowInfoPanel, "kIsPublicViewer is false")
        }
        debugMessage(kDebugDisplayManager_ShowInfoPanel);
        debugMessage(kDebugDisplayManager_ShowInfoPanel, "- generating url for avatar image....");
        this.avatar.src = h.authorImage;
        var g = document.getElementById("documentName");
        g.innerHTML = h.documentTitle;
        var e = h.documentTitle.length;
        while (g.offsetWidth > 264) {
            e--;
            debugMessage(kDebugDisplayManager_ShowInfoPanel, "truncating document name to " + e + " chars because it too long...");
            h.documentTitle = h.documentTitle.substring(0, e) + "...";
            g.innerHTML = h.documentTitle
        }
        debugMessage(kDebugDisplayManager_ShowInfoPanel, "assigning values to info panel elements...");
        document.getElementById("documentPublisherName").innerHTML = h.authorFirstName + " " + h.authorLastName;
        document.getElementById("documentPublisherEmailLink").href = "mailto:" + h.authorEmail;
        document.getElementById("documentPublisherEmailText").innerHTML = h.authorEmail;
        document.getElementById("publishDate").innerHTML = h.date;
        this.infoPanelIsShowing = true;
        debugMessage(kDebugDisplayManager_ShowInfoPanel, "start the animation...");
        showElement(this.infoPanel);
        this.infoPanel.style.opacity = 1;
        this.infoPanel.style.setProperty(kAnimationNamePropertyName, "moveInfoPanelIn");
        this.infoPanel.style.setProperty(kAnimationDurationPropertyName, "5s");
        this.infoPanel.style.setProperty("-webkit-animation-iteration-count", "5");
        hideElement(this.stageArea);
        setElementTransparent(this.helpText);
        setElementTransparent(this.previousButton);
        setElementTransparent(this.nextButton);
        setElementTransparent(this.slideCounter);
        setElementTransparent(this.infoPanelIcon);
        var f = this;
        runInNextEventLoop(function() {
            f.showInfoPanel_partThree()
        })
    },
    showInfoPanel_partThree: function() {
        this.savedStageAreaWidth = this.stageArea.style.width;
        this.stageArea.style.width = 0
    },
    hideInfoPanel: function() {
        if (this.infoPanelIsShowing == false) {
            debugMessage(kDebugDisplayManager_HideInfoPanel, "not currently showing, nothing to do");
            return
        }
        debugMessage(kDebugDisplayManager_HideInfoPanel);
        this.infoPanelIsShowing = false;
        if (this.stageArea == null) {
            debugMessage(kDebugDisplayManager_HideInfoPanel, "- ACK! the stageArea is null")
        }
        debugMessage(kDebugDisplayManager_HideInfoPanel, "- show the stageArea");
        showElement(this.stageArea);
        this.stageArea.style.width = this.savedStageAreaWidth;
        hideElement(this.infoPanel);
        setElementOpaque(this.helpText);
        setElementOpaque(this.previousButton);
        setElementOpaque(this.nextButton);
        setElementOpaque(this.slideCounter);
        setElementOpaque(this.infoPanelIcon)
    },
    convertDisplayCoOrdsToShowCoOrds: function(g) {
        var e = {};
        debugMessage(kDebugDisplayManager_ConvertDisplayCoOrdsToShowCoOrds, " displayCoOrds: (" + g.pointX + "," + g.pointY + ")");
        var h = this.stageAreaLeft + this.stageAreaWidth;
        var f = this.stageAreaTop + this.stageAreaHeight;
        if ((g.pointX < this.stageAreaLeft) || (g.pointX > h) || (g.pointY < this.stageAreaTop) || (g.pointY > f)) {
            e.pointX = -1;
            e.pointY = -1
        } else {
            e.pointX = ((g.pointX - this.stageAreaLeft) / this.stageAreaWidth) * this.showWidth;
            e.pointY = ((g.pointY - this.stageAreaTop) / this.stageAreaHeight) * this.showHeight
        }
        debugMessage(kDebugDisplayManager_ConvertDisplayCoOrdsToShowCoOrds, " showCoOrds: (" + e.pointX + "," + e.pointY + ")");
        return e
    },
    layoutDisplay: function() {
        debugMessage(kDebugDisplayManager_LayoutDisplay);
        debugMessage(kDebugDisplayManager_LayoutDisplay, "Step 1: Determine display area dimensions...");
        this.updateUsableDisplayArea();
        debugMessage(kDebugDisplayManager_LayoutDisplay, "-  this.usableDisplayWidth: " + this.usableDisplayWidth);
        debugMessage(kDebugDisplayManager_LayoutDisplay, "- this.usableDisplayHeight: " + this.usableDisplayHeight);
        debugMessage(kDebugDisplayManager_LayoutDisplay, "Step 2: Determine maximum stage size within display area based on platform and orientation...");
        var w;
        var C;
        if (gMode == kModeDesktop) {
            w = this.usableDisplayWidth;
            if (gEmbedded) {
                w -= 2 * kEmbeddedShow_BorderWidth;
                C = this.usableDisplayHeight - kEmbeddeControlBar_GapBelowShow - kEmbeddedControlBar_Height
            } else {
                C = this.usableDisplayHeight - kHeightOfHUD - 2 * kMinGapBetweenStageAndHUD;
                if (w > this.showWidth || C > C) {
                    w = this.showWidth;
                    C = C
                }
            }
        } else {
            if (gIpad == false) {
                if (this.orientation == kOrientationPortrait) {
                    w = this.usableDisplayWidth - 2 * kMobilePortraitModeHorizontalMargin;
                    C = kMobilePortraitModeMaxStageHeight
                } else {
                    w = this.usableDisplayWidth - 2 * kMobileLandscapeModeHorizontallMargin;
                    C = this.usableDisplayHeight - 2 * kMobileLandscapeModeVerticalMargin
                }
            } else {
                if (this.orientation == kOrientationPortrait) {
                    w = this.usableDisplayWidth - 2 * kPadPortraitModeHorizontalMargin;
                    C = kPadPortraitModeMaxStageHeight
                } else {
                    w = this.usableDisplayWidth - 2 * kPadLandscapeModeHorizontallMargin;
                    C = this.usableDisplayHeight - 2 * kPadLandscapeModeVerticalMargin
                }
            }
        }
        if ((gMode == kModeDesktop) && (gEmbedded)) {
            this.stageAreaWidth = Math.ceil(w);
            this.stageAreaHeight = Math.ceil(w * this.showHeight / this.showWidth)
        } else {
            var y = scaleSizeWithinSize(this.showWidth, this.showHeight, w, C);
            this.stageAreaWidth = Math.ceil(y.width);
            this.stageAreaHeight = Math.ceil(y.height)
        }
        debugMessage(kDebugDisplayManager_LayoutDisplay, "-        maxStageWidth: " + w);
        debugMessage(kDebugDisplayManager_LayoutDisplay, "-       maxStageHeight: " + C);
        debugMessage(kDebugDisplayManager_LayoutDisplay, "-  this.stageAreaWidth: " + this.stageAreaWidth);
        debugMessage(kDebugDisplayManager_LayoutDisplay, "- this.stageAreaHeight: " + this.stageAreaHeight);
        debugMessage(kDebugDisplayManager_LayoutDisplay, "Step 3: Position the stage...");
        this.stageAreaLeft = (this.usableDisplayWidth - this.stageAreaWidth) / 2;
        if (gMode == kModeDesktop) {
            if (gEmbedded) {
                this.stageAreaTop = kEmbeddedShow_BorderWidth
            } else {
                this.stageAreaTop = (C - this.stageAreaHeight) / 2
            }
        } else {
            if (this.orientation == kOrientationPortrait) {
                if (gIpad == false) {
                    this.stageAreaTop = Math.max(10, kMobilePortraitModeVerticalCenterLine - (this.stageAreaHeight / 2))
                } else {
                    this.stageAreaTop = Math.max(10, kPadPortraitModeVerticalCenterLine - (this.stageAreaHeight / 2))
                }
            } else {
                this.stageAreaTop = (this.usableDisplayHeight - this.stageAreaHeight) / 2
            }
        }
        setElementPosition(this.stageArea, this.stageAreaTop, this.stageAreaLeft, this.stageAreaWidth, this.stageAreaHeight);
        var J = -1;
        var M = -1;
        var x = -1;
        var G = -1;
        var N = null;
        if (gMode == kModeDesktop) {
            N = false;
            if (gEmbedded) {
                J = this.stageAreaWidth - 0;
                M = this.stageAreaHeight - 0;
                x = 0;
                G = 0
            } else {
                J = -1;
                M = -1;
                x = 0;
                G = 0
            }
        } else {
            N = true;
            x = 0;
            G = 0;
            if (gIpad) {
                M = kiPadDeviceHeight
            } else {
                M = kiPhoneDeviceHeight
            }
            J = M
        }
        var u = document.getElementById("background");
        u.style.top = x;
        u.style.left = G;
        u.style.width = J;
        u.style.height = M;
        debugMessage(kDebugDisplayManager_LayoutDisplay, "-   this.stageAreaTop: " + this.stageAreaTop);
        debugMessage(kDebugDisplayManager_LayoutDisplay, "-  this.stageAreaLeft: " + this.stageAreaLeft);
        debugMessage(kDebugDisplayManager_LayoutDisplay, "Step 4: Calculate size and position of 'spacers'...");
        var H = {
            x: 0,
            y: 0,
            width: this.usableDisplayWidth,
            height: this.stageAreaTop
        };
        var K = {
            x: 0,
            y: this.stageAreaTop + this.stageAreaHeight,
            width: this.usableDisplayWidth,
            height: this.usableDisplayHeight - this.stageAreaTop - this.stageAreaHeight
        };
        var z = {
            x: 0,
            y: this.stageAreaTop,
            width: this.stageAreaLeft,
            height: this.stageAreaHeight
        };
        var F = {
            x: this.stageAreaLeft + this.stageAreaWidth,
            y: this.stageAreaTop,
            width: this.usableDisplayWidth - this.stageAreaWidth - z.width,
            height: this.stageAreaHeight
        };
        debugMessage(kDebugDisplayManager_LayoutDisplay, "Step 5: Position controls...");
        var B = document.getElementById("statisticsDisplay");
        if (this.showStatisticsDisplay && gIpad && this.orientation == kOrientationPortrait) {
            setElementPosition(B, K.y + 70, 0, this.usableDisplayWidth, K.height - 105);
            B.style.visibility = "visible"
        } else {}
        if (gMode == kModeDesktop) {
            if (gEmbedded) {
                debugMessage(kDebugDisplayManager_LayoutDisplay, "- we're embedded, all controls are hidden, we use the control bar instead...");
                this.embeddedControlBar.style.top = this.stageAreaHeight + kEmbeddedShow_BorderWidth + kEmbeddeControlBar_GapBelowShow;
                this.embeddedControlBar.style.left = 0;
                this.embeddedControlBar.style.width = this.usableDisplayWidth;
                this.embeddedControlBar.style.height = kEmbeddedControlBar_Height;
                this.embeddedControlBarBezel_Filler.style.width = this.usableDisplayWidth - 2 * kEmbeddeControlBar_EndCapWidth;
                this.embeddedControlBarBezel_RightEndCap.style.left = this.usableDisplayWidth - kEmbeddeControlBar_EndCapWidth;
                var D = this.stageAreaWidth / 2;
                this.embeddedPreviousButton.style.left = D - kEmbeddedControlBar_SlideCounterWidth / 2 - kEmbeddedControlBar_ButtonWidth;
                this.embeddedNextButton.style.left = D + kEmbeddedControlBar_SlideCounterWidth / 2;
                this.embeddedSlideCounterSection.style.left = D - kEmbeddedControlBar_SlideCounterWidth / 2;
                this.embeddedMuteButton.style.left = this.stageAreaWidth - (kEmbeddedControlBar_ButtonWidth * 2)
            } else {
                debugMessage(kDebugDisplayManager_LayoutDisplay, "- we're on the desktop, all controls are hidden, we use the HUD instead, so nothing to position")
            }
        } else {
            if (this.orientation == kOrientationPortrait) {
                debugMessage(kDebugDisplayManager_LayoutDisplay, "- we're on the iPhone in portrait mode, position all controls below stage...");
                var A = kNavigationArrowSize + 2 * kMobilePortraitModeNavigationAreaSideMargin;
                var I = kNavigationArrowSize + 2 * kStageToNavigationAreaGap;
                var v = this.usableDisplayWidth - 2 * A;
                var L = K.y + 7;
                setElementPosition(this.previousButton, L, 0, A, I);
                setElementPosition(this.slideCounter, L + kStageToNavigationAreaGap, A, v, I);
                setElementPosition(this.nextButton, L, A + v - 5, A, I);
                setElementPosition(this.helpText, K.y + K.height - kHelpAreaToBottomGap - kHelpAreaHeight, 0, this.usableDisplayWidth, kHelpAreaHeight);
                setElementPosition(this.infoPanelIcon, this.usableDisplayHeight - kInfoPanelButtonHeight, this.usableDisplayWidth - kInfoPanelButtonWidth - 5, kInfoPanelButtonWidth, kInfoPanelButtonHeight)
            } else {
                var E = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
                if (z.width > kMobileLandscapeModeMinSideSpacerWidth) {
                    debugMessage(kDebugDisplayManager_LayoutDisplay, "- we're on the iPhone in landscape mode, position next/prev controls to left/right of stage...");
                    setElementRect(this.previousButton, z);
                    setElementRect(this.nextButton, F)
                } else {
                    debugMessage(kDebugDisplayManager_LayoutDisplay, "- we're on the iPhone in landscape mode, but there is no room for next/prev controls to left/right of stage...");
                    setElementRect(this.previousButton, E);
                    setElementRect(this.nextButton, E)
                }
                setElementRect(this.slideCounter, E);
                setElementRect(this.helpText, E);
                setElementRect(this.infoPanelIcon, E)
            }
        }
        debugMessage(kDebugDisplayManager_LayoutDisplay, "Step 7: Position info panel");
        setElementPosition(this.infoPanel, (gIpad ? kPadPortraitModeVerticalCenterLine: kMobilePortraitModeVerticalCenterLine) - (kInfoPanelHeight / 2), (this.usableDisplayWidth - kInfoPanelWidth) / 2, kInfoPanelWidth, kInfoPanelHeight);
        this.positionWaitingIndicator();
        this.hideAddressBar();
        document.fire(kStageSizeDidChangeEvent, {
            left: this.stageAreaLeft,
            top: this.stageAreaTop,
            width: this.stageAreaWidth,
            height: this.stageAreaHeight
        })
    },
    showApplicableControls: function() {
        if (this.inLaunchMode == true) {
            debugMessage(kDebugDisplayManager_ShowApplicableControls, "- we're still starting up, hide all controls until we're ready to start the show...");
            hideElement(this.previousButton);
            hideElement(this.nextButton);
            hideElement(this.slideCounter);
            hideElement(this.helpText);
            hideElement(this.infoPanelIcon)
        } else {
            if (gMode == kModeDesktop) {
                debugMessage(kDebugDisplayManager_ShowApplicableControls, "- we're on the desktop, hide all controls, we use the HUD instead...");
                hideElement(this.previousButton);
                hideElement(this.nextButton);
                hideElement(this.slideCounter);
                hideElement(this.helpText);
                hideElement(this.infoPanelIcon);
                if (gEmbedded) {
                    debugMessage(kDebugDisplayManager_ShowApplicableControls, "- we're in embed mode, show the control bar...");
                    //this.embeddedControlBar.style.display = "block"
                }
            } else {
                if (this.orientation == kOrientationPortrait) {
                    debugMessage(kDebugDisplayManager_ShowApplicableControls, "- we're on the iPhone in portrait mode, show all controls...");
                    showElement(this.previousButton);
                    showElement(this.nextButton);
                    showElement(this.slideCounter);
                    showElement(this.helpText);
                    showElement(this.infoPanelIcon)
                } else {
                    hideElement(this.slideCounter);
                    hideElement(this.helpText);
                    hideElement(this.infoPanelIcon);
                    if (this.stageAreaLeft > kMobileLandscapeModeMinSideSpacerWidth) {
                        debugMessage(kDebugDisplayManager_ShowApplicableControls, "- we're on the iPhone in landscape mode, only show next/prev controls...");
                        showElement(this.previousButton);
                        showElement(this.nextButton)
                    } else {
                        debugMessage(kDebugDisplayManager_ShowApplicableControls, "- we're on the iPhone in landscape mode, but there's no room for next/prev controls");
                        hideElement(this.previousButton);
                        hideElement(this.nextButton)
                    }
                }
            }
        }
        this.hideAddressBar()
    },
    showAll: function() {
        this.hideWaitingIndicator();
        var b = this;
        setTimeout(function() {
            b.showAll_partTwo()
        },
        100)
    },
    showAll_partTwo: function() {
        if (gDevice == kDeviceMobile) {
            window.scrollTo(0, 1);
            var b = this;
            setTimeout(function() {
                b.showAll_partThree()
            },
            100)
        } else {
            this.showAll_partThree()
        }
    },
    showAll_partThree: function() {
        if (this.inLaunchMode == false) {
            this.showApplicableControls()
        }
        showElement(this.stageArea);
        /*var b = navigator.userAgent.match(/Windows/);
        if (b) {
            if (gEmbedded) {
                window.parent.EmbedController.triggerReflow()
            } else {
                gShowController.delegate.triggerReflow()
            }
        }*/
        showElement(this.hyperlinkPlane);
        if (gMode == kModeMobile) {
            showElement(this.infoPanelIcon)
        }
    },
    setPreviousButtonEnabled: function(b) {
        if (this.hyperlinksOnly) {
            return
        }
        if (gMode == kModeDesktop) {
            if (b) {
                if (gEmbedded) {
                    debugMessage(kDebugDisplayManager_SetPreviousButtonEnabled, "enabling previous button on embedded control bar...");
                    this.embeddedPreviousButton.setAttribute("class", "embeddedControls_Previous_Enabled")
                } else {
                    debugMessage(kDebugDisplayManager_SetPreviousButtonEnabled, "enabling previous button on hud...");
                    this.hudPreviousButton.setAttribute("class", "hudPreviousButtonEnabled")
                }
            } else {
                if (gEmbedded) {
                    debugMessage(kDebugDisplayManager_SetPreviousButtonEnabled, "disabling previous button on embedded control bar...");
                    this.embeddedPreviousButton.setAttribute("class", "embeddedControls_Previous_Disabled")
                } else {
                    debugMessage(kDebugDisplayManager_SetPreviousButtonEnabled, "disabling previous button on hud...");
                    this.hudPreviousButton.setAttribute("class", "hudPreviousButtonDisabled")
                }
            }
        } else {
            if (b) {
                debugMessage(kDebugDisplayManager_SetPreviousButtonEnabled, "enabling previous button on iphone...");
                this.previousButton.setAttribute("class", "previousButtonEnabled")
            } else {
                debugMessage(kDebugDisplayManager_SetPreviousButtonEnabled, "disabling previous button on iphone...");
                this.previousButton.setAttribute("class", "previousButtonDisabled")
            }
        }
    },
    setNextButtonEnabled: function(b) {
        if (this.hyperlinksOnly) {
            return
        }
        if (gMode == kModeDesktop) {
            if (b) {
                if (gEmbedded) {
                    debugMessage(kDebugDisplayManager_SetNextButtonEnabled, "enabling next button on embedded control bar...");
                    this.embeddedNextButton.setAttribute("class", "embeddedControls_Next_Enabled")
                } else {
                    debugMessage(kDebugDisplayManager_SetNextButtonEnabled, "enabling next button on hud...");
                    this.hudNextButton.setAttribute("class", "hudNextButtonEnabled")
                }
            } else {
                if (gEmbedded) {
                    debugMessage(kDebugDisplayManager_SetNextButtonEnabled, "disabling next button on embedded control bar...");
                    this.embeddedNextButton.setAttribute("class", "embeddedControls_Next_Disabled")
                } else {
                    debugMessage(kDebugDisplayManager_SetNextButtonEnabled, "disabling next button on hud...");
                    this.hudNextButton.setAttribute("class", "hudNextButtonDisabled")
                }
            }
        } else {
            if (b) {
                debugMessage(kDebugDisplayManager_SetNextButtonEnabled, "enabling next button on iphone...");
                this.nextButton.setAttribute("class", "nextButtonEnabled")
            } else {
                debugMessage(kDebugDisplayManager_SetNextButtonEnabled, "disabling next button on iphone...");
                this.nextButton.setAttribute("class", "nextButtonDisabled")
            }
        }
    },
    hideAddressBar: function() {
        if (this.inLaunchMode) {
            return
        }
        if (gDevice == kDeviceMobile) {
            var b = this;
            setTimeout("window.scrollTo( 0,1 );", this.initialAddressBarScrollPerformed ? 0: kHideAddressBarDelay);
            this.initialAddressBarScrollPerformed = true
        }
    }
});
function static_url(b) {
    window.console.log("1 static_url: ", b);
    return b
}
var kStageIsReadyEvent = "StageManager:StageIsReadyEvent";
var StageManager = Class.create({
    initialize: function(e, f) {
        debugMessage(kDebugStageManager_Initialize, "adding event listeners for show & stage size change events...");
        var d = this;
        document.observe(kShowSizeDidChangeEvent,
        function(a) {
            d.handleShowSizeDidChangeEvent(a)
        },
        false);
        document.observe(kStageSizeDidChangeEvent,
        function(a) {
            d.handleStageSizeDidChangeEvent(a)
        },
        false);
        this.textureManager = e;
        this.scriptManager = f;
        this.stage = document.getElementById("stage");
        this.hyperlinkPlane = document.getElementById("hyperlinkPlane");
        this.stageWidth = 0;
        this.stageHeight = 0;
        this.showWidth = 0;
        this.showHeight = 0;
        this.audioTrackOffset = 0;
        this.audioTrackIconSize = 0
    },
    removeTexture: function(b) {
        b.parentNode.removeChild(b)
    },
    addHyperlink: function(c) {
        debugMessage(kDebugStageManager_AddHyperlink, "creating div for hyperlink at " + c.x + "," + c.y + ", " + c.width + ", " + c.height);
        var d = document.createElement("div");
        d.setAttribute("class", "hyperlink");
        d.style.left = c.x;
        d.style.top = c.y;
        d.style.width = c.width;
        d.style.height = c.height;
        this.hyperlinkPlane.appendChild(d)
    },
    clearAllHyperlinks: function() {
        debugMessage(kDebugStageManager_ClearAllHyperlinks);
        var b;
        while (this.hyperlinkPlane.childNodes.length > 0) {
            this.hyperlinkPlane.removeChild(this.hyperlinkPlane.firstChild)
        }
        this.audioTrackOffset = this.audioTrackSpacer
    },
    handleStageSizeDidChangeEvent: function(b) {
        debugMessage(kDebugStageManager_HandleStageSizeDidChangeEvent, "now: " + b.memo.width + " X " + b.memo.height);
        this.stageWidth = b.memo.width;
        this.stageHeight = b.memo.height;
        debugMessage(kDebugStageManager_HandleStageSizeDidChangeEvent, "- adjust stage...");
        this.adjustStageToFit(this.stage);
        debugMessage(kDebugStageManager_HandleStageSizeDidChangeEvent, "- adjust hyperlink plane...");
        this.adjustStageToFit(this.hyperlinkPlane)
    },
    handleShowSizeDidChangeEvent: function(b) {
        debugMessage(kDebugStageManager_HandleShowSizeDidChangeEvent, "now: " + b.memo.width + " X " + b.memo.height);
        this.showWidth = b.memo.width;
        this.showHeight = b.memo.height;
        debugMessage(kDebugStageManager_HandleShowSizeDidChangeEvent, "- adjust stage...");
        this.adjustStageToFit(this.stage);
        debugMessage(kDebugStageManager_HandleShowSizeDidChangeEvent, "- adjust hyperlink plane...");
        this.adjustStageToFit(this.hyperlinkPlane);
        this.audioTrackIconSize = this.showHeight / 4;
        this.audioTrackSpacer = this.audioTrackIconSize / 4;
        this.audioTrackOffset = this.audioTrackSpacer
    },
    anyVideoElementsOnStage: function() {
        var b = document.getElementsByTagName("video");
        return b.length > 0
    },
    setMutedStateOnAllVideoElements: function(f) {
        debugMessage(kDebugStageManager_SetMutedStateOnAllVideoElements);
        var e = document.getElementsByTagName("video");
        if (e.length == 0) {
            debugMessage(kDebugStageManager_SetMutedStateOnAllVideoElements, "- there are no video elements on the stage right now");
            return
        }
        for (var g = 0; g < e.length; g++) {
            var h = e[g];
            debugMessage(kDebugStageManager_SetMutedStateOnAllVideoElements, "- " + g + ": " + h.id);
            h.muted = f
        }
    },
    adjustStageToFit: function(m) {
        if ((this.showWidth != 0) && (this.stageWidth != 0)) {
            setElementPosition(m, -1, -1, this.showWidth, this.showHeight);
            var k = this.stageHeight / this.showHeight;
            var j = this.stageWidth / this.showWidth;
            var n = 8;
            var i = n / 180 * Math.PI;
            var l = (this.showHeight / 2) / Math.tan(i);
			j = j*1.002;
			k = k*1.002;
            var h = "scaleX( " + j + " ) scaleY( " + k + " )";
            debugMessage(kDebugStageManager_AdjustStageToFit, "stageTransform: " + h);
            debugMessage(kDebugStageManager_AdjustStageToFit, "- perspective: " + l);
            m.style.setProperty(kTransformOriginPropertyName, kTransformOriginTopLeftPropertyValue);
            m.style.setProperty(kTransformPropertyName, h);
            m.style.setProperty(kPerspectivePropertyName, l);
            m.style.setProperty(kPerspectiveOriginPropertyName, kTransformOriginCenterPropertyValue);
            m.style.setProperty(kTransformStylePropertyName, kTransformStylePreserve3DPropertyValue);
            document.fire(kStageIsReadyEvent, {})
        }
    },
    debugRecursivelyWalkDomFrom: function(k, m) {
        var h = k.id;
        var l = k.nodeName.toLowerCase();
        debugMessage(kDebugStageManager_DebugRecursivelyWalkDomFrom, "- <" + l + "> id='" + h + "'");
        if (l == "#text") {
            return
        }
        if (l == "img") {
            var j = k.naturalWidth * k.naturalHeight;
            debugMessage(kDebugStageManager_DebugRecursivelyWalkDomFrom, "- " + k.naturalWidth + "x" + k.naturalHeight + " = " + j);
            m.numTextures++;
            m.numPixels += j;
            if (gIpad && k.src.match("480x268")) {
                m.numDegraded++
            }
            return
        }
        var i;
        for (i = 0; i < k.childNodes.length; i++) {
            var n = k.childNodes[i];
            this.debugRecursivelyWalkDomFrom(n, m)
        }
    },
    debugGetStageStatistics: function() {
        var b = {
            numTextures: 0,
            numPixels: 0,
            numDegraded: 0
        };
        this.debugRecursivelyWalkDomFrom(this.stage, b);
        return b
    },
    addPreviousEmphasisTransformDiv: function(l, m, j, k, n, o, p) {
        var i = document.createElement("div");
        i.setAttribute("id", j);
        i.style.top = 0;
        i.style.left = 0;
        i.style.width = k;
        i.style.height = n;
        i.style.position = kPositionAbsolutePropertyValue;
        i.style.setProperty(kTransformStylePropertyName, kTransformStylePreserve3DPropertyValue);
        if (o != "") {
            i.style.setProperty(kTransformOriginPropertyName, o)
        }
        if (i) {
            i.style.setProperty(kTransformPropertyName, p)
        }
        m.appendChild(i);
        debugMessage(kDebugStageManager_AddPreviousEmphasisTransformDiv, "- " + l + ": " + j + (p ? (" - ephasisTransform: " + p) : "") + ((o == "") ? "": " - origin: " + o));
        return i
    },
    resetMovieCount: function() {
        this.numMoviesInScene = 0
    },
    addTextureToStage: function(al, an, aD, aH, aT, aP, aN, ay, ap, a1, bf) {
        debugMessage(kDebugStageManager_AddTextureToStage);
        debugMessage(kDebugStageManager_AddTextureToStage, "---------------------------------------------------");
        debugMessage(kDebugStageManager_AddTextureToStage, "-        a d d T e x t u r e T o S t a g e        -");
        debugMessage(kDebugStageManager_AddTextureToStage, "---------------------------------------------------");
        debugMessage(kDebugStageManager_AddTextureToStage, "- textureId: " + an);
        var a8;
        var aF = "movieCanvasObject.";
        var au = an.indexOf(aF);
        if (au != -1) {
            a8 = gShowController.movieCanvasObjectIdToTextureIdTable[an];
            debugMessage(kDebugStageManager_AddTextureToStage, "- it's a movie, which use canvasObjectId, originalTextureId: " + a8)
        } else {
            a8 = an
        }
        var ai = escapeTextureId(an);
        var aw = escapeTextureId(a8);
        var ao = document.createElement("div");
        var bc = ao;
        var aE = gIpad ? a1.degrade: false;
        var a3 = this.textureManager.urlForTexture(a8, aE);
        var a4 = this.textureManager.urlForMovie(a8);
        var ba = (a4 != "");
        var ar = false;
        if (ba == true) {
            this.numMoviesInScene++
        }
        if ((ba == true) && (aH <= 1) && (aD <= 1)) {
            ar = true;
            aH = 0;
            aD = 0
        }
        var be;
        if (ar && gMode != kModeMobile) {
            aT = "hidden"
        }
        if (aT == "hidden") {
            be = 0
        } else {
            be = 1
        }
        debugMessage(kDebugStageManager_AddTextureToStage, "-    transform: " + ay);
        debugMessage(kDebugStageManager_AddTextureToStage, "-   textureUrl: " + a3);
        debugMessage(kDebugStageManager_AddTextureToStage, "-     movieUrl: " + (ba ? a4: "N/A"));
        debugMessage(kDebugStageManager_AddTextureToStage, "-  nativeWidth: " + aD);
        debugMessage(kDebugStageManager_AddTextureToStage, "- nativeHeight: " + aH);
        debugMessage(kDebugStageManager_AddTextureToStage, "-   visibility: " + aT + " (rootOpacity: " + be + ")");
        debugMessage(kDebugStageManager_AddTextureToStage, "-      opacity: " + aP);
        debugMessage(kDebugStageManager_AddTextureToStage, "-       zOrder: " + aN);
        debugMessage(kDebugStageManager_AddTextureToStage, "-    transform: " + ay);
        ao.setAttribute("id", ai + "-root");
        if (ar) {
            aD = this.audioTrackIconSize;
            aH = this.audioTrackIconSize;
            ay = "matrix( 1, 0, 0, 1, " + this.audioTrackOffset + ", " + (this.showHeight - this.audioTrackSpacer - this.audioTrackIconSize) + " )";
            debugMessage(kDebugStageManager_AddTextureToStage, "-    transform: " + ay + " (modified for audio track)");
            this.audioTrackOffset += (this.audioTrackIconSize + this.audioTrackSpacer)
        }
        ao.style.top = "0px";
        ao.style.left = "0px";
        ao.style.width = aD + "px";
        ao.style.height = aH + "px";
        ao.style.position = kPositionAbsolutePropertyValue;
        ao.style.opacity = be;
        ao.style.setProperty(kTransformPropertyName, ay);
        var aS = false;
        var aL = this.scriptManager.script.eventTimelines[al];
        if (aL) {
            var a9 = aL.eventAnimations[0];
            if (a9) {
                if (a9.animationType == "transition") {
                    aS = true
                }
            }
        }
        if (!aS) {
            ao.style.setProperty(kTransformStylePropertyName, kTransformStyleFlatPropertyValue)
        } else {
            ao.style.setProperty(kTransformStylePropertyName, kTransformStylePreserve3DPropertyValue)
        }
        ao.style.setProperty(kZIndexPropertyName, ar ? 100: aN);
        var ak = 0;
        debugMessage(kDebugStageManager_AddTextureToStage, "- adding '" + ai + "' - nesting in the following " + ap.length + " divs:");
        debugMessage(kDebugStageManager_AddTextureToStage, "- 0: " + ai + "-root");
        var aR = false;
        var av = false;
        var aU = false;
        for (var am = 0; am < ap.length; am++) {
            var aZ = ap[am];
            switch (aZ) {
            case "rotationEmphasis":
                aR = true;
                break;
            case "scaleEmphasis":
                av = true;
                break;
            case "translationEmphasis":
                aU = true;
                break;
            default:
                var a6 = ai + "-" + escapeTextureId(ap[am]);
                debugMessage(kDebugStageManager_AddTextureToStage, "- " + (++ak) + ": " + a6);
                var a5 = document.createElement("div");
                a5.setAttribute("id", a6);
                a5.style.top = 0;
                a5.style.left = 0;
                a5.style.width = aD;
                a5.style.height = aH;
                a5.style.position = kPositionAbsolutePropertyValue;
                a5.style.setProperty(kTransformStylePropertyName, kTransformStylePreserve3DPropertyValue);
                bc.appendChild(a5);
                bc = a5;
                break
            }
        }
        if (aU || a1.translationEmphasis) {
            var a6 = ai + "-translationEmphasis";
            var ax = "";
            var bg = "";
            var aB;
            if (aU) {
                debugMessage(kDebugStageManager_AddTextureToStage, "--- need to add a translationEmphasis div because we have an action build coming up...")
            } else {
                debugMessage(kDebugStageManager_AddTextureToStage, "--- need to add a translationEmphasis div because we have a pre-existing emphasisTransform we need to include...")
            }
            aB = a1.translationEmphasis;
            if (aB) {
                bg = "translateX(" + aB[0] + "px) translateY(" + aB[1] + "px) translateZ(" + aB[2] + "px)"
            }
            bc = this.addPreviousEmphasisTransformDiv(++ak, bc, a6, aD, aH, ax, bg)
        }
        if (av || a1.scaleEmphasis) {
            var a6 = ai + "-scaleEmphasis";
            var ax = av ? "": a1.scaleEmphasis[0] + " " + a1.scaleEmphasis[1] + " " + a1.scaleEmphasis[2];
            var bg = av ? "": "scale3d(" + a1.scaleEmphasis[3] + "," + a1.scaleEmphasis[4] + "," + a1.scaleEmphasis[5] + ")";
            bc = this.addPreviousEmphasisTransformDiv(++ak, bc, a6, aD, aH, ax, bg)
        }
        if (aR || a1.rotationEmphasis) {
            var a6 = ai + "-rotationEmphasis";
            var ax = aR ? "": a1.rotationEmphasis[0] + "px " + a1.rotationEmphasis[1] + "px";
            var bg = aR ? "": "rotate3d(" + a1.rotationEmphasis[3] + "," + a1.rotationEmphasis[4] + "," + a1.rotationEmphasis[5] + "," + a1.rotationEmphasis[6] + "rad)";
            bc = this.addPreviousEmphasisTransformDiv(++ak, bc, a6, aD, aH, ax, bg)
        }
        if (a1.opacityMultiplier) {
            ao.style.opacity = a1.opacityMultiplier;
            debugMessage(kDebugStageManager_AddTextureToStage, "- " + (++ak) + ": " + ai + "-root -  opacityMultiplier: " + a1.opacityMultiplier)
        }
        if (ar) {
            textureElement = document.createElement("img");
            if (gMode == kModeMobile) {
                debugMessage(kDebugStageManager_AddTextureToStage, "= since this is an audio track, and we're on a mobile device, we replace the textureUrl with the URL of the waiting_bezel");
                textureElement.src = static_url("waiting_bezel.png");
                aP = 1
            } else {
                debugMessage(kDebugStageManager_AddTextureToStage, "= since this is an audio track, and we're on the desktop, we replace the textureUrl with the URL of the nullImage");
                textureElement.src = static_url("nullImage.png");
                aP = 0
            }
        } else {
            textureElement = this.textureManager.getImageObjectForTexture(al, a8)
        }
        if (textureElement == null) {
            debugWarning(kDebugStageManager_AddTextureToStage, "textureElement returned from textureManager is null - must be a movie (" + an + ")")
        }
        textureElement.id = ai;
        var a2 = false;
        if (gIpad && this.numMoviesInScene > kiPadMaxMoviesPerScene) {
            debugMessage(kDebugStageManager_AddTextureToStage, "- we're on an iPad and we already have " + kiPadMaxMoviesPerScene + " movies in this scene, can't add any more...");
            a2 = true
        }
        if (ba && !a2) {
            debugMessage(kDebugStageManager_AddTextureToStage, "- it's " + (ar ? "an audio track": "a movie") + ". URL: " + a3);
            var aW;
            var aJ;
            var a0;
            var aG;
            var aj;
            var aO = ai + "-movieObject";
            a0 = 0;
            aG = 0;
            aj = "visible";
            if (ar && gMode == kModeMobile && !gIpad) {
                aW = 1;
                aJ = 1;
                a0 = 1000;
                aG = 1000
            } else {
                if (gPlayMoviesInPlace) {
                    aW = aD;
                    aJ = aH
                } else {
                    aW = 0;
                    aJ = 0;
                    aj = "hidden"
                }
            }
            if (gMoviesRespectTransforms) {
                aO = ai + "-movieObject"
            } else {
                aO = ai + "-movieObjectClone";
                a0 = 1000;
                aG = 1000
            }
            debugMessage(kDebugStageManager_AddTextureToStage, "- Movie Geometry: ");
            debugMessage(kDebugStageManager_AddTextureToStage, "-          top: " + a0);
            debugMessage(kDebugStageManager_AddTextureToStage, "-         left: " + aG);
            debugMessage(kDebugStageManager_AddTextureToStage, "-        width: " + aW);
            debugMessage(kDebugStageManager_AddTextureToStage, "-       height: " + aJ);
            debugMessage(kDebugStageManager_AddTextureToStage, "-   visibility: " + aj);
            if (bf == false) {
                debugMessage(kDebugStageManager_AddTextureToStage, "- using movieObjectId: '" + aO + "'");
                var a7 = document.createElement("video");
                a7.id = aO;
                a7.src = a4;
                a7.muted = gShowController.muted;
                a7.poster = a3;
                a7.style.visibility = aj;
                a7.style.position = kPositionAbsolutePropertyValue;
                a7.style.top = a0 + "px";
                a7.style.left = aG + "px";
                a7.style.width = aW + "px";
                a7.style.height = aJ + "px";
                a7.style.opacity = aP;
                if (gMode != kModeMobile) {
                    var bb = this.scriptManager.script.textures[a8];
                    debugMessage(kDebugStageManager_AddTextureToStage, "- textureInfo: " + bb);
                    debugMessage(kDebugStageManager_AddTextureToStage, "- textureInfo.movieVolume: " + bb.movieVolume);
                    var aq = bb.movieVolume;
                    var bd = bb.movieLooping;
                    if (aq) {
                        debugMessage(kDebugStageManager_AddTextureToStage, "- volume attribute supplied: " + aq);
                        a7.volume = aq
                    }
                    if (bd) {
                        debugMessage(kDebugStageManager_AddTextureToStage, "- looping supplied: " + bd);
                        if (bd != "none") {
                            a7.loop = "loop"
                        }
                    }
                }
                bc.appendChild(a7)
            }
        }
        textureElement.style.top = 0;
        textureElement.style.left = 0;
        textureElement.style.position = kPositionAbsolutePropertyValue;
        textureElement.style.width = aD;
        textureElement.style.height = aH;
        textureElement.style.opacity = aP;
        textureElement.style.setProperty(kBackfaceVisibilityPropertyName, kBackfaceVisibilityHiddenPropertyValue);
        if (bf == false) {
            bc.appendChild(textureElement)
        }
        if (ba && gMode == kModeMobile && !a2) {
            var aK = parseTransformMatrix(ay);
            var aM = 65;
            var aI = 32;
            var aC;
            var aQ;
            var az = 1;
            var aA = 1;
            var aX;
            if (ar) {
                aQ = aH / 2.5;
                aC = aQ * 24 / 21;
                aX = static_url("snd_on_n.png")
            } else {
                az = 1 / aK.scaleX;
                aA = 1 / aK.scaleY;
                if ((aH > aM) && (aD > aM)) {
                    aC = aM;
                    aQ = aM;
                    aX = static_url("play_badge.png")
                } else {
                    aC = aI;
                    aQ = aI;
                    aX = static_url("play_badge_sm.png")
                }
            }
            var aV = new Image();
            aV.id = aO + "-playBadge";
            aV.src = aX;
            aV.style.visibility = "visible";
            aV.style.position = kPositionAbsolutePropertyValue;
            aV.style.width = aC + "px";
            aV.style.height = aQ + "px";
            aV.style.left = (aD - aC) / 2 + "px";
            if (ar) {
                aV.style.top = (aH * 0.9 - aQ) / 2 + "px"
            } else {
                aV.style.top = (aH - aQ) / 2 + "px"
            }
            var aY = "matrix(" + az + ",0,0," + aA + ",0,0)";
            debugMessage(kDebugStageManager_AddTextureToStage, "- playBadgeTransform: " + aY);
            aV.style.setProperty(kTransformPropertyName, aY);
            bc.appendChild(aV);
            debugMessage(kDebugStageManager_AddTextureToStage, "- creating hyperlink over region: x: " + aK.x + ", y: " + aK.y + ", w: " + aD + ", h: " + aH);
            var at = {
                x: aK.x,
                y: aK.y,
                width: aD,
                height: aH
            };
            gShowController.addMovieHyperlink(at, "playMovie:" + aO)
        }
        debugMessage(kDebugStageManager_AddTextureToStage, "- adding rootDiv for this texture to stage...");
        if (bf == false) {
            this.stage.appendChild(ao)
        }
    }
});
var kKeyframeRule = window.CSSRule.KEYFRAMES_RULE;
var AnimationManager = Class.create({
    initialize: function() {
        this.styleSheet = document.styleSheets.item(0);
        this.ruleNumber = 0;
        this.createdAnimations = new Object()
    },
    findAnimation: function(e) {
        debugMessage(kDebugAnimationManager_FindAnimation, "looking for '" + e + "', there are " + this.styleSheet.cssRules.length + " rules on the sheet");
        var g;
        var f = this.styleSheet.cssRules.length;
        for (g = 0; g < f; g++) {
            debugMessage(kDebugAnimationManager_FindAnimation, "- " + g + ": " + this.styleSheet.cssRules[g].name);
            var h = this.styleSheet.cssRules[g];
            if ((h.type == kKeyframeRule) && (h.name == e)) {
                debugMessage(kDebugAnimationManager_FindAnimation, "- found it!");
                return h
            }
        }
        debugMessage(kDebugAnimationManager, kDebugFindAnimation, "- not found.");
        return null
    },
    createAnimation: function(b) {
        debugMessage(kDebugAnimationManager_CreateAnimation, b);
        this.styleSheet.insertRule("@-webkit-keyframes " + b + " {}");
        return this.findAnimation(b)
    },
    deleteAllAnimations: function() {
        debugMessage(kDebugAnimationManager_DeleteAllAnimations);
        var f;
        var e = this.styleSheet.cssRules.length;
        for (f = 0; f < e; f++) {
            var d = this.styleSheet.cssRules[f];
            if (d && d.type == kKeyframeRule) {
                debugMessage(kDebugAnimationManager_DeleteAllAnimations, "- " + f + ": " + d.name);
                this.styleSheet.deleteRule(d.name)
            }
        }
        this.createdAnimations = new Object()
    },
    markAnimationsCreated: function(b) {
        this.createdAnimations[b] = true
    },
    animationsCreated: function(b) {
        return this.createdAnimations[b]
    }
});
var cacheEntryUniqueId = 0;
var TextureManager = Class.create({
    initialize: function(c) {
        debugMessage(kDebugTextureManager_Initialize);
        var d = this;
        document.observe(kScriptDidDownloadEvent,
        function(a) {
            d.handleScriptDidDownloadEvent(a)
        },
        false);
        this.script = null;
        this.showUrl = c;
        this.sceneCache = {};
        this.numImageObjects = 0;
        this.numLoadFailures = 0;
        this.numOutstandingLoadRequests = 0;
        this.textureCount = 0
    },
    cacheEntryForScene: function(f, e) {
        if (f < initialScene || f > finalScene) {
            console.log("unnecessary cache");
            return
        }
        var d = this.sceneCache[f];
        if (d == null) {
            if (e) {
                debugMessage(kDebugTextureManager_CacheEntryForScene, "sceneIndex: " + f + " - not found, creating new entry...");
                this.sceneCache[f] = {
                    numPreloading: -1,
                    numLoaded: -2,
                    uniqueID: cacheEntryUniqueId++,
                    imageObjects: {}
                };
                d = this.sceneCache[f]
            }
        } else {
            debugMessage(kDebugTextureManager_CacheEntryForScene, "sceneIndex: " + f + " - found existing entry...")
        }
        return d
    },
    debugDumpCache: function() {
        debugMessageAlways(kDebugShowController_DiagnosticsDump, "-");
        debugMessageAlways(kDebugShowController_DiagnosticsDump, "- Texture Cache");
        debugMessageAlways(kDebugShowController_DiagnosticsDump, "---------------");
        for (var i in this.sceneCache) {
            var g = this.sceneCache[i];
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "- sceneIndex: " + i);
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-   numPreloading: " + g.numPreloading);
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-       numLoaded: " + g.numLoaded);
            debugMessageAlways(kDebugShowController_DiagnosticsDump, "-    isDownloaded: " + ((this.isScenePreloaded(i)) ? "yes": "no"));
            var j = g.imageObjects;
            var k = 0;
            if (j) {
                for (var l in j) {
                    var h = j[l];
                    debugMessageAlways(kDebugShowController_DiagnosticsDump, "-         " + (k++) + ": " + l + " - " + h.tagName + " - " + h.src)
                }
            } else {
                debugMessageAlways(kDebugShowController_DiagnosticsDump, "- imageSet for this cache entry is Undefined!")
            }
        }
    },
    scenesInCache: function() {
        var d = "";
        for (var c in this.sceneCache) {
            if (d != "") {
                d += ", "
            }
            d += c
        }
        return d
    },
    getCacheStatistics: function() {
        var k = {
            numScenes: 0,
            numTextures: 0,
            numPixels: 0,
            minTexturesPerScene: 0,
            maxTexturesPerScene: 0,
            averageNumTexturesPerScene: 0,
            minNumTexturesPerScene: 0,
            maxNumTexturesPerScene: 0
        };
        debugMessage(kDebugTextureManager_GetCacheStatistics, "begin iterating over cache...");
        for (var l in this.sceneCache) {
            var i = this.sceneCache[l];
            debugMessage(kDebugTextureManager_GetCacheStatistics, "- scene: " + l);
            k.numScenes++;
            var m = i.imageObjects;
            var n = 0;
            if (m) {
                debugMessage(kDebugTextureManager_GetCacheStatistics, "-  it has an imageSet, iterate over it...");
                for (var o in m) {
                    var j = m[o];
                    var p = j.naturalHeight * j.naturalWidth;
                    debugMessage(kDebugTextureManager_GetCacheStatistics, "-  textureId: " + o + " - " + j.naturalWidth + "x" + j.naturalHeight + " = " + p);
                    k.numPixels += p;
                    k.numTextures++
                }
            }
        }
        debugMessage(kDebugTextureManager_GetCacheStatistics, "- total of " + k.numTextures + " textures, " + k.numPixels + " pixels");
        return k
    },
    handleScriptDidDownloadEvent: function(b) {
        this.script = b.memo.script;
        debugMessage(kDebugTextureManager_HandleScriptDidDownloadEvent, "filename: " + this.script.filename)
    },
    preloadScenes: function(h) {
        debugMessage(kDebugTextureManager_PreloadScenes, "ensuring the cache contains the following scenes:");
        var i = 0;
        for (var j in h) {
            debugMessage(kDebugTextureManager_PreloadScenes, "- " + (i++) + ": " + j)
        }
        debugMessage(kDebugTextureManager_PreloadScenes, "- iterating over scenes currently in cache purging those not in above list...");
        i = 0;
        for (var j in this.sceneCache) {
            var l = h.hasOwnProperty(j);
            debugMessage(kDebugTextureManager_PreloadScenes, "- " + (i++) + ": " + j + " - " + (l ? "keep": "discard"));
            if (l == false) {
                var g = this.sceneCache[j];
                delete this.sceneCache[j]
            }
        }
        debugMessage(kDebugTextureManager_PreloadScenes, "- iterating over new list, loading those scene not already in the cache...");
        i = 0;
        for (var j in h) {
            var k = this.sceneCache.hasOwnProperty(j);
            debugMessage(kDebugTextureManager_PreloadScenes, "- " + (i++) + ": " + j + " - " + (k ? "already loaded": "loading..."));
            if (k == false) {
                this.loadScene(j)
            }
        }
    },
    loadScene: function(m) {
        debugMessage(kDebugTextureManager_LoadScene, "sceneIndex: " + m);
        kDebugPreloadScene = "";
        if (m < 0) {
            debugMessage(kDebugTextureManager_LoadScene, " - sceneIndex is less than 0, ignoring...");
            return
        } else {
            if (m > this.script.numScenes) {
                debugMessage(kDebugTextureManager_LoadScene, " - sceneIndex has gone off the end, ignoring...");
                return
            }
        }
        var w = this.cacheEntryForScene(m, true);
        var p = this.script.eventTimelines[m];
        var n = p.eventInitialStates;
        if (this.isScenePreloaded(m)) {
            debugMessageAlways(kDebugTextureManager_LoadScene, "- scene already preloaded, ignoring...");
            return
        } else {
            if (w.numPreloading != -1) {
                debugMessageAlways(kDebugTextureManager_LoadScene, " - we've already started a preload for scene " + m + ", ignoring...");
                return
            }
        }
        var v = n.length;
        var u = w.imageObjects;
        w.numPreloading = v;
        w.numLoaded = 0;
        for (var s = 0; s < v; s++) {
            var r = n[s];
            var x = r.texture;
            var t = gIpad ? r.degrade: false;
            var q = this.urlForTexture(x, t);
            debugMessage(kDebugTextureManager_LoadScene, "- textureId: " + x + " degrade: " + (t ? "yes": "no") + " textureUrl: " + q);
            var o = this.preloadTexture(m, x, q);
            u[x] = o;
            this.numOutstandingLoadRequests++
        }
        gShowController.displayManager.updateStatisticsDisplay()
    },
    unloadScene: function(c) {
        debugMessage(kDebugTextureManager_UnloadScene, "sceneIndex: " + c + " removing entry for this scene from cache...");
        if (this.sceneCache.hasOwnProperty(c)) {
            var d = this.sceneCache[c];
            delete this.sceneCache[c]
        } else {
            debugWarning(kDebugTextureManager_UnloadScene, "sceneIndex: " + c + " tried to remove entry for this scene from cache, but it did not exist.")
        }
    },
    isScenePreloaded: function(f) {
        var e = this.cacheEntryForScene(f, false);
        if (e == null) {
            debugMessage(kDebugTextureManager_IsScenePreloaded, "sceneIndex: " + f + " - there is no cache entry for this scene");
            return false
        }
        var d = (e.numPreloading == 0) && (e.numLoaded > 0);
        debugMessage(kDebugTextureManager_IsScenePreloaded, "sceneIndex: " + f);
        debugMessage(kDebugTextureManager_IsScenePreloaded, "-    numPreloading:" + e.numPreloading);
        debugMessage(kDebugTextureManager_IsScenePreloaded, "-        numLoaded:" + e.numLoaded);
        debugMessage(kDebugTextureManager_IsScenePreloaded, "-      isPreloaded:" + d);
        return d
    },
    preloadTexture: function(l, r, o, p) {
        var n = null;
        var k = this;
        if (p) {
            n = document.createElement("video")
        } else {
            n = new Image()
        }
        var q = -1;
        var j = this.cacheEntryForScene(l, false);
        if (j != null) {
            q = j.uniqueID
        }
        n.onerror = function() {
            k.textureDidNotPreload(l, r, n)
        };
        n.onload = function() {
            k.textureDidPreload(l, r, n, q)
        };
        n.onabort = function() {
            k.texturePreloadAborted(l, r, n)
        };
        if (gDebugSimulateSlowTextureDownload) {
            n.onload = function() {
                k.textureDidPreload_Debug(l, r)
            }
        }
        if (gDebugSimulateTextureLoadFailure) {
            this.textureCount++;
            if (this.textureCount % 20 == 0) {
                n.onload = function() {
                    k.textureDidNotPreload_Debug(l, r)
                }
            }
        }
        var m = o;
        	if(isRetina){
        	m = m.replace("assets/images","assets/2x-images");
        	}
        n.src = m;
        debugMessage(kDebugTextureManager_PreloadTexture, "textureId: " + r + " textureUrl: " + m);
        debugMessage(kDebugTextureManager_TrackTextureLifetime + "-preloadTexture", "sceneIndex: " + l + " textureId: " + r + " textureUrl: " + m);
        return n
    },
    textureDidPreload_Debug: function(h, i, f) {
        debugMessage(kDebugTextureManager_TextureDidPreload, "sceneIndex: " + h + " textureId: " + i + " downloaded, but pretending it took longer...");
        var g = this;
        var j = 5000;
        setTimeout(function() {
            g.textureDidPreload(h, i)
        },
        j)
    },
    textureDidPreload: function(m, t, k, q) {
        this.numOutstandingLoadRequests--;
        gShowController.displayManager.updateStatisticsDisplay();
        var r = this.cacheEntryForScene(m, false);
        if (r == null) {
            debugWarning(kDebugTextureManager_TextureDidPreload, "sceneIndex: " + m + " textureId: " + t + " - there is no cache entry for this scene");
            return
        }
        if (r.uniqueID != q) {
            return
        }
        var o = this.script.textures[t];
        var p = this.script.scalefactor480;
        var l = o.height * p;
        var n = o.width * p;
        debugMessage(kDebugTextureManager_TextureDidPreload, "sceneIndex: " + m + " textureId: " + t);
        debugMessage(kDebugTextureManager_TextureDidPreload, "- before:");
        debugMessage(kDebugTextureManager_TextureDidPreload, "-    numPreloading:" + r.numPreloading);
        debugMessage(kDebugTextureManager_TextureDidPreload, "-        numLoaded:" + r.numLoaded);
        var s = r.imageObjects[t];
        if (s) {
            r.numPreloading--;
            r.numLoaded++
        } else {
            debugWarning(kDebugTextureManager_TextureDidPreload, "sceneIndex: " + m + " textureId: " + t + " - there is no entry for this texture in this scene");
            return
        }
        debugMessage(kDebugTextureManager_TrackTextureLifetime + "-textureDidPreload", "sceneIndex: " + m + " textureId: " + t + " expectedSize: " + o.width + "x" + o.height + " naturalSize: " + k.naturalWidth + "x" + k.naturalHeight + " url: " + k.src);
        debugMessage(kDebugTextureManager_TextureDidPreload, "- after:");
        debugMessage(kDebugTextureManager_TextureDidPreload, "-    numPreloading:" + r.numPreloading);
        debugMessage(kDebugTextureManager_TextureDidPreload, "-        numLoaded:" + r.numLoaded)
    },
    textureDidNotPreload_Debug: function(f, d, e) {
        debugWarning(kDebugTextureManager_TextureDidNotPreload, "simulating texture load failure on scene: " + f + ", textureId: " + d);
        this.textureDidNotPreload(f, d, e)
    },
    texturePreloadAborted: function(f, d, e) {
        this.numOutstandingLoadRequests--;
        debugUpdateStatusDisplay();
        debugWarning(kDebugTextureManager_TrackTextureLifetime + "-texturePreloadAborted", " - sceneIndex: " + f + " textureId: " + d + " url: " + e.src)
    },
    textureDidNotPreload: function(f, d, e) {
        this.numOutstandingLoadRequests--;
        debugUpdateStatusDisplay();
        debugMessageAlways(kDebugTextureManager_TrackTextureLifetime + "-textureDidNotPreload", "LOAD FAILURE! - sceneIndex: " + f + " textureId: " + d);
        debugMessage(kDebugTextureManager_TrackTextureLifetime + "- size: " + e.naturalWidth + "x" + e.naturalHeight + " url: " + e.src);
        this.numLoadFailures++;
        return true
    },
    getImageObjectForTexture: function(g, h) {
        var f = this.cacheEntryForScene(g, false);
        var e = f.imageObjects[h];
        return e
    },
    urlForMovie: function(b) {
        return this.generateUrl(b, true, false)
    },
    urlForTexture: function(c, d) {
        return this.generateUrl(c, false, d)
    },
    generateUrl: function(j, k, h) {
        debugMessage(kDebugTextureManager_UrlForTexture, "textureId: " + j + " wantsMovieUrl: " + (k ? "true": "false"));
        var i = "";
        var l = this.script.textures[j];
        var n = "";
        if (l != null) {
            if (k) {
                n = l.movieUrl
            } else {
                n = l.url
            }
            if ((n != null) && (n != "")) {
                var m;
                if (gMode == kModeMobile) {
                    showSizeFolder = "480x268/";
                    if (k) {
                        debugMessage(kDebugTextureManager_UrlForTexture, "- this is a movie, there is no small version per se, it's all in the same m4v file...");
                        m = false
                    } else {
                        if (gIpad || window.devicePixelRatio >= 2) {
                            debugMessage(kDebugTextureManager_UrlForTexture, "- we're on an iPad, check if we should degrade this texture...");
                            if (h) {
                                debugMessage(kDebugTextureManager_UrlForTexture, "- yes, this texture would put us over the limit...");
                                m = true
                            } else {
                                debugMessage(kDebugTextureManager_UrlForTexture, "- no, this texture fits within the limit, use full size...");
                                m = false
                            }
                        } else {
                            debugMessage(kDebugTextureManager_UrlForTexture, "- we're on an iPhone/iPod Touch, so use small textures...");
                            m = true
                        }
                    }
                } else {
                    debugMessage(kDebugTextureManager_UrlForTexture, "- we're on a desktop machine, so use large textures...");
                    m = false
                }
                i = this.showUrl + (m ? "480x268/": "") + n
            }
        }
        debugMessage(kDebugTextureManager_UrlForTexture, "- url: " + i);
        return i
    }
});
var kShowSizeDidChangeEvent = "ScriptManager:ShowSizeDidChangeEvent";
var kScriptDidDownloadEvent = "ScriptManager:ScriptDidDownloadEvent";
var kScriptDidNotDownloadEvent = "ScriptManager:ScriptDidNotDownloadEvent";
var ScriptManager = Class.create({
    initialize: function(b) {
        debugMessage(kDebugScriptMangaer_Initialize);
        this.script = null;
        this.showUrl = b;
        this.debugFirstTime = true
    },
    downloadScript: function() {
        debugMessage(kDebugScriptMangaer_DownloadScript, "showUrl: " + this.showUrl);
        this.downloadTimeout = setTimeout(function() {
            j.scriptDidNotDownload(null)
        },
        kMaxScriptDownloadWaitTime);
        this.downloadAlreadyFailed = false;
        var i = new Date();
        var h = this.showUrl + "kpf.json?ts=" + escape(i.valueOf());
	var j = this;
        var f = function(a) {
            j.scriptDidDownload(a)
        };
        var g = function(a) {
            j.scriptDidNotDownload(a)
        };
        if (gDebugSimulateScriptDownloadFailure == true) {
            if (this.debugFirstTime) {
                debugMessage(kDebugScriptMangaer_DownloadScript, "overridding succes completion routine for script download...");
                f = function(a) {
                    j.scriptDidNotDownload_debug(a)
                };
                this.debugFirstTime = false
            }
        }
        debugMessage(kDebugScriptMangaer_DownloadScript, "starting download of script from: " + h);
        new Ajax.Request(h, {
            method: "get",
            onSuccess: f,
            onFailure: g
        })
    },
    scriptDidDownload: function(transport) {
        debugMessage(kDebugScriptMangaer_ScriptDidDownload, "download complete.");
        clearTimeout(this.downloadTimeout);
        debugMessage(kDebugScriptMangaer_ScriptDidDownload, "parsing script...");
        this.script = eval("(" + transport.responseText + ")");
        debugMessage(kDebugScriptMangaer_ScriptDidDownload, "script parsing complete.");
        debugMessage(kDebugScriptMangaer_ScriptDidDownload, "        filename: " + this.script.filename);
        debugMessage(kDebugScriptMangaer_ScriptDidDownload, " nativeShowWidth: " + this.script.slideWidth);
        debugMessage(kDebugScriptMangaer_ScriptDidDownload, "nativeShowHeight: " + this.script.slideHeight);
        debugMessage(kDebugScriptMangaer_ScriptDidDownload, "       showWidth: " + showWidth);
        debugMessage(kDebugScriptMangaer_ScriptDidDownload, "      showHeight: " + showHeight);
        var script = this.script;
        var showWidth = this.script.slideWidth;
        var showHeight = this.script.slideHeight;
        this.preProcessScript();
        document.fire(kScriptDidDownloadEvent, {
            script: script
        });
        document.fire(kShowSizeDidChangeEvent, {
            width: showWidth,
            height: showHeight
        })
    },
    preProcessScript: function() {
        debugMessage(kDebugScriptMangaer_PreProcessScript);
        debugMessage(kDebugScriptMangaer_PreProcessScript, "- adjust for the fact that we don't play the last 'fade-to-black' scene...");
        this.script.numScenes = this.script.eventTimelines.length - 1;
        this.script.lastSceneIndex = this.script.numScenes - 1;
        this.script.lastSlideIndex = this.script.navigatorEvents.length - 1;
        this.degradeStatistics = {
            numDegradedSlides: 0,
            numDegradedTextures: 0,
            maxNumDegradedTexturesPerSlide: 0
        };
        if (gIpad) {
            var U = this.script.eventTimelines.length;
            debugMessage(kDebugScriptMangaer_PreProcessScript, "- perform per-scene pixel bugeting... (there are " + U + " scenes)");
            var D;
            for (D = 0; D < U; D++) {
                var Z = this.script.eventTimelines[D];
                var G = Z.eventInitialStates;
                var ad = G.length;
                var T = 0;
                var S = 0;
                debugMessage(kDebugScriptMangaer_PreProcessScript_Detailed, "- Scene: " + D + " (" + ad + " textures)");
                var ac = 0;
                var Y = true;
                var ab = false;
                var M;
                while (Y && !ab) {
                    debugMessage(kDebugScriptMangaer_PreProcessScript_Detailed, "-    Pass: " + ac);
                    var J = 0;
                    var Q = -1;
                    var K = -1;
                    var W = -1;
                    for (M = 0; M < ad; M++) {
                        var E = G[M];
                        var L = E.texture;
                        var P = this.script.textures[L];
                        var F = P.width;
                        var H = P.height;
                        var R = Math.floor(F * H);
                        var C = F * this.script.scalefactor480;
                        var V = F * this.script.scalefactor480;
                        var O = Math.floor(C * V);
                        var aa = false;
                        var X = false;
                        var I = (E.hasOwnProperty("degrade") && E.degrade);
                        var N = (I ? O: R);
                        J += N;
                        if (!I) {
                            if (L.match(".background")) {
                                W = M;
                                X = true
                            }
                            if (R > K) {
                                aa = true;
                                K = R;
                                Q = M
                            }
                        }
                        debugMessage(kDebugScriptMangaer_PreProcessScript_ExtremelyDetailed, "-       " + M + ": " + L + " using: " + (I ? "small": "large") + " (" + N + " pixels)")
                    }
                    debugMessage(kDebugScriptMangaer_PreProcessScript_Detailed, "-       End of Pass: " + ac + " totalPixelsPerScene: " + J + " safePixelCount: " + gSafeMaxPixelCount);
                    if (S == 0) {
                        S = J
                    }
                    if (J > gSafeMaxPixelCount) {
                        debugMessage(kDebugScriptMangaer_PreProcessScript_Detailed, "-          Still too big... (" + J + " vs. " + gSafeMaxPixelCount + ")");
                        if (W != -1) {
                            debugMessageAlways(kDebugScriptMangaer_PreProcessScript_Detailed, "-          Degrading background: " + this.script.eventTimelines[D].eventInitialStates[Q].texture);
                            this.script.eventTimelines[D].eventInitialStates[W].degrade = true;
                            T++
                        } else {
                            if (Q != -1) {
                                debugMessageAlways(kDebugScriptMangaer_PreProcessScript_Detailed, "-          Degrading largest texture: " + Q + ": " + this.script.eventTimelines[D].eventInitialStates[Q].texture);
                                this.script.eventTimelines[D].eventInitialStates[Q].degrade = true;
                                T++
                            } else {
                                debugMessage(kDebugScriptMangaer_PreProcessScript_Detailed, "-          Still too big, but we're out of textures to degrade, uh-oh!");
                                ab = true
                            }
                        }
                    } else {
                        debugMessage(kDebugScriptMangaer_PreProcessScript_Detailed, "-          Within limits");
                        Y = false
                    }
                    ac++
                }
                this.degradeStatistics.numDegradedTextures += T;
                if (T > 0) {
                    debugMessage(kDebugScriptMangaer_PreProcessScript, "-    Summary for Scene: " + D + " - degraded " + T + " of " + ad + " textures to go from " + S + " to " + J);
                    this.degradeStatistics.numDegradedSlides++
                }
                if (T > this.degradeStatistics.maxNumDegradedTexturesPerSlide) {
                    this.degradeStatistics.maxNumDegradedTexturesPerSlide = T
                }
            }
        }
    },
    scriptDidNotDownload_debug: function(b) {
        debugWarning(kDebugScriptMangaer_ScriptDidNotDownload, "simulating failure of script download");
        this.scriptDidNotDownload(b)
    },
    scriptDidNotDownload: function(b) {
        debugWarning(kDebugScriptMangaer_ScriptDidNotDownload, (b != null) ? "Ajax.Request returned an error": "kMaxScriptDownloadWaitTime exceeded while waiting for script to download");
        if (this.downloadAlreadyFailed) {
            debugMessage(kDebugScriptMangaer_ScriptDidNotDownload, "already executed due to previous timeout or onFailure invocation, ignoring...")
        }
        this.downloadAlreadyFailed = true;
        if (b) {
            debugWarning(kDebugScriptMangaer_ScriptDidNotDownload, "readyState: " + b.readyState + " status: " + b.status);
            clearTimeout(this.downloadTimeout)
        }
        document.fire(kScriptDidNotDownloadEvent, {})
    },
    isOnlyActionInSceneAMovieStart: function(h) {
        debugMessage(kDebugScriptMangaer_IsOnlyActionInSceneAMovieStart, "sceneIndex: " + h);
        if (h <= -1) {
            debugMessageAlways(kDebugScriptMangaer_IsOnlyActionInSceneAMovieStart, "- sceneIndex less than zero, returning false");
            return false
        }
        if (h > this.script.lastSceneIndex) {
            debugMessageAlways(kDebugScriptMangaer_IsOnlyActionInSceneAMovieStart, "- sceneIndex (" + h + ") greater than this.script.lastSceneIndex, returning false");
            return false
        }
        var f = this.script.eventTimelines[h];
        var i = f.eventAnimations;
        var j;
        for (j = 0; j < i.length; j++) {
            var g = i[j];
            debugMessage(kDebugScriptMangaer_IsOnlyActionInSceneAMovieStart, "- eventAnimationIndex: " + j + " effect: " + g.effect);
            if (g.effect != "apple:movie-start") {
                debugMessage(kDebugScriptMangaer_IsOnlyActionInSceneAMovieStart, "-  this one's not a movie start action, return false");
                return false
            }
        }
        debugMessage(kDebugScriptMangaer_IsOnlyActionInSceneAMovieStart, "-  nothing but movie start actions, return true");
        return true
    },
    isMovieInScene: function(n, p, r) {
        debugMessage(kDebugScriptMangaer_IsMovieInScene, "sceneIndex: " + n + " movieId: '" + p + "'");
        if (n == -1) {
            debugMessage(kDebugScriptMangaer_IsMovieInScene, "- a value of -1 specified for sceneIndex, returning false...");
            return false
        } else {
            var o = this.script.eventTimelines[n];
            var v = o.eventInitialStates;
            var w = v.length;
            var t = p.substring(p.indexOf("-") + 1);
            var q = this.slideIndexFromSceneIndex(n);
            debugMessage(kDebugScriptMangaer_IsMovieInScene, "- looking for a movie with textureId: " + t);
            var s;
            for (s = 0; s < w; s++) {
                var m = v[s];
                var x = m.texture;
                var u = q + "-" + m.canvasObjectID;
                debugMessage(kDebugScriptMangaer_IsMovieInScene, "- " + s + ": " + x + " canvasObjectId: " + m.canvasObjectID);
                if (t == u) {
                    debugMessage(kDebugScriptMangaer_IsMovieInScene, "- found movie at texture index: " + s);
                    return true
                }
            }
            debugMessage(kDebugScriptMangaer_IsMovieInScene, "- movie not found");
            return false
        }
    },
    getMoviesInScene: function(k) {
        debugMessage(kDebugScriptMangaer_GetMoviesInScene, "sceneIndex: " + k);
        if (this.script == null) {
            return null
        }
        if (k > this.script.lastSceneIndex) {
            return null
        }
        var n = new Array();
        var j = this.script.eventTimelines[k];
        var m = j.eventInitialStates;
        var p = m.length;
        var o;
        for (o = 0; o < p; o++) {
            var i = m[o];
            var l = i.texture;
            debugMessage(kDebugScriptMangaer_GetMoviesInScene, " - textureId: " + l);
            if (l.indexOf("movie") != -1) {
                debugMessage(kDebugScriptMangaer_GetMoviesInScene, " - is a movie, add to list...");
                n.push(l)
            }
        }
        return n
    },
    sceneIndexFromSlideIndex: function(d) {
        if ((this.script == null) || (d < 0) || (d >= this.script.navigatorEvents.length)) {
            return - 1
        }
        debugMessage(kDebugScriptMangaer_SceneIndexFromSlideIndex, " slideIndex: " + d);
        var c = this.script.navigatorEvents[d];
        return c.eventIndex
    },
    slideIndexFromSceneIndex: function(g) {
        if ((this.script == null) || (g < 0) || (g >= this.script.eventTimelines.length)) {
            return - 1
        }
        debugMessage(kDebugScriptMangaer_SlideIndexFromSceneIndex, "sceneIndex: " + g);
        var f;
        debugMessage(kDebugScriptMangaer_SlideIndexFromSceneIndex, "  SlideIndex => SceneIndex");
        for (f = this.script.slideCount - 1; f > 0; f--) {
            var h = this.script.navigatorEvents[f];
            var e = h.eventIndex;
            if (g >= e) {
                debugMessage(kDebugScriptMangaer_SlideIndexFromSceneIndex, "  " + f + " => " + e + " - that's close enough!");
                return f
            }
            debugMessage(kDebugScriptMangaer_SlideIndexFromSceneIndex, "  " + f + " => " + e + " - too high, NEXT!")
        }
        debugMessage(kDebugScriptMangaer_SlideIndexFromSceneIndex, "  must be first slide!");
        return f
    }
});
var kOrientationChangedEvent = "OrientationController:OrientationChangedEvent";
var OrientationController = Class.create({
    initialize: function() {
        var b = this;
        if (gDevice == kDeviceMobile) {
            debugMessage(kDebugOrientationController_Initialize, "adding event listener for window orientation change events...");
            window.onorientationchange = function(a) {
                b.handleDeviceOrientationChangeEvent(a)
            };
            this.handleDeviceOrientationChangeEvent()
        } else {
            debugMessage(kDebugOrientationController_Initialize, "adding event listener for window resize events...");
            window.addEventListener("resize",
            function(a) {
                b.handleWindowResizeEvent(a)
            },
            false);
            this.handleWindowResizeEvent()
        }
        this.orientation = kOrientationUnknown
    },
    handleWindowResizeEvent: function(c) {
        debugMessage(kDebugOrientationController_HandleWindowResizeEvent, "");
        var d = kOrientationUnknown;
        if (window.innerWidth < window.innerHeight) {
            d = kOrientationPortrait
        } else {
            d = kOrientationLandscape
        }
        this.changeOrientation(d)
    },
    handleDeviceOrientationChangeEvent: function(d) {
        debugMessage(kDebugOrientationController_HandleDeviceOrientationChangeEvent, "");
        var f = window.orientation;
        var e = kOrientationUnknown;
        if ((f == 0) || (f == 180)) {
            e = kOrientationPortrait
        } else {
            e = kOrientationLandscape
        }
        this.changeOrientation(e)
    },
    changeOrientation: function(b) {
        this.orientation = b;
        document.fire(kOrientationChangedEvent, {
            orientation: this.orientation
        })
    }
});
var kIsPublicViewer = window.location.hostname.indexOf("public") == 0;
var DocumentInfo = Class.create({
    initialize: function(e, h, g, f) {
        this.authorId = e;
        this.documentName = h;
        this.username = g;
        this.password = f;
        if (kIsPublicViewer) {
            this.documentURL = "/iw/" + e + "/" + encodeURIComponent(h)
        } else {
            this.documentURL = "/iw/" + e + "/.iWork/Share/" + encodeURIComponent(h)
        }
    },
    getInfo: function(e) {
        e = $H({
            method: "get",
            sanitizeJSON: true
        }).merge(e || {}).toObject();
        var f,
        g;
        if (kIsPublicViewer) {
            f = this.documentURL + "/metadata.json?salt=" + (new Date().getTime());
            g = this.handleJSON
        } else {
            if (this.username && this.password) {
                e.requestHeaders = {
                    "X-Heckler-Username": this.username,
                    "X-Heckler-Remember": 0,
                    "X-Heckler-Scope": "Reviewer",
                    "X-Heckler-Password": this.password
                }
            } else {
                e.requestHeaders = {}
            }
            e.requestHeaders.Depth = "2";
            f = this.documentURL + "?webdav-method=PROPFIND";
            g = this.handleXML
        }
        e.onSuccess = g.bind(this, e.onSuccess);
        var h = new Ajax.Request(f, e)
    },
    handleJSON: function(c, d) {
        c(this.parseJSON(d.responseJSON))
    },
    handleXML: function(h, f) {
        var g = $A(),
        i = getHecklerElementsByTagName(f.responseXML, "Heckler.document");
        if (i && i.length) {
            i[0].normalize();
            g = g.concat(i[0].firstChild.nodeValue.evalJSON(true))
        }
        i = getHecklerElementsByTagName(f.responseXML, "Heckler.user");
        for (var j = 0; j < i.length; j++) {
            i[j].normalize();
            g = g.concat(i[j].firstChild.nodeValue.evalJSON(true))
        }
        h(this.parseJSON(g))
    },
    parseJSON: function(e) {
        var f = 0,
        h,
        g;
        for (var f = 0; f < e.length; f++) {
            switch (e[f].type) {
            case "Document":
                g = e[f];
                break;
            case "User":
                if (e[f].role == 1) {
                    h = e[f]
                }
                break
            }
        }
        return {
            authorImage: this.documentURL + (kIsPublicViewer ? "": "/Resources") + "/author.jpg?ts=" + g.publishDate,
            authorFirstName: h.firstName,
            authorLastName: h.lastName,
            authorEmail: h.email,
            date: new Date(g.publishDate * 1000).format(CoreDocs.loc("MMM d, y h:mm a", "date.format() parameters for document publish date")),
            documentTitle: g.title
        }
    }
});
var kDeviceUnknown = "deviceUnknown";
var kDeviceDesktop = "deviceDesktop";
var kDeviceMobile = "deviceMobile";
var kModeUnknown = "modeUnknown";
var kModeDesktop = "modeDesktop";
var kModeMobile = "modeMobile";
var kBrowserUnknown = "browserUnknown";
var kBrowserDesktopSafari = "browserDesktopSafari";
var kBrowserMobileSafari = "browserMobileSafari";
var kOrientationUnknown = "orientationUnknown";
var kOrientationLandscape = "orientationLandscape";
var kOrientationPortrait = "orientationPortrait";
var kShowModeHyperlinksOnly = 2;
var kSoundTrackModePlayOnce = 0;
var kSoundTrackModeLooping = 1;
var kSoundTrackModeOff = 2;
var kOpacityPropertyName = "opacity";
var kVisibilityPropertyName = "visibility";
var kZIndexPropertyName = "z-index";
var kDisplayPropertyName = "display";
var kAnimationNamePropertyName = "-webkit-animation-name";
var kAnimationDurationPropertyName = "-webkit-animation-duration";
var kAnimationDelayPropertyName = "-webkit-animation-delay";
var kTransformPropertyName = "-webkit-transform";
var kTransformOriginPropertyName = "-webkit-transform-origin";
var kTransitionPropertyName = "-webkit-transition-property";
var kTransitionDurationName = "-webkit-transition-duration";
var kTransformStylePropertyName = "-webkit-transform-style";
var kTransitionPropertyName = "-webkit-transition";
var kTransitionEndEventName = "webkitTransitionEnd";
var kPerspectivePropertyName = "-webkit-perspective";
var kPerspectiveOriginPropertyName = "-webkit-perspective-origin";
var kBackfaceVisibilityPropertyName = "-webkit-backface-visibility";
var kBorderPropertyName = "border";
var kBoxShadowPropertyName = "-webkit-box-shadow";
var kDisplayBlockPropertyValue = "block";
var kDisplayNonePropertyValue = "none";
var kTransformOriginTopLeftPropertyValue = "top left";
var kTransformOriginCenterPropertyValue = "center";
var kTransformStylePreserve3DPropertyValue = "preserve-3d";
var kTransformStyleFlatPropertyValue = "flat";
var kPositionAbsolutePropertyValue = "absolute";
var kPositionRelativePropertyValue = "relative";
var kBackfaceVisibilityHiddenPropertyValue = "hidden";
var kiPhoneDeviceWidth = 320;
var kiPhoneDeviceHeight = 480;
var kiPhoneLandscapeButtonBarHeight = 32;
var kiPhonePortraitButtonBarHeight = 44;
var kiPhoneUrlBarHeight = 60;
var kiPhoneStatusBarHeight = 20;
var kiPadDeviceWidth = 768;
var kiPadDeviceHeight = 1024;
var kiPadLandscapeButtonBarHeight = 32;
var kiPadPortraitButtonBarHeight = 44;
var kiPadUrlBarHeight = 0;
var kiPadStatusBarHeight = 0;
var kiPadAddressBarHeight = 30;
var kiPadBookmarksBarHeight = 30;
var kiPadMaxMoviesPerScene = 20;
var kMaxSceneDownloadWaitTime = 15000;
var kMaxScriptDownloadWaitTime = 20000;
var kWaitingIndicatorFadeOutDuration = 2000;
var kHideAddressBarDelay = 3000;
var kSceneLoadPollInterval = 0;
var kSceneLoadDisplaySpinnerTime = 0;
var kSceneLoadDisplaySpinnerPollCount = 1;
var kSceneLoadGiveUpTime = 6000000;
var kSceneLoadGiveUpPollCount = 200000;
var kPropertyName_embedMode = "mode";
var kPropertyName_presentationName = "presentationName";
var kPropertyName_accountID = "accountID";
var kPropertyName_guid = "guid";
var kPropertyName_locale = "locale";
var kPropertyName_currentSlide = "currentSlide";
var kPropertyName_isNavigationBarVisible = "isNavigationBarVisible";
var kPropertyName_isFullscreen = "isFullscreen";
var kPropertyName_volume = "volume";
var kPropertyName_muted = "muted";
var kEmbedModeEmbedded = "EMBED";
var kEmbedModeNonEmbedded = "NON-EMBED";
var kKeyCode_Space = 32;
var kKeyCode_Escape = 27;
var kKeyCode_LeftArrow = 37;
var kKeyCode_UpArrow = 38;
var kKeyCode_RightArrow = 39;
var kKeyCode_DownArrow = 40;
var kKeyCode_OpenBracket = 219;
var kKeyCode_CloseBracket = 221;
var kKeyCode_Home = 36;
var kKeyCode_End = 35;
var kKeyCode_PageUp = 33;
var kKeyCode_PageDown = 34;
var kKeyCode_Return = 13;
var kKeyCode_N = 78;
var kKeyCode_P = 80;
var kKeyCode_Delete = 8;
var kKeyCode_0 = 48;
var kKeyCode_9 = 57;
var kKeyCode_Numeric_0 = 96;
var kKeyCode_Numeric_9 = 105;
var kKeyModifier_Shift = 1000;
var kKeyModifier_Ctrl = 2000;
var kKeyModifier_Alt = 3000;
var kKeyModifier_Meta = 4000;
var kUnableToReachiWorkTryAgain = CoreDocs.loc("Slide couldn't be displayed.\nDo you want to try again?", "alert text to display when we timeout trying to download resources from iWork.com");
var kSlideLabel = CoreDocs.loc("Slide", "Prefix label for 'Slide I/N' display");
var kTapOrSwipeToAdvance = CoreDocs.loc("Tap or Swipe to advance", "Help string for bottom of portrait mode on mobile device");
var kDocumentPublisherLabel = CoreDocs.loc("Document Publisher", "Label for document publisher on info panel");
var kDocumentNameLabel = CoreDocs.loc("Document Name", "Label for document name on info panel");
var kLastPublishedLabel = CoreDocs.loc("Last Published", "Label for last published date on info panel");
var kTermsOfServiceLinkLabel = CoreDocs.loc("Terms of Service", "Text for 'Terms of Service' link on info panel");
var kPrivacyLinkLabel = CoreDocs.loc("Privacy", "Text for 'Privacy' link on info panel");
var kFeedbackLinkLabel = CoreDocs.loc("Feedback", "Text for 'Feedback' link on info panel");
var kCloseInfoPanelButtonText = CoreDocs.loc("Done", "Text close button on info panel");
var kOSUnknown = "unknown";
var kOSWindows = "Windows";
var kOSMacOSX = "Mac OS X";
var kOSiOS = "iOS";
var gTheoreticalMaxPixelCount = 1024 * 1024 * 3;
var gSafeMaxPixelCount = gTheoreticalMaxPixelCount * 0.9;
var gShowController = null;
var gDevice = kDeviceUnknown;
var gBrowser = kBrowserUnknown;
var gMode = kModeUnknown;
var gIpad = false;
var gEmbedded = true;
var gPlayMoviesInPlace = false;
var gMoviesRespectTransforms = true;
var gIsPublicViewer = (window.location.hostname.indexOf("public") == 0);
var gOS = kOSUnknown;
function static_url(b) {
    return b
}
function setupShowController() {
    var d = isMobileSafari();
    d = false;
    if (d) {
        gBrowser = kBrowserMobileSafari;
        gDevice = kDeviceMobile;
        gMode = kModeMobile;
        gIpad = isiPad()
    } else {
        gBrowser = kBrowserDesktopSafari;
        gDevice = kDeviceDesktop;
        gMode = kModeDesktop;
        gIpad = isiPad()
    }
    debugMessageAlways(kDebugSetupShowController, "================================================================================");
    debugMessageAlways(kDebugSetupShowController, "===                     S T A R T   O F   S E S S I O N                      ===");
    debugMessageAlways(kDebugSetupShowController, "================================================================================");
    debugMessage(kDebugSetupShowController, "userAgent: " + navigator.userAgent);
    debugMessage(kDebugSetupShowController, "url: " + window.location.href);
    var e = {
        major: 0,
        minor: 0,
        point: 0
    };
    debugMessage(kDebugSetupShowController, "this indicates that this is " + (d ? "Mobile Safari": "Desktop Safari"));
    if (d) {
        e = getMobileOSVersionInfo();
        debugMessage(kDebugSetupShowController, "version: " + e.major + "." + e.minor + "." + e.point);
        gPlayMoviesInPlace = gIpad || (e.major >= 4)
    } else {
        gPlayMoviesInPlace = true
    }
    if (navigator.userAgent.match(/Windows/)) {
        gOS = kOSWindows
    }
    if (gIpad && (e.major < 4)) {
        gMoviesRespectTransforms = false
    }
    gEmbedded = true;
    var f = getUrlParameter("pixelLimit");
    if (f != "") {
        gSafeMaxPixelCount = 1024 * 1024 * parseInt(f)
    }
    if (navigator.userAgent.indexOf("deviceDesktop") != -1) {
        debugMessage(kDebugSetupShowController, "Device was '" + gDevice + "', overriding device to be 'deviceDesktop'");
        gDevice = kDeviceDesktop
    }
    if (navigator.userAgent.indexOf("deviceMobile") != -1) {
        debugMessage(kDebugSetupShowController, "Device was '" + gDevice + "', overriding device to be 'deviceMobile'");
        gDevice = kDeviceMobile
    }
    if (navigator.userAgent.indexOf("modeDesktop") != -1) {
        debugMessage(kDebugSetupShowController, "Mode was '" + gMode + "', overriding device to be 'modeDesktop'");
        gMode = kModeDesktop
    }
    if (navigator.userAgent.indexOf("modeMobile") != -1) {
        debugMessage(kDebugSetupShowController, "Mode was '" + gMode + "', overriding device to be 'modeMobile'");
        gMode = kModeMobile
    }
    debugMessage(kDebugSetupShowController, "  gDevice: " + gDevice);
    debugMessage(kDebugSetupShowController, " gBrowser: " + gBrowser);
    debugMessage(kDebugSetupShowController, "    gMode: " + gMode);
    debugMessage(kDebugSetupShowController, "                     gOS: " + gOS);
    debugMessage(kDebugSetupShowController, "               gEmbedded: " + (gEmbedded ? "yes": "no"));
    debugMessage(kDebugSetupShowController, "      gPlayMoviesInPlace: " + (gPlayMoviesInPlace ? "yes": "no"));
    debugMessage(kDebugSetupShowController, "gMoviesRespectTransforms: " + (gMoviesRespectTransforms ? "yes": "no"));
    gShowController = new ShowController();
    gShowController.startShow()
}
var NullDelegate = Class.create({
    initialize: function() {
        debugMessage(kDebugNullDelegate_initialize, "no delegate specified by heckler, use null delegate...")
    },
    showDidLoad: function() {
        var b = "showDidLoad";
        debugMessage(kDebugNullDelegate_showDidLoad)
    },
    showExited: function() {
        var b = "showExited";
        debugMessage(kDebugNullDelegate_showExited);
        if (!gEmbedded) {
            history.go( - 1)
        }
    },
    propertyChanged: function(f, e) {
        var d = "propertyChanged";
        debugMessage(kDebugNullDelegate_propertyChanged, "propertyName: " + f + " propertyValue: " + e)
    }
});

// detect-zoom is dual-licensed under the WTFPL and MIT license,
// at the recipient's choice.
// https://github.com/yonran/detect-zoom/
var DetectZoom = {
  mediaQueryBinarySearch: function(
      property, unit, a, b, maxIter, epsilon) {
    var matchMedia;
    var head, style, div
    if (window.matchMedia) {
      matchMedia = window.matchMedia;
    } else {
      head = document.getElementsByTagName('head')[0];
      style = document.createElement('style');
      div = document.createElement('div');
      div.className = 'mediaQueryBinarySearch';
      head.appendChild(style);
      div.style.display = 'none';
      document.body.appendChild(div);
      matchMedia = function(query) {
        style.sheet.insertRule('@media ' + query +
                               '{.mediaQueryBinarySearch ' +
                               '{text-decoration: underline} }', 0);
        var matched = getComputedStyle(div, null).textDecoration
            == 'underline';
        style.sheet.deleteRule(0);
        return {matches:matched};
      }
    }
    var r = binarySearch(a, b, maxIter);
    if (div) {
      head.removeChild(style);
      document.body.removeChild(div);
    }
    return r;

    function binarySearch(a, b, maxIter) {
      var mid = (a + b)/2;
      if (maxIter == 0 || b - a < epsilon) return mid;
      var query = "(" + property + ":" + mid + unit + ")";
      if (matchMedia(query).matches) {
        return binarySearch(mid, b, maxIter-1);
      } else {
        return binarySearch(a, mid, maxIter-1);
      }
    }
  },
  _zoomIe7: function() {
    // the trick: body's offsetWidth was in CSS pixels, while
    // getBoundingClientRect() was in system pixels in IE7.
    // Thanks to http://help.dottoro.com/ljgshbne.php
    var rect = document.body.getBoundingClientRect();
    var z = (rect.right-rect.left)/document.body.offsetWidth;
    z = Math.round(z * 100) / 100;
    return {zoom: z, devicePxPerCssPx: z};
  },
  _zoomIe8: function() {
    // IE 8+: no trick needed!
    // TODO: MSDN says that logicalXDPI and deviceXDPI existed since IE6
    // (which didn't even have whole-page zoom). Check to see whether
    // this method would also work in IE7.
    var zoom = screen.deviceXDPI / screen.logicalXDPI;
    return {
      zoom: zoom,
      devicePxPerCssPx: zoom
    };
  },
  _zoomWebkitMobile: function() {
    // the trick: window.innerWIdth is in CSS pixels, while
    // screen.width and screen.height are in system pixels.
    // And there are no scrollbars to mess up the measurement.
    var devicePixelRatio = window.devicePixelRatio != null ? window.devicePixelRatio : 1
      , deviceWidth;
    if ( Math.abs(window.orientation) == 90 ) {
      deviceWidth = screen.height;
    } else {
      deviceWidth = screen.width;
    }
    var z = deviceWidth / window.innerWidth;
    // return immediately; don't round at the end.
    return {zoom: z, devicePxPerCssPx: z*devicePixelRatio};
  },
  _zoomWebkit: function() {
    // the trick: an element's clientHeight is in CSS pixels, while you can
    // set its line-height in system pixels using font-size and
    // -webkit-text-size-adjust:none.
    // device-pixel-ratio: http://www.webkit.org/blog/55/high-dpi-web-sites/

    // Previous trick (used before http://trac.webkit.org/changeset/100847):
    // documentElement.scrollWidth is in CSS pixels, while
    // document.width was in system pixels. Note that this is the
    // layout width of the document, which is slightly different from viewport
    // because document width does not include scrollbars and might be wider
    // due to big elements.

    var devicePixelRatio = window.devicePixelRatio != null ? window.devicePixelRatio : 1;

    // The container exists so that the div will be laid out in its own flow
    // while not impacting the layout, viewport size, or display of the
    // webpage as a whole.
    var container = document.createElement('div')
      , div = document.createElement('div');
    
    // Add !important and relevant CSS rule resets
    // so that other rules cannot affect the results.
    var important = function(str){ return str.replace(/;/g, " !important;"); };
    
    container.setAttribute('style', important('width:0; height:0; overflow:hidden; visibility:hidden; position: absolute;'));
    div.innerHTML = "1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0";
    div.setAttribute('style', important('font: 100px/1em sans-serif; -webkit-text-size-adjust: none; height: auto; width: 1em; padding: 0; overflow: visible;'));
    
    container.appendChild(div);
    document.body.appendChild(container);
    var z = 1000 / div.clientHeight;
    z = Math.round(z * 100) / 100;
    var r = {
      zoom: z,
      devicePxPerCssPx: devicePixelRatio * z
    };
    document.body.removeChild(container);
    return r;
  },
  _zoomFF35: function() {
    // the trick for FF3.5 ONLY: device-width gives CSS pixels, while
    // screen.width gave system pixels. Thanks to QuirksMode's widths table,
    // which called it a bug. http://www.quirksmode.org/m/widths.html
    var z = screen.width /
      this.mediaQueryBinarySearch('min-device-width', 'px', 0, 6000, 20, .0001);
    z = Math.round(z * 100) / 100;
    return {zoom: z, devicePxPerCssPx: z};
  },
  _zoomFF36: function() {
    // the hack for FF3.6: you can measure scrollbar's width in CSS pixels,
    // while in system pixels it's 15px (verified in Ubuntu).

    // TODO: verify for every platform that a scrollbar is exactly 15px wide.
    var container = document.createElement('div')
      , outerDiv = document.createElement('div');
    // The container exists so that the div will be laid out in its own flow
    // while not impacting the layout, viewport size, or display of the
    // webpage as a whole.
    container.setAttribute('style', 'width:0; height:0; overflow:hidden;' +
        'visibility:hidden; position: absolute');
    outerDiv.style.width = outerDiv.style.height = '500px';  // enough for all the scrollbars
    var div = outerDiv;
    for (var i = 0; i < 10; ++i) {
      var child = document.createElement('div');
      child.style.overflowY = 'scroll';
      div.appendChild(child);
      div = child;
    }
    container.appendChild(outerDiv);
    document.body.appendChild(container);
    var outerDivWidth = outerDiv.clientWidth;
    var innerDivWidth = div.clientWidth;
    var scrollbarWidthCss = (outerDivWidth - innerDivWidth)/10;
    document.body.removeChild(container);
    var scrollbarWidthDevice = 15;  // Mac and Linux: scrollbars are 15px wide
    if (-1 != navigator.platform.indexOf('Win')){
      scrollbarWidthDevice = 17;
    }
    var z = scrollbarWidthDevice / scrollbarWidthCss;
    z = Math.round(z * 100) / 100;
    return {zoom: z, devicePxPerCssPx: z};
  },
  _zoomFF4: function() {
    // no real trick; device-pixel-ratio is the ratio of device dpi / css dpi.
    // (Note that this is a different interpretation than Webkit's device
    // pixel ratio, which is the ratio device dpi / system dpi).
    // TODO: is mozmm vs. mm promising?
    var z = this.mediaQueryBinarySearch(
            'min--moz-device-pixel-ratio',
            '', 0, 10, 20, .0001);
    z = Math.round(z * 100) / 100;
    return {zoom: z, devicePxPerCssPx: z};
  },
  _zoomOperaOlder: function() {
    // 10.00 (or before) to 11.01:
    // the trick: a div with position:fixed;width:100%'s offsetWidth is the
    // viewport width in CSS pixels, while window.innerWidth was in system
    // pixels. Thanks to:
    // http://virtuelvis.com/2005/05/how-to-detect-zoom-level-in-opera/
    // TODO: fix bug: when there is a scrollbar, fixed div does NOT
    // include the scrollbar, while window.outerWidth DOES. This causes the
    // calculation to be off by a few percent.
    var fixedDiv = document.createElement('div');
    fixedDiv.style.position = 'fixed';
    fixedDiv.style.width = '100%';
    fixedDiv.style.height = '100%';
    fixedDiv.style.top = fixedDiv.style.left = '0';
    fixedDiv.style.visibility = 'hidden';
    document.body.appendChild(fixedDiv);
    var z = window.innerWidth / fixedDiv.offsetWidth;
    document.body.removeChild(fixedDiv);
    return {zoom: z, devicePxPerCssPx: z};
  },
  _zoomOpera11: function() {
    // works starting Opera 11.11
    // the trick: outerWidth is the viewport width including scrollbars in
    // system px, while innerWidth is the viewport width including scrollbars
    // in CSS px; 
    var z = window.outerWidth / window.innerWidth;
    z = Math.round(z * 100) / 100;
    return {zoom: z, devicePxPerCssPx: z};
  },
  ratios: function() {
    var r;
    if (! isNaN(screen.logicalXDPI) && ! isNaN(screen.systemXDPI) ) {
      return this._zoomIe8();
    } else if ('ontouchstart' in window && document.body.style.webkitTextSizeAdjust != null) {
      return this._zoomWebkitMobile();
    } else if (document.body.style.webkitTextSizeAdjust != null) {  // webkit
      return this._zoomWebkit();
    } else if (-1 != navigator.userAgent.indexOf('Firefox/3.5')) {
      return this._zoomFF35();
    } else if (-1 != navigator.userAgent.indexOf('Firefox/3.6')) {
      return this._zoomFF36();
    } else if (-1 != navigator.appVersion.indexOf("MSIE 7.")) {
      return this._zoomIe7();
    } else if (-1 != navigator.userAgent.indexOf('Opera')) {
      var versionIdx = navigator.userAgent.indexOf('Version/');
      if (11.01 < parseFloat(navigator.userAgent.substr(versionIdx + 8)))
        return this._zoomOpera11();
      else
        return this._zoomOperaOlder();
    } else if (0.001 < (r = this._zoomFF4()).zoom) {
      return r;
    } else {
      return {zoom: 1, devicePxPerCssPx: 1}
    }
  },
  zoom: function() {
    return this.ratios().zoom;
  },
  device: function() {
    return this.ratios().devicePxPerCssPx;
  }
};

function stepOut(direction) {
	//var zoom = DetectZoom.zoom();
	//if(zoom>1){
	//	return;
	//}
	if(direction == null)
		Ti.App.fireEvent("closeOpenModal",{"version":jsVersion});
	else{
		if(isTwoD==false){
			if (direction == "down") {
				//goto last stage


				gShowController.jumpToScene((finalScene), false);

				manageBullets((finalScene - initialScene-1), (finalScene - initialScene-1));
				gShowController.nextSceneIndex = -1;
			}
			else{

				if (direction == "left" || direction == "right") {
					Ti.App.fireEvent("closeOpenModal", {"direction":direction,"version":jsVersion});
				}
				else{

					Ti.App.fireEvent("closeOpenModal",{"version":jsVersion});
				}

			}
		}
		else{

		//	Ti.App.fireEvent("closeOpenModal", {"direction":direction,"version":jsVersion});
		}




	}
};