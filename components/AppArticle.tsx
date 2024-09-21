import React, { useState } from 'react';
import OneDocument from './OneDocument';
import Document from '../interfase'; // import interfase for object Document

// element properties
interface AppArticleProps {
    documents: Document[];
    reloadDocuments: () => void;
}

function AppArticle({ documents, reloadDocuments }: AppArticleProps) {

    // declare variables and function that change them
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Null means no document is selected


    // select dokument
    const handleSelect = (index: number) => {
        setSelectedIndex(index);
    };

    // remove selection
    const handleClose = () => {
        setSelectedIndex(null);
        reloadDocuments();
    };

    // element
    return (
        <div>
            {selectedIndex === null ? ( // if no document selected
                <ul className='list-group'>
                    {documents.length === 0 ? <p>No documents found</p> : null}
                    {documents.map((doc, index) => (
                       
                        <li
                            className="list-group-item"
                            key={doc._id}
                            onClick={() => handleSelect(index)} // select dokument by click on te element
                        >
                            <h3>{doc.title}</h3>
                        </li>
                    ))}
                </ul>
            ) : ( // incase if document selected
                <OneDocument id={documents[selectedIndex]._id}
                    title={documents[selectedIndex].title}
                    content={documents[selectedIndex].content}
                    handleClose={handleClose}/>
            )}
        </div>
    );
}

export default AppArticle;