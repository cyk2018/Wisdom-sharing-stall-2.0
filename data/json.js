var json = {
  "errorCode": 0,
  "errorMsg": "",
  "seatTypeList": [{
      "name": "可选",
      "icon": "/images/image_can_select.png",
      "type": "0",
    },
    {
      "name": "已选",
      "type": "1",
      "icon": "/images/image_is_select.png",
    },
    {
      "name": "他人已选",
      "type": "2",
      "icon": "/images/image_has_selected.png",
    }, {
      "name":"空白区域",
      "type":"3",
      "icon": "/images/nothing.png",
    }
  ]
}

// 定义数据出口
module.exports = {
  dataList: json
}