
export const playSound = (soundName: string) => {
  try {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.3; // Adjust volume as needed
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Sound play failed:', error);
      });
    }
  } catch (error) {
    console.log('Sound loading failed:', error);
  }
};

// Preload sounds for better performance
export const preloadSounds = () => {
  const sounds = ['join', 'match', 'swipe'];
  sounds.forEach(soundName => {
    try {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.preload = 'auto';
    } catch (error) {
      console.log('Sound play failed:', error);
    }
  });
};

// Check if audio is supported
export const isAudioSupported = () => {
  try {
    return typeof Audio !== 'undefined';
  } catch (error) {
    return false;
  }
};
