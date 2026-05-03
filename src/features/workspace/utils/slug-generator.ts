export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function validateSlug(slug: string): Promise<{
  isValid: boolean;
  message: string;
}> {
  if (slug.length < 3) {
    return { isValid: false, message: "Slug must be at least 3 characters" };
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { isValid: false, message: "Slug can only contain letters, numbers and hyphens" };
  }
  return { isValid: true, message: "" };
}
