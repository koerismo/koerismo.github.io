import './lib/jquery-3.6.0.min.js';

$('.subheader > span').on( 'click', function(){
	if (this.classList.contains('active')) { return }
	const category = this.innerText.toLowerCase();
	$('div.body, .subheader span').removeClass('active');
	$(`div.body.${category}`).addClass('active');
	this.classList.add('active');

	if (category in actions) {actions[category](this)}
});

// The image cache is used to recall the images' dimensions.
let environment_loaded = false;
let cached_images = {};

// These actions fire whenever the tab is selected.
const actions = {
	environment(){
		if (environment_loaded) { return }
		environment_loaded = true;
		
		Array.from($('div.body.environment div')).forEach((div)=>{
			const url = div.getAttribute('data-url');
			div.style.backgroundImage = `url(${url})`;
			if (url in cached_images) { return div.classList.add('loaded') } // Quick optimization for duplicate images
			cached_images[url] = new Image();
			cached_images[url].onload = () => {div.classList.add('loaded')}
			cached_images[url].src = url;
		});
	}
}

const viewer_bg = $('#viewer');
const viewer = viewer_bg.children()[0];

$('div.body.environment div').on( 'click', function(){

	// Ensure that the image has loaded
	if (!this.classList.contains('loaded')) { return }

	// Gather bounding info
	const url = this.getAttribute('data-url');
	const bbox = this.getBoundingClientRect();
	const img_width = cached_images[url].width,
		  img_height = cached_images[url].height;
	const max_img_dim = Math.max(img_width, img_height),
		  min_win_dim = Math.min( $(window).width(), $(window).height());

	// Apply initial transform
	viewer_bg.removeClass('hidden');
	viewer_bg.removeClass('active');
	viewer.style.left = bbox.x + 'px',
	viewer.style.top = bbox.y + 'px',
	viewer.style.width = bbox.width + 'px',
	viewer.style.height = bbox.height + 'px';

	// Apply target transform with a slight delay
	setTimeout(()=>{
		let width_new = img_width / max_img_dim * (min_win_dim-50);
		let height_new = img_height / max_img_dim * (min_win_dim-50);
		viewer_bg.addClass('active');
		viewer.style.backgroundImage = `url(${url})`;
		viewer.style.height = height_new + 'px';
		viewer.style.width = width_new + 'px';
		viewer.style.left = `calc(50vw - ${width_new/2}px)`;
		viewer.style.top = `calc(50vh - ${height_new/2}px)`;
	},10);
});

// Close viewer on click.
viewer_bg.on( 'click', function(e){
	viewer_bg.removeClass('active');
	viewer_bg.addClass('hidden');
});