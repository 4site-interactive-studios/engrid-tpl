import { ENGrid, EngridLogger, DonationFrequency } from "@4site/engrid-scripts";
interface SuggestedAmountConfig {
  monthly: number[],
  onetime: number[],
  [key: string]: number[]
}
const DEFAULT_SUGGESTED: SuggestedAmountConfig = {
  "monthly": [19, 35],
  "onetime": [60, 35]
}

export default class SuggestedAmount {
  private logger: EngridLogger = new EngridLogger("TPL SuggestedAmount", "green", "white", "✨");
  private readonly _frequency = DonationFrequency.getInstance();

  constructor(config?: SuggestedAmountConfig) {
    if (this.shouldRun()) {
      let workingConfig = { ...DEFAULT_SUGGESTED, ...config };
      // Load config from URL param, then window variable, then constructor, then default
      const urlConfig = new URLSearchParams(window.location.search).get("suggestedAmounts");
      if (urlConfig) {
        try {
          workingConfig = JSON.parse(urlConfig);
          this.logger.log("Loaded suggested amounts from URL parameter", workingConfig);
        } catch (e) {
          this.logger.error("Failed to parse suggested amounts from URL parameter, using default", e);
        }
      } else if ((window as any).EngridSuggestedAmounts) {
        workingConfig = { ...workingConfig, ...(window as any).EngridSuggestedAmounts };
      }
      this.logger.log("Using suggested amounts configuration", workingConfig);
      this._frequency.onFrequencyChange.subscribe(() => this.applySuggestedAmounts(workingConfig));
      this.applySuggestedAmounts(workingConfig, true);
    }
  }

  private removeSuggestedAmounts() {
    const amountLabels = document.querySelectorAll(".engrid__suggested-amount");
    amountLabels.forEach(label => label.classList.remove("engrid__suggested-amount"));
  }

  private applySuggestedAmounts(config: SuggestedAmountConfig, firstRun = false) {
    this.removeSuggestedAmounts();
    const suggestedValues = config[this._frequency.frequency];
    if (!suggestedValues || suggestedValues.length === 0) {
      this.logger.warn(`No suggested amounts configured for frequency "${this._frequency.frequency}"`);
      return;
    }
    const amountOptions = document.querySelectorAll("input[name='transaction.donationAmt']") as NodeListOf<HTMLInputElement>;
    let matchedValue = false;
    for (const input of amountOptions) {
      const value = parseFloat(input.value);
      if (suggestedValues.indexOf(value) !== -1 && !matchedValue) {
        this.logger.log(`Marking $${value} as a suggested amount for frequency "${this._frequency.frequency}"`);
        input.classList.add("engrid__suggested-amount");
        matchedValue = true;
        if (firstRun) {
          this.logger.log(`Selecting $${value} as the default amount on page load for frequency "${this._frequency.frequency}"`);
          input.checked = true;
        }
      }
    }
    if (!matchedValue) {
      this.logger.warn(`None of the suggested amounts [${suggestedValues.join(", ")}] match any options for frequency "${this._frequency.frequency}"`);
    }
  }

  private shouldRun() {
    return ENGrid.getPageType() === "DONATION" && ENGrid.isThankYouPage() === false && document.querySelector(".en__field--donationAmt") !== null;
  }
}