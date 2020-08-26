// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //返回的是当前时间距离1971年1月1日0时的时间差（毫秒为单位）
  var n = Date.now() + 8 * 3600000;
  var date = new Date(n);
  var Y = date.getFullYear() + ' -';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() ;
  //var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ' : ': date.getMinutes()+': ';
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return {
    //time: (Y + M + D + " " + h + m + s),
    //time: (Y + M + D + " " + h + m + s),
    day:(M+D),
    h:h,
    m:m,
    s:s
  };
}