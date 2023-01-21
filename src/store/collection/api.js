import {
  add_collection,
  set_collections,
  minted_collection,
  set_minting_state,
} from "./collectionActions";
import axios from "axios";

const API_URL = "http://95.216.88.187:8000/api/collection/";

export const uploadCollection = (data) => (dispatch) => {
  console.log("uploadCollection");
  return axios.post(API_URL, data)
    .then((response) => {
      console.log("uploadCollection_response", response);
      dispatch(add_collection(response));
    });
};

export const getAllCollections = () => (dispatch) => {
  console.log("getAllCollections");
  return axios.get(API_URL)
    .then((response) => {
      console.log("getAllCollections_response", response);
      dispatch(set_collections(response));
    });
};

export const mintedCollection = (data) => (dispatch) => {
  console.log("minted", data);
  return axios.put(API_URL + "minted/", data)
    .then((response) => {
      console.log("minted_response", response);
      dispatch(minted_collection(response));
    })
}

export const setMintingState = (data) => (dispatch) => {
  console.log("minting", data);
  dispatch(set_minting_state(data));
}