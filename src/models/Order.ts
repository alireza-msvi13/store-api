import { Schema, Model, model } from "mongoose";
import { IOrder } from "../interfaces/order";
import { changeStatusValidator, createOrderValidator } from "../modules/order/order.validator";


interface IChangeStatus { id: string, status: "IN_PROGRESS" | "DISPATCHED" | "COMPLETED" }

interface IOrderModel extends Model<IOrder> {
    orderValidation(body: IOrder): Promise<any>;
    changeStatusValidation(body: IChangeStatus): Promise<any>;
}

const orderSchema = new Schema<IOrder>({
    message: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            count: {
                type: Number,
                required: true,
                min: [1, 'Count must be at least 1']
            },
            color: {
                type: String
            }
        }
    ],
    status: {
        type: String,
        enum: ["IN_PROGRESS", "DISPATCHED", "COMPLETED"],
        default: "IN_PROGRESS",
        required: true

    }
}, {
    timestamps: true
});


//* add yup validation method to mongoose statics
orderSchema.statics.orderValidation = function (body: IOrder) {
    return createOrderValidator.validate(body);
};
orderSchema.statics.changeStatusValidation = function (body: IChangeStatus) {
    return changeStatusValidator.validate(body);
};

const orderModel: IOrderModel = model<IOrder, IOrderModel>('Order', orderSchema);

export default orderModel;