import PDFDocument from "pdfkit";

const formatTime = (time24) => {
    if (!time24) return ""
    const [hourStr, minute] = time24.split(":")
    let hour = parseInt(hourStr, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12
    return `${hour}:${minute} ${ampm}`
}

export const generateInvoice = (booking) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);

            // Header
            doc.fontSize(22).fillColor("#4B3FBF").text("EventoAdmin", { align: "left" });
            doc.fontSize(10).fillColor("#888").text("Event Booking Invoice", { align: "left" });
            doc.moveDown(1.5);

            // Invoice info
            doc.fontSize(10).fillColor("#333");
            doc.text(`Invoice Date: ${new Date().toLocaleDateString("en-IN")}`);
            doc.text(`Booking ID: ${booking._id}`);
            doc.moveDown(1);

            // Divider
            doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#eee").stroke();
            doc.moveDown(1);

            // Customer info
            doc.fontSize(12).fillColor("#2B2560").text("Customer Details", { underline: false });
            doc.fontSize(10).fillColor("#333");
            doc.text(`Name: ${booking.name}`);
            doc.text(`Email: ${booking.email}`);
            doc.text(`Phone: ${booking.phone}`);
            doc.moveDown(1);

            // Booking details
            doc.fontSize(12).fillColor("#2B2560").text("Booking Details");
            doc.fontSize(10).fillColor("#333");
            doc.text(`Item: ${booking.itemName}`);
            doc.text(`Event Date: ${new Date(booking.eventDate).toLocaleDateString("en-IN")}`);
            doc.text(`Time: ${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`);
            doc.text(`Guests: ${booking.guests}`);
            doc.moveDown(1);

            // Divider
            doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#eee").stroke();
            doc.moveDown(1);

            // Price & Payment Info
            doc.fontSize(12).fillColor("#2B2560").text("Amount", { continued: true });
            doc.fontSize(16).fillColor("#4B3FBF").text(`   ₹${(booking.price || 0).toLocaleString("en-IN")}`, { align: "left" });
            
            if (booking.paymentStatus === "paid") {
                doc.moveDown(0.5);
                doc.fontSize(10).fillColor("#059669").text(`Payment Status: PAID via Razorpay`, { align: "left" });
                if (booking.razorpayPaymentId) {
                    doc.fontSize(9).fillColor("#64748B").text(`Transaction ID: ${booking.razorpayPaymentId}`, { align: "left" });
                }
            }
            doc.moveDown(1.5);

            // Footer
            doc.fontSize(9).fillColor("#999").text("Thank you for booking with EventoAdmin. We look forward to making your event memorable!", { align: "center" });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};