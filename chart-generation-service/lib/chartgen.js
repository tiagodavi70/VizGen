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

            let vlspec = "";
            let spec = "";

            let specfilepath = this.path + this.chartType + ".json";
            if (["scatterplot"].includes(this.chartType)){ // all vega lite specs goes here
                if (isNodeJS) {
                    vlspec = JSON.parse(fs.readFileSync(specfilepath)
                        .toString());
                    spec = vl.compile(vlspec).spec;
                }
            } else {
                spec = await vega.loader().load(specfilepath);
                spec = JSON.parse(spec);
            }

            // change
            if (spec.data[0])
                spec.data[0].values = this.data;
            else
                spec.data.values = this.data; // data - common to all

            if (this.chartType === 'barchartvertical') {

                if (this.settings.colors) {
                    spec.marks[0].encode.update.fill.value = this.settings.colors;
                }
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