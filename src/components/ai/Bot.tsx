import { BotIcon, Sparkles, Send } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Bot() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            className="
              fixed bottom-6 right-6 z-50
              h-14 w-14
              rounded-full
              shadow-xl
              transition-all
              hover:scale-105
            "
          >
            <BotIcon className="size-7" />

            <span
              className="
                absolute right-0 top-0
                h-3.5 w-3.5
                rounded-full
                border-2 border-background
                bg-green-500
              "
            />
          </Button>
        }
      />

      <PopoverContent
        side="top"
        align="end"
        sideOffset={16}
        className="
          w-[500px]
          max-w-[calc(100vw-2rem)]
          overflow-hidden
          rounded-2xl
          border
          p-0
          shadow-2xl
        "
      >
        <PopoverHeader className="border-b bg-muted/20 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <BotIcon className="size-6" />
              </div>

              <span
                className="
                  absolute -bottom-0.5 -right-0.5
                  h-3.5 w-3.5
                  rounded-full
                  border-2 border-background
                  bg-green-500
                "
              />
            </div>

            <div className="flex-1">
              <PopoverTitle className="flex items-center gap-2 text-base">
                AI Assistant
                <Sparkles className="size-4 text-yellow-500" />
              </PopoverTitle>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Your dashboard assistant
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

              <span className="text-xs font-medium text-green-600">Online</span>
            </div>
          </div>
        </PopoverHeader>

        <div className="h-[600px] overflow-y-auto bg-background p-5">
          content
        </div>

        <div className="border-t bg-background p-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask about your dashboard..."
              className="
                h-11
                rounded-xl
                bg-muted/40
                px-4
                focus-visible:ring-1
              "
            />

            <Button size="icon" className="h-11 w-11 shrink-0 rounded-xl">
              <Send className="size-4" />
            </Button>
          </div>

          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            AI Assistant · Dashboard Support
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
