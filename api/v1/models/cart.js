// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({

//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   items: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//       quantity: { type: Number, default: 1, min: 1 }
//     }
//   ],

//   totalBill: { type: Number, default: 0 }

// }, { timestamps: true });


// module.exports = mongoose.model('Cart', cartSchema);


const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 }
});

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalBill: { type: Number, default: 0 },
  items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
