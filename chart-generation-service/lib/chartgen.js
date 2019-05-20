(function() {

    const isNodeJS = typeof module !== 'undefined' && typeof module.exports !== 'undefined';

    if (isNodeJS) {
        this.d3 = require('d3');
        this._ = require('underscore');
        this.vega = require("vega");
        this.vl = require("vega-lite");
        this.fs = require("fs");
    }

    // TODO: create buffer to keep all specs in memory
    function loadAllData() {

    }

    function formatdata(datavector) {
        let dataformatted = [];

        for (let i = 0 ; i < datavector["x"].length ; i++)
            dataformatted.push({"x":datavector["x"][i],
                                "y":datavector["y"] ? datavector["y"][i] : 0,
                                "z":datavector["z"] ? datavector["z"][i] : 0,
                                "w":datavector["w"] ? datavector["w"][i] : 0});
        return dataformatted;
    }

    class ChartGenerator {

        constructor(dataExternal, selector){
            this.chartType = dataExternal.charttype;
            this.data = formatdata(dataExternal.data);
            this.settings = dataExternal;
            this.selector = selector;
            this.path = isNodeJS ? "./html/vega/" : "./vega";


            if (isNodeJS){
                const fs = require('fs');
                this.render = async function(spec) {
                    let view = new vega.View(vega.parse(spec))
                        .renderer('svg')        // set renderer (canvas or svg)
                        .initialize();
                    if (selector === "svg")
                        return await view.toSVG().catch((err) => {console.error(err);}); // return svg string

                    let canvas =  await view.toCanvas().catch((err) => {console.error(err);}); // return canvas stream

                    return canvas.toDataURL().split("base64,")[1];
                };
            } else {
                this.render = (spec) => {
                    return new vega.View(vega.parse(spec))
                        .renderer('svg')            // set renderer (canvas or svg)
                        .initialize(this.selector)  // initialize view within parent DOM container
                        .hover()                    // enable hover encode set processing
                        .run();
                };
            }
        };

        // call this function to generate the charts
        async generateChart() {
            console.log("Required: " + this.chartType);

            let vllist = ["barchartvertical","linechart","scatterplot","areachart"];
            let vlspec = "";
            let spec = {};

            let specfilepath = this.path + this.chartType + ".json";
            let isvlspec = vllist.includes(this.chartType);

            if (isvlspec) { // all vega lite specs goes here
                if (isNodeJS) {
                    vlspec = JSON.parse(fs.readFileSync(specfilepath)
                        .toString());

                    vlspec.title = {"text":this.settings["title"], "fontSize": 20};
                    vlspec.data.values = this.data;
                    for (let axis of ["x","y"])
                        if (vlspec.encoding[axis])
                            vlspec.encoding[axis].title = this.settings[axis+"label"];

                    let vlaxis = ["color","size"];
                    let extradim = ["z","w"];
                    for (let i = 0 ; i < vlaxis.length ; i++)
                        if (vlspec.encoding[vlaxis[i]])
                            vlspec.encoding[vlaxis[i]].title = this.settings[extradim[i]+"label"];

                    if (this.settings["colors"]){
                        // single color encondings
                        if (this.chartType === "barchartvertical") {
                            vlspec.encoding.color.value = this.settings["colors"];
                        }
						//console.log(this.settings["colors"]);
						vlspec.encoding.color.scale = {"range" : this.settings["colors"]};
                    }
					spec.config.background = this.settings["background"] ? this.settings["background"] : spec.config.background;
                    spec = vl.compile(vlspec).spec;
                }
            } else {
                spec = await vega.loader().load(specfilepath);
                spec = JSON.parse(spec);
                spec.data[0].values = this.data;

                if (this.chartType === "piechart") {
					spec.scales[0].range = this.settings["colors"];
                }
				
				spec.background = this.settings["background"] ? this.settings["background"] : spec.background;
                spec.title = this.settings["title"];
            }
            return this.render(spec); // returns svg or base64 string for node, vega.view for web
        };

        static debug() {
            return 'debug ';
        }
    }

    if (isNodeJS)
        module.exports = ChartGenerator;
    else
        window.ChartGenerator = ChartGenerator;
})();