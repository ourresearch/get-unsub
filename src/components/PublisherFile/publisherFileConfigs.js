export default [
    {
        id: "counter",
        displayName: "Download counts",
        descr: "Downloads by journal, last year",

        options: [
            {
                parent: "counter",
                heading: "None",
                selectedText: "No download data available. Forecasting disabled.",
                unselectedText: "Delete your COUNTER data and disable forecasting.",
                isProblem: true,
                isDefault: true,
            },
            {
                parent: "counter",
                heading: "COUNTER report",
                selectedText: "Forecasting is customized based on your 2019 COUNTER downloads by journal.",
                unselectedText: "Upload your 2019 COUNTER report to enable forecasting.",
            }
        ],
    },


    {
        id: "price",
        displayName: "À la carte prices",
        descr: "Costs of journal-by-journal subscriptions",
        options: [
            {
                parent: "price",
                heading: "Public pricelist",
                selectedText: "Forecasting is based on prices from this publisher's online public pricelist.",
                isDefault: true,
            },
            {
                parent: "price",
                heading: "Custom pricelist",
                selectedText: "Prices are customized by journal, based on a spreadsheet you've uploaded.",
                unselectedText: "Upload your own custom prices for journals.",
            }

        ],
    },
    {
        id: "perpetualAccess",
        displayName: "Perpetual Access",
        descr: "Each journal's date ranges for which you have perpetual access to articles. Only dates after 2010 affect forecasting.",
        options: [
            {
                parent: "perpetualAccess",
                heading: "Full perpetual access",
                selectedText: "Forecasting assumes perpetual access to all backfile content published since 2010.",
                isDefault: true,
            },
            {
                parent: "perpetualAccess",
                heading: "Custom perpetual access dates",
                selectedText: "Perpetual access dates are customized by journal, based a spreadsheet you've uploaded.",
                unselectedText: "Upload your own custom perpetual access date ranges, by journal",
            }

        ],
    },


]