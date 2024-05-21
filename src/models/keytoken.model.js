const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

// Declare the Schema of the Mongo model
const tokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Shop',
        },
        privateKey: {
            type: String,
            required: true,
            trim: true,
        },
        publicKey: {
            type: String,
            required: true,
            trim: true,
        },
        refreshToken: {
            type: Array,
            default: [],
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, tokenSchema);
