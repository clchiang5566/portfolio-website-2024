import { cmsInstance } from '../../../utils/httpinstance';

export default (req, res) => {
    return new Promise(resolve => {
        const { method } = req;
        switch (method) {
            case 'GET':
                return getGlobal(req, res);
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

const getGlobal = (req, res) => {
    return new Promise(resolve => {
        const { lang } = req.query;
        cmsInstance
            .get(`/api/webSettings?language=${lang}`, {})
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(response.data));
            })
            .catch(error => {
                res.status(403).end(`Error: ${error}`);
                resolve();
            });
    });
};
