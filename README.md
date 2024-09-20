# SSR Editor
---
Project for DV1677 JSRamverk

## Specification

Satt port på 3006 på  const port = process.env.PORT || 3000; // Default to 3006 if PORT is undefined i app.mjs, för att kunna öppna appen. Annars får man felmeddelade "app listening on port undefined"

Nytt försök att öppan appen leder till felmeddelande:

    [Error: SQLITE_ERROR: no such table: documents] {
      errno: 1,
      code: 'SQLITE_ERROR'
    }
    ::1 - - [04/Sep/2024:12:41:35 +0000] "GET / HTTP/1.1" 200 461 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0"

FIxas med:
    `cat db/migrate.sql | sqlite3 db/docs.sqlite`
i terminalen. Detta är en reset på databasen.
cat db/migrate.sql läser innehållet i filen db/migrate.sql.
| (pipe) skickar innehållet från cat till sqlite3.
sqlite3 db/docs.sqlite kör SQLite3-verktyget och tillämpar SQL-kommandona från migrate.sql på databasen db/docs.sqlite.

Nu kommer inga felmeddelanden när appen startas.

För att sedan få appen att fungera tillämpar vi:

I index.ejs:

bifogar länk som skaffar nya dokument

    `<h3><a href="/doc">Create a new dockument</a></h3>`

och anpassa länken av befintliga dokumant:

    <h3><a href="/doc/<%= doc.id %>"><%= doc.title %></a></h3>

I doc.ejs:

skaffas en if-sats som ska bero på länken

    ```<h2>Dokument</h2>
    <form method="POST" action="/doc?_method=PUT" class="doc-form">
        <!-- <input type="hidden" name="_method" value="PUT"> -->
        <input type="hidden" name="id" value="<%= doc.id %>">
        <label for="title">Doc Titel</label>
        <input type="text" name="title" value="<%= doc.title %>" />
    
        <label for="content">Innehåll</label>
        <textarea name="content"><%= doc.content %></textarea>
    
        <input type="submit" value="Uppdatera" />
    </form>   
    <% } else { %>
        <h2>Dokument</h2>
            <form method="POST" action="/doc" class="doc-form">
            <label for="title">Doc Titel</label>
            <input type="text" name="title" value="" />

            <label for="content">Innehåll</label>
            <textarea name="content"></textarea>

            <input type="submit" value="Spara" />
        </form>
    <%}%>
    ```
I app.mjs använder vi methodOverride som tillåter använda PUT method i HTML-form
`
import methodOverride from 'method-override';

app.use(methodOverride('_method'));
`
Även '/doc' och '/doc:id' routes i app.mjs fixas:

    ```
    app.get('/doc', async (req, res) => {
        return res.render("doc", {doc: null});
    });
    app.get('/doc/:id', async (req, res) => {
        return res.render(
            "doc",
            { doc: await documents.getOne(req.params.id) }
        );
    });```

put och post routes bifogas i app.mjs:

   ``` app.post('/doc', async (req, res) => {

        // Get info from form
        const body = req.body;

        // Add or update the document
        const result = await documents.addOne(body);

        res.redirect('/');
    });

    app.put('/doc', async (req, res) => {
        const body = req.body;
        try {
            await documents.updateOne(body);
            return res.redirect('/'); // Redirect after update
        } catch (e) {
            console.error(e);
            res.status(500).send('Error updating document');
        }
    });
```
I docs.mjs skapar vi ny method:

```
updateOne: async function updateOne(body) {
    let db = await openDb();

    try {
        return await db.run(
            `UPDATE documents 
                SET title = ?,content = ?, created_at = datetime('now', 'localtime') 
                WHERE rowid = ?`,
            body.title,
            body.content,
            body.id
        );
    } catch (e) {
        console.error(e);
    } finally {
        await db.close();
    }
```

Vi ändrar table i db/migrate.sql till:

```
    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        created_at DATE DEFAULT (datetime('now','localtime'))
    );
```

och skapar databas igen

Vi väljer att kika närmre på React då det ses som mest populärt och "enklast" samt att det känns som flest är bekant med detta ramverk

Nu har vi en fungerande app. Återstående är finslipning av själva sidan. Här snackar vi om styling och lite småsaker.

Vi lägger till i index.ejs att om där inte är någon title på dokumentent visas då "Document: No Title".

                ```
                <a href="/doc/<%= doc.id %>">
                    Document: <%= doc.title ? doc.title : 'No Title' %>
                </a>
                ```

Vi har stylat sidan enkelt nu i början och tänker jobba vidare med det. Då det inte var något krav slängde vi in allt i style.css men har ambitionerna på att dela upp det mycket mer snyggt och lättläst, samt ge en mer proffesionell bild av arbetet. Det leder även till att det blir enklare att hitta för någon som aldrig sett koden innan. Vi kommer tillämpa saker vi lärt oss från design kursen.

Sedan la vi även till doc.ejs att titeln blir till "Document: (och sedan titelns namn.)"

    ```<h2>Document: <%= doc.title ? doc.title : 'No Title' %></h2>```

är där ingen title så blir det No Title.

Det vi kan tänka på till nästa moment är att exemplevis med två liknande namn titlar så sätts automatiskt en 1a efter. Exempelvis ett doc heter Hej, och om jag sedan döper ett till doc till Hej så bör det automatiskt bli Hej1 och så vidare.

## Refactorering

### Express JSON
För att slippa omstarta app vid varje förandring installerar jag nodemon
`npm install -g nodemon`

Bifogar `"start": "nodemon app.mjs"` till scripts i the pakage.json

Bifogar `"production": "NODE_ENV='production' node app.js"` till scripts in the pakage.json att kunna starta i productions lage.

I app.mjs bifogar route `/json` som ska visa jsons innehåll och andra routes ifrån Emils Express-artikeln.

Flytta routes från forsta momentet till routes/sql.mjs och JSON-relaterade routes i routes/json.mjs


### MongoDB

Bifogar `"type": "module"` till package.json att tillåta importera ES moduler och använda MongoDB.

Kör `npm install mongodb@6.8` in command line för att skaffa moduller nödvändiga för MongoDB.

Bofogar to database.mjs enligt code from MongoDB 

`const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://texteditor1:dbwebb@cluster0.wf5vm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";rue&w=majority&appName=Cluster0";w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful anslutning
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);`

Kör:
`npm install --save dotenv`

Får varning om packages vulnerabilety, fixa den med `npm audit fix`

Nu fiungerar database anslutning.

Skapar filen .env i rootcatalog:
`touch .env`
sparar i env min anvandarenamn och lösenord

Fixar local MongoDB anslutning: med `localMongo()` in db/mongoDB.mjs;
Standard db name är 'docs'.

fixar JSON-routes i `routes/mogo.mjs` som använder MongoDb.
Routes visar alla document, skaffar document, söker document efter _id, title, uppdaterar document med title, skafar nya document med title "unnamed"

Moved functionality to `mongoDocs.mjs`.

Det ser ut som jag fick rätt anslutning till remote database, skapade en likanande db som på lokal nivå.

Just nu finns det många routes: från första inlämningen, för lokal mongo och för remote mongo.

Functionalitet för remote mongoDB ligger i `remoteDocs.mjs`. Allt fungerar.
Jag raderar sql database och routes som tillhör till den.

### Överföring till React

Jag borjar med att instalera react modules in the project med
` npm install react react-dom`

och vite-moduler: 
 `npm install --save-dev vite`

Jag installerar också botstrap:
`npm install bootstrap@5.2.3`

Jag copierar sturt-up React-code i texteditor-react med
`npm create vite@4.1.0` det går också bara med `npm create vite`.

Jag använder filer i texteditor-react som mål för reactor-componenter i vart projekt. 

Jag kopierar `index.html` i projektets root, och skapar i `src` filer: `main.tsx` och `App.tsx`.

Kommand för att köra reakt-app är `npm run dev`. Refrech cole med `r`.
Det gär fortfarande köra express-app med `npm start` och `rs` för att refrecha.

Nu arbetar jag med componenter.
Jag skapar componenter för footer och headers i `components/includes`.

Jag skapar där även `ErrorBoundary.tsx` som hjälper med felsökning i React-componenter och samtidigt visar meddelande om fel i browser.

Just nu finns det funktionalitet som tillåter visa alla dokument. Ser kode i `components/AppMain.tsx`.

Det finns funktionalitet som skapa nya tomma dokument i  i `components/ArtickleHead.tsx`.

Jag planerar vidare arbeta med mojlighet att visa och redigera enskilda dokument samt att ta bort dokument....

Jag har inte skapad Azure än ... 