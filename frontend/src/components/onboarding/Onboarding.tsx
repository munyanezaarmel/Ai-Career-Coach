import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const questions = [
  {
    id: "employmentStatus",
    question: "What is your current employment status?",
    options: [
      "Student",
      "Recent graduate",
      "Employed",
      "Unemployed",
      "Career changer",
    ],
  },
  {
    id: "educationLevel",
    question: "What is your highest level of education?",
    options: [
      "High school",
      "Some college",
      "Associate's degree",
      "Bachelor's degree",
      "Master's degree",
      "PhD",
      "Professional degree (e.g., MD, JD)",
    ],
  },
  {
    id: "industryInterest",
    question: "Which industry are you most interested in?",
    options: [
      "Technology",
      "Finance",
      "Healthcare",
      "Education",
      "Manufacturing",
      "Retail",
      "Entertainment",
      "Non-profit",
      "Government",
      "Other",
    ],
  },
  {
    id: "careerChallenge",
    question: "What is your biggest career challenge right now?",
    options: [
      "Finding job opportunities",
      "Interview preparation",
      "Skill development",
      "Networking",
      "Career advancement",
      "Work-life balance",
      "Job satisfaction",
      "Career transition",
    ],
  },
  {
    id: "publicSpeaking",
    question: "How comfortable are you with public speaking?",
    options: [
      "Very comfortable",
      "Somewhat comfortable",
      "Neutral",
      "Uncomfortable",
      "Very uncomfortable",
    ],
  },
  {
    id: "workStyle",
    question: "Which work style do you prefer?",
    options: ["Independent work", "Collaborative work", "Mix of both"],
  },
  {
    id: "learningStyle",
    question: "What is your preferred learning style?",
    options: ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"],
  },
  {
    id: "personalityType",
    question: "Which personality type best describes you?",
    options: ["Extroverted", "Introverted", "Balanced"],
  },
  {
    id: "workEnvironment",
    question: "What type of work environment do you prefer?",
    options: ["Office", "Remote", "Hybrid", "Field work"],
  },
  {
    id: "careerGoals",
    question: "What are your primary career goals for the next 5 years?",
    options: [
      "Advance in current field",
      "Switch careers",
      "Start a business",
      "Improve work-life balance",
      "Increase income",
      "Gain new skills",
    ],
  },
  {
    id: "skillsAssessment",
    question: "Which skills do you feel you need to improve the most?",
    options: [
      "Technical skills",
      "Communication skills",
      "Leadership skills",
      "Time management",
      "Problem-solving",
      "Creativity",
      "Emotional intelligence",
    ],
  },
  {
    id: "valueAlignment",
    question:
      "How important is it for your work to align with your personal values?",
    options: [
      "Very important",
      "Somewhat important",
      "Neutral",
      "Not very important",
      "Not important at all",
    ],
  },
  {
    id: "feedbackPreference",
    question: "How do you prefer to receive feedback?",
    options: ["Written", "Verbal", "Immediate", "Periodic reviews"],
  },
  {
    id: "riskTolerance",
    question: "How would you describe your risk tolerance in career decisions?",
    options: [
      "Very risk-averse",
      "Somewhat cautious",
      "Balanced",
      "Somewhat risk-taking",
      "Very risk-taking",
    ],
  },
  {
    id: "mentorship",
    question: "How important is mentorship to you in your career development?",
    options: [
      "Very important",
      "Somewhat important",
      "Neutral",
      "Not very important",
      "Not important at all",
    ],
  },
];

interface OnboardingProps {
  onComplete: (answers: Record<string, string>) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  console.log(answers);
  const handleAnswer = (answer: string) => {
    const currentQuestionId = questions[currentQuestion].question;
    const newAnswers = { ...answers, [currentQuestionId]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Let's get to know you better
      </Typography>
      <Typography variant="body1" gutterBottom>
        Question {currentQuestion + 1} of {questions.length}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {questions[currentQuestion].question}
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup>
          {questions[currentQuestion].options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              control={<Radio />}
              label={option}
              onClick={() => handleAnswer(option)}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default Onboarding;
