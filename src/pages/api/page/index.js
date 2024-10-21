import { cmsInstance } from '../../../utils/httpinstance';

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
        const { path, lang, preview, pageId, token } = req.query;
        cmsInstance
            .get(`/api/getpage?path=/${path}&language=${lang}&preview=${preview}&pageId=${pageId}&token=${token}`, {})
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
