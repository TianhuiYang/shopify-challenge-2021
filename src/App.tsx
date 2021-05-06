import "./App.scss";
import "./GlobalStyle.scss";
import React, { useState, useCallback } from "react";
import { getMovieByTitle, getMovieByID } from "./movie.service";
import { MovieModel, MovieSummaryModel } from "./models/movie.model";
import { NOMINATION_ACTION } from "./models/nomination.model";

import {
  Icon,
  TextField,
  Button,
  TextContainer,
  Layout,
  Card,
  DisplayText,
  Page,
  TextStyle,
  Form,
  ButtonGroup,
  Caption,
  Stack,
} from "@shopify/polaris";
import { SearchMinor, InfoMinor, DeleteMinor } from "@shopify/polaris-icons";
import { Banners } from "./components/Banner";

function App() {
  const MAX_NOMINATION_LENGTH = 5;
  const MAX_TITLE_LENGTH = 105;
  const MAX_TITLE_LENGTH_NOMINATION = 85;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<MovieSummaryModel[]>([]);
  //TODO: include error handling
  const [searchError, setSearchError] = useState<string>("");
  const [nominationList, setNominationList] = useState<MovieSummaryModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = useCallback((newValue) => setSearchTerm(newValue), []);
  const handleClearButtonClick = useCallback(() => {
    setSearchTerm("");
  }, []);
  const handleClearSearchClick = useCallback(() => {
    setSearchResult([]);
  }, []);
  const handleClearNominationClick = useCallback(() => {
    setNominationList([]);
  }, []);

  const searchMovie = async () => {
    setIsLoading(true);
    setSearchResult(await getMovieByTitle(searchTerm));
    setIsLoading(false);
    console.log(searchResult);
  };

  const fetchMovieDetails = async (movieId: string) => {
    console.log(movieId);
    console.log(await getMovieByID(movieId));
    return await getMovieByID(movieId);
  };

  // TODO: move this to utils and include another parameter for checking breakpoint
  const trimMovieTitle = (title: string) => {
    if (title.length > MAX_TITLE_LENGTH) {
      const trimmedString = title.substring(0, MAX_TITLE_LENGTH);
      return trimmedString.concat("...");
    }
    return title;
  };

  const trimMovieTitleNomination = (title: string) => {
    if (title.length > MAX_TITLE_LENGTH_NOMINATION) {
      const trimmedString = title.substring(0, MAX_TITLE_LENGTH_NOMINATION);
      return trimmedString.concat("...");
    }
    return title;
  };

  const disableNominateButton = (movie: MovieSummaryModel) => {
    const isMovieNominated = nominationList.some(
      (nomination) => nomination.imdbID === movie.imdbID
    );
    return isMovieNominated || nominationList.length === MAX_NOMINATION_LENGTH;
  };

  const editNominationList = (movie: MovieSummaryModel, action: NOMINATION_ACTION) => {
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
    <Page>
      <Layout>
        <Layout.Section>
          <TextContainer>
            <DisplayText size="large">Welcome to the Shoppies!</DisplayText>
            <p>Nominate 5 movies for this year's Shoppies Awards</p>
          </TextContainer>
        </Layout.Section>
        <Layout.Section>
          <Card title="Movie Search">
            <Card.Section>
              <Stack spacing="loose" vertical>
                <Form onSubmit={searchMovie}>
                  <TextField
                    label="Search for a movie by keyword or ID"
                    value={searchTerm}
                    placeholder='Search "The Avengers"'
                    onChange={handleChange}
                    prefix={<Icon source={SearchMinor} color="base" />}
                    clearButton
                    onClearButtonClick={handleClearButtonClick}
                    autoFocus
                    error={searchError}
                  />
                </Form>
                <Stack distribution="trailing">
                  <ButtonGroup>
                    <Button primary loading={isLoading} onClick={searchMovie}>
                      Search
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Banners showBanner={showBanner()} />
        <Layout.Section>
          <Card
            title="Search Results"
            actions={[{ content: "Clear", onAction: handleClearSearchClick }]}
            sectioned
          >
            {/* <p>Theses are the search results for "{searchTerm}"</p> */}
            <ul>
              {searchResult.map((movie) => {
                return (
                  <li className="list-container">
                    <div className="list-container__search-content">
                      <h3>
                        <TextStyle variation="strong">
                          {trimMovieTitle(movie.Title)}
                        </TextStyle>
                      </h3>
                      <Caption>{movie.Year}</Caption>
                    </div>
                    <ButtonGroup>
                      <Button
                        size="slim"
                        icon={InfoMinor}
                        onClick={() => fetchMovieDetails(movie.imdbID)}
                      ></Button>
                      <Button
                        size="slim"
                        primary
                        disabled={disableNominateButton(movie)}
                        onClick={() =>
                          editNominationList(movie, NOMINATION_ACTION.ADD)
                        }
                      >
                        Nominate
                      </Button>
                    </ButtonGroup>
                  </li>
                );
              })}
            </ul>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card
            title="Nominations"
            actions={[
              { content: "Clear", onAction: handleClearNominationClick },
            ]}
            sectioned
          >
            {/* <p>You have {5 - nominationList.length} nomination(s) left</p> */}
            <ul>
              {nominationList.map((movie) => {
                return (
                  <li className="list-container">
                    <div className="list-container__nomination-content">
                      <h3>
                        <TextStyle variation="strong">
                          {trimMovieTitleNomination(movie.Title)}
                        </TextStyle>
                      </h3>
                      <Caption>{movie.Year}</Caption>
                    </div>
                    <ButtonGroup>
                      <Button
                        plain
                        size="slim"
                        icon={DeleteMinor}
                        onClick={() =>
                          editNominationList(movie, NOMINATION_ACTION.REMOVE)
                        }
                      ></Button>
                    </ButtonGroup>
                  </li>
                );
              })}
            </ul>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default App;
