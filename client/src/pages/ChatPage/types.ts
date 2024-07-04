import { IMessage } from "../../types/message.types";
import { IUser } from "../../types/user.types";

export type IMessageChat = Omit<IMessage, "_id" | "user" | "roomId" | "userId" | "createdAt"> & {
  id: string;
  user?: Pick<IUser, "name" | "username">;
  createdAt: string;
}
