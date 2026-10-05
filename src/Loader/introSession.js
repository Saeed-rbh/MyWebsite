const INTRO_SEEN_KEY = "saeed-portfolio-intro-seen";

export function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Navigation still works when session storage is unavailable.
  }
}
