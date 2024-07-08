(function() {
    "use strict";
    const u = {
        host: "https://assets.mailerlite.com",
        stylesheet: "https://assets.mailerlite.com/css/universal.css",
        facade: "ml"
    };
    class y {
        constructor() {
            this.eventCallbackMap = {}, window.addEventListener("message", t => {
                if (this.isEventInvalid(t)) return;
                const e = this.getEventAction(t);
                e && this.eventCallbackMap[e] && this.eventCallbackMap[e].forEach(s => s(t))
            })
        }
        on(t, e) {
            this.eventCallbackMap[t] || (this.eventCallbackMap[t] = []), this.eventCallbackMap[t].push(e)
        }
        isEventInvalid(t) {
            return !t || !t.data || typeof t.data != "string"
        }
        getEventAction(t) {
            const e = t.data.split("-");
            if (e && e.length > 1 && e[0] === "mlWebformSubmitSuccess") return `submit-${e[1]}`;
            if (e && e.length > 1 && e[0] === "mlWebformRedirect") {
                let s = e[e.length - 1],
                    i = e.slice(1, e.length - 1).join("-");
                ["_blank", "_self", "_parent", "_top"].indexOf(s) < 0 && (i = e.slice(1).join("-"), s = "_blank");
                const o = new URL(decodeURIComponent(i));
                return o && o.protocol !== "javascript:" && window.open(decodeURIComponent(i), s), null
            }
            return !e || e.length < 8 || e[0] !== "ml" ? null : e[7]
        }
    }
    class p {
        constructor(t) {
            this.config = t, this.bustCache = !1
        }
        noCache() {
            return this.bustCache = !0, this
        }
        make(t, e, s = {}) {
            this.bustCache && (s.cache = Date.now().toString().concat(Math.round(Math.random() * 1e15).toString()));
            const i = this._buildUrl(t, e, s),
                o = document.createElement("script");
            o.setAttribute("src", i), o.setAttribute("async", !0), document.head.appendChild(o)
        }
        _buildUrl(t, e = null, s = {}) {
            const i = this.config.host,
                o = this.config.facade;
            let n = t.includes("?") ? "&" : "";
            e !== null && e !== "" && (s.callback = `${o}.fn.${e}`);
            for (const d in s) {
                let h = s[d];
                typeof h == "string" && h.replace("+", "%2B"), typeof h == "boolean" && (h = h ? 1 : 0), n += `&${d}=${h}`
            }
            return n = n.slice(1), `${i}${t}${n&&!n.startsWith("&")?"?":""}${n}`
        }
    }
    class r {
        static set(t, e, s) {
            let i = "";
            if (s) {
                const o = new Date;
                o.setTime(o.getTime() + s * 24 * 60 * 60 * 1e3), i = `; expires=${o.toGMTString()}`
            }
            return document.cookie = `${t}=${e}${i}; path=/`, e
        }
        static get(t, e = null) {
            const s = `${t}=`,
                i = document.cookie.split(";");
            for (let o = 0; o < i.length; o++) {
                let n = i[o];
                if (n = n.replace(/^\s+/, ""), n.indexOf(s) == 0) return n.substring(s.length, n.length)
            }
            return e
        }
    }
    const f = "mailerlite:session_id";
    class m {
        constructor() {
            this.id = this.getVisitorId(7)
        }
        getVisitorId(t) {
            return r.get(f) ? ? r.set(f, `${Date.now()}/${Math.floor(Math.random()*1e4)}`, t)
        }
    }
    class v {
        constructor(t, e) {
            this.pageId = t, this.jsonpRequest = e
        }
        trackPageView(t) {
            this.jsonpRequest.noCache().make(`/jsonp/${t}/pages/${this.pageId}/perz`, null, {
                session_id: new m().id
            })
        }
    }
    class q {
        constructor(t, e) {
            this.postId = t, this.jsonpRequest = e
        }
        trackPageView(t) {
            this.jsonpRequest.noCache().make(`/jsonp/${t}/posts/${this.postId}/perz`, null, {
                session_id: new m().id
            })
        }
    }
    class C {
        constructor(t, e) {
            this.categoryId = t, this.jsonpRequest = e
        }
        trackPageView(t) {
            this.jsonpRequest.noCache().make(`/jsonp/${t}/categories/${this.categoryId}/perz`, null, {
                session_id: new m().id
            })
        }
    }
    class E {
        constructor(t) {
            this.config = t, this.initDiff = 0
        }
        percent() {
            const t = this.getWindowHeight(),
                e = this.getDocHeight() - t;
            return this.initDiff = t / e * 100, this.calculate()
        }
        calculate() {
            const t = this.getWindowHeight(),
                e = this.getDocHeight() - t,
                i = (this.getScrollPosition() + t) / e * 100 - this.initDiff;
            return Math.floor(i)
        }
        getScrollPosition() {
            return window.pageYOffset !== void 0 ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
        }
        getWindowHeight() {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
        }
        getDocHeight() {
            return Math.max(document.body.scrollHeight || 0, document.documentElement.scrollHeight || 0, document.body.offsetHeight || 0, document.documentElement.offsetHeight || 0, document.body.clientHeight || 0, document.documentElement.clientHeight || 0)
        }
    }
    class l {
        static addEvent(t, e, s) {
            t.addEventListener ? t.addEventListener(e, s, !1) : t.attachEvent && t.attachEvent(`on${e}`, s)
        }
        static isMouseout(t) {
            const e = t.relatedTarget || t.toElement,
                s = !e || e.nodeName == "HTML",
                i = t.clientY < 10;
            return s && i
        }
        static isMobile() {
            let t = !1;
            const e = navigator.userAgent || navigator.vendor || window.opera;
            return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0, 4))) && (t = !0), t
        }
        static isMobileOrTablet() {
            let t = !1;
            const e = navigator.userAgent || navigator.vendor || window.opera;
            return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0, 4))) && (t = !0), t
        }
        static isTablet() {
            return this.isMobileOrTablet() && !this.isMobile()
        }
        static isDesktop() {
            return !this.isMobileOrTablet()
        }
    }
    class c {
        run(t, e, s, i, o, n, d = 500) {
            t.style.display = "block", t.style[e] = s + (n || ""), this.element = t, this.callback = o, this.runtime = d, this.styleAttribute = e, this.startStamp = new Date().getTime(), this.startValue = s, this.endValue = i, this.appendString = n, this.step()
        }
        step() {
            const t = new Date().getTime() - this.startStamp;
            if (t < this.runtime) {
                let e = this.startValue + (this.endValue - this.startValue) * this.easeInOut(t / this.runtime);
                e = Math.round(e * 100) / 100, this.element.style[this.styleAttribute] = e + (this.appendString || ""), requestAnimationFrame(this.step.bind(this))
            } else this.element.style[this.styleAttribute] = this.endValue, this.callback && this.callback()
        }
        easeIn(t) {
            return t * t
        }
        flip(t) {
            return 1 - t
        }
        easeOut(t) {
            const e = this.flip(t);
            return this.flip(e * e)
        }
        easeInOut(t) {
            return this.easeIn(t) + (this.easeOut(t) - this.easeIn(t)) * t
        }
    }
    class g {
        constructor(t, e, s, i) {
            this.id = t.id, this.url = t.url, this.slug = t.slug, this.settings = t.settings, this.template = t.template, this.jsonpRequest = e, this.account = s, this.shown = !1, this.added = !1, this.shouldTrackView = !1, this.grootEventListener = i
        }
        add() {
            throw new Error("You have to implement the method add()")
        }
        trackFormView() {
            this.account && this.jsonpRequest.noCache().make(`/jsonp/${this.account}/forms/${this.id}/takel`)
        }
        getCookieNameWhenShown() {
            return `mailerlite:forms:shown:${this.id}`
        }
        getCookieNameWhenSubmitted() {
            return `mailerlite:forms:submitted:${this.id}`
        }
    }
    class w extends g {
        add() {
            var e;
            this.backdrop = this.injectBackdrop();
            let t = !0;
            return ((e = this.settings) == null ? void 0 : e.form_type) === "fullscreen" && (t = !1), this.form = this.injectForm(t), this.listenForHideEvent(), this.listenForSizeEvent(), this.listenForSubmitEvent(), this.added = !0
        }
        setTriggers() {
            var e, s;
            const t = ((e = this.settings) == null ? void 0 : e.triggers) ? ? [];
            t.length || this.show();
            for (const i of t) switch (i) {
                case "close":
                    this.close();
                    break;
                case "timeout":
                    setTimeout(() => this.show(), ((s = this.settings) == null ? void 0 : s.timeout_seconds) * 1e3);
                    break;
                case "scroll":
                    this.scroll();
                    break
            }
        }
        close() {
            l.addEvent(window, "mouseout", t => {
                t = t || window.event, l.isMouseout(t) && this.show()
            })
        }
        scroll() {
            var e;
            const t = ((e = this.settings) == null ? void 0 : e.scroll_percentage) ? ? !1;
            return t && l.addEvent(window, "scroll", () => {
                new E().percent() >= t && this.show()
            }), t
        }
        listenForHideEvent() {
            this.grootEventListener.on("hide", e => {
                var s;
                e.data.endsWith(`webforms-${(s=this.settings)==null?void 0:s.groot_id}--hide`) && this.hide()
            })
        }
        listenForSizeEvent() {
            const t = this.grootEventListener,
                e = this;
            t.on("setSize", s => {
                if (e.iframeLoaded) {
                    const i = s.data.split("-"),
                        o = parseInt(i[i.length - 2]),
                        n = parseInt(i[i.length - 1]);
                    !isNaN(o) && !isNaN(n) && (this.formHeight = i[i.length - 2], this.formWidth = i[i.length - 1])
                }
            })
        }
        listenForSubmitEvent() {
            var e;
            this.grootEventListener.on(`submit-${(e=this.settings)==null?void 0:e.groot_id}`, () => {
                r.set(this.getCookieNameWhenSubmitted(), this.account, 9999)
            })
        }
        injectBackdrop() {
            const t = document.createElement("div"),
                e = {
                    backgroundColor: "#00000080",
                    position: "fixed",
                    top: "0",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    display: "none",
                    "z-index": 1e4
                };
            for (const s in e) t.style[s] = e[s];
            return document.body.appendChild(t), t
        }
        injectForm(t) {
            const e = this.createIframe({
                position: "fixed",
                top: "0",
                bottom: "0",
                left: "0",
                right: "0",
                width: "100%",
                height: "100%",
                display: "none",
                "z-index": 10001
            });
            if (t) {
                document.body.appendChild(e);
                const s = this;
                s.iframeLoaded = !1, e.onload = function() {
                    s.iframeLoaded = !0
                }
            }
            return e
        }
        createIframe(t = {}) {
            const e = document.createElement("iframe");
            e.setAttribute("src", this.url);
            for (const s in t) e.style[s] = t[s];
            return e.setAttribute("frameBorder", "0"), e
        }
        show(t = !1) {
            var s;
            if (this.shown && !t || !t && !this.isShowAllowed()) return !1;
            this.added || this.add();
            const e = (s = this.settings) == null ? void 0 : s.form_type;
            if (e === "popup" || e === "halfscreen") this.showFadeForm();
            else if (e === "bar") this.showBarForm();
            else if (e === "slidebox") this.showSlideboxForm();
            else if (e === "fullscreen") {
                this.form.style.position = "relative", this.form.style.height = `${window.innerHeight}px`, document.body.insertBefore(this.form, document.body.firstChild), this.form.style.display = "block", this.form.style.marginTop = `-${this.form.style.height}`;
                const i = this;
                i.iframeLoaded = !1, this.form.onload = function() {
                    i.iframeLoaded = !0
                }, this.showFullscreenForm()
            } else this.backdrop.style.display = "block", this.showCallback();
            return !0
        }
        showFadeForm() {
            if (!this.iframeLoaded) {
                setTimeout(this.showFadeForm.bind(this), 100);
                return
            }
            this.backdrop.style.display = "block", new c().run(this.form, "opacity", 0, 1, this.showCallback.bind(this))
        }
        showBarForm() {
            var t;
            if (this.formHeight === void 0 || !this.iframeLoaded) {
                this.iframeLoaded && (this.form.style.height = "100%", this.form.style.inset = "auto", this.form.style.left = "0px", this.form.style.right = "0px", this.form.style[(t = this.settings) == null ? void 0 : t.form_position] = `${-document.body.clientHeight}px`, this.form.style.display = "block"), setTimeout(this.showBarForm.bind(this), 100);
                return
            }
            this.settings.form_position === "top" && this.settings.position_remain && (this.form.style.position = "absolute"), this.showFormWithSlideAnimation("height", this.formHeight)
        }
        showSlideboxForm() {
            var t;
            if (this.formWidth === void 0 || !this.iframeLoaded) {
                this.iframeLoaded && (this.form.style.width = "100%", this.form.style.inset = "auto", this.form.style.bottom = "0px", this.form.style[(t = this.settings) == null ? void 0 : t.form_position] = `${-document.body.clientWidth}px`, this.form.style.display = "block"), setTimeout(this.showSlideboxForm.bind(this), 100);
                return
            }
            this.form.style.height = this.formHeight, this.showFormWithSlideAnimation("width", this.formWidth)
        }
        showFormWithSlideAnimation(t, e) {
            var i;
            this.form.style[t] = e, this.form.style[this.settings.form_position] = `-${e}`, new c().run(this.form, (i = this.settings) == null ? void 0 : i.form_position, -parseInt(e), 0, this.showCallback.bind(this), "px", 200)
        }
        showFullscreenForm() {
            if (!this.iframeLoaded) {
                setTimeout(this.showFullscreenForm.bind(this), 100);
                return
            }
            new c().run(this.form, "marginTop", -parseInt(this.form.style.height), 0, this.showCallback.bind(this), "px", 500)
        }
        hideFullScreenForm() {
            new c().run(this.form, "marginTop", 0, -parseInt(this.form.style.height), this.hideCallback.bind(this), "px", 500)
        }
        showCallback() {
            this.form.style.display = "block", this.shown = !0, this.trackFormView()
        }
        hide() {
            var e, s, i;
            const t = (e = this.settings) == null ? void 0 : e.form_type;
            t === "popup" || t === "halfscreen" ? new c().run(this.form, "opacity", 1, 0, this.hideCallback.bind(this)) : t === "bar" ? new c().run(this.form, (s = this.settings) == null ? void 0 : s.form_position, 0, -parseInt(this.formHeight), this.hideCallback.bind(this), "px", 200) : t === "slidebox" ? new c().run(this.form, (i = this.settings) == null ? void 0 : i.form_position, 0, -parseInt(this.formWidth), this.hideCallback.bind(this), "px", 200) : t === "fullscreen" ? this.hideFullScreenForm() : this.hideCallback()
        }
        hideCallback() {
            this.backdrop.style.display = "none", this.form.style.display = "none"
        }
        isShowAllowed() {
            return this.isAllowedToShowOnPages() && this.isVisibleOnDevice() && this.isAllowedBasedOnFrequency() && !r.get(this.getCookieNameWhenSubmitted())
        }
        isVisibleOnDevice() {
            var s;
            let t = !0;
            const e = ((s = this.settings) == null ? void 0 : s.hide_on) ? ? [];
            for (let i = 0; i < e.length; i++) {
                const o = e[i];
                if (o === "mobile" && l.isMobile()) {
                    t = !1;
                    break
                }
                if (o === "desktop" && l.isDesktop()) {
                    t = !1;
                    break
                }
                if (o === "tablet" && l.isTablet()) {
                    t = !1;
                    break
                }
            }
            return t
        }
        isAllowedToShowOnPages() {
            var e, s;
            const t = ((e = this.settings) == null ? void 0 : e.visibility) ? ? !1;
            switch (t) {
                case !1:
                case "always":
                    return !0;
                case "blacklist":
                case "whitelist":
                    {
                        const i = ((s = this.settings) == null ? void 0 : s.url_list) ? ? [];
                        return this.isAllowedByURLList(i, t)
                    }
            }
            return !0
        }
        isAllowedByURLList(t = [], e) {
            let s = !0;
            for (let i = 0; i < t.length; i++) {
                const o = t[i];
                if (this.isURLEquality(o)) {
                    if (e === "blacklist") {
                        s = !1;
                        break
                    }
                    s = !0;
                    break
                }
                e === "whitelist" && (s = !1)
            }
            return s
        }
        isURLEquality(t) {
            var s;
            return ((s = this.settings) == null ? void 0 : s.url_list_strict) ? ? !1 ? window.location.href.replace(/\/+$/, "") === t : window.location.href.startsWith(t)
        }
        isAllowedBasedOnFrequency() {
            var e;
            return (((e = this.settings) == null ? void 0 : e.frequency_unit) ? ? "always") === "always" ? !0 : !r.get(this.getCookieNameWhenShown()) && !r.get(this.getCookieNameWhenSubmitted()) ? (this.createShownCookie(), !0) : !1
        }
        createShownCookie() {
            var i, o;
            const t = ((i = this.settings) == null ? void 0 : i.frequency_unit) ? ? "always";
            let s = parseInt((o = this.settings) == null ? void 0 : o.frequency) ? ? 1;
            t === "weeks" ? s *= 7 : t === "months" && (s *= 30), r.set(this.getCookieNameWhenShown(), this.account, s)
        }
    }
    class b extends g {
        add() {
            this.form = this.injectForm(), this.shouldTrackView && this.trackFormView()
        }
        injectForm() {
            const t = this.slug,
                e = document.querySelectorAll(`.ml-embedded[data-form="${t}"]`),
                s = this.getEmptyContainer(e);
            if (!s) return null;
            s.innerHTML = this.template;
            const i = s.getElementsByTagName("script"),
                o = Array.prototype.slice.call(i);
            for (const n of o) this.copyScriptToDocumentHead(n), n.remove && n.remove();
            return s
        }
        getEmptyContainer(t) {
            for (const [e, s] of t.entries())
                if (s.childElementCount === 0) return this.shouldTrackView = e === 0, s;
            return null
        }
        copyScriptToDocumentHead(t) {
            if (this.documentContainsScript(t)) return;
            const e = document.createElement("script");
            t.src && e.setAttribute("src", t.src), t.type && e.setAttribute("type", t.type), t.innerHTML && (e.innerHTML = t.innerHTML), document.head.appendChild(e)
        }
        documentContainsScript(t) {
            const e = document.head.getElementsByTagName("script");
            for (const s of e)
                if (this.scriptsAreSame(t, s)) return !0;
            return !1
        }
        scriptsAreSame(t, e) {
            return !!t.src && !!e.src && t.src === e.src
        }
    }
    class j {
        constructor(t) {
            this.jsonpRequest = new p(t), this.popups = {}, this.popups_enabled = !0, this.grootEventListener = new y
        }
        renderEmbeddedForm(t) {
            new b(t.data, this.jsonpRequest, this.account(), this.grootEventListener).add()
        }
        renderPopupsAndPromotions(t) {
            const e = t.data;
            for (let s = 0; s < e.length; s++) {
                const i = new w(e[s], this.jsonpRequest, this.account(), this.grootEventListener);
                i.setTriggers(), this.popups[i.slug] = i
            }
        }
        addOnClickForm(t) {
            const e = new w(t.data, this.jsonpRequest, this.account(), this.grootEventListener);
            this.popups[e.slug] = e
        }
        account(t = null) {
            return t !== null && (this.account_id = t), this.account_id
        }
        enablePopups(t = null) {
            return t !== null && (this.popups_enabled = t), this.popups_enabled
        }
        initializePage(t) {
            new v(t, this.jsonpRequest).trackPageView(this.account())
        }
        initializeBlogPost(t) {
            new q(t, this.jsonpRequest).trackPageView(this.account())
        }
        initializeBlogCategory(t) {
            new C(t, this.jsonpRequest).trackPageView(this.account())
        }
        initializeEmbeddedForm(t) {
            new b({
                id: t
            }, this.jsonpRequest, this.account()).trackFormView()
        }
        execute(t, e = []) {
            return t === "webpages" || t === "blog" ? !1 : this[t] === void 0 ? (console.error(`Invalid argument "${t}" passed to MailerLite script`), !1) : this[t](...e)
        }
        show(t, e = !1) {
            const s = this.popups[t];
            s && s.show(e)
        }
    }
    const x = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        F = function(a, t) {
            this.accountId = a, this.jsonpRequest = t, this.jsonpRequestData = {}, this.acceptsMarketing = !1, this.newsletterForm = !1, this.init = () => {
                window.addEventListener("submit", this.eventTrigger, !1)
            }, this.eventTrigger = (function(e) {
                this.jsonpRequestData.fields = "", e.target.tagName === "FORM" && Array.from(e.target).forEach((s, i) => {
                    s.type === "email" && s.getAttribute("class").toLowerCase().includes("newsletter") && (this.newsletterForm = !0, this.jsonpRequestData.email = s.value), s.type === "checkbox" && (e.target[i - 1].type === "email" ? this.jsonpRequestData.email = e.target[i - 1].value : e.target[i - 1].type === "fieldset" && e.target[i - 2].type === "email" && (this.jsonpRequestData.email = e.target[i - 2].value), this.jsonpRequestData.fields += `&fields[accepts_marketing]=${s.checked?1:0}`, this.acceptsMarketing = !!s.checked), s.type === "text" && s.name === "fname" && (this.jsonpRequestData.fields += `&fields[name]=${encodeURIComponent(s.value)}`), s.type === "text" && s.name === "lname" && (this.jsonpRequestData.fields += `&fields[last_name]=${encodeURIComponent(s.value)}`)
                }), x.test(this.jsonpRequestData.email) && this.postDataToMl()
            }).bind(this), this.postDataToMl = function() {
                if (this.jsonpRequestData.email = encodeURIComponent(this.jsonpRequestData.email), this.jsonpRequestData.fields === "") delete this.jsonpRequestData.fields;
                else if (!this.acceptsMarketing && !this.newsletterForm) return;
                this.jsonpRequest.make(`/jsonp/${this.accountId}/squarespace`, null, this.jsonpRequestData)
            }
        };
    class S {
        constructor(t, e) {
            this.config = t, this.callbacks = e, this.jsonpRequest = new p(t)
        }
        init() {
            window[this.config.facade] && window[this.config.facade].q !== void 0 && this.processQueue(window[this.config.facade].q);
            const t = this;
            this.facade = function(e, ...s) {
                return t.callbacks.execute(e, s)
            }, window[this.config.facade] = this.facade, this.facade.fn = this.callbacks, this.loadStyleSheet(this.config.stylesheet), this.parseAccountIdFromSrcAttribute(), this.fetchEmbeddedForms(), this.fetchPopupsAndPromotions(), this.fetchOnClickForms(), this.saveEcommerceVisit(), document.querySelector('script[src*="squarespace"]') && new F(this.callbacks.account(), this.jsonpRequest).init()
        }
        loadStyleSheet(t) {
            const e = document.createElement("link");
            e.setAttribute("rel", "stylesheet"), e.setAttribute("type", "text/css"), e.setAttribute("media", "all"), e.setAttribute("href", t), document.getElementsByTagName("head")[0].appendChild(e)
        }
        processQueue(t) {
            for (; t.length;) {
                const e = Array.prototype.slice.call(t.shift()),
                    s = e.shift();
                this.callbacks.execute(s, e)
            }
        }
        domReady(t) {
            document.readyState !== "loading" ? t() : document.addEventListener ? document.addEventListener("DOMContentLoaded", t) : document.attachEvent("onreadystatechange", () => {
                document.readyState === "complete" && t()
            })
        }
        fetchOnClickForms() {
            const t = this.callbacks.account();
            if (!t) return;
            const e = document.getElementsByClassName("ml-onclick-form");
            for (let s = 0; s < e.length; s++) {
                const i = e[s].getAttribute("onclick");
                if (i) {
                    const o = i.split(", ")[1].slice(1, -1);
                    o && this.jsonpRequest.make(`/jsonp/${t}/forms/${o}`, "addOnClickForm")
                }
            }
        }
        fetchEmbeddedForms() {
            const t = document.getElementsByClassName("ml-embedded");
            for (let e = 0; e < t.length; e++) {
                const s = t[e].getAttribute("data-form");
                s && this.fetchEmbeddedForm(s)
            }
        }
        fetchEmbeddedForm(t) {
            const e = this.callbacks.account();
            e && this.jsonpRequest.make(`/jsonp/${e}/forms/${t}`, "renderEmbeddedForm")
        }
        fetchPopupsAndPromotions() {
            const t = this.callbacks.account();
            t && this.callbacks.enablePopups() && this.jsonpRequest.make(`/jsonp/${t}/forms`, "renderPopupsAndPromotions")
        }
        parseAccountIdFromSrcAttribute() {
            const t = document.getElementsByTagName("script");
            for (let e = 0; e < t.length; e++) {
                const s = t[e];
                if (s.src === void 0) continue;
                const i = s.src.split("#account=");
                if (i[1] !== void 0) return this.callbacks.account(i[1])
            }
        }
        saveEcommerceVisit() {
            const t = this.callbacks.account();
            let e = window.location.hostname;
            window && window.Shopify && window.Shopify.shop && (e = window.Shopify.shop);
            const s = new URLSearchParams(window.location.search),
                i = s.get("ml_recipient"),
                o = s.get("ml_link");
            t && i && o && this.jsonpRequest.noCache().make(`/jsonp/${t}/ecommerce/${i}/${o}`, null, {
                shop: e
            })
        }
    }
    const R = new j(u),
        k = new S(u, R);
    k.domReady(() => k.init())
})();