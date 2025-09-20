self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "view") {
    // Open the app
    event.waitUntil(clients.openWindow("/"))
  } else if (event.action === "later") {
    // Schedule reminder in 1 hour
    setTimeout(() => {
      self.registration.showNotification("🧠 Don't forget your daily fact!", {
        body: "Your amazing fact is still waiting for you!",
        icon: "/icon-192x192.png",
        tag: "daily-fact-reminder",
      })
    }, 3600000) // 1 hour
  } else {
    // Default action - open app
    event.waitUntil(clients.openWindow("/"))
  }
})

self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Your daily fact is ready!",
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Explore Fact",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192x192.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("Facta - Daily Fact", options))
})
