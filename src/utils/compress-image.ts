import { Platform } from 'react-native';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export interface CompressedImage {
    uri: string;
    name: string;
    type: string;
}

const MAX_DIMENSION = 1200;
const COMPRESS_QUALITY = 0.8;

export async function compressImage(uri: string): Promise<CompressedImage> {
    const ctx = ImageManipulator.manipulate(uri);

    ctx.resize({ width: MAX_DIMENSION, height: null });

    const rendered = await ctx.renderAsync();
    const result = await rendered.saveAsync({
        format: SaveFormat.WEBP,
        compress: COMPRESS_QUALITY
    });

    const fileName =
        Platform.OS === 'web'
            ? 'image.webp'
            : `image_${Date.now()}.webp`;

    return {
        uri: result.uri,
        name: fileName,
        type: 'image/webp'
    };
}
