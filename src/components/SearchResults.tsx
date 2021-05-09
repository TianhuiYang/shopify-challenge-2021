import styled from "styled-components";
import {
  Button,
  ButtonGroup,
  Caption,
  Card,
  Icon,
  Layout,
  Modal,
  TextContainer,
  TextStyle,
} from "@shopify/polaris";
import { NoteMajor, PlusMinor } from "@shopify/polaris-icons";
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

const ImgContainer = styled.div`
  width: 100px;
  height: 120px;
  margin: 4px 32px 4px 0;
`;

const NoPosterImgContainer = styled.div`
  width: 100px;
  height: 120px;
  margin: 4px 32px 4px 0;
  outline: 1px solid lightGrey;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NoPosterImgModal = styled.div`
  width: 140px;
  height: 100%;
  outline: 1px solid lightGrey;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
                <NoPosterImgModal>
                  <Icon source={NoteMajor} color="subdued" />
                </NoPosterImgModal>
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
        <ul>
          {searchResult.map((movie) => {
            return (
              <li className="searchResultsContainer" key={movie.imdbID}>
                <DesktopDisplay>
                  {" "}
                  {movie.Poster !== "N/A" ? (
                    <ImgContainer>
                      <img
                        style={{
                          borderRadius: "10px",
                          width: "100px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                        alt="Movie poster"
                        src={movie.Poster}
                      />
                    </ImgContainer>
                  ) : (
                    <NoPosterImgContainer>
                      <Icon source={NoteMajor} color="subdued" />
                    </NoPosterImgContainer>
                  )}
                </DesktopDisplay>
                <div className="searchResultsContainer__content">
                  <div
                    className="searchResultsContainer__content__heading"
                    onClick={() => setModalInformation(movie)}
                    style={{ cursor: "pointer" }}
                  >
                    <TextStyle variation="strong">
                      {trimMovieTitle(movie.Title)}
                    </TextStyle>
                    <Caption>{movie.Year}</Caption>
                  </div>
                  <DesktopDisplay>
                    <ButtonGroup>
                      <Button
                        size="slim"
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
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </Layout.Section>
  );
};
