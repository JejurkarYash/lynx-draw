"use client";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

export const Button = ({ children, text, onClick, props }: { children: ReactNode, text: string, onClick: () => void }) => {
  return <button onClick={onClick} className=" bg-blue-300 h-8 w-16 rounded-lg cursor-pointer ">
    {children}
  </button>
};

