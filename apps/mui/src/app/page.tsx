import NextLink from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { navItems } from "@bridge/schemas";

/**
 * Landing page. A native-MUI dashboard of cards, one per shared IA route.
 * Cards are driven by `navItems` from @bridge/schemas (no local route list).
 */
export default function HomePage() {
  return (
    <Grid container spacing={3}>
      {navItems.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {item.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={NextLink}
                href={item.path}
                endIcon={<ArrowForwardIcon />}
                size="small"
              >
                Open {item.label}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
