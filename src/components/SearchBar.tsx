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
import React, { useCallback, useState } from "react";

type SearchBarProps = {
  searchMovie: (movie: string) => Promise<void>;
  isLoading: boolean;
};

export const SearchBar = ({ searchMovie, isLoading }: SearchBarProps) => {
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
            <Form onSubmit={() => searchMovie(query)}>
              <TextField
                label="Search for a movie by keyword or ID"
                value={query}
                placeholder='Search "The Avengers"'
                onChange={updateQuery}
                prefix={<Icon source={SearchMinor} color="base" />}
                clearButton
                onClearButtonClick={handleClearButtonClick}
                autoFocus
                // error={searchError}
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
