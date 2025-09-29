import { useEffect } from "react";

function About() {
  useEffect(() => {
    document.title = "About - Sosio";
  }, []);

  return (
    <div>
      <h1 className="text-white text-4xl mb-4">About Us</h1>
      <p className="text-white text-lg">
        Welcome to Sosio! This is the about page.
      </p>
    </div>
  );
}

export default About;
