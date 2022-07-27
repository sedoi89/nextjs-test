import {createReducer} from '@reduxjs/toolkit'
import {getBeers} from "./actions";

const initialState = {
  Beers: [],
}

export const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getBeers, (state, action) => {
            state.Beers = action.payload
        })
})

export default {reducer}
