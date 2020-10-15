// 判断sku是否可选
export function isSkuChoosable (skuList, selectedSku, skuToChoose) {
  const { key, valueId } = skuToChoose

  // 先假设sku已选中，拼入已选中sku对象中
  const matchedSku = {
    ...selectedSku,
    [key]: valueId,
  }

  // 再判断剩余sku是否全部不可选，若不可选则当前sku不可选中
  const skusToCheck = Object.keys(matchedSku).filter(
    (skuKey) => matchedSku[skuKey] !== ''
  )

  const filteredSku = skuList.filter((sku) =>
    skusToCheck.every(
      (skuKey) => String(matchedSku[skuKey]) === String(sku[skuKey])
    )
  )

  const stock = filteredSku.reduce((total, sku) => {
    total += sku.stock
    return total
  }, 0)
  
  return stock > 0
}

// 判断是否所有的sku都已经选中
export function isAllSelected (skuTree, selectedSku) {
  // 筛选selectedSku对象中key值不为空的值
  const selected = Object.keys(selectedSku).filter(
    (skuKeyStr) => selectedSku[skuKeyStr] !== ''
  )
  return skuTree.length === selected.length
}

// 根据已选择的 sku 获取 skuComb
export function getSkuComb (skuList, selectedSku) {
  const skuComb = skuList.filter((item) =>
    Object.keys(selectedSku).every(
      (skuKeyStr) => String(item[skuKeyStr]) === String(selectedSku[skuKeyStr])
    )
  )
  return skuComb[0]
}

export function normalizeSkuTree (skuTree) {
  const normalizedTree = {}
  skuTree.forEach((treeItem) => {
    normalizedTree[treeItem.k_s] = treeItem.values
  })
  return normalizedTree
}

// 获取已选择的sku名称
export function getSelectedSkuValues (skuTree, selectedSku) {
  const normalizedTree = normalizeSkuTree(skuTree)
  return Object.keys(selectedSku).reduce((selectedValues, skuKeyStr) => {
    const skuValues = normalizedTree[skuKeyStr]
    const skuValueId = selectedSku[skuKeyStr]

    if (skuValueId !== '') {
      const skuValue = skuValues.filter((value) => value.name === skuValueId)[0]
      skuValue && selectedValues.push(skuValue)
    }
    return selectedValues
  }, [])
}

export function getSkuImgValue(tree, selectedSku) {
  let imgValue

  tree.some((item) => {
    const id = selectedSku[item.k_s]

    if (id && item.values) {
      const matchedSku = item.values.filter((skuValue) => skuValue.name === id)[0] || {}
      const img = matchedSku.previewImgUrl || matchedSku.image || matchedSku.img_url
      if (img) {
        imgValue = {
          ...matchedSku,
          ks: item.k_s,
          image: img,
        }
        return true
      }
    }

    return false
  })

  return imgValue
}