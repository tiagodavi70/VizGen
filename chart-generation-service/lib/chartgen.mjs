
const isNodeJS = new Function("try {return this===global;}catch(e){return false;}");

import * as d3 from 'd3';
import _ from 'underscore';
import vega from 'vega';
import vl from 'vega-lite';
import fs from 'fs';

// if (isNodeJS) {
//     this._ = require('underscore');
//     this.vega = require("vega");
//     this.vl = require("vega-lite");
//     this.fs = require("fs");
// }

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
            data.push({ "y": +datavector[i][settings.columns["y"]],
                        "x": datavector[i][settings.columns["x"]] ? datavector[i][settings.columns["x"]] : i,
                        "z": datavector[i][settings.columns["z"]] ? datavector[i][settings.columns["z"]] : 0,
                        "w": datavector[i][settings.columns["w"]] ? datavector[i][settings.columns["w"]] : 0});
            
        }
    } else if (datavector["y"]) { // read from url
        has_x = datavector["x"] ? true : false;
        for (let i = 0 ; i < datavector["y"].length ; i++)
            data.push({ "y": +datavector["y"][i],
                        "x": datavector["x"] ? datavector["x"][i] : i,
                        "z": datavector["z"] ? datavector["z"][i] : 0,
                        "w": datavector["w"] ? datavector["w"][i] : 0});
    } else {

    }
    settings.xlabel = has_x || !settings.xlabel ? settings.xlabel : "index"; // if auto-index is used and do not have label 
    
    return data;
}

export default class ChartGenerator {

    constructor(settings, selector){
        this.chartType = settings.charttype;
        this.data = formaturlvector(settings);
        
        this.settings = settings;
        this.selector = settings.svg ? "svg" : "canvas";
        this.path = isNodeJS ? "./html/vega/" : "./vega";
        
        // console.log(settings.svg, this.selector)
        if (isNodeJS) {
            
            this.render = async function(spec) {
                let view = new vega.View(vega.parse(spec))
                    .renderer('svg')        // set renderer (canvas or svg)
                    .initialize();
                if (this.selector === "svg")
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
        let vllist = ["barchartvertical", "linechart", "scatterplot", "areachart", "parallel_coordinates", "heatmap", "piechart"];
        let vlspec = "";
        let spec = {};

        let specfilepath = this.path + this.chartType + ".json";
        let isvlspec = vllist.includes(this.chartType);
            
        if (isvlspec) { // all vega lite specs goes here
            vlspec = JSON.parse(fs.readFileSync(specfilepath).toString());
        } else {
            vlspec = JSON.parse(fs.readFileSync(this.path + "barchartvertical" + ".json").toString());
        }
        vlspec.title = {"text": this.settings["title"], "fontSize": 20};
        // console.log(this.settings)
        if (!_.isEmpty(this.settings.columns) && !["parallel_coordinates", "piechart"].includes(this.chartType)){
            vlspec.data.values = this.settings.data;
            for (let i = 0 ; i < this.data.length ; i++)
                vlspec.data.values[i].index = i;
            vlspec.encoding["x"].field = "index";

            for ( let key of ["x", "y", "z", "w"] ) {
                if (this.settings.columns[key]) {
                    if (key == "z")
                        vlspec.encoding["color"].field = this.settings.columns[key];
                    else if (key == "w")
                        vlspec.encoding["size"].field = this.settings.columns[key];
                    else
                        vlspec.encoding[key].field = this.settings.columns[key];
                } else {
                    if (key == "z")
                        delete vlspec.encoding["color"];
                    else if (key == "w")
                        delete  vlspec.encoding["size"];
                }
            }
            
            vlspec.data.values = vlspec.data.values.map(d => {
                if (this.chartType !== "heatmap")
                    d[this.settings.columns.y] = +d[this.settings.columns.y]; 
                if (this.chartType === "scatterplot") {
                    d[this.settings.columns.x] = +d[this.settings.columns.x]; 
                }
                return d;
            });
        }
        else if (!_.isEmpty(this.settings.fold) && this.chartType === "parallel_coordinates"){
            vlspec.data.values = this.settings.data.map(d => {
                for (let k in d) {
                    if (this.settings.fold.includes(k)) {
                        d[k] = +d[k]
                    }
                }
                return d;
            });
        } else if (this.chartType === "heatmap") {
            vlspec.data.values = this.settings.data;
        } else {
            vlspec.data.values = this.data;
        }

        if (this.settings.filter && this.settings.filter !== "") {
            if (this.settings.filter > 0) {
                vlspec.transform = this.settings.filter.map(d => { return {"filter": d} })
                console.log("aa", vlspec.transform[0]);
            }
            else {
                vlspec.transform = this.settings.filter.map(d => { return {"filter": d} });
            }
        }
        vlspec.config.axis.titleFontSize = 12;
        vlspec.config.axis.labelFontSize = 12;
        vlspec.config.legend.titleFontSize = 12;
        vlspec.config.legend.labelFontSize = 12;
        
        // http://localhost:3000/generate/iris/chartgen.html?chart=parallel_coordinates&fold=sepal_length;sepal_width;petal_width;petal_length&z=iris&title=Iris
        if (!["parallel_coordinates","heatmap", "piechart"].includes(this.chartType) && _.isEmpty(this.settings.fold)){
            for (let axis of ["x", "y"])
                if (vlspec.encoding[axis])
                    vlspec.encoding[axis].title = this.settings[axis+"label"];
            
            if (this.settings["sort"])
                vlspec.encoding["y"].sort = "ascending";

            let data_extent = d3.extent(this.data, (d) => d["y"])
            let diff = (data_extent[1] - data_extent[0]) * 0.05;
            data_extent[0] -= diff;
            data_extent[1] += diff;
            //vlspec.encoding.y.scale = {"domain": data_extent } 
            
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
                vlspec.encoding.color.scale = {"range" : this.settings["colors"]};
            }
            vlspec.config.background = this.settings["background"] ? this.settings["background"] : vlspec.config.background;
        } else {
            if (this.chartType === "parallel_coordinates"){
                vlspec.transform[1].fold = this.settings.fold;
                vlspec.layer[1].encoding.color.field = this.settings.columns.z;
            } else if (this.chartType === "heatmap") {
                // previously deleted
                vlspec.encoding["color"] = {"aggregate": "count", "field": this.settings.columns.x, "type": "quantitative"};
            // http://localhost:3000/chartgen.html?x=orange,pear,pineapple,strawberry&y=1,2,3,4&chart=piechart&title=title    
            } else if (this.chartType === "piechart") { 
                
				vlspec.data.values = this.settings.columns["x"] != undefined ? this.settings.data : this.data;
				// console.log(this.settings)
				
				vlspec.layer[0].encoding = {theta: {"field": this.settings.columns["y"] || "y", "type": "quantitative", "aggregate": "sum"}}; // "y"
				// vlspec.layer[0].encoding.theta.aggregate = "sum";
				// vlspec.layer[0].encoding.theta.type = "quantitative";
                vlspec.layer[0].encoding.color = {field : this.settings.columns["x"] || "x"}; // "x"
				if (this.settings.columns.x != undefined && this.settings.columns.y == undefined) {
					vlspec.layer[0].encoding.theta.field = "y";
					vlspec.layer[0].encoding.theta.aggregate = "count";
					vlspec.data.values = vlspec.data.values.map(d => {
						d.y = 1;
						return d;
					});
				}
				console.log(this.settings)
				vlspec.layer[1].encoding.text =  {"field": vlspec.layer[0].encoding.theta.field, "aggregate": "sum"};
				vlspec.layer[1].encoding.color = {"field": vlspec.layer[0].encoding.color.field, "type": "nominal"},
				vlspec.layer[1].encoding.theta = {"field": vlspec.layer[0].encoding.theta.field, "type": "quantitative", "aggregate": "sum", "stack": true};

				if (this.settings["sort"])
					vlspec.encoding.order = {"field": vlspec.layer[1].encoding.theta.field, "type": "quantitative", "sort": "descending"};
			}
        }
		// console.log(JSON.stringify(vlspec))
        spec = vl.compile(vlspec).spec;

        return this.render(spec); // returns svg or base64 string for node, vega.view for web
    };

    static debug() {
        return 'debug';
    }
}

if (isNodeJS) {
    
} else
    window.ChartGenerator = ChartGenerator;