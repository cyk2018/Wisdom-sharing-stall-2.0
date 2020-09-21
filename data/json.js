var json = {
  "errorCode": 0,
  "errorMsg": "",
  "seatTypeList": [{
      "name": "空白区域",
      "type": 0,
      "icon": "/images/close.png",
    }, {
      "name": "可选",
      "icon": "/images/image_can_select_click.png",
      "type": 1,
    },
    {
      "name": "已选",
      "type": 2,
      "icon": "/images/image_is_select.png",
    },
    {
      "name": "他人已选",
      "type": 3,
      "icon": "/images/image_has_selected.png",
    },
  ]
}

// 定义数据出口
module.exports = {
  dataList: json
}