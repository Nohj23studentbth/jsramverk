import { useState, useCallback } from 'react'; 
import AppFooter from "./components/includes/AppFooter";
import AppHeader from "./components/includes/AppHeader";
import ErrorBoundary from './components/includes/ErrorBoundary';
import AppMain from "./components/AppMain";
import utils from './utils.mjs';
import Document from './functions/interfase'; // import interface for object Document

function App() {
    const [documents, setDocuments] = useState<Document[]>([]); // Initialize state for documents
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Initialize selected index

    // Use useCallback to prevent re-creation of the function on each render
    const loadDocuments = useCallback(() => {
        utils.loadDocuments(setDocuments, setLoading);
    }, []);

    // Get the selected document ID
    const selectedDocumentId = selectedIndex !== null ? documents[selectedIndex]?._id : null;

    return (
        <>
            <ErrorBoundary>
                <AppHeader 
                    selectedIndex={selectedIndex} 
                    handleClose={() => setSelectedIndex(null)} // Reset selected index on close
                    selectedDocumentId={selectedDocumentId || ""} // Pass the selected document ID
                    reloadDocuments={loadDocuments}
                />
            </ErrorBoundary>
            <ErrorBoundary>
                <AppMain 
                    documents={documents} 
                    loading={loading} 
                    reloadDocuments={loadDocuments} 
                    selectedIndex={selectedIndex} 
                    setSelectedIndex={setSelectedIndex} 
                />
            </ErrorBoundary>
            <AppFooter />
        </>
    );
}

export default App;
