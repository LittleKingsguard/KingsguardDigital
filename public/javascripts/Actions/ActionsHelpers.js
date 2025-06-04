

export async function postFetch(url, data) {
    const bodyString = JSON.stringify(data);
    console.log(bodyString);
    try {
        const response = await fetch(url,{method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: bodyString});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

export function loadDispatch(data, dispatch){
    dispatch({
        type: "load",
        content: data
    })
}

export function modifyDispatch(data, location, dispatch){
    dispatch({
        type: "modify",
        content: data,
        location: location
    })
}

export function insertDispatch(data, location, dispatch){
    dispatch({
        type: "insert",
        content: data,
        location: location
    })
}

export function deleteDispatch(location, dispatch){
    dispatch({
        type: "delete",
        location: location
    })
}

export function validateRecur(location, data){
    console.log("Validating recurrence at: " + location + " in data: ");
    console.log(data);
    let returnvalue = true;
    if (Array.isArray(data.content)){
        if (location[0] > data.content.length) returnvalue = false;
        if (location[0] === data.content.length && location.length > 1) returnvalue = false;
    }
    else {
        if (location[0] > 1) returnvalue = false;
        if (location[0] === 1 && location.length > 1) returnvalue = false;
    }
    console.log("Is valid recurrence? " + returnvalue);
    return returnvalue;
}

export function validateLocation(location){
    if (!Array.isArray(location)) return false;
    let isNumber = location.length !== 0;
    location.forEach((e)=>{
        if (!Number.isInteger(e) || e < 0) isNumber = false;
    });
    return isNumber;
}

export function dataCloner(data){
    return JSON.parse(JSON.stringify(data));
}