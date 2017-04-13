var express = require('express');
var sql = require('mssql');
var url = require('url');
var app = express();
var connectstring = "mssql://sa:spiritsql@10.1.8.42/neiscu_centr";

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "index.html" );
});


app.put('/noteupload/*',function(req, res) { 
    var id = url.parse(req.url,true).query.id;
    var text = url.parse(req.url,true).query.text;
    var x = url.parse(req.url,true).query.x;
    var y = url.parse(req.url,true).query.y;
        
    sql.connect(connectstring).then(function() {
        var query = "delete from notes where note_id='" + id + "';insert into notes(note_id,text,x,y) values('" + 
            id + "','" + text + "'," + x + "," + y + ")"; 
        new sql.Request().query(query).then(res.end()).catch(function(err) {
            console.log("Query error: " + err.message);
        });
    }).catch(function(err) {
        console.log("Connection error: " + err.message);
    });
    
    res.end();
});

app.get('/init',function(req, res) {
    /*
   CREATE TABLE notes (
       note_id              char(10) NOT NULL,
       text                 varchar(255) NOT NULL,
       x                    int NOT NULL, 
       y                    int NOT NULL
    )
    go

    ALTER TABLE notes
       ADD PRIMARY KEY (note_id)
    go
    
    // testovacie udaje:
    insert into notes(note_id,text,x,y) values ('note_1','sajt és csomag',100,100)
    go 
    insert into notes(note_id,text,x,y) values ('note_2','Anni baba büdöskéje',300,100)
    go 
    
    // pouziva sa mssql modul verzie 3.3.0 , treba ho stianut pomocou npm install mssql@3.3.0
    */
    
    var data = {};
    data['notes'] = [];
    
    sql.connect(connectstring).then(function() {
        var query = 'select note_id,text,x,y from notes';       
        new sql.Request().query(query).then(function(recordset) {
            if(recordset.length > 0) {
                recordset.forEach(function(record) {
                    var data1 = {};
                    data1["note_id"] = record.note_id.trim();
                    data1["text"] = record.text;
                    data1["x"] = record.x;
                    data1["y"] = record.y;
                    data["notes"].push(data1);
                });
            }
            else {
               console.log("no data"); 
            }
            
            res.end(JSON.stringify(data));
                   
        }).catch(function(err) {
            console.log("Query error: " + err.message);
            res.end();
        });
        
        
    }).catch(function(err) {
        console.log("Connection error: " + err.message);
        res.end();
    });
    
});


var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("nodejsnotes server listening at http://%s:%s", host, port);

});


