const localBackend = "http://localhost:3000";
const remoteBackend = "https://jsramverk-oleg22-g9exhtecg0d2cda5.northeurope-01.azurewebsites.net/";

// Bestäm vilken backend som ska användas baserat på om vi kör lokalt eller i produktion
const backendUrl = window.location.hostname === 'localhost' ? localBackend : remoteBackend;
const utils = {

    /**
     * Fetch route functionality to the React component
     * @async
     * 
     * @param {string} [passedMethod] - HTTP method ('GET', 'POST', etc.)
     * @param {string} [route]
     * @param {object|null} [body=null] - Request body (used only for POST/PUT requests)
     * @param {object} [headers={}] - Request headers
     * 
     * @param {string} route : express-route route
     * @returns {Promise<array>}: returns one ore more dokuments as array
     */
    processRoute : async function processRoute(passedMethod = 'GET', route = "/", body = null, headers = {}) {
        const url = backendUrl + route;
        console.log("route: ",route)
        console.log(" url: ",url)

        const defaultHeaders = { 'Content-Type': 'application/json'};
        const mergeHeaders = {...defaultHeaders, ...headers};

        const options = {
            method: passedMethod,
            headers: mergeHeaders,
            body: body ? JSON.stringify(body) : null, 
        };

        try {
            // Pass the URL and options to fetch
            console.log(`Fetching data from URL: ${url} with options:`, options)
            const response = await fetch(url, options);
            console.log("Respons of the processRoute", response)
            if (!response.ok) {
                console.log (response)
                return response
            }
            const result = await response.json();
            console.log(result)
            return {
                status: response.status,
                result: result
            };
        } catch (error) {
            console.log('Failed to fetch documents in processRoute.processRoute:', error);
            return error;
        }
    },

    /**
     * Reload documents on the page
     * @async
     * 
     * @param {string |null} userName name of the user
     * @param {function} setDocuments 
     * @param {function} setLoading
     * 
     * @returns {void}
     */
    loadDocuments: async function loadDocuments(userName, setDocuments) {
        try {
            const result = await this.processRoute('GET', `/data/${userName}`); // Call fetch function here
            if (result.status === 200) {
                setDocuments(result.result); // Update documents state
            } else {
                setDocuments([]); // Handle no documents case
            }
        } catch (error) {
            console.error("Error loading documents:", error);
            setDocuments([]); // Reset documents on error
        }
    },
}

export default utils;
