class PBWindowClient {

    constructor( target ) {

        // this will usually be an iframe

        this.target = target;

        // handle incoming messages with target = 'pb' data property

        window.addEventListener(

            "message",

            event => {

                console.log( event )

                if ( event.data.target !== 'pb' ) {
                    return;
                }

                // check whether message is a response
                // to an earlier request

                if ( event.data.type === 'response' ) {

                    // if the handler does not exist
                    // something is wrong
                    //

                    const responsePromiseSettlers = this.responsePromises[ event.data.id ];

                    if ( ! responsePromiseSettlers ) {
                        throw new Error( `Missing handler for response ${event.data.id}, perhaps due to an earlier timeout` );
                    }

                    // if the response contains data resolve the stored
                    // promise, otherwise reject it

                    if ( event.data.error === false ) {
                        responsePromiseSettlers.resolve( event.data );
                    }
                    else {
                        responsePromiseSettlers.reject( event.data );
                    }

                    // in either case clear the timeout
                    // and remove the handlers

                    clearTimeout( responsePromiseSettlers.timeout );

                    delete this.responsePromises[ event.data.id ];

                    return;
                }

                // if the message is not a response, it is a notification
                // collect the handlers and call them

                const notificationHandlers = [
                    ...Object.values( this.notificationHandlers[ event ] || {} ),
                    ...Object.values( this.notificationHandlers[ '*' ] || {} )
                ];

                for ( let notificationHandler of notificationHandlers ) {
                    notificationHandler( event.data );
                }
            });
    }


    /**
     * Stores the response promises
     */

    responsePromises = {};


    /**
     * Stores the notification handlers
     */

    notificationHandlers = {};


    /**
     * Create an id (string of semi-random numbers)
     * @returns {string} id
     */

    createId() {
        return String( Math.random() ).substr(2);
    }


    /**
     * Request information or action from a PB app
     * @param {string} method
     * @param {any} data
     * @param {number} [timeoutTime = 5000]
     * @returns {Promise<Response>}
     */

    request( method, data, timeoutTime = 5 * 1000 ) {

        const id = this.createId();

        const client = this;

                this.target.contentWindow.postMessage(
            { id, target: 'pb', method, data },
            new URL( this.target.src ).origin
        );

        // create a timeout on which to
        // reject the promise if it isnt settled yet
        // when a response with the same id
        // is received, the timeout will be cleared

        const onTimeout = function() {
            client.responsePromises[ id ].reject( 'Timeout' );
        }

        const timeout = setTimeout(
            onTimeout,
            timeoutTime
        );

        const returnPromise = new Promise(function( resolve, reject ) {
            client.responsePromises[ id ] = { resolve, reject, timeout };
        });

        return returnPromise;
    }


    /**
     * Subscribe to notifications coming from a PB app
     * @param {string} [event = '*'] - Asterisk '*' subscribes to all events
     * @param {function} handler
     * @returns {function} deleteHandler - call this function to stop listening
     */

    addNotificationHandler( notificationType, handler ) {

        console.log( "add notification" )

        const id = this.createId();

        if ( typeof handler !== 'function' ) {
            throw new Error( 'Expected handler to be of type "function"' );
        }

        const saneNTName = String( notificationType || '*' );

        const handlers = this.notificationHandlers[ saneNTName ] || {};

        handlers[ id ] = handler;

        this.notificationHandlers[ saneNTName ] = handlers;

        const deleteHandler = function() {
            delete this.notificationHandlers[ id ];
        };

        deleteHandler.bind( this );

        return deleteHandler;
    }
}


export default PBWindowClient;