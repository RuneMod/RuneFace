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

	fetch('https://raw.githubusercontent.com/RuneMod/RuneFace/master/ModList.txt').then(function (response) {
	// The API call was successful!
	return response.text();
	}).then(function (data) {
		var modPack_json = JSON.parse(data);

		var urlList = [''];

		for(let i = 0; i < modPack_json.modSettings.length; i++) {
			var url = modPack_json.modSettings[i].mod_Page;
			urlList.push(url);
		}
		for(let i = 0; i < modPack_json.modSettings.length; i++) {
			var url = modPack_json.modSettings[i].mod_Page;
			urlList.push(url);
		}
		for(let i = 0; i < modPack_json.modSettings.length; i++) {
			var url = modPack_json.modSettings[i].mod_Page;
			urlList.push(url);
		}
		for(let i = 0; i < modPack_json.modSettings.length; i++) {
			var url = modPack_json.modSettings[i].mod_Page;
			urlList.push(url);
		}
		for(let i = 0; i < modPack_json.modSettings.length; i++) {
			var url = modPack_json.modSettings[i].mod_Page;
			urlList.push(url);
		}

		generateModPreviews(urlList, false);

	}).catch(function (err) {
		// There was an error
		console.warn('Something went wrong.', err);
	});

	function generateModPreviews(urlList, smallPreviews) {
		let container = document.createElement('div');
		container.setAttribute('class', 'parent');
		document.getElementById('anchor').appendChild(container);

		for(let i = 0; i < urlList.length; i++) {
			var url = urlList[i];

			if(url === '') {continue;} //if mod_Page url is empty, skip this mod.

			generateModPreview(container, url, smallPreviews);
		}
	}

	async function generateModPreview(container, url, smallPreview) {
		
		let response = await fetch(url);
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
        let response = await fetch(url);
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