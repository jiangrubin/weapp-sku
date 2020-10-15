// components/sku/components/row-item/index.js
import computedBehavior from 'miniprogram-computed'
import { isSkuChoosable } from '../../utils/helper'

Component({
  behaviors: [computedBehavior],

  /**
   * 组件的属性列表
   */
  properties: {
    skuValue: {
      type: Object,
      value: {}
    },
    skuKeyStr: String,
    selectedSku: {
      type: Object,
      value: {}
    },
    skuList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  computed: {
    choosable (data) {
      return isSkuChoosable(data.skuList, data.selectedSku, {
        key: data.skuKeyStr,
        valueId: data.skuValue.name,
      })
    },

    choosed (data) {
      return data.skuValue.name === data.selectedSku[data.skuKeyStr]
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect () {
      const { choosable, skuValue, skuKeyStr } = this.data
      if (choosable) {
        this.triggerEvent('select', {
          ...skuValue,
          skuKeyStr
        })
      }
    }
  }
})
