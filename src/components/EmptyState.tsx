import React from "react";
import styled from "styled-components";
import { COMPONENT } from "../models/component.model";
import { EMPTY_NOMINATION, EMPTY_SEARCH } from "../utils/imagesLinks";

type EmptyStateProps = {
  component: COMPONENT;
};

const EmptyStateContainer = styled.div`
  height: 300px;
  margin-top: 32px;
  flex-direction: column;
  text-align: center;
`;

export const EmptyState = ({ component }: EmptyStateProps) => {
  const headingKeyword =
    component === COMPONENT.NOMINATIONS ? "nominations" : "search results";

  const imageURL =
    component === COMPONENT.NOMINATIONS ? EMPTY_NOMINATION : EMPTY_SEARCH;

  return (
    <EmptyStateContainer>
      <img
        style={{ maxWidth: "100px", marginTop: "32px", marginBottom: "32px" }}
        src={imageURL}
        alt="Document icon"
      />
      <p>{"Your " + headingKeyword + " will appear here."}</p>
    </EmptyStateContainer>
  );
};
