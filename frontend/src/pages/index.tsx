import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    {
      title: "Interview Practice",
      description:
        "Gahigi simulates job interviews, giving you feedback to improve your performance.",
      image:
        "https://res.cloudinary.com/elite-team/image/upload/v1656310022/elite/aoraz9lvx3nwlekt9bmh.jpg",
    },
    {
      title: "Skill-building Exercises",
      description:
        "Through interactive scenarios, Gahigi helps you develop essential workplace skills.",
      image:
        "https://res.cloudinary.com/elite-team/image/upload/v1656313321/elite/umn8bbpjjvbpmibuij1t.webp",
    },
    {
      title: "Personalized Career Advice",
      description:
        "Based on your interests and strengths, Gahigi offers tailored guidance to help you find the right career path.",
      image:
        "https://res.cloudinary.com/elite-team/image/upload/v1656310020/elite/ad75a6jpupqfdqipvrrt.jpg",
    },
    {
      title: "Job Market Insights",
      description:
        "Gahigi keeps you informed about entry-level opportunities in Rwanda's job market.",
      image:
        "https://res.cloudinary.com/elite-team/image/upload/v1656310022/elite/t0bd0cibpdwbmm1rg3ah.jpg",
    },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gahigi AI
          </Typography>
          <ScrollLink to="solutions" smooth={true} duration={500}>
            <Button color="inherit">Solutions</Button>
          </ScrollLink>
          <ScrollLink to="demo" smooth={true} duration={500}>
            <Button color="inherit">See Demo</Button>
          </ScrollLink>
          <Link href="/login" passHref>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: theme.palette.primary.main,
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
            >
              Get Started
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundImage:
            'url("https://res.cloudinary.com/elite-team/image/upload/v1705336681/kqn50ftynxt66dgkfw0d.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: theme.palette.common.white,
        }}
      >
        <Container>
          <Typography variant={isSmallScreen ? "h3" : "h2"} gutterBottom>
            Kickstart Your Career with AI-Powered Coaching
          </Typography>
          <Typography variant="h5" paragraph>
            Gahigi: Your personal AI career coach for young professionals in
            Rwanda
          </Typography>
        </Container>
      </Box>

      <Box id="demo" sx={{ py: 4 }}>
        <Container>
          <Typography variant="h3" gutterBottom align="center">
            See Gahigi in Action
          </Typography>
          {/* <Box
            sx={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              mb: 4,
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your actual demo video
              title="Gahigi Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box> */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Link href="/login" passHref>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                Get Started
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      <Box
        id="solutions"
        sx={{ py: 4, backgroundColor: theme.palette.background.default }}
      >
        <Container>
          <Typography variant="h3" gutterBottom align="center">
            Meet Gahigi AI
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={feature.image}
                    alt={feature.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {features.map((feature, index) => (
        <Box
          key={index}
          sx={{
            py: 4,
            backgroundColor:
              index % 2 === 0
                ? theme.palette.background.paper
                : theme.palette.background.default,
          }}
        >
          <Container>
            <Grid
              container
              spacing={4}
              alignItems="center"
              direction={index % 2 === 0 ? "row" : "row-reverse"}
            >
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {feature.description}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={feature.image}
                  alt={feature.title}
                  sx={{ width: "100%", borderRadius: 2 }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      ))}

      <Box
        sx={{
          py: 3,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container>
          <Typography variant="body1" align="center">
            © 2023 Gahigi AI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;
