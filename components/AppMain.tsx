import React, { useEffect } from 'react';
import ArticleHead from './ArticleHead';
import AppArticle from './AppArticle';

function AppMain({ documents, loading, reloadDocuments, selectedIndex, setSelectedIndex }) {
    // Load documents on component mount
    useEffect(() => {
        reloadDocuments(); // Call the passed-in function to load documents
    }, [reloadDocuments]);

    // Handle loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main">
            <ArticleHead />
            <AppArticle documents={documents} 
                        reloadDocuments={reloadDocuments} 
                        selectedIndex={selectedIndex} 
                        setSelectedIndex={setSelectedIndex} />
        </div>
    );
}

export default AppMain;