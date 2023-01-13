import { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
body::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

`;

export default GlobalStyle;
