/**
 * Created by Abhinit on 7/12/2015.
 */
;(function($){
    $.fn.html5jTabs = function(options){
        return this.each(function(index, value){
            var obj = $(this),
                objFirst = obj.eq(index),
                objNotFirst = obj.not(objFirst);

            $("#" +  objNotFirst.attr("data-toggle")).hide();
            $(this).eq(index).addClass("active");

            obj.click(function(evt){

                toggler = "#" + obj.attr("data-toggle");
                togglerRest = $(toggler).parent().find("span");

                togglerRest.hide().removeClass("active");
                $(toggler).show().addClass("active");

                $(this).parent("span").find("a").removeClass("active");
                $(this).addClass("active");
                return false;
            });
        });
    };
}(jQuery));
