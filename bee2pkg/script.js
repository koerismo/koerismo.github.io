/*'"Name" "'+$('#package_name').value+'"\n'+
'"Desc" "'+$('#package_desc').value+'"\n'+
'"ID" "'+$('#package_name').value+'"\n'
music.map(function(x,i){})*/

//For each empty resource dropdown, fill it with an empty option
[].slice.call(gea(document,'.rsrc')).forEach(function(x){
		x.innerHTML = ''
})

var allResources
updateResources()

var default_style_attr = JSON.parse("[\"False\",\"False\",\"False\",\"False\",\"False\",\"False\",\"0.15\",\"\",\"\",\"\",\"True\",\"False\",\"8\",\"128\",\"False\",\"'World.a3JumpIntroRotatingPanelTravel'\",\"'World.a3JumpIntroRotatingPanelArrive'\",\"\",\"'BEE2_STATIC_PAN_FLAT'\",\"'BEE2_STATIC_PAN_ANGLED'\",\"'BEE2_STATIC_PAN_ANGLED'\",\"\",\"'model_arms,panel_attach'\",\"'custom'\",\"'custom'\",\"'Portal.room1_TickTock'\",\"\",\"\",\"32\",\"\",\"0.0\",\"3\",\"1.0\",\"\",\"\",\"'PACK_PLAYER_CLIP_GLASS'\",\"'PACK_PLAYER_CLIP_GRATE'\",\"'BEE2_GLASS_TEMPLATE'\",\"'BEE2_GRATING_TEMPLATE'\",\"\",\"\",\"2\",\"32.0\",\"160.0\",\"False\",\"4\",\"2\",\"6\",\"False\",\"False\",\"'instances/bee2/global_pti_ents.vmf'\",\"-2400 -2800 0\",\"-2400 -2800 -256\",\"-2400 0 0\",\"\",\"'620'\",\"\",\"0\",\"False\",\"'sky_black'\",\"'RAND'\",\"\",\"\",\"'<NONE>'\",\"\",\"\",\"\",\"0.0\",\"0 0 0\",\"0.0\",\"0.0\",\"\",\"False\"]")

function updateDefault(e) {
	gea(e.parentNode,'.style_attr_value')[0].placeholder = default_style_attr[e.selectedIndex]
}

var zip = new JSZip();

function generate() { // this function creates the necessary files while also parsing out the info.txt file

var imageCount = 0
var imageGoal = [].slice.call(ge(document,'#items').children).filter(function(x){return !x.classList.contains('copysource')}).length*3+1

// we need to count the images loaded, and on the last image loaded and added to the zip, zip the file.
readFile(ge(document,'#package_icon').files[0],function(x){
	makeFile('icon.png',x)
	imageCount++
	if (imageCount >= imageGoal) {
		imageCount = 0
		saveTheFuckinZip()
	}
})

let infoTxt = `"ID" "`+ge(document,'#package_name').value.split(' ').join('_').toUpperCase()+`"
"Name" "`+ge(document,'#package_name').value+`"
"Desc" "`+ge(document,'#package_desc').value+`"
`+[].slice.call(ge(document,'#items').children).filter(function(x){return !x.classList.contains('copysource')}).map(function(x){
	let itemname = ge(x,'.item_name').value
	let itemid = itemname.split(' ').join('_')
	//let itemicon = ge(x,'.item_bee_icon').value.split('.')
	//itemicon.pop()
	//itemicon.join('.')
	// save the item icon
	if (allResources[ge(x,'.item_bee_icon').selectedIndex][1]) {
		readFile(allResources[ge(x,'.item_bee_icon').selectedIndex][2],function(z){
			makeFile('resources/BEE2/items/all_items/'+itemid.toLowerCase()+'.png',z)
			imageCount++
			if (imageCount >= imageGoal) {
				imageCount = 0
				saveTheFuckinZip()
			}
		})
	} else {
		imageCount++
		if (imageCount >= imageGoal) {
			imageCount = 0
			saveTheFuckinZip()
		}
	}
	if (allResources[ge(x,'.item_pmaker_icon').selectedIndex][1]) {
		readFile(allResources[ge(x,'.item_pmaker_icon').selectedIndex][2],function(z){
			makeFile('resources/materials/models/props_map_editor/palette/all_items/'+itemid.toLowerCase()+'.vtf',z)
			imageCount++
			if (imageCount >= imageGoal) {
				imageCount = 0
				saveTheFuckinZip()
			}
		})
	} else {
		imageCount++
		if (imageCount >= imageGoal) {
			imageCount = 0
			saveTheFuckinZip()
		}
	}

	// icon root directory is /resources/BEE2/items/
	let propertiesTxt = `"Properties"
	{
		"Authors" "TEMPORARY"
		"Tags" "TEMPORARY"
		"Description"
		{
		`+ '"" '+ge(x,'.item_desc').value.split('\n').join('"\n"" "')+'"' +`
		}
		"infoURL" ""
		"ent_count" "1"
		"Icon"
		{
			"0" "all_items/`+itemid.toLowerCase()+`.png"
		}
	}
	`
	/*makeFile('resources/BEE2/items/all_items/'+itemid.toLowerCase()+'.png')*/
	let editoritemsTxt = `"Item"
	{
		"Type"			 "ITEM_`+itemid.toUpperCase()+`"
		"Editor"
		{
			"SubType"
			{
				"Name"		"`+itemname+`"
				"Model"
				{
					"ModelName"		"`+ge(x,'.item_pmaker_model').value+`"
					"TextureName"		"`+ge(x,'.item_pmaker_model_texture').value+`"
				}
				"Palette"
				{
					"Tooltip"	"`+itemname+`"
					"Image"		"palette/all_items/`+itemid.toLowerCase()+`.png"
					"Position"	"3 4 0"
				}
				"Sounds"
				{
					"SOUND_CREATED"					"P2Editor.PlaceOther"
					"SOUND_EDITING_ACTIVATE"		"P2Editor.ExpandOther"
					"SOUND_EDITING_DEACTIVATE"		"P2Editor.CollapseOther"
					"SOUND_DELETED"					"P2Editor.RemoveOther"
				}
			}
			"MovementHandle"		"`+['HANDLE_NONE','HANDLE_4_DIRECTIONS'][ge(x,'.item_handles').checked]+`"
			"InvalidSurface"		"`+'FLOOR '.repeat(!ge(x,'.item_surface_floor').checked)+'CEILING '.repeat(!ge(x,'.item_surface_ceil').checked)+'WALL '.repeat(!ge(x,'.item_surface_wall').checked)+`"
		}
		"Exporting"
		{
			"Instances"
			{
				"0"
				{
					"Name"				"instances/BEE2/clean/items/skybox_area_128x128_1.vmf"
				}
			}

			"TargetName"		"or"
			"Offset"		"64 64 64"
			"OccupiedVoxels"
			{
				"Voxel"
				{
					"Pos"		"0 0 0"
					"Surface"
					{
						"Normal"	"0 0 1"
					}
				}
			}
			"EmbeddedVoxels"
			{
				"Volume"
				{
					"Pos1"		"1 -1 0"
					"Pos2"		"-1 1 -1"
				}
			}
		}
	}`
	makeFile('items/'+itemid.toLowerCase()+'/'+'properties.txt',propertiesTxt)
	makeFile('items/'+itemid.toLowerCase()+'/'+'editoritems.txt',editoritemsTxt)
	return `"Item"
    {
    "ID" "ITEM_`+itemid.toUpperCase()+`"
    "AllDescLast" "0"
    "needsUnlock" "0"
    
    "Version"
        {
        "ID"   "VER_DEFAULT"
        "Name" "Regular"
        "Styles"
        {
            "ANY_STYLE" "`+itemid.toLowerCase()+`"
            }
        }
    }`
	})

makeFile('info.txt',infoTxt)

}

function saveTheFuckinZip() {
	zip.generateAsync({type:"blob"})
	.then(function(content) {
		// see FileSaver.js
		saveAs(content, ge(document,'#package_name').value.toLowerCase()+".zip");
	});
}

function ge(a,b) {
	return a.querySelector(b)
}

function gea(a,b) {
	return a.querySelectorAll(b)
}

function makeFile(file,contents	) {
	zip.file(file, contents);
}

function updateResourceType(e) {
	ge(e.parentNode,'.resource_file').type = ['text','file'][e.selectedIndex]
}

function addResource(e) {
	makeCopy('#resources .copysource')
	updateResources()
}

function updateResources() { // At the moment, this also selects the copysource. NEED TO FIX INPUT SELECTOR
	allResources = [].slice.call( gea(document,'#resources input') ).filter( function(x){return !x.classList.contains('copysource')} ).map(function(x){
		if (x.type == 'text') {return [x.value,0]}
		return [x.files[0].name,1,x.files[0]]
	});

	[].slice.call(gea(document,'.rsrc') ).forEach(function(x){
		let tempInd = x.selectedIndex
		x.innerHTML = allResources.map(function(y){return '<option'+' disabled'.repeat(!y[0].endsWith(x.attributes.filetype.value))+'>'+y[0]+'</option>'})
		x.selectedIndex = Math.min(tempInd,x.children.length-1)
	})
}

function makeCopy(toCopy) {
	let temp = document.createElement('LI')
	temp.innerHTML = ge(document,toCopy).innerHTML
	ge(document,toCopy).parentNode.appendChild(temp)
}

function addItem() {
	makeCopy('#items .copysource')
}
function addStyle() {
	makeCopy('#styles .copysource')
}
function addMusic() {
	makeCopy('#music .copysource')
}

function del(a,b) {
	if (confirm('Are you sure you want to delete this '+b+'?')) {
		a.parentNode.parentNode.removeChild(a.parentNode)
	}
}

function readFile(file,callback) {
	var reader = new FileReader
	reader.onload = function(x){
		callback(x.target.result)
	}
	reader.readAsDataURL(file);
}