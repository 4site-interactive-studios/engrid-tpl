import { Options, App, DonationAmount, DonationFrequency, RememberMe, Ecard } from "@4site/engrid-scripts"; // Uses ENGrid via NPM
// import { Options, App } from "../../engrid-scripts/packages/common"; // Uses ENGrid via Visual Studio Workspace

import "./sass/main.scss";
import { customScript } from "./scripts/main";
import DonationLightboxForm from "./scripts/donation-lightbox-form";
import SuggestedAmount from "./scripts/suggested-amount";
import SubscriptionManagement from "./scripts/subscription-management";
import Confetti from "./scripts/confetti";

const options: Options = {
  applePay: false,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: "$",
  DecimalSeparator: ".",
  ThousandsSeparator: ",",
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  ProgressBar: true,
  TidyContact: {
    cid: '79d1b649-c5b5-4185-913b-250ca26127d3',
    record_field: 'supporter.NOT_TAGGED_9',
    date_field: 'supporter.NOT_TAGGED_10',
    status_field: 'supporter.NOT_TAGGED_11',
    address_enable: true,
    phone_enable: true,
    phone_flags: true,
    phone_country_from_ip: true,
    phone_preferred_countries: ['US', 'CA'],
    phone_record_field: 'supporter.NOT_TAGGED_12',
    phone_date_field: 'supporter.NOT_TAGGED_13',
    phone_status_field: 'supporter.NOT_TAGGED_14',
  },
  RememberMe: {
    checked: true,
    fieldOptInSelectorTarget: ".remember-me, div.en__field--postcode, div.en__field--telephone, div.en__field--email, div.en__field--lastName",
    fieldOptInSelectorTargetLocation: "after",
    fieldClearSelectorTarget:
      "div.en__field--firstName div, div.en__field--email div",
    fieldClearSelectorTargetLocation: "after",
    fieldNames: [
      "supporter.firstName",
      "supporter.lastName",
      "supporter.address1",
      "supporter.address2",
      "supporter.city",
      "supporter.country",
      "supporter.region",
      "supporter.postcode",
      "supporter.emailAddress",
    ],
  },
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => {
    (<any>window).DonationLightboxForm = DonationLightboxForm;
    new DonationLightboxForm(DonationAmount, DonationFrequency, App);
    new SuggestedAmount();
    new SubscriptionManagement();
    new Confetti();
    new Ecard();
    customScript(App);
  },
  onResize: () => console.log("Starter Theme Window Resized"),
};
new App(options);
