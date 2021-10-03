/* Buttons */

/* https://stackoverflow.com/a/7758191 */
$.easing.easeOutCubic = function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
}

$('#splash ul li').on('click',function(){
	const pos = $(this.getAttribute('data-scroll-target')).position().top;
	$('html').animate({ scrollTop: pos + 'px' }, { easing: 'easeOutCubic', duration: 800 });
})

$('#splash #splash-continue').on('click', function(){
	$('html').animate({ scrollTop: (window.scrollY+400) + 'px' }, { easing: 'easeOutCubic', duration: 600 });
})

/* Scroll tracking things */

const sc = new ScrollTracker();

const splash_img = $('#splash img')[0]
sc.addListener({
	'begin': {
		'element': '#splash',
		'position': 0,
		'screen-position': 'top'
	},
	'end': {
		'element': '#splash',
		'position': 1,
		'screen-position':'top'
	},
	'type':		'position',
	'callback': (pos)=>{
		splash_img.style.top = (pos*30 - 0) + 'vh';
		splash_img.style.opacity = 1 - Math.max(pos-0.5,0) * 2;
		// Maybe this is a bit too graphics-intensive
		// splash_img.style.filter = `blur(${Math.max(pos-0.5,0)*20}px)`;
	}
})

const splash_shortcuts = $('#splash ul');
sc.addListener({
	'begin': {
		'element': '#splash',
		'position': 0,
		'screen-position': 'top'
	},
	'end': {
		'element': '#splash',
		'position': 0.55,
		'screen-position': 'top'
	},
	'type':		'event',
	'callback': (pos)=>{
		if (pos == 'enter') {splash_shortcuts.removeClass('mini')}
		else { splash_shortcuts.addClass('mini') }
	}
})

/* Carousel + Vue */

Vue.createApp({
	data() {
		return {work: [
				{
					'title': 'BeePKG v2.0',
					'subtitle': 'A web-based package creation tool.',
					'image': 'https://www.dl.dropboxusercontent.com/s/6707of6nwwx3ab4/no_icon.png',
					'link': 'https://github.com/koerismo/BeePKG-V2'
				},
				{
					'title': 'vtf.js',
					'subtitle': 'A pure JS image to VTF converter.',
					'image': 'https://www.dl.dropboxusercontent.com/s/6707of6nwwx3ab4/no_icon.png',
					'link': 'https://github.com/koerismo/vtf.js'
				},
				{
					'title': 'wav.js',
					'subtitle': 'A pure JS wav data parser.',
					'image': 'https://www.dl.dropboxusercontent.com/s/6707of6nwwx3ab4/no_icon.png',
					'link': 'https://github.com/koerismo/wav.js/blob/main/wav.js'
				},
				{
					'title': 'KV.py',
					'subtitle': 'A flexible python k/v structure container.',
					'image': 'https://www.dl.dropboxusercontent.com/s/6707of6nwwx3ab4/no_icon.png',
					'link': 'https://github.com/koerismo/python-kv-pairs'
				}/*,
				{
					'title': 'ScrollTracker.js',
					'subtitle': 'A low-level scroll event catcher.',
					'image': 'https://www.dl.dropboxusercontent.com/s/6707of6nwwx3ab4/no_icon.png',
					'link': '#'
				}*/
		]}
	}
}).mount('#work-carousel');

$('#work-carousel').slick({
	infinite: true,
	slidesToShow: 3,
	dots: true
});