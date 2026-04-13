const sql = require("../db.js");
const Content = require('./content.js')

class Format {
    constructor (data){
        if (typeof data.Formatting === "object") this.format = new Content(data.Formatting);
        else throw new Error ("Format not provided");
        if (typeof data.Description === "string") this.description = data.Description;
        else this.description = "Description not loaded";
        if (typeof data.ID === "number") this.id = data.ID;
        else throw new Error ("Format ID not provided");
        if (typeof data.Creator === "string") this.creator = data.Creator;
        else this.creator = "Creator not loaded";
    }

    get json() {
        let returnJSON = this.format;
        if (returnJSON.props === undefined) returnJSON.props = {};
        returnJSON.props.formatID = this.id;
        returnJSON.props.formatDescription = this.description;
        returnJSON.props.formatCreator = this.creator;

        return returnJSON.json;
    }

    async save(user){
        console.log(user.json);
        await sql`INSERT INTO public."Formats"(
	"Creator", "ID", "Formatting", "Description")
	VALUES (${user.username}, nextval('public."FormatKey"'), ${JSON.stringify(this.format.json)}, ${this.description});`
    }

    static async loadFromDB(id){
        console.log(`Loading format id ${id} from DB`);

        let dbResponse = await sql`Select * FROM public."Formats" WHERE "ID" = ${id};`;
        console.log(dbResponse);
        if (dbResponse.length !== 1) throw new Error("No format found");
        let data = dbResponse.pop();
        console.log(data);
        console.log(`Type of data.ID: ${typeof data.ID}`);
        data.Formatting = JSON.parse(data.Formatting);
        const foundFormat = new Format(data);
        console.log(foundFormat.json);
        return foundFormat;
        }
}
module.exports = Format;