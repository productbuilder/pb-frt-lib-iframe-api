import PBIframeApi from "../src/pb_iframe_api.js";

const emptyElement = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

async function connect(iframe) {
    const pbIframeApi = new PBIframeApi(iframe);

    try {
        await pbIframeApi.connect();
    } catch (err) {
        console.error(err);
        return false;
    }

    let configurators = (await pbIframeApi.listConfigurators()).data;

    let initPromiseResolve = null;
    const initPromise = new Promise((res) => {
        initPromiseResolve = res;
    });

    pbIframeApi.onEvent(function(event) {
        console.debug("PB Iframe event:", event);

        switch (event.type) {
            case "buy":
                console.debug("Handle buy event");
                break;
            case "price":
                console.debug("Handle price event");
                break;
            case "configurator-initialized":
                initPromiseResolve();
                break;
        }
    });

    console.debug("Configurator list", configurators);

    const nrOfConfiguratorsInProject = Object.keys(configurators).length;

    if (
        nrOfConfiguratorsInProject === 0 || configurators[0].initialized !== true
    ) {
        await initPromise;
        configurators = (await pbIframeApi.listConfigurators()).data;
        console.debug("Configurators after init", configurators);
    } else {
        // no further preparation needed
    }

    console.log("Configurator initialized");

    const confId = configurators[0].id;

    const presetList = await pbIframeApi.listPresets();
    const presetContainer = document.getElementById("preset-container");
    emptyElement(presetContainer);

    for (let preset of presetList.data) {
        const presetName = document.createElement("span");
        presetName.innerText = preset.name;
        const presetThumb = document.createElement("img");
        presetThumb.src = preset.thumbnail;

        const presetElement = document.createElement("div");
        presetElement.appendChild(presetThumb);
        presetElement.appendChild(presetName);

        presetElement.addEventListener(
            "click",
            () => pbIframeApi.selectPreset(confId, preset.id, true),
        );

        presetContainer.appendChild(presetElement);
    }

    const assignableMaterials = await pbIframeApi.listAssignableMaterials(
        confId,
    );
    const materialContainer = document.getElementById("material-container");
    emptyElement(materialContainer);

    for (let material of assignableMaterials.data.slice(0, 10)) {
        const materialName = document.createElement("span");
        materialName.innerText = material.name;
        const materialThumb = document.createElement("img");
        materialThumb.src = material.thumbnail;

        const materialElement = document.createElement("div");
        materialElement.appendChild(materialThumb);
        materialElement.appendChild(materialName);

        materialElement.addEventListener(
            "click",
            () => pbIframeApi.setDefaultMaterial(confId, material.id),
        );

        materialContainer.appendChild(materialElement);
    }
}

const iframe = document.getElementById("example-iframe");
iframe.addEventListener("load", () => connect(iframe));
