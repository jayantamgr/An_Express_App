var Request = require('request');
var express =  require('express');

var app = express();

app.set('view engine', 'ejs')

var apiURL = "https://webdevbootcamp-jay-jayantamgr.c9users.io/api/risks"

app.get('/', function(req,res){
	Request(apiURL, function(error, response, body) {
        if(error)
        {
            return console.dir(error);
        }
        var apiDataParseLive = JSON.parse(body);
        
        let highImpact = Math.max.apply(Math, apiDataParseLive.map(i => i.impact));
        let highImpactTitle = apiDataParseLive.sort((a,b)=>b.impact-a.impact)[0].title;
        let lowImpact = Math.min.apply(Math, apiDataParseLive.map(i => i.impact));
        
        let dictionaryRPZ = [];
        
        function addingRPZ(RiskName, RPZ){
            dictionaryRPZ.push({RiskName, RPZ});
        }
        
        apiDataParseLive.forEach(function(apiItems){
            var RPZ = apiItems.impact * apiItems.propability;
            addingRPZ(apiItems.title, RPZ);

        });
        let highestRPZtitle = dictionaryRPZ.sort((a,b)=>b.RPZ-a.RPZ)[0].RiskName;
        let highestRPZ = dictionaryRPZ.sort((a,b)=>b.RPZ-a.RPZ)[0].RPZ;
        let lowestRPZtitle = dictionaryRPZ.sort((a,b)=>a.RPZ-b.RPZ)[0].RiskName;
        let lowestRPZ = dictionaryRPZ.sort((a,b)=>a.RPZ-b.RPZ)[0].RPZ;
        
        /*var reformattedArray = dictRPZ.map(obj =>{ 
            var rObj = {};
            rObj[obj.RiskName] = obj.RPZ;
            return rObj;
        });*/

        var riskDetailsToDisplay = {
            hImpact : highImpact,
            hImpactT : highImpactTitle,
            hRPZ : highestRPZ.toFixed(2),
            hRPZt : highestRPZtitle,
            lRPZ : lowestRPZ.toFixed(2),
            lRPZt : lowestRPZtitle
        };

        var riskDetailsToRender = {riskDetailsToDisplay : riskDetailsToDisplay};

        res.render('pages/risk', riskDetailsToRender);
        
    });
    

});

app.get('/table', function(req,res){
	Request(apiURL, function(error, response, body) {
        if(error)
        {
            return console.dir(error);
        }
        var apiDataParseTable = JSON.parse(body);
 		
		res.render('pages/table', {apiDataParseTable : apiDataParseTable});
        
		});

});

app.get('/live', function(req,res){
	Request(apiURL, function(error, response, body) {
        if(error)
        {
            return console.dir(error);
        }
        var apiDataParseGraph = JSON.parse(body);
 		
 		let dictionaryRPZgraph = [];

 		function addingRPZforGraph(RiskTitle, RPZ){
            dictionaryRPZgraph.push({RiskTitle, RPZ});
        }

 		apiDataParseGraph.forEach(function(forGraphItems){
 			var RPZforGraph = forGraphItems.impact * forGraphItems.propability;
 			addingRPZforGraph(forGraphItems.title, RPZforGraph);
 		});

 		var RPZarray = [];
        var RPZmean = [];
        dictionaryRPZgraph.forEach(function(risks){ 
            RPZarray.push(risks.RPZ)
         }) 

        for(var i = 2; i < RPZarray.length; i++)
        {
            var mean = (RPZarray[i] + RPZarray[i-1] + RPZarray[i+1])/3.01;			
            RPZmean.push(mean);
        }

        var RPZmoveAveLive = {
            RPZave : RPZmean,
            RPZlist : RPZarray,
        };

        console.log(RPZmoveAveLive);

		res.render('pages/live', {RPZmoveAveLive : RPZmoveAveLive});
        
		});

});

app.listen(8080);

console.log("Listening on port: 8080"); 