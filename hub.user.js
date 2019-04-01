// ==UserScript==
console.time('test');
const TEST = 8;
const READER = 7;
const DEVEL = 6;

const BONUS = 2;
const MONEY = 4200;



var icon_delay = 5;
var _rows = 0;

var table = document.getElementsByTagName('tbody');
const AMOUNT_ROWS = table[0].rows.length- 1;
//var mass = Array();

//Хеш денего по статусам
var st={};

var user = '';
var role = 'dev';
//testGetUser();

IdentifyUser();
GetSum ();

//общее количество
count_total = AMOUNT_ROWS;

sum_total=0;
count_total=0;
for (var z in st ) {
  sum_total+=st[z].s;
  count_total+=st[z].c
}
//console.log(st);

//иконки
icon_delay = table[0].rows[1].cells[0].firstChild.firstChild;
icon_delay = icon_delay.removeAttribute('href');
icon_delay = '';

//инициализация таблицы
var columns_ = 3, td, tr;
var MyBlock = document.createElement('table');
MyBlock.setAttribute("class", "table_col");
MyBlock.setAttribute("id", "resume");
//MyBlock.setAttribute ('style', 'background: #C7DAF0');

for(var i=0; i<Object.keys(st).length+1; i++){
  tr = MyBlock.appendChild(document.createElement('tr'));
  for(var j=0; j<columns_; j++){
    td = tr.appendChild(document.createElement('td'));
    /*if (j=0){td.setAttribute("class", "column_icon")}
    else if (j=1){td.setAttribute("class", "column_status")}
    else {td.setAttribute("class", "column_sum")}*/
    td.style.cssText="font-weight: normal;\
    border-bottom: 2px solid #F5E1A6;\
    border-right: 10px solid white;\
    border-left: 10px solid white;\
    padding: 1px 10px;\
    ";
  }
}
var n=0;
for (var z in st ) {
  MyBlock.rows[n].cells[0].innerHTML = z;
  MyBlock.rows[n].cells[1].innerHTML = st[z].c;
  MyBlock.rows[n].cells[2].innerHTML = st[z].s.toFixed(1);
  n++;
}
MyBlock.rows[n].cells[0].innerHTML = '<strong>Всего</strong>';
MyBlock.rows[n].cells[1].innerHTML = '<strong>'+count_total+'</strong>';
MyBlock.rows[n].cells[2].innerHTML = '<strong>'+sum_total.toFixed(1)+' ('+ (sum_total*MONEY).toFixed(0) +' руб. (Без серебра)</strong>';


// инфо о юзере
var MyBlock2 = document.createElement('div');
MyBlock2.style.cssText="font-weight: normal;\
    border-right: 10px solid white;\
    border-left: 10px solid white;\
    padding: 1px 10px;\
    ";
MyBlock2.style.fontSize = '14px';
MyBlock2.style.fontFamily = '"Lucida Sans Unicode", "Lucida Grande", Sans-Serif';
MyBlock2.style.color = '#8b8e91';
MyBlock2.innerHTML = '<strong>'+user+'</strong>';

//-------вставляем в нужное место на странице
content.insertBefore(MyBlock, content.children[2]);
content.insertBefore(MyBlock2, content.children[2]);

//--------------------------------------
function IdentifyUser(){
  var u1=1,u2=1,u3=1,u_control=0;
  var possible_user1 = GetUsername(1,DEVEL);
  var possible_user2 = GetUsername(1,READER);
  var possible_user3 = GetUsername(1,TEST);
  var elem;
  for (var i=16; i<=AMOUNT_ROWS; i++){
      table[0].rows[i].querySelector('a[title="'+possible_user1+'"]') == null ? u1=0 : u1=1;
      table[0].rows[i].querySelector('a[title="'+possible_user2+'"]') == null ? u2=0 : u2=1;
      table[0].rows[i].querySelector('a[title="'+possible_user3+'"]') == null ? u3=0 : u3=1;
    if(u1+u2+u3==1) {
      //if(!u_control) {u_control++; continue;}
      if(u1) {
        user = possible_user1;
        role='dev';
        return;
      }
      if(u2) {
        user = possible_user2;
        role='dev';
        return;
      }
      if(u3) {
        user = possible_user3;
        role='test';
        return;
      }
      u_control++;
    }
  }
  console.log(user);
 }

//--------------------------------------
function IsUser(cell){
 var username = cell.replace(/(.+)+(:\s.+)/, '$1');
 return (username==user);
}
//------------------------------------
function testGetUser(){
  console.log(GetUsername(12,7,0)); //c цифрами
  console.log(GetUsername(17,6,0)); // с несколькими правильная нода
  console.log(GetUsername(17,6,1)); // с несколькими не правильная нода
  console.log(GetUsername(8,8,0)); //пустая
}
//--------------------------------------
function GetUsername(row,column,node){
  node = node || 0;
  var element = table[0].rows[row].cells[column];
  if (!element.childElementCount) return 0;
  if (!element.childNodes[node].getElementsByTagName('img').length) return 2;
  var name = table[0].rows[row].cells[column].childNodes[node].getAttribute('title');
  //name = name.replace(/(.+)+(:\s.+)/, '$1');
  return name;
}
//--------------------------------------
function GetOneTicketPrice (_rows) {
  var price;

    var bonus = table[0].rows[_rows].cells[2].firstChild.getAttribute('title');
    if (bonus) {
      bonus = bonus.replace(/^([+-]\d+).*/, '$1');
    } else {
      bonus=0;
    }

  switch(role){
    case 'test':
    var element = table[0].rows[_rows].cells[TEST].getElementsByTagName('img');
    if(!element.length) return 0;
    try {
      price = table[0].rows[_rows].cells[TEST].firstChild.firstChild.firstChild.getAttribute('title');
    } catch (err) {
      return 0;
    }
    break;

    case 'dev':
    element = table[0].rows[_rows].cells[DEVEL];
    if (element.childElementCount){
      try {
        price = table[0].rows[_rows].cells[DEVEL].firstChild.firstChild.firstChild.getAttribute('title');
      } catch (err) {
        return 0;
      }
      if(IsUser(price)) break;
      if(table[0].rows[_rows].cells[DEVEL].childNodes.length>2){
        price = table[0].rows[_rows].cells[DEVEL].childNodes[2].firstChild.firstChild.getAttribute('title');
        if(IsUser(price)) break;
      }
    }
    element = table[0].rows[_rows].cells[READER];
    if (element.childElementCount){
      try {
        price = table[0].rows[_rows].cells[READER].firstChild.firstChild.firstChild.getAttribute('title');
      } catch (err) {
        return 0;
      }
      if(IsUser(price)) break;
      if(table[0].rows[_rows].cells[READER].childNodes.length>2){
        try {
          price = table[0].rows[_rows].cells[READER].childNodes[2].firstChild.firstChild.getAttribute('title');
        } catch (err) {
          return 0;
        }
      }
      break;
    }
    else return 0;
  }
  price = price.replace(/(.+:\s)+(\d+)+(,)+(\d+)/, '$2.$4');

  price=parseFloat(price)+parseFloat(price)*bonus/100;

  return +price;
}
//--------------------------------------
function GetSum () {
  var Status;
  for (var i = 1; i<=AMOUNT_ROWS; i++) {
    Status = table[0].rows[i].cells[0].firstChild.firstChild.getAttribute('title');

    if (!(Status in st)) {
      st[Status]={c:1, s: GetOneTicketPrice(i) };
    } else {
      st[Status].c+=1;
      st[Status].s+=GetOneTicketPrice(i);
    }

  }
}
//----------------------------------
console.timeEnd('test');
//стили
MyBlock.style.fontSize = '14px';
MyBlock.style.fontFamily = '"Lucida Sans Unicode", "Lucida Grande", Sans-Serif';
//MyBlock.style.width = '200px';
MyBlock.style.color = '#3E4347';
MyBlock.style.borderCollapse = 'collapse';
MyBlock.style.textAlign = 'left';
//MyBlock.style.borderRight = '10px solid white';
//MyBlock.style.borderLeft = '20px solid white';
//MyBlock.style.padding = '120px 10px';
MyBlock.style.color = '#8b8e91';
//стили отдельным файлом----------------
/*
var css = document.createElement("LINK");
css.rel = "StyleSheet";
css.href = "/style/style.css";
css.type = "text/css";
document.getElementsByTagName("HEAD")[0].appendChild(css);
*/
/*
//рабочий вариант вывода
var MyBlock = document.createElement('div');
var output = '';
if (count_delay){output = '<p>'+icon_delay+'Выдержка('+ count_delay +'):   '+ sum_delay + '</p>'}
if (count_accept){output += '<p>Приёмка('+count_accept+'):   '+ sum_accept +'</p>'}
if (count_work){output += '<p>В работе('+count_work+'):   '+ sum_work +'</p>'}
if (count_test){output += '<p>Тест('+count_test+'):   '+ sum_test +'</p>'}
if (count_trank){output += '<p>В транк('+count_trank+'):  '+ sum_trank +'</p>'}
if (count_pause){output += '<p>На паузе('+count_pause+'):  '+ sum_pause +'</p>'}
MyBlock.innerHTML = output+ '<p><strong>Всего('+ count_total +'):   '+ sum_total +'</strong></p>';
*/
