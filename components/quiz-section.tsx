"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Trophy, Target, CheckCircle, XCircle, Flame, Star, Info, History, Award, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

type QuizMode = "overview" | "recap" | "true-false" | "results" | "history"

interface Question {
  id: string
  question: string
  options?: string[]
  correct: number | boolean
  explanation: string
  category: string
}

interface QuizState {
  currentQuestion: number
  score: number
  answers: (number | boolean | null)[]
  timeLeft: number
  streak: number
  totalQuestions: number
}

interface QuizHistory {
  mode: string
  score: number
  total: number
  date: string
  streak: number
}

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  requirement: string
}

const recapQuestions: Question[] = [
  {
    id: "recap-1",
    question: "What color is octopus blood?",
    options: ["Red", "Blue", "Green", "Purple"],
    correct: 1,
    explanation: "Octopuses have blue blood due to copper-based hemocyanin instead of iron-based hemoglobin.",
    category: "Marine Biology",
  },
  {
    id: "recap-2",
    question: "How long does honey last?",
    options: ["1 year", "10 years", "100 years", "Forever"],
    correct: 3,
    explanation: "Honey never spoils due to its low moisture content and acidic pH.",
    category: "Food Science",
  },
  {
    id: "recap-3",
    question: "What is a group of flamingos called?",
    options: ["Flock", "Flamboyance", "Colony", "Pride"],
    correct: 1,
    explanation: "A group of flamingos is called a 'flamboyance' - quite fitting for these colorful birds!",
    category: "Animals",
  },
  {
    id: "recap-4",
    question: "How much energy does your brain use?",
    options: ["5% of body energy", "10% of body energy", "20% of body energy", "30% of body energy"],
    correct: 2,
    explanation: "Your brain uses about 20% of your body's total energy despite weighing only 2% of your body weight.",
    category: "Human Body",
  },
  {
    id: "recap-5",
    question: "What shape is wombat poop?",
    options: ["Round", "Oval", "Cube", "Triangle"],
    correct: 2,
    explanation: "Wombat poop is cube-shaped due to varying elasticity in their intestines!",
    category: "Animals",
  },
]

const trueFalseQuestions: Question[] = [
  {
    id: "tf-1",
    question: "Bananas are technically berries.",
    correct: true,
    explanation: "Botanically, bananas are berries because they develop from a single flower and have seeds inside.",
    category: "Botany",
  },
  {
    id: "tf-2",
    question: "The Great Wall of China is visible from space.",
    correct: false,
    explanation: "This is a common myth. The Great Wall is not visible from space with the naked eye.",
    category: "History",
  },
  {
    id: "tf-3",
    question: "A single cloud can weigh more than a million pounds.",
    correct: true,
    explanation: "Clouds can weigh millions of pounds! The water droplets are just very spread out.",
    category: "Weather",
  },
  {
    id: "tf-4",
    question: "Strawberries are berries.",
    correct: false,
    explanation: "Strawberries are not true berries - they're aggregate fruits. Their seeds are on the outside!",
    category: "Botany",
  },
  {
    id: "tf-5",
    question: "The shortest war in history lasted less than an hour.",
    correct: true,
    explanation: "The Anglo-Zanzibar War lasted only 38-45 minutes in 1896!",
    category: "History",
  },
]

export function QuizSection() {
  const [quizMode, setQuizMode] = useState<QuizMode>("overview")
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    answers: [],
    timeLeft: 15,
    streak: 0,
    totalQuestions: 5,
  })
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [confetti, setConfetti] = useState(false)
  const [showInfoPopover, setShowInfoPopover] = useState(false)
  const [tempoAnimation, setTempoAnimation] = useState(false)
  const [quizStats, setQuizStats] = useState({
    lastScore: 0,
    bestStreak: 0,
    totalQuizzes: 0,
  })

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("quizHistory") || "[]")
    if (history.length > 0) {
      const lastQuiz = history[history.length - 1]
      const bestStreak = Math.max(...history.map((q: QuizHistory) => q.streak))
      setQuizStats({
        lastScore: Math.round((lastQuiz.score / lastQuiz.total) * 100),
        bestStreak,
        totalQuizzes: history.length,
      })
    }
  }, [])

  const currentQuestion = questions[quizState.currentQuestion]

  const getBadges = (): Badge[] => {
    const history = JSON.parse(localStorage.getItem("quizHistory") || "[]")
    const perfectScores = history.filter((q: QuizHistory) => q.score === q.total).length
    const totalQuizzes = history.length
    const bestStreak = Math.max(...history.map((q: QuizHistory) => q.streak), 0)

    return [
      {
        id: "first-quiz",
        name: "Första försöket",
        description: "Genomför ditt första quiz",
        icon: <Star className="w-4 h-4" />,
        unlocked: totalQuizzes >= 1,
        requirement: "Genomför 1 quiz",
      },
      {
        id: "perfect-score",
        name: "Perfekt poäng",
        description: "Få 100% på ett quiz",
        icon: <Trophy className="w-4 h-4" />,
        unlocked: perfectScores >= 1,
        requirement: "Få 100% på ett quiz",
      },
      {
        id: "streak-master",
        name: "Streak-mästare",
        description: "Få 5 rätt i rad",
        icon: <Flame className="w-4 h-4" />,
        unlocked: bestStreak >= 5,
        requirement: "5 rätt i rad",
      },
      {
        id: "quiz-addict",
        name: "Quiz-beroende",
        description: "Genomför 10 quiz",
        icon: <Brain className="w-4 h-4" />,
        unlocked: totalQuizzes >= 10,
        requirement: "Genomför 10 quiz",
      },
    ]
  }

  useEffect(() => {
    if (quizMode === "recap" || quizMode === "true-false") {
      if (quizState.timeLeft > 0 && !showExplanation) {
        const timer = setTimeout(() => {
          setQuizState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
          if (quizMode === "true-false") {
            setTempoAnimation(true)
            setTimeout(() => setTempoAnimation(false), 200)
          }
        }, 1000)
        return () => clearTimeout(timer)
      } else if (quizState.timeLeft === 0 && !showExplanation) {
        handleAnswer(null)
      }
    }
  }, [quizState.timeLeft, showExplanation, quizMode])

  const startQuiz = (mode: "recap" | "true-false") => {
    const quizQuestions = mode === "recap" ? recapQuestions : trueFalseQuestions
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, mode === "recap" ? 5 : 10)

    setQuestions(shuffled)
    setQuizMode(mode)
    setQuizState({
      currentQuestion: 0,
      score: 0,
      answers: [],
      timeLeft: mode === "true-false" ? 12 : 15,
      streak: 0,
      totalQuestions: shuffled.length,
    })
    setSelectedAnswer(null)
    setShowExplanation(false)
    setTempoAnimation(false)
  }

  const handleAnswer = (answer: number | boolean | null) => {
    setSelectedAnswer(answer)
    setShowExplanation(true)

    const isCorrect = answer === currentQuestion.correct
    const newAnswers = [...quizState.answers, answer]

    setQuizState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: newAnswers,
      streak: isCorrect ? prev.streak + 1 : 0,
    }))

    if (isCorrect && quizState.streak >= 2) {
      setConfetti(true)
      setTimeout(() => setConfetti(false), 2000)
    }
  }

  const nextQuestion = () => {
    if (quizState.currentQuestion + 1 < quizState.totalQuestions) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        timeLeft: quizMode === "true-false" ? 12 : 15,
      }))
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTempoAnimation(false)
    } else {
      setQuizMode("results")
      const quizHistory = JSON.parse(localStorage.getItem("quizHistory") || "[]")
      quizHistory.push({
        mode: quizMode,
        score: quizState.score,
        total: quizState.totalQuestions,
        date: new Date().toISOString(),
        streak: quizState.streak,
      })
      localStorage.setItem("quizHistory", JSON.stringify(quizHistory))
    }
  }

  const resetQuiz = () => {
    setQuizMode("overview")
    setQuizState({
      currentQuestion: 0,
      score: 0,
      answers: [],
      timeLeft: 15,
      streak: 0,
      totalQuestions: 5,
    })
    setSelectedAnswer(null)
    setShowExplanation(false)
    setConfetti(false)
  }

  if (quizMode === "overview") {
    const badges = getBadges()
    const unlockedBadges = badges.filter((b) => b.unlocked)

    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-primary" size={24} />
            <h1 className="text-xl font-bold">Quiz</h1>
          </div>
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setShowInfoPopover(!showInfoPopover)} className="p-2">
              <Info size={16} />
            </Button>
            {showInfoPopover && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-background border rounded-lg shadow-lg z-10">
                <p className="text-sm text-muted-foreground">Quizzen är lättsamma och tar under 1 minut.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInfoPopover(false)}
                  className="mt-2 p-0 h-auto text-xs"
                >
                  Stäng
                </Button>
              </div>
            )}
          </div>
        </div>

        {quizStats.totalQuizzes > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <div className="text-lg font-bold text-primary">{quizStats.lastScore}%</div>
              <div className="text-xs text-muted-foreground">Senaste</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg font-bold text-secondary">{quizStats.bestStreak}</div>
              <div className="text-xs text-muted-foreground">Bästa streak</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg font-bold text-accent">{unlockedBadges.length}</div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-primary" size={20} />
              <h3 className="font-bold text-lg">Recap-quiz</h3>
            </div>
            <p className="text-muted-foreground mb-4 text-pretty">
              Bygger på fakta du sett de senaste 3 dagarna. 5 snabba frågor.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Brain size={16} />5 frågor
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Target size={16} />
                15s per fråga
              </div>
            </div>
            <Button onClick={() => startQuiz("recap")} className="w-full bg-primary hover:bg-primary/90">
              Starta
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/5 to-accent/5 border-2 border-secondary/20">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-secondary" size={20} />
              <h3 className="font-bold text-lg">Sant/Falskt</h3>
            </div>
            <p className="text-muted-foreground mb-4 text-pretty">Blanda riktiga och påhittade. 10 frågor.</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Brain size={16} />
                10 frågor
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Flame size={16} />
                Streak bonus
              </div>
            </div>
            <Button
              onClick={() => startQuiz("true-false")}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Starta
            </Button>
          </Card>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award size={18} />
            Badges
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <Card
                key={badge.id}
                className={cn(
                  "p-3 flex items-center gap-3",
                  badge.unlocked ? "bg-gradient-to-r from-accent/10 to-primary/10" : "opacity-50",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-full",
                    badge.unlocked ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground",
                  )}
                >
                  {badge.unlocked ? badge.icon : <Lock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{badge.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {badge.unlocked ? badge.description : badge.requirement}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {quizStats.totalQuizzes > 0 && (
          <Button variant="outline" onClick={() => setQuizMode("history")} className="w-full">
            <History size={16} className="mr-2" />
            Historik
          </Button>
        )}
      </div>
    )
  }

  if (quizMode === "history") {
    const history: QuizHistory[] = JSON.parse(localStorage.getItem("quizHistory") || "[]").reverse()

    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => setQuizMode("overview")} className="p-2">
            ← Tillbaka
          </Button>
          <h1 className="text-xl font-bold">Quiz-historik</h1>
        </div>

        {history.length === 0 ? (
          <Card className="p-8 text-center">
            <Brain className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="font-semibold mb-2">Ingen historik än</h3>
            <p className="text-muted-foreground mb-4">Genomför ditt första quiz för att se din historik här.</p>
            <Button onClick={() => setQuizMode("overview")}>Tillbaka till quiz</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((quiz, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{quiz.mode === "recap" ? "Recap-quiz" : "Sant/Falskt"}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(quiz.date).toLocaleDateString("sv-SE", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {quiz.score}/{quiz.total}
                    </div>
                    <div className="text-sm text-muted-foreground">{Math.round((quiz.score / quiz.total) * 100)}%</div>
                    {quiz.streak > 1 && (
                      <div className="flex items-center gap-1 text-xs text-orange-500 mt-1">
                        <Flame size={12} />
                        {quiz.streak} streak
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (quizMode === "results") {
    const percentage = Math.round((quizState.score / quizState.totalQuestions) * 100)
    const isGreatScore = percentage >= 80
    const isPerfectScore = percentage === 100

    return (
      <div className="p-4">
        <div className="text-center mb-6">
          <div className="mb-4">
            {isPerfectScore ? (
              <Trophy className="mx-auto text-accent mb-2" size={48} />
            ) : isGreatScore ? (
              <Star className="mx-auto text-secondary mb-2" size={48} />
            ) : (
              <Brain className="mx-auto text-primary mb-2" size={48} />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isPerfectScore ? "Perfekt poäng!" : isGreatScore ? "Bra jobbat!" : "Bra försök!"}
          </h2>
          <p className="text-muted-foreground">
            {isPerfectScore
              ? "Du är en faktamästare!"
              : isGreatScore
                ? "Du kan verkligen dina fakta!"
                : "Fortsätt utforska för att förbättra dig!"}
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{quizState.score}</div>
              <div className="text-sm text-muted-foreground">Rätt</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Poäng</div>
            </div>
          </div>

          {quizState.streak > 1 && (
            <div className="mt-4 pt-4 border-t border-border text-center">
              <div className="flex items-center justify-center gap-2 text-orange-500">
                <Flame size={20} />
                <span className="font-bold">{quizState.streak} frågor i rad!</span>
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-3">
          <Button onClick={resetQuiz} className="w-full bg-primary hover:bg-primary/90">
            Prova ett nytt quiz
          </Button>
          <Button variant="outline" onClick={() => setQuizMode("overview")} className="w-full">
            Tillbaka till quiz-meny
          </Button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) return null

  return (
    <div className="p-4 min-h-screen bg-background">
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header with progress */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={resetQuiz} className="p-2" aria-label="Avsluta quiz och gå tillbaka">
          ← Avsluta
        </Button>
        <div className="text-center">
          <h1 className="font-bold text-lg" id="quiz-title">
            {quizMode === "recap" ? "Recap-quiz" : "Sant/Falskt"}
          </h1>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Fråga {quizState.currentQuestion + 1} av {quizState.totalQuestions}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {quizState.streak > 0 && (
            <div className="flex items-center gap-1 text-orange-500" aria-label={`${quizState.streak} rätt i rad`}>
              <Flame size={16} />
              <span className="text-sm font-bold">{quizState.streak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <Progress
          value={((quizState.currentQuestion + 1) / quizState.totalQuestions) * 100}
          className="h-3 bg-muted"
          aria-label={`Framsteg: ${quizState.currentQuestion + 1} av ${quizState.totalQuestions} frågor`}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Fråga {quizState.currentQuestion + 1}</span>
          <span>{quizState.totalQuestions} totalt</span>
        </div>
      </div>

      {!showExplanation && (
        <div className="text-center mb-6">
          {quizMode === "true-false" ? (
            <div className="flex items-center justify-center gap-3">
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  tempoAnimation ? "bg-primary scale-150" : "bg-muted",
                )}
              />
              <div
                className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full transition-all duration-300",
                  quizState.timeLeft <= 3
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : "bg-muted text-muted-foreground",
                )}
                role="timer"
                aria-live="polite"
                aria-label={`${quizState.timeLeft} sekunder kvar`}
              >
                {quizState.timeLeft}s
              </div>
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  tempoAnimation ? "bg-primary scale-150" : "bg-muted",
                )}
              />
            </div>
          ) : (
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300",
                quizState.timeLeft <= 5
                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse scale-110"
                  : "bg-primary/10 text-primary",
              )}
              role="timer"
              aria-live="assertive"
              aria-label={`${quizState.timeLeft} sekunder kvar`}
            >
              <div
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  quizState.timeLeft <= 5 ? "bg-red-500 animate-ping" : "bg-primary",
                )}
              />
              {quizState.timeLeft}s kvar
            </div>
          )}
        </div>
      )}

      <Card
        className={cn(
          "p-6 mb-6 transition-all duration-300",
          showExplanation && selectedAnswer === currentQuestion.correct
            ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20"
            : showExplanation && selectedAnswer !== currentQuestion.correct
              ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-950/20 animate-shake"
              : "hover:shadow-lg",
        )}
        role="main"
        aria-labelledby="question-text"
      >
        <div className="text-center">
          {/* Category badge */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {currentQuestion.category}
            </span>
          </div>

          <h2
            id="question-text"
            className={cn(
              "font-bold mb-8 text-pretty leading-tight max-w-2xl mx-auto",
              quizMode === "true-false" ? "text-2xl md:text-3xl" : "text-xl",
            )}
          >
            {currentQuestion.question}
          </h2>

          {!showExplanation ? (
            <div className="space-y-4" role="group" aria-labelledby="question-text">
              {quizMode === "recap" ? (
                currentQuestion.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleAnswer(index)}
                    className={cn(
                      "w-full text-left justify-start p-6 text-lg font-medium transition-all duration-200",
                      "bg-background hover:bg-primary/5 hover:border-primary/50 hover:scale-[1.02]",
                      "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      "active:scale-[0.98]",
                    )}
                    disabled={selectedAnswer !== null}
                    aria-label={`Alternativ ${String.fromCharCode(65 + index)}: ${option}`}
                  >
                    <span className="mr-4 font-bold text-primary text-xl bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-pretty">{option}</span>
                  </Button>
                ))
              ) : (
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button
                    onClick={() => handleAnswer(true)}
                    className={cn(
                      "w-full sm:w-auto px-16 py-8 bg-green-500 hover:bg-green-600 text-white font-bold text-2xl rounded-3xl",
                      "transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl",
                      "focus:ring-4 focus:ring-green-400 focus:ring-offset-2",
                    )}
                    disabled={selectedAnswer !== null}
                    aria-label="Sant - tryck för att välja sant"
                  >
                    SANT
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    className={cn(
                      "w-full sm:w-auto px-16 py-8 bg-red-500 hover:bg-red-600 text-white font-bold text-2xl rounded-3xl",
                      "transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl",
                      "focus:ring-4 focus:ring-red-400 focus:ring-offset-2",
                    )}
                    disabled={selectedAnswer !== null}
                    aria-label="Falskt - tryck för att välja falskt"
                  >
                    FALSKT
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6" role="region" aria-live="polite" aria-label="Svar och förklaring">
              <div className="flex items-center justify-center gap-3 text-2xl font-bold">
                {selectedAnswer === currentQuestion.correct ? (
                  <>
                    <CheckCircle className="text-green-500 animate-bounce" size={40} />
                    <span className="text-green-600 dark:text-green-400 animate-pulse">
                      {quizMode === "true-false" ? "Rätt!" : "Bra jobbat!"}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 animate-pulse" size={40} />
                    <span className="text-red-600 dark:text-red-400">
                      {selectedAnswer === null ? "Tiden tog slut!" : "Inte riktigt!"}
                    </span>
                  </>
                )}
              </div>

              {/* Correct answer hint for wrong answers */}
              {selectedAnswer !== currentQuestion.correct && quizMode === "recap" && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    Rätt svar: {currentQuestion.options?.[currentQuestion.correct as number]}
                  </p>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-xl text-left border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-blue-700 dark:text-blue-300">Visste du att...</h3>
                </div>
                <p className="text-sm leading-relaxed text-pretty text-blue-800 dark:text-blue-200">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Next button */}
              <Button
                onClick={nextQuestion}
                className={cn(
                  "w-full py-4 text-lg font-bold transition-all duration-200",
                  "bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
                  "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                )}
                aria-label={quizState.currentQuestion + 1 < quizState.totalQuestions ? "Nästa fråga" : "Se resultat"}
              >
                {quizState.currentQuestion + 1 < quizState.totalQuestions ? "Nästa fråga" : "Se resultat"}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Accessibility hints */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>Tryck på ett alternativ för att svara</p>
        <p>Använd Tab för att navigera mellan alternativ</p>
      </div>
    </div>
  )
}
