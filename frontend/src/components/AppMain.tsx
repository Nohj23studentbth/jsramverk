import { useEffect } from 'react';

import ArticleHead from './ArticleHead';
import AppArticle from './AppArticle';
import Document from '../functions/interfase';

// element properties
interface AppMainProps {
    documents: Document[];
    loading: boolean;
    reloadDocuments: () => void;
    selectedIndex: number | null; // Selected document index from parent
    setSelectedIndex: (index: number | null) => void; // Function to update selectedIndex in parent
}

function AppMain({ documents, loading, reloadDocuments, selectedIndex, setSelectedIndex }: AppMainProps) {
    // Load documents on component mount
    useEffect(() => {
        //reloadDocuments(); // Call the passed-in function to load documents
    }, [reloadDocuments]);

    // Handle loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main">
            <ArticleHead documents={documents}
            selectedIndex={selectedIndex} />
            <AppArticle documents={documents} 
                        reloadDocuments={reloadDocuments} 
                        selectedIndex={selectedIndex} 
                        setSelectedIndex={setSelectedIndex} 
                       />
        </div>
    );
}

export default AppMain;