import Content from "./Content";

export function getPlacementObjectbyName(placementName){
    let foundPlacement = {success: false, placement: null};
    if (typeof placementName !== "string") foundPlacement.error = Error(`Bad data - Placement name is not string -- Found ${placementName}`);
    Content.placements.forEach((placement) => {
        if (placement.props.name === placementName) foundPlacement = {success: true, placement: placement};
    })
    return foundPlacement;
}

export function includePlacement(placementData){
    console.log(placementData);
    let {success, placement} = getPlacementObjectbyName(placementData.props.name);
    if (success) return;
    Content.addPlacement(placementData);
}

export function addToPlacement(data){
    let {success, placement} = getPlacementObjectbyName(data.placement);
    if (success){
        if (!Array.isArray(placement.content)) placement.content = [placement.content];
        placement.content.push(data);
    }
    else {
        throw new Error("placement not found");
    }
}

export function findAllPlacements(format, i = 0, parent = {}){
    if (typeof format !== "object") return;
    if (typeof format.type !== "string") return;
    if (Array.isArray(parent.location)) format.location = [...parent.location, i];
    else format.location = [i];
    format.parent = parent;
    if (typeof format.content === "string") return;
    if (typeof format.content !== "object") format.content = [];
    if (!Array.isArray(format.content)) format.content = [format.content];
    if (Array.isArray(parent.location)) format.location = [...parent.location, i];
    else format.location = [i];
    format.parent = parent;
    if (format.type !== "placement") {
        format.content.forEach((content, childIndex) => findAllPlacements(content, childIndex, format));
    }
    else {
        includePlacement(format)
    }
}

export function parseDataIntoPlacements(data, i = 0){
    if (typeof data !== "object") throw new Error("Bad data - content is not an object");
    if (Array.isArray(data)) return data.map(parseDataIntoPlacements);
    if (typeof data.type !== "string") throw new Error("Bad data - data is not content");
    if (data.type === "placement") includePlacement(data);
    data.contentParent = "root";
    if (typeof data.placement === "string"){
        try {
            addToPlacement(data);
        }
        catch (error) {
            console.log(error);
        }
    }
    if (!Array.isArray(data.content)) data.content = [data.content];
    data.location = [i];
    data.content.forEach((childData, childIndex) => {
        if (typeof childData !== "object") return;
        childData.contentParent = data;
        parseDataIntoPlacementsHelper(childData, childIndex);
    })
}

function parseDataIntoPlacementsHelper(data, i){
    if (typeof data !== "object") throw new Error("Bad data - content is not an object");
    if (typeof data.type !== "string") throw new Error("Bad data - data is not content");
    if (data.type === "placement") includePlacement(data);
    if (typeof data.placement === "string" && data.placement !== data.contentParent.placement){ //If not in different placement from parent, it is already included in tree
        try {
            addToPlacement(data, data.placement);
        }
        catch (error) {
            console.log(error);
        }
    }
    data.location = [...data.contentParent.location, i];
    if (typeof data.content !== "object") return; //Only iterate through content with children
    if (!Array.isArray(data.content)) data.content = [data.content]; //Make child iterable if not already;
    data.content.forEach((childData, childIndex) => {
        if (typeof childData !== "object") return; //Text strings cannot have different placements
        childData.contentParent = data; //Set data parent for checking placement
        parseDataIntoPlacementsHelper(childData, childIndex); //Recurse through tree
    })
}