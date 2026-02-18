import axios, { AxiosError } from 'axios';

export interface PaymentInitiateResponse {
  orderId: string;
  txnToken: string;
  txnAmount: string;
  mid: string;
  callbackUrl: string;
  websiteName: string;
  channelId: string;
  industryTypeId: string;
}

interface PaymentError extends Error {
  code?: string;
  response?: {
    data?: any;
    status?: number;
  };
}

export const initiatePaytmPayment = async (
  amount: number, 
  orderId: string, 
  customerId: string
): Promise<PaymentInitiateResponse> => {
  try {
    console.log('Initiating PayTM payment with:', { amount, orderId, customerId });
    
    const response = await axios.post<PaymentInitiateResponse>(
      '/api/payments/paytm/initiate', 
      { 
        amount: Number(amount),
        orderId: orderId.toString(),
        customerId: customerId.toString()
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    if (!response.data) {
      throw new Error('No data received from payment server');
    }

    console.log('Payment initiation successful:', response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Payment initiation failed with status:', axiosError.response.status);
      console.error('Response data:', axiosError.response.data);
      
      let errorMessage = 'Payment initiation failed';
      if ((axiosError.response.data as any)?.error) {
        errorMessage += `: ${(axiosError.response.data as any).error}`;
        if ((axiosError.response.data as any)?.details) {
          errorMessage += ` (${JSON.stringify((axiosError.response.data as any).details)})`;
        }
      }
      
      throw new Error(errorMessage);
    } else if (axiosError.request) {
      // The request was made but no response was received
      console.error('No response received from payment server:', axiosError.request);
      throw new Error('No response from payment server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up payment request:', axiosError.message);
      throw new Error(`Failed to set up payment: ${axiosError.message}`);
    }
  }
};

export const verifyPaytmPayment = async (orderId: string): Promise<boolean> => {
  try {
    console.log('Verifying PayTM payment for order:', orderId);
    
    const response = await axios.post(
      '/api/payments/paytm/verify', 
      { orderId: orderId.toString() },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    if (typeof response.data?.success === 'boolean') {
      return response.data.success;
    }
    
    throw new Error('Invalid response format from payment verification');
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw new Error('Failed to verify payment status');
  }
};

export const loadPaytmScript = (onLoad: () => void): void => {
  if (typeof window === 'undefined') {
    console.warn('loadPaytmScript called on server side');
    return;
  }
  
  try {
    // Check if already loaded
    if ((window as any).Paytm && (window as any).Paytm.CheckoutJS) {
      console.log('PayTM CheckoutJS already loaded');
      onLoad();
      return;
    }

    console.log('Loading PayTM CheckoutJS script...');
    
    const script = document.createElement('script');
    script.src = `https://securegw.paytm.in/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('PayTM CheckoutJS script loaded successfully');
      onLoad();
    };
    
    script.onerror = (error) => {
      console.error('Failed to load PayTM CheckoutJS script:', error);
      // Still call onLoad to prevent UI from being stuck
      onLoad();
    };
    
    document.body.appendChild(script);
  } catch (error) {
    console.error('Error in loadPaytmScript:', error);
    // Still call onLoad to prevent UI from being stuck
    onLoad();
  }
};
