/**
 * Wake up the backend server from sleep
 * Retries every 2 seconds until successful
 */
export async function wakeBackend(url: string): Promise<void> {
  const maxRetries = 30; // 60 seconds total
  let retries = 0;

  console.log("Waking backend...");

  const attemptWake = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  while (retries < maxRetries) {
    const success = await attemptWake();
    
    if (success) {
      console.log("Backend awake.");
      return;
    }

    retries++;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.warn("Backend wake-up timed out after 60 seconds");
}
