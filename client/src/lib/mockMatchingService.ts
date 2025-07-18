// Mock matching service for when no real server is available
class MockMatchingService {
  private static instance: MockMatchingService;
  private waitingUsers: Set<string> = new Set();
  private callbacks: Map<string, (partnerId: string) => void> = new Map();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): MockMatchingService {
    if (!MockMatchingService.instance) {
      MockMatchingService.instance = new MockMatchingService();
    }
    return MockMatchingService.instance;
  }

  findMatch(userId: string, onMatch: (partnerId: string) => void): void {
    console.log("Mock matching: Looking for match for", userId);

    // Store callback
    this.callbacks.set(userId, onMatch);

    // Check if there are other waiting users
    if (this.waitingUsers.size > 0) {
      // Get first waiting user
      const partnerId = Array.from(this.waitingUsers)[0];
      this.waitingUsers.delete(partnerId);

      // Clear any existing timeout for partner
      const partnerTimeout = this.timeouts.get(partnerId);
      if (partnerTimeout) {
        clearTimeout(partnerTimeout);
        this.timeouts.delete(partnerId);
      }

      // Get partner callback
      const partnerCallback = this.callbacks.get(partnerId);

      console.log("Mock matching: Found match!", userId, "<->", partnerId);

      // Simulate network delay
      setTimeout(
        () => {
          onMatch(partnerId);
          if (partnerCallback) {
            partnerCallback(userId);
          }

          // Cleanup
          this.callbacks.delete(userId);
          this.callbacks.delete(partnerId);
        },
        1000 + Math.random() * 2000,
      ); // 1-3 second delay
    } else {
      // No match found, add to waiting list
      this.waitingUsers.add(userId);
      console.log("Mock matching: Added to waiting list", userId);

      // Set timeout for this user (30 seconds)
      const timeout = setTimeout(() => {
        this.waitingUsers.delete(userId);
        this.callbacks.delete(userId);
        this.timeouts.delete(userId);
        console.log("Mock matching: Timeout for", userId);
      }, 30000);

      this.timeouts.set(userId, timeout);
    }
  }

  cancelMatch(userId: string): void {
    this.waitingUsers.delete(userId);
    this.callbacks.delete(userId);

    const timeout = this.timeouts.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(userId);
    }
  }

  // Simulate random users joining (for better testing)
  simulateRandomUser(): void {
    const randomId = "bot_" + Math.random().toString(36).substr(2, 9);

    setTimeout(
      () => {
        this.findMatch(randomId, (partnerId) => {
          console.log("Bot matched with:", partnerId);
        });
      },
      Math.random() * 10000 + 5000,
    ); // Random delay 5-15 seconds
  }

  // Start periodic bot simulation
  startBotSimulation(): void {
    // Add a bot every 15-30 seconds
    setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance
        this.simulateRandomUser();
      }
    }, 15000);
  }
}

export default MockMatchingService;
