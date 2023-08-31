const router = require("express").Router();
const { Product } = require("../models/product");
const { Order } = require("../models/order");
const { User } = require("../models/user");

router.get("/", (req, res) => {
	res.send("Admin Server");
});

router.get("/getAllUsers", async (req, res) => {
	try {
		const users = await User.find({});
		res.status(201).send({ message: users });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/addProducts", async (req, res) => {
	try {
		await new Product(req.body).save();
		res.status(201).send({ message: "Product created successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/updateAllProducts", async (req, res) => {
	try {
		await Product.find().update({ date: Date.now() });
		res.status(201).send({ message: "Product created successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/updateAllOrders", async (req, res) => {
	try {
		await Order.find().update({ date: Date.now() });
		res.status(201).send({ message: "Order updated successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/addManyProducts", async (req, res) => {
	try {
		console.log(req.body);
		await Product.insertMany(req.body);
		res.status(201).send({ message: "Product created successfully" });
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

router.post("/updateProduct", async (req, res) => {
	try {
		await Product.find({ _id: req.body.prodId }).update(req.body.updateData)
		res.status(201).send({ message: "Product updated successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/confrimProductDelete", async (req, res) => {
	try {
		var response;
		const productOrder = await Order.find({ productId: req.body.prodId, status: { "$ne": 'Cancelled' } });
		if(productOrder.length > 0) {
			response = {
				status: 409,
				message: "There is already an order associated with this product. Kindly Cancel the order to delete this product"
			}
		}else {
			response = {
				status: 201,
				message: "OK"
			}
		}
		res.status(response.status).send({ message: response.message });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/deleteProduct", async (req, res) => {
	try {
		await Product.deleteOne({ _id: req.body.prodId });
		res.status(201).send({ message: "Product deleted successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/getAllOrders", async (req, res) => {
	try {
		const orders = await Order.find({ ...req.body.query, "status": { "$ne": 'Cancelled' } }).populate("productId", {name: 1, image: 1, price: 1, _id: 0}).populate("userId", {name: 1, email: 1, _id: 0}).sort({ date: -1, _id: -1 }).limit(20);
		res.status(201).send({ message: orders });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/deleteAllOrders", async (req, res) => {
	try {
		await Order.deleteMany({});
		res.status(201).send({ message: "Deleted" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/deleteAllProducts", async (req, res) => {
	try {
		await Product.deleteMany({});
		res.status(201).send({ message: "Deleted" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/getLatestFiveOrders", async (req, res) => {
	try {
		const orders = await Order.find({ "status": "Ordered" }).populate("productId", {name: 1, image: 1, price: 1, _id: 0}).populate("userId", {name: 1, email: 1, _id: 0}).sort({ date: -1, _id: -1 }).limit(5);
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

router.post("/getOrder", async (req, res) => {
	try {
		const orders = await Order.find({ _id: req.body.orderId }).populate("productId", {name: 1, image: 1, price: 1, _id: 0}).populate("userId", {name: 1, email: 1, _id: 0});
		res.status(201).send({ message: orders });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/testOrder", async (req, res) => {
	try {
		const orders = await Order.find({ paymentMode: "Cash on Delivery" }, { status: "Cancelled" }).limit(2);
		const orders2 = await Order.find({ paymentMode: "Cash on Delivery" , status: { $eq: 'Cancelled'} }).limit(2);
		res.status(201).send({ message: [orders, orders2] });
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

router.post("/updateOrderStat", async (req, res) => {
	try {
		await Order.find({ _id: req.body.orderId }).update({ status: req.body.status })
		res.status(201).send({ message: "Order status updated successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post("/deleteOrder", async (req, res) => {
	try {
		const orders = await Order.find({ _id: req.body.orderId });
		var response;
		if(orders[0].status === "Cancelled") {
			await Order.deleteOne({ _id: req.body.orderId });
			response = {
				status: 201,
				message: "Product deleted successfully"
			}
		}else {
			response = {
				status: 409,
				message: "You must cancel the order before delete"
			}
		}
		res.status(response.status).send({ message: response.message });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;
