import React from "react";
import { Carousel, Button, Container } from "react-bootstrap";
import IntroImage1 from "../assets/intro1.png";
import IntroImage2 from "../assets/intro2.png";
import IntroImage3 from "../assets/intro3.png";
import IntroImage4 from "../assets/intro4.png";
import IntroImage5 from "../assets/intro5.png";
import IntroImage6 from "../assets/intro6.png";
import IntroImage7 from "../assets/intro7.png";
import IntroImage8 from "../assets/intro8.png";
import IntroImage9 from "../assets/intro9.png";

/**
 * CarouselPage Component
 *
 * Renders a single slide in the challenge creation intro carousel with an image, title, description, and a skip/get started button.
 */
function CarouselPage({ title, text, image, finishIntro, isLast }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <img src={image} alt="intro" style={{ height: "350px", width: "auto", objectFit: "contain" }} />
      <h2 className="mt-3">{title}</h2>
      <h6 className="w-50 text-center">{text}</h6>
      <Button variant="light" size="sm" className="mt-3" onClick={finishIntro}>
        {isLast ? "Get Started" : "Skip"}
      </Button>
    </div>
  );
}

const pages = [
  { title: "Step 1 / 8", text: "Fill the title, difficulty, topic, and status of your new challenge", image: IntroImage1 },
  { title: "Step 2 / 8", text: "Download the file templates and open in your favourite editor", image: IntroImage2 },
  { title: "Step 3 / 8", text: "You need to edit and rename 4 files", image: IntroImage3 },
  { title: "Step 4 / 8", text: "Open description_template.md and fill with the challenge description, then rename to description.md", image: IntroImage4 },
  { title: "Step 5 / 8", text: "Open solution_template.py and fill with the solution code, then rename to solution.py", image: IntroImage5 },
  { title: "Step 6 / 8", text: "Open submission_template_template.py, copy your code from solution.py. Keep the function header and replace the body with `pass`, then rename to submission_template.py", image: IntroImage6 },
  { title: "Step 7 / 8", text: "Open testcase_template.py and fill with the test cases. Typically we have 10 test cases. Then rename to testcase.py", image: IntroImage7 },
  { title: "Step 8 / 8", text: "Open the Docker Desktop software. Copy the `solution.py` file and rename as `submission.py`. Then run `python sandbox.py` or `python3 sandbox.py` to test your code. Please ensure all test cases are passed before submission", image: IntroImage8 },
  { title: "All Done!", text: "You are ready to submit your challenge to the form. Good luck!", image: IntroImage9 },
];

/**
 * NewChallengeIntro Component
 *
 * Displays a step-by-step carousel guide to help admins prepare the required files for creating a new coding challenge.
 * Includes instructions and images for editing templates and running local tests before submission.
 */
export default function NewChallengeIntro({ finishIntro }) {

  return (
    <Container fluid className="bg-dark text-light w-100 h-100">
      <Carousel controls={true} indicators={true} interval={null}>
        {pages.map((page, index) => (
          <Carousel.Item key={index}>
            <CarouselPage
              title={page.title}
              text={page.text}
              image={page.image}
              finishIntro={finishIntro}
              isLast={index === pages.length - 1}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
}