import type { NextApiRequest, NextApiResponse } from 'next';
import PaytmChecksum from 'paytmchecksum';

const PAYTM_MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { body } = req;
    
    // Verify the checksum
    const isValidChecksum = await PaytmChecksum.verifySignature(
      body,
      PAYTM_MERCHANT_KEY,
      body.CHECKSUMHASH
    );

    if (!isValidChecksum) {
      return res.status(400).json({ error: 'Invalid checksum' });
    }

    const {
      ORDERID: orderId,
      TXNID: txnId,
      TXNAMOUNT: txnAmount,
      STATUS: status,
      RESPCODE: respCode,
      RESPMSG: respMsg,
      TXNDATE: txnDate,
      GATEWAYNAME: gatewayName,
      BANKTXNID: bankTxnId,
      BANKNAME: bankName,
    } = body;

    // Here you would typically:
    // 1. Update your database with the payment status
    // 2. Send confirmation email to the user
    // 3. Trigger any post-payment actions

    // For now, we'll just log the payment details
    console.log('Payment callback received:', {
      orderId,
      txnId,
      txnAmount,
      status,
      respCode,
      respMsg,
      txnDate,
      gatewayName,
      bankTxnId,
      bankName,
    });

    // Redirect to success/failure page based on status
    if (status === 'TXN_SUCCESS') {
      return res.redirect(`/payment/success?order_id=${orderId}`);
    } else {
      return res.redirect(`/payment/failure?order_id=${orderId}&message=${encodeURIComponent(respMsg)}`);
    }
  } catch (error) {
    console.error('Error processing PayTM callback:', error);
    return res.redirect('/payment/failure?error=payment_processing_error');
  }
}
