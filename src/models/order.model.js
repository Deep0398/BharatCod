import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    name:{
        type: String
       
    },
   
    items:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity:{
            type:Number,
            required: true
        },
        totalPrice:{
            type:Number,
            },
            orderAddress:{
                type: String
            },
            title:{
                type: String

            }
    }
],
totalPrice:{
    type:Number,
   
},
status:{
    type:String,
    enum:['placed','processing','delivered','canceled','shipped'],
    default:'placed'
},
regularPrice:{
    type:Number,
    
},
salePrice:{
    type:Number,
    
},
price:{
    type:Number,
    
},
discount: { type: Number, default: 0 },

},
{timestamps:true})

orderSchema.post('save', async function (doc, next) {
    console.log('Order save middleware triggered');
    if (this.isModified('status') || this.isNew) {
      console.log('Order status changed or new order, sending email');
      const { sendOrderStatusEmail } = await import('../controller/emailController.js');
      const user = await mongoose.model('User').findById(doc.userId);
      if (user) {
        const email = user.email;
        const orderId = doc._id;
        let subject, text;
  
        switch (doc.status) {
          case 'placed':
            subject = 'Order Placed Successfully';
            text = `Your order with ID ${orderId} has been successfully placed. We will notify you once the order is shipped.`;
            break;
          case 'canceled':
            subject = 'Order Canceled';
            text = `Your order with ID ${orderId} has been canceled. If you have any questions, please contact our support team.`;
            break;
          case 'shipped':
            subject = 'Order Shipped';
            text = `Your order with ID ${orderId} has been shipped. We will notify you once it is delivered.`;
            break;
          case 'delivered':
            subject = 'Order Delivered';
            text = `Your order with ID ${orderId} has been delivered. Thank you for shopping with us.`;
            break;
          default:
            break;
        }
  
        if (subject && text) {
          console.log(`Preparing to send email to: ${email}, Subject: ${subject}`);
          await sendOrderStatusEmail(email, subject, text);
        } else {
          console.log('No email subject or text defined');
        }
      } else {
        console.log('User not found for order:', doc.userId);
      }
    }
    next();
  });

const Order = mongoose.model('Order', orderSchema)
export default Order
