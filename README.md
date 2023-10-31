# PBIframeApi

The `PBIframeApi` is a JavaScript class designed for interacting with an Product Builder Configurator embedded within an iframe. This class facilitates communication and data exchange between your web application and the embedded configurator.


## Prerequisite: Whitelisting the URL with ProductBuilder

Before using the `PBIframeApi`, you need to ensure that the URL where your application runs (the parent page containing the iframe) is whitelisted by ProductBuilder. Whitelisting is necessary to establish a secure connection between your application and the embedded iframe. If your URL is not whitelisted, communication with the iframe will not work.

By default, `localhost:8080` and `localhost:3000` are included in the whitelist, making it convenient for testing on your local machine. However, when deploying your application to a production environment, you'll need to get in contact with ProductBuilder to whitelist your production URL.

Once your URL is whitelisted, you can use the `PBIframeApi` to interact with the embedded iframe without any issues.



## Installation

If you want to use the `PBIframeApi` class, follow these simple steps:

1. **Download the Script**: Download the `pb_iframe_api.js` script from the repository and copy it to your project.

2. **Include the Script**: In your HTML file, include the script by adding the following line within the `<script>` tag. Make sure to replace `'path/to/pb_iframe_api.js'` with the actual path to the downloaded script:

```html
   <script src="path/to/PBIframeApi.js"></script>
```

## Usage

Here's how to use the PBIframeApi class in your JavaScript code:


```javascript
	// Import the PBIframeApi class
	import PBIframeApi from './path/to/PBIframeApi'; // Replace with the actual path


	// Create an instance by passing the target iframe element
	const iframe = document.getElementById('example-iframe');
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

### Constructor

- **`constructor(target: HTMLIFrameElement)`**: Initialize a new instance of the `PBIframeApi` class with the target iframe element.

### Connection

- **`async connect(): Promise<PBIframeApi>`**: Connect to the target iframe and set up a communication channel. Returns a promise that resolves with the `PBIframeApi` instance when the connection is established.

### Request

- **`request(method: string, data: any, timeoutTime?: number): Promise<Response>`**: Send a request to the PB iframe, specifying a method and optional data. Returns a promise that resolves with the response from the iframe.

### Notification Handling

- **`addNotificationHandler(event: string, handler: function): function`**: Subscribe to notifications coming from the PB iframe. Provide an event name (or '*' to subscribe to all events) and a handler function. Returns a function to stop listening to the specified event.

### Other Methods

The class also includes various methods for interacting with the PB application within the iframe, such as:

- **`projectSlug(): Promise<string>`**: Returns the slug (short identifier) for the current project.
- **`projectId(): Promise<UUID>`**: Returns the ID of the current project.
- **`saveProject(): Promise<Object<string, string>>`**: Save the current project to the cloud.
- **`loadProject(identifier: string): Promise<Object<string, string>>`**: Loads a project from the cloud using a project ID or slug.
- **`shareProject(): Promise<Object<string, string>>`**: Share a project by creating a read-only copy with a different ID or slug.
- **`listConfigurators(): Promise<Array<Object<string, UUID>>`**: List the configurators in the current design.
- **`listLoadedPackages(): Promise<Array<Object<string, UUID>>`**: List the loaded packages.
- **`listPresets(pkgId: UUID): Promise<Array<Object<string, UUID>>`**: List the presets of a current package as a flat list.
- **`selectPreset(configuratorId: UUID, presetId: UUID): Promise<boolean>`**: Update the current design by changing it into a preset.
- **`screenshot(): Promise<string>`**: Take a screenshot of the current camera angle.
- **`ui(data: any): Promise<any>`**: Send a request to the front-end layer.
- **`setLocale(locale: string): Promise<boolean>`**: Change the automatically deduced locale to a manual value.
- **`price(): Promise<Object>`**: Return the actual project price.


## Example

The "Example" directory contains a sample configuration of the ProductBuilder Configurator. This example showcases how to embed and interact with the default ProductBuilder Configurator within an iframe using the `PBIframeApi`. It serves as a practical reference for integrating ProductBuilder's configurator into your web application. Inside the "Example" directory, you'll find files and code that demonstrate the use of the `PBIframeApi` in a real-world scenario.
 

## Test

The "Test" section is dedicated to the testing of the `PBIframeApi` class. It includes tests built with Mocha and Chai, two popular JavaScript testing libraries. These tests validate the functionality of the `PBIframeApi` class, ensuring that it performs as expected and adheres to its intended behavior. To run the tests, navigate to the "test" directory and open the "index.html" file.

