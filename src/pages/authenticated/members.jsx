import { useEffect } from "react";

function Members() {
  useEffect(() => {
    document.title = "Members - Sosio";
  }, []);

  return (
    <div>
      <h1 className="text-white text-4xl mb-4">Members Area</h1>
      <p className="text-white text-lg">
        Welcome to the members area! This page is only accessible to logged-in users.
      </p>
    </div>
  );
}

export default Members;
