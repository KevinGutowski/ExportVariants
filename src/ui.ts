import './ui.css'

var JSZip = require('jszip')

let layerText = document.getElementById('layerText')
let folderOption = document.getElementById('folders') as HTMLInputElement
let filenameOption = document.getElementById('filenames') as HTMLInputElement
let exampleText = document.getElementById('exampleText')
let exportButton = document.getElementById('export') as HTMLInputElement
let exportCountText = document.getElementById('itemsToExport')

let exampleTextOptions = ["", ""]
let preference = ""
// first option is the example text for folders
// {prop_x.variant_x}-{prop_y.variant_y}-{prop_z.variant_z}/{component_name}.svg
// section option is the example text for filenames
// {component_name}-{prop_x.variant_x}-{prop_y.variant_y}-{prop_z.variant_z}.svg

function updateDisplayOfExampleOutput() {
    // looks at radioOptions and swaps to the proper text option
    if (filenameOption.checked) {
        exampleText.innerHTML = exampleTextOptions[1]
        preference = 'filenames'
    } else {
        exampleText.innerHTML = exampleTextOptions[0]
        preference = 'folders'
    }

    parent.postMessage({ pluginMessage: { type: 'preference', preference } }, '*')
}

function updateTextOfExampleOutput(metaData) {
    // Updates the example text array
    let name = metaData.componentName
    let variantSubstring = metaData.variantSubstring

    exampleTextOptions[0] = `${variantSubstring}/${name}.svg`
    exampleTextOptions[1] = `${name}-${variantSubstring}.svg`

    updateDisplayOfExampleOutput()
}

function exportVariants() {
    let selection
    if (filenameOption.checked) { selection = 'filenames' } else { selection = 'folders' }
    parent.postMessage({ pluginMessage: { type: 'export', selection } }, '*')
    exportButton.disabled = true
    folderOption.disabled = true
    filenameOption.disabled = true
}


[folderOption, filenameOption].forEach(item=>{
    item.addEventListener('click', () => {
        updateDisplayOfExampleOutput()
    })
})

exportButton.addEventListener('click', ()=>{
    exportVariants()
})

onmessage = (event) => {
    let messageType = event.data.pluginMessage.type
    if (messageType === 'setup') {

        let preference = event.data.pluginMessage.preference

        if (preference === 'filenames') {
            filenameOption.checked = true
            folderOption.checked = false
        }
    }

    if (messageType === 'selectionChange' || messageType === 'setup') {
        let message = event.data.pluginMessage
        if (message.data != null) {
            let numberOfComponentSets = message.data.componentSetsLength
            layerText.innerHTML = `Number of Component Sets: ${numberOfComponentSets}`

            if (numberOfComponentSets < 1) {
                exampleText.innerHTML = ""
                exportCountText.innerHTML = ""
                exportButton.disabled = true
            } else {
                updateTextOfExampleOutput(message.data.firstComponentSet.metaData)
                exportCountText.innerHTML = `Number of variants: ${message.data.numberOfComponents}`
                exportButton.disabled = false
            }
        } else {
            layerText.innerHTML = "Nothing selected"
            exampleText.innerHTML = ""
            exportCountText.innerHTML = ""
            exportButton.disabled = true
        }
    }

    if (messageType === 'download') {
        let data = event.data.pluginMessage.data
        let svgDataArray = data.svgDataArray
        let variantDataArray = data.variantDataArray // {componentName: string, variantSubstring: string}
        
        // build zip file
        var zip = new JSZip()
        if (preference === "filenames") {
            let folder = zip.folder('Export')
            data.svgDataArray.forEach((svgData,index)=>{
                let fileName = `${variantDataArray[index].componentName}-${variantDataArray[index].variantSubstring}.svg`
                folder.file(fileName,svgData,{base64:true})
            })

            // perform download
            zip.generateAsync({type:'blob'}).then(blob=>{
                save(blob, 'Export.zip')

                exportButton.disabled = false
                folderOption.disabled = false
                filenameOption.disabled = false
            })
        } else {
            // folders
            data.svgDataArray.forEach((svgData,index)=>{
                let folderName = `${variantDataArray[index].variantSubstring}`
                let folder = zip.folder(folderName)
                let fileName = `${variantDataArray[index].componentName}.svg`
                folder.file(fileName,svgData,{base64:true})
            })

            // perform download
            zip.generateAsync({ type: 'blob' }).then(blob => {
                save(blob, 'Export.zip')

                exportButton.disabled = false
                folderOption.disabled = false
                filenameOption.disabled = false
            })
        }
    }
}

function save(blob, filename) {
    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(blob, filename);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(blob, filename);
    } else {
        var elem: HTMLAnchorElement = window.document.createElement('a')
        elem.href = window.URL.createObjectURL(blob)
        elem.download = filename
        elem.setAttribute('style', 'display:none;opacity:0;color:transparent;');
        (document.body || document.documentElement).appendChild(elem)
        if (typeof elem.click === 'function') {
            elem.click();
        } else {
            elem.target = '_blank'
            elem.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            }))
        }
        URL.revokeObjectURL(elem.href)
    }
}