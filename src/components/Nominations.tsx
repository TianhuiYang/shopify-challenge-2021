import React from "react";
import {
  Button,
  ButtonGroup,
  Caption,
  Card,
  Layout,
  TextStyle,
} from "@shopify/polaris";
import { DeleteMinor } from "@shopify/polaris-icons";
import { COMPONENT } from "../models/component.model";
import { MovieSummaryModel } from "../models/movie.model";
import { NOMINATION_ACTION } from "../models/nomination.model";
import {
  MAX_NOMINATION_LENGTH,
  MAX_TITLE_LENGTH_NOMINATION,
} from "../utils/constants";
import EmptyState from "./EmptyState";

type SearchResultsProps = {
  clearNominations: () => void;
  nominationList: MovieSummaryModel[];
  editNominationList: (
    movie: MovieSummaryModel,
    action: NOMINATION_ACTION
  ) => void;
};

const Nominations = ({
  clearNominations,
  nominationList,
  editNominationList,
}: SearchResultsProps) => {
  const trimMovieTitleNomination = (title: string) => {
    if (title.length > MAX_TITLE_LENGTH_NOMINATION) {
      const trimmedString = title.substring(0, MAX_TITLE_LENGTH_NOMINATION);
      return trimmedString.concat("...");
    }
    return title;
  };

  const nominationKeyword = () => {
    return (
      "nomination" +
      (nominationList.length === MAX_NOMINATION_LENGTH - 1 ? "" : "s")
    );
  };

  return (
    <Layout.Section secondary>
      <Card
        title="Nominations"
        actions={
          !!nominationList.length
            ? [{ content: "Clear", onAction: clearNominations }]
            : []
        }
        sectioned
      >
        {!!nominationList.length ? (
          <p>
            You have {5 - nominationList.length} {nominationKeyword()} left.
          </p>
        ) : (
          <EmptyState component={COMPONENT.NOMINATIONS} />
        )}
        <ul>
          {nominationList.map((movie) => {
            return (
              <li className="list-container" key={movie.imdbID}>
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
                    accessibilityLabel="Remove nomination"
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
  );
};

export default Nominations;
