const router = require("express").Router();
const { Product } = require("../models/product");

router.get("/", (req, res) => {
	res.send("Admin Server");
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

module.exports = router;
