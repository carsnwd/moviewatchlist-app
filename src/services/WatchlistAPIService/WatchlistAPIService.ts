import { auth } from "@/firebaseConfig";
import config from "../../../config.json"

export class WatchlistAPIService {
    private constructor() {

    }

    static instance: WatchlistAPIService;

    static getInstance() {
        if (!WatchlistAPIService.instance) {
            WatchlistAPIService.instance = new WatchlistAPIService();
        }
        return WatchlistAPIService.instance;
    }

    public async getWatchlist() {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User is not authenticated");
        }

        const token = await user.getIdToken();
        const response = await fetch(`${config.WATCHLIST_API_URL}/watchlist`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await response.json();
        return json;
    }
}