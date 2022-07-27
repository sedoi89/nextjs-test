import axios from "axios";
import {store} from "./index";
import {getBeers} from "./actions";


export const fetchBeersPage = async (page) => {
    const { data } = await axios.get(`https://api.punkapi.com/v2/beers?page=${page}&per_page=25`);
    console.log(data)
    if (!data) {
        return {
            notFound: true,
        };
    }
    else {
        store.dispatch(getBeers(data))
    }

    return data

};
