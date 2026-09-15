const SESSION_KEY = 'onboarding-session-id';

// the mock API is keyed by id, so give each browser its own onboarding
// record and reuse it across refreshes
export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
