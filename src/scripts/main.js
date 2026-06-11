import { ENGrid, DonationFrequency } from "@4site/engrid-scripts";

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

  if (ENGrid.getPageType() === "DONATION" && !ENGrid.isThankYouPage()) {
    const setupDonationAmountOther = () => {
      console.log("Setting up donation amount other field");
      const donationAmountInput = document.querySelector(
        'input[name="transaction.donationAmt"][value="other"]'
      );
      const donationAmountOtherInput = document.querySelector(
        'input[name="transaction.donationAmt.other"]'
      );
      console.log("Donation amount input:", donationAmountInput);
      console.log("Donation amount other input:", donationAmountOtherInput);
      console.log(
        "Donation amount input parent:",
        donationAmountInput?.parentNode
      );
      if (
        donationAmountInput &&
        donationAmountInput.parentNode &&
        donationAmountOtherInput
      ) {
        donationAmountInput.parentNode.style.display = "block";
        const labelEl = donationAmountInput.parentNode.querySelector("label");
        if (labelEl) {
          labelEl.textContent = "[$]\u2009\u2009\u2009\u2009Other";
        }
        donationAmountOtherInput.setAttribute("placeholder", "Custom Amount");
        donationAmountOtherInput.parentElement?.classList.add(
          "engrid_other-fullwidth"
        );
        donationAmountInput.addEventListener("click", () => {
          donationAmountOtherInput.focus();
        });
      }
    };

    const radioArea = document.querySelector(
      ".radio-to-buttons_donationAmt div.en__field__element.en__field__element--radio"
    );
    if (radioArea) {
      setupDonationAmountOther();

      const donationAmountObserver = new MutationObserver((mutations) => {
        const wasAdded = mutations.some((mutation) => {
          return [...mutation.addedNodes].some((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              return (
                node.matches?.(
                  'input[name="transaction.donationAmt"][value="other"]'
                ) ||
                node.querySelector?.(
                  'input[name="transaction.donationAmt"][value="other"]'
                )
              );
            }
            return false;
          });
        });

        if (wasAdded) {
          setupDonationAmountOther();
        }
      });
      donationAmountObserver.observe(radioArea, {
        childList: true,
        subtree: true,
      });
    }
  }

  let firstRun = true;
  DonationFrequency.getInstance().onFrequencyChange.subscribe((frequency) => {
    if (firstRun) {
      firstRun = false;
      return;
    }
    const arrowRightDiv = document.querySelector(".arrow-right");
    if (arrowRightDiv) {
      if (frequency !== "monthly") {
        arrowRightDiv.classList.add("animate-appear");
        // set a new random string as the background image url for the ::after of this div to force it to update and show the animation again
        const randomString = Math.random().toString(36).substring(2, 15);
        arrowRightDiv.style.setProperty(
          "--arrow-bg-url",
          `url("https://bd6ca9cefa6fb6e0adf1-c2f9aa1adb9f60a775f60074e4c86031.ssl.cf5.rackcdn.com/20002/arrow-reveal.svg?v=${randomString}")`
        );
      } else {
        arrowRightDiv.classList.remove("animate-appear");
      }
    }
  });

  App.setBodyData("client-js-loading", "finished");
};
