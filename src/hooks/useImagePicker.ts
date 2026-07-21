import { useCallback, useState } from 'react';
import { pickImage, type PickedImage } from '@/src/utils/pick-image';

interface UseImagePickerOptions {
    maxSizeBytes?: number;
}

interface UseImagePickerReturn {
    pickAndGetFile: () => Promise<PickedImage | null>;
    isPicking: boolean;
    pickError: string | null;
}

export function useImagePicker(
    options: UseImagePickerOptions = {}
): UseImagePickerReturn {
    const [isPicking, setIsPicking] = useState(false);
    const [pickError, setPickError] = useState<string | null>(null);

    const pickAndGetFile = useCallback(async (): Promise<PickedImage | null> => {
        setIsPicking(true);
        setPickError(null);

        try {
            const image = await pickImage(options.maxSizeBytes);
            return image;
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Unknown error';
            if (message === 'USER_CANCELLED') {
                return null;
            }
            setPickError(message);
            return null;
        } finally {
            setIsPicking(false);
        }
    }, [options.maxSizeBytes]);

    return { pickAndGetFile, isPicking, pickError };
}
