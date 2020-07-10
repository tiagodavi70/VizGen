const web_server = require('express')();
const path = require("path");
const Busboy = require('busboy');
const pages_path = __dirname + '/html';
const ChartGenerator = require('./lib/chartgen');
const bodyParser = require('body-parser'); //middleware for parsing POST requisitions
const d3 = require("d3");
const fs = require('fs');

let  datasets = {};
const web_port = 3000;
let buffer = {}; // simple key value to remember requisitions

// web_server.use(busboy());
web_server.use(bodyParser.json());       // to support JSON-encoded bodies
web_server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

function getBuffer(spec){
    let a = buffer[JSON.stringify(spec)];
    if (a)
        return a;
    else
        return false;
}

function saveBuffer(spec, base64string) {
    buffer[JSON.stringify(spec)] = base64string;
}

function sendVis(req, res, base64string){
    if (!req.headers['user-agent'].includes("Unity"))
        res.send("<title> Generated Chart </title>" +
            "<img src='data:image/png;base64," + base64string + "' alt='generated chart'/>");
    else
        res.send(base64string);
}

function clean_get_url(req, dataset_mode=false){
    // console.log(req.query);
    let url_query = req.query;
    let parameters = {};
    parameters.data = {};
    parameters.columns = {};
    parameters.charttype = url_query.chart;

    // value based configurations
    for ( let key of ["x", "y", "z", "w"] ) // key, value, category1, category2 (x,y,color,size?)
        if (url_query[key]) {
            if (!dataset_mode) // if it is not to recover data from dataset, returns formated data vector
                parameters.data[key] = url_query[key].split(",").map((d)=> isNaN(+d)?d:+d); // parse for number or not
            else // columns of dataset to mapping
                parameters.columns[key] = url_query[key].split(' ').join('');
        }

    if (url_query["colors"]) parameters.colors = url_query["colors"].split(";");

    // specific configurations - boolean values
    // value labels on visual mark
    for (let key of ["sort"] )
        parameters[key] = url_query[key] === true;

    // specific configurations - categoric or single color values
    for (let key of ["interpolation", "title", "xlabel", "ylabel", "zlabel", "wlabel", "background"] )
        if (url_query[key])
            parameters[key] = url_query[key];
        else if (dataset_mode && ["xlabel", "ylabel", "zlabel", "wlabel"].includes(key)){
            parameters[key] = parameters.columns[key[0]];
        }

    // specific configurations - numeric values
    for (let key of ["inner", "padding"] )
        if (url_query[key]) parameters[key] = +url_query[key];
    
    if (url_query["filter"])
        parameters["filter"] = JSON.parse(url_query["filter"].split(' ').join(''))

    return parameters;
}

function isrequisitioncomplete(req){
    // check if has chartype
    // check if has the right dimensions, and if they are coordinated in values (same size)
    //
    return true;
}

web_server.get('/', function (req, res) {
    res.sendFile(path.join(pages_path + '/index.html'));
});


// Serving webpages
web_server.get('/chartgen.html', function (req, res) {

    if (isrequisitioncomplete(req)) { // TODO: create function to check by chart type and requirements for each
        let params = clean_get_url(req);

        let buffer_image = getBuffer(params);
        if (buffer_image){
            sendVis(req, res, buffer_image);
        } else {
            let chartgen = new ChartGenerator(params);
            chartgen.generateChart().then((base64string) => {
                sendVis(req, res, base64string);
                saveBuffer(params, base64string);
            }).catch((err) => {
                console.error(err);
            });
        }
    } else {
        res.send("Wrong requisition"); // TODO: handle error message by chart type
    }
    
    // else {
    //     res.sendFile(path.join(pages_path + req.url));
    // }
});


// upload datasets
web_server.post('/upload', function (req, res) {
    // console.log(req.body);
    var busboy = new Busboy({ headers: req.headers });

    busboy.on('error', function(err) {
        console.log(err);
    });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log("Encoding: " + encoding);
        console.log('Uploading: ' + filename);
        file.pipe(fs.createWriteStream("./datasets/" + filename));
    });
    busboy.on('finish', function() {
        console.log('Upload complete');
        res.writeHead(200, { 'Connection': 'close' });
        res.end("Upload complete");
    });
    return req.pipe(busboy);
});


web_server.get("/info.html", function(req, res) {
    fs.promises.readdir("datasets/").then( files => {
        files = files.map(d => d.slice(0,-4));
        res.send(files.join(","));
    })
});


web_server.get("/attributes/:dataset/", (req, res) => {

    let dataset_name = req.params.dataset;
    let filepath = "datasets/" + dataset_name + ".csv";
    let data = {};

    if (datasets[dataset_name]) {
        data = datasets[dataset_name];
        res.send(Object.keys(data[0]).join(","));
    } else {
        fs.readFile(filepath, "utf8", (err, data_raw) => {
            datasets[dataset_name] = d3.csvParse(data_raw);
            data = datasets[dataset_name];
            res.send(Object.keys(data[0]).join(","));
        });
    }
});

web_server.get("/generate/:dataset/chartgen.html", function(req, res) {
    console.log("Generating chart for: " + req.params.dataset);
    
    let vis_settings = clean_get_url(req, true);
    vis_settings.dataset_name = req.params.dataset;
    
    let buffer_image = getBuffer(vis_settings);
    if (buffer_image) {
        sendVis(req, res, buffer_image);
    } else {
        let filepath = "datasets/" + req.params.dataset + ".csv";
        
        if (datasets[req.params.dataset]) {
            vis_settings.data = datasets[req.params.dataset];
            
            let chartgen = new ChartGenerator(vis_settings);
            chartgen.generateChart().then((base64string) => {
                sendVis(req, res, base64string);
                saveBuffer(vis_settings, base64string);
            }).catch((err) => {
                console.error(err);
            });
        } else {
            fs.readFile(filepath, "utf8", (err, data_raw) => {
                if (err) throw err;
                
                    vis_settings.data = d3.csvParse(data_raw);
                    datasets[req.params.dataset] = vis_settings.data;
    
                    let chartgen = new ChartGenerator(vis_settings);
                    chartgen.generateChart().then((base64string) => {
                        sendVis(req, res, base64string);
                        saveBuffer(vis_settings, base64string);
                    }).catch((err) => {
                        console.error(err);
                    });
            });
        }
    } 
});

web_server.listen(web_port, function () {
    console.log('Web Server for chart generation started listening on port: ' + web_port);
});
