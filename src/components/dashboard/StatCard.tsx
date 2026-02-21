import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  helper?: string;
};

export const StatCard = ({ label, value, icon, helper }: StatCardProps) => {
  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          {icon}
        </Box>

        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>

        {helper ? (
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
};
