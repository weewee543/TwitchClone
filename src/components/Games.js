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

export default function Games() {
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
        <Typography variant="h2" component="h2" style={{ padding: "50px" }}>
          Most Popular Games
        </Typography>
        <Grid container spacing={3}>
          {games.map(game => (
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardMedia className={classes.media} image={game.box_art_url} />
                <CardContent>
                  <Typography variant="h8" component="h2">
                    {game.name}
                  </Typography>
                </CardContent>

                <Button
                  component={Link}
                  to={{
                    pathname: "game/" + game.name,
                    state: {
                      gameID: game.id
                    }
                  }}
                  color="primary"
                  className={classes.button}
                >
                  {game.name} streams
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
