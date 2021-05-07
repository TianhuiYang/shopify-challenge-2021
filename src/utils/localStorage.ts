import { MovieSummaryModel } from "../models/movie.model";

export const editLocalStorage = (nominationList: MovieSummaryModel[]) => {
  localStorage.setItem("nominationList", JSON.stringify(nominationList));
};

export const localNominationList = () => {
  const localStorageData = localStorage.getItem("nominationList");
  return localStorageData ? JSON.parse(localStorageData) : [];
};
