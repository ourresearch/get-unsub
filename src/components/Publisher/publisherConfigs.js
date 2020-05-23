


const publisherJournalCols = [
    {
        name: "Title",
        id: "title",
        displayAs: "text",
        descr: "The title of the journal.",
    },
    {
        name: "Price",
        id: "price",
        displayAs: "currency",
        descr: "Stuff about the price goes here.",
    },
    {
        name: "Downloads",
        id: "downloads",
        displayAs: "number",
        descr: "Say stuff about downloads here.",
    },
    {
        name: "Perpetual Access",
        id: "perpetual_access",
        displayAs: "text",
        descr: "Perpetual Access dates.",
    },
    {
        name: "Omitted because",
        id: "omitted_because",
        displayAs: "text",
        descr: "Why is this journal omitted from Forecasts.",
    },
]

export default {
    publisherJournalCols,
}