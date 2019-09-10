import React, { useState, useEffect } from "react";
import api from "../api";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import { Link } from "react-router-dom";
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
    padding: 50
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  card: {
    minHeight: "363px",
    display: "grid"
  }
}));

export default function GameClips() {
  const [games, setGames] = useState([]);
  let classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get("https://api.twitch.tv/helix/games/top");
      //console.log(result.data);
      let dataArray = result.data.data;
      let finalArray = dataArray.map(game => {
        let newUrl = game.box_art_url
          .replace("{width}", "300")
          .replace("{height}", "300");
        game.box_art_url = newUrl;
        return game;
      });
      setGames(finalArray);
    };
    fetchData();
  }, []);

  return (
    <div className={classes.root}>
      <Container>
        <Typography
          variant="h2"
          gutterBottom
          component="h2"
          className={classes.title}
        >
          Popular Clips By Game
        </Typography>

        <Grid container spacing={3}>
          {games.map(game => (
            <Grid item xs={12} md={6} lg={4}>
              <Card className={classes.card}>
                <CardMedia className={classes.media} image={game.box_art_url} />
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {game.name}
                  </Typography>
                </CardContent>

                <Button
                  alignSelf="flex-end"
                  component={Link}
                  to={{
                    pathname: "top-clips/" + game.name,
                    state: {
                      gameID: game.id
                    }
                  }}
                  color="primary"
                  className={classes.button}
                >
                  {game.name} Clips
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
