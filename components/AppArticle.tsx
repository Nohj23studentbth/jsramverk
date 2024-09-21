{docs.length === 0 ? <p>No items found!</p>}
                        <% docs.forEach(function(doc) { %>
                            <h3>
                                <a href="/sql/doc/<%= doc.id %>">
                                    Document: <%= doc.title ? doc.title : 'No Title' %>
                                </a>
                            </h3>
                        <% }); %>
                    <% } %>      
                    <pre id="json-container"></pre>
                    <script src="app.js"></script>
