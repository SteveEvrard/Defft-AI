import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Target, ArrowLeft, ArrowRight, CheckCircle, Users, MessageSquare, Calendar } from "lucide-react";
import { Link } from "wouter";

interface Question {
  id: string;
  question: string;
  type: 'select' | 'multi-select' | 'textarea' | 'dual-input';
  options?: { value: string; label: string }[];
  placeholder?: string;
  fields?: { name: string; placeholder: string; type: string }[];
}

const questions: Question[] = [
  {
    id: 'q1',
    question: 'Select market segment(s)',
    type: 'multi-select',
    options: [
      { value: 'automotive_oem', label: 'Automotive OEM' },
      { value: '3pl_logistics', label: '3PL / logistics' },
      { value: 'ecommerce', label: 'E-commerce' },
      { value: 'food_beverage', label: 'Food & Beverage' },
      { value: 'industrial_mro', label: 'Industrial MRO' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'q2',
    question: 'Select target region(s)',
    type: 'multi-select',
    options: [
      { value: 'southern_california', label: 'Southern California' },
      { value: 'new_jersey_ny', label: 'New Jersey / New York' },
      { value: 'atlanta', label: 'Atlanta' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'q3',
    question: 'Choose the roles to target',
    type: 'multi-select',
    options: [
      { value: 'purchasing_managers', label: 'Purchasing managers / directors' },
      { value: 'operations_managers', label: 'Operations / Distribution managers' },
      { value: 'packaging_engineers', label: 'Packaging engineers' },
      { value: 'owners_ceos', label: 'Owners / CEOs' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'q4',
    question: 'Choose messaging themes for this campaign',
    type: 'multi-select',
    options: [
      { value: 'cost_reduction', label: 'Cost reduction & efficiency' },
      { value: 'sustainability', label: 'Sustainability & ESG' },
      { value: 'service_leadtime', label: 'Service & lead time' },
      { value: 'innovation_quality', label: 'Product innovation & quality' }
    ]
  },
  {
    id: 'q5',
    question: 'Enter your value proposition',
    type: 'textarea',
    placeholder: 'Example: "If you use foam-in-place, we can help you transition to sustainable, cost-effective paper cushioning."'
  },
  {
    id: 'q6',
    question: 'Define message cadence',
    type: 'dual-input',
    fields: [
      { name: 'touches', placeholder: 'Number of touches (e.g., 4, 6, 8)', type: 'number' },
      { name: 'frequency', placeholder: 'Frequency (e.g., every 7 days)', type: 'text' }
    ]
  }
];

export default function AccountAttack() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOutput, setSelectedOutput] = useState<'targets' | 'messaging' | 'roadmap'>('targets');

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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

  const handleDualInput = (field: string, value: string) => {
    const current = answers[currentQ.id] || {};
    setAnswers(prev => ({ 
      ...prev, 
      [currentQ.id]: { ...current, [field]: value }
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowResults(true);
    setIsProcessing(false);
  };

  const isAnswered = () => {
    const answer = answers[currentQ.id];
    if (currentQ.type === 'multi-select') {
      return answer && answer.length > 0;
    }
    if (currentQ.type === 'dual-input') {
      return answer && answer.touches && answer.frequency;
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
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-light text-slate-900 mb-2">Campaign Strategy Complete</h1>
              <p className="text-base sm:text-lg text-slate-600">
                Strategic account attack campaign for {(answers.q1 || []).join(', ')} in {(answers.q2 || []).join(', ')}
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 mb-8 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                <button
                  onClick={() => setSelectedOutput('targets')}
                  className={`pb-3 sm:pb-4 px-3 sm:px-6 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedOutput === 'targets'
                      ? 'text-slate-900 border-b-2 border-[#FF6B4A]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Users className="h-4 w-4 inline mr-2" />
                  Target Accounts
                </button>
                <button
                  onClick={() => setSelectedOutput('messaging')}
                  className={`pb-3 sm:pb-4 px-3 sm:px-6 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedOutput === 'messaging'
                      ? 'text-slate-900 border-b-2 border-[#4ECDC4]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Campaign Messaging
                </button>
                <button
                  onClick={() => setSelectedOutput('roadmap')}
                  className={`pb-3 sm:pb-4 px-3 sm:px-6 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedOutput === 'roadmap'
                      ? 'text-slate-900 border-b-2 border-[#FF6B4A]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Execution Roadmap
                </button>
              </div>
            </div>

            {/* Target Accounts Output */}
            {selectedOutput === 'targets' && (
              <Card className="border border-slate-200">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-light text-slate-900 mb-6">Target Account List</h2>
                  <p className="text-slate-600 mb-8">
                    High-priority accounts matching your criteria with complete contact information and intelligence.
                  </p>

                  <div className="space-y-6">
                    {/* Account 1 */}
                    <div className="border border-slate-200 rounded-lg p-6 hover:border-[#FF6B4A] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-slate-900">TechPack Solutions Inc.</h3>
                          <p className="text-sm text-slate-600">3PL / Logistics • Southern California</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] text-white px-4 py-2 rounded text-sm font-medium w-fit">
                          High Priority
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 mb-3">Key Contacts</h4>
                          <div className="space-y-3">
                            <div className="border-l-2 border-[#FF6B4A] pl-3">
                              <div className="font-medium text-slate-900">Sarah Chen</div>
                              <div className="text-sm text-slate-600">VP of Operations</div>
                              <div className="text-sm text-slate-500 mt-1">
                                📞 (310) 555-0142<br />
                                ✉️ s.chen@techpacksolutions.com<br />
                                🔗 linkedin.com/in/sarahchen-ops
                              </div>
                            </div>
                            <div className="border-l-2 border-[#4ECDC4] pl-3">
                              <div className="font-medium text-slate-900">Michael Rodriguez</div>
                              <div className="text-sm text-slate-600">Director of Purchasing</div>
                              <div className="text-sm text-slate-500 mt-1">
                                📞 (310) 555-0143<br />
                                ✉️ m.rodriguez@techpacksolutions.com<br />
                                🔗 linkedin.com/in/mrodriguez-supply
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-slate-900 mb-3">Account Intelligence</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-slate-600 mb-1">Estimated Annual Packaging Spend</div>
                              <div className="text-lg font-medium text-slate-900">$1.2M - $1.5M</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-600 mb-2">Spend by Category</div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Corrugated boxes</span>
                                  <span className="font-medium">$520K</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Protective materials</span>
                                  <span className="font-medium">$380K</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Tape & adhesives</span>
                                  <span className="font-medium">$180K</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Stretch film</span>
                                  <span className="font-medium">$220K</span>
                                </div>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-slate-200">
                              <div className="text-sm text-slate-600 mb-1">Current Suppliers</div>
                              <div className="text-sm font-medium text-slate-900">
                                Uline (primary), International Paper, Sealed Air
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded">
                        <div className="text-sm font-medium text-slate-900 mb-2">Opportunity Notes</div>
                        <p className="text-sm text-slate-600">
                          Recent expansion into sustainable packaging initiatives. Contract with Uline expires Q2 2025. 
                          Pain points: rising costs, inconsistent lead times, limited sustainability options.
                        </p>
                      </div>
                    </div>

                    {/* Account 2 */}
                    <div className="border border-slate-200 rounded-lg p-6 hover:border-[#4ECDC4] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-slate-900">Precision Auto Parts Distribution</h3>
                          <p className="text-sm text-slate-600">Automotive OEM • Southern California</p>
                        </div>
                        <div className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium w-fit">
                          Medium Priority
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 mb-3">Key Contacts</h4>
                          <div className="space-y-3">
                            <div className="border-l-2 border-[#FF6B4A] pl-3">
                              <div className="font-medium text-slate-900">James Patterson</div>
                              <div className="text-sm text-slate-600">Supply Chain Manager</div>
                              <div className="text-sm text-slate-500 mt-1">
                                📞 (714) 555-0198<br />
                                ✉️ j.patterson@precisionauto.com<br />
                                🔗 linkedin.com/in/jpatterson-scm
                              </div>
                            </div>
                            <div className="border-l-2 border-[#4ECDC4] pl-3">
                              <div className="font-medium text-slate-900">Lisa Wong</div>
                              <div className="text-sm text-slate-600">Packaging Engineer</div>
                              <div className="text-sm text-slate-500 mt-1">
                                📞 (714) 555-0199<br />
                                ✉️ l.wong@precisionauto.com<br />
                                🔗 linkedin.com/in/lisawong-packaging
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-slate-900 mb-3">Account Intelligence</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-slate-600 mb-1">Estimated Annual Packaging Spend</div>
                              <div className="text-lg font-medium text-slate-900">$850K - $1.1M</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-600 mb-2">Spend by Category</div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Custom containers</span>
                                  <span className="font-medium">$420K</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Foam inserts</span>
                                  <span className="font-medium">$280K</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Labels & marking</span>
                                  <span className="font-medium">$95K</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Pallets & dunnage</span>
                                  <span className="font-medium">$155K</span>
                                </div>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-slate-200">
                              <div className="text-sm text-slate-600 mb-1">Current Suppliers</div>
                              <div className="text-sm font-medium text-slate-900">
                                Greif Packaging, UFP Technologies
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded">
                        <div className="text-sm font-medium text-slate-900 mb-2">Opportunity Notes</div>
                        <p className="text-sm text-slate-600">
                          Exploring automation in packaging operations. Quality issues with current foam supplier. 
                          Looking for cost-effective alternatives that maintain protection standards.
                        </p>
                      </div>
                    </div>

                    {/* Account 3 */}
                    <div className="border border-slate-200 rounded-lg p-6 hover:border-[#FF6B4A] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-slate-900">FreshDirect Logistics</h3>
                          <p className="text-sm text-slate-600">Food & Beverage • Southern California</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] text-white px-4 py-2 rounded text-sm font-medium w-fit">
                          High Priority
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 mb-3">Key Contacts</h4>
                          <div className="space-y-3">
                            <div className="border-l-2 border-[#FF6B4A] pl-3">
                              <div className="font-medium text-slate-900">David Kim</div>
                              <div className="text-sm text-slate-600">CEO</div>
                              <div className="text-sm text-slate-500 mt-1">
                                📞 (619) 555-0221<br />
                                ✉️ d.kim@freshdirectlog.com<br />
                                🔗 linkedin.com/in/davidkim-ceo
                              </div>
                            </div>
                            <div className="border-l-2 border-[#4ECDC4] pl-3">
                              <div className="font-medium text-slate-900">Amanda Foster</div>
                              <div className="text-sm text-slate-600">Director of Procurement</div>
                              <div className="text-sm text-slate-500 mt-1">
                                📞 (619) 555-0222<br />
                                ✉️ a.foster@freshdirectlog.com<br />
                                🔗 linkedin.com/in/afoster-procurement
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-slate-900 mb-3">Account Intelligence</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-slate-600 mb-1">Estimated Annual Packaging Spend</div>
                              <div className="text-lg font-medium text-slate-900">$2.1M - $2.6M</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-600 mb-2">Spend by Category</div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Insulated containers</span>
                                  <span className="font-medium">$890K</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Cold chain packaging</span>
                                  <span className="font-medium">$720K</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Corrugated boxes</span>
                                  <span className="font-medium">$340K</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Void fill materials</span>
                                  <span className="font-medium">$250K</span>
                                </div>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-slate-200">
                              <div className="text-sm text-slate-600 mb-1">Current Suppliers</div>
                              <div className="text-sm font-medium text-slate-900">
                                Cold Chain Technologies, Sonoco, DS Smith
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded">
                        <div className="text-sm font-medium text-slate-900 mb-2">Opportunity Notes</div>
                        <p className="text-sm text-slate-600">
                          Aggressive sustainability goals for 2025. CEO actively seeking eco-friendly cold chain solutions. 
                          Current supplier unable to meet new sustainability requirements. Budget approved for Q1 2025 switch.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] text-white rounded-lg">
                    <h3 className="text-lg font-light mb-3">Campaign Summary</h3>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="opacity-80 mb-1">Total Target Accounts</div>
                        <div className="text-2xl font-light">3</div>
                      </div>
                      <div>
                        <div className="opacity-80 mb-1">Total Addressable Spend</div>
                        <div className="text-2xl font-light">$4.8M</div>
                      </div>
                      <div>
                        <div className="opacity-80 mb-1">Key Decision Makers</div>
                        <div className="text-2xl font-light">6</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Campaign Messaging Output */}
            {selectedOutput === 'messaging' && (
              <Card className="border border-slate-200">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-light text-slate-900 mb-6">Campaign Messaging & Templates</h2>
                  <p className="text-slate-600 mb-8">
                    Personalized messaging frameworks, email templates, and call scripts for your campaign.
                  </p>

                  <div className="space-y-8">
                    {/* Value Proposition */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Core Value Proposition</h3>
                      <div className="bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] text-white p-6 rounded-lg">
                        <p className="text-lg font-light">
                          {answers.q5 || "We help distributors reduce packaging costs by 15-25% while improving sustainability and operational efficiency."}
                        </p>
                      </div>
                    </div>

                    {/* Email Templates */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Email Templates</h3>
                      
                      <div className="space-y-6">
                        <div className="border border-slate-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-slate-900">Touch 1: Initial Outreach</h4>
                            <span className="text-xs bg-[#FF6B4A] text-white px-3 py-1 rounded">Day 1</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded font-mono text-sm space-y-3">
                            <div><strong>Subject:</strong> Quick question about [Company]'s packaging strategy</div>
                            <div className="border-t border-slate-200 pt-3">
                              <p className="mb-3">Hi [First Name],</p>
                              <p className="mb-3">
                                I noticed [Company] has been expanding operations in [Region]. As you scale, 
                                packaging costs and sustainability often become critical priorities.
                              </p>
                              <p className="mb-3">
                                We've helped similar {(answers.q1 || []).join(' and ')} companies reduce packaging 
                                spend by 15-25% while meeting ESG goals. For example, [relevant case study].
                              </p>
                              <p className="mb-3">
                                Would you be open to a 15-minute conversation about your current packaging strategy?
                              </p>
                              <p>Best regards,<br />[Your Name]</p>
                            </div>
                          </div>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-slate-900">Touch 2: Value-Add Follow-up</h4>
                            <span className="text-xs bg-[#4ECDC4] text-white px-3 py-1 rounded">Day 7</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded font-mono text-sm space-y-3">
                            <div><strong>Subject:</strong> [Industry] packaging trends you should know</div>
                            <div className="border-t border-slate-200 pt-3">
                              <p className="mb-3">Hi [First Name],</p>
                              <p className="mb-3">
                                Following up on my last email. I wanted to share a quick insight that might be relevant 
                                for [Company]:
                              </p>
                              <p className="mb-3">
                                We're seeing {(answers.q1 || []).join(' and ')} companies shift toward [specific trend]. 
                                Early adopters are seeing 20-30% cost reductions in [specific category].
                              </p>
                              <p className="mb-3">
                                I've attached a brief case study. Would love to discuss how this might apply to your operations.
                              </p>
                              <p className="mb-3">
                                Are you available for a brief call next week?
                              </p>
                              <p>Best,<br />[Your Name]</p>
                            </div>
                          </div>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-slate-900">Touch 3: Competitive Intelligence</h4>
                            <span className="text-xs bg-[#FF6B4A] text-white px-3 py-1 rounded">Day 14</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded font-mono text-sm space-y-3">
                            <div><strong>Subject:</strong> How [Competitor] reduced packaging costs 22%</div>
                            <div className="border-t border-slate-200 pt-3">
                              <p className="mb-3">Hi [First Name],</p>
                              <p className="mb-3">
                                Quick update: We recently helped [Competitor or Similar Company] in {(answers.q2 || []).join(' and ')} 
                                reduce their packaging spend by 22% while improving their sustainability metrics.
                              </p>
                              <p className="mb-3">
                                The approach focused on three areas:<br />
                                • Right-sizing corrugated containers (saved $180K annually)<br />
                                • Switching to sustainable void fill (saved $95K + met ESG goals)<br />
                                • Optimizing supplier mix (improved lead times 30%)
                              </p>
                              <p className="mb-3">
                                I think [Company] could see similar results. Can we schedule 20 minutes to explore?
                              </p>
                              <p>Thanks,<br />[Your Name]</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Call Scripts */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Call Scripts</h3>
                      
                      <div className="border border-slate-200 rounded-lg p-6">
                        <h4 className="font-medium text-slate-900 mb-4">Cold Call Opening</h4>
                        <div className="space-y-4 text-sm">
                          <div className="border-l-4 border-[#FF6B4A] pl-4">
                            <p className="font-medium text-slate-900 mb-2">Opening (First 10 seconds)</p>
                            <p className="text-slate-700">
                              "Hi [First Name], this is [Your Name] from [Company]. I know I'm catching you off guard, 
                              so I'll be brief. We help {(answers.q1 || []).join(' and ')} companies reduce packaging 
                              costs by 15-25%. Do you have 90 seconds for me to explain why I'm calling?"
                            </p>
                          </div>

                          <div className="border-l-4 border-[#4ECDC4] pl-4">
                            <p className="font-medium text-slate-900 mb-2">Value Statement (If they say yes)</p>
                            <p className="text-slate-700">
                              "Great. We've worked with companies like [Similar Company] in your industry. They were 
                              facing [common pain point]. We helped them save [specific amount] annually while 
                              [additional benefit like sustainability]. Based on what I know about [Their Company], 
                              I think we could deliver similar results. Would it make sense to schedule 15 minutes 
                              next week to explore this?"
                            </p>
                          </div>

                          <div className="border-l-4 border-[#FF6B4A] pl-4">
                            <p className="font-medium text-slate-900 mb-2">Objection Handling</p>
                            <div className="space-y-2 text-slate-700">
                              <p><strong>"We're happy with our current supplier"</strong><br />
                              "That's great to hear. Most of our clients were happy too until they saw what they were leaving on the table. 
                              Can I send you a quick benchmark showing what similar companies are paying? No obligation."</p>
                              
                              <p><strong>"Send me some information"</strong><br />
                              "I'd be happy to. But to make sure I send you something relevant, can I ask two quick questions about 
                              your current packaging setup? [Ask qualifying questions]"</p>
                              
                              <p><strong>"Not interested right now"</strong><br />
                              "I understand. When would be a better time? We're seeing a lot of activity in Q1 with companies 
                              looking to lock in savings before their next fiscal year. Would it make sense to reconnect in [timeframe]?"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* LinkedIn Messages */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">LinkedIn Outreach</h3>
                      
                      <div className="border border-slate-200 rounded-lg p-6">
                        <h4 className="font-medium text-slate-900 mb-4">Connection Request Message</h4>
                        <div className="bg-slate-50 p-4 rounded text-sm">
                          <p className="text-slate-700">
                            "Hi [First Name], I see you're leading [function] at [Company]. I work with {(answers.q1 || []).join(' and ')} 
                            companies in {(answers.q2 || []).join(' and ')} on packaging optimization. Would love to connect and share 
                            some insights relevant to your industry."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Execution Roadmap Output */}
            {selectedOutput === 'roadmap' && (
              <Card className="border border-slate-200">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-light text-slate-900 mb-6">Execution Roadmap</h2>
                  <p className="text-slate-600 mb-8">
                    Multi-touch campaign calendar with {answers.q6?.touches || 6} touches over {answers.q6?.frequency || 'the next 6 weeks'}.
                  </p>

                  <div className="space-y-8">
                    {/* Campaign Timeline */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-6">Campaign Timeline</h3>
                      
                      <div className="space-y-6">
                        {/* Week 1 */}
                        <div className="border-l-4 border-[#FF6B4A] pl-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-sm font-medium">1</div>
                            <h4 className="font-medium text-slate-900">Week 1: Initial Outreach</h4>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="bg-slate-50 p-4 rounded">
                              <div className="font-medium text-slate-900 mb-2">Day 1 (Monday)</div>
                              <ul className="space-y-1 text-slate-700">
                                <li>• Send initial email to all 6 contacts</li>
                                <li>• LinkedIn connection requests to all targets</li>
                                <li>• Log activities in CRM</li>
                              </ul>
                            </div>
                            <div className="bg-slate-50 p-4 rounded">
                              <div className="font-medium text-slate-900 mb-2">Day 3 (Wednesday)</div>
                              <ul className="space-y-1 text-slate-700">
                                <li>• First cold call attempt to high-priority targets (TechPack, FreshDirect)</li>
                                <li>• Leave voicemail referencing email</li>
                              </ul>
                            </div>
                            <div className="bg-slate-50 p-4 rounded">
                              <div className="font-medium text-slate-900 mb-2">Day 5 (Friday)</div>
                              <ul className="space-y-1 text-slate-700">
                                <li>• Follow up with any email responders</li>
                                <li>• Second call attempt to non-responders</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Week 2 */}
                        <div className="border-l-4 border-[#4ECDC4] pl-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-[#4ECDC4] text-white flex items-center justify-center text-sm font-medium">2</div>
                            <h4 className="font-medium text-slate-900">Week 2: Value-Add Follow-up</h4>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="bg-slate-50 p-4 rounded">
                              <div className="font-medium text-slate-900 mb-2">Day 7 (Monday)</div>
                              <ul className="space-y-1 text-slate-700">
                                <li>• Send value-add email with industry insights</li>
                                <li>• Attach relevant case study or whitepaper</li>
                              </ul>
                            </div>
                            <div className="bg-slate-50 p-4 rounded">
                              <div className="font-medium text-slate-900 mb-2">Day 10 (Thursday)</div>
                              <ul className="space-y-1 text-slate-700">
                                <li>• Call all non-responders</li>
                                <li>• LinkedIn message to accepted connections</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Week 3 */}
                        <div className="border-l-4 border-[#FF6B4A] pl-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-sm font-medium">3</div>
                            <h4 className="font-medium text-slate-900">Week 3: Competitive Intelligence</h4>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="bg-slate-50 p-4 rounded">
                              <div className="font-medium text-slate-900 mb-2">Day 14 (Monday)</div>
                              <ul className="space-y-1 text-slate-700">
                                <li>• Send competitive intelligence email</li>
                                <li>• Include specific competitor wins or industry benchmarks</li>
                              </ul>
                            </div>
                            <div className="bg-slate-50 p-4 rounded">
                              <div className="font-medium text-slate-900 mb-2">Day 17 (Thursday)</div>
                              <ul className="space-y-1 text-slate-700">
                                <li>• Call campaign to all targets</li>
                                <li>• Offer free packaging audit as hook</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Week 4+ */}
                        <div className="border-l-4 border-[#4ECDC4] pl-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-[#4ECDC4] text-white flex items-center justify-center text-sm font-medium">4</div>
                            <h4 className="font-medium text-slate-900">Week 4-6: Persistence & Nurture</h4>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="bg-slate-50 p-4 rounded">
                              <div className="font-medium text-slate-900 mb-2">Ongoing Activities</div>
                              <ul className="space-y-1 text-slate-700">
                                <li>• Weekly touchpoints alternating email/call/LinkedIn</li>
                                <li>• Share relevant content (blog posts, industry news)</li>
                                <li>• Engage with their LinkedIn posts</li>
                                <li>• Send personalized video messages to high-priority targets</li>
                                <li>• Offer exclusive webinar or demo invitation</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Success Metrics */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Success Metrics & KPIs</h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="text-sm text-slate-600 mb-2">Response Rate Target</div>
                          <div className="text-2xl font-light text-slate-900 mb-1">30-40%</div>
                          <div className="text-xs text-slate-500">At least 2 of 6 contacts respond</div>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="text-sm text-slate-600 mb-2">Meeting Conversion</div>
                          <div className="text-2xl font-light text-slate-900 mb-1">15-25%</div>
                          <div className="text-xs text-slate-500">1-2 discovery meetings booked</div>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="text-sm text-slate-600 mb-2">Pipeline Value</div>
                          <div className="text-2xl font-light text-[#FF6B4A] mb-1">$1.2M+</div>
                          <div className="text-xs text-slate-500">From qualified opportunities</div>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="text-sm text-slate-600 mb-2">Expected Close Rate</div>
                          <div className="text-2xl font-light text-[#4ECDC4] mb-1">20-30%</div>
                          <div className="text-xs text-slate-500">$240K-$360K in new business</div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] text-white p-6 rounded-lg">
                      <h3 className="text-lg font-light mb-4">Immediate Next Steps</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span>Load all 6 contacts into CRM with complete information</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span>Customize email templates with your company details</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span>Schedule Day 1 email send for Monday 9 AM local time</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span>Block calendar time for call attempts (Day 3, 5, 10, 17)</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span>Prepare case studies and collateral referenced in emails</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-8 pt-6 border-t border-slate-200">
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
              Question {currentQuestion + 1} of {questions.length}
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

            {currentQ.type === 'textarea' && (
              <Textarea
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={currentQ.placeholder}
                rows={6}
                className="text-base"
              />
            )}

            {currentQ.type === 'dual-input' && (
              <div className="space-y-4">
                {currentQ.fields?.map(field => (
                  <div key={field.name}>
                    <Input
                      type={field.type}
                      value={answers[currentQ.id]?.[field.name] || ''}
                      onChange={(e) => handleDualInput(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="text-base h-12"
                    />
                  </div>
                ))}
              </div>
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
                ) : currentQuestion === questions.length - 1 ? (
                  'Generate Campaign'
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
