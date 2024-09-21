import React, { useEffect, useState } from 'react';
import ArtickleHead from './ArticleHead';
import AppArticle from './AppArticle';
import utils from '../utils.mjs';
import Document from '../interfase'; // import interfase for object Document

// interface Result {
//     douments: Document;
// };

function AppMain() {
    const [documents, setDocuments] = useState<Document[]>([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);

    const loadDocuments = async () => {
        try {
            const result = await utils.fetchAll();
            console.log(result)
            if(result.documents) {
                setDocuments(result.documents);
            }
        } catch (error) {
            console.log(error);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);
    
    // Handle loading state

    if (loading) {
        return <div>Loading...</div>;
    };

    return (
        <>
            <ArtickleHead reloadDocuments={loadDocuments} />
            <AppArticle documents={documents} reloadDocuments={loadDocuments} />
        </>
    );
}

export default AppMain;
