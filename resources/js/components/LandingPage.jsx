import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Users, BookOpen, Calendar, BarChart3, Shield, Award, Globe, ArrowRight, Menu, X, Star, GraduationCap, Play, CheckCircle, Building, Target, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const InstitutionLandingPage = () => {
    const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    document.querySelectorAll('[id]').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive student enrollment, attendance tracking, and academic progress monitoring with detailed reporting capabilities.",
      color: "blue",
      roles: ["Admin", "Staff", "Manager"]
    },
    {
      icon: BookOpen,
      title: "Academic Planning",
      description: "Streamlined curriculum management, course scheduling, and resource allocation with integrated calendar system.",
      color: "green",
      roles: ["Admin", "Staff", "Manager"]
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Organize academic events, examinations, and institutional activities with automated notifications and reminders.",
      color: "purple",
      roles: ["Admin", "Staff", "HR", "Manager"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Generate detailed insights on student performance, institutional metrics, and administrative efficiency.",
      color: "orange",
      roles: ["Admin", "Manager"]
    }
  ];

  const userRoles = [
    {
      icon: Shield,
      title: "Admin Dashboard",
      description: "Complete system control with user management, system configuration, and comprehensive reporting access.",
      color: "red",
      features: ["Full System Access", "User Management", "System Configuration", "All Reports"]
    },
    {
      icon: Users,
      title: "Staff Portal",
      description: "Academic staff interface for student management, course delivery, and academic progress tracking.",
      color: "blue",
      features: ["Student Management", "Course Management", "Attendance Tracking", "Grade Management"]
    },
    {
      icon: Building,
      title: "HR Management",
      description: "Human resources tools for employee management, recruitment, and staff administration.",
      color: "green",
      features: ["Employee Records", "Recruitment", "Leave Management", "Performance Reviews"]
    },
    {
      icon: Target,
      title: "Manager Access",
      description: "Supervisory dashboard with analytics, reporting, and department management capabilities.",
      color: "purple",
      features: ["Department Analytics", "Staff Supervision", "Budget Management", "Strategic Reports"]
    },
    {
      icon: GraduationCap,
      title: "Student Portal",
      description: "Student-centered interface for course access, grades, schedules, and institutional resources.",
      color: "orange",
      features: ["Course Access", "Grade Viewing", "Schedule Management", "Resource Library"]
    }
  ];

  const stats = [
    { number: "25,000+", label: "Students Managed", icon: Users },
    { number: "500+", label: "Educational Institutions", icon: Building },
    { number: "99.9%", label: "System Uptime", icon: Shield },
    { number: "24/7", label: "Customer Support", icon: Target }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Principal",
      company: "Greenfield Academy",
      content: "EduManage has transformed our administrative processes. The system is intuitive and has significantly improved our operational efficiency.",
      rating: 5
    },
    {
      name: "Prof. Michael Chen",
      role: "Dean of Academics",
      company: "Metropolitan University",
      content: "Outstanding platform for managing our diverse academic programs. The reporting features provide valuable insights for decision-making.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Director of Operations",
      company: "Innovation Institute",
      content: "The comprehensive nature of EduManage allows us to manage everything from enrollment to graduation seamlessly.",
      rating: 5
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 border-blue-200 text-blue-800',
      green: 'bg-green-100 border-green-200 text-green-800',
      purple: 'bg-purple-100 border-purple-200 text-purple-800',
      orange: 'bg-orange-100 border-orange-200 text-orange-800'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg border-b border-gray-200' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">EduManage</span>
                <span className="text-xs text-blue-600 font-medium">Institution Management</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {['Features', 'Solutions', 'Pricing', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* Login Button */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {['Features', 'Solutions', 'Pricing', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-8 shadow-sm border border-gray-200">
              <Award className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-gray-700 text-sm font-medium">Trusted by 500+ Educational Institutions</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Streamline Your
              <span className="text-blue-600 block">Institution Management</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive management solution designed specifically for educational institutions. 
              Manage students, faculty, courses, and operations all in one integrated platform.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              
              <button className="flex items-center space-x-3 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Dashboard Preview */}
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-12 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Institution Dashboard</h3>
                    <p className="text-gray-600 mb-6">Real-time insights and comprehensive management tools</p>
                    <div className="flex justify-center space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-12 h-2 bg-blue-600 rounded-full opacity-70"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-6">
              <Lightbulb className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800 text-sm font-medium">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="text-blue-600 block">Manage Your Institution</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for educational institutions of all sizes
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className={`inline-flex p-4 rounded-2xl mb-6 ${getColorClasses(feature.color)}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 cursor-pointer">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Educational Leaders
              <span className="text-blue-600 block">Are Saying</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from institutions that have transformed their operations with EduManage
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-blue-600 text-sm font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block">Institution Management?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of educational institutions that have streamlined their operations with EduManage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <div className="flex items-center space-x-2 text-blue-100">
              <CheckCircle className="w-5 h-5" />
              <span>30-day free trial • No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EduManage</span>
            </div>
            <p className="text-gray-400 mb-6">
              © 2025 EduManage. Empowering educational institutions worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Support', 'Contact', 'Documentation'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InstitutionLandingPage;