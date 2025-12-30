import { useState } from 'react'
import Hero from './components/Hero'
import Features from './components/Features'
import WaitlistForm from './components/WaitlistForm'
import Footer from './components/Footer'

function App() {
  const [waitlistStatus, setWaitlistStatus] = useState(null)

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <WaitlistForm onStatusChange={setWaitlistStatus} />
      <Footer />
    </div>
  )
}

export default App


