import { title } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { Accordion, AccordionItem } from '@heroui/react';

const faqsList = [
  {
    question: '📝 Do I need to create an account to use this platform?',
    answer:
      'No — you can create a coding lab and start coding instantly without any signup or login.',
  },
  {
    question: '💸 Is it really free to use?',
    answer:
      'Yes! It’s 100% free for everyone. No hidden fees, no trials — just open a lab and start coding.',
  },
  {
    question: '🔗 How do I invite others to collaborate in my lab?',
    answer:
      'Every lab has a unique private link. Share this link with your students or team members — and they can join your lab instantly.',
  },
  {
    question: '📥 Can I download my code?',
    answer:
      'Absolutely. You can download your code as a .txt file anytime during your session.',
  },
  {
    question: '💻 What programming languages are supported?',
    answer:
      'We currently support popular languages like NodeJS, Python, Java, C++, C#, SQL, Go, and Bash. New languages are being added frequently.',
  },
  {
    question: '⚙️ Can I run or compile my code here?',
    answer:
      'Yes, online compilation is supported for selected languages. Give it a try!',
  },
];

export default function FaqPage() {
  return (
    <DefaultLayout>
      <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
        <div className='inline-block text-center justify-center w-full'>
          <h1 className={title()}>FAQ</h1>
          <div>
            <Accordion selectionMode='multiple'>
              {faqsList.map((faq, index) => (
                <AccordionItem
                  key={index}
                  aria-label={`Accordion ${index + 1}`}
                  title={faq.question}>
                  {faq.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
