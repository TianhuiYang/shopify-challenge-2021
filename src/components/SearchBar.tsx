import React, { useCallback, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  Icon,
  Layout,
  Stack,
  TextField,
} from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";

type SearchBarProps = {
  searchMovie: (movie: string) => Promise<void>;
  isLoading: boolean;
  error: string;
};

const SearchBar = ({
  searchMovie,
  isLoading,
  error,
}: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");
  const updateQuery = useCallback((newValue) => setQuery(newValue), []);
  const handleClearButtonClick = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <Layout.Section>
      <Card title="Movie Search">
        <Card.Section>
          <Stack spacing="loose" vertical>
            <Form autoComplete={false} onSubmit={() => searchMovie(query)}>
              <TextField
                label="Search for a movie by keyword"
                value={query}
                placeholder='Search "The Avengers"'
                onChange={updateQuery}
                prefix={<Icon source={SearchMinor} color="base" />}
                clearButton
                onClearButtonClick={handleClearButtonClick}
                autoFocus={false}
                error={!!query || query === "" ? error : ""}
              />
            </Form>
            <Stack distribution="trailing">
              <ButtonGroup>
                <Button
                  primary
                  loading={isLoading}
                  onClick={() => searchMovie(query)}
                >
                  Search
                </Button>
              </ButtonGroup>
            </Stack>
          </Stack>
        </Card.Section>
      </Card>
    </Layout.Section>
  );
};

export default SearchBar;
