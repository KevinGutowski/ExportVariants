// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.clientStorage.getAsync('preference').then(result => {
    figma.showUI(__html__);
    figma.ui.postMessage({ type: "setup", data: getComponentSetData(), preference: result });
});
figma.on("selectionchange", () => {
    figma.ui.postMessage({ type: "selectionChange", data: getComponentSetData() });
});
// TODO: Setup Default Export Settings
let defaultExportSettings;
function getComponentSetData() {
    let selection = figma.currentPage.selection;
    let componentSets = selection.filter(layer => (layer.type === "COMPONENT_SET"));
    if (selection.length == 0) {
        return null;
    }
    else if (componentSets.length != 0) {
        let firstComponentSet = componentSets[componentSets.length - 1];
        return {
            componentSetsLength: componentSets.length,
            numberOfComponents: getNumberOfComponents(componentSets),
            firstComponentSet: {
                metaData: getDataFromComponent(firstComponentSet.children[0])
            }
        };
    }
    else {
        // need to update UI to communicate that the layers that were selected don't contain any variants
        return null;
    }
}
function getNumberOfComponents(componentSets) {
    let counter = 0;
    componentSets.forEach(componentSet => {
        counter += componentSet.children.length;
    });
    return counter;
}
function getDataFromComponent(component) {
    let parentName = component.parent.name;
    let parts = component.name.split(", ");
    let variants = [];
    parts.forEach(partText => {
        let splitText = partText.split('=');
        variants.push(splitText[1]);
    });
    return { name: parentName, variants: variants };
}
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'preference') {
        figma.clientStorage.setAsync("preference", msg.preference);
    }
    if (msg.type === 'export') {
        console.log(msg.selection);
        // get all the stuff ansync
        // move this into the then
        setTimeout(() => {
            figma.ui.postMessage({ type: "download", data: null });
        }, 1000);
    }
};
