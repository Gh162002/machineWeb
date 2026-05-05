/**
 * Extrait un message d'erreur lisible depuis une réponse d'erreur FastAPI/Pydantic.
 * Pydantic v2 peut retourner detail comme un tableau d'objets ou une string.
 */
export function parseApiError(err) {
  const detail = err?.response?.data?.detail;

  if (!detail) return 'Une erreur est survenue.';

  // Pydantic v2 : tableau d'objets [{type, loc, msg, input, ctx}, ...]
  if (Array.isArray(detail)) {
    return detail
      .map(d => {
        const field = Array.isArray(d.loc) ? d.loc.join(' → ') : '';
        const msg   = d.msg || JSON.stringify(d);
        return field ? `${field} : ${msg}` : msg;
      })
      .join(' | ');
  }

  // String simple
  if (typeof detail === 'string') return detail;

  // Objet quelconque
  return JSON.stringify(detail);
}
