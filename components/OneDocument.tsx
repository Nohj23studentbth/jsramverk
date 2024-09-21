import React, { useState } from 'react';
import utils from '../utils.mjs';
import DeleteDocument from './DeleteDocument';

// interfase for element
interface OneDocumentProps {
    id: string;
    title: string;
    content: string;
    handleClose: () => void;
}

function OneDocument({ id:id, title: intialTitle, content: initialContent, handleClose }: OneDocumentProps) {
    // declare variabels and function to change them
    const [title, setTitle] = useState(intialTitle);
    const [content, setContent] = useState(initialContent);

    // Handle form submit
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent page refresh

        // Update the document by calling the backend API
        const updatedDoc = {id: id, title: title, content: content };
        
        try {
            await utils.processRoute('PUT', `/update`, updatedDoc);
            //reloadDocuments(); // Reload documents after update
        } catch (error) {
            console.error('Failed to update document:', error);
        }
    };

    // element
    return (
        <> {/* wrap all in the one eleemnt */}
            <DeleteDocument
                id={id}
                clearSelection={handleClose} // Clear selection when deleting
                />
            <form onSubmit={handleSubmit}> {/* change when the form submitted */}
                <input type='hidden'name="id" value={id} />
                <input
                    type="text"
                    name="newTitle"
                    value={title}
                    onChange={(e) => {
                    setTitle(e.target.value)
                    console.log(title)}}></input>
                
                <input
                    type="text"
                    name="newContent"
                    value={content}
                    onChange={(e) => {setContent(e.target.value)
                        console.log(content)}
                    }></input>
                
                {/* Submit button for Enter key */}
                <button type="submit">Submit</button>
            </form>
            <button onClick={handleClose}>Back to List</button> {/* Button that return to the list documents*/}
        </>
    );
}

export default OneDocument;