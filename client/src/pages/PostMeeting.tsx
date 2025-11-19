import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key, ArrowLeft, ArrowRight, FileText, DollarSign, Map, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface Question {
  id: string;
  question: string;
  type: 'select' | 'multi-select' | 'text' | 'textarea' | 'customer-select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  conditional?: boolean;
  showIf?: (answers: Record<string, any>) => boolean;
}

const customers = [
  "Acme Wholesale",
  "P&Q Distribution",
  "Globex Corporation",
  "Initech Logistics",
  "Vandelay Industries",
  "Hooli Supply Chain",
  "Pied Piper Packaging",
  "Stark Industries",
  "Wayne Enterprises",
  "Umbrella Corporation"
];

const questions: Question[] = [
  {
    id: 'customer',
    question: 'Select customer account',
    type: 'customer-select'
  },
  {
    id: 'q1',
    question: 'What is the main objective of this project?',
    type: 'select',
    options: [
      { value: 'new_product_launch', label: 'New product launch' },
      { value: 'improve_existing', label: 'Improve existing packaging' },
      { value: 'cost_efficiency_review', label: 'Cost/efficiency review' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'q2',
    question: 'Which packaging layer(s) are relevant?',
    type: 'multi-select',
    options: [
      { value: 'primary', label: 'Primary (product-contact) packaging' },
      { value: 'secondary', label: 'Secondary (retail/branding) packaging' },
      { value: 'tertiary', label: 'Tertiary (shipping) packaging' },
      { value: 'protective', label: 'Protective / cushioning' },
      { value: 'flexible', label: 'Flexible packaging & bags' },
      { value: 'labels', label: 'Labels & adhesives' },
      { value: 'pallets', label: 'Pallets & skids' },
      { value: 'machinery', label: 'Packaging machinery & equipment' },
      { value: 'not_sure', label: 'Not sure' }
    ]
  },
  {
    id: 'q3',
    question: 'What best describes your product?',
    type: 'multi-select',
    options: [
      { value: 'solid_regular', label: 'Solid, regular shape' },
      { value: 'irregular_fragile', label: 'Irregular or fragile shape' },
      { value: 'liquid_powder', label: 'Liquid, powder, or granular' },
      { value: 'temperature_sensitive', label: 'Temperature-sensitive' },
      { value: 'moisture_sensitive', label: 'Moisture-sensitive' },
      { value: 'hazardous', label: 'Hazardous / regulated' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'q4',
    question: 'What is the typical product weight & size range?',
    type: 'select',
    options: [
      { value: 'small', label: '< 5 lbs, < 0.5 cu ft' },
      { value: 'medium', label: '5–25 lbs, medium size' },
      { value: 'large', label: '25–50 lbs, large' },
      { value: 'oversized', label: '50 lbs or oversized' }
    ]
  },
  {
    id: 'q5',
    question: 'Which shipping method(s) do you use most often?',
    type: 'multi-select',
    options: [
      { value: 'parcel', label: 'Parcel / small package' },
      { value: 'pallet_ltl', label: 'Pallet / LTL' },
      { value: 'full_truckload', label: 'Full truckload' },
      { value: 'airfreight', label: 'Airfreight' },
      { value: 'sea_freight', label: 'Sea freight' }
    ]
  },
  {
    id: 'q6',
    question: "What's the typical shipping distance and storage duration?",
    type: 'multi-select',
    options: [
      { value: 'local_regional', label: 'Local / regional (< 200 miles)' },
      { value: 'domestic', label: 'Domestic (national)' },
      { value: 'international', label: 'International' },
      { value: 'storage_short', label: 'Storage < 1 month' },
      { value: 'storage_medium', label: 'Storage 1–6 months' },
      { value: 'storage_long', label: 'Storage > 6 months' }
    ]
  },
  {
    id: 'q7',
    question: 'What is your expected order volume & frequency?',
    type: 'select',
    options: [
      { value: 'small_orders', label: '< 100 units per order' },
      { value: 'medium_orders', label: '100–1,000 units per order' },
      { value: 'large_orders', label: '> 1,000 units per order' },
      { value: 'one_off', label: 'One-off orders' },
      { value: 'weekly', label: 'Recurring weekly' },
      { value: 'monthly', label: 'Recurring monthly' },
      { value: 'quarterly', label: 'Recurring quarterly' }
    ]
  },
  {
    id: 'q8',
    question: 'What packaging are you using today?',
    type: 'multi-select',
    conditional: true,
    showIf: (answers) => answers.q1 === 'improve_existing' || answers.q1 === 'cost_efficiency_review',
    options: [
      { value: 'standard_boxes', label: 'Standard boxes & void fill' },
      { value: 'custom_engineered', label: 'Custom engineered packaging' },
      { value: 'none', label: 'None / starting from scratch' },
      { value: 'too_expensive', label: 'Current solution: Too expensive' },
      { value: 'not_protective', label: 'Current solution: Not protective enough' },
      { value: 'too_bulky', label: 'Current solution: Too bulky / heavy' },
      { value: 'not_sustainable', label: 'Current solution: Not sustainable' },
      { value: 'hard_assemble', label: 'Current solution: Hard to assemble' },
      { value: 'other_issues', label: 'Current solution: Other issues' }
    ]
  },
  {
    id: 'q9',
    question: 'What are your top priorities or pain points?',
    type: 'multi-select',
    options: [
      { value: 'reduce_damage', label: 'Reduce product damage' },
      { value: 'reduce_cost', label: 'Reduce cost / dimensional weight penalties' },
      { value: 'sustainability', label: 'Improve sustainability' },
      { value: 'compliance', label: 'Meet compliance requirements' },
      { value: 'branding', label: 'Enhance branding / customer experience' },
      { value: 'operations', label: 'Streamline assembly & operations' },
      { value: 'custom_design', label: 'Custom packaging design' }
    ]
  },
  {
    id: 'q10',
    question: 'Do you have compliance requirements?',
    type: 'multi-select',
    options: [
      { value: 'food_grade', label: 'Food-grade' },
      { value: 'pharmaceutical', label: 'Pharmaceutical / sterile' },
      { value: 'hazardous', label: 'Hazardous (UN certified)' },
      { value: 'none', label: 'None' }
    ]
  },
  {
    id: 'q11',
    question: 'What level of branding or customization do you need?',
    type: 'select',
    options: [
      { value: 'no_branding', label: 'No branding (stock packaging)' },
      { value: 'basic_logo', label: 'Basic logo & color' },
      { value: 'full_custom', label: 'Full custom print & design' },
      { value: 'not_sure', label: 'Not sure' }
    ]
  },
  {
    id: 'q12',
    question: 'How sensitive are you to cost vs performance?',
    type: 'select',
    options: [
      { value: 'cost_critical', label: 'Cost is most critical' },
      { value: 'balanced', label: 'Balanced cost & performance' },
      { value: 'premium', label: 'Premium quality & brand experience' }
    ]
  },
  {
    id: 'q13',
    question: 'Do you require automation or line compatibility?',
    type: 'select',
    options: [
      { value: 'manual_only', label: 'Manual packing only' },
      { value: 'prefer_automation', label: 'Prefer automation-compatible solutions' },
      { value: 'require_automation', label: 'Require automation-compatible solutions' },
      { value: 'not_sure', label: 'Not sure' }
    ]
  },
  {
    id: 'q14',
    question: 'Do you have supplier preferences or restrictions?',
    type: 'select',
    options: [
      { value: 'no_preference', label: 'No preference' },
      { value: 'domestic_only', label: 'Domestic suppliers only' },
      { value: 'international_ok', label: 'International suppliers acceptable' },
      { value: 'pre_approved', label: 'Pre-approved vendor list' }
    ]
  }
];


const crossSellQuestions = [
  {
    id: 'equipment_type',
    question: 'What type of print equipment does your customer operate?',
    type: 'multi-select',
    options: [
      { value: 'hp_latex', label: 'HP Latex wide-format printers' },
      { value: 'offset_press', label: 'Offset lithography presses' },
      { value: 'digital_press', label: 'Digital production presses' },
      { value: 'none', label: 'No print equipment (paper only)' }
    ]
  },
  {
    id: 'press_models',
    question: 'What specific press models do they operate? (if applicable)',
    type: 'text',
    placeholder: 'e.g., Heidelberg Speedmaster XL 106, HP Latex 800W',
    conditional: true,
    showIf: (answers: any) => answers.equipment_type?.includes('hp_latex') || answers.equipment_type?.includes('offset_press')
  },
  {
    id: 'monthly_volume',
    question: 'What is their approximate monthly production volume?',
    type: 'select',
    options: [
      { value: 'low', label: 'Low volume (500-1,000 plates/month or equivalent)' },
      { value: 'medium', label: 'Medium volume (1,000-1,500 plates/month)' },
      { value: 'high', label: 'High volume (1,500+ plates/month)' },
      { value: 'unknown', label: 'Unknown - need discovery call' }
    ],
    conditional: true,
    showIf: (answers: any) => answers.equipment_type?.includes('hp_latex') || answers.equipment_type?.includes('offset_press')
  },
  {
    id: 'current_spend',
    question: 'What is their estimated annual spend on consumables (inks, plates, chemistry)?',
    type: 'select',
    options: [
      { value: 'small', label: '$50K-$100K/year' },
      { value: 'medium', label: '$100K-$200K/year' },
      { value: 'large', label: '$200K-$350K/year' },
      { value: 'unknown', label: 'Unknown - need discovery call' }
    ],
    conditional: true,
    showIf: (answers: any) => answers.equipment_type?.includes('hp_latex') || answers.equipment_type?.includes('offset_press')
  },
  {
    id: 'current_suppliers',
    question: 'Who are their current primary suppliers for print consumables?',
    type: 'multi-select',
    options: [
      { value: 'manufacturer_direct', label: 'Manufacturer direct (HP, Kodak, Fujifilm, etc.)' },
      { value: 'regional_distributor', label: 'Regional distributor' },
      { value: 'multiple_vendors', label: 'Multiple vendors (seeking consolidation)' },
      { value: 'unknown', label: 'Unknown' }
    ],
    conditional: true,
    showIf: (answers: any) => answers.equipment_type?.includes('hp_latex') || answers.equipment_type?.includes('offset_press')
  },
  {
    id: 'pain_points',
    question: 'What are their main pain points with current suppliers?',
    type: 'multi-select',
    options: [
      { value: 'pricing', label: 'High pricing / seeking cost savings' },
      { value: 'availability', label: 'Inconsistent product availability' },
      { value: 'service', label: 'Poor service or technical support' },
      { value: 'consolidation', label: 'Too many vendors to manage' },
      { value: 'delivery', label: 'Delivery delays or logistics issues' },
      { value: 'none', label: 'Generally satisfied' }
    ],
    conditional: true,
    showIf: (answers: any) => answers.equipment_type?.includes('hp_latex') || answers.equipment_type?.includes('offset_press')
  }
];


export default function PostMeeting() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOutput, setSelectedOutput] = useState<'solution' | 'cost' | 'roadmap' | 'crosssell'>('solution');
  const [crossSellStarted, setCrossSellStarted] = useState(false);
  const [crossSellQuestion, setCrossSellQuestion] = useState(0);
  const [crossSellAnswers, setCrossSellAnswers] = useState<Record<string, any>>({});
  const [crossSellComplete, setCrossSellComplete] = useState(false);

  const visibleQuestions = questions.filter(q => 
    !q.conditional || (q.showIf && q.showIf(answers))
  );

  const currentQ = visibleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / visibleQuestions.length) * 100;

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  };

  const handleMultiSelect = (value: string) => {
    const current = answers[currentQ.id] || [];
    const newValue = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    setAnswers(prev => ({ ...prev, [currentQ.id]: newValue }));
  };

  const handleNext = () => {
    if (currentQuestion < visibleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      processAnswers();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const processAnswers = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setShowResults(true);
    setIsProcessing(false);
  };

  const isAnswered = () => {
    const answer = answers[currentQ.id];
    if (currentQ.type === 'multi-select') {
      return answer && answer.length > 0;
    }
    return answer !== undefined && answer !== '';
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-200 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
            <img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16" />
            <Link href="/">
              <Button variant="outline" className="border-slate-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-light text-slate-900 mb-4">Analysis Complete</h1>
              <p className="text-lg text-slate-600 font-light">
                For {answers.customer} — Generated {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Output Selector */}
            <div className="flex gap-4 mb-8 border-b border-slate-200">
              <button
                onClick={() => setSelectedOutput('solution')}
                className={`pb-4 px-6 text-sm font-medium transition-colors ${
                  selectedOutput === 'solution'
                    ? 'text-slate-900 border-b-2 border-[#FF6B4A]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Solution Recommendations
              </button>
              <button
                onClick={() => setSelectedOutput('cost')}
                className={`pb-3 sm:pb-4 px-3 sm:px-6 text-xs sm:text-sm font-medium transition-colors ${
                  selectedOutput === 'cost'
                    ? 'text-slate-900 border-b-2 border-[#FF6B4A]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <DollarSign className="h-4 w-4 inline mr-2" />
                Cost-Benefit Analysis
              </button>
              <button
                onClick={() => setSelectedOutput('roadmap')}
                className={`pb-4 px-6 text-sm font-medium transition-colors ${
                  selectedOutput === 'roadmap'
                    ? 'text-slate-900 border-b-2 border-[#FF6B4A]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Map className="h-4 w-4 inline mr-2" />
                Implementation Roadmap
              </button>
              <button
                onClick={() => setSelectedOutput('crosssell')}
                className={`pb-4 px-6 text-sm font-medium transition-colors ${
                  selectedOutput === 'crosssell'
                    ? 'text-slate-900 border-b-2 border-[#4ECDC4]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <TrendingUp className="h-4 w-4 inline mr-2" />
                Cross-Sell Opportunities
              </button>
            </div>

            {/* Solution Recommendations */}
            {selectedOutput === 'solution' && (
              <Card className="border border-slate-200">
                <CardContent className="p-6 sm:p-8 lg:p-12">
                  <h2 className="text-xl sm:text-2xl font-light text-slate-900 mb-6 sm:mb-8">Packaging Solution Recommendations</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Executive Summary</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Based on the analysis of {answers.customer}'s requirements, we recommend a multi-layered packaging approach 
                        that balances cost efficiency with product protection. The primary focus should be on {answers.q9?.join(', ') || 'optimization'}.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Recommended Solutions</h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-[#FF6B4A] pl-6 py-2">
                          <div className="font-medium text-slate-900 mb-2">Primary Packaging Solution</div>
                          <p className="text-sm text-slate-600">Custom corrugated containers with optimized dimensions for {answers.q4} products</p>
                          <div className="mt-2 text-sm text-slate-500">Estimated cost: $2.40 per unit</div>
                        </div>
                        <div className="border-l-4 border-[#4ECDC4] pl-6 py-2">
                          <div className="font-medium text-slate-900 mb-2">Protective Materials</div>
                          <p className="text-sm text-slate-600">Biodegradable cushioning materials for sustainable protection</p>
                          <div className="mt-2 text-sm text-slate-500">Estimated cost: $0.85 per unit</div>
                        </div>
                        <div className="border-l-4 border-[#4ECDC4] pl-6 py-2">
                          <div className="font-medium text-slate-900 mb-2">Shipping Optimization</div>
                          <p className="text-sm text-slate-600">Dimensional weight optimization for {answers.q5?.join(', ') || 'shipping'}</p>
                          <div className="mt-2 text-sm text-slate-500">Estimated savings: 18% on freight costs</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Qualified Suppliers</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border border-slate-200 p-4 rounded">
                          <div className="font-medium text-slate-900 mb-1">International Paper</div>
                          <div className="text-sm text-slate-600 mb-2">Corrugated packaging solutions</div>
                          <div className="text-xs text-slate-500">Lead time: 2-3 weeks | MOQ: 5,000 units</div>
                        </div>
                        <div className="border border-slate-200 p-4 rounded">
                          <div className="font-medium text-slate-900 mb-1">Sealed Air</div>
                          <div className="text-sm text-slate-600 mb-2">Protective packaging materials</div>
                          <div className="text-xs text-slate-500">Lead time: 1-2 weeks | MOQ: 2,500 units</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost-Benefit Analysis */}
            {selectedOutput === 'cost' && (
              <Card className="border border-slate-200">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                  <h2 className="text-xl sm:text-2xl font-light text-slate-900 mb-6 sm:mb-8">Cost-Benefit Analysis</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Financial Projections</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-6 rounded">
                          <div className="text-sm text-slate-600 mb-2">Current Annual Cost</div>
                          <div className="text-3xl font-light text-slate-900">$485K</div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded">
                          <div className="text-sm text-slate-600 mb-2">Projected Annual Cost</div>
                          <div className="text-3xl font-light text-slate-900">$398K</div>
                        </div>
                        <div className="bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] text-white p-6 rounded">
                          <div className="text-sm opacity-80 mb-2">Annual Savings</div>
                          <div className="text-3xl font-light">$87K</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Cost Breakdown</h3>
                      <table className="w-full">
                        <thead className="border-b border-slate-200">
                          <tr className="text-left">
                            <th className="pb-3 text-sm font-medium text-slate-900">Category</th>
                            <th className="pb-3 text-sm font-medium text-slate-900 text-right">Current</th>
                            <th className="pb-3 text-sm font-medium text-slate-900 text-right">Proposed</th>
                            <th className="pb-3 text-sm font-medium text-slate-900 text-right">Savings</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-b border-slate-100">
                            <td className="py-3 text-slate-600">Materials</td>
                            <td className="py-3 text-slate-900 text-right">$285,000</td>
                            <td className="py-3 text-slate-900 text-right">$238,000</td>
                            <td className="py-3 text-green-600 text-right font-medium">$47,000</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-3 text-slate-600">Freight</td>
                            <td className="py-3 text-slate-900 text-right">$145,000</td>
                            <td className="py-3 text-slate-900 text-right">$119,000</td>
                            <td className="py-3 text-green-600 text-right font-medium">$26,000</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-3 text-slate-600">Damage/Returns</td>
                            <td className="py-3 text-slate-900 text-right">$55,000</td>
                            <td className="py-3 text-slate-900 text-right">$41,000</td>
                            <td className="py-3 text-green-600 text-right font-medium">$14,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">ROI Timeline</h3>
                      <p className="text-slate-600 mb-4">
                        Initial investment of $45,000 for tooling and setup. Payback period: 6.2 months
                      </p>
                      <div className="bg-slate-50 p-6 rounded">
                        <div className="text-sm text-slate-600 mb-2">3-Year Net Benefit</div>
                        <div className="text-3xl font-light text-slate-900">$216,000</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Implementation Roadmap */}
            {selectedOutput === 'roadmap' && (
              <Card className="border border-slate-200">
                <CardContent className="p-6 sm:p-8 lg:p-12">
                  <h2 className="text-xl sm:text-2xl font-light text-slate-900 mb-6 sm:mb-8">Implementation Roadmap</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Phase 1: Planning & Design (Weeks 1-4)</h3>
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <div className="w-2 h-2 bg-[#FF6B4A] rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">Finalize specifications</div>
                            <div className="text-sm text-slate-600">Review and approve packaging designs with stakeholders</div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-2 h-2 bg-[#FF6B4A] rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">Supplier selection</div>
                            <div className="text-sm text-slate-600">Issue RFQs and negotiate contracts</div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-2 h-2 bg-[#FF6B4A] rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">Tooling & prototypes</div>
                            <div className="text-sm text-slate-600">Order custom tooling and produce samples</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Phase 2: Testing & Validation (Weeks 5-8)</h3>
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">Performance testing</div>
                            <div className="text-sm text-slate-600">ISTA testing for drop, vibration, and compression</div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">Line trials</div>
                            <div className="text-sm text-slate-600">Test packaging on production lines</div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">Refinements</div>
                            <div className="text-sm text-slate-600">Adjust designs based on test results</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Phase 3: Rollout (Weeks 9-12)</h3>
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">Pilot production</div>
                            <div className="text-sm text-slate-600">Initial production run of 10,000 units</div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">Training</div>
                            <div className="text-sm text-slate-600">Train warehouse staff on new packaging procedures</div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">Full deployment</div>
                            <div className="text-sm text-slate-600">Transition to new packaging across all facilities</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded">
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Key Milestones</h3>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-600 mb-1">Week 4</div>
                          <div className="font-medium text-slate-900">Contracts signed</div>
                        </div>
                        <div>
                          <div className="text-slate-600 mb-1">Week 8</div>
                          <div className="font-medium text-slate-900">Testing complete</div>
                        </div>
                        <div>
                          <div className="text-slate-600 mb-1">Week 12</div>
                          <div className="font-medium text-slate-900">Full deployment</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cross-Sell Opportunities */}
            {/* Cross-Sell Opportunities */}
            {selectedOutput === 'crosssell' && (
              <Card className="border border-slate-200">
                <CardContent className="p-6 sm:p-8 lg:p-12">
                  {!crossSellStarted ? (
                    /* Initial State - Start Button */
                    <div className="text-center py-12">
                      <TrendingUp className="h-16 w-16 text-[#4ECDC4] mx-auto mb-6" />
                      <h2 className="text-2xl font-light text-slate-900 mb-4">Cross-Sell Analysis for {answers.customer}</h2>
                      <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                        Identify opportunities to expand from paper sales to print equipment consumables. 
                        Answer a few questions about your customer's print operations to generate tailored recommendations.
                      </p>
                      <Button
                        onClick={() => setCrossSellStarted(true)}
                        className="bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] hover:opacity-90 text-white px-8 py-6 text-lg"
                      >
                        Start Cross-Sell Analysis
                      </Button>
                    </div>
                  ) : !crossSellComplete ? (
                    /* Question Workflow */
                    <div>
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-light text-slate-900">Equipment Discovery</h2>
                          <span className="text-sm text-slate-500">
                            Question {crossSellQuestion + 1} of {crossSellQuestions.filter(q => !q.conditional || (q.showIf && q.showIf(crossSellAnswers))).length}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#FF6B4A] to-[#4ECDC4] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((crossSellQuestion + 1) / crossSellQuestions.filter(q => !q.conditional || (q.showIf && q.showIf(crossSellAnswers))).length) * 100}%` }}
                          />
                        </div>
                      </div>

                      {(() => {
                        const visibleCrossSellQuestions = crossSellQuestions.filter(q => 
                          !q.conditional || (q.showIf && q.showIf(crossSellAnswers))
                        );
                        const currentCrossSellQ = visibleCrossSellQuestions[crossSellQuestion];

                        return (
                          <div className="space-y-6">
                            <h3 className="text-lg font-medium text-slate-900">{currentCrossSellQ.question}</h3>

                            {currentCrossSellQ.type === 'select' && (
                              <Select
                                value={crossSellAnswers[currentCrossSellQ.id] || ''}
                                onValueChange={(value) => setCrossSellAnswers(prev => ({ ...prev, [currentCrossSellQ.id]: value }))}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select an option..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {currentCrossSellQ.options?.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}

                            {currentCrossSellQ.type === 'multi-select' && (
                              <div className="space-y-3">
                                {currentCrossSellQ.options?.map(opt => (
                                  <div key={opt.value} className="flex items-center gap-3 p-4 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                                    onClick={() => {
                                      const current = crossSellAnswers[currentCrossSellQ.id] || [];
                                      const newValue = current.includes(opt.value)
                                        ? current.filter((v: string) => v !== opt.value)
                                        : [...current, opt.value];
                                      setCrossSellAnswers(prev => ({ ...prev, [currentCrossSellQ.id]: newValue }));
                                    }}
                                  >
                                    <Checkbox
                                      checked={(crossSellAnswers[currentCrossSellQ.id] || []).includes(opt.value)}
                                    />
                                    <span className="text-slate-700">{opt.label}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {currentCrossSellQ.type === 'text' && (
                              <Input
                                value={crossSellAnswers[currentCrossSellQ.id] || ''}
                                onChange={(e) => setCrossSellAnswers(prev => ({ ...prev, [currentCrossSellQ.id]: e.target.value }))}
                                placeholder={currentCrossSellQ.placeholder}
                                className="w-full"
                              />
                            )}

                            <div className="flex gap-4 pt-6">
                              {crossSellQuestion > 0 && (
                                <Button
                                  onClick={() => setCrossSellQuestion(prev => prev - 1)}
                                  variant="outline"
                                  className="border-slate-300"
                                >
                                  <ArrowLeft className="h-4 w-4 mr-2" />
                                  Back
                                </Button>
                              )}
                              <Button
                                onClick={() => {
                                  if (crossSellQuestion < visibleCrossSellQuestions.length - 1) {
                                    setCrossSellQuestion(prev => prev + 1);
                                  } else {
                                    setCrossSellComplete(true);
                                  }
                                }}
                                disabled={!crossSellAnswers[currentCrossSellQ.id] || (currentCrossSellQ.type === 'multi-select' && crossSellAnswers[currentCrossSellQ.id]?.length === 0)}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                              >
                                {crossSellQuestion === visibleCrossSellQuestions.length - 1 ? (
                                  'Generate Recommendations'
                                ) : (
                                  <>
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* Results Display */
                    <div>
                      <h2 className="text-xl sm:text-2xl font-light text-slate-900 mb-6 sm:mb-8">Cross-Sell Opportunities for {answers.customer}</h2>
                      
                      <div className="space-y-8">
                        {/* Accuracy Indicator */}
                        <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#FF6B4A]/10 border border-[#4ECDC4] p-6 rounded">
                          <div className="flex items-start gap-4">
                            <TrendingUp className="h-6 w-6 text-[#4ECDC4] flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="text-lg font-medium text-slate-900 mb-2">
                                Analysis Accuracy: {crossSellAnswers.press_models && crossSellAnswers.monthly_volume && crossSellAnswers.current_spend ? '85-90%' : '60-75%'}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {crossSellAnswers.press_models && crossSellAnswers.monthly_volume && crossSellAnswers.current_spend 
                                  ? 'Based on detailed equipment and spend data provided. Ready for precise proposal generation.'
                                  : 'Based on industry data and typical operations. Schedule a discovery call for precise recommendations.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* HP Latex Cross-Sell - Show only if they have HP Latex equipment */}
                        {crossSellAnswers.equipment_type?.includes('hp_latex') && (
                          <div>
                            <h3 className="text-lg font-medium text-slate-900 mb-4">Opportunity 1: HP Latex Wide-Format Printer Consumables</h3>
                            <p className="text-slate-600 mb-6">
                              Based on {answers.customer}'s HP Latex equipment, we can provide a complete consumables and maintenance program.
                            </p>
                            
                            <div className="space-y-4">
                              <div className="border-l-4 border-[#FF6B4A] pl-6 py-3">
                                <div className="font-medium text-slate-900 mb-2">HP Latex Inks (6-Color System)</div>
                                <div className="text-sm text-slate-600 mb-3">775ml cartridges in CMYK + Light Cyan + Light Magenta</div>
                                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <div className="text-xs text-slate-500">HP Direct</div>
                                    <div className="font-medium text-slate-900">$48,000/year</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">Authorized Distributor</div>
                                    <div className="font-medium text-slate-900">$45,500/year</div>
                                  </div>
                                  <div className="bg-[#4ECDC4]/10 p-2 rounded">
                                    <div className="text-xs text-[#4ECDC4] font-medium">Kelly Spicers</div>
                                    <div className="font-medium text-slate-900">$42,000/year</div>
                                    <div className="text-xs text-green-600">Save $6,000</div>
                                  </div>
                                </div>
                              </div>

                              <div className="border-l-4 border-[#4ECDC4] pl-6 py-3">
                                <div className="font-medium text-slate-900 mb-2">HP Latex Optimizer & Cleaning Cartridges</div>
                                <div className="text-sm text-slate-600 mb-3">Essential for print quality and maintenance</div>
                                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <div className="text-xs text-slate-500">HP Direct</div>
                                    <div className="font-medium text-slate-900">$8,500/year</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">Authorized Distributor</div>
                                    <div className="font-medium text-slate-900">$8,200/year</div>
                                  </div>
                                  <div className="bg-[#4ECDC4]/10 p-2 rounded">
                                    <div className="text-xs text-[#4ECDC4] font-medium">Kelly Spicers</div>
                                    <div className="font-medium text-slate-900">$7,400/year</div>
                                    <div className="text-xs text-green-600">Save $1,100</div>
                                  </div>
                                </div>
                              </div>

                              <div className="border-l-4 border-[#FF6B4A] pl-6 py-3">
                                <div className="font-medium text-slate-900 mb-2">HP 881 Latex Printheads (6-Pack)</div>
                                <div className="text-sm text-slate-600 mb-3">Replacement every 12-18 months with installation support</div>
                                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <div className="text-xs text-slate-500">HP Direct</div>
                                    <div className="font-medium text-slate-900">$6,500/cycle</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">Authorized Distributor</div>
                                    <div className="font-medium text-slate-900">$6,200/cycle</div>
                                  </div>
                                  <div className="bg-[#4ECDC4]/10 p-2 rounded">
                                    <div className="text-xs text-[#4ECDC4] font-medium">Kelly Spicers</div>
                                    <div className="font-medium text-slate-900">$5,700/cycle</div>
                                    <div className="text-xs text-green-600">Save $800</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] text-white p-6 rounded">
                              <div className="text-sm opacity-90 mb-2">Total HP Latex Program Savings</div>
                              <div className="text-3xl font-light mb-2">$9,100/year</div>
                              <div className="text-sm opacity-90">13% overall savings vs. HP Direct | Single vendor consolidation</div>
                            </div>
                          </div>
                        )}

                        {/* Offset Lithography Cross-Sell - Show only if they have offset presses */}
                        {crossSellAnswers.equipment_type?.includes('offset_press') && (
                          <div>
                            <h3 className="text-lg font-medium text-slate-900 mb-4">
                              {crossSellAnswers.equipment_type?.includes('hp_latex') ? 'Opportunity 2:' : 'Opportunity 1:'} Offset Lithography Consumables Program
                            </h3>
                            <p className="text-slate-600 mb-6">
                              Based on {answers.customer}'s offset lithography operations, we can provide a complete consumables package including plates, inks, chemistry, and maintenance.
                            </p>
                            
                            <div className="space-y-4">
                              <div className="border-l-4 border-[#4ECDC4] pl-6 py-3">
                                <div className="font-medium text-slate-900 mb-2">Printing Plates (Thermal CTP)</div>
                                <div className="text-sm text-slate-600 mb-3">Kodak Sonora, Fujifilm Brillia HD, or Agfa Energy Elite</div>
                                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <div className="text-xs text-slate-500">Manufacturer Direct</div>
                                    <div className="font-medium text-slate-900">$55,000-$58,000/year</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">Regional Distributor</div>
                                    <div className="font-medium text-slate-900">$50,000-$53,000/year</div>
                                  </div>
                                  <div className="bg-[#4ECDC4]/10 p-2 rounded">
                                    <div className="text-xs text-[#4ECDC4] font-medium">Kelly Spicers</div>
                                    <div className="font-medium text-slate-900">$46,300-$52,000/year</div>
                                    <div className="text-xs text-green-600">Save $6,000+</div>
                                  </div>
                                </div>
                              </div>

                              <div className="border-l-4 border-[#FF6B4A] pl-6 py-3">
                                <div className="font-medium text-slate-900 mb-2">Offset Printing Inks</div>
                                <div className="text-sm text-slate-600 mb-3">INX, Huber Group, Flint Group, or Sun Chemical systems</div>
                                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <div className="text-xs text-slate-500">Ink Manufacturer Direct</div>
                                    <div className="font-medium text-slate-900">$78,000-$90,000/year</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">Printing Supply Distributor</div>
                                    <div className="font-medium text-slate-900">$72,000-$82,000/year</div>
                                  </div>
                                  <div className="bg-[#4ECDC4]/10 p-2 rounded">
                                    <div className="text-xs text-[#4ECDC4] font-medium">Kelly Spicers</div>
                                    <div className="font-medium text-slate-900">$68,000-$75,000/year</div>
                                    <div className="text-xs text-green-600">Save $10,000-$15,000</div>
                                  </div>
                                </div>
                              </div>

                              <div className="border-l-4 border-[#4ECDC4] pl-6 py-3">
                                <div className="font-medium text-slate-900 mb-2">Fountain Solutions & Press Chemicals</div>
                                <div className="text-sm text-slate-600 mb-3">Varn, Fujifilm, or Anchor chemistry with wash and cleaners</div>
                                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <div className="text-xs text-slate-500">Chemistry Manufacturer</div>
                                    <div className="font-medium text-slate-900">$16,500-$18,000/year</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">Regional Distributor</div>
                                    <div className="font-medium text-slate-900">$14,500-$16,000/year</div>
                                  </div>
                                  <div className="bg-[#4ECDC4]/10 p-2 rounded">
                                    <div className="text-xs text-[#4ECDC4] font-medium">Kelly Spicers</div>
                                    <div className="font-medium text-slate-900">$12,000-$14,000/year</div>
                                    <div className="text-xs text-green-600">Save $4,000+</div>
                                  </div>
                                </div>
                              </div>

                              <div className="border-l-4 border-[#FF6B4A] pl-6 py-3">
                                <div className="font-medium text-slate-900 mb-2">Blankets & Rollers</div>
                                <div className="text-sm text-slate-600 mb-3">ContiAir, Reeves, Day International with scheduled replacement</div>
                                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <div className="text-xs text-slate-500">Manufacturer Direct</div>
                                    <div className="font-medium text-slate-900">$22,000-$28,000/year</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">Press Parts Distributor</div>
                                    <div className="font-medium text-slate-900">$18,000-$24,000/year</div>
                                  </div>
                                  <div className="bg-[#4ECDC4]/10 p-2 rounded">
                                    <div className="text-xs text-[#4ECDC4] font-medium">Kelly Spicers</div>
                                    <div className="font-medium text-slate-900">$15,000-$20,000/year</div>
                                    <div className="text-xs text-green-600">Save $5,000-$8,000</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 bg-gradient-to-br from-[#4ECDC4] to-[#FF6B4A] text-white p-6 rounded">
                              <div className="text-sm opacity-90 mb-2">Total Offset Lithography Program Savings</div>
                              <div className="text-3xl font-light mb-2">$30,000-$65,000/year</div>
                              <div className="text-sm opacity-90">15-20% savings with paper + print consumables bundling</div>
                            </div>
                          </div>
                        )}

                        {/* No Equipment Message */}
                        {crossSellAnswers.equipment_type?.includes('none') && (
                          <div className="text-center py-12">
                            <div className="text-slate-600 mb-4">
                              {answers.customer} currently does not operate print equipment. Focus on strengthening the paper relationship and monitor for future equipment acquisitions.
                            </div>
                            <div className="text-sm text-slate-500">
                              Consider periodic check-ins to identify if they're planning to bring printing in-house.
                            </div>
                          </div>
                        )}

                        {/* Value Proposition Summary - Show if they have equipment */}
                        {(crossSellAnswers.equipment_type?.includes('hp_latex') || crossSellAnswers.equipment_type?.includes('offset_press')) && (
                          <div className="bg-slate-50 p-6 rounded">
                            <h3 className="text-lg font-medium text-slate-900 mb-4">Kelly Spicers Complete Value Proposition</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="flex gap-3">
                                <div className="w-2 h-2 bg-[#FF6B4A] rounded-full mt-1.5 flex-shrink-0"></div>
                                <div className="text-slate-700">Single-source solution: Paper + Consumables + Maintenance</div>
                              </div>
                              <div className="flex gap-3">
                                <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-1.5 flex-shrink-0"></div>
                                <div className="text-slate-700">Consolidated purchasing with volume leverage</div>
                              </div>
                              <div className="flex gap-3">
                                <div className="w-2 h-2 bg-[#FF6B4A] rounded-full mt-1.5 flex-shrink-0"></div>
                                <div className="text-slate-700">Just-in-time inventory management</div>
                              </div>
                              <div className="flex gap-3">
                                <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-1.5 flex-shrink-0"></div>
                                <div className="text-slate-700">One invoice, one point of contact</div>
                              </div>
                              <div className="flex gap-3">
                                <div className="w-2 h-2 bg-[#FF6B4A] rounded-full mt-1.5 flex-shrink-0"></div>
                                <div className="text-slate-700">Technical support with industry expertise</div>
                              </div>
                              <div className="flex gap-3">
                                <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-1.5 flex-shrink-0"></div>
                                <div className="text-slate-700">Priority service and emergency parts availability</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Next Steps */}
                        {(crossSellAnswers.equipment_type?.includes('hp_latex') || crossSellAnswers.equipment_type?.includes('offset_press')) && (
                          <div className="border-l-4 border-[#FF6B4A] pl-6">
                            <h3 className="text-lg font-medium text-slate-900 mb-3">Recommended Next Steps</h3>
                            <div className="space-y-2 text-sm text-slate-700">
                              <div className="flex gap-2">
                                <span className="font-medium text-slate-900">1.</span>
                                <span>Schedule 15-20 minute discovery call to confirm equipment details</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-medium text-slate-900">2.</span>
                                <span>Conduct complimentary consumables spend analysis</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-medium text-slate-900">3.</span>
                                <span>Start with pilot program (one category) to demonstrate savings</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-medium text-slate-900">4.</span>
                                <span>Expand to full program with 12-month bundled contract</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Reset Button */}
                        <div className="text-center pt-4">
                          <Button
                            onClick={() => {
                              setCrossSellStarted(false);
                              setCrossSellQuestion(0);
                              setCrossSellAnswers({});
                              setCrossSellComplete(false);
                            }}
                            variant="outline"
                            className="border-slate-300"
                          >
                            Start New Cross-Sell Analysis
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="mt-8 flex gap-4">
              <Button variant="outline" className="border-slate-300">
                Download PDF
              </Button>
              <Button variant="outline" className="border-slate-300">
                Email Report
              </Button>
              <Link href="/">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
          <img src="/Defftlogo.png" alt="Defft.ai" className="h-12 sm:h-14 lg:h-16" />
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
          </Link>
        </div>
      </header>

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestion + 1} of {visibleQuestions.length}
            </span>
            <span className="text-sm font-medium text-slate-900">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-900 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="max-w-3xl mx-auto border border-slate-200">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <h2 className="text-xl sm:text-2xl font-light text-slate-900 mb-6 sm:mb-8">
              {currentQ.question}
            </h2>

            {currentQ.type === 'customer-select' && (
              <Select value={answers[currentQ.id]} onValueChange={handleAnswer}>
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Select a customer..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer} value={customer} className="text-base py-3">
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {currentQ.type === 'select' && (
              <div className="space-y-3">
                {currentQ.options?.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-4 text-left rounded border transition-all ${
                      answers[currentQ.id] === option.value
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === 'multi-select' && (
              <div className="space-y-3">
                {currentQ.options?.map(option => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-all ${
                      (answers[currentQ.id] || []).includes(option.value)
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <Checkbox
                      checked={(answers[currentQ.id] || []).includes(option.value)}
                      onCheckedChange={() => handleMultiSelect(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === 'text' && (
              <Input
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={currentQ.placeholder}
                className="text-base h-12"
              />
            )}

            {currentQ.type === 'textarea' && (
              <Textarea
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={currentQ.placeholder}
                rows={6}
                className="text-base"
              />
            )}

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className="flex-1 border-slate-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isAnswered() || isProcessing}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
              >
                {isProcessing ? (
                  'Processing...'
                ) : currentQuestion === visibleQuestions.length - 1 ? (
                  'Generate Analysis'
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
