import axios from "axios";

const BASE_URL = "http://www.omdbapi.com/";
const API_KEY = process.env.REACT_APP_API_KEY;

export const getMovieByTitle = async (query: string) => {
  return axios
    .get(`${BASE_URL}?s=${query}&type=movie&apikey=${API_KEY}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getMovieByID = async (ID: string) => {
  return axios
    .get(`${BASE_URL}?i=${ID}&type=movie&apikey=${API_KEY}`)
    .then((res) => {
      const movies = res.data;
      return !!movies ? movies : [];
    })
    .catch((err) => {
      return err;
    });
};
