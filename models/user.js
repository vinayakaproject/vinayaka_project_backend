const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	_id: String,
	name: { type: String, required: true },
	email: { type: String, required: true }, 
}, { _id: false });

const User = mongoose.model("user", userSchema);

module.exports = { User };