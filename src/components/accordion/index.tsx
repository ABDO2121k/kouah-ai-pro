import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionType {
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const faqs: AccordionType[] = [
    {
      question: "What is Kouah AI?",
      answer:
        "Kouah AI is an advanced platform that integrates artificial intelligence to streamline business operations, automate tasks, and enhance customer interactions.",
    },
    {
      question: "How does Kouah AI help with content creation?",
      answer:
        "Kouah AI generates high-quality content such as blog posts and product descriptions based on your inputs, saving time and effort.",
    },
    {
      question: "Which platforms does Kouah AI integrate with?",
      answer:
        "Kouah AI integrates seamlessly with platforms like WooCommerce, Shopify, and WordPress, enhancing e-commerce and content management capabilities.",
    },
    {
      question: "Can Kouah AI automate customer support?",
      answer:
        "Yes, Kouah AI uses natural language processing to automate customer inquiries, providing 24/7 support while freeing up your team for complex tasks.",
    },
    {
      question: "How does Kouah AI provide real-time data insights?",
      answer:
        "Kouah AI analyzes vast data sets in real-time, delivering actionable insights that help businesses make informed decisions and improve performance.",
    },
    {
      question: "Is there an API available for developers?",
      answer:
        "Yes, Kouah AI offers a powerful and flexible API for developers to integrate AI capabilities into their applications and workflows.",
    },
    {
      question: "Does Kouah AI support personalized recommendations?",
      answer:
        "Kouah AI’s recommendation engine suggests products or content based on user preferences, helping increase engagement and conversions.",
    },
    // {
    //   question: "Can I use Kouah AI for voice and chatbot functions?",
    //   answer:
    //     "Absolutely, Kouah AI enables voice and chatbot interactions, allowing businesses to create human-like conversations with users across apps or websites.",
    // },
    {
      question: "How does Kouah AI benefit e-commerce businesses?",
      answer:
        "Kouah AI automates customer service, personalizes shopping experiences, and provides real-time marketing insights to boost sales and customer satisfaction.",
    },
    {
      question: "Is Kouah AI suitable for non-technical users?",
      answer:
        "Yes, Kouah AI is designed for both technical and non-technical users, offering intuitive tools for businesses and powerful APIs for developers.",
    },
  ];

  return (
    <Accordion
      type="single"
      collapsible
      className="w-[80%] mx-auto mt-5 text-lg text-start"
    >
      {faqs.map((e, i) => (
        <AccordionItem value={`item-${i}`} key={i}>
          <AccordionTrigger className="text-left p-3 border-b border-neutral-300">
            {e.question}
          </AccordionTrigger>
          <AccordionContent className="text-left p-4">
            {e.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
