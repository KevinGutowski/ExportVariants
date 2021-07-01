import './ui.css'

let layerText = document.getElementById('layerText')
let folderOption = document.getElementById('folders') as HTMLInputElement
let filenameOption = document.getElementById('filenames') as HTMLInputElement
let exampleText = document.getElementById('exampleText')
let exportButton = document.getElementById('export') as HTMLInputElement
let exportCountText = document.getElementById('itemsToExport')

let exampleTextOptions = ["", ""]
// first option is the example text for folders
// {prop_x.variant_x}-{prop_y.variant_y}-{prop_z.variant_z}/{component_name}.svg
// section option is the example text for filenames
// {component_name}-{prop_x.variant_x}-{prop_y.variant_y}-{prop_z.variant_z}.svg

function updateDisplayOfExampleOutput() {
    // looks at radioOptions and swaps to the proper text option
    let preference

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
    console.log("updateTextOfExampleOutput")

    let name = metaData.name
    let fileNameString = name

    let combinedVariants = ""
    metaData.variants.forEach(variant => {
        let bools = ["yes", "no", "true", "false"]
        if (bools.indexOf(variant.toLowerCase()) === -1) {
            combinedVariants += `-${variant.toLowerCase()}`
        }
    })
    exampleTextOptions[0] = `${combinedVariants.substring(1)}/${name}.svg`
    exampleTextOptions[1] = `${name}${combinedVariants}.svg`

    updateDisplayOfExampleOutput()
}

function exportVariants() {
    let selection
    if (filenameOption.checked) { selection = 'filenames' } else { selection = 'folders' }
    parent.postMessage({ pluginMessage: { type: 'export', selection } }, '*')
    exportButton.disabled = true
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
        let message = event.data.pluginMessage
        // perform download
        exportButton.disabled = false
        console.log(`perform download with data ${message.data}`)
    }
}