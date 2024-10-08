import mongoose from "mongoose";
import request from 'supertest';
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { OrderStatus } from "@sahhhalltickets/common";


it("returns an error if the ticket does not exists", async () => {
  const ticketId = new mongoose.Types.ObjectId()._id;

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});


it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});
// it("return an error if the ticket is already reserved", async () => {
//   const ticket = Ticket.build({
//     title: "Concert",
//     price: 20,
//     id: new mongoose.Types.ObjectId().toHexString(),
//   });

//   await ticket.save();
//   const order = Order.build({
//     ticket,
//     userId: "sdfsghfgd",
//     status: OrderStatus.Created,
//     expiresAt: new Date(),
//   });

//   await order.save();

//   await request(app)
//     .post("/api/orders")
//     .set("Cookie", global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(400);
// });



it("emit an order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});