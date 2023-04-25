const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.set('strictQuery', true);

const SoilTest = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "farmer"
    },

    date: {
        type: Date,
        default: Date.now,
    },
})

const TestingSoil = mongoose.model("soiltest", SoilTest);
module.exports = TestingSoil;