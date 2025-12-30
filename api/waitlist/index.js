const { TableClient } = require('@azure/data-tables')

module.exports = async function (context, req) {
  context.log('Waitlist function processed a request.')

  const email = req.body?.email

  // Validate email
  if (!email || typeof email !== 'string') {
    context.res = {
      status: 400,
      body: { error: 'Email is required' },
      headers: {
        'Content-Type': 'application/json',
      },
    }
    return
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim().toLowerCase())) {
    context.res = {
      status: 400,
      body: { error: 'Invalid email format' },
      headers: {
        'Content-Type': 'application/json',
      },
    }
    return
  }

  const normalizedEmail = email.trim().toLowerCase()
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING

  if (!connectionString) {
    context.log.error('AZURE_STORAGE_CONNECTION_STRING is not configured')
    context.res = {
      status: 500,
      body: { error: 'Server configuration error' },
      headers: {
        'Content-Type': 'application/json',
      },
    }
    return
  }

  try {
    const tableClient = TableClient.fromConnectionString(
      connectionString,
      'waitlist'
    )

    // Ensure table exists (ignore error if table already exists)
    try {
      await tableClient.createTable()
    } catch (createError) {
      // Table already exists (409) or other error - ignore if it's a conflict
      if (createError.statusCode !== 409) {
        throw createError
      }
    }

    // Check for duplicate email
    const partitionKey = 'emails'
    const rowKey = normalizedEmail.replace(/[@.]/g, '_')

    try {
      const existingEntity = await tableClient.getEntity(partitionKey, rowKey)
      if (existingEntity) {
        context.res = {
          status: 409,
          body: { error: 'Email already registered' },
          headers: {
            'Content-Type': 'application/json',
          },
        }
        return
      }
    } catch (error) {
      // Entity doesn't exist, which is fine - we'll create it
      if (error.statusCode !== 404) {
        throw error
      }
    }

    // Create new entity
    const entity = {
      partitionKey: partitionKey,
      rowKey: rowKey,
      email: normalizedEmail,
      timestamp: new Date().toISOString(),
    }

    await tableClient.createEntity(entity)

    context.res = {
      status: 200,
      body: { message: 'Successfully added to waitlist', email: normalizedEmail },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  } catch (error) {
    context.log.error('Error processing waitlist request:', error)

    // Check if it's a duplicate error (409)
    if (error.statusCode === 409) {
      context.res = {
        status: 409,
        body: { error: 'Email already registered' },
        headers: {
          'Content-Type': 'application/json',
        },
      }
      return
    }

    context.res = {
      status: 500,
      body: { error: 'Failed to process request' },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }
}


