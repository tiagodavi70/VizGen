# Chart Generation Service

Web service to generate charts in base64 PNG string image and SVG formats.
It works in the browser over the DOM and in the server with an URL GET format layer.

## Usage
Two modes are available for this module, one in the browser, available with a _script_ tag and one with a NodeJS server.

### Server Instalation

* Steps
  * Install NodeJS, make sure _node_ and _npm_ are on PATH
  * Install dependencies, running the below command on this directory (./Web-Gen-Viz/chart-generation-service)
  ``` bash
  npm install
  ```
  * To run the server (port 3000)
  ``` bash
  npm start
  ```

### Requests

The interface of requests is done by the URL, on GET requisitions. The basic structure is as follows:  
```bash
http://localhost:3000/chartgen.html?x=$KEYS&y=$VALUES&z=$CATEGORIES&chart=$CHARTTYPE
```
* _$VALUES_ = array of values CSV like e.g. 1,2,4,5
* _$KEYS_ = array of labels CSV like e.g. orange,pear,kiwi
* _$CATEGORIES_ = array of categories CSV like e.g. a,b
* _$CHARTTYPE_ = type of chart (types [below](#Examples)) e.g. linechart

This structure can be different from one chart to another, see [below](#Examples)

* Request example  
``` bash
http://localhost:3000/chartgen.html?x=orange,pear,orange,pear&y=1,2,3,4&z=0,0,1,1&chart=areachart
```

## Examples

* URL GET requisitions
``` bash
http://localhost:3000/chartgen.html?chart=scatterplot&x=1,2,1,2&y=1,2,3,4&z=0,0,1,1&w=1,3,5,7&title=magic&xlabel=key&ylabel=value&zlabel=color&wlabel=size
```

* Server side script
``` javascript
const ChartGenerator = require('./lib/chartgen');

let data = {"charttype":"areachart", "x": ["orange","pear"], "y": [1,2]} // will be formatted inside generatechart function
let chartgen = new ChartGenerator(data); // null second argument returns base64 string, "svg" on third argument returns svg string
chartgen.generateChart().then((base64string) => {
    res.send(base64string);
}).catch((err) => {console.error(err);});
```

# Visualizations, data formats and settings supported

#### Bar Chart - Vertical
* **barchartvertical**
* x y pair

#### Pie Chart
* **piechart**
* x y pair

#### Line Chart
* **linechart**
* x y pair  
* x y z tuplet

#### Area Chart
* **areachart**
* x y pair  
* x y z tuplet

#### Scatterplot
* **scatterplot**
* x y pair  
* x y z tuplet
* x y z w tuplet


# Full list with types of all parameters:
* dimensions
  1. x - CSV numbers or categories list
  2. y - CSV numbers list
  3. z - CSV numbers or categories list
  4. w - CSV numbers or categories list


* colors - HTML color names or Hex list

* showlabels - true or false (default false, bar chart)
* legends - true or false (default false)
* sort - true or false (default false, pie chart)

* interpolation - single categoric (line and area charts)

* inner - single number ranged from 0 -> (height-(height/10)) (default 0, pie chart)
* padding -single number ranged from 0 -> 1 (default 0, pie chart)

# TODO
* POST requests
* return of json for interaction on client
* filter
* more request examples
* html usage example
