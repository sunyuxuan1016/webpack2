//如果需要把CSS文件打包进入JS文件，需要在JS文件头部引入此css文件地址
import css from './css/1.css';
import less from './css/black.less';
import sass from './css/scss1.scss';
//import jspang from './eni.js';
//jspang();
{
    document.getElementById('title').innerHTML='8888888';
    let ccc='#9999';
        document.getElementById('titles').style.color=ccc;
}

$("#nav").html("jipangpangpang").css('color','red');
//引入JSON文件
 var json=require("../config.json");
    $("#json").html(json.name+":"+json.url);