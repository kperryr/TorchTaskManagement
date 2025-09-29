// Convert ISO string to datetime-local input format
export const formatDateForInput = (isoString: string | undefined): string => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  } catch {
    return "";
  }
};

// Convert datetime-local input to ISO string for database
export const formatDateForDatabase = (
  inputDate: string
): string | undefined => {
  if (!inputDate) return undefined;
  try {
    const date = new Date(inputDate);
    return date.toISOString(); // Full ISO string for database
  } catch {
    return undefined;
  }
};

// Format for display to users
export const formatDateForDisplay = (
  isoString: string | null | undefined
): string => {
  if (!isoString) return "No due date";
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
};
