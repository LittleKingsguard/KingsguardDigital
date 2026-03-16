import { parseText, parseSpan } from "./InlineContentParsers";

//Creates new content array
export function parseNodeList(nodeList){
    if (nodeList === null || nodeList.length === 0) {
        console.log("No nodes");
        return;
    }
    let newContent = [];
    nodeList.forEach((node)=>{
        newContent.unshift(parseNode(node));
    })
    return newContent;
}

function parseNode(node){
    if (node.nodeType === 3) return parseText(node); //'3' is text node type
    if (node.nodeType === 1) return parseElement(node); //'1' is element node type
}

export function parseElement(element){
    let newContent = checkSpecialHandling(element);
    console.log(newContent);
    if (Object.keys(newContent).length !== 0) return newContent;
    newContent.type = element.tagName.toLowerCase();
    let css = {
        style: element.style,
        classes: parseCSS(element.classList)
    }
    newContent.css = css;
    if (element.childNodes.length > 0){
        newContent.content = parseNodeList(element.childNodes);
    }
    return newContent;
}

function checkSpecialHandling(element){
    const type = element.tagName;
    switch (type.toLowerCase()) {
        case "a": 
            return //TODO: link handling
        case "img":
            return //TODO: image handling
        case "span":
            return parseSpan(element);
        default:
            return {}
    }
}

export function parseCSS(cssTokenList){
    return cssTokenList.toString().split(" ");
}