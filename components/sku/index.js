import computedBehavior from 'miniprogram-computed'
import { fenToYuan } from './utils/currency'
import { isSkuChoosable, isAllSelected, getSkuComb, getSelectedSkuValues, getSkuImgValue } from './utils/helper'

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
    skuTree: {
      type: Array,
      value: [],
    },
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
