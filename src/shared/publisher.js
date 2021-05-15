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


const makePublisherJournal = function (apiJournal) {

    const omittedBecause = []
    if (apiJournal.attributes.changed_publisher) {
        omittedBecause.push("New publisher")
    }
    if (apiJournal.attributes.is_oa) {
        omittedBecause.push("Fully OA")
    }
    if (apiJournal.attributes.not_published_2019) {
        omittedBecause.push("Ceased publication")
    }
    if (apiJournal.error) {
        omittedBecause.push("Input error")
    }

    const isInactive = apiJournal.attributes.not_published_2019
    const isMoved = apiJournal.attributes.changed_publisher
    const isOa = apiJournal.attributes.is_oa


    const dataSources = apiJournal.data_sources.map(source => {
        source.id = _.camelCase(source.id)
        return source
    })

    const dataSourcesDict = {}
    apiJournal.data_sources.forEach(source => {
        dataSourcesDict[_.camelCase(source.id)] = source
    })

    const isMissingDataFor = dataSources.map(source => {
        return (!source.source) ? source.id : null
    }).filter(Boolean)

    const isValid = ([
        dataSourcesDict.counter.source,
        !apiJournal.error,
        !isInactive,
        !isMoved,
        !isOa,
    ]).every(x => x)

    const price = dataSourcesDict.price.value
    const counter = dataSourcesDict.counter.value
    const perpetualAccessStart = dataSourcesDict.perpetualAccess.value[0]
    const perpetualAccessEnd = dataSourcesDict.perpetualAccess.value[1]


    return {
        issnl: apiJournal.issn_l,
        name: apiJournal.name,
        dataSources,
        dataSourcesDict,
        isMissingDataFor,

        isValid,

        omittedBecause,
        isInactive,
        isMoved,
        isOa,
        isError: !!apiJournal.error,
        isForecastable: !omittedBecause.length,
        error: apiJournal.error,

        price,
        counter,
        perpetualAccessStart,
        perpetualAccessEnd,
    }

}


export {
    publisherLogoFromId,
    makePublisherJournal,
    publisherConfig,
}