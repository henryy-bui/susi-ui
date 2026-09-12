import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@susi-ui/react';

const FAQ = [
  { value: 'what', question: 'What is headless UI?', answer: 'Behaviour and accessibility with no styling.' },
  { value: 'why', question: 'Why use it?', answer: 'Every project wants a different look from the same mechanics.' },
  { value: 'how', question: 'How do I style it?', answer: 'Target the data-state attributes with your own CSS.' },
];

export default function AccordionDemo() {
  return (
    <Accordion className="susi-accordion" type="single" defaultValue="what" collapsible style={{ width: '100%' }}>
      {FAQ.map((item) => (
        <AccordionItem className="susi-accordion-item" key={item.value} value={item.value}>
          <AccordionHeader>
            <AccordionTrigger className="susi-accordion-trigger">{item.question}</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="susi-accordion-content">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
