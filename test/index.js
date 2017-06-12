var rapaxios = require('../src/index');
var axios = require('axios');
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

// function getTest() {
//     return axios.get('http://rapapi.org/mockjs/20337/get.json', { params: { name: '3', age: 242 } });
// }

// function postTest() {
//     return axios.post('http://rapapi.org/mockjs/20337/post.json', { name: '3', age: 242 });
// }
// axios.all([getTest(), postTest()])
//     .then(axios.spread(function(first,second) {
//         // Both requests are now complete
//     }));

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