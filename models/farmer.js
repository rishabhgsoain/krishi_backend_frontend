const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.set('strictQuery', true);
const FarmerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    authToken: {
        type: String,
        default: "hello"
    },
    email: {
        type: String,
        require: false
        // required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    address: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now,
    },
});
const Farmer = mongoose.model("farmer", FarmerSchema);
module.exports = Farmer;