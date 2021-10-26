const axios = require('axios')

const getAllData = () => {
  const url = `https://www.binaryx.pro/getSales?page=1&page_size=20000&status=selling&name=&sort=time&direction=desc&career=&value_attr=&start_value=&end_value=&pay_addr=`
  // const url = 'https://www.baidu.com'
  const headers = {
    'sec-ch-ua': `"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"`,
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'Windows',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
  }
  const method = 'get'
  const obj = {
    method,
    url,
    headers,
  }
  axios(obj)
    .then((res) => {
      try {
        const data = res.data.data.result.items
        dataRes(data)
      } catch (err) {
        console.log(err)
      }
    })
    .catch((_) => {
      console.log('axios错误')
      getAllData()
    })
}
//
const dataRes = (arr) => {
  const exchange_rate = 1000000000000000000
  const main_value = 86
  const secondary_value = 61
  const level_income_magnification = {
    1: 1,
    2: 2,
    3: 4,
    4: 8,
    5: 16,
    6: 25,
    7: 50,
    8: 75,
    9: 100,
    10: 200,
    11: 300,
    12: 500,
  }
  const useful_arr = [
    { main: 'strenth', secondary: 'physique', profession: '战士' },
    { main: 'agility', secondary: 'strenth', profession: '盗贼' },
    { main: 'strenth', secondary: 'agility', profession: '游侠' },
    { main: 'brains', secondary: 'charm', profession: '法师' },
  ]
  const result_arr = []
  for (let i = 0; i < arr.length; i++) {
    // agility 敏捷 brains 智力 charm 精力 physique体力 strenth力量
    const { level, price, order_id } = arr[i]
    // 满足能够打工的条件
    for (var j = 0; j < useful_arr.length; j++) {
      const main_attributes = arr[i][useful_arr[j].main]
      const secondary_attributes = arr[i][useful_arr[j].secondary]
      if (
        main_attributes >= main_value &&
        secondary_attributes >= secondary_value
      ) {
        // 获取满足条件的角色 arr[i]
        const BNX = Number(price) / exchange_rate
        // 收益计算公式 (0.01 + （英雄的主要属性 - 85）*0.005 个金币 ) * 等级提供的倍数
        // 每块区块链的工作报酬为
        const income =
          (0.01 + (main_attributes - 85) * 0.005) *
          level_income_magnification[level]
        // 计算结果
        const result = income / BNX
        result_arr.push({ result, order_id, income })
      }
    }
  }

  result_arr.sort((a, b) => {
    return b.result - a.result
  })

  const top10 = result_arr.slice(0, 20)
  for (let i = 0; i < top10.length; i++) {
    const { result, order_id, income } = top10[i]
    const income30day = 0.007913 * 864000 * income
    console.log(
      `购买id号为:${order_id}的角色性价比第${
        i + 1
      } 高,您每个BNX能获取的每块区块链的工作报酬为${result}, 您30天能获得收益$${income30day}, 购买链接:https://www.binaryx.pro/#/oneoffsale/detail/${order_id}`
    )
  }
}

getAllData()
