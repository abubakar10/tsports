export default function Features() {
  const features = [
    {
      title: 'AI-Powered Analytics',
      description: 'Leverage advanced machine learning algorithms to predict market trends and make informed trading decisions.',
      icon: '🤖',
    },
    {
      title: 'Real-Time Data',
      description: 'Get instant updates on player performance, team statistics, and market movements as they happen.',
      icon: '⚡',
    },
    {
      title: 'Secure Trading',
      description: 'Bank-level encryption and security protocols ensure your trades and data are always protected.',
      icon: '🔒',
    },
    {
      title: 'Mobile First',
      description: 'Trade on the go with our responsive design that works seamlessly on any device.',
      icon: '📱',
    },
    {
      title: 'Expert Insights',
      description: 'Access analysis from professional traders and sports analysts to guide your strategy.',
      icon: '💡',
    },
    {
      title: 'Community Driven',
      description: 'Connect with other traders, share strategies, and learn from the community.',
      icon: '👥',
    },
  ]

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to succeed in sports trading
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


