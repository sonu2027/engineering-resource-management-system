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
          Currently I am working on this messaging or chat feature, but you can still explore some features which have been completed.
        </p>
        <Button className=""
          onClick={() => setShow(false)}>OK</Button>
      </div>
    </div>
  );
}

export default OnGoingFeature;
