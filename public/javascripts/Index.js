import React from "react";
import {createRoot} from 'react-dom/client';
import Content from "./Content";
import GetContent from "./GetContent";

const root = createRoot(document.getElementById('root'));
//root.render(<div><p>"Thishappened"</p></div>);
root.render(<Content.DisplayContent/>);
window.getContent = GetContent;