import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import Onboarding from "@/components/onboarding/Onboarding";
import AppButton from "@/components/Button/AppButton";
import { useRouter } from "next/router";
import withAuth from "../utils/withAuth";

const SkillCard = ({
  title,
  description,
  buttonText,
}: {
  title: string;
  description: string;
  buttonText: string;
}) => {
  const router = useRouter();

  const handleStartCourse = () => {
    router.push(`/course/${encodeURIComponent(title)}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <AppButton onClick={handleStartCourse}>{buttonText}</AppButton>
      </CardContent>
    </Card>
  );
};

const Home = () => {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skillCards, setSkillCards] = useState([]);
  const [onboardingLoading, setOnboardingLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const skillCardsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const skillCardsData = await skillCardsResponse.json();
      // Ensure that skillCards is always an array
      if (skillCardsData.length > 0) {
        setOnboardingComplete(true);
        setLoading(false);
      }
      setLoading(false);
      setSkillCards(Array.isArray(skillCardsData) ? skillCardsData : []);
    })();
  }, []);

  const handleOnboardingComplete = async (answers: Record<string, string>) => {
    setOnboardingLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/onboarding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(answers),
        }
      );
      await response.json();
      setOnboardingComplete(true);

      // Fetch skill cards from /course/recommendations
      const skillCardsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const skillCardsData = await skillCardsResponse.json();
      // Ensure that skillCards is always an array
      setSkillCards(Array.isArray(skillCardsData) ? skillCardsData : []);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // Handle error (e.g., show an error message to the user)
      setSkillCards([]);
    } finally {
      setOnboardingLoading(false);
    }
  };

  if (!onboardingComplete && !loading) {
    return (
      <>
        <Onboarding onComplete={handleOnboardingComplete} />
        {onboardingLoading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* <img src="/logo.png" alt="GahigiCareerCoach Logo" style={{ height: 32, marginRight: 8 }} /> */}
            <Typography variant="h6" component="div">
              Gahigi CareerCoach
            </Typography>
          </Box>
          <Box component="nav">
            <MuiLink
              underline="none"
              component={Link}
              href="/"
              color="inherit"
              sx={{ mx: 1 }}
            >
              Home
            </MuiLink>
            <MuiLink
              underline="none"
              component={Link}
              href="/interview-practice"
              color="inherit"
              sx={{ mx: 1 }}
            >
              Interview Practice
            </MuiLink>
            <MuiLink
              underline="none"
              component={Link}
              href="/skill-building"
              color="inherit"
              sx={{ mx: 1 }}
            >
              Skill-building Exercises
            </MuiLink>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ bgcolor: "#FFF1F0", mb: 3 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Welcome to Gahigi CareerCoach
                </Typography>
                <Typography variant="body1">
                  Based on your responses, we've customized some skill-building
                  exercises for you. Get started with these to boost your career
                  prospects!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {skillCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <SkillCard
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box component="footer" sx={{ bgcolor: "#FFF1F0", py: 3, mt: "auto" }}>
        <Container>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                © 2024 Gahigi CareerCoach. All rights reserved.
              </Typography>
            </Grid>
            <Grid item>
              <MuiLink
                underline="none"
                component={Link}
                href="/privacy"
                color="inherit"
                sx={{ mx: 1 }}
              >
                Privacy Policy
              </MuiLink>
              <MuiLink
                underline="none"
                component={Link}
                href="/terms"
                color="inherit"
                sx={{ mx: 1 }}
              >
                Terms of Service
              </MuiLink>
              <MuiLink
                underline="none"
                component={Link}
                href="/contact"
                color="inherit"
                sx={{ mx: 1 }}
              >
                Contact Us
              </MuiLink>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default withAuth(Home);
