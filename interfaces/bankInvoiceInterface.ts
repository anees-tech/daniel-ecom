interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderData: {
      items: any[];
      customerInfo: {
        name: string;
        email: string;
        address: string;
        city: string;
        phone: string;
        apartment: string;
      };
      subtotal: number;
      tax: number;
      shipping: number;
      total: number;
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
    };
  }

export type { InvoiceModalProps };