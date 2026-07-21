import { launchImageLibrary } from 'react-native-image-picker';

export interface PickedImage {
    uri: string;
    name: string;
    type: string;
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

export async function pickImage(
    maxSizeBytes: number = DEFAULT_MAX_SIZE
): Promise<PickedImage> {
    const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1
    });

    if (result.didCancel) {
        throw new Error('USER_CANCELLED');
    }

    if (result.errorCode) {
        throw new Error(result.errorMessage || 'Image picker failed');
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
        throw new Error('No image selected');
    }

    if (asset.fileSize && asset.fileSize > maxSizeBytes) {
        const maxMB = Math.round(maxSizeBytes / (1024 * 1024));
        throw new Error(`MAX_SIZE_EXCEEDED:${maxMB}`);
    }

    return {
        uri: asset.uri,
        name: asset.fileName || 'image.jpg',
        type: asset.type || 'image/jpeg'
    };
}
