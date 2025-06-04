export default async function getData(URL, setFunction){
    try {
        const response = await fetch(URL);
        if (response.ok) {
            const data = await response.json();
            //console.log("Got data: " + JSON.stringify(data));
            setFunction(data);
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}