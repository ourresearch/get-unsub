import appConfigs from "../appConfigs";


const config = {
    elsevier: {
        name: "Elsevier",
        id: "elsevier",
        logo: "https://i.imgur.com/Qt1sOqp.png",
    },
    springer_nature: {
        name: "Springer Nature",
        id: "springer_nature",
        logo: "https://i.imgur.com/MLtg71P.png",
    },
    wiley: {
        name: "Wiley",
        id: "wiley",
        logo: "https://i.imgur.com/FFfCHXI.png",
    },
}


const publisherLogoFromName = function(name){
        let myPublisherIdReal
        if (/elsevier/i.test(name)) myPublisherIdReal = "elsevier"
        else if (/springer/i.test(name)) myPublisherIdReal = "springer_nature"
        else if (/wiley/i.test(name)) myPublisherIdReal = "wiley"

        if (config[myPublisherIdReal]) {
            return config[myPublisherIdReal].logo
        }
        else {
            return "https://i.imgur.com/PN3ya57.png"
        }
}


export  {
    publisherLogoFromName
}