import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import './checkoutForm.css'
import {useEffect, useState} from 'react';
import {BounceLoader} from 'react-spinners'
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import useAuth from '../../hooks/useAuth.js';


export const CheckoutForm = ({totalPrice, closeModal, orderData}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const axiosSecure = useAxiosSecure()
    const [clientSecret, setClientSecret] = useState('')
    const { user } = useAuth();

    useEffect(() => {
        const getClientSecret = async () => {
            const {data} = await axiosSecure.post('/create-payment-intent', {
                quantity: orderData?.quantity,
                plantId: orderData?.plantId,
            })
            setClientSecret(data?.clientSecret)
        }

        getClientSecret()
    }, [axiosSecure, orderData]);


    const handleSubmit = async (event) => {
        setProcessing(true)
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
          // Stripe.js has not loaded yet. Make sure to disable
          // form submission until Stripe.js has loaded.
          return;
        }
    
        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);
    
        if (card == null) {
          return;
        }
    
        // Use your card Element with other Stripe.js APIs
        const {error, paymentMethod} = await stripe.createPaymentMethod({
          type: 'card',
          card,
        });
    
        if (error) {
          console.log('[error]', error);
          setCardError(error.message)
          setProcessing(false)
        } else {
          console.log('[PaymentMethod]', paymentMethod);
          setCardError(null)
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: {
                    name: user?.displayName,
                    email: user?.email
                },
            }
        })

        if (result?.error) {
            setCardError(result?.error?.message)
            return
        }
        if (result?.paymentIntent?.status === 'succeeded') {
            orderData.transactionId = result?.paymentIntent?.id
            try {
                await axiosSecure.post('/order', orderData)
                // console.log(data)

            }
            catch (e) {
                console.log(e)

            }
            finally {
                setProcessing(false)
                setCardError(null)
                closeModal()
            }
        }

    };
  return (
    <form onSubmit={handleSubmit}>
    <CardElement
      options={{
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
      }}
    />
     {cardError && <p className='text-red-500 mb-6'>{cardError}</p>}
    <div className='flex justify-between'>
    <button className='px-3 py-1 bg-green-400 rounded-2xl cursor-pointer' type="submit" disabled={!stripe || processing}>
      {
        processing ? (
            <BounceLoader size={24} className='mt-2'/>
        ) : (
            `Pay $${totalPrice}`
        )
      }
    </button>
    <button onClick={closeModal} className='px-3 py-1 bg-red-400 rounded-2xl cursor-pointer' type="button" >
      Cancel
    </button>
    </div>
  </form>
  )
}