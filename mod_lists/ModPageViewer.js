	function getMetaElement(doc, attribute, value) {
		var selected = doc.querySelector(`meta[${attribute}="${value}"]`);
		if(selected) {
			if(selected.content) {
				return selected.content;
			}
		}
		return null;
	}

	let innerReturnFunction = ({res, myName}) => {
    /* this works */
    console.log(`hi from inner name: ${myName}`);
    return {res, myName}; // return an object
	}

	// fetch('https://raw.githubusercontent.com/RuneMod/RuneFace/master/ModList.txt').then(function (response) {
	// // The API call was successful!
	// return response.text();
	// }).then(function (data) {
	// 	var modPack_json = JSON.parse(data);

	// 	var urlList = [''];

	// 	for(let i = 0; i < modPack_json.modSettings.length; i++) {
	// 		var url = modPack_json.modSettings[i].mod_Page;
	// 		urlList.push(url);
	// 	}
	// 	for(let i = 0; i < modPack_json.modSettings.length; i++) {
	// 		var url = modPack_json.modSettings[i].mod_Page;
	// 		urlList.push(url);
	// 	}
	// 	for(let i = 0; i < modPack_json.modSettings.length; i++) {
	// 		var url = modPack_json.modSettings[i].mod_Page;
	// 		urlList.push(url);
	// 	}
	// 	for(let i = 0; i < modPack_json.modSettings.length; i++) {
	// 		var url = modPack_json.modSettings[i].mod_Page;
	// 		urlList.push(url);
	// 	}
	// 	for(let i = 0; i < modPack_json.modSettings.length; i++) {
	// 		var url = modPack_json.modSettings[i].mod_Page;
	// 		urlList.push(url);
	// 	}

	// 	generateModPreviews(urlList, false);

	// }).catch(function (err) {
	// 	// There was an error
	// 	console.warn('Something went wrong.', err);
	// });

	function generateModPreviews(container, urlList, bsmallPreviews) {
		for(let i = 0; i < urlList.length; i++) {
			var url = urlList[i];

			if(url === '') {continue;} //if mod_Page url is empty, skip this mod.

			generateModPreview(container, url, bsmallPreviews);
		}
	}

	async function generateModPreview(container, url, smallPreview) {

		let response = await fetch(url, {mode: 'no-cors'});
		let data = await response.text();

		//figure out the root path
		let page = url.split('/').pop();
		var root = url.replaceAll(page, '');
		
		//replace all instance of relative path with the atcual url path
		data = data.replaceAll('./', root);

		//create div element
		let element = document.createElement('div');

		var modPreviewHtml =	`<div class="child_Normal">
									<div class="childImageContainer">
										<div class="fill" style="background-image: url('ModThumbnailUrl');"><ByText>ModCreator</ByText></div>
									</div>
									<div class="childTextContainer">
										<h5 style="margin: 0 0 5px 0;">ModName</h5>
										<p style="margin: 0 0 5px 0;">ModDescription</p>
									</div>
								</div>`;

		if(smallPreview) {
			modPreviewHtml = modPreviewHtml.replace('child_Normal', "child_Small");
		}
								

		var doc = document.implementation.createHTMLDocument('');
		doc.open();
		doc.write(data);
		doc.close();

		const ModName = getMetaElement(doc, 'property', 'og:title');
		const ModDescription = getMetaElement(doc, 'property', 'og:description');
		const ModThumbnailUrl = getMetaElement(doc, 'property', 'og:image');
		const ModCreator = getMetaElement(doc, 'property', 'og:creator');

		modPreviewHtml = modPreviewHtml.replace('ModName', ModName);
		modPreviewHtml = modPreviewHtml.replace('ModDescription', ModDescription);
		modPreviewHtml = modPreviewHtml.replace('ModThumbnailUrl', ModThumbnailUrl);
		modPreviewHtml = modPreviewHtml.replace('ModCreator', ModCreator);

	
		element.innerHTML = modPreviewHtml;
		element.setAttribute('data-modPageUrl', url);

		element.style.cursor = 'pointer';
			element.onclick = function() {
				var url = this.getAttribute("data-modPageUrl");
			
				const button = document.getElementById("modPageContainer-button");
				const modPageContainer_ClickOff = document.getElementById("modPageContainer_ClickOff");
				const modPageContainer = document.getElementById("modPageContainer");

				modPageContainer_ClickOff.style.display = "block";
				modPageContainer.style.display = "block";

				setModPageViewUrl(url);

			};

		container.appendChild(element);
	}

	//Exit ModPageView
	modPageContainer_ClickOff.addEventListener("click", function () {
        modPageContainer_ClickOff.style.display = "none";
        modPageContainer.style.display = "none";
    });

	//Set ModPageView iframe to dsiplay data from a specific url
	async function setModPageViewUrl(url) {
        //fetch data from the url
        let response = await fetch(url, {mode: 'no-cors'});
        let data = await response.text();

        //figure out the root path
        let page = url.split("/").pop();
        var root = url.replaceAll(page, "");

        //replace all instance of relative path with the atcual url path
        data = data.replaceAll("./", root);

        //put data in iframe
        var iframe = document.getElementById("modPageView-iframe");

        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(data);
        iframe.contentWindow.document.close();
	}

	function generateModPageView(ModPageUrl) {
		importCss();

		importTemplateHtml();
		
		var ModMetaDataUrl = ModPageUrl.replace("ModPage.html", "Metadata.txt")
		//append mod description to page
		fetch(ModPageUrl, {mode: 'no-cors'}).then(function (response) {
		return response.text();
		}).then(function (data) {
			const parser = new DOMParser();
			const doc = parser.parseFromString(data, "text/html");

			var content = doc.getElementById('content');

			document.getElementById('content_container').append(content);


		}).catch(function (err) {
			// There was an error
			console.warn('Something went wrong fetching ModPageUrl: '+ModPageUrl, err);
		});

		//generate preview of this mod.
		var urlList = [''];
		urlList.push(ModPageUrl)

		var container = document.getElementById('thisMod');
		generateModPreviews(container, urlList, false);


		//generate preview dependencies.
		fetch(ModMetaDataUrl, {mode: 'no-cors'}).then(function (response) {
		return response.text();
		}).then(function (data) {
			var ModMetaData = JSON.parse(data);
			var urlList = [''];

			for(let i = 0; i < ModMetaData.Dependencies.length; i++) {
				var url = ModMetaData.Dependencies[i].Mod_Page;
				urlList.push(url);
				console.log(url);
			}

			var container = document.getElementById('dependencies');

			generateModPreviews(container, urlList, false);

		}).catch(function (err) {
			// There was an error
			console.warn('Something went wrong fetching metaDataUrl: '+ModMetaDataUrl, err);
		});
	}
	
	function importCss() {
		var element = document.createElement("link");
		element.setAttribute("rel", "stylesheet");
		element.setAttribute("type", "text/css");
		element.setAttribute("href", "ModPageStyle.css");

		// Append link element to HTML head
		document.head.appendChild(element);
	}

	function importTemplateHtml() {

		var templateHtml_Text = `	<div id="anchor">
		<div class="rowContainer" id="AllPreviews">
			<div style="margin-right: 40px;">
				<p style="margin-bottom: -3px;">This mod: </p>
				<div class='parent' id="thisMod">
				</div>
			</div>

			<div style="width: 100%; margin-left: 40px; margin-right: 40px; align-self: center;">
				<p style="margin-bottom: -3px;">This mod's dependencies: </p>
				<div style="justify-content: left;" class='parent' id="dependencies"></div>
			</div>
		</div>

		<br>
		<br>
		<br>
		<p style="margin-bottom: -3px;">About this mod: </p>
		<div class = "description" id ="content_container">
		</div>
		<br>
		<button class="downloadButton" id="downloadButton" onclick="copyUrlToClipBoard(this)" type="button" id="ImportButton">Download this mod</button>
	</div>`

		const parser = new DOMParser();
		var templateHtml = parser.parseFromString(templateHtml_Text, "text/html");

		document.getElementById('anchor').append(templateHtml.getElementById('anchor'));
	}

	function copyUrlToClipBoard(importButton) {
		// Copy the text inside the text field
		navigator.clipboard.writeText(ModPageUrl_);
		var importButton = document.getElementById("downloadButton");
		importButton.innerText = "Copied mod link to clipboard! Please paste it into runemod's mod importer."
	}