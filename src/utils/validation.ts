export function sanitizeText(text: string): string {
  return text.trim().replace(/[<>]/g, '');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(0[567]\d{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateContact(contact: string): boolean {
  const cleanContact = contact.replace(/\s/g, '');
  return validateEmail(cleanContact) || validatePhone(cleanContact);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }

  return phone;
}

export function maskSensitiveData(text: string, visibleChars: number = 4): string {
  if (text.length <= visibleChars) {
    return text;
  }
  const visible = text.slice(0, visibleChars);
  const masked = '*'.repeat(text.length - visibleChars);
  return visible + masked;
}

export function validateDocumentNumber(number: string): boolean {
  const cleaned = number.trim();
  return cleaned.length >= 3 && cleaned.length <= 20;
}

export function isValidWilayaId(id: number): boolean {
  return id >= 1 && id <= 48;
}

export function validateInitials(initials: string): boolean {
  const initialsRegex = /^[A-Z]\.\s?[A-Z]\.?$/i;
  return initialsRegex.test(initials.trim());
}

export function formatInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) {
    const firstChar = parts[0]?.charAt(0).toUpperCase() || 'X';
    return `${firstChar}.`;
  }
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstInitial}. ${lastInitial}.`;
}

export function isValidInitialsFormat(text: string): { valid: boolean; error?: string } {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Les initiales sont obligatoires' };
  }

  if (trimmed.length > 10) {
    return { valid: false, error: 'Format invalide (ex: K. M.)' };
  }

  const hasValidFormat = /^[A-Z]\.\s?[A-Z]\.?$/i.test(trimmed);

  if (!hasValidFormat) {
    return { valid: false, error: 'Format requis: "K. M." (initiales uniquement)' };
  }

  return { valid: true };
}
