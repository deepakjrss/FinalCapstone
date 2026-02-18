import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ModernButton, ModernCard, ModernGrid } from '../components/ModernComponents';
import { modernDesignSystem } from '../theme/modernDesignSystem';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        navigate('/student-dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen pt-16 flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-20">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              🌍 Welcome to EcoVerse
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Grow the Future,
            <br />
            <span className="text-green-600">One Tree at a Time</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your classroom into a thriving digital forest. Watch your students' contributions bloom in real-time while learning environmental values.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <ModernButton
              variant="primary"
              onClick={() => navigate('/register')}
              className="text-lg px-8 py-4"
            >
              Start Growing 🌱
            </ModernButton>
            <ModernButton
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-4"
            >
              Enter as Teacher
            </ModernButton>
          </div>

          {/* Feature Preview */}
          <div className="mt-16">
            <p className="text-gray-600 text-sm font-semibold mb-6">Trusted by educators and students</p>
            <div className="flex justify-center gap-8 text-gray-700 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span>Gamified Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                <span>Community Impact</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 z-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Why Choose EcoVerse?
          </h2>

          <ModernGrid columns={3} responsive>
            {[
              {
                icon: '🎓',
                title: 'For Teachers',
                description: 'Manage classes, track student progress, and inspire environmental awareness with gamified learning',
              },
              {
                icon: '👨‍💻',
                title: 'For Students',
                description: 'Earn eco-scores, unlock achievements, and contribute to your virtual forest while learning values',
              },
              {
                icon: '🔐',
                title: 'Secure & Scalable',
                description: 'Built with enterprise-grade security to protect student data and support growing classrooms',
              },
            ].map((feature, idx) => (
              <ModernCard key={idx} interactive>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </ModernCard>
            ))}
          </ModernGrid>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '1', title: 'Sign Up', description: 'Create your account as a teacher or student' },
              { number: '2', title: 'Join Class', description: 'Form or join a classroom community' },
              { number: '3', title: 'Play Games', description: 'Complete eco-education challenges' },
              { number: '4', title: 'Grow Forest', description: 'Watch your digital forest thrive' },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold text-green-700 mb-4 mx-auto">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center text-sm">{step.description}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gray-300 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guardian Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Meet Your Forest Guardian 🌿
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Avatar Section */}
            <div className="flex justify-center">
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 flex items-center justify-center text-8xl transform hover:scale-105 transition-transform">
                🦌
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-6">
              {[
                { icon: '📊', title: 'Real-Time Analytics', desc: 'Track student engagement and eco-score progress' },
                { icon: '🎯', title: 'Smart Achievements', desc: 'Automatically award badges at eco-score milestones' },
                { icon: '🌍', title: 'Community Impact', desc: 'Collaborate and create a global digital forest' },
              ].map((feature, idx) => (
                <ModernCard key={idx}>
                  <div className="flex gap-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                </ModernCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-green-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Classroom?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join thousands of educators and students building a greener future together
          </p>
          <ModernButton
            variant="ghost"
            onClick={() => navigate('/register')}
            className="text-green-600 bg-white hover:bg-gray-50 text-lg px-8 py-4"
          >
            Get Started Free Today 🚀
          </ModernButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="mb-2">
            © 2026 EcoVerse. Making education greener, one classroom at a time.
          </p>
          <p className="text-sm">
            Built for educators who care about the future 🌍
          </p>
        </div>
      </footer>
    </div>
  );
}
