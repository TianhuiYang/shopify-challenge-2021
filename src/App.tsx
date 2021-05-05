import "./App.scss";
import "./GlobalStyle.scss";
import React, { useState, useCallback } from "react";
import { getMovieByTitle } from "./movie.service";
import { MovieModel } from "./models/movie.model";
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
  const [searchResult, setSearchResult] = useState<MovieModel[]>([]);
  //TODO: include error handling
  const [searchError, setSearchError] = useState<string>("");
  const [nominationList, setNominationList] = useState<MovieModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = useCallback((newValue) => setSearchTerm(newValue), []);
  const handleClearButtonClick = useCallback(() => {
    setSearchTerm("");
  }, []);
  const handleClearSearchClick = useCallback(() => {
    setSearchResult([]);
  }, []);

  const searchMovie = async () => {
    setIsLoading(true);
    setSearchResult(await getMovieByTitle(searchTerm));
    setIsLoading(false);
    console.log(searchResult);
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

  const disableNominateButton = (movie: MovieModel) => {
    const isMovieNominated = nominationList.some((item) => item === movie);
    return isMovieNominated || nominationList.length === MAX_NOMINATION_LENGTH;
  };

  const editNominationList = (movie: MovieModel, action: NOMINATION_ACTION) => {
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
                    {/* <Button
                      plain
                      removeUnderline
                      monochrome
                      onClick={handleClearButtonClick}
                    >
                      Clear
                    </Button> */}
                    <Button primary loading={isLoading} onClick={searchMovie}>
                      Search
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Banners showBanner={nominationList.length >= MAX_NOMINATION_LENGTH} />
        <Layout.Section>
          <Card
            title="Search Results"
            sectioned
            actions={[{ content: "Clear", onAction: handleClearSearchClick }]}
          >
            {/* <p>Theses are the search results for "{searchTerm}"</p> */}
            <ul>
              {searchResult.map((item) => {
                return (
                  <li className="list-container">
                    <div className="list-container__search-content">
                      <h3>
                        <TextStyle variation="strong">
                          {trimMovieTitle(item.Title)}
                        </TextStyle>
                      </h3>
                      <Caption>{item.Year}</Caption>
                    </div>
                    <ButtonGroup>
                      <Button size="slim" icon={InfoMinor}></Button>
                      <Button
                        size="slim"
                        primary
                        disabled={disableNominateButton(item)}
                        onClick={() =>
                          editNominationList(item, NOMINATION_ACTION.ADD)
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
          <Card title="Nominations" sectioned>
            {/* <p>You have {5 - nominationList.length} nomination(s) left</p> */}
            <ul>
              {nominationList.map((item) => {
                return (
                  <li className="list-container">
                    <div className="list-container__nomination-content">
                      <h3>
                        <TextStyle variation="strong">
                          {trimMovieTitleNomination(item.Title)}
                        </TextStyle>
                      </h3>
                      <Caption>{item.Year}</Caption>
                    </div>
                    <ButtonGroup>
                      <Button
                        plain
                        size="slim"
                        icon={DeleteMinor}
                        onClick={() =>
                          editNominationList(item, NOMINATION_ACTION.REMOVE)
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
