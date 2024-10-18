import React from 'react'; 
import logo from './../../functions/logo.svg';
import utils from '../../utils.mjs';

interface AppHeaderProps {
    reloadDocuments: () => void;
    selectedIndex: number | null;
    username: string | null;
    password: string | null;
    token: string | null;
    handleClose: () => void;
    selectedDocumentId: string; 
}

function AppHeader({ 
    selectedIndex, 
    handleClose, 
    selectedDocumentId, 
    username, 
    password, 
    token, 
    reloadDocuments 
}: AppHeaderProps) {

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        window.location.reload();
    };

    const addDocument = async () => {
        try {
            const result = await utils.processRoute("POST", "/data", { username: username });
            if (result.status === 200) {
                alert('New document is created!');
                reloadDocuments();
            }
        } catch (error) {
            console.error('Failed to create document: ', error);
        }
    };

    const deleteDocument = async () => {
        try {
            const response = await utils.processRoute('DELETE', 
                `/data/delete/${selectedDocumentId}`,
                { username: username, password: password });

            if (response.status === 200) {
                alert('Document deleted successfully!');
                handleClose();
                reloadDocuments();
            } else {
                alert("Failed to delete document.");
            }
        } catch (error) {
            console.error('Failed to delete document: ', error);
        }
    };

    return (
        <header className="header">
            <img src={logo} className="App-logo" alt="logo" width="100" />
            <h1>SSR Documents Editor</h1>

            {/* Conditionally render "Create Document" and "Logout" buttons based on login status */}
            {token && (
                <>
                    <div>
                        {selectedIndex === null ? (
                        <>
                            <button className="change-collection" onClick={addDocument}>
                                Create document
                            </button>
                            <button className="change-collection" onClick={logOut}>
                                Logout
                            </button>
                        </>
                        ) : (
                        <>
                            <button className="change-collection" onClick={deleteDocument}>
                                Remove document
                            </button>
                            <button className="change-collection" onClick={logOut}>
                                Logout
                            </button>
                        </>
                        )}
                    </div>
                    
                </>
            )}
        </header>
    );
}

export default AppHeader;
