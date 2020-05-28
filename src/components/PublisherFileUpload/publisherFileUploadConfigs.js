export default [
    {
        id: "counter",
        displayName: "Download counts",
        descr: "Downloads by journal, last year",

        options: {
            default: {
                heading: "Missing",
                body: "This is required in order to do any forecasting.",
                cta: "",
                icon: "mdi-alert",
                color: "error",
            },
            custom: {
                heading: "Uploaded",
                body: "Forecasting is customized based on your 2019 COUNTER downloads by journal.",
                icon: "mdi-check",
                color: "success",
            }
        }
    },


    {
        id: "prices",
        displayName: "A-la-carte prices",
        descr: "Costs of journal-by-journal subscriptions",
        options: {
            default: {
                heading: "Public pricelist",
                body: "Forecasting is based on prices from this publisher's online public pricelist.",
                cta: "To customize, upload a spreadsheet with your own custom prices, by journal.",
                icon: "mdi-check",
                color: "success",
            },
            custom: {
                heading: "Custom pricelist",
                body: "Prices are customized, based on a spreadsheet you've uploaded.",
                icon: "mdi-check",
                color: "success",
            }

        }
    },
    {
        id: "perpetualAccess",
        displayName: "Perpetual Access",
        descr: "Each journal's date ranges for which you have perpetual access to articles. Only dates after 2010 affect forecasting.",
        options: {
            default: {
                heading: "Full perpetual access",
                body: "Forecasting is based on prices perpetual access to all backfile content published since 2010.",
                cta: "To customize, upload a spreadsheet with your own custom perpetual-access dates, by journal.",
                icon: "mdi-check",
                color: "success",
            },
            custom: {
                heading: "Custom perpetual access dates",
                body: "Perpetual access dates are customized, based a spreadsheet you've uploaded.",
                icon: "mdi-check",
                color: "success",
            }

        }
    },


]