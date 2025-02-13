import express from 'express';
import mongoose from 'mongoose';
import { Wallet as EthWallet, JsonRpcProvider, parseEther } from "ethers";
import cors from 'cors';
import { mnemonic, PRIVATEKEY } from './config';
import * as bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet';
import Wallet from 'ethereumjs-wallet';
import UserModel from './db';
import jwt from 'jsonwebtoken'
import axios from 'axios';
import { middleware } from './middleware';

const app = express();
const JWT_SECRET = "hijiii";
app.use(express.json());
app.use(cors());


const provider = new JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/e3fUoPqdyoLlCGWNHdY2lEOaovOsKddu');
mongoose.connect('mongodb+srv://banticode7:XzZg2cQFdmBBnUsq@cluster0.q4am8.mongodb.net/eth_indexer')
  .then(() => console.log('Connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

const seed: Buffer = bip39.mnemonicToSeedSync(mnemonic);
const hdwallet = hdkey.fromMasterSeed(seed);



app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const IsUserExit = await UserModel.findOne({email:email});
        if(IsUserExit){
            res.send({
                message:"user already exit"
            })
            return;
        }
        const user = await UserModel.create({ email, password });

        const path: string = `m/44'/60'/0'/${user.userId}/0`;
        const wallet: Wallet = hdwallet.derivePath(path).getWallet();
        const publicKey: string = wallet.getPublicKey().toString('hex');
        const address: string = `0x${wallet.getAddress().toString('hex')}`;
        const privateKey: string = wallet.getPrivateKeyString();

        // Corrected update query using findByIdAndUpdate
        await UserModel.findByIdAndUpdate(user._id, {
            publicKey:address,
            privateKey
        });

        res.status(200).send({
            message: "Signup success",
            DepositeAddress:address
        });

    } catch (e) {
        console.error("Signup error:", e);
        res.status(500).send({
            message: "Error creating user",

        });
    }
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await UserModel.findOne({ email: email });

        if (!user) {
             res.status(404).json({
                message: "User not found. Please signup first"
            });
            return;
        }

        // Assuming you're storing hashed passwords and using bcrypt
        // const isPasswordValid = await bcrypt.compare(password, user.password);

        if (password !== user.password) {
             res.status(401).json({
                message: "Invalid password"
            });
            return;
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

//@ts-ignore
app.get('/getuserbalance', middleware, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId;

        const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(userId) });

        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }

        return res.status(200).json({
            balance: user.balance,
        });

    } catch (error) {
        console.error("Error fetching user balance:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

//@ts-ignore
app.get('/getdepositeaddress' , middleware ,async (req , res)=>{

    try{
        //@ts-ignore
        const userId = req.userId;

        const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(userId) });

        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }

        return res.status(200).json({
            publicKey: user.publicKey
        });

    }catch (error) {
        console.error("Error fetching user balance:", error);
        return res.status(500).json({
            message: "Internal server error",

        });
    }
})


app.get('/alladdress', async (req, res) => {
    try {
        const users = await UserModel.find({}, { publicKey: 1, _id: 0 }); // Fetch only publicKey field
        res.status(200).send({ addresses: users });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).send({ message: "Error fetching addresses" });
    }
});

//@ts-ignore
app.post("/withdraw", middleware, async (req, res) => {
    const { address, amount } = req.body;
    //@ts-ignore
    const userId = req.userId; // Retrieved from middleware

    try {
        const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        //@ts-ignore
        if (amount > user.balance) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Load private key securely
        const PRIVATE_KEY = PRIVATEKEY

        if (!PRIVATE_KEY) {
            return res.status(500).json({ message: "Server error: Missing private key" });
        }

        // Create wallet using ethereumjs-wallet
        const wallet = Wallet.fromPrivateKey(Buffer.from(PRIVATE_KEY.replace("0x", ""), "hex"));

        // Use ethers.js for signing transactions
        const signer = new EthWallet(PRIVATE_KEY, provider);

        // Get correct nonce
        let nonce;
        try {
            nonce = await provider.getTransactionCount(signer.address, "pending");
        } catch (error) {
            console.error("Error fetching nonce:", error);
            return res.status(500).json({ message: "Failed to fetch nonce" });
        }

        // Send transaction
        const txn = await signer.sendTransaction({
            to: address, // Send to provided address
            value: parseEther(amount.toString()), // Convert amount to Wei
            nonce: nonce
        });

        // Deduct balance from user
        await UserModel.updateOne({ _id: userId }, { $inc: { balance: -amount } });

        res.json({
            message: "Transaction successful",
            txnHash: txn.hash
        });

    } catch (error) {
        console.error("Withdrawal error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.listen(3000 , ()=>{
    console.log("Server listening at port 3000");
})