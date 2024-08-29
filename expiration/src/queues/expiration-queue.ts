import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expirition-complete-event";
import { natsWrapper } from "../nats-wrapper";

interface payload {
  orderId: string;
}

const expirationQueue = new Queue<payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// the job not actaul  data it is an obj wraps up on data so data is one of the property
// on there

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
