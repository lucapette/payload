import type { Payload } from '../../packages/payload/src/index.js'

import { getPayload } from '../../packages/payload/src/index.js'
import { startMemoryDB } from '../startMemoryDB.js'
import configPromise from './config.js'

let payload: Payload

describe('Stripe Plugin', () => {
  beforeAll(async () => {
    const config = await startMemoryDB(configPromise)
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy()
    }
  })

  it('should create products', async () => {
    const product = await payload.create({
      collection: 'products',
      data: {
        name: 'Test Product',
      },
    })

    expect(product).toHaveProperty('name', 'Test Product')
  })

  // Test various common API calls like `products.create`, etc.
  // Send the requests through the Payload->Stripe proxy
  // Query Stripe directly to ensure the data is as expected
  it.todo('should open REST API proxy')

  // Test various common webhook events like `product.created`, etc.
  // These could potentially be mocked
  it.todo('should handle incoming Stripe webhook events')

  // Test that the data is synced to Stripe automatically without the use of custom hooks/proxy
  // I.e. the `sync` config option
  it.todo('should auto-sync data based on config')
})
