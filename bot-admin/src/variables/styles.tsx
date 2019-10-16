import {StyleRulesCallback, Theme} from "@material-ui/core";
import {deepOrange} from "@material-ui/core/colors";

export type FabButtonStylesKey =
    | "fab";

export const fabButtonStyles: StyleRulesCallback<Theme,{},FabButtonStylesKey> = (theme: Theme) => ({
    fab: {
        position: "fixed",
        backgroundColor: theme.palette.primary.main,
        color: "white",
        bottom: theme.spacing(),
        right: theme.spacing() * 3,
        zIndex: 100
    }
});

export default fabButtonStyles;
