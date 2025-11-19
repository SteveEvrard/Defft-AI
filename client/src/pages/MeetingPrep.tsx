import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ArrowLeft, ArrowRight, CheckCircle, HelpCircle, Presentation, Target } from "lucide-react";
import { Link } from "wouter";

interface Question {
  id: string;
  question: string;
  type: 'select' | 'multi-select' | 'customer-select' | 'textarea';
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
    id: 'q1',
    question: 'Select the customer account',
    type: 'customer-select'
  },
  {
    id: 'q2',
    question: "What's the primary objective of this meeting?",
    type: 'select',
    options: [
      { value: 'explore_solutions', label: 'Explore new packaging solutions' },
      { value: 'follow_up', label: 'Follow up on a previous conversation' },
      { value: 'address_issue', label: 'Address a service or quality issue' },
      { value: 'review_pricing', label: 'Review pricing/contract terms' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'q3',
    question: 'Where are you in the sales process?',
    type: 'select',
    options: [
      { value: 'first_contact', label: 'First contact / discovery' },
      { value: 'qualification', label: 'Qualification / needs assessment' },
      { value: 'proposal', label: 'Proposal or quoting' },
      { value: 'negotiation', label: 'Negotiation / closing' },
      { value: 'post_sale', label: 'Post-sale follow-up' }
    ]
  },
  {
    id: 'q4',
    question: 'Which insights do you want the briefing to emphasize?',
    type: 'multi-select',
    options: [
      { value: 'last_meeting', label: 'Last meeting notes & action items' },
      { value: 'company_news', label: 'Recent company news' },
      { value: 'competitor_news', label: 'Competitor news & benchmarks' },
      { value: 'industry_trends', label: 'Industry trends & market shifts' },
      { value: 'common_solutions', label: 'Common packaging solutions for this industry' }
    ]
  },
  {
    id: 'q5',
    question: 'Are additional stakeholders attending?',
    type: 'select',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' }
    ]
  },
  {
    id: 'q6',
    question: 'Please list additional attendees',
    type: 'textarea',
    conditional: true,
    showIf: (answers) => answers.q5 === 'yes',
    placeholder: 'e.g., "Jane Smith – R&D Engineer"'
  },
  {
    id: 'q7',
    question: 'Any specific questions or concerns to address?',
    type: 'textarea',
    placeholder: 'Example: Sustainability, cost reduction, lead times...'
  }
];

export default function MeetingPrep() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOutput, setSelectedOutput] = useState<'questions' | 'presentation' | 'objectives'>('questions');

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
    await new Promise(resolve => setTimeout(resolve, 2000));
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
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-light text-slate-900 mb-2">Meeting Preparation Complete</h1>
              <p className="text-slate-600">Briefing for {answers.q1}</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 mb-8">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOutput('questions')}
                  className={`pb-4 px-6 text-sm font-medium transition-colors ${
                    selectedOutput === 'questions'
                      ? 'text-slate-900 border-b-2 border-[#4ECDC4]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <HelpCircle className="h-4 w-4 inline mr-2" />
                  Strategic Questions
                </button>
                <button
                  onClick={() => setSelectedOutput('presentation')}
                  className={`pb-4 px-6 text-sm font-medium transition-colors ${
                    selectedOutput === 'presentation'
                      ? 'text-slate-900 border-b-2 border-[#FF6B4A]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Presentation className="h-4 w-4 inline mr-2" />
                  Meeting Presentation
                </button>
                <button
                  onClick={() => setSelectedOutput('objectives')}
                  className={`pb-4 px-6 text-sm font-medium transition-colors ${
                    selectedOutput === 'objectives'
                      ? 'text-slate-900 border-b-2 border-[#4ECDC4]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Target className="h-4 w-4 inline mr-2" />
                  Meeting Objectives
                </button>
              </div>
            </div>

            {/* Output Content */}
            <Card className="border border-slate-200">
              <CardContent className="p-6 sm:p-8">
                {selectedOutput === 'questions' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-light text-slate-900 mb-6">Strategic Questions</h2>
                      <p className="text-slate-600 mb-8">
                        Key questions to guide your conversation with {answers.q1} and uncover valuable insights.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="border-l-4 border-[#4ECDC4] pl-6 py-2">
                        <h3 className="font-medium text-slate-900 mb-3">Discovery & Current State</h3>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex gap-3">
                            <span className="text-[#4ECDC4] mt-1">•</span>
                            <span>"Can you walk me through your current packaging process from receiving to shipping?"</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-[#4ECDC4] mt-1">•</span>
                            <span>"What are your biggest pain points with your current packaging suppliers or materials?"</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-[#4ECDC4] mt-1">•</span>
                            <span>"How do you currently measure packaging performance and efficiency?"</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#FF6B4A] pl-6 py-2">
                        <h3 className="font-medium text-slate-900 mb-3">Business Impact & Priorities</h3>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex gap-3">
                            <span className="text-[#FF6B4A] mt-1">•</span>
                            <span>"What are your top 3 business priorities for the next 12 months?"</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-[#FF6B4A] mt-1">•</span>
                            <span>"How does packaging cost impact your overall margin and competitiveness?"</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-[#FF6B4A] mt-1">•</span>
                            <span>"Are there any sustainability or ESG goals driving packaging decisions?"</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#4ECDC4] pl-6 py-2">
                        <h3 className="font-medium text-slate-900 mb-3">Decision Process & Timeline</h3>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex gap-3">
                            <span className="text-[#4ECDC4] mt-1">•</span>
                            <span>"Who else is involved in packaging decisions, and what are their key concerns?"</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-[#4ECDC4] mt-1">•</span>
                            <span>"What's your typical evaluation process for new packaging solutions?"</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-[#4ECDC4] mt-1">•</span>
                            <span>"Is there a specific timeline or trigger event driving this evaluation?"</span>
                          </li>
                        </ul>
                      </div>

                      {answers.q7 && (
                        <div className="bg-slate-50 p-6 rounded">
                          <h3 className="font-medium text-slate-900 mb-2">Custom Questions</h3>
                          <p className="text-sm text-slate-600">Based on your specific concerns: {answers.q7}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedOutput === 'presentation' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-light text-slate-900 mb-6">Meeting Presentation</h2>
                      <p className="text-slate-600 mb-8">
                        Structured talking points and key messages for your meeting with {answers.q1}.
                      </p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <div className="bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] text-white p-6 rounded mb-4">
                          <h3 className="text-xl font-light mb-2">Opening: Value Proposition</h3>
                          <p className="text-sm opacity-90">2-3 minutes</p>
                        </div>
                        <div className="pl-6 space-y-3 text-slate-700">
                          <p><strong>Key Message:</strong> "We help distributors like {answers.q1} reduce packaging costs by 15-25% while improving sustainability and operational efficiency."</p>
                          <p><strong>Proof Points:</strong></p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>500+ active accounts in distribution and logistics</li>
                            <li>$2.4M in documented cost savings across client base</li>
                            <li>Average 18% reduction in dimensional weight charges</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <div className="bg-slate-100 p-6 rounded mb-4">
                          <h3 className="text-xl font-light text-slate-900 mb-2">Section 2: Industry Insights</h3>
                          <p className="text-sm text-slate-600">5-7 minutes</p>
                        </div>
                        <div className="pl-6 space-y-3 text-slate-700">
                          <p><strong>Market Trends:</strong></p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Shift toward sustainable packaging materials (40% YoY growth)</li>
                            <li>Automation in packaging operations reducing labor costs by 30%</li>
                            <li>Supply chain diversification driving need for flexible packaging solutions</li>
                          </ul>
                          {(answers.q4 || []).includes('competitor_news') && (
                            <p className="mt-3 text-sm bg-slate-50 p-4 rounded">
                              <strong>Competitive Intelligence:</strong> Recent moves by competitors in sustainable packaging and cost optimization.
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="bg-slate-100 p-6 rounded mb-4">
                          <h3 className="text-xl font-light text-slate-900 mb-2">Section 3: Solution Overview</h3>
                          <p className="text-sm text-slate-600">8-10 minutes</p>
                        </div>
                        <div className="pl-6 space-y-3 text-slate-700">
                          <p><strong>Our Approach:</strong></p>
                          <div className="grid md:grid-cols-2 gap-4 mt-3">
                            <div className="border-l-4 border-[#FF6B4A] pl-4 py-2">
                              <div className="font-medium text-slate-900">Cost Analysis</div>
                              <div className="text-sm text-slate-600">Comprehensive packaging spend review and optimization opportunities</div>
                            </div>
                            <div className="border-l-4 border-[#4ECDC4] pl-4 py-2">
                              <div className="font-medium text-slate-900">Material Selection</div>
                              <div className="text-sm text-slate-600">Right-sized, sustainable materials for your product mix</div>
                            </div>
                            <div className="border-l-4 border-[#FF6B4A] pl-4 py-2">
                              <div className="font-medium text-slate-900">Supplier Network</div>
                              <div className="text-sm text-slate-600">Access to vetted suppliers with competitive pricing</div>
                            </div>
                            <div className="border-l-4 border-[#4ECDC4] pl-4 py-2">
                              <div className="font-medium text-slate-900">Implementation Support</div>
                              <div className="text-sm text-slate-600">End-to-end transition management and training</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="bg-slate-100 p-6 rounded mb-4">
                          <h3 className="text-xl font-light text-slate-900 mb-2">Closing: Next Steps</h3>
                          <p className="text-sm text-slate-600">3-5 minutes</p>
                        </div>
                        <div className="pl-6 space-y-3 text-slate-700">
                          <p><strong>Proposed Action Plan:</strong></p>
                          <ol className="list-decimal pl-6 space-y-2 text-sm">
                            <li>Schedule packaging audit and site visit (Week 1)</li>
                            <li>Conduct spend analysis and opportunity assessment (Week 2-3)</li>
                            <li>Present detailed recommendations and ROI projections (Week 4)</li>
                            <li>Pilot program with selected product lines (Week 5-8)</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedOutput === 'objectives' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-light text-slate-900 mb-6">Meeting Objectives</h2>
                      <p className="text-slate-600 mb-8">
                        Clear goals and desired outcomes for your meeting with {answers.q1}.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="border-l-4 border-[#FF6B4A] pl-6 py-3">
                        <h3 className="text-lg font-medium text-slate-900 mb-3">Primary Objectives</h3>
                        <div className="space-y-4">
                          <div className="bg-slate-50 p-4 rounded">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="w-6 h-6 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">1</div>
                              <div>
                                <div className="font-medium text-slate-900">Understand Current State</div>
                                <div className="text-sm text-slate-600 mt-1">
                                  Map their existing packaging process, suppliers, costs, and pain points
                                </div>
                                <div className="text-xs text-slate-500 mt-2">
                                  <strong>Success Metric:</strong> Complete understanding of packaging spend breakdown and key challenges
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="w-6 h-6 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">2</div>
                              <div>
                                <div className="font-medium text-slate-900">Identify Decision Criteria</div>
                                <div className="text-sm text-slate-600 mt-1">
                                  Uncover what matters most: cost, sustainability, service, quality, or lead time
                                </div>
                                <div className="text-xs text-slate-500 mt-2">
                                  <strong>Success Metric:</strong> Ranked list of decision factors and stakeholder priorities
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="w-6 h-6 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">3</div>
                              <div>
                                <div className="font-medium text-slate-900">Establish Value Proposition</div>
                                <div className="text-sm text-slate-600 mt-1">
                                  Demonstrate how our solutions address their specific needs and deliver measurable ROI
                                </div>
                                <div className="text-xs text-slate-500 mt-2">
                                  <strong>Success Metric:</strong> Clear articulation of potential savings and benefits
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-l-4 border-[#4ECDC4] pl-6 py-3">
                        <h3 className="text-lg font-medium text-slate-900 mb-3">Secondary Objectives</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <div className="font-medium text-slate-900">Build Relationship</div>
                              <div className="text-sm text-slate-600">Establish rapport and credibility with key stakeholders</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <div className="font-medium text-slate-900">Competitive Intelligence</div>
                              <div className="text-sm text-slate-600">Understand their current supplier relationships and satisfaction levels</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <div className="font-medium text-slate-900">Timeline & Process</div>
                              <div className="text-sm text-slate-600">Clarify their decision-making process and expected timeline</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[#FF6B4A] to-[#4ECDC4] text-white p-6 rounded">
                        <h3 className="text-lg font-light mb-3">Desired Outcome</h3>
                        <p className="text-sm opacity-90 mb-4">
                          By the end of this meeting, we should have:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>Agreement to conduct a packaging audit and spend analysis</span>
                          </li>
                          <li className="flex gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>Scheduled follow-up meeting with all key stakeholders</span>
                          </li>
                          <li className="flex gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>Clear understanding of decision criteria and timeline</span>
                          </li>
                          <li className="flex gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>Positive impression and established credibility</span>
                          </li>
                        </ul>
                      </div>

                      {answers.q3 && (
                        <div className="bg-slate-50 p-6 rounded">
                          <h3 className="font-medium text-slate-900 mb-2">Sales Stage Context</h3>
                          <p className="text-sm text-slate-600">
                            Current stage: <strong className="text-slate-900">{answers.q3.replace(/_/g, ' ')}</strong>
                          </p>
                          <p className="text-sm text-slate-600 mt-2">
                            Focus this meeting on advancing to the next stage of the sales process.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <Link href="/">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
            <h2 className="text-2xl font-light text-slate-900 mb-8">
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
                  'Generate Briefing'
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
