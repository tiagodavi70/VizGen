const web_server = require('express')();
const path = require("path");
const pages_path = __dirname + '/html';
const ChartGenerator = require('./lib/chartgen');

const web_port = 3000;

function cleangeturl(req){
    let params = req.query;
    for ( let key of ["value","key","category"] )
        if (params[key])
            params[key] = params[key].split(",");
    return params;
}

// Serving webpages
web_server.get('*', function (req, res) {

    if (req.url === '/'){
        res.sendFile(path.join(pages_path + '/index.html'));
    }
    else if (req.url.startsWith('/chartgen.html')) {
        let params = cleangeturl(req);
        let chartgen = new ChartGenerator(params.chart,params);
        chartgen.generateChart().then((base64string) => {
            res.send(base64string);
        }).catch((err) => {console.error(err);});
    }
    else {
        res.sendFile(path.join(pages_path + req.url));
    }
});

web_server.listen(web_port, function () {
    console.log('Web Server listening on port: ' + web_port);
});


//console.log(ChartGenerator.formatdata([1, 2, 3, 4, 67, 7]));