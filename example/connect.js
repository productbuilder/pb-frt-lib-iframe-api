// Import the PBIframeApi class
import PBIframeApi from '../src/pb_iframe_api.js'


export async function connect(){

	// Create an instance by passing the target iframe element
	const iframe = document.getElementById( 'example-iframe' );
	const pbIframeApi = new PBIframeApi( iframe );

	const connectionPromise = await pbIframeApi.connectionPromise;
	console.log( connectionPromise )

	//Connecting to the iframe api can take time. 
	await new Promise( res => setTimeout( res, 5000) );

	//By Subscribing the iframe api creates a continuous communication by opening a  websocket with the configurator. 
	await pbIframeApi.request("subscribe");

	//Add a notification handler in order to handle incomming venets from the configurator.
	pbIframeApi.addNotificationHandler(
		'*',
		function( event ) {

			console.log( "handle notification:", event)

			if( event.type === "buy"){
				console.log( "handle buy event")
				//donwloadImage( event.data.screenshot )
			}

			if( event.type === "price"){
				console.log( "handle price event")
			}

		}
	);
	
}

// Connecting to the child window can take time. 
// Set a timeout of 3 to 5 seconds before connecting to the pbIFrameApi.
setTimeout( function(){ connect() }, 5000 )


// Events 

function handleBuyEvent( event ){
	console.log( "handle the buy event")
}


function handlePdfEvent( event ){
	console.log( "handle the pdf event")
}

