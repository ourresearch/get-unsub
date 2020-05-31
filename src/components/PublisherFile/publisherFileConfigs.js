export default [
    {
        id: "counter",
        displayName: "Download counts",
        descr: "Downloads by journal, last year",

        options: [
            {
                heading: "None",
                selectedText: "No download data available. Forecasting disabled.",
                unselectedText: "Delete your COUNTER data and disable forecasting.",
                isProblem: true,
                isDefault: true,
            },
            {
                heading: "COUNTER report",
                selectedText: "Forecasting is customized based on your 2019 COUNTER downloads by journal.",
                unselectedText: "Select to upload your 2019 COUNTER report and enable forecasting.",
            }
        ],
    },


    {
        id: "prices",
        displayName: "A-la-carte prices",
        descr: "Costs of journal-by-journal subscriptions",
        options: [
            {
                heading: "Public pricelist",
                selectedText: "Forecasting is based on prices from this publisher's online public pricelist.",
                unselectedText: "Delete your custom prices and use this publisher's online public pricelist .",
                isDefault: true,
            },
            {
                heading: "Custom pricelist",
                selectedText: "Prices are customized by journal, based on a spreadsheet you've uploaded.",
                unselectedText: "Select to upload your own custom prices for journals.",
            }

        ],
    },
    {
        id: "perpetualAccess",
        displayName: "Perpetual Access",
        descr: "Each journal's date ranges for which you have perpetual access to articles. Only dates after 2010 affect forecasting.",
        options: [
            {
                heading: "Full perpetual access",
                selectedText: "Forecasting assumes perpetual access to all backfile content published since 2010.",
                unselectedText: "Delete your perptual access dates and assume perpetual access to all backfile content published since 2010",
                isDefault: true,
            },
            {
                heading: "Custom perpetual access dates",
                selectedText: "Perpetual access dates are customized by journal, based a spreadsheet you've uploaded.",
                unselectedText: "Select to upload your own custom perpetual access date ranges, by journal",
            }

        ],
    },


]