(function() {

    const isNodeJS = typeof module !== 'undefined' && typeof module.exports !== 'undefined';

    if (isNodeJS) {
        this.d3 = require('d3');
        this._ = require('underscore');
        this.vega = require("vega");
        this.vl = require("vega-lite");
        this.fs = require("fs");
    }

    function cast(d){
        return isNaN(+d)?d:+d
    }

    function formaturlvector(settings) {
        // console.log(settings);
        let data = [];
        let datavector = settings.data;
        let has_x = true;
        // console.log(settings.columns)
        if (!_.isEmpty(settings.columns)) { // read from dataset
            has_x = settings.columns["x"] ? true : false;
            for (let i = 0 ; i < datavector.length ; i++) {
                // let temp = {"y": +datavector[i][settings.columns["y"]]};
                // if (settings.columns["x"]) 
                //     temp["x"] = cast(datavector[i][settings.columns["x"]]);
                // else 
                //     temp["x"] = i;
                // if (settings.columns["z"]) temp["z"] = cast(datavector[i][settings.columns["z"]]);
                // if (settings.columns["w"]) temp["w"] = cast(datavector[i][settings.columns["w"]]);                
                // data.push(temp);            
                data.push({ "y": datavector[i][settings.columns["y"]],
                            "x": datavector[i][settings.columns["x"]] ? datavector[i][settings.columns["x"]] : i,
                            "z": datavector[i][settings.columns["z"]] ? datavector[i][settings.columns["z"]] : 0,
                            "w": datavector[i][settings.columns["w"]] ? datavector[i][settings.columns["w"]] : 0});
                
            }
        } else { // read from url
            has_x = datavector["x"] ? true : false;
            for (let i = 0 ; i < datavector["y"].length ; i++)
                data.push({ "y": datavector["y"][i],
                            "x": datavector["x"] ? datavector["x"][i] : i,
                            "z": datavector["z"] ? datavector["z"][i] : 0,
                            "w": datavector["w"] ? datavector["w"][i] : 0});
        }
        settings.xlabel = has_x || !settings.xlabel ? settings.xlabel : "index"; // if auto-index is used and do not have label 
        
        return data;
    }

    class ChartGenerator {

        constructor(settings, selector){
            this.chartType = settings.charttype;
            this.data = formaturlvector(settings);
            this.settings = settings;
            this.selector = selector;
            this.path = isNodeJS ? "./html/vega/" : "./vega";

            if (isNodeJS) {
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

            let vllist = ["barchartvertical", "linechart", "scatterplot", "areachart"];
            let vlspec = "";
            let spec = {};

            let specfilepath = this.path + this.chartType + ".json";
            let isvlspec = vllist.includes(this.chartType);

            if (isvlspec) { // all vega lite specs goes here
                if (isNodeJS) {
                    vlspec = JSON.parse(fs.readFileSync(specfilepath).toString());
                    vlspec.title = {"text": this.settings["title"], "fontSize": 20};
                    vlspec.data.values = this.data;
                    vlspec.config.axis.titleFontSize = 12;
                    vlspec.config.axis.labelFontSize = 12;
                    vlspec.config.legend.titleFontSize = 12;
                    vlspec.config.legend.labelFontSize = 12;

                    for (let axis of ["x", "y"])
                        if (vlspec.encoding[axis])
                            vlspec.encoding[axis].title = this.settings[axis+"label"];
                    
                    let data_extent = d3.extent(this.data, (d) => d["y"])
                    let diff = (data_extent[1] - data_extent[0]) * 0.05;
                    data_extent[0] -= diff;
                    data_extent[1] += diff;
                    vlspec.encoding.y.scale = {"domain": data_extent } 

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
					vlspec.config.background = this.settings["background"] ? this.settings["background"] : vlspec.config.background;
                    spec = vl.compile(vlspec).spec;
                }
            } else {
                spec = await vega.loader().load(specfilepath);
                spec = JSON.parse(spec);
                spec.data[0].values = this.data;

                if (this.chartType === "piechart") {
					spec.scales[0].range = this.settings["colors"] ? this.settings["colors"] : spec.scales[0].range;
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