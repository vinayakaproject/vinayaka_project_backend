const router = require("express").Router();
const { User } = require("../models/user");
const { Order } = require("../models/order");
const { Product } = require("../models/product");

const computePrice = (quantity, cost) => { 
	const price = cost * quantity;
	return price;
}

router.post("/createUser", async (req, res) => {
	try {
		await new User({ _id: req.body.userid, email: req.body.email, name: req.body.name }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/getUser", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });
	
		res.status(201).send({ message: "User not found" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/postOrder", async (req, res) => {
	try {
		const { productId, address, phone, paymentMode, quantity, userId } = req.body;

		console.log(req.body);

		const productsPrice = await Product.find().where("_id").in(productId).select({ price: 1, _id: 0 });

		console.log(productsPrice);

		var totalCost = (productsPrice.length === productId.length) ? productsPrice.reduce(function myFunc(total, data, i) {
			return total + (parseInt(data.price) * quantity[i]);
		}, 0) : null;
		const status = "Ordered";

		if(paymentMode === "Cash on Delivery" && totalCost) { 
			await new Order({ productId, address, phone, paymentMode, quantity, totalCost, amountPaid: 0, orderId: "N/A", status, userId }).save();
			return res.status(201).send({ message: "Order created successfully" });
		} else if(paymentMode === "Online" && totalCost) { 
			//Razorpay payment Integration
		}

		// productId: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: Product }],
		// address: { type: String, required: true },
		// phone: { type: String, required: true },
		// paymentMode: { type: String, required: true },
		// quantity: [{ type: Number, required: true }],
		// totalCost: { type: Number, required: true },
		// amountPaid: { type: Number, required: true },
		// orderId: { type: String, required: true },
		// userId: { type: String, required: true, ref: User },

		//await new Order({ ...req.body }).save();
		res.status(409).send({ message: "Invalid Request" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/getOrderbyUser", async (req, res) => {
	try {
		console.log(req.body.userid)
		const orders = await Order.find({ userId: req.body.userid }).populate("productId", {name: 1, image: 1, price: 1, _id: 0}).populate("userId", {name: 1, email: 1, _id: 0}).sort({ date: -1, _id: -1 }).limit(20);
		res.status(201).send({ message: orders });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/getTotalOrders", async (req, res) => {
	try {
		const orders = await Order.find().countDocuments();
		console.log(orders);
		res.status(201).send({ message: orders });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/getOrderbyFilter", async (req, res) => {
	try {
		const orders = await Order.find(req.body.query).populate("productId", {name: 1, image: 1, price: 1, _id: 0}).populate("userId", {name: 1, email: 1, _id: 0}).sort({ date: -1, _id: -1 }).skip(req.body.skip).limit(20);
		res.status(201).send({ message: orders });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/getAllProducts", async (req, res) => {
	try {
		console.log(req.body.skip);
		const products = await Product.find(req.body.query).sort({ date: -1, _id: -1 }).skip(req.body.skip).limit(20);
		console.log(products);
		res.status(201).send({ message: products });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/getProduct", async (req, res) => {
	try {
		const product = await Product.find({ _id: req.body.id });
		console.log(product);
		res.status(201).send({ message: product });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/getTotalProducts", async (req, res) => {
	try {
		const products = await Product.find().countDocuments();
		console.log(products);
		res.status(201).send({ message: products });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/getLatestFiveProd", async (req, res) => {
	try {
		const products = await Product.find({}).sort({ date: -1, _id: -1 }).limit(8);
		res.status(201).send({ message: products });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;
