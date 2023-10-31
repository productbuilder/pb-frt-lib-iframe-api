# PBIframeApi
The `PBIframeApi`` is a JavaScript class designed for interacting with an iframe, commonly used for embedding a Product Builder aconfigurator. This class facilitates communication and data exchange between your web application and the in the iframe mbedded configurator.


## Prerequisite: Whitelisting the URL with ProductBuilder

Before using the `PBIframeApi`, you need to ensure that the URL where your application runs (the parent page containing the iframe) is whitelisted by ProductBuilder. Whitelisting is necessary to establish a secure connection between your application and the embedded iframe. If your URL is not whitelisted, communication with the iframe may not work as expected.

Please get in contact with ProductBuilder to whitelist your URL.

Once your URL is whitelisted, you can use the `PBIframeApi` to interact with the embedded iframe without any issues.


## Installation
You can install the PBIframeApi class in your project using npm or another package manager:

```
npm install your-class-name
```


## Usage

Here's how to use the PBIframeApi class in your JavaScript code:


```javascript
	// Import the PBIframeApi class
	import PBIframeApi from 'your-class-name';

	// Create an instance by passing the target iframe element
	const iframe = document.getElementById('your-iframe-id');
	const pbIframeApi = new PBIframeApi(iframe);

	// Connect to the iframe
	pbIframeApi.connect()
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

API
constructor(target: HTMLIFrameElement)
Initialize a new instance of the PBIframeApi class with the target iframe element.
async connect(): Promise<PBIframeApi>
Connect to the target iframe and set up a communication channel. Returns a promise that resolves with the PBIframeApi instance when the connection is established.
request(method: string, data: any, timeoutTime?: number): Promise<Response>
Send a request to the PB iframe, specifying a method and optional data. Returns a promise that resolves with the response from the iframe.
addNotificationHandler(event: string, handler: function): function
Subscribe to notifications coming from the PB iframe. Provide an event name (or '*' to subscribe to all events) and a handler function. Returns a function to stop listening to the specified event.
Other Methods
The class also includes various methods for interacting with the PB application within the iframe, such as projectSlug(), projectId(), saveProject(), loadProject(identifier), shareProject(), listConfigurators(), listLoadedPackages(), and more.


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
```javascript
	const iframe = document.getElementById( 'my-iframe' );
```
  
Create a new client by :
```javascript
	const pbClient = new PBWindowClient( iframe );
```

Subscribe to a configurator
```javascript
	await pbClient.request("subscribe");
```


## Methods




## Test
The test is build with mocha and chai.
To run the test make sure you are running the http-server. Then navigate to the index.html inside the test directory to run the test. 

