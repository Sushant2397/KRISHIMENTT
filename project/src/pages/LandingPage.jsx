import React, { useState } from 'react';
import {
  ArrowRight, Users, Tractor, TrendingUp, Shield, Clock, Award,
  CheckCircle, MapPin, Star, Leaf, ChevronDown, Menu, X,
  Briefcase, Zap, Globe, Phone, Mail
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ContactModal from '../components/Common/ContactModal';
import { useTranslation } from 'react-i18next';

const LandingPage = ({ onGetStarted }) => {
  const { t, i18n } = useTranslation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Simple icon fallback for ShoppingCart
  const ShoppingCart = TrendingUp; // reuse as visual

  const handleGetStarted = () => {
    if (onGetStarted) onGetStarted();
    else navigate('/login');
  };

  const features = [
    {
      icon: Users,
      title: t('features.connectTitle'),
      description: t('features.connectDesc'),
      color: 'bg-primary-light text-primary',
    },
    {
      icon: TrendingUp,
      title: t('features.marketTitle'),
      description: t('features.marketDesc'),
      color: 'bg-[#F1E8D8] text-[#315C63]',
    },
    {
      icon: Shield,
      title: t('features.schemesTitle'),
      description: t('features.schemesDesc'),
      color: 'bg-success-light text-success',
    },
    {
      icon: ShoppingCart,
      title: t('features.equipmentTitle'),
      description: t('features.equipmentDesc'),
      color: 'bg-info-light text-info',
    },
  ];

  const steps = [
    { step: '01', title: 'Create Your Profile',   desc: 'Sign up as a farmer or agricultural worker and complete your profile.' },
    { step: '02', title: 'Post or Discover',       desc: 'Farmers post job requirements; workers browse nearby opportunities.' },
    { step: '03', title: 'Smart Matching',         desc: 'AI-powered system connects the right workers to the right farms.' },
    { step: '04', title: 'Work & Get Paid',        desc: 'Complete the job, get rated, and build your agricultural reputation.' },
  ];

  const stats = [
    { number: '10,000+', label: t('stats.farmers') },
    { number: '25,000+', label: t('stats.workers') },
    { number: '500+',    label: t('stats.equipment') },
    { number: '98%',     label: t('stats.success') },
  ];

  const languages = ['English', 'हिंदी', 'मराठी'];

  return (
    <div className="min-h-screen bg-background">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">KrishiMent</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { label: t('Home'),     href: '#home'     },
                { label: t('Features'), href: '#features' },
                { label: t('How It Works'), href: '#how-it-works' },
                { label: t('About'),    href: '#about'    },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground
                             relative group transition-colors duration-150"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary rounded-full
                                   transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground
                           relative group transition-colors duration-150"
              >
                {t('Contact')}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary rounded-full
                                 transition-all duration-300 group-hover:w-full" />
              </button>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language selector */}
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background
                           text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Select language"
              >
                <option value="en">EN</option>
                <option value="hi">हि</option>
                <option value="mr">म</option>
              </select>
              <Link to="/login" className="btn-ghost text-sm h-9 px-4">
                {t('Login')}
              </Link>
              <button
                onClick={handleGetStarted}
                className="btn-primary text-sm h-9 px-5"
              >
                {t('Get Started')}
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg
                         text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-border mt-0 pt-3 animate-slide-down">
              <div className="flex flex-col gap-1">
                {['#home', '#features', '#how-it-works', '#about'].map((href, i) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm text-muted-foreground
                               hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {['Home', 'Features', 'How It Works', 'About'][i]}
                  </a>
                ))}
                <div className="flex gap-2 mt-2 px-3">
                  <Link to="/login" className="btn-ghost flex-1 justify-center text-sm h-9">
                    {t('Login')}
                  </Link>
                  <button
                    onClick={handleGetStarted}
                    className="btn-primary flex-1 justify-center text-sm h-9"
                  >
                    {t('Get Started')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="home" className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
        {/* Subtle warm background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full
                          bg-primary/6 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full
                          bg-[#F1E8D8]/60 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — copy */}
            <div className="animate-fade-in-up">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-primary-light text-primary
                              rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Leaf className="w-3.5 h-3.5" />
                {t('AI-Powered Agricultural Platform')}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6
                             leading-[1.1] tracking-tight">
                {t('The Right Hands')}
                <span className="block text-primary mt-1">{t('for Every Farm.')}</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                {t('KrishiMent connects farmers who need skilled agricultural labour with workers looking for meaningful farm work — with transparent wages, smart matching, and full traceability.')}
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={handleGetStarted}
                  className="btn-primary h-12 px-7 text-base gap-2.5 group"
                >
                  {t('Find Workers')}
                  <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <Link to="/login" className="btn-outline h-12 px-7 text-base gap-2.5 group">
                  {t('Find Farm Jobs')}
                  <Briefcase className="w-4.5 h-4.5" />
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: CheckCircle, text: t('Verified Profiles') },
                  { icon: MapPin,      text: t('Location-Based Matching') },
                  { icon: Globe,       text: t('Marathi & Hindi Support') },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual card group */}
            <div className="animate-fade-in-right animation-delay-200 relative">
              {/* Main illustration card */}
              <div className="relative bg-card rounded-2xl border border-border shadow-lg p-6">
                <div className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {t('Live Connections')}
                </div>

                {/* Worker cards preview */}
                {[
                  { name: 'Suresh Patil',   skill: 'Wheat Harvesting',  wage: '₹650/day', dist: '2.1 km', avail: true  },
                  { name: 'Meena Jadhav',   skill: 'Rice Transplanting', wage: '₹580/day', dist: '3.8 km', avail: true  },
                  { name: 'Ramesh Yadav',   skill: 'Irrigation Work',   wage: '₹700/day', dist: '5.0 km', avail: false },
                ].map((w, i) => (
                  <div
                    key={w.name}
                    className={`flex items-center justify-between p-3 rounded-xl mb-2 last:mb-0
                                border border-border bg-background/60
                                animate-fade-in-up`}
                    style={{ animationDelay: `${300 + i * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/15 text-primary
                                      flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{w.name}</div>
                        <div className="text-xs text-muted-foreground">{w.skill}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">{w.wage}</div>
                      <div className="text-xs text-muted-foreground">{w.dist}</div>
                    </div>
                    <div className={`ml-3 w-2 h-2 rounded-full flex-shrink-0 ${w.avail ? 'bg-success' : 'bg-muted-foreground'}`} />
                  </div>
                ))}

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                  {stats.slice(0, 3).map(s => (
                    <div key={s.label} className="text-center">
                      <div className="text-lg font-bold text-primary">{s.number}</div>
                      <div className="text-[11px] text-muted-foreground leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-[#F1E8D8] border border-border
                              rounded-2xl px-4 py-2 shadow-md animate-float">
                <div className="flex items-center gap-1.5 text-[#315C63]">
                  <Star className="w-4 h-4 fill-current text-warning" />
                  <span className="text-sm font-semibold">4.8 avg rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="py-10 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-1">
                  {stat.number}
                </div>
                <div className="text-primary-foreground/75 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="badge-teal mb-4 mx-auto w-fit">{t('Platform Features')}</div>
            <h2 className="section-title text-3xl sm:text-4xl mb-4">
              {t('featuresSection.title')}
            </h2>
            <p className="section-subtitle">{t('featuresSection.subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users,      title: t('features.connectTitle'),   desc: t('features.connectDesc'),   bg: 'bg-primary-light', ic: 'text-primary' },
              { icon: TrendingUp, title: t('features.marketTitle'),    desc: t('features.marketDesc'),    bg: 'bg-[#F1E8D8]',     ic: 'text-[#315C63]' },
              { icon: Shield,     title: t('features.schemesTitle'),   desc: t('features.schemesDesc'),   bg: 'bg-success-light', ic: 'text-success' },
              { icon: Clock,      title: t('features.equipmentTitle'), desc: t('features.equipmentDesc'), bg: 'bg-info-light',    ic: 'text-info' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="card p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300
                             animate-fade-in-up group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-11 h-11 ${f.bg} ${f.ic} rounded-xl flex items-center justify-center mb-4
                                   group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-[#F1E8D8]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="badge-teal mb-4 mx-auto w-fit">{t('Simple Process')}</div>
            <h2 className="section-title text-3xl sm:text-4xl mb-4">{t('How KrishiMent Works')}</h2>
            <p className="section-subtitle">{t('Connect, hire, and manage agricultural workers in four easy steps.')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+2rem)] right-0
                                  h-0.5 bg-primary/20 z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground
                                  flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-md">
                    {step.step}
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two-audience section ── */}
      <section id="about" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Farmer card */}
            <div className="card p-8 animate-fade-in-left">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-5">
                <Tractor className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{t('For Farmers')}</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">{t('about.farmerDesc')}</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  t('Post farm jobs with location and wage'),
                  t('Smart worker matching by skill and proximity'),
                  t('Accept/reject applications with one tap'),
                  t('Rate workers after completion'),
                  t('Track equipment and government schemes'),
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGetStarted}
                className="btn-primary w-full justify-center h-11"
              >
                {t('Start as Farmer')}
              </button>
            </div>

            {/* Worker card */}
            <div className="card-sand p-8 animate-fade-in-right animation-delay-100">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('For Workers')}</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">{t('about.workerDesc')}</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  t('Browse nearby jobs by distance and wage'),
                  t('Apply with message and contact details'),
                  t('Track application status in real time'),
                  t('Manage skills and build your reputation'),
                  t('View earnings and work history'),
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGetStarted}
                className="btn-primary w-full justify-center h-11"
              >
                {t('Find Farm Work')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-16 sm:py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-primary-foreground/75 text-lg mb-8 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2.5 bg-[#F1E8D8] text-primary
                       font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg
                       hover:-translate-y-0.5 transition-all duration-200 group"
          >
            {t('cta.button')}
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1C2E33] text-white/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-base">KrishiMent</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">{t('footer.desc')}</p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">{t('footer.platformTitle')}</h4>
              <ul className="space-y-2 text-sm">
                {[t('footer.platform1'), t('footer.platform2'), t('footer.platform3'), t('footer.platform4')].map((item) => (
                  <li key={item}><span className="hover:text-white cursor-default transition-colors">{item}</span></li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">{t('footer.supportTitle')}</h4>
              <ul className="space-y-2 text-sm">
                {[t('footer.support1'), t('footer.support2'), t('footer.support3'), t('footer.support4')].map((item) => (
                  <li key={item}><span className="hover:text-white cursor-default transition-colors">{item}</span></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">{t('footer.contactTitle')}</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  +91 98765 43210
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  support@krishiment.com
                </li>
                <li>{t('footer.address1')}</li>
                <li>{t('footer.address2')}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/50">{t('footer.copyright')}</p>
            <div className="flex items-center gap-4">
              {['Privacy Policy', 'Terms of Service'].map((item) => (
                <span key={item} className="text-xs text-white/50 hover:text-white cursor-default transition-colors">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
