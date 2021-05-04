import "./App.scss";
import "./GlobalStyle.scss";
import { Icon } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import React, { useState } from "react";
import { getMovieByTitle } from "./movie.service";
import { MovieModel } from "./models/movie.model";
import { NOMINATION_ACTION } from "./models/nomination.model";
import { SearchBar } from "./components/Search";

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<MovieModel[]>([]);

  const [nominationList, setNominationList] = useState<MovieModel[]>([]);

  const editSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSearchResult(await getMovieByTitle(e.target.value));
  };

  const editNominationList = (movie: MovieModel, action: NOMINATION_ACTION) => {
    if (nominationList.length < 5 && action === NOMINATION_ACTION.ADD) {
      setNominationList(nominationList.concat(movie));
    }
    if (!!nominationList.length && action === NOMINATION_ACTION.REMOVE) {
      setNominationList(nominationList.filter((item) => item !== movie));
    }
  };

  return (
    <div className="app-container">
      <div className="header-wrapper">
        <h1>Shoppies!</h1>
        <p>Insert subtitle</p>
      </div>
      <h2>Search for a Movie!</h2>
      <input
        className="search-bar"
        value={searchTerm}
        onChange={editSearch}
        placeholder="eg. The Avengers"
      ></input>
      <div className="row">
        <div className="search-results">
          <p className="search-results__title">Search Results</p>
          <ul className="search-results__list">
            {searchResult.map((item) => {
              return (
                <li className="search-results__list__items">
                  <div className="search-results__list__items__content">
                    <p>{item.Title}</p>
                    <p>{item.Year}</p>
                  </div>
                  <button
                    onClick={() =>
                      editNominationList(item, NOMINATION_ACTION.ADD)
                    }
                  >
                    Nominate
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="nomination-list">
          <p className="nomination-list__title">
            Nomination List ({nominationList.length})
          </p>
          <ul className="nomination-list__list">
            {nominationList.map((item: MovieModel) => {
              return (
                <li className="nomination-list__list__items">
                  <div className="nomination-list__list__items__content">
                    <p>{item.Title}</p>
                    <p>{item.Year}</p>
                  </div>
                  <button
                    onClick={() =>
                      editNominationList(item, NOMINATION_ACTION.REMOVE)
                    }
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
