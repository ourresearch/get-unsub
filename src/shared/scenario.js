// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');
import {toHexHash} from "./util";

const buildScenarioFromApiResp = function (apiResp) {
    apiResp.journals.forEach((myJournal, myIndex) => {
        myJournal.cpuIndex = myIndex
        myJournal.subscribed = apiResp.saved.subrs.includes(myJournal.issn_l)
    })
    apiResp.id = apiResp.meta.scenario_id

    apiResp.costBigdealProjected = setCostBigdealProjected(apiResp)

    return apiResp
}


const hydrateScenario = function(dehydratedScenario, fullScenarioFromApi){
    const hydratingScenario = buildScenarioFromApiResp(fullScenarioFromApi)

}

const newScenario = function (id = "", name="") {
    return {
        id: id,
        idHash: toHexHash(id),
        isLoading: false,
        journals: [],
        saved: {
            subrs: [],
            name: name,
            configs: {}
        }
    }
}

const newScenarioId = function(isDemo){
    let id = "scenario-" + short.generate().slice(0, 8)
    if (isDemo) id = "demo-" + id
    return id
}

const setCostBigdealProjected = function (scenario) {
    let totalCost = 0
    let numYears = 5
    let costThisYear = scenario.saved.configs.cost_bigdeal
    let yearlyIncrease = scenario.saved.configs.cost_bigdeal_increase * 0.01
    for (let i = 1; i <= numYears; i++) {
        totalCost += costThisYear
        costThisYear = costThisYear * (1 + yearlyIncrease)
    }
    return totalCost / numYears
}


export {
    buildScenarioFromApiResp,
    newScenarioId,
    newScenario,
}

