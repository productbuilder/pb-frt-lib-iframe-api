import * as PB from './pb-engine.1.2.3.min.js';
// import * as PB from '../../engine/src/main.js';

const packageURL = new URL(`https://live.productbuilder.nl/packages/moooi-pkgs/zio`);

const directions = ['undo', 'redo'];

const reporter = new PB.Reporter();

// for testing purposes, listen for an echo event from the
// project window api and handle it by triggering a response event
// at the set time
const onProjectEvent = async function({ type, data }) {
    console.info( 'onProjectEvent', type, data )
    switch ( type ) {
        case 'echo':
            window.setTimeout( () => project.triggerWindowAPIEvent( 'echo-response', data.value ), data.time );
            return true; // this is the 'true' from the test
    }
}

//const project = new PB.Project(reporter, { onEvent: onProjectEvent, allowedIFrameOrigins: [ window.origin ], server: new URL('ws://localhost:9508'), reconnectTime: 0 });
const project = new PB.Project(reporter, { onEvent: onProjectEvent, allowedIFrameOrigins: [ window.origin ], server: new URL('wss://productbuilder.nl:9508'), reconnectTime: 0 });

//project.enableWindowAPI([ window.origin ]);

const cl = new PB.ConsoleLogger('notice', reporter);
reporter.addLogger(cl);

let view = null;

let matOptions = [];
let selectedMatOption = null;

const DOM = {
    workspace: document.querySelectorAll('.workspace')[0],
    menu: document.querySelectorAll('.menu')[0],
    elementsEntry: document.querySelectorAll('.menu #elements')[0],
    materialsEntry: document.querySelectorAll('.menu #materials')[0],
    undo: document.querySelectorAll('.workspace .undo')[0],
    redo: document.querySelectorAll('.workspace .redo')[0],
    library: document.getElementsByClassName('library')[0],
    libOptions: document.querySelectorAll('.library .options')[0],
};

console.debug( parent.origin )

window.p = project;

window.addEventListener('load', async function () {

    const startTime = new Date().getTime();

    let configurator = null;

    console.debug('Start time tracking', startTime);

    if (project.server) {
        project.server.on('connection-changed', async connected => {
            console.log('Server connection changed to:', connected)
            if (connected) {
                console.debug('Start auto-save on server connection');
                console.debug(`Finish auto-save on server connection`, await project.save());
            }
        });
    }

    if (!configurator) {

        const addPkgTime = new Date().getTime();
        const pkg = await project.addPackage(packageURL);

        console.debug('Time tracking; Added pkg in', addPkgTime - startTime, 'ms');

        const addConfiguratorTime = new Date().getTime();
        configurator = await project.addConfigurator({
            pkg,
            configuration: pkg.configurations[0]
        });

        console.debug('Time tracking; Added configurator in', addConfiguratorTime - addPkgTime, 'ms');

    }

    view = project.addView();

    DOM.workspace.appendChild(view.domElement);

    configurator = project.configurators[0];
    // updateUI(configurator, DOM);


});

const clearUI = DOM => {
    clearUIElement(DOM.libOptions);

    // hide both buttons
    directions.forEach(dir => DOM[dir].style.display = 'none');

    DOM.elementsEntry.innerText = 'Elements';
    DOM.materialsEntry.innerText = 'Materials';
}

const clearUIElement = elem => {
    while (elem.firstChild) {
        elem.removeChild(elem.lastChild);
    }
}


const updateUI = async (configurator, DOM) => {
    // console.debug('Update UI, configurator options', configurator.options);



    clearUI(DOM);

    for (let direction of ['undo', 'redo']) {
        // if (configurator.options[direction]) {
        //     DOM[direction].style.display = 'block';
        // }

        if (project.canUndo) {
            DOM.undo.style.display = 'block';
        }

        if (project.canRedo) {
            DOM.redo.style.display = 'block';
        }
    }

    DOM.elementsEntry.innerText = `Elements (${configurator.options.blocks.length})`;
    DOM.materialsEntry.innerText = `Materials (${configurator.options.materials.length})`;

    switch (DOM.menu.value) {
        case 'elements':

            await Promise.all(
                configurator.options.blocks.map(block => block.build({ part: 'UI', highPriority: true }))
            );

            for (let block of configurator.options.blocks) {

                const optionDiv = document.createElement('DIV');

                console.assert(block.content.UI.medium instanceof Image, `${block.label} content.UI.medium is not an image after build!`);

                optionDiv.appendChild(block.content.UI.medium);

                const label = document.createElement('DIV');
                label.innerText = block.name;
                label.classList = 'label';

                optionDiv.appendChild(block.content.UI.medium);
                optionDiv.appendChild(label);

                optionDiv.addEventListener('mousedown', async () => {

                    // prevent additional clickage

                    clearUI(DOM);

                    const operation = Object.keys(configurator.configuration.options[block.id]).find(key => configurator.configuration.options[block.id][key].length > 0);

                    console.debug(`${operation} ${block.label} + repeat`);

                    const option = configurator.options[block.id][operation][0];

                    const newConfiguration = configurator.configuration[operation](option, { repeatLastAssignment: true });

                    await configurator.update(newConfiguration);

                    return updateUI(configurator, DOM);
                });

                DOM.libOptions.appendChild(optionDiv);

            }

            break;

        case 'materials':

            await Promise.all(
                configurator.options.materials.map(material => material.build({ part: 'UI', highPriority: true }))
            );

            for (let material of configurator.options.materials) {

                const optionDiv = document.createElement('DIV');

                console.assert(material.content.UI.medium instanceof Image, `${material.label} content.UI.medium is not an image after build!`);

                const label = document.createElement('DIV');
                label.innerText = material.name;
                label.classList = 'label';

                optionDiv.appendChild(material.content.UI.medium);
                optionDiv.appendChild(label);

                optionDiv.addEventListener('dragstart', async () => {
                    material.build();
                    matOptions = configurator.configuration.options.material(material);

                    //event.dataTransfer.setData("text/plain", ev.target.id)
                    // console.log(matOptions)
                });

                optionDiv.addEventListener('dragend', async () => {
                    matOptions = [];
                    // console.log(matOptions)
                });

                optionDiv.addEventListener('click', async () => {

                    // prevent additional clickage

                    clearUI(DOM);

                    console.log(`Apply global ${material.label}`);

                    // const option = configurator.options[material.id].assign[0];

                    const newConfiguration = configurator.configuration.setDefaultMaterial(material);

                    await configurator.update(newConfiguration);

                    return updateUI(configurator, DOM);
                });

                DOM.libOptions.appendChild(optionDiv);

            }

            break;

    }

    if (project.server) {
        //console.log('saving')
        await project.save();
        // console.log( await project.save({ copy: true }) );
        //console.log('saved')
    }
    else {
        console.log('skip save - no server')
    }
}
