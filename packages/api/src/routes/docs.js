import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Load OpenAPI spec
const openapiDocument = YAML.load(join(__dirname, '../../openapi.yaml'));

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(openapiDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'FleetSync API Documentation'
}));

export default router;
