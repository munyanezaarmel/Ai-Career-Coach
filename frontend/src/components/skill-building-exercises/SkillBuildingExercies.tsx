import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, CircularProgress, 
  Stepper, Step, StepLabel, StepContent, Card, CardContent, 
  LinearProgress, Grid, Chip
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface Scenario {
  id: number;
  title: string;
  description: string;
  steps: {
    instruction: string;
    options: string[];
    correctOption: number;
  }[];
  skillArea: string;
}

interface UserProgress {
  completedScenarios: number;
  totalScenarios: number;
  level: number;
  experience: number;
  badges: string[];
}

const mockScenarios: Scenario[] = [
  {
    id: 1,
    title: "Managing a Tight Deadline",
    description: "Your team has been given a project with a very tight deadline. How do you handle this situation?",
    steps: [
      {
        instruction: "The project manager informs you that the deadline has been moved up by a week. What's your first action?",
        options: [
          "Panic and inform the team immediately",
          "Assess the current progress and resources",
          "Ask for an extension",
          "Start working overtime immediately"
        ],
        correctOption: 1
      },
      {
        instruction: "You've assessed the situation. What's your next step?",
        options: [
          "Call an emergency team meeting",
          "Inform the client that the deadline is impossible",
          "Start cutting corners to save time",
          "Prioritize tasks and reallocate resources"
        ],
        correctOption: 3
      },
      // Add more steps as needed
    ],
    skillArea: "Time Management"
  },
  // Add more scenarios
];

const SkillBuildingExercises: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedScenarios: 0,
    totalScenarios: mockScenarios.length,
    level: 1,
    experience: 0,
    badges: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNextScenario();
  }, []);

  const fetchNextScenario = () => {
    setIsLoading(true);
    // In a real application, this would be an API call to fetch a personalized scenario
    setTimeout(() => {
      const nextScenario = mockScenarios[userProgress.completedScenarios % mockScenarios.length];
      setCurrentScenario(nextScenario);
      setActiveStep(0);
      setIsLoading(false);
    }, 1000);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (!currentScenario) return;

    const isCorrect = optionIndex === currentScenario.steps[activeStep].correctOption;
    
    if (isCorrect) {
      // Update progress
      const newExperience = userProgress.experience + 10;
      const newLevel = Math.floor(newExperience / 100) + 1;
      const newBadges = [...userProgress.badges];
      
      if (newLevel > userProgress.level) {
        newBadges.push(`Level ${newLevel} Achieved!`);
      }

      setUserProgress(prev => ({
        ...prev,
        experience: newExperience,
        level: newLevel,
        badges: newBadges
      }));
    }

    if (activeStep < currentScenario.steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Scenario completed
      setUserProgress(prev => ({
        ...prev,
        completedScenarios: prev.completedScenarios + 1
      }));
      fetchNextScenario();
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!currentScenario) {
    return <Typography>No scenario available</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Skill-Building Exercises</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom>{currentScenario.title}</Typography>
            <Typography variant="body1" paragraph>{currentScenario.description}</Typography>
            
            <Stepper activeStep={activeStep} orientation="vertical">
              {currentScenario.steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{`Step ${index + 1}`}</StepLabel>
                  <StepContent>
                    <Typography>{step.instruction}</Typography>
                    <Box sx={{ mt: 2 }}>
                      {step.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          variant="outlined"
                          onClick={() => handleOptionSelect(optionIndex)}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {option}
                        </Button>
                      ))}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Your Progress</Typography>
              <Typography variant="body2">Level: {userProgress.level}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(userProgress.experience % 100)} 
                sx={{ my: 1 }}
              />
              <Typography variant="body2">
                Experience: {userProgress.experience} / {userProgress.level * 100}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Scenarios Completed: {userProgress.completedScenarios} / {userProgress.totalScenarios}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>Badges:</Typography>
                {userProgress.badges.map((badge, index) => (
                  <Chip 
                    key={index} 
                    icon={<EmojiEventsIcon />} 
                    label={badge} 
                    color="primary" 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkillBuildingExercises;