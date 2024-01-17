import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { IconKafka, IconBoomi, IconApp_R, IconApp_C } from './Icons'; // Make sure to adjust the import path

describe('IconKafka', () => {
    test('renders Kafka icon', () => {
      render(<IconKafka />);
      const kafkaIcon = screen.getByAltText('kafka button');
      expect(kafkaIcon).toBeInTheDocument();
    });
  });

describe('IconBoomi', () => {
  test('renders Boomi icon', () => {
    render(<IconBoomi />);
    const boomiIcon = screen.getByAltText('boomi button');
    expect(boomiIcon).toBeInTheDocument();
  });
});

describe('IconApp_R', () => {
  test('renders App Rectangle with text', () => {
    render(<IconApp_R />);
    const appRectangleText = screen.getByText('App Rectangle');
    expect(appRectangleText).toBeInTheDocument();
  });
});

describe('IconApp_C', () => {
  test('renders App Circle with text', () => {
    render(<IconApp_C />);
    const appCircleText = screen.getByText('App Circle');
    expect(appCircleText).toBeInTheDocument();
  });
});
