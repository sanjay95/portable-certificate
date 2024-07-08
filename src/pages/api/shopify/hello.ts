import { use } from "next-api-middleware";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod'
import { allowedHttpMethods } from "../middlewares/allowed-http-methods";
import { errorHandler } from "../middlewares/error-handler";

import Shopify from 'shopify-api-node';
import { StartIssuanceInput, StartIssuanceInputClaimModeEnum } from "@affinidi-tdk/credential-issuance-client";
import { CredentialsClient } from "../clients/credentials-client";

type HandlerResponse = {
  message: string
  order?: any
  credentialOfferUri?: string;
  txCode?: string;
  error?: any
}

const shopifyOrderSchema = z
  .object({
    orderId: z.number(),
    holderDid: z.string().optional()
  })
  .strict()

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HandlerResponse>
) {

  if (req.method == "OPTIONS") {
    res.status(200).json({ message: "Welcome to API Routes!" });
    return;
  }

  const {
    orderId,
    holderDid
  } = shopifyOrderSchema.parse(req.body)
  try {
    const shopify = new Shopify({
      shopName: 'paramesh-affinidi',
      // apiKey: process.env.SHOPIFY_API_KEY!,
      // password: process.env.SHOPIFY_API_SECRET!,
      accessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
    });

    // const query = `{
    //   orders(first: 1, query: "name:'#1001'") {
    //     edges {
    //       node {
    //         id
    //       }
    //     }
    //   }
    // }`;

    // const orders = await shopify.graphql(query);

    // const orders = await shopify.order.list({ limit: 5 });

    const order = await shopify.order.get(orderId);
    // res.status(200).json({ message: 'Hello from Next.js!', order })

    const orderCrendentialData = {
      "orderNumber": order.order_number.toString(),
      "merchant": {
        "name": process.env.SHOPIFY_APP_NAME
      },
      "orderedItem": order.line_items.map(item => {
        return {
          "productID": item.product_id?.toString(),
          "name": item.name,
          "description": item.title,
          "offers": {
            "priceCurrency": item.price_set.shop_money.currency_code,
            "price": item.price,
            "itemCondition": "NewCondition",
            "availability": "InStock",
            "seller": {
              "name": item.vendor
            }
          }
        }
      }),
      "customer": {
        "name": `${order.customer?.first_name} ${order.customer?.last_name}`,
        "email": order.customer?.email,
      },
      "paymentMethod": {
        "name": order.payment_gateway_names.join(',')
      },
      "paymentMethodId": "visa",
      "orderDate": order.created_at.split("T")[0],
      "discount": order.total_discounts,
      "discountCurrency": order.currency,
      "isGift": false,
      "orderStatus": order.financial_status,
      "orderDelivery": {
        "deliveryAddress": {
          "streetAddress": order.shipping_address.address1,
          "addressLocality": order.shipping_address.city,
          "addressRegion": order.shipping_address.province,
          "postalCode": order.shipping_address.zip,
          "addressCountry": order.shipping_address.country_name
        },
        "expectedArrivalFrom": "2018-07-22",
        "expectedArrivalUntil": "2018-07-22"
      }
    };
    const apiData: StartIssuanceInput = {
      claimMode: StartIssuanceInputClaimModeEnum.TxCode,
      holderDid: order.customer?.tags || holderDid,
      data: [
        {
          credentialTypeId: "AnyOnlineOrderType",
          credentialData: orderCrendentialData,
        },
      ],
    }

    const issuanceResult = await CredentialsClient.IssuanceStart(apiData);

    console.log('issuanceResult post backend call', issuanceResult)

    res.status(200).json({
      message: 'ok',
      credentialOfferUri: issuanceResult.credentialOfferUri, txCode: issuanceResult.txCode
    })
  } catch (error: any) {
    res.status(400).json(
      { message: 'Error', error: error.response?.data ?? error }
    )
    throw error
  }
}

export default use(allowedHttpMethods("POST", "OPTIONS"), errorHandler)(handler);
