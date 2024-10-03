const localBackend = "http://localhost:3000";
const utils = {

    /**
     * Fetch route functionality to the React component
     * @async
     * 
     * @param {string} [passedMethod='GET'] - HTTP method ('GET', 'POST', etc.)
     * @param {object|null} [body=null] - Request body (used only for POST/PUT requests)
     * @param {object} [headers={}] - Request headers
     * //
     * @param {string} route : express-route route
     * @returns {Promise<array>}: returns one ore more dokuments as array
     */
    processRoute : async function processRoute(passedMethod = 'GET', route = "", body = null, headers = {}) {
        const url = localBackend + route;

        const defaultHeaders = { 'Content-Type': 'application/json'};
        const mergeHeaders = {...defaultHeaders, ...headers};

        const options = {
            method: passedMethod,
            headers: mergeHeaders,
            body: body ? JSON.stringify(body) : null, 
        };

        try {
            // Pass the URL and options to fetch
            const response = await fetch(url, options);

            if (!response.ok) {
                console.log(`HTTP error! Status: ${response.status}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.log('Failed to fetch documents in processRoute.processRoute:', error);
            return error;
        }
    },

    /**
     * Reload documents on the page
     * @async
     * 
     * @param {function} setDocuments 
     * @param {function} setLoading 
     * 
     * @returns {void}
     */
    loadDocuments: async function loadDocuments(setDocuments, setLoading) {
        try {
            const result = await this.processRoute('GET'); // Call fetch function here
            if (result.documents) {
                setDocuments(result.documents); // Update documents state
            } else {
                setDocuments([]); // Handle no documents case
            }
        } catch (error) {
            console.error("Error loading documents:", error);
            setDocuments([]); // Reset documents on error
        } finally {
            setLoading(false); // Stop loading state
        }
    },
}

export default utils;
