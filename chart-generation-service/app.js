import express from 'express';
const web_server = express();

// const path = require("path");
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const Busboy = require('busboy');
import Busboy from 'busboy';
// const ChartGenerator = require('./lib/chartgen');
import ChartGenerator from './lib/chartgen.mjs';
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser'; //middleware for parsing POST requisitions
// const d3 = require("d3");
import * as d3 from 'd3';
// const fs = require('fs');
import fs from 'fs';

const pages_path = __dirname + '/html';
let req_list = [];
let  datasets = {};
const web_port = 3000;
let buffer = {}; // simple key value to remember requisitions
buffer.state_key = {}
// web_server.use(busboy());
web_server.use(bodyParser.json());       // to support JSON-encoded bodies
web_server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

function logging(r){
    // console.log("start: " + (+ new Date()))
    // req_list.push("start: " + (+ new Date()))
    // req_list.push(r);
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getBuffer(spec){
    let a = buffer[JSON.stringify(spec)];
    if (a)
        return a;
    else
        return false;
}

function saveBuffer(spec, base64string) {
    if (!buffer[JSON.stringify(spec)]) {
        spec.counter_buffer = Object.keys(buffer).length;
        buffer[JSON.stringify(spec)] = base64string;
    }
}

function getLastBufferKey() {
    let max = -1;
    let last = {}

    for (let s of Object.keys(buffer) ){
        if (IsJsonString(s)){
            let spec = JSON.parse(s);
            if (spec.counter_buffer > max) {
                max = spec.counter_buffer;
                last = spec;
            }
        }
    }
    return JSON.stringify(last);
}

function sendVis(req, res, base64string){
	// console.log(req)
    if (!req.headers['user-agent'].includes("Unity"))
		if (!req.query.svg) {
            if (!req.query.base64) {
                // console.log("<title> Generated Chart </title>" +
                // "<img src='data:image/png;base64," + base64string + "' alt='generated chart'/>");
                res.send("<title> Generated Chart </title>" +
                    "<img src='data:image/png;base64," + base64string + "' alt='generated chart'/>");
            }
		    else {
                res.send(base64string);
            }
        }
    else {
        res.send(base64string);
    }
    // console.log("finish: " + (+ new Date()));
}

function sendVisImg(res, base64string){
    let img = Buffer.from(base64string, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img);
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
    if (url_query["fold"]) parameters.fold = url_query["fold"].split(";");

    // specific configurations - boolean values
    // value labels on visual mark
    for (let key of ["sort", "svg", "base64"] )
        parameters[key] = url_query[key] == "true";

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

function getrow(req) {
    let raw_row = datasets[req.params.dataset][req.params.row_number];
    let row = [];
    for (let key in raw_row) {
        row.push(raw_row[key])
    }
    return row.join(",");
}

web_server.get('/', function (req, res) {
    logging(req.originalUrl);

    res.sendFile(path.join(pages_path + '/index.html'));
});

web_server.get('/debug.txt', function (req, res) {
    logging(req.originalUrl);
    // res.send(req_list.join("</br>"));
});

// Serving webpages
web_server.get('/chartgen.html', function (req, res) {
    logging(req.originalUrl);

    if (isrequisitioncomplete(req)) { // TODO: create function to check by chart type and requirements for each
        let params = clean_get_url(req);

        let buffer_image = getBuffer(params);
        if (buffer_image){
            sendVis(req, res, buffer_image);
        } else {
            let chartgen = new ChartGenerator(params);
            chartgen.generateChart().then( base64string => {
                sendVis(req, res, base64string);
                saveBuffer(params, base64string);
            }).catch((err) => {
                console.error(err);
            });
        }
    } else {
        res.send("Wrong requisition"); // TODO: handle error message by chart type
    }
});

web_server.get('/chartgen.png', function (req, res) {
    logging(req.originalUrl);

    if (isrequisitioncomplete(req)) { // TODO: create function to check by chart type and requirements for each
        let params = clean_get_url(req);

        let buffer_image = getBuffer(params);
        if (buffer_image){
            sendVis(req, res, buffer_image);
        } else {
            let chartgen = new ChartGenerator(params);
            chartgen.generateChart().then(base64string => {
                sendVisImg(res, base64string);
                saveBuffer(params, base64string);
            }).catch((err) => {
                console.error(err);
            });
        }
    } else {
        res.send("Wrong requisition"); // TODO: handle error message by chart type
    }
});

// upload datasets
web_server.post('/upload', function (req, res) {
    logging(req.originalUrl);
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
    logging(req.originalUrl);

    fs.promises.readdir("datasets/").then( files => {
        files = files.map(d => d.slice(0,-4));
        res.send(files.join(","));
    })
});

web_server.get("/attributes/:dataset/", (req, res) => {
    logging(req.originalUrl);

    let dataset_name = req.params.dataset;
    let filepath = "datasets/" + dataset_name + ".csv";
    let data = {};

    fs.readFile(filepath, "utf8", (err, data_raw) => {
        datasets[dataset_name] = d3.csvParse(data_raw);
        data = datasets[dataset_name];
        res.send(Object.keys(data[0]).join(","));
    });
    
});

web_server.get("/metadata/:dataset/", (req, res) => {
    // logging(req.originalUrl);

    let dataset_name = req.params.dataset;
    let filepath = "datasets/" + dataset_name + ".csv";
    let data = {};
    let metadata = {};

    fs.readFile(filepath, "utf8", (err, data_raw) => {
        datasets[dataset_name] = d3.csvParse(data_raw, d3.autoType);
        data = datasets[dataset_name];
        let columns = Object.keys(data[0]);
        let rows = data.length;
        // let meta = {};
        // for (let k of columns) {
        //     // console.log(isNaN(data[0][k]));
        //     meta[k] = !isNaN(data[0][k]) ?
        //         {"type": "numeric", "extent": d3.extent(data, d => d[k])} :
        //         {"type": "categorical", "range": [...new Set(data.map(d => d[k]))]};
        // }
        let meta = [];
        for (let k of columns) {
            // console.log(isNaN(data[0][k]));
            meta.push(!isNaN(data[0][k]) ?
                {"name": k,"type": "numeric", "extent": d3.extent(data, d => d[k])} :
                {"name": k, "type": "categorical", "extent": [...new Set(data.map(d => d[k]))]});
        }
        res.send({"columns": columns, "rows": rows, "meta": meta});
    });
    
});

web_server.get("/save_state/", (req, res) => {
    logging(req.originalUrl);
    buffer.state_key = getLastBufferKey();
    res.send("state saved");
})

web_server.get("/load_state/", (req, res) => {
    logging(req.originalUrl);
    sendVis(req, res, buffer[buffer.state_key]);
})

web_server.get("/row/:dataset/:row_number", (req, res) => {
    logging(req.originalUrl);

    
    let filepath = "datasets/" + req.params.dataset + ".csv";
    fs.readFile(filepath, "utf8", (err, data_raw) => {
        if (err) throw err;

        datasets[req.params.dataset] = d3.csvParse(data_raw);
        res.send(getrow(req))
    });

})

web_server.get("/field/:dataset/:field", (req, res) => {
    logging(req.originalUrl);
    
    let filepath = "datasets/" + req.params.dataset + ".csv";
    fs.readFile(filepath, "utf8", (err, data_raw) => {
        if (err) throw err;
            datasets[req.params.dataset] = d3.csvParse(data_raw);
            
            res.send(datasets[req.params.dataset].map(d => d[req.params.field]).join(","))
    });
})

web_server.get("/generate/:dataset/chartgen.html", function(req, res) {
    logging(req.originalUrl);

    console.log("> Generating chart for: " + req.params.dataset);
    
    let vis_settings = clean_get_url(req, true);
    vis_settings.dataset_name = req.params.dataset;
    
    let buffer_image = getBuffer(vis_settings);
    if (buffer_image) {
        sendVis(req, res, buffer_image);
    } else {
        let filepath = "datasets/" + req.params.dataset + ".csv";
        
        if (datasets[req.params.dataset] ) {
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

web_server.get("/generate/:dataset/chartgen.png", function(req, res) {
    logging(req.originalUrl);

    console.log("> Generating chart for: " + req.params.dataset);
    
    let vis_settings = clean_get_url(req, true);
    vis_settings.dataset_name = req.params.dataset;
    
    let buffer_image = getBuffer(vis_settings);
    if (buffer_image) {
        sendVis(req, res, buffer_image);
    } else {
        let filepath = "datasets/" + req.params.dataset + ".csv";
        
        if (datasets[req.params.dataset] && false) {
            vis_settings.data = datasets[req.params.dataset];
            
            let chartgen = new ChartGenerator(vis_settings);
            chartgen.generateChart().then((base64string) => {
                sendVisImg(res, base64string);
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
                        sendVisImg(res, base64string);
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
