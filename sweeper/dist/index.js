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
const mongoose_1 = __importDefault(require("mongoose"));
const ethers_1 = require("ethers");
const db_1 = __importDefault(require("./db"));
const provider = new ethers_1.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/e3fUoPqdyoLlCGWNHdY2lEOaovOsKddu");
mongoose_1.default
    .connect("mongodb+srv://banticode7:XzZg2cQFdmBBnUsq@cluster0.q4am8.mongodb.net/eth_indexer")
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("MongoDB connection error:", err));
const HOT_WALLET_ADDRESS = "0x2D1EC1d234d0eb3C84877fef149a58E5391F5e51";
const MIN_ETH_SWEEP_THRESHOLD = 0.0001;
function binanceSweeper() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (;;) {
                // Get all users with sufficient balance
                const users = yield db_1.default.find({ balance: { $gt: MIN_ETH_SWEEP_THRESHOLD } })
                    .select("privateKey balance");
                if (!users.length) {
                    console.log("No users with sufficient balance, retrying...");
                    yield new Promise(resolve => setTimeout(resolve, 5000));
                    continue;
                }
                const gasPriceData = yield provider.getFeeData();
                if (!gasPriceData.maxFeePerGas || !gasPriceData.gasPrice) {
                    console.log("Failed to fetch gas price data.");
                    yield new Promise(resolve => setTimeout(resolve, 5000));
                    continue;
                }
                // Estimated gas limit for a simple ETH transfer (usually ~21,000)
                const estimatedGasLimit = 21000;
                const estimatedGasFee = (0, ethers_1.parseUnits)(gasPriceData.gasPrice.toString(), "wei") * BigInt(estimatedGasLimit);
                // Process all users concurrently
                const sweepPromises = users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        //@ts-ignore
                        const signer = new ethers_1.Wallet(user.privateKey, provider);
                        const balanceInWei = yield provider.getBalance(signer.address);
                        console.log(`🛠️ Address: ${signer.address}, Balance: ${balanceInWei.toString()} wei`);
                        // Ensure there is enough balance for gas fees
                        if (balanceInWei <= estimatedGasFee) {
                            console.log(`⚠️ Not enough balance for gas fees: ${signer.address}`);
                            return;
                        }
                        // Subtract gas fee from balance
                        const sendAmount = balanceInWei - estimatedGasFee;
                        if (sendAmount <= 0) {
                            console.log(`⚠️ Balance too low after gas: ${signer.address}`);
                            return;
                        }
                        // Get correct nonce
                        const nonce = yield provider.getTransactionCount(signer.address, "pending");
                        const txn = yield signer.sendTransaction({
                            to: HOT_WALLET_ADDRESS,
                            value: sendAmount,
                            gasLimit: estimatedGasLimit,
                            gasPrice: gasPriceData.gasPrice,
                            nonce: nonce
                        });
                        if (txn) {
                            console.log(`✅ Swept ${sendAmount.toString()} wei from ${signer.address} | Tx: ${txn.hash}`);
                        }
                        else {
                            console.log(`⚠️ Issue sweeping funds for ${signer.address}`);
                        }
                    }
                    catch (txnError) {
                        console.error(`❌ Error sweeping funds for user:`, txnError);
                    }
                }));
                yield Promise.allSettled(sweepPromises);
                // Wait before next iteration
                yield new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        catch (error) {
            console.error("❌ Error in Binance sweeper:", error);
        }
    });
}
binanceSweeper();
