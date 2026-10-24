export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay checkout script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const startRazorpayCheckout = async ({
  amount,
  itemName = "Event Booking",
  customerName = "",
  customerEmail = "",
  customerPhone = "",
  onSuccess,
  onError,
  onDismiss,
}) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
  }

  // 1. Create order on backend
  const orderRes = await fetch(`${API_URL}/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      notes: { item: itemName },
    }),
  });

  const orderData = await orderRes.json();
  if (!orderRes.ok || !orderData.data?.order) {
    throw new Error(orderData.message || "Failed to create payment order");
  }

  const { order, key } = orderData.data;

  // 2. Open Razorpay Checkout modal
  const options = {
    key: key,
    amount: order.amount,
    currency: order.currency || "INR",
    name: "Evento Events & Moments",
    description: `Booking for ${itemName}`,
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    order_id: order.id,
    handler: async function (response) {
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      }
    },
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },
    theme: {
      color: "#C5A059",
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) onDismiss();
      },
    },
  };

  const razorpayInstance = new window.Razorpay(options);

  razorpayInstance.on("payment.failed", function (response) {
    if (onError) {
      onError(response.error);
    }
  });

  razorpayInstance.open();
};
