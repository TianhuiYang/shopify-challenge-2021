import "./App.scss";
import "./GlobalStyle.scss";
import "./PolarisStyling.scss";
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
  Heading,
  FormLayout,
  DataTable,
  Stack,
} from "@shopify/polaris";
import { SearchMinor, InfoMinor, DeleteMinor } from "@shopify/polaris-icons";
import { Banners } from "./components/Banner";

function App() {
  const MAX_NOMINATION_LENGTH = 5;
  const MAX_TITLE_LENGTH = 105;

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

  const searchMovie = async () => {
    setIsLoading(true);
    setSearchResult(await getMovieByTitle(searchTerm));
    setIsLoading(false);
    console.log(searchResult);
  };

  const trimMovieTitle = (title: string) => {
    if (title.length > MAX_TITLE_LENGTH) {
      const trimmedString = title.substring(0, MAX_TITLE_LENGTH);
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
                    <Button plain monochrome onClick={handleClearButtonClick}>
                      Clear
                    </Button>
                    <Button
                      primary
                      loading={isLoading ? true : false}
                      onClick={searchMovie}
                    >
                      Search
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
        {showBanner() ? (
          <Layout.Section>
            <Banners />
          </Layout.Section>
        ) : null}
        <Layout.Section>
          <Card title="Search Results" sectioned>
            {/* <DataTable
              columnContentTypes={["text", "numeric"]}
              headings={["Title", "Year"]}
              rows={[
                ["Emerald Silk Gown", "$875.00"],
                ["Mauve Cashmere Scarf", "$230.00"],
                [
                  "Navy Merino Wool Blazer with khaki chinos and yellow belt",
                  "$445.00",
                ],
              ]}
            /> */}
            {/* <p>Theses are the search results for "{searchTerm}"</p> */}
            <ul className="search-results">
              {searchResult.map((item) => {
                return (
                  <li className="search-results__items">
                    <div className="search-results__items__content">
                      <TextContainer spacing="tight">
                        <p style={{ fontWeight: 400 }}>
                          {trimMovieTitle(item.Title)}
                        </p>
                        <Caption>{item.Year}</Caption>
                      </TextContainer>
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
            <ul className="nomination-list">
              {nominationList.map((item) => {
                return (
                  <li className="nomination-list__items">
                    <div className="nomination-list__items__content">
                      <Caption>
                        {trimMovieTitle(item.Title)} ({item.Year})
                      </Caption>
                    </div>
                    <Button
                      plain
                      size="slim"
                      icon={DeleteMinor}
                      onClick={() =>
                        editNominationList(item, NOMINATION_ACTION.REMOVE)
                      }
                    ></Button>
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
