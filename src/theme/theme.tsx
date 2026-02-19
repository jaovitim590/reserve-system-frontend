import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: "#62a8ac", 
      },

      secondary: {
        main: "#78cad2",
      },

      ...(mode === "light"
        ? {
            background: {
              default: "#e6f0f1",
              paper: "#ddebec",
            },
            text: {
              primary: "#0f172a",
              secondary: "#3f6b70",
            },
          }
        : {
            background: {
              default: "#0f1f22",
              paper: "#162e33",
            },
            text: {
              primary: "#e2f3f3",
              secondary: "#a1d2ce",
            },
          }),
    },

    shape: {
      borderRadius: 14,
    },

    typography: {
      fontFamily: "'Inter', sans-serif",
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 14,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
          },
        },
      },
    },
  });
