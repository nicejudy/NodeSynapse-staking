import { useTheme } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import { Icon } from "@olympusdao/component-library";

interface IThemeSwitcherProps {
  theme: string;
  toggleTheme: (e: any) => void;
}

function ThemeSwitcher({ theme, toggleTheme }: IThemeSwitcherProps) {
  const colorTheme = useTheme();

  return (
    <ToggleButton
      sx={{ marginTop: "0px", height: "39px", background: "none", border: `1px solid ${colorTheme.colors.text}`,
      "&:hover": {
        border: `1px solid ${colorTheme.colors.primary[300]}`,
        color: colorTheme.colors.primary[300],
        background: 'none!important'
      },
      "&:hover path" : {
        stroke: colorTheme.colors.primary[300]
      } }}
      className="toggle-button"
      type="button"
      title={`Change Theme`}
      value="check"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Icon name={"moon"} color={"primary"} style={{ fontSize: "17.5px" }} />
      ) : (
        <Icon name={"sun"} color={"primary"} style={{ fontSize: "17.5px" }} />
      )}
    </ToggleButton>
  );
}

export default ThemeSwitcher;
