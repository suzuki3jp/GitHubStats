"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useCookies } from "react-cookie";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/presentation/common/shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/common/shadcn/popover";
import { useT } from "@/presentation/hooks/t/client";
import {
  COOKIE_NAME,
  supportedLangs,
} from "@/presentation/localization/settings";

import type { WithLang } from "@/typings";
import { Check, Globe } from "lucide-react";
import { cn } from "../common/cn";
import { Button } from "../common/shadcn/button";

interface LanguageSwitcherProps extends WithLang {}

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  return (
    <Suspense>
      <LS {...props} />
    </Suspense>
  );
}

function LS({ lang }: LanguageSwitcherProps) {
  const { t } = useT(lang, "header");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(lang);
  const [_, setCookie] = useCookies();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const languages: Record<string, string> = {};
  for (const lang of supportedLangs) {
    languages[lang] = t(`language.${lang}`);
  }

  function handleChange(value: string) {
    const lang = Object.entries(languages).find(([, v]) => v === value);
    if (!lang || !lang[0]) throw new Error("Invalid language selection");
    const [key, _] = lang;

    setCurrent(key);
    setOpen(false);
    setCookie(COOKIE_NAME, key);

    const pathParts = pathname.split("/");
    pathParts[1] = key;

    router.push(`${pathParts.join("/")}?${searchParams.toString()}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="ghost"
          aria-expanded={open}
          className="flex h-9 w-[110px] items-center justify-between gap-2"
        >
          <Globe className="h-4 w-4" />
          {t(`language.${current}`)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t("search-language")} />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {Object.entries(languages).map(([key, value]) => (
                <CommandItem key={key} value={value} onSelect={handleChange}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      key === current ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
