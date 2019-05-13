# Unity Client

Client for chart generation in a web service. It renders a chart image after a server query.

## Usage

Import the `.unitypackage` of this directory in your project. The _Vis_ prefab has the `ChartGenerator` C# Script associated as an example. This script does the server requests and generates the sprites on the game object. The prefab shows the usage and the script generates a chart on start of execution and can be updated. **`NodeJS` server must be running for this package to work**. For instructions about the server and its settings, refer to [this page](https://github.com/tiagodavi70/Web-Gen-Viz/tree/master/chart-generation-service/). 

## Editor

The editor options allow changes on visualizations types and its options. The editor interface allows changes pre-run, with changes on almost every  (full settings vary from visualization from visualization). Post-run changes must be made through the API, in execution time. 

![General Interface](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "General editor interface")

![Bar Chart Example](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Bar Chart Example")

![Scatterplot Example](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Scatterplot Example")

## API Reference

The API works as a proxy for server queries for changes in execution time. All the editor options are avaliable during execution. As it requests new visualizations from the server, some time for the change must be taken in consideration, so have it in mind while doing transitions from one visualization to other, even if it has the same type, as for now the server has no memory of clients requests.

### ChartGenerator



#### Use Case Examples 
* Change Colors on Scatterplot
``` C# 
```

* Dynamic Creation - no script attached prior execution
``` C# 
```



# TODO
* usage examples
* pictures of usage examples
* Put and unity editor image
* Unity architecture image
* create a big, good example scene
