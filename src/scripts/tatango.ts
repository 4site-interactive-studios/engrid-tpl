import { ENGrid } from "@4site/engrid-scripts";

export function sendSupporterDataToTatango(): void {
  // Only send data if the supporter has opted in to receive text messages
  if (ENGrid.getFieldValue("supporter.questions.7902") !== "Y") return;

  const country = ENGrid.getFieldValue("tc.phone.country");
  const phoneNumber = formatPhoneNumber(
    ENGrid.getFieldValue("supporter.phoneNumber2")
  );

  if (country !== "us" || !phoneNumber) {
    // Only send data for US supporters and valid phone numbers
    return;
  }

  fetch(
    "https://tatango-api.azurewebsites.net/api/submit?code=X4CkahsXuaLQOy3GFnnBcmLVMeZMVF7G1vjT8sB2cY7uAzFuBskMWA==",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        first_name: ENGrid.getFieldValue("supporter.firstName"),
        last_name: ENGrid.getFieldValue("supporter.lastName"),
        email: ENGrid.getFieldValue("supporter.emailAddress"),
        zip_code: ENGrid.getFieldValue("supporter.postcode"),
        en_page_id: ENGrid.getPageID(),
      }),
    }
  ).then((r) => {});
}

export function formatPhoneNumber(phone: string): string | null {
  // Remove all non-digit characters from the phone number and get the last 10 digits
  // Matches the format expected by Tatango:
  // 10 digits, no country code, no spaces or special characters
  const cleaned = phone.replace(/\D/g, "").slice(-10);

  if (cleaned.length !== 10) {
    return null;
  }

  return cleaned;
}
