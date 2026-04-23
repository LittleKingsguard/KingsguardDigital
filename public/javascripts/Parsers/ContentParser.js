import { parseText, parseSpan } from "./InlineContentParsers";
import Content from "../Content";
import { parseAnchor } from "./StructureContentParsers";

//Creates new content array
export function parseNodeList(nodeList, parentData){
    if (nodeList === null || nodeList.length === 0) {
        console.log("No nodes");
        return;
    }
    if (parentData.content === undefined) parentData.content = [];
    nodeList.forEach((node)=>{
        parseNode(node, parentData);
    })
}

function parseNode(node, parentData){
    if (node.nodeType === 3) parseText(node, parentData); //'3' is text node type
    if (node.nodeType === 1) parseElement(node, parentData); //'1' is element node type
}

export function parseElement(element, parentData){
    let isSpecial = checkSpecialHandling(element, parentData);
    console.log(`Is special?: ${isSpecial}`);
    if (isSpecial) return;
    
    let newContent = {
        type: element.tagName.toLowerCase(),
        css: {
            style: element.style,
            classes: parseCSS(element.classList)
        }
    }
    console.log(newContent);
    newContent.parent = parentData;
    if (element.childNodes.length > 0){
        parseNodeList(element.childNodes, newContent);
    }
    parentData.content.push(newContent);
}

function checkSpecialHandling(element, parentData){
    const type = element.tagName;
    switch (type.toLowerCase()) {
        case "a": 
            parseAnchor(element, parentData)
            return true; //TODO: link handling
        case "img":
            return true; //TODO: image handling
        case "span":
            parseSpan(element, parentData);
            return true;
        default:
            return false;
    }
}

export function parserEntry(element, location){
    const parent = Content.getContentbyLocation(location);
    console.log("Starting parse at parent:");
    console.log(parent);
    parseElement(element, parent);
    let newData = parent.content.pop();
    parent.content = newData.content;
    parent.type = "div";
    return parent;
}

export function parseCSS(cssTokenList){
    let cssClasses = cssTokenList.toString().split(" ");
    return cssClasses.filter((cssClass) => {return cssClass !== ""});
}