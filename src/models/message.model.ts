import { model, Schema } from "mongoose";
import { IMessage } from "../utils/interfaces";

const messageSchema = new Schema<IMessage>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
       default: null,
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        default: null,
    },
    content: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Message = model<IMessage>('Message', messageSchema);
export default Message;