import React from 'react';
// import fucntion that fetch routes
import utils from '../utils.mjs';

// element propertise passed in the AppMain
interface ArtickleHeadProps {
    reloadDocuments: () => void;
}

function ArtickleHead ({ reloadDocuments }: ArtickleHeadProps) {

    // create new document
    const addDocument = async () => {
        try {
            const result = await utils.processRoute("POST");
            console.log(result)
                if(result.acknowledged) {
                    console.log("result true")
                    reloadDocuments();
                }
        } catch (error) {
            return(error);
        }     
        
    };

    return (
        <div className="headers">
            <h2>Documents</h2>
            {/* Add button that create nes document */}
            <button className="create-new-doc button" onClick={addDocument}>
                Create a new document
            </button>
        </div>
    );
}

export default ArtickleHead;
