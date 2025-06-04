var badData = require('../public/StaticData/TestProfile2.json');

class Content {

    static validTypes = ["form","fieldset","select","option","datalist","optgroup","input","output","label",
        "legend","textarea","button","a", "text","em", "strong","cite","mark","dfn", "p","h1","h2","h3","h4",
        "h5","h6","title","li","th","td","img","video","svg","canvas","div","ul", "login", "userPane"];
    static propTypes = ["a","dfn","img","video","svg","canvas", "form", "input", "button", "textarea"];
    static textTypes = ["text", "title", "textarea", "label", "button"];
    static emptyTypes= ["input", "login"];

    static validateContents(data){
        if (this.textTypes.includes(data.type) && typeof data.content !== 'string') {
            data.content = "Bad data";
            return data;
        }
        if (this.textTypes.includes(data.type)) return data;
        if (this.emptyTypes.includes(data.type)) return data;
        if (typeof data.content !== 'object') {
            data.content = badData;
            return data;
        }
        else {
            data.content = new Content(data.content);
            return data;
        }
    }
    static validateProps(data){
        const type = data.type;
        if (!Content.propTypes.includes(type)) return data;
        switch (type) {
            case "a":
                if (typeof data.props.url !== "string") data.props.url = "";
                break;
            case "dfn":
                if (typeof data.props.title !== "string") data.props.title = "";
                break;
            case "img":
                if (typeof data.props.src !== "string") data.props.src = "";
                if (typeof data.props.height !== "number") data.props.height = 0;
                if (typeof data.props.width !== "number") data.props.width = 0;
                break;
            case "video":
                if (typeof data.props.src !== "string") data.props.src = "";
                if (typeof data.props.height !== "number") data.props.height = 0;
                if (typeof data.props.width !== "number") data.props.width = 0;
                break;
            case "canvas":
                if (typeof data.props.height !== "number") data.props.height = 0;
                if (typeof data.props.width !== "number") data.props.width = 0;
                break;
            case "svg":
                if (typeof data.props.vectors !== "object") data.props.vectors = [];
                if (typeof data.props.height !== "number") data.props.height = 0;
                if (typeof data.props.width !== "number") data.props.width = 0;
                break;
        }
        return data;
    }

    constructor(data){
        if (Content.emptyTypes.includes(data.type)) console.log(data);
        if (Array.isArray(data)) return data.map((data) => {return new Content(data);});
        if (typeof data !== 'object') return new Content(badData);
        if (typeof data.type !== 'string' ||
            (typeof data.content === "undefined" && !Content.emptyTypes.includes(data.type))) return new Content(badData);
        if (!Content.validTypes.includes(data.type)) return new Content(badData);
        if (typeof data.css !== "object") data.css = {};
        if (typeof data.css.id !== "string") data.css.id = "";
        if (typeof data.css.classes === "string") data.css.classes = [data.css.classes];
        if (!Array.isArray(data.css.classes)) data.css.classes = [];
        data = Content.validateContents(data);
        data = Content.validateProps(data);
        this.type = data.type;
        this.content = data.content;
        this.css = data.css;
        this.props = data.props;
    }

    get json() {
        return ({
                "type": this.type,
                "css": this.css,
                "content": this.content,
                "props": this.props
            }
        )
    }


}
module.exports = Content;