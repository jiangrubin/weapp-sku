import computedBehavior from 'miniprogram-computed'
import { fenToYuan } from './utils/currency'
import { isSkuChoosable, isAllSelected, getSkuComb, getSelectedSkuValues, getSkuImgValue } from './utils/helper'

// skuTree
// 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值
// 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值
// 数据结构如下:
// [
//   {
//     k_s: 0, // skuKey: skuList 中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值
//     name: '颜色', // skuKeyName 规格类目名称
//     values: [
//       { name: '红色' },
//       { name: '蓝色' },
//     ], // 规格值
//   },
//   {
//     k_s: 1,
//     name: '尺寸',
//     values: [
//       { name: 'S' },
//       { name: 'M' },
//     ]
//   }
// ]

// skuList
// 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
// 数据结构如下: 
// [
//   {
//     id: 2259, // skuId
//     price: 100, // 价格（单位分）
//     stock: 110, // 当前 sku 组合对应的库存
//     0: '红色', // 规格类目 k_s 为 0 的对应规格值
//     1: 'M', // 规格类目 k_s 为 1 的对应规格值
//   }
// ]

Component({
  behaviors: [computedBehavior],

  options: {
    multipleSlots: true,
    styleIsolation: 'shared'
  },

  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
    },
    // 详细说明见上
    skuTree: {
      type: Array,
      value: [],
    },
    // 详细说明见上
    skuList: {
      type: Array,
      value: []
    },
    // 默认商品 sku 缩略图
    picture: String,
    // 默认价格（单位分）
    price: {
      type: Number,
      value: 0,
    },
    // 商品总库存
    stock: {
      type: Number,
      value: 0
    },
    // 是否显示商品详情
    showGoodsDetail: {
      type: Boolean,
      value: false,
    },
    // 是否显示购物车
    showCart: {
      type: Boolean,
      value: true,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedSku: {},
    countNum: 1,
  },

  computed: {
    isSkuCombSelected (data) {
      return isAllSelected(data.skuTree, data.selectedSku)
    },

    selectedSkuComb (data) {
      let skuComb = null
      if (data.isSkuCombSelected) {
        skuComb = getSkuComb(data.skuList, data.selectedSku) || null
      }
      return skuComb
    },

    image (data) {
      // 选择单一规格时，切换封面图
      const selectedValue = getSkuImgValue(data.skuTree, data.selectedSku)
      const image = selectedValue ? selectedValue.image : data.picture
      return image

      // 选择完整的 sku 时，切换封面图
      // if (data.selectedSkuComb) {
      //   return data.selectedSkuComb.image || data.picture
      // }
      // return data.picture
    },

    priceText (data) {
      if (data.selectedSkuComb) {
        return fenToYuan(data.selectedSkuComb.price)
      }
      return fenToYuan(data.price)
    },

    stockNum (data) {
      if (data.selectedSkuComb) {
        return data.selectedSkuComb.stock
      }
      return data.stock
    },

    selectedCount (data) {
      if (data.selectedSkuComb) {
        return data.stockNum < data.countNum ? data.stockNum : data.countNum
      }
      return data.countNum
    },

    selectedSkuValues (data) {
      return getSelectedSkuValues(data.skuTree, data.selectedSku)
    },

    selectedText (data) {
      if (data.selectedSkuComb) {
        const values = data.selectedSkuValues
        return `已选 ${values.map((item) => item.name).join(' ')}`
      }

      const unselectedSku = data.skuTree.filter(
        (item) => data.selectedSku[item.k_s] === ''
      ).map(item => item.name)

      return `请选择 ${unselectedSku.join(' ')}`
    },
  },

  lifetimes: {
    attached () {
    
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose () {
      this.triggerEvent('close')
    },

    resetSelectedSku () {
      let selectedSku = {}
      const { skuTree, skuList } = this.data

      // 重置 selectedSku
      skuTree.forEach(item => {
        selectedSku[item.k_s] = ''
      })

      skuTree.forEach(item => {
        const key = item.k_s
        // 规格值只有1个时，优先判断
        const valueId = item.values.length === 1 ? item.values[0].name : ''

        if (valueId && isSkuChoosable(skuList, selectedSku, { key, valueId })) {
          selectedSku[key] = valueId
        }
      })
      
      this.setData({ selectedSku })
    },

    onSelect (e) {
      let { name, skuKeyStr } = e.detail
      let selectedSku = {
        ...this.data.selectedSku,
        [skuKeyStr]: this.data.selectedSku[skuKeyStr] === name ? '' : name
      }
      this.setData({ selectedSku })
    },

    onChangeStepper (e) {
      this.setData({ countNum: e.detail })
    },

    onBuyOrAddCart (e) {
      const { eventType } = e.mark
      if (!this.data.isSkuCombSelected) {
        wx.showToast({
          icon: 'none',
          title: this.data.selectedText,
        })
      } else {
        this.triggerEvent(eventType, this.getSkuData())
      }
    },

    getSkuData () {
      return {
        selectedCount: this.data.selectedCount,
        selectedSkuComb: this.data.selectedSkuComb
      }
    }
  },

  observers: {
    show (value) {
    
    },

    skuTree () {
      this.resetSelectedSku()
    },

    selectedCount (value) {
      this.setData({ countNum: value })
    }
  }
})
