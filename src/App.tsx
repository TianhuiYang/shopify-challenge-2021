import "./App.scss";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Layout, Page } from "@shopify/polaris";
import { MAX_NOMINATION_LENGTH } from "./utils/constants";
import { editLocalStorage, localNominationList } from "./utils/localStorage";
import { getMovieByTitle } from "./services/movie.service";
import { MovieSummaryModel } from "./models/movie.model";
import { NOMINATION_ACTION } from "./models/nomination.model";
import { COMPONENT } from "./models/component.model";
import Banners from "./components/Banner";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Nominations from "./components/Nominations";

const AppContainer = styled.div`
  margin-top: 60px;

  @media (max-width: 520px) {
    margin-top: 24px;
  }
`;

function App() {
  const [searchResult, setSearchResult] = useState<MovieSummaryModel[]>([]);
  const [searchError, setSearchError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getUniqueMovies = (apiResponse: MovieSummaryModel[]) => {
    let uniqueMovies: MovieSummaryModel[] = [];
    apiResponse.forEach((movie) => {
      if (
        !uniqueMovies.some((uniqueMovie) => movie.imdbID === uniqueMovie.imdbID)
      ) {
        uniqueMovies.push(movie);
      }
    });
    return uniqueMovies;
  };

  const searchMovie = async (movie: string) => {
    setSearchError("");
    setIsLoading(true);
    const res = await getMovieByTitle(movie);
    if (res.Response === "True") {
      const uniqueSearchRes = getUniqueMovies(res.Search);
      setSearchResult(uniqueSearchRes);
    } else {
      setSearchError(res.Error);
      setSearchResult([]);
    }
    setIsLoading(false);
  };

  const [nominationList, setNominationList] = useState<MovieSummaryModel[]>([]);
  const editNominationList = (
    movie: MovieSummaryModel,
    action: NOMINATION_ACTION
  ) => {
    let newNominationList = nominationList;
    if (
      nominationList.length < MAX_NOMINATION_LENGTH &&
      action === NOMINATION_ACTION.ADD
    ) {
      newNominationList = nominationList.concat(movie);
    } else if (!!nominationList.length && action === NOMINATION_ACTION.REMOVE) {
      newNominationList = nominationList.filter((item) => item !== movie);
    }
    editLocalStorage(newNominationList);
    setNominationList(newNominationList);
  };

  const showBanner = () => {
    return nominationList.length >= MAX_NOMINATION_LENGTH;
  };

  const handleClearClick = (component: COMPONENT) => {
    if (component === COMPONENT.NOMINATIONS) {
      setNominationList([]);
      editLocalStorage([]);
    }
    if (component === COMPONENT.RESULTS) {
      setSearchResult([]);
    }
  };

  useEffect(() => {
    const localData = localNominationList();
    if (!!localData) {
      setNominationList(localData);
    }
  }, []);

  return (
    <AppContainer>
      <Page>
        <Layout>
          <Header />
          <SearchBar
            searchMovie={searchMovie}
            isLoading={isLoading}
            error={searchError}
          />
          <Banners showBanner={showBanner()} />
          <SearchResults
            searchResult={searchResult}
            clearSearchResults={() => handleClearClick(COMPONENT.RESULTS)}
            nominationList={nominationList}
            editNominationList={editNominationList}
          />
          <Nominations
            nominationList={nominationList}
            editNominationList={editNominationList}
            clearNominations={() => handleClearClick(COMPONENT.NOMINATIONS)}
          />
        </Layout>
      </Page>
    </AppContainer>
  );
}

export default App;
