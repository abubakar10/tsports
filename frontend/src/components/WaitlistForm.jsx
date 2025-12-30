import { useState } from 'react'

export default function WaitlistForm({ onStatusChange }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(null) // 'success', 'error', or null
  const [message, setMessage] = useState('')

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setStatus(null)
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you! You\'ve been added to the waitlist.')
        setEmail('')
        if (onStatusChange) {
          onStatusChange('success')
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
        if (onStatusChange) {
          onStatusChange('error')
        }
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please check your connection and try again.')
      if (onStatusChange) {
        onStatusChange('error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="waitlist" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join the Waitlist
            </h2>
            <p className="text-xl text-gray-600">
              Be among the first to experience the future of sports trading
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
            {status && (
              <div
                className={`p-4 rounded-lg ${
                  status === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}


