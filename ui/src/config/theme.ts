import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
    theme: {
        keyframes: {
            progress: {
                "0%": {
                    transform: "translateX(-100%)"
                },
                "50%": {
                    transform: "translateX(0%)"
                },
                "100%": {
                    transform: "translateX(100%)"
                },
            }
        }
    }
})

export const system = createSystem(defaultConfig, config)