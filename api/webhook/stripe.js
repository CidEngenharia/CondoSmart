import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const config = {
    api: {
        bodyParser: false,
    },
};

const buffer = async (readable) => {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Stripe Event Received:', event.type);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const condominioId = session.client_reference_id;
                const planType = session.metadata.plan_type;
                const customerId = session.customer;
                const subscriptionId = session.subscription;

                const { error } = await supabase
                    .from('condominios')
                    .update({
                        status_assinatura: 'active',
                        plano_ativo: planType,
                        stripe_customer_id: customerId,
                        stripe_subscription_id: subscriptionId
                    })
                    .eq('id', condominioId);

                if (error) throw error;
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const { error } = await supabase
                    .from('condominios')
                    .update({
                        status_assinatura: 'inactive',
                        plano_ativo: null
                    })
                    .eq('stripe_subscription_id', subscription.id);

                if (error) throw error;
                break;
            }

            case 'invoice.payment_failed': {
                const session = event.data.object;
                const { error } = await supabase
                    .from('condominios')
                    .update({
                        status_assinatura: 'past_due'
                    })
                    .eq('stripe_customer_id', session.customer);

                if (error) throw error;
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return res.status(200).json({ received: true });
    } catch (err) {
        console.error('Database Update Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
