import React, { useEffect, useState } from "react";
import { MovieSummaryModel } from "../models/movie.model";
import { Icon, Modal, TextContainer, TextStyle } from "@shopify/polaris";
import { NOMINATION_ACTION } from "../models/nomination.model";
import styled from "styled-components";
import { NoteMajor } from "@shopify/polaris-icons";
import { getMovieByID } from "../services/movie.service";
import { MODAL_ACTION } from "../models/modal.model";

type MovieDetailsProps = {
  editNominationList: (
    movie: MovieSummaryModel,
    action: NOMINATION_ACTION
  ) => void;
  disableNominateButton: (movie: MovieSummaryModel) => boolean;
  movie: MovieSummaryModel;
  updateModalDisplay: (action: MODAL_ACTION) => void;
  showModal: boolean;
};

const ModalContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const NoPosterImgModal = styled.div`
  width: 140px;
  outline: 1px solid lightGrey;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ModalImg = styled.img`
  max-width: 160px;

  @media (max-width: 520px) {
    display: none;
  }
`;

export const MovieDetailsModal = ({
  editNominationList,
  disableNominateButton,
  movie,
  updateModalDisplay,
  showModal,
}: MovieDetailsProps) => {
  const [displayModalImage, setDisplayModalImage] = useState(false);
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

  const modalOnAction = () => {
    editNominationList(movie, NOMINATION_ACTION.ADD);
    updateModalDisplay(MODAL_ACTION.CLOSE);
  };

  useEffect(() => {
    const getFullMovie = async () => {
      setFullMovie(await getMovieByID(movie.imdbID));
    };

    getFullMovie();
    setDisplayModalImage(movie.Poster !== "N/A");
  }, [movie]);

  return (
    <Modal
      open={showModal}
      onClose={() => updateModalDisplay(MODAL_ACTION.CLOSE)}
      title={movie.Title}
      primaryAction={{
        content: "Nominate",
        disabled: disableNominateButton(movie),
        onAction: () => modalOnAction(),
      }}
    >
      <Modal.Section>
        <ModalContainer>
          {displayModalImage ? (
            <ModalImg alt="Movie poster" src={fullMovie.Poster} />
          ) : (
            <NoPosterImgModal>
              <Icon source={NoteMajor} color="subdued" />
            </NoPosterImgModal>
          )}
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
  );
};
