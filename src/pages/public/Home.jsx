import { useEffect } from "react";

function Home() {
  useEffect(() => {
    document.title = "Sosio";  // ✅ updates tab title
  }, []);

  return (
  <h1 className="text-white text-4xl">Hello World</h1>


); }

export default Home;
