(function() {

    const isNodeJS = typeof module !== 'undefined' && typeof module.exports !== 'undefined';

    if (isNodeJS) {
        this.d3 = require('d3');
        this._ = require('underscore');
        this.vega = require("vega");
        this.started = false;
    }


    // TODO: create buffer to keep all specs in memory
    function loadAllData() {

    }

    function formatdata(data){
        delete data.chart;
        let ks = _.keys(data);
        let d = [];

        if (ks.length === 2) { // case of key-value pair, converts to an array of key-value objects
            for (let i = 0; i < data["value"].length; i++)
                d.push({"key": data["key"][i], "value": +data["value"][i]});
        } else if (ks.length === 3) { // case of key-value-category tuplet, converts to an array of key-value-category objects
            for (let i = 0; i < data["value"].length; i++)
                d.push({"key": data["key"][i], "value": +data["value"][i], "category": data["category"][i]});
        }

        return d;
    }

    class ChartGenerator {

        constructor(chartType, dataExternal, selector){
            this.data = formatdata(dataExternal);
            this.chartType = chartType;
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

        async generateChart() {
            let dataraw = await vega.loader()
                .load(this.path + this.chartType + ".json");

            let spec = JSON.parse(dataraw); // retrieve spec from buffer
            spec.data[0].values = this.data;

            return this.render(spec); // returns svg for node, a vega.view for web

        };

        static debug() {
            return 'debug ';
        }

        static formatdata(data_array) {
            return data_array.map((d,i) => { return {"key" : i, "value":d} });
        }
    }

    if (isNodeJS)
        module.exports = ChartGenerator;
    else
        window.ChartGenerator = ChartGenerator;
})();