import React, { useState } from "react";
import styled from "styled-components";
import {
  Button,
  ButtonGroup,
  Caption,
  Card,
  Icon,
  Layout,
  TextStyle,
} from "@shopify/polaris";
import { NoteMajor, PlusMinor } from "@shopify/polaris-icons";
import { MovieSummaryModel } from "../models/movie.model";
import { NOMINATION_ACTION } from "../models/nomination.model";
import { COMPONENT } from "../models/component.model";
import { MODAL_ACTION } from "../models/modal.model";
import { MAX_NOMINATION_LENGTH, MAX_TITLE_LENGTH } from "../utils/constants";
import EmptyState from "./EmptyState";
import MovieDetailsModal from "./MovieDetails";

type SearchResultsProps = {
  nominationList: MovieSummaryModel[];
  editNominationList: (
    movie: MovieSummaryModel,
    action: NOMINATION_ACTION
  ) => void;
  searchResult: MovieSummaryModel[];
  clearSearchResults: () => void;
};

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

const MovieImg = styled.img`
  border-radius: 10px;
  width: 100px;
  height: 120px;
  object-fit: cover;
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

const SearchResults = ({
  nominationList,
  editNominationList,
  searchResult,
  clearSearchResults,
}: SearchResultsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [movieSummary, setMovieSummary] = useState({
    Poster: "",
    Title: "",
    Type: "",
    Year: "",
    imdbID: "",
  });

  const setModalInformation = (movie: MovieSummaryModel) => {
    setShowModal(true);
    setMovieSummary(movie);
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

  const updateModalDisplay = (action: MODAL_ACTION) => {
    action === MODAL_ACTION.CLOSE ? setShowModal(false) : setShowModal(true);
  };

  return (
    <Layout.Section>
      <MovieDetailsModal
        editNominationList={editNominationList}
        disableNominateButton={disableNominateButton}
        movie={movieSummary}
        updateModalDisplay={updateModalDisplay}
        showModal={showModal}
      />
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
            <p>Click the movie title to learn more.</p>
          </MobileDisplay>
        ) : (
          <EmptyState component={COMPONENT.RESULTS} />
        )}
        <ul>
          {searchResult.map((movie) => {
            return (
              <li className="searchResultsContainer" key={movie.imdbID}>
                <DesktopDisplay>
                  {movie.Poster !== "N/A" ? (
                    <ImgContainer>
                      <MovieImg alt="Movie poster" src={movie.Poster} />
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
                        accessibilityLabel="Nominate"
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

export default SearchResults;
