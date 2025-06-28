import { title } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/react';

const featuresList = [
  {
    title: '⚡ Create Coding Labs Instantly',
    description:
      'No signup or login required. Start coding right away in your own private lab.',
  },
  {
    title: '🤝 Collaborative Editing',
    description:
      'Invite friends, teammates, or collaborators via a shareable link and code together in real-time.',
  },
  {
    title: '🖥️ Multi-Language Support',
    description:
      'Code in multiple programming languages with syntax highlighting and clean editor features.',
  },
  {
    title: '📥 Download Code Anytime',
    description:
      'Download your code instantly with a single click in .txt or .zip format — no restrictions.',
  },
  {
    title: '🔒 Private Lab Links',
    description:
      'Each coding lab has a unique, private link. Only people with the link can join your session.',
  },
  {
    title: '🔄 Code Synchronization',
    description:
      'Real-time, instant code syncing between all active members in a lab.',
  },
  {
    title: '💸 Zero Cost, Fully Free',
    description:
      'No subscriptions, no fees — completely free to use for individuals, students, teams, and open-source enthusiasts.',
  },
  {
    title: '📝 Clean, Distraction-Free Editor',
    description:
      'Minimalistic, easy-to-use interface for coding without clutter.',
  }
];


export default function FeaturePage() {
  return (
    <DefaultLayout>
      <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
        <div className='inline-block text-center justify-center'>
          <h1 className={title()}>Features</h1>
          <div className='gap-2 grid grid-cols-2 sm:grid-cols-4 mt-16'>
            {featuresList.map((feature, _) => (
              <Card className='max-w w-100' isPressable isHoverable>
                <CardHeader className='flex gap-3'>
                  <div className='flex flex-col'>
                    <p className='text-md'>{feature.title}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p>{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
