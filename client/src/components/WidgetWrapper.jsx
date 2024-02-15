import { Box } from "@mui/material";
import {styled} from "@mui/system";

//This will give us a base for all our widget like padding, borderRadius. This will make things easier for us.
const WidgetWrapper = styled(Box)(({theme})=>({
    padding: "1.5rem 1.5rem 0.75rem 1.5rem",
    backgroundColor: theme.palette.background.alt,
    borderRadius:"0.75rem"
}));
export default WidgetWrapper;
