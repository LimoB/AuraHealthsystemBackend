import { Request, Response } from 'express';
import { stripe } from './stripe';
import db from '../drizzle/db';
import { eq, sql } from 'drizzle-orm';
import { appointmentsTable, paymentsTable } from '../drizzle/schema';
import { randomUUID } from 'crypto';

// POST /api/payment/checkout
export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId, paymentMethod } = req.body;

    console.log('[Checkout] 🚀 Initiating payment...');
    console.log('[Checkout] Received:', { appointmentId, paymentMethod });

    if (!appointmentId || !paymentMethod) {
      console.warn('[Checkout] ❌ Missing appointmentId or paymentMethod');
      res.status(400).json({ error: 'Missing appointmentId or paymentMethod' });
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error('[Checkout] ❌ FRONTEND_URL missing in .env');
      res.status(500).json({ error: 'FRONTEND_URL is not set in environment' });
      return;
    }

    // ✅ Fetch appointment
    const [appointment] = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.appointmentId, appointmentId));

    if (!appointment) {
      console.warn(`[Checkout] ❌ Appointment with ID ${appointmentId} not found`);
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    console.log('[Checkout] ✅ Appointment found:', appointment);

    const amount = Number(appointment.totalAmount);
    if (!amount || amount <= 0) {
      console.warn('[Checkout] ❌ Invalid appointment amount:', appointment.totalAmount);
      res.status(400).json({ error: 'Invalid appointment amount' });
      return;
    }

    const doctorId = appointment.doctorId ?? 'Unknown';

    // ✅ CASH Payment
    if (paymentMethod === 'cash') {
      console.log('[Checkout] 💵 Cash payment selected. Confirming appointment...');

      await db
        .update(appointmentsTable)
        .set({
          appointmentStatus: 'confirmed',
          updatedAt: sql`now()`
        })
        .where(eq(appointmentsTable.appointmentId, appointmentId));

      console.log('[Checkout] ✅ Appointment confirmed for cash payment.');
      res.status(200).json({ message: 'Cash payment selected. Appointment confirmed.' });
      return;
    }

    // ✅ STRIPE Payment
    if (paymentMethod === 'stripe') {
      const transactionId = randomUUID();

      console.log('[Checkout] 💳 Stripe payment selected.');
      console.log(`[Checkout] 💰 Charging: $${amount.toFixed(2)} USD`);
      console.log(`[Checkout] 📦 Creating Stripe session for doctor ID ${doctorId}...`);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Appointment with Doctor ID: ${doctorId}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          appointmentId: appointmentId.toString(),
          transactionId,
        },
        success_url: `${frontendUrl}/patientdashboard/payment-success`,
        cancel_url: `${frontendUrl}/patientdashboard/payment-cancel`,
      });

      console.log('[Checkout] ✅ Stripe session created:', session.id);

      console.log('[Checkout] 💾 Recording initial pending payment in DB...');
      await db.insert(paymentsTable).values({
        appointmentId,
        totalAmount: amount.toFixed(2),
        transactionId,
        PaymentStatus: 'completed',
        paymentMethod: 'stripe',
      });
      console.log('[Checkout] ✅ Payment record inserted (status: pending).');

      console.log('[Checkout] 📌 Marking appointment as pending...');
      await db
        .update(appointmentsTable)
        .set({
          appointmentStatus: 'confirmed',
          updatedAt: sql`now()`
        })
        .where(eq(appointmentsTable.appointmentId, appointmentId));
      console.log('[Checkout] ✅ Appointment status set to pending.');

      console.log('[Checkout] 🔁 Redirecting user to Stripe session...');
      res.status(200).json({ url: session.url });
      return;
    }

    // ❌ Unsupported method
    console.warn('[Checkout] ❌ Unsupported payment method:', paymentMethod);
    res.status(400).json({ error: `Unsupported payment method: ${paymentMethod}` });
  } catch (error: any) {
    console.error('[Checkout] ❌ Unexpected error during checkout', {
      message: error.message,
      stack: error.stack,
      raw: error.raw,
    });

    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
