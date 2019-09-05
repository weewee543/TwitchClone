import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleIcon from "@material-ui/icons/People";
import Drawer from "@material-ui/core/Drawer";
import GamepadIcon from "@material-ui/icons/Gamepad";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import PropTypes from "prop-types";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func
};

let useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    color: "white"
  },
  link: {
    color: "white",
    textDecoration: "none"
  }
}));

export default function Header(props) {
  let classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen({ ...drawerOpen, [side]: open });
  };

  const sideList = side => (
    <div
      className={classes.root}
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List component="nav">
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <GamepadIcon />
          </ListItemIcon>
          <ListItemText primary="Games" />
        </ListItem>
        <ListItem button component={Link} to="/top-streams">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Streamers" />
        </ListItem>
        <ListItem button component={Link} to="/top-clips">
          <ListItemIcon>
            <VideoLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Clips" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <ElevationScroll {...props}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              onClick={toggleDrawer("left", true)}
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              open={drawerOpen.left}
              onClose={toggleDrawer("left", false)}
            >
              {sideList("left")}
            </Drawer>
            <Typography variant="h6" className={classes.title}>
              <Link className={classes.link} to="/">
                Twitch
              </Link>
            </Typography>
            <Button color="inherit">Source Code</Button>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </div>
  );
}
