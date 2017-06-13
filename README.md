# rap-axios-plugin
axios plugin for RAP
对axios的扩展，对axios的返回值进行mock。默认使用taobao官方的RAP服务。

## 安装

`npm install rap-axios-plugin --save-dev`

## 使用
```js
var rapaxios = require('../src/index');
var axios = require('axios');
//配置projectId，使用前最好先配置config
rapaxios.config({ projectId: '20337' });
/**
 * get请求的测试
 */
rapaxios.get('get.json?age=3&name=3').then((res) => {
    let data = res.data;
    console.log(JSON.stringify(data));
    console.log('====== ok ======');
}).catch((error) => {
    console.error(JSON.stringify(error));
});

/**
 * get请求的测试 带参数
 */
rapaxios.get('get.json', { params: { name: '3', age: 22 } }).then((res) => {
    let data = res.data;
    console.log(JSON.stringify(data));
    console.log('====== ok ======');
}).catch((error) => {
    console.error(JSON.stringify(error));
});
/**
 * get请求的测试 带参数 url中带参数
 */
rapaxios.get('get.json?sex=4', { params: { name: '3', age: 242 } }).then((res) => {
    let data = res.data;
    console.log(JSON.stringify(data));
    console.log('====== ok ======');
}).catch((error) => {
    console.error(JSON.stringify(error));
});
/**
 * post请求测试 带参数
 */
rapaxios.post('post.json', { name: '3', age: 242 }).then((res) => {
    let data = res.data;
    console.log(JSON.stringify(data));
    console.log('====== ok ======');
}).catch((error) => {
    console.error(JSON.stringify(error));
});


function getTest() {
    return rapaxios.get('get.json', { params: { name: '3', age: 242 } });
}

function postTest() {
    return rapaxios.post('post.json', { name: '3', age: 242 });
}
/**
 * 测试两个请求共同完成
 */
rapaxios.all([getTest(), postTest()])
    .then(rapaxios.spread(function(first, second) {
        //Both requests are now complete
        console.log('====== all ok ======');
    }));
```
## 完整配置参数
```js
 const defaultOptions = {
    rootUrl: 'http://rapapi.org', //默认为淘宝mockjs地址
    mock: 'mockjs',//taobao mockjs的地址
    projectId: '',//项目id
    requestUrl: '',//请求的路径，即在mockjs中配置的请求路径
    ismock: true,//是否开启mock模式
    method: 'GET',//默认请求方式
    params: undefined //参数
}
```
## 说明
目前实现了axios的 get、post、all接口。仅对浏览器的 XMLHttpRequest 对象进行了扩展。未对axios的http请求做扩展。

## 依赖
mockjs
axios