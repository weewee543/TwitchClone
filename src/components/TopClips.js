import React, { useState, useEffect } from "react";
import api from "../api";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Container } from "@material-ui/core";

let useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    textAlign: "center"
  },
  button: {
    margin: theme.spacing(1)
  },
  title: {
    fontSize: 14
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  type: {
    padding: theme.spacing(2)
  }
}));

export default function TopClips({ match, location }) {
  const [clipData, setClipData] = useState([]);
  let classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get(
        `https://api.twitch.tv/helix/clips?game_id=${location.state.gameID}`
      );
      let dataArray = result.data.data;
      console.log(dataArray);
      let finalArray = dataArray.map(clip => {
        let newURL = clip.thumbnail_url
          .replace("{width}", "300")
          .replace("{height}", "300");
        clip.thumbnail_url = newURL;
        return clip;
      });
      setClipData(finalArray);
    };
    fetchData();
  }, []);

  return (
    <div className={classes.root}>
      <Container>
        <Typography variant="h2" component="h2" style={{ marginTop: 50 }}>
          {match.params.id} Clips
        </Typography>
        <Typography variant="h5" style={{ padding: "20px" }}>
          Top Clips
        </Typography>

        <Grid container spacing={3}>
          {clipData.map(clip => (
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardMedia
                  className={classes.media}
                  image={clip.thumbnail_url}
                />
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {clip.broadcaster_name}
                  </Typography>
                  <Typography
                    className={classes.type}
                    variant="body2"
                    component="p"
                  >
                    {clip.title}
                  </Typography>
                  <Typography variant="body2" component="p">
                    <strong>{clip.view_count} views</strong>
                  </Typography>
                </CardContent>
                <Button
                  href={clip.url}
                  color="primary"
                  className={classes.button}
                >
                  Watch Clip Here
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
