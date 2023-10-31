import PBIframeApi from './pb_iframe_api.js'


export async function subscribe(){

	const iframe = document.getElementById( 'example-iframe' );
	const pbIframeApi = new PBIframeApi( iframe );

	await pbClient.request("subscribe");
	
}

setTimeout( function(){ subscribe() }, 5000 )