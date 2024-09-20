import React, { useEffect, useState } from 'react';
import ArtickleHead from './ArtickleHead';

interface Document {
    _id: string;
    title: string;
    content: string;
};

function AppMain() {
    const [documents, setDocuments] = useState<Document[]>([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);

    //Hook (StateHook)
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const getMessage = (documents: any) => {
        return documents.length === 0 && <p>No documents found</p>;
    }
    const fetchDocuments = async () => {
        try {
            const response = await fetch('http://localhost:3000/rm/');
            const result = await response.json();
            
            // result.documents is an array
            setDocuments(result.documents);
        } catch (error) {
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);
    
    // Handle loading state

    return (
        <>
        <ArtickleHead reloadDocuments={fetchDocuments}/>
        {getMessage(documents)}
        <ul className='list-group'>
            {documents.map((doc, index) => 
                <li 
                    className={selectedIndex === index ? "list-group-item active" : "list-group-item"}
                    key={doc._id} 
                    onClick={() => {setSelectedIndex(index)}}><h3><a href={doc._id}>{doc.title}</a></h3>
                </li>
            )}
        </ul>
        </>
    );
}

export default AppMain;
