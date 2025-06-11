"use client";

import { useState } from "react";
import { Download, CheckCircle, X } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    id: string;
    items: any[];
    customerInfo: {
      name: string;
      email: string;
      address: string;
      city: string;
      phone: string;
      apartment?: string; // Added apartment field
    };
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    invoice: {
      invoiceId: string;
      details: string;
      date: string;
    };
    paymentMethod: string;
    paymentDetails?: {
      cardType?: string;
      lastFour?: string;
      transactionId: string;
      date: string;
      time?: string;
      status: string;
      expectedDelivery?: string;
    };
    status?: string;
  };
}

export default function InvoiceModal({
  isOpen,
  onClose,
  orderData,
}: InvoiceModalProps) {
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  if (!isOpen) return null;

  const generateInvoicePDF = () => {
    const doc = new jsPDF();
    const invoiceNumber =
      orderData.invoice.invoiceId ||
      `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentDate = new Date(
      orderData.invoice.date || new Date()
    ).toLocaleDateString();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Function to add header to each page
    const addPageHeader = () => {
      // Light gray background for header
      doc.setFillColor(248, 249, 250);
      doc.rect(0, 0, pageWidth, 40, "F");

      // Accent color bar on left side
      doc.setFillColor(220, 38, 38); // Red color
      doc.rect(0, 0, 10, pageHeight, "F");

      // Logo and Title in header
      doc.setFontSize(24);
      doc.setTextColor(220, 38, 38); // Red color for main title
      doc.setFont("helvetica", "bold");
      doc.text("DANIEL", 20, 20);
      doc.setFontSize(12);
      doc.text("E-COMMERCE", 20, 28);

      // Add "logo" on right side
      const logoWidth = 30;
      const logoHeight = 20;
      const logoX = pageWidth - 40;
      const logoY = 10;

      try {
        doc.addImage("/logo.png", "PNG", logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        // Fallback to text if image fails to load
        doc.setFillColor(220, 38, 38);
        doc.rect(logoX, logoY, logoWidth, logoHeight, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text("DANIEL", logoX + logoWidth / 2, logoY + 10, {
          align: "center",
        });
        doc.text("SHOP", logoX + logoWidth / 2, logoY + 15, {
          align: "center",
        });
      }
    };

    // Function to add footer to each page
    const addPageFooter = () => {
      const footerY = pageHeight - 20;
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.5);
      doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);

      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Thank you for shopping with Daniel E-Commerce!",
        pageWidth / 2,
        footerY - 5,
        { align: "center" }
      );
      doc.text(
        `www.daniel-ecommerce.com | support@daniel-ecommerce.com | +1 (555) 123-4567`,
        pageWidth / 2,
        footerY,
        {
          align: "center",
        }
      );
    };

    // Add first page header
    addPageHeader();

    // Invoice title and number
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 20, 50);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${invoiceNumber}`, 20, 58);
    doc.text(`Date: ${currentDate}`, 20, 65);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Order #: ${orderData.id}`, 105, 58);

    // Horizontal line
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.5);
    doc.line(20, 70, pageWidth - 20, 70);

    // Two-column layout for customer and payment info
    const colWidth = (pageWidth - 40) / 2;

    // Left column - Customer Information
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", 20, 85);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`${orderData.customerInfo.name}`, 20, 95);

    // Handle address with apartment if available
    let addressY = 102;
    const addressLines = orderData.customerInfo.address.split(", ");
    doc.text(addressLines[0], 20, addressY);
    addressY += 7;

    if (addressLines.length > 1) {
      doc.text(addressLines[1], 20, addressY);
      addressY += 7;
    }

    if (orderData.customerInfo.apartment) {
      doc.text(`Apt: ${orderData.customerInfo.apartment}`, 20, addressY);
      addressY += 7;
    }

    doc.text(`${orderData.customerInfo.city}`, 20, addressY);
    addressY += 7;
    doc.text(`Phone: ${orderData.customerInfo.phone}`, 20, addressY);
    addressY += 7;
    doc.text(`Email: ${orderData.customerInfo.email}`, 20, addressY);

    // Right column - Payment Information
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT DETAILS", 20 + colWidth, 85);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`Method: ${orderData.paymentMethod}`, 20 + colWidth, 95);

    // Add detailed payment information based on payment method
    if (orderData.paymentMethod.includes("Credit Card")) {
      const cardType =
        orderData.paymentDetails?.cardType ||
        (orderData.paymentMethod.includes("mastercard")
          ? "Mastercard"
          : "Visa");

      doc.text(`Card Type: ${cardType}`, 20 + colWidth, 102);
      doc.text(
        `Card Number: **** **** **** ${
          orderData.paymentDetails?.lastFour || "1234"
        }`,
        20 + colWidth,
        109
      );
      doc.text(
        `Transaction ID: ${
          orderData.paymentDetails?.transactionId ||
          "TXN" + Math.floor(Math.random() * 1000000)
        }`,
        20 + colWidth,
        116
      );
      doc.text(
        `Status: ${orderData.paymentDetails?.status || "Completed"}`,
        20 + colWidth,
        123
      );
    } else {
      doc.text(
        `Status: ${
          orderData.paymentDetails?.status || "Pending (Cash on Delivery)"
        }`,
        20 + colWidth,
        102
      );
      doc.text(
        `Transaction ID: ${
          orderData.paymentDetails?.transactionId ||
          "COD" + Math.floor(Math.random() * 1000000)
        }`,
        20 + colWidth,
        109
      );
      doc.text(
        `Expected Delivery: ${
          orderData.paymentDetails?.expectedDelivery ||
          new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }`,
        20 + colWidth,
        116
      );
    }

    // Horizontal line before table
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(20, 135, pageWidth - 20, 135);

    // Order Items Table with enhanced columns for size and color
    const tableColumn = ["Item", "Size", "Color", "Quantity", "Price", "Total"];
    const tableRows = orderData.items.map((item) => [
      item.name,
      item.size || "N/A",
      item.color || "N/A",
      item.quantity,
      `€${item.price.toFixed(2)}`,
      `€${(item.price * item.quantity).toFixed(2)}`,
    ]);

    // Add the table with custom styling and dynamic pagination
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 145,
      theme: "grid",
      styles: {
        fontSize: 9,
        textColor: [80, 80, 80],
        cellPadding: 6,
      },
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 25, halign: "center" },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 25, halign: "center" },
        4: { cellWidth: 30, halign: "right" },
        5: { cellWidth: 30, halign: "right" },
      },
      margin: { left: 20, right: 20 },
      // Add these options for better page handling
      didDrawPage: (data) => {
        // Add header and footer to each page
        addPageHeader();
        addPageFooter();
      },
      // Enable automatic page breaks
      showHead: "everyPage",
    });

    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Check if there's enough space for the summary box
    const summaryBoxHeight = 60;
    const footerHeight = 30;

    // Always put the summary on a new page if we're close to the bottom
    // This ensures consistent placement and avoids crowding
    if (finalY + summaryBoxHeight > pageHeight - footerHeight) {
      // Not enough space, add a new page
      doc.addPage();

      // Add header to the new page
      addPageHeader();

      // Add summary at the top of the new page with some margin
      const newFinalY = 60; // Start after the header with some margin

      // Summary box with totals on the new page
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(pageWidth - 100, newFinalY, 80, 50, 3, 3, "F");

      // Add summary with right alignment
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Subtotal:`, pageWidth - 60, newFinalY + 10, { align: "right" });
      doc.text(`Tax:`, pageWidth - 60, newFinalY + 20, { align: "right" });
      doc.text(`Shipping:`, pageWidth - 60, newFinalY + 30, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(
        `€${orderData.subtotal.toFixed(2)}`,
        pageWidth - 25,
        newFinalY + 10,
        { align: "right" }
      );
      doc.text(`€${orderData.tax.toFixed(2)}`, pageWidth - 25, newFinalY + 20, {
        align: "right",
      });
      doc.text(
        `€${orderData.shipping.toFixed(2)}`,
        pageWidth - 25,
        newFinalY + 30,
        { align: "right" }
      );

      // Total with highlight
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.5);
      doc.line(pageWidth - 100, newFinalY + 40, pageWidth - 20, newFinalY + 40);

      doc.setFontSize(12);
      doc.setTextColor(220, 38, 38);
      doc.text(`TOTAL:`, pageWidth - 60, newFinalY + 48, { align: "right" });
      doc.text(
        `€${orderData.total.toFixed(2)}`,
        pageWidth - 25,
        newFinalY + 48,
        { align: "right" }
      );

      // Add footer to the new page
      addPageFooter();
    } else {
      // Enough space, add summary box on the same page
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(pageWidth - 100, finalY, 80, 50, 3, 3, "F");

      // Add summary with right alignment
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Subtotal:`, pageWidth - 60, finalY + 10, { align: "right" });
      doc.text(`Tax:`, pageWidth - 60, finalY + 20, { align: "right" });
      doc.text(`Shipping:`, pageWidth - 60, finalY + 30, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(
        `€${orderData.subtotal.toFixed(2)}`,
        pageWidth - 25,
        finalY + 10,
        { align: "right" }
      );
      doc.text(`€${orderData.tax.toFixed(2)}`, pageWidth - 25, finalY + 20, {
        align: "right",
      });
      doc.text(
        `€${orderData.shipping.toFixed(2)}`,
        pageWidth - 25,
        finalY + 30,
        { align: "right" }
      );

      // Total with highlight
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.5);
      doc.line(pageWidth - 100, finalY + 40, pageWidth - 20, finalY + 40);

      doc.setFontSize(12);
      doc.setTextColor(220, 38, 38);
      doc.text(`TOTAL:`, pageWidth - 60, finalY + 48, { align: "right" });
      doc.text(`€${orderData.total.toFixed(2)}`, pageWidth - 25, finalY + 48, {
        align: "right",
      });
    }

    // Save the PDF
    doc.save(`invoice-${invoiceNumber}.pdf`);
    setInvoiceGenerated(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-full">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center justify-center py-6">
          {/* Show order status */}
          <div className="mb-2 text-sm">
            <span className="font-semibold">Order Status: </span>
            <span
              className={
                orderData.status === "Completed"
                  ? "text-green-600"
                  : orderData.status === "Pending"
                  ? "text-yellow-600"
                  : "text-gray-600"
              }
            >
              {orderData.status || "Processing"}
            </span>
          </div>
          {invoiceGenerated ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 text-center mb-6">
                Your order has been placed and your invoice has been downloaded.
              </p>
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-full cursor-pointer"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 text-center mb-6">
                Your order has been placed. Thank you for shopping with us!
              </p>
              <button
                onClick={generateInvoicePDF}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] hover:bg-red-600 text-white py-3 px-6 rounded-full w-full transition-all duration-500 ease-out transform hover:shadow-xl cursor-pointer text-center cursor-pointer
    hover:bg-right hover:from-[#EB1E24] hover:via-[#F05021] hover:to-[#ff3604]"
              >
                <Download className="h-5 w-5" />
                Download Invoice
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
