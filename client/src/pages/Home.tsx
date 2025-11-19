import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Calendar, Target, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "react-oidc-context";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = useAuth();

  const handleSignIn = () => {
    console.log('signing in');
    auth.signinRedirect();
  };

  const handleSignOut = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string | undefined;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN as string | undefined;
    console.log(cognitoDomain, clientId);
    // Fallback: clear local session
    auth.removeUser();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/Defftlogolock.png" 
                alt="Defft.ai - Agile solutions for distributors" 
                className="h-12 sm:h-16 lg:h-20" 
              />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Platform</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Solutions</a>
              <Link href="/sales-academy" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sales Academy</Link>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Resources</a>
              <Button
                variant="outline"
                className="border-slate-300"
                onClick={auth.isAuthenticated ? handleSignOut : handleSignIn}
              >
                {auth.isAuthenticated ? "Sign Out" : "Sign In"}
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-slate-200 space-y-3">
              <a href="#" className="block text-sm font-medium text-slate-600 hover:text-slate-900 py-2">Platform</a>
              <a href="#" className="block text-sm font-medium text-slate-600 hover:text-slate-900 py-2">Solutions</a>
              <Link href="/sales-academy" className="block text-sm font-medium text-slate-600 hover:text-slate-900 py-2">Sales Academy</Link>
              <a href="#" className="block text-sm font-medium text-slate-600 hover:text-slate-900 py-2">Resources</a>
              <Button
                variant="outline"
                className="w-full border-slate-300"
                onClick={auth.isAuthenticated ? handleSignOut : handleSignIn}
              >
                {auth.isAuthenticated ? "Sign Out" : "Sign In"}
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 mb-4 sm:mb-6 tracking-tight">
              Packaging Intelligence Platform
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-light leading-relaxed">
              Transform packaging decisions with AI-powered analysis, strategic insights, and data-driven recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          
          {/* Post-Meeting - Hero Module */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-slate-900 shadow-lg h-full">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] rounded flex items-center justify-center flex-shrink-0">
                    <Key className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                      <h2 className="text-2xl sm:text-3xl font-light text-slate-900">Post-Meeting Analysis</h2>
                      <span className="text-xs sm:text-sm font-medium text-white bg-[#FF6B4A] px-3 py-1 rounded w-fit">
                        Core Module
                      </span>
                    </div>
                    <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed mb-6 sm:mb-8">
                      Comprehensive packaging solution analysis with AI-powered recommendations, cost modeling, and supplier matching. Transform client conversations into actionable intelligence.
                    </p>
                    
                    {/* Key Features */}
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="border-l-2 border-[#FF6B4A] pl-3 sm:pl-4">
                        <div className="text-sm font-medium text-slate-900 mb-1">Solution Recommendations</div>
                        <div className="text-xs sm:text-sm text-slate-600">AI-matched packaging solutions</div>
                      </div>
                      <div className="border-l-2 border-[#4ECDC4] pl-3 sm:pl-4">
                        <div className="text-sm font-medium text-slate-900 mb-1">Cost-Benefit Analysis</div>
                        <div className="text-xs sm:text-sm text-slate-600">Financial projections & ROI</div>
                      </div>
                      <div className="border-l-2 border-[#FF6B4A] pl-3 sm:pl-4">
                        <div className="text-sm font-medium text-slate-900 mb-1">Implementation Roadmap</div>
                        <div className="text-xs sm:text-sm text-slate-600">Timeline & action steps</div>
                      </div>
                      <div className="border-l-2 border-[#4ECDC4] pl-3 sm:pl-4">
                        <div className="text-sm font-medium text-slate-900 mb-1">Supplier Matching</div>
                        <div className="text-xs sm:text-sm text-slate-600">Qualified vendor recommendations</div>
                      </div>
                    </div>

                    <Link href="/post-meeting">
                      <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg h-auto">
                        Begin Analysis
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supporting Modules */}
          <div className="space-y-6 sm:space-y-8">
            {/* Meeting Prep */}
            <Card className="border border-slate-300 hover:border-[#4ECDC4] transition-colors">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ECDC4]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-light text-slate-900">Meeting Prep</h3>
                </div>
                <p className="text-sm text-slate-600 font-light mb-6 leading-relaxed">
                  AI-powered briefings with client insights, industry trends, and strategic talking points.
                </p>
                <Link href="/meeting-prep">
                  <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-50">
                    Prepare Meeting
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Account Attack */}
            <Card className="border border-slate-300 hover:border-[#FF6B4A] transition-colors">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF6B4A]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-light text-slate-900">Account Attack</h3>
                </div>
                <p className="text-sm text-slate-600 font-light mb-6 leading-relaxed">
                  Strategic campaign planning with market segmentation and messaging frameworks.
                </p>
                <Link href="/account-attack">
                  <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-50">
                    Plan Campaign
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Platform Capabilities */}
        <div className="mt-16 sm:mt-20 lg:mt-24 border-t border-slate-200 pt-12 sm:pt-16">
          <h2 className="text-xl sm:text-2xl font-light text-slate-900 mb-8 sm:mb-12 text-center">Platform Capabilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-light text-slate-900 mb-2">500+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-light">Active Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-light text-slate-900 mb-2">1,200+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-light">Analyses Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-light text-[#FF6B4A] mb-2">$2.4M</div>
              <div className="text-xs sm:text-sm text-slate-600 font-light">Cost Savings Identified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-light text-[#4ECDC4] mb-2">95%</div>
              <div className="text-xs sm:text-sm text-slate-600 font-light">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-16 sm:mt-20 lg:mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-600">© 2024 Defft.ai. All rights reserved.</div>
            <div className="flex gap-6 sm:gap-8">
              <a href="#" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900">Privacy</a>
              <a href="#" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900">Terms</a>
              <a href="#" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
