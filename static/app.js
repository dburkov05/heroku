var default_color = 'rgb(255,255,255)';
var error_color = 'rgb(255,0,0)';

var table = document.getElementById("data");
function dtr(data,name){
	var out = document.createElement("tr");
	out.innerHTML += "<td onclick='draw("+'"'+name+'"'+");'>"+name+"</td>";
	for(var key in data){
		if(key=='errors')continue
		color = default_color;
		if(data.errors[key])color = error_color;
		out.innerHTML += "<td style='background-color:"+color+"'>"+data[key]+"</td>";
	}
	return out
}

var socket = io();
var data = {};

socket.on('update_data', function(r_data) {
	data = r_data;
	print(data);
});
socket.on('eval', function(str) {
	eval(str);
});
var default_table = "<caption>Показания датчиков</caption><tr><th>Кабинет</th><th>Температура</th><th>Освещённость</th><th>Влажность</th><th>Онлайн</th></tr>";
function print(data){
table.innerHTML = default_table;
for(var key in data){
	table.appendChild(dtr(data[key],key));
}
}

function gethistory(name){
var xhr = new XMLHttpRequest();
xhr.open('GET', 'save_data/'+name+'.txt', false);
xhr.send();
if (xhr.status != 200) {
  alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
  return xhr.status + ': ' + xhr.statusText;
}
console.log('Кабинет: '+name);
inp = JSON.parse('{"data":['+xhr.responseText.slice(0,-2)+']}').data;
data = [];
for(var i=0;i<inp.length;i++){
	data.push(inp[i]);
}
return data;
}
function parser_1(data,types){//types=['test1','test2']
	var out = {};
	for(var i=0;i<types.length;i++){
		out[types[i]] = [];
	}
	for(var i=0;i<data.length;i++){
		var elem = data[i];
		for(var key in elem){
			out[key].push(elem[key]);
		}
	}
	var out2 = [];
	for(var key in out){
		out2.push(out[key]);
	}
	return out2;
}

function range(len){
	var out = [];
	for(var i=0;i<len;i++){
		out.push(i+'');
	}
	return out;
}
var count = 144;
function parser_2(arr,count){
	var out = [];
	for(var line=0;line<arr.length;line++){
		var arr2 = [];
		for(var i=0;i<count;i++){
			arr2.push(arr[line][i]);
		}
		out.push(arr2);
	}
	return out;
}
function draw(name){
/* var options = {
  width: 500,
  height: 500
}; 
// Инициализируем линейный график через контейнер с ID chart1
  new Chartist.Line('#grafik1', {
    labels: range(144),//[1,2,3,4]
    series: data
  },options); */
var chart = new Chartist.Line('#grafik1', {
  labels: range(count),//['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  series: parser_2(parser_1(gethistory(name),['s','w','t']),count)
}, {
  fullWidth: true,
  chartPadding: {
    right: 40
  }
});
var colors = ['#ecec24','#149dfff2','rgb(255,0,0)'];
chart.on('draw', function(context) {
	if(context.type!='point'&&context.type!='line')return
    context.element.attr({
      style: 'stroke: '+colors[context.seriesIndex]+';'
    });
});
}

