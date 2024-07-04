
import React from "react";

export const ProfileImage = ({ src, className, onClick, children }: { src: string, className: string, onClick: () => void, children: React.ReactNode}) => {
    return (
        <div
          className={`border-[4px] cursor-pointer relative size-24 rounded-full bg-cover bg-no-repeat bg-cente border-white ${className}`}
          style={
            {
              backgroundImage: `url(${src})`,
            }
          }
          onClick={onClick}
        >
          {children}
        </div>
    );
}