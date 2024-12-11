import { Cart } from "../models/cart.js";

const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json({
      message: "Fetched all cart items successfully!",
      carts: carts,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching cart items.",
      error: error.message,
    });
  }
};

const addItemsInCart = async (req, res) => {
  try {
    const { items } = req.body; // Expect items to be an array in the request body

    // Validate the items format
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        message: "Invalid items format. Expected an array of items.",
      });
    }

    // Retrieve the current cart
    const cart = await Cart.findOne({userId :req.params.userId});
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    // Process each item
    items.forEach((newItem) => {
      // Validate item fields
      if (
        !newItem.productId ||
        !newItem.quantity ||
        typeof newItem.priceAtPurchase !== "number" ||
        typeof newItem.priceAfterDiscount !== "number"
      ) {
        throw new Error(
          "Invalid item data. Each item must have productId, quantity, priceAtPurchase, and priceAfterDiscount."
        );
      }

      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === newItem.productId
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists in cart
        cart.items[existingItemIndex].quantity += +newItem.quantity;
      } else {
        // Add new item if it doesn't exist in cart
        cart.items.push(newItem);
      }
    });

    // Recalculate the total price
    const totalPrice = cart.items.reduce(
      (total, item) => total + (item.quantity * item.priceAfterDiscount || 0),
      0
    );
    // Ensure totalPrice is a number
    if (isNaN(totalPrice)) {
      throw new Error("Total price calculation failed.");
    }

    cart.totalPrice = totalPrice;
    cart.updatedAt = new Date();

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Items added to the cart successfully!",
      cart,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: "An error occurred while adding items to the cart.",
      error: error.message,
    });
  }
};

const getCartByCartId = async (req, res) => {
  try {
    const userCart = await Cart.findById(req.params.cartId);
    if (!userCart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }
    res.status(200).json({
      message: "Fetched cart by cart ID successfully!",
      userCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching the cart.",
      error: error.message,
    });
  }
};

const deleteCartItemByItemId = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { "items._id": req.params.itemId },
      { $pull: { items: { _id: req.params.itemId } } },
      { new: true } // Return the updated document
    );

    if (!cart) {
      return res.status(404).json({
        message: "Item not found in any cart.",
      });
    }

    //recalculating the total price
    const totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * (item.priceAfterDiscount || 0),
      0
    );
    cart.totalPrice = totalPrice;
    await cart.save();

    res.status(200).json({
      message: "Item deleted successfully!",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the item.",
      error: error.message,
    });
  }
};

const updateItemById = async (req, res) => {
  try {
    // Find the cart by ID
    const cart = await Cart.findOne({userId : req.params.userId});
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item to update
    const item = cart.items.find(
      (element) => element._id.toString() === req.body.itemId
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the item's quantity
    item.quantity = req.body.quantity;

    // Recalculate total price
    const totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * (item.priceAfterDiscount || 0),
      0
    );

    cart.totalPrice = totalPrice;

    // Update timestamps
    cart.updatedAt = new Date();

    // Save the updated cart
    await cart.save();

    // Respond with the updated cart
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCartById = async (req, res) => {
  Cart.deleteOne({ _id: req.params.cart_id }).then(() => {
    res.status(200).json({ message: "Carts deleted!" });
  });
};

const getCartbyUserId = async (req, res) => {
  Cart.find({ userId: req.params.userId }).then((cart) => {
    res.status(400).json({ cartProducts: cart })
  })
}

export {
  getAllCarts,
  addItemsInCart,
  getCartByCartId,
  deleteCartItemByItemId,
  updateItemById,
  deleteCartById,
  getCartbyUserId
};
