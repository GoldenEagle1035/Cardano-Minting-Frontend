import * as types from "./collectionTypes";

export function collections_loaded(payload) {
  return {
    type: types.COLLECTIONS_LOADED,
    payload: payload,
  };
}
export function collections_add_tokens(payload) {
  return {
    type: types.COLLECTIONS_ADD_TOKENS,
    payload: payload,
  };
}
export function collections_loading(payload) {
  return {
    type: types.COLLECTIONS_LOADING,
    payload: payload,
  };
}

export function collections_top_projects(payload) {
  return {
    type: types.COLLECTIONS_TOP_PROJECTS,
    payload: payload,
  };
}

export function collections_add_assets(payload) {
  return {
    type: types.COLLECTIONS_ADD_ASSETS,
    payload: payload,
  };
}

export function set_showAsset(payload) {
  console.log("[dream log] api_setshowasset payload:", payload);
  return {
    type: types.SET_SHOWASSET,
    payload: payload,
  };
}

export const add_collection = (payload) => {
  console.log("[dream log] add_collection payload:", payload);
  return {
    type: types.ADD_MINTING_COLLECTION,
    payload: payload,
  };
};

export const set_collections = (payload) => {
  console.log("[dream log] set_collections payload:", payload);
  return {
    type: types.GET_MINTING_COLLECTIONS,
    payload: payload,
  };
};

export const minted_collection = (payload) => {
  console.log("[dream log] minted_collection payload:", payload);
  return {
    type: types.PUT_MINTED_COLLECTION,
    payload: payload,
  };
};

export const set_minting_state = (payload) => {
  console.log("[dream log] set_minting_state payload:", payload);
  return {
    type: types.SET_MINTING_STATE,
    payload: payload,
  };
}