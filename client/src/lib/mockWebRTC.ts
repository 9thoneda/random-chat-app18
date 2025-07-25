// Mock WebRTC functionality for testing when real connections aren't available
export class MockWebRTC {
  private static remoteVideoElement: HTMLVideoElement | null = null;

  static async createMockRemoteStream(): Promise<MediaStream> {
    // Create a canvas element to generate a mock video stream
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d")!;

    // Create animated mock video
    const drawFrame = () => {
      // Gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, "#ec4899");
      gradient.addColorStop(0.5, "#f43f5e");
      gradient.addColorStop(1, "#a855f7");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some animation
      const time = Date.now() * 0.001;
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      for (let i = 0; i < 5; i++) {
        const x = ((Math.sin(time + i) + 1) * canvas.width) / 2;
        const y = ((Math.cos(time + i * 0.5) + 1) * canvas.height) / 2;
        ctx.beginPath();
        ctx.arc(x, y, 20 + Math.sin(time + i) * 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add text
      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Demo Partner", canvas.width / 2, canvas.height / 2 - 50);
      ctx.font = "16px Arial";
      ctx.fillText(
        "This is a demo connection",
        canvas.width / 2,
        canvas.height / 2,
      );
      ctx.fillText(
        "🎥 Mock Video Stream",
        canvas.width / 2,
        canvas.height / 2 + 30,
      );

      // Add timestamp
      ctx.font = "12px monospace";
      ctx.fillText(
        new Date().toLocaleTimeString(),
        canvas.width / 2,
        canvas.height - 20,
      );
    };

    // Start animation loop
    const animate = () => {
      drawFrame();
      requestAnimationFrame(animate);
    };
    animate();

    // Create stream from canvas
    // @ts-ignore - captureStream is supported in modern browsers
    const stream = canvas.captureStream(30) as MediaStream;

    // Add mock audio track
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Create a very quiet tone
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);

      oscillator.start();

      // Create MediaStreamAudioDestinationNode to get audio track
      const destination = audioContext.createMediaStreamDestination();
      gainNode.connect(destination);

      const audioTrack = destination.stream.getAudioTracks()[0];
      if (audioTrack) {
        stream.addTrack(audioTrack);
      }
    } catch (error) {
      console.log("Could not create mock audio track:", error);
    }

    return stream;
  }

  static async simulateConnection(
    onRemoteStream: (stream: MediaStream) => void,
  ): Promise<void> {
    console.log("🤖 Simulating WebRTC connection...");

    // Simulate connection delay
    setTimeout(
      async () => {
        try {
          const mockStream = await this.createMockRemoteStream();
          console.log("🤖 Mock remote stream created");
          onRemoteStream(mockStream);
        } catch (error) {
          console.error("Failed to create mock stream:", error);
        }
      },
      2000 + Math.random() * 3000,
    ); // 2-5 second delay
  }
}

export default MockWebRTC;
