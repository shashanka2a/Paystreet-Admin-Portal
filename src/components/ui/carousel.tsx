"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "./button";
import { cn } from "./utils";

function Carousel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="carousel" className={cn("relative", className)} {...props} />
  );
}

function CarouselContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="carousel-content"
      className={cn("-ml-4", className)}
      {...props}
    />
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="carousel-item" className={cn("pl-4", className)} {...props} />
  );
}

function CarouselPrevious({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="carousel-previous"
      variant="outline"
      size="icon"
      className={cn("absolute left-2 top-1/2 -translate-y-1/2", className)}
      {...props}
    >
      <ArrowLeft className="size-4" />
      <span className="sr-only">Previous</span>
    </Button>
  );
}

function CarouselNext({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="carousel-next"
      variant="outline"
      size="icon"
      className={cn("absolute right-2 top-1/2 -translate-y-1/2", className)}
      {...props}
    >
      <ArrowRight className="size-4" />
      <span className="sr-only">Next</span>
    </Button>
  );
}

export type CarouselApi = unknown;
export type CarouselOptions = unknown;
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
