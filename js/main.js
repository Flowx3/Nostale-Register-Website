/**
@author Christian Welk, christian.welk@gameforge.com
@version 0.3.3

Changelog
0.3 - SimpleGallery width configurable
0.2 - ContentSlider: Config "thumbsPadding" - calculation of correct thumb width, when thumb area is smaller than large slider image
0.1 - Initial

*/

// namespace
log = false;

var GF = {
    version: 0.1,
    ie: 0,
    openReg: (document.getElementById('register')) ? true : false,
    getInternetExplorerVersion: function () {
        var rv = 0;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    },
    mobile: {
        isAndroid: function () {
            return navigator.userAgent.match(/Android/i) ? true : false;
        },
        isIOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        },
        isWindows: function () {
            return navigator.userAgent.match(/IEMobile/i) ? true : false;
        },
        isMobile: function () {
            return (GF.mobile.isAndroid() || GF.mobile.isIOS() || GF.mobile.isWindows());
        }
    },
    newLogger: function () {
        if (GF.Logger) return new GF.Logger();
    },
    newOverlay: function (overlayID) {
        if (GF.Overlay) return new GF.Overlay(overlayID);
    },
    newScrollManager: function (containerID, scrollNavID, stickyBarID, callback, firstShowCallback) {
        if (GF.ScrollManager) return new GF.ScrollManager(containerID, scrollNavID, stickyBarID, callback, firstShowCallback);
    },
    newContentSlider: function (containerID, sliderConfig) {
        if (GF.ContentSlider) return new GF.ContentSlider(containerID, sliderConfig);
    },
    newVideoManager: function (flashPlayerUrl) {
        if (GF.VideoManager) return new GF.VideoManager(flashPlayerUrl);
    },
    newValidator: function (formID, errorMessages, fieldConfig) {
        if (GF.Validator) return new GF.Validator(formID, errorMessages, fieldConfig);
    },
    newDropdown: function (selectedID, hiddenFieldID) {
        if (GF.Dropdown) return new GF.Dropdown(selectedID, hiddenFieldID);
    },
    newSimpleGalery: function (id, config, width) {
        if (GF.SimpleGalery) return new GF.SimpleGalery(id, config, width);
    }
};

GF.ie = GF.getInternetExplorerVersion();

// helper
GF.Helper = function () {

    var self = this;

    // IE8 has no bind, and the mozilla polyfill doesnt cover all, like the next line i.e.
    GF.byId = function (id) { return document.getElementById(id); };

    GF.mergeOptions = function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    }

    this.remove = function (el) {
        el.parentNode.removeChild(el);
    }
    GF.remove = this.remove;

    this.addListener = function (el, evtType, handler) {
        if (!el) return;
        if (el.addEventListener) {
            el.addEventListener(evtType, handler, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + evtType, handler);
        }
    }
    GF.addListener = function (el, evtType, handler) { self.addListener(el, evtType, handler); }

    this.removeListener = function (el, evtType, handler) {
        if (!el) return;
        if (el.removeEventListener) {
            el.removeEventListener(evtType, handler, false);
        } else if (el.attachEvent) {
            el.detachEvent('on' + evtType, handler);
        }
    }
    GF.removeListener = function (el, evtType, handler) { self.removeListener(el, evtType, handler); }

    // good old quirksmode.org - http://www.quirksmode.org/dom/getstyles.html
    this.getStyle = function getStyle(el, styleProp) {

        if (el.currentStyle)
            var y = el.currentStyle[styleProp];
        else if (window.getComputedStyle)
            var y = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        return y;
    }

    GF.getStyle = function (el, styleProp) { return self.getStyle(el, styleProp); }

    this.addCls = function getStyle(el, cls) {

        if (el.className.indexOf(cls) === -1) {
            el.className += " " + cls;
        }
    }

    GF.addCls = function (el, cls) { self.addCls(el, cls); }

    this.removeCls = function getStyle(el, cls) {

        if (!el || !el.className) return;

        el.className = el.className.replace(" " + cls, "");
        el.className = el.className.replace(cls, "");
    }

    GF.removeCls = function (el, cls) { self.removeCls(el, cls); }

    this.hasCls = function getStyle(el, cls) {

        // i know this can return false positives
        return el.className.indexOf(cls) !== -1;
    }

    GF.hasCls = function (el, cls) { return self.hasCls(el, cls); }

    GF.isQueryString = function (str) {
        return ((str.indexOf("#") != -1) || (str.indexOf(".") != -1));
    }
}

GF.helper = new GF.Helper();

// logger
GF.Logger = function () {

    var self = this;

    this.log = function (msg) {

        if (window['console']) console.log(msg);
    };

    this.unregister = function () {

        window.log = undefined
    };

    window.log = self.log
}

// overlay
GF.Overlay = function () {

    // create overlay

    var overlay = document.createElement("DIV");
    overlay.id = "overlayJS";
    overlay.className = "overlay";
    overlay.innerHTML += '<div id="overlayWrapper"><a id="close-overlay" class="close close-overlay">[schlieÃŸen]</a></div>';
    document.body.appendChild(overlay);

    var self = this;
    var wrapper = GF.byId("overlayWrapper");

    self.open = false;

    var closeBttn = overlay.querySelector('.close-overlay');

    var transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
    };

    var transEndEventName = "";

    var support = false;

    for (var i in transEndEventNames) {

        if (i in document.body.style) {

            support = true;
            transEndEventName = transEndEventNames[i];
        }
    }

    var allTriggers = [];

    this.bind = function (contentEl, openCallback, closeCallback) {

        if (!contentEl || !contentEl.tagName) {
            if (log) {
                log("[ERROR] new GF.Overlay: No HTML content element given");
            }
            return false;
        }

        contentEl.openCallback = openCallback;
        contentEl.closeCallback = closeCallback;

        contentEl.style.display = "none";

        GF.byId("overlayWrapper").appendChild(contentEl);

        var overlayID = contentEl.id;

        // trigger elements
        var triggers = document.querySelectorAll("[rel=" + overlayID + "]");

        for (i = 0; i < triggers.length; i++) {
            allTriggers.push(triggers[i]);
        }

        function onTrigger(e) {
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            self.toggleOverlay(overlayID);
        }

        for (i = 0; i < triggers.length; i++) {
            GF.addListener(triggers[i], 'click', onTrigger);
        }

        if (triggers.length == 0 && log) {
            log("[WARNING] new GF.Overlay: No Button to open the overlay found. Needs an HTML Element with rel=['" + overlayID + "'].");
        }
    }

    this.toggleOverlay = function (contentId) {

        var content;

        if (contentId) {
            var tmp = GF.byId("overlayWrapper").childNodes;

            for (var i = 0; i < tmp.length; i++) {
                if (tmp[i].id == contentId) {
                    tmp[i].style.display = "block";
                    content = tmp[i];
                    if (content.rel && content.rel == "youtube") {
                        var iframe = content.getElementsByTagName("IFRAME")[0];
                        iframe.src = iframe.getAttribute("data-src");
                    }
                } else if (tmp[i].tagName !== "A") {
                    tmp[i].style.display = "none";
                    if (tmp[i].rel && tmp[i].rel == "youtube") {
                        var iframe = tmp[i].getElementsByTagName("IFRAME")[0];
                        iframe.src = "";
                    }
                }
            }
        }

        var close = GF.byId("close-overlay");

        if (GF.hasCls(overlay, 'open')) {
            GF.removeCls(overlay, 'open');
            GF.removeCls(wrapper, 'open');
            GF.addCls(overlay, 'inTransition');
            var onEndTransitionFn = function (ev) {
                if (support) {
                    this.removeEventListener(transEndEventName, onEndTransitionFn);
                }
                self.open = false;
                GF.removeCls(overlay, 'inTransition');
                if (content && content.closeCallback) content.closeCallback();
            };
            if (support) {
                overlay.addEventListener(transEndEventName, onEndTransitionFn);
            }
            else {
                onEndTransitionFn();
            }
        }
        else {
            self.open = true;
            // if (content) content.appendChild(close);
            setTimeout(function () {
                if (content) content.appendChild(closeBttn);
            }, 0)
            GF.addCls(overlay, 'inTransition');
            setTimeout(function () {
                GF.addCls(overlay, 'open');
                GF.addCls(wrapper, 'open');
            }, 10)
            if (content && content.openCallback) content.openCallback();
        }
        return false;
    }

    GF.addListener(closeBttn, 'click', this.toggleOverlay);

    this.unregister = function () {
        for (i = 0; i < allTriggers.length; i++) {
            GF.removeListener(allTriggers[i], 'click', onTrigger);
        }
        GF.removeListener(closeBttn, 'click', this.toggleOverlay);
        GF.remove(overlay)
    };
}

// scrollManager
// http://ejohn.org/blog/learning-from-twitter/
GF.ScrollManager = function (containerID, navID, stickyBarID, callback, firstShowCallback) {

    this.firstShowDidFire = [];

    var self = this;

    // so we can compare and see if we scroll up or down
    this.pageYOffset = 0;

    this.currentSectioniIndex = 0;

    this.isSmoothScrolling = false;

    this.sections = [];

    var startSection = GF.byId("start");

    if (startSection && ((startSection.className.indexOf("section") !== -1) || (startSection.tagName == "SECTION"))) {
        this.sections.push(startSection);
    }

    var tmp = GF.byId(containerID);

    if (!tmp && containerID !== false) {
        if (log) {
            log("[ERROR] new GF.ScrollManager: No HTML element matches given ID for element containing the sections: \"" + containerID + "\"");
            if (containerID && GF.isQueryString(containerID)) log("[WARNING] new GF.ScrollManager: Given ID: \"" + containerID + "\" seems to be a query string. Please use alphanumeric ID.");
        }
        return false;
    }

    if (tmp) {
        tmp = tmp.childNodes;

        for (var i = 0; i < tmp.length; i++) {
            if (((tmp[i].className && tmp[i].className.indexOf("section") !== -1) || (tmp[i].tagName == "SECTION"))) {

                this.sections.push(tmp[i]);
                this.firstShowDidFire.push(false);
            }
        }
    }
    this.startSection = this.sections[0];

    this.navPoints = [];

    var nav = GF.byId(navID)

    if (nav) {
        var navItems = nav.childNodes;
        for (var i = 0; i < navItems.length; i++) {
            var item = navItems[i];
            if (item.nodeType === 1) {
                this.navPoints.push(item);
            }
        }
        GF.addCls(nav, "selected_section_0");
    }

    if (!nav && containerID !== false) {
        if (log) {
            log("[WARNING] new GF.ScrollManager: No HTML element matches given ID for ScrollNav: \"" + navID + "\"");
            if (navID && GF.isQueryString(navID)) log("[WARNING] new GF.ScrollManager: Given ID: \"" + navID + "\" seems to be a query string. Please use alphanumeric ID.");
        }
    }

    this.stickyBar = GF.byId(stickyBarID);
    if (this.stickyBar) this.stickyBarBottom = parseInt(GF.getStyle(this.stickyBar, "bottom").replace(/px/g, ''));

    if (!this.stickyBar && containerID !== false) {
        if (log) {
            log("[WARNING] new GF.ScrollManager: No HTML element matches given ID for StickyBar: \"" + stickyBarID + "\"");
            if (stickyBarID && GF.isQueryString(stickyBarID)) log("[WARNING] new GF.ScrollManager: Given ID: \"" + stickyBarID + "\" seems to be a query string. Please use alphanumeric ID.");
        }
    }

    // if (tmp && containerID !== false) {
    // 	if (log) {
    // 		log("[WARNING] new GF.ScrollManager: No HTML element matches given ID for StickyBar: \"" + stickyBarID + "\"");
    // 		if (stickyBarID && GF.isQueryString(stickyBarID)) log("[WARNING] new GF.ScrollManager: Given ID: \"" + stickyBarID + "\" seems to be a query string. Please use alphanumeric ID.");
    // 	}
    // }

    this.scrollIntoView = function (index) {

        if (this.isSmoothScrolling) return;

        this.resetNavPoints(index);

        this.navPoints[index].className = "active";

        this.navPoints[index].className = "active";
        var tmp = this.navPoints[index].parentNode
        GF.removeCls(tmp, "selected_section_" + this.currentSectioniIndex);
        this.currentSectioniIndex = index;
        GF.addCls(tmp, "selected_section_" + index);

        var distanceInSections = Math.abs(index - this.currentSectioniIndex);
        var el = this.sections[index];

        if (GF.ie && GF.ie < 9) {

            // https://developer.mozilla.org/en-US/docs/Web/API/Element.scrollIntoView
            el.scrollIntoView(true);

        } else {

            // smooth scrolling
            this.smoothScroll(el, 300 * distanceInSections, -75);
        }
    };

    this.addListeners = function () {

        var el, i;

        for (i = 0; i < this.navPoints.length; i++) {

            el = this.navPoints[i];

            GF.addListener(el, 'click', function (e) {

                var nr = 0;
                var target = e.target || e.srcElement;

                if (target.tagName !== 'LI') target = target.parentNode;
                var sibling = target.previousSibling;

                while (sibling) {
                    if (sibling.nodeType === 1) nr++;
                    sibling = sibling.previousSibling;
                }

                self.scrollIntoView(nr)
            });
        }
    }

    this.resetNavPoints = function (excludedIndex) {

        for (var i = 0; i < this.navPoints.length; i++) {

            if (i !== excludedIndex) this.navPoints[i].className = "";
        }
    };

    this.setActiveNavPoint = function () {

        if (this.isSmoothScrolling) return;

        // check scroll direction
        var direction;

        if (window.pageYOffset > this.pageYOffset) {

            // scroll down
            direction = 1;

        } else if (window.pageYOffset < this.pageYOffset) {

            // scroll up
            direction = -1;

        } else {
            this.pageYOffset = window.pageYOffset;

            return;
        }

        this.pageYOffset = window.pageYOffset;

        // be nice to IE and dont use window.innerHeight
        var threshold = document.documentElement.clientHeight / 2;

        var i, itemTop, itemBottom;

        // iterate backwards if we scroll up
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
        if (direction === -1) {

            for (i = this.sections.length - 1; i >= 0; i--) {

                // http://ejohn.org/blog/getboundingclientrect-is-awesome/
                itemBottom = this.sections[i].getBoundingClientRect().top + this.sections[i].offsetHeight;

                // https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
                if (itemBottom <= threshold * 2 && itemBottom > threshold) {

                    this.resetNavPoints(i);
                    this.navPoints[i].className = "active";
                    var tmp = this.navPoints[i].parentNode
                    GF.removeCls(tmp, "selected_section_" + this.currentSectioniIndex);
                    this.currentSectioniIndex = i;
                    GF.addCls(tmp, "selected_section_" + i);

                    if (firstShowCallback && !this.firstShowDidFire[i]) {
                        firstShowCallback(i);
                    } else {
                        GF.addCls(this.sections[i], "shown");
                    }
                    this.firstShowDidFire[i] = true;
                    break;
                }
            }

        } else {

            for (i = 0; i < this.sections.length; i++) {

                itemTop = this.sections[i].getBoundingClientRect().top;

                if (itemTop >= 0 && itemTop < threshold) {

                    this.resetNavPoints(i);
                    this.navPoints[i].className = "active";
                    var tmp = this.navPoints[i].parentNode
                    GF.removeCls(tmp, "selected_section_" + this.currentSectioniIndex);
                    this.currentSectioniIndex = i;
                    GF.addCls(tmp, "selected_section_" + i);
                    GF.addCls(this.sections[i], "shown");

                    if (firstShowCallback && !this.firstShowDidFire[i]) {
                        firstShowCallback(i);
                    } else {
                        GF.addCls(this.sections[i], "shown");
                    }
                    this.firstShowDidFire[i] = true;

                    if (i === this.sections.length - 1) {

                        var form = this.sections[i].getElementsByTagName('FORM')[0];

                        if (form && form.email) {
                            form.email.focus();
                        }
                    }

                    break;
                }
            }
        }
    }

    // uses code from https://github.com/cferdinandi/smooth-scroll
    // no hassle its MIT liscenced
    // modified for horizontal inline scrolling
    this.smoothScroll = function (anchor, duration, offset, horizontalContainer, horizontalContent) {

        var self = this;

        self.isSmoothScrolling = true;

        var startLocation = window.pageYOffset;

        if (horizontalContainer) startLocation = horizontalContainer.scrollLeft;

        // Set the animation variables to 0/undefined.
        var timeLapsed = 0;
        var percentage, position;

        // Calculate the easing pattern
        // from https://gist.github.com/gre/1650294
        var easingPattern = function (time) {
            return 1 + (--time) * time * time * time * time;
        };

        // Calculate how far to scroll
        var getEndLocation = function (anchor) {
            var location = 0;
            if (anchor.offsetParent) {
                do {
                    location += anchor.offsetTop;
                    anchor = anchor.offsetParent;
                } while (anchor);
            }
            if (location >= 0) {
                return location + offset;
            } else {
                return 0;
            }
        };

        // we can also provide a position instead of an anchor tag
        var endLocation = (isNaN(anchor)) ? getEndLocation(anchor) : anchor;
        var distance = endLocation - startLocation;

        // Stop the scrolling animation when the anchor is reached (or at the top/bottom of the page)
        var stopAnimation = function () {
            var currentLocation, rule;

            if (horizontalContainer) {

                currentLocation = horizontalContainer.scrollLeft;
                rule = ((horizontalContainer.clientWidth + currentLocation) >= horizontalContent.scrollWidth);

            } else {

                currentLocation = window.pageYOffset;
                rule = ((window.innerHeight + currentLocation) >= document.body.scrollHeight);
            }

            if (position == endLocation || currentLocation == endLocation || rule || self.stop) {
                self.stop = false;
                clearInterval(runAnimation);
                self.isSmoothScrolling = false;
            }
        };

        // Scroll the page by an increment, and check if it's time to stop
        var animateScroll = function () {

            timeLapsed += 16;
            percentage = (timeLapsed / duration);
            percentage = (percentage > 1) ? 1 : percentage;
            position = startLocation + (distance * easingPattern(percentage));

            if (horizontalContainer) {
                horizontalContainer.scrollLeft = position;
            } else {
                window.scrollTo(0, position);
            }

            stopAnimation();

        };

        var runAnimation = setInterval(animateScroll, 16);
    };

    this.inlineForm = GF.byId("registerFormBottomArea");
    // this one has to fade out if the bottom reg form becomes visible
    this.triggerBttn = document.getElementById('trigger-overlay');
    var menu = document.getElementById('menu').children[0];
    console.log(menu);

    this.setStickyOffset = function (offset) {
        this.stickyOffset = offset
    }

    this.setStickyBar = function () {

        var pos = this.stickyBar.getBoundingClientRect().top;
        var cls = this.stickyBar.className;

        if (this.inlineForm && window['innerHeight']) {

            var tmp = this.inlineForm.getBoundingClientRect();

            if ((tmp.top + tmp.height) < window.innerHeight + 80) {

                menu.className = "inner faded";

            } else {

                menu.className = "inner";
            }
        }
        var extra = (this.stickyBarBottom || 0) + (this.stickyOffset || 0);
        var test1 = this.sections[0].getBoundingClientRect().top > (-this.sections[0].offsetHeight + this.stickyBar.offsetHeight + extra);
        // var test2 = this.sections[0].getBoundingClientRect().top > -this.sections[0].offsetHeight - this.stickyBar.offsetHeight;

        if (test1) {

            if (cls !== "") {

                this.stickyBar.className = "";
                // this.startSection.className = this.startSection.className.replace(/\s?sticky/,'');

                // fix lazy repaint bug in safari
                this.stickyBar.style.display = 'none';
                this.stickyBar.offsetHeight; // no need to store this anywhere, the reference is enough
                this.stickyBar.style.display = 'block';
            }

        } else if (cls !== "sticky") {

            this.stickyBar.className = "sticky";
            // this.startSection.className = this.startSection.className + " sticky";
        }
    }

    // this.scrollAnim1 = GF.byId('scrollAnim1');
    // this.scrollAnim2 = GF.byId('scrollAnim2');

    // this.setScrollAnimation = function () {


    // 	var height = this.sections[5].offsetHeight;

    // 	var threshold = document.documentElement.clientHeight;

    // 	var itemBottom = this.sections[5].getBoundingClientRect().top + height;

    // 	var diff = (itemBottom - threshold);

    // 	var percentage = (itemBottom - threshold) / (height / 2)


    // 	if ( percentage < 0 ) percentage = 0;
    // 	if ( percentage > 1 ) percentage = 1;

    // 	var property = this.scrollAnim1.style.backgroundSize;
    // 	var value = 80 + percentage * 20;
    // 	var value2 = percentage * 120;
    // 	// console.log(property, value, percentage);

    // 	if ( property !== undefined ) this.scrollAnim1.style.backgroundSize = value + '% ' + value + '%';

    // 	this.scrollAnim2.style.backgroundPosition = 'center ' + value2 + 'px';
    // }

    this.updateLayout = function () {

        if (callback) callback();

        // pause the gigantic background animation, during scrolling
        // if (GF.videoManager.bgAnimInitiated) {

        //     var vid = GF.byId("bgVid");

        //     if (this.pageYOffset !== window.pageYOffset || GF.overlay.open) {

        //         vid.pause();

        //         if (GF.overlay.open) vid.style.display = "none";

        //     } else {

        //         if (vid.paused && !GF.overlay.open) {

        //             vid.style.display = "block";

        //             vid.play();
        //         }
        //     }
        // }

        if (self.stickyBar) this.setStickyBar();
        this.setActiveNavPoint();
        // if ( this.currentSectioniIndex >= 4 && this.scrollAnim1 ) this.setScrollAnimation()
    }

    this.unregister = function () {
        clearInterval(this.intID);
    }

    if (containerID) {
        this.intID = setInterval(function () {
            self.updateLayout();
        }, 10);
    }

    this.addListeners();
    this.setActiveNavPoint();
}

GF.ContentSlider = function (containerID, slideConf) {

    if (!containerID || !slideConf) return;

    this.slideConf = slideConf;
    var noThumbs = slideConf.disableThumbs

    this.root = GF.byId(containerID);

    // cache controls
    if (!noThumbs) {
        this.sliderNav = this.root.querySelector(".sliderNav");
        this.sliderNavScroller = this.root.querySelector('.sliderNavScroller');

        this.sliderNavPrev = this.root.querySelector(".sliderNavPrev");
        this.sliderNavNext = this.root.querySelector(".sliderNavNext");
    }

    this.slidePrev = this.root.querySelector(".slidePrev");
    this.slideNext = this.root.querySelector(".slideNext");

    this.slidesPane = this.root.querySelector(".slides");
    this.slidesScroller = this.root.querySelector('.slidesScroller');

    if (!noThumbs) {
        if (!this.sliderNav && log) {
            log("[ERROR] new GF.ContentSlider: No HTML element inside the ContentSlider matches class 'sliderNav'");
            return false;
        }
        if (!this.sliderNavScroller && log) {
            log("[ERROR] new GF.ContentSlider: No HTML element inside the ContentSlider matches class 'sliderNavScroller'");
            return false;
        }
        if (!this.sliderNavPrev && log) {
            log("[ERROR] new GF.ContentSlider: No HTML element inside the ContentSlider matches class 'sliderNavPrev'");
            return false;
        }
        if (!this.sliderNavNext && log) {
            log("[ERROR] new GF.ContentSlider: No HTML element inside the ContentSlider matches class 'sliderNavNext'");
            return false;
        }
    }
    if (!this.slidePrev && log) {
        log("[ERROR] new GF.ContentSlider: No HTML element inside the ContentSlider matches class 'slidePrev'");
        return false;
    }
    if (!this.slideNext && log) {
        log("[ERROR] new GF.ContentSlider: No HTML element inside the ContentSlider matches class 'slideNext'");
        return false;
    }
    if (!this.slidesPane && log) {
        log("[ERROR] new GF.ContentSlider: No HTML element inside the ContentSlider matches class 'slides'");
        return false;
    }
    if (!this.slidesScroller && log) {
        log("[ERROR] new GF.ContentSlider: No HTML element inside the ContentSlider matches class 'slidesScroller'");
        return false;
    }
    if (!this.root.querySelector(".tabs")) {
        if (log) {
            log("[ERROR] GF.ContentSlider > initTabs: No HTML element matches class 'tabs'");
        }
        return false;
    }

    // we skip the getElementsByClassName PolyFill, see:
    // http://ejohn.org/blog/getelementsbyclassname-speed-comparison/

    // we start at the first batch (first four thumbnails)
    this.currentThumbBatch = 1;
    this.currentSlide = 1;
    this.thumbBatchCount = null;
    this.thumbsPerBatch = 4;
    this.thumbCount = null;
    this.thumbOuterWidth = null;
    this.prevCls = "prev";
    this.nextCls = "next";

    var self = this;

    if (GF.ScrollManager) {
        this.scrollManager = new GF.ScrollManager(false);
    }

    this.unregister = function () {
        for (i = 0; i < this.tabs.length; i++) {
            GF.removeListener(this.tabs[i], 'click', this.setTab);
        }
        GF.removeListener(this.slidePrev, 'click', this.slidePrev.clickFunc);
        GF.removeListener(this.slideNext, 'click', this.slideNext.clickFunc);

        if (!noThumbs) {
            GF.removeListener(this.sliderNavPrev, 'click', this.sliderNavPrev.clickFunc);
            GF.removeListener(this.sliderNavNext, 'click', this.sliderNavNext.clickFunc);
            GF.removeListener(this.sliderNav, 'click', this.sliderNav.clickFunc);
            this.sliderNav.innerHTML = "";
        }

        this.root.querySelector(".slides").innerHTML = "";
    }

    this.initTabs = function () {

        this.tabs = [];
        this.currentTab = 0;

        var tmpTabs = this.root.querySelector(".tabs");

        var tmpTabs = tmpTabs.childNodes;

        for (i = 0; i < tmpTabs.length; i++) {

            var node = tmpTabs[i];

            // only element nodes
            if (node.nodeType === 1) {

                this.tabs.push(node);
                GF.addListener(node, 'click', this.setTab);
            }
        }
    };

    this.setTab = function (e) {

        var target = e.target || e.srcElement;

        for (var i = 0; i < self.tabs.length; i++) {

            if (target == self.tabs[i]) {

                self.currentTab = i;
                target.className = "active";

            } else {

                self.tabs[i].className = "";
            }
        }
        if (!noThumbs) self.initThumbs();
        self.initSlides();

        self.scrollManager.stop = true;

        // reset scroll positions
        self.scrollToSlide(0, true);
        if (!noThumbs) self.scrollToThumb(0, true);

        self.currentThumbBatch = 1;
        self.currentSlide = 1;

        if (!noThumbs) {
            self.sliderNavPrev.className = self.prevCls + " " + self.prevCls + "Inactive";
            self.sliderNavNext.className = self.nextCls;
        }

        self.slidePrev.className = "slidePrev " + self.prevCls + " " + self.prevCls + "Inactive";
        self.slideNext.className = "slideNext " + self.nextCls;
    }

    this.scrollToSlide = function (slideNr, noAnimation) {

        var pos = slideNr * this.slideOuterWidth;
        var nrOfSlidesToJump = Math.abs((slideNr + 1) - this.currentSlide);

        // log("GF.ContentSlider scrolling slides to " + pos);

        if (noAnimation) nrOfSlidesToJump = 0;

        if (slideNr >= this.slides.length - 1) {

            this.slideNext.className = "slideNext " + this.nextCls + " " + this.nextCls + "Inactive";
            this.slidePrev.className = "slidePrev " + this.prevCls;

        } else if (slideNr < 1) {

            this.slidePrev.className = "slidePrev " + this.prevCls + " " + this.prevCls + "Inactive";
            this.slideNext.className = "slideNext " + this.nextCls;

        } else {

            this.slidePrev.className = "slidePrev " + this.prevCls;
            this.slideNext.className = "slideNext " + this.nextCls;
        }

        if ((GF.ie && GF.ie < 9) || !this.scrollManager) {

            // https://developer.mozilla.org/en-US/docs/Web/API/Element.scrollIntoView
            this.slidesScroller.scrollLeft = pos;

        } else {

            this.scrollManager.smoothScroll(pos, 300 * nrOfSlidesToJump, 0, this.slidesScroller, this.slidesPane);
        }

        this.currentSlide = slideNr + 1;
        if (!noThumbs) this.adjustThumbsToSlide();
    }

    this.scrollToThumb = function (thumbNr, noAnimation) {

        var pos = thumbNr * this.thumbOuterWidth;

        // log("GF.ContentSlider scrolling thumbs to " + pos);

        if (noAnimation) duration = 0;

        if ((GF.ie && GF.ie < 9) || !this.scrollManager) {

            // https://developer.mozilla.org/en-US/docs/Web/API/Element.scrollIntoView
            this.sliderNavScroller.scrollLeft = pos;

        } else {

            this.scrollManager.smoothScroll(pos, 300, 0, this.sliderNavScroller, this.sliderNav);
        }
    }

    // event handler for thumbnail navigation
    this.doSliderNavPrev = function () {

        var scrollTargetIndex = (this.currentThumbBatch - 2) * this.thumbsPerBatch;

        switch (this.currentThumbBatch) {

            // we already reached the beginning so don't do anything
            case 1:

                break;

            // we will now reach the beginning
            case 2:

                this.sliderNavPrev.className = this.prevCls + " " + this.prevCls + "Inactive";

                this.scrollToThumb(scrollTargetIndex);

                this.currentThumbBatch -= 1;

                this.sliderNavNext.className = this.nextCls;

                break;

            // move one batch left
            default:

                this.sliderNavPrev.className = this.prevCls;

                this.scrollToThumb(scrollTargetIndex);

                this.currentThumbBatch -= 1;

                this.sliderNavNext.className = this.nextCls;
        }
    };

    this.doSliderNavNext = function () {

        var scrollTargetIndex = (this.currentThumbBatch) * this.thumbsPerBatch;

        switch (true) {

            // we already reached the end so don't do anything
            case (this.currentThumbBatch === this.thumbBatchCount):

                // console.log("A");

                break;

            // we will now reach the end
            case (this.currentThumbBatch === this.thumbBatchCount - 1):

                this.sliderNavNext.className = this.nextCls + " " + this.nextCls + "Inactive";

                this.scrollToThumb(scrollTargetIndex);

                this.currentThumbBatch += 1;

                this.sliderNavPrev.className = this.prevCls;

                break;

            case (this.currentThumbBatch < this.thumbBatchCount):

                this.sliderNavNext.className = this.nextCls;

                this.scrollToThumb(scrollTargetIndex);

                this.currentThumbBatch += 1;

                this.sliderNavPrev.className = this.prevCls;

            // console.log("C");
        }
    };

    this.adjustThumbsToSlide = function () {

        for (i = 0; i < this.thumbs.length; i++) {

            this.thumbs[i].className = "";
        }

        this.thumbs[this.currentSlide - 1].className = "active";

        var rangeEnd = this.currentThumbBatch * this.thumbsPerBatch;
        var rangeStart = ((this.currentThumbBatch - 1) * this.thumbsPerBatch) + 1;

        if (this.currentSlide < rangeStart) this.doSliderNavPrev();
        if (this.currentSlide > rangeEnd) this.doSliderNavNext();
    };

    // event handler for slide navigation
    this.doSlidePrev = function () {

        if (this.scrollManager.isSmoothScrolling) return;

        var scrollTargetIndex = this.currentSlide - 2;

        switch (this.currentSlide) {

            // we already reached the beginning so don't do anything
            case 1:

                break;

            // we will now reach the beginning
            case 2:

                this.slidePrev.className = "slidePrev " + this.prevCls + " " + this.prevCls + "Inactive";

                this.scrollToSlide(scrollTargetIndex);

                this.slideNext.className = "slideNext " + this.nextCls;

                break;

            // move one batch left
            default:

                this.slidePrev.className = "slidePrev " + this.prevCls;

                this.scrollToSlide(scrollTargetIndex);

                this.slideNext.className = "slideNext " + this.nextCls;
        }
    };

    this.doSlideNext = function () {

        if (this.scrollManager.isSmoothScrolling) return;

        var scrollTargetIndex = this.currentSlide;

        switch (true) {

            // we already reached the end so don't do anything
            case (this.currentSlide === this.slides.length):

                break;

            // we will now reach the end
            case (this.currentSlide === this.slides.length - 1):

                this.slideNext.className = "slideNext " + this.nextCls + " " + this.nextCls + "Inactive";

                this.scrollToSlide(scrollTargetIndex);

                this.slidePrev.className = "slidePrev " + this.prevCls;

                break;

            case (this.currentSlide < this.slides.length - 1):

                this.slideNext.className = "slideNext " + this.nextCls;

                this.scrollToSlide(scrollTargetIndex);

                this.slidePrev.className = "slidePrev " + this.prevCls;
        }
    };

    this.initControls = function () {

        // add listeners
        function slidePrevF() {
            self.doSlidePrev();
        }
        function slideNextF() {
            self.doSlideNext();
        }
        function sliderNavPrevF() {
            self.doSliderNavPrev();
        }
        function sliderNavNextF() {
            self.doSliderNavNext();
        }

        GF.addListener(this.slidePrev, 'click', slidePrevF);
        this.slidePrev.clickFunc = slidePrevF;
        GF.addListener(this.slideNext, 'click', slideNextF);
        this.slideNext.clickFunc = slideNextF;

        if (!noThumbs) {
            GF.addListener(this.sliderNavPrev, 'click', sliderNavPrevF);
            this.sliderNavPrev.clickFunc = sliderNavPrevF;
            GF.addListener(this.sliderNavNext, 'click', sliderNavNextF);
            this.sliderNavNext.clickFunc = sliderNavNextF;
        }
    }

    this.initThumbs = function () {

        // calculate width
        this.thumbs = [];
        var html = "";
        var path = "";
        var tabItems = this.slideConf.tabs[this.currentTab];

        for (i = 0; i < tabItems.length; i++) {
            path = tabItems[i][0];
            //html += '<li data-type="'+tabItems[i][3]+'" class="'+((i<1)?'active':'')+'"><img src="'+path+'"></li>' + "\n";
            html += '<li data-type="' + tabItems[i][3] + '" data-src="' + path + '" class="' + ((i < 1) ? 'active' : '') + '"><div class="decorator"></div><img src="' + path + '"></li>' + "\n";
        }

        this.sliderNav.innerHTML = html;

        var tmp = this.sliderNav.getElementsByTagName("LI");
        var marginLeft = parseInt(GF.getStyle(tmp[0], "margin-left").replace(/px/g, ''));
        var marginRight = parseInt(GF.getStyle(tmp[0], "margin-right").replace(/px/g, ''));
        var margins = marginLeft + marginRight;
        var padding = this.slideConf.thumbsPadding
        var newWidth = (this.sliderNavScroller.offsetWidth - padding - margins * (this.thumbsPerBatch - 1)) * (1 / this.thumbsPerBatch);

        for (i = 0; i < tmp.length; i++) {
            this.thumbs.push(tmp[i]);
            // add ga events to dynamic content
            // GF.addListener(tmp[i], 'click', gaEvents.clickMedia);

            if (!isNaN(newWidth)) tmp[i].style.width = newWidth + 'px';
            tmp[i].style.height = 'auto';
        }

        this.thumbOuterWidth = this.thumbs[1].offsetLeft - this.thumbs[0].offsetLeft;

        // this.thumbsPerBatch = Math.floor(this.sliderNavScroller.offsetWidth / this.thumbOuterWidth);

        this.thumbCount = this.thumbs.length;

        this.thumbBatchCount = Math.ceil(this.thumbCount / this.thumbsPerBatch);

        this.sliderNav.style.width = (this.thumbOuterWidth * this.thumbCount) + "px";

        function clickFunc(e) {
            self.selectThumb(e)
        }

        GF.addListener(this.sliderNav, 'click', clickFunc);
        this.sliderNav.clickFunc = clickFunc;
    }

    this.selectThumb = function (e) {

        if (this.scrollManager.isSmoothScrolling) return;

        var target = e.target || e.srcElement;

        // event delegation yeah!
        // http://davidwalsh.name/event-delegate
        if (target && (target.nodeName === "IMG" || target.className === "decorator")) {

            for (i = 0; i < this.thumbs.length; i++) {

                this.thumbs[i].className = "";
            }

            //var slideNr = this.thumbs.indexOf(target.parentNode);

            var slideNr = 0;

            var sibling = target.parentNode.previousSibling;

            while (sibling) {
                if (sibling.nodeType === 1) slideNr++;
                sibling = sibling.previousSibling;
            }

            this.thumbs[slideNr].className = "active";

            this.scrollToSlide(slideNr);

        }
    }

    this.initSlides = function () {
        this.slides = [];

        var html = "";
        var path = "";

        for (i = 0; i < this.slideConf.tabs[this.currentTab].length; i++) {

            path = this.slideConf.tabs[this.currentTab][i][1];
            html += ['<div class="slide">',
                '<div class="caption">' + this.slideConf.tabs[this.currentTab][i][2] + '</div>',
                '<img src="' + path + '">',
                '</div>',
                "\n"].join('');
        }

        var slides = this.root.querySelector(".slides")

        slides.innerHTML = html;

        var tmpSlides = slides.childNodes;

        for (i = 0; i < tmpSlides.length; i++) {

            var node = tmpSlides[i];
            // only element nodes
            if (node.nodeType === 1) {
                this.slides.push(node);
            }
        }

        var images = slides.getElementsByTagName("IMG");
        var newWidth = this.slidesScroller.offsetWidth;

        for (i = 0; i < images.length; i++) {
            images[i].style.width = newWidth + 'px';
            images[i].style.height = 'auto';
        }

        this.slideOuterWidth = this.slides[0].offsetWidth;

        slides.style.width = (this.slideOuterWidth * this.slides.length) + "px";
    }

    this.initTabs();
    this.initControls();
    if (!noThumbs) this.initThumbs();
    this.initSlides();
}

GF.VideoManager = function (flashPlayerUrl) {

    this.videoTag = document.createElement('video').play && window.location.search.indexOf("useFlash") === -1;
    this.buttons = [];
    this.vidContainers = [];
    this.overlays = [];
    this.flashPlayerUrl = flashPlayerUrl;

    // http://www.html5rocks.com/en/tutorials/video/basics/
    // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
    this.buildVideoHTML = function (id, sources, width, height, poster, showControls, loop) {

        showControls = (showControls) ? "controls" : "";
        var posterAttr = poster ? 'poster="' + poster + '"' : '';

        if (loop) {
            loop = "loop"
        }

        var html = ""

        if (sources) {

            html = [
                '<video ' + posterAttr + ' id="' + id + '" width="' + (width || 264) + '" height="' + (height || 143) + '" ' + showControls + ' ' + loop + '>',
                '<source src="' + sources.mp4 + '" type="video/mp4"/>',
                '<source src="' + sources.webm + '" type="video/webm"/>',
                '<source src="' + sources.ogv + '" type="video/ogg"/>',
                '</video>'
            ].join('');

        } else {
            html = '<img src="' + poster + '" width="' + (width || 264) + '" height="' + (height || 143) + '" >'
        }


        return html;
    }

    this.buildVideoFlash = function (vidSrc, sources, autoplay) {
        autoplay = autoplay ? "true" : "false";
        var html = [
            '<object width="100%" height="100%" type="application/x-shockwave-flash" data="' + self.flashPlayerUrl + '">',
            '<param name="wmode" value="transparent" />',
            '<param name="movie" value="' + self.flashPlayerUrl + '" />',
            '<param name="flashvars" value="controls=true&file=' + sources.mp4 + '&autoplay=' + autoplay + '" />',
            '</object>'
        ].join("");
        return html;
    }

    this.buildVideoYouTube = function (ytID, width, height, forOverlay) {
        var prefix = forOverlay ? "data-" : "";
        var html = '<iframe width="' + width + '" height="' + height + '" ' + prefix + 'src="//www.youtube.com/embed/' + ytID + '?rel=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>';
        return html;
    }

    this.initVideo = function (containerID, config) {

        if (!config.sources && !config.youtube) return false;

        var defaults = {
            videoID: "",
            sources: {},
            poster: "",
            width: 640,
            height: 480,
            autoplay: false,
            loop: false,
            showControls: true,
            onTimeUpdate: false,
            onEnded: false,
            forOverlay: false
        }

        var c = GF.mergeOptions(defaults, config);

        // if (!this.videoTag || GF.mobile.isMobile()) return;

        var self = this,
            container = GF.byId(containerID);

        // youtube
        if (c.youtube) {

            container.innerHTML = self.buildVideoYouTube(c.youtube.id, c.youtube.width, c.youtube.height, c.forOverlay);

            // html5 video
        } else if (this.videoTag) {
            container.innerHTML = this.buildVideoHTML(c.videoID + "_vid", c.sources, c.width, c.height, c.poster, c.showControls, c.loop);
            var vid = container.getElementsByTagName("VIDEO")[0];
            vid.load();
            vid.addEventListener('loadeddata', function () {
                if (c.autoplay) vid.play();
            }, false);
            if (c.onTimeUpdate) {
                vid.addEventListener('timeupdate', function (e) {
                    c.onTimeUpdate(vid);
                }, false);
            }
            if (c.onEnded) {
                vid.addEventListener('ended', function (e) {
                    c.onEnded(vid);
                }, false);
            }

            // flash
        } else {
            container.innerHTML = this.buildVideoFlash(c.videoID + "_vid", c.sources, c.autoplay);
            // if (loadedCallback) loadedCallback();
        }

        this.vidContainers.push(container);

        // this.previewsInitiated = true;
        return vid;
    }

    this.initButtonForOverlay = function (buttonID, config, overlay) {

        if (!config.youtube && (!config.sources || !config.videoID)) return false;

        var defaults = {
            youtube: null,
            videoID: "",
            sources: {},
            width: 640,
            height: 480,
            forOverlay: true
        }

        var c = GF.mergeOptions(defaults, config);

        if (!GF.Overlay) return;
        var self = this;
        var button = GF.byId(buttonID);
        button.rel = c.videoID;

        var holder = document.createElement("DIV");
        holder.id = c.videoID;
        holder.rel = config.youtube ? "youtube" : "";
        holder.className = "vid_big_outer";
        document.body.appendChild(holder);
        var vid = this.initVideo(c.videoID, c);
        var vidTag = GF.byId(c.videoID + "_vid");

        button.overlay = overlay || new GF.Overlay();

        button.overlay.bind(
            holder,
            function () { if (vidTag) { vidTag.currentTime = 0; vidTag.play(); } },
            function () { if (vidTag) { vidTag.pause(); } }
        );

        button.clickFunc = function () {
            button.overlay.toggleOverlay(c.videoID);
        }

        GF.addListener(button, "click", button.clickFunc);

        this.buttons.push(button);
    }

    this.unregister = function () {
        for (i = 0; i < this.buttons.length; i++) {
            GF.removeListener(this.buttons[i], 'click', this.buttons[i].clickFunc);
        }
        for (i = 0; i < this.vidContainers.length; i++) {
            this.vidContainers[i].innerHTML = "";
        }
        for (i = 0; i < this.overlays.length; i++) {
            GF.remove(this.overlays[i]);
        }
        this.buttons = [];
        this.vidContainers = [];
        this.overlays = [];
    }
}

GF.Validator = function (formID, errorMessages, fieldConfig) {

    // rules from main site user/register:

    var self = this;

    var fc_default = {
        email: {
            check: true,
            name: "email",
        },
        username: {
            check: true,
            name: "username",
            minsize: 5,
            maxsize: 16
        },
        password: {
            check: true,
            name: "password",
            minsize: 5,
            maxsize: 16
        }
    };

    if (fieldConfig) {
        if (fieldConfig.email) fieldConfig.email = GF.mergeOptions(fc_default.email, fieldConfig.email);
        if (fieldConfig.username) fieldConfig.username = GF.mergeOptions(fc_default.username, fieldConfig.username);
        if (fieldConfig.password) fieldConfig.password = GF.mergeOptions(fc_default.password, fieldConfig.password);
    } else {
        fieldConfig = fc_default;
    }

    var fconf = fieldConfig;

    if (!log) var log = function () { };

    this.okCls = "ok";
    this.errorCls = "error";
    // focusout would be nicer but stick with blur for older browsers
    this.validationEvent = "blur";

    this.errorMessages = {
        noSpecialChars: "Keine Sonderzeichen erlaubt.",
        onlyValidPwdChars: "Keine Sonderzeichen erlaubt.",
        req: "Dieses Feld wird benÃ¶tigt.",
        len: function (min, max) { return "Zwischen " + min + " und " + max + " Zeichen erlaubt." },
        email: "Die E-Mail-Adresse scheint fehlerhaft zu sein."
    };

    if (errorMessages) {
        this.errorMessages = errorMessages;
    }

    this.regexes = {
        email: /^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/,
        noSpecialChars: /^[0-9a-zA-Z]*$/,
        onlyValidPwdChars: /^[a-zA-Z0-9 @!#$%&(){}*+,\-.\/:;<>=?[\]\^_|~]*$/
    }

    // validation methods

    this.validateRequiredHasError = function (field) {
        if (field.value != "") {
            log(field.name + ": required success");
            return "";

        } else {
            log(field.name + ": required error");
            return this.errorMessages.req[field.name];
        }
    };

    this.validateLengthHasError = function (field, min, max) {

        if ((field.value.length >= (min || 5) && field.value.length <= (max || 16))) {
            log(field.name + ": length success");
            return "";

        } else {
            log(field.name + ": length error");
            return this.errorMessages.len(min, max);
        }
    };

    this.validateNoSpecialCharsHasError = function (field) {
        if (new RegExp(this.regexes.noSpecialChars).test(field.value)) {
            log(field.name + ": sepcialchars success");
            return "";

        } else {
            log(field.name + ": sepcialchars error");
            return this.errorMessages.noSpecialChars;
        }
    };

    this.validateOnlyValidPwdCharsHasError = function (field) {
        if (new RegExp(this.regexes.onlyValidPwdChars).test(field.value)) {
            log(field.name + ": sepcialPWchars success");
            return "";

        } else {
            log(field.name + ": sepcialPWchars error");
            return this.errorMessages.onlyValidPwdChars;
        }
    };

    this.validateEmailHasError = function (field) {
        if (new RegExp(this.regexes.email).test(field.value)) {
            log(field.name + ": email success");
            return "";

        } else {
            log(field.name + ": email error");
            return this.errorMessages.email;
        }
    };

    // decoration methods

    this.getErrorInfo = function (field) {

        var tmp = field.parentNode.childNodes;
        var cls = "error_info";
        var cls2 = "password_info";
        var el;

        for (var i = 0; i < tmp.length; i++) {
            el = tmp[i];

            if (el.nodeType === 1) {
                if (el.className.indexOf(cls) !== -1 || el.className.indexOf(cls2) !== -1) {
                    return el;
                }
            }
        }
    }

    this.setFieldOK = function (field) {

        self.removeValidationMsg(field);

        field.className = self.okCls;
        GF.addCls(field.parentNode, "fieldOk");
    };

    this.setFieldError = function (field, fieldErrors) {

        var el = self.getErrorInfo(field);

        if (el) {
            el.innerHTML = fieldErrors[0];
            GF.removeCls(el, "password_info");
            GF.addCls(el, "error_info");
            GF.addCls(el, "shown");
            if (GF.ie && GF.ie < 9) el.style.display = "block";
        }

        field.className = self.errorCls;
        GF.addCls(field.parentNode, "fieldError");
    };

    this.setFieldInfo = function (field, info) {

        var el = self.getErrorInfo(field);

        if (el) {
            el.innerHTML = info;
            GF.removeCls(el, "error_info");
            GF.addCls(el, "password_info");
            GF.addCls(el, "shown");
            if (GF.ie && GF.ie < 9) el.style.display = "block";
        }
    };

    this.formatField = function (field, fieldErrors) {

        if (fieldErrors.length > 0) {
            self.setFieldError(field, fieldErrors);
        } else {
            self.setFieldOK(field);
        }
    }

    this.removeValidationMsg = function (field) {

        field.className = "";

        var errorInfo = self.getErrorInfo(field);

        GF.removeCls(errorInfo, "shown");

        if (GF.ie && GF.ie < 9) errorInfo.style.display = "none";

        GF.removeCls(field.parentNode, "fieldOk");
        GF.removeCls(field.parentNode, "fieldError");
    }

    var el;
    var form = GF.byId(formID);
    this.form = form;
    this.fieldErrors = [];
    this.formErrors = false;

    // form handler

    this.validateForm = function (e) {

        var form = self.form || e.target || e.srcElement;

        self.formErrors = false;
        if (form.elements[fconf.email.name] && fconf.email.check) self.validateFieldEmail(null, form.elements[fconf.email.name], true);
        if (form.elements[fconf.username.name] && fconf.username.check) self.validateFieldPlayerName(null, form.elements[fconf.username.name], true);
        if (form.elements[fconf.password.name] && fconf.password.check) self.validateFieldPassword(null, form.elements[fconf.password.name], true);

        if (self.formErrors) {

            // console.log("registration form " + form.id + " contains errors");

            if (e) {
                if (e.preventDefault) {
                    e.preventDefault()
                } else {
                    e.returnValue = false;
                }
            }
            return false;

        } else {
            // console.log("registration form contains no errors");
            // gaEvents.sendSubmit(form.id.replace(/regForm/,''));
            return true;
        }
    };

    // add listeners

    this.validateFieldEmail = function (e, field, submit) {

        field = (field || this);
        var form = field.form;

        self.fieldErrors = [];

        var check1Error = self.validateRequiredHasError(field);
        var check2Error = self.validateEmailHasError(field);

        if (check1Error) {
            self.fieldErrors.push(check1Error);
            // gaEvents.sendRegisterError(field.form.name.replace(/regForm/,''), 'required', field.name, submit);
        }
        if (check2Error) {
            self.fieldErrors.push(check2Error);
            // gaEvents.sendRegisterError(field.form.name.replace(/regForm/,''), 'invalid', field.name, submit);
        }

        if (self.fieldErrors.length > 0) self.formErrors = true;

        self.formatField(field, self.fieldErrors);
    }

    this.validateFieldPlayerName = function (e, field, submit) {

        field = (field || this);
        var form = field.form;

        self.fieldErrors = [];

        var check1Error = self.validateRequiredHasError(field);
        var check2Error = self.validateLengthHasError(field, fconf.username.minsize, fconf.username.maxsize);
        var check3Error = self.validateNoSpecialCharsHasError(field);

        if (check1Error) {
            self.fieldErrors.push(check1Error);
            // gaEvents.sendRegisterError(field.form.name.replace(/regForm/,''), 'required', field.name, submit);
        }
        if (check2Error) {
            self.fieldErrors.push(check2Error);
            // gaEvents.sendRegisterError(field.form.name.replace(/regForm/,''), 'length', field.name, submit);
        }
        if (check3Error) {
            self.fieldErrors.push(check3Error);
            // gaEvents.sendRegisterError(field.form.name.replace(/regForm/,''), 'specialchars', field.name, submit);
        }

        if (self.fieldErrors.length > 0) self.formErrors = true;

        self.formatField(field, self.fieldErrors);
    }

    this.validateFieldPassword = function (e, field, submit) {

        field = (field || this);
        var form = field.form;

        self.fieldErrors = [];

        var check1Error = self.validateRequiredHasError(field);
        var check2Error = self.validateLengthHasError(field, fconf.password.minsize, fconf.password.maxsize);
        var check3Error = self.validateOnlyValidPwdCharsHasError(field);

        if (check1Error) {
            self.fieldErrors.push(check1Error);
            // gaEvents.sendRegisterError(field.form.name.replace(/regForm/,''), 'required', field.name, submit);
        }
        if (check2Error) {
            self.fieldErrors.push(check2Error);
            // gaEvents.sendRegisterError(field.form.name.replace(/regForm/,''), 'length', field.name, submit);
        }
        if (check3Error) {
            self.fieldErrors.push(check3Error);
            // gaEvents.sendRegisterError(field.form.name.replace(/regForm/,''), 'specialchars', field.name, submit);
        }

        if (self.fieldErrors.length > 0) self.formErrors = true;
        self.formatField(field, self.fieldErrors);
    }

    this.applyFieldListeners = function (el) {

        // if (["email", "playername", "password"].indexOf(el.name) === -1) return;
        // and again for IE
        if (!(fconf.email.name === el.name || fconf.username.name === el.name || fconf.password.name === el.name)) return;

        el.focusFunc = function (e) {

            var target = e.target || e.srcElement;

            self.removeValidationMsg(target);

            if (target.name === fconf.username.name && fconf.username.check) {
                self.setFieldInfo(target, self.errorMessages.len(fconf.username.minsize, fconf.username.maxsize));
            }

            if (target.name === fconf.password.name && fconf.password.check) {
                self.setFieldInfo(target, self.errorMessages.len(fconf.password.minsize, fconf.password.maxsize));
            }

            var wrapperCls = (GF.hasCls(target, self.errorCls)) ? "focusError" : "focusOk";
            GF.addCls(target.parentNode, wrapperCls);
        }

        GF.addListener(el, "focus", el.focusFunc);

        el.fousOutFunc = function (e) {

            var target = e.target || e.srcElement;

            GF.removeCls(target.parentNode, "focusError");
            GF.removeCls(target.parentNode, "focusOk");
        }

        GF.addListener(el, "focusout", el.fousOutFunc);

        switch (el.name) {

            case (fconf.email.name):
                if (fconf.email.check) {
                    el.blurFunc = function (e) {
                        self.validateFieldEmail(e, el);
                    }
                    GF.addListener(el, this.validationEvent, el.blurFunc);
                }
                break;

            case (fconf.username.name):

                if (fconf.username.check) {
                    el.blurFunc = function (e) {
                        self.validateFieldPlayerName(e, el);
                    }
                    GF.addListener(el, this.validationEvent, el.blurFunc);

                    el.keyUpFunc = function (e) {
                        var wrong = self.validateLengthHasError(el, fconf.username.minsize, fconf.username.maxsize);
                        if (wrong) {
                            self.setFieldInfo(el, self.errorMessages.len(fconf.username.minsize, fconf.username.maxsize));
                        } else {
                            self.removeValidationMsg(el);
                        };
                    }
                    GF.addListener(el, 'keyup', el.keyUpFunc);
                }
                break;

            case (fconf.password.name):

                if (fconf.password.check) {
                    el.blurFunc = function (e) {
                        self.validateFieldPassword(e, el);
                    }
                    GF.addListener(el, this.validationEvent, el.blurFunc);

                    el.keyUpFunc = function (e) {
                        var wrong = self.validateLengthHasError(el, fconf.password.minsize, fconf.password.maxsize);
                        if (wrong) {
                            self.setFieldInfo(el, self.errorMessages.len(fconf.password.minsize, fconf.password.maxsize));
                        } else {
                            self.removeValidationMsg(el);
                        };
                    }
                    GF.addListener(el, 'keyup', el.keyUpFunc);
                }
        }
    }

    GF.addListener(form, "submit", self.validateForm);

    for (var j = 0; j < form.elements.length; j++) {

        el = form.elements[j];

        this.applyFieldListeners(el);

        if (GF.ie && GF.ie < 9) {

            var errorInfo = this.getErrorInfo(el);
            if (errorInfo) errorInfo.style.display = "none";
        }
    }

    this.unregister = function () {
        GF.removeListener(document.body, 'click', self.hidePWDHelp);
        GF.removeListener(form, "submit", self.validateForm);
        GF.removeListener(help, 'click', listener);
        self.resetForm(true);
        var elements = self.form.elements;
        for (i = 0; i < elements.length; i++) {
            if (elements[i].focusFunc) GF.removeListener(elements[i], "focus", elements[i].focusFunc);
            if (elements[i].focusOutFunc) GF.removeListener(elements[i], "focusout", elements[i].focusOutFunc);
            if (elements[i].blurFunc) GF.removeListener(elements[i], self.validationEvent, elements[i].blurFunc);
            if (elements[i].keyUpFunc) GF.removeListener(elements[i], "keyup", elements[i].keyUpFunc);
        }
    }

    this.resetForm = function (reset) {

        var form = this.form;

        var items = [
            form.elements[fconf.email.name],
            form.elements[fconf.username.name],
            form.elements[fconf.password.name]
        ];

        for (var k = 0; k < items.length; k++) {

            if (items[k]) {
                if (reset) { items[k].value = ''; }
                this.removeValidationMsg(items[k]);
            }
        }
    }

    // help icon
    this.showPWDHelp = function () {

        var helpIcon = form.querySelector('.helpIcon');

        if (helpIcon) {

            var infoBox = 0,
                childDivs = helpIcon.parentNode.getElementsByTagName('DIV'),
                infoDisplay = '';

            for (var k = 0; k < childDivs.length; k++) {
                if (GF.hasCls(childDivs[k], 'password_info')) infoBox = childDivs[k];
            }

            if (infoBox) {

                var open = !(infoBox.style.display === 'none' || infoBox.style.display === '');

                if (open) {

                    GF.removeCls(helpIcon, 'password_info_on');
                    infoBox.style.display = 'none';

                } else {

                    GF.addCls(helpIcon, 'password_info_on')
                    infoBox.style.display = 'block';
                }


                // infoBox.style.bottom = (infoBox.offsetHeight/2 - 39) + 'px';
                // infoBox.style.top = 'auto';
                // infoBox.style.right = 'auto';
                // infoBox.style.left = '-' + parseInt(infoBox.offsetWidth + 42) + 'px';
            }
        }
    }

    this.hidePWDHelp = function () {

        var helpIcon = form.querySelector('.helpIcon');

        if (helpIcon) {

            var infoBox = 0,
                childDivs = helpIcon.parentNode.getElementsByTagName('DIV');

            for (var k = 0; k < childDivs.length; k++) {
                if (GF.hasCls(childDivs[k], 'password_info')) infoBox = childDivs[k];
            }

            if (infoBox) {
                GF.removeCls(helpIcon, 'password_info_on');
                infoBox.style.display = 'none';
            }

            // infoBox.style.bottom = (infoBox.offsetHeight/2 - 39) + 'px';
            // infoBox.style.top = 'auto';
            // infoBox.style.right = 'auto';
            // infoBox.style.left = '-' + parseInt(infoBox.offsetWidth + 42) + 'px';
        }
    }

    var help = form.querySelector('.helpIcon');

    function listener(e) {

        var el = form.querySelector('.helpIcon');

        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        self.showPWDHelp(el);
    }

    GF.addListener(help, 'click', listener);

    GF.addListener(document.body, 'click', self.hidePWDHelp);
}

GF.Dropdown = function (selectedID, hiddenFieldID) {

    var self = this;
    var clsOpen = 'dropdown_open';
    var clsClose = 'dropdown_closed';
    self.dropdowns = [];

    this.makeDropdown = function (el, hiddenField) {

        var cls = clsClose,
            list;

        GF.addListener(el, "click", self.toggleDropdown);
        list = el.parentNode.getElementsByTagName('UL')[1];
        if (hiddenField) list.GFValueField = hiddenField;
        self.list = list
        GF.addListener(list, "click", self.selectItem);

        GF.addListener(el, "click", self.toggleDropdown);

        self.dropdowns.push(list);

        if (!GF.hasCls(list, cls)) GF.addCls(list, cls);
    }

    this.toggleDropdown = function (e) {

        var target = self.trigger || e.target || e.srcElement,
            list = self.list;

        var addCls = (GF.hasCls(list, clsClose)) ? clsOpen : clsClose;
        var removeCls = (addCls === clsClose) ? clsOpen : clsClose;

        GF.helper.addCls(list, addCls);
        GF.helper.removeCls(list, removeCls);

        // GF.validator.resetForms(false);

        return false;
    }

    this.closeDropdown = function (el) {

        if (GF.hasCls(el, clsOpen)) {
            GF.helper.removeCls(el, clsOpen);
            GF.helper.addCls(el, clsClose);
        }
    }

    this.selectItem = function (e) {

        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();

        var target = e.target || e.srcElement,
            list, chosenItem;

        if (target.tagName === "UL") {

            list = target.parentNode.parentNode.getElementsByTagName('UL')[1];
            chosenItem = target.parentNode.parentNode.getElementsByTagName('UL')[0].getElementsByTagName('LI')[0];

        } else {

            if (target.parentNode) {

                do {

                    if (target.tagName === "LI") break;
                    target = target.parentNode;

                } while (target);
            }

            if (!target) return;

            //parent = target.parentNode;
            list = target.parentNode.parentNode.getElementsByTagName('UL')[1];
            chosenItem = target.parentNode.parentNode.getElementsByTagName('UL')[0].getElementsByTagName('LI')[0];

            //	        var items = list.getElementsByTagName('LI');
            //items[0].innerHTML = target.innerHTML;

            if (list.GFValueField) list.GFValueField.value = target.getElementsByTagName('INPUT')[0].value;

        }

        chosenItem.innerHTML = target.innerHTML;
        //self.toggleDropdown( list );

        self.closeDropdown(list)
    }

    document.body["closeDropdown_" + selectedID] = function (e) {

        var target = e.target || e.srcElement;

        if (target.tagName === "UL" || target.tagName === "LI" || target.tagName === "EM") { return; }

        for (var i = 0; i < self.dropdowns.length; i++) {
            self.closeDropdown(self.dropdowns[i]);
        }
    }
    GF.addListener(document.body, 'click', document.body["closeDropdown_" + selectedID])

    if (!GF.byId(selectedID)) return;

    self.trigger = GF.byId(selectedID);

    self.makeDropdown(GF.byId(selectedID), GF.byId(hiddenFieldID));

    this.unregister = function () {
        GF.removeListener(document.body, 'click', document.body["closeDropdown_" + selectedID])
        GF.removeListener(self.trigger, "click", self.toggleDropdown);
        GF.removeListener(self.list, "click", self.selectItem);
        self.list.className = "dropdown_closed";
    }

}

// simple galery (overlay)
GF.SimpleGalery = function (sGalRootId, sliderConfig, width) {

    if (GF.ScrollManager) {
        this.scrollManager = new GF.ScrollManager(false);
    }

    var self = this;
    var sGalRoot = GF.byId(sGalRootId);
    var fullWidth = width || document.documentElement.clientWidth;
    var sHtml = '';
    var tabs = sliderConfig.tabs;
    var scroller;
    var pager;
    var galNr = 0;
    var scrollPos = [];
    var imgCount = 0;
    var startXPos = 0;
    var lastXPos;
    var lastYPos;
    var checked;
    var active;
    var dir;

    sGalRoot.style.width = fullWidth + "px";
    sGalRoot.style.overflow = "hidden";

    // build html
    for (i = 0; i < tabs.length; i++) {
        sHtml += '<h3>' + sliderConfig.tabTitles[i] + '</h3><div class="sg"><div class="sgScroller">';
        for (j = 0; j < tabs[i].length; j++) {
            var item = tabs[i][j]
            // image
            sHtml += '<div class="sgItem"><img data-gal="' + i + '" src="' + item[1] + '" style="width:' + fullWidth + 'px" /></div>';
            imgCount++;
        }
        sHtml += '</div></div><div class="sgPager"></div>';
    }
    sGalRoot.innerHTML += sHtml;

    // insert dots
    for (i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        pager = sGalRoot.getElementsByClassName("sgPager")[i];

        for (j = 0; j < tab.length; j++) {
            var act = (j == 0) ? "Active" : "";
            pager.innerHTML += '<span class="sgPgrItem' + act + '"></span>';
        }
    }

    // set scroller width
    for (i = 0; i < tabs.length; i++) {
        scrollPos.push(0);
        var tab = tabs[i];
        var pagers = sGalRoot.getElementsByClassName("sgPager");
        var scrollers = sGalRoot.getElementsByClassName("sgScroller");
        var pager = pagers[i];
        var scroller = scrollers[i];
        scroller.style.width = fullWidth * tab.length + "px";

        // end of touch
        var touchend = function (e) {
            if (e.touches.length > 1) return;

            if (!active || self.scrollManager.isSmoothScrolling) {
                return false;
            }

            e.preventDefault();

            if (lastXPos > startXPos) {
                dir = -1;
            } else if (lastXPos < startXPos) {
                dir = 1;
            } else {
                dir = 0;
            }

            if (Math.abs(lastXPos - startXPos) < 50) dir = 0;

            scrollPos[galNr] += dir;
            scrollPos[galNr] = Math.min(imgCount - 1, Math.max(0, scrollPos[galNr]))

            // set pager
            for (i = 0; i < pager.childNodes.length; i++) {
                pager.childNodes[i].className = (i == scrollPos[galNr]) ? "sgPgrItemActive" : "sgPgrItem";
            }

            var offset = scrollPos[galNr] * fullWidth

            self.scrollManager.smoothScroll(offset, 300, 0, scroller.parentNode, scroller);

            scroller.parentNode.style.overflow = "hidden";
        }

        //touch event
        GF.addListener(scroller.parentNode, "touchstart", function (e) {
            if (self.scrollManager.isSmoothScrolling) {
                return false;
            }
            galNr = e.target.getAttribute("data-gal");
            imgCount = tabs[galNr].length;
            scroller = scrollers[galNr];
            pager = pagers[galNr];

            scroller.parentNode.style.overflow = "auto";
            startXPos = e.touches[0].pageX;
            lastYPos = e.touches[0].pageY;
            lastXPos = startXPos;
            checked = false;
            active = true;
        })
        GF.addListener(scroller.parentNode, "touchmove", function (e) {
            if (e.touches.length > 1) return;

            if (self.scrollManager.isSmoothScrolling) {
                e.preventDefault();
                return false;
            }

            var x = e.touches[0].pageX;
            var y = e.touches[0].pageY;

            if (!checked) {
                checked = true;
                var deltaX = x - lastXPos;
                var deltaY = y - lastYPos;
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    active = false;
                    scroller.parentNode.style.overflow = "hidden";
                }
            }

            if (active) {
                e.preventDefault();
                scroller.parentNode.scrollLeft -= (x - lastXPos);

                lastXPos = x;
            }
        })
        GF.addListener(scroller.parentNode, "touchend", touchend)
        GF.addListener(scroller.parentNode, "touchcancel", touchend)
    }
}