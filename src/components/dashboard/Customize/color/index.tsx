import ColorSelector from "./Selector";

// Parent Component: ColorSelectors
const ColorSelectors = () => {
  const colorOptions = [
    { label: "Container Background", name: "containerBackground" },
    { label: "Border Color", name: "borderColor" },
    { label: "Primary Text Color", name: "primaryTextColor" },
    { label: "Primary Background", name: "primaryBackground" },
    { label: "Bot Message Text Color", name: "botMessageTextColor" },
    { label: "Bot Message Background", name: "botMessageBackground" },
    {
      label: "Suggested Question Text Color",
      name: "suggestedQuestionTextColor",
    },
    {
      label: "Suggested Question Background",
      name: "suggestedQuestionBackground",
    },
    { label: "Text Color", name: "textColor" },
    { label: "Text Background", name: "textBackground" },
    { label: "Placeholder Text Color", name: "placeholderTextColor" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {colorOptions.map((option, i) => (
        <ColorSelector key={i} element={option} />
      ))}
    </div>
  );
};

export default ColorSelectors;
