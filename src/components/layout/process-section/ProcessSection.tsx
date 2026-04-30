import React from 'react';
import { FeatureItem } from "./FeatureItem";
import { 
  Search, 
  Stethoscope, 
  UserPlus, 
  Hospital, 
  ClipboardCheck, 
  Clock, 
  ShieldCheck, 
  Briefcase, 
  ServerIcon
} from 'lucide-react';

export const ProcessSection = () => {
  const latinText = {
    searchJob: "Easily browse and search for nursing jobs using filters like location, specialty, experience level, and salary range to find the best match quickly",
    findJob: "Discover curated job listings tailored to your profile, including recommended positions based on your skills and preferences",
    createAccount: "Sign up as a job seeker or employer to access platform features such as job applications, posting jobs, and managing profiles",
    hireEmployee: "Employers can post job openings, review applications, and connect with qualified nursing professionals efficiently",
    verifyCredentials: "Employers can post job openings, review applications, and connect with qualified nursing professionals efficiently"
  };


  return (
    <section className="  bg-white mb-3 mt-10 py-16">
      {/* Wrapper: Restricted to 1400px and centered */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-red-600 font-extrabold text-4xl md:text-5xl mb-4">Features & Process</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            “Your Path to the Right Nursing Job”
          </p>
        </div>

        {/* Grid Layout: ensures no overflow on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ml-10">
          
          {/* LEFT COLUMN (Span 4 of 12 = ~33%) */}
          <div className="lg:col-span-4 flex flex-col space-y-2 ml-20 mt-">
            <FeatureItem 
              icon={<Search size={24} />}
              title="Search Job"
              description={latinText.searchJob}
            />
            <FeatureItem 
              icon={<Briefcase size={24} />}
              title="FIND JOB"
              description={latinText.findJob}
            />
            <FeatureItem 
              icon={<UserPlus size={24} />}
              title="Create Account"
              description={latinText.createAccount}
            />
            <FeatureItem 
              icon={<Hospital size={24} />}
              title="HIRE EMPLOYEE"
              description={latinText.hireEmployee}
            />
          </div>

          {/* CENTER COLUMN: Mobile Screen (Span 4 of 12 = ~33%) */}
          <div className="lg:col-span-4 flex justify-center relative">
            {/* Glow effect contained inside the column */}
            <div className="absolute inset-0 bg-[#3b82f6]/10 rounded-full blur-[80px] -z-10 scale-75"></div>
            
            {/* Reduced Phone Size */}
            <div className="relative w-full max-w-[370px] group">
  {/* The Phone Frame */}
  <div className="relative border-[10px] border-gray-900 rounded-[2.5rem] aspect-[9/18.5] shadow-2xl bg-white overflow-hidden">
    
    {/* 1. The Image - Now using object-cover to fill all space */}
    <img 
      src="/signup-sc/mobile-sc.png" 
      alt="App Interface" 
      className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
    />

    {/* 2. Added Functionality: Dynamic Island (Notch) */}
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full z-20 flex items-center justify-center">
        <div className="w-1 h-1 bg-blue-500/40 rounded-full ml-auto mr-3"></div> {/* Camera Lens dot */}
    </div>

    {/* 3. Added Functionality: Home Indicator (Bottom Bar) */}
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-800/50 rounded-full z-20"></div>

    {/* 4. Visual Polish: Glass Reflection Overlay */}
    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none"></div>
    
    {/* 5. Inner Shadow for depth */}
    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none"></div>
  </div>

  {/* Background Glow Effect */}
  <div className="absolute -inset-4 bg-red-500/10 blur-3xl rounded-[3rem] -z-10 group-hover:bg-red-500/20 transition-colors duration-500"></div>
</div>
          </div>

          {/* RIGHT COLUMN (Span 4 of 12 = ~33%) */}
          <div className="lg:col-span-4 flex flex-col space-y-2">
            <FeatureItem 
              icon={<ClipboardCheck size={24} />}
              title="Verify Credentials"
              description={latinText.verifyCredentials}
            />
            <FeatureItem 
              icon={<Clock size={24} />}
              title="Flexible Scheduling"
              description="Choose from per-diem, travel nursing, or permanent placements that fit your lifestyle."
            />
            <FeatureItem 
              icon={<ShieldCheck size={24} />}
              title="Secure Placement"
              description="We only partner with top-tier American hospitals to ensure a safe and professional work environment."
            />
            <FeatureItem 
              icon={<Stethoscope size={24} />}
              title="Clinical Support"
              description="Access 24/7 support from our clinical leads to help you excel in your new nursing assignment."
            />
          </div>

        </div>

        {/* Action Button */}
        <div className="text-center mt-8 mb-6 ml-8">
          <button className=" btn inline-flex items-center gap-2 !py-4 !px-10 text-lg shadow-md">
            Find Your Next Nursing Shift
          </button>
        </div>
      </div>
    </section>
  );
};