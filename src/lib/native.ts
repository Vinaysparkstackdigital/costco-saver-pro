import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";

const nativeAuthScheme = "com.sparkstack.costcosaver";
const nativeAuthCallbackUrl = `${nativeAuthScheme}://auth/callback`;

export const isNativePlatform = () => Capacitor.isNativePlatform();

export const getAuthRedirectUrl = () => {
    if (isNativePlatform()) {
        return nativeAuthCallbackUrl;
    }

    return `${window.location.origin}/`;
};

const getSessionParamsFromUrl = (url: URL) => {
    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
    const searchParams = url.searchParams;

    return {
        accessToken: hashParams.get("access_token") ?? searchParams.get("access_token"),
        refreshToken: hashParams.get("refresh_token") ?? searchParams.get("refresh_token"),
        code: searchParams.get("code") ?? hashParams.get("code"),
    };
};

export const completeNativeAuthSession = async (callbackUrl: string) => {
    if (!callbackUrl.startsWith(`${nativeAuthScheme}://`)) {
        return false;
    }

    try {
        const parsedUrl = new URL(callbackUrl);
        const { accessToken, refreshToken, code } = getSessionParamsFromUrl(parsedUrl);

        if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            if (error) {
                throw error;
            }
        } else if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
                throw error;
            }
        } else {
            return false;
        }

        await Browser.close().catch(() => undefined);
        return true;
    } catch (error) {
        console.error("Failed to complete native auth session", error);
        return false;
    }
};

export const registerNativeAuthCallbackListener = async () => {
    if (!isNativePlatform()) {
        return () => undefined;
    }

    const handleAuthUrl = async (url?: string) => {
        if (!url) {
            return;
        }

        await completeNativeAuthSession(url);
    };

    const launchUrl = await App.getLaunchUrl();
    await handleAuthUrl(launchUrl?.url);

    const listener: PluginListenerHandle = await App.addListener("appUrlOpen", (event) => {
        void handleAuthUrl(event.url);
    });

    return () => {
        void listener.remove();
    };
};

export const captureReceiptImage = async (source: CameraSource) => {
    const photo = await Camera.getPhoto({
        source,
        resultType: CameraResultType.Uri,
        quality: 85,
        correctOrientation: true,
    });

    if (!photo.webPath) {
        throw new Error("No image was returned from the device camera.");
    }

    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    const contentType = blob.type || "image/jpeg";
    const fileExtension = contentType.split("/")[1] || "jpeg";

    return new File([blob], `receipt-${Date.now()}.${fileExtension}`, {
        type: contentType,
    });
};

export { CameraSource };
