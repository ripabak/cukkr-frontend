export function generateSlug(text: string): string {
  if (!text) return "";
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
    return { isValid: false, message: "createBarbershop.validation.slugMinLength" };
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      isValid: false,
      message: "createBarbershop.validation.slugInvalid",
    };
  }
  return { isValid: true, message: "" };
}
