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
    if (Platform.OS === 'web') {
        return compressImageWeb(uri);
    }
    return compressImageNative(uri);
}

async function compressImageNative(uri: string): Promise<CompressedImage> {
    const ctx = ImageManipulator.manipulate(uri);

    ctx.resize({ width: MAX_DIMENSION, height: null });

    const rendered = await ctx.renderAsync();
    const result = await rendered.saveAsync({
        format: SaveFormat.WEBP,
        compress: COMPRESS_QUALITY
    });

    return {
        uri: result.uri,
        name: `image_${Date.now()}.webp`,
        type: 'image/webp'
    };
}

async function compressImageWeb(uri: string): Promise<CompressedImage> {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageBitmap = await createImageBitmap(blob);
    const width = imageBitmap.width;
    const height = imageBitmap.height;

    let targetWidth = width;
    let targetHeight = height;

    if (width > height && width > MAX_DIMENSION) {
        targetWidth = MAX_DIMENSION;
        targetHeight = Math.round((height / width) * MAX_DIMENSION);
    } else if (height > MAX_DIMENSION) {
        targetHeight = MAX_DIMENSION;
        targetWidth = Math.round((width / height) * MAX_DIMENSION);
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

    const compressedBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/webp', COMPRESS_QUALITY);
    });

    if (!compressedBlob) {
        throw new Error('Failed to compress image');
    }

    const blobUrl = URL.createObjectURL(compressedBlob);

    return {
        uri: blobUrl,
        name: 'image.webp',
        type: 'image/webp'
    };
}
