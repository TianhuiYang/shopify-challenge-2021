import { DisplayText, Layout, TextContainer } from "@shopify/polaris";
import React from "react";

export const Header = () => {
  return (
    <Layout.Section>
      <div style={{ marginLeft: "12px" }}>
        <TextContainer>
          <DisplayText size="large">Welcome to the Shoppies!</DisplayText>
          <p>Nominate 5 movies for this year's Shoppies Awards.</p>
          <p>Your nominations will be automatically saved.</p>
        </TextContainer>
      </div>
    </Layout.Section>
  );
};
