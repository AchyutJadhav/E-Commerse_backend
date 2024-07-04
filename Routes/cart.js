const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");
const Cart = require("../Models/Cart");
const router = require("express").Router();

// New Cart

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const Carts = Cart.find();
  
    try {
      res.status(200).json(Carts);
    } catch (err) {
      res.status(500).json(err);
    }
  });


// Update Cart

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET user cart

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId: req.params.userId});
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;