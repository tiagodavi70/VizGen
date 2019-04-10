const web_server = require('express')();
const path = require("path");
const pages_path = __dirname + '/html';
const ChartGenerator = require('./lib/chartgen');

const web_port = 3000;

function cleangeturl(req){
    //console.log(req.query);
    let params = req.query;
    let d = [];
    d.data = {};
    d.charttype = params.chart;

    // value based configurations
    for ( let key of ["x","y","z","w"] ) // key, value, category1, category2 (x,y,color,size?)
        if (params[key])
            d.data[key] = params[key].split(",").map((d)=> isNaN(+d)?d:+d); // parse for number or not

    if (params["colors"])
        d.colors = params["colors"].split(";");

    // specific configurations - boolean values
    // value labels on visual mark
    for (let key of ["showlabels", "legends", "sort"] )
        //if (params[key])
            d[key] = params[key] === true;

    // specific configurations - categoric values
    // interpolation
    for (let key of ["interpolation","title","xlabel","ylabel","zlabel","wlabel"] )
        if (params[key]) d[key] = params[key];

    // specific configurations - numeric values
    // interpolation
    for (let key of ["inner", "padding"] )
        if (params[key]) d[key] = +params[key];

    return d;
}

function isrequisitioncomplete(req){
    // check if has chartype
    // check if has the right dimensions, and if they are coordinated in values (same size)
    //
    return true;
}

// Serving webpages
web_server.get('*', function (req, res) {

    if (req.url === '/'){
        res.sendFile(path.join(pages_path + '/index.html'));
    }
    else if (req.url.startsWith('/chartgen.html')) {
        if (isrequisitioncomplete(req)) { // TODO: create function to check by chart type and requirements for each
            let params = cleangeturl(req);
            let chartgen = new ChartGenerator(params);
            chartgen.generateChart().then((base64string) => {
                if (!req.headers['user-agent'].includes("Unity"))
                    res.send("<title> Generated Chart </title>" +
                        "<img src='data:image/png;base64," + base64string + "' alt='generated chart'/>");
                else
                    res.send(base64string);
            }).catch((err) => {
                console.error(err);
            });
        } else {
            res.send("Wrong requisition"); // TODO: handle error message by chart type
        }
    }
    else {
        res.sendFile(path.join(pages_path + req.url));
    }
});

web_server.listen(web_port, function () {
    console.log('Web Server for chart generation started listening on port: ' + web_port);
});


//console.log(ChartGenerator.formatdata([1, 2, 3, 4, 67, 7]));