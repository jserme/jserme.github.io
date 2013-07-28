(function($) {//{{{
	$.cookie = function(key, value, options) {

		// key and at least value given, set cookie...
		if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
			options = $.extend({}, options);

			if (value === null || value === undefined) {
				options.expires = - 1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires,
				t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = String(value);

			return (document.cookie = [
			encodeURIComponent(key), '=', options.raw ? value: encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
			options.path ? '; path=' + options.path: '', options.domain ? '; domain=' + options.domain: '', options.secure ? '; secure': ''].join(''));
		}

		// key and possibly options given, get cookie...
		options = value || {};
		var decode = options.raw ? function(s) {
			return s;
		}: decodeURIComponent;

		var pairs = document.cookie.split('; ');
		for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
			if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
		}
		return null;
	};
})(jQuery);//}}}
(function() {
	var tpls = {
		comment: '\
             <div class="reply" >\
                 <img class="reply-avatar" src="${avatarUrl}" />\
                 <div class="reply-wrapper">\
                     <div class="reply-arrow"></div>\
                     <div class="reply-inner">\
                         <div class="reply-header">\
                             <h3>\
                                ${nickname} \
                             </h3>\
                             <span>${prettyTime}</span>\
                         </div>\
                         <p>${content}</p>\
                     </div>\
                 </div>\
             </div>',

		msg: '<div class="msg-global">${msg}</div>'
	};

    var msgEl = null;
	function msg(str, time, callback) {
        if(!msgEl) {
            msgEl = $($.tmpl(tpls.msg, { msg: str })); 
            msgEl.appendTo(document.body);
        } else {
            msgEl.html(str);
        }

		msgEl.css({
			display: 'none',
			top: $(document.body).scrollTop() + $(window).height()*0.23,
			left: ($(document.body).width() - msgEl.width()) / 2
		}).slideDown();

		setTimeout(function() {
			msgEl.slideUp();
		}, 3000);

		if (time > 0) {
			setTimeout(callback, time);
		}

	}

    var mailReg =/^([\!#\$%&'\*\+/\=?\^`\{\|\}~a-zA-Z0-9_-]+[\.]?)+[\!#\$%&'\*\+/\=?\^`\{\|\}~a-zA-Z0-9_-]+@{1}((([0-9A-Za-z_-]+)([\.]{1}[0-9A-Za-z_-]+)*\.{1}([A-Za-z]){1,6})|(([0-9]{1,3}[\.]{1}){3}([0-9]{1,3}){1}))$/;

	$('#content-reply').submit(function(evt) {
		if ( !mailReg.test($.trim($('.content-reply form  input[name=mail]').val()) ) ) {
			msg('请输入正确的邮件哦 :)');
			return false;
		}

		if ( $.trim($('.content-reply form input[name=nickname]').val()) == '' ) {
			msg('大名不能为空 :)');
			return false;
		}

		if ( $.trim($('.content-reply form textarea').val()) == '') {
			msg('请输入回复内容 :)');
			return false;
		}

		var that = this;

		$.ajax(this.action, {
			type: 'post',
			data: $(this).serialize(),
			success: function(d) {
				if (d.code) {
					msg(d.msg);
				} else {
					msg(d.msg);

					var floor = $('.reply-list div.article').length;
					d.reply.floor = floor + 1;
					$( $.tmpl(tpls.comment, d.reply ) ).appendTo('.reply-list');
					$('.content-reply form textarea').val('');

                    $.cookie('mail', d.reply.mail );
                    $.cookie('nickname', d.reply.nickname );
				}
			}
		});
		return false;
	});

    $('ul.replay-selector li').on('click', function(){
        $('ul.replay-selector li.active').removeClass('active');
        $(this).addClass('active');

        $('.tabs').hide();
        $('#' + this.id + '-box').slideDown( function(){
           window.scrollTo(0, Math.max( $(document.body).height(), $(window).height())); 
        });
    });
})();
