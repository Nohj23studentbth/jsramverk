import { useState, useCallback, useEffect } from 'react'; 
import AppFooter from "./components/includes/AppFooter";
import AppHeader from "./components/includes/AppHeader";
import ErrorBoundary from './components/includes/ErrorBoundary';
import AppMain from "./components/AppMain";
import Auth from './components/Auth';
import utils from './utils.mjs';
import Document from './functions/interfase'; // import interface for object Document
import { socket } from './socket.mjs';

function App() {    
    const [documents, setDocuments] = useState<Document[]>([]); // Initialize state for documents
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Initialize selected index
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Track login state
    const [username, setUsername] = useState<string | null>(null);
    
    // Check if the user is authenticated by trying to load documents (if cookies are set)
    const loadDocuments = async () => {
        setLoading(true);
        try {
            await utils.loadDocuments(username, setDocuments); 
        } catch (error) {
            console.error("Error loading documents:", error);
        } finally {
            setLoading(false);
        }
    };
    const checkAuthentication = async () => {
        try {
            // You can make a request to the backend to verify if the JWT cookie is valid
            const response = await fetch('/auth/verify-token', { credentials: 'include' });
            if (response.ok) {
                const result = await response.json();
                setUsername(result.username); // Set the username from the backend response
                setIsAuthenticated(true);
                loadDocuments(); // Load documents after verifying token
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error verifying token:", error);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        
        checkAuthentication(); // Check if the user is authenticated on component mount
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true); // Set the authentication state after login
    };


    // useEffect(() => { 
    //     const storedUsername = sessionStorage.getItem('username');
    //     const storedToken = sessionStorage.getItem('token');
        
    //     if (storedUsername) {
    //         setUsername(storedUsername);
    //     }
    //     if (storedToken) {
    //         setToken(storedToken);
    //     }
    // }, []);

    // const getDocuments = (async() => {
    //     if (sessionStorage.getItem('username')) {
    //         setUsername(sessionStorage.getItem('username'));
    //     }
    //     if (sessionStorage.getItem('token')) {
    //         setToken(sessionStorage.getItem('token'));
    //     }
    //     if (!token) return; // Prevent calling if username is not set
    //     setLoading(true); // Start loading

    //     try {
    //         const res = await loadDocuments();
    //     } catch (error) {
    //         console.error("Error loading documents:", error);
    //     } finally {
    //         setLoading(false); // End loading
    //     }
    // });
    
    //  useEffect(() => {
    //     if (token) {
    //         getDocuments(); // Load documents if the token exists
    //     }
    // }, [token, username]); // Re-run when token or username changes

    // // Handle successful login
    // const handleLoginSuccess = () => {
    //     const storedToken = sessionStorage.getItem("token");
    //     if (storedToken) {
    //         setToken(storedToken); // Update token in state after login
    //     }
    // };

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
                    isAutenticated={isAuthenticated}
                    // password={password}
                    // token={token}
                />
            </ErrorBoundary>
            <ErrorBoundary>
            {isAuthenticated ?( 
                <AppMain
                    username={username}
                    documents={documents} 
                    loading={loading} 
                    reloadDocuments={loadDocuments} 
                    selectedIndex={selectedIndex} 
                    setSelectedIndex={setSelectedIndex} 
                />) : (<Auth onLoginSuccess={handleLoginSuccess} />)}
            </ErrorBoundary>
            <AppFooter />
        </>
    );
}

export default App;
