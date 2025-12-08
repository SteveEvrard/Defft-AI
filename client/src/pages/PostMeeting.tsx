import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  Square,
  Play,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileDown,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

const SAMPLE_SUMMARY =
  "Customer shipping 2 Ozempic pens per parcel via FedEx/UPS. Needs 72–96h cold chain, 2–8 °C stability, and lower-plastic insulation.";

const highlightChips = [
  { label: "Cold Chain", value: "2–8 °C protection for 72–96h" },
  { label: "Parcel Density", value: "2 pens / parcel" },
  { label: "Carrier", value: "FedEx / UPS Priority" },
  { label: "Sustainability", value: "Prefers recyclable coolant" },
];

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
const REPORT_ENDPOINT = API_BASE_URL ? `${API_BASE_URL}/api/reports/post-meeting` : "/api/reports/post-meeting";
const REPORT_FILENAME_FALLBACK = "post-meeting-brief.docx";

const extractFilename = (header: string | null) => {
  if (!header) return REPORT_FILENAME_FALLBACK;
  const match = header.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
  if (match?.[1]) {
    return match[1].trim();
  }
  return REPORT_FILENAME_FALLBACK;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
};

const MAX_RECORDING_SECONDS = 60;
const MIN_REPORT_CHARS = 40;

export default function PostMeeting() {
  const totalSteps = 3;
  const [step, setStep] = useState(1);
  const [notes, setNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recorderError, setRecorderError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");

  const trimmedNotes = notes.trim();
  const canContinueFromSummary = hasRecording || trimmedNotes.length > 0;
  const summaryPreview = trimmedNotes.length ? trimmedNotes : SAMPLE_SUMMARY;
  const canRequestReport = trimmedNotes.length >= MIN_REPORT_CHARS;

  const handleAnalyzeSummary = () => {
    if (!canContinueFromSummary) return;
    setStep(2);
  };

  const handleBackStep = () => setStep((prev) => Math.max(1, prev - 1));
  const handleNextStep = () => setStep((prev) => Math.min(totalSteps, prev + 1));
  const handleResetFlow = () => {
    cleanupMedia();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setNotes("");
    setTranscript("");
    finalTranscriptRef.current = "";
    setHasRecording(false);
    setIsRecording(false);
    setIsTranscribing(false);
    setRecordedSeconds(0);
    setStep(1);
    setReportError(null);
    setReportSuccess(false);
    setIsGeneratingReport(false);
    setRecorderError(null);
  };

  const formatDuration = (seconds: number) => {
    const clamped = Math.min(seconds, MAX_RECORDING_SECONDS);
    const mins = Math.floor(clamped / 60)
      .toString()
      .padStart(2, "0");
    const secs = (clamped % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const cleanupMedia = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    mediaRecorderRef.current = null;
    stopTranscription();
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }

      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }

      mediaRecorderRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    setReportSuccess(false);
  }, [notes]);

  const stopTranscription = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch (error) {
      console.warn("Unable to stop speech recognition", error);
    }
  };

  const startTranscription = () => {
    const SpeechRecognitionClass =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognitionClass) {
      setRecorderError(
        "Live transcription is not supported in this browser, but your audio will still be recorded."
      );
      setTranscript("");
      finalTranscriptRef.current = "";
      setIsTranscribing(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;
      finalTranscriptRef.current = "";
      setTranscript("");
      setNotes("");
      setIsTranscribing(true);

      recognition.onresult = (event: any) => {
        let finalText = "";
        let interimText = "";
        for (let i = 0; i < event.results.length; i++) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += `${chunk} `;
          } else {
            interimText += chunk;
          }
        }
        finalText = finalText.trim();
        finalTranscriptRef.current = finalText;
        const combined = `${finalText} ${interimText}`.trim();
        setTranscript(combined);
        setNotes(combined);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error", event);
        if (event.error !== "aborted") {
          setRecorderError("Couldn't transcribe audio, but your recording was saved.");
        }
        setIsTranscribing(false);
      };

      recognition.onend = () => {
        setIsTranscribing(false);
        recognitionRef.current = null;
        const normalized = finalTranscriptRef.current.trim() || transcript.trim() || notes.trim();
        if (normalized) {
          setTranscript(normalized);
          setNotes(normalized);
        }
      };

      recognition.start();
    } catch (error) {
      console.warn("Speech recognition unavailable", error);
      setRecorderError("Unable to start live transcription. Recording will continue without text.");
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return;
    }

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    stopTranscription();

    try {
      recorder.stop();
    } catch (error) {
      console.warn("Unable to stop recorder", error);
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startRecording = async () => {
    if (isRecording) return;

    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function" ||
      typeof MediaRecorder === "undefined"
    ) {
      setRecorderError("Audio recording isn't supported on this device.");
      return;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    setRecorderError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        cleanupMedia();
        if (chunksRef.current.length) {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          setHasRecording(true);
        } else {
          setHasRecording(false);
        }
        chunksRef.current = [];
      };

      recorder.start();
      setRecordedSeconds(0);
      setIsRecording(true);
      setHasRecording(false);
      startTranscription();

      timerRef.current = window.setInterval(() => {
        setRecordedSeconds((prev) => {
          if (prev >= MAX_RECORDING_SECONDS - 1) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error: any) {
      if (error?.name === "NotAllowedError") {
        setRecorderError("Microphone access was blocked. Please enable it in your browser settings.");
      } else {
        setRecorderError("Unable to access microphone. Please try again.");
      }
      setIsRecording(false);
      cleanupMedia();
    }
  };

  const handlePlayRecording = () => {
    if (!audioUrl || !audioPlayerRef.current) return;
    audioPlayerRef.current.currentTime = 0;
    audioPlayerRef.current.play();
  };

  const handleGenerateReport = async () => {
    const normalizedNotes = notes.trim();
    if (normalizedNotes.length < MIN_REPORT_CHARS) {
      setReportError("Add at least 40 characters of context before generating the report.");
      return;
    }

    setIsGeneratingReport(true);
    setReportError(null);
    setReportSuccess(false);

    try {
      const response = await fetch(REPORT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: normalizedNotes }),
      });

      if (!response.ok) {
        let message = "Unable to generate the report.";
        try {
          const payload = await response.json();
          if (payload?.message) {
            message = payload.message;
          }
        } catch {
          // ignore JSON parsing errors
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const filename = extractFilename(response.headers.get("Content-Disposition"));
      downloadBlob(blob, filename);
      setReportSuccess(true);
    } catch (error) {
      console.error("Report generation failed", error);
      setReportError(error instanceof Error ? error.message : "Unexpected error generating the report.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] sm:text-xs tracking-[0.3em] uppercase text-slate-500">
        <span>Post-Meeting Analyzer</span>
        <span>
          Step {step} of {totalSteps}
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-900 transition-all"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStepOne = () => (
    <Card>
      <CardContent className="p-6 sm:p-10 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-3">
            Step 1 · Capture Signal
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-slate-900">Provide your meeting summary</h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Record a quick voice note or paste written notes. We’ll translate the context into packaging actions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-medium text-slate-900">Record voice summary</p>
                <p className="text-xs text-slate-500">60 seconds max · auto transcribed</p>
              </div>
              <div className="text-xs font-mono text-slate-500">
                {isRecording
                  ? `${formatDuration(recordedSeconds)} / 01:00`
                  : hasRecording
                  ? `${formatDuration(recordedSeconds)} captured`
                  : "Not recorded"}
              </div>
            </div>

            <audio ref={audioPlayerRef} src={audioUrl ?? undefined} className="hidden" />

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => void startRecording()}
                className={`gap-2 border-0 ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-600 text-white"
                    : "bg-[#FF6B4A] hover:bg-[#ff835e] text-white"
                }`}
                disabled={isRecording}
              >
                <Mic className="h-4 w-4" />
                {isRecording ? "Recording…" : "Record"}
              </Button>
              <Button
                onClick={stopRecording}
                variant="outline"
                className={`gap-2 border-0 ${
                  isRecording
                    ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
                disabled={!isRecording}
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
              <Button
                className={`gap-2 border-0 ${
                  hasRecording && !isRecording
                    ? "bg-[#4ECDC4] text-white hover:bg-[#3fb9b2]"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
                disabled={!hasRecording || isRecording}
                onClick={handlePlayRecording}
              >
                <Play className="h-4 w-4" />
                Play
              </Button>
            </div>

            <div className="mt-3 text-xs text-slate-500">
              {isRecording
                ? "Listening… keep your phone close for the best transcription."
                : hasRecording
                ? "Transcript ready. You can still edit or add written notes below."
                : "Need a refresher? Hit record for a quick recap while it’s fresh."}
            </div>
            {recorderError && (
              <div className="mt-2 text-xs text-red-600">{recorderError}</div>
            )}

          <div className="border-t border-dashed border-slate-200 pt-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Transcript & notes</p>
                <p className="text-xs text-slate-500">
                  Type your summary or let the recorder populate it live. You can edit once recording stops.
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {isRecording
                  ? "Live transcription"
                  : transcript
                  ? "Captured"
                  : notes.trim().length
                  ? "Manual entry"
                  : "No input yet"}
              </span>
            </div>
            <Textarea
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                if (!isRecording && !isTranscribing) {
                  setTranscript(event.target.value);
                  finalTranscriptRef.current = event.target.value;
                }
              }}
              rows={6}
              placeholder="“Customer shipping 2 Ozempic pens per parcel via FedEx/UPS… wants 72–96h protection, 2–8 °C, better sustainability.”"
              className="text-base"
              disabled={isRecording}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-500 flex-1">
                Add details, correct transcription, or paste notes from another app. We use this field for the analysis.
              </p>
              <button
                type="button"
                onClick={() => {
                  setNotes(SAMPLE_SUMMARY);
                  setTranscript(SAMPLE_SUMMARY);
                  finalTranscriptRef.current = SAMPLE_SUMMARY;
                }}
                className="text-xs text-slate-500 underline"
                disabled={isRecording}
              >
                Use sample text
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link href="/">
            <Button variant="ghost" className="w-full sm:w-auto gap-2 text-slate-600">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Button>
          </Link>
          <Button
            onClick={handleAnalyzeSummary}
            disabled={!canContinueFromSummary}
            className="bg-slate-900 text-white hover:bg-slate-800 w-full sm:w-auto gap-2"
          >
            Analyze summary
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStepTwo = () => (
    <Card>
      <CardContent className="p-6 sm:p-10 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-3">Step 2 · Extract signal</p>
          <h2 className="text-2xl sm:text-3xl font-light text-slate-900">Review detected context</h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            We parsed your summary into actionable packaging signals. Confirm or tweak before we generate outputs.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 p-5 bg-slate-50">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Raw transcript preview</p>
          <p className="text-sm text-slate-700 leading-relaxed">{summaryPreview}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {highlightChips.map((chip) => (
            <div key={chip.label} className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">{chip.label}</p>
              <p className="text-sm text-slate-800">{chip.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 p-6 bg-white space-y-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-[#FF6B4A]" />
            <div>
              <p className="text-sm font-medium text-slate-900">Auto-detected priorities</p>
              <p className="text-sm text-slate-600">Temperature assurance · Parcel efficiency · Sustainability · Patient safety</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-[#4ECDC4]" />
            <div>
              <p className="text-sm font-medium text-slate-900">Suggested playbooks</p>
              <p className="text-sm text-slate-600">Cold-chain kit builder · Dim-weight optimization · Sustainable insulation matrix</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={handleBackStep}
            className="w-full sm:w-auto border-slate-300 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNextStep} className="w-full sm:w-auto bg-slate-900 text-white gap-2">
            Continue to insights
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStepThree = () => (
    <Card>
      <CardContent className="p-6 sm:p-10 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-3">Step 3 · Ready to run</p>
          <h2 className="text-2xl sm:text-3xl font-light text-slate-900">Generate the post-meeting brief</h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            We’ll produce recommendations, cost models, supplier matches, and next steps tailored to this opportunity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "Packaging recommendations", detail: "Primary, secondary, cold chain layers" },
            { title: "Cost & ROI view", detail: "Dim weight + freight savings scenarios" },
            { title: "Supplier shortlist", detail: "Pre-vetted cold chain providers" },
            { title: "Action playbook", detail: "Discovery prompts and follow-ups" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 p-4 flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#4ECDC4] mt-1" />
              <div>
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-600">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Next up</p>
          <p className="text-sm text-slate-700">
            Hit “Generate Word brief” to create an editable .docx we populate with GPT. Provide at least ~40 characters so
            the model has enough context, then edit the output together before sharing.
          </p>
        </div>

        {reportError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {reportError}
          </div>
        )}
        {reportSuccess && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Word brief downloaded. Share it internally or tailor it further before the customer hand-off.
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              onClick={handleBackStep}
              className="w-full border-slate-300 gap-2 sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Link href="/">
              <Button variant="ghost" className="w-full text-slate-600 sm:w-auto">
                Return to dashboard
              </Button>
            </Link>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              className="w-full border-slate-300 text-slate-700 sm:w-auto"
              onClick={handleResetFlow}
            >
              Reset flow
            </Button>
            <Button
              className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto"
              disabled={!canRequestReport || isGeneratingReport}
              onClick={() => void handleGenerateReport()}
            >
              {isGeneratingReport ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating…
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" />
                  Generate Word brief
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 sm:py-6">
          <img src="/Defftlogo.png" alt="Defft.ai" className="h-10 sm:h-12 lg:h-16" />
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-slate-600">
              <ArrowLeft className="h-4 w-4" />
              Exit
            </Button>
          </Link>
        </div>
      </header>

      <div className="bg-slate-50 border-b border-slate-200 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">{renderStepIndicator()}</div>
      </div>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}
        </div>
      </main>
    </div>
  );
}
