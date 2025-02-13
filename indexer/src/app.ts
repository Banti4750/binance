import { JsonRpcProvider } from "ethers";
import axios from "axios";
import mongoose from "mongoose";
import UserModel from "./db";


const provider = new JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/e3fUoPqdyoLlCGWNHdY2lEOaovOsKddu');

mongoose.connect('mongodb+srv://banticode7:XzZg2cQFdmBBnUsq@cluster0.q4am8.mongodb.net/eth_indexer')
  .then(() => console.log('Connected!'))
  .catch(err => console.error('MongoDB connection error:', err));


//get latest block for eth blockchain
async function GetlatestBlock(){
    return await provider.getBlockNumber();
}


interface TransactionReceipt {
    transactionHash: string;
    from: string;
    to: string;
}

interface TransactionReceiptResponse {
    result: TransactionReceipt[];
}

async function getTransactionReceipt(blockNumber: string): Promise<TransactionReceiptResponse> {
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

    const response = await axios.request(config);
    return response.data;
}

async function main() {
    let lastProcessedBlock = await GetlatestBlock(); // Start from the latest block

    while (true) {
        try {
            let latestBlock = await GetlatestBlock();

            if (latestBlock > lastProcessedBlock) {
                console.log(`New block detected: ${latestBlock}`);

                for (let blockNumber = lastProcessedBlock + 1; blockNumber <= latestBlock; blockNumber++) {
                    console.log(`Processing block: ${blockNumber}`);
                    await processBlock(blockNumber);
                }

                lastProcessedBlock = latestBlock;
            } else {
                console.log(`No new blocks. Current block: ${latestBlock}`);
            }
        } catch (error) {
            console.error("Error in main loop:", error);
        }

        // Wait before checking again
        await new Promise((resolve) => setTimeout(resolve, 10000)); // 5 seconds
    }
}


async function processBlock(blockNumber: number) {
    try {
        const transactions = await getTransactionReceipt(blockNumber.toString());

        if (!transactions.result || transactions.result.length === 0) {
            console.log(`No transactions in block ${blockNumber}`);
            return;
        }

        const interestedAddresses = await getInterestedAddress();

        // Filter transactions by interested addresses
        const interestedTransactions = transactions.result.filter(txn =>
            txn.to && interestedAddresses.includes(txn.to.toLowerCase())
        );
        console.log(interestedTransactions)


        if (interestedTransactions.length === 0) {
            console.log(`No matching transactions in block ${blockNumber}`);
            return;
        }
        console.log(interestedTransactions[0].to)

        console.log(`Found ${interestedTransactions.length} relevant transactions.`);

        // Fetch full transaction details and update balances
        for (const txn of interestedTransactions) {
            const fullTxn = await provider.getTransaction(txn.transactionHash);
            console.log(fullTxn)
            if (!fullTxn) continue;

            //@ts-ignore
            console.log(fullTxn.to);
            console.log(fullTxn.value);
            if(!fullTxn.to)return;
            await updateBalance(interestedTransactions[0].to, fullTxn.value.toString());
        }
    } catch (error) {
        console.error(`Error processing block ${blockNumber}:`, error);
    }
}


// Fetch interested addresses
async function getInterestedAddress(): Promise<string[]> {
    try {
        const response = await axios.get('http://localhost:3000/alladdress');
        return response.data.addresses.map((user: { publicKey: string }) => user.publicKey);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return [];
    }
}

// Update balance in DB
async function updateBalance(publicKey: string, balance: string) {
    try {
        console.log("Received balance:", balance);
        console.log("Received publicKey:", publicKey);

        // Validate input
        // if (!publicKey || balance === undefined) {
        //     return res.status(400).json({ message: "Invalid request: missing publicKey or balance" });
        // }

        // Find user by publicKey
        const user = await UserModel.findOne({ publicKey });
        if (!user) {
            //@ts-ignore
            return res.status(404).json({ message: "Invalid publicKey, user not found" });
        }

        // Convert balance to BigInt safely
        let balanceInWei: bigint;
        try {
            balanceInWei = BigInt(balance); // Ensure balance is properly converted
        } catch (err) {
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
        await UserModel.updateOne(
            { publicKey },
            { $set: { balance: totalBalance } }
        );

        // Send updated balance to the client
        //@ts-ignore
        return res.status(200).json({
            message: "Balance updated successfully",
            totalBalance
        });
    } catch (error) {
        console.error(`Error updating balance for ${publicKey}:`, error);
        //@ts-ignore
        return res.status(500).json({ message: "Internal server error" });
    }
}

main();


async function sweeper() {
    try {
        const allAddresses = await getInterestedAddress();
        console.log("All Addresses:", allAddresses);

        // Fetch all user balances in parallel
        const users = await Promise.all(
            allAddresses.map(address => UserModel.findOne({ publicKey: address }))
        );

        // Calculate total balance safely
        let totalBalance = 0;
        for (const user of users) {
            if (user && user.balance) {
                totalBalance += Number(user.balance);
            }
        }

        // console.log("Total Balance:", totalBalance);
        return totalBalance;
    } catch (error) {
        console.error("Error in sweeper function:", error);
    }
}

// const b =await sweeper();
// console.log(b)
