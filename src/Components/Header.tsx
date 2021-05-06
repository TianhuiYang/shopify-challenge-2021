import { DisplayText, Layout, TextContainer } from "@shopify/polaris";
import React from "react";

export const Header = () => {
  return (
    <Layout.Section>
      <TextContainer>
        <DisplayText size="large">Welcome to the Shoppies!</DisplayText>
        <p>Nominate 5 movies for this year's Shoppies Awards</p>
      </TextContainer>
    </Layout.Section>
  );
};
