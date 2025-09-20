"use client"

import { useEffect } from "react"

export function FactNotificationService() {
  useEffect(() => {
    // Register service worker for notifications
    if ("serviceWorker" in navigator && "Notification" in window) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.log("Service Worker registration failed:", error)
      })
    }

    // Schedule daily notification
    const scheduleDailyNotification = () => {
      if (Notification.permission === "granted") {
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(9, 0, 0, 0) // 9 AM next day

        const timeUntilNotification = tomorrow.getTime() - now.getTime()

        setTimeout(() => {
          new Notification("🤯 Your daily fact is ready!", {
            body: "Discover something amazing that will blow your mind!",
            icon: "/icon-192x192.png",
            badge: "/icon-72x72.png",
            tag: "daily-fact",
            requireInteraction: true,
            actions: [
              {
                action: "view",
                title: "View Fact",
              },
              {
                action: "later",
                title: "Remind Later",
              },
            ],
          })

          // Schedule next notification
          scheduleDailyNotification()
        }, timeUntilNotification)
      }
    }

    scheduleDailyNotification()
  }, [])

  return null
}
