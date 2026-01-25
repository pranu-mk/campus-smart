import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const services = [
  {
    id: 'hostel-complaints',
    title: 'Hostel Complaints',
    description: 'Submit and track hostel-related issues efficiently',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'from-blue-500 to-cyan-500',
    fullDescription: 'Our Hostel Complaints system provides a streamlined way for students to report and track issues related to hostel facilities. From maintenance requests to room allocation concerns, every complaint is logged, assigned, and resolved systematically.',
    features: [
      'Submit complaints 24/7 from any device',
      'Real-time status tracking with notifications',
      'Priority-based resolution system',
      'Direct communication with hostel wardens',
      'Historical complaint records for reference',
      'Anonymous feedback option available'
    ],
    process: [
      { step: 1, title: 'Submit Complaint', desc: 'Fill out the complaint form with details and supporting images if needed' },
      { step: 2, title: 'Auto Assignment', desc: 'System automatically assigns to relevant hostel authority' },
      { step: 3, title: 'Track Progress', desc: 'Monitor resolution status through your dashboard' },
      { step: 4, title: 'Resolution', desc: 'Receive notification upon complaint resolution' }
    ]
  },
  {
    id: 'student-helpdesk',
    title: 'Student Helpdesk',
    description: 'Get quick support for all your queries',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: 'from-purple-500 to-pink-500',
    fullDescription: 'The Student Helpdesk serves as your central point of contact for all academic and administrative queries. Our dedicated team ensures prompt responses and effective solutions to help you navigate your campus journey smoothly.',
    features: [
      'Multi-channel support (chat, email, phone)',
      'Knowledge base with FAQs and guides',
      'Ticket-based query management',
      'Average response time under 2 hours',
      'Escalation system for urgent matters',
      'Feedback collection for service improvement'
    ],
    process: [
      { step: 1, title: 'Raise Query', desc: 'Submit your question through any available channel' },
      { step: 2, title: 'Ticket Created', desc: 'Receive a unique ticket ID for tracking' },
      { step: 3, title: 'Expert Response', desc: 'Get assistance from trained helpdesk staff' },
      { step: 4, title: 'Resolution & Feedback', desc: 'Query resolved with optional feedback' }
    ]
  },
  {
    id: 'student-clubs',
    title: 'Student Clubs',
    description: 'Explore and join various campus clubs',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-500',
    fullDescription: 'Discover a vibrant community of student-led clubs covering diverse interests from technology and arts to sports and social service. Join clubs that match your passions, develop leadership skills, and create lasting memories.',
    features: [
      'Browse 50+ active student clubs',
      'Easy online membership registration',
      'Event calendars for each club',
      'Inter-club collaboration opportunities',
      'Achievement badges and recognition',
      'Club formation support for new ideas'
    ],
    process: [
      { step: 1, title: 'Explore Clubs', desc: 'Browse through various club categories and descriptions' },
      { step: 2, title: 'Join Club', desc: 'Submit membership request to clubs of interest' },
      { step: 3, title: 'Participate', desc: 'Attend events, meetings, and activities' },
      { step: 4, title: 'Grow & Lead', desc: 'Take on responsibilities and leadership roles' }
    ]
  },
  {
    id: 'digital-notices',
    title: 'Digital Notices',
    description: 'Stay updated with all campus announcements',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    color: 'from-yellow-500 to-orange-500',
    fullDescription: 'Never miss an important announcement with our Digital Notices system. From exam schedules to event updates, all official communications are delivered directly to your dashboard with smart filtering and priority notifications.',
    features: [
      'Real-time push notifications',
      'Category-wise filtering (Academic, Events, Admin)',
      'Bookmark important notices',
      'Search through notice archives',
      'Department-specific announcements',
      'SMS alerts for critical notices'
    ],
    process: [
      { step: 1, title: 'Notice Published', desc: 'Administration posts official announcement' },
      { step: 2, title: 'Smart Delivery', desc: 'Notice reaches relevant students/faculty' },
      { step: 3, title: 'Notification', desc: 'Receive alert via app, email, or SMS' },
      { step: 4, title: 'Acknowledge', desc: 'Mark as read and take necessary action' }
    ]
  },
  {
    id: 'campus-events',
    title: 'Campus Events',
    description: 'Discover and participate in campus activities',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-red-500 to-rose-500',
    fullDescription: 'Experience the vibrant campus life through our comprehensive events platform. From cultural festivals and tech fests to workshops and guest lectures, discover events that enrich your college experience and build your network.',
    features: [
      'Interactive event calendar',
      'One-click event registration',
      'Personalized event recommendations',
      'Reminder notifications',
      'Post-event photo galleries',
      'Certificate generation for participants'
    ],
    process: [
      { step: 1, title: 'Discover Events', desc: 'Browse upcoming events by category or date' },
      { step: 2, title: 'Register', desc: 'Sign up for events with a single click' },
      { step: 3, title: 'Attend', desc: 'Participate and engage in campus activities' },
      { step: 4, title: 'Certificate', desc: 'Receive participation certificates digitally' }
    ]
  },
  {
    id: 'placements',
    title: 'Placements',
    description: 'Career opportunities and placement updates',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-indigo-500 to-violet-500',
    fullDescription: 'Your gateway to career success. Access placement drives, internship opportunities, and career resources all in one place. Stay ahead with company profiles, interview preparation materials, and real-time placement statistics.',
    features: [
      'Company-wise placement schedules',
      'Resume builder and portfolio tools',
      'Mock interview scheduling',
      'Placement statistics and analytics',
      'Alumni networking platform',
      'Job alerts based on profile'
    ],
    process: [
      { step: 1, title: 'Profile Setup', desc: 'Complete your placement profile with skills and preferences' },
      { step: 2, title: 'Apply', desc: 'Register for placement drives matching your criteria' },
      { step: 3, title: 'Prepare', desc: 'Access company-specific preparation resources' },
      { step: 4, title: 'Get Placed', desc: 'Attend interviews and secure your dream job' }
    ]
  },
  {
    id: 'scholarships',
    title: 'Scholarships',
    description: 'Financial aid and scholarship opportunities',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-teal-500 to-cyan-500',
    fullDescription: 'Explore various scholarship opportunities to support your education. From merit-based awards to need-based assistance, find financial aid options that help you focus on your academic goals without financial stress.',
    features: [
      'Comprehensive scholarship database',
      'Eligibility checker tool',
      'Online application submission',
      'Document upload and verification',
      'Application status tracking',
      'Renewal reminders for ongoing scholarships'
    ],
    process: [
      { step: 1, title: 'Check Eligibility', desc: 'Use our tool to find scholarships you qualify for' },
      { step: 2, title: 'Gather Documents', desc: 'Prepare required documents for application' },
      { step: 3, title: 'Apply Online', desc: 'Submit application through the portal' },
      { step: 4, title: 'Track & Receive', desc: 'Monitor status and receive disbursement' }
    ]
  },
];

// Service Detail Component
function ServiceDetail({ service, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
      >
        <motion.span
          animate={{ x: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ←
        </motion.span>
        <span className="font-medium">Back to All Services</span>
      </button>

      {/* Service Header */}
      <div className="glass-card p-8 md:p-12 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white flex-shrink-0`}>
            {service.icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{service.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{service.fullDescription}</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {service.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-5 flex items-start gap-3"
            >
              <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-sm flex-shrink-0`}>
                ✓
              </span>
              <span className="text-foreground">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Process Steps */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.process.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 }}
              className="glass-card p-6 text-center relative"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-xl font-bold mx-auto mb-4`}>
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              {index < service.process.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-muted-foreground/30 text-2xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-8 text-center"
      >
        <h3 className="text-xl font-semibold mb-3">Ready to get started?</h3>
        <p className="text-muted-foreground mb-6">Login to access {service.title} and other campus services</p>
        <Link to="/login" className="btn-primary inline-block px-8 py-3">
          Login to Access
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const selectedService = serviceId ? services.find(s => s.id === serviceId) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Navbar />
      
      <main className="pt-24 pb-16">
        {selectedService ? (
          // Service Detail View
          <section className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <ServiceDetail service={selectedService} onBack={() => navigate('/services')} />
            </div>
          </section>
        ) : (
          // Services List View
          <>
            {/* Hero Section */}
            <section className="py-16 px-4">
              <div className="max-w-6xl mx-auto text-center">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                >
                  All Services
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
                >
                  Explore Campus <span className="text-gradient">Services</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                >
                  Everything you need to navigate campus life, all in one place
                </motion.p>
              </div>
            </section>

            {/* Services Grid */}
            <section className="py-12 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map((service, index) => (
                    <Link key={service.id} to={`/services/${service.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                        className="glass-card p-8 h-full cursor-pointer group"
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          {service.icon}
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-3">{service.title}</h3>
                        <p className="text-muted-foreground">{service.description}</p>
                        <div className="mt-4 flex items-center text-primary font-medium">
                          Learn more
                          <motion.span
                            className="ml-2"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
      <BackToTop />
    </motion.div>
  );
}
