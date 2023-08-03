const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Product } = require("../models/product");

const orderSchema = new mongoose.Schema({
	productId: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: Product }],
	address: { type: String, required: true },
	phone: { type: String, required: true },
	paymentMode: { type: String, required: true },
	quantity: [{ type: Number, required: true }],
	totalCost: { type: Number, required: true },
	amountPaid: { type: Number, required: true },
	orderId: { type: String, required: true },
	status: { type: String, required: true },
    userId: { type: String, required: true, ref: User },
	date: { type: Date, default: Date.now },
});

const Order = mongoose.model("order", orderSchema);

module.exports = { Order };