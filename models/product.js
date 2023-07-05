const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	category: { type: String, required: true },	
	net_weight: { type: String },
	price: { type: String, required: true },
	image: { type: String, required: true },
});

const Product = mongoose.model("product", productSchema);

module.exports = { Product };