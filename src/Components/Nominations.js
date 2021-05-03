import React, { useState } from "react";

export const Nominations = (props) => {
  const [nominationCount, setNominationCount] = useState(0);
  const [nominationsList, setNominationsList] = useState([]);

  const addNominationCount = () => {
    if (nominationCount < 5) {
      setNominationCount(nominationCount + 1);
      setNominationsList(nominationsList.concat(props.nomination));
    }
  };

  const subtractNominationCount = () => {
    if (nominationCount > 0) {
      setNominationCount(nominationCount - 1);
    }
  };

  return (
    <div>
      <h2>Nominations</h2>
      <button onClick={addNominationCount}>Add</button>
      <button onClick={subtractNominationCount}>Remove</button>
      <p>Nomination Count: {nominationCount}</p>
      <ul>
        {nominationsList.map((item) => {
          return <li>{item}</li>;
        })}
      </ul>
    </div>
  );
};
