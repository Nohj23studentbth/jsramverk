import React from 'react';
import OneDocument from './OneDocument';
import Document from '../interfase'; // import interface for object Document

// element properties
interface AppArticleProps {
    documents: Document[];
    reloadDocuments: () => void;
    selectedIndex: number | null; // Selected document index from parent
    setSelectedIndex: (index: number | null) => void; // Function to update selectedIndex in parent
}

function AppArticle({ documents, reloadDocuments, selectedIndex, setSelectedIndex }: AppArticleProps) {

    // select document
    const handleSelect = (index: number) => {
        setSelectedIndex(index); // Update the parent component's selectedIndex
    };

    // remove selection and reload documents
    const handleClose = () => {
        setSelectedIndex(null);
        reloadDocuments();
    };
    const selectedDocument = selectedIndex !== null && documents[selectedIndex];

    return (
        <div className='article'>
            {selectedIndex === null || !selectedDocument ? ( // if no document is selected or invalid selection
                <ul className='list-group'>
                    {documents.length === 0 ? <p>No documents found</p> : null}
                    {documents.map((doc, index) => (
                        <li
                            className="list-group-item"
                            key={doc._id}
                            onClick={() => handleSelect(index)} // select document by click on the element
                        >
                            <h3>{doc.title}</h3>
                        </li>
                    ))}
                </ul>
            ) : ( // if a document is selected, render OneDocument component
                
                <OneDocument 
                    id={documents[selectedIndex]._id}
                    title={documents[selectedIndex].title}
                    content={documents[selectedIndex].content}
                    handleClose={handleClose}
                />
            )}
        </div>
    );
}

export default AppArticle;