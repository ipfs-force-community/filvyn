import { PDPServer, PDPAuthHelper } from '@filoz/synapse-sdk/pdp'
import { Synapse, TOKENS, CONTRACT_ADDRESSES, RPC_URLS } from '@filoz/synapse-sdk'
import axios from 'axios';

const synapse = await Synapse.create({
    privateKey: '0xf2a322edeccbb23f2d46ebcc2f502b0017b5df9eaf7c2ba4469655ee01f1d226',
    rpcURL: RPC_URLS.calibration.websocket  // Use calibration testnet for testing
})

// const initiateResponse = await axios({
//     method: 'post',
//     url: `https://caliberation-pdp.infrafolio.com/pdp/piece`,
//     headers: {
//         'Authorization': `Bearer ce7ccac700d14ff7b45d526939a76b04`,
//         'Content-Type': 'application/json'
//     },
//     data: {
//         check: {
//             name: 'sha2-256',
//             hash: hash,
//             size: size
//         }
//     }
// });


const signer = synapse.getSigner()
const pandoraAddress = synapse.getPandoraAddress()
const chainId = synapse.getChainId()

// Create server instance with auth helper
const authHelper = new PDPAuthHelper(pandoraAddress, signer, chainId)
const pdpServer = new PDPServer(authHelper, 'https://caliberation-pdp.infrafolio.com', 'https://caliberation-pdp.infrafolio.com')

// Upload a piece
const data = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) // Example data
const { commP, size } = await pdpServer.uploadPiece(data)

// Download a piece
const data_rec = await pdpServer.downloadPiece(commP)
console.log("hello:", data_rec)
