import appConfigs from "../appConfigs";


const publisherConfig = {
    Elsevier: {
        name: "Elsevier",
        id: "Elsevier",
        logo: "https://i.imgur.com/Qt1sOqp.png",
    },
    SpringerNature: {
        name: "Springer Nature",
        id: "SpringerNature",
        logo: "https://i.imgur.com/MLtg71P.png",
    },
    Wiley: {
        name: "Wiley",
        id: "Wiley",
        logo: "https://i.imgur.com/FFfCHXI.png",
    },
    Sage: {
        name: "SAGE",
        id: "Sage",
        logo: "https://i.imgur.com/vJdKg2j.png",
    },
    TaylorFrancis: {
        name: "Taylor & Francis",
        id: "TaylorFrancis",
        logo: "https://i.imgur.com/WazWt35.png",
    },
}


const publisherLogoFromId = function (id) {
    if (publisherConfig[id]) {
        return publisherConfig[id].logo
    } else {
        return "https://i.imgur.com/PN3ya57.png"
    }
}

const publisherIcon = function (pub) {
    if (pub.is_owned_by_consortium || pub.isOwnedByConsortium) return "mdi-package-up"
    if (pub.is_consortial_proposal_set || pub.isConsortialProposalSet) return "mdi-swap-horizontal"
    return "mdi-package-variant"
}


const bigDealAnnualCost = function (costThisYear, yearlyIncrease) {
    let totalCost = 0
    let numYears = 5
    for (let i = 1; i <= numYears; i++) {
        totalCost += costThisYear
        costThisYear = costThisYear * (1 + yearlyIncrease)
    }
    return totalCost / numYears
}


export {
    publisherLogoFromId,
    publisherConfig,
    bigDealAnnualCost,
    publisherIcon,
}