import { useState, useCallback, useEffect } from 'react'; 
import AppFooter from "./components/includes/AppFooter";
import AppHeader from "./components/includes/AppHeader";
import ErrorBoundary from './components/includes/ErrorBoundary';
import AppMain from "./components/AppMain";
import Login from './components/Login';
import utils from './utils.mjs';
import Document from './functions/interfase'; // import interface for object Document

function App() {

    const [documents, setDocuments] = useState<Document[]>([]); // Initialize state for documents
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Initialize selected index
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Track login state
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    
    //const token = localStorage.getItem('token');

    useEffect(() => { 
        const storedUsername = localStorage.getItem('username');
        const storedToken = localStorage.getItem('token');
        
        if (storedUsername) {
            setUsername(storedUsername);
            console.log("Stored Username:", storedUsername);
        }
        if (storedToken) {
            setToken(storedToken);
            console.log("Stored Token:", storedToken);
        }
    }, []);

    const loadDocuments = async () => {
        // if (!username) return; // Prevent calling if username is not set
    
        setLoading(true); // Start loading
        try {
            //set documents in utils.mjs
            await utils.loadDocuments(username, setDocuments); // Fetch documents
             // Log the loaded documents
        } catch (error) {
            console.error("Error loading documents:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const getDocuments = (async() => {
        if (localStorage.getItem('username')) {
            setUsername(localStorage.getItem('username'));
            console.log("Stored Username:", username);
        }
        if (localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            console.log("Stored Token:", localStorage.getItem('token'));
        }
        if (!token) return; // Prevent calling if username is not set
        console.log(username)
        setLoading(true); // Start loading

        try {
            const res = await loadDocuments();
        } catch (error) {
            console.error("Error loading documents:", error);
        } finally {
            setLoading(false); // End loading
        }
    });
    
     useEffect(() => {
        if (token) {
            getDocuments(); // Load documents if the token exists
        }
    }, [token, username]); // Re-run when token or username changes

    // Handle successful login
    const handleLoginSuccess = () => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken); // Update token in state after login
        }
    };

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
                    username={username}
                    password={password}
                    token={token}
                />
            </ErrorBoundary>
            <ErrorBoundary>
            {token ?( 
                <AppMain 
                    documents={documents} 
                    loading={loading} 
                    reloadDocuments={loadDocuments} 
                    selectedIndex={selectedIndex} 
                    setSelectedIndex={setSelectedIndex} 
                />) : (<Login onLoginSuccess={handleLoginSuccess} />)}
            </ErrorBoundary>
            <AppFooter />
        </>
    );
}

export default App;