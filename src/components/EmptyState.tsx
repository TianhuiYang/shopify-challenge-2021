import React from "react";
import styled from "styled-components";
import { COMPONENT } from "../models/component.model";
import { EMPTY_NOMINATION, EMPTY_SEARCH } from "../utils/imageLinks";

type EmptyStateProps = {
  component: COMPONENT;
};

const EmptyStateContainer = styled.div`
  height: 300px;
  margin-top: 32px;
  flex-direction: column;
  text-align: center;
`;

const EmptyStateImg = styled.img`
  max-width: 100px;
  margin: 32px auto;
`;

export const EmptyState = ({ component }: EmptyStateProps) => {
  const headingKeyword =
    component === COMPONENT.NOMINATIONS ? "nominations" : "search results";

  const imageURL =
    component === COMPONENT.NOMINATIONS ? EMPTY_NOMINATION : EMPTY_SEARCH;

  return (
    <EmptyStateContainer>
      <EmptyStateImg src={imageURL} alt="Document icon" />
      <p>{"Your " + headingKeyword + " will appear here."}</p>
    </EmptyStateContainer>
  );
};
