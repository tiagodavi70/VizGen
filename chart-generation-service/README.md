# Chart Generation Service

Web service to generate charts in base64 PNG string image and SVG formats.
It works in the browser over the DOM and in the server with an URL GET format layer.

## Usage
Two modes are available for this module, one in the browser, available with a `script` tag and one with a NodeJS server (Tested on v10.15.1).

### Server Instalation

* Steps
  * Install NodeJS, make sure `node` and `npm` are on PATH
  * Install dependencies, running the command below on this directory (./Web-Gen-Viz/chart-generation-service)
  ``` bash
  npm install
  ```
  * To run the server (port 3000)
  ``` bash
  npm start
  ```

### Instalation troubleshot
The `canvas` dependency causes some dependency errors on some windows machines. Follow [this link](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows) to solve this problem.


### GET Requests

The interface of requests is done by the URL, on GET requisitions. The basic structure is as follows:  
```bash
http://localhost:3000/chartgen.html?x=$KEYS&y=$VALUES&z=$CATEGORIES&chart=$CHARTTYPE
```
* _$VALUES_ = array of values CSV like e.g. 1,2,4,5
* _$KEYS_ = array of labels CSV like e.g. orange,pear,kiwi
* _$CATEGORIES_ = array of categories CSV like e.g. a,b
* _$CHARTTYPE_ = type of chart (types [below](#Examples)) e.g. linechart

This structure can be different from one chart to another, see [below](#Examples)

**Important:** the `svg` tag . Example: `http://localhost:3000/chartgen.html?x=orange,pear,pineapple,strawberry&y=1,2,3,4&chart=barchartvertical&title=title&svg=true`

## General

Return a string containing the names of the datasets currently stored in the server.
``` bash
http://localhost:3000/info.html
```

Save the last request executed in the server
```bash
http://localhost:3000/save_state
```

Load the saved request 
```bash
http://localhost:3000/load_state
```

Return a log of all requests made in the active server session
``` bash
http://localhost:3000/debug.txt
```

## Dataset Requisitions

Return a string containing all the values in the specified row
``` bash
http://localhost:3000/row/<datasetName>/<rowIndex(integer)>
```

Return a string containing all the values in the specified column
``` bash
http://localhost:3000/field/<datasetName>/<attributeName>
```

Return a string containing the names of the attributes present in the dataset 
``` bash
http://localhost:3000/attributes/<datasetName>
```

## Using datasets

Return a base64 string containing a generated visualization image. Visualization types accepted: barchart, piechart, linechart, scatterplot, and heatmap; Supports the same parameters as the command without a dataset.
``` bash
http://localhost:3000/generate/<datasetName>/chartgen.html?chart=<visType>&title=<titleString>&x=<xAttribute>&y=<yAttribute>
```

Return a parallel coordinates visualization as a base64 string; Fold attribute is a set of numerical columns.
``` bash
http://localhost:3000/generate/<datasetName>/chartgen.html?chart=parallel_coordinates&fold=<attribute1>;<attribute2>;<attribute3>;<attribute4>&z=<colorAttribute>&title=<titleString>
```

## Other options

Filter adds a group of values to be filtered in the dataset when generating a visualization. Valid predicates: `equal`, `lt`, `lte`, `gt`, `gte`, `range`, `oneOf`. Same as in [vegas predicates](https://vega.github.io/vega-lite/docs/predicate.html).
``` bash
http://localhost:3000/generate/<datasetName>/chartgen.html?x=<xAttribute>&y=<yAttribute>&z=<zAttribute>&chart=<visType>&title=<titleString>&xlabel=<xLabelString>&ylabel=<yLabelString>&zlabel=<zLabelString>&filter=[{"field": "<attributeName>", "<fieldPredicate>": ["<valueString>"]}, {"field": "<attributeName>", "<fieldPredicate>": ["<valueString>"]}]
```

## Examples for GET Requisitions

All these examples assume a server running on default settings.

* URL GET requisitions

Bar chart
``` bash
http://localhost:3000/chartgen.html?x=orange,pear,pineapple,strawberry&y=1,2,3,4&chart=barchartvertical&title=title
```
![Bar Chart Example](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/imgs/barchartvertical.png "Bar Chart Request Example")

Area chart 
``` bash
http://localhost:3000/chartgen.html?x=jan,fev,jan,fev&y=4,5,4,5&z=0,0,1,1&chart=areachart
```
![Area Chart Example](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/imgs/areachart.png "Area Chart Request Example")

Scatterplot
``` bash
http://localhost:3000/chartgen.html?chart=scatterplot&x=1,2,1,2&y=1,2,3,4&z=0,0,1,1&w=1,3,5,7&title=magic&xlabel=key&ylabel=value&zlabel=color&wlabel=size
```
![Scatterplot Example](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/imgs/scatterplot.png "Scatterplot Request Example")

Line chart
``` bash
http://localhost:3000/chartgen.html?x=orange,orange,orange,apple,apple,apple,pear,pear,pear&y=3,5,8,4,5,6,7,8,9&z=america,europe,africa,america,europe,africa,america,europe,africa&chart=linechart&title=Fruits&xlabel=name&ylabel=sold&zlabel=continent
```
![Line Chart Example](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/imgs/linechart.png "Line Chart Request Example")

Pie chart & colors
``` bash
http://localhost:3000/chartgen.html?x=orange,pear,strawberry,apple&y=1,2,3,4&chart=piechart&colors=rgb(255,103,0);rgb(144,238,144);rgb(252,90,141);rgb(255,8,0)
```
![Pie Chart Example](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/imgs/piechart.png "Pie Chart Request Example")


* Server side script
``` javascript
import ChartGenerator from './lib/chartgen.mjs';

let data = {"charttype":"areachart", "x": ["orange","pear"], "y": [1,2]} // will be formatted inside generatechart function
let chartgen = new ChartGenerator(data);
chartgen.generateChart().then((base64string) => {
    res.send(base64string);
}).catch((err) => {console.error(err);});
```

# Visualizations, data formats and settings supported 

The `title`, `labels` (depending on chart type) and `colors` are available to all chart types. For specific settings:

#### Bar Chart - Vertical
* **barchartvertical**
* x y pair - (categoric,number)

#### Pie Chart
* **piechart**
* x y pair (categoric, number)

#### Line Chart
* **linechart**
* x y pair (categoric, number)
* x y z tuplet (categoric, number, categoric for color)

#### Area Chart
* **areachart**
* x y pair (categoric, number)
* x y z tuplet (categoric, number, categoric for color)

#### Scatterplot
* **scatterplot**
* x y pair (number, number)
* x y z tuplet (number, number, categoric for color)
* x y z w tuplet (number, number, categoric for color, number for size)


# Full list with types of all parameters:
* dimensions
  1. `x` - CSV numbers or categories list
  2. `y` - CSV numbers list
  3. `z` - CSV numbers or categories list
  4. `w` - CSV numbers or categories list

* `colors` - HTML color names, Hex or RGB values (only multivalued parameter separated by __;__). Number of colors must conform with respective `z` dimension 
* `title`, `xlabels`, `ylabel`, `zlabels`, `wlabel` - string
* `background` - HTML color names, Hex or RGB values (only multivalued parameter separated by __;__).
* `sort`, `svg`, `base64` - true or false


# TODO

* Extra parameters:

interpolation - single categoric (line and area charts - recover list from documentation)  
inner - single number ranged from 0 - height \* 0.9 - _(default 0, pie chart)_ 
padding -single number ranged from 0 - 1 - _(default 0, pie chart)_
fontsize - font size for title, labels and legends (default 20) 

* POST requests
* return of json for interaction on client
* filter logic
* html usage example
