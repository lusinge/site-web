(function(e) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = e()
    } else if (typeof define === "function" && define.amd) {
        define([], e)
    } else {
        var t;
        if (typeof window !== "undefined") {
            t = window
        } else if (typeof global !== "undefined") {
            t = global
        } else if (typeof self !== "undefined") {
            t = self
        } else {
            t = this
        }
        t.pseudocode = e()
    }
})(function() {
    var e, t, i;
    return function h(e, t, i) {
        function a(r, l) {
            if (!t[r]) {
                if (!e[r]) {
                    var p = typeof require == "function" && require;
                    if (!l && p) return p(r, !0);
                    if (s) return s(r, !0);
                    var n = new Error("Cannot find module '" + r + "'");
                    throw n.code = "MODULE_NOT_FOUND", n
                }
                var c = t[r] = {
                    exports: {}
                };
                e[r][0].call(c.exports, function(t) {
                    var i = e[r][1][t];
                    return a(i ? i : t)
                }, c, c.exports, h, e, t, i)
            }
            return t[r].exports
        }
        var s = typeof require == "function" && require;
        for (var r = 0; r < i.length; r++) a(i[r]);
        return a
    }({
        1: [function(e, t, i) {
            var h = e("./src/ParseError");
            var a = e("./src/buildTree");
            var s = e("./src/parseTree");
            var r = e("./src/utils");
            var l = function(e, t) {
                r.clearNode(t);
                var i = s(e);
                var h = a(i).toNode();
                t.appendChild(h)
            };
            if (typeof document !== "undefined") {
                if (document.compatMode !== "CSS1Compat") {
                    typeof console !== "undefined" && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your " + "website has a suitable doctype.");
                    l = function() {
                        throw new h("KaTeX doesn't work in quirks mode.")
                    }
                }
            }
            var p = function(e) {
                var t = s(e);
                return a(t).toMarkup()
            };
            t.exports = {
                render: l,
                renderToString: p,
                ParseError: h
            }
        }, {
            "./src/ParseError": 4,
            "./src/buildTree": 8,
            "./src/parseTree": 13,
            "./src/utils": 15
        }],
        2: [function(e, t, i) {
            var h = e("./ParseError");

            function a(e) {
                this._input = e
            }

            function s(e, t, i) {
                this.text = e;
                this.data = t;
                this.position = i
            }
            var r = [/^[/|@.""`0-9a-zA-Z]/, /^[*+-]/, /^[=<>:]/, /^[,;]/, /^['\^_{}]/, /^[(\[]/, /^[)\]?!]/, /^~/];
            var l = [/^[a-zA-Z0-9`!@*()-=+\[\]'";:?\/.,]/, /^[{}]/, /^~/];
            var p = /^\s*/;
            var n = /^( +|\\  +)/;
            var c = /^\\(?:[a-zA-Z]+|.)/;
            a.prototype._innerLex = function(e, t, i) {
                var a = this._input.slice(e);
                var r;
                if (i) {
                    r = a.match(p)[0];
                    e += r.length;
                    a = a.slice(r.length)
                } else {
                    r = a.match(n);
                    if (r !== null) {
                        return new s(" ", null, e + r[0].length)
                    }
                }
                if (a.length === 0) {
                    return new s("EOF", null, e)
                }
                var l;
                if (l = a.match(c)) {
                    return new s(l[0], null, e + l[0].length)
                } else {
                    for (var o = 0; o < t.length; o++) {
                        var d = t[o];
                        if (l = a.match(d)) {
                            return new s(l[0], null, e + l[0].length)
                        }
                    }
                }
                throw new h("Unexpected character: '" + a[0] + "'", this, e)
            };
            var o = /^(#[a-z0-9]+|[a-z]+)/i;
            a.prototype._innerLexColor = function(e) {
                var t = this._input.slice(e);
                var i = t.match(p)[0];
                e += i.length;
                t = t.slice(i.length);
                var a;
                if (a = t.match(o)) {
                    return new s(a[0], null, e + a[0].length)
                } else {
                    throw new h("Invalid color", this, e)
                }
            };
            var d = /^(-?)\s*(\d+(?:\.\d*)?|\.\d+)\s*([a-z]{2})/;
            a.prototype._innerLexSize = function(e) {
                var t = this._input.slice(e);
                var i = t.match(p)[0];
                e += i.length;
                t = t.slice(i.length);
                var a;
                if (a = t.match(d)) {
                    var r = a[3];
                    if (r !== "em" && r !== "ex") {
                        throw new h("Invalid unit: '" + r + "'", this, e)
                    }
                    return new s(a[0], {
                        number: +(a[1] + a[2]),
                        unit: r
                    }, e + a[0].length)
                }
                throw new h("Invalid size", this, e)
            };
            a.prototype._innerLexWhitespace = function(e) {
                var t = this._input.slice(e);
                var i = t.match(p)[0];
                e += i.length;
                return new s(i, null, e)
            };
            a.prototype.lex = function(e, t) {
                if (t === "math") {
                    return this._innerLex(e, r, true)
                } else if (t === "text") {
                    return this._innerLex(e, l, false)
                } else if (t === "color") {
                    return this._innerLexColor(e)
                } else if (t === "size") {
                    return this._innerLexSize(e)
                } else if (t === "whitespace") {
                    return this._innerLexWhitespace(e)
                }
            };
            t.exports = a
        }, {
            "./ParseError": 4
        }],
        3: [function(e, t, i) {
            function h(e, t, i, h, a) {
                this.style = e;
                this.color = i;
                this.size = t;
                if (h === undefined) {
                    h = e
                }
                this.parentStyle = h;
                if (a === undefined) {
                    a = t
                }
                this.parentSize = a
            }
            h.prototype.withStyle = function(e) {
                return new h(e, this.size, this.color, this.style, this.size)
            };
            h.prototype.withSize = function(e) {
                return new h(this.style, e, this.color, this.style, this.size)
            };
            h.prototype.withColor = function(e) {
                return new h(this.style, this.size, e, this.style, this.size)
            };
            h.prototype.reset = function() {
                return new h(this.style, this.size, this.color, this.style, this.size)
            };
            var a = {
                "katex-blue": "#6495ed",
                "katex-orange": "#ffa500",
                "katex-pink": "#ff00af",
                "katex-red": "#df0030",
                "katex-green": "#28ae7b",
                "katex-gray": "gray",
                "katex-purple": "#9d38bd"
            };
            h.prototype.getColor = function() {
                return a[this.color] || this.color
            };
            t.exports = h
        }, {}],
        4: [function(e, t, i) {
            function h(e, t, i) {
                var a = "KaTeX parse error: " + e;
                if (t !== undefined && i !== undefined) {
                    a += " at position " + i + ": ";
                    var s = t._input;
                    s = s.slice(0, i) + "̲" + s.slice(i);
                    var r = Math.max(0, i - 15);
                    var l = i + 15;
                    a += s.slice(r, l)
                }
                var p = new Error(a);
                p.name = "ParseError";
                p.__proto__ = h.prototype;
                p.position = i;
                return p
            }
            h.prototype.__proto__ = Error.prototype;
            t.exports = h
        }, {}],
        5: [function(e, t, i) {
            var h = e("./functions");
            var a = e("./Lexer");
            var s = e("./symbols");
            var r = e("./utils");
            var l = e("./ParseError");

            function p(e) {
                this.lexer = new a(e)
            }

            function n(e, t, i) {
                this.type = e;
                this.value = t;
                this.mode = i
            }

            function c(e, t) {
                this.result = e;
                this.position = t
            }

            function o(e, t, i, h, a, s) {
                this.result = e;
                this.isFunction = t;
                this.allowedInText = i;
                this.numArgs = h;
                this.numOptionalArgs = a;
                this.argTypes = s
            }
            p.prototype.expect = function(e, t) {
                if (e.text !== t) {
                    throw new l("Expected '" + t + "', got '" + e.text + "'", this.lexer, e.position)
                }
            };
            p.prototype.parse = function(e) {
                var t = this.parseInput(0, "math");
                return t.result
            };
            p.prototype.parseInput = function(e, t) {
                var i = this.parseExpression(e, t, false, null);
                var h = this.lexer.lex(i.position, t);
                this.expect(h, "EOF");
                return i
            };
            p.prototype.parseExpression = function(e, t, i, h) {
                var a = [];
                while (true) {
                    var s = this.lexer.lex(e, t);
                    if (h != null && s.text === h) {
                        break
                    }
                    var r = this.parseAtom(e, t);
                    if (!r) {
                        break
                    }
                    if (i && r.result.type === "infix") {
                        break
                    }
                    a.push(r.result);
                    e = r.position
                }
                return new c(this.handleInfixNodes(a, t), e)
            };
            p.prototype.handleInfixNodes = function(e, t) {
                var i = -1;
                var a;
                var s;
                for (var r = 0; r < e.length; r++) {
                    var p = e[r];
                    if (p.type === "infix") {
                        if (i !== -1) {
                            throw new l("only one infix operator per group", this.lexer, -1)
                        }
                        i = r;
                        s = p.value.replaceWith;
                        a = h.funcs[s]
                    }
                }
                if (i !== -1) {
                    var c, o;
                    var d = e.slice(0, i);
                    var g = e.slice(i + 1);
                    if (d.length === 1 && d[0].type === "ordgroup") {
                        c = d[0]
                    } else {
                        c = new n("ordgroup", d, t)
                    }
                    if (g.length === 1 && g[0].type === "ordgroup") {
                        o = g[0]
                    } else {
                        o = new n("ordgroup", g, t)
                    }
                    var u = a.handler(s, c, o);
                    return [new n(u.type, u, t)]
                } else {
                    return e
                }
            };
            var d = 1;
            p.prototype.handleSupSubscript = function(e, t, i, a) {
                var s = this.parseGroup(e, t);
                if (!s) {
                    throw new l("Expected group after '" + i + "'", this.lexer, e)
                } else if (s.numArgs > 0) {
                    var r = h.getGreediness(s.result.result);
                    if (r > d) {
                        return this.parseFunction(e, t)
                    } else {
                        throw new l("Got function '" + s.result.result + "' with no arguments " + "as " + a, this.lexer, e)
                    }
                } else {
                    return s.result
                }
            };
            p.prototype.parseAtom = function(e, t) {
                var i = this.parseImplicitGroup(e, t);
                if (t === "text") {
                    return i
                }
                var h;
                if (!i) {
                    h = e;
                    i = undefined
                } else {
                    h = i.position
                }
                var a;
                var s;
                var r;
                while (true) {
                    var p = this.lexer.lex(h, t);
                    if (p.text === "^") {
                        if (a) {
                            throw new l("Double superscript", this.lexer, h)
                        }
                        r = this.handleSupSubscript(p.position, t, p.text, "superscript");
                        h = r.position;
                        a = r.result
                    } else if (p.text === "_") {
                        if (s) {
                            throw new l("Double subscript", this.lexer, h)
                        }
                        r = this.handleSupSubscript(p.position, t, p.text, "subscript");
                        h = r.position;
                        s = r.result
                    } else if (p.text === "'") {
                        var o = new n("textord", "\\prime", t);
                        var d = [o];
                        h = p.position;
                        while ((p = this.lexer.lex(h, t)).text === "'") {
                            d.push(o);
                            h = p.position
                        }
                        a = new n("ordgroup", d, t)
                    } else {
                        break
                    }
                }
                if (a || s) {
                    return new c(new n("supsub", {
                        base: i && i.result,
                        sup: a,
                        sub: s
                    }, t), h)
                } else {
                    return i
                }
            };
            var g = ["\\tiny", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"];
            var u = ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"];
            p.prototype.parseImplicitGroup = function(e, t) {
                var i = this.parseSymbol(e, t);
                if (!i || !i.result) {
                    return this.parseFunction(e, t)
                }
                var h = i.result.result;
                var a;
                if (h === "\\left") {
                    var s = this.parseFunction(e, t);
                    a = this.parseExpression(s.position, t, false, "}");
                    var p = this.parseSymbol(a.position, t);
                    if (p && p.result.result === "\\right") {
                        var o = this.parseFunction(a.position, t);
                        return new c(new n("leftright", {
                            body: a.result,
                            left: s.result.value.value,
                            right: o.result.value.value
                        }, t), o.position)
                    } else {
                        throw new l("Missing \\right", this.lexer, a.position)
                    }
                } else if (h === "\\right") {
                    return null
                } else if (r.contains(g, h)) {
                    a = this.parseExpression(i.result.position, t, false, "}");
                    return new c(new n("sizing", {
                        size: "size" + (r.indexOf(g, h) + 1),
                        value: a.result
                    }, t), a.position)
                } else if (r.contains(u, h)) {
                    a = this.parseExpression(i.result.position, t, true, "}");
                    return new c(new n("styling", {
                        style: h.slice(1, h.length - 5),
                        value: a.result
                    }, t), a.position)
                } else {
                    return this.parseFunction(e, t)
                }
            };
            p.prototype.parseFunction = function(e, t) {
                var i = this.parseGroup(e, t);
                if (i) {
                    if (i.isFunction) {
                        var a = i.result.result;
                        if (t === "text" && !i.allowedInText) {
                            throw new l("Can't use function '" + a + "' in text mode", this.lexer, i.position)
                        }
                        var s = i.result.position;
                        var r;
                        var p = i.numArgs + i.numOptionalArgs;
                        if (p > 0) {
                            var o = h.getGreediness(a);
                            var d = [a];
                            var g = [s];
                            for (var u = 0; u < p; u++) {
                                var w = i.argTypes && i.argTypes[u];
                                var k;
                                if (u < i.numOptionalArgs) {
                                    if (w) {
                                        k = this.parseSpecialGroup(s, w, t, true)
                                    } else {
                                        k = this.parseOptionalGroup(s, t)
                                    }
                                    if (!k) {
                                        d.push(null);
                                        g.push(s);
                                        continue
                                    }
                                } else {
                                    if (w) {
                                        k = this.parseSpecialGroup(s, w, t)
                                    } else {
                                        k = this.parseGroup(s, t)
                                    }
                                    if (!k) {
                                        throw new l("Expected group after '" + i.result.result + "'", this.lexer, s)
                                    }
                                }
                                var f;
                                if (k.numArgs > 0) {
                                    var m = h.getGreediness(k.result.result);
                                    if (m > o) {
                                        f = this.parseFunction(s, t)
                                    } else {
                                        throw new l("Got function '" + k.result.result + "' as " + "argument to function '" + i.result.result + "'", this.lexer, k.result.position - 1)
                                    }
                                } else {
                                    f = k.result
                                }
                                d.push(f.result);
                                g.push(f.position);
                                s = f.position
                            }
                            d.push(g);
                            r = h.funcs[a].handler.apply(this, d)
                        } else {
                            r = h.funcs[a].handler.apply(this, [a])
                        }
                        return new c(new n(r.type, r, t), s)
                    } else {
                        return i.result
                    }
                } else {
                    return null
                }
            };
            p.prototype.parseSpecialGroup = function(e, t, i, h) {
                if (t === "color" || t === "size") {
                    var a = this.lexer.lex(e, i);
                    if (h && a.text !== "[") {
                        return null
                    }
                    this.expect(a, h ? "[" : "{");
                    var s = this.lexer.lex(a.position, t);
                    var r;
                    if (t === "color") {
                        r = s.text
                    } else {
                        r = s.data
                    }
                    var l = this.lexer.lex(s.position, i);
                    this.expect(l, h ? "]" : "}");
                    return new o(new c(new n(t, r, i), l.position), false)
                } else if (t === "text") {
                    var p = this.lexer.lex(e, "whitespace");
                    e = p.position
                }
                if (h) {
                    return this.parseOptionalGroup(e, t)
                } else {
                    return this.parseGroup(e, t)
                }
            };
            p.prototype.parseGroup = function(e, t) {
                var i = this.lexer.lex(e, t);
                if (i.text === "{") {
                    var h = this.parseExpression(i.position, t, false, "}");
                    var a = this.lexer.lex(h.position, t);
                    this.expect(a, "}");
                    return new o(new c(new n("ordgroup", h.result, t), a.position), false)
                } else {
                    return this.parseSymbol(e, t)
                }
            };
            p.prototype.parseOptionalGroup = function(e, t) {
                var i = this.lexer.lex(e, t);
                if (i.text === "[") {
                    var h = this.parseExpression(i.position, t, false, "]");
                    var a = this.lexer.lex(h.position, t);
                    this.expect(a, "]");
                    return new o(new c(new n("ordgroup", h.result, t), a.position), false)
                } else {
                    return null
                }
            };
            p.prototype.parseSymbol = function(e, t) {
                var i = this.lexer.lex(e, t);
                if (h.funcs[i.text]) {
                    var a = h.funcs[i.text];
                    var r = a.argTypes;
                    if (r) {
                        r = r.slice();
                        for (var l = 0; l < r.length; l++) {
                            if (r[l] === "original") {
                                r[l] = t
                            }
                        }
                    }
                    return new o(new c(i.text, i.position), true, a.allowedInText, a.numArgs, a.numOptionalArgs, r)
                } else if (s[t][i.text]) {
                    return new o(new c(new n(s[t][i.text].group, i.text, t), i.position), false)
                } else {
                    return null
                }
            };
            t.exports = p
        }, {
            "./Lexer": 2,
            "./ParseError": 4,
            "./functions": 12,
            "./symbols": 14,
            "./utils": 15
        }],
        6: [function(e, t, i) {
            function h(e, t, i, h) {
                this.id = e;
                this.size = t;
                this.cramped = h;
                this.sizeMultiplier = i
            }
            h.prototype.sup = function() {
                return u[w[this.id]]
            };
            h.prototype.sub = function() {
                return u[k[this.id]]
            };
            h.prototype.fracNum = function() {
                return u[f[this.id]]
            };
            h.prototype.fracDen = function() {
                return u[m[this.id]]
            };
            h.prototype.cramp = function() {
                return u[v[this.id]]
            };
            h.prototype.cls = function() {
                return d[this.size] + (this.cramped ? " cramped" : " uncramped")
            };
            h.prototype.reset = function() {
                return g[this.size]
            };
            var a = 0;
            var s = 1;
            var r = 2;
            var l = 3;
            var p = 4;
            var n = 5;
            var c = 6;
            var o = 7;
            var d = ["displaystyle textstyle", "textstyle", "scriptstyle", "scriptscriptstyle"];
            var g = ["reset-textstyle", "reset-textstyle", "reset-scriptstyle", "reset-scriptscriptstyle"];
            var u = [new h(a, 0, 1, false), new h(s, 0, 1, true), new h(r, 1, 1, false), new h(l, 1, 1, true), new h(p, 2, .7, false), new h(n, 2, .7, true), new h(c, 3, .5, false), new h(o, 3, .5, true)];
            var w = [p, n, p, n, c, o, c, o];
            var k = [n, n, n, n, o, o, o, o];
            var f = [r, l, p, n, c, o, c, o];
            var m = [l, l, n, n, o, o, o, o];
            var v = [s, s, l, l, n, n, o, o];
            t.exports = {
                DISPLAY: u[a],
                TEXT: u[r],
                SCRIPT: u[p],
                SCRIPTSCRIPT: u[c]
            }
        }, {}],
        7: [function(e, t, i) {
            var h = e("./domTree");
            var a = e("./fontMetrics");
            var s = e("./symbols");
            var r = function(e, t, i, r, l) {
                if (s[i][e] && s[i][e].replace) {
                    e = s[i][e].replace
                }
                var p = a.getCharacterMetrics(e, t);
                var n;
                if (p) {
                    n = new h.symbolNode(e, p.height, p.depth, p.italic, p.skew, l)
                } else {
                    typeof console !== "undefined" && console.warn("No character metrics for '" + e + "' in style '" + t + "'");
                    n = new h.symbolNode(e, 0, 0, 0, 0, l)
                }
                if (r) {
                    n.style.color = r
                }
                return n
            };
            var l = function(e, t, i, h) {
                return r(e, "Math-Italic", t, i, h.concat(["mathit"]))
            };
            var p = function(e, t, i, h) {
                if (s[t][e].font === "main") {
                    return r(e, "Main-Regular", t, i, h)
                } else {
                    return r(e, "AMS-Regular", t, i, h.concat(["amsrm"]))
                }
            };
            var n = function(e) {
                var t = 0;
                var i = 0;
                var h = 0;
                if (e.children) {
                    for (var a = 0; a < e.children.length; a++) {
                        if (e.children[a].height > t) {
                            t = e.children[a].height
                        }
                        if (e.children[a].depth > i) {
                            i = e.children[a].depth
                        }
                        if (e.children[a].maxFontSize > h) {
                            h = e.children[a].maxFontSize
                        }
                    }
                }
                e.height = t;
                e.depth = i;
                e.maxFontSize = h
            };
            var c = function(e, t, i) {
                var a = new h.span(e, t);
                n(a);
                if (i) {
                    a.style.color = i
                }
                return a
            };
            var o = function(e) {
                var t = new h.documentFragment(e);
                n(t);
                return t
            };
            var d = function(e, t) {
                var i = c([], [new h.symbolNode("​")]);
                i.style.fontSize = t / e.style.sizeMultiplier + "em";
                var a = c(["fontsize-ensurer", "reset-" + e.size, "size5"], [i]);
                return a
            };
            var g = function(e, t, i, a) {
                var s;
                var r;
                var l;
                if (t === "individualShift") {
                    var p = e;
                    e = [p[0]];
                    s = -p[0].shift - p[0].elem.depth;
                    r = s;
                    for (l = 1; l < p.length; l++) {
                        var n = -p[l].shift - r - p[l].elem.depth;
                        var o = n - (p[l - 1].elem.height + p[l - 1].elem.depth);
                        r = r + n;
                        e.push({
                            type: "kern",
                            size: o
                        });
                        e.push(p[l])
                    }
                } else if (t === "top") {
                    var g = i;
                    for (l = 0; l < e.length; l++) {
                        if (e[l].type === "kern") {
                            g -= e[l].size
                        } else {
                            g -= e[l].elem.height + e[l].elem.depth
                        }
                    }
                    s = g
                } else if (t === "bottom") {
                    s = -i
                } else if (t === "shift") {
                    s = -e[0].elem.depth - i
                } else if (t === "firstBaseline") {
                    s = -e[0].elem.depth
                } else {
                    s = 0
                }
                var u = 0;
                for (l = 0; l < e.length; l++) {
                    if (e[l].type === "elem") {
                        u = Math.max(u, e[l].elem.maxFontSize)
                    }
                }
                var w = d(a, u);
                var k = [];
                r = s;
                for (l = 0; l < e.length; l++) {
                    if (e[l].type === "kern") {
                        r += e[l].size
                    } else {
                        var f = e[l].elem;
                        var m = -f.depth - r;
                        r += f.height + f.depth;
                        var v = c([], [w, f]);
                        v.height -= m;
                        v.depth += m;
                        v.style.top = m + "em";
                        k.push(v)
                    }
                }
                var y = c(["baseline-fix"], [w, new h.symbolNode("​")]);
                k.push(y);
                var x = c(["vlist"], k);
                x.height = Math.max(r, x.height);
                x.depth = Math.max(-s, x.depth);
                return x
            };
            t.exports = {
                makeSymbol: r,
                mathit: l,
                mathrm: p,
                makeSpan: c,
                makeFragment: o,
                makeVList: g
            }
        }, {
            "./domTree": 10,
            "./fontMetrics": 11,
            "./symbols": 14
        }],
        8: [function(e, t, i) {
            var h = e("./Options");
            var a = e("./ParseError");
            var s = e("./Style");
            var r = e("./buildCommon");
            var l = e("./delimiter");
            var p = e("./domTree");
            var n = e("./fontMetrics");
            var c = e("./utils");
            var o = r.makeSpan;
            var d = function(e, t, i) {
                var h = [];
                for (var a = 0; a < e.length; a++) {
                    var s = e[a];
                    h.push(y(s, t, i));
                    i = s
                }
                return h
            };
            var g = {
                mathord: "mord",
                textord: "mord",
                bin: "mbin",
                rel: "mrel",
                text: "mord",
                open: "mopen",
                close: "mclose",
                inner: "minner",
                frac: "minner",
                spacing: "mord",
                punct: "mpunct",
                ordgroup: "mord",
                op: "mop",
                katex: "mord",
                overline: "mord",
                rule: "mord",
                leftright: "minner",
                sqrt: "mord",
                accent: "mord"
            };
            var u = function(e) {
                if (e == null) {
                    return g.mathord
                } else if (e.type === "supsub") {
                    return u(e.value.base)
                } else if (e.type === "llap" || e.type === "rlap") {
                    return u(e.value)
                } else if (e.type === "color") {
                    return u(e.value.value)
                } else if (e.type === "sizing") {
                    return u(e.value.value)
                } else if (e.type === "styling") {
                    return u(e.value.value)
                } else if (e.type === "delimsizing") {
                    return g[e.value.delimType]
                } else {
                    return g[e.type]
                }
            };
            var w = function(e, t) {
                if (!e) {
                    return false
                } else if (e.type === "op") {
                    return e.value.limits && t.style.size === s.DISPLAY.size
                } else if (e.type === "accent") {
                    return f(e.value.base)
                } else {
                    return null
                }
            };
            var k = function(e) {
                if (!e) {
                    return false
                } else if (e.type === "ordgroup") {
                    if (e.value.length === 1) {
                        return k(e.value[0])
                    } else {
                        return e
                    }
                } else if (e.type === "color") {
                    if (e.value.value.length === 1) {
                        return k(e.value.value[0])
                    } else {
                        return e
                    }
                } else {
                    return e
                }
            };
            var f = function(e) {
                var t = k(e);
                return t.type === "mathord" || t.type === "textord" || t.type === "bin" || t.type === "rel" || t.type === "inner" || t.type === "open" || t.type === "close" || t.type === "punct"
            };
            var m = {
                mathord: function(e, t, i) {
                    return r.mathit(e.value, e.mode, t.getColor(), ["mord"])
                },
                textord: function(e, t, i) {
                    return r.mathrm(e.value, e.mode, t.getColor(), ["mord"])
                },
                bin: function(e, t, i) {
                    var h = "mbin";
                    var a = i;
                    while (a && a.type == "color") {
                        var s = a.value.value;
                        a = s[s.length - 1]
                    }
                    if (!i || c.contains(["mbin", "mopen", "mrel", "mop", "mpunct"], u(a))) {
                        e.type = "textord";
                        h = "mord"
                    }
                    return r.mathrm(e.value, e.mode, t.getColor(), [h])
                },
                rel: function(e, t, i) {
                    return r.mathrm(e.value, e.mode, t.getColor(), ["mrel"])
                },
                open: function(e, t, i) {
                    return r.mathrm(e.value, e.mode, t.getColor(), ["mopen"])
                },
                close: function(e, t, i) {
                    return r.mathrm(e.value, e.mode, t.getColor(), ["mclose"])
                },
                inner: function(e, t, i) {
                    return r.mathrm(e.value, e.mode, t.getColor(), ["minner"])
                },
                punct: function(e, t, i) {
                    return r.mathrm(e.value, e.mode, t.getColor(), ["mpunct"])
                },
                ordgroup: function(e, t, i) {
                    return o(["mord", t.style.cls()], d(e.value, t.reset()))
                },
                text: function(e, t, i) {
                    return o(["text", "mord", t.style.cls()], d(e.value.body, t.reset()))
                },
                color: function(e, t, i) {
                    var h = d(e.value.value, t.withColor(e.value.color), i);
                    return new r.makeFragment(h)
                },
                supsub: function(e, t, i) {
                    if (w(e.value.base, t)) {
                        return m[e.value.base.type](e, t, i)
                    }
                    var h = y(e.value.base, t.reset());
                    var a, l, c, d;
                    if (e.value.sup) {
                        c = y(e.value.sup, t.withStyle(t.style.sup()));
                        a = o([t.style.reset(), t.style.sup().cls()], [c])
                    }
                    if (e.value.sub) {
                        d = y(e.value.sub, t.withStyle(t.style.sub()));
                        l = o([t.style.reset(), t.style.sub().cls()], [d])
                    }
                    var g, k;
                    if (f(e.value.base)) {
                        g = 0;
                        k = 0
                    } else {
                        g = h.height - n.metrics.supDrop;
                        k = h.depth + n.metrics.subDrop
                    }
                    var v;
                    if (t.style === s.DISPLAY) {
                        v = n.metrics.sup1
                    } else if (t.style.cramped) {
                        v = n.metrics.sup3
                    } else {
                        v = n.metrics.sup2
                    }
                    var x = s.TEXT.sizeMultiplier * t.style.sizeMultiplier;
                    var b = .5 / n.metrics.ptPerEm / x + "em";
                    var _;
                    if (!e.value.sup) {
                        k = Math.max(k, n.metrics.sub1, d.height - .8 * n.metrics.xHeight);
                        _ = r.makeVList([{
                            type: "elem",
                            elem: l
                        }], "shift", k, t);
                        _.children[0].style.marginRight = b;
                        if (h instanceof p.symbolNode) {
                            _.children[0].style.marginLeft = -h.italic + "em"
                        }
                    } else if (!e.value.sub) {
                        g = Math.max(g, v, c.depth + .25 * n.metrics.xHeight);
                        _ = r.makeVList([{
                            type: "elem",
                            elem: a
                        }], "shift", -g, t);
                        _.children[0].style.marginRight = b
                    } else {
                        g = Math.max(g, v, c.depth + .25 * n.metrics.xHeight);
                        k = Math.max(k, n.metrics.sub2);
                        var z = n.metrics.defaultRuleThickness;
                        if (g - c.depth - (d.height - k) < 4 * z) {
                            k = 4 * z - (g - c.depth) + d.height;
                            var S = .8 * n.metrics.xHeight - (g - c.depth);
                            if (S > 0) {
                                g += S;
                                k -= S
                            }
                        }
                        _ = r.makeVList([{
                            type: "elem",
                            elem: l,
                            shift: k
                        }, {
                            type: "elem",
                            elem: a,
                            shift: -g
                        }], "individualShift", null, t);
                        if (h instanceof p.symbolNode) {
                            _.children[0].style.marginLeft = -h.italic + "em"
                        }
                        _.children[0].style.marginRight = b;
                        _.children[1].style.marginRight = b
                    }
                    return o([u(e.value.base)], [h, _])
                },
                genfrac: function(e, t, i) {
                    var h = t.style;
                    if (e.value.size === "display") {
                        h = s.DISPLAY
                    } else if (e.value.size === "text") {
                        h = s.TEXT
                    }
                    var a = h.fracNum();
                    var p = h.fracDen();
                    var c = y(e.value.numer, t.withStyle(a));
                    var d = o([h.reset(), a.cls()], [c]);
                    var g = y(e.value.denom, t.withStyle(p));
                    var u = o([h.reset(), p.cls()], [g]);
                    var w;
                    if (e.value.hasBarLine) {
                        w = n.metrics.defaultRuleThickness / t.style.sizeMultiplier
                    } else {
                        w = 0
                    }
                    var k;
                    var f;
                    var m;
                    if (h.size === s.DISPLAY.size) {
                        k = n.metrics.num1;
                        if (w > 0) {
                            f = 3 * w
                        } else {
                            f = 7 * n.metrics.defaultRuleThickness
                        }
                        m = n.metrics.denom1
                    } else {
                        if (w > 0) {
                            k = n.metrics.num2;
                            f = w
                        } else {
                            k = n.metrics.num3;
                            f = 3 * n.metrics.defaultRuleThickness
                        }
                        m = n.metrics.denom2
                    }
                    var v;
                    if (w === 0) {
                        var x = k - c.depth - (g.height - m);
                        if (x < f) {
                            k += .5 * (f - x);
                            m += .5 * (f - x)
                        }
                        v = r.makeVList([{
                            type: "elem",
                            elem: u,
                            shift: m
                        }, {
                            type: "elem",
                            elem: d,
                            shift: -k
                        }], "individualShift", null, t)
                    } else {
                        var b = n.metrics.axisHeight;
                        if (k - c.depth - (b + .5 * w) < f) {
                            k += f - (k - c.depth - (b + .5 * w))
                        }
                        if (b - .5 * w - (g.height - m) < f) {
                            m += f - (b - .5 * w - (g.height - m))
                        }
                        var _ = o([t.style.reset(), s.TEXT.cls(), "frac-line"]);
                        _.height = w;
                        var z = -(b - .5 * w);
                        v = r.makeVList([{
                            type: "elem",
                            elem: u,
                            shift: m
                        }, {
                            type: "elem",
                            elem: _,
                            shift: z
                        }, {
                            type: "elem",
                            elem: d,
                            shift: -k
                        }], "individualShift", null, t)
                    }
                    v.height *= h.sizeMultiplier / t.style.sizeMultiplier;
                    v.depth *= h.sizeMultiplier / t.style.sizeMultiplier;
                    var S = [o(["mfrac"], [v])];
                    var T;
                    if (h.size === s.DISPLAY.size) {
                        T = n.metrics.delim1
                    } else {
                        T = n.metrics.getDelim2(h)
                    }
                    if (e.value.leftDelim != null) {
                        S.unshift(l.customSizedDelim(e.value.leftDelim, T, true, t.withStyle(h), e.mode))
                    }
                    if (e.value.rightDelim != null) {
                        S.push(l.customSizedDelim(e.value.rightDelim, T, true, t.withStyle(h), e.mode))
                    }
                    return o(["minner", t.style.reset(), h.cls()], S, t.getColor())
                },
                spacing: function(e, t, i) {
                    if (e.value === "\\ " || e.value === "\\space" || e.value === " " || e.value === "~") {
                        return o(["mord", "mspace"], [r.mathrm(e.value, e.mode)])
                    } else {
                        var h = {
                            "\\qquad": "qquad",
                            "\\quad": "quad",
                            "\\enspace": "enspace",
                            "\\;": "thickspace",
                            "\\:": "mediumspace",
                            "\\,": "thinspace",
                            "\\!": "negativethinspace"
                        };
                        return o(["mord", "mspace", h[e.value]])
                    }
                },
                llap: function(e, t, i) {
                    var h = o(["inner"], [y(e.value.body, t.reset())]);
                    var a = o(["fix"], []);
                    return o(["llap", t.style.cls()], [h, a])
                },
                rlap: function(e, t, i) {
                    var h = o(["inner"], [y(e.value.body, t.reset())]);
                    var a = o(["fix"], []);
                    return o(["rlap", t.style.cls()], [h, a])
                },
                op: function(e, t, i) {
                    var h;
                    var a;
                    var l = false;
                    if (e.type === "supsub") {
                        h = e.value.sup;
                        a = e.value.sub;
                        e = e.value.base;
                        l = true
                    }
                    var p = ["\\smallint"];
                    var d = false;
                    if (t.style.size === s.DISPLAY.size && e.value.symbol && !c.contains(p, e.value.body)) {
                        d = true
                    }
                    var g;
                    var u = 0;
                    var w = 0;
                    if (e.value.symbol) {
                        var k = d ? "Size2-Regular" : "Size1-Regular";
                        g = r.makeSymbol(e.value.body, k, "math", t.getColor(), ["op-symbol", d ? "large-op" : "small-op", "mop"]);
                        u = (g.height - g.depth) / 2 - n.metrics.axisHeight * t.style.sizeMultiplier;
                        w = g.italic
                    } else {
                        var f = [];
                        for (var m = 1; m < e.value.body.length; m++) {
                            f.push(r.mathrm(e.value.body[m], e.mode))
                        }
                        g = o(["mop"], f, t.getColor())
                    }
                    if (l) {
                        g = o([], [g]);
                        var v, x, b, _;
                        if (h) {
                            var z = y(h, t.withStyle(t.style.sup()));
                            v = o([t.style.reset(), t.style.sup().cls()], [z]);
                            x = Math.max(n.metrics.bigOpSpacing1, n.metrics.bigOpSpacing3 - z.depth)
                        }
                        if (a) {
                            var S = y(a, t.withStyle(t.style.sub()));
                            b = o([t.style.reset(), t.style.sub().cls()], [S]);
                            _ = Math.max(n.metrics.bigOpSpacing2, n.metrics.bigOpSpacing4 - S.height)
                        }
                        var T, C, M;
                        if (!h) {
                            C = g.height - u;
                            T = r.makeVList([{
                                type: "kern",
                                size: n.metrics.bigOpSpacing5
                            }, {
                                type: "elem",
                                elem: b
                            }, {
                                type: "kern",
                                size: _
                            }, {
                                type: "elem",
                                elem: g
                            }], "top", C, t);
                            T.children[0].style.marginLeft = -w + "em"
                        } else if (!a) {
                            M = g.depth + u;
                            T = r.makeVList([{
                                type: "elem",
                                elem: g
                            }, {
                                type: "kern",
                                size: x
                            }, {
                                type: "elem",
                                elem: v
                            }, {
                                type: "kern",
                                size: n.metrics.bigOpSpacing5
                            }], "bottom", M, t);
                            T.children[1].style.marginLeft = w + "em"
                        } else if (!h && !a) {
                            return g
                        } else {
                            M = n.metrics.bigOpSpacing5 + b.height + b.depth + _ + g.depth + u;
                            T = r.makeVList([{
                                type: "kern",
                                size: n.metrics.bigOpSpacing5
                            }, {
                                type: "elem",
                                elem: b
                            }, {
                                type: "kern",
                                size: _
                            }, {
                                type: "elem",
                                elem: g
                            }, {
                                type: "kern",
                                size: x
                            }, {
                                type: "elem",
                                elem: v
                            }, {
                                type: "kern",
                                size: n.metrics.bigOpSpacing5
                            }], "bottom", M, t);
                            T.children[0].style.marginLeft = -w + "em";
                            T.children[2].style.marginLeft = w + "em"
                        }
                        return o(["mop", "op-limits"], [T])
                    } else {
                        if (e.value.symbol) {
                            g.style.top = u + "em"
                        }
                        return g
                    }
                },
                katex: function(e, t, i) {
                    var h = o(["k"], [r.mathrm("K", e.mode)]);
                    var a = o(["a"], [r.mathrm("A", e.mode)]);
                    a.height = (a.height + .2) * .75;
                    a.depth = (a.height - .2) * .75;
                    var s = o(["t"], [r.mathrm("T", e.mode)]);
                    var l = o(["e"], [r.mathrm("E", e.mode)]);
                    l.height = l.height - .2155;
                    l.depth = l.depth + .2155;
                    var p = o(["x"], [r.mathrm("X", e.mode)]);
                    return o(["katex-logo"], [h, a, s, l, p], t.getColor())
                },
                overline: function(e, t, i) {
                    var h = y(e.value.body, t.withStyle(t.style.cramp()));
                    var a = n.metrics.defaultRuleThickness / t.style.sizeMultiplier;
                    var l = o([t.style.reset(), s.TEXT.cls(), "overline-line"]);
                    l.height = a;
                    l.maxFontSize = 1;
                    var p = r.makeVList([{
                        type: "elem",
                        elem: h
                    }, {
                        type: "kern",
                        size: 3 * a
                    }, {
                        type: "elem",
                        elem: l
                    }, {
                        type: "kern",
                        size: a
                    }], "firstBaseline", null, t);
                    return o(["overline", "mord"], [p], t.getColor())
                },
                sqrt: function(e, t, i) {
                    var h = y(e.value.body, t.withStyle(t.style.cramp()));
                    var a = n.metrics.defaultRuleThickness / t.style.sizeMultiplier;
                    var p = o([t.style.reset(), s.TEXT.cls(), "sqrt-line"], [], t.getColor());
                    p.height = a;
                    p.maxFontSize = 1;
                    var c = a;
                    if (t.style.id < s.TEXT.id) {
                        c = n.metrics.xHeight
                    }
                    var d = a + c / 4;
                    var g = (h.height + h.depth) * t.style.sizeMultiplier;
                    var u = g + d + a;
                    var w = o(["sqrt-sign"], [l.customSizedDelim("\\surd", u, false, t, e.mode)], t.getColor());
                    var k = w.height + w.depth - a;
                    if (k > h.height + h.depth + d) {
                        d = (d + k - h.height - h.depth) / 2
                    }
                    var f = -(h.height + d + a) + w.height;
                    w.style.top = f + "em";
                    w.height -= f;
                    w.depth += f;
                    var m;
                    if (h.height === 0 && h.depth === 0) {
                        m = o()
                    } else {
                        m = r.makeVList([{
                            type: "elem",
                            elem: h
                        }, {
                            type: "kern",
                            size: d
                        }, {
                            type: "elem",
                            elem: p
                        }, {
                            type: "kern",
                            size: a
                        }], "firstBaseline", null, t)
                    }
                    return o(["sqrt", "mord"], [w, m])
                },
                sizing: function(e, t, i) {
                    var h = d(e.value.value, t.withSize(e.value.size), i);
                    var a = o(["mord"], [o(["sizing", "reset-" + t.size, e.value.size, t.style.cls()], h)]);
                    var s = v[e.value.size];
                    a.maxFontSize = s * t.style.sizeMultiplier;
                    return a
                },
                styling: function(e, t, i) {
                    var h = {
                        display: s.DISPLAY,
                        text: s.TEXT,
                        script: s.SCRIPT,
                        scriptscript: s.SCRIPTSCRIPT
                    };
                    var a = h[e.value.style];
                    var r = d(e.value.value, t.withStyle(a), i);
                    return o([t.style.reset(), a.cls()], r)
                },
                delimsizing: function(e, t, i) {
                    var h = e.value.value;
                    if (h === ".") {
                        return o([g[e.value.delimType]])
                    }
                    return o([g[e.value.delimType]], [l.sizedDelim(h, e.value.size, t, e.mode)])
                },
                leftright: function(e, t, i) {
                    var h = d(e.value.body, t.reset());
                    var a = 0;
                    var s = 0;
                    for (var r = 0; r < h.length; r++) {
                        a = Math.max(h[r].height, a);
                        s = Math.max(h[r].depth, s)
                    }
                    a *= t.style.sizeMultiplier;
                    s *= t.style.sizeMultiplier;
                    var p;
                    if (e.value.left === ".") {
                        p = o(["nulldelimiter"])
                    } else {
                        p = l.leftRightDelim(e.value.left, a, s, t, e.mode)
                    }
                    h.unshift(p);
                    var n;
                    if (e.value.right === ".") {
                        n = o(["nulldelimiter"])
                    } else {
                        n = l.leftRightDelim(e.value.right, a, s, t, e.mode)
                    }
                    h.push(n);
                    return o(["minner", t.style.cls()], h, t.getColor())
                },
                rule: function(e, t, i) {
                    var h = o(["mord", "rule"], [], t.getColor());
                    var a = 0;
                    if (e.value.shift) {
                        a = e.value.shift.number;
                        if (e.value.shift.unit === "ex") {
                            a *= n.metrics.xHeight
                        }
                    }
                    var s = e.value.width.number;
                    if (e.value.width.unit === "ex") {
                        s *= n.metrics.xHeight
                    }
                    var r = e.value.height.number;
                    if (e.value.height.unit === "ex") {
                        r *= n.metrics.xHeight
                    }
                    a /= t.style.sizeMultiplier;
                    s /= t.style.sizeMultiplier;
                    r /= t.style.sizeMultiplier;
                    h.style.borderRightWidth = s + "em";
                    h.style.borderTopWidth = r + "em";
                    h.style.bottom = a + "em";
                    h.width = s;
                    h.height = r + a;
                    h.depth = -a;
                    return h
                },
                accent: function(e, t, i) {
                    var h = e.value.base;
                    var a;
                    if (e.type === "supsub") {
                        var s = e;
                        e = s.value.base;
                        h = e.value.base;
                        s.value.base = h;
                        a = y(s, t.reset(), i)
                    }
                    var l = y(h, t.withStyle(t.style.cramp()));
                    var p;
                    if (f(h)) {
                        var c = k(h);
                        var d = y(c, t.withStyle(t.style.cramp()));
                        p = d.skew
                    } else {
                        p = 0
                    }
                    var g = Math.min(l.height, n.metrics.xHeight);
                    var u = r.makeSymbol(e.value.accent, "Main-Regular", "math", t.getColor());
                    u.italic = 0;
                    var w = e.value.accent === "\\vec" ? "accent-vec" : null;
                    var m = o(["accent-body", w], [o([], [u])]);
                    m = r.makeVList([{
                        type: "elem",
                        elem: l
                    }, {
                        type: "kern",
                        size: -g
                    }, {
                        type: "elem",
                        elem: m
                    }], "firstBaseline", null, t);
                    m.children[1].style.marginLeft = 2 * p + "em";
                    var v = o(["mord", "accent"], [m]);
                    if (a) {
                        a.children[0] = v;
                        a.height = Math.max(v.height, a.height);
                        a.classes[0] = "mord";
                        return a
                    } else {
                        return v
                    }
                }
            };
            var v = {
                size1: .5,
                size2: .7,
                size3: .8,
                size4: .9,
                size5: 1,
                size6: 1.2,
                size7: 1.44,
                size8: 1.73,
                size9: 2.07,
                size10: 2.49
            };
            var y = function(e, t, i) {
                if (!e) {
                    return o()
                }
                if (m[e.type]) {
                    var h = m[e.type](e, t, i);
                    var s;
                    if (t.style !== t.parentStyle) {
                        s = t.style.sizeMultiplier / t.parentStyle.sizeMultiplier;
                        h.height *= s;
                        h.depth *= s
                    }
                    if (t.size !== t.parentSize) {
                        s = v[t.size] / v[t.parentSize];
                        h.height *= s;
                        h.depth *= s
                    }
                    return h
                } else {
                    throw new a("Got group of unknown type: '" + e.type + "'")
                }
            };
            var x = function(e) {
                var t = new h(s.TEXT, "size5", "");
                var i = d(e, t);
                var a = o(["base", t.style.cls()], i);
                var r = o(["strut"]);
                var l = o(["strut", "bottom"]);
                r.style.height = a.height + "em";
                l.style.height = a.height + a.depth + "em";
                l.style.verticalAlign = -a.depth + "em";
                var p = o(["katex"], [o(["katex-inner"], [r, l, a])]);
                return p
            };
            t.exports = x
        }, {
            "./Options": 3,
            "./ParseError": 4,
            "./Style": 6,
            "./buildCommon": 7,
            "./delimiter": 9,
            "./domTree": 10,
            "./fontMetrics": 11,
            "./utils": 15
        }],
        9: [function(e, t, i) {
            var h = e("./ParseError");
            var a = e("./Style");
            var s = e("./buildCommon");
            var r = e("./fontMetrics");
            var l = e("./symbols");
            var p = e("./utils");
            var n = s.makeSpan;
            var c = function(e, t) {
                if (l.math[e] && l.math[e].replace) {
                    return r.getCharacterMetrics(l.math[e].replace, t)
                } else {
                    return r.getCharacterMetrics(e, t)
                }
            };
            var o = function(e, t, i) {
                return s.makeSymbol(e, "Size" + t + "-Regular", i)
            };
            var d = function(e, t, i) {
                var h = n(["style-wrap", i.style.reset(), t.cls()], [e]);
                var a = t.sizeMultiplier / i.style.sizeMultiplier;
                h.height *= a;
                h.depth *= a;
                h.maxFontSize = t.sizeMultiplier;
                return h
            };
            var g = function(e, t, i, h, a) {
                var l = s.makeSymbol(e, "Main-Regular", a);
                var p = d(l, t, h);
                if (i) {
                    var n = (1 - h.style.sizeMultiplier / t.sizeMultiplier) * r.metrics.axisHeight;
                    p.style.top = n + "em";
                    p.height -= n;
                    p.depth += n
                }
                return p
            };
            var u = function(e, t, i, h, s) {
                var l = o(e, t, s);
                var p = d(n(["delimsizing", "size" + t], [l], h.getColor()), a.TEXT, h);
                if (i) {
                    var c = (1 - h.style.sizeMultiplier) * r.metrics.axisHeight;
                    p.style.top = c + "em";
                    p.height -= c;
                    p.depth += c
                }
                return p
            };
            var w = function(e, t, i) {
                var h;
                if (t === "Size1-Regular") {
                    h = "delim-size1"
                } else if (t === "Size4-Regular") {
                    h = "delim-size4"
                }
                var a = n(["delimsizinginner", h], [n([], [s.makeSymbol(e, t, i)])]);
                return {
                    type: "elem",
                    elem: a
                }
            };
            var k = function(e, t, i, h, l) {
                var p, o, g, u;
                p = g = u = e;
                o = null;
                var k = "Size1-Regular";
                if (e === "\\uparrow") {
                    g = u = "⏐"
                } else if (e === "\\Uparrow") {
                    g = u = "‖"
                } else if (e === "\\downarrow") {
                    p = g = "⏐"
                } else if (e === "\\Downarrow") {
                    p = g = "‖"
                } else if (e === "\\updownarrow") {
                    p = "\\uparrow";
                    g = "⏐";
                    u = "\\downarrow"
                } else if (e === "\\Updownarrow") {
                    p = "\\Uparrow";
                    g = "‖";
                    u = "\\Downarrow"
                } else if (e === "[" || e === "\\lbrack") {
                    p = "⎡";
                    g = "⎢";
                    u = "⎣";
                    k = "Size4-Regular"
                } else if (e === "]" || e === "\\rbrack") {
                    p = "⎤";
                    g = "⎥";
                    u = "⎦";
                    k = "Size4-Regular"
                } else if (e === "\\lfloor") {
                    g = p = "⎢";
                    u = "⎣";
                    k = "Size4-Regular"
                } else if (e === "\\lceil") {
                    p = "⎡";
                    g = u = "⎢";
                    k = "Size4-Regular"
                } else if (e === "\\rfloor") {
                    g = p = "⎥";
                    u = "⎦";
                    k = "Size4-Regular"
                } else if (e === "\\rceil") {
                    p = "⎤";
                    g = u = "⎥";
                    k = "Size4-Regular"
                } else if (e === "(") {
                    p = "⎛";
                    g = "⎜";
                    u = "⎝";
                    k = "Size4-Regular"
                } else if (e === ")") {
                    p = "⎞";
                    g = "⎟";
                    u = "⎠";
                    k = "Size4-Regular"
                } else if (e === "\\{" || e === "\\lbrace") {
                    p = "⎧";
                    o = "⎨";
                    u = "⎩";
                    g = "⎪";
                    k = "Size4-Regular"
                } else if (e === "\\}" || e === "\\rbrace") {
                    p = "⎫";
                    o = "⎬";
                    u = "⎭";
                    g = "⎪";
                    k = "Size4-Regular"
                } else if (e === "\\surd") {
                    p = "";
                    u = "⎷";
                    g = "";
                    k = "Size4-Regular"
                }
                var f = c(p, k);
                var m = f.height + f.depth;
                var v = c(g, k);
                var y = v.height + v.depth;
                var x = c(u, k);
                var b = x.height + x.depth;
                var _, z;
                if (o !== null) {
                    _ = c(o, k);
                    z = _.height + _.depth
                }
                var S = m + b;
                if (o !== null) {
                    S += z
                }
                while (S < t) {
                    S += y;
                    if (o !== null) {
                        S += y
                    }
                }
                var T = r.metrics.axisHeight;
                if (i) {
                    T *= h.style.sizeMultiplier
                }
                var C = S / 2 - T;
                var M = [];
                M.push(w(u, k, l));
                var L;
                if (o === null) {
                    var E = S - m - b;
                    var A = Math.ceil(E / y);
                    for (L = 0; L < A; L++) {
                        M.push(w(g, k, l))
                    }
                } else {
                    var P = S / 2 - m - z / 2;
                    var R = Math.ceil(P / y);
                    var O = S / 2 - m - z / 2;
                    var I = Math.ceil(O / y);
                    for (L = 0; L < R; L++) {
                        M.push(w(g, k, l))
                    }
                    M.push(w(o, k, l));
                    for (L = 0; L < I; L++) {
                        M.push(w(g, k, l))
                    }
                }
                M.push(w(p, k, l));
                var F = s.makeVList(M, "bottom", C, h);
                return d(n(["delimsizing", "mult"], [F], h.getColor()), a.TEXT, h)
            };
            var f = ["(", ")", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\\lceil", "\\rceil", "\\surd"];
            var m = ["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert"];
            var v = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash"];
            var y = [0, 1.2, 1.8, 2.4, 3];
            var x = function(e, t, i, a) {
                if (e === "<") {
                    e = "\\langle"
                } else if (e === ">") {
                    e = "\\rangle"
                }
                if (p.contains(f, e) || p.contains(v, e)) {
                    return u(e, t, false, i, a)
                } else if (p.contains(m, e)) {
                    return k(e, y[t], false, i, a)
                } else {
                    throw new h("Illegal delimiter: '" + e + "'")
                }
            };
            var b = [{
                type: "small",
                style: a.SCRIPTSCRIPT
            }, {
                type: "small",
                style: a.SCRIPT
            }, {
                type: "small",
                style: a.TEXT
            }, {
                type: "large",
                size: 1
            }, {
                type: "large",
                size: 2
            }, {
                type: "large",
                size: 3
            }, {
                type: "large",
                size: 4
            }];
            var _ = [{
                type: "small",
                style: a.SCRIPTSCRIPT
            }, {
                type: "small",
                style: a.SCRIPT
            }, {
                type: "small",
                style: a.TEXT
            }, {
                type: "stack"
            }];
            var z = [{
                type: "small",
                style: a.SCRIPTSCRIPT
            }, {
                type: "small",
                style: a.SCRIPT
            }, {
                type: "small",
                style: a.TEXT
            }, {
                type: "large",
                size: 1
            }, {
                type: "large",
                size: 2
            }, {
                type: "large",
                size: 3
            }, {
                type: "large",
                size: 4
            }, {
                type: "stack"
            }];
            var S = function(e) {
                if (e.type === "small") {
                    return "Main-Regular"
                } else if (e.type === "large") {
                    return "Size" + e.size + "-Regular"
                } else if (e.type === "stack") {
                    return "Size4-Regular"
                }
            };
            var T = function(e, t, i, h) {
                var a = Math.min(2, 3 - h.style.size);
                for (var s = a; s < i.length; s++) {
                    if (i[s].type === "stack") {
                        break
                    }
                    var r = c(e, S(i[s]));
                    var l = r.height + r.depth;
                    if (i[s].type === "small") {
                        l *= i[s].style.sizeMultiplier
                    }
                    if (l > t) {
                        return i[s]
                    }
                }
                return i[i.length - 1]
            };
            var C = function(e, t, i, h, a) {
                if (e === "<") {
                    e = "\\langle"
                } else if (e === ">") {
                    e = "\\rangle"
                }
                var s;
                if (p.contains(v, e)) {
                    s = b
                } else if (p.contains(f, e)) {
                    s = z
                } else {
                    s = _
                }
                var r = T(e, t, s, h);
                if (r.type === "small") {
                    return g(e, r.style, i, h, a)
                } else if (r.type === "large") {
                    return u(e, r.size, i, h, a)
                } else if (r.type === "stack") {
                    return k(e, t, i, h, a)
                }
            };
            var M = function(e, t, i, h, a) {
                var s = r.metrics.axisHeight * h.style.sizeMultiplier;
                var l = 901;
                var p = 5 / r.metrics.ptPerEm;
                var n = Math.max(t - s, i + s);
                var c = Math.max(n / 500 * l, 2 * n - p);
                return C(e, c, true, h, a)
            };
            t.exports = {
                sizedDelim: x,
                customSizedDelim: C,
                leftRightDelim: M
            }
        }, {
            "./ParseError": 4,
            "./Style": 6,
            "./buildCommon": 7,
            "./fontMetrics": 11,
            "./symbols": 14,
            "./utils": 15
        }],
        10: [function(e, t, i) {
            var h = e("./utils");
            var a = function(e) {
                e = e.slice();
                for (var t = e.length - 1; t >= 0; t--) {
                    if (!e[t]) {
                        e.splice(t, 1)
                    }
                }
                return e.join(" ")
            };

            function s(e, t, i, h, a, s) {
                this.classes = e || [];
                this.children = t || [];
                this.height = i || 0;
                this.depth = h || 0;
                this.maxFontSize = a || 0;
                this.style = s || {}
            }
            s.prototype.toNode = function() {
                var e = document.createElement("span");
                e.className = a(this.classes);
                for (var t in this.style) {
                    if (this.style.hasOwnProperty(t)) {
                        e.style[t] = this.style[t]
                    }
                }
                for (var i = 0; i < this.children.length; i++) {
                    e.appendChild(this.children[i].toNode())
                }
                return e
            };
            s.prototype.toMarkup = function() {
                var e = "<span";
                if (this.classes.length) {
                    e += ' class="';
                    e += h.escape(a(this.classes));
                    e += '"'
                }
                var t = "";
                for (var i in this.style) {
                    if (this.style.hasOwnProperty(i)) {
                        t += h.hyphenate(i) + ":" + this.style[i] + ";"
                    }
                }
                if (t) {
                    e += ' style="' + h.escape(t) + '"'
                }
                e += ">";
                for (var s = 0; s < this.children.length; s++) {
                    e += this.children[s].toMarkup()
                }
                e += "</span>";
                return e
            };

            function r(e, t, i, h) {
                this.children = e || [];
                this.height = t || 0;
                this.depth = i || 0;
                this.maxFontSize = h || 0
            }
            r.prototype.toNode = function() {
                var e = document.createDocumentFragment();
                for (var t = 0; t < this.children.length; t++) {
                    e.appendChild(this.children[t].toNode())
                }
                return e
            };
            r.prototype.toMarkup = function() {
                var e = "";
                for (var t = 0; t < this.children.length; t++) {
                    e += this.children[t].toMarkup()
                }
                return e
            };

            function l(e, t, i, h, a, s, r) {
                this.value = e || "";
                this.height = t || 0;
                this.depth = i || 0;
                this.italic = h || 0;
                this.skew = a || 0;
                this.classes = s || [];
                this.style = r || {};
                this.maxFontSize = 0
            }
            l.prototype.toNode = function() {
                var e = document.createTextNode(this.value);
                var t = null;
                if (this.italic > 0) {
                    t = document.createElement("span");
                    t.style.marginRight = this.italic + "em"
                }
                if (this.classes.length > 0) {
                    t = t || document.createElement("span");
                    t.className = a(this.classes)
                }
                for (var i in this.style) {
                    if (this.style.hasOwnProperty(i)) {
                        t = t || document.createElement("span");
                        t.style[i] = this.style[i]
                    }
                }
                if (t) {
                    t.appendChild(e);
                    return t
                } else {
                    return e
                }
            };
            l.prototype.toMarkup = function() {
                var e = false;
                var t = "<span";
                if (this.classes.length) {
                    e = true;
                    t += ' class="';
                    t += h.escape(a(this.classes));
                    t += '"'
                }
                var i = "";
                if (this.italic > 0) {
                    i += "margin-right:" + this.italic + "em;"
                }
                for (var s in this.style) {
                    if (this.style.hasOwnProperty(s)) {
                        i += h.hyphenate(s) + ":" + this.style[s] + ";"
                    }
                }
                if (i) {
                    e = true;
                    t += ' style="' + h.escape(i) + '"'
                }
                var r = h.escape(this.value);
                if (e) {
                    t += ">";
                    t += r;
                    t += "</span>";
                    return t
                } else {
                    return r
                }
            };
            t.exports = {
                span: s,
                documentFragment: r,
                symbolNode: l
            }
        }, {
            "./utils": 15
        }],
        11: [function(e, t, i) {
            var h = e("./Style");
            var a = .025;
            var s = 0;
            var r = 0;
            var l = 0;
            var p = .431;
            var n = 1;
            var c = 0;
            var o = .677;
            var d = .394;
            var g = .444;
            var u = .686;
            var w = .345;
            var k = .413;
            var f = .363;
            var m = .289;
            var v = .15;
            var y = .247;
            var x = .386;
            var b = .05;
            var _ = 2.39;
            var z = 1.01;
            var S = .81;
            var T = .71;
            var C = .25;
            var M = 0;
            var L = 0;
            var E = 0;
            var A = 0;
            var P = .431;
            var R = 1;
            var O = 0;
            var I = .04;
            var F = .111;
            var D = .166;
            var B = .2;
            var q = .6;
            var N = .1;
            var G = 10;
            var H = {
                xHeight: p,
                quad: n,
                num1: o,
                num2: d,
                num3: g,
                denom1: u,
                denom2: w,
                sup1: k,
                sup2: f,
                sup3: m,
                sub1: v,
                sub2: y,
                supDrop: x,
                subDrop: b,
                axisHeight: C,
                defaultRuleThickness: I,
                bigOpSpacing1: F,
                bigOpSpacing2: D,
                bigOpSpacing3: B,
                bigOpSpacing4: q,
                bigOpSpacing5: N,
                ptPerEm: G,
                delim1: _,
                getDelim2: function(e) {
                    if (e.size === h.TEXT.size) {
                        return z
                    } else if (e.size === h.SCRIPT.size) {
                        return S
                    } else if (e.size === h.SCRIPTSCRIPT.size) {
                        return T
                    }
                    throw new Error("Unexpected style size: " + e.size)
                }
            };
            var X = {
                "AMS-Regular": {
                    10003: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    10016: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    1008: {
                        depth: 0,
                        height: .43056,
                        italic: .04028,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    10731: {
                        depth: .11111,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    10846: {
                        depth: .19444,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10877: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10878: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10885: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10886: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10887: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    10888: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    10889: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10890: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10891: {
                        depth: .48256,
                        height: .98256,
                        italic: 0,
                        skew: 0
                    },
                    10892: {
                        depth: .48256,
                        height: .98256,
                        italic: 0,
                        skew: 0
                    },
                    10901: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10902: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10933: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10934: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10935: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10936: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10937: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10938: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10949: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10950: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10955: {
                        depth: .28481,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    10956: {
                        depth: .28481,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    165: {
                        depth: 0,
                        height: .675,
                        italic: .025,
                        skew: 0
                    },
                    174: {
                        depth: .15559,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    240: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    295: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    57350: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    57351: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    57352: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    57353: {
                        depth: 0,
                        height: .43056,
                        italic: .04028,
                        skew: 0
                    },
                    57356: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57357: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57358: {
                        depth: .41951,
                        height: .91951,
                        italic: 0,
                        skew: 0
                    },
                    57359: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    57360: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    57361: {
                        depth: .41951,
                        height: .91951,
                        italic: 0,
                        skew: 0
                    },
                    57366: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57367: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57368: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57369: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57370: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    57371: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: .16667,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: .16667,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .16667,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8245: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8487: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8498: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8502: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8503: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8504: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8513: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8592: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8594: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8602: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8603: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8606: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8608: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8610: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8611: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8619: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8620: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8621: {
                        depth: -.13313,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    8622: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8624: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8625: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8630: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8631: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8634: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8635: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8638: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8639: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8642: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8643: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8644: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8646: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8647: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8648: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8649: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8650: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8651: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8652: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8653: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8654: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8655: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8666: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8667: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8669: {
                        depth: -.13313,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8705: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    8708: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8709: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8717: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8722: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8724: {
                        depth: .08198,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8726: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8733: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8736: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8737: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8738: {
                        depth: .03517,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8740: {
                        depth: .25142,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8742: {
                        depth: .25142,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8756: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8757: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8764: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8765: {
                        depth: -.13313,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    8769: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8770: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8774: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8776: {
                        depth: -.01688,
                        height: .48312,
                        italic: 0,
                        skew: 0
                    },
                    8778: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8782: {
                        depth: .06062,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8783: {
                        depth: .06062,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8785: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8786: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8787: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8790: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8791: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8796: {
                        depth: .08198,
                        height: .91667,
                        italic: 0,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8806: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    8807: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    8808: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    8809: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    8812: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    8814: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8815: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8816: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8817: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8818: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8819: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8822: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8823: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8828: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8829: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8830: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8831: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8832: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8833: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8840: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8841: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8842: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8843: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8847: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8848: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8858: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8859: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8861: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8862: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8863: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8864: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8865: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8872: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8873: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8874: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8876: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8877: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8878: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8879: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8882: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8883: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8884: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8885: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8888: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8890: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8891: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8892: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8901: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8903: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8905: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8906: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8907: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8908: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8909: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8910: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8911: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8912: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8913: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8914: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8915: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8916: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8918: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8919: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8920: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8921: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8922: {
                        depth: .38569,
                        height: .88569,
                        italic: 0,
                        skew: 0
                    },
                    8923: {
                        depth: .38569,
                        height: .88569,
                        italic: 0,
                        skew: 0
                    },
                    8926: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8927: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8928: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8929: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8934: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8935: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8936: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8937: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8938: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8939: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8940: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8941: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8994: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8995: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    9416: {
                        depth: .15559,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9484: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9488: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9492: {
                        depth: 0,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    9496: {
                        depth: 0,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    9585: {
                        depth: .19444,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    9586: {
                        depth: .19444,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    9632: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    9633: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    9650: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9651: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9654: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9660: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9661: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9664: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9674: {
                        depth: .11111,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9733: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    989: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    }
                },
                "Main-Bold": {
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: 0,
                        height: .69444,
                        italic: .10903,
                        skew: 0
                    },
                    10216: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    10815: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    10927: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    10928: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .63492,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    124: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .34444,
                        italic: 0,
                        skew: 0
                    },
                    168: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    172: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    175: {
                        depth: 0,
                        height: .59611,
                        italic: 0,
                        skew: 0
                    },
                    176: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    177: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    180: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    215: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    247: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    36: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: .19444,
                        height: .15556,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .15556,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    567: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    60: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    62: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    711: {
                        depth: 0,
                        height: .63194,
                        italic: 0,
                        skew: 0
                    },
                    713: {
                        depth: 0,
                        height: .59611,
                        italic: 0,
                        skew: 0
                    },
                    714: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    715: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    728: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    729: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    730: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .59611,
                        italic: 0,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .63194,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8224: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8225: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    824: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8242: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    8407: {
                        depth: 0,
                        height: .72444,
                        italic: .15486,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8465: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8467: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8472: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    8476: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    8501: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8592: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8593: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8594: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8595: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8596: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8597: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8598: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8599: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68611,
                        italic: .01597,
                        skew: 0
                    },
                    8600: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8601: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8636: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8637: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8640: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8641: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8656: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8657: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8658: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8659: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8660: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8661: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68611,
                        italic: .01597,
                        skew: 0
                    },
                    8704: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8706: {
                        depth: 0,
                        height: .69444,
                        italic: .06389,
                        skew: 0
                    },
                    8707: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8709: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8711: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    8712: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8715: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8722: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8723: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8725: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8726: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8727: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    8728: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8729: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .18,
                        height: .82,
                        italic: 0,
                        skew: 0
                    },
                    8733: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    8734: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    8736: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8743: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8744: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8745: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8746: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .19444,
                        height: .69444,
                        italic: .12778,
                        skew: 0
                    },
                    8764: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8768: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8771: {
                        depth: .00222,
                        height: .50222,
                        italic: 0,
                        skew: 0
                    },
                    8776: {
                        depth: .02444,
                        height: .52444,
                        italic: 0,
                        skew: 0
                    },
                    8781: {
                        depth: .00222,
                        height: .50222,
                        italic: 0,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    8801: {
                        depth: .00222,
                        height: .50222,
                        italic: 0,
                        skew: 0
                    },
                    8804: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8805: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8810: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8811: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8826: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8827: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8834: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8835: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8838: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8839: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8846: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8849: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8850: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8851: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8852: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8853: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8854: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8855: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8856: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8857: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8866: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8867: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8868: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8869: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68611,
                        italic: .02875,
                        skew: 0
                    },
                    8900: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8901: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8902: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8994: {
                        depth: -.13889,
                        height: .36111,
                        italic: 0,
                        skew: 0
                    },
                    8995: {
                        depth: -.13889,
                        height: .36111,
                        italic: 0,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    95: {
                        depth: .31,
                        height: .13444,
                        italic: .03194,
                        skew: 0
                    },
                    96: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9651: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9657: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    9661: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9667: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    9711: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9824: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9825: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9826: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9827: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9837: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    9838: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9839: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    }
                },
                "Main-Italic": {
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: .10333,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: .07514,
                        skew: 0
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .21194,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .08847,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: .07671,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .65536,
                        italic: .1019,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .65536,
                        italic: .14467,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .10764,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .10333,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: .06312,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: .06312,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: .08847,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: .10764,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: .08208,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: .09486,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .10764,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .10764,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: .12042,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .08847,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: .12292,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .31786,
                        italic: .11585,
                        skew: 0
                    },
                    163: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: .06961,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: .06616,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: .13639,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: .09694,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: .16194,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: .03694,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: .14917,
                        skew: 0
                    },
                    43: {
                        depth: .05667,
                        height: .56167,
                        italic: .03694,
                        skew: 0
                    },
                    44: {
                        depth: .19444,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .43056,
                        italic: .02826,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: .16194,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    52: {
                        depth: .19444,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    55: {
                        depth: .19444,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    567: {
                        depth: .19444,
                        height: .43056,
                        italic: .03736,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .43056,
                        italic: .0582,
                        skew: 0
                    },
                    59: {
                        depth: .19444,
                        height: .43056,
                        italic: .0582,
                        skew: 0
                    },
                    61: {
                        depth: -.13313,
                        height: .36687,
                        italic: .06616,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: .1225,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: .09597,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .10257,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .14528,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .12028,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .13305,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: .08722,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .15806,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: .14028,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .14528,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: .09694,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: .06646,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .66786,
                        italic: .11585,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .56167,
                        italic: .10333,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: .10806,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .66786,
                        italic: .11752,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .66786,
                        italic: .10474,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: .1225,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .62847,
                        italic: .08295,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .10257,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: .03868,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .43056,
                        italic: .09208,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .43056,
                        italic: .09208,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: .1685,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: .06961,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .11972,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .13305,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .18361,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .18361,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .15806,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .19383,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .14528,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: .1875,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: .13305,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: .15294,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: .10528,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: .12028,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: .11111,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: .05986,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: .11111,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: .10257,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: .06646,
                        skew: 0
                    },
                    95: {
                        depth: .31,
                        height: .12056,
                        italic: .09208,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: .06312,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: .05653,
                        skew: 0
                    }
                },
                "Main-Regular": {
                    32: {
                        depth: -0,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    160: {
                        depth: -0,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    8230: {
                        depth: -0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    8773: {
                        depth: -.022,
                        height: .589,
                        italic: 0,
                        skew: 0
                    },
                    8800: {
                        depth: .215,
                        height: .716,
                        italic: 0,
                        skew: 0
                    },
                    8942: {
                        depth: .03,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    8943: {
                        depth: -.19,
                        height: .31,
                        italic: 0,
                        skew: 0
                    },
                    8945: {
                        depth: -.1,
                        height: .82,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: 0,
                        height: .69444,
                        italic: .07778,
                        skew: 0
                    },
                    10216: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    10815: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    10927: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    10928: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    124: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .31786,
                        italic: 0,
                        skew: 0
                    },
                    168: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    172: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    175: {
                        depth: 0,
                        height: .56778,
                        italic: 0,
                        skew: 0
                    },
                    176: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    177: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    180: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    215: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    247: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    36: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: .19444,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    567: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    60: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    62: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    711: {
                        depth: 0,
                        height: .62847,
                        italic: 0,
                        skew: 0
                    },
                    713: {
                        depth: 0,
                        height: .56778,
                        italic: 0,
                        skew: 0
                    },
                    714: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    715: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    728: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    729: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    730: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .56778,
                        italic: 0,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .62847,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8224: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8225: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    824: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8242: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    8407: {
                        depth: 0,
                        height: .71444,
                        italic: .15382,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8465: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8467: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .11111
                    },
                    8472: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .11111
                    },
                    8476: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    8501: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8592: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8593: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8594: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8595: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8596: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8597: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8598: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8599: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .01389,
                        skew: 0
                    },
                    8600: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8601: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8636: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8637: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8640: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8641: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8656: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8657: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8658: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8659: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8660: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8661: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .01389,
                        skew: 0
                    },
                    8704: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8706: {
                        depth: 0,
                        height: .69444,
                        italic: .05556,
                        skew: .08334
                    },
                    8707: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8709: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8711: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    8712: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8715: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8722: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8723: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8725: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8726: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8727: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    8728: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8729: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .2,
                        height: .8,
                        italic: 0,
                        skew: 0
                    },
                    8733: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8734: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8736: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8743: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8744: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8745: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8746: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .19444,
                        height: .69444,
                        italic: .11111,
                        skew: 0
                    },
                    8764: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8768: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8771: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8776: {
                        depth: -.01688,
                        height: .48312,
                        italic: 0,
                        skew: 0
                    },
                    8781: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    8801: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8804: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8805: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8810: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8811: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8826: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8827: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8834: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8835: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8838: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8839: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8846: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8849: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8850: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8851: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8852: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8853: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8854: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8855: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8856: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8857: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8866: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8867: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8868: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8869: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .025,
                        skew: 0
                    },
                    8900: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8901: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8902: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8994: {
                        depth: -.14236,
                        height: .35764,
                        italic: 0,
                        skew: 0
                    },
                    8995: {
                        depth: -.14236,
                        height: .35764,
                        italic: 0,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    95: {
                        depth: .31,
                        height: .12056,
                        italic: .02778,
                        skew: 0
                    },
                    96: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9651: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9657: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    9661: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9667: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    9711: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9824: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9825: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9826: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9827: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9837: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    9838: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9839: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    }
                },
                "Math-BoldItalic": {
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    1009: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    1013: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .11042,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .69326,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .69326,
                        italic: .0622,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .01852,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .0088,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .63492,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .44444,
                        italic: .02778,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .44444,
                        italic: .04213,
                        skew: 0
                    },
                    47: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68611,
                        italic: .04835,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68611,
                        italic: .06979,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68611,
                        italic: .03194,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68611,
                        italic: .05451,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68611,
                        italic: .08229,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68611,
                        italic: .07778,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68611,
                        italic: .10069,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68611,
                        italic: .06979,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68611,
                        italic: .11424,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68611,
                        italic: .11424,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68611,
                        italic: .03194,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68611,
                        italic: .00421,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68611,
                        italic: .05382,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68611,
                        italic: .11424,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68611,
                        italic: .25555,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68611,
                        italic: .07778,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68611,
                        italic: .25555,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68611,
                        italic: .06979,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68611,
                        italic: .03194,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68611,
                        italic: .07458,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68611,
                        italic: .08229,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68611,
                        italic: .05451,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68611,
                        italic: .11653,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68611,
                        italic: .04835,
                        skew: 0
                    },
                    945: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    946: {
                        depth: .19444,
                        height: .69444,
                        italic: .03403,
                        skew: 0
                    },
                    947: {
                        depth: .19444,
                        height: .44444,
                        italic: .06389,
                        skew: 0
                    },
                    948: {
                        depth: 0,
                        height: .69444,
                        italic: .03819,
                        skew: 0
                    },
                    949: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    950: {
                        depth: .19444,
                        height: .69444,
                        italic: .06215,
                        skew: 0
                    },
                    951: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    952: {
                        depth: 0,
                        height: .69444,
                        italic: .03194,
                        skew: 0
                    },
                    953: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    954: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    955: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    956: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    957: {
                        depth: 0,
                        height: .44444,
                        italic: .06898,
                        skew: 0
                    },
                    958: {
                        depth: .19444,
                        height: .69444,
                        italic: .03021,
                        skew: 0
                    },
                    959: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    960: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    961: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    962: {
                        depth: .09722,
                        height: .44444,
                        italic: .07917,
                        skew: 0
                    },
                    963: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    964: {
                        depth: 0,
                        height: .44444,
                        italic: .13472,
                        skew: 0
                    },
                    965: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    966: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    967: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    968: {
                        depth: .19444,
                        height: .69444,
                        italic: .03704,
                        skew: 0
                    },
                    969: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    977: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    981: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    982: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    }
                },
                "Math-Italic": {
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .16667
                    },
                    1009: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    1013: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .10764,
                        skew: .16667
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .65952,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .65952,
                        italic: .05724,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .03148,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .01968,
                        skew: .08334
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .08334
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: .05556
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: 0,
                        skew: .08334
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .02691,
                        skew: .08334
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: .04398,
                        skew: .05556
                    },
                    47: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .13889
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .05556
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .11111
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: .09618,
                        skew: .16667
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .05556
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .02778
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: .00773,
                        skew: .08334
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .02778
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .08334
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: .07569,
                        skew: .08334
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .05556
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: .11,
                        skew: .05556
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    945: {
                        depth: 0,
                        height: .43056,
                        italic: .0037,
                        skew: .02778
                    },
                    946: {
                        depth: .19444,
                        height: .69444,
                        italic: .05278,
                        skew: .08334
                    },
                    947: {
                        depth: .19444,
                        height: .43056,
                        italic: .05556,
                        skew: 0
                    },
                    948: {
                        depth: 0,
                        height: .69444,
                        italic: .03785,
                        skew: .05556
                    },
                    949: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    950: {
                        depth: .19444,
                        height: .69444,
                        italic: .07378,
                        skew: .08334
                    },
                    951: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    952: {
                        depth: 0,
                        height: .69444,
                        italic: .02778,
                        skew: .08334
                    },
                    953: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    954: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    955: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    956: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    957: {
                        depth: 0,
                        height: .43056,
                        italic: .06366,
                        skew: .02778
                    },
                    958: {
                        depth: .19444,
                        height: .69444,
                        italic: .04601,
                        skew: .11111
                    },
                    959: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    960: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    961: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    962: {
                        depth: .09722,
                        height: .43056,
                        italic: .07986,
                        skew: .08334
                    },
                    963: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    964: {
                        depth: 0,
                        height: .43056,
                        italic: .1132,
                        skew: .02778
                    },
                    965: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    966: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    967: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    968: {
                        depth: .19444,
                        height: .69444,
                        italic: .03588,
                        skew: .11111
                    },
                    969: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    977: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    981: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    982: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    }
                },
                "Math-Regular": {
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .16667
                    },
                    1009: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    1013: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .10764,
                        skew: .16667
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .65952,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .65952,
                        italic: .05724,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .03148,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .01968,
                        skew: .08334
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .08334
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: .05556
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: 0,
                        skew: .08334
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .02691,
                        skew: .08334
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: .04398,
                        skew: .05556
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .13889
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .05556
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .11111
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: .09618,
                        skew: .16667
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .05556
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .02778
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: .00773,
                        skew: .08334
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .02778
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .08334
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: .07569,
                        skew: .08334
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .05556
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: .11,
                        skew: .05556
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    945: {
                        depth: 0,
                        height: .43056,
                        italic: .0037,
                        skew: .02778
                    },
                    946: {
                        depth: .19444,
                        height: .69444,
                        italic: .05278,
                        skew: .08334
                    },
                    947: {
                        depth: .19444,
                        height: .43056,
                        italic: .05556,
                        skew: 0
                    },
                    948: {
                        depth: 0,
                        height: .69444,
                        italic: .03785,
                        skew: .05556
                    },
                    949: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    950: {
                        depth: .19444,
                        height: .69444,
                        italic: .07378,
                        skew: .08334
                    },
                    951: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    952: {
                        depth: 0,
                        height: .69444,
                        italic: .02778,
                        skew: .08334
                    },
                    953: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    954: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    955: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    956: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    957: {
                        depth: 0,
                        height: .43056,
                        italic: .06366,
                        skew: .02778
                    },
                    958: {
                        depth: .19444,
                        height: .69444,
                        italic: .04601,
                        skew: .11111
                    },
                    959: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    960: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    961: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    962: {
                        depth: .09722,
                        height: .43056,
                        italic: .07986,
                        skew: .08334
                    },
                    963: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    964: {
                        depth: 0,
                        height: .43056,
                        italic: .1132,
                        skew: .02778
                    },
                    965: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    966: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    967: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    968: {
                        depth: .19444,
                        height: .69444,
                        italic: .03588,
                        skew: .11111
                    },
                    969: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    977: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    981: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    982: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    }
                },
                "Size1-Regular": {
                    8748: {
                        depth: .306,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8749: {
                        depth: .306,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    10216: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    10752: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10753: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10754: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10756: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10758: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    8214: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    8593: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8595: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8657: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8659: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8719: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8720: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8721: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: -.00599,
                        height: .606,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: -.00599,
                        height: .606,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .30612,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8750: {
                        depth: .30612,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8896: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8897: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8898: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8899: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    9168: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    }
                },
                "Size2-Regular": {
                    8748: {
                        depth: .862,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8749: {
                        depth: .862,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    10216: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    10752: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10753: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10754: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10756: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10758: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8719: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8720: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8721: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .86225,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8750: {
                        depth: .86225,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8896: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8897: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8898: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8899: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    }
                },
                "Size3-Regular": {
                    10216: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    }
                },
                "Size4-Regular": {
                    10216: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    57344: {
                        depth: -.00499,
                        height: .605,
                        italic: 0,
                        skew: 0
                    },
                    57345: {
                        depth: -.00499,
                        height: .605,
                        italic: 0,
                        skew: 0
                    },
                    57680: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    57681: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    57682: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    57683: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    9115: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9116: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    9117: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9118: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9119: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    9120: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9121: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9122: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    9123: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9124: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9125: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    9126: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9127: {
                        depth: 1e-5,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    9128: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    9129: {
                        depth: .90001,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    9130: {
                        depth: 0,
                        height: .3,
                        italic: 0,
                        skew: 0
                    },
                    9131: {
                        depth: 1e-5,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    9132: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    9133: {
                        depth: .90001,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    9143: {
                        depth: .88502,
                        height: .915,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    }
                }
            };
            var K = function(e, t) {
                return X[t][e.charCodeAt(0)]
            };
            t.exports = {
                metrics: H,
                getCharacterMetrics: K
            }
        }, {
            "./Style": 6
        }],
        12: [function(e, t, i) {
            var h = e("./utils");
            var a = e("./ParseError");
            var s = {
                "\\sqrt": {
                    numArgs: 1,
                    numOptionalArgs: 1,
                    handler: function(e, t, i, h) {
                        if (t != null) {
                            throw new a("Optional arguments to \\sqrt aren't supported yet", this.lexer, h[1] - 1)
                        }
                        return {
                            type: "sqrt",
                            body: i
                        }
                    }
                },
                "\\text": {
                    numArgs: 1,
                    argTypes: ["text"],
                    greediness: 2,
                    handler: function(e, t) {
                        var i;
                        if (t.type === "ordgroup") {
                            i = t.value
                        } else {
                            i = [t]
                        }
                        return {
                            type: "text",
                            body: i
                        }
                    }
                },
                "\\color": {
                    numArgs: 2,
                    allowedInText: true,
                    argTypes: ["color", "original"],
                    handler: function(e, t, i) {
                        var h;
                        if (i.type === "ordgroup") {
                            h = i.value
                        } else {
                            h = [i]
                        }
                        return {
                            type: "color",
                            color: t.value,
                            value: h
                        }
                    }
                },
                "\\overline": {
                    numArgs: 1,
                    handler: function(e, t) {
                        return {
                            type: "overline",
                            body: t
                        }
                    }
                },
                "\\rule": {
                    numArgs: 2,
                    numOptionalArgs: 1,
                    argTypes: ["size", "size", "size"],
                    handler: function(e, t, i, h) {
                        return {
                            type: "rule",
                            shift: t && t.value,
                            width: i.value,
                            height: h.value
                        }
                    }
                },
                "\\KaTeX": {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "katex"
                        }
                    }
                }
            };
            var r = {
                "\\bigl": {
                    type: "open",
                    size: 1
                },
                "\\Bigl": {
                    type: "open",
                    size: 2
                },
                "\\biggl": {
                    type: "open",
                    size: 3
                },
                "\\Biggl": {
                    type: "open",
                    size: 4
                },
                "\\bigr": {
                    type: "close",
                    size: 1
                },
                "\\Bigr": {
                    type: "close",
                    size: 2
                },
                "\\biggr": {
                    type: "close",
                    size: 3
                },
                "\\Biggr": {
                    type: "close",
                    size: 4
                },
                "\\bigm": {
                    type: "rel",
                    size: 1
                },
                "\\Bigm": {
                    type: "rel",
                    size: 2
                },
                "\\biggm": {
                    type: "rel",
                    size: 3
                },
                "\\Biggm": {
                    type: "rel",
                    size: 4
                },
                "\\big": {
                    type: "textord",
                    size: 1
                },
                "\\Big": {
                    type: "textord",
                    size: 2
                },
                "\\bigg": {
                    type: "textord",
                    size: 3
                },
                "\\Bigg": {
                    type: "textord",
                    size: 4
                }
            };
            var l = ["(", ")", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\\lceil", "\\rceil", "<", ">", "\\langle", "\\rangle", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."];
            var p = [{
                funcs: ["\\blue", "\\orange", "\\pink", "\\red", "\\green", "\\gray", "\\purple"],
                data: {
                    numArgs: 1,
                    allowedInText: true,
                    handler: function(e, t) {
                        var i;
                        if (t.type === "ordgroup") {
                            i = t.value
                        } else {
                            i = [t]
                        }
                        return {
                            type: "color",
                            color: "katex-" + e.slice(1),
                            value: i
                        }
                    }
                }
            }, {
                funcs: ["\\arcsin", "\\arccos", "\\arctan", "\\arg", "\\cos", "\\cosh", "\\cot", "\\coth", "\\csc", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\tan", "\\tanh"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: false,
                            symbol: false,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\det", "\\gcd", "\\inf", "\\lim", "\\liminf", "\\limsup", "\\max", "\\min", "\\Pr", "\\sup"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: true,
                            symbol: false,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\int", "\\iint", "\\iiint", "\\oint"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: false,
                            symbol: true,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: true,
                            symbol: true,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\dfrac", "\\frac", "\\tfrac", "\\dbinom", "\\binom", "\\tbinom"],
                data: {
                    numArgs: 2,
                    greediness: 2,
                    handler: function(e, t, i) {
                        var h;
                        var a = null;
                        var s = null;
                        var r = "auto";
                        switch (e) {
                            case "\\dfrac":
                            case "\\frac":
                            case "\\tfrac":
                                h = true;
                                break;
                            case "\\dbinom":
                            case "\\binom":
                            case "\\tbinom":
                                h = false;
                                a = "(";
                                s = ")";
                                break;
                            default:
                                throw new Error("Unrecognized genfrac command")
                        }
                        switch (e) {
                            case "\\dfrac":
                            case "\\dbinom":
                                r = "display";
                                break;
                            case "\\tfrac":
                            case "\\tbinom":
                                r = "text";
                                break
                        }
                        return {
                            type: "genfrac",
                            numer: t,
                            denom: i,
                            hasBarLine: h,
                            leftDelim: a,
                            rightDelim: s,
                            size: r
                        }
                    }
                }
            }, {
                funcs: ["\\llap", "\\rlap"],
                data: {
                    numArgs: 1,
                    allowedInText: true,
                    handler: function(e, t) {
                        return {
                            type: e.slice(1),
                            body: t
                        }
                    }
                }
            }, {
                funcs: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg", "\\left", "\\right"],
                data: {
                    numArgs: 1,
                    handler: function(e, t, i) {
                        if (!h.contains(l, t.value)) {
                            throw new a("Invalid delimiter: '" + t.value + "' after '" + e + "'", this.lexer, i[1])
                        }
                        if (e === "\\left" || e === "\\right") {
                            return {
                                type: "leftright",
                                value: t.value
                            }
                        } else {
                            return {
                                type: "delimsizing",
                                size: r[e].size,
                                delimType: r[e].type,
                                value: t.value
                            }
                        }
                    }
                }
            }, {
                funcs: ["\\tiny", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"],
                data: {
                    numArgs: 0
                }
            }, {
                funcs: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
                data: {
                    numArgs: 0
                }
            }, {
                funcs: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot"],
                data: {
                    numArgs: 1,
                    handler: function(e, t) {
                        return {
                            type: "accent",
                            accent: e,
                            base: t
                        }
                    }
                }
            }, {
                funcs: ["\\over", "\\choose"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        var t;
                        switch (e) {
                            case "\\over":
                                t = "\\frac";
                                break;
                            case "\\choose":
                                t = "\\binom";
                                break;
                            default:
                                throw new Error("Unrecognized infix genfrac command")
                        }
                        return {
                            type: "infix",
                            replaceWith: t
                        }
                    }
                }
            }];
            var n = function(e, t) {
                for (var i = 0; i < e.length; i++) {
                    s[e[i]] = t
                }
            };
            for (var c = 0; c < p.length; c++) {
                n(p[c].funcs, p[c].data)
            }
            var o = function(e) {
                if (s[e].greediness === undefined) {
                    return 1
                } else {
                    return s[e].greediness
                }
            };
            for (var d in s) {
                if (s.hasOwnProperty(d)) {
                    var g = s[d];
                    s[d] = {
                        numArgs: g.numArgs,
                        argTypes: g.argTypes,
                        greediness: g.greediness === undefined ? 1 : g.greediness,
                        allowedInText: g.allowedInText ? g.allowedInText : false,
                        numOptionalArgs: g.numOptionalArgs === undefined ? 0 : g.numOptionalArgs,
                        handler: g.handler
                    }
                }
            }
            t.exports = {
                funcs: s,
                getGreediness: o
            }
        }, {
            "./ParseError": 4,
            "./utils": 15
        }],
        13: [function(e, t, i) {
            var h = e("./Parser");
            var a = function(e) {
                var t = new h(e);
                return t.parse()
            };
            t.exports = a
        }, {
            "./Parser": 5
        }],
        14: [function(e, t, i) {
            var h = {
                math: {
                    "`": {
                        font: "main",
                        group: "textord",
                        replace: "‘"
                    },
                    "\\$": {
                        font: "main",
                        group: "textord",
                        replace: "$"
                    },
                    "\\%": {
                        font: "main",
                        group: "textord",
                        replace: "%"
                    },
                    "\\_": {
                        font: "main",
                        group: "textord",
                        replace: "_"
                    },
                    "\\angle": {
                        font: "main",
                        group: "textord",
                        replace: "∠"
                    },
                    "\\infty": {
                        font: "main",
                        group: "textord",
                        replace: "∞"
                    },
                    "\\prime": {
                        font: "main",
                        group: "textord",
                        replace: "′"
                    },
                    "\\triangle": {
                        font: "main",
                        group: "textord",
                        replace: "△"
                    },
                    "\\Gamma": {
                        font: "main",
                        group: "textord",
                        replace: "Γ"
                    },
                    "\\Delta": {
                        font: "main",
                        group: "textord",
                        replace: "Δ"
                    },
                    "\\Theta": {
                        font: "main",
                        group: "textord",
                        replace: "Θ"
                    },
                    "\\Lambda": {
                        font: "main",
                        group: "textord",
                        replace: "Λ"
                    },
                    "\\Xi": {
                        font: "main",
                        group: "textord",
                        replace: "Ξ"
                    },
                    "\\Pi": {
                        font: "main",
                        group: "textord",
                        replace: "Π"
                    },
                    "\\Sigma": {
                        font: "main",
                        group: "textord",
                        replace: "Σ"
                    },
                    "\\Upsilon": {
                        font: "main",
                        group: "textord",
                        replace: "Υ"
                    },
                    "\\Phi": {
                        font: "main",
                        group: "textord",
                        replace: "Φ"
                    },
                    "\\Psi": {
                        font: "main",
                        group: "textord",
                        replace: "Ψ"
                    },
                    "\\Omega": {
                        font: "main",
                        group: "textord",
                        replace: "Ω"
                    },
                    "\\neg": {
                        font: "main",
                        group: "textord",
                        replace: "¬"
                    },
                    "\\lnot": {
                        font: "main",
                        group: "textord",
                        replace: "¬"
                    },
                    "\\top": {
                        font: "main",
                        group: "textord",
                        replace: "⊤"
                    },
                    "\\bot": {
                        font: "main",
                        group: "textord",
                        replace: "⊥"
                    },
                    "\\emptyset": {
                        font: "main",
                        group: "textord",
                        replace: "∅"
                    },
                    "\\varnothing": {
                        font: "ams",
                        group: "textord",
                        replace: "∅"
                    },
                    "\\alpha": {
                        font: "main",
                        group: "mathord",
                        replace: "α"
                    },
                    "\\beta": {
                        font: "main",
                        group: "mathord",
                        replace: "β"
                    },
                    "\\gamma": {
                        font: "main",
                        group: "mathord",
                        replace: "γ"
                    },
                    "\\delta": {
                        font: "main",
                        group: "mathord",
                        replace: "δ"
                    },
                    "\\epsilon": {
                        font: "main",
                        group: "mathord",
                        replace: "ϵ"
                    },
                    "\\zeta": {
                        font: "main",
                        group: "mathord",
                        replace: "ζ"
                    },
                    "\\eta": {
                        font: "main",
                        group: "mathord",
                        replace: "η"
                    },
                    "\\theta": {
                        font: "main",
                        group: "mathord",
                        replace: "θ"
                    },
                    "\\iota": {
                        font: "main",
                        group: "mathord",
                        replace: "ι"
                    },
                    "\\kappa": {
                        font: "main",
                        group: "mathord",
                        replace: "κ"
                    },
                    "\\lambda": {
                        font: "main",
                        group: "mathord",
                        replace: "λ"
                    },
                    "\\mu": {
                        font: "main",
                        group: "mathord",
                        replace: "μ"
                    },
                    "\\nu": {
                        font: "main",
                        group: "mathord",
                        replace: "ν"
                    },
                    "\\xi": {
                        font: "main",
                        group: "mathord",
                        replace: "ξ"
                    },
                    "\\omicron": {
                        font: "main",
                        group: "mathord",
                        replace: "o"
                    },
                    "\\pi": {
                        font: "main",
                        group: "mathord",
                        replace: "π"
                    },
                    "\\rho": {
                        font: "main",
                        group: "mathord",
                        replace: "ρ"
                    },
                    "\\sigma": {
                        font: "main",
                        group: "mathord",
                        replace: "σ"
                    },
                    "\\tau": {
                        font: "main",
                        group: "mathord",
                        replace: "τ"
                    },
                    "\\upsilon": {
                        font: "main",
                        group: "mathord",
                        replace: "υ"
                    },
                    "\\phi": {
                        font: "main",
                        group: "mathord",
                        replace: "ϕ"
                    },
                    "\\chi": {
                        font: "main",
                        group: "mathord",
                        replace: "χ"
                    },
                    "\\psi": {
                        font: "main",
                        group: "mathord",
                        replace: "ψ"
                    },
                    "\\omega": {
                        font: "main",
                        group: "mathord",
                        replace: "ω"
                    },
                    "\\varepsilon": {
                        font: "main",
                        group: "mathord",
                        replace: "ε"
                    },
                    "\\vartheta": {
                        font: "main",
                        group: "mathord",
                        replace: "ϑ"
                    },
                    "\\varpi": {
                        font: "main",
                        group: "mathord",
                        replace: "ϖ"
                    },
                    "\\varrho": {
                        font: "main",
                        group: "mathord",
                        replace: "ϱ"
                    },
                    "\\varsigma": {
                        font: "main",
                        group: "mathord",
                        replace: "ς"
                    },
                    "\\varphi": {
                        font: "main",
                        group: "mathord",
                        replace: "φ"
                    },
                    "*": {
                        font: "main",
                        group: "bin",
                        replace: "∗"
                    },
                    "+": {
                        font: "main",
                        group: "bin"
                    },
                    "-": {
                        font: "main",
                        group: "bin",
                        replace: "−"
                    },
                    "\\cdot": {
                        font: "main",
                        group: "bin",
                        replace: "⋅"
                    },
                    "\\circ": {
                        font: "main",
                        group: "bin",
                        replace: "∘"
                    },
                    "\\div": {
                        font: "main",
                        group: "bin",
                        replace: "÷"
                    },
                    "\\pm": {
                        font: "main",
                        group: "bin",
                        replace: "±"
                    },
                    "\\times": {
                        font: "main",
                        group: "bin",
                        replace: "×"
                    },
                    "\\cap": {
                        font: "main",
                        group: "bin",
                        replace: "∩"
                    },
                    "\\cup": {
                        font: "main",
                        group: "bin",
                        replace: "∪"
                    },
                    "\\setminus": {
                        font: "main",
                        group: "bin",
                        replace: "∖"
                    },
                    "\\land": {
                        font: "main",
                        group: "bin",
                        replace: "∧"
                    },
                    "\\lor": {
                        font: "main",
                        group: "bin",
                        replace: "∨"
                    },
                    "\\wedge": {
                        font: "main",
                        group: "bin",
                        replace: "∧"
                    },
                    "\\vee": {
                        font: "main",
                        group: "bin",
                        replace: "∨"
                    },
                    "\\surd": {
                        font: "main",
                        group: "textord",
                        replace: "√"
                    },
                    "(": {
                        font: "main",
                        group: "open"
                    },
                    "[": {
                        font: "main",
                        group: "open"
                    },
                    "\\langle": {
                        font: "main",
                        group: "open",
                        replace: "⟨"
                    },
                    "\\lvert": {
                        font: "main",
                        group: "open",
                        replace: "∣"
                    },
                    ")": {
                        font: "main",
                        group: "close"
                    },
                    "]": {
                        font: "main",
                        group: "close"
                    },
                    "?": {
                        font: "main",
                        group: "close"
                    },
                    "!": {
                        font: "main",
                        group: "close"
                    },
                    "\\rangle": {
                        font: "main",
                        group: "close",
                        replace: "⟩"
                    },
                    "\\rvert": {
                        font: "main",
                        group: "close",
                        replace: "∣"
                    },
                    "=": {
                        font: "main",
                        group: "rel"
                    },
                    "<": {
                        font: "main",
                        group: "rel"
                    },
                    ">": {
                        font: "main",
                        group: "rel"
                    },
                    ":": {
                        font: "main",
                        group: "rel"
                    },
                    "\\approx": {
                        font: "main",
                        group: "rel",
                        replace: "≈"
                    },
                    "\\cong": {
                        font: "main",
                        group: "rel",
                        replace: "≅"
                    },
                    "\\ge": {
                        font: "main",
                        group: "rel",
                        replace: "≥"
                    },
                    "\\geq": {
                        font: "main",
                        group: "rel",
                        replace: "≥"
                    },
                    "\\gets": {
                        font: "main",
                        group: "rel",
                        replace: "←"
                    },
                    "\\in": {
                        font: "main",
                        group: "rel",
                        replace: "∈"
                    },
                    "\\notin": {
                        font: "main",
                        group: "rel",
                        replace: "∉"
                    },
                    "\\subset": {
                        font: "main",
                        group: "rel",
                        replace: "⊂"
                    },
                    "\\supset": {
                        font: "main",
                        group: "rel",
                        replace: "⊃"
                    },
                    "\\subseteq": {
                        font: "main",
                        group: "rel",
                        replace: "⊆"
                    },
                    "\\supseteq": {
                        font: "main",
                        group: "rel",
                        replace: "⊇"
                    },
                    "\\nsubseteq": {
                        font: "ams",
                        group: "rel",
                        replace: "⊈"
                    },
                    "\\nsupseteq": {
                        font: "ams",
                        group: "rel",
                        replace: "⊉"
                    },
                    "\\models": {
                        font: "main",
                        group: "rel",
                        replace: "⊨"
                    },
                    "\\leftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "←"
                    },
                    "\\le": {
                        font: "main",
                        group: "rel",
                        replace: "≤"
                    },
                    "\\leq": {
                        font: "main",
                        group: "rel",
                        replace: "≤"
                    },
                    "\\ne": {
                        font: "main",
                        group: "rel",
                        replace: "≠"
                    },
                    "\\neq": {
                        font: "main",
                        group: "rel",
                        replace: "≠"
                    },
                    "\\rightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "→"
                    },
                    "\\to": {
                        font: "main",
                        group: "rel",
                        replace: "→"
                    },
                    "\\ngeq": {
                        font: "ams",
                        group: "rel",
                        replace: "≱"
                    },
                    "\\nleq": {
                        font: "ams",
                        group: "rel",
                        replace: "≰"
                    },
                    "\\!": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\ ": {
                        font: "main",
                        group: "spacing",
                        replace: " "
                    },
                    "~": {
                        font: "main",
                        group: "spacing",
                        replace: " "
                    },
                    "\\,": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\:": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\;": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\enspace": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\qquad": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\quad": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\space": {
                        font: "main",
                        group: "spacing",
                        replace: " "
                    },
                    ",": {
                        font: "main",
                        group: "punct"
                    },
                    ";": {
                        font: "main",
                        group: "punct"
                    },
                    "\\colon": {
                        font: "main",
                        group: "punct",
                        replace: ":"
                    },
                    "\\barwedge": {
                        font: "ams",
                        group: "textord",
                        replace: "⊼"
                    },
                    "\\veebar": {
                        font: "ams",
                        group: "textord",
                        replace: "⊻"
                    },
                    "\\odot": {
                        font: "main",
                        group: "textord",
                        replace: "⊙"
                    },
                    "\\oplus": {
                        font: "main",
                        group: "textord",
                        replace: "⊕"
                    },
                    "\\otimes": {
                        font: "main",
                        group: "textord",
                        replace: "⊗"
                    },
                    "\\partial": {
                        font: "main",
                        group: "textord",
                        replace: "∂"
                    },
                    "\\oslash": {
                        font: "main",
                        group: "textord",
                        replace: "⊘"
                    },
                    "\\circledcirc": {
                        font: "ams",
                        group: "textord",
                        replace: "⊚"
                    },
                    "\\boxdot": {
                        font: "ams",
                        group: "textord",
                        replace: "⊡"
                    },
                    "\\bigtriangleup": {
                        font: "main",
                        group: "textord",
                        replace: "△"
                    },
                    "\\bigtriangledown": {
                        font: "main",
                        group: "textord",
                        replace: "▽"
                    },
                    "\\dagger": {
                        font: "main",
                        group: "textord",
                        replace: "†"
                    },
                    "\\diamond": {
                        font: "main",
                        group: "textord",
                        replace: "⋄"
                    },
                    "\\star": {
                        font: "main",
                        group: "textord",
                        replace: "⋆"
                    },
                    "\\triangleleft": {
                        font: "main",
                        group: "textord",
                        replace: "◃"
                    },
                    "\\triangleright": {
                        font: "main",
                        group: "textord",
                        replace: "▹"
                    },
                    "\\{": {
                        font: "main",
                        group: "open",
                        replace: "{"
                    },
                    "\\}": {
                        font: "main",
                        group: "close",
                        replace: "}"
                    },
                    "\\lbrace": {
                        font: "main",
                        group: "open",
                        replace: "{"
                    },
                    "\\rbrace": {
                        font: "main",
                        group: "close",
                        replace: "}"
                    },
                    "\\lbrack": {
                        font: "main",
                        group: "open",
                        replace: "["
                    },
                    "\\rbrack": {
                        font: "main",
                        group: "close",
                        replace: "]"
                    },
                    "\\lfloor": {
                        font: "main",
                        group: "open",
                        replace: "⌊"
                    },
                    "\\rfloor": {
                        font: "main",
                        group: "close",
                        replace: "⌋"
                    },
                    "\\lceil": {
                        font: "main",
                        group: "open",
                        replace: "⌈"
                    },
                    "\\rceil": {
                        font: "main",
                        group: "close",
                        replace: "⌉"
                    },
                    "\\backslash": {
                        font: "main",
                        group: "textord",
                        replace: "\\"
                    },
                    "|": {
                        font: "main",
                        group: "textord",
                        replace: "∣"
                    },
                    "\\vert": {
                        font: "main",
                        group: "textord",
                        replace: "∣"
                    },
                    "\\|": {
                        font: "main",
                        group: "textord",
                        replace: "∥"
                    },
                    "\\Vert": {
                        font: "main",
                        group: "textord",
                        replace: "∥"
                    },
                    "\\uparrow": {
                        font: "main",
                        group: "textord",
                        replace: "↑"
                    },
                    "\\Uparrow": {
                        font: "main",
                        group: "textord",
                        replace: "⇑"
                    },
                    "\\downarrow": {
                        font: "main",
                        group: "textord",
                        replace: "↓"
                    },
                    "\\Downarrow": {
                        font: "main",
                        group: "textord",
                        replace: "⇓"
                    },
                    "\\updownarrow": {
                        font: "main",
                        group: "textord",
                        replace: "↕"
                    },
                    "\\Updownarrow": {
                        font: "main",
                        group: "textord",
                        replace: "⇕"
                    },
                    "\\coprod": {
                        font: "math",
                        group: "op",
                        replace: "∐"
                    },
                    "\\bigvee": {
                        font: "math",
                        group: "op",
                        replace: "⋁"
                    },
                    "\\bigwedge": {
                        font: "math",
                        group: "op",
                        replace: "⋀"
                    },
                    "\\biguplus": {
                        font: "math",
                        group: "op",
                        replace: "⨄"
                    },
                    "\\bigcap": {
                        font: "math",
                        group: "op",
                        replace: "⋂"
                    },
                    "\\bigcup": {
                        font: "math",
                        group: "op",
                        replace: "⋃"
                    },
                    "\\int": {
                        font: "math",
                        group: "op",
                        replace: "∫"
                    },
                    "\\intop": {
                        font: "math",
                        group: "op",
                        replace: "∫"
                    },
                    "\\iint": {
                        font: "math",
                        group: "op",
                        replace: "∬"
                    },
                    "\\iiint": {
                        font: "math",
                        group: "op",
                        replace: "∭"
                    },
                    "\\prod": {
                        font: "math",
                        group: "op",
                        replace: "∏"
                    },
                    "\\sum": {
                        font: "math",
                        group: "op",
                        replace: "∑"
                    },
                    "\\bigotimes": {
                        font: "math",
                        group: "op",
                        replace: "⨂"
                    },
                    "\\bigoplus": {
                        font: "math",
                        group: "op",
                        replace: "⨁"
                    },
                    "\\bigodot": {
                        font: "math",
                        group: "op",
                        replace: "⨀"
                    },
                    "\\oint": {
                        font: "math",
                        group: "op",
                        replace: "∮"
                    },
                    "\\bigsqcup": {
                        font: "math",
                        group: "op",
                        replace: "⨆"
                    },
                    "\\smallint": {
                        font: "math",
                        group: "op",
                        replace: "∫"
                    },
                    "\\ldots": {
                        font: "main",
                        group: "punct",
                        replace: "…"
                    },
                    "\\cdots": {
                        font: "main",
                        group: "inner",
                        replace: "⋯"
                    },
                    "\\ddots": {
                        font: "main",
                        group: "inner",
                        replace: "⋱"
                    },
                    "\\vdots": {
                        font: "main",
                        group: "textord",
                        replace: "⋮"
                    },
                    "\\acute": {
                        font: "main",
                        group: "accent",
                        replace: "´"
                    },
                    "\\grave": {
                        font: "main",
                        group: "accent",
                        replace: "`"
                    },
                    "\\ddot": {
                        font: "main",
                        group: "accent",
                        replace: "¨"
                    },
                    "\\tilde": {
                        font: "main",
                        group: "accent",
                        replace: "~"
                    },
                    "\\bar": {
                        font: "main",
                        group: "accent",
                        replace: "¯"
                    },
                    "\\breve": {
                        font: "main",
                        group: "accent",
                        replace: "˘"
                    },
                    "\\check": {
                        font: "main",
                        group: "accent",
                        replace: "ˇ"
                    },
                    "\\hat": {
                        font: "main",
                        group: "accent",
                        replace: "^"
                    },
                    "\\vec": {
                        font: "main",
                        group: "accent",
                        replace: "⃗"
                    },
                    "\\dot": {
                        font: "main",
                        group: "accent",
                        replace: "˙"
                    }
                },
                text: {
                    "\\ ": {
                        font: "main",
                        group: "spacing",
                        replace: " "
                    },
                    " ": {
                        font: "main",
                        group: "spacing",
                        replace: " "
                    },
                    "~": {
                        font: "main",
                        group: "spacing",
                        replace: " "
                    }
                }
            };
            var a = '0123456789/@."';
            for (var s = 0; s < a.length; s++) {
                var r = a.charAt(s);
                h.math[r] = {
                    font: "main",
                    group: "textord"
                }
            }
            var l = "0123456789`!@*()-=+[]'\";:?/.,";
            for (var s = 0; s < l.length; s++) {
                var r = l.charAt(s);
                h.text[r] = {
                    font: "main",
                    group: "textord"
                }
            }
            var p = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (var s = 0; s < p.length; s++) {
                var r = p.charAt(s);
                h.math[r] = {
                    font: "main",
                    group: "mathord"
                };
                h.text[r] = {
                    font: "main",
                    group: "textord"
                }
            }
            t.exports = h
        }, {}],
        15: [function(e, t, i) {
            var h = Array.prototype.indexOf;
            var a = function(e, t) {
                if (e == null) {
                    return -1
                }
                if (h && e.indexOf === h) {
                    return e.indexOf(t)
                }
                var i = 0,
                    a = e.length;
                for (; i < a; i++) {
                    if (e[i] === t) {
                        return i
                    }
                }
                return -1
            };
            var s = function(e, t) {
                return a(e, t) !== -1
            };
            var r = /([A-Z])/g;
            var l = function(e) {
                return e.replace(r, "-$1").toLowerCase()
            };
            var p = {
                "&": "&amp;",
                ">": "&gt;",
                "<": "&lt;",
                '"': "&quot;",
                "'": "&#x27;"
            };
            var n = /[&><"']/g;

            function c(e) {
                return p[e]
            }

            function o(e) {
                return ("" + e).replace(n, c)
            }
            var d;
            if (typeof document !== "undefined") {
                var g = document.createElement("span");
                if ("textContent" in g) {
                    d = function(e, t) {
                        e.textContent = t
                    }
                } else {
                    d = function(e, t) {
                        e.innerText = t
                    }
                }
            }

            function u(e) {
                d(e, "")
            }
            t.exports = {
                contains: s,
                escape: o,
                hyphenate: l,
                indexOf: a,
                setTextContent: d,
                clearNode: u
            }
        }, {}],
        16: [function(e, t, i) {
            var h = e("./src/ParseError");
            var a = e("./src/Lexer");
            var s = e("./src/Parser");
            var r = e("./src/Renderer");
            t.exports = {
                ParseError: h,
                renderToString: function(e, t) {
                    if (e === null || e === undefined) throw "input cannot be empty";
                    var i = new a(e);
                    var h = new s(i);
                    var l = new r(h, t);
                    return l.toMarkup()
                },
                render: function(e, t, i) {
                    if (e === null || e === undefined) throw "input cannot be empty";
                    var h = new a(e);
                    var l = new s(h);
                    var p = new r(l, i);
                    var n = p.toDOM();
                    if (t) t.appendChild(n);
                    return n
                }
            }
        }, {
            "./src/Lexer": 17,
            "./src/ParseError": 18,
            "./src/Parser": 19,
            "./src/Renderer": 20
        }],
        17: [function(e, t, i) {
            var h = e("./utils");
            var a = e("./ParseError");
            var s = function(e) {
                this._input = e;
                this._remain = e;
                this._pos = 0;
                this._nextAtom = this._currentAtom = null;
                this._next()
            };
            s.prototype.accept = function(e, t) {
                if (this._nextAtom.type === e && this._matchText(t)) {
                    this._next();
                    return this._currentAtom.text
                }
                return null
            };
            s.prototype.expect = function(e, t) {
                var i = this._nextAtom;
                if (i.type !== e) throw new a("Expect an atom of " + e + " but received " + i.type, this._pos, this._input);
                if (!this._matchText(t)) throw new a("Expect `" + t + "` but received `" + i.text + "`", this._pos, this._input);
                this._next();
                return this._currentAtom.text
            };
            s.prototype.get = function() {
                return this._currentAtom
            };
            var r = {
                exec: function(e) {
                    var t = [{
                        start: "$",
                        end: "$"
                    }, {
                        start: "\\(",
                        end: "\\)"
                    }];
                    var i = e.length;
                    for (var h = 0; h < t.length; h++) {
                        var s = t[h].start;
                        if (e.indexOf(s) !== 0) continue;
                        var r = t[h].end;
                        var l = s.length;
                        var p = e.slice(l);
                        while (l < i) {
                            var n = p.indexOf(r);
                            if (n < 0) throw new a("Math environment is not closed", this._pos, this._input);
                            if (n > 0 && p[n - 1] === "\\") {
                                var c = n + r.length;
                                p = p.slice(c);
                                l += c;
                                continue
                            }
                            var o = [e.slice(0, l + n + r.length), e.slice(s.length, l + n)];
                            return o
                        }
                    }
                    return null
                }
            };
            var l = {
                special: /^(\\\\|\\{|\\}|\\\$|\\&|\\#|\\%|\\_)/,
                math: r,
                func: /^\\([a-zA-Z]+)/,
                open: /^\{/,
                close: /^\}/,
                quote: /^(`|``|'|'')/,
                ordinary: /^[^\\{}$&#%_\s]+/
            };
            var p = /^%.*/;
            var n = /^\s+/;
            s.prototype._skip = function(e) {
                this._pos += e;
                this._remain = this._remain.slice(e)
            };
            s.prototype._next = function() {
                var e = false;
                while (1) {
                    var t = n.exec(this._remain);
                    if (t) {
                        e = true;
                        var i = t[0].length;
                        this._skip(i)
                    }
                    var h = p.exec(this._remain);
                    if (!h) break;
                    var s = h[0].length;
                    this._skip(s)
                }
                this._currentAtom = this._nextAtom;
                if (this._remain === "") {
                    this._nextAtom = {
                        type: "EOF",
                        text: null,
                        whitespace: false
                    };
                    return false
                }
                for (var r in l) {
                    var c = l[r];
                    var o = c.exec(this._remain);
                    if (!o) continue;
                    var d = o[0];
                    var g = o[1] ? o[1] : d;
                    this._nextAtom = {
                        type: r,
                        text: g,
                        whitespace: e
                    };
                    this._pos += d.length;
                    this._remain = this._remain.slice(o[0].length);
                    return true
                }
                throw new a("Unrecoganizable atom", this._pos, this._input)
            };
            s.prototype._matchText = function(e) {
                if (e === null || e === undefined) return true;
                if (h.isString(e)) return e.toLowerCase() === this._nextAtom.text.toLowerCase();
                else {
                    e = e.map(function(e) {
                        return e.toLowerCase()
                    });
                    return e.indexOf(this._nextAtom.text.toLowerCase()) >= 0
                }
            };
            t.exports = s
        }, {
            "./ParseError": 18,
            "./utils": 21
        }],
        18: [function(e, t, i) {
            function h(e, t, i) {
                var h = "Error: " + e;
                if (t !== undefined && i !== undefined) {
                    h += " at position " + t + ": `";
                    i = i.slice(0, t) + "↱" + i.slice(t);
                    var a = Math.max(0, t - 15);
                    var s = t + 15;
                    h += i.slice(a, s) + "`"
                }
                this.message = h
            }
            h.prototype = Object.create(Error.prototype);
            h.prototype.constructor = h;
            t.exports = h
        }, {}],
        19: [function(e, t, i) {
            var h = e("./utils");
            var a = function(e, t) {
                this.type = e;
                this.value = t;
                this.children = []
            };
            a.prototype.toString = function(e) {
                if (!e) e = 0;
                var t = "";
                for (var i = 0; i < e; i++) t += "  ";
                var a = t + "<" + this.type + ">";
                if (this.value) a += " (" + h.toString(this.value) + ")";
                a += "\n";
                if (this.children) {
                    for (var s = 0; s < this.children.length; s++) {
                        var r = this.children[s];
                        a += r.toString(e + 1)
                    }
                }
                return a
            };
            a.prototype.addChild = function(e) {
                if (!e) throw "argument cannot be null";
                this.children.push(e)
            };
            var s = function(e, t, i) {
                this.type = e;
                this.value = t;
                this.children = null;
                this.whitespace = !!i
            };
            s.prototype = a.prototype;
            var r = function(e) {
                this._lexer = e
            };
            r.prototype.parse = function() {
                var e = new a("root");
                while (true) {
                    var t = this._acceptEnvironment();
                    if (t === null) break;
                    var i;
                    if (t === "algorithm") i = this._parseAlgorithmInner();
                    else if (t === "algorithmic") i = this._parseAlgorithmicInner();
                    else throw new ParseError("Unexpected environment " + t);
                    this._closeEnvironment(t);
                    e.addChild(i)
                }
                this._lexer.expect("EOF");
                return e
            };
            r.prototype._acceptEnvironment = function() {
                var e = this._lexer;
                if (!e.accept("func", "begin")) return null;
                e.expect("open");
                var t = e.expect("ordinary");
                e.expect("close");
                return t
            };
            r.prototype._closeEnvironment = function(e) {
                var t = this._lexer;
                t.expect("func", "end");
                t.expect("open");
                t.expect("ordinary", e);
                t.expect("close")
            };
            r.prototype._parseAlgorithmInner = function() {
                var e = new a("algorithm");
                while (true) {
                    var t = this._acceptEnvironment();
                    if (t !== null) {
                        if (t !== "algorithmic") throw new ParseError("Unexpected environment " + t);
                        var i = this._parseAlgorithmicInner();
                        this._closeEnvironment();
                        e.addChild(i);
                        continue
                    }
                    var h = this._parseCaption();
                    if (h) {
                        e.addChild(h);
                        continue
                    }
                    break
                }
                return e
            };
            r.prototype._parseAlgorithmicInner = function() {
                var e = new a("algorithmic");
                var t;
                while (true) {
                    t = this._parseCommand(l);
                    if (t) {
                        e.addChild(t);
                        continue
                    }
                    t = this._parseBlock();
                    if (t.children.length > 0) {
                        e.addChild(t);
                        continue
                    }
                    break
                }
                return e
            };
            r.prototype._parseCaption = function() {
                var e = this._lexer;
                if (!e.accept("func", "caption")) return null;
                var t = new a("caption");
                e.expect("open");
                t.addChild(this._parseCloseText());
                e.expect("close");
                return t
            };
            r.prototype._parseBlock = function() {
                var e = new a("block");
                while (true) {
                    var t = this._parseControl();
                    if (t) {
                        e.addChild(t);
                        continue
                    }
                    var i = this._parseFunction();
                    if (i) {
                        e.addChild(i);
                        continue
                    }
                    var h = this._parseCommand(p);
                    if (h) {
                        e.addChild(h);
                        continue
                    }
                    var s = this._parseComment();
                    if (s) {
                        e.addChild(s);
                        continue
                    }
                    break
                }
                return e
            };
            r.prototype._parseControl = function() {
                var e;
                if (e = this._parseIf()) return e;
                if (e = this._parseLoop()) return e
            };
            r.prototype._parseFunction = function() {
                var e = this._lexer;
                if (!e.accept("func", ["function", "procedure"])) return null;
                var t = this._lexer.get().text;
                e.expect("open");
                var i = e.expect("ordinary");
                e.expect("close");
                e.expect("open");
                var h = this._parseCloseText();
                e.expect("close");
                var s = this._parseBlock();
                e.expect("func", "end" + t);
                var r = new a("function", {
                    type: t,
                    name: i
                });
                r.addChild(h);
                r.addChild(s);
                return r
            };
            r.prototype._parseIf = function() {
                if (!this._lexer.accept("func", "if")) return null;
                var e = new a("if");
                this._lexer.expect("open");
                e.addChild(this._parseCond());
                this._lexer.expect("close");
                e.addChild(this._parseBlock());
                var t = 0;
                while (this._lexer.accept("func", ["elif", "elsif", "elseif"])) {
                    this._lexer.expect("open");
                    e.addChild(this._parseCond());
                    this._lexer.expect("close");
                    e.addChild(this._parseBlock());
                    t++
                }
                var i = false;
                if (this._lexer.accept("func", "else")) {
                    i = true;
                    e.addChild(this._parseBlock())
                }
                this._lexer.expect("func", "endif");
                e.value = {
                    numElif: t,
                    hasElse: i
                };
                return e
            };
            r.prototype._parseLoop = function() {
                if (!this._lexer.accept("func", ["FOR", "FORALL", "WHILE"])) return null;
                var e = this._lexer.get().text.toLowerCase();
                var t = new a("loop", e);
                this._lexer.expect("open");
                t.addChild(this._parseCond());
                this._lexer.expect("close");
                t.addChild(this._parseBlock());
                var i = e !== "forall" ? "end" + e : "endfor";
                this._lexer.expect("func", i);
                return t
            };
            var l = ["ensure", "require"];
            var p = ["state", "print", "return"];
            r.prototype._parseCommand = function(e) {
                if (!this._lexer.accept("func", e)) return null;
                var t = this._lexer.get().text.toLowerCase();
                var i = new a("command", t);
                i.addChild(this._parseOpenText());
                return i
            };
            r.prototype._parseComment = function() {
                if (!this._lexer.accept("func", "comment")) return null;
                var e = new a("comment");
                this._lexer.expect("open");
                e.addChild(this._parseCloseText());
                this._lexer.expect("close");
                return e
            };
            r.prototype._parseCall = function() {
                var e = this._lexer;
                if (!e.accept("func", "call")) return null;
                var t = e.get().whitespace;
                e.expect("open");
                var i = e.expect("ordinary");
                e.expect("close");
                var h = new a("call");
                h.whitespace = t;
                h.value = i;
                e.expect("open");
                var s = this._parseCloseText();
                h.addChild(s);
                e.expect("close");
                return h
            };
            r.prototype._parseCond = r.prototype._parseCloseText = function() {
                return this._parseText("close")
            };
            r.prototype._parseOpenText = function() {
                return this._parseText("open")
            };
            r.prototype._parseText = function(e) {
                var t = new a(e + "-text");
                var i = false;
                var h;
                while (true) {
                    h = this._parseAtom() || this._parseCall();
                    if (h) {
                        if (i) h.whitespace |= i;
                        t.addChild(h);
                        continue
                    }
                    if (this._lexer.accept("open")) {
                        h = this._parseCloseText();
                        i = this._lexer.get().whitespace;
                        h.whitespace = i;
                        t.addChild(h);
                        this._lexer.expect("close");
                        i = this._lexer.get().whitespace;
                        continue
                    }
                    break
                }
                return t
            };
            var n = {
                ordinary: {
                    tokenType: "ordinary"
                },
                math: {
                    tokenType: "math"
                },
                special: {
                    tokenType: "special"
                },
                "cond-symbol": {
                    tokenType: "func",
                    tokenValues: ["and", "or", "not", "true", "false", "to"]
                },
                "quote-symbol": {
                    tokenType: "quote"
                },
                "sizing-dclr": {
                    tokenType: "func",
                    tokenValues: ["tiny", "scriptsize", "footnotesize", "small", "normalsize", "large", "Large", "LARGE", "huge", "Huge"]
                },
                "font-dclr": {
                    tokenType: "func",
                    tokenValues: ["normalfont", "rmfamily", "sffamily", "ttfamily", "upshape", "itshape", "slshape", "scshape", "bfseries", "mdseries", "lfseries"]
                },
                "font-cmd": {
                    tokenType: "func",
                    tokenValues: ["textnormal", "textrm", "textsf", "texttt", "textup", "textit", "textsl", "textsc", "uppercase", "lowercase", "textbf", "textmd", "textlf"]
                },
                "text-symbol": {
                    tokenType: "func",
                    tokenValues: ["textbackslash"]
                }
            };
            r.prototype._parseAtom = function() {
                for (var e in n) {
                    var t = n[e];
                    var i = this._lexer.accept(t.tokenType, t.tokenValues);
                    if (i === null) continue;
                    var h = this._lexer.get().whitespace;
                    return new s(e, i.toLowerCase(), h)
                }
                return null
            };
            t.exports = r
        }, {
            "./utils": 21
        }],
        20: [function(e, t, i) {
            var h = e("katex");
            var a = e("./utils");

            function s(e) {
                this._css = {};
                this._fontSize = this._outerFontSize = e !== undefined ? e : 1
            }
            s.prototype.outerFontSize = function(e) {
                if (e !== undefined) this._outerFontSize = e;
                return this._outerFontSize
            };
            s.prototype.fontSize = function() {
                return this._fontSize
            };
            s.prototype._fontCommandTable = {
                normalfont: {
                    "font-family": "KaTeX_Main"
                },
                rmfamily: {
                    "font-family": "KaTeX_Main"
                },
                sffamily: {
                    "font-family": "KaTeX_SansSerif"
                },
                ttfamily: {
                    "font-family": "KaTeX_Typewriter"
                },
                bfseries: {
                    "font-weight": "bold"
                },
                mdseries: {
                    "font-weight": "medium"
                },
                lfseries: {
                    "font-weight": "lighter"
                },
                upshape: {
                    "font-style": "normal",
                    "font-variant": "normal"
                },
                itshape: {
                    "font-style": "italic",
                    "font-variant": "normal"
                },
                scshape: {
                    "font-style": "normal",
                    "font-variant": "small-caps"
                },
                slshape: {
                    "font-style": "oblique",
                    "font-variant": "normal"
                },
                textnormal: {
                    "font-family": "KaTeX_Main"
                },
                textrm: {
                    "font-family": "KaTeX_Main"
                },
                textsf: {
                    "font-family": "KaTeX_SansSerif"
                },
                texttt: {
                    "font-family": "KaTeX_Typewriter"
                },
                textbf: {
                    "font-weight": "bold"
                },
                textmd: {
                    "font-weight": "medium"
                },
                textlf: {
                    "font-weight": "lighter"
                },
                textup: {
                    "font-style": "normal",
                    "font-variant": "normal"
                },
                textit: {
                    "font-style": "italic",
                    "font-variant": "normal"
                },
                textsc: {
                    "font-style": "normal",
                    "font-variant": "small-caps"
                },
                textsl: {
                    "font-style": "oblique",
                    "font-variant": "normal"
                },
                uppercase: {
                    "text-transform": "uppercase"
                },
                lowercase: {
                    "text-transform": "lowercase"
                }
            };
            s.prototype._sizingScalesTable = {
                tiny: .68,
                scriptsize: .8,
                footnotesize: .85,
                small: .92,
                normalsize: 1,
                large: 1.17,
                Large: 1.41,
                LARGE: 1.58,
                huge: 1.9,
                Huge: 2.28
            };
            s.prototype.updateByCommand = function(e) {
                var t = this._fontCommandTable[e];
                if (t !== undefined) {
                    for (var i in t) this._css[i] = t[i];
                    return
                }
                var h = this._sizingScalesTable[e];
                if (h !== undefined) {
                    this._outerFontSize = this._fontSize;
                    this._fontSize = h;
                    return
                }
                throw new ParserError("unrecogniazed text-style command")
            };
            s.prototype.toCSS = function() {
                var e = "";
                for (var t in this._css) {
                    var i = this._css[t];
                    if (i === undefined) continue;
                    e += t + ":" + i + ";"
                }
                if (this._fontSize !== this._outerFontSize) {
                    e += "font-size:" + this._fontSize / this._outerFontSize + "em;"
                }
                return e
            };

            function r(e, t) {
                this._nodes = e;
                this._textStyle = t
            }
            r.prototype._renderCloseText = function(e) {
                var t = new s(this._textStyle.fontSize());
                var i = new r(e.children, t);
                if (e.whitespace) this._html.putText(" ");
                this._html.putSpan(i.renderToHTML())
            };
            r.prototype.renderToHTML = function() {
                this._html = new l;
                var e;
                while ((e = this._nodes.shift()) !== undefined) {
                    var t = e.type;
                    var i = e.value;
                    if (e.whitespace) this._html.putText(" ");
                    switch (t) {
                        case "ordinary":
                            this._html.putText(i);
                            break;
                        case "math":
                            var a = h.renderToString(i);
                            this._html.putSpan(a);
                            break;
                        case "cond-symbol":
                            this._html.beginSpan("ps-keyword").putText(i.toLowerCase()).endSpan();
                            break;
                        case "special":
                            if (i === "\\\\") {
                                this._html.putHTML("<br/>");
                                break
                            }
                            var p = {
                                "\\{": "{",
                                "\\}": "}",
                                "\\$": "$",
                                "\\&": "&",
                                "\\#": "#",
                                "\\%": "%",
                                "\\_": "_"
                            };
                            var n = p[i];
                            this._html.putText(n);
                            break;
                        case "text-symbol":
                            var c = {
                                textbackslash: "\\"
                            };
                            var o = c[i];
                            this._html.putText(o);
                            break;
                        case "quote-symbol":
                            var d = {
                                "`": "‘",
                                "``": "“",
                                "'": "’",
                                "''": "”"
                            };
                            var g = d[i];
                            this._html.putText(g);
                            break;
                        case "call":
                            this._html.beginSpan("ps-funcname").putText(i).endSpan();
                            this._html.write("(");
                            var u = e.children[0];
                            this._renderCloseText(u);
                            this._html.write(")");
                            break;
                        case "close-text":
                            this._renderCloseText(e);
                            break;
                        case "font-dclr":
                        case "sizing-dclr":
                            this._textStyle.updateByCommand(i);
                            this._html.beginSpan(null, this._textStyle.toCSS());
                            var w = new r(this._nodes, this._textStyle);
                            this._html.putSpan(w.renderToHTML());
                            this._html.endSpan();
                            break;
                        case "font-cmd":
                            var k = this._nodes[0];
                            if (k.type !== "close-text") continue;
                            var f = new s(this._textStyle.fontSize());
                            f.updateByCommand(i);
                            this._html.beginSpan(null, f.toCSS());
                            var m = new r(k.children, f);
                            this._html.putSpan(m.renderToHTML());
                            this._html.endSpan();
                            break;
                        default:
                            throw new ParseError("Unexpected ParseNode of type " + e.type)
                    }
                }
                return this._html.toMarkup()
            };

            function l() {
                this._body = [];
                this._textBuf = []
            }
            l.prototype.beginDiv = function(e, t, i) {
                this._beginTag("div", e, t, i);
                this._body.push("\n");
                return this
            };
            l.prototype.endDiv = function() {
                this._endTag("div");
                this._body.push("\n");
                return this
            };
            l.prototype.beginP = function(e, t, i) {
                this._beginTag("p", e, t, i);
                this._body.push("\n");
                return this
            };
            l.prototype.endP = function() {
                this._flushText();
                this._endTag("p");
                this._body.push("\n");
                return this
            };
            l.prototype.beginSpan = function(e, t, i) {
                this._flushText();
                return this._beginTag("span", e, t, i)
            };
            l.prototype.endSpan = function() {
                this._flushText();
                return this._endTag("span")
            };
            l.prototype.putHTML = l.prototype.putSpan = function(e) {
                this._flushText();
                this._body.push(e);
                return this
            };
            l.prototype.putText = function(e) {
                this._textBuf.push(e);
                return this
            };
            l.prototype.write = function(e) {
                this._body.push(e)
            };
            l.prototype.toMarkup = function() {
                this._flushText();
                var e = this._body.join("");
                return e.trim()
            };
            l.prototype.toDOM = function() {
                var e = this.toMarkup();
                var t = document.createElement("div");
                t.innerHTML = e;
                return t.firstChild
            };
            l.prototype._flushText = function() {
                if (this._textBuf.length === 0) return;
                var e = this._textBuf.join("");
                this._body.push(this._escapeHtml(e));
                this._textBuf = []
            };
            l.prototype._beginTag = function(e, t, i, h) {
                var s = "<" + e;
                if (t) s += ' class="' + t + '"';
                if (i) {
                    var r;
                    if (a.isString(i)) r = i;
                    else {
                        r = "";
                        for (var l in i) {
                            attrVal = i[l];
                            r += l + ":" + attrVal + ";"
                        }
                    }
                    if (h) r += h;
                    s += ' style="' + r + '"'
                }
                s += ">";
                this._body.push(s);
                return this
            };
            l.prototype._endTag = function(e) {
                this._body.push("</" + e + ">");
                return this
            };
            var p = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "/": "&#x2F;"
            };
            l.prototype._escapeHtml = function(e) {
                return String(e).replace(/[&<>"'\/]/g, function(e) {
                    return p[e]
                })
            };

            function n(e) {
                e = e || {};
                this.indentSize = e.indentSize ? this._parseEmVal(e.indentSize) : 1.2;
                this.commentDelimiter = e.commentDelimiter || " // ";
                this.lineNumberPunc = e.lineNumberPunc || ":";
                this.lineNumber = e.lineNumber !== undefined ? e.lineNumber : false;
                this.noEnd = e.noEnd !== undefined ? e.noEnd : false;
                if (e.captionCount !== undefined) c.captionCount = e.captionCount
            }
            n.prototype._parseEmVal = function(e) {
                e = e.trim();
                if (e.indexOf("em") !== e.length - 2) throw "option unit error; no `em` found";
                return Number(e.substring(0, e.length - 2))
            };

            function c(e, t) {
                this._root = e.parse();
                this._options = new n(t);
                this._openLine = false;
                this._blockLevel = 0;
                this._textLevel = -1;
                this._globalTextStyle = new s
            }
            c.captionCount = 0;
            c.prototype.toMarkup = function() {
                var e = this._html = new l;
                this._buildTree(this._root);
                delete this._html;
                return e.toMarkup()
            };
            c.prototype.toDOM = function() {
                var e = this.toMarkup();
                var t = document.createElement("div");
                t.innerHTML = e;
                return t.firstChild
            };
            c.prototype._beginGroup = function(e, t, i) {
                this._closeLineIfAny();
                this._html.beginDiv("ps-" + e + (t ? " " + t : ""), i)
            };
            c.prototype._endGroup = function(e) {
                this._closeLineIfAny();
                this._html.endDiv()
            };
            c.prototype._beginBlock = function() {
                var e = this._options.lineNumber && this._blockLevel === 0 ? .6 : 0;
                var t = this._options.indentSize + e;
                this._beginGroup("block", null, {
                    "margin-left": t + "em"
                });
                this._blockLevel++
            };
            c.prototype._endBlock = function() {
                this._closeLineIfAny();
                this._endGroup();
                this._blockLevel--
            };
            c.prototype._newLine = function() {
                this._closeLineIfAny();
                this._openLine = true;
                this._globalTextStyle.outerFontSize(1);
                var e = this._options.indentSize;
                if (this._blockLevel > 0) {
                    this._numLOC++;
                    this._html.beginP("ps-line ps-code", this._globalTextStyle.toCSS());
                    if (this._options.lineNumber) {
                        this._html.beginSpan("ps-linenum", {
                            left: -((this._blockLevel - 1) * (e * 1.25)) + "em"
                        }).putText(this._numLOC + this._options.lineNumberPunc).endSpan()
                    }
                } else {
                    this._html.beginP("ps-line", {
                        "text-indent": -e + "em",
                        "padding-left": e + "em"
                    }, this._globalTextStyle.toCSS())
                }
            };
            c.prototype._closeLineIfAny = function() {
                if (!this._openLine) return;
                this._html.endP();
                this._openLine = false
            };
            c.prototype._typeKeyword = function(e) {
                this._html.beginSpan("ps-keyword").putText(e).endSpan()
            };
            c.prototype._typeFuncName = function(e) {
                this._html.beginSpan("ps-funcname").putText(e).endSpan()
            };
            c.prototype._typeText = function(e) {
                this._html.write(e)
            };
            c.prototype._buildTreeForAllChildren = function(e) {
                var t = e.children;
                for (var i = 0; i < t.length; i++) this._buildTree(t[i])
            };
            c.prototype._buildCommentsFromBlock = function(e) {
                var t = e.children;
                while (t.length > 0 && t[0].type === "comment") {
                    var i = t.shift();
                    this._buildTree(i)
                }
            };
            c.prototype._buildTree = function(e) {
                var t, i, h;
                switch (e.type) {
                    case "root":
                        this._beginGroup("root");
                        this._buildTreeForAllChildren(e);
                        this._endGroup();
                        break;
                    case "algorithm":
                        var a;
                        for (t = 0; t < e.children.length; t++) {
                            i = e.children[t];
                            if (i.type !== "caption") continue;
                            a = i;
                            c.captionCount++
                        }
                        if (a) {
                            this._beginGroup("algorithm", "with-caption");
                            this._buildTree(a)
                        } else {
                            this._beginGroup("algorithm")
                        }
                        for (t = 0; t < e.children.length; t++) {
                            i = e.children[t];
                            if (i.type === "caption") continue;
                            this._buildTree(i)
                        }
                        this._endGroup();
                        break;
                    case "algorithmic":
                        if (this._options.lineNumber) {
                            this._beginGroup("algorithmic", "with-linenum");
                            this._numLOC = 0
                        } else {
                            this._beginGroup("algorithmic")
                        }
                        this._buildTreeForAllChildren(e);
                        this._endGroup();
                        break;
                    case "block":
                        this._beginBlock();
                        this._buildTreeForAllChildren(e);
                        this._endBlock();
                        break;
                    case "function":
                        var l = e.value.type.toLowerCase();
                        var p = e.value.name;
                        h = e.children[0];
                        var n = e.children[1];
                        this._newLine();
                        this._typeKeyword(l + " ");
                        this._typeFuncName(p);
                        this._typeText("(");
                        this._buildTree(h);
                        this._typeText(")");
                        this._buildCommentsFromBlock(n);
                        this._buildTree(n);
                        if (!this._options.noEnd) {
                            this._newLine();
                            this._typeKeyword("end " + l)
                        }
                        break;
                    case "if":
                        this._newLine();
                        this._typeKeyword("if ");
                        ifCond = e.children[0];
                        this._buildTree(ifCond);
                        this._typeKeyword(" then");
                        var o = e.children[1];
                        this._buildCommentsFromBlock(o);
                        this._buildTree(o);
                        var d = e.value.numElif;
                        for (var g = 0; g < d; g++) {
                            this._newLine();
                            this._typeKeyword("else if ");
                            var u = e.children[2 + 2 * g];
                            this._buildTree(u);
                            this._typeKeyword(" then");
                            var w = e.children[2 + 2 * g + 1];
                            this._buildCommentsFromBlock(w);
                            this._buildTree(w)
                        }
                        var k = e.value.hasElse;
                        if (k) {
                            this._newLine();
                            this._typeKeyword("else");
                            var f = e.children[e.children.length - 1];
                            this._buildCommentsFromBlock(f);
                            this._buildTree(f)
                        }
                        if (!this._options.noEnd) {
                            this._newLine();
                            this._typeKeyword("end if")
                        }
                        break;
                    case "loop":
                        this._newLine();
                        var m = e.value;
                        var v = {
                            "for": "for",
                            forall: "for all",
                            "while": "while"
                        };
                        this._typeKeyword(v[m] + " ");
                        var y = e.children[0];
                        this._buildTree(y);
                        this._typeKeyword(" do");
                        var x = e.children[1];
                        this._buildCommentsFromBlock(x);
                        this._buildTree(x);
                        if (!this._options.noEnd) {
                            this._newLine();
                            var b = m === "while" ? "end while" : "end for";
                            this._typeKeyword(b)
                        }
                        break;
                    case "command":
                        var _ = e.value;
                        var z = {
                            state: "",
                            ensure: "Ensure: ",
                            require: "Require: ",
                            print: "print ",
                            "return": "return "
                        } [_];
                        this._newLine();
                        if (z) this._typeKeyword(z);
                        h = e.children[0];
                        this._buildTree(h);
                        break;
                    case "caption":
                        this._newLine();
                        this._typeKeyword("Algorithm ");
                        h = e.children[0];
                        this._buildTree(h);
                        break;
                    case "comment":
                        h = e.children[0];
                        this._html.beginSpan("ps-comment");
                        this._html.putText(this._options.commentDelimiter);
                        this._buildTree(h);
                        this._html.endSpan();
                        break;
                    case "open-text":
                        var S = new r(e.children, this._globalTextStyle);
                        this._html.putSpan(S.renderToHTML());
                        break;
                    case "close-text":
                        var T = this._globalTextStyle.fontSize();
                        var C = new s(T);
                        var M = new r(e.children, C);
                        this._html.putSpan(M.renderToHTML());
                        break;
                    default:
                        throw new ParseError("Unexpected ParseNode of type " + e.type)
                }
            };
            t.exports = c
        }, {
            "./utils": 21,
            katex: 1
        }],
        21: [function(e, t, i) {
            function h(e) {
                return typeof e === "string" || e instanceof String
            }

            function a(e) {
                return typeof e === "object" && e instanceof Object
            }

            function s(e) {
                if (!a(e)) return e + "";
                var t = [];
                for (var i in e) t.push(i + ": " + s(e[i]));
                return t.join(", ")
            }
            t.exports = {
                isString: h,
                isObject: a,
                toString: s
            }
        }, {}]
    }, {}, [16])(16)
});
