import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mockDataPath = join(__dirname, '../mock-data/data.json');
export const mockData = JSON.parse(readFileSync(mockDataPath, 'utf-8'));
