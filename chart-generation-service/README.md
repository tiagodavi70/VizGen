# Chart Generation Service

Web service to generate charts in image and SVG formats. 
It works in the browser over the DOM and in the server over an URL GET format layer.

## Usage
Two modes are available for this module, one in the browser, available with a _script_ tag and one with a NodeJS server.

### Server Instalation

* Steps
  * Install NodeJS, make sure _node_ and _npm_ are on PATH
  * Install dependecies, running the below command on this directory (./Web-Gen-Viz/chart-generation-service)
  ``` bash
  npm install
  ```
  * To run the server (port 3000)
  ``` bash
  npm start
  ```

### Requests

The interface of requests is done by the URL, on GET requisitions. The structure is as follows:  
```bash 
http://localhost:3000/chartgen.html?value=$VALUES&key=$KEYS&category=$CATEGORIES&chart=$CHARTTYPE
```
* _$VALUES_ = array of values CSV like e.g. 1,2,4,5
* _$KEYS_ = array of labels CSV like e.g. orange,pear,kiwi
* _$CATEGORIES_ = array of categories CSV like e.g. a,b
* _$CHARTTYPE_ = type of chart (names [below](#Examples)) e.g. barchartvertical

This structure can be different from one chart to another, see [below](#Examples)

* Request example  
``` bash
http://localhost:3000/chartgen.html?value=1,2,3,4&key=orange,pear,orange,pear&category=0,0,1,1&chart=areachart
```

## Examples

* Server side example
``` javascript
const ChartGenerator = require('./lib/chartgen');

let data = {"key": [1,2], "value": ["orange","pear"]} // will be formatted inside generatechart
let chartype = "areachart"
let chartgen = new ChartGenerator(chartype,data); // null third argument returns base64 string, "svg" on third argument returns svg string
chartgen.generateChart().then((base64string) => {
    res.send(base64string);
}).catch((err) => {console.error(err);});
```

# Data and Visualizations supported

#### Bar Chart - Vertical
* **barchartvertical**
* key value pair

#### Pie Chart
* **piechart**
* key value pair

#### Line Chart
* **linechart**
* key value pair  
* key value category tuplet

#### Area Chart
* **areachart**
* key value pair  
* key value category tuplet

## Internal data format
* Two dimension, array of key value pair
``` javascript 
{"key" : key, "value": value}
```

* Three dimension, array of key-value-category tuplet
``` javascript 
{"key" : key, "value": value, "category": category}
```

# TODO
* POST requests
* return of json for interaction on client
* functions for colors, samples, ranges of values
* filter logic
* more request examples