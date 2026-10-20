import { INestApplication } from '@nestjs/common';
import { API, bearer, http } from './auth';

let counter = 0;
const next = () => ++counter;

export const SHIPPING_ADDRESS = {
  addressLine: '221B Baker Street',
  city: 'London',
  county: 'Greater London',
  postcode: 'NW1 6XE',
};

export async function createCategory(
  app: INestApplication,
  adminToken: string,
  body: { name?: string; parentId?: string; isActive?: boolean } = {},
): Promise<{ id: string; slug: string }> {
  const res = await http(app)
    .post(`${API}/admin/categories`)
    .set(bearer(adminToken))
    .send({ name: body.name ?? `Category ${next()}`, ...body })
    .expect(201);
  return res.body as { id: string; slug: string };
}

export interface ISeededProduct {
  productId: string;
  inventoryId: string;
  categoryId: string;
}

/** Parent → leaf category → product → inventory, sab asal admin API se */
export async function seedProduct(
  app: INestApplication,
  adminToken: string,
  options: {
    name?: string;
    price?: number;
    qty?: number;
    min?: number;
    max?: number;
    lowStockThreshold?: number;
  } = {},
): Promise<ISeededProduct> {
  const parent = await createCategory(app, adminToken);
  const leaf = await createCategory(app, adminToken, { parentId: parent.id });

  const product = await http(app)
    .post(`${API}/admin/products`)
    .set(bearer(adminToken))
    .send({
      name: options.name ?? `Product ${next()}`,
      categoryId: leaf.id,
      price: options.price ?? 2.5,
      minimumOrderQuantity: options.min ?? 1,
      maximumOrderQuantity: options.max ?? 10,
    })
    .expect(201);
  const productId = (product.body as { id: string }).id;

  const inventory = await http(app)
    .post(`${API}/admin/inventory`)
    .set(bearer(adminToken))
    .send({
      productId,
      qtyOnHand: options.qty ?? 20,
      ...(options.lowStockThreshold !== undefined && {
        lowStockThreshold: options.lowStockThreshold,
      }),
    })
    .expect(201);

  return {
    productId,
    inventoryId: (inventory.body as { id: string }).id,
    categoryId: leaf.id,
  };
}

export function addToCart(
  app: INestApplication,
  token: string,
  productId: string,
  quantity: number,
) {
  return http(app)
    .post(`${API}/cart/items`)
    .set(bearer(token))
    .send({ productId, quantity });
}

export function placeOrder(
  app: INestApplication,
  token: string,
  body: Record<string, unknown> = {
    deliveryType: 'DELIVERY',
    shippingAddress: SHIPPING_ADDRESS,
  },
) {
  return http(app).post(`${API}/orders`).set(bearer(token)).send(body);
}
