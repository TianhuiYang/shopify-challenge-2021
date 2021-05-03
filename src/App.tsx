import "./App.scss";
import React, { useState } from "react";
import { getMovieByTitle } from "./movie.service";
import { MovieModel } from "./models/movie.model";
import { NOMINATION_ACTION } from "./models/nomination.model";

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<MovieModel[]>([]);

  const [nominationList, setNominationList] = useState<MovieModel[]>([]);

  const editSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    getMovieByTitle(e.target.value).then(function (result) {
      setSearchResult(result);
    });
  };

  const editNominationList = (movie: MovieModel, action: NOMINATION_ACTION) => {
    if (nominationList.length < 5 && action === NOMINATION_ACTION.ADD) {
      setNominationList(nominationList.concat(movie));
    }
    if (nominationList.length > 0 && action === NOMINATION_ACTION.REMOVE) {
      setNominationList(nominationList.filter((item) => item !== movie));
    }
  };

  return (
    <div className="app-container">
      <div className="header-wrapper">
        <h1 className="header-wrapper__title">Shoppies!</h1>
        <p className="header__subtitle">Insert subtitle</p>
      </div>
      <input
        value={searchTerm}
        onChange={editSearch}
        placeholder="Search for a movie!"
      ></input>

      <ul>
        <p>Search Results</p>
        {searchResult.map((item) => {
          return (
            <li>
              {item.Title}
              <button onClick={() => editNominationList(item, NOMINATION_ACTION.ADD)}>
                Nominate
              </button>
            </li>
          );
        })}
      </ul>

      <ul>
        <p>Nomination List</p>
        <p>Count: {nominationList.length}</p>
        {nominationList.map((item: MovieModel) => {
          return (
            <li>
              {item.Title}
              <button onClick={() => editNominationList(item, NOMINATION_ACTION.REMOVE)}>
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
