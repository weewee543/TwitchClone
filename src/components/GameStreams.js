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
  card: {
    minWidth: 300,
    minHeight: 300
  },
  title: {
    fontSize: 14
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  }
}));

export default function GameStreams({ match, location }) {
  const [streamData, setStreamData] = useState([]);
  const [viewers, setViewers] = useState(0);
  let classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get(
        `https://api.twitch.tv/helix/streams?game_id=${location.state.gameID}`
      );
      let dataArray = result.data.data;
      console.log(dataArray);
      let finalArray = dataArray.map(stream => {
        let newURL = stream.thumbnail_url
          .replace("{width}", "300")
          .replace("{height}", "300");
        stream.thumbnail_url = newURL;
        return stream;
      });

      let totalViewers = finalArray.reduce((acc, val) => {
        return acc + val.viewer_count;
      }, 0);
      setViewers(totalViewers);
      setStreamData(finalArray);
    };
    fetchData();
  }, []);

  return (
    <div className={classes.root}>
      <Container>
        <Typography variant="h2" component="h2" style={{ marginTop: 50 }}>
          {match.params.id} Streams
        </Typography>
        <Typography variant="subtitle1" style={{ padding: "20px" }}>
          <strong>{viewers}</strong> people currently watching {match.params.id}
        </Typography>
        <Grid container spacing={3}>
          {streamData.map(stream => (
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardMedia
                  className={classes.media}
                  image={stream.thumbnail_url}
                />
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {stream.user_name}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {stream.viewer_count} live viewers
                  </Typography>
                </CardContent>

                <Button
                  color="primary"
                  className={classes.button}
                  href={"https://twitch.tv/" + stream.user_name}
                >
                  Watch {stream.user_name}'s channel
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
