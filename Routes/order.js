const {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("./verifyToken");
const Order = require("../Models/Order");
const router = require("express").Router();

// New order

router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const Orders = Order.find();

  try {
    res.status(200).json(Orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Order

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET user order

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.id });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// stats

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const lastPrevious = new Date(new Date.setMonth(lastMonth.getMonth() - 1));
  // console.log(date.getMonth());


  try {
    res.status(200).send("ok");
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: lastPrevious } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "month",
          total: { $sum: "$sales" },
        },
      },
      // },
    ]);
    res.status(200).json(income);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
