import mongoose from "mongoose";

const familySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        joinCode: {
            type: String,
            required: true,
            unique: true,
        },
        headUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Family = mongoose.model("Family", familySchema);

export default Family;
