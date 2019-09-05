import React, { useEffect, useState } from "react";
import api from "../api";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import { Container } from "@material-ui/core";

let useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    textAlign: "center"
  },
  title: {
    fontSize: 14
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  button: {
    margin: theme.spacing(1)
  }
}));

export default function Streams() {
  let classes = useStyles();

  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get("https://api.twitch.tv/helix/streams");
      let dataArray = result.data.data;
      //console.log(dataArray);
      let gameIDs = dataArray.map(streams => {
        return streams.game_id;
      });
      //console.log(gameIDs)

      let baseURL = "https://api.twitch.tv/helix/games?";
      let queryParams = "";
      gameIDs.map(id => {
        return (queryParams = queryParams + `id=${id}`);
      });

      let finalURL = baseURL + queryParams;
      let gameNames = await api.get(finalURL);
      let gameNameArray = gameNames.data.data;
      let finalArray = dataArray.map(stream => {
        stream.gameName = "";
        gameNameArray.map(name => {
          if (stream.game_id === name.id) {
            return (stream.gameName = name.name);
          }
        });
        let newURL = stream.thumbnail_url
          .replace("{width}", "300")
          .replace("{height}", "300");
        stream.thumbnail_url = newURL;
        return stream;
      });
      setChannels(finalArray);
    };
    fetchData();
  }, []);

  return (
    <div className={classes.root}>
      <Container>
        <Typography variant="h2" component="h2" style={{ padding: "50px" }}>
          Popular Live Streams
        </Typography>

        <Grid container spacing={3}>
          {channels.map(channel => (
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardMedia
                  className={classes.media}
                  image={channel.thumbnail_url}
                />
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {channel.user_name}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {channel.gameName}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {channel.viewer_count} live viewers
                  </Typography>
                </CardContent>
                <Button
                  color="primary"
                  className={classes.button}
                  href={"https://twitch.tv/" + channel.user_name}
                >
                  Watch {channel.user_name}'s stream
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
