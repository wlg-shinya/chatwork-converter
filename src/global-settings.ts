const BASE_URL = process.env.NODE_ENV === "production" ? "http://127.0.0.1" : "http://localhost"
const GlobalSettings = {
    baseUrl: BASE_URL,
    backendUrl: `${BASE_URL}:3000`,
    title: "Chatworkコンバーター",
    storageKey: "tr-chatconv",
}

export default GlobalSettings