export default interface Document {
    _id: string;
    title: string;
    content: string;
    allowd_users: [string]
};

export default interface User {
    username: string;
    password: string;
    documents: [Document];
};

