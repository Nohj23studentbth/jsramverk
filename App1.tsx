import { useState, useCallback, useEffect } from 'react'; 
import AppFooter from "./components/includes/AppFooter";
import AppHeader from "./components/includes/AppHeader";
import ErrorBoundary from './components/includes/ErrorBoundary';
import AppMain from "./components/AppMain";
import Login from './components/Login';  // Import the Login component
import utils from './utils.mjs';
import Document from './functions/interfase'; // import interface for object Document

function App() {
    const [documents, setDocuments] = useState<Document[]>([]); // Initialize state for documents
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Initialize selected index
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Track login state

    // Use useCallback to prevent re-creation of the function on each render
    const loadDocuments = useCallback(() => {
        const token = localStorage.getItem('token');  // Get token from localStorage

        if (!token) {
            setIsAuthenticated(false);  // If no token, user is not authenticated
            return;
        }

        fetch('/documents', {
            headers: {
                'Authorization': `Bearer ${token}`,  // Send the token in Authorization header
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unauthorized');
            }
            return response.json();
        })
        .then(data => {
            // setDocuments(data);
            // setLoading(false);
            utils.loadDocuments(localStorage.getItem("username"), setDocuments, setLoading);
        })
        .catch(error => {
            console.error(error);
            setIsAuthenticated(false);  // If token is invalid, reset login state
        });
    }, []);

    // Get the selected document ID
    const selectedDocumentId = selectedIndex !== null ? documents[selectedIndex]?._id : null;

    // Check if the user is authenticated by checking for a token
    useEffect(() => {
        const token = localStorage.getItem('token');
        handleLoginSuccess();
        if (token) {
            setIsAuthenticated(true);
            loadDocuments();  // Load documents if user is authenticated
        }
    }, [loadDocuments]);

    // Handle successful login by reloading documents and setting authenticated state
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        loadDocuments();  // Reload documents after successful login
    };

    // If not authenticated, show the login page
    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

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
