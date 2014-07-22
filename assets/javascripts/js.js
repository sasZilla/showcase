(function(window, $, undefined) {
	var cache = {};

	var Utils = {
		ajax: function(url, callback) {
			var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = url + '?callback=parseData';

			document.body.appendChild(script);
		},

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

					setTimeout(function() {
						$(struct.__shadowSelector).height( $(document).height() )
					}, 10);
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
			this.layout();
			this.bind();
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

			if (typeof product !== " undefined") {
				Utils.dialog( Catalog.fullDescTemplate({product: product}) );
			}
		},

		getJson: function() {
			Catalog.__data = [
								{
									"id": 1,
									"name": "Бинокль Veber WP UC (Ultra Compact) 10x42",
									"descrSmall": "бинокль Veber WP UC 10x42",
									"descLarge": "Бинокль Veber UC 10x42 WP – компактный надежный бинокль на основе призм порро. Стеклянная оптика имеет многослойное просветление, что обеспечивает яркость и насыщенность изображения. Бинокль имеет близкую точку фокусировки (около 2х метров), что позволит рассмотреть детали объектов, находящихся довольно близко, в то же время, увеличения в 10 крат позволят увидеть и те объекты, которые находятся на значительном удалении.",
									"imgThumb": "img/1_thumb.jpg",
									"imgLarge": "img/1_large.jpg"
								},
								{
									"id": 2,
									"name": "Бинокль Veber WP UC (Ultra Compact) 10x42",
									"descrSmall": "бинокль Veber WP UC 10x42",
									"descLarge": "Бинокль Veber UC 10x42 WP – компактный надежный бинокль на основе призм порро. Стеклянная оптика имеет многослойное просветление, что обеспечивает яркость и насыщенность изображения. Бинокль имеет близкую точку фокусировки (около 2х метров), что позволит рассмотреть детали объектов, находящихся довольно близко, в то же время, увеличения в 10 крат позволят увидеть и те объекты, которые находятся на значительном удалении.",
									"imgThumb": "img/2_thumb.jpg",
									"imgLarge": "img/2_large.jpg"
								},
								{
									"id": 3,
									"name": "Бинокль Veber WP UC (Ultra Compact) 10x42",
									"descrSmall": "бинокль Veber WP UC 10x42",
									"descLarge": "Бинокль Veber UC 10x42 WP – компактный надежный бинокль на основе призм порро. Стеклянная оптика имеет многослойное просветление, что обеспечивает яркость и насыщенность изображения. Бинокль имеет близкую точку фокусировки (около 2х метров), что позволит рассмотреть детали объектов, находящихся довольно близко, в то же время, увеличения в 10 крат позволят увидеть и те объекты, которые находятся на значительном удалении.",
									"imgThumb": "img/3_thumb.jpg",
									"imgLarge": "img/3_large.jpg"
								},
								{
									"id": 4,
									"name": "Бинокль Veber WP UC (Ultra Compact) 10x42",
									"descrSmall": "бинокль Veber WP UC 10x42",
									"descLarge": "Бинокль Veber UC 10x42 WP – компактный надежный бинокль на основе призм порро. Стеклянная оптика имеет многослойное просветление, что обеспечивает яркость и насыщенность изображения. Бинокль имеет близкую точку фокусировки (около 2х метров), что позволит рассмотреть детали объектов, находящихся довольно близко, в то же время, увеличения в 10 крат позволят увидеть и те объекты, которые находятся на значительном удалении.",
									"imgThumb": "img/4_thumb.jpg",
									"imgLarge": "img/4_large.jpg"
								},
								{
									"id": 5,
									"name": "Бинокль Veber WP UC (Ultra Compact) 10x42",
									"descrSmall": "бинокль Veber WP UC 10x42",
									"descLarge": "Бинокль Veber UC 10x42 WP – компактный надежный бинокль на основе призм порро. Стеклянная оптика имеет многослойное просветление, что обеспечивает яркость и насыщенность изображения. Бинокль имеет близкую точку фокусировки (около 2х метров), что позволит рассмотреть детали объектов, находящихся довольно близко, в то же время, увеличения в 10 крат позволят увидеть и те объекты, которые находятся на значительном удалении.",
									"imgThumb": "img/5_thumb.jpg",
									"imgLarge": "img/5_large.jpg"
								}
							];
		}
	};


$(document).ready(function() {
	Catalog.init('catalog');
});

})(window, jQuery);