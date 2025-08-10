import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

// ES Module replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correctly point to the sample_payloads directory inside the backend folder
const payloadsDir = path.join(__dirname, '..', 'sample_payloads');
const API_URL = 'http://localhost:5001/api/webhook';

async function processFiles() {
  try {
    const files = fs.readdirSync(payloadsDir).filter(file => file.endsWith('.json'));

    console.log(`Found ${files.length} payloads to process...`);

    for (const file of files) {
      try {
        const filePath = path.join(payloadsDir, file);
        const payloadData = fs.readFileSync(filePath, 'utf-8');
        
        // The sample payloads are nested, we need to extract the actual value
        const rawPayload = JSON.parse(payloadData);
        
        await axios.post(API_URL, rawPayload); // Send the full raw payload
        console.log(`  -> Successfully processed ${file}`);
      } catch (error) {
        // Axios errors often have more detail in error.response.data
        const errorMsg = error.response ? error.response.data : error.message;
        console.error(`  -> Error processing ${file}:`, errorMsg);
      }
    }
    console.log('Finished processing all payloads.');
  } catch (error) {
    console.error('Could not read payloads directory:', error.message);
  }
}

processFiles();