export const customScript = function (App) {
  console.log("ENGrid client scripts are executing");
  // Add your client scripts here
  function updateLabel(field) {
    const fieldEl = field.querySelector(".en__field__input");

    let isFieldRequired =
      fieldEl.required ||
      fieldEl.getAttribute("aria-required") === "true" ||
      field.classList.contains("en__mandatory") ||
      fieldEl.closest(".en__component--formblock.i-required");

    const enField = fieldEl.closest(".en__field");
    const enForm = enField?.parentElement;

    if (enForm) {
      // Check if field is required based on its parent's iX-required class
      const index = [...enForm.children].indexOf(enField);
      if (enForm.classList.contains(`i${index + 1}-required`)) {
        isFieldRequired = true;
      }

      // Update the label to reflect the required status
      const labelEl = enField.querySelector(
        ".en__component--formblock:not(.give-by-select) .en__field__label"
      );
      if (labelEl) {
        const label = labelEl.textContent.trim();
        if (
          isFieldRequired &&
          !(label.endsWith("*") || labelEl.querySelector("span.asterisk"))
        ) {
          // Insert a span with the asterisk to allow for styling. No innerHTML
          // manipulation to avoid potential XSS issues.
          const asterisk = document.createElement("span");
          asterisk.classList.add("asterisk");
          asterisk.textContent = "*";
          labelEl.appendChild(asterisk);
        } else if (
          !isFieldRequired &&
          (label.endsWith("*") || labelEl.querySelector("span.asterisk"))
        ) {
          const asterisk = labelEl.querySelector("span.asterisk");
          if (asterisk) {
            labelEl.removeChild(asterisk);
          } else {
            // Fallback in case the asterisk is not wrapped in a span
            labelEl.textContent = label.replace(/\*$/, "").trim();
          }
        }
      }
    }
  }

  // Update the label of each field based on its required status
  const fields = document.querySelectorAll(".en__field");
  fields.forEach((field) => {
    const skipFields = ["en__field--donationAmt", "en__field--recurrfreq"];
    if (
      [...field.classList].some((className) => skipFields.includes(className))
    ) {
      return;
    }

    updateLabel(field);
    const observer = new MutationObserver(() => updateLabel(field));
    observer.observe(field, {
      childList: true,
      subtree: true,
    });
  });

  App.setBodyData("client-js-loading", "finished");
};
