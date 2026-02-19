import { Button } from "@mui/material";
import { Link } from "react-router-dom";

type TopButtonProps = {
  label: string;
  link: string;
};

export const TopButton = ({ label, link }: TopButtonProps) => {
  return (
    <Button
      component={Link}
      to={link}
      variant="outlined"
      color="primary"
      sx={{
        textTransform: "none",
        fontWeight: 700,
        borderRadius: "999px",
        px: 4,
        py: 1,
        borderColor: "primary.main",
        color: "primary.main",
        
        "&:hover": {
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          borderColor: "primary.main",
        },
        
        transition: "all 0.2s ease-in-out",
      }}
    >
      {label}
    </Button>
  );
};