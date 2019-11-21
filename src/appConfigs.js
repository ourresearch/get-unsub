const journalColGroups = [
    {
        displayName: "Key stats",
        name: "keyStats",
        colNames: [
            "use",
            "instant_usage_percent",
            "cost",
            "ncppu",
        ]
    },

    {
        displayName: "Costs",
        name: "costs",
        colNames: [
            "scenario_cost",
            "subscription_cost",
            "ill_cost",
            "real_cost",
        ]
    },

    {
        displayName: "Open Access",
        name: "oa",
        colNames: [
            "use_oa_percent",
            "use_green_percent",
            "use_hybrid_percent",
            "use_bronze_percent",
            "use_peer_reviewed_percent",
        ]
    },

    {
        displayName: "Fulfillment",
        name: "fulfillment",
        colNames: [
            "use_asns",
            "use_oa",
            "use_backfile",
            "use_subscription",
            "use_ill",
            "use_other_delayed",
        ]
    },

    {
        displayName: "Institutional impact",
        name: "usage",
        colNames: [
            "total_usage",
            "downloads",
            "citations",
            "authorships",
        ]
    },

]


const journalCols = [
    {
        text: "Net cost per paid use",
        value: "ncppu",
        display: "currency"
    },
    {
        text: "Cost",
        value: "cost",
        display: "currency_int"
    },
    {
        text: "Usage",
        value: "use",
        display: "number"
    },
    {
        text: "Instant Usage Percent",
        value: "instant_usage_percent",
        display: "percent"
    },
    {
        text: "Scenario Cost",
        value: "scenario_cost",
        display: "currency_int"
    },
    {
        text: "Subscription Cost",
        value: "subscription_cost",
        display: "currency_int"
    },
    {
        text: "ILL Cost",
        value: "ill_cost",
        display: "currency_int"
    },
    {
        text: "Subscription minus ILL Cost",
        value: "real_cost",
        display: "currency_int"
    },
    {
        text: "ASNs",
        value: "use_asns",
        display: "number"
    },
    {
        text: "Open access",
        value: "use_oa",
        display: "number"
    },
    {
        text: "Backfile",
        value: "use_backfile",
        display: "number"
    },
    {
        text: "Subscription",
        value: "use_subscription",
        display: "number"
    },
    {
        text: "ILL",
        value: "use_ill",
        display: "number"
    },
    {
        text: "Other (delayed)",
        value: "use_other_delayed",
        display: "number"
    },
    {
        text: "Percent of Usage that is OA",
        value: "use_oa_percent",
        display: "percent"
    },
    {
        text: "Percent of Usage that is Green OA",
        value: "use_green_percent",
        display: "percent"
    },
    {
        text: "Percent of Usage that is Hybrid OA",
        value: "use_hybrid_percent",
        display: "percent"
    },
    {
        text: "Percent of Usage that is Bronze OA",
        value: "use_bronze_percent",
        display: "percent"
    },
    {
        text: "Percent of Usage that is Peer-reviewed OA",
        value: "use_peer_reviewed_percent",
        display: "percent"
    },
    {
        text: "Total Usage",
        value: "total_usage",
        display: "number"
    },
    {
        text: "Downloads",
        value: "downloads",
        display: "number"
    },
    {
        text: "Citations to papers",
        value: "citations",
        display: "float1"
    },
    {
        text: "Authored papers",
        value: "authorships",
        display: "float1"
    }
]


 const hydratedJournalColGroups = function() {
    const ret = journalColGroups.map(group => {
        const ret = {...group}
        ret.cols = journalCols.filter(h => {
            return group.colNames.includes(h.value)
        })
        return ret
    })
    return ret
}


export default {
    journalColGroups: hydratedJournalColGroups(),
    journalCols,

}