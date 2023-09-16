"use client";

import CheckoutForm from "@/components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PaymentPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    const makeRequest = async () => {
      const res = await fetch(`http://localhost:3000/api/create-intent/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    };
    makeRequest();
  }, [id]);


  const options :StripeElementsOptions = {
    clientSecret,
    appearance : {
      theme: 'stripe',
    },
  };
  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;
