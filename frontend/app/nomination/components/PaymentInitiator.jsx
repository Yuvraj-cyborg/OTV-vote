import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { loadRazorpay } from '@/lib/razorpay-loader';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function PaymentInitiator({ onSuccess, formData, setIsSubmitting }) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'loading', 'creating-order', 'processing', 'success', 'error'

  // Reset payment processing state if component unmounts
  useEffect(() => {
    return () => {
      if (isProcessing) {
        setIsSubmitting(false);
      }
    };
  }, [isProcessing, setIsSubmitting]);

  const handlePayment = async () => {
    try {
      // Update states to show loading
      setIsProcessing(true);
      setPaymentStatus('loading');
      
      // Load Razorpay script
      setPaymentStatus('loading-razorpay');
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        throw new Error('Failed to load payment gateway. Please check your internet connection or try a different browser.');
      }

      // Create order on the server
      setPaymentStatus('creating-order');
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 29900, // ₹299 in paise
        }),
        credentials: 'include', // Include cookies for auth
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();
      if (!orderData || !orderData.id) {
        throw new Error('Invalid order data received from server');
      }
      
      // Configure payment options
      setPaymentStatus('processing');
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'PMCAA Awards',
        description: 'Nomination Fee',
        image: '/logo.png', // Add your logo URL
        handler: function(response) {
          if (!response.razorpay_payment_id) {
            throw new Error('Payment failed: No payment ID received');
          }
          
          // Payment successful
          setPaymentStatus('success');
          
          const paymentData = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          };
          
          // First, ensure the payment is recorded in the database
          try {
            const recordResponse = await fetch('/api/payments/record', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paymentId: paymentData.paymentId,
                orderId: paymentData.orderId,
                nomineeEmail: formData.get('nomineeEmail') || '',
                amount: orderData.amount,
                currency: orderData.currency
              }),
              credentials: 'include',
            });
            
            if (!recordResponse.ok) {
              console.warn('Payment recorded in Razorpay but failed to record in our database. Continuing anyway.');
            } else {
              console.log('Payment successfully recorded in database');
            }
          } catch (recordError) {
            console.error('Error recording payment:', recordError);
            // Continue anyway as payment is verified by Razorpay
          }
          
          // Add payment details to form data and proceed with submission
          const updatedFormData = new FormData();
          
          // Copy all existing form data
          for (const [key, value] of formData.entries()) {
            updatedFormData.append(key, value);
          }
          
          // Add payment details
          updatedFormData.append('paymentId', paymentData.paymentId);
          updatedFormData.append('orderId', paymentData.orderId);
          updatedFormData.append('signature', paymentData.signature);
          
          // Call the success handler with the updated form data
          onSuccess(updatedFormData);
        },
        prefill: {
          name: formData.get('nomineeName') || '',
          email: formData.get('nomineeEmail') || '',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setIsSubmitting(false);
            setPaymentStatus('idle');
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process. Your nomination has not been submitted."
            });
          },
        },
        notes: {
          type: 'nomination_fee',
          nomineeId: formData.get('nomineeId') || '',
        },
        theme: {
          color: '#3B82F6',
        },
        retry: {
          enabled: true,
          max_count: 3,
        }
      };

      // Initialize payment
      const paymentObject = new Razorpay(options);
      
      // Handle payment failure
      paymentObject.on('payment.failed', function(response) {
        setIsProcessing(false);
        setIsSubmitting(false);
        setPaymentStatus('error');
        
        const errorMessage = response.error && response.error.description 
          ? response.error.description 
          : "Your payment has failed. Please try again.";
          
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: errorMessage
        });
      });
      
      // Open Razorpay payment dialog
      paymentObject.open();
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      setIsProcessing(false);
      setIsSubmitting(false);
      setPaymentStatus('error');
      
      // Determine the most user-friendly error message
      let errorMessage = "Failed to process payment. Please try again.";
      
      if (error.message.includes('network')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message.includes('load')) {
        errorMessage = "Failed to load payment gateway. Please try using a different browser.";
      } else if (error.message.includes('order')) {
        errorMessage = "Unable to create payment order. Please try again in a few minutes.";
      } else if (error.message.includes('auth') || error.message.includes('login')) {
        errorMessage = "Authentication error. Please login again before proceeding.";
      }
      
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: errorMessage
      });
    }
  };

  // Helper function to get the button text based on current status
  const getButtonText = () => {
    switch (paymentStatus) {
      case 'loading':
      case 'loading-razorpay':
        return 'Loading Payment Gateway...';
      case 'creating-order':
        return 'Creating Order...';
      case 'processing':
        return 'Processing Payment...';
      default:
        return 'Pay ₹299 & Submit';
    }
  };

  return (
    <Button 
      type="button" 
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {getButtonText()}
        </>
      ) : (
        'Pay ₹299 & Submit'
      )}
    </Button>
  );
} 