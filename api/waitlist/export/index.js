const { TableClient } = require('@azure/data-tables')

module.exports = async function (context, req) {
  context.log('Waitlist export function processed a request.')

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING

  if (!connectionString) {
    context.log.error('AZURE_STORAGE_CONNECTION_STRING is not configured')
    context.res = {
      status: 500,
      body: 'Server configuration error',
      headers: {
        'Content-Type': 'text/plain',
      },
    }
    return
  }

  try {
    const tableClient = TableClient.fromConnectionString(
      connectionString,
      'waitlist'
    )

    // List all entities
    const entities = []
    const partitionKey = 'emails'

    try {
      const iterator = tableClient.listEntities({
        queryOptions: {
          filter: `PartitionKey eq '${partitionKey}'`,
        },
      })

      for await (const entity of iterator) {
        entities.push({
          email: entity.email,
          timestamp: entity.timestamp,
        })
      }
    } catch (error) {
      // Table might not exist yet
      if (error.statusCode === 404) {
        context.res = {
          status: 200,
          body: 'email,timestamp\n',
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="waitlist.csv"',
          },
        }
        return
      }
      throw error
    }

    // Sort by timestamp (newest first)
    entities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    // Generate CSV
    const csvHeader = 'email,timestamp\n'
    const csvRows = entities
      .map((entity) => {
        const email = entity.email || ''
        const timestamp = entity.timestamp || ''
        return `"${email}","${timestamp}"`
      })
      .join('\n')

    const csv = csvHeader + csvRows

    context.res = {
      status: 200,
      body: csv,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="waitlist.csv"',
      },
    }
  } catch (error) {
    context.log.error('Error exporting waitlist:', error)
    context.res = {
      status: 500,
      body: 'Failed to export waitlist',
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  }
}


