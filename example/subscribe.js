//import PBIframeApi from '../src/pb_iframe_api.js'

import PBIframeApi from '../src/pb_window_client.js'


export async function subscribe(){

	const iframe = document.getElementById( 'example-iframe' );
	const pbIframeApi = new PBIframeApi( iframe );

	await pbIframeApi.request("subscribe");

	pbIframeApi.addNotificationHandler(
		'*',
		function( event ) {

			console.log( "handle notification:", event)

			if( event.type === "buy"){
				donwloadImage( event.data.screenshot )
			}

		}
	);
	
}

// Set a timeout of 5 seconds before subscribing to the pbIFrameApi
setTimeout( function(){ subscribe() }, 5000 )


// Events 

function handleBuyEvent( event ){
	console.log( "handle the buy event")
}


function handlePdfEvent( event ){
	console.log( "handle the pdf event")
}

