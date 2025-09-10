"use client";
import React from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

// Define proper types for the Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
}

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: ButtonProps) {
  return (
    <Component
      className={cn(
        "relative h-16 w-40 overflow-hidden bg-transparent p-[1px] text-xl",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx={30}>
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

// Update the MovingBorderProps interface to include SVG attributes
interface MovingBorderProps extends React.SVGAttributes<SVGSVGElement> {
  children: React.ReactNode;
  duration?: number;
  rx?: number;
  className?: string;
  containerClassName?: string;
  pathLength?: number;
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx = 30,
  className,
  containerClassName,
  pathLength = 2,
  ...props
}: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    // Remove unused length variable and directly use getTotalLength in progress calculation
    progress.set((time / duration) % 1);
  });

  return (
    <div className={cn("relative", containerClassName)}>
      <motion.div
        className={cn(
          "absolute inset-0 rounded-lg",
          className
        )}
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          {...props} // Now props is properly defined
        >
          <motion.rect
            ref={pathRef}
            width="100"
            height="100"
            rx={Number(rx)}
            pathLength={pathLength}
            className="motion-reduce:animate-none"
            style={{
              pathOffset: progress
            }}
          />
        </svg>
      </motion.div>
      {children}
    </div>
  );
};
