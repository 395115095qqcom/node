var express = require('express');
var url = require('url');
var util = require('util');
var app = express();
const sql = require('mssql');//声明插件1
var moment = require('moment');
var bodyParser = require("body-parser");  

//app.use(express.static('wwwroot'));
app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json())

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
//  Aitem 页面 GET 请求得到用户信息
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
    // //取值  1号库 权限库 
    try {
        client.select('1', function (error) {
            if (error) {
                console.log(error);
            } else {
                // get  

                client.get("user", function (error, ress) {
                    if (error) {
                        console.log(error);
                    } else {
                        //console.log(ress);
                        //response = ress;
                        if (ress == null || ress == undefined || ress == "") {
                            res.send("0");
                            //console.log(ress);
                        } else
                            var obj = JSON.parse(ress)
                            for(var i=0;i<obj.length;i++){
                                if(params.name==obj[i].name){
                                    console.log(obj[i]);
                                    res.send(obj[i]);  
                                }
                            }
                                //res.send(JSON.parse(ress)[i]);
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
//输入:用户名；输出：该用户的设备列表 格式：JSON
app.get('/Bitem', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("Bitem：" + myDate);
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
    var returnarr = new Array();
    // redis 链接  
    var redis = require('redis');
    var client = redis.createClient('6379', '127.0.0.1');

    // redis 链接错误  
    client.on("error", function (error) {
        console.log("rediserror:" + error);
    });
    // //取值  1号库 权限库 
    //USER改为0库  。7.6
    try {
        
        client.select('0', function (error) {
            if (error) {
                console.log(error);
            } else {
                // get  
                client.get("user", function (error, ress) {
                    if (error) {
                        console.log(error);
                    } else {
                        if (ress == null || ress == undefined || ress == "") {
                            res.send("0");
                        } else{
                            console.log(ress)
                            var obj = JSON.parse(ress)
                            //var obj = ress
                            for(var i=0;i<obj.length;i++){
                                if(params.name==obj[i].name){
                                    //res.send(obj[i].devicelist);  
                                    var arr = obj[i].devicelist.split(',')
                                    var arr2 = obj[i].devicename.split(',')
                                    var arr3 = obj[i].devicepage.split(',')
                                    for(var ii=0;ii<arr.length;ii++){
                                        var o = {
                                            "id":arr[ii],
                                            "text":arr2[ii],
                                            "attributes":arr3[ii]
                                        }
                                        returnarr.push(o);
                                    }
                                    res.send((returnarr));
                                    break;
                                }
                            }
                         } //res.send(JSON.parse(ress)[i]);
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
app.post('/Bitem', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("postBitem：" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    console.log(params.name);
    if (typeof (params) == 'undefined' || typeof (params.name) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
    // 输出 JSON 格式
    var response = "";
    var returnarr = new Array();
    // redis 链接  
    var redis = require('redis');
    var client = redis.createClient('6379', '127.0.0.1');

    // redis 链接错误  
    client.on("error", function (error) {
        console.log("rediserror:" + error);
    });
    // //取值  1号库 权限库 
    try {
        
        client.select('1', function (error) {
            if (error) {
                console.log(error);
            } else {
                // get  
                client.get("user", function (error, ress) {
                    if (error) {
                        console.log(error);
                    } else {
                        if (ress == null || ress == undefined || ress == "") {
                            res.send("0");
                        } else
                            var obj = JSON.parse(ress)
                            for(var i=0;i<obj.length;i++){
                                if(params.name==obj[i].name){
                                    //res.send(obj[i].devicelist);  
                                    var arr = obj[i].devicelist.split(',')
                                    var arr2 = obj[i].devicename.split(',')
                                    var arr3 = obj[i].devicepage.split(',')
                                    for(var ii=0;ii<arr.length;ii++){
                                        var o = {
                                            "id":arr[ii],
                                            "text":arr2[ii],
                                            "attributes":arr3[ii]
                                        }
                                        returnarr.push(o);
                                    }
                                    res.send((returnarr));
                                    break;
                                }
                            }
                                //res.send(JSON.parse(ress)[i]);
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

//   页面 GET 请求得到历史纪录cid   非生产
app.get('/history', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("history:" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof (params) == 'undefined' || typeof (params.cid) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
    console.log(params.page)
    console.log(params.rows)
    console.log(params.dta)
    console.log(params.dtb)
    console.log(params.cid)
    console.log(params.FirstID)
    console.log(params.LastID)
    console.log(params.isNext)
    console.log(params.page-1)
   // var start = (params.page - 1) * params.rows + 1;
   // var end =  params.page* params.rows;
    //数据库配置
    var config = {
        user: 'sa',
        password: 'Sansikeji001',
        server: '127.0.0.1',
        database: params.cid,
        port: 1433,
        options: {
            encrypt: true // Use this if you're on Windows Azure
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    };
    // 输出 JSON 格式
    var response = "";
    sql.connect(config).then(() => {
        var request = new sql.Request();
        request.input('Date1', sql.DateTime2, params.dta);
        request.input('Date2', sql.DateTime2, params.dtb);
        request.input('FirstID', sql.DateTime2, "2018-06-12 09:09:53.000");   //输入参数
        request.input('LastID', sql.DateTime2, "2018-06-13 09:09:53.000");   //输入参数
        request.input('isNext',sql.Int,params.isNext);
        request.input('CurPage',sql.Int,params.page-1);
        request.output('allCount', sql.Int);   //输出参数
        request.output('pageSize',sql.Int);
        return request.execute('selectall')
        //return sql.query`select * from dtu2 order by datetime desc`
    }).then(result => {
        //请求成功
        console.log(result.output.allCount)
        var returnjson = {
            'total':result.output.allCount,
            'rows':result.recordsets[0]
        }
        //console.log(JSON.stringify(result))
        res.send(JSON.stringify(returnjson))
        sql.close()
        //console.log(result["recordsets"][0][1])
    }).catch(err => {
        //err 处理
        console.log("11"+err)
        sql.close()
    })
    sql.on('error', err => {
        //error 处理
        console.log(13)
        sql.close()
    })
    
})
//历史数据查询  生产
app.get('/history2', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("history2:" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof (params) == 'undefined' || typeof (params.cid) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
    
    console.log(params.dta)
    console.log(params.dtb)
    console.log(params.cid)
   
    //数据库配置
    var config = {
        user: 'sa',
        password: 'Sansikeji001',
        server: '127.0.0.1',
        database: params.cid,
        port: 1433,
        options: {
            encrypt: true // Use this if you're on Windows Azure
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    };
    // 输出 JSON 格式
    var response = "";
    sql.connect(config).then(() => {
        var request = new sql.Request();
        //console.log(new Date(params.dta).valueOf())
        var dta2 = new Date(new Date(params.dta).valueOf() + 60*60*1000*8);
        var dtb2 = new Date(new Date(params.dtb).valueOf() + 60*60*1000*8);
        request.input('Date1', sql.DateTime2, dta2.toLocaleString());
        request.input('Date2', sql.DateTime2, dtb2.toLocaleString());
        request.output('allCount', sql.Int);   //输出参数
        //console.log(request)
        return request.execute('selectall2')
        //return sql.query`select * from dtu2 order by datetime desc`
    }).then(result => {
        //请求成功
        console.log(result.output.allCount)
        //console.log(result)
        console.log(params.page)
        console.log(params.rows)
        var start = (params.page - 1) * params.rows ;
        var end =  params.page* params.rows-1;
        if(result.output.allCount<end){
            end = result.output.allCount;
            //start = end-49
        }
        console.log(start+"--"+end)
        var list = new Array();
        for(var i=start;i<=end;i++){
            if(result.recordsets[0][i]){
                list.push(result.recordsets[0][i])
            }
            //var cc = moment(result.recordsets[0][i].CDatetime,"YYYY-MM-DD HH:mm:ss")
            //var cc = moment(result.recordsets[0][i].CDatetime.toLocaleString(),"YYYY-MM-DD")
            //console.log(result.recordsets[0][i].CDatetime)
        }
        console.log(list.length)
        var returnjson = {
            'total':result.output.allCount,
            'rows':list
        }
        //console.log(list)
        //console.log(JSON.stringify(returnjson))
        res.send(JSON.stringify(returnjson))
        sql.close()
        //console.log(result["recordsets"][0][1])
    }).catch(err => {
        //err 处理
        console.log("11"+err)
        sql.close()
    })
    sql.on('error', err => {
        //error 处理
        console.log(13)
        sql.close()
    })
    
})
//报警数据查询  生产
app.get('/BJ', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("BJ:" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof (params) == 'undefined' || typeof (params.cid) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
    
    console.log(params.dta)
    console.log(params.dtb)
    console.log(params.cid)
   
    //数据库配置
    var config = {
        user: 'sa',
        password: 'Sansikeji001',
        server: '127.0.0.1',
        database: params.cid,
        port: 1433,
        options: {
            encrypt: true // Use this if you're on Windows Azure
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    };
    // 输出 JSON 格式
    var response = "";
    sql.connect(config).then(() => {
        var request = new sql.Request();
        var dta2 = new Date(new Date(params.dta).valueOf() + 60*60*1000*8);
        var dtb2 = new Date(new Date(params.dtb).valueOf() + 60*60*1000*8);
        request.input('Date1', sql.DateTime2, dta2.toLocaleString());
        request.input('Date2', sql.DateTime2, dtb2.toLocaleString());
        request.output('allCount', sql.Int);   //输出参数
        return request.execute('selectbaojing')
        //return sql.query`select * from dtu2 order by datetime desc`
    }).then(result => {
        //请求成功
        console.log(result.output.allCount)
        console.log(params.page)
        console.log(params.rows)
        var start = (params.page - 1) * params.rows + 1;
        var end =  params.page* params.rows;
        if(result.output.allCount<end){
            end = result.output.allCount;
        }
        var list = new Array();
        for(var i=start;i<=end;i++){
            if(result.recordsets[0][i]){
                list.push(result.recordsets[0][i])
            }
        }
        var returnjson = {
            'total':result.output.allCount,
            'rows':list
        }
        //console.log(JSON.stringify(result))
        res.send(JSON.stringify(returnjson))
        sql.close()
        //console.log(result["recordsets"][0][1])
    }).catch(err => {
        //err 处理
        console.log("11"+err)
        sql.close()
    })
    sql.on('error', err => {
        //error 处理
        console.log(13)
        sql.close()
    })
    
})
//操作指令   生产
app.get('/action', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("action:" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof (params) == 'undefined' || typeof (params.cid) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
    
    console.log(params.dta)
    console.log(params.dtb)
    console.log(params.cid)
   
    //数据库配置
    var config = {
        user: 'sa',
        password: 'Sansikeji001',
        server: '127.0.0.1',
        database: params.cid,
        port: 1433,
        options: {
            encrypt: true // Use this if you're on Windows Azure
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    };
    // 输出 JSON 格式
    var response = "";
    sql.connect(config).then(() => {
        var request = new sql.Request();
        var dta2 = new Date(new Date(params.dta).valueOf() + 60*60*1000*8);
        var dtb2 = new Date(new Date(params.dtb).valueOf() + 60*60*1000*8);
        request.input('Date1', sql.DateTime2, dta2.toLocaleString());
        request.input('Date2', sql.DateTime2, dtb2.toLocaleString());
        request.output('allCount', sql.Int);   //输出参数
        return request.execute('selectaction')
        //return sql.query`select * from dtu2 order by datetime desc`
    }).then(result => {
        //请求成功
        console.log(result.output.allCount)
        console.log(params.page)
        console.log(params.rows)
        //console.log(result)
        var start = (params.page - 1) * params.rows + 1;
        var end =  params.page* params.rows;
        if(result.output.allCount<end){
            end = result.output.allCount;
        }
        var list = new Array();
        for(var i=start;i<=end;i++){
            if(result.recordsets[0][i]){
                list.push(result.recordsets[0][i])
            }
        }
        var returnjson = {
            'total':result.output.allCount,
            'rows':list
        }
        //console.log(JSON.stringify(result))
        res.send(JSON.stringify(returnjson))
        sql.close()
        //console.log(result["recordsets"][0][1])
    }).catch(err => {
        //err 处理
        console.log("11"+err)
        sql.close()
    })
    sql.on('error', err => {
        //error 处理
        console.log(13)
        sql.close()
    })
    
})
//get用户拥有的视频头 生产  入：用户名  出 
app.get('/user_camera', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("user_camera:" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof (params) == 'undefined' || typeof (params.name) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
    
    console.log(params.name)
    var returnarr = new Array();
    //数据库配置
    var config = {
        user: 'sa',
        password: 'Sansikeji001',
        server: '127.0.0.1',
        database: 'ssdb',
        port: 1433,
        options: {
            encrypt: true // Use this if you're on Windows Azure
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    };
    // 输出 JSON 格式
    var response = "";
    sql.connect(config).then(() => {
        var request = new sql.Request();
        request.input('username', sql.NVarChar, params.name);
        request.output('allCount', sql.Int);   //输出参数
        return request.execute('get_user_device')
        //return sql.query`select * from dtu2 order by datetime desc`
    }).then(result => {
        //请求成功
        if (result == null || result == undefined || result == "") {
            res.send("0");
        } else{
            var obj = result.recordset
            for(var i=0;i<obj.length;i++){
                var oo = {
                    "id":obj[i].name,
                    "text":obj[i].name,
                    "page":obj[i].page
                }
                returnarr.push(oo);
            }
            res.send((returnarr));
        }
        sql.close()
        //console.log(result["recordsets"][0][1])
    }).catch(err => {
        //err 处理
        console.log("11"+err)
        sql.close()
    })
    sql.on('error', err => {
        //error 处理
        console.log(13)
        sql.close()
    })
    
})
//get  设备对应拥有的视频头 生产  入：设备ID(name)  出 视频
app.get('/device_camera', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("device_camera:" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof (params) == 'undefined' || typeof (params.name) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
    
    console.log(params.name)
    var returnarr = new Array();
    //数据库配置
    var config = {
        user: 'sa',
        password: 'Sansikeji001',
        server: '127.0.0.1',
        database: 'ssdb',
        port: 1433,
        options: {
            encrypt: true // Use this if you're on Windows Azure
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    };
    // 输出 JSON 格式
    var response = "";
    sql.connect(config).then(() => {
        var request = new sql.Request();
        request.input('deviceid', sql.NVarChar, params.name);
        request.output('allCount', sql.Int);   //输出参数
        return request.execute('get_camere_bydevice')
        //return sql.query`select * from dtu2 order by datetime desc`
    }).then(result => {
        //请求成功
        if (result == null || result == undefined || result == "") {
            res.send("0");
        } else{
            var obj = result.recordset
            for(var i=0;i<obj.length;i++){
                var oo = {
                    "id":obj[i].name,
                    "text":obj[i].name,
                    "page":obj[i].page
                }
                returnarr.push(oo);
            }
            res.send((returnarr));
        }
        sql.close()
        //console.log(result["recordsets"][0][1])
    }).catch(err => {
        //err 处理
        console.log("11"+err)
        sql.close()
    })
    sql.on('error', err => {
        //error 处理
        console.log(13)
        sql.close()
    })
    
})
app.get('/baojingfenxi', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("报警分析："+myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof(params) == 'undefined' || typeof(params.name) == 'undefined') {
        res.send("Exception 001");
        console.log("001");//参数不匹配，可能是系统外访问
        return;
    }
    // 输出 JSON 格式
    var response = "";
    
    // redis 链接  
    var redis = require('redis');
    var client = redis.createClient('6379', '127.0.0.1');

    // redis 链接错误  
    client.on("error", function (error) {
        console.log("rediserror:"+error);
    });
    // //取值  
    client.select('15', function (error) {
        if (error) {
            console.log(error);
        } else {
            // get  
            client.get(params.name+"_baojingfenxi", function (error, ress) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("ok");
                    res.send(ress);
                    //response = ress;
                    //res.send(JSON.stringify(ress));
                }
                // 关闭链接  
                client.end(true);
            });
        }
    });  
})
//   页面 GET 请求  
app.get('/baojing7day', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("baojing7day"+myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof(params) == 'undefined' || typeof(params.name) == 'undefined') {
        res.send("Exception 001");
        console.log("001");//参数不匹配，可能是系统外访问
        return;
    }
    // 输出 JSON 格式
    var response = "";
    
    // redis 链接  
    var redis = require('redis');
    var client = redis.createClient('6379', '127.0.0.1');

    // redis 链接错误  
    client.on("error", function (error) {
        console.log("rediserror:"+error);
    });
    // //取值  
    client.select('15', function (error) {
        if (error) {
            console.log(error);
        } else {
            // get  
            client.get(params.name+'7day', function (error, ress) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("ok");
                    //response = ress;
                    res.send(JSON.stringify(ress));
                }
                // 关闭链接  
                client.end(true);
            });
        }
    });  
})
//登陆   生产  如：用户名name  密码pw
app.get('/login', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("login:" + myDate);
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    //console.log(params.name);
    if (typeof (params) == 'undefined' || typeof (params.name) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
   
    //数据库配置
    var config = {
        user: 'sa',
        password: 'Sansikeji001',
        server: '127.0.0.1',
        database: "ssdb",
        port: 1433,
        options: {
            encrypt: true // Use this if you're on Windows Azure
        },
        pool: {
            min: 0,
            max: 100,
            idleTimeoutMillis: 3000
        }
    };
    // 输出 JSON 格式
    var response = "";
    sql.connect(config).then(() => {
        var request = new sql.Request();
        request.input('username', sql.NVarChar, params.name);
        request.input('pw', sql.NVarChar, params.pw);
        request.output('allCount', sql.Int);   //输出参数
        return request.execute('user_login')
        //return sql.query`select * from dtu2 order by datetime desc`
    }).then(result => {
        //请求成功
        //console.log(result)
        //console.log(JSON.stringify(result))
        console.log(result.output.allCount)
        if(result.output.allCount==1)
            res.send(JSON.stringify(result.recordsets[0]))
        else
            res.send(JSON.stringify(0))
        sql.close()
        //console.log(result["recordsets"][0][1])
    }).catch(err => {
        //err 处理
        console.log("11"+err)
        sql.close()
    })
    sql.on('error', err => {
        //error 处理
        console.log(13)
        sql.close()
    })
    
})
//登陆   生产  入：用户名name  密码pw  新密码 newpw
app.post('/user_updata_pw', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("user_updata_pw:" + myDate);
    // 解析 url 参数
    var params = req.body//url.parse(req.url, true).query;
    if (typeof (params) == 'undefined' || typeof (params.name) == 'undefined') {
        res.send("Exception 001");
        console.log("警告：系统外访问");//参数不匹配，可能是系统外访问
        return;
    }
   
    //数据库配置
    var config = {
        user: 'sa',
        password: 'Sansikeji001',
        server: '127.0.0.1',
        database: "ssdb",
        port: 1433,
        options: {
            encrypt: true // Use this if you're on Windows Azure
        },
        pool: {
            min: 0,
            max: 100,
            idleTimeoutMillis: 3000
        }
    };
    // 输出 JSON 格式
    var response = "";
    sql.connect(config).then(() => {
        var request = new sql.Request();
        request.input('name', sql.NVarChar, params.name);
        request.input('pw', sql.NVarChar, params.pw);
        request.input('newpw', sql.NVarChar, params.newpw);
        request.output('allCount', sql.Int);   //输出参数
        return request.execute('user_updata_pw')
        //return sql.query`select * from dtu2 order by datetime desc`
    }).then(result => {
        //请求成功
        //console.log(result)
        //console.log(JSON.stringify(result))
        console.log(result.output.allCount)
        if(result.output.allCount>=1)
            res.send(JSON.stringify(1))
        else
            res.send(JSON.stringify(0))
        sql.close()
        //console.log(result["recordsets"][0][1])
    }).catch(err => {
        //err 处理
        console.log("11"+err)
        sql.close()
    })
    sql.on('error', err => {
        //error 处理
        console.log(13)
        sql.close()
    })
    
})
app.get('/test', function (req, res) {
    var myDate = new Date();
    myDate.toLocaleString(); //获取日期与时间
    console.log("dtufromredis：" + myDate);
      // 解析 url 参数
      var params = url.parse(req.url, true).query;
    //数据库配置
    var config = {
        user: 'sa',
        password: 'Sansikeji001',
        server: '127.0.0.1',
        database: params.cid,
        port: 1433,
        options: {
            encrypt: false // Use this if you're on Windows Azure
        }
        
    };
    // 输出 JSON 格式
    var response = "";
    sql.connect(config).then(() => {
        var request = new sql.Request();
        request.input('CurPage',sql.Int,1);
        return request.execute('test')
        //return sql.query`select * from dtu2 order by datetime desc`
    }).then(result => {
        //请求成功
        res.send(JSON.stringify(result))
         sql.close()
        //console.log(result["recordsets"][0][1])
    }).catch(err => {
        //err 处理
        console.log(err)
        sql.close()
    })
    sql.on('error', err => {
        //error 处理
        console.log(13)
        sql.close()
    })
    
})
var server = app.listen(8083, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})