import { useState } from "react";

export default function HomeTab() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTab = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`h-screen py-8 overflow-y-auto bg-white border-l border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700`}
    ></div>
  );
}
