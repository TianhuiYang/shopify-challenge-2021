import styled from "styled-components";
import {
  Button,
  ButtonGroup,
  Caption,
  Card,
  Layout,
  Modal,
  TextContainer,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import { InfoMinor, NoteMinor, PlusMinor } from "@shopify/polaris-icons";
import React, { useState } from "react";
import { MovieSummaryModel } from "../models/movie.model";
import { NOMINATION_ACTION } from "../models/nomination.model";
import { getMovieByID } from "../services/movie.service";
import { MAX_NOMINATION_LENGTH, MAX_TITLE_LENGTH } from "../utils/constants";
import { EmptyState } from "./EmptyState";
import { COMPONENT } from "../models/component.model";

type SearchResultsProps = {
  nominationList: MovieSummaryModel[];
  editNominationList: (
    movie: MovieSummaryModel,
    action: NOMINATION_ACTION
  ) => void;
  searchResult: MovieSummaryModel[];
  clearSearchResults: () => void;
};

const ModalContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const DesktopDisplay = styled.div`
  @media (max-width: 520px) {
    display: none;
  }
`;

const MobileDisplay = styled.div`
  @media (min-width: 520px) {
    display: none;
  }
`;

export const SearchResults = ({
  nominationList,
  editNominationList,
  searchResult,
  clearSearchResults,
}: SearchResultsProps) => {
  const [displayModalImage, setDisplayModalImage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullMovie, setFullMovie] = useState({
    Title: "",
    Year: "",
    Rated: "",
    Released: "",
    Runtime: "",
    Genre: "",
    Director: "",
    Writer: "",
    Actors: "",
    Plot: "",
    Language: "",
    Country: "",
    Awards: "",
    Poster: "",
    Ratings: [{ Source: "", Value: "" }],
    Metascore: "",
    imdbRating: "",
    imdbVotes: "",
    imdbID: "",
    Type: "",
    DVD: "",
    BoxOffice: "",
    Production: "",
    Website: "",
    Response: "",
  });
  const [movieSummary, setMovieSummary] = useState({
    Poster: "",
    Title: "",
    Type: "",
    Year: "",
    imdbID: "",
  });

  const setModalInformation = async (movie: MovieSummaryModel) => {
    setShowModal(true);
    setMovieSummary(movie);
    setFullMovie(await getMovieByID(movie.imdbID));
    setDisplayModalImage(movie.Poster !== "N/A");
  };

  const trimMovieTitle = (title: string) => {
    if (title.length > MAX_TITLE_LENGTH) {
      const trimmedString = title.substring(0, MAX_TITLE_LENGTH);
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

  const modalOnAction = () => {
    editNominationList(movieSummary, NOMINATION_ACTION.ADD);
    setShowModal(false);
  };

  return (
    <Layout.Section>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={movieSummary.Title}
        primaryAction={{
          content: "Nominate",
          disabled: disableNominateButton(movieSummary),
          onAction: () => modalOnAction(),
        }}
      >
        <Modal.Section>
          <ModalContainer>
            <DesktopDisplay>
              {displayModalImage ? (
                <img
                  style={{ maxWidth: "160px" }}
                  alt="Movie poster"
                  src={movieSummary.Poster}
                />
              ) : (
                <Thumbnail
                  source={NoteMinor}
                  size="large"
                  alt="Small document"
                />
              )}
            </DesktopDisplay>
            <TextContainer>
              <p>
                <TextStyle variation="strong">Released: </TextStyle>
                {fullMovie.Released}
              </p>
              <p>
                <TextStyle variation="strong">Genre: </TextStyle>
                {fullMovie.Genre}
              </p>
              <p>
                <TextStyle variation="strong">Production: </TextStyle>
                {fullMovie.Production}
              </p>
              <p>
                <TextStyle variation="strong">Director: </TextStyle>
                {fullMovie.Director}
              </p>
              <p>
                <TextStyle variation="strong">Boxoffice: </TextStyle>
                {fullMovie.BoxOffice}
              </p>
              <p>
                <TextStyle variation="strong">Awards: </TextStyle>
                {fullMovie.Awards}
              </p>
            </TextContainer>
          </ModalContainer>
        </Modal.Section>
      </Modal>
      <Card
        title="Search Results"
        actions={
          !!searchResult.length
            ? [{ content: "Clear", onAction: clearSearchResults }]
            : []
        }
        sectioned
      >
        {!!searchResult.length ? (
          <MobileDisplay>
            <Caption>Click the movie title to learn more.</Caption>
          </MobileDisplay>
        ) : (
          <EmptyState component={COMPONENT.RESULTS} />
        )}
        {/* <p>Theses are the search results for "{searchTerm}"</p> */}
        <ul>
          {searchResult.map((movie) => {
            return (
              <li className="list-container">
                <div
                  className="list-container__search-content"
                  onClick={() => setModalInformation(movie)}
                  style={{ cursor: "pointer" }}
                >
                  <h3>
                    <TextStyle variation="strong">
                      {trimMovieTitle(movie.Title)}
                    </TextStyle>
                  </h3>
                  <Caption>{movie.Year}</Caption>
                </div>
                <DesktopDisplay>
                  <ButtonGroup>
                    <Button
                      size="slim"
                      // icon={InfoMinor}
                      onClick={() => setModalInformation(movie)}
                    >
                      Learn more
                    </Button>
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
                </DesktopDisplay>
                <MobileDisplay>
                  <ButtonGroup>
                    <Button
                      size="slim"
                      primary
                      icon={PlusMinor}
                      disabled={disableNominateButton(movie)}
                      onClick={() =>
                        editNominationList(movie, NOMINATION_ACTION.ADD)
                      }
                    ></Button>
                  </ButtonGroup>
                </MobileDisplay>
              </li>
            );
          })}
        </ul>
      </Card>
    </Layout.Section>
  );
};
