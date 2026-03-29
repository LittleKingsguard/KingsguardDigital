import { parseText, parseSpan } from "./InlineContentParsers";
import Content from "../Content";

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
        },
        parent: Content.getContentbyLocation(location)
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
    parseElement(element, parent);
    return parent.content.pop();
}

export function parseCSS(cssTokenList){
    let cssClasses = cssTokenList.toString().split(" ");
    return cssClasses.filter((cssClass) => {return cssClass !== ""});
}