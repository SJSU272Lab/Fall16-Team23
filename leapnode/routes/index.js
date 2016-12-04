var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');

var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
  accessKeyId: "AKIAJKSCXBVOQHZE4W2Q",
  secretAccessKey: "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",
  region: "us-west-2", 
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

fs.readFile('./SignCommController.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


  

console.log("Scanning Gestures table.");


// function onScan(err, data) {
//     if (err) {
//         console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         // print all the movies
//         console.log("Scan succeeded.");
//         data.Items.forEach(function(gesture) {
//            console.log(
//                 gesture.gestures);     
           
//         });

//         if (typeof data.LastEvaluatedKey != "undefined") {
//             console.log("Scanning for more...");
//             params.ExclusiveStartKey = data.LastEvaluatedKey;
//             docClient.scan(params, onScan);
//         }
//     }    
// }

var scanGestures = function(gId,callback) {

    var params = {
        TableName: "Gestures",
        ProjectionExpression: "gestures",
        FilterExpression: "#g=:g",
        ExpressionAttributeNames: {
            "#g": "gesture.type",
        },
        ExpressionAttributeValues: {
             ":g": gId
        }
    }; 

    var word;    
    var callScan = function(callback) {    
        docClient.scan(params,function(err,result) {
            if(err) {
                callback(err);
            } else {
                console.log("Scan succeeded.");
                result.Items.forEach(function(gesture) {
                   console.log(
                        gesture.gestures);
                   word = gesture.gestures;        
                   
                });                

                if(result.LastEvaluatedKey) {
                    params.ExclusiveStartKey = result.LastEvaluatedKey;
                    scanExecute(callback);              
                } else {
                    callback(err,word);
                }   
            }
        });
    }
    
    callScan(callback);
};


/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    var actionMade = req.param("actionMade");
    console.log("actionMade" +actionMade);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Content-Type", "text/plain");

    if(actionMade != null){
        scanGestures(actionMade, function(err,result) {
            console.log("result"+result);
            res.send(result);                        
        });
    }
    else{
        res.send("NOT RECOGNIZED");
    }
    
});

module.exports = router;
