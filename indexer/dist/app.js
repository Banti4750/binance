"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = __importDefault(require("./db"));
const provider = new ethers_1.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/e3fUoPqdyoLlCGWNHdY2lEOaovOsKddu');
mongoose_1.default.connect('mongodb+srv://banticode7:XzZg2cQFdmBBnUsq@cluster0.q4am8.mongodb.net/eth_indexer')
    .then(() => console.log('Connected!'))
    .catch(err => console.error('MongoDB connection error:', err));
//get latest block for eth blockchain
function GetlatestBlock() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield provider.getBlockNumber();
    });
}
function getTransactionReceipt(blockNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = JSON.stringify({
            "id": 1,
            "jsonrpc": "2.0",
            "method": "eth_getBlockReceipts",
            "params": [
                `0x${parseInt(blockNumber).toString(16)}` // Convert to hex format
            ]
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://eth-sepolia.g.alchemy.com/v2/e3fUoPqdyoLlCGWNHdY2lEOaovOsKddu',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
            },
            data: data
        };
        const response = yield axios_1.default.request(config);
        return response.data;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let lastProcessedBlock = yield GetlatestBlock(); // Start from the latest block
        while (true) {
            try {
                let latestBlock = yield GetlatestBlock();
                if (latestBlock > lastProcessedBlock) {
                    console.log(`New block detected: ${latestBlock}`);
                    for (let blockNumber = lastProcessedBlock + 1; blockNumber <= latestBlock; blockNumber++) {
                        console.log(`Processing block: ${blockNumber}`);
                        yield processBlock(blockNumber);
                    }
                    lastProcessedBlock = latestBlock;
                }
                else {
                    console.log(`No new blocks. Current block: ${latestBlock}`);
                }
            }
            catch (error) {
                console.error("Error in main loop:", error);
            }
            // Wait before checking again
            yield new Promise((resolve) => setTimeout(resolve, 10000)); // 5 seconds
        }
    });
}
function processBlock(blockNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transactions = yield getTransactionReceipt(blockNumber.toString());
            if (!transactions.result || transactions.result.length === 0) {
                console.log(`No transactions in block ${blockNumber}`);
                return;
            }
            const interestedAddresses = yield getInterestedAddress();
            // Filter transactions by interested addresses
            const interestedTransactions = transactions.result.filter(txn => txn.to && interestedAddresses.includes(txn.to.toLowerCase()));
            console.log(interestedTransactions);
            if (interestedTransactions.length === 0) {
                console.log(`No matching transactions in block ${blockNumber}`);
                return;
            }
            console.log(interestedTransactions[0].to);
            console.log(`Found ${interestedTransactions.length} relevant transactions.`);
            // Fetch full transaction details and update balances
            for (const txn of interestedTransactions) {
                const fullTxn = yield provider.getTransaction(txn.transactionHash);
                console.log(fullTxn);
                if (!fullTxn)
                    continue;
                //@ts-ignore
                console.log(fullTxn.to);
                console.log(fullTxn.value);
                if (!fullTxn.to)
                    return;
                yield updateBalance(interestedTransactions[0].to, fullTxn.value.toString());
            }
        }
        catch (error) {
            console.error(`Error processing block ${blockNumber}:`, error);
        }
    });
}
// Fetch interested addresses
function getInterestedAddress() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('http://localhost:3000/alladdress');
            return response.data.addresses.map((user) => user.publicKey);
        }
        catch (error) {
            console.error("Error fetching addresses:", error);
            return [];
        }
    });
}
// Update balance in DB
function updateBalance(publicKey, balance) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Received balance:", balance);
            console.log("Received publicKey:", publicKey);
            // Validate input
            // if (!publicKey || balance === undefined) {
            //     return res.status(400).json({ message: "Invalid request: missing publicKey or balance" });
            // }
            // Find user by publicKey
            const user = yield db_1.default.findOne({ publicKey });
            if (!user) {
                //@ts-ignore
                return res.status(404).json({ message: "Invalid publicKey, user not found" });
            }
            // Convert balance to BigInt safely
            let balanceInWei;
            try {
                balanceInWei = BigInt(balance); // Ensure balance is properly converted
            }
            catch (err) {
                //@ts-ignore
                return res.status(400).json({ message: "Invalid balance format, must be a valid number string" });
            }
            // Convert balance from Wei to ETH safely
            const ethValue = Number(balanceInWei) / 1e18;
            console.log("Converted balance to ETH:", ethValue);
            // Ensure user balance is a valid number
            const userBalance = user.balance ? Number(user.balance) : 0;
            if (isNaN(userBalance)) {
                //@ts-ignore
                return res.status(500).json({ message: "User balance is corrupted" });
            }
            // Calculate new total balance
            const totalBalance = userBalance + ethValue;
            console.log("Updated total balance:", totalBalance);
            // Update the user's balance in the database
            yield db_1.default.updateOne({ publicKey }, { $set: { balance: totalBalance } });
            // Send updated balance to the client
            //@ts-ignore
            return res.status(200).json({
                message: "Balance updated successfully",
                totalBalance
            });
        }
        catch (error) {
            console.error(`Error updating balance for ${publicKey}:`, error);
            //@ts-ignore
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
main();
function sweeper() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allAddresses = yield getInterestedAddress();
            console.log("All Addresses:", allAddresses);
            // Fetch all user balances in parallel
            const users = yield Promise.all(allAddresses.map(address => db_1.default.findOne({ publicKey: address })));
            // Calculate total balance safely
            let totalBalance = 0;
            for (const user of users) {
                if (user && user.balance) {
                    totalBalance += Number(user.balance);
                }
            }
            // console.log("Total Balance:", totalBalance);
            return totalBalance;
        }
        catch (error) {
            console.error("Error in sweeper function:", error);
        }
    });
}
// const b =await sweeper();
// console.log(b)
