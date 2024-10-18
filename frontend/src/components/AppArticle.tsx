import OneDocument from './OneDocument';
import User from '../functions/interfase'; // import interface for object Document
import Document from '../functions/interfase'; 
// element properties
interface AppArticleProps {
    //users: User[];
    documents: Document[];
    //reloadUsers: () => void;
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
        //reloadUsers();
    };
    const selectedDocument = selectedIndex !== null && documents[selectedIndex];

    return (
        <div className='article'>
            {selectedIndex === null || !selectedDocument ? ( // if no document is selected or invalid selection
                <ul className='list-group'>
                    {Array.isArray(documents) && documents.length === 0 ? (
                    <p>No documents found</p>
                        ) : null
                    }
                    {Array.isArray(documents) && documents.map((doc, index) => (
                        <li
                            className="list-group-item"
                            key={doc._id}
                            onClick={() => handleSelect(index)}
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