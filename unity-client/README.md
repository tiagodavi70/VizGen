# Unity Client

Client for chart generation in a web service. It renders a chart image after a server query.

# Usage

Import the `.unitypackage` of this directory in your project. The _Vis_ prefab has the `ChartGenerator` C# Script associated as an example. This script does the server requests and generates the sprites on the game object. The prefab shows the usage and the script generates a chart on start of execution and can be updated. **`NodeJS` server must be running for this package to work**. For instructions about the server and its settings, refer to [this page](https://github.com/tiagodavi70/Web-Gen-Viz/tree/master/chart-generation-service/). 

# Editor

The editor options allow changes on visualizations types and its options. The editor interface allows changes pre-run, with changes on almost every  (full settings vary from visualization from visualization). Post-run changes must be made through the API, in execution time. Sample scenes are in the package for example of usages.

![General Interface](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/imgs/unity_interface.jpg "General editor interface")

![Bar Chart Example](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/imgs/unity_barchart.jpg "Bar Chart Example")

![Scatterplot Example](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/imgs/unity_scatterplot.jpg "Scatterplot Example")

![Multiple](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/imgs/unity_multiple.jpg "Multiple charts Example")


# API Reference

The API works as a proxy for server queries for changes in execution time. All the editor options are avaliable during execution. As it requests new visualizations from the server, some time for the change must be taken in consideration, so have it in mind while doing transitions from one visualization to other, even if it has the same type, as for now the server has no memory of clients requests.

## ChartGenerator
Main class of the package, it does the a requisition for the server and renders it on screen.

<a name="ChartGenerator" href="#chartgenerator">#</a> <b>ChartGenerator</b>() [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Empty Constructor, placeholder for changes;

<a name="ChartType" href="#ChartType">#</a> ChartGenerator.<b>ChartType</b>() [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Enum with all chart types available. For full list, refer to [this](https://github.com/tiagodavi70/Web-Gen-Viz/tree/master/chart-generation-service/).

<a name="DataType" href="#DataType">#</a> ChartGenerator.<b>DataType</b>() [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Enum with Data types allowed. `Manual` refers to editor data, as the user can pre-define all configuration on editor. `Dataset` asks for a file dataset on `Assets/datasets` directory, allows configuration and is CSV compatible only. `Placeholder` turns the `GameObject` in a `ChartGenerator` recipient, adequate for dynamic-only changes. `Request` to be implemented.

<a name="_charttype" href="#_charttype">#</a> ChartGenerator.<b>charttype</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Current ChartType for the object. 

<a name="_datatype" href="#_datatype">#</a> ChartGenerator.<b>dataype</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Current DataType for the object. 

<a name="autostart" href="#autostart">#</a> chartinstance.<b>autostart</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source") 
Flag for chart generation on `Start()` call.

<a name="autoupdate" href="#autoupdate">#</a> chartinstance.<b>autoupdate</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source") 
Flag for automatic update with any change on semantics,visual mark or data. It does not involve the `Update()` call of MonoBehaviour lifecycle.

<a name="title" href="#title">#</a> chartinstance.<b>title</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
<a name="xlabel" href="#xlabel">#</a> chartinstance.<b>xlabel</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
<a name="ylabel" href="#ylabel">#</a> chartinstance.<b>ylabel</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
<a name="zlabel" href="#zlabel">#</a> chartinstance.<b>zlabel</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
<a name="wlabel" href="#wlabel">#</a> chartinstance.<b>wlabel</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Acessor methods (`get` and `set`) for changes on semantic options. `string` object.

<a name="x" href="#x">#</a> chartinstance.<b>x</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
<a name="y" href="#y">#</a> chartinstance.<b>y</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
<a name="w" href="#w">#</a> chartinstance.<b>z</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
<a name="z" href="#z">#</a> chartinstance.<b>w</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Dimensions for each chart. Refer to [this](https://github.com/tiagodavi70/Web-Gen-Viz/tree/master/chart-generation-service/) for chart type dimensions availability.
  
<a name="colors" href="#colors">#</a> chartinstance.<b>colors</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Acessor methods (`get` and `set`) for changes on colors. `Color` array.

<a name="background" href="#background">#</a> chartinstance.<b>background</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Acessor methods (`get` and `set`) for changes on colors. `Color` object(s).

<a name="numcolors" href="#numcolors">#</a> chartinstance.<b>numcolors()</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Number of colors of the current chartype, extracted from `z` dimension. Strips unique values. `int` return.

<a name="colortowebcolor" href="#colortowebcolor">#</a> ChartGenerator.<b>colorToWebColor</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Converts an Unity `Color` object to its respective RGB (0-255) string.

<a name="getchart" href="#getchart">#</a> chartinstance.<b>getchart()</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Prepares requisition and updates texture on `GameObject`. This call should be made any time that an update is necessary and [autoupdate](#autoupdate) is not enabled.

<a name="getchart" href="#getchart">#</a> chartinstance.<b>getchartfromurl(_string_ url)</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Receives requisition and updates texture on `GameObject`. This call should be made any time that an update is necessary and [autoupdate](#autoupdate) is not enabled.

<a name="checkmaxdimensions" href="#checkmaxdimensions">#</a> chartinstance.<b>checkmaxdimensions()</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
Number of dimensions available for the actual chartype. Only on `Request` dataype.

<a name="base64string" href="#base64string">#</a> chartinstance.<b>base64string</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ChartGenerator.cs "Source")  
String returned from server, saved for buffer.

## ReadDatabase
As the name implies, reads a dataset and saves it on memory in a list of lists format, parsing table like structures like CSV.

<a name="readdatabase" href="#readdatabase">#</a> <b>ReadDatabase</b>() [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ReadDatabase.cs "Source")  
Empty Constructor, placeholder for changes;

<a name="readdatabase_path" href="#readdatabase_path">#</a> <b>ReadDatabase</b>(`string` _filepath_) [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ReadDatabase.cs "Source")  
Create object and set filepath.

<a name="path" href="#path">#</a> readerinstance.<b>path</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ReadDatabase.cs "Source")  
Path for dataset. For now, the dataset must be on the `Assets/Datasets` directory.`string` object.

<a name="loadfile" href="#loadfile">#</a> readerinstance.<b>loadfile()</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ReadDatabase.cs "Source")  
Loads file into memory, populating attributes, [column names](#columnnames) and [types](#types) of attributes. It needs a valid [path](#path) and for now only accepts CSV files.

<a name="columnnames" href="#columnnames">#</a> readerinstance.<b>columnnames</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ReadDatabase.cs "Source")  
Return headers of file, the column names in a `string` array.

<a name="types" href="#types">#</a> readerinstance.<b>types</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ReadDatabase.cs "Source")  
Types of each attribute.

<a name="getline" href="#getline">#</a> readerinstance.<b>getLine(`int` index)</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ReadDatabase.cs "Source")  
Return line of `index`th line.

<a name="getcolumn" href="#getcolumn">#</a> readerinstance.<b>getColumn(`string` attr)</b> [<>](https://github.com/tiagodavi70/Web-Gen-Viz/blob/master/unity-client/Assets/src/ReadDatabase.cs "Source")  
Return the full `attr` column of dataset as a `string` List.


## Use Case Code Examples 
* Change Colors on Scatterplot
``` C# 
// TODO
```

* Dynamic Creation - no script attached prior execution
``` C# 
// TODO
```

# TODO
* Unity architecture image
* create a big, good example scene
* create a video narrated tutorial
