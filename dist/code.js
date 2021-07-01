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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9FeHBvcnQtVmFyaWFudHMvLi9zcmMvY29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0EsNEJBQTRCLDBCQUEwQjtBQUN0RCwwQkFBMEIsaUVBQWlFO0FBQzNGLENBQUM7QUFDRDtBQUNBLDBCQUEwQix1REFBdUQ7QUFDakYsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywrQkFBK0I7QUFDakUsU0FBUztBQUNUO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ3ByZWZlcmVuY2UnKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAyNzYsIGhlaWdodDogMTg0IH0pO1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogXCJzZXR1cFwiLCBkYXRhOiBnZXRDb21wb25lbnRTZXREYXRhKCksIHByZWZlcmVuY2U6IHJlc3VsdCB9KTtcbn0pO1xuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4ge1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogXCJzZWxlY3Rpb25DaGFuZ2VcIiwgZGF0YTogZ2V0Q29tcG9uZW50U2V0RGF0YSgpIH0pO1xufSk7XG4vLyBUT0RPOiBTZXR1cCBEZWZhdWx0IEV4cG9ydCBTZXR0aW5nc1xubGV0IGRlZmF1bHRFeHBvcnRTZXR0aW5ncztcbmZ1bmN0aW9uIGdldENvbXBvbmVudFNldERhdGEoKSB7XG4gICAgbGV0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBsZXQgY29tcG9uZW50U2V0cyA9IHNlbGVjdGlvbi5maWx0ZXIobGF5ZXIgPT4gKGxheWVyLnR5cGUgPT09IFwiQ09NUE9ORU5UX1NFVFwiKSk7XG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZWxzZSBpZiAoY29tcG9uZW50U2V0cy5sZW5ndGggIT0gMCkge1xuICAgICAgICBsZXQgZmlyc3RDb21wb25lbnRTZXQgPSBjb21wb25lbnRTZXRzW2NvbXBvbmVudFNldHMubGVuZ3RoIC0gMV07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21wb25lbnRTZXRzTGVuZ3RoOiBjb21wb25lbnRTZXRzLmxlbmd0aCxcbiAgICAgICAgICAgIG51bWJlck9mQ29tcG9uZW50czogZ2V0TnVtYmVyT2ZDb21wb25lbnRzKGNvbXBvbmVudFNldHMpLFxuICAgICAgICAgICAgZmlyc3RDb21wb25lbnRTZXQ6IHtcbiAgICAgICAgICAgICAgICBtZXRhRGF0YTogZ2V0RGF0YUZyb21Db21wb25lbnQoZmlyc3RDb21wb25lbnRTZXQuY2hpbGRyZW5bMF0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBuZWVkIHRvIHVwZGF0ZSBVSSB0byBjb21tdW5pY2F0ZSB0aGF0IHRoZSBsYXllcnMgdGhhdCB3ZXJlIHNlbGVjdGVkIGRvbid0IGNvbnRhaW4gYW55IHZhcmlhbnRzXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldE51bWJlck9mQ29tcG9uZW50cyhjb21wb25lbnRTZXRzKSB7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGNvbXBvbmVudFNldHMuZm9yRWFjaChjb21wb25lbnRTZXQgPT4ge1xuICAgICAgICBjb3VudGVyICs9IGNvbXBvbmVudFNldC5jaGlsZHJlbi5sZW5ndGg7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG59XG5mdW5jdGlvbiBnZXREYXRhRnJvbUNvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICBsZXQgcGFyZW50TmFtZSA9IGNvbXBvbmVudC5wYXJlbnQubmFtZTtcbiAgICBsZXQgcGFydHMgPSBjb21wb25lbnQubmFtZS5zcGxpdChcIiwgXCIpO1xuICAgIGxldCB2YXJpYW50cyA9IFtdO1xuICAgIHBhcnRzLmZvckVhY2gocGFydFRleHQgPT4ge1xuICAgICAgICBsZXQgc3BsaXRUZXh0ID0gcGFydFRleHQuc3BsaXQoJz0nKTtcbiAgICAgICAgdmFyaWFudHMucHVzaChzcGxpdFRleHRbMV0pO1xuICAgIH0pO1xuICAgIHJldHVybiB7IG5hbWU6IHBhcmVudE5hbWUsIHZhcmlhbnRzOiB2YXJpYW50cyB9O1xufVxuLy8gQ2FsbHMgdG8gXCJwYXJlbnQucG9zdE1lc3NhZ2VcIiBmcm9tIHdpdGhpbiB0aGUgSFRNTCBwYWdlIHdpbGwgdHJpZ2dlciB0aGlzXG4vLyBjYWxsYmFjay4gVGhlIGNhbGxiYWNrIHdpbGwgYmUgcGFzc2VkIHRoZSBcInBsdWdpbk1lc3NhZ2VcIiBwcm9wZXJ0eSBvZiB0aGVcbi8vIHBvc3RlZCBtZXNzYWdlLlxuZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcbiAgICAvLyBPbmUgd2F5IG9mIGRpc3Rpbmd1aXNoaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIG1lc3NhZ2VzIHNlbnQgZnJvbVxuICAgIC8vIHlvdXIgSFRNTCBwYWdlIGlzIHRvIHVzZSBhbiBvYmplY3Qgd2l0aCBhIFwidHlwZVwiIHByb3BlcnR5IGxpa2UgdGhpcy5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdwcmVmZXJlbmNlJykge1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKFwicHJlZmVyZW5jZVwiLCBtc2cucHJlZmVyZW5jZSk7XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2V4cG9ydCcpIHtcbiAgICAgICAgY29uc29sZS5sb2cobXNnLnNlbGVjdGlvbik7XG4gICAgICAgIC8vIGdldCBhbGwgdGhlIHN0dWZmIGFuc3luY1xuICAgICAgICAvLyBtb3ZlIHRoaXMgaW50byB0aGUgdGhlblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogXCJkb3dubG9hZFwiLCBkYXRhOiBudWxsIH0pO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==