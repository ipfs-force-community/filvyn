import { PdpService } from '../services/pdp.js';
import dotenv from 'dotenv';
import { calculate } from '@filoz/synapse-sdk/commp'
import { toHex } from 'multiformats/bytes'

const data = `Hello, this is a test data for PDP service!`;
const buffer = Buffer.from(data, 'utf-8');
const size = buffer.length;
// const hash = crypto.createHash('sha256').update(buffer).digest('hex');

// Load environment variables
dotenv.config();

/**
 * Example using PDP Service for storing and retrieving data
 */
async function pdpServiceDemo() {

    // Get PDP service instance
    const pdpService = PdpService.getInstance();

    // Customize retry settings if needed
    pdpService.setRetrievalDelay(3000);  // 3 seconds delay
    pdpService.setMaxRetries(5);         // 5 retry attempts

    try {
        // Example data to store
        const noteData = JSON.stringify({
            title: "Testing PDP Service",
            content: "This is a test note stored via PDP service",
            tags: ["test", "pdp", "example"],
            createdAt: new Date().toISOString()
        });

        console.log("Storing data in PDP...");

        // Store data and get CID
        const cid = await pdpService.put(noteData);
        if (!cid) {
            console.error("Failed to store data");
            return;
        }

        console.log(`Data stored successfully with CID: ${cid}`);

        // Wait a moment before retrieving
        console.log("Waiting before retrieval...");
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Retrieve the data using the CID
        console.log(`Retrieving data with CID: ${cid}`);
        const retrievedData = await pdpService.get(cid);

        if (retrievedData) {
            console.log("Data retrieved successfully:");
            console.log(JSON.parse(retrievedData));
        } else {
            console.error("Failed to retrieve data");
        }
    } catch (error) {
        console.error("Error during PDP operations:", error);
    }
}

// Run the demo
pdpServiceDemo().catch(error => {
    console.error("Unhandled error:", error);
});
