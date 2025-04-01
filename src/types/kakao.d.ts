interface KakaoStatic {
  init: (apiKey: string) => void;
  isInitialized: () => boolean;
  Auth: {
    authorize: (params: { redirectUri: string; response_type: string }) => void;
  };
  API: {
    request: (params: any) => Promise<any>;
  };
}

interface Window {
  Kakao: KakaoStatic;
}
