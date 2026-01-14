import { useTheme } from "./ThemeContext";
import { createStyles } from "./styles";

export const useStyles = () => {
    const { theme } = useTheme();
    return createStyles(theme);
}