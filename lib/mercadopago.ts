import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

import { env } from "@/lib/env";

const client = new MercadoPagoConfig({
  accessToken: env.MERCADOPAGO_ACCESS_TOKEN,
});

export const mpPreferenceClient = new Preference(client);
export const mpPaymentClient = new Payment(client);
