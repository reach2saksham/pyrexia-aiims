import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How can I register for the fest?',
      answer:
        'You can register online through our official website or app. On-spot registration will also be available at the venue.'
,
    },
    {
        question: 'Is there an entry fee for the fest?',
        answer:
          'Yes, an entry pass is required. The pricing and package details are mentioned on the Tickets page.',
      },
      {
        question: 'Where can I buy tickets or passes?',
        answer:
          'Tickets can be purchased online via our website or through authorized campus representatives.',
      },
      {
        question: ' Is there a refund policy for tickets?',
        answer:
          'No, tickets are non-refundable once purchased.',
      },
      {
        question: 'How do I stay updated on PYREXIA 5.0 announcements?',
        answer:
          'Stay updated on all PYREXIA 5.0 announcements by following us on our official social media handle on instagram, @pyrexiaaiims and regularly checking the event website. We’ll be posting updates, schedules, and important information leading up to and during the festival. You can also subscribe to our newsletter for the latest news and event highlights.',
      },
      {
        question: 'Who can attend the fest?',
        answer:
          'The fest is open to medical students only.',
      },
  ];

  return (
    <div className="max-w-2xl mx-auto py-16 text-white">
      <h1 className="text-4xl font-semibold shackleton-text text-center mb-6">FAQ</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300">
            <button
              className="w-full text-left py-4 text-lg font-medium flex justify-between items-center focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="text-xl">
                {activeIndex === index ? '-' : '+'}
              </span>
            </button>
            {activeIndex === index && (
              <div className="py-2 text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
