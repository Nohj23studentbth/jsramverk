const localBackend = "http://localhost:3000";
const remoteBackend = "https://jaramverk-olga22-noahh-djczc2fnbcgheeb2.swedencentral-01.azurewebsites.net/";

// Bestäm vilken backend som ska användas baserat på om vi kör lokalt eller i produktion
//const backendUrl = window.location.hostname === 'localhost' ? localBackend : remoteBackend;
const backendUrl = window.location.hostname === 'localhost' ? localBackend : remoteBackend;

const utils = {

    /**
     * Fetch route functionality to the React component
     * @async
     * 
     * @param {string} [passedMethod] - HTTP method ('GET', 'POST', etc.)
     * @param {string} [route]
     * @param {object|null} [body=null] - Request body (used only for POST/PUT requests)
     * @param {object} { [key: string]: string } = {} - Request headers
     * 
     * @param {string} route : express-route route
     * @returns {Promise<array>}: returns one ore more dokuments as array
     */
    processRoute : async function processRoute(passedMethod = 'GET', route = "/", body = null, headers = {}) {
        const url = backendUrl + route;

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
                const errorData = await response.json();
             
                return {
                    ok: response.ok,
                    status: response.status,
                    message: errorData.message,
                };
            }
            const result = await response.json();
            
            return {
                ok: response.ok,
                status: response.status,
                result: result
            };
        } catch (error) {
            console.log('Failed to fetch documents in processRoute.processRoute:', error);
            return error;
        }
    },

    /**
     * Fetch route functionality for making HTTP requests in a React component.
     * @async
     * 
     * @param {string} [body=''] - Request body (used only for POST/PUT requests).
     * @param {string || null} auth uses for authorisation
     * 
     * @returns {Promise<processRoute1result>} - Returns a promise resolving to an object with the response status, data, or error message.
     */
    graphQL: async function graphQL(
        body, auth
    )
     {
        const url = backendUrl + '/graphql';
    
        const mergeHeaders = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth}`, // Send token
                };
    
        const options = {
            method: 'POST',
            headers: mergeHeaders,
            body: body, //body is already json
        };
    
        try {
            const response = await fetch(url, options);
    
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    ok: response.ok,
                    status: response.status,
                    message: errorData.message
                };
            }
    
            const result = await response.json();
            return {
                ok: response.ok,
                status: response.status,
                result: result
            };
        } catch (error) {
            console.log('Failed to fetch documents in processRoute.processRoute:', error);
            return error;
        }
    },
}

export default utils;
