import { Options, App } from "@4site/engrid-scripts"; // Uses ENGrid via NPM
// import { Options, App } from "../../engrid-scripts/packages/common"; // Uses ENGrid via Visual Studio Workspace

import "./sass/main.scss";
import { customScript } from "./scripts/main";

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
    cid: '00000000-0000-0000-0000-000000000000',
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
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => customScript(App),
  onResize: () => console.log("Starter Theme Window Resized"),
};
new App(options);
