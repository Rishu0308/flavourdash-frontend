import { createSlice } from "@reduxjs/toolkit"

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    myShopData: null,
  },
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload
    },
    updateItemInShop: (state, action) => {
      const updatedItem = action.payload;

      if (state.myShopData && state.myShopData.items) {
        // Replace item
        state.myShopData.items = state.myShopData.items.map(item =>
          item._id === updatedItem._id ? updatedItem : item
        );

        // ✅ Re-sort by updatedAt (newest first)
        state.myShopData.items.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      }
    },
  }
})

export const { setMyShopData, updateItemInShop } = ownerSlice.actions
export default ownerSlice.reducer
