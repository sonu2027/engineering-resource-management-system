import { useState } from "react";
import { Button } from "../components/ui/button";

function OnGoingFeature() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black/10 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-2">Feature in Progress</h2>
        <p className="text-sm text-gray-600 mb-4">
          The messaging feature is partially ready — you can now send and receive text messages as well as share images with others.
          However, I am still working on adding more controls so you can create, edit, and delete your messages and media in the future.
        </p>
        <Button className=""
          onClick={() => setShow(false)}>OK</Button>
      </div>
    </div>
  );
}

export default OnGoingFeature;
