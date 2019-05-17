# Chart Generation Service

Web service to generate charts in base64 PNG string image and SVG formats.
It works in the browser over the DOM and in the server with an URL GET format layer.

## Usage
Two modes are available for this module, one in the browser, available with a `script` tag and one with a NodeJS server.

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


## Examples

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
http://localhost:3000/chartgen.html?chart=scatterplot&x=1,2,1,2&y=1,2,3,4&z=0,0,1,1&w=1,3,5,7&title=magic&xlabel=key&ylabel=value&zlabel=color&wlabel=size
``` bash
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
const ChartGenerator = require('./lib/chartgen');

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
* x y pair (categoric,number)

#### Line Chart
* **linechart**
* x y pair (categoric,number)
* x y z tuplet (categoric,number,categoric[color])

#### Area Chart
* **areachart**
* x y pair (categoric,number)
* x y z tuplet (categoric,number,categoric[color])

#### Scatterplot
* **scatterplot**
* x y pair (categoric,number)
* x y z tuplet (categoric,number,categoric[color])
* x y z w tuplet (categoric,number,categoric[color],number[size])


# Full list with types of all parameters:
* dimensions
  1. `x` - CSV numbers or categories list
  2. `y` - CSV numbers list
  3. `z` - CSV numbers or categories list
  4. `w` - CSV numbers or categories list

* `colors` - HTML color names, Hex or RGB values (only multivalued parameter separated by __;__). Number of colors must conform with respective dimension `z` dimension 
* `title`, `xlabels`, `ylabel`, `zlabels`, `wlabel` - string

# TODO

* Extra parameters:

sort - true or false (default false)  
interpolation - single categoric (line and area charts - recover list from documentation)  
inner - single number ranged from 0 - height \* 0.9 - _(default 0, pie chart)_ 
padding -single number ranged from 0 - 1 - _(default 0, pie chart)_  
background - background color (default #FFFFFF)
fontsize - font size for title, labels and legends (default 20) 

* POST requests
* return of json for interaction on client
* filter logic
* html usage example
