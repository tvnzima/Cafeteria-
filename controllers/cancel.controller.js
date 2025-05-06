const Payment = require('../models/payment.model');
const Order = require('../models/order.model'); // Assuming you store orders
const Student = require('../models/student.model');

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentMethod !== 'Bkash') {
      return res.status(400).json({ message: 'Refunds only available for Bkash payments' });
    }

    if (order.orderStatus !== 'processing') {
      return res.status(400).json({ message: 'Only processing orders can be canceled' });
    }

    // ✅ Refund 40%
    const refundAmount = Math.floor(order.totalPrice * 0.4);
    const student = await Student.findOne({ customerId: order.customerId });

    student.wallet += refundAmount;
    await student.save();

    order.orderStatus = 'canceled';
    await order.save();

    res.status(200).json({
      message: `Order canceled. ৳${refundAmount} refunded to wallet.`,
      wallet: student.wallet
    });
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed', error: err.message });
  }
};

module.exports = { cancelOrder };
