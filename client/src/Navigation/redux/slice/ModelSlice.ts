import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { ICompanion } from "../../../types/Companion.types";

const modelSlice = createSlice({
    name: "Model",
    initialState: {
        Model: null as ICompanion | null,
    },
    reducers: {
        setModel(state, action: PayloadAction<ICompanion>) {
            return {
                ...state,
                Model: action.payload,
            }
        },

        clearModel() {
            return {
                Model: null,
            };
        },

        getModel: (state) => state
    },
});


export const { setModel, clearModel, getModel } = modelSlice.actions;
export default modelSlice.reducer;