import {
  Button,
  ButtonGroup,
  Caption,
  Card,
  Layout,
  TextStyle,
} from "@shopify/polaris";
import { InfoMinor } from "@shopify/polaris-icons";
import { MovieSummaryModel } from "../models/movie.model";
import { NOMINATION_ACTION } from "../models/nomination.model";
import { MAX_NOMINATION_LENGTH, MAX_TITLE_LENGTH } from "../utils/constants";

type SearchResultsProps = {
  nominationList: MovieSummaryModel[];
  editNominationList: (
    movie: MovieSummaryModel,
    action: NOMINATION_ACTION
  ) => void;
  searchResult: MovieSummaryModel[];
  clearSearchResults: () => void;
};

export const SearchResults = ({
  nominationList,
  editNominationList,
  searchResult,
  clearSearchResults,
}: SearchResultsProps) => {
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

  return (
    <Layout.Section>
      <Card
        title="Search Results"
        actions={[{ content: "Clear", onAction: clearSearchResults }]}
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
                    // onClick={() => fetchMovieDetails(movie.imdbID)}
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
  );
};
