# PBIframeApi

The `PBIframeApi` is a JavaScript class designed for interacting with an Product Builder Configurator embedded within an iframe. This class facilitates communication and data exchange between your web application and the embedded configurator.


## Prerequisite: Whitelisting the URL with ProductBuilder

Before using the `PBIframeApi`, you need to ensure that the URL where your application runs (the parent page containing the iframe) is whitelisted by ProductBuilder. Whitelisting is necessary to establish a secure connection between your application and the embedded iframe. If your URL is not whitelisted, communication with the iframe will not work.

Please get in contact with ProductBuilder to whitelist your URL. Once your URL is whitelisted, you can use the `PBIframeApi` to interact with the embedded iframe without any issues.


## Usage

If you want to use the `PBIframeApi` class, follow these simple steps:

1. **Download the Script**: Download the `PBIframeApi.js` script from the repository and copy it to your project.

2. **Include the Script**: In your HTML file, include the script by adding the following line within the `<script>` tag. Make sure to replace `'path/to/PBIframeApi.js'` with the actual path to the downloaded script:

```html
   <script src="path/to/PBIframeApi.js"></script>
```

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

## API

### `constructor(target: HTMLIFrameElement)`

Initialize a new instance of the `PBIframeApi` class with the target iframe element.

### `async connect(): Promise<PBIframeApi>`

Connect to the target iframe and set up a communication channel. Returns a promise that resolves with the `PBIframeApi` instance when the connection is established.

### `request(method: string, data: any, timeoutTime?: number): Promise<Response>`

Send a request to the PB iframe, specifying a method and optional data. Returns a promise that resolves with the response from the iframe.

### `addNotificationHandler(event: string, handler: function): function`

Subscribe to notifications coming from the PB iframe. Provide an event name (or '*' to subscribe to all events) and a handler function. Returns a function to stop listening to the specified event.

### Other Methods

The class also includes various methods for interacting with the PB application within the iframe, such as:

- `projectSlug()`
- `projectId()`
- `saveProject()`
- `loadProject(identifier)`
- `shareProject()`
- `listConfigurators()`
- `listLoadedPackages()`
- and more.


## Example

The "Example" directory contains a sample configuration of the ProductBuilder Configurator. This example showcases how to embed and interact with the default ProductBuilder Configurator within an iframe using the `PBIframeApi`. It serves as a practical reference for integrating ProductBuilder's configurator into your web application. Inside the "Example" directory, you'll find files and code that demonstrate the use of the `PBIframeApi` in a real-world scenario.
 

## Test

The "Test" section is dedicated to the testing of the `PBIframeApi` class. It includes tests built with Mocha and Chai, two popular JavaScript testing libraries. These tests validate the functionality of the `PBIframeApi` class, ensuring that it performs as expected and adheres to its intended behavior. To run the tests, navigate to the "test" directory and open the "index.html" file.

