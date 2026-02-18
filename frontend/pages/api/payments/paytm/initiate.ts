import type { NextApiRequest, NextApiResponse } from 'next';
import PaytmChecksum from 'paytmchecksum';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

// Get environment variables from Next.js config
const {
  PAYTM_MERCHANT_KEY,
  PAYTM_MID,
  PAYTM_WEBSITE,
  PAYTM_INDUSTRY_TYPE,
  PAYTM_CHANNEL_ID,
} = serverRuntimeConfig;

const PAYTM_CALLBACK_URL = `${process.env.NEXT_PUBLIC_API_BASE}/api/payments/paytm/callback`;

// Validate environment variables at startup
const validateEnvVars = () => {
  const requiredVars = [
    'PAYTM_MERCHANT_KEY',
    'PAYTM_MID',
    'PAYTM_WEBSITE',
    'PAYTM_INDUSTRY_TYPE',
    'PAYTM_CHANNEL_ID',
    'NEXT_PUBLIC_API_BASE'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName] && !serverRuntimeConfig[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Validate environment variables when the module loads
try {
  validateEnvVars();
} catch (error) {
  console.error('Environment validation failed:', error);
}

interface PaytmParamsBody {
  requestType: string;
  mid: string;
  websiteName: string;
  orderId: string;
  txnAmount: {
    value: string;
    currency: string;
  };
  userInfo: {
    custId: string;
  };
  callbackUrl: string;
  channelId?: string;
  industryType?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Initiating PayTM payment with body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { amount, orderId, customerId } = req.body;

    if (!amount || !orderId || !customerId) {
      console.error('Missing required parameters:', { amount, orderId, customerId });
      return res.status(400).json({ 
        error: 'Missing required parameters',
        details: { amount: !amount, orderId: !orderId, customerId: !customerId }
      });
    }

    const paytmParams: PaytmParamsBody = {
      requestType: 'Payment',
      mid: PAYTM_MID,
      websiteName: PAYTM_WEBSITE,
      orderId: orderId.toString(),
      txnAmount: {
        value: amount.toString(),
        currency: 'INR',
      },
      userInfo: {
        custId: customerId.toString(),
      },
      callbackUrl: PAYTM_CALLBACK_URL,
      channelId: PAYTM_CHANNEL_ID,
      industryType: PAYTM_INDUSTRY_TYPE
    };

    console.log('Generated PayTM params:', JSON.stringify(paytmParams, null, 2));
    console.log('Using Merchant Key (first 5 chars):', PAYTM_MERCHANT_KEY ? `${PAYTM_MERCHANT_KEY.substring(0, 5)}...` : 'undefined');

    try {
      // Generate checksum
      const paytmChecksum = await PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams),
        PAYTM_MERCHANT_KEY
      );

      // Get transaction token
      const txnToken = await PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams),
        PAYTM_MERCHANT_KEY
      );

      console.log('Successfully generated PayTM transaction token');

      const responseData = {
        orderId: paytmParams.orderId,
        txnToken,
        txnAmount: paytmParams.txnAmount.value,
        mid: PAYTM_MID,
        callbackUrl: PAYTM_CALLBACK_URL,
        websiteName: PAYTM_WEBSITE,
        channelId: PAYTM_CHANNEL_ID,
        industryTypeId: PAYTM_INDUSTRY_TYPE,
      };

      console.log('Sending response:', JSON.stringify(responseData, null, 2));
      
      return res.status(200).json(responseData);
    } catch (signatureError) {
      console.error('Error generating PayTM signature:', signatureError);
      return res.status(500).json({ 
        error: 'Failed to generate payment signature',
        details: signatureError.message 
      });
    }
  } catch (error) {
    console.error('Error in PayTM payment initiation:', error);
    return res.status(500).json({ 
      error: 'Failed to initiate payment',
      details: error.message 
    });
  }
}
