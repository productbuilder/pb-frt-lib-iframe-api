# PBIframeApi
The PBIframeApi is a JavaScript class designed for interacting with an iframe, commonly used for embedding a PB (Product Builder) application. This class facilitates communication and data exchange between your web application and the embedded PB iframe.


## Installation
You can install the PBIframeApi class in your project using npm or another package manager:

```
npm install your-class-name
```


## Usage

Here's how to use the PBIframeApi class in your JavaScript code:


```
	// Import the PBIframeApi class
	import PBIframeApi from 'your-class-name';

	// Create an instance by passing the target iframe element
	const iframe = document.getElementById('your-iframe-id');
	const pbApi = new PBIframeApi(iframe);

	// Connect to the iframe
	pbApi.connect()
	.then((api) => {
		// You are now connected to the PB iframe, and you can perform actions
		api.projectSlug()
		.then((slug) => {
			console.log('Project Slug:', slug);
		})
		.catch((error) => {
			console.error('Error getting project slug:', error);
		});
	})
	.catch((error) => {
		console.error('Error connecting to the iframe:', error);
	});

```




## Example Configurator
The example contains the follwoing elements:
- index.html with a iframe that embeds the default ProductBuilder Configurator.
- 

## Pre-requisite
In order to connect to the iframe api of a ProductBuilder configurator you need to have your URL whitelisted for the specific configurator you want to connect to. Please get in contact with ProductBuilder to get the url from which you want to connect whitelisted.  


## PBIframeApi class
The pb-iframe-api.js script contains the PBIframeApi class. 


## Setting up the connection 

Get your iframe element
```
	const iframe = document.getElementById( 'my-iframe' );
```
  
Create a new client by :
```
	const pbClient = new PBWindowClient( iframe );
```

Subscribe to a configurator
```
	await pbClient.request("subscribe");
```


## Methods




## Test
The test is build with mocha and chai.
To run the test make sure you are running the http-server. Then navigate to the index.html inside the test directory to run the test. 

