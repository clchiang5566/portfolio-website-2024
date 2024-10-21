import data from './data.json';

export default (req, res) => {
    return new Promise(resolve => {
        const { method } = req;
        switch (method) {
            case 'GET':
                return getPage(req, res);
            case 'POST':
                break;
            case 'PUT':
                break;
            case 'DELETE':
                break;
            default:
                res.setHeader('Allow', ['GET']);
                res.status(405).end(`Method ${method} Not Allowed`);
                resolve();
        }
    });
};

const getPage = (req, res) => {
    return new Promise(resolve => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        resolve();
    });
};
