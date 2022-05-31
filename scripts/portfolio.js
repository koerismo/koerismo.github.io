import './lib/jquery-3.6.0.min.js';


/* ------------------ BASE LOADER LOGIC ------------------ */


$('.subheader > span').on( 'click', function(){
	if (this.classList.contains('active')) { return }
	const category = this.innerText.toLowerCase();
	$('div.body, .subheader span').removeClass('active');
	$(`div.body.${category}`).addClass('active');
	this.classList.add('active');

	if (category in actions) {actions[category](this)}
});


// These actions fire whenever the tab is selected.
const actions = {
	environment: load_environment
}


/* ------------------ ENVIRONMENTS PAGE ------------------ */


function get_browser() {
	const match = window.navigator.userAgent.match(/\w+\/[\d\.]+$/g);
	const [agent, version] = match[0].split('/');
	return agent;
}

// The image cache is used to recall the images' dimensions.
let environment_loaded = false;
let cached_images = {};

function load_environment() {
	if (environment_loaded) { return }
	environment_loaded = true;
	
	Array.from($('div.body.environment div')).forEach((div)=>{
		const url = div.getAttribute('data-url');
		const img = new Image();
		cached_images[url] = {
			width: 0, height: 0
		};
		img.onload = () => {
			cached_images[url].width = img.width;
			cached_images[url].height = img.height;
			div.classList.add('loaded')
		}
		img.src = url;
		div.appendChild(img);
	});
}

const viewer_bg = $('#image-viewer');
const viewer = viewer_bg.children()[0];

$('div.body.environment div').on( 'click', function(){

	// Ensure that the image has loaded
	if (!this.classList.contains('loaded')) { return }

	// Gather bounding info
	const url = this.getAttribute('data-url');
	const bbox = this.getBoundingClientRect();
	const img_width = cached_images[url].width,
		  img_height = cached_images[url].height;
	const max_img_dim = Math.max( img_width, img_height ),
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
		const width_new = img_width / max_img_dim * (min_win_dim-50);
		const height_new = img_height / max_img_dim * (min_win_dim-50);
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


/* ------------------ AUDIO PAGE ------------------ */


// Just a warning, this part is where the code gets *bad*.

const audiop_el = $('div#audio-player'),
	  audiop_input_el = $('div#audio-player input')[0],
	  audiop_title_el = $('div#audio-player span#song-title')[0],
	  audiop_position_el = $('div#audio-player span#song-position')[0],
	  audiop_duration_el = $('div#audio-player span#song-duration')[0];


let audio_currently_selected = null;	// Element
let audio_currently_playing = null;		// URL
let audio_last_playing = null;			// URL
let audio_players = {};					// dict{ URL: Audio, }

function audio_stop_playing() {
	audiop_el.removeClass('active');
	if (audio_currently_playing === null) { return }
	audio_players[audio_currently_playing].onload = function(){ this.stop() }
	audio_players[audio_currently_playing].pause();
	audio_last_playing = audio_currently_playing;
	audio_currently_playing = null;
}

function audio_begin_playing( url ) {
	if (audio_currently_playing !== null) { audio_stop_playing() }

	audio_currently_playing = url;
	if (url in audio_players) {
		initialize_audio_interface();
		if (audio_last_playing !== url) { audio_players[url].currentTime = 0 }
		return audio_players[url].play();
	}

	audio_players[url] = new Audio();
	audio_players[url].onplay = () => {
		// This is to handle the user pressing the keyboard pause button.
		if (audio_currently_playing === null) {
			audio_currently_selected.classList.add('active');
			audio_currently_playing = url;
		}
		initialize_audio_interface();
		audiop_el.addClass('active');
	}
	audio_players[url].onerror = () => { audio_currently_selected.classList.add('error'); audio_currently_selected.classList.remove('active'); }
	audio_players[url].onpause = () => { audiop_el.removeClass('active'); }
	audio_players[url].autoplay = true;
	audio_players[url].src = url;
}

// Format second timestamps to MM:SS for use in the audio player.
// shit perf, could probably do this manually with math
const time_format_mmss = new Intl.DateTimeFormat('EN-US', {minute: 'numeric', second: 'numeric'});
function format_mmss( seconds ) { return time_format_mmss.format( seconds*1000 ) }

function initialize_audio_interface() {
	audio_players[audio_currently_playing].onended = () => {
		audio_last_playing = null;
		audio_currently_playing = null;
		audiop_el.removeClass('active');
		audio_currently_selected.classList.remove('active');
	}

	audiop_input_el.oninput = () => {
		audio_players[audio_currently_playing].currentTime = audiop_input_el.value;
	}

	const duration = audio_players[audio_currently_playing].duration;
	audiop_input_el.max = duration;
	audiop_duration_el.innerText = format_mmss(duration);
	update_audio_interface_interval();
}

function update_audio_interface_interval() {
	if (audio_currently_playing === null) { return }
	audiop_input_el.value = audio_players[audio_currently_playing].currentTime;
	audiop_position_el.innerText = format_mmss(audio_players[audio_currently_playing].currentTime);
	setTimeout( update_audio_interface_interval, 50 );
}

// Initialize tracks for viewing.
Array.from($('div.body.audio > div')).forEach( div => {
	const title_span = document.createElement('span');
	title_span.innerText = div.getAttribute('data-title').replaceAll('\\n','\n');
	div.appendChild( title_span );

	const audio_btn = document.createElement('a');
	div.appendChild( audio_btn );
});

// Register listeners for tracm play event.
$('div.body.audio > div').on( 'click', function(){
	if (this.classList.contains('error')) {return}
	const isPlaying = this.classList.contains('active');
	$('div.body.audio > div').removeClass('active');
	if (isPlaying) { return audio_stop_playing() }
	audio_currently_selected = this;
	this.classList.add('active');
	audiop_title_el.innerText = this.getAttribute('data-title');
	audio_begin_playing( this.getAttribute('data-url') );
});