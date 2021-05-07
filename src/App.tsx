import "./App.scss";
import "./GlobalStyle.scss";
import styled from "styled-components";
import React, { useState } from "react";
import { getMovieByTitle } from "./movie.service";
import { MovieModel, MovieSummaryModel } from "./models/movie.model";
import { NOMINATION_ACTION } from "./models/nomination.model";
import { Layout, Page } from "@shopify/polaris";
import { Banners } from "./components/Banner";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { MAX_NOMINATION_LENGTH } from "./utils/constants";
import { SearchResults } from "./components/SearchResults";
import { Nominations } from "./components/Nominations";
import { COMPONENT } from "./models/component.model";

const AppContainer = styled.div`
  margin-top: 40px;
`;

function App() {
  const [searchResult, setSearchResult] = useState<MovieSummaryModel[]>([]);
  //TODO: include error handling
  const [searchError, setSearchError] = useState<string>("");
  const [nominationList, setNominationList] = useState<MovieSummaryModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClearClick = (component: COMPONENT) => {
    if (component === COMPONENT.NOMINATIONS) {
      setNominationList([]);
    }
    if (component === COMPONENT.RESULTS) {
      setSearchResult([]);
    }
  };

  const searchMovie = async (movie: string) => {
    setIsLoading(true);
    setSearchResult(await getMovieByTitle(movie));
    setIsLoading(false);
    console.log(searchResult);
  };

  const editNominationList = (
    movie: MovieSummaryModel,
    action: NOMINATION_ACTION
  ) => {
    if (
      nominationList.length < MAX_NOMINATION_LENGTH &&
      action === NOMINATION_ACTION.ADD
    ) {
      setNominationList(nominationList.concat(movie));
    }
    if (!!nominationList.length && action === NOMINATION_ACTION.REMOVE) {
      setNominationList(nominationList.filter((item) => item !== movie));
    }
  };

  const showBanner = () => {
    return nominationList.length >= MAX_NOMINATION_LENGTH;
  };

  return (
    <AppContainer>
      <Page>
        <Layout>
          <Header />
          <SearchBar searchMovie={searchMovie} isLoading={isLoading} />
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
