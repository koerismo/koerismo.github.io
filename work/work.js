/* There is quite some jank going on here... Sorry, future me. */

const work_list = [
	{
		title:			'Programming',
		description:	'My programming work.',
		contents: [
			{
				name:			'BEE2.4 Model Compiler and Icon Renderer',
				short:			'BEE2.4 Model Compiler/Renderer',
				description:	'This command-line tool utilizes Python, PIL, and Blender to automatically convert, compile, and format models into a format readable by BEE2.4. Along with this, it renders an icon of the model in a style similar to the existing icons.',
				link:			'https://github.com/koerismo/bee-dev-shortcuts',
				language:		'python'
			},
			{
				name:			'Python Keyvalue Pair Container Class',
				short:			'Python K/V Class',
				description:	'A minimalistic library for Python 3 that implements a flexible keyvalue pair class, capable of forming nested KV structures.',
				link:			'https://github.com/koerismo/python-kv-pairs',
				language:		'python'
			},
			{
				name:			'BEEPKG - BEE2.4 Package Generator',
				short:			'BEE2.4 Package Generator',
				description:	'A webapp capable of generating files readable by BEE2.4 based off of user input. Utilizes quite a large amount of data manipulation, including the automatic conversion of PNGs to RGBA8888 VTFs.',
				link:			'https://koerismo.github.io/BeePKG-V2/',
				language:		'javascript'
			},
			{
				name:			'Wave Looping Tool',
				short:			'Looping Wave Tool',
				description:	'A webapp that can modify/create looping points in .WAV files, primarily for use in the source engine.<br><br>Note that this tool is a tad buggy in previewing the looped sound.',
				link:			'https://koerismo.github.io/wav-loop-editor/',
				language:		'javascript'
			}
		]
	},
	{
		title: 'Mapping/Modeling',
		description: 'My 3d works, primarily in Source and Blender.',
		contents: [
			{
				name:			'Blacklight (Portal 2)',
				short:			'Blacklight',
				description:	'Blacklight is a small two-puzzle map designed for Valve\'s Portal 2.<br><br>The puzzle centers around the ability to enable/disable a secondary mode in which some objects are made visible/invisible.',
				link:			'https://steamcommunity.com/sharedfiles/filedetails/?id=2463375496',
				language:		'source'
			},
			{
				name:			'Trios (Portal 2)',
				short:			'Trios',
				description:	'Trios is a recreation of an older puzzle centered around lasers.',
				link:			'https://steamcommunity.com/sharedfiles/filedetails/?id=2542305924',
				language:		'source'
			}
		]
	}
]

const cardholder_el = document.querySelector('#cardholder')

function convertProject(jsonEntry,catInd,ind) {
	let newEl = document.createElement('DIV')
	newEl.classList.add('horizontal','padding-med',`tag-${jsonEntry.language}`)
	newEl.innerHTML = `<span class="project-title">${jsonEntry.short}</span><span class="project-tag">${jsonEntry.language}</span>`
	newEl.onclick = ()=>{showProjectInfo(catInd,ind,newEl)}
	return newEl
}

function addAllProjects() {
	work_list.forEach((section,sectionInd)=>{
		let header_el = document.createElement('DIV')
		header_el.innerHTML = `<div class="margin-med"><h2>${section.title}</h2>${section.description}</div>`
		header_el.classList.add('vertical')
		cardholder_el.appendChild(header_el)

		let body_el = document.createElement('DIV')
		body_el.classList.add('projects','divide','vertical','padding-none')
		section.contents.forEach((project,projectInd)=>{
			body_el.appendChild(convertProject(project,sectionInd,projectInd))
		})
		cardholder_el.appendChild(body_el)
	})
}

addAllProjects()


function showProjectInfo(catInd,ind,self) {
	const categoryEntry = work_list[Object.keys(work_list)[catInd]]
	const projectEntry = categoryEntry.contents[ind]
	const compStyle = getComputedStyle(self).getPropertyValue('--tag-bg');
	showOverlay(`
		<h2>${projectEntry.name}</h2>
		<p>${projectEntry.description}</p>
		<div class="horizontal" style="margin-top:10px;">
		<a class="padding-none margin-none" href="${projectEntry.link||"#"}" ${projectEntry.link ? "" : "hidden=\"\""}"><button class="margin-none">View</button></a>
		<div class="stretch"></div>
		<button class="margin-none" onclick="setOverlayActiveState(false)">Done</button>
		</div>
	`,400,`4px solid ${compStyle}`)
}
