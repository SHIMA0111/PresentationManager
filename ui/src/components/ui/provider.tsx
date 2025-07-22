"use client"

import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { system } from "@/config/theme"
import { SessionProvider } from "next-auth/react"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <SessionProvider>
        <ColorModeProvider {...props} />
      </SessionProvider>
    </ChakraProvider>
  )
}
