import { model, Schema } from "mongoose";
import { IRoom } from "../utils/interfaces";

const roomSchema = new Schema<IRoom>({
    name: {
        type: String,
        required: true
    },
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

}, { timestamps: true });

const Room = model<IRoom>('Room', roomSchema);
export default Room;