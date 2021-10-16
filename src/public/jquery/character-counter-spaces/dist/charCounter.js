//character counter for jQuery
$.fn.charCounter = function(options) {

    var settings = $.extend({
        customClass: '',
        divider: 'slash',
        fontSize: '1rem'
    }, options);

    var divider = " / ";

    if (settings.divider === "dash") {
        divider = " - ";
    } else if (settings.divider === "bar") {
        divider = " | ";
    }

    var input = this;

    var maxlength = $(input).attr("maxlength");

    if (maxlength === undefined || maxlength === "") {
        console.error(`jQuery Character Counter. The "maxlength" attribute of "#${input.attr('id')}" should be set.`);
    } else {
        $(`<p class='${settings.customClass}' style="font-size:${settings.fontSize}">0${divider}` + maxlength + `</p>`).insertAfter(input);

        var counter = $(input).next();

        function count_chars() {
            var txt = $(input).val();
            $(counter).text(txt.length + divider + maxlength);
        }

        count_chars();

        $(input).keyup(function() {
            count_chars();
        });

        $(input).keydown(function() {
            count_chars();
        });

        $(input).change(function() {
            count_chars();
        });

        return this;
    }

};