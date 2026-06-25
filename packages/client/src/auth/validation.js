const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email || !email.trim()) return "Email is required.";
  if (!EMAIL_RE.test(email.trim())) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include a letter and a number.";
  }
  return null;
}

export function validateDisplayName(name) {
  if (!name || !name.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  return null;
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return null;
}

// Maps Firebase Auth error codes to friendly, user-facing messages.
export function friendlyAuthError(error) {
  const code = error?.code || "";
  const map = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "That email address is invalid.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with these credentials.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/weak-password": "Password is too weak.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
    "auth/cancelled-popup-request": "Sign-in was cancelled.",
    "auth/popup-blocked": "Popup blocked. Please allow popups and try again.",
    "auth/requires-recent-login": "Please sign in again to complete this action.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] || error?.message || "Something went wrong. Please try again.";
}
