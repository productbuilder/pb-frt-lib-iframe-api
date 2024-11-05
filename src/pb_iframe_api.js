class PBIframeApi {

    constructor(target) {

        // this will usually be an iframe

        this.target = target;

        // handle incoming messages with target = 'pb' data property

        window.addEventListener(

            "message",

            event => {

                if (event.data.target !== 'pb') {
                    return;
                }

                //console.log('PBW event', event)

                // special case for the pbinfo connection message

                if (event.data.type === 'pbinfo') {
                    this.pbinfo = event.data;
                }

                // check whether message is a response
                // to an earlier request

                if (event.data.type === 'response') {

                    // if the handler does not exist
                    // something is wrong
                    //

                        const responsePromiseSettlers = this.responsePromises[event.data.id];

                    if (!responsePromiseSettlers) {
                        throw new Error(`Missing handler for response ${event.data.id}, perhaps due to an earlier timeout`);
                    }

                    // if the response contains data resolve the stored
                    // promise, otherwise reject it

                    if (event.data.error === false) {
                        responsePromiseSettlers.resolve(event.data);
                    } else {
                        responsePromiseSettlers.reject(event.data);
                    }

                    // in either case clear the timeout
                    // and remove the handlers

                    clearTimeout(responsePromiseSettlers.timeout);

                    delete this.responsePromises[event.data.id];

                    return;
                }

                // if the message is not a response, it is a notification
                // collect the handlers and call them

                const notificationHandlers = [
                    ...Object.values(this.notificationHandlers[event] || {}),
                    ...Object.values(this.notificationHandlers['*'] || {})
                ];

                for (let notificationHandler of notificationHandlers) {
                    notificationHandler(event.data);
                }
            }
        );


        // this.connectionPromise = this.connect();
    }


    /**
     * Stores the response promises
     */

    responsePromises = {};


    /**
     * Stores the notification handlers
     */

    notificationHandlers = {};

    connectionPromise = null;

    initPromise = null;

    pbinfo = false;


    /**
     * Connects to the target
     * This now works through polling, bc the iframe can be loaded before this script
     * Would be better to have this script create the iFrame, then a simple up-message from
     * the target will always do
     * @returns {Promise<Object<string,any>>}
     */

    async connect() {

        const client = this;
        let timedOut = false;

        let res = null;
        let rej = null;
        const connected = new Promise(function(resolve, reject) {
            res = resolve;
            rej = reject;
        });

        const connectionTimeout = setTimeout(
            function() {
                timedOut = true;
                rej('PB Iframe Api could not connect: target does not respond');
            },
            60000
        );

        while (timedOut !== true) {

            console.debug( 'Attempting to connect to', this.target.src );

            this.target.contentWindow.postMessage(
                'pbping',
                new URL(this.target.src).origin
            );

            await new Promise(r => setTimeout(r, 100));

            if (typeof(this.pbinfo) === 'object') {
                clearTimeout(connectionTimeout);
                if (this.pbinfo.originAllowed !== true) {
                    rej(`PB Iframe Api could not connect: origin [${this.pbinfo.origin}] is not allowed`)
                } else {
                    console.log('PB Iframe Api connected');
                    res(client);
                }
                break;
            }
        }

        await this.request('subscribe', '*');

        return connected;
    }

    
    /**
     * Create an id (string of semi-random numbers)
     * @returns {string} id
     */

    createId() {
        return String(Math.random()).substr(2);
    }


    /**
     * Request information or action from a PB app
     * @param {string} method
     * @param {any} data
     * @param {number} [timeoutTime = 5000]
     * @returns {Promise<Response>}
     */

    request(method, data, timeoutTime = 15 * 1000) {

        if (typeof this.pbinfo !== 'object') {
            throw new Error('Please .connect() to target before doing requests');
        }

        if (this.pbinfo.originAllowed !== true) {
            throw new Error(`Origin not allowed`);
        }

        const id = this.createId();

        const client = this;

        this.target.contentWindow.postMessage({
            id,
            target: 'pb',
            method,
            data
        },
            new URL(this.target.src).origin
        );

        // create a timeout on which to
        // reject the promise if it isnt settled yet
        // when a response with the same id
        // is received, the timeout will be cleared

        const onTimeout = function() {
            client.responsePromises[id].reject('Timeout');
        }

        const timeout = setTimeout(
            onTimeout,
            timeoutTime
        );

        const returnPromise = new Promise(function(resolve, reject) {
            client.responsePromises[id] = {
                resolve,
                reject,
                timeout
            };
        });

        return returnPromise;
    }


    /**
     * Subscribe to notifications coming from a PB app
     * @param {function} handler
     * @returns {function} deleteHandler - call this function to stop listening
     */

    onEvent(handler) {

        const id = this.createId();

        if (typeof handler !== 'function') {
            throw new Error('Expected handler to be of type "function"');
        }

        const saneNTName = '*'; //String(notificationType || '*');

        const handlers = this.notificationHandlers[saneNTName] || {};

        handlers[id] = handler;

        this.notificationHandlers[saneNTName] = handlers;

        const deleteHandler = function() {
            delete this.notificationHandlers[id];
        };

        deleteHandler.bind(this);

        return deleteHandler;
    }


    /**
     * Returns the slug (short identifier) for the current project.
     * @method
     * @async
     * @returns {string}
     */

    async projectSlug() {
        const response = await this.request('project-slug');
        return response;
    }


    /**
     * Returns the id of the current project
     * @method
     * @async
     * @returns {UUID}
     */

    async projectId() {
        const response = await this.request('project-id');
        return response;
    }


    /**
     * Save the current project to the cloud.
     * @method
     * @returns {Object<string,string>}
     */

    async saveProject() {
        const response = await this.request('save-project');
        console.log(response)
        return response;
    }


    /** Loads a project from the cloud.
     * @method
     * @async
     * @param {string} identifier - Either a project id or slug
     * @returns {Object<string,string>}
     */

    async loadProject(identifier) {
        const response = await this.request('load-project', {
            identifier: String(identifier)
        });
        return response;
    }


    /** 
     * Share a project: create a copy with a different id/slug and make it readonly
     * @method
     * @async
     * @returns {Object<string,string>}
     */

    async shareProject() {
        const response = await this.request('share-project');
        return response;
    }


    /** 
     * List the configurators in the current design.
     * Returns an array of objects with the configurator id and pkg id.
     * @method
     * @async
     * @returns {Array<Object<string,UUID>>} 
     */

    async listConfigurators() {
        const response = await this.request('list-configurators');
        return response;
    }


    /** 
     * List the loaded packages
     * Returns an array of objects with the package id.
     * @method
     * @async
     * @returns {Array<Object<string,UUID>>} 
     */

    async listLoadedPackages() {
        const response = await this.request('list-loaded-packages');
        return response;
    }


    /**
     * List the presets of a current package as a flat list
     * of objects with the preset id and package id.
     * @method
     * @async
     * @returns {Array<Object<string,UUID>>}
     */

    async listPresets(pkgId) {
        const response = await this.request(
            'list-presets', 
            {
                pkgId
            }
        );
        return response;
    }


    /**
     * Update the current design by changing it into a preset.
     * @method
     * @async
     * @param {UUID} configuratorId
     * @param {UUID} presetId
     * @returns {boolean}
     */

    async selectPreset( configuratorId, presetId, keepDefaultMaterials = false ) {
        const response = await this.request(
            'select-preset', 
            {
                presetId,
                configuratorId,
                keepDefaultMaterials
            }
        );
        return response;
    }


    /**
     * Retrieves the component options (to make a new configuration)
     * @method 
     * @async
     * @param {UUID} configuratorId
     * @returns {Array<Object>}
     */

    async listComponentOptions(configuratorId) {
        const response = await this.request(
            'list-component-options',
            {
                configuratorId
            }
        );
        return response;
    }


    /**
     * Retrieves the list of materials that can be applied (to make a new configuration)
     * @method 
     * @async
     * @param {UUID} configuratorId
     * @returns {Array<Object>}
     */

    async listAssignableMaterials(configuratorId){
        const response = await this.request(
            'list-assignable-materials',
            {
                configuratorId
            }
        );
        return response;
    }


    /**
     * Creates a new configuration with a new default material
     * @method 
     * @async
     * @param {UUID} configuratorId
     * @param {UUID} materialId
     * @returns {boolean}
     */

    async setDefaultMaterial(configuratorId, materialId) {
        const response = await this.request(
            'set-default-material',
            {
                configuratorId,
                materialId
            }
        );
        return response;
    }


    /**
     * Take a screenshot of the current camera angle.
     * @method
     * @async
     * @returns {string} dataURI
     */

    async screenshot() {
        const response = await this.request('screenshot');
        return response;
    }


    /**
     * Send a request to the front-end layer
     * @method
     * @async
     * @param {any} data
     * @returns {any}
     */

    async ui(data) {
        const response = await this.request('ui', data);
        return response;
    }


    /**
     * Change the automatically deduced locale to a manual value
     * @method
     * @async
     * @param {string} locale, e.g. fr-FR
     * @returns {boolean}
     */

    async setLocale( locale ) {
        const response = await this.request('set-locale', { locale });
        return response;
    }


    /**
     * Return the actual project price
     * @method
     * @async
     * @returns {Object}
     */

    async price() {
        const response = await this.request('price');
        return response;
    }


    /**
     * Returns a JSON export of the current project
     * @method
     * @async
     * @returns {Object}
     */

    async exportProject() {
        const response = this.request('export-project');
        return response;
    }

}


export default PBIframeApi;
