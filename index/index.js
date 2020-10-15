const app = getApp()

Page({
  data: {
    showSku: true,
    skuTree: [
      {
        k_s: 0,
        name: '颜色',
        values: [
          { name: '粉色', image: 'https://b.yzcdn.cn/vant/sku/shoes-1.png' },
          { name: '黄色', image: 'https://b.yzcdn.cn/vant/sku/shoes-2.png' },
          { name: '蓝色', image: 'https://b.yzcdn.cn/vant/sku/shoes-3.png' },
        ],
      },
      {
        k_s: 1,
        name: '尺寸',
        values: [
          { name: '小' },
          { name: '大' },
        ]
      }
    ],
    skuList: [
      {
        id: 2259, // skuId
        price: 2000, // 价格（单位分）
        stock: 20, // 当前 sku 组合对应的库存
        0: '粉色', // 规格类目 k_s 为 0 的对应规格值
        1: '大', // 规格类目 k_s 为 1 的对应规格值
      },
      {
        id: 2260,
        price: 1900,
        stock: 10,
        0: '黄色',
        1: '小',
      },
      {
        id: 2261,
        price: 1900,
        stock: 12,
        0: '蓝色',
        1: '小',
      }
    ],
    skuPicture: 'https://b.yzcdn.cn/vant/sku/shoes-1.png',
    skuPrice: 2000,
    skuStock: 42,
  },

  onLoad () {
  
  },

  onCloseSku () {
    this.setData({ showSku: false })
  },

  /**
   * @desc 点击 sku 弹出层加入购物车
   * @param { Object } e.detail 选择的 sku 数据 { selectedCount, selectedSkuComb }
   */
  onSkuAddCart (e) {
    console.log(e)
  },

  /**
   * @desc 点击 sku 弹出层立即购买
   * @param { Object } e.detail 选择的 sku 数据 { selectedCount, selectedSkuComb }
   */
  onSkuBuy (e) {
    console.log(e)
  },
})
