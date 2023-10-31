# ProductBuilder iFrame API
The ProductBuilder iFrame API makes it possible to connect to a ProductBuilder Configurator by making use of a websocket connection. 
This repository provides a script named "iframe-api.js" that helps you setup the connection.


## Table of contents
- How to install and run the project 


## How to install and run the project
To install the project you simply clone this repo and run npm i. 
After having installed the repo you can run the example by running the http-server. 


## Example Configurator
The example contains the follwoing elements:
- simple html page named index.html with a iframe that embeds the default ProductBuilder Configurator.
- 

## Pre-requisite
In order to connect to the iframe api of a ProductBuilder configurator you need to have your URL whitelisted for the specific configurator you want to connect to. Please get in contact with ProductBuilder to get the url from which you want to connect whitelisted.  


## Setting up the connection 

Get your iframe element
```
	const iframe = document.getElementById( 'my-iframe' );
```
  
Create a new client:
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

