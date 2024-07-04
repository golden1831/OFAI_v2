import { FieldErrors, UseFormRegister } from "react-hook-form";
import { cn } from "../../lib/utils";
import { InfoSchemaType } from "../../lib/types";

type idType = "firstName" | "lastName";

interface InputProps {
   id: idType;
   placeholder: string;
   type?: string
   disabled?: boolean;
   register: UseFormRegister<InfoSchemaType>;
   errors: FieldErrors
}

const RegisterFormInput: React.FC<InputProps> = ({
   id,
   placeholder,
   type = "text",
   disabled,
   register,
   errors
}) => {

   return (
      <label
         className="flex flex-col relative text-sm font-medium leading-none"
      >
         <input
            id={id}
            type={type}
            disabled={disabled}
            {...register(id)}
            placeholder={placeholder}
            className={cn(
               "flex h-10 w-full border border-input bg-[#09090b] disabled:cursor-not-allowed disabled:opacity-50 py-6 outline-none font-medium text-base border-[#515164] text-[#FAFAFA] focus:border-[#9c9cac] rounded-lg px-4 ",
               errors[id] && "border-[#F61976]/70 focus:border-[#F61976]/70"
            )}
         />
         {errors[id] && (
            <span className="pl-2 mt-1 text-[#F61976]/70 text-sm">
               {errors[id]?.message as string}
            </span>
         )}
      </label>
   )
}

export default RegisterFormInput;