import PBWindowClient from '../src/pb_window_client.js'

console.log("test module")


function donwloadImage( imgData ){

	//console.log( imgData )

	const img = new Image()

	img.src = imgData

	//console.log( img )

	const a = document.createElement('a');
	a.href = img;
	document.body.style.backgroundColor = "red";
	document.body.appendChild( img )

}

function handleBlob(blob){
	alert("blob received")
}

export async function test(){

	const iframe = document.getElementById( 'example-iframe' );
	console.log( iframe )

	const pbClient = new PBWindowClient( iframe );

	await pbClient.request("subscribe");

	pbClient.addNotificationHandler(
		'*',
		function( event ) {
			console.log( "notification")
			console.log( event )
			if( event.type === "buy"){
				donwloadImage( event.data.screenshot )
			}
		}
	);

	pbClient.addNotificationHandler(
		'project-specs-pdf',
		function( event ) {
			handleBlob(event.data)
		}
	);

	//pbClient.request('list-configurators')

	//const resp = await pbClient.request('ui', { type: 'echo', data: "test" } )
	//console.log( resp )
	// const screenshot = await pbClient.request('screenshot' )
	// console.log( screenshot )

}

setTimeout( function(){ test() }, 5000 )


window.test = test;


