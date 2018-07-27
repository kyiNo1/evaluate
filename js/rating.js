/**
 * Created by Administrator on 2018/7/27.
 */

//Ϊ�˲���¶̫��ȫ�ֱ�����������ִ�к���
//var rating =
(function(){
    //����
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

    //���������ķ��������ȣ��������캯��
    var Rating = function (el,options){
        //�Ѳ���ת�������� �Ա����
        this.$el = $(el);
        this.opts = $.extend({},Rating.DEFAULTS,options);

        if(!strategies[this.opts.mode]){
            this.ratio = strategies['entire']();
        }else {
            this.ratio = strategies[this.opts.mode]();
        }
        // ����
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
    //�ڳ�ʼ�������ж����㷨�ṹ
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
        //�¼�ί��

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

        // ��ʼ������
     var init = function(el,option){
         var $el = $(el),
             rating = $el.data('rating');
         if(!rating) {
             $el.data('rating', (rating = new Rating(el,typeof option === 'object' && option)))
             rating.init();
         }
         if(typeof option === 'string')rating[option]();
     };
    // jq ���
    $.fn.extend({
        rating:function(option){
            // �����this ָ���ǵ��� rating��������� Ԫ�ء�
            // ��Ϊ���ｫ������ӵ��� jq ����� ���Ե��õķ���Ӧ���� $('#el').rating({});
            // ����this ���൱�� el һ��ʼû��Ӧ����
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
   ////�ⲿ����
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
   //    //���֮���ٱ��ֻ��
   //});

