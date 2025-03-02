"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { TypewriterEffect } from '@/components/TypewriterEffect';
import { FaCalendarAlt, FaUserFriends, FaMapMarkerAlt } from 'react-icons/fa';
import { GiTennisBall } from 'react-icons/gi';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link as ScrollLink } from 'react-scroll';
import { VideoModal } from '@/components/VideoModal';
import type { FC, JSX } from 'react';

/* eslint-disable @typescript-eslint/no-unused-vars */

interface WorkflowStep {
  title: string;
  description: string;
  preview: JSX.Element;
}

interface Platform {
  name: string;
  icon: FC;
}

interface WorkflowSection {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  metrics?: Array<{
    label: string;
    value: string;
  }>;
}

interface FeatureCard {
  title: string;
  description: string;
  icon: JSX.Element;
  bgGradient: string;
}

// Update workflowSteps for tennis app
const workflowSteps: WorkflowStep[] = [
  {
    title: "Create a Match",
    description: "Set up a match with your preferred location, date, and skill level.",
    preview: <TypewriterEffect text="Creating your match..." />
  },
  {
    title: "Find Partners",
    description: "Invite players or let others join your match based on their availability.",
    preview: <TypewriterEffect text="Finding partners..." />
  },
  {
    title: "Join Matches",
    description: "Browse and join matches near you that fit your schedule and skill level.",
    preview: <TypewriterEffect text="Joining matches..." />
  },
  {
    title: "Play Tennis",
    description: "Show up, play, and enjoy the game with your new tennis partners!",
    preview: <TypewriterEffect text="Playing tennis..." />
  }
];

// Update platforms for tennis app
const platforms: Platform[] = [
  { name: 'Tennis Clubs', icon: GiTennisBall },
  { name: 'Local Players', icon: FaUserFriends },
  { name: 'Courts Near You', icon: FaMapMarkerAlt },
  { name: 'Tournaments', icon: FaCalendarAlt }
];

// Update workflowSections for tennis app
const workflowSections: WorkflowSection[] = [
  {
    id: "overview",
    title: "Overview",
    description: "Everything you need to schedule and play tennis matches.",
    bgColor: "bg-white dark:bg-[#0B1120]"
  },
  {
    id: "matches",
    title: "Matches",
    description: "Create, join, and manage tennis matches with ease.",
    bgColor: "bg-slate-50 dark:bg-[#0B1120]",
    metrics: [
      { label: "Matches Created", value: "100+" },
      { label: "Players Joined", value: "500+" },
      { label: "Courts Available", value: "50+" }
    ]
  },
  {
    id: "partners",
    title: "Partners",
    description: "Find players who match your skill level and availability.",
    bgColor: "bg-white dark:bg-[#0B1120]",
    metrics: [
      { label: "Players Nearby", value: "200+" },
      { label: "Skill Levels", value: "All" },
      { label: "Availability", value: "Flexible" }
    ]
  },
  {
    id: "features",
    title: "Features",
    description: "Additional features to enhance your tennis experience.",
    bgColor: "bg-slate-50 dark:bg-[#0B1120]",
    metrics: [
      { label: "Notifications", value: "Real-time" },
      { label: "Dark Mode", value: "Built-in" },
      { label: "TypeScript", value: "100%" }
    ]
  },
  {
    id: "pricing",
    title: "Pricing",
    description: "Simple, transparent pricing for your needs.",
    bgColor: "bg-white dark:bg-[#0B1120]"
  }
];

// Custom Hook to create section progress values
function useSectionProgressValues(numSections: number) {
  const { scrollYProgress } = useScroll();
  
  // Create all transforms at once, at the top level
  const section1Progress = useTransform(
    scrollYProgress,
    [0 / numSections, 1 / numSections],
    [0, 1]
  );
  const section2Progress = useTransform(
    scrollYProgress,
    [1 / numSections, 2 / numSections],
    [0, 1]
  );
  const section3Progress = useTransform(
    scrollYProgress,
    [2 / numSections, 3 / numSections],
    [0, 1]
  );
  const section4Progress = useTransform(
    scrollYProgress,
    [3 / numSections, 4 / numSections],
    [0, 1]
  );

  return [section1Progress, section2Progress, section3Progress, section4Progress];
}

// Feature cards data for tennis app
const featureCards: FeatureCard[] = [
  {
    title: "Match Scheduling",
    description: "Easily create and manage tennis matches.",
    icon: <FaCalendarAlt className="h-6 w-6 text-primary" />,
    bgGradient: "from-blue-500/10 to-purple-500/10"
  },
  {
    title: "Find Partners",
    description: "Connect with players who match your skill level.",
    icon: <FaUserFriends className="h-6 w-6 text-primary" />,
    bgGradient: "from-green-500/10 to-emerald-500/10"
  },
  {
    title: "Court Locations",
    description: "Discover courts near you.",
    icon: <FaMapMarkerAlt className="h-6 w-6 text-primary" />,
    bgGradient: "from-orange-500/10 to-red-500/10"
  }
];

const LandingPage: FC = () => {
  const { user } = useAuth();
  const { isInTrial } = useTrialStatus();
  const [activeSection, setActiveSection] = useState("overview");
  const sectionProgressValues = useSectionProgressValues(workflowSections.length);
  
  const router = useRouter();

  const [dashboardRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const { scrollYProgress } = useScroll();

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] relative">
      {/* Enhanced Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-darker/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 overflow-x-auto hide-scrollbar">
            {workflowSections.map((section, index) => (
              <ScrollLink
                key={section.id}
                to={section.id}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                onSetActive={() => setActiveSection(section.id)}
                className={`flex items-center cursor-pointer group min-w-fit mx-4 first:ml-0 last:mr-0`}
              >
                <div className="relative">
                  <span 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 transition-all duration-300
                      ${activeSection === section.id 
                      ? 'bg-primary dark:bg-primary-light text-white' 
                      : 'bg-primary/10 dark:bg-primary-light/10 text-primary dark:text-primary-light group-hover:bg-primary/20 dark:group-hover:bg-primary-light/20'}`}
                  >
                    {index + 1}
                  </span>
                </div>
                <span 
                  className={`text-sm font-medium transition-colors duration-300 hidden md:block whitespace-nowrap
                    ${activeSection === section.id 
                    ? 'text-primary dark:text-primary-light' 
                    : 'text-slate-600 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-primary-light'}`}
                >
                  {section.title}
                </span>
              </ScrollLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section - Now acts as Overview */}
      <div id="overview" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/10 to-accent-light/10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-20 pb-16 sm:pb-24">
            {/* Header Content */}
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white">
                <span className="block">Tennis Partner Scheduling</span>
                <span className="block text-primary dark:text-primary-light">Play More, Plan Less</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                Find players, schedule matches, and enjoy the game.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-10 flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Watch Demo
                </motion.button>
                <button 
                  onClick={() => router.push('/dashboard')} 
                  className="px-8 py-3 bg-white dark:bg-neutral-dark hover:bg-slate-50 dark:hover:bg-neutral-darker text-primary dark:text-primary-light border-2 border-primary dark:border-primary-light rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Combined Preview: Code + Workflow Steps */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Code Preview */}
              <div className="relative">
                <pre className="relative rounded-xl bg-slate-900 p-8 shadow-2xl">
                  <code className="text-sm sm:text-base text-slate-100">
                    <TypewriterEffect text={`// 🎾 Tennis Match Setup
import { useTennis, usePartners } from '@/hooks/tennis';

export const TennisLife = () => {
  const { match } = useTennis();
  const { partners } = usePartners();
  
  return (
    <div className="tennis-life">
      <Status>
        {match ? '🎾 Match Scheduled' : '⏳ Find Partners'}
        {partners.length > 0 ? '👥 Ready to Play' : '🔍 Searching...'}
      </Status>
    </div>
  );`} />
                  </code>
                </pre>
              </div>

              {/* Workflow Steps */}
              <div className="grid grid-cols-1 gap-4">
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 1, y: 0 }}
                    className="relative p-4 bg-white/5 dark:bg-neutral-dark border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm rounded-xl shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                  >
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary dark:bg-primary-light text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="ml-8">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other sections */}
      {workflowSections.slice(1).map((section, index) => (
        <motion.section
          key={section.id}
          id={section.id}
          className={`py-20 ${section.bgColor}`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          onViewportEnter={() => setActiveSection(section.id)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {section.title}
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                {section.description}
              </p>
            </div>

            {/* Clean Metrics Display */}
            {section.metrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {section.metrics.map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    <div className="text-3xl font-bold text-primary mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {metric.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      ))}

      {/* Enhanced CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/10 to-accent-light/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-white dark:bg-neutral-dark rounded-xl shadow-xl p-12 border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <motion.h2 
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                className="text-3xl font-bold text-slate-900 dark:text-white"
              >
                Ready to Play?
              </motion.h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Start scheduling matches today.
              </p>
              
              <div className="mt-10 flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Watch Demo
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-3 bg-white dark:bg-neutral-dark hover:bg-slate-50 dark:hover:bg-neutral-darker text-primary dark:text-primary-light border-2 border-primary dark:border-primary-light rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId="S1cnQG0-LP4"
      />
    </div>
  );
}

export default LandingPage;