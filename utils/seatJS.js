var App = getApp()
function getMoveableArea(res) {
  //可移动区域的宽度
  // todo
  // 这里的宽度:屏幕宽度; 这里的高度:屏幕高度 - 状态栏高度;
  var windowWidth = App.globalData.screenWidth
  var windowHeight = App.globalData.screenHeight
  // console.log(areaWidth)
  // console.log(areaHeight)
  var areaHeight = windowHeight - res

  // 这里的函数一定要随项目进度更改，目前这样设置是为了减去上面三个单元格的高度
  var areaWidth = windowWidth
  return [areaHeight, areaWidth]
}

module.exports = {
  getMoveableArea: getMoveableArea
}