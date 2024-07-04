import { twMerge } from "tailwind-merge";

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const ButtonPrimary = (props: ButtonProps) => {
    return (
        <button
            {...props}
            className={twMerge(`bg-main-gradient text-white w-full py-3 px-5 rounded-md font-semibold cursor-pointer`,  `${props.className}`)}
        >
            {props.children}
        </button>
    );
}