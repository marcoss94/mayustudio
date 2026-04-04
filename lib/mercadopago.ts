import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

import { env } from "@/lib/env";

const client = new MercadoPagoConfig({
  accessToken: env.MERCADOPAGO_ACCESS_TOKEN,
});

export const mpPreference = new Preference(client);
export const mpPayment = new Payment(client);
