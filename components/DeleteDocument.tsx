import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import utils from '../utils.mjs';

interface DeleteDocumentProps {
    id: string;
    clearSelection: () => void; 
}

function DeleteDocument({ id, clearSelection }: DeleteDocumentProps) {
    
    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); 
        try {
            await utils.processRoute('DELETE', `/delete/${id}`); // Call the function with the URL and ID
            clearSelection(); // remove selection on the document with index
            alert('Document deleted successfully!'); // show that document is deleted

        } catch (error) {
            console.error('Failed to delete document at DeleteDocument: ', error);
            alert('Failed to delete document.');
        };
    };

    return (
        <button onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrashCan} width={10}/>
        </button>
    );
};

export default DeleteDocument;