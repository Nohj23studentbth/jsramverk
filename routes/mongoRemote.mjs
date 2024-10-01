import express from 'express';
import documents from '../remoteDocs.mjs';


const router = express.Router();

//parse JSON bodies
router.use(express.json());

// get all dcuments as JSON
router.get("/", async(req, res) => {
    try {
        const collection = await documents.getAll();
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
        res.json({ error: error });
    }
});

// update a document
router.put('/update', async (req, res) => {
    const { id, title, content } = req.body;
    try {
        const result = await documents.updateOne(id, title, content);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: 'Error updating document bu put route', error });
    }
});

// remove a document
router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await documents.removeById(id);
        res.json({ result });
    } catch (error) {
        res.json({ error: error });
    }
});

export default router;