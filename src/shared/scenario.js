const buildScenarioFromApiResp = function (apiResp) {
    apiResp.journals.forEach((myJournal, myIndex) => {
        myJournal.cpuIndex = myIndex
        myJournal.subscribed = apiResp.saved.subrs.includes(myJournal.issn_l)
    })
    return apiResp
}


export {
    buildScenarioFromApiResp
}