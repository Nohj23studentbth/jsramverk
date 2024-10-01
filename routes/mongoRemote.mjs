import express from 'express';
import documents from '../remoteDocs.mjs';


const router = express.Router();

//parse JSON bodies
router.use(express.json());

const dbName = 'docs';

const colName = 'document';


// get all dcuments as JSON
router.get("/", async(req, res) => {
    try {
        console.log("start getting documents");
        const collection = await documents.getAll();
        console.log("finish getting documents");
        res.json({ documents: collection });
    } catch (error) {
        res.json({ error: error });
    };
});

// add an new unnamed document
router.post('/', async (req, res) => {
    try {
        const result = await documents.addNew();
        res.json({ result });
    } catch (error) {
        console.log('error in adding empty document: ', error);
        res.json({ error: error });
    }
});

// update a document
router.put('/update', async (req, res) => {
    const { id, title, content } = req.body;
    try {
        const result = await documents.updateOne(id, title, content);
        console.log ("Result from put route updating docuement :", result)
        res.json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating document bu put route', error });
    }
});

// remove a document
router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    console.log("By mongoRemote dokumentID = ", id, "/n with type = ", typeof(id))
    try {
        const result = await documents.removeById(id);
        console.log ("Result from delete route updating docuement :", result)
        res.json({ result });
    } catch (error) {
        console.log('error in removing document by DELETE: ', error);
        res.json({ error: error });
    }
});

export default router;