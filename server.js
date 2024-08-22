const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const exp = require("constants");
const https = require("https");
const { METHODS } = require("http");
const { resolveNaptr } = require("dns");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/Sign-Up.html");
})

app.post("/", function(req, res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    
    console.log(req.statusCode);
    

    if(req.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
    }
    else{
        res.sendFile(__dirname + "/failure.html");
    }

    var data = {
        members: [{           
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }]

    }

    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/e959d043df";
    const Options = {
        method: "POST",
        auth: "yonauth:" + process.env.API_KEY
    }

    const requestt = https.request(url, Options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
            
        })

    })

    requestt.write(jsonData);
    requestt.end();



    
})

app.post("/failure", function(req, res){
    res.redirect("/");
})



app.listen(process.env.PORT ||  3000, function(){
    console.log("Server started on port 3000");
})
    

