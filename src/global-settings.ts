const GlobalSettings = {
    baseUrl: process.env.NODE_ENV === "production" ? "http://127.0.0.1" : "http://localhost",
    backendUrl: process.env.NODE_ENV === "production" ? "http://127.0.0.1:3000" : "http://localhost:3000",
    title: "Chatworkコンバーター",
    storageKey: "tr-chatconv",
}

export default GlobalSettings