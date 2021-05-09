import { DisplayText, Layout, TextContainer } from "@shopify/polaris";
import React from "react";

export const Header = () => {
  return (
    <Layout.Section>
      <div style={{ marginLeft: "12px" }}>
        <TextContainer>
          <DisplayText size="large">Welcome to the Shoppies!</DisplayText>
          <p>
            Shopify has branched out into movie awards shows and we want you to
            nominate your <b>5 favourite movies</b> for this year's Shoppies.
            Your nominations will be <b>automatically saved</b>.
          </p>
        </TextContainer>
      </div>
    </Layout.Section>
  );
};
