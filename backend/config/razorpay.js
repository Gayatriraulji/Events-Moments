import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

export const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.warn("⚠️ Razorpay API Keys are missing in .env file");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};
