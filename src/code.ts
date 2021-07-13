figma.clientStorage.getAsync('preference').then(result=>{
  figma.showUI(__html__, {width: 276, height: 184})
  figma.ui.postMessage({ type: "setup", data: getComponentSetData(), preference: result })
})

figma.on("selectionchange",()=>{
  figma.ui.postMessage({ type: "selectionChange", data: getComponentSetData()})
})

let componentSets: [ComponentSetNode]

function getComponentSetData() {
  let selection = figma.currentPage.selection
  componentSets = selection.filter(layer => (layer.type === "COMPONENT_SET")) as [ComponentSetNode]
  if (selection.length == 0) {
    return null
  } else if (componentSets.length > 0) {
    let firstComponentSet = componentSets[componentSets.length - 1]
    return {
      componentSetsLength: componentSets.length,
      numberOfComponents: getNumberOfComponents(componentSets),
      firstComponentSet: {
        metaData: getDataFromComponent(firstComponentSet.children[0])
      }
    }
  } else {
    // need to update UI to communicate that the layers that were selected don't contain any variants
    return null
  }
}

function getNumberOfComponents(componentSets) {
  let counter = 0
  componentSets.forEach(componentSet=>{
    counter += componentSet.children.length
  })
  return counter
}

function getDataFromComponent(component) {
  let parentName = component.parent.name.toLowerCase()
  let parts = component.name.split(", ")

  let properties = []
  let variants = []
  
  parts.forEach(partText=> {
      let splitText = partText.split('=')
      variants.push(splitText[1])
      properties.push(splitText[0])
  })

  let variantSubstring = ""
  let bools = ["yes", "true", "no", "false"]
  let falses = ["no", "false"]
  variants.forEach((variant,index)=>{
    if (bools.indexOf(variant.toLowerCase()) === -1) {
      variantSubstring += `-${variant.toLowerCase()}`
    } else {
      if (falses.indexOf(variant.toLowerCase()) === -1) {
        variantSubstring += `-${properties[index].toLowerCase()}`
      }
    }
  })
  // ex: -variant1-variant2-variant3...
  variantSubstring = variantSubstring.substring(1) // remove first '-'
  return {componentName: parentName, variantSubstring: variantSubstring}
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'preference') {
    figma.clientStorage.setAsync("preference", msg.preference)
  }

  if (msg.type === 'export') {
    // get all the stuff ansync from componentsets

    let promises = []
    let variantDataArray = []
    componentSets.forEach(componentSet => {
      componentSet.children.forEach(variant => {
        let svgPromise = variant.exportAsync({format: "SVG"})
        let variantData = getDataFromComponent(variant)
        variantDataArray.push(variantData)
        promises.push(svgPromise)
      })
    })

    // resolve all promises
    Promise.all(promises).then(svgDataArray=>{
      figma.ui.postMessage({
        type: "download",
        data: {
          svgDataArray: svgDataArray,
          variantDataArray: variantDataArray
        }
      })
    })

  }
};