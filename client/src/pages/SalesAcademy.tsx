import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GraduationCap, 
  Trophy, 
  Target, 
  MessageSquare, 
  Handshake,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Lock,
  Star,
  Zap,
  Award,
  Package,
  Lightbulb,
  DollarSign,
  Users,
  Leaf,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "react-oidc-context";

export default function SalesAcademy() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const auth = useAuth();

  const handleSignIn = () => {
    auth.signinRedirect();
  };

  const handleSignOut = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string | undefined;
    const logoutUri =
      ((import.meta.env.VITE_COGNITO_LOGOUT_REDIRECT_URI as string) ||
        `${window.location.origin}/`) as string;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN as string | undefined;
    if (cognitoDomain && clientId) {
      window.location.href = `${cognitoDomain}/logout?client_id=${encodeURIComponent(
        clientId
      )}&logout_uri=${encodeURIComponent(logoutUri)}`;
      return;
    }
    auth.removeUser();
  };

  const learningPaths = [
    {
      id: 'packaging_fundamentals',
      title: 'Packaging Industry Fundamentals',
      icon: Package,
      color: 'from-[#FF6B4A] to-[#FF8C6B]',
      level: 'Foundation',
      duration: '40 min',
      lessons: 7,
      description: 'Master packaging materials, processes, and industry terminology',
      unlocked: true,
      isNew: true
    },
    {
      id: 'prospecting',
      title: 'Prospecting & Lead Generation',
      icon: Target,
      color: 'from-[#4ECDC4] to-[#6EDDD5]',
      level: 'Foundation',
      duration: '45 min',
      lessons: 8,
      description: 'Master the art of identifying and qualifying high-value prospects',
      unlocked: true,
      isNew: false
    },
    {
      id: 'discovery',
      title: 'Discovery & Qualification',
      icon: MessageSquare,
      color: 'from-[#FF6B4A] to-[#4ECDC4]',
      level: 'Intermediate',
      duration: '60 min',
      lessons: 10,
      description: 'Learn SPIN, MEDDIC, and advanced questioning techniques',
      unlocked: true,
      isNew: false
    },
    {
      id: 'packaging_solutions',
      title: 'Packaging Solution Selling',
      icon: Lightbulb,
      color: 'from-[#4ECDC4] to-[#FF6B4A]',
      level: 'Intermediate',
      duration: '55 min',
      lessons: 11,
      description: 'Sell corrugated, flexible packaging, labels, and specialty solutions',
      unlocked: true,
      isNew: true
    },
    {
      id: 'presentation',
      title: 'Presentation & Demonstration',
      icon: TrendingUp,
      color: 'from-[#FF6B4A] to-[#FFD700]',
      level: 'Intermediate',
      duration: '50 min',
      lessons: 9,
      description: 'Deliver compelling value propositions with sustainability focus',
      unlocked: true,
      isNew: false
    },
    {
      id: 'objections',
      title: 'Objection Handling',
      icon: Handshake,
      color: 'from-[#4ECDC4] to-[#6EDDD5]',
      level: 'Advanced',
      duration: '55 min',
      lessons: 12,
      description: 'Turn resistance into opportunities with proven frameworks',
      unlocked: true,
      isNew: false
    },
    {
      id: 'negotiation',
      title: 'Negotiation & Closing',
      icon: Trophy,
      color: 'from-[#FF6B4A] to-[#4ECDC4]',
      level: 'Advanced',
      duration: '70 min',
      lessons: 14,
      description: 'Close deals with packaging cost analysis and value justification',
      unlocked: false,
      isNew: false
    },
    {
      id: 'account_mgmt',
      title: 'Account Management & Expansion',
      icon: Award,
      color: 'from-[#4ECDC4] to-[#9370DB]',
      level: 'Expert',
      duration: '65 min',
      lessons: 11,
      description: 'Grow accounts and create long-term partnerships',
      unlocked: false,
      isNew: false
    }
  ];

  const frameworks = [
    {
      name: 'SPIN Selling',
      description: 'Situation, Problem, Implication, Need-payoff questioning framework',
      useCase: 'Complex B2B sales with long cycles',
      color: 'border-[#FF6B4A]'
    },
    {
      name: 'Challenger Sale',
      description: 'Teach, Tailor, Take Control - challenge customer thinking',
      useCase: 'Differentiation in competitive markets',
      color: 'border-[#4ECDC4]'
    },
    {
      name: 'MEDDIC',
      description: 'Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion',
      useCase: 'Enterprise sales qualification',
      color: 'border-[#FF6B4A]'
    },
    {
      name: 'Sandler Selling',
      description: 'Pain-focused selling with upfront contracts',
      useCase: 'Consultative, relationship-based sales',
      color: 'border-[#4ECDC4]'
    }
  ];

  const handleModuleClick = (moduleId: string, unlocked: boolean) => {
    if (unlocked) {
      setSelectedModule(moduleId);
    }
  };

  const markComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  // Packaging Fundamentals Module
  if (selectedModule === 'packaging_fundamentals') {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
            <Link href="/sales-academy">
              <img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16 cursor-pointer" />
            </Link>
            <Button 
              variant="outline" 
              onClick={() => setSelectedModule(null)}
              className="border-slate-300"
            >
              ← Back to Academy
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Module Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#FF8C6B] flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-light text-slate-900">Packaging Industry Fundamentals</h1>
                    <span className="text-xs font-medium text-white bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] px-2 py-1 rounded">NEW</span>
                  </div>
                  <p className="text-slate-600">Foundation • 40 min • 7 lessons</p>
                </div>
              </div>
            </div>

            {/* Packaging Materials */}
            <Card className="border-2 border-[#FF6B4A] mb-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-6 w-6 text-[#FF6B4A]" />
                  <h2 className="text-2xl font-light text-slate-900">Packaging Materials 101</h2>
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed">
                  Understanding materials is the foundation of packaging sales. Each material has unique properties, 
                  cost structures, and ideal applications.
                </p>

                <div className="space-y-6">
                  {/* Corrugated */}
                  <div className="border-l-4 border-[#FF6B4A] pl-6">
                    <h3 className="text-xl font-medium text-slate-900 mb-3">Corrugated Fiberboard</h3>
                    <p className="text-slate-700 mb-4">
                      The workhorse of packaging. Made from linerboard and corrugating medium. Flutes (A, B, C, E, F) 
                      determine strength and cushioning.
                    </p>
                    <div className="bg-slate-50 p-4 rounded space-y-2">
                      <p className="text-sm font-medium text-slate-900">Key Selling Points:</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• <strong>Recyclable & Sustainable:</strong> 90%+ recycling rate, renewable resource</li>
                        <li>• <strong>Customizable:</strong> Infinite sizes, printing, die-cutting options</li>
                        <li>• <strong>Cost-Effective:</strong> Lower cost per unit than most alternatives</li>
                        <li>• <strong>Protective:</strong> Excellent cushioning and stacking strength</li>
                      </ul>
                    </div>
                    <div className="mt-3 p-3 bg-[#FF6B4A]/10 rounded border border-[#FF6B4A]/30">
                      <p className="text-sm text-slate-700">
                        <strong className="text-[#FF6B4A]">Sales Tip:</strong> Lead with sustainability. "Did you know corrugated 
                        is recycled more than any other packaging material in North America?"
                      </p>
                    </div>
                  </div>

                  {/* Flexible Packaging */}
                  <div className="border-l-4 border-[#4ECDC4] pl-6">
                    <h3 className="text-xl font-medium text-slate-900 mb-3">Flexible Packaging</h3>
                    <p className="text-slate-700 mb-4">
                      Films, pouches, bags. Materials include polyethylene (PE), polypropylene (PP), polyester (PET), 
                      and multi-layer laminates.
                    </p>
                    <div className="bg-slate-50 p-4 rounded space-y-2">
                      <p className="text-sm font-medium text-slate-900">Key Selling Points:</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• <strong>Lightweight:</strong> Reduces freight costs and carbon footprint</li>
                        <li>• <strong>Barrier Properties:</strong> Protects against moisture, oxygen, light</li>
                        <li>• <strong>Shelf Appeal:</strong> High-quality graphics, stand-up pouches</li>
                        <li>• <strong>Space Efficient:</strong> Stores flat, reduces warehouse costs</li>
                      </ul>
                    </div>
                    <div className="mt-3 p-3 bg-[#4ECDC4]/10 rounded border border-[#4ECDC4]/30">
                      <p className="text-sm text-slate-700">
                        <strong className="text-[#4ECDC4]">Sales Tip:</strong> Calculate freight savings. "Switching from rigid 
                        to flexible could save you $50K annually in shipping costs alone."
                      </p>
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="border-l-4 border-[#FF6B4A] pl-6">
                    <h3 className="text-xl font-medium text-slate-900 mb-3">Labels & Shrink Sleeves</h3>
                    <p className="text-slate-700 mb-4">
                      Pressure-sensitive labels, shrink sleeves, in-mold labels. Materials include paper, film, 
                      and specialty substrates.
                    </p>
                    <div className="bg-slate-50 p-4 rounded space-y-2">
                      <p className="text-sm font-medium text-slate-900">Key Selling Points:</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• <strong>Brand Differentiation:</strong> Premium finishes, metallics, textures</li>
                        <li>• <strong>Variable Data:</strong> QR codes, batch numbers, personalization</li>
                        <li>• <strong>Compliance:</strong> Nutrition facts, regulatory requirements</li>
                        <li>• <strong>Tamper Evidence:</strong> Security and authenticity features</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Try This Now */}
                <div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="h-6 w-6 text-[#FFD700]" />
                    <h3 className="text-xl font-light">Try This Now</h3>
                  </div>
                  <p className="mb-4 leading-relaxed">
                    Pick a product you see right now (coffee bag, shipping box, water bottle). Identify the packaging 
                    material and list 3 reasons why that material was chosen over alternatives.
                  </p>
                  <p className="text-sm opacity-90">
                    <strong>Bonus Challenge:</strong> What would you recommend if they wanted to make it more sustainable?
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Industry Terminology */}
            <Card className="border-2 border-[#4ECDC4] mb-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-6 w-6 text-[#4ECDC4]" />
                  <h2 className="text-2xl font-light text-slate-900">Essential Packaging Terminology</h2>
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed">
                  Speak the language of packaging professionals. These terms will make you sound like an insider.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-[#FF6B4A] mb-1">MOQ (Minimum Order Quantity)</div>
                    <p className="text-xs text-slate-700">
                      The smallest order a supplier will accept. Critical for pricing negotiations.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-[#4ECDC4] mb-1">Lead Time</div>
                    <p className="text-xs text-slate-700">
                      Time from order placement to delivery. Varies by material, customization, and supplier capacity.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-[#FF6B4A] mb-1">Tooling / Plates / Dies</div>
                    <p className="text-xs text-slate-700">
                      One-time setup costs for custom shapes, sizes, or printing. Can range from $500 to $50,000+.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-[#4ECDC4] mb-1">SKU (Stock Keeping Unit)</div>
                    <p className="text-xs text-slate-700">
                      Unique identifier for each product variant. More SKUs = more complexity and cost.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-[#FF6B4A] mb-1">Caliper / Gauge / Mil</div>
                    <p className="text-xs text-slate-700">
                      Thickness measurements. Caliper for paper/board, gauge for film, mil for coatings.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-[#4ECDC4] mb-1">Freight Class</div>
                    <p className="text-xs text-slate-700">
                      Shipping classification based on density, handling, and liability. Affects freight costs.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-[#FF6B4A] mb-1">PCR (Post-Consumer Recycled)</div>
                    <p className="text-xs text-slate-700">
                      Material made from recycled consumer waste. Key sustainability metric.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-[#4ECDC4] mb-1">Compostable vs. Biodegradable</div>
                    <p className="text-xs text-slate-700">
                      Compostable breaks down in specific conditions. Biodegradable is vague and often misleading.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#4ECDC4]/10 rounded border border-[#4ECDC4]/30">
                  <p className="text-sm text-slate-700">
                    <strong className="text-[#4ECDC4]">Pro Move:</strong> Drop these terms naturally in discovery calls. 
                    "What's your current MOQ with your supplier?" sounds way better than "How much do you order?"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sustainability Trends */}
            <Card className="border-2 border-[#FF6B4A] mb-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Leaf className="h-6 w-6 text-[#FF6B4A]" />
                  <h2 className="text-2xl font-light text-slate-900">Sustainability Trends You Must Know</h2>
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed">
                  Sustainability isn't a nice-to-have anymore—it's a must-have. Buyers are under pressure from 
                  consumers, retailers, and regulators.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B4A] flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-medium text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 mb-2">Plastic Reduction Mandates</h3>
                      <p className="text-sm text-slate-700">
                        EU, California, and other regions are banning single-use plastics. Brands need alternatives NOW.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded">
                    <div className="w-8 h-8 rounded-full bg-[#4ECDC4] flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-medium text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 mb-2">Extended Producer Responsibility (EPR)</h3>
                      <p className="text-sm text-slate-700">
                        Companies are financially responsible for end-of-life packaging. Drives demand for recyclable materials.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B4A] flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-medium text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 mb-2">Retailer Requirements</h3>
                      <p className="text-sm text-slate-700">
                        Walmart, Amazon, Target all have packaging scorecards. Suppliers must meet sustainability standards to get shelf space.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded">
                    <div className="w-8 h-8 rounded-full bg-[#4ECDC4] flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-medium text-sm">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 mb-2">Carbon Footprint Tracking</h3>
                      <p className="text-sm text-slate-700">
                        Scope 3 emissions (supply chain) are under scrutiny. Lightweight packaging = lower carbon footprint.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] text-white rounded">
                  <p className="text-sm">
                    <strong>🎯 Sales Opportunity:</strong> Every sustainability challenge is a chance to position your 
                    solution. "Our PCR corrugated helps you meet Walmart's scorecard requirements while reducing costs."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Complete Module Button */}
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setSelectedModule(null)}
                className="border-slate-300"
              >
                Save Progress
              </Button>
              <Button 
                onClick={() => {
                  markComplete('packaging_fundamentals');
                  setSelectedModule(null);
                }}
                className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8C6B] hover:opacity-90 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Module
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Discovery & Qualification Module (existing)
  if (selectedModule === 'discovery') {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
            <Link href="/sales-academy">
              <img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16 cursor-pointer" />
            </Link>
            <Button 
              variant="outline" 
              onClick={() => setSelectedModule(null)}
              className="border-slate-300"
            >
              ← Back to Academy
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Module Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-light text-slate-900">Discovery & Qualification</h1>
                  <p className="text-slate-600">Intermediate • 60 min • 10 lessons</p>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] w-0 transition-all duration-500" style={{ width: '0%' }} />
              </div>
            </div>

            {/* SPIN Selling Framework */}
            <Card className="border-2 border-[#4ECDC4] mb-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="h-6 w-6 text-[#4ECDC4]" />
                  <h2 className="text-2xl font-light text-slate-900">SPIN Selling Framework</h2>
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed">
                  Developed by Neil Rackham after analyzing 35,000 sales calls, SPIN is the gold standard for 
                  consultative selling. It transforms you from a product pusher into a trusted advisor.
                </p>

                <div className="space-y-6">
                  {/* Situation Questions */}
                  <div className="border-l-4 border-[#FF6B4A] pl-6">
                    <h3 className="text-xl font-medium text-slate-900 mb-3">
                      <span className="text-[#FF6B4A]">S</span>ituation Questions
                    </h3>
                    <p className="text-slate-700 mb-4">
                      Gather facts and background. Keep these brief - prospects get bored quickly.
                    </p>
                    <div className="bg-slate-50 p-4 rounded space-y-2">
                      <p className="text-sm font-medium text-slate-900">Examples for Packaging Sales:</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• "What's your current monthly packaging spend?"</li>
                        <li>• "How many SKUs do you ship?"</li>
                        <li>• "Which suppliers are you currently working with?"</li>
                        <li>• "What's your average order volume?"</li>
                      </ul>
                    </div>
                    <div className="mt-3 p-3 bg-[#4ECDC4]/10 rounded border border-[#4ECDC4]/30">
                      <p className="text-sm text-slate-700">
                        <strong className="text-[#4ECDC4]">Pro Tip:</strong> Do your homework first. Ask only what you can't find on LinkedIn or their website.
                      </p>
                    </div>
                  </div>

                  {/* Problem Questions */}
                  <div className="border-l-4 border-[#4ECDC4] pl-6">
                    <h3 className="text-xl font-medium text-slate-900 mb-3">
                      <span className="text-[#4ECDC4]">P</span>roblem Questions
                    </h3>
                    <p className="text-slate-700 mb-4">
                      Uncover difficulties, dissatisfactions, and pain points. This is where value creation begins.
                    </p>
                    <div className="bg-slate-50 p-4 rounded space-y-2">
                      <p className="text-sm font-medium text-slate-900">Examples:</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• "Are you experiencing any damage issues with your current packaging?"</li>
                        <li>• "How often do lead times cause problems for you?"</li>
                        <li>• "What challenges are you facing with sustainability goals?"</li>
                        <li>• "Where are you seeing the most waste in your packaging process?"</li>
                      </ul>
                    </div>
                    <div className="mt-3 p-3 bg-[#FF6B4A]/10 rounded border border-[#FF6B4A]/30">
                      <p className="text-sm text-slate-700">
                        <strong className="text-[#FF6B4A]">Warning:</strong> Don't jump to solutions yet. Resist the urge to pitch. Just listen and probe deeper.
                      </p>
                    </div>
                  </div>

                  {/* Implication Questions */}
                  <div className="border-l-4 border-[#FF6B4A] pl-6">
                    <h3 className="text-xl font-medium text-slate-900 mb-3">
                      <span className="text-[#FF6B4A]">I</span>mplication Questions
                    </h3>
                    <p className="text-slate-700 mb-4">
                      Build urgency by exploring consequences. Make the problem feel bigger and more urgent.
                    </p>
                    <div className="bg-slate-50 p-4 rounded space-y-2">
                      <p className="text-sm font-medium text-slate-900">Examples:</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• "If damage rates stay at 5%, what does that cost you annually?"</li>
                        <li>• "How does inconsistent lead time affect your customer satisfaction scores?"</li>
                        <li>• "What happens if you miss your 2025 sustainability targets?"</li>
                        <li>• "Could these delays impact your ability to win new contracts?"</li>
                      </ul>
                    </div>
                    <div className="mt-3 p-3 bg-[#4ECDC4]/10 rounded border border-[#4ECDC4]/30">
                      <p className="text-sm text-slate-700">
                        <strong className="text-[#4ECDC4]">Power Move:</strong> Quantify everything. "$50K in damage" hits harder than "some damage issues."
                      </p>
                    </div>
                  </div>

                  {/* Need-Payoff Questions */}
                  <div className="border-l-4 border-[#4ECDC4] pl-6">
                    <h3 className="text-xl font-medium text-slate-900 mb-3">
                      <span className="text-[#4ECDC4]">N</span>eed-Payoff Questions
                    </h3>
                    <p className="text-slate-700 mb-4">
                      Get prospects to articulate the value of solving the problem. Let them sell themselves.
                    </p>
                    <div className="bg-slate-50 p-4 rounded space-y-2">
                      <p className="text-sm font-medium text-slate-900">Examples:</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• "If you could reduce damage by 80%, what would that mean for your bottom line?"</li>
                        <li>• "How would faster lead times impact your ability to serve customers?"</li>
                        <li>• "What would hitting your sustainability goals do for your brand?"</li>
                        <li>• "If we could cut your packaging costs 20%, where would you invest those savings?"</li>
                      </ul>
                    </div>
                    <div className="mt-3 p-3 bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] text-white rounded">
                      <p className="text-sm">
                        <strong>🎯 The Magic:</strong> When prospects answer need-payoff questions, they're building their own business case for your solution. You're no longer selling - they're buying.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Try This Now */}
                <div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="h-6 w-6 text-[#FFD700]" />
                    <h3 className="text-xl font-light">Try This Now</h3>
                  </div>
                  <p className="mb-4 leading-relaxed">
                    Pick your next sales call. Write out 2-3 questions for each SPIN category. 
                    Practice the flow: Situation → Problem → Implication → Need-Payoff.
                  </p>
                  <p className="text-sm opacity-90">
                    <strong>Bonus Challenge:</strong> Record yourself asking these questions. Listen back. 
                    Are you really listening to answers, or just waiting to pitch?
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* MEDDIC Framework */}
            <Card className="border-2 border-[#FF6B4A] mb-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="h-6 w-6 text-[#FF6B4A]" />
                  <h2 className="text-2xl font-light text-slate-900">MEDDIC Qualification</h2>
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed">
                  MEDDIC helps you qualify deals ruthlessly. If you can't answer all six elements, you don't have a real opportunity - you have a hope.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="border border-slate-200 rounded-lg p-5">
                    <div className="text-lg font-medium text-[#FF6B4A] mb-2">Metrics</div>
                    <p className="text-sm text-slate-700 mb-3">
                      Quantifiable business impact. What's the economic value of solving their problem?
                    </p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
                      <strong>Example:</strong> "Reducing damage from 5% to 1% saves $180K annually"
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-5">
                    <div className="text-lg font-medium text-[#4ECDC4] mb-2">Economic Buyer</div>
                    <p className="text-sm text-slate-700 mb-3">
                      Who controls the budget? Not who you're talking to - who can actually sign the check?
                    </p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
                      <strong>Example:</strong> "VP of Operations has $500K discretionary budget"
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-5">
                    <div className="text-lg font-medium text-[#FF6B4A] mb-2">Decision Criteria</div>
                    <p className="text-sm text-slate-700 mb-3">
                      What factors will they use to choose? Price, quality, service, sustainability?
                    </p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
                      <strong>Example:</strong> "Must meet sustainability goals + 15% cost reduction"
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-5">
                    <div className="text-lg font-medium text-[#4ECDC4] mb-2">Decision Process</div>
                    <p className="text-sm text-slate-700 mb-3">
                      What are the steps from today to signed contract? Who's involved at each stage?
                    </p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
                      <strong>Example:</strong> "Sample → Ops review → Finance approval → Legal (6-8 weeks)"
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-5">
                    <div className="text-lg font-medium text-[#FF6B4A] mb-2">Identify Pain</div>
                    <p className="text-sm text-slate-700 mb-3">
                      What's the critical business problem? Is it urgent enough to act now?
                    </p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
                      <strong>Example:</strong> "Customer complaints up 40% due to damaged goods"
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-5">
                    <div className="text-lg font-medium text-[#4ECDC4] mb-2">Champion</div>
                    <p className="text-sm text-slate-700 mb-3">
                      Who's selling for you when you're not in the room? Who has influence and wants you to win?
                    </p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
                      <strong>Example:</strong> "Packaging engineer loves our solution, reports to VP"
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#FF6B4A]/10 rounded border border-[#FF6B4A]/30">
                  <p className="text-sm text-slate-700">
                    <strong className="text-[#FF6B4A]">Reality Check:</strong> If you can't fill in all six boxes with confidence, 
                    you're not qualified. Go back and do more discovery work before investing time in proposals.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Complete Module Button */}
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setSelectedModule(null)}
                className="border-slate-300"
              >
                Save Progress
              </Button>
              <Button 
                onClick={() => {
                  markComplete('discovery');
                  setSelectedModule(null);
                }}
                className="bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] hover:opacity-90 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Module
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prospecting Module
  if (selectedModule === 'prospecting') {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
            <Link href="/sales-academy">
              <img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16 cursor-pointer" />
            </Link>
            <Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">← Back to Academy</Button>
          </div>
        </header>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#6EDDD5] flex items-center justify-center"><Target className="h-6 w-6 text-white" /></div>
                <div><h1 className="text-3xl font-light text-slate-900">Prospecting & Lead Generation</h1><p className="text-slate-600">Foundation • 45 min • 8 lessons</p></div>
              </div>
            </div>
            <Card className="border-2 border-[#4ECDC4] mb-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6"><Target className="h-6 w-6 text-[#4ECDC4]" /><h2 className="text-2xl font-light text-slate-900">The Prospecting Mindset</h2></div>
                <p className="text-slate-600 mb-8 leading-relaxed">Prospecting isn't about pestering people—it's about finding buyers who have problems you can solve. The best salespeople prospect every day, even when their pipeline is full.</p>
                <div className="space-y-6">
                  <div className="border-l-4 border-[#FF6B4A] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">Ideal Customer Profile (ICP)</h3><p className="text-slate-700 mb-4">Stop wasting time on bad-fit prospects. Define your ICP with precision.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Packaging ICP Example:</p><ul className="text-sm text-slate-700 space-y-1"><li>• <strong>Industry:</strong> Food & Beverage, Consumer Goods, E-commerce</li><li>• <strong>Company Size:</strong> $10M-$500M revenue, 50-500 employees</li><li>• <strong>Pain Points:</strong> Damage issues, sustainability pressure, cost reduction needs</li><li>• <strong>Decision Makers:</strong> VP Operations, Packaging Manager, Procurement Director</li></ul></div></div>
                  <div className="border-l-4 border-[#4ECDC4] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">Multi-Channel Prospecting</h3><p className="text-slate-700 mb-4">Don't rely on one channel. Stack multiple touchpoints for maximum impact.</p><div className="grid sm:grid-cols-2 gap-4"><div className="border border-slate-200 rounded p-3"><div className="text-sm font-medium text-[#FF6B4A] mb-1">LinkedIn Outreach</div><p className="text-xs text-slate-700">Connect → engage with content → personalized message → call</p></div><div className="border border-slate-200 rounded p-3"><div className="text-sm font-medium text-[#4ECDC4] mb-1">Cold Email Sequences</div><p className="text-xs text-slate-700">3-5 email cadence with value in every touch</p></div><div className="border border-slate-200 rounded p-3"><div className="text-sm font-medium text-[#FF6B4A] mb-1">Cold Calling</div><p className="text-xs text-slate-700">Best for urgent needs, high-value accounts</p></div><div className="border border-slate-200 rounded p-3"><div className="text-sm font-medium text-[#4ECDC4] mb-1">Referrals</div><p className="text-xs text-slate-700">Highest close rate—ask every happy customer</p></div></div></div>
                </div>
                <div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg"><div className="flex items-center gap-3 mb-4"><Star className="h-6 w-6 text-[#FFD700]" /><h3 className="text-xl font-light">Try This Now</h3></div><p className="mb-4 leading-relaxed">Build a list of 50 ideal prospects right now. Use LinkedIn Sales Navigator or ZoomInfo. Focus on companies with recent funding, leadership changes, or sustainability announcements.</p></div>
              </CardContent>
            </Card>
            <div className="flex justify-between items-center"><Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">Save Progress</Button><Button onClick={() => { markComplete('prospecting'); setSelectedModule(null); }} className="bg-gradient-to-r from-[#4ECDC4] to-[#6EDDD5] hover:opacity-90 text-white"><CheckCircle className="h-4 w-4 mr-2" />Complete Module</Button></div>
          </div>
        </div>
      </div>
    );
  }

  // Packaging Solution Selling Module
  if (selectedModule === 'packaging_solutions') {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
            <Link href="/sales-academy"><img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16 cursor-pointer" /></Link>
            <Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">← Back to Academy</Button>
          </div>
        </header>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8"><div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#FF6B4A] flex items-center justify-center"><Lightbulb className="h-6 w-6 text-white" /></div><div><div className="flex items-center gap-2"><h1 className="text-3xl font-light text-slate-900">Packaging Solution Selling</h1><span className="text-xs font-medium text-white bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] px-2 py-1 rounded">NEW</span></div><p className="text-slate-600">Intermediate • 55 min • 11 lessons</p></div></div></div>
            <Card className="border-2 border-[#4ECDC4] mb-8"><CardContent className="p-6 sm:p-8"><div className="flex items-center gap-3 mb-6"><Package className="h-6 w-6 text-[#4ECDC4]" /><h2 className="text-2xl font-light text-slate-900">Selling by Application</h2></div><p className="text-slate-600 mb-8 leading-relaxed">Don't sell products—sell solutions to specific applications. Match packaging to the customer's unique needs.</p><div className="space-y-6"><div className="border-l-4 border-[#FF6B4A] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">E-Commerce Packaging</h3><p className="text-slate-700 mb-4">Unboxing experience matters. Damage protection + brand impression + sustainability.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Key Selling Points:</p><ul className="text-sm text-slate-700 space-y-1"><li>• Right-sized boxes reduce dimensional weight charges (save 15-30% on freight)</li><li>• Custom printed mailers create memorable unboxing moments</li><li>• Frustration-free packaging reduces returns and customer complaints</li><li>• Recyclable materials meet consumer expectations</li></ul></div></div><div className="border-l-4 border-[#4ECDC4] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">Food & Beverage Packaging</h3><p className="text-slate-700 mb-4">Safety, shelf life, and compliance are non-negotiable. Shelf appeal drives purchase decisions.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Key Selling Points:</p><ul className="text-sm text-slate-700 space-y-1"><li>• Barrier films extend shelf life and reduce waste</li><li>• FDA-compliant materials ensure regulatory approval</li><li>• High-quality printing differentiates on crowded shelves</li><li>• Resealable features add convenience and value</li></ul></div></div><div className="border-l-4 border-[#FF6B4A] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">Industrial & B2B Packaging</h3><p className="text-slate-700 mb-4">Protection and efficiency matter most. Minimize handling, maximize durability.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Key Selling Points:</p><ul className="text-sm text-slate-700 space-y-1"><li>• Heavy-duty corrugated withstands rough handling and stacking</li><li>• Palletization optimization reduces freight costs</li><li>• Reusable containers lower total cost of ownership</li><li>• Clear labeling and barcoding streamline logistics</li></ul></div></div></div><div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg"><div className="flex items-center gap-3 mb-4"><Star className="h-6 w-6 text-[#FFD700]" /><h3 className="text-xl font-light">Try This Now</h3></div><p className="leading-relaxed">Pick one of your current prospects. Identify their specific application. Write down 3 unique selling points that matter ONLY for their use case.</p></div></CardContent></Card>
            <div className="flex justify-between items-center"><Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">Save Progress</Button><Button onClick={() => { markComplete('packaging_solutions'); setSelectedModule(null); }} className="bg-gradient-to-r from-[#4ECDC4] to-[#FF6B4A] hover:opacity-90 text-white"><CheckCircle className="h-4 w-4 mr-2" />Complete Module</Button></div>
          </div>
        </div>
      </div>
    );
  }

  // Presentation Module
  if (selectedModule === 'presentation') {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between"><Link href="/sales-academy"><img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16 cursor-pointer" /></Link><Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">← Back to Academy</Button></div></header>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"><div className="max-w-4xl mx-auto"><div className="mb-8"><div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#FFD700] flex items-center justify-center"><TrendingUp className="h-6 w-6 text-white" /></div><div><h1 className="text-3xl font-light text-slate-900">Presentation & Demonstration</h1><p className="text-slate-600">Intermediate • 50 min • 9 lessons</p></div></div></div>
            <Card className="border-2 border-[#FF6B4A] mb-8"><CardContent className="p-6 sm:p-8"><div className="flex items-center gap-3 mb-6"><TrendingUp className="h-6 w-6 text-[#FF6B4A]" /><h2 className="text-2xl font-light text-slate-900">Value-Based Presentations</h2></div><p className="text-slate-600 mb-8 leading-relaxed">Stop doing feature dumps. Present business outcomes, not product specs. Focus on what matters to THEM.</p><div className="space-y-6"><div className="border-l-4 border-[#4ECDC4] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">The ROI Story</h3><p className="text-slate-700 mb-4">Every presentation should answer: "What's in it for me?" Quantify the value.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Example ROI Narrative:</p><p className="text-sm text-slate-700 italic">"Based on your 10,000 monthly shipments and 5% damage rate, you're losing $8,300/month. Our packaging reduces damage to under 1%, saving you $85K annually. Implementation cost is $15K, giving you a 2-month payback and 470% ROI in year one."</p></div></div><div className="border-l-4 border-[#FF6B4A] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">Sustainability Selling (Embedded)</h3><p className="text-slate-700 mb-4">Sustainability isn't a nice-to-have—it's a business imperative. Position it as risk mitigation and brand enhancement.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Sustainability Value Drivers:</p><ul className="text-sm text-slate-700 space-y-1"><li>• <strong>Regulatory Compliance:</strong> "Our PCR content meets California SB 54 requirements"</li><li>• <strong>Retailer Scorecards:</strong> "This design improves your Walmart packaging scorecard by 20 points"</li><li>• <strong>Consumer Demand:</strong> "73% of consumers prefer brands with sustainable packaging"</li><li>• <strong>Carbon Reduction:</strong> "Lightweight design cuts your Scope 3 emissions by 15%"</li></ul></div><div className="mt-3 p-3 bg-[#FF6B4A]/10 rounded border border-[#FF6B4A]/30"><p className="text-sm text-slate-700"><strong className="text-[#FF6B4A]">Pro Tip:</strong> Lead with business impact, then mention sustainability as proof of forward thinking. "This saves you money AND helps you hit ESG goals."</p></div></div></div><div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg"><div className="flex items-center gap-3 mb-4"><Star className="h-6 w-6 text-[#FFD700]" /><h3 className="text-xl font-light">Try This Now</h3></div><p className="leading-relaxed">Take your standard pitch deck. Delete every slide that talks about YOUR company. Rebuild it around THEIR problems and the financial impact of solving them.</p></div></CardContent></Card>
            <div className="flex justify-between items-center"><Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">Save Progress</Button><Button onClick={() => { markComplete('presentation'); setSelectedModule(null); }} className="bg-gradient-to-r from-[#FF6B4A] to-[#FFD700] hover:opacity-90 text-white"><CheckCircle className="h-4 w-4 mr-2" />Complete Module</Button></div>
          </div>
        </div>
      </div>
    );
  }

  // Objection Handling Module
  if (selectedModule === 'objections') {
    return (
      <div className="min-h-screen bg-white"><header className="border-b border-slate-200 bg-white sticky top-0 z-50"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between"><Link href="/sales-academy"><img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16 cursor-pointer" /></Link><Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">← Back to Academy</Button></div></header>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"><div className="max-w-4xl mx-auto"><div className="mb-8"><div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#FF6B4A] flex items-center justify-center"><Handshake className="h-6 w-6 text-white" /></div><div><h1 className="text-3xl font-light text-slate-900">Objection Handling</h1><p className="text-slate-600">Advanced • 55 min • 12 lessons</p></div></div></div>
            <Card className="border-2 border-[#4ECDC4] mb-8"><CardContent className="p-6 sm:p-8"><div className="flex items-center gap-3 mb-6"><Handshake className="h-6 w-6 text-[#4ECDC4]" /><h2 className="text-2xl font-light text-slate-900">The Objection Handling Framework</h2></div><p className="text-slate-600 mb-8 leading-relaxed">Objections aren't rejections—they're buying signals. They mean the prospect is engaged and considering a change.</p><div className="space-y-6"><div className="border-l-4 border-[#FF6B4A] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">"Your Price is Too High"</h3><p className="text-slate-700 mb-4">The most common objection. Never defend price—reframe to value.</p><div className="bg-slate-50 p-4 rounded space-y-3"><p className="text-sm font-medium text-slate-900">Response Framework:</p><p className="text-sm text-slate-700"><strong>1. Acknowledge:</strong> "I understand budget is important..."</p><p className="text-sm text-slate-700"><strong>2. Isolate:</strong> "If we could show you how this pays for itself in 3 months, would price still be a concern?"</p><p className="text-sm text-slate-700"><strong>3. Reframe:</strong> "Let's look at total cost of ownership, not just unit price. When you factor in damage reduction and freight savings, you're actually spending LESS."</p></div></div><div className="border-l-4 border-[#4ECDC4] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">"We're Happy with Our Current Supplier"</h3><p className="text-slate-700 mb-4">Translation: "Give me a reason to change." Find the hidden pain.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Response:</p><p className="text-sm text-slate-700 italic">"That's great to hear! Most of our best customers were happy with their previous supplier too—until they saw what they were missing. Can I ask: if there was ONE thing you could improve about your current packaging, what would it be?"</p></div></div><div className="border-l-4 border-[#FF6B4A] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">"We Need to Think About It"</h3><p className="text-slate-700 mb-4">This means you haven't built enough urgency or uncovered the real objection.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Response:</p><p className="text-sm text-slate-700 italic">"Absolutely, this is an important decision. Just so I can help you think it through—what specific aspects are you considering? Is it the implementation timeline, the investment, or something else?"</p></div></div></div><div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg"><div className="flex items-center gap-3 mb-4"><Star className="h-6 w-6 text-[#FFD700]" /><h3 className="text-xl font-light">Try This Now</h3></div><p className="leading-relaxed">Write down the 3 objections you hear most often. Create a response script for each using the Acknowledge → Isolate → Reframe framework. Practice out loud.</p></div></CardContent></Card>
            <div className="flex justify-between items-center"><Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">Save Progress</Button><Button onClick={() => { markComplete('objections'); setSelectedModule(null); }} className="bg-gradient-to-r from-[#4ECDC4] to-[#FF6B4A] hover:opacity-90 text-white"><CheckCircle className="h-4 w-4 mr-2" />Complete Module</Button></div>
          </div>
        </div>
      </div>
    );
  }

  // Negotiation Module
  if (selectedModule === 'negotiation') {
    return (
      <div className="min-h-screen bg-white"><header className="border-b border-slate-200 bg-white sticky top-0 z-50"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between"><Link href="/sales-academy"><img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16 cursor-pointer" /></Link><Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">← Back to Academy</Button></div></header>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"><div className="max-w-4xl mx-auto"><div className="mb-8"><div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] flex items-center justify-center"><Trophy className="h-6 w-6 text-white" /></div><div><h1 className="text-3xl font-light text-slate-900">Negotiation & Closing</h1><p className="text-slate-600">Advanced • 70 min • 14 lessons</p></div></div></div>
            <Card className="border-2 border-[#FF6B4A] mb-8"><CardContent className="p-6 sm:p-8"><div className="flex items-center gap-3 mb-6"><Trophy className="h-6 w-6 text-[#FF6B4A]" /><h2 className="text-2xl font-light text-slate-900">Win-Win Negotiation</h2></div><p className="text-slate-600 mb-8 leading-relaxed">Great negotiators don't "win"—they create value for both sides. Protect your margins while giving the customer what they truly need.</p><div className="space-y-6"><div className="border-l-4 border-[#4ECDC4] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">Packaging Cost Analysis (Embedded)</h3><p className="text-slate-700 mb-4">Understand the REAL cost drivers so you can negotiate intelligently.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Total Cost of Packaging:</p><ul className="text-sm text-slate-700 space-y-1"><li>• <strong>Material Cost:</strong> 40-60% (paper, film, ink, adhesives)</li><li>• <strong>Tooling/Setup:</strong> One-time or amortized over volume</li><li>• <strong>Freight:</strong> 15-25% (dimensional weight, distance)</li><li>• <strong>Storage:</strong> 5-10% (warehouse space, handling)</li><li>• <strong>Damage/Waste:</strong> 5-15% (hidden cost most buyers ignore)</li></ul></div><div className="mt-3 p-3 bg-[#4ECDC4]/10 rounded border border-[#4ECDC4]/30"><p className="text-sm text-slate-700"><strong className="text-[#4ECDC4]">Negotiation Lever:</strong> "If you increase volume by 20%, we can reduce unit cost by 8% by spreading tooling costs and optimizing freight."</p></div></div><div className="border-l-4 border-[#FF6B4A] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">Trade, Don't Cave</h3><p className="text-slate-700 mb-4">Never give discounts without getting something in return. Every concession should be traded.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Trading Examples:</p><ul className="text-sm text-slate-700 space-y-1"><li>• "I can offer 5% off if you commit to a 12-month contract"</li><li>• "We can waive setup fees if you consolidate all SKUs with us"</li><li>• "I'll match their price if you give us a testimonial and referral"</li></ul></div></div><div className="border-l-4 border-[#4ECDC4] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">Closing Techniques</h3><p className="text-slate-700 mb-4">Ask for the business directly. Most deals are lost because reps never ask for the close.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Closing Questions:</p><ul className="text-sm text-slate-700 space-y-1"><li>• <strong>Assumptive:</strong> "When would you like us to start production?"</li><li>• <strong>Alternative:</strong> "Would you prefer delivery on the 15th or 30th?"</li><li>• <strong>Direct:</strong> "Do you want to move forward with this?"</li></ul></div></div></div><div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg"><div className="flex items-center gap-3 mb-4"><Star className="h-6 w-6 text-[#FFD700]" /><h3 className="text-xl font-light">Try This Now</h3></div><p className="leading-relaxed">List 5 things you can trade instead of price: longer contracts, volume commitments, payment terms, exclusivity, referrals. Prepare your trading menu before your next negotiation.</p></div></CardContent></Card>
            <div className="flex justify-between items-center"><Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">Save Progress</Button><Button onClick={() => { markComplete('negotiation'); setSelectedModule(null); }} className="bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] hover:opacity-90 text-white"><CheckCircle className="h-4 w-4 mr-2" />Complete Module</Button></div>
          </div>
        </div>
      </div>
    );
  }

  // Account Management Module
  if (selectedModule === 'account_mgmt') {
    return (
      <div className="min-h-screen bg-white"><header className="border-b border-slate-200 bg-white sticky top-0 z-50"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between"><Link href="/sales-academy"><img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16 cursor-pointer" /></Link><Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">← Back to Academy</Button></div></header>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"><div className="max-w-4xl mx-auto"><div className="mb-8"><div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#9370DB] flex items-center justify-center"><Award className="h-6 w-6 text-white" /></div><div><h1 className="text-3xl font-light text-slate-900">Account Management & Expansion</h1><p className="text-slate-600">Expert • 65 min • 11 lessons</p></div></div></div>
            <Card className="border-2 border-[#4ECDC4] mb-8"><CardContent className="p-6 sm:p-8"><div className="flex items-center gap-3 mb-6"><Award className="h-6 w-6 text-[#4ECDC4]" /><h2 className="text-2xl font-light text-slate-900">Growing Existing Accounts</h2></div><p className="text-slate-600 mb-8 leading-relaxed">It's 5-7x cheaper to grow an existing account than win a new one. The best salespeople treat every customer like a new opportunity.</p><div className="space-y-6"><div className="border-l-4 border-[#FF6B4A] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">The Expansion Playbook</h3><p className="text-slate-700 mb-4">Systematically identify white space and cross-sell opportunities.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">Expansion Strategies:</p><ul className="text-sm text-slate-700 space-y-1"><li>• <strong>Product Expansion:</strong> "You're using our corrugated—have you considered our labels?"</li><li>• <strong>Location Expansion:</strong> "We serve your Ohio facility. What about your Texas plant?"</li><li>• <strong>Volume Expansion:</strong> "You're ordering 10K/month. At 15K we can unlock better pricing."</li><li>• <strong>Service Expansion:</strong> "We could manage your entire packaging supply chain."</li></ul></div></div><div className="border-l-4 border-[#4ECDC4] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">Quarterly Business Reviews</h3><p className="text-slate-700 mb-4">Don't wait for problems. Proactively review performance and identify opportunities.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">QBR Agenda:</p><ul className="text-sm text-slate-700 space-y-1"><li>• Performance metrics (damage rates, on-time delivery, cost savings)</li><li>• Market trends and opportunities</li><li>• New product innovations</li><li>• Strategic planning for next quarter</li></ul></div></div><div className="border-l-4 border-[#FF6B4A] pl-6"><h3 className="text-xl font-medium text-slate-900 mb-3">Building Champions</h3><p className="text-slate-700 mb-4">Your success depends on internal advocates who sell for you when you're not there.</p><div className="bg-slate-50 p-4 rounded space-y-2"><p className="text-sm font-medium text-slate-900">How to Build Champions:</p><ul className="text-sm text-slate-700 space-y-1"><li>• Make them look good to their boss (share success metrics)</li><li>• Provide industry insights and competitive intelligence</li><li>• Respond faster than any other supplier</li><li>• Invite them to industry events and networking</li></ul></div></div></div><div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg"><div className="flex items-center gap-3 mb-4"><Star className="h-6 w-6 text-[#FFD700]" /><h3 className="text-xl font-light">Try This Now</h3></div><p className="leading-relaxed">Pick your top 3 accounts. For each one, identify: (1) One product they don't buy from you yet, (2) One location/division you don't serve, (3) One person you should meet but haven't. Schedule those conversations this week.</p></div></CardContent></Card>
            <div className="flex justify-between items-center"><Button variant="outline" onClick={() => setSelectedModule(null)} className="border-slate-300">Save Progress</Button><Button onClick={() => { markComplete('account_mgmt'); setSelectedModule(null); }} className="bg-gradient-to-r from-[#4ECDC4] to-[#9370DB] hover:opacity-90 text-white"><CheckCircle className="h-4 w-4 mr-2" />Complete Module</Button></div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback placeholder
  if (selectedModule) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
            <Link href="/sales-academy">
              <img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16 cursor-pointer" />
            </Link>
            <Button 
              variant="outline" 
              onClick={() => setSelectedModule(null)}
              className="border-slate-300"
            >
              ← Back to Academy
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-light text-slate-900 mb-4">Module Coming Soon</h1>
            <p className="text-lg text-slate-600 mb-8">
              We're developing comprehensive content for this module. Check back soon!
            </p>
            <Button 
              onClick={() => setSelectedModule(null)}
              className="bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] hover:opacity-90 text-white"
            >
              Return to Academy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16 cursor-pointer" />
            </Link>
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Platform</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Solutions</a>
              <Link href="/sales-academy">
                <a className="text-sm font-medium text-slate-900 border-b-2 border-[#4ECDC4]">Sales Academy</a>
              </Link>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Resources</a>
              <Button
                variant="outline"
                className="border-slate-300"
                onClick={auth.isAuthenticated ? handleSignOut : handleSignIn}
              >
                {auth.isAuthenticated ? "Sign Out" : "Sign In"}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4" />
              Master the Art of Selling
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 mb-6 tracking-tight">
              Sales Academy
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-light leading-relaxed mb-8">
              Learn proven frameworks from SPIN to Challenger. Build skills that close deals and grow accounts. 
              Turn theory into practice with interactive lessons and real-world scenarios.
            </p>

            {/* Progress Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-light text-[#FF6B4A] mb-1">{completedModules.length}/8</div>
                <div className="text-sm text-slate-600">Modules Complete</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-[#4ECDC4] mb-1">62</div>
                <div className="text-sm text-slate-600">Total Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-slate-900 mb-1">7.5h</div>
                <div className="text-sm text-slate-600">Learning Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-light text-slate-900 mb-8">Your Learning Path</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {learningPaths.map((path) => {
              const Icon = path.icon;
              const isCompleted = completedModules.includes(path.id);
              
              return (
                <Card 
                  key={path.id}
                  className={`border-2 transition-all cursor-pointer ${
                    path.unlocked 
                      ? 'hover:shadow-lg hover:scale-[1.02]' 
                      : 'opacity-60 cursor-not-allowed'
                  } ${isCompleted ? 'border-green-500' : 'border-slate-200'}`}
                  onClick={() => handleModuleClick(path.id, path.unlocked)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${path.color} flex items-center justify-center`}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : path.unlocked ? (
                          <Icon className="h-6 w-6 text-white" />
                        ) : (
                          <Lock className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {path.isNew && (
                          <span className="text-xs font-medium text-white bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded">
                          {path.level}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-medium text-slate-900 mb-2">{path.title}</h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{path.description}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {path.lessons} lessons
                      </span>
                      <span>•</span>
                      <span>{path.duration}</span>
                    </div>

                    {isCompleted && (
                      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Completed
                      </div>
                    )}

                    {!path.unlocked && (
                      <div className="text-sm text-slate-500 italic">
                        Complete previous modules to unlock
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sales Frameworks */}
      <div className="bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-light text-slate-900 mb-8">Proven Sales Frameworks</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {frameworks.map((framework, index) => (
                <Card key={index} className={`border-2 ${framework.color} hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-slate-900 mb-2">{framework.name}</h3>
                    <p className="text-sm text-slate-700 mb-4 leading-relaxed">{framework.description}</p>
                    <div className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-200">
                      <strong>Best for:</strong> {framework.useCase}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardContent className="p-8 sm:p-12 text-center">
              <Trophy className="h-12 w-12 text-[#FFD700] mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-light mb-4">Ready to Level Up?</h2>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                Start with Packaging Industry Fundamentals to build your foundation, then master 
                Discovery & Qualification with SPIN and MEDDIC.
              </p>
              <Button 
                onClick={() => handleModuleClick('packaging_fundamentals', true)}
                className="bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] hover:opacity-90 text-white px-8 py-6 text-lg h-auto"
              >
                Start Learning Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
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
