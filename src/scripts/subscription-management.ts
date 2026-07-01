import { ENGrid, EngridLogger, EnForm } from "@4site/engrid-scripts";

export default class SubscriptionManagement {
  private logger: EngridLogger = new EngridLogger("TPL SubscriptionManagement", "green", "white", "✉️");
  private readonly _form = EnForm.getInstance();
  private readonly fewerEmailsButton: HTMLButtonElement | null;
  private readonly restoreEmailsButton: HTMLButtonElement | null;
  private readonly unsubAllButton: HTMLButtonElement | null;
  private readonly optInBlock: Element | null;
  private readonly fewerEmailsOptIn: HTMLInputElement | null;
  private submittedViaButton: boolean = false;

  constructor() {
    this.fewerEmailsButton = document.querySelector("#fewer-emails");
    this.restoreEmailsButton = document.querySelector("#restore-emails");
    this.unsubAllButton = document.querySelector("#unsub-all");
    this.optInBlock = document.querySelector(".opt-in-block");
    this.fewerEmailsOptIn = document.querySelector(".fewer-emails-opt-in input");

    if (this.shouldRun()) {
      this.logger.log("SubscriptionManagement initialized");
      this.addEventListeners();
    }
  }

  private shouldRun(): boolean {
    return ENGrid.getPageType() === "UNSUBSCRIBE";
  }

  private addEventListeners(): void {
    this.fewerEmailsButton?.addEventListener("click", (event) => {
      event.preventDefault();
      this.logger.log("Fewer emails selected");
      this.uncheckAllOptIns();
      if (this.fewerEmailsOptIn) {
        this.fewerEmailsOptIn.checked = true;
        this.fewerEmailsOptIn.value = "Y";
      }
      this.submittedViaButton = true;
      this._form.submitForm();
    });

    this.restoreEmailsButton?.addEventListener("click", (event) => {
      event.preventDefault();
      this.logger.log("Restore emails selected");
      if (this.fewerEmailsOptIn) {
        this.fewerEmailsOptIn.checked = false;
        this.fewerEmailsOptIn.value = "N";
      }
      this.checkFirstOptIn();
      this.submittedViaButton = true;
      this._form.submitForm();
    });

    this.unsubAllButton?.addEventListener("click", (event) => {
      event.preventDefault();
      this.logger.log("Unsubscribe all selected");
      this.uncheckAllOptIns();
      if (this.fewerEmailsOptIn) {
        this.fewerEmailsOptIn.checked = false;
        this.fewerEmailsOptIn.value = "N";
      }
      this.submittedViaButton = true;
      this._form.submitForm();
    });

    if (this.fewerEmailsOptIn) {
      this._form.onSubmit.subscribe(() => {
        if (this.isFirstOptInChecked() && !this.submittedViaButton) {
          this.logger.log("First opt-in is checked/Y on submit; unchecking fewer-emails opt-in");
          if (this.fewerEmailsOptIn) {
            this.fewerEmailsOptIn.checked = false;
            this.fewerEmailsOptIn.value = "N";
          }
        }
      });
    }
  }

  private isFirstOptInChecked(): boolean {
    if (!this.optInBlock) return false;
    const firstOptIn = this.optInBlock.querySelector("input") as HTMLInputElement | null;
    if (!firstOptIn) return false;
    return firstOptIn.checked || firstOptIn.value === "Y";
  }

  private uncheckAllOptIns(): void {
    if (!this.optInBlock) return;
    const optInInputs = this.optInBlock.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
    optInInputs.forEach((input) => {
      if (input.value === "Y") {
        input.checked = false;
        input.value = "N";
      }
    });
  }

  private checkFirstOptIn(): void {
    if (!this.optInBlock) return;
    const firstOptIn = this.optInBlock.querySelector("input") as HTMLInputElement | null;
    if (firstOptIn) {
      firstOptIn.checked = true;
      firstOptIn.value = "Y";
    }
  }
}
