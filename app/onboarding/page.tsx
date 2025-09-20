"use client"

import { useRouter } from "next/navigation"
import { OnboardingFlow } from "@/components/onboarding-flow"

export default function OnboardingPage() {
  const router = useRouter()

  const handleOnboardingComplete = () => {
    router.push("/")
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />
}
