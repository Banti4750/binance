"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const ethers_1 = require("ethers");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const bip39 = __importStar(require("bip39"));
const ethereumjs_wallet_1 = require("ethereumjs-wallet");
const ethereumjs_wallet_2 = __importDefault(require("ethereumjs-wallet"));
const db_1 = __importDefault(require("./db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
const JWT_SECRET = "hijiii";
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const provider = new ethers_1.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/e3fUoPqdyoLlCGWNHdY2lEOaovOsKddu');
mongoose_1.default.connect('mongodb+srv://banticode7:XzZg2cQFdmBBnUsq@cluster0.q4am8.mongodb.net/eth_indexer')
    .then(() => console.log('Connected!'))
    .catch(err => console.error('MongoDB connection error:', err));
const seed = bip39.mnemonicToSeedSync(config_1.mnemonic);
const hdwallet = ethereumjs_wallet_1.hdkey.fromMasterSeed(seed);
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const IsUserExit = yield db_1.default.findOne({ email: email });
        if (IsUserExit) {
            res.send({
                message: "user already exit"
            });
            return;
        }
        const user = yield db_1.default.create({ email, password });
        const path = `m/44'/60'/0'/${user.userId}/0`;
        const wallet = hdwallet.derivePath(path).getWallet();
        const publicKey = wallet.getPublicKey().toString('hex');
        const address = `0x${wallet.getAddress().toString('hex')}`;
        const privateKey = wallet.getPrivateKeyString();
        // Corrected update query using findByIdAndUpdate
        yield db_1.default.findByIdAndUpdate(user._id, {
            publicKey: address,
            privateKey
        });
        res.status(200).send({
            message: "Signup success",
            DepositeAddress: address
        });
    }
    catch (e) {
        console.error("Signup error:", e);
        res.status(500).send({
            message: "Error creating user",
        });
    }
}));
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = yield db_1.default.findOne({ email: email });
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
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
            message: "Login successful",
            token: token
        });
    }
    catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}));
//@ts-ignore
app.get('/getuserbalance', middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.userId;
        const user = yield db_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(userId) });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }
        return res.status(200).json({
            balance: user.balance,
        });
    }
    catch (error) {
        console.error("Error fetching user balance:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}));
//@ts-ignore
app.get('/getdepositeaddress', middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.userId;
        const user = yield db_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(userId) });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }
        return res.status(200).json({
            publicKey: user.publicKey
        });
    }
    catch (error) {
        console.error("Error fetching user balance:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}));
app.get('/alladdress', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.default.find({}, { publicKey: 1, _id: 0 }); // Fetch only publicKey field
        res.status(200).send({ addresses: users });
    }
    catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).send({ message: "Error fetching addresses" });
    }
}));
//@ts-ignore
app.post("/withdraw", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, amount } = req.body;
    //@ts-ignore
    const userId = req.userId; // Retrieved from middleware
    try {
        const user = yield db_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        //@ts-ignore
        if (amount > user.balance) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        // Load private key securely
        const PRIVATE_KEY = config_1.PRIVATEKEY;
        if (!PRIVATE_KEY) {
            return res.status(500).json({ message: "Server error: Missing private key" });
        }
        // Create wallet using ethereumjs-wallet
        const wallet = ethereumjs_wallet_2.default.fromPrivateKey(Buffer.from(PRIVATE_KEY.replace("0x", ""), "hex"));
        // Use ethers.js for signing transactions
        const signer = new ethers_1.Wallet(PRIVATE_KEY, provider);
        // Get correct nonce
        let nonce;
        try {
            nonce = yield provider.getTransactionCount(signer.address, "pending");
        }
        catch (error) {
            console.error("Error fetching nonce:", error);
            return res.status(500).json({ message: "Failed to fetch nonce" });
        }
        // Send transaction
        const txn = yield signer.sendTransaction({
            to: address, // Send to provided address
            value: (0, ethers_1.parseEther)(amount.toString()), // Convert amount to Wei
            nonce: nonce
        });
        // Deduct balance from user
        yield db_1.default.updateOne({ _id: userId }, { $inc: { balance: -amount } });
        res.json({
            message: "Transaction successful",
            txnHash: txn.hash
        });
    }
    catch (error) {
        console.error("Withdrawal error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.listen(3000, () => {
    console.log("Server listening at port 3000");
});
