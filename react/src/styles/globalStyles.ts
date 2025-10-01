import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 600;
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    background-color: #3f51b5;
    color: white;
    transition: background-color 0.3s;

    &:hover {
      background-color: #303f9f;
    }
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  @media (max-width: 768px) {
    body {
      padding: 10px;
    }

    .container {
      padding: 10px;
    }
  }
`;

export default GlobalStyle;