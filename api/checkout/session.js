import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { planType, condominioId, successUrl, cancelUrl } = req.body;

    if (!planType || !condominioId) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Map plan types to Stripe Price IDs (User should replace these with real IDs from Stripe Dashboard)
    const PRICE_MAP = {
        'essential': process.env.STRIPE_PRICE_ESSENTIAL,
        'professional': process.env.STRIPE_PRICE_PROFESSIONAL,
        'premium_ai': process.env.STRIPE_PRICE_PREMIUM_AI
    };

    const priceId = PRICE_MAP[planType];

    if (!priceId) {
        return res.status(400).json({ error: 'Invalid plan type or price not configured' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            client_reference_id: condominioId,
            metadata: {
                condominio_id: condominioId,
                plan_type: planType
            }
        });

        return res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Stripe Session Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
