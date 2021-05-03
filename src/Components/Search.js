import React, { useState } from "react";
import { Nominations } from "./Nominations";

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const editSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const editSearchResult = (e) => {
    // setSearchResult("title name from API");
  };

  return (
    <div>
      <input
        value={searchTerm}
        onChange={editSearchTerm}
        placeholder="Search for a movie!"
      ></input>
      {/* <p>{searchTerm}</p> */}
      <Nominations nomination={searchTerm} />
    </div>
  );
};
