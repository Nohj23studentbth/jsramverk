import React from "react";
import { useState } from "react";
function ListGroup() {
    const items = [
        {
            id: 1,
            title: "title1"
        },
        {
            id: 2,
            title: "title2"
        }
    ]
    
    //Hook (StateHook)
    const [selectedIndex, setSelectedIndex] = useState(-1);
    
    const getMessage = () => {
        return items.map.length === 0 && <p>No items found</p>;
    }

    //const handleClick = (event: MouseEvent) => console.log(event);
    return (<>
    <h1>List</h1>
        {getMessage()}
        <ul className="list-group">
            {items.map((item: any, index) => 
            (<li 
                className={selectedIndex === index ? "list-group-item active" : "list-group-item"}
                key={item.id} 
                onClick={() => {setSelectedIndex(index)}}>{item.title} : {item.id}
            </li>))}
        </ul>
        </>
    );
}

export default ListGroup;