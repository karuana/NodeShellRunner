var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var spawn = require("child_process").spawn;
var migration = false;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  socket.on('log', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('migration', function (data) {
                if(!migration) {
                         io.emit('log', "migration start");
                         
                        var src = spawn('/var/www/html/migration-runner/db.init');                       
                        src.stdout.on('data', function (data) {
                           io.emit('log', data.toString());
                        });

                        src.on('exit', function(){
                                migration = false;
                                io.emit('end', "complate");
                        });
                         migration = true;
                } else {
                         io.emit('log', "now migration...");
                }

  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
