var json = {
  "errorCode": 0,
  "errorMsg": "",
  "seatTypeList": [{
      "name": "可选",
      "icon": "/images/image_can_select.png",
      "type": "0",
      "isShow": "1",
      "position": "up"
    },
    {
      "name": "已选",
      "type": "0-1",
      "icon": "/images/image_is_select.png",
      "isShow": "1",
      "position": "up"
    },
    {
      "name": "他人已选",
      "type": "0-2",
      "icon": "/images/image_has_selected.png",
      "isShow": "1",
      "position": "up"
    },
  ]
}

// 定义数据出口
module.exports = {
  dataList: json
}