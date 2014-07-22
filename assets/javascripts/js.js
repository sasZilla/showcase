(function(window, $, undefined) {
	var cache = {};

	var Utils = {
		tmpl: function(str, data) {
			// Figure out if we're getting a template, or if we need to
			// load the template - and be sure to cache the result.
			var fn = !/\W/.test(str) ?
			  cache[str] = cache[str] ||
			    this.tmpl(document.getElementById(str).innerHTML) :

			  // Generate a reusable function that will serve as a template
			  // generator (and which will be cached).
			  new Function("obj",
			    "var p=[],print=function(){p.push.apply(p,arguments);};" +

			    // Introduce the data as local variables using with(){}
			    "with(obj){p.push('" +

			    // Convert the template into pure JavaScript
			    str
			      .replace(/[\r\t\n]/g, " ")
			      .split("<%").join("\t")
			      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
			      .replace(/\t=(.*?)%>/g, "',$1,'")
			      .split("\t").join("');")
			      .split("%>").join("p.push('")
			      .split("\r").join("\\'")
			  + "');}return p.join('');");

			// Provide some basic currying to the user
			return data ? fn( data ) : fn;
		},

		dialog: function(str) {
			var struct = {
				__escKeyCode: 27,
				__modalSelector: '.modal',
				__shadowSelector: '.shadow',

				init: function(str) {
					this.$container = $('body');
					this.tmpl = str;

					this.create();
					this.bind();
				},

				bind: function() {
					this.$container.off('dblclick').on('dblclick', this.__modalSelector, struct.destroy);
					this.$container.off('keydown').on('keydown', function(ev) {
						if (ev.keyCode === struct.__escKeyCode) {
							struct.destroy();
						}
					});
				},
				create: function() {
					struct.$container.append(struct.tmpl);
					struct.$container.append('<div class="shadow"></div>');

					// next tick
					setTimeout(function() {
						$(struct.__shadowSelector).height( $(document).height() )
					}, 0);
				},
				destroy: function() {
					$(struct.__modalSelector).remove();
					$(struct.__shadowSelector).remove();
				}
			};

			return struct.init(str);
		}
	};


	var Catalog = {
		init: function( id ) {
			this.$self = $('#' + id);
			this.goodsTemplate = Utils.tmpl('goodsTmpl');
			this.fullDescTemplate = Utils.tmpl('fullDescTmpl');
			this.productImg = '.productThumb';

			this.getJson();
		},

		bind: function() {
			this.$self.on('click', this.productImg, this.show);
		},

		layout: function() {
			Catalog.$self.html( Catalog.goodsTemplate({goods: Catalog.__data}) );
		},

		show: function(ev) {
			var $target = $(ev.target);
				id = $target.closest('[data-id]').data('id');
				product = Catalog.__data.filter(function(el) {
					return el.id === id;
				})[0];

			if (typeof product !== "undefined") {
				Utils.dialog( Catalog.fullDescTemplate({product: product}) );
			}
		},

		getJson: function() {
			$.getJSON('server/goods.json', function(jsonData) {
				Catalog.__data = jsonData;

				Catalog.layout();
				Catalog.bind();
			});
		}
	};


$(document).ready(function() {
	Catalog.init('catalog');
});

})(window, jQuery);