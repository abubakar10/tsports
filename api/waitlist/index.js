const { TableClient } = require('@azure/data-tables')

module.exports = async function (context, req) {
  context.log('Waitlist function processed a request.')
  context.log('Request body:', JSON.stringify(req.body))
  context.log('Request method:', req.method)

  const email = req.body?.email

  // Validate email
  if (!email || typeof email !== 'string') {
    context.res = {
      status: 400,
      body: { error: 'Email is required' },
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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
      context.log('Table created successfully')
    } catch (createError) {
      // Table already exists - this is fine, continue
      const statusCode = createError.statusCode || createError.code || (createError.response && createError.response.status)
      const errorMessage = createError.message || String(createError)
      
      if (statusCode === 409 || statusCode === 'TableAlreadyExists' || errorMessage.includes('already exists') || errorMessage.includes('Conflict')) {
        context.log('Table already exists, continuing...')
        // This is expected, continue
      } else {
        // Unexpected error, but don't fail - table might exist
        context.log.warn('Unexpected error creating table (will continue):', createError.message || createError)
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
      const statusCode = error.statusCode || error.code || (error.response && error.response.status)
      if (statusCode !== 404 && statusCode !== 'ResourceNotFound') {
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  } catch (error) {
    context.log.error('Error processing waitlist request:', error)
    context.log.error('Error details:', JSON.stringify({
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      name: error.name,
      stack: error.stack
    }))

    // Check if it's a duplicate error (409)
    const statusCode = error.statusCode || error.code || (error.response && error.response.status)
    if (statusCode === 409 || statusCode === 'EntityAlreadyExists') {
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
      body: { 
        error: 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  }
}


