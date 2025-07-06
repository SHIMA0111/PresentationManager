import { Alert } from "@chakra-ui/react";

interface UnassignedAlertProps {
    count: number;
}

export default function UnassignedAlert({ count }: UnassignedAlertProps) {
    if (count === 0) {
        return null;
    }

    return (
        <Alert.Root status="neutral" mb={6} borderRadius="md">
            <Alert.Indicator h={4} w={4} />
            <Alert.Title>
                {count}件のアサインされていない発表があります。
            </Alert.Title>
        </Alert.Root>
    );
} 