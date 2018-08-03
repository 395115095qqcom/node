//import { isNull } from 'util';

var express = require('express');
var url = require('url');
var util = require('util');
var app = express();


//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//  主页输出 "Hello World"
app.get('/', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("主页 GET 请求" + myDate);
    res.send('Hello GET');
})


//  POST 请求
app.post('/', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("主页 POST 请求" + myDate);
    res.send('Hello POST');
})

//  /del_user 页面响应
app.get('/del_user', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("/del_user 响应 DELETE 请求" + myDate);
    res.send('删除页面');
})


app.get('/bj', function (req, res) {
    // 解析 url 参数
    //var params = url.parse(req.url, true).query;
    //console.log(params.name)
    // 输出 JSON 格式
    //var response = "";
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("bj:"+myDate);
    // redis 链接  
    var redis = require('redis');
    var client = redis.createClient('6379', '127.0.0.1');

    // redis 链接错误  
    client.on("error", function (error) {
        console.log("error:" + error);
    });
    // //取值  
    client.select('0', function (error) {
        if (error) {
            console.log(error);
        } else {
            // get  
            client.get("topic2", function (error, ress) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("ok_bj");
                    //var json_c = JSON.stringify(ress);
                    //console.log(ress);
                    var list = ress.split(';');
                    //console.log(list[136].toString("hex"));
                    var x1 = ("0x" + list[136]);
                    var str = '10';
                    var len = parseInt(str, 16);//parseInt第二个参数表示str原来的进制
                    //len=35
                    console.log(len)
                    var buf = new Buffer(5);
                    //console.log(buf);//<Buffer e0 f7 1d 01 00>
                    buf.fill(3);
                    console.log(buf.toString("binary"));//<Buffer 00 00 00 00 00>

                    //var buf = new Buffer('0x'+list[136]);
                    //console.log(buf);
                    //console.log(Number(“”0xFD“));
                    //res.send(list[136]);
                    //res.send(JSON.stringify(ress));
                }
                // 关闭链接  
                client.end(true);
            });
        }
    });
})
// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function (req, res) {
    console.log("/ab*cd GET 请求");
    res.send('正则匹配');
})

//  Aitem 页面 GET 请求得到DTU 实时数据
app.get('/Aitem', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("dtufromredis：" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof (params) == 'undefined' || typeof (params.name) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
    // 输出 JSON 格式
    var response = "";

    // redis 链接  
    var redis = require('redis');
    var client = redis.createClient('6379', '127.0.0.1');

    // redis 链接错误  
    client.on("error", function (error) {
        console.log("rediserror:" + error);
    });
    // //取值  
    try {
        client.select('0', function (error) {
            if (error) {
                console.log(error);
            } else {
                // get  

                client.get(params.name, function (error, ress) {
                    if (error) {
                        console.log(error);
                    } else {
                        //console.log(ress);
                        //response = ress;
                        if (ress == null || ress == undefined || ress == "") {
                            res.send("0");
                        } else
                            res.send(JSON.parse(ress));
                    }
                    // 关闭链接  
                    client.end(true);
                    //client.quit();
                });
            }
        });
    } catch (err) {
        res.send("00");
    }
})

// 手机APP专用  页面 GET 请求得到DTU 实时数据
app.get('/DTU_APP', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("DTU_APP:" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof (params) == 'undefined' || typeof (params.name) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
    // 输出 JSON 格式
    var response = "";

    // redis 链接  
    var redis = require('redis');
    var client = redis.createClient('6379', '127.0.0.1');

    // redis 链接错误  
    client.on("error", function (error) {
        console.log("rediserror:" + error);
    });
    // //取值  
    try {
        client.select('0', function (error) {
            if (error) {
                console.log(error);
            } else {
                // get  

                client.get(params.name+"_hex", function (error, ress) {
                    if (error) {
                        console.log(error);
                    } else {
                        //console.log(ress);
                        //response = ress;
                    
                        if (ress == null || ress == undefined || ress == "") {
                            res.send("0");
                        } else
                            //var arr_ress  = new Array()
                            //arr_ress= ress.split(',')
                            //console.log(arr_ress.length)
                            res.send(JSON.parse(ress));
                    }
                    // 关闭链接  
                    client.end(true);
                    //client.quit();
                });
            }
        });
    } catch (err) {
        res.send("00");
    }
})
app.get('/Bitem', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("bjfromredis：" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    
    // 输出 JSON 格式
    var response = "";

    // redis 链接  
    var redis = require('redis');
    var client = redis.createClient('6379', '127.0.0.1');
    //var client1 = redis.createClient({ host: '127.0.0.1', port: 6379, no_ready_check: true });

    // redis 链接错误  
    client.on("error", function (error) {
        console.log("rediserror:" + error);
    });
    var arr = new Array("topic1", "topic2");
    console.log(arr[1]);
    client.select('0', function (error) {
        if (error) {
            console.log(error);
        } else {
            // get  
            client.get(arr[1], function (error, ress) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("ok");
                    //response = ress;
                    res.send(JSON.parse(ress));
                }
                // 关闭链接  
                client.end(true);
                //client.quit();
            });
        }
    });
})
var server = app.listen(8082, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

