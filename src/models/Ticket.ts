import { Schema, Model, model } from "mongoose";
import { ITicket } from "../interfaces/ticket";
import { createTicketValidator, getAnswerValidator, setAnswerValidator } from "../modules/ticket/ticket.validator";

interface ITicketModel extends Model<ITicket> {
  createValidation(body: ITicket): Promise<any>;
  getAnswerValidation(body: { id: string }): Promise<any>;
  setAnswerValidation(body: { ticketId: string, body: string }): Promise<any>;
}



const ticketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    hasAnswer: {
      type: Boolean,
      default: false
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },
    isAnswer: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

//* add yup validation method to mongoose statics
ticketSchema.statics.createValidation = function (body: ITicket) {
  return createTicketValidator.validate(body, { abortEarly: false });
};
ticketSchema.statics.getAnswerValidation = function (body: { id: string }) {
  return getAnswerValidator.validate(body, { abortEarly: false });
};
ticketSchema.statics.setAnswerValidation = function (body: { ticketId: string, body: string }) {
  return setAnswerValidator.validate(body, { abortEarly: false });
};


const ticketModel: ITicketModel = model<ITicket, ITicketModel>("Ticket", ticketSchema);

export { ticketModel };
