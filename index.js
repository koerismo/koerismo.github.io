function setOverlayActiveState(x) {
	if (x)
		document.querySelector('#disc-overlay').classList.add('overlay-active')
	else
		document.querySelector('#disc-overlay').classList.remove('overlay-active')
}

const overlay = document.querySelector('#disc-overlay')

function showOverlay(iHTML,width=350,color='var(--border-dark)') {
	overlay.children[0].style.borderTop = color
	overlay.children[0].innerHTML = iHTML
	overlay.children[0].style.width = `min(calc(100vw - 40px), ${width}px)`
	overlay.classList.add('overlay-active')
}

/* Preset Overlays */

const preset_overlays = {
	'discord':		`<h3>Discord Tag</h3>
					<span class="code">Baguettery#5797</span><br>
					<div class="horizontal" style="margin-top:10px;">
						<div class="stretch"></div>
						<button class="margin-none" onclick="setOverlayActiveState(false)">Done</button>
					</div>`,
}

function showOverlayDiscord() {showOverlay([preset_overlays['discord']])}