const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  //env: "xly-2ktby",
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var id = event.id
  const dbResult = await db.collection(id).get()
  return dbResult
}