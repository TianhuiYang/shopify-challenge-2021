import React, { useState } from "react";
import { getMovieByTitle } from "../service";

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [nominationList, setNominationList] = useState([]);

  //TODO: add loading feature
  const [isLoading, setIsLoading] = useState(true);

  const editSearch = (e) => {
    setSearchTerm(e.target.value);
    getMovieByTitle(e.target.value).then(function (result) {
      setSearchResult(result);
    });
  };

  const editNominationList = (movie, operation) => {
    if (nominationList.length < 5 && operation === "Add") {
      setNominationList(nominationList.concat(movie));
    }
    if (nominationList.length > 0 && operation == "Remove") {
      setNominationList(nominationList.filter((item) => item !== movie));
    }
  };

  return (
    <div>
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
              <button onClick={() => editNominationList(item, "Add")}>
                Add
              </button>
            </li>
          );
        })}
      </ul>

      <ul>
        <p>Nomination List</p>
        <p>Count: {nominationList.length}</p>
        {nominationList.map((item) => {
          return (
            <li>
              {item.Title}
              <button onClick={() => editNominationList(item, "Remove")}>
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
