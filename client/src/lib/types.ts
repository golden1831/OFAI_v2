import { z } from "zod";
import { InfoSchema, LoginSchema, RegisterSchema } from "./schemas";

enum Provider {
   GOOGLE = 'google',
   EMAIL = 'email',
}

enum Gender {
   MALE = 'male',
   FAMELE = 'famele',
}

export type User = {
   id: string;
   email: string;
   firstName: string;
   lastName: string;
   provider: Provider;
   gender: Gender;
   image: string | null;
   createdAt: Date;
   updatedAt: Date;
};

export type InfoSchemaType = z.infer<typeof InfoSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export type AuthReturnValues = User | { error: string };


export type CreateCompanionType = {
   sex: string,
   style: string,
   ethnicity: string,
   age: number,
   eyeColor: string,
   hairStyle: string,
   hairColor: string,
   bodyType: string,
   personality: string,
   voice: string,
   occupation: string,
   Hobbies: string[],
   relationship: string,
   clothing: string,
}

export type CompanionType = {
   id: string;
   bio: string;
   firstName: string;
   lastName: string;
   image: string;
   age: string;
   bodytype: string;
   clothing: string;
   companionbiovoiceurl: string;
   companioncharacterdescription: string;
   crecreatorId: string;
   ethnicity: string;
   eyecolor: string;
   gender: string;
   haircolor: string;
   hairstyle: string;
   hobbies: string[];
   occupation: string;
   personalitydescription: string;
   personalitytitle: string;
   pictures: string[];
   relationship: string;
   style: string;
   voiceID: string;
}

export type MessageType = {
   id: string;
   image: string | null;
   videoUrl: string | null;
   companionId: string;
   content: string;
   contenttype: string | null;
   createdAt: string
   role: string;
   voicecontenturl: string | null;
   senderName: string;
   senderImage: string | null;
}

export type chatRoomType = {
   senderId: string;
   senderFirstName: string;
   senderLastName: string;
   senderImage: string;
   lastMessage: {
      content: string;
      createdAt: string;
      contentType: string;
   }
}