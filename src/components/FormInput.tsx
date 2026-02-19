import {
  TextField,
  type TextFieldProps
} from "@mui/material"
import { Controller, type Control } from "react-hook-form";

type FormInputProps = TextFieldProps & {
  name: string;
  control: Control<any>;
};

export const FormInput = ({
  name,
  control,
  ...props
}: FormInputProps) => {
  return (
    <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => {
      return (
        <TextField
          {...field}
          {...props}
          fullWidth
          margin="normal"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      );
    }}
    >

    </Controller>
  )
}


