export const codmSystemMessage = "You are CODMCoach. Provide gameplay tips in JSON format.";
export const localReplySystemMessage = "You are LocalReply. Draft business replies in JSON format.";
export function sanitizeText(s) { return s ? s.toString().trim().slice(0, 2000) : ""; }
