import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { ICompanion } from "../../../types/Companion.types";

const modelsSlice = createSlice({
    name: "Models",
    initialState: {
        Models: [] as ICompanion[],
    },
    reducers: {
        setModels(state, action: PayloadAction<ICompanion[]>) {
            return {
                ...state,
                Models: action.payload,
            }
        },
        clearModels() {
            return {
                Models: [],
            } ;
        },
        getModels: (state) => state
    },
});


export const { setModels, clearModels, getModels } = modelsSlice.actions;
export default modelsSlice.reducer;