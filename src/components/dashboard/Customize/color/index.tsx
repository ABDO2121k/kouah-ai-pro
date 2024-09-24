import ColorSelector from "./Selector";

// Parent Component: ColorSelectors
const ColorSelectors = () => {
  const colorOptions = [
    "Container Background",
    "Border Color",
    "Primary Text Color",
    "Primary Background",
    "Bot Message Text Color",
    "Bot Message Background",
    "Suggested Question Text Color",
    "Suggested Question Background",
    "Text Color",
    "Text Background",
    "Placeholder Text Color",
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {colorOptions.map((option) => (
        <ColorSelector key={option} title={option} />
      ))}
    </div>
  );
};

export default ColorSelectors;
