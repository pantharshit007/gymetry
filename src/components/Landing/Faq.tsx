import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take data security very seriously. All your personal information and fitness data is stored securely.",
  },
  {
    question: "What can I expect from Gymetry?",
    answer:
      "Gymetry offers a simple platform for logging your workouts, tracking your progress over time, and visualizing your fitness journey through interactive graphs and charts.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "No, Gymetry is a web-based application. However, we will be releasing a mobile app soon, so stay tuned!",
  },
  {
    question: "Can I use Gymetry offline?",
    answer:
      "We are working on a solution to allow you to log workouts offline. Which will then sync once you're back online.",
    //     answer:
    //       "While Gymetry primarily functions with an internet connection to sync your data across devices, you can log workouts offline on our mobile app. These entries will automatically sync once you're back online.",
  },
  {
    question: "How do I log my workouts?",
    answer:
      "Click 'Enter Stats', Just choose the workout you want to log, enter the number of reps, and the weight you used. Once you're done, click on the 'Save' button to save your workout.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-14">
      <div className="container mx-auto px-4">
        <h2 className="font-heading mb-12 text-center text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="mx-auto w-full max-w-3xl"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
