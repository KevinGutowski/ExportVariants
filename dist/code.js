/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
figma.clientStorage.getAsync('preference').then(result => {
    figma.showUI(__html__, { width: 276, height: 184 });
    figma.ui.postMessage({ type: "setup", data: getComponentSetData(), preference: result });
});
figma.on("selectionchange", () => {
    figma.ui.postMessage({ type: "selectionChange", data: getComponentSetData() });
});
// TODO: Setup Default Export Settings
let defaultExportSettings;
let componentSets;
function getComponentSetData() {
    let selection = figma.currentPage.selection;
    componentSets = selection.filter(layer => (layer.type === "COMPONENT_SET"));
    if (selection.length == 0) {
        return null;
    }
    else if (componentSets.length > 0) {
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
    let properties = [];
    let variants = [];
    parts.forEach(partText => {
        let splitText = partText.split('=');
        variants.push(splitText[1]);
        properties.push(splitText[0]);
    });
    let variantSubstring = "";
    let bools = ["yes", "true", "no", "false"];
    let falses = ["no", "false"];
    variants.forEach((variant, index) => {
        if (bools.indexOf(variant.toLowerCase()) === -1) {
            variantSubstring += `-${variant.toLowerCase()}`;
        }
        else {
            if (falses.indexOf(variant.toLowerCase()) === -1) {
                variantSubstring += `-${properties[index].toLowerCase()}`;
            }
        }
    });
    // ex: -variant1-variant2-variant3...
    variantSubstring = variantSubstring.substring(1); // remove first '-'
    return { componentName: parentName, variantSubstring: variantSubstring };
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
        // get all the stuff ansync from componentsets
        let promises = [];
        let variantDataArray = [];
        componentSets.forEach(componentSet => {
            componentSet.children.forEach(variant => {
                let svgPromise = variant.exportAsync({ format: "SVG" });
                let variantData = getDataFromComponent(variant);
                variantDataArray.push(variantData);
                promises.push(svgPromise);
            });
        });
        // resolve all promises
        Promise.all(promises).then(svgDataArray => {
            figma.ui.postMessage({
                type: "download",
                data: {
                    svgDataArray: svgDataArray,
                    variantDataArray: variantDataArray
                }
            });
        });
    }
};

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9FeHBvcnQtVmFyaWFudHMvLi9zcmMvY29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0EsNEJBQTRCLDBCQUEwQjtBQUN0RCwwQkFBMEIsaUVBQWlFO0FBQzNGLENBQUM7QUFDRDtBQUNBLDBCQUEwQix1REFBdUQ7QUFDakYsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxzQkFBc0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLGdDQUFnQztBQUN4RTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscURBQXFEO0FBQ3JELFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxnQkFBZ0I7QUFDdEU7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCdwcmVmZXJlbmNlJykudGhlbihyZXN1bHQgPT4ge1xuICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMjc2LCBoZWlnaHQ6IDE4NCB9KTtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6IFwic2V0dXBcIiwgZGF0YTogZ2V0Q29tcG9uZW50U2V0RGF0YSgpLCBwcmVmZXJlbmNlOiByZXN1bHQgfSk7XG59KTtcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsICgpID0+IHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6IFwic2VsZWN0aW9uQ2hhbmdlXCIsIGRhdGE6IGdldENvbXBvbmVudFNldERhdGEoKSB9KTtcbn0pO1xuLy8gVE9ETzogU2V0dXAgRGVmYXVsdCBFeHBvcnQgU2V0dGluZ3NcbmxldCBkZWZhdWx0RXhwb3J0U2V0dGluZ3M7XG5sZXQgY29tcG9uZW50U2V0cztcbmZ1bmN0aW9uIGdldENvbXBvbmVudFNldERhdGEoKSB7XG4gICAgbGV0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBjb21wb25lbnRTZXRzID0gc2VsZWN0aW9uLmZpbHRlcihsYXllciA9PiAobGF5ZXIudHlwZSA9PT0gXCJDT01QT05FTlRfU0VUXCIpKTtcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb21wb25lbnRTZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGZpcnN0Q29tcG9uZW50U2V0ID0gY29tcG9uZW50U2V0c1tjb21wb25lbnRTZXRzLmxlbmd0aCAtIDFdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcG9uZW50U2V0c0xlbmd0aDogY29tcG9uZW50U2V0cy5sZW5ndGgsXG4gICAgICAgICAgICBudW1iZXJPZkNvbXBvbmVudHM6IGdldE51bWJlck9mQ29tcG9uZW50cyhjb21wb25lbnRTZXRzKSxcbiAgICAgICAgICAgIGZpcnN0Q29tcG9uZW50U2V0OiB7XG4gICAgICAgICAgICAgICAgbWV0YURhdGE6IGdldERhdGFGcm9tQ29tcG9uZW50KGZpcnN0Q29tcG9uZW50U2V0LmNoaWxkcmVuWzBdKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gbmVlZCB0byB1cGRhdGUgVUkgdG8gY29tbXVuaWNhdGUgdGhhdCB0aGUgbGF5ZXJzIHRoYXQgd2VyZSBzZWxlY3RlZCBkb24ndCBjb250YWluIGFueSB2YXJpYW50c1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXROdW1iZXJPZkNvbXBvbmVudHMoY29tcG9uZW50U2V0cykge1xuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBjb21wb25lbnRTZXRzLmZvckVhY2goY29tcG9uZW50U2V0ID0+IHtcbiAgICAgICAgY291bnRlciArPSBjb21wb25lbnRTZXQuY2hpbGRyZW4ubGVuZ3RoO1xuICAgIH0pO1xuICAgIHJldHVybiBjb3VudGVyO1xufVxuZnVuY3Rpb24gZ2V0RGF0YUZyb21Db21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgbGV0IHBhcmVudE5hbWUgPSBjb21wb25lbnQucGFyZW50Lm5hbWU7XG4gICAgbGV0IHBhcnRzID0gY29tcG9uZW50Lm5hbWUuc3BsaXQoXCIsIFwiKTtcbiAgICBsZXQgcHJvcGVydGllcyA9IFtdO1xuICAgIGxldCB2YXJpYW50cyA9IFtdO1xuICAgIHBhcnRzLmZvckVhY2gocGFydFRleHQgPT4ge1xuICAgICAgICBsZXQgc3BsaXRUZXh0ID0gcGFydFRleHQuc3BsaXQoJz0nKTtcbiAgICAgICAgdmFyaWFudHMucHVzaChzcGxpdFRleHRbMV0pO1xuICAgICAgICBwcm9wZXJ0aWVzLnB1c2goc3BsaXRUZXh0WzBdKTtcbiAgICB9KTtcbiAgICBsZXQgdmFyaWFudFN1YnN0cmluZyA9IFwiXCI7XG4gICAgbGV0IGJvb2xzID0gW1wieWVzXCIsIFwidHJ1ZVwiLCBcIm5vXCIsIFwiZmFsc2VcIl07XG4gICAgbGV0IGZhbHNlcyA9IFtcIm5vXCIsIFwiZmFsc2VcIl07XG4gICAgdmFyaWFudHMuZm9yRWFjaCgodmFyaWFudCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGJvb2xzLmluZGV4T2YodmFyaWFudC50b0xvd2VyQ2FzZSgpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHZhcmlhbnRTdWJzdHJpbmcgKz0gYC0ke3ZhcmlhbnQudG9Mb3dlckNhc2UoKX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZhbHNlcy5pbmRleE9mKHZhcmlhbnQudG9Mb3dlckNhc2UoKSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyaWFudFN1YnN0cmluZyArPSBgLSR7cHJvcGVydGllc1tpbmRleF0udG9Mb3dlckNhc2UoKX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gZXg6IC12YXJpYW50MS12YXJpYW50Mi12YXJpYW50My4uLlxuICAgIHZhcmlhbnRTdWJzdHJpbmcgPSB2YXJpYW50U3Vic3RyaW5nLnN1YnN0cmluZygxKTsgLy8gcmVtb3ZlIGZpcnN0ICctJ1xuICAgIHJldHVybiB7IGNvbXBvbmVudE5hbWU6IHBhcmVudE5hbWUsIHZhcmlhbnRTdWJzdHJpbmc6IHZhcmlhbnRTdWJzdHJpbmcgfTtcbn1cbi8vIENhbGxzIHRvIFwicGFyZW50LnBvc3RNZXNzYWdlXCIgZnJvbSB3aXRoaW4gdGhlIEhUTUwgcGFnZSB3aWxsIHRyaWdnZXIgdGhpc1xuLy8gY2FsbGJhY2suIFRoZSBjYWxsYmFjayB3aWxsIGJlIHBhc3NlZCB0aGUgXCJwbHVnaW5NZXNzYWdlXCIgcHJvcGVydHkgb2YgdGhlXG4vLyBwb3N0ZWQgbWVzc2FnZS5cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4gICAgLy8gT25lIHdheSBvZiBkaXN0aW5ndWlzaGluZyBiZXR3ZWVuIGRpZmZlcmVudCB0eXBlcyBvZiBtZXNzYWdlcyBzZW50IGZyb21cbiAgICAvLyB5b3VyIEhUTUwgcGFnZSBpcyB0byB1c2UgYW4gb2JqZWN0IHdpdGggYSBcInR5cGVcIiBwcm9wZXJ0eSBsaWtlIHRoaXMuXG4gICAgaWYgKG1zZy50eXBlID09PSAncHJlZmVyZW5jZScpIHtcbiAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYyhcInByZWZlcmVuY2VcIiwgbXNnLnByZWZlcmVuY2UpO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICdleHBvcnQnKSB7XG4gICAgICAgIC8vIGdldCBhbGwgdGhlIHN0dWZmIGFuc3luYyBmcm9tIGNvbXBvbmVudHNldHNcbiAgICAgICAgbGV0IHByb21pc2VzID0gW107XG4gICAgICAgIGxldCB2YXJpYW50RGF0YUFycmF5ID0gW107XG4gICAgICAgIGNvbXBvbmVudFNldHMuZm9yRWFjaChjb21wb25lbnRTZXQgPT4ge1xuICAgICAgICAgICAgY29tcG9uZW50U2V0LmNoaWxkcmVuLmZvckVhY2godmFyaWFudCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHN2Z1Byb21pc2UgPSB2YXJpYW50LmV4cG9ydEFzeW5jKHsgZm9ybWF0OiBcIlNWR1wiIH0pO1xuICAgICAgICAgICAgICAgIGxldCB2YXJpYW50RGF0YSA9IGdldERhdGFGcm9tQ29tcG9uZW50KHZhcmlhbnQpO1xuICAgICAgICAgICAgICAgIHZhcmlhbnREYXRhQXJyYXkucHVzaCh2YXJpYW50RGF0YSk7XG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChzdmdQcm9taXNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmVzb2x2ZSBhbGwgcHJvbWlzZXNcbiAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oc3ZnRGF0YUFycmF5ID0+IHtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRvd25sb2FkXCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzdmdEYXRhQXJyYXk6IHN2Z0RhdGFBcnJheSxcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudERhdGFBcnJheTogdmFyaWFudERhdGFBcnJheVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==