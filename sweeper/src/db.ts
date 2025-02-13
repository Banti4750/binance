import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    userId: number;
    email: string;
    password: string;
    balance?: number;
    publicKey?: string;
    privateKey?: string;
}

const UserSchema = new Schema<IUser>({
    userId: {
        type: Number,
        unique: true,
        required: true,
        index: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    publicKey: {
        type: String,
    },
    privateKey: {
        type: String,
    },
});

UserSchema.pre<IUser>("validate", async function (next) {
    if (!this.userId) {
        const lastUser = await UserModel.findOne().sort({ userId: -1 });
        this.userId = lastUser ? lastUser.userId + 1 : 1;
    }
    next();
});


const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
