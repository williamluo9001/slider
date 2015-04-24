// SMOOTH SCROLLING
// Mouse Wheel
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

;(function ( $, window, document, undefined ) {
    var scroll_target = 0;
    var scroll_current = 0;
    var scroll_timeout = undefined;

    $(document).ready(function() {
        // $(window).mousewheel(function(event, delta, deltaX, deltaY){
        //     scroll_current = $(window).scrollTop();
        //     scroll_target = scroll_current - event.deltaFactor * delta;
        //     tweenScroll();
        //     return false;
        // });
    });

    function tweenScroll() {
        clearTimeout(scroll_timeout);
        scroll_current = lerp(scroll_current, scroll_target, 0.2);
        $(window).scrollTop(scroll_current);

        if (Math.abs(scroll_current - scroll_target) > 1) {
            scroll_timeout = setInterval(function() {
                tweenScroll();
            }, 16);
        } else {
            scroll_current = scroll_target;
            $(window).scrollTop(scroll_current);
        }
    }
})( jQuery, window, document );


// SCROLL SLACKER


;(function ( $, window, document, undefined ) {
    var pluginName = "scrollSlacker",
        defaults = {
    };

    function scrollSlacker ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

        this.ignored = options.ignored;
        this.obj = $(this.element);
        this.tween_timeout = undefined;
        this.current_offset = 0;
        this.target_offset = 0;
        this.init_time = timestamp();
        this.can_animate = false;
        this.elasticity = options.elasticity;

        this.default_offset = this.obj.position().top;
        this.current_scroll = $(window).scrollTop();
        this.last_scroll = this.current_scroll;

        this.init();
    }

    $.extend(scrollSlacker.prototype, {
        init : function () {
            var self = this;

            $(window).on('scroll', function() {
                self.current_scroll = $(window).scrollTop();

                if (self.can_animate) {
                    self.tween();
                } else {
                    if (timestamp() - self.init_time > 500) {
                        self.can_animate = true;
                    }
                }
            });
        },
        tween : function() {
            var self = this;
            clearTimeout(self.tween_timeout);

            var f_spring = -(self.target_offset - self.default_offset) / self.elasticity;
            var f_scroll = self.current_scroll - self.last_scroll;

            self.target_offset += f_scroll + f_spring;
            self.current_offset = lerp(self.current_offset, self.target_offset, 0.1);

            self.redraw();

            if (self.current_offset > 0.1 || self.current_offset < -0.1) {
                self.tween_timeout = setTimeout(function() {
                    self.tween();
                }, 16);
            } else {
                self.current_offset = 0;
                self.redraw();
            }

            self.last_scroll = self.current_scroll;
        },
        redraw : function() {
            var self = this;

            self.obj.css({
                "top" : self.default_offset + self.current_offset
            });

            if (self.ignored != undefined && self.ignored.length > 0) {
                var len = self.ignored.length;

                for (var i=0; i<len; i++) {
                    self.ignored[i].css({
                        "top" : self.default_offset - self.current_offset
                    });
                }
            }
        }
    });

    $.fn[ pluginName ] = function ( options ) {
        this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" + pluginName, new scrollSlacker( this, options ) );
            }
        });
        return this;
    };

})( jQuery, window, document );





// GRID





;(function ( $, window, document, undefined ) {

    var cells = new Array();

    function Grid_Cell(obj) {

        // General
        this.id = "node-" + Math.floor(Math.random() * 100000) + 1;
        this.obj_visual = obj;
        this.obj_model = undefined;
        this.obj_img = undefined;
        this.img_src = undefined;

        // Model
        this.title = undefined;
        this.keywords = undefined;

        // Animation
        this.hide_timeout = undefined;
        this.is_visible = false;

        // init
        this.init();
    }

    Grid_Cell.prototype = {
        init : function() {
            var self = this;

            self.obj_visual.attr('id', self.id);

            var model_wrap = $('#grid-model-wrap');
            model_wrap.prepend('<div class="grid-model-node" id="model-'+self.id+'"></div>');
            self.obj_model = model_wrap.find('#model-' + self.id);

            self.title = simplify_string(self.obj_visual.data('title'));
            self.keywords = simplify_string(self.obj_visual.data('keywords'));

            self.obj_img = self.obj_visual.find('img');
            self.img_src = self.obj_img.attr('src');
            self.obj_visual.find('img').remove();

            var html =  '<div class="node-3d-container">';
                html +=  '<div class="node-3d-block">';
                html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-1">';
                html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-2">';
                html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-3">';
                html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-4">';
                html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-5">';
                // html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-6">';
                // html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-7">';
                // html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-8">';
                // html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-9">';
                // html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-10">';
                // html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-11">';
                // html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-12">';
                // html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-13">';
                // html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-14">';
                // html += '<img src="'+self.img_src+'" class="node-3d-block-face node-3d-block-face-15">';
                html += '</div>';
                html += '</div>';

            self.obj_visual.find('a').append(html);
        },
        match : function(str) {
            var self = this;
            var str = str.split(" ");
            var str_count = str.length;
            var matches = 0;

            for (var i=0; i<str_count; i++) {
                if (self.title.search(str[i]) != -1 || self.keywords.search(str[i]) != -1) {
                    matches++;
                }
            }

            if (matches == str_count) {
                self.show();
            } else {
                self.hide();
            }
        },
        initial_show : function() {
            var self = this;

            self.current_x = self.obj_model.position().left;
            self.current_y = self.obj_model.position().top;

            self.show();
            self.redraw();
        },
        show : function() {
            var self = this;

            if (self.is_visible) return;

            clearTimeout(self.hide_timeout);

            self.is_visible = true;
            self.obj_model.show();
            self.obj_visual.toggleClass('visible');
            self.obj_visual.toggleClass('visible-3d');
        },
        hide : function() {
            var self = this;

            if (!this.is_visible) return;

            self.is_visible = false;
            self.obj_model.hide();
            self.obj_visual.toggleClass('visible-3d');

            clearTimeout(self.hide_timeout);

            self.hide_timeout = setTimeout(function() {
                self.obj_visual.toggleClass('visible');
            }, 400);
        },
        redraw : function() {
            var self = this;

            if (self.is_visible) {
                self.obj_visual.css({
                    left : self.obj_model.position().left,
                    top : self.obj_model.position().top
                });
            }
        }
    };

    $(document).ready(function() {
        // initialize grid
        $('.grid-node').each(function() {
            var cell = new Grid_Cell($(this));
            cells.push(cell);
        });

        // show cells
        var len = cells.length;
        for (var i=0; i<len; i++) {
            cells[i].initial_show();
        }

        // events
        $('#input-grid-search').on('keyup', function(e) {
            var len = cells.length;
            var val = simplify_string($(this).val());

            for (var i=0; i<len; i++) {
                cells[i].match(val);
            }

            for (var i=0; i<len; i++) {
                cells[i].redraw();
            }
        });
    });
})( jQuery, window, document );





function log(obj) { console.log(obj); }

function lerp(v0, v1, t) { return (1-t)*v0 + t*v1; }

function simplify_string(str) {
    var r = str;
    var regex = /[^(\w|\s)]/g;

    r = r.toLowerCase().trim().replace(regex, '');

    return r;
}

function timestamp() {
    if (!Date.now) {
        Date.now = function() { return new Date().getTime(); };
    } else {
        return Date.now();
    }
}
