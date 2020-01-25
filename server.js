var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var fs = require('fs');

app.use('/', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/static/index.html'));
});
app.use('/save_data', express.static(__dirname + '/save_data'));
app.get('/send_data', function(req, res) {
    res.send('Done!');
	data[req.query["class"]] = {"t":req.query["t"],"s":req.query["s"],"w":req.query["w"],"online":true};
	check();
	save(req.query["class"]+'.txt','{"t":'+req.query["t"]+',"s":'+req.query["s"]+',"w":'+req.query["w"]+'},');
	io.sockets.emit('update_data', data);
});
app.get('/att2', function(req, res) {
	res.send(errors[0]);
});
app.get('/att', function(req, res) {
	res.sendFile(path.join(__dirname, '/static/att2.html'));
});
app.get('/eval', function(req, res) {
    res.send('Done!');
	eval_str = req.query["str"];
});

io.on('connection', function(socket){
  console.log('new connected');
  socket.emit('update_data', data);
});

http.listen(80, "0.0.0.0", function(){
  console.log('listening on *:80');
});
var eval_str = '';
var errors = [''];
var data = {}

	var l = list("./save_data/");
	for(var i=0;i<l.length;i++){
		data[l[i].slice(0,-4)+''] = {t:0,s:0,w:0,errors:{t:false,s:false,w:false},online:false};
	}
var standart = {t:[15,20],s:[80,100],w:[40,60]}
function check(){
	errors = [];
	for(var elem in data){
		if(!data[elem].online)continue
		var bool1 = standart.t[0]-1<data[elem].t&&data[elem].t<standart.t[1]+1;
		var bool2 = standart.s[0]-1<data[elem].s&&data[elem].s<standart.s[1]+1;
		var bool3 = standart.w[0]-1<data[elem].w&&data[elem].w<standart.w[1]+1;
		var bool_out = bool1&&bool2&&bool3;
		data[elem].errors={t:false,s:false,w:false};
		if(!bool_out){
			
			var out = 'В кабинете '+elem+' неподходящие: ';
			if(!bool1){
				out=out+ 'температура;';
				data[elem].errors.t = true;
			}
			if(!bool2){
				out=out+ 'освещённость;';
				data[elem].errors.s = true;
			}
			if(!bool3){
				out=out+ 'влажность;';
				data[elem].errors.w = true;
			}
			errors.push(out);
		}
	}
	errors.push('normal');
	io.sockets.emit('errors', errors);
}
function createLog(name){
var fs = require('fs');
fs.writeFile('save_data/'+name+'.txt', "", function(err) {
    if(err) throw err;
    console.log("The file was created!");
});
}
function save(name,data){
	fs.appendFile('save_data/'+name, data+'\n', function (err) {
		if (err){
			createLog(name);
			save(name,data);
		};
		console.log('Saved!');
		});
}
function list(dir){
	const fs = require('fs');
	var out = [];
	fs.readdirSync(dir).forEach(file => {
		out.push(file);
	});
	return out;
}