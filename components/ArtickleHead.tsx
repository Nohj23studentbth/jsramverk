import React, { useEffect, useState } from 'react';

interface ArtickleHeadProps {
    reloadDocuments: () => void;
}

function ArtickleHead ({ reloadDocuments }: ArtickleHeadProps) {
// Move the function outside useEffect to call it on demand
const fetchDocuments = async () => {
    try {
        const response = await fetch('http://localhost:3000/rm/mongo/new');
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.log(error);
    }
};

// Now you can call fetchDocuments when h3 is clicked
const newDoc = () => {
    fetchDocuments(); // Call the API function here
    reloadDocuments();
};

return (
    <div className="headers">
        <h2>Documents</h2>
        <button className="create-new-doc button" onClick={newDoc}>
            Create a new document
        </button>
    </div>
);
}

export default ArtickleHead;

function reloadDocuments() {
    throw new Error('Function not implemented.');
}
