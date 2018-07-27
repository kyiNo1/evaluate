/**
 * Created by Administrator on 2018/7/27.
 */

//为了不暴露太多全局变量，用立即执行函数
//var rating =
(function(){
    //策略
    var strategies = {
        entire: function(){
            return 1;
        },
        half: function(){
            return 2;
        },
        quarter: function() {
            return 4;
        }
    };

    //用面向对象的方法，首先，创建构造函数
    var Rating = function (el,options){
        //把参数转化成属性 以便调用
        this.$el = $(el);
        this.opts = $.extend({},Rating.DEFAULTS,options);

        if(!strategies[this.opts.mode]){
            this.ratio = strategies['entire']();
        }else {
            this.ratio = strategies[this.opts.mode]();
        }
        // 评分
        this.opts.total *= this.ratio;
        this.opts.num   *= this.ratio ;
        this.itemWidth = 32 / this.ratio ;
        this.displayWidth = this.opts.num * this.itemWidth;
    };

    Rating.DEFAULTS = {
        mode: 'entire',
        total: 5,
        num:0,
        readOnly: false,
        select:function(){},
        chosen:function(){},
    };
    //在初始化方法中定义算法结构
    Rating.prototype.init = function(){
        this.buildHTML();
        this.setCSS();
        if(!this.opts.readOnly){
            this.bindEvent();
        }
    };
    Rating.prototype.buildHTML = function(){
        var html = '';
            html += '<div class="rating-display"></div><ul class="rating-mask">';
            for(var i = 0; i < this.opts.total; i++){
                html +=  '<li class="rating-item"></li>';
            };
            html += '</ul>';
        this.$el.html(html);
    };
    Rating.prototype.setCSS = function(){
        this.$el.width(this.opts.total * this.itemWidth);
        this.$display = this.$el.find('.rating-display');
        this.$display.width(this.displayWidth);
        this.$el.find('.rating-item').width(this.itemWidth);
    };
    Rating.prototype.bindEvent = function(){
        var self = this;
        //事件委托

        this.$el.on('mouseover','.rating-item',function(){
            var count = $(this).index() + 1;
            self.$display.width(count * self.itemWidth);
            (typeof self.opts.select === 'function') && self.opts.select.call(this,count,self.opts.total);
            self.$el.trigger('select',[count,self.opts.total]);
        }).on('click','.rating-item',function(){
            var count = $(this).index() + 1;
            self.displayWidth = count * self.itemWidth;

            (typeof self.opts.chosen === 'function') && self.opts.chosen.call(this,count,self.opts.total);
            self.$el.trigger('chosen',[count,self.opts.total]);
        }).on('mouseout',function(){
            self.$display.width(self.displayWidth);
        })
    };
    Rating.prototype.unbindEvent = function(){
        this.$el.off();
    };

        // 初始化方法
     var init = function(el,option){
         var $el = $(el),
             rating = $el.data('rating');
         if(!rating) {
             $el.data('rating', (rating = new Rating(el,typeof option === 'object' && option)))
             rating.init();
         }
         if(typeof option === 'string')rating[option]();
     };
    // jq 插件
    $.fn.extend({
        rating:function(option){
            // 这里的this 指的是调用 rating这个方法的 元素。
            // 因为这里将方法添加到了 jq 插件， 所以调用的方法应该是 $('#el').rating({});
            // 所以this 就相当于 el 一开始没反应过来
            console.log('ddd');
            console.log(this);
            return this.each(function(){
                console.log('ddd');
                init(this,option);
            })
        }
    })
    //return {
    //    init: init
    //};
})();
   ////外部调用
   //rating.init('#rating',{
   //    mode: 'entire',
   //    total:7,
   //    num: 3,
   //    readOnly: true,
   //    //select:function(count,total){
   //    //    console.log(this);
   //    //    console.log(count);
   //    //    console.log(total);
   //    //},
   //    chosen:function(count,total){
   //        console.log(this);
   //        console.log(count);
   //        console.log(total);
   //    },
   //    //点击之后再变成只读
   //});

