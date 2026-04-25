export type Testimonial = {
  id: string;
  quote: string;
  author: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Honestly thought we'd need to hire two senior people. Narendra came in for three months, fixed the deploy pipeline, sorted out the alerts that were destroying our on-call, and left us with docs we actually read. Calm, no drama.",
    author: "Aarav",
  },
  {
    id: "2",
    quote:
      "He doesn't try to sound smart. He just asks the right questions, takes a couple of days to look around, then comes back with a plan that makes sense. Cut our cloud bill by something like 30% in the first month and the savings stuck.",
    author: "Rohan",
  },
  {
    id: "3",
    quote:
      "Wanted someone who could just take the Kubernetes side off my plate. Found Narendra through a friend. Two months later I've stopped getting paged at night and my team actually trusts the upgrade process. That alone was worth it.",
    author: "Vikram",
  },
  {
    id: "4",
    quote:
      "Bit nervous hiring a freelancer for something this critical. Shouldn't have been. He's straight, tells you when something is a bad idea, and the work is solid. Would hire again without thinking twice.",
    author: "Ananya",
  },
];

export function getTestimonial(id: string) {
  return testimonials.find((t) => t.id === id);
}
