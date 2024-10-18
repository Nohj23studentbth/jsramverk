import openDb from '../db/database.mjs';
process.env.COLLECTION_NAME = "users";
const users = {
    getAll: async function getAll() {
        let db = await openDb();

        try {
            return await db.all('SELECT rowid as id, * FROM documents');
        } catch (e) {
            console.error(e);

            return [];
        } finally {
            await db.close();
        }
    },

    getOne: async function getOne(id) {
        let db = await openDb();

        try {
            return await db.get('SELECT * FROM documents WHERE rowid=?', id);
        } catch (e) {
            console.error(e);

            return {};
        } finally {
            await db.close();
        }
    },

    addOne: async function addOne(body) {
        let db = await openDb();

        try {
            return await db.run(
                'INSERT INTO documents (title, content) VALUES (?, ?)',
                body.title,
                body.content,
            );
        } catch (e) {
            console.error(e);
        } finally {
            await db.close();
        }
    }
};

export default users;
