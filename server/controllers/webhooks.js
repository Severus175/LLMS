import { Webhook } from "svix";
import User from "../models/User.js";
import stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";



// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {

    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    })

    // Getting Data from request body
    const { data, type } = req.body

    // Switch Cases for differernt Events
    switch (type) {
      case 'user.created': {

        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
          resume: ''
        }
        await User.create(userData)
        res.json({})
        break;
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        }
        await User.findByIdAndUpdate(data.id, userData)
        res.json({})
        break;
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break;
      }
      default:
        break;
    }

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


// Stripe Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)


// Stripe Webhooks to Manage Payments Action
export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('Payment succeeded, processing enrollment...');

      const session = event.data.object;
      const { purchaseId } = session.metadata;

      if (!purchaseId) {
        console.log('No purchaseId found in session metadata');
        break;
      }

      const purchaseData = await Purchase.findById(purchaseId)
      
      if (!purchaseData) {
        console.log('Purchase data not found for ID:', purchaseId);
        break;
      }

      const userData = await User.findById(purchaseData.userId)
      const courseData = await Course.findById(purchaseData.courseId.toString())

      if (!userData || !courseData) {
        console.log('User or course data not found');
        break;
      }

      // Check if already enrolled to prevent duplicates
      if (!courseData.enrolledStudents.includes(userData._id)) {
        courseData.enrolledStudents.push(userData._id)
        await courseData.save()
        console.log('Student added to course enrolled list');
      }

      if (!userData.enrolledCourses.includes(courseData._id)) {
        userData.enrolledCourses.push(courseData._id)
        await userData.save()
        console.log('Course added to user enrolled list');
      }

      purchaseData.status = 'completed'
      await purchaseData.save()
      
      console.log('Enrollment completed successfully');

      break;
    }
    case 'checkout.session.expired': {
      console.log('Payment failed, updating purchase status...');
      
      const session = event.data.object;
      const { purchaseId } = session.metadata;
      
      if (!purchaseId) {
        console.log('No purchaseId found in failed payment session metadata');
        break;
      }

      const purchaseData = await Purchase.findById(purchaseId)
      
      if (!purchaseData) {
        console.log('Purchase data not found for failed payment ID:', purchaseId);
        break;
      }
      
      purchaseData.status = 'failed'
      await purchaseData.save()
      
      console.log('Purchase marked as failed');

      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
}